// WLT Backend Contracts — Payment Bridge Boundary Stubs
// BOUNDARY: These types define the handoff surface between DSH and WLT.
// DSH sends operational proof → WLT decides financial outcome.
// No financial mutation happens inside DSH.

// Wallet balance as read-only visibility for DSH (display only, not financial truth source).
export interface WalletBalance {
	balanceMinorUnits: number;
	currency: string;
	linked: boolean;
	frozenMinorUnits: number;
	updatedAt: string;
}

export type WltErrorCode =
	| 'WALLET_UNLINKED'
	| 'INSUFFICIENT_BALANCE'
	| 'POLICY_BLOCK'
	| 'FRAUD_HOLD'
	| 'INVALID_AMOUNT'
	| 'WLT_RUNTIME_UNAVAILABLE';

// Error response schema for WLT-owned payment/wallet bridge failures.
export interface WltErrorResponse {
	code: WltErrorCode;
	message: string;
	referenceId?: string;
}

export interface WltDshMoneyAmount {
	amountMinorUnits: number;
	currency: string;
}

export type WltDshPaymentMethod = 'wallet' | 'cod' | 'card' | 'manual';
export type WltDshPaymentSessionStatus = 'pending' | 'confirmed' | 'failed';

// Payment intent request: DSH provides orderId + amount candidate.
// WLT decides if payment proceeds, fails, or is held.
export interface PaymentIntentRequest {
	orderId: string;
	clientId?: string;
	storeId?: string;
	partnerId?: string;
	captainId?: string;
	fieldAgentId?: string;
	amountMinorUnits: number;
	currency: string;
	paymentMethod?: WltDshPaymentMethod;
	dshCheckoutIntentId?: string;
}

// Payment intent response: WLT returns status reference only.
// DSH stores sessionId/txId as operational reference — not as ledger entry.
export interface PaymentIntentResponse {
	id: string;
	orderId: string;
	amountMinorUnits: number;
	currency: string;
	// 'captured' = WLT confirmed. 'failed' = WLT rejected. 'pending' = awaiting WLT decision.
	status: 'captured' | 'failed' | 'pending';
	wltPaymentRefId?: string;
	dshCallbackEvent?: WltDshCallbackEvent;
}

// Top-up intent request: initiated by client, executed by WLT.
export interface TopUpIntentRequest {
	amountMinorUnits: number;
	currency: string;
}

// Top-up intent response: WLT reference only.
export interface TopUpIntentResponse {
	id: string;
	amountMinorUnits: number;
	currency: string;
	status: 'completed' | 'pending' | 'failed';
	redirectUrl?: string;
}

export type WltDshLedgerEntryKind =
	| 'wallet_payment'
	| 'cod_liability'
	| 'partner_settlement'
	| 'captain_payout'
	| 'field_commission'
	| 'refund'
	| 'reconciliation'
	| 'finance_close';

export interface WltDshLedgerEntry {
	id: string;
	kind: WltDshLedgerEntryKind;
	orderId?: string;
	actorId: string;
	actorKind: 'client' | 'partner' | 'captain' | 'field' | 'platform';
	debitMinorUnits: number;
	creditMinorUnits: number;
	currency: string;
	status: 'posted' | 'pending' | 'failed' | 'reversed';
	createdAt: string;
	referenceId: string;
}

export interface WltDshCallbackEvent {
	eventId: string;
	idempotencyKey: string;
	target: 'dsh.payment-callback' | 'dsh.refund-callback' | 'dsh.settlement-callback';
	payload: Record<string, unknown>;
	createdAt: string;
}

export interface WltDshRefundRequest {
	orderId: string;
	clientId: string;
	storeId: string;
	amountMinorUnits: number;
	currency: string;
	reason: string;
}

export interface WltDshRefundCase {
	refundRefId: string;
	orderId: string;
	clientId: string;
	storeId: string;
	amountMinorUnits: number;
	currency: string;
	status: 'pending_wlt_review' | 'confirmed' | 'failed';
	reason: string;
	createdAt: string;
	callbackEvent?: WltDshCallbackEvent;
}

export interface WltDshSettlementCycle {
	id: string;
	ownerId: string;
	ownerKind: 'partner' | 'captain' | 'field';
	orderIds: readonly string[];
	netPayableMinorUnits: number;
	currency: string;
	status: 'open' | 'ready_for_payout' | 'paid' | 'held';
	createdAt: string;
}

export interface WltDshCodLiability {
	id: string;
	captainId: string;
	orderId: string;
	amountMinorUnits: number;
	currency: string;
	status: 'outstanding' | 'deposited' | 'reconciled';
	createdAt: string;
}

export interface WltDshPayoutDecision {
	id: string;
	ownerId: string;
	ownerKind: 'partner' | 'captain' | 'field';
	settlementCycleId: string;
	amountMinorUnits: number;
	currency: string;
	status: 'prepared' | 'approved_by_wlt' | 'rejected_by_wlt';
	createdAt: string;
}

export interface WltDshReconciliationRun {
	id: string;
	status: 'running' | 'passed' | 'failed';
	checkedLedgerRows: number;
	unmatchedRows: number;
	createdAt: string;
}

export interface WltDshFinanceClose {
	id: string;
	businessDate: string;
	status: 'blocked' | 'closed';
	blockingReasons: readonly string[];
	createdAt: string;
}

export interface WltDshFinanceSnapshot {
	wallets: readonly WalletBalance[];
	paymentSessions: readonly PaymentIntentResponse[];
	refunds: readonly WltDshRefundCase[];
	settlements: readonly WltDshSettlementCycle[];
	codLiabilities: readonly WltDshCodLiability[];
	payouts: readonly WltDshPayoutDecision[];
	ledgerEntries: readonly WltDshLedgerEntry[];
	reconciliationRuns: readonly WltDshReconciliationRun[];
	closeStatus: WltDshFinanceClose;
	callbackEvents: readonly WltDshCallbackEvent[];
	runtimeTruth: 'wlt_dsh_in_memory_core_only';
}
