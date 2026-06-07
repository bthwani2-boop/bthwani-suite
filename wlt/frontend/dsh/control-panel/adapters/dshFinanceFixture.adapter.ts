/**
 * Adapter: WLT DSH Finance Fixture Adapter
 * Bridges central DSH demo preview data and fixtures to clean WLT read models.
 * Isolates direct imports from `dsh/frontend/data` to a single file.
 * CONTRACT_SCAFFOLD_PREVIEW_ONLY — not runtime truth, not accounting ledger.
 */

import {
  getWltCaptainFinancePreview,
  getWltCaptainFinanceSnapshot,
  getWltControlPanelFinancePreview,
  getWltDshClientPaymentPreview,
  getWltDshFinancePreviewMetadata,
  getWltDshFinanceRecordsForActor,
  getWltDshFinanceSummaryForActor,
  getWltDshOrderCommissionBreakdown,
  getWltDshPaymentOptionsPreview,
  getWltDshStoreDeliveryFinancePreview,
  getWltFieldFinancePreview,
  getWltFieldFinanceSnapshot,
  getWltPartnerFinanceSnapshot,
  getWltPartnerSettlementPreview,
  resolveWltDshFinanceEventKindForPaymentMethod,
  resolveWltDshPaymentPreviewState,
  WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW,
} from '../../../../../dsh/frontend/data/dshFinancePreview';

import {
  getWltDshAccountStatementsPreview,
  getWltDshRefundLedgerPreview,
  getWltDshSettlementCalendarPreview,
  getWltDshStoreSettlementStatementsPreview,
  WLT_DSH_CONTROL_PANEL_FINANCE_CONTRACT,
  getWltFieldCommissionStatementsPreview,
  getWltDshPartnerSettlementStatementsPreview,
  getWltDshCaptainSettlementStatementsPreview,
} from '../../../../../dsh/frontend/data/finance.preview-data';

import {
  getAdaptedFinanceControlPanelRows,
  type DshFinancePreviewRow,
  type DshFinancePreviewSurface,
} from '../../../../../dsh/frontend/data/wallet.preview-data';

export type { DshFinancePreviewRow, DshFinancePreviewSurface };

// Expose adapted/bridge functions to WLT screens/selectors
export function getWltControlPanelFinancePreviewAdapter() {
  return getWltControlPanelFinancePreview();
}

export function getWltDshAccountStatementsPreviewAdapter() {
  return getWltDshAccountStatementsPreview();
}

export function getWltDshRefundLedgerPreviewAdapter() {
  return getWltDshRefundLedgerPreview();
}

export function getWltDshSettlementCalendarPreviewAdapter() {
  return getWltDshSettlementCalendarPreview();
}

export function getWltDshStoreSettlementStatementsPreviewAdapter() {
  return getWltDshStoreSettlementStatementsPreview();
}

export function getWltDshPartnerSettlementStatementsPreviewAdapter() {
  return getWltDshPartnerSettlementStatementsPreview();
}

export function getWltDshCaptainSettlementStatementsPreviewAdapter() {
  return getWltDshCaptainSettlementStatementsPreview();
}

export function getWltFieldCommissionStatementsPreviewAdapter() {
  return getWltFieldCommissionStatementsPreview();
}

export function getAdaptedFinanceControlPanelRowsAdapter() {
  return getAdaptedFinanceControlPanelRows();
}

export {
  getWltCaptainFinancePreview,
  getWltCaptainFinanceSnapshot,
  getWltControlPanelFinancePreview,
  getWltDshClientPaymentPreview,
  getWltDshFinancePreviewMetadata,
  getWltDshFinanceRecordsForActor,
  getWltDshFinanceSummaryForActor,
  getWltDshOrderCommissionBreakdown,
  getWltDshPaymentOptionsPreview,
  getWltDshStoreDeliveryFinancePreview,
  getWltFieldFinancePreview,
  getWltFieldFinanceSnapshot,
  getWltPartnerFinanceSnapshot,
  getWltPartnerSettlementPreview,
  resolveWltDshFinanceEventKindForPaymentMethod,
  resolveWltDshPaymentPreviewState,
  WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW,
  WLT_DSH_CONTROL_PANEL_FINANCE_CONTRACT,
  getAdaptedFinanceControlPanelRows,
  getWltDshPartnerSettlementStatementsPreview,
  getWltDshCaptainSettlementStatementsPreview,
};
