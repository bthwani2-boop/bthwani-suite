// WLT Backend Client — Payment Bridge Stub
// BOUNDARY: This client is a stub for the future WLT payment bridge SDK.
// It does NOT call DSH API. It does NOT mutate financial state.
// When WLT runtime is available, replace with the real WLT SDK client.
//
// DSH produces operational proof → WLT client forwards to WLT service.
// DSH stores only the returned reference ID (sessionId / txId).
import {
	WalletBalance,
	PaymentIntentRequest,
	PaymentIntentResponse,
	TopUpIntentRequest,
	TopUpIntentResponse,
	WltDshFinanceSnapshot,
	WltDshRefundCase,
	WltDshRefundRequest,
} from './contracts';

export interface WltBackendClient {
	// Read-only wallet summary for display in DSH surfaces (not financial truth).
	getClientWalletSummary(wltBaseUrl: string, clientId?: string): Promise<WalletBalance>;
	// Payment session handoff: DSH provides orderId + amount → WLT decides.
	createClientPaymentIntent(wltBaseUrl: string, req: PaymentIntentRequest, idempotencyKey: string): Promise<PaymentIntentResponse>;
	// Refund execution remains WLT-owned; DSH stores the returned ref only.
	executeDshRefund(wltBaseUrl: string, req: WltDshRefundRequest, idempotencyKey: string): Promise<WltDshRefundCase>;
	// Finance overview for DSH control-panel visibility.
	getDshFinanceOverview(wltBaseUrl: string): Promise<WltDshFinanceSnapshot>;
	// Top-up session handoff: initiated by client, executed by WLT.
	createClientTopUpIntent(wltBaseUrl: string, req: TopUpIntentRequest, idempotencyKey: string): Promise<TopUpIntentResponse>;
}

// NOTE: wltBaseUrl must be the WLT service base URL — NOT the DSH API URL.
// DSH does not serve wallet endpoints.
export const wltBackendClient: WltBackendClient = {
	getClientWalletSummary: async (wltBaseUrl: string, clientId = 'client-demo'): Promise<WalletBalance> => {
		const response = await fetch(`${wltBaseUrl.replace(/\/$/, '')}/wlt/dsh/client/wallet/summary?clientId=${encodeURIComponent(clientId)}`);
		if (!response.ok) throw new Error(`WLT wallet summary error: ${response.status}`);
		return response.json();
	},
	createClientPaymentIntent: async (wltBaseUrl: string, req: PaymentIntentRequest, idempotencyKey: string): Promise<PaymentIntentResponse> => {
		const response = await fetch(`${wltBaseUrl.replace(/\/$/, '')}/wlt/dsh/client/payment-sessions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
			body: JSON.stringify(req),
		});
		if (!response.ok) throw new Error(`WLT payment intent error: ${response.status}`);
		return response.json();
	},
	executeDshRefund: async (wltBaseUrl: string, req: WltDshRefundRequest, idempotencyKey: string): Promise<WltDshRefundCase> => {
		const response = await fetch(`${wltBaseUrl.replace(/\/$/, '')}/wlt/dsh/control-panel/refund-queue`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
			body: JSON.stringify(req),
		});
		if (!response.ok) throw new Error(`WLT refund error: ${response.status}`);
		return response.json();
	},
	getDshFinanceOverview: async (wltBaseUrl: string): Promise<WltDshFinanceSnapshot> => {
		const response = await fetch(`${wltBaseUrl.replace(/\/$/, '')}/wlt/dsh/control-panel/finance/overview`);
		if (!response.ok) throw new Error(`WLT DSH finance overview error: ${response.status}`);
		return response.json();
	},
	createClientTopUpIntent: async (wltBaseUrl: string, req: TopUpIntentRequest, idempotencyKey: string): Promise<TopUpIntentResponse> => {
		const response = await fetch(`${wltBaseUrl.replace(/\/$/, '')}/wlt/dsh/client/top-up-sessions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
			body: JSON.stringify(req),
		});
		if (!response.ok) throw new Error(`WLT top-up intent error: ${response.status}`);
		return response.json();
	},
};
