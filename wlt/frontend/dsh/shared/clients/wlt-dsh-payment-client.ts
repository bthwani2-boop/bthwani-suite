import { createWltDshTypedClient } from '../../contracts/wlt-dsh-client';
import type { WltPaymentSession, WltCreatePaymentSessionRequest } from '../../contracts/wlt-dsh-client';

export type { WltPaymentSession, WltCreatePaymentSessionRequest };

export async function createPaymentSession(
  request: WltCreatePaymentSessionRequest,
  bearerToken?: string,
): Promise<WltPaymentSession> {
  return createWltDshTypedClient({ bearerToken }).createClientPaymentSession(request);
}

export async function getPaymentSession(
  sessionId: string,
  bearerToken?: string,
): Promise<WltPaymentSession> {
  return createWltDshTypedClient({ bearerToken }).getPaymentSession(sessionId);
}
