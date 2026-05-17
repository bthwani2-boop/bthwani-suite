import type {
  WltCaptainFinanceSection,
  WltCaptainFinanceSnapshot,
  WltDshFinancePreviewRecord,
} from '../../shared/finance/dshFinancePreview';

export type WltDshCaptainBridgeSection = WltCaptainFinanceSection;

export type WltDshCaptainFinancePreviewState = {
  snapshot: WltCaptainFinanceSnapshot;
  records: readonly WltDshFinancePreviewRecord[];
  sections: readonly WltDshCaptainBridgeSection[];
  defaultSection: WltDshCaptainBridgeSection;
};

export type WltDshCaptainBridgeState = {
  finance: WltDshCaptainFinancePreviewState;
};
