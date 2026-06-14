import type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinanceSummaryRecord,
} from '../contracts';

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
