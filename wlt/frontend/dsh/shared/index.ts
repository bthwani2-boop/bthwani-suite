// ── WLT DSH Shared — Topic-First ────────────────────────────────────────────
// Finance domain organized by topic, not by layer.
// Rule: no dev fallback IDs, no mock data, no surface-specific hooks.
// WLT finance mutations: only in this layer, never in dsh/frontend/shared.
// ─────────────────────────────────────────────────────────────────────────────

// Wallet Topic — balances, transaction lines, cash bags, payment splits
export * from './wallet';

// Payments Topic — payment sessions, routing, providers, finance hub navigation
export * from './payments';

// Refunds Topic — refund types, ledger cases, row view-models
export * from './refunds';

// Settlements Topic — settlement cycles, store settlements, partner summaries
export * from './settlements';

// Payouts Topic — payout types, captain summaries, payout rows
export * from './payouts';

// Commissions Topic — field and captain commission types, adapters, summaries
export * from './commissions';

// Ledger Topic — chart of accounts, subledger, posting rules, trial balance, financial center
export * from './ledger';
export type { WltLedgerEntry } from './wallet';

// Reconciliation Topic — COD reconciliation, daily close, variances
export * from './reconciliation';

// Bridges Topic — WLT↔DSH surface handoff contracts (captain, client, field)
export * from './bridges';

// Finance Hub Topic — DSH finance event kinds, maker-checker, statements, runtime adapters
export * from './finance-hub';

// Clients — typed HTTP clients for WLT backend
export * from './clients';

// Guards — preview runtime tokens, boundary enforcement
export * from './guards';

// Policies — ownership and access control
export * from './policies';
