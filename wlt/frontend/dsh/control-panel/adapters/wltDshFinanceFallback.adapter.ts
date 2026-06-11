import {
  getAdaptedFinanceControlPanelRows,
  type DshFinancePreviewRow,
} from '../../../../../dsh/frontend/data/wallet.preview-data';
import {
  getWltCaptainFinancePreview,
  getWltCaptainFinanceSnapshot,
  getWltControlPanelFinancePreview,
  getWltDshClientPaymentPreview,
  getWltDshFinanceRecordsForActor,
  getWltDshFinanceSummaryForActor,
  getWltDshOrderCommissionBreakdown,
  getWltDshPaymentOptionsPreview,
  getWltDshStoreDeliveryFinancePreview,
  getWltDshAccountStatementsPreviewAdapter,
  getWltDshCaptainSettlementStatementsPreviewAdapter,
  getWltDshPartnerSettlementStatementsPreviewAdapter,
  getWltDshRefundLedgerPreviewAdapter,
  getWltDshSettlementCalendarPreviewAdapter,
  getWltDshStoreSettlementStatementsPreviewAdapter,
  getWltFieldFinancePreview,
  getWltFieldFinanceSnapshot,
  getWltFieldCommissionStatementsPreviewAdapter,
  getWltPartnerFinanceSnapshot,
  getWltPartnerSettlementPreview,
  resolveWltDshFinanceEventKindForPaymentMethod,
  resolveWltDshPaymentPreviewState,
  WLT_DSH_CONTROL_PANEL_FINANCE_CONTRACT,
  WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW,
} from './dshFinanceFixture.adapter';

// Isolate preview fallback reads behind one adapter so runtime-first screens do not
// depend on scattered preview helpers directly.

export function getFallbackControlPanelFinancePreview() {
  return getWltControlPanelFinancePreview();
}

export function getFallbackCaptainFinancePreview() {
  return getWltCaptainFinancePreview();
}

export function getFallbackCaptainFinanceSnapshot() {
  return getWltCaptainFinanceSnapshot();
}

export function getFallbackClientPaymentPreview() {
  return getWltDshClientPaymentPreview();
}

export function getFallbackFinanceRecordsForActor(
  actor: Parameters<typeof getWltDshFinanceRecordsForActor>[0],
) {
  return getWltDshFinanceRecordsForActor(actor);
}

export function getFallbackFinanceSummaryForActor(
  actor: Parameters<typeof getWltDshFinanceSummaryForActor>[0],
) {
  return getWltDshFinanceSummaryForActor(actor);
}

export function getFallbackOrderCommissionBreakdown(
  mode: Parameters<typeof getWltDshOrderCommissionBreakdown>[0],
) {
  return getWltDshOrderCommissionBreakdown(mode);
}

export function getFallbackPaymentOptionsPreview() {
  return getWltDshPaymentOptionsPreview();
}

export function getFallbackStoreDeliveryFinancePreview() {
  return getWltDshStoreDeliveryFinancePreview();
}

export function getFallbackFieldFinancePreview() {
  return getWltFieldFinancePreview();
}

export function getFallbackFieldFinanceSnapshot(
  storeIds?: Parameters<typeof getWltFieldFinanceSnapshot>[0],
) {
  return getWltFieldFinanceSnapshot(storeIds);
}

export function getFallbackPartnerFinanceSnapshot() {
  return getWltPartnerFinanceSnapshot();
}

export function getFallbackPartnerSettlementPreview() {
  return getWltPartnerSettlementPreview();
}

export function resolveFallbackFinanceEventKindForPaymentMethod(
  paymentMethod: Parameters<typeof resolveWltDshFinanceEventKindForPaymentMethod>[0],
) {
  return resolveWltDshFinanceEventKindForPaymentMethod(paymentMethod);
}

export function resolveFallbackPaymentPreviewState(
  method: Parameters<typeof resolveWltDshPaymentPreviewState>[0],
  orderTotalMinorUnits: Parameters<typeof resolveWltDshPaymentPreviewState>[1],
  walletBalanceMinorUnits: Parameters<typeof resolveWltDshPaymentPreviewState>[2],
  walletLinked: Parameters<typeof resolveWltDshPaymentPreviewState>[3],
) {
  return resolveWltDshPaymentPreviewState(method, orderTotalMinorUnits, walletBalanceMinorUnits, walletLinked);
}

export function getFallbackRefundLedgerPreview() {
  return getWltDshRefundLedgerPreviewAdapter();
}

export function getFallbackStoreSettlementStatementsPreview() {
  return getWltDshStoreSettlementStatementsPreviewAdapter();
}

export function getFallbackAccountStatementsPreview() {
  return getWltDshAccountStatementsPreviewAdapter();
}

export function getFallbackSettlementCalendarPreview() {
  return getWltDshSettlementCalendarPreviewAdapter();
}

export function getFallbackFieldCommissionStatementsPreview() {
  return getWltFieldCommissionStatementsPreviewAdapter();
}

export function getFallbackPartnerSettlementStatementsPreview() {
  return getWltDshPartnerSettlementStatementsPreviewAdapter();
}

export function getFallbackCaptainSettlementStatementsPreview() {
  return getWltDshCaptainSettlementStatementsPreviewAdapter();
}

export { WLT_DSH_CONTROL_PANEL_FINANCE_CONTRACT, WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW };

export function getFallbackWorkbenchRows(): ReadonlyArray<DshFinancePreviewRow> {
  const surfaces = getAdaptedFinanceControlPanelRows();
  const seen = new Set<string>();
  const combined: DshFinancePreviewRow[] = [];
  for (const surface of [
    surfaces.overview,
    surfaces['cod-reconciliation'],
    surfaces.settlements,
    surfaces.payouts,
    surfaces.refunds,
  ] as const) {
    for (const row of surface) {
      if (!seen.has(row.id)) {
        seen.add(row.id);
        combined.push(row);
      }
    }
  }
  return combined;
}
