import { WalletBalance, PaymentIntent, TopUpIntent } from './contracts';

export interface WltBackendClient {
	getClientWalletSummary(baseUrl: string): Promise<WalletBalance>;
	createClientPaymentIntent(baseUrl: string, intent: PaymentIntent): Promise<PaymentIntent>;
	createClientTopUpIntent(baseUrl: string, intent: TopUpIntent): Promise<TopUpIntent>;
}

export const wltBackendClient: WltBackendClient = {
	getClientWalletSummary: async (baseUrl: string): Promise<WalletBalance> => {
		const response = await fetch(`${baseUrl.replace(/\/$/, '')}/wlt/dsh/client/wallet/summary`);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		return response.json();
	},
	createClientPaymentIntent: async (baseUrl: string, intent: PaymentIntent): Promise<PaymentIntent> => {
		const response = await fetch(`${baseUrl.replace(/\/$/, '')}/wlt/dsh/client/payment-intents`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(intent),
		});
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		return response.json();
	},
	createClientTopUpIntent: async (baseUrl: string, intent: TopUpIntent): Promise<TopUpIntent> => {
		const response = await fetch(`${baseUrl.replace(/\/$/, '')}/wlt/dsh/client/top-up-intents`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(intent),
		});
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		return response.json();
	},
};
