import { createWltDshTypedClient } from '../../contracts/wlt-dsh-client';
import type { WltSettlement, WltListSettlementsResponse } from '../../contracts/wlt-dsh-client';

export type { WltSettlement, WltListSettlementsResponse };

export async function listSettlements(bearerToken?: string): Promise<WltListSettlementsResponse> {
  return createWltDshTypedClient({ bearerToken }).listSettlements();
}

export async function getSettlement(settlementId: string, bearerToken?: string): Promise<WltSettlement> {
  return createWltDshTypedClient({ bearerToken }).getSettlement(settlementId);
}
