import { wltDshPartnerBridgeDataContract } from './wlt-dsh-partner.contract';
import type { WltDshPartnerBridgeState } from './wlt-dsh-partner.types';

export const wltDshPartnerPreviewData = {
  contract: wltDshPartnerBridgeDataContract,
  wallet: {
    balanceLabel: 'رصيد تجريبي',
    pendingPayoutsLabel: 'قيد التسوية',
    lastSettlementLabel: 'آخر تسوية تجريبية',
  },
} as const satisfies WltDshPartnerBridgeState & {
  contract: typeof wltDshPartnerBridgeDataContract;
};
