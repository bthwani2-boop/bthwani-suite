// WLT-DSH HTTP Transport — direct HTTP calls to the WLT server (port 8090).
// This file is NOT in UI scope (not under app-client/app-captain/control-panel/etc.)
// so fetch() and localhost URLs are permitted here.
// All surface/adapter files must import from here; never call fetch() in UI scope directly.

const WLT_BASE = 'http://localhost:8090';

export const WLT_CURRENCY = 'YER';

export function wltFormatYer(minorUnits: number): string {
  return `${(minorUnits / 100).toLocaleString('ar-YE')} ر.ي`;
}

async function wltGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${WLT_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`WLT GET ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

async function wltPost<T>(path: string, body: unknown, idempotencyKey?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const res = await fetch(`${WLT_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`WLT POST ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Response types ───────────────────────────────────────────────────

export type WltClientWalletSummary = {
  balanceMinorUnits: number;
  currency: string;
  linked: boolean;
  frozenMinorUnits: number;
  updatedAt: string;
};

export type WltPaymentSession = {
  id: string;
  status: 'captured' | 'failed' | 'pending';
  orderId: string;
  amountMinorUnits: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
};

export type WltLedgerEntry = {
  id: string;
  kind: string;
  orderId?: string;
  actorId: string;
  actorKind: string;
  debitMinorUnits: number;
  creditMinorUnits: number;
  currency: string;
  status: string;
  referenceId?: string;
  createdAt: string;
};

export type WltCaptainEligibility = {
  captainId: string;
  eligible: boolean;
  heldMinorUnits: number;
  currency: string;
  updatedAt: string;
};

export type WltSettlement = {
  id: string;
  ownerId: string;
  ownerKind: string;
  orderIds: string[];
  netPayableMinorUnits: number;
  currency: string;
  status: string;
  createdAt: string;
};

export type WltFinanceOverview = {
  payments: number;
  refunds: number;
  settlements: number;
  ledgerEntries: number;
  currency: string;
  grossCollectedMinorUnits: number;
  netSettlementMinorUnits: number;
  lastClose?: { id: string; businessDate: string; status: string };
};

// ─── Client endpoints ─────────────────────────────────────────────────

export async function wltGetClientWalletSummary(clientId?: string): Promise<WltClientWalletSummary> {
  return wltGet('/wlt/dsh/client/wallet/summary', clientId ? { clientId } : undefined);
}

export async function wltCreatePaymentSession(params: {
  orderId: string;
  clientId?: string;
  amountMinorUnits: number;
  currency?: string;
  paymentMethod?: string;
  storeId?: string;
  partnerId?: string;
  captainId?: string;
}): Promise<WltPaymentSession> {
  return wltPost('/wlt/dsh/client/payment-sessions', params);
}

export async function wltGetPaymentSession(id: string): Promise<WltPaymentSession> {
  return wltGet(`/wlt/dsh/client/payment-sessions/${encodeURIComponent(id)}`);
}

// ─── Captain endpoints ────────────────────────────────────────────────

export async function wltGetCaptainEarnings(captainId?: string): Promise<WltLedgerEntry[]> {
  return wltGet('/wlt/dsh/captain/earnings', captainId ? { captainId } : undefined);
}

export async function wltGetCaptainEligibility(captainId?: string): Promise<WltCaptainEligibility> {
  return wltGet('/wlt/dsh/captain/eligibility', captainId ? { captainId } : undefined);
}

export async function wltGetCaptainCodLiabilities(captainId?: string): Promise<WltLedgerEntry[]> {
  return wltGet('/wlt/dsh/captain/cod-liabilities', captainId ? { captainId } : undefined);
}

// ─── Partner endpoints ────────────────────────────────────────────────

export async function wltGetPartnerSettlementCycles(partnerId?: string): Promise<WltSettlement[]> {
  return wltGet('/wlt/dsh/partner/settlement-cycles', partnerId ? { partnerId } : undefined);
}

// ─── Field endpoints ──────────────────────────────────────────────────

export async function wltGetFieldCommissions(fieldAgentId?: string): Promise<WltLedgerEntry[]> {
  return wltGet('/wlt/dsh/field/commissions', fieldAgentId ? { fieldAgentId } : undefined);
}

// ─── Control Panel endpoints ──────────────────────────────────────────

export async function wltGetFinanceOverview(): Promise<WltFinanceOverview> {
  return wltGet('/wlt/dsh/control-panel/finance/overview');
}

export async function wltGetLedgerEntries(): Promise<WltLedgerEntry[]> {
  return wltGet('/wlt/dsh/control-panel/ledger-entries');
}

export async function wltGetRefundQueue(): Promise<WltLedgerEntry[]> {
  return wltGet('/wlt/dsh/control-panel/refund-queue');
}

export async function wltPostRefund(
  params: { paymentId: string; reason: string; amountMinorUnits?: number },
  idempotencyKey?: string,
): Promise<unknown> {
  return wltPost('/wlt/dsh/control-panel/refund-queue', params, idempotencyKey);
}

export async function wltTriggerReconciliation(idempotencyKey?: string): Promise<unknown> {
  return wltPost('/wlt/dsh/control-panel/reconciliation-runs', {}, idempotencyKey);
}

export async function wltCreatePayoutDecision(
  params: { ownerId: string; ownerKind: string; settlementCycleId: string; amountMinorUnits: number },
  idempotencyKey?: string,
): Promise<unknown> {
  return wltPost('/wlt/dsh/control-panel/payout-decisions', params, idempotencyKey);
}

export async function wltSubmitDailyClose(businessDate: string): Promise<unknown> {
  return wltPost('/wlt/dsh/control-panel/daily-close', { businessDate });
}

export async function wltGetReconciliationCloseStatus(): Promise<{ id: string; businessDate?: string; status: string }> {
  return wltGet('/wlt/dsh/control-panel/reconciliation-close-status');
}
