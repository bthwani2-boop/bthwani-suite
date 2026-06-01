'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  getWltDshPartnerSettlementStatementsPreview,
  type WltDshPartnerStatement as PartnerStatement,
  getWltPostingRuleForEvent,
  getWltAccountByCode,
} from '../financeContracts';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

const STATUS_LABEL: Record<PartnerStatement['status'], string> = {
  draft: 'مسودة معاينة',
  ready_for_payout: 'جاهز للصرف',
  held: 'محجوز مؤقتاً 🚨',
  completed: 'مكتمل الصرف ✓',
};

const PAYOUT_STATUS_LABEL: Record<string, string> = {
  included: 'مشمول في الدورة ج',
  paid: 'مدفوع مسبقاً ✓',
  held: 'محجوز 🔒',
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={wltStyles.reconciliationSummaryCard}>
      <div className={wltStyles.kpiLabel}>{label}</div>
      <div className={wltStyles.kpiValue} style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}

export function WltDshPartnerStatement({ technicalAuditMode = false }: { technicalAuditMode?: boolean } = {}) {
  const statements = React.useMemo(() => getWltDshPartnerSettlementStatementsPreview(), []);

  const [activePartnerId, setActivePartnerId] = React.useState<string>(statements[0]?.partnerId ?? '');
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | null>(null);

  const statement = React.useMemo(() => {
    return statements.find((s) => s.partnerId === activePartnerId) || statements[0];
  }, [statements, activePartnerId]);

  const selectedStore = React.useMemo(() => {
    if (!statement) return null;
    return statement.storeBreakdown.find((s) => s.storeId === selectedStoreId) || null;
  }, [statement, selectedStoreId]);

  if (!statement) {
    return (
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line">
        <Text role="titleSm">لا توجد تسويات شركاء في معاينة WLT.</Text>
      </Box>
    );
  }

  // Fetch Posting Rules for Partner Settlements
  const postingRules = React.useMemo(() => {
    return [
      getWltPostingRuleForEvent('partner-settlement'),
      getWltPostingRuleForEvent('store-delivery-fee'),
    ].filter(Boolean);
  }, []);

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      {/* Partner Selection Switcher */}
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div className={wltStyles.partnerHeaderFlex}>
          <div className={wltStyles.partnerTitleFlex}>
            <Text role="titleMd" style={{ fontWeight: 800 }}>كشف الحساب الموحد للشريك</Text>
            <div className={wltStyles.storeSelectorButtonsFlex}>
              {statements.map((s) => (
                <button
                  key={s.partnerId}
                  onClick={() => {
                    setActivePartnerId(s.partnerId);
                    setSelectedStoreId(null);
                  }}
                  className={`${wltStyles.storeSelectorBtn} ${
                    s.partnerId === activePartnerId ? wltStyles.storeSelectorBtnActive : ''
                  }`}
                >
                  {s.partnerName}
                </button>
              ))}
            </div>
          </div>
          <div className={wltStyles.partnerMetaFlex}>
            <span className={wltStyles.partnerPeriodBadge}>
              دورة: {statement.periodStart} إلى {statement.periodEnd}
            </span>
            <span
              className={`${wltStyles.partnerStatusBadge} ${
                statement.status === 'held'
                  ? wltStyles.partnerStatusWarning
                  : wltStyles.partnerStatusSuccess
              }`}
            >
              {STATUS_LABEL[statement.status]}
            </span>
          </div>
        </div>
      </Box>

      {/* Metrics strip */}
      <div className={wltStyles.metricsGrid}>
        <Metric label="بداية الدورة" value={statement.periodStart} />
        <Metric label="نهاية الدورة" value={statement.periodEnd} />
        <Metric label="تاريخ الصرف المتوقع" value={statement.expectedPayoutDate} />
        <Metric label="المبيعات الإجمالية" value={statement.grossSalesLabel} />
        <Metric label="عمولة المنصة (8%)" value={statement.platformCommissionLabel} />
        <Metric label="إجمالي الخصومات" value={statement.deductionsLabel} />
        <Metric label="صافي مستحقات الشريك" value={statement.netSettlementLabel} />
        <Metric label="مدفوع مسبقاً" value={statement.paidToDateLabel} />
        <Metric label="متبقي قيد التصفية" value={statement.remainingPayableLabel} />
      </div>

      {/* Workbench Layout: Table + Inspector */}
      <div
        className={`${wltStyles.partnerLayout} ${
          selectedStore ? wltStyles.partnerLayoutWithDetails : ''
        }`}
      >
        {/* Stores Table Container */}
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
          <div className={wltStyles.tableHeaderFlex}>
            <Text role="titleSm" style={{ fontWeight: 800 }}>توزيع المستحقات المالية للمتاجر التابعة</Text>
            <span className={wltStyles.readinessDesc}>
              اضغط على أي متجر لعرض تفاصيل الصرف البنكي وقنوات التحويل المرتبطة.
            </span>
          </div>

          <div className={wltStyles.tableWrap}>
            <table className={wltStyles.statementTable}>
              <thead>
                <tr>
                  {['معرّف المتجر', 'اسم المتجر', 'مبيعات المتجر', 'العمولة المقتطعة', 'الخصومات', 'صافي التسوية للمتجر', 'حالة الصرف', 'موعد الصرف المتوقع'].map((header) => (
                    <th key={header} className={wltStyles.partnerStoreTh}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statement.storeBreakdown.map((store) => {
                  const isSelected = selectedStoreId === store.storeId;
                  const statusColor =
                    store.payoutStatus === 'paid'
                      ? wltStyles.statusPosted
                      : store.payoutStatus === 'held'
                      ? wltStyles.statusBlocked
                      : wltStyles.statusPending;

                  return (
                    <tr
                      key={store.storeId}
                      onClick={() => setSelectedStoreId(isSelected ? null : store.storeId)}
                      className={`${wltStyles.partnerStoreRow} ${isSelected ? wltStyles.partnerStoreRowActive : ''}`}
                    >
                      <td className={`${wltStyles.partnerStoreTd} ${wltStyles.statementTdBold}`}>{store.storeId}</td>
                      <td className={wltStyles.partnerStoreTd}>{store.storeName}</td>
                      <td className={`${wltStyles.partnerStoreTd} ${wltStyles.statementTdTabular}`}>
                        {store.grossSalesLabel}
                      </td>
                      <td className={`${wltStyles.partnerStoreTd} ${wltStyles.statementTdTabular}`}>
                        {store.platformCommissionLabel}
                      </td>
                      <td className={`${wltStyles.partnerStoreTd} ${wltStyles.statementTdTabular}`}>
                        {store.deductionsLabel}
                      </td>
                      <td className={`${wltStyles.partnerStoreTd} ${wltStyles.statementTdBold} ${wltStyles.statementTdTabular}`}>
                        {store.netSettlementLabel}
                      </td>
                      <td className={wltStyles.partnerStoreTd}>
                        <span className={`${wltStyles.statusBadge} ${statusColor}`}>
                          {PAYOUT_STATUS_LABEL[store.payoutStatus]}
                        </span>
                      </td>
                      <td className={wltStyles.partnerStoreTd}>{store.expectedPayoutDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Box>

        {/* Store Payout Detail Inspector */}
        {selectedStore && (
          <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={3}>
            <div className={wltStyles.inspectorHeader}>
              <span className={wltStyles.inspectorTitle}>تفاصيل مستحقات متجر الشريك</span>
              <button onClick={() => setSelectedStoreId(null)} className={wltStyles.inspectorCloseBtn}>
                ✕
              </button>
            </div>
            <hr className={wltStyles.inspectorSeparator} />

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>اسم ومعرّف المتجر</span>
              <span className={wltStyles.inspectorMetaVal}>
                {selectedStore.storeName} ({selectedStore.storeId})
              </span>
            </Box>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>الحساب البنكي المرتبط بصرف المتجر</span>
              <span className={wltStyles.inspectorMetaVal}>
                بنك اليمن والكويت - حساب رقم: <code style={{ fontSize: 11, fontFamily: 'monospace' }}>2020-77981-01</code>
              </span>
            </Box>

            <div className={wltStyles.storeDetailsCard}>
              <span className={wltStyles.inspectorMetaKey} style={{ display: 'block', marginBottom: 4 }}>
                ملخص أداء المتجر المالي:
              </span>
              <div className={wltStyles.storeDetailsRow}>
                <span>المبيعات الإجمالية:</span>
                <span className={wltStyles.storeDetailsRowTabular}>{selectedStore.grossSalesLabel}</span>
              </div>
              <div className={`${wltStyles.storeDetailsRow} ${wltStyles.inspectorImpactRowDanger}`}>
                <span>عمولة المنصة (8%):</span>
                <span className={wltStyles.storeDetailsRowTabular}>- {selectedStore.platformCommissionLabel}</span>
              </div>
              <div className={`${wltStyles.storeDetailsRow} ${wltStyles.inspectorImpactRowDanger}`}>
                <span>الخصومات والاسترداد:</span>
                <span className={wltStyles.storeDetailsRowTabular}>- {selectedStore.deductionsLabel}</span>
              </div>
              <hr className={wltStyles.storeDetailsSeparator} />
              <div className={wltStyles.inspectorImpactTotalRow}>
                <span>صافي مستحقات المتجر:</span>
                <span className={wltStyles.storeDetailsRowTabular}>{selectedStore.netSettlementLabel}</span>
              </div>
            </div>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>حالة الصرف والتعليق</span>
              <span className={wltStyles.inspectorMetaVal}>
                {PAYOUT_STATUS_LABEL[selectedStore.payoutStatus]}
              </span>
              {selectedStore.payoutStatus === 'held' && (
                <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className={wltStyles.inspectorMetaKey} style={{ color: 'var(--bth-danger-text)' }}>سبب الحظر المالي:</span>
                  <p style={{ fontSize: 11, color: 'var(--bth-danger-text)', margin: 0, lineHeight: '18px' }}>
                    يوجد حجز احترازي معلق على المتجر من WLT Engine لدواعي تدقيق الفروقات في المدفوعات المسبقة.
                  </p>
                </div>
              )}
            </Box>
          </Box>
        )}
      </div>

      {/* Technical Audit mode (collapsible info panel) */}
      {technicalAuditMode && (
        <Box
          padding={3}
          background="surfaceRaised"
          radiusToken="lg"
          border
          borderTone="line"
          gap={2}
          className={wltStyles.postingRulesAuditPanel}
        >
          <span className={wltStyles.postingRulesAuditTitle}>
            بوابة التدقيق والمطابقة - القيود المحاسبية لقواعد تسوية الشريك (SSoT Posting Rules)
          </span>
          <hr className={wltStyles.inspectorSeparator} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className={wltStyles.readinessDesc}>القيود المالية لترحيل تسوية الشريك والعمولات المرتبطة:</span>
            <div className={wltStyles.techGrid}>
              {postingRules.map((rule) => {
                if (!rule) return null;
                const debitAccount = getWltAccountByCode(rule.debitAccountCode);
                const creditAccount = getWltAccountByCode(rule.creditAccountCode);
                return (
                  <div key={rule.eventKind} className={wltStyles.postingRulesCard}>
                    <span className={wltStyles.inspectorMetaVal} style={{ display: 'block', marginBottom: 4 }}>
                      نوع الحركة: {rule.label}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                      <span className={wltStyles.kpiValueOutflow}>مدين (Dr): {debitAccount?.code}</span>
                      <span className={wltStyles.inspectorMetaVal}>{debitAccount?.label}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 4 }}>
                      <span className={wltStyles.kpiValueInflow}>دائن (Cr): {creditAccount?.code}</span>
                      <span className={wltStyles.inspectorMetaVal}>{creditAccount?.label}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginTop: 6, color: 'var(--bth-control-panel-text-muted)' }}>
                      <span className={wltStyles.inspectorMetaKey}>دفتر مساعد: {rule.subledgerId}</span>
                      <span className={wltStyles.inspectorMetaKey}>maker approval: {rule.requiresMakerApproval ? 'نعم' : 'لا'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Box>
      )}
    </Box>
  );
}

export default WltDshPartnerStatement;
