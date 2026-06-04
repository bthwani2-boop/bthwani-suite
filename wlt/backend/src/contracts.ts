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

// Payment intent request: DSH provides orderId + amount candidate.
// WLT decides if payment proceeds, fails, or is held.
export interface PaymentIntentRequest {
	orderId: string;
	amountMinorUnits: number;
	currency: string;
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
