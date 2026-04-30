// Wallet transfer mock data and loader for dev/demo usage.
// This module isolates mock transfer domain data away from UI surfaces.

export interface WalletTransfer {
  id: string;
  type: 'incoming' | 'outgoing';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  recipient: {
    name: string;
    phone: string;
    method: string;
  };
  fees: {
    transferFee: number;
    totalDeducted: number;
  };
  timing: {
    initiatedAt: string;
    completedAt: string;
    processingTime: string;
  };
  reference: string;
  description?: string;
}

export const mockWalletTransfer: WalletTransfer = {
  id: 'TRF-2024-001',
  type: 'outgoing',
  status: 'completed',
  amount: 150,
  currency: 'ريال',
  recipient: {
    name: 'أحمد محمد',
    phone: '+966501234567',
    method: 'محفظة رقمية',
  },
  fees: {
    transferFee: 0,
    totalDeducted: 150,
  },
  timing: {
    initiatedAt: '2024-02-10 14:30',
    completedAt: '2024-02-10 14:31',
    processingTime: '30 ثانية',
  },
  reference: 'TRF-2024-001-ABC123',
  description: 'تحويل ناجح إلى محفظة رقمية',
};

export type WalletTransferScreenState = 'loading' | 'content' | 'error';

/**
 * Simulate loading a wallet transfer for dev/demo.
 * In production this should be replaced by a real API client.
 */
export async function loadMockWalletTransfer(): Promise<{
  state: WalletTransferScreenState;
  transfer: WalletTransfer | null;
}> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simple deterministic success path; no randomization in UI layer.
  return {
    state: 'content',
    transfer: mockWalletTransfer,
  };
}

