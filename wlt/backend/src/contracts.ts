export interface WalletBalance {
	balanceMinorUnits: number;
	currency: string;
	linked: boolean;
	frozenMinorUnits?: number;
	updatedAt: string;
}

export interface PaymentIntent {
	id?: string;
	orderId: string;
	amountMinorUnits: number;
	currency: string;
	status?: 'pending' | 'authorized' | 'captured' | 'failed' | 'cancelled';
}

export interface TopUpIntent {
	id?: string;
	amountMinorUnits: number;
	currency: string;
	status?: 'pending' | 'processing' | 'completed' | 'failed';
	redirectUrl?: string;
}
