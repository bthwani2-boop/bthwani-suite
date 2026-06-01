import { getWltPartnerFinanceSnapshot } from '../../control-panel/dsh/dshFinancePreview';
import { wltDshPartnerBridgeDataContract } from './wlt-dsh-partner.contract';
import type { WltDshPartnerBridgeState } from './wlt-dsh-partner.types';

const _snapshot = getWltPartnerFinanceSnapshot();

export const wltDshPartnerPreviewData = {
  contract: wltDshPartnerBridgeDataContract,
  wallet: {
    balanceLabel: _snapshot.netSettlementLabel,
    pendingPayoutsLabel: _snapshot.nextSettlementLabel,
    lastSettlementLabel: _snapshot.settlementRecords[0]?.timeLabel ?? 'غير متاح',
  },
  finance: {
    snapshot: _snapshot,
    settlementRecords: _snapshot.settlementRecords,
  },
} as const satisfies WltDshPartnerBridgeState & {
  contract: typeof wltDshPartnerBridgeDataContract;
};
