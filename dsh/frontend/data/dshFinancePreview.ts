/**
 * WLT DSH Finance Preview — centralized preview data and accessor functions.
 * DEV_ONLY — not runtime, not accounting truth, not real settlements.
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

// ─── Internal formatter ────────────────────────────────────────────

function fmt(minorUnits: number): string {
  return formatWltYer(minorUnits);
}

// ─── Preview Seeds ─────────────────────────────────────────────────

const PREVIEW_SEEDS: WltDshFinancePreviewRecord[] = [
  { id: 'WLT-TXN-001', actor: 'client', kind: 'client-payment', currencyCode: 'YER', amountMinorUnits: 1500000, amountLabel: fmt(1500000), tone: 'negative', title: 'دفع طلب', subtitle: 'طلب رقم #ORD-2026-X1', statusLabel: 'مكتمل', statusTone: 'success', timeLabel: 'اليوم، 10:30 ص', sourceOrderId: 'ORD-2026-X1', isPreview: true },
  { id: 'WLT-TXN-002', actor: 'client', kind: 'wallet-payment', currencyCode: 'YER', amountMinorUnits: 850000, amountLabel: fmt(850000), tone: 'negative', title: 'دفع بالمحفظة', subtitle: 'طلب رقم #ORD-2026-X3', statusLabel: 'مكتمل', statusTone: 'success', timeLabel: 'اليوم، 12:10 م', sourceOrderId: 'ORD-2026-X3', isPreview: true },
  { id: 'WLT-REF-401', actor: 'client', kind: 'refund-adjustment', currencyCode: 'YER', amountMinorUnits: 300000, amountLabel: fmt(300000), tone: 'positive', title: 'استرداد جزئي', subtitle: 'طلب رقم #ORD-2026-X1', statusLabel: 'تمت المعالجة', statusTone: 'info', timeLabel: 'اليوم، 11:00 ص', sourceOrderId: 'ORD-2026-X1', isPreview: true },
  { id: 'WLT-STL-101', actor: 'partner', kind: 'partner-settlement', currencyCode: 'YER', amountMinorUnits: 42500000, amountLabel: fmt(42500000), tone: 'positive', title: 'تسوية أسبوعية', subtitle: 'دورة رقم #CYC-05-01', statusLabel: 'تم التحويل', statusTone: 'success', timeLabel: 'أمس', settlementCycleId: 'CYC-05-01', sourceStoreId: 'STORE-99', isPreview: true },
  { id: 'WLT-SDF-701', actor: 'partner', kind: 'store-delivery-fee', currencyCode: 'YER', amountMinorUnits: 1200000, amountLabel: fmt(1200000), tone: 'positive', title: 'رسوم توصيل المتجر', subtitle: 'طلب #ORD-2026-SD1 — partner_delivery', statusLabel: 'مكتمل', statusTone: 'success', timeLabel: 'اليوم، 09:15 ص', sourceOrderId: 'ORD-2026-SD1', sourceStoreId: 'STORE-99', isPreview: true },
  { id: 'WLT-SCC-702', actor: 'partner', kind: 'store-courier-compensation', currencyCode: 'YER', amountMinorUnits: 400000, amountLabel: fmt(400000), tone: 'negative', title: 'تعويض موصل المتجر', subtitle: 'المتجر يدفع لموصله الداخلي — ليس تسوية كابتن بثواني', statusLabel: 'مسجّل — ليس تسوية كابتن', statusTone: 'info', timeLabel: 'اليوم، 09:15 ص', sourceOrderId: 'ORD-2026-SD1', sourceStoreId: 'STORE-99', isPreview: true },
  { id: 'WLT-COD-201', actor: 'captain', kind: 'captain-cod-liability', currencyCode: 'YER', amountMinorUnits: 2100000, amountLabel: fmt(2100000), tone: 'neutral', title: 'تحصيل كاش — ذمة مستحقة', subtitle: 'طلب رقم #ORD-2026-X2 — يجب الإيداع', statusLabel: 'ذمة معلقة', statusTone: 'warning', timeLabel: 'منذ ساعتين', sourceOrderId: 'ORD-2026-X2', sourceCaptainId: 'CAP-77', isPreview: true },
  { id: 'WLT-ERN-202', actor: 'captain', kind: 'captain-earning', currencyCode: 'YER', amountMinorUnits: 150000, amountLabel: fmt(150000), tone: 'positive', title: 'رسوم توصيل', subtitle: 'طلب رقم #ORD-2026-X2', statusLabel: 'تم الكسب', statusTone: 'success', timeLabel: 'منذ ساعتين', sourceOrderId: 'ORD-2026-X2', sourceCaptainId: 'CAP-77', isPreview: true },
  { id: 'WLT-FLD-301', actor: 'field', kind: 'field-commission', currencyCode: 'YER', amountMinorUnits: 500000, amountLabel: fmt(500000), tone: 'positive', title: 'عمولة استقطاب — معتمدة', subtitle: 'متجر #STORE-102', statusLabel: 'تم التحقق', statusTone: 'success', timeLabel: 'الاثنين', sourceStoreId: 'STORE-102', sourceFieldAgentId: 'FLD-88', isPreview: true },
  { id: 'WLT-FLD-303', actor: 'field', kind: 'field-commission-pending', currencyCode: 'YER', amountMinorUnits: 350000, amountLabel: fmt(350000), tone: 'neutral', title: 'عمولة استقطاب — قيد المراجعة', subtitle: 'متجر #STORE-108', statusLabel: 'معلقة', statusTone: 'warning', timeLabel: 'الأحد', sourceStoreId: 'STORE-108', sourceFieldAgentId: 'FLD-88', isPreview: true },
  { id: 'WLT-FLD-304', actor: 'field', kind: 'field-commission-rejected', currencyCode: 'YER', amountMinorUnits: 200000, amountLabel: fmt(200000), tone: 'negative', title: 'عمولة استقطاب — مرفوضة', subtitle: 'متجر #STORE-110', statusLabel: 'مرفوضة', statusTone: 'error', timeLabel: 'الخميس', sourceStoreId: 'STORE-110', sourceFieldAgentId: 'FLD-88', holdReason: 'المتجر لم يكمل متطلبات التفعيل خلال المهلة المحددة', isPreview: true },
  { id: 'WLT-FLD-302', actor: 'field', kind: 'field-payout', currencyCode: 'YER', amountMinorUnits: 12000000, amountLabel: fmt(12000000), tone: 'negative', title: 'صرف شهري', subtitle: 'أبريل 2026', statusLabel: 'تم الصرف', statusTone: 'success', timeLabel: '1 مايو 2026', sourceFieldAgentId: 'FLD-88', isPreview: true },
  { id: 'WLT-COM-501', actor: 'control-panel', kind: 'platform-commission', currencyCode: 'YER', amountMinorUnits: 6375000, amountLabel: fmt(6375000), tone: 'positive', title: 'عمولة المنصة', subtitle: 'دورة #CYC-05-01', statusLabel: 'مقيّد', statusTone: 'warning', timeLabel: 'أمس', settlementCycleId: 'CYC-05-01', isPreview: true },
  { id: 'WLT-REC-601', actor: 'control-panel', kind: 'reconciliation-export', currencyCode: 'YER', amountMinorUnits: 0, amountLabel: '— جار المطابقة —', tone: 'neutral', title: 'تسوية المطابقة', subtitle: 'دورة مايو 2026 — غير مغلقة', statusLabel: 'قيد المراجعة', statusTone: 'warning', timeLabel: '9 مايو 2026', settlementCycleId: 'CYC-05-01', isPreview: true },
];

// ─── Core accessors ────────────────────────────────────────────────

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

// ─── Per-actor preview helpers ─────────────────────────────────────

export function getWltPartnerSettlementPreview() {
  const records = getWltDshFinanceRecordsForActor('partner');
  const summary = getWltDshFinanceSummaryForActor('partner');
  const grossSalesMinorUnits = 50000000;
  const platformCommissionMinorUnits = 7500000;
  const deductionsMinorUnits = 2000000;
  const netSettlementMinorUnits = grossSalesMinorUnits - platformCommissionMinorUnits - deductionsMinorUnits;
  return { records, summary, grossSalesMinorUnits, grossSalesLabel: fmt(grossSalesMinorUnits), platformCommissionMinorUnits, platformCommissionLabel: fmt(platformCommissionMinorUnits), deductionsMinorUnits, deductionsLabel: fmt(deductionsMinorUnits), netSettlementMinorUnits, netSettlementLabel: fmt(netSettlementMinorUnits), nextSettlementMinorUnits: 8502500, nextSettlementLabel: fmt(8502500), cycleStatus: 'نشطة', cycleStartDate: '2026-05-01', cycleEndDate: '2026-05-07', nextPayoutDate: '2026-05-14', isPreview: true as const };
}

export function getWltCaptainFinancePreview() {
  const records = getWltDshFinanceRecordsForActor('captain');
  const codMinorUnits = records.filter((r) => r.kind === 'captain-cod-liability').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const earningMinorUnits = records.filter((r) => r.kind === 'captain-earning').reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return { records, codLiabilityMinorUnits: codMinorUnits, codLiabilityLabel: fmt(codMinorUnits), earningsMinorUnits: earningMinorUnits, earningsLabel: fmt(earningMinorUnits), settlementMinorUnits: 0, settlementLabel: fmt(0), pendingPayoutMinorUnits: 150000, pendingPayoutLabel: fmt(150000), cycleLabel: 'الأسبوع الحالي', eligibilityBalanceMinorUnits: 800000, eligibilityBalanceLabel: fmt(800000), minimumEligibilityMinorUnits: 1000000, minimumEligibilityLabel: fmt(1000000), isEligible: false, eligibilityShortfallMinorUnits: 200000, eligibilityShortfallLabel: fmt(200000), hasEligibilityBlock: true, eligibilityBlockReason: 'الرصيد الضامن أقل من الحد الأدنى المطلوب — شحن 2,000 ر.ي إضافية للتأهل', isPreview: true as const };
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
  return { settlementRecords: p.records, grossSalesMinorUnits: p.grossSalesMinorUnits, grossSalesLabel: p.grossSalesLabel, platformCommissionMinorUnits: p.platformCommissionMinorUnits, platformCommissionLabel: p.platformCommissionLabel, deductionsMinorUnits: p.deductionsMinorUnits, deductionsLabel: p.deductionsLabel, netSettlementMinorUnits: p.netSettlementMinorUnits, netSettlementLabel: p.netSettlementLabel, nextSettlementMinorUnits: p.nextSettlementMinorUnits, nextSettlementLabel: p.nextSettlementLabel, totalLabel: p.summary.totalLabel, cycleStatus: p.cycleStatus, cycleStartDate: p.cycleStartDate, cycleEndDate: p.cycleEndDate, nextPayoutDate: p.nextPayoutDate, contractState: 'CONTRACT_TBD', dataKind: 'preview', runtimeTruth: 'none — runtime_unbound', backendSource: 'none — preview_seeds_only', bindingSource: 'wlt_frontend_shared_finance', moneySemantics: 'display_only — no_accounting_effect', sourceLabel: 'WLT — preview seeds only', warnings: ['معاينة فقط — لا تمثل تسوية فعلية', 'لا يمثل بيانات محاسبة أو دفعات منفذة', 'WLT يملك الحقيقة المالية — DSH يملك سياق الطلب والتوصيل فقط', 'DSH لا يملك مصدر الحقيقة المالية في هذه المرحلة'], isPreview: true };
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
    { id: 'cod', titleLabel: 'الدفع عند الاستلام', descriptionLabel: 'ادفع كامل المبلغ عند استلام الطلب.', availabilityLabel: 'متاح دائمًا', availabilityTone: 'success', isAvailable: true, isPreview: true },
    { id: 'wallet', titleLabel: 'رصيد المحفظة (WLT)', descriptionLabel: 'ادفع من رصيد محفظة WLT الداخلية إذا توفر الرصيد.', availabilityLabel: 'يتطلب ربط وكفاية الرصيد', availabilityTone: 'warning', isAvailable: false, isPreview: true },
    { id: 'mixed', titleLabel: 'دفع مدمج', descriptionLabel: 'جزء من المحفظة والباقي عند الاستلام.', availabilityLabel: 'يتطلب رصيدًا جزئيًا في WLT', availabilityTone: 'info', isAvailable: false, isPreview: true },
    { id: 'official-wallets', titleLabel: 'المحافظ الرسمية', descriptionLabel: 'اختر محفظة رسمية معتمدة لإتمام الدفع.', availabilityLabel: 'CONTRACT_TBD — غير مفعّل', availabilityTone: 'warning', isAvailable: false, isPreview: true },
  ];
}

export function resolveWltDshPaymentPreviewState(method: WltDshPaymentMethod, orderTotalMinorUnits: number, walletBalanceMinorUnits: number, walletLinked: boolean): WltDshPaymentPreviewState {
  const base = { method, orderTotalMinorUnits, walletBalanceMinorUnits, walletLinked, contractState: 'CONTRACT_TBD' as const, financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(method), isPreview: true as const };
  if (method === 'cod') return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: true, summaryLabel: `ستدفع ${fmt(orderTotalMinorUnits)} عند الاستلام.`, feedbackTone: 'info' };
  if (method === 'wallet') {
    if (!walletLinked) return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: false, summaryLabel: 'المحفظة غير مرتبطة.', blockingLabel: 'اربط محفظة WLT أولًا.', feedbackTone: 'warning' };
    if (walletBalanceMinorUnits < orderTotalMinorUnits) return { ...base, walletAmountMinorUnits: walletBalanceMinorUnits, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits - walletBalanceMinorUnits, valid: false, summaryLabel: `الرصيد ${fmt(walletBalanceMinorUnits)} أقل من إجمالي الطلب.`, blockingLabel: `تحتاج شحن ${fmt(orderTotalMinorUnits - walletBalanceMinorUnits)} إضافيًا.`, feedbackTone: 'warning' };
    return { ...base, walletAmountMinorUnits: orderTotalMinorUnits, amountDueOnDeliveryMinorUnits: 0, valid: true, summaryLabel: `الرصيد يكفي — سيُخصم ${fmt(orderTotalMinorUnits)} من المحفظة.`, feedbackTone: 'success' };
  }
  if (method === 'mixed') {
    if (!walletLinked || walletBalanceMinorUnits <= 0) return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: false, summaryLabel: 'الدفع المدمج يحتاج رصيدًا في المحفظة.', blockingLabel: 'لا يوجد رصيد متاح.', feedbackTone: 'warning' };
    if (walletBalanceMinorUnits >= orderTotalMinorUnits) return { ...base, walletAmountMinorUnits: orderTotalMinorUnits, amountDueOnDeliveryMinorUnits: 0, valid: false, summaryLabel: 'الرصيد يكفي للدفع الكامل من المحفظة.', blockingLabel: 'استخدم خيار "رصيد المحفظة".', feedbackTone: 'info' };
    return { ...base, walletAmountMinorUnits: walletBalanceMinorUnits, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits - walletBalanceMinorUnits, valid: true, summaryLabel: `${fmt(walletBalanceMinorUnits)} من المحفظة + ${fmt(orderTotalMinorUnits - walletBalanceMinorUnits)} عند الاستلام.`, feedbackTone: 'info' };
  }
  return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: 0, valid: false, summaryLabel: 'المحافظ الرسمية غير مفعّلة — CONTRACT_TBD.', blockingLabel: 'يتطلب ربطًا بـ API لم يُعرَّف بعد.', feedbackTone: 'warning' };
}

export function getWltDshStoreDeliveryFinancePreview() {
  const feeRecords = PREVIEW_SEEDS.filter((r) => r.kind === 'store-delivery-fee');
  const compensationRecords = PREVIEW_SEEDS.filter((r) => r.kind === 'store-courier-compensation');
  const totalFeeMinorUnits = feeRecords.reduce((acc, r) => acc + r.amountMinorUnits, 0);
  const totalCompensationMinorUnits = compensationRecords.reduce((acc, r) => acc + r.amountMinorUnits, 0);
  return { feeRecords, compensationRecords, totalFeeMinorUnits, totalFeeLabel: fmt(totalFeeMinorUnits), totalCompensationMinorUnits, totalCompensationLabel: fmt(totalCompensationMinorUnits), captainPayoutApplies: false as const, separationNote: 'تعويض موصل المتجر: المتجر يدفع لموصله — ليس تسوية كابتن بثواني', isPreview: true as const };
}

// ─── Commission breakdown ──────────────────────────────────────────

export function getWltDshOrderCommissionBreakdown(mode: WltDshFulfillmentMode): WltDshOrderCommissionBreakdown {
  const base = { fulfillmentMode: mode, commissionRatePreview: 'RATE_NOT_SET' as const, isPreview: true as const };
  if (mode === 'bthwani_delivery') return { ...base, fulfillmentModeLabel: 'توصيل بثواني', deliveryFee: { applies: true, label: 'WLT' }, platformCommission: { applies: true, label: 'WLT' }, captainPayout: { applies: true, label: 'WLT' }, partnerCourierCost: { applies: false, reason: 'لا ينطبق — كابتن بثواني هو المسؤول' }, partnerNet: { applies: true, label: 'WLT' } };
  if (mode === 'partner_delivery') return { ...base, fulfillmentModeLabel: 'توصيل المتجر', deliveryFee: { applies: true, label: 'حسب سياسة المتجر' }, platformCommission: { applies: true, label: 'WLT' }, captainPayout: { applies: false, reason: 'لا ينطبق — لا كابتن في توصيل المتجر' }, partnerCourierCost: { applies: true, label: 'حسب اتفاق المتجر' }, partnerNet: { applies: true, label: 'WLT' } };
  return { ...base, fulfillmentModeLabel: 'استلام بنفسي', deliveryFee: { applies: false, reason: 'لا رسوم توصيل — العميل يستلم بنفسه' }, platformCommission: { applies: true, label: 'WLT' }, captainPayout: { applies: false, reason: 'لا ينطبق — لا كابتن في الاستلام الذاتي' }, partnerCourierCost: { applies: false, reason: 'لا ينطبق — لا موصل في الاستلام الذاتي' }, partnerNet: { applies: true, label: 'WLT' } };
}

export const WLT_DSH_PARTNER_MODE_RATE_TABLE_PREVIEW: readonly WltDshPartnerModeRatePreview[] = [
  { partnerId: 'partner-saha', storeLabel: 'محمصة الساحة', rates: { bthwani_delivery: 'RATE_NOT_SET', partner_delivery: 'RATE_NOT_SET', pickup: 'RATE_NOT_SET' }, isPreview: true },
  { partnerId: 'partner-shorouq', storeLabel: 'بوفيه الشروق', rates: { bthwani_delivery: 'RATE_NOT_SET', partner_delivery: 'RATE_NOT_SET', pickup: 'RATE_NOT_SET' }, isPreview: true },
  { partnerId: 'partner-zawya', storeLabel: 'مخبز الزاوية', rates: { bthwani_delivery: 'RATE_NOT_SET', partner_delivery: 'RATE_NOT_SET', pickup: 'RATE_NOT_SET' }, isPreview: true },
  { partnerId: 'partner-nokhba', storeLabel: 'تمور النخبة', rates: { bthwani_delivery: 'RATE_NOT_SET', partner_delivery: 'RATE_NOT_SET', pickup: 'RATE_NOT_SET' }, isPreview: true },
];

// re-export formatter and ownership constants for convenience
export { formatWltYer, WLT_DSH_FINANCE_OWNERSHIP, getWltDshFinancePreviewMetadata };
