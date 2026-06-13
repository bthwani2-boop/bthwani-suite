import type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinanceSummaryRecord,
} from '../control-panel/financeContracts';

export type WltDshCaptainBridgeSection = WltCaptainFinanceSection;

export type WltDshCaptainFinanceSummaryState = {
  snapshot: WltCaptainFinanceSnapshot;
  records: readonly WltDshFinanceSummaryRecord[];
  sections: readonly WltDshCaptainBridgeSection[];
  defaultSection: WltDshCaptainBridgeSection;
};

export type WltDshCaptainBridgeState = {
  finance: WltDshCaptainFinanceSummaryState;
};
