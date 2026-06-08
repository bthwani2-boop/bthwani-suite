import {
  getWltCaptainFinanceSnapshot,
  getWltDshFinanceRecordsForActor,
  type WltCaptainFinanceSection,
} from '../control-panel/financeContracts';
import { wltDshCaptainBridgeDataContract } from './wlt-dsh-captain.contract';
import type { WltDshCaptainBridgeState } from './wlt-dsh-captain.types';

export const wltDshCaptainFinanceSections = [
  'eligibility',
  'cod-liability',
  'earnings',
  'settlement',
] as const satisfies readonly WltCaptainFinanceSection[];

export const wltDshCaptainPreviewData = {
  contract: wltDshCaptainBridgeDataContract,
  finance: {
    snapshot: getWltCaptainFinanceSnapshot(),
    records: getWltDshFinanceRecordsForActor('captain'),
    sections: wltDshCaptainFinanceSections,
    defaultSection: 'eligibility' as WltCaptainFinanceSection,
  },
} as const satisfies WltDshCaptainBridgeState & {
  contract: typeof wltDshCaptainBridgeDataContract;
};
