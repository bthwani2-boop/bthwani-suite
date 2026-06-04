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
} from './contracts';

export interface WltBackendClient {
	// Read-only wallet summary for display in DSH surfaces (not financial truth).
	getClientWalletSummary(wltBaseUrl: string): Promise<WalletBalance>;
	// Payment session handoff: DSH provides orderId + amount → WLT decides.
	createClientPaymentIntent(wltBaseUrl: string, req: PaymentIntentRequest): Promise<PaymentIntentResponse>;
	// Top-up session handoff: initiated by client, executed by WLT.
	createClientTopUpIntent(wltBaseUrl: string, req: TopUpIntentRequest): Promise<TopUpIntentResponse>;
}

// NOTE: wltBaseUrl must be the WLT service base URL — NOT the DSH API URL.
// DSH does not serve wallet endpoints.
export const wltBackendClient: WltBackendClient = {
	getClientWalletSummary: async (wltBaseUrl: string): Promise<WalletBalance> => {
		const response = await fetch(`${wltBaseUrl.replace(/\/$/, '')}/wlt/client/wallet/summary`);
		if (!response.ok) throw new Error(`WLT wallet summary error: ${response.status}`);
		return response.json();
	},
	createClientPaymentIntent: async (wltBaseUrl: string, req: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
		const response = await fetch(`${wltBaseUrl.replace(/\/$/, '')}/wlt/client/payment-intents`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(req),
		});
		if (!response.ok) throw new Error(`WLT payment intent error: ${response.status}`);
		return response.json();
	},
	createClientTopUpIntent: async (wltBaseUrl: string, req: TopUpIntentRequest): Promise<TopUpIntentResponse> => {
		const response = await fetch(`${wltBaseUrl.replace(/\/$/, '')}/wlt/client/top-up-intents`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(req),
		});
		if (!response.ok) throw new Error(`WLT top-up intent error: ${response.status}`);
		return response.json();
	},
};
