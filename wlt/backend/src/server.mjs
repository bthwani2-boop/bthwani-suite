// WLT-DSH HTTP Server — Node.js ESM + built-in SQLite persistence
// Boundary: DSH-scoped WLT operations only. No P2P/gift/subscriptions/top-up outside DSH orders.
// Runs on port 8090. DSH backend calls these endpoints as the WLT payment bridge.
// Persistence: node:sqlite (Node 22+). State survives restarts.

import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.WLT_DATA_DIR ?? join(__dirname, '..', '.data');
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = join(DATA_DIR, 'wlt_dsh.db');
const PORT = Number(process.env.WLT_PORT ?? 8090);
const DEFAULT_CURRENCY = 'YER';

// ──────────────────────────────────────────────────────────────────────
// Schema + Init
// ──────────────────────────────────────────────────────────────────────

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS wlt_wallets (
    client_id TEXT PRIMARY KEY,
    balance_minor_units INTEGER NOT NULL DEFAULT 2500000,
    currency TEXT NOT NULL DEFAULT 'YER',
    linked INTEGER NOT NULL DEFAULT 1,
    frozen_minor_units INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    client_id TEXT,
    store_id TEXT,
    partner_id TEXT,
    captain_id TEXT,
    field_agent_id TEXT,
    amount_minor_units INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'YER',
    payment_method TEXT NOT NULL DEFAULT 'wallet',
    dsh_checkout_intent_id TEXT,
    status TEXT NOT NULL DEFAULT 'captured',
    callback_target TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_refunds (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    client_id TEXT,
    store_id TEXT,
    amount_minor_units INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'YER',
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed',
    callback_target TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_settlements (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    owner_kind TEXT NOT NULL,
    order_ids TEXT NOT NULL DEFAULT '[]',
    net_payable_minor_units INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'YER',
    status TEXT NOT NULL DEFAULT 'ready_for_payout',
    created_at TEXT NOT NULL,
    UNIQUE(owner_id, owner_kind)
  );

  CREATE TABLE IF NOT EXISTS wlt_cod_liabilities (
    id TEXT PRIMARY KEY,
    captain_id TEXT NOT NULL,
    order_id TEXT NOT NULL,
    amount_minor_units INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'YER',
    status TEXT NOT NULL DEFAULT 'outstanding',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_ledger_entries (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    order_id TEXT,
    actor_id TEXT NOT NULL,
    actor_kind TEXT NOT NULL,
    debit_minor_units INTEGER NOT NULL DEFAULT 0,
    credit_minor_units INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'YER',
    status TEXT NOT NULL DEFAULT 'posted',
    reference_id TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_reconciliation_runs (
    id TEXT PRIMARY KEY,
    idempotency_key TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'passed',
    entry_count INTEGER NOT NULL DEFAULT 0,
    total_debit INTEGER NOT NULL DEFAULT 0,
    total_credit INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_payout_decisions (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    owner_kind TEXT NOT NULL,
    settlement_cycle_id TEXT NOT NULL,
    amount_minor_units INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'YER',
    status TEXT NOT NULL DEFAULT 'approved',
    idempotency_key TEXT UNIQUE,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_callback_events (
    id TEXT PRIMARY KEY,
    idempotency_key TEXT,
    target TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_idempotency (
    key TEXT PRIMARY KEY,
    response TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wlt_finance_close (
    id TEXT PRIMARY KEY,
    business_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    reconciliation_run_id TEXT,
    closed_at TEXT,
    created_at TEXT NOT NULL
  );
`);

// Seed demo wallet if absent
const initNow = new Date().toISOString();
const demoWallet = db.prepare('SELECT client_id FROM wlt_wallets WHERE client_id = ?').get('client-demo');
if (!demoWallet) {
  db.prepare('INSERT INTO wlt_wallets (client_id, balance_minor_units, currency, linked, frozen_minor_units, updated_at) VALUES (?,?,?,?,?,?)')
    .run('client-demo', 2500000, DEFAULT_CURRENCY, 1, 0, initNow);
}

// ──────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────

let seq = db.prepare('SELECT MAX(CAST(SUBSTR(id, INSTR(id,\'-\')+1) AS INTEGER)) as n FROM wlt_payments').get()?.n ?? 0;
seq = Math.max(seq,
  db.prepare('SELECT MAX(CAST(SUBSTR(id, INSTR(id,\'-\')+1) AS INTEGER)) as n FROM wlt_ledger_entries').get()?.n ?? 0,
  db.prepare('SELECT MAX(CAST(SUBSTR(id, INSTR(id,\'-\')+1) AS INTEGER)) as n FROM wlt_callback_events').get()?.n ?? 0
);

function nextId(prefix) {
  seq = (seq ?? 0) + 1;
  return `${prefix}-${String(seq).padStart(6, '0')}`;
}

function now() {
  return new Date().toISOString();
}

function postLedger(kind, orderId, actorId, actorKind, debitMinorUnits, creditMinorUnits, currency, referenceId) {
  const id = nextId('WLT-DSH-LED');
  db.prepare(`INSERT INTO wlt_ledger_entries
    (id, kind, order_id, actor_id, actor_kind, debit_minor_units, credit_minor_units, currency, status, reference_id, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
    .run(id, kind, orderId ?? null, actorId, actorKind, debitMinorUnits, creditMinorUnits, currency, 'posted', referenceId ?? null, now());
  return id;
}

function createCallback(target, idempotencyKey, payload) {
  const id = nextId('WLT-DSH-EVT');
  db.prepare('INSERT INTO wlt_callback_events (id, idempotency_key, target, payload, created_at) VALUES (?,?,?,?,?)')
    .run(id, idempotencyKey ?? null, target, JSON.stringify(payload), now());
  return id;
}

function upsertSettlement(ownerId, ownerKind, orderId, amountMinorUnits, currency) {
  const existing = db.prepare('SELECT * FROM wlt_settlements WHERE owner_id=? AND owner_kind=?').get(ownerId, ownerKind);
  if (existing) {
    const orderIds = JSON.parse(existing.order_ids);
    orderIds.push(orderId);
    db.prepare('UPDATE wlt_settlements SET order_ids=?, net_payable_minor_units=? WHERE owner_id=? AND owner_kind=?')
      .run(JSON.stringify(orderIds), existing.net_payable_minor_units + amountMinorUnits, ownerId, ownerKind);
  } else {
    const id = nextId('WLT-DSH-SET');
    db.prepare(`INSERT INTO wlt_settlements (id, owner_id, owner_kind, order_ids, net_payable_minor_units, currency, status, created_at)
      VALUES (?,?,?,?,?,?,?,?)`)
      .run(id, ownerId, ownerKind, JSON.stringify([orderId]), amountMinorUnits, currency, 'ready_for_payout', now());
  }
}

// ──────────────────────────────────────────────────────────────────────
// Route Handlers
// ──────────────────────────────────────────────────────────────────────

function getClientWalletSummary(clientId = 'client-demo') {
  const wallet = db.prepare('SELECT * FROM wlt_wallets WHERE client_id=?').get(clientId);
  if (!wallet) {
    // Auto-create wallet for new clients
    const t = now();
    db.prepare('INSERT INTO wlt_wallets (client_id, balance_minor_units, currency, linked, frozen_minor_units, updated_at) VALUES (?,?,?,?,?,?)')
      .run(clientId, 0, DEFAULT_CURRENCY, 0, 0, t);
    return { balanceMinorUnits: 0, currency: DEFAULT_CURRENCY, linked: false, frozenMinorUnits: 0, updatedAt: t };
  }
  return {
    balanceMinorUnits: wallet.balance_minor_units,
    currency: wallet.currency,
    linked: wallet.linked === 1,
    frozenMinorUnits: wallet.frozen_minor_units,
    updatedAt: wallet.updated_at,
  };
}

function createPaymentSession(req, idempotencyKey) {
  if (idempotencyKey) {
    const cached = db.prepare('SELECT response FROM wlt_idempotency WHERE key=?').get(idempotencyKey);
    if (cached) return JSON.parse(cached.response);
  }

  const wallet = db.prepare('SELECT * FROM wlt_wallets WHERE client_id=?').get(req.clientId ?? 'client-demo');
  const paymentMethod = req.paymentMethod ?? 'wallet';
  let status = 'captured';

  if (paymentMethod === 'wallet') {
    if (!wallet || !wallet.linked) {
      status = 'failed';
    } else if (wallet.balance_minor_units < req.amountMinorUnits) {
      status = 'failed';
    }
  }

  const id = nextId('WLT-DSH-PAY');
  const t = now();
  const callbackTarget = status === 'captured' ? 'dsh.payment-callback' : null;

  db.prepare(`INSERT INTO wlt_payments
    (id, order_id, client_id, store_id, partner_id, captain_id, field_agent_id, amount_minor_units, currency, payment_method, dsh_checkout_intent_id, status, callback_target, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(id, req.orderId, req.clientId ?? null, req.storeId ?? null, req.partnerId ?? null, req.captainId ?? null, req.fieldAgentId ?? null,
      req.amountMinorUnits, req.currency ?? DEFAULT_CURRENCY, paymentMethod, req.dshCheckoutIntentId ?? null, status, callbackTarget, t);

  if (status === 'captured' && paymentMethod === 'wallet' && wallet) {
    db.prepare('UPDATE wlt_wallets SET balance_minor_units=?, updated_at=? WHERE client_id=?')
      .run(wallet.balance_minor_units - req.amountMinorUnits, t, req.clientId ?? 'client-demo');

    // Post ledger entries
    const payRef = postLedger('payment', req.orderId, req.clientId ?? 'client-demo', 'client', req.amountMinorUnits, 0, req.currency ?? DEFAULT_CURRENCY, id);

    // Partner settlement share (85% after platform fee)
    if (req.partnerId) {
      const partnerShare = Math.floor(req.amountMinorUnits * 0.85);
      upsertSettlement(req.partnerId, 'partner', req.orderId, partnerShare, req.currency ?? DEFAULT_CURRENCY);
      postLedger('settlement', req.orderId, req.partnerId, 'partner', 0, partnerShare, req.currency ?? DEFAULT_CURRENCY, id);
    }
    // Captain COD handling (COD orders create liability)
    if (req.captainId && paymentMethod === 'cod') {
      const codId = nextId('WLT-DSH-COD');
      db.prepare(`INSERT INTO wlt_cod_liabilities (id, captain_id, order_id, amount_minor_units, currency, status, created_at) VALUES (?,?,?,?,?,?,?)`)
        .run(codId, req.captainId, req.orderId, req.amountMinorUnits, req.currency ?? DEFAULT_CURRENCY, 'outstanding', t);
      postLedger('cod_liability', req.orderId, req.captainId, 'captain', 0, req.amountMinorUnits, req.currency ?? DEFAULT_CURRENCY, codId);
    }
    // Captain earnings share
    if (req.captainId) {
      const captainShare = Math.floor(req.amountMinorUnits * 0.08);
      upsertSettlement(req.captainId, 'captain', req.orderId, captainShare, req.currency ?? DEFAULT_CURRENCY);
      postLedger('payout', req.orderId, req.captainId, 'captain', 0, captainShare, req.currency ?? DEFAULT_CURRENCY, id);
    }
    // Field agent commission share
    if (req.fieldAgentId) {
      const fieldShare = Math.floor(req.amountMinorUnits * 0.02);
      upsertSettlement(req.fieldAgentId, 'field', req.orderId, fieldShare, req.currency ?? DEFAULT_CURRENCY);
      postLedger('commission', req.orderId, req.fieldAgentId, 'field', 0, fieldShare, req.currency ?? DEFAULT_CURRENCY, id);
    }

    // Emit callback event
    const cbId = createCallback('dsh.payment-callback', idempotencyKey, {
      paymentSessionId: id, orderId: req.orderId, status: 'captured', amountMinorUnits: req.amountMinorUnits, currency: req.currency ?? DEFAULT_CURRENCY,
    });
    db.prepare('UPDATE wlt_payments SET callback_target=? WHERE id=?').run(cbId, id);
  }

  const payment = db.prepare('SELECT * FROM wlt_payments WHERE id=?').get(id);
  const result = {
    id: payment.id, orderId: payment.order_id, amountMinorUnits: payment.amount_minor_units,
    currency: payment.currency, status: payment.status,
    dshCallbackEvent: callbackTarget ? { target: callbackTarget } : undefined,
    createdAt: payment.created_at,
  };

  if (idempotencyKey) {
    db.prepare('INSERT OR REPLACE INTO wlt_idempotency (key, response, created_at) VALUES (?,?,?)').run(idempotencyKey, JSON.stringify(result), t);
  }
  return result;
}

function getPaymentSession(id) {
  const p = db.prepare('SELECT * FROM wlt_payments WHERE id=?').get(id);
  if (!p) return null;
  return { id: p.id, orderId: p.order_id, amountMinorUnits: p.amount_minor_units, currency: p.currency, status: p.status, createdAt: p.created_at };
}

function executeRefund(req, idempotencyKey) {
  if (idempotencyKey) {
    const cached = db.prepare('SELECT response FROM wlt_idempotency WHERE key=?').get(idempotencyKey);
    if (cached) return JSON.parse(cached.response);
  }

  const id = nextId('WLT-DSH-REF');
  const t = now();
  db.prepare(`INSERT INTO wlt_refunds (id, order_id, client_id, store_id, amount_minor_units, currency, reason, status, callback_target, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(id, req.orderId, req.clientId ?? null, req.storeId ?? null, req.amountMinorUnits, req.currency ?? DEFAULT_CURRENCY,
      req.reason ?? null, 'confirmed', 'dsh.refund-callback', t);

  if (req.clientId) {
    const wallet = db.prepare('SELECT * FROM wlt_wallets WHERE client_id=?').get(req.clientId);
    if (wallet) {
      db.prepare('UPDATE wlt_wallets SET balance_minor_units=?, updated_at=? WHERE client_id=?')
        .run(wallet.balance_minor_units + req.amountMinorUnits, t, req.clientId);
    }
  }

  postLedger('refund', req.orderId, req.clientId ?? 'client-demo', 'client', 0, req.amountMinorUnits, req.currency ?? DEFAULT_CURRENCY, id);
  createCallback('dsh.refund-callback', idempotencyKey, { refundId: id, orderId: req.orderId, status: 'confirmed', amountMinorUnits: req.amountMinorUnits });

  const result = {
    id, orderId: req.orderId, clientId: req.clientId, amountMinorUnits: req.amountMinorUnits, currency: req.currency ?? DEFAULT_CURRENCY,
    reason: req.reason, status: 'confirmed', callbackEvent: { target: 'dsh.refund-callback' }, createdAt: t,
  };

  if (idempotencyKey) {
    db.prepare('INSERT OR REPLACE INTO wlt_idempotency (key, response, created_at) VALUES (?,?,?)').run(idempotencyKey, JSON.stringify(result), t);
  }
  return result;
}

function listSettlements(ownerId, ownerKind) {
  let rows;
  if (ownerId && ownerKind) {
    rows = db.prepare('SELECT * FROM wlt_settlements WHERE owner_id=? AND owner_kind=?').all(ownerId, ownerKind);
  } else if (ownerId) {
    rows = db.prepare('SELECT * FROM wlt_settlements WHERE owner_id=?').all(ownerId);
  } else {
    rows = db.prepare('SELECT * FROM wlt_settlements').all();
  }
  return rows.map(r => ({
    id: r.id, ownerId: r.owner_id, ownerKind: r.owner_kind, orderIds: JSON.parse(r.order_ids),
    netPayableMinorUnits: r.net_payable_minor_units, currency: r.currency, status: r.status, createdAt: r.created_at,
  }));
}

function listCodLiabilities(captainId) {
  const rows = captainId
    ? db.prepare('SELECT * FROM wlt_cod_liabilities WHERE captain_id=?').all(captainId)
    : db.prepare('SELECT * FROM wlt_cod_liabilities').all();
  return rows.map(r => ({ id: r.id, captainId: r.captain_id, orderId: r.order_id, amountMinorUnits: r.amount_minor_units, currency: r.currency, status: r.status, createdAt: r.created_at }));
}

function listLedgerEntries(actorKind) {
  const rows = actorKind
    ? db.prepare('SELECT * FROM wlt_ledger_entries WHERE actor_kind=?').all(actorKind)
    : db.prepare('SELECT * FROM wlt_ledger_entries').all();
  return rows.map(r => ({
    id: r.id, kind: r.kind, orderId: r.order_id, actorId: r.actor_id, actorKind: r.actor_kind,
    debitMinorUnits: r.debit_minor_units, creditMinorUnits: r.credit_minor_units,
    currency: r.currency, status: r.status, referenceId: r.reference_id, createdAt: r.created_at,
  }));
}

function listRefunds() {
  return db.prepare('SELECT * FROM wlt_refunds').all().map(r => ({
    id: r.id, orderId: r.order_id, clientId: r.client_id, storeId: r.store_id,
    amountMinorUnits: r.amount_minor_units, currency: r.currency, reason: r.reason, status: r.status, createdAt: r.created_at,
  }));
}

function listReconciliationRuns() {
  return db.prepare('SELECT * FROM wlt_reconciliation_runs').all().map(r => ({
    id: r.id, status: r.status, entryCount: r.entry_count, totalDebit: r.total_debit, totalCredit: r.total_credit, createdAt: r.created_at,
  }));
}

function triggerReconciliationRun(idempotencyKey) {
  if (idempotencyKey) {
    const cached = db.prepare('SELECT response FROM wlt_idempotency WHERE key=?').get(idempotencyKey);
    if (cached) return JSON.parse(cached.response);
  }
  const entries = db.prepare('SELECT * FROM wlt_ledger_entries WHERE status=?').all('posted');
  const totalDebit = entries.reduce((s, e) => s + e.debit_minor_units, 0);
  const totalCredit = entries.reduce((s, e) => s + e.credit_minor_units, 0);
  const status = totalDebit === totalCredit ? 'passed' : 'failed';
  const id = nextId('WLT-DSH-REC');
  db.prepare('INSERT INTO wlt_reconciliation_runs (id, idempotency_key, status, entry_count, total_debit, total_credit, created_at) VALUES (?,?,?,?,?,?,?)')
    .run(id, idempotencyKey ?? null, status, entries.length, totalDebit, totalCredit, now());
  const result = { id, status, entryCount: entries.length, totalDebit, totalCredit, createdAt: now() };
  if (idempotencyKey) {
    db.prepare('INSERT OR REPLACE INTO wlt_idempotency (key, response, created_at) VALUES (?,?,?)').run(idempotencyKey, JSON.stringify(result), now());
  }
  return result;
}

function createPayoutDecision(ownerId, ownerKind, settlementCycleId, amountMinorUnits, idempotencyKey) {
  if (idempotencyKey) {
    const cached = db.prepare('SELECT response FROM wlt_idempotency WHERE key=?').get(idempotencyKey);
    if (cached) return JSON.parse(cached.response);
  }
  const id = nextId('WLT-DSH-PO');
  const t = now();
  db.prepare(`INSERT INTO wlt_payout_decisions (id, owner_id, owner_kind, settlement_cycle_id, amount_minor_units, currency, status, idempotency_key, created_at) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(id, ownerId, ownerKind, settlementCycleId, amountMinorUnits, DEFAULT_CURRENCY, 'approved', idempotencyKey ?? null, t);
  const result = { id, ownerId, ownerKind, settlementCycleId, amountMinorUnits, currency: DEFAULT_CURRENCY, status: 'approved', createdAt: t };
  if (idempotencyKey) {
    db.prepare('INSERT OR REPLACE INTO wlt_idempotency (key, response, created_at) VALUES (?,?,?)').run(idempotencyKey, JSON.stringify(result), t);
  }
  return result;
}

function submitDailyClose(businessDate) {
  const existing = db.prepare('SELECT * FROM wlt_finance_close WHERE business_date=?').get(businessDate);
  if (existing && existing.status === 'closed') {
    return { id: existing.id, businessDate: existing.business_date, status: existing.status, closedAt: existing.closed_at };
  }
  const rec = triggerReconciliationRun(`daily-close-${businessDate}`);
  const status = rec.status === 'passed' ? 'closed' : 'failed';
  const t = now();
  const id = existing?.id ?? nextId('WLT-DSH-CLOSE');
  if (existing) {
    db.prepare('UPDATE wlt_finance_close SET status=?, reconciliation_run_id=?, closed_at=? WHERE id=?').run(status, rec.id, t, id);
  } else {
    db.prepare('INSERT INTO wlt_finance_close (id, business_date, status, reconciliation_run_id, closed_at, created_at) VALUES (?,?,?,?,?,?)')
      .run(id, businessDate, status, rec.id, t, t);
  }
  return { id, businessDate, status, reconciliationRunId: rec.id, closedAt: t };
}

function getSnapshot() {
  const entries = listLedgerEntries();
  const totalDebit = entries.reduce((s, e) => s + e.debitMinorUnits, 0);
  const totalCredit = entries.reduce((s, e) => s + e.creditMinorUnits, 0);
  return {
    runtimeTruth: 'wlt_dsh_http_sqlite_server',
    totalDebitMinorUnits: totalDebit,
    totalCreditMinorUnits: totalCredit,
    balanced: totalDebit === totalCredit,
    payments: db.prepare('SELECT COUNT(*) as c FROM wlt_payments').get().c,
    refunds: db.prepare('SELECT COUNT(*) as c FROM wlt_refunds').get().c,
    settlements: db.prepare('SELECT COUNT(*) as c FROM wlt_settlements').get().c,
    codLiabilities: listCodLiabilities(),
    ledgerEntries: entries,
    reconciliationRuns: listReconciliationRuns(),
    callbackEvents: db.prepare('SELECT * FROM wlt_callback_events').all().map(r => ({
      eventId: r.id, target: r.target, payload: JSON.parse(r.payload), createdAt: r.created_at,
    })),
    closeStatus: (() => {
      const last = db.prepare('SELECT * FROM wlt_finance_close ORDER BY created_at DESC LIMIT 1').get();
      return last ? { id: last.id, businessDate: last.business_date, status: last.status } : { id: 'WLT-DSH-CLOSE-000000', status: 'open' };
    })(),
  };
}

// ──────────────────────────────────────────────────────────────────────
// HTTP Server
// ──────────────────────────────────────────────────────────────────────

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key, X-WLT-Event-Id');
}

function json(res, status, body) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function notFound(res, path) {
  json(res, 404, { code: 'POLICY_BLOCK', message: `Unsupported WLT-DSH route: ${path}` });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString();
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  const method = req.method ?? 'GET';
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = url.pathname.replace(/\/$/, '');
  const query = Object.fromEntries(url.searchParams.entries());
  const headers = Object.fromEntries(Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const idempotencyKey = headers['idempotency-key'] ?? headers['Idempotency-Key'] ?? '';

  if (method === 'OPTIONS') {
    cors(res);
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Client routes
    if (method === 'GET' && path === '/wlt/dsh/client/wallet/summary') {
      return json(res, 200, getClientWalletSummary(query.clientId));
    }
    if (method === 'POST' && path === '/wlt/dsh/client/payment-sessions') {
      const body = await readBody(req);
      return json(res, 201, createPaymentSession(body, idempotencyKey));
    }
    const pmMatch = path.match(/^\/wlt\/dsh\/client\/payment-sessions\/([^/]+)$/);
    if (method === 'GET' && pmMatch) {
      const session = getPaymentSession(pmMatch[1]);
      return session ? json(res, 200, session) : json(res, 404, { code: 'POLICY_BLOCK', message: 'Payment session not found' });
    }

    // Captain routes
    if (method === 'GET' && path === '/wlt/dsh/captain/cod-liabilities') {
      return json(res, 200, listCodLiabilities(query.captainId));
    }
    if (method === 'GET' && path === '/wlt/dsh/captain/eligibility') {
      const liabilities = listCodLiabilities(query.captainId);
      return json(res, 200, {
        captainId: query.captainId ?? 'captain-demo',
        eligible: liabilities.filter(l => l.status === 'outstanding').length === 0,
        heldMinorUnits: liabilities.reduce((s, l) => s + l.amountMinorUnits, 0),
        currency: DEFAULT_CURRENCY,
        updatedAt: now(),
      });
    }
    if (method === 'GET' && path === '/wlt/dsh/captain/earnings') {
      return json(res, 200, listLedgerEntries('captain'));
    }

    // Partner routes
    if (method === 'GET' && path === '/wlt/dsh/partner/settlement-cycles') {
      return json(res, 200, listSettlements(query.partnerId, 'partner'));
    }

    // Field routes
    if (method === 'GET' && path === '/wlt/dsh/field/commissions') {
      return json(res, 200, listSettlements(query.fieldAgentId, 'field'));
    }

    // Control Panel routes
    if (method === 'GET' && path === '/wlt/dsh/control-panel/finance/overview') {
      return json(res, 200, getSnapshot());
    }
    if (method === 'GET' && path === '/wlt/dsh/control-panel/reconciliation-runs') {
      return json(res, 200, listReconciliationRuns());
    }
    if (method === 'POST' && path === '/wlt/dsh/control-panel/reconciliation-runs') {
      return json(res, 201, triggerReconciliationRun(idempotencyKey));
    }
    if (method === 'POST' && path === '/wlt/dsh/control-panel/payout-decisions') {
      const body = await readBody(req);
      return json(res, 201, createPayoutDecision(body.ownerId, body.ownerKind, body.settlementCycleId, body.amountMinorUnits, idempotencyKey));
    }
    if (method === 'GET' && path === '/wlt/dsh/control-panel/audit-events') {
      return json(res, 200, db.prepare('SELECT * FROM wlt_callback_events').all().map(r => ({
        eventId: r.id, target: r.target, payload: JSON.parse(r.payload), createdAt: r.created_at,
      })));
    }
    if (method === 'GET' && path === '/wlt/dsh/control-panel/refund-queue') {
      return json(res, 200, listRefunds());
    }
    if (method === 'POST' && path === '/wlt/dsh/control-panel/refund-queue') {
      const body = await readBody(req);
      return json(res, 201, executeRefund(body, idempotencyKey));
    }
    if (method === 'GET' && path === '/wlt/dsh/control-panel/ledger-entries') {
      return json(res, 200, listLedgerEntries());
    }
    if (method === 'GET' && path === '/wlt/dsh/control-panel/reconciliation-close-status') {
      const last = db.prepare('SELECT * FROM wlt_finance_close ORDER BY created_at DESC LIMIT 1').get();
      return json(res, 200, last ? { id: last.id, businessDate: last.business_date, status: last.status } : { id: 'WLT-DSH-CLOSE-000000', status: 'open' });
    }
    if (method === 'POST' && path === '/wlt/dsh/control-panel/daily-close') {
      const body = await readBody(req);
      return json(res, 201, submitDailyClose(body.businessDate ?? new Date().toISOString().slice(0, 10)));
    }

    // Settlement candidates callback (for DSH backend to push financial refs)
    if (method === 'POST' && path === '/wlt/dsh/settlement-callback') {
      const body = await readBody(req);
      // Record settlement from DSH operational event
      if (body.orderId && body.partnerId) {
        upsertSettlement(body.partnerId, 'partner', body.orderId, body.partnerShareMinorUnits ?? 0, body.currency ?? DEFAULT_CURRENCY);
      }
      if (body.orderId && body.captainId) {
        upsertSettlement(body.captainId, 'captain', body.orderId, body.captainShareMinorUnits ?? 0, body.currency ?? DEFAULT_CURRENCY);
      }
      return json(res, 200, { status: 'received' });
    }

    // Health check
    if (path === '/wlt/health' || path === '/health') {
      return json(res, 200, { status: 'ok', service: 'wlt-dsh', persistence: 'sqlite', db: DB_PATH, runtimeTruth: 'wlt_dsh_http_sqlite_server' });
    }

    notFound(res, `${method} ${path}`);
  } catch (err) {
    console.error('WLT-DSH server error:', err);
    json(res, 400, { code: 'WLT_RUNTIME_UNAVAILABLE', message: err?.message ?? 'Unknown error' });
  }
});

server.listen(PORT, () => {
  console.log(`WLT-DSH HTTP server running on port ${PORT}`);
  console.log(`  Persistence: ${DB_PATH}`);
  console.log(`  Health: http://localhost:${PORT}/wlt/health`);
  console.log(`  runtimeTruth: wlt_dsh_http_sqlite_server`);
});

export { server };
