/**
 * WLT DSH Finance Preview â€” centralized preview data and accessor functions.
 * UI_PREVIEW_ONLY â€” not runtime, not accounting truth, not real settlements.
 * WLT owns all financial artifacts. DSH displays only.
 * Centralised here per DSH preview data ownership rules.
 */

import type {
  WltDshFinanceActor,
  WltDshFinanceEventKind,
  WltDshFinancePreviewRecord,
  WltDshFinanceTone,
  WltDshFinanceStatusTone,
  WltCaptainFinanceSnapshot,
  WltPartnerFinanceSnapshot,
  WltFieldFinanceSnapshot,
  WltDshPaymentMethod,
  WltDshPaymentOptionPreview,
  WltDshPaymentPreviewState,
  WltDshFulfillmentMode,
  WltDshOrderCommissionBreakdown,
  WltDshPartnerModeRatePreview,
  WltDshFinanceOwnership,
  WltDshFinanceBindingState,
  WltDshFinancePreviewMetadata,
  WltCaptainFinanceSection,
  WltDshOrderLineItemApplicability,
} from '../../../wlt/frontend/dsh/control-panel/models/dshFinance.types';
import {
  formatWltYer,
  WLT_DSH_FINANCE_OWNERSHIP,
  getWltDshFinancePreviewMetadata,
} from '../../../wlt/frontend/dsh/control-panel/models/dshFinance.types';

export type {
  WltDshFinanceActor,
  WltDshFinanceEventKind,
  WltDshFinancePreviewRecord,
  WltDshFinanceTone,
  WltDshFinanceStatusTone,
  WltCaptainFinanceSnapshot,
  WltPartnerFinanceSnapshot,
  WltFieldFinanceSnapshot,
  WltDshPaymentMethod,
  WltDshPaymentOptionPreview,
  WltDshPaymentPreviewState,
  WltDshFulfillmentMode,
  WltDshOrderCommissionBreakdown,
  WltDshPartnerModeRatePreview,
  WltDshFinanceOwnership,
  WltDshFinanceBindingState,
  WltDshFinancePreviewMetadata,
  WltCaptainFinanceSection,
  WltDshOrderLineItemApplicability,
};

// â”€â”€â”€ Internal formatter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function fmt(minorUnits: number): string {
  return formatWltYer(minorUnits);
}

// â”€â”€â”€ Preview Seeds â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PREVIEW_SEEDS: WltDshFinancePreviewRecord[] = [
  { id: 'WLT-TXN-001', actor: 'client', kind: 'client-payment', currencyCode: 'YER', amountMinorUnits: 1500000, amountLabel: fmt(1500000), tone: 'negative', title: 'Ø¯ÙØ¹ Ø·Ù„Ø¨', subtitle: 'Ø·Ù„Ø¨ Ø±Ù‚Ù… #ORD-2026-X1', statusLabel: 'Ù…ÙƒØªÙ…Ù„', statusTone: 'success', timeLabel: 'Ø§Ù„ÙŠÙˆÙ…ØŒ 10:30 Øµ', sourceOrderId: 'ORD-2026-X1', isPreview: true },
  { id: 'WLT-TXN-002', actor: 'client', kind: 'wallet-payment', currencyCode: 'YER', amountMinorUnits: 850000, amountLabel: fmt(850000), tone: 'negative', title: 'Ø¯ÙØ¹ Ø¨Ø§Ù„Ù…Ø­ÙØ¸Ø©', subtitle: 'Ø·Ù„Ø¨ Ø±Ù‚Ù… #ORD-2026-X3', statusLabel: 'Ù…ÙƒØªÙ…Ù„', statusTone: 'success', timeLabel: 'Ø§Ù„ÙŠÙˆÙ…ØŒ 12:10 Ù…', sourceOrderId: 'ORD-2026-X3', isPreview: true },
  { id: 'WLT-REF-401', actor: 'client', kind: 'refund-adjustment', currencyCode: 'YER', amountMinorUnits: 300000, amountLabel: fmt(300000), tone: 'positive', title: 'Ø§Ø³ØªØ±Ø¯Ø§Ø¯ Ø¬Ø²Ø¦ÙŠ', subtitle: 'Ø·Ù„Ø¨ Ø±Ù‚Ù… #ORD-2026-X1', statusLabel: 'ØªÙ…Øª Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©', statusTone: 'info', timeLabel: 'Ø§Ù„ÙŠÙˆÙ…ØŒ 11:00 Øµ', sourceOrderId: 'ORD-2026-X1', isPreview: true },
  { id: 'WLT-STL-101', actor: 'partner', kind: 'partner-settlement', currencyCode: 'YER', amountMinorUnits: 42500000, amountLabel: fmt(42500000), tone: 'positive', title: 'ØªØ³ÙˆÙŠØ© Ø£Ø³Ø¨ÙˆØ¹ÙŠØ©', subtitle: 'Ø¯ÙˆØ±Ø© Ø±Ù‚Ù… #CYC-05-01', statusLabel: 'ØªÙ… Ø§Ù„ØªØ­ÙˆÙŠÙ„', statusTone: 'success', timeLabel: 'Ø£Ù…Ø³', settlementCycleId: 'CYC-05-01', sourceStoreId: 'STORE-99', isPreview: true },
  { id: 'WLT-SDF-701', actor: 'partner', kind: 'store-delivery-fee', currencyCode: 'YER', amountMinorUnits: 1200000, amountLabel: fmt(1200000), tone: 'positive', title: 'Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±', subtitle: 'Ø·Ù„Ø¨ #ORD-2026-SD1 â€” partner_delivery', statusLabel: 'Ù…ÙƒØªÙ…Ù„', statusTone: 'success', timeLabel: 'Ø§Ù„ÙŠÙˆÙ…ØŒ 09:15 Øµ', sourceOrderId: 'ORD-2026-SD1', sourceStoreId: 'STORE-99', isPreview: true },
  { id: 'WLT-SCC-702', actor: 'partner', kind: 'store-courier-compensation', currencyCode: 'YER', amountMinorUnits: 400000, amountLabel: fmt(400000), tone: 'negative', title: 'ØªØ¹ÙˆÙŠØ¶ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±', subtitle: 'Ø§Ù„Ù…ØªØ¬Ø± ÙŠØ¯ÙØ¹ Ù„Ù…ÙˆØµÙ„Ù‡ Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠ â€” Ù„ÙŠØ³ ØªØ³ÙˆÙŠØ© ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ', statusLabel: 'Ù…Ø³Ø¬Ù‘Ù„ â€” Ù„ÙŠØ³ ØªØ³ÙˆÙŠØ© ÙƒØ§Ø¨ØªÙ†', statusTone: 'info', timeLabel: 'Ø§Ù„ÙŠÙˆÙ…ØŒ 09:15 Øµ', sourceOrderId: 'ORD-2026-SD1', sourceStoreId: 'STORE-99', isPreview: true },
  { id: 'WLT-COD-201', actor: 'captain', kind: 'captain-cod-liability', currencyCode: 'YER', amountMinorUnits: 2100000, amountLabel: fmt(2100000), tone: 'neutral', title: 'ØªØ­ØµÙŠÙ„ ÙƒØ§Ø´ â€” Ø°Ù…Ø© Ù…Ø³ØªØ­Ù‚Ø©', subtitle: 'Ø·Ù„Ø¨ Ø±Ù‚Ù… #ORD-2026-X2 â€” ÙŠØ¬Ø¨ Ø§Ù„Ø¥ÙŠØ¯Ø§Ø¹', statusLabel: 'Ø°Ù…Ø© Ù…Ø¹Ù„Ù‚Ø©', statusTone: 'warning', timeLabel: 'Ù…Ù†Ø° Ø³Ø§Ø¹ØªÙŠÙ†', sourceOrderId: 'ORD-2026-X2', sourceCaptainId: 'CAP-77', isPreview: true },
  { id: 'WLT-ERN-202', actor: 'captain', kind: 'captain-earning', currencyCode: 'YER', amountMinorUnits: 150000, amountLabel: fmt(150000), tone: 'positive', title: 'Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„', subtitle: 'Ø·Ù„Ø¨ Ø±Ù‚Ù… #ORD-2026-X2', statusLabel: 'ØªÙ… Ø§Ù„ÙƒØ³Ø¨', statusTone: 'success', timeLabel: 'Ù…Ù†Ø° Ø³Ø§Ø¹ØªÙŠÙ†', sourceOrderId: 'ORD-2026-X2', sourceCaptainId: 'CAP-77', isPreview: true },
  { id: 'WLT-FLD-301', actor: 'field', kind: 'field-commission', currencyCode: 'YER', amountMinorUnits: 500000, amountLabel: fmt(500000), tone: 'positive', title: 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ø³ØªÙ‚Ø·Ø§Ø¨ â€” Ù…Ø¹ØªÙ…Ø¯Ø©', subtitle: 'Ù…ØªØ¬Ø± #STORE-102', statusLabel: 'ØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚', statusTone: 'success', timeLabel: 'Ø§Ù„Ø§Ø«Ù†ÙŠÙ†', sourceStoreId: 'STORE-102', sourceFieldAgentId: 'FLD-88', isPreview: true },
  { id: 'WLT-FLD-303', actor: 'field', kind: 'field-commission-pending', currencyCode: 'YER', amountMinorUnits: 350000, amountLabel: fmt(350000), tone: 'neutral', title: 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ø³ØªÙ‚Ø·Ø§Ø¨ â€” Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©', subtitle: 'Ù…ØªØ¬Ø± #STORE-108', statusLabel: 'Ù…Ø¹Ù„Ù‚Ø©', statusTone: 'warning', timeLabel: 'Ø§Ù„Ø£Ø­Ø¯', sourceStoreId: 'STORE-108', sourceFieldAgentId: 'FLD-88', isPreview: true },
  { id: 'WLT-FLD-304', actor: 'field', kind: 'field-commission-rejected', currencyCode: 'YER', amountMinorUnits: 200000, amountLabel: fmt(200000), tone: 'negative', title: 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ø³ØªÙ‚Ø·Ø§Ø¨ â€” Ù…Ø±ÙÙˆØ¶Ø©', subtitle: 'Ù…ØªØ¬Ø± #STORE-110', statusLabel: 'Ù…Ø±ÙÙˆØ¶Ø©', statusTone: 'error', timeLabel: 'Ø§Ù„Ø®Ù…ÙŠØ³', sourceStoreId: 'STORE-110', sourceFieldAgentId: 'FLD-88', holdReason: 'Ø§Ù„Ù…ØªØ¬Ø± Ù„Ù… ÙŠÙƒÙ…Ù„ Ù…ØªØ·Ù„Ø¨Ø§Øª Ø§Ù„ØªÙØ¹ÙŠÙ„ Ø®Ù„Ø§Ù„ Ø§Ù„Ù…Ù‡Ù„Ø© Ø§Ù„Ù…Ø­Ø¯Ø¯Ø©', isPreview: true },
  { id: 'WLT-FLD-302', actor: 'field', kind: 'field-payout', currencyCode: 'YER', amountMinorUnits: 12000000, amountLabel: fmt(12000000), tone: 'negative', title: 'ØµØ±Ù Ø´Ù‡Ø±ÙŠ', subtitle: 'Ø£Ø¨Ø±ÙŠÙ„ 2026', statusLabel: 'ØªÙ… Ø§Ù„ØµØ±Ù', statusTone: 'success', timeLabel: '1 Ù…Ø§ÙŠÙˆ 2026', sourceFieldAgentId: 'FLD-88', isPreview: true },
  { id: 'WLT-COM-501', actor: 'control-panel', kind: 'platform-commission', currencyCode: 'YER', amountMinorUnits: 6375000, amountLabel: fmt(6375000), tone: 'positive', title: 'Ø¹Ù…ÙˆÙ„Ø© Ø§Ù„Ù…Ù†ØµØ©', subtitle: 'Ø¯ÙˆØ±Ø© #CYC-05-01', statusLabel: 'Ù…Ù‚ÙŠÙ‘Ø¯', statusTone: 'warning', timeLabel: 'Ø£Ù…Ø³', settlementCycleId: 'CYC-05-01', isPreview: true },
  { id: 'WLT-REC-601', actor: 'control-panel', kind: 'reconciliation-export', currencyCode: 'YER', amountMinorUnits: 0, amountLabel: 'â€” Ø¬Ø§Ø± Ø§Ù„Ù…Ø·Ø§Ø¨Ù‚Ø© â€”', tone: 'neutral', title: 'ØªØ³ÙˆÙŠØ© Ø§Ù„Ù…Ø·Ø§Ø¨Ù‚Ø©', subtitle: 'Ø¯ÙˆØ±Ø© Ù…Ø§ÙŠÙˆ 2026 â€” ØºÙŠØ± Ù…ØºÙ„Ù‚Ø©', statusLabel: 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©', statusTone: 'warning', timeLabel: '9 Ù…Ø§ÙŠÙˆ 2026', settlementCycleId: 'CYC-05-01', isPreview: true },
];

// â”€â”€â”€ Core accessors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function getWltDshFinanceRecordsForActor(actor: WltDshFinanceActor): WltDshFinancePreviewRecord[] {
  return PREVIEW_SEEDS.filter((r) => r.actor === actor);
}

function sumMinorUnits(records: WltDshFinancePreviewRecord[]): number {
  return records.reduce((acc, r) => {
    if (r.tone === 'positive') return acc + r.amountMinorUnits;
    if (r.tone === 'negative') return acc - r.amountMinorUnits;
    return acc;
  }, 0);
}

export function getWltDshFinanceSummaryForActor(actor: WltDshFinanceActor) {
  const records = getWltDshFinanceRecordsForActor(actor);
  const totalMinorUnits = sumMinorUnits(records);
  return { count: records.length, totalMinorUnits, totalLabel: fmt(Math.abs(totalMinorUnits)) };
}

export function getWltControlPanelFinancePreview() {
  const allRecords = PREVIEW_SEEDS;
  const totalInflowMinorUnits = allRecords.filter((r) => r.tone === 'positive').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const totalOutflowMinorUnits = allRecords.filter((r) => r.tone === 'negative').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return {
    allRecords,
    platformRecords: getWltDshFinanceRecordsForActor('control-panel'),
    clientRecords: getWltDshFinanceRecordsForActor('client'),
    partnerRecords: getWltDshFinanceRecordsForActor('partner'),
    captainRecords: getWltDshFinanceRecordsForActor('captain'),
    fieldRecords: getWltDshFinanceRecordsForActor('field'),
    totalInflowMinorUnits,
    totalInflowLabel: fmt(totalInflowMinorUnits),
    totalOutflowMinorUnits,
    totalOutflowLabel: fmt(totalOutflowMinorUnits),
    netMinorUnits: totalInflowMinorUnits - totalOutflowMinorUnits,
    netLabel: fmt(Math.abs(totalInflowMinorUnits - totalOutflowMinorUnits)),
    contractState: 'CONTRACT_TBD' as const,
    isPreview: true as const,
  };
}

export function resolveWltDshFinanceEventKindForPaymentMethod(method: 'cod' | 'wallet' | 'mixed' | 'official-wallets'): WltDshFinanceEventKind {
  if (method === 'cod') return 'cash-on-delivery';
  if (method === 'wallet' || method === 'mixed' || method === 'official-wallets') return 'wallet-payment';
  return 'client-payment';
}

// â”€â”€â”€ Per-actor preview helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function getWltPartnerSettlementPreview() {
  const records = getWltDshFinanceRecordsForActor('partner');
  const summary = getWltDshFinanceSummaryForActor('partner');
  const grossSalesMinorUnits = 50000000;
  const platformCommissionMinorUnits = 7500000;
  const deductionsMinorUnits = 2000000;
  const netSettlementMinorUnits = grossSalesMinorUnits - platformCommissionMinorUnits - deductionsMinorUnits;
  return { records, summary, grossSalesMinorUnits, grossSalesLabel: fmt(grossSalesMinorUnits), platformCommissionMinorUnits, platformCommissionLabel: fmt(platformCommissionMinorUnits), deductionsMinorUnits, deductionsLabel: fmt(deductionsMinorUnits), netSettlementMinorUnits, netSettlementLabel: fmt(netSettlementMinorUnits), nextSettlementMinorUnits: 8502500, nextSettlementLabel: fmt(8502500), cycleStatus: 'Ù†Ø´Ø·Ø©', cycleStartDate: '2026-05-01', cycleEndDate: '2026-05-07', nextPayoutDate: '2026-05-14', isPreview: true as const };
}

export function getWltCaptainFinancePreview() {
  const records = getWltDshFinanceRecordsForActor('captain');
  const codMinorUnits = records.filter((r) => r.kind === 'captain-cod-liability').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const earningMinorUnits = records.filter((r) => r.kind === 'captain-earning').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return { records, codLiabilityMinorUnits: codMinorUnits, codLiabilityLabel: fmt(codMinorUnits), earningsMinorUnits: earningMinorUnits, earningsLabel: fmt(earningMinorUnits), settlementMinorUnits: 0, settlementLabel: fmt(0), pendingPayoutMinorUnits: 150000, pendingPayoutLabel: fmt(150000), cycleLabel: 'Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ Ø§Ù„Ø­Ø§Ù„ÙŠ', eligibilityBalanceMinorUnits: 800000, eligibilityBalanceLabel: fmt(800000), minimumEligibilityMinorUnits: 1000000, minimumEligibilityLabel: fmt(1000000), isEligible: false, eligibilityShortfallMinorUnits: 200000, eligibilityShortfallLabel: fmt(200000), hasEligibilityBlock: true, eligibilityBlockReason: 'Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø¶Ø§Ù…Ù† Ø£Ù‚Ù„ Ù…Ù† Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¯Ù†Ù‰ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ â€” Ø´Ø­Ù† 2,000 Ø±.ÙŠ Ø¥Ø¶Ø§ÙÙŠØ© Ù„Ù„ØªØ£Ù‡Ù„', isPreview: true as const };
}

export function getWltFieldFinancePreview(stores?: string[]) {
  const records = getWltDshFinanceRecordsForActor('field');
  const filtered = stores ? records.filter((r) => !r.sourceStoreId || stores.includes(r.sourceStoreId)) : records;
  const totalCommissionMinorUnits = filtered.filter((r) => r.kind === 'field-commission').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const pendingCommissionsMinorUnits = filtered.filter((r) => r.kind === 'field-commission-pending').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const rejectedCommissionsMinorUnits = filtered.filter((r) => r.kind === 'field-commission-rejected').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return { records: filtered, commissionRecords: filtered.filter((r) => r.kind === 'field-commission'), pendingRecords: filtered.filter((r) => r.kind === 'field-commission-pending'), rejectedRecords: filtered.filter((r) => r.kind === 'field-commission-rejected'), payoutRecords: filtered.filter((r) => r.kind === 'field-payout'), totalCommissionMinorUnits, totalCommissionLabel: fmt(totalCommissionMinorUnits), pendingCommissionsMinorUnits, pendingCommissionsLabel: fmt(pendingCommissionsMinorUnits), rejectedCommissionsMinorUnits, rejectedCommissionsLabel: fmt(rejectedCommissionsMinorUnits), eligibleFilesCount: stores?.length ?? 12, lastPayoutMinorUnits: 12000000, lastPayoutLabel: fmt(12000000), lastPayoutDate: '2026-05-01', nextPayoutDate: '2026-06-01', isPreview: true as const };
}

export function getWltCaptainFinanceSnapshot(): WltCaptainFinanceSnapshot {
  const p = getWltCaptainFinancePreview();
  return { ...p, contractState: 'CONTRACT_TBD', isPreview: true };
}

export function getWltPartnerFinanceSnapshot(): WltPartnerFinanceSnapshot {
  const p = getWltPartnerSettlementPreview();
  return { settlementRecords: p.records, grossSalesMinorUnits: p.grossSalesMinorUnits, grossSalesLabel: p.grossSalesLabel, platformCommissionMinorUnits: p.platformCommissionMinorUnits, platformCommissionLabel: p.platformCommissionLabel, deductionsMinorUnits: p.deductionsMinorUnits, deductionsLabel: p.deductionsLabel, netSettlementMinorUnits: p.netSettlementMinorUnits, netSettlementLabel: p.netSettlementLabel, nextSettlementMinorUnits: p.nextSettlementMinorUnits, nextSettlementLabel: p.nextSettlementLabel, totalLabel: p.summary.totalLabel, cycleStatus: p.cycleStatus, cycleStartDate: p.cycleStartDate, cycleEndDate: p.cycleEndDate, nextPayoutDate: p.nextPayoutDate, contractState: 'CONTRACT_TBD', dataKind: 'preview', runtimeTruth: 'none â€” runtime_unbound', backendSource: 'none â€” preview_seeds_only', bindingSource: 'wlt_frontend_shared_finance', moneySemantics: 'display_only â€” no_accounting_effect', sourceLabel: 'WLT â€” preview seeds only', warnings: ['Ù…Ø¹Ø§ÙŠÙ†Ø© ÙÙ‚Ø· â€” Ù„Ø§ ØªÙ…Ø«Ù„ ØªØ³ÙˆÙŠØ© ÙØ¹Ù„ÙŠØ©', 'Ù„Ø§ ÙŠÙ…Ø«Ù„ Ø¨ÙŠØ§Ù†Ø§Øª Ù…Ø­Ø§Ø³Ø¨Ø© Ø£Ùˆ Ø¯ÙØ¹Ø§Øª Ù…Ù†ÙØ°Ø©', 'WLT ÙŠÙ…Ù„Ùƒ Ø§Ù„Ø­Ù‚ÙŠÙ‚Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ© â€” DSH ÙŠÙ…Ù„Ùƒ Ø³ÙŠØ§Ù‚ Ø§Ù„Ø·Ù„Ø¨ ÙˆØ§Ù„ØªÙˆØµÙŠÙ„ ÙÙ‚Ø·', 'DSH Ù„Ø§ ÙŠÙ…Ù„Ùƒ Ù…ØµØ¯Ø± Ø§Ù„Ø­Ù‚ÙŠÙ‚Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ© ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ù…Ø±Ø­Ù„Ø©'], isPreview: true };
}

export function getWltFieldFinanceSnapshot(stores?: string[]): WltFieldFinanceSnapshot {
  const p = getWltFieldFinancePreview(stores);
  return { ...p, contractState: 'CONTRACT_TBD', isPreview: true };
}

export function getWltDshClientPaymentPreview() {
  const records = getWltDshFinanceRecordsForActor('client');
  const summary = getWltDshFinanceSummaryForActor('client');
  return { records, paymentRecords: records.filter((r) => r.kind === 'client-payment' || r.kind === 'wallet-payment'), refundRecords: records.filter((r) => r.kind === 'refund-adjustment'), summary, isPreview: true as const };
}

export function getWltDshPaymentOptionsPreview(): WltDshPaymentOptionPreview[] {
  return [
    { id: 'cod', titleLabel: 'Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', descriptionLabel: 'Ø§Ø¯ÙØ¹ ÙƒØ§Ù…Ù„ Ø§Ù„Ù…Ø¨Ù„Øº Ø¹Ù†Ø¯ Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨.', availabilityLabel: 'Ù…ØªØ§Ø­ Ø¯Ø§Ø¦Ù…Ù‹Ø§', availabilityTone: 'success', isAvailable: true, isPreview: true },
    { id: 'wallet', titleLabel: 'Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© (WLT)', descriptionLabel: 'Ø§Ø¯ÙØ¹ Ù…Ù† Ø±ØµÙŠØ¯ Ù…Ø­ÙØ¸Ø© WLT Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠØ© Ø¥Ø°Ø§ ØªÙˆÙØ± Ø§Ù„Ø±ØµÙŠØ¯.', availabilityLabel: 'ÙŠØªØ·Ù„Ø¨ Ø±Ø¨Ø· ÙˆÙƒÙØ§ÙŠØ© Ø§Ù„Ø±ØµÙŠØ¯', availabilityTone: 'warning', isAvailable: false, isPreview: true },
    { id: 'mixed', titleLabel: 'Ø¯ÙØ¹ Ù…Ø¯Ù…Ø¬', descriptionLabel: 'Ø¬Ø²Ø¡ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© ÙˆØ§Ù„Ø¨Ø§Ù‚ÙŠ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….', availabilityLabel: 'ÙŠØªØ·Ù„Ø¨ Ø±ØµÙŠØ¯Ù‹Ø§ Ø¬Ø²Ø¦ÙŠÙ‹Ø§ ÙÙŠ WLT', availabilityTone: 'info', isAvailable: false, isPreview: true },
    { id: 'official-wallets', titleLabel: 'Ø§Ù„Ù…Ø­Ø§ÙØ¸ Ø§Ù„Ø±Ø³Ù…ÙŠØ©', descriptionLabel: 'Ø§Ø®ØªØ± Ù…Ø­ÙØ¸Ø© Ø±Ø³Ù…ÙŠØ© Ù…Ø¹ØªÙ…Ø¯Ø© Ù„Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ø¯ÙØ¹.', availabilityLabel: 'CONTRACT_TBD â€” ØºÙŠØ± Ù…ÙØ¹Ù‘Ù„', availabilityTone: 'warning', isAvailable: false, isPreview: true },
  ];
}

export function resolveWltDshPaymentPreviewState(method: WltDshPaymentMethod, orderTotalMinorUnits: number, walletBalanceMinorUnits: number, walletLinked: boolean): WltDshPaymentPreviewState {
  const base = { method, orderTotalMinorUnits, walletBalanceMinorUnits, walletLinked, contractState: 'CONTRACT_TBD' as const, financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(method), isPreview: true as const };
  if (method === 'cod') return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: true, summaryLabel: `Ø³ØªØ¯ÙØ¹ ${fmt(orderTotalMinorUnits)} Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….`, feedbackTone: 'info' };
  if (method === 'wallet') {
    if (!walletLinked) return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: false, summaryLabel: 'Ø§Ù„Ù…Ø­ÙØ¸Ø© ØºÙŠØ± Ù…Ø±ØªØ¨Ø·Ø©.', blockingLabel: 'Ø§Ø±Ø¨Ø· Ù…Ø­ÙØ¸Ø© WLT Ø£ÙˆÙ„Ù‹Ø§.', feedbackTone: 'warning' };
    if (walletBalanceMinorUnits < orderTotalMinorUnits) return { ...base, walletAmountMinorUnits: walletBalanceMinorUnits, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits - walletBalanceMinorUnits, valid: false, summaryLabel: `Ø§Ù„Ø±ØµÙŠØ¯ ${fmt(walletBalanceMinorUnits)} Ø£Ù‚Ù„ Ù…Ù† Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø¨.`, blockingLabel: `ØªØ­ØªØ§Ø¬ Ø´Ø­Ù† ${fmt(orderTotalMinorUnits - walletBalanceMinorUnits)} Ø¥Ø¶Ø§ÙÙŠÙ‹Ø§.`, feedbackTone: 'warning' };
    return { ...base, walletAmountMinorUnits: orderTotalMinorUnits, amountDueOnDeliveryMinorUnits: 0, valid: true, summaryLabel: `Ø§Ù„Ø±ØµÙŠØ¯ ÙŠÙƒÙÙŠ â€” Ø³ÙŠÙØ®ØµÙ… ${fmt(orderTotalMinorUnits)} Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©.`, feedbackTone: 'success' };
  }
  if (method === 'mixed') {
    if (!walletLinked || walletBalanceMinorUnits <= 0) return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: false, summaryLabel: 'Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø¯Ù…Ø¬ ÙŠØ­ØªØ§Ø¬ Ø±ØµÙŠØ¯Ù‹Ø§ ÙÙŠ Ø§Ù„Ù…Ø­ÙØ¸Ø©.', blockingLabel: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø±ØµÙŠØ¯ Ù…ØªØ§Ø­.', feedbackTone: 'warning' };
    if (walletBalanceMinorUnits >= orderTotalMinorUnits) return { ...base, walletAmountMinorUnits: orderTotalMinorUnits, amountDueOnDeliveryMinorUnits: 0, valid: false, summaryLabel: 'Ø§Ù„Ø±ØµÙŠØ¯ ÙŠÙƒÙÙŠ Ù„Ù„Ø¯ÙØ¹ Ø§Ù„ÙƒØ§Ù…Ù„ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©.', blockingLabel: 'Ø§Ø³ØªØ®Ø¯Ù… Ø®ÙŠØ§Ø± "Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø©".', feedbackTone: 'info' };
    return { ...base, walletAmountMinorUnits: walletBalanceMinorUnits, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits - walletBalanceMinorUnits, valid: true, summaryLabel: `${fmt(walletBalanceMinorUnits)} Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© + ${fmt(orderTotalMinorUnits - walletBalanceMinorUnits)} Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….`, feedbackTone: 'info' };
  }
  return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: 0, valid: false, summaryLabel: 'Ø§Ù„Ù…Ø­Ø§ÙØ¸ Ø§Ù„Ø±Ø³Ù…ÙŠØ© ØºÙŠØ± Ù…ÙØ¹Ù‘Ù„Ø© â€” CONTRACT_TBD.', blockingLabel: 'ÙŠØªØ·Ù„Ø¨ Ø±Ø¨Ø·Ù‹Ø§ Ø¨Ù€ API Ù„Ù… ÙŠÙØ¹Ø±ÙŽÙ‘Ù Ø¨Ø¹Ø¯.', feedbackTone: 'warning' };
}

export function getWltDshStoreDeliveryFinancePreview() {
  const feeRecords = PREVIEW_SEEDS.filter((r) => r.kind === 'store-delivery-fee');
  const compensationRecords = PREVIEW_SEEDS.filter((r) => r.kind === 'store-courier-compensation');
  const totalFeeMinorUnits = feeRecords.reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const totalCompensationMinorUnits = compensationRecords.reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return { feeRecords, compensationRecords, totalFeeMinorUnits, totalFeeLabel: fmt(totalFeeMinorUnits), totalCompensationMinorUnits, totalCompensationLabel: fmt(totalCompensationMinorUnits), captainPayoutApplies: false as const, separationNote: 'ØªØ¹ÙˆÙŠØ¶ Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø±: Ø§Ù„Ù…ØªØ¬Ø± ÙŠØ¯ÙØ¹ Ù„Ù…ÙˆØµÙ„Ù‡ â€” Ù„ÙŠØ³ ØªØ³ÙˆÙŠØ© ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ', isPreview: true as const };
}

// â”€â”€â”€ Commission breakdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function getWltDshOrderCommissionBreakdown(mode: WltDshFulfillmentMode): WltDshOrderCommissionBreakdown {
  const base = { fulfillmentMode: mode, commissionRatePreview: 'UI_PREVIEW_ONLY' as const, isPreview: true as const };
  if (mode === 'bthwani_delivery') return { ...base, fulfillmentModeLabel: 'ØªÙˆØµÙŠÙ„ Ø¨Ø«ÙˆØ§Ù†ÙŠ', deliveryFee: { applies: true, label: 'UI_PREVIEW_ONLY â€” WLT' }, platformCommission: { applies: true, label: 'UI_PREVIEW_ONLY â€” WLT' }, captainPayout: { applies: true, label: 'UI_PREVIEW_ONLY â€” WLT' }, partnerCourierCost: { applies: false, reason: 'Ù„Ø§ ÙŠÙ†Ø·Ø¨Ù‚ â€” ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ Ù‡Ùˆ Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„' }, partnerNet: { applies: true, label: 'UI_PREVIEW_ONLY â€” WLT' } };
  if (mode === 'partner_delivery') return { ...base, fulfillmentModeLabel: 'ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±', deliveryFee: { applies: true, label: 'UI_PREVIEW_ONLY â€” Ø­Ø³Ø¨ Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ù…ØªØ¬Ø±' }, platformCommission: { applies: true, label: 'UI_PREVIEW_ONLY â€” WLT' }, captainPayout: { applies: false, reason: 'Ù„Ø§ ÙŠÙ†Ø·Ø¨Ù‚ â€” Ù„Ø§ ÙƒØ§Ø¨ØªÙ† ÙÙŠ ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±' }, partnerCourierCost: { applies: true, label: 'UI_PREVIEW_ONLY â€” Ø­Ø³Ø¨ Ø§ØªÙØ§Ù‚ Ø§Ù„Ù…ØªØ¬Ø±' }, partnerNet: { applies: true, label: 'UI_PREVIEW_ONLY â€” WLT' } };
  return { ...base, fulfillmentModeLabel: 'Ø§Ø³ØªÙ„Ø§Ù… Ø¨Ù†ÙØ³ÙŠ', deliveryFee: { applies: false, reason: 'Ù„Ø§ Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„ â€” Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙŠØ³ØªÙ„Ù… Ø¨Ù†ÙØ³Ù‡' }, platformCommission: { applies: true, label: 'UI_PREVIEW_ONLY â€” WLT' }, captainPayout: { applies: false, reason: 'Ù„Ø§ ÙŠÙ†Ø·Ø¨Ù‚ â€” Ù„Ø§ ÙƒØ§Ø¨ØªÙ† ÙÙŠ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø°Ø§ØªÙŠ' }, partnerCourierCost: { applies: false, reason: 'Ù„Ø§ ÙŠÙ†Ø·Ø¨Ù‚ â€” Ù„Ø§ Ù…ÙˆØµÙ„ ÙÙŠ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø°Ø§ØªÙŠ' }, partnerNet: { applies: true, label: 'UI_PREVIEW_ONLY â€” WLT' } };
}

export const WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW: readonly WltDshPartnerModeRatePreview[] = [
  { partnerId: 'partner-saha', storeLabel: 'Ù…Ø­Ù…ØµØ© Ø§Ù„Ø³Ø§Ø­Ø©', rates: { bthwani_delivery: 'UI_PREVIEW_ONLY', partner_delivery: 'UI_PREVIEW_ONLY', pickup: 'UI_PREVIEW_ONLY' }, isPreview: true },
  { partnerId: 'partner-shorouq', storeLabel: 'Ø¨ÙˆÙÙŠÙ‡ Ø§Ù„Ø´Ø±ÙˆÙ‚', rates: { bthwani_delivery: 'UI_PREVIEW_ONLY', partner_delivery: 'UI_PREVIEW_ONLY', pickup: 'UI_PREVIEW_ONLY' }, isPreview: true },
  { partnerId: 'partner-zawya', storeLabel: 'Ù…Ø®Ø¨Ø² Ø§Ù„Ø²Ø§ÙˆÙŠØ©', rates: { bthwani_delivery: 'UI_PREVIEW_ONLY', partner_delivery: 'UI_PREVIEW_ONLY', pickup: 'UI_PREVIEW_ONLY' }, isPreview: true },
  { partnerId: 'partner-nokhba', storeLabel: 'ØªÙ…ÙˆØ± Ø§Ù„Ù†Ø®Ø¨Ø©', rates: { bthwani_delivery: 'UI_PREVIEW_ONLY', partner_delivery: 'UI_PREVIEW_ONLY', pickup: 'UI_PREVIEW_ONLY' }, isPreview: true },
];

// re-export formatter and ownership constants for convenience
export { formatWltYer, WLT_DSH_FINANCE_OWNERSHIP, getWltDshFinancePreviewMetadata };
