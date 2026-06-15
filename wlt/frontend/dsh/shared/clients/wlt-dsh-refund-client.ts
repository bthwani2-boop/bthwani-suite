import { createWltDshTypedClient } from '../../contracts/wlt-dsh-client';
import type { WltRefund, WltCreateRefundRequest, WltListRefundsResponse } from '../../contracts/wlt-dsh-client';

export type { WltRefund, WltCreateRefundRequest, WltListRefundsResponse };

export async function listRefunds(bearerToken?: string): Promise<WltListRefundsResponse> {
  return createWltDshTypedClient({ bearerToken }).listRefundQueue();
}

export async function getRefund(refundId: string, bearerToken?: string): Promise<WltRefund> {
  return createWltDshTypedClient({ bearerToken }).getRefund(refundId);
}
