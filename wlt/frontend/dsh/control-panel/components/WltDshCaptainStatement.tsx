'use client';

import React from 'react';
import { Box, Text,
  radius,
} from '@bthwani/ui-kit';
import {
  getWltDshCaptainSettlementStatementsPreview,
  type WltDshCaptainStatement as CaptainStatement,
  type WltDshCaptainCodBag as CaptainCodBag,
  type WltDshCaptainEarningLine as CaptainEarningLine,
} from '../financeContracts';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

const STATUS_LABEL: Record<CaptainStatement['status'], string> = {
  active: 'نشط ومؤهل',
  blocked: 'موقوف مؤقتاً',
  pending_clearance: 'قيد المطابقة',
};

const COD_BAG_STATUS_LABEL: Record<CaptainCodBag['status'], string> = {
  unsubmitted: 'لم تُسلّم بعد',
  pending_wlt_clearance: 'قيد مراجعة WLT',
  cleared: 'تمت التسوية',
};

const EARNING_STATUS_LABEL: Record<CaptainEarningLine['status'], string> = {
  included: 'مشمول في الدورة',
  withheld_payout: 'محجوز مؤقتاً',
  paid: 'مدفوع مسبقاً',
};

function Metric({ label, value, tone }: { label: string; value: string; tone?: 'inflow' | 'outflow' | 'net' }) {
  const valueClass =
    tone === 'inflow'
      ? wltStyles.kpiValueInflow
      : tone === 'outflow'
      ? wltStyles.kpiValueOutflow
      : tone === 'net'
      ? wltStyles.kpiValueNet
      : '';

  return (
    <div className={wltStyles.reconciliationSummaryCard || wltStyles.postingRulesCard} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid var(--bth-control-panel-border)', background: 'var(--bth-control-panel-surface-raised)' }}>
      <div className={wltStyles.kpiLabel}>{label}</div>
      <div className={`${wltStyles.kpiValue} ${valueClass}`} style={{ fontSize: 14 }}>
        {value}
      </div>
    </div>
  );
}

export function WltDshCaptainStatement() {
  const statements = React.useMemo(() => getWltDshCaptainSettlementStatementsPreview(), []);

  const [activeCaptainId, setActiveCaptainId] = React.useState<string>(statements[0]?.captainId ?? '');
  const [activeTab, setActiveTab] = React.useState<'earnings' | 'cod'>('earnings');

  // Inspector selection states
  const [selectedBagId, setSelectedBagId] = React.useState<string | null>(null);
  const [selectedEarningId, setSelectedEarningId] = React.useState<string | null>(null);

  const statement = React.useMemo(() => {
    return statements.find((s) => s.captainId === activeCaptainId) || statements[0];
  }, [statements, activeCaptainId]);

  const selectedBag = React.useMemo(() => {
    if (!statement || activeTab !== 'cod') return null;
    return statement.codBags.find((b) => b.bagId === selectedBagId) || null;
  }, [statement, activeTab, selectedBagId]);

  const selectedEarning = React.useMemo(() => {
    if (!statement || activeTab !== 'earnings') return null;
    return statement.earnings.find((e) => e.earningId === selectedEarningId) || null;
  }, [statement, activeTab, selectedEarningId]);

  const hasInspectorOpen = !!selectedBag || !!selectedEarning;

  // Clear selections when switching captain or tab
  React.useEffect(() => {
    setSelectedBagId(null);
    setSelectedEarningId(null);
  }, [activeCaptainId, activeTab]);

  if (!statement) {
    return (
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ direction: 'rtl' }}>
        <Text role="titleSm" style={{ textAlign: 'right' }}>لا توجد بيانات تسويات كباتن في معاينة WLT.</Text>
      </Box>
    );
  }

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>

      {/* Captain Profile Card & Selector Header */}
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div className={wltStyles.captainProfileFlex}>
          <div className={wltStyles.captainTitleFlex}>
            <Text role="titleMd" weight="black">كشف مستحقات وذمم الكابتن</Text>
            <div className={wltStyles.storeSelectorButtonsFlex}>
              {statements.map((s) => (
                <button
                  key={s.captainId}
                  onClick={() => setActiveCaptainId(s.captainId)}
                  className={`${wltStyles.storeSelectorBtn} ${
                    s.captainId === activeCaptainId ? wltStyles.storeSelectorBtnActive : ''
                  }`}
                >
                  {s.captainName}
                </button>
              ))}
            </div>
          </div>
          <div className={wltStyles.captainMetaFlex}>
            <span style={{ fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: radius.xs, fontWeight: 700 }}>
              معرّف الكابتن: {statement.captainId}
            </span>
            <span
              className={`${wltStyles.captainStatusBadge} ${
                statement.status === 'active'
                  ? wltStyles.captainStatusActive
                  : statement.status === 'blocked'
                  ? wltStyles.captainStatusBlocked
                  : wltStyles.captainStatusPending
              }`}
            >
              {STATUS_LABEL[statement.status]}
            </span>
          </div>
        </div>
      </Box>

      {/* Shortfall warning banner if eligibility is blocked */}
      {statement.hasEligibilityBlock && (
        <div className={wltStyles.captainShortfallBanner}>
          <span className={wltStyles.captainShortfallText}>
            ⚠️ {statement.eligibilityBlockReason} (الرصيد الحالي: {statement.eligibilityBalanceLabel} · الحد الأدنى: {statement.minimumEligibilityLabel})
          </span>
          <button
            onClick={() => console.warn('[WLT-PREVIEW] Top-up للكابتن:', statement.eligibilityShortfallLabel)}
            className={wltStyles.captainShortfallBtn}
          >
            طلب شحن الضمان
          </button>
        </div>
      )}

      {/* Aggregated Metrics strip */}
      <div className={wltStyles.metricsGrid}>
        <Metric label="رصيد الضمان الحالي" value={statement.eligibilityBalanceLabel} tone={statement.isEligible ? 'inflow' : 'outflow'} />
        <Metric label="الحد الأدنى للتأهل" value={statement.minimumEligibilityLabel} />
        <Metric label="إجمالي الأرباح المحققة" value={statement.grossEarningsLabel} />
        <Metric label="ما تم صرفه مسبقاً" value={statement.paidToDateLabel} tone="inflow" />
        <Metric label="ذمم الكاش المعلقة (COD)" value={statement.outstandingCodLiabilityLabel} tone="outflow" />
        <Metric label="صافي المستحقات المتبقية" value={statement.netPayableLabel} tone="net" />
      </div>

      {/* Tab Switcher for Workbench Views */}
      <div className={wltStyles.captainTabContainer}>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`${wltStyles.captainTabBtn} ${activeTab === 'earnings' ? wltStyles.captainTabBtnActive : ''}`}
        >
          أرباح التوصيل والحوافز ({statement.earnings.length})
        </button>
        <button
          onClick={() => setActiveTab('cod')}
          className={`${wltStyles.captainTabBtn} ${activeTab === 'cod' ? wltStyles.captainTabBtnActive : ''}`}
        >
          ذمم الكاش المقبوضة COD ({statement.codBags.length})
        </button>
      </div>

      {/* Workbench Layout: Grid table + Sidebar Drawer */}
      <div
        className={`${wltStyles.workbenchLayout} ${
          hasInspectorOpen ? wltStyles.workbenchLayoutWithInspector : ''
        }`}
      >
        {/* Main Details Table */}
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
          <div className={wltStyles.tableHeaderFlex}>
            <Text role="titleSm" weight="black">
              {activeTab === 'earnings' ? 'سجل مستحقات التوصيل والحوافز الإضافية' : 'سجل توريد حقائب النقدية (COD Bags)'}
            </Text>
            <span style={{ fontSize: 10, color: 'var(--bth-control-panel-text-muted)' }}>
              اضغط على أي حركة لمعاينة إيصال الإيداع أو تفاصيل التحويل وقنوات الصرف.
            </span>
          </div>

          <div className={wltStyles.tableWrap}>
            {activeTab === 'earnings' ? (
              <table className={wltStyles.statementTable}>
                <thead>
                  <tr>
                    {['رقم الحركة', 'رقم الطلب', 'تاريخ العمل', 'رسوم التوصيل', 'الحوافز الإضافية', 'رسوم المنصة', 'الصافي المستحق', 'حالة الصرف', 'تاريخ التحويل'].map((h) => (
                      <th key={h} className={wltStyles.statementTh}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {statement.earnings.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '20px', color: 'var(--bth-control-panel-text-muted)' }}>
                        لا توجد حركات أرباح توصيل مسجلة.
                      </td>
                    </tr>
                  ) : (
                    statement.earnings.map((e) => {
                      const isSelected = selectedEarningId === e.earningId;
                      const statusColor =
                        e.status === 'paid'
                          ? wltStyles.statusPosted
                          : e.status === 'withheld_payout'
                          ? wltStyles.statusBlocked
                          : wltStyles.statusPending;

                      return (
                        <tr
                          key={e.earningId}
                          onClick={() => setSelectedEarningId(isSelected ? null : e.earningId)}
                          className={`${wltStyles.statementRow} ${isSelected ? wltStyles.statementRowActive : ''}`}
                        >
                          <td className={`${wltStyles.statementTd} ${wltStyles.statementTdBold}`}>{e.earningId}</td>
                          <td className={wltStyles.statementTd}>{e.orderId}</td>
                          <td className={wltStyles.statementTd}>{e.date}</td>
                          <td className={`${wltStyles.statementTd} ${wltStyles.statementTdTabular}`}>{e.deliveryFeeLabel}</td>
                          <td className={`${wltStyles.statementTd} ${wltStyles.statementTdTabular}`}>{e.bonusLabel}</td>
                          <td className={`${wltStyles.statementTd} ${wltStyles.statementTdTabular}`}>{e.platformFeeLabel}</td>
                          <td className={`${wltStyles.statementTd} ${wltStyles.statementTdBold} ${wltStyles.statementTdTabular}`}>{e.netLabel}</td>
                          <td className={wltStyles.statementTd}>
                            <span className={`${wltStyles.statusBadge} ${statusColor}`}>
                              {EARNING_STATUS_LABEL[e.status]}
                            </span>
                          </td>
                          <td className={wltStyles.statementTd}>{e.payoutDate}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            ) : (
              <table className={wltStyles.statementTable}>
                <thead>
                  <tr>
                    {['رقم الحقيبة', 'مرجع الطلب', 'تاريخ المقبوضات', 'مبلغ الكاش المجموع', 'حالة مطابقة WLT', 'مستند الإيداع', 'ملاحظات الحركة'].map((h) => (
                      <th key={h} className={wltStyles.statementTh}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {statement.codBags.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'var(--bth-control-panel-text-muted)' }}>
                        لا توجد ذمم كاش COD معلقة للحقائب.
                      </td>
                    </tr>
                  ) : (
                    statement.codBags.map((b) => {
                      const isSelected = selectedBagId === b.bagId;
                      const statusColor =
                        b.status === 'cleared'
                          ? wltStyles.statusPosted
                          : b.status === 'pending_wlt_clearance'
                          ? wltStyles.statusPending
                          : wltStyles.statusBlocked;

                      return (
                        <tr
                          key={b.bagId}
                          onClick={() => setSelectedBagId(isSelected ? null : b.bagId)}
                          className={`${wltStyles.statementRow} ${isSelected ? wltStyles.statementRowActive : ''}`}
                        >
                          <td className={`${wltStyles.statementTd} ${wltStyles.statementTdBold}`}>{b.bagId}</td>
                          <td className={wltStyles.statementTd}>{b.orderId}</td>
                          <td className={wltStyles.statementTd}>{b.date}</td>
                          <td className={`${wltStyles.statementTd} ${wltStyles.statementTdBold} ${wltStyles.statementTdTabular}`}>{b.amountLabel}</td>
                          <td className={wltStyles.statementTd}>
                            <span className={`${wltStyles.statusBadge} ${statusColor}`}>
                              {COD_BAG_STATUS_LABEL[b.status]}
                            </span>
                          </td>
                          <td className={wltStyles.statementTd}>
                            <span className={wltStyles.evidenceCode}>{b.evidenceRef}</span>
                          </td>
                          <td className={wltStyles.statementTd} style={{ maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {b.notes}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Box>

        {/* Sidebar Inspector Drawer */}
        {selectedBag && (
          <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={3}>
            <div className={wltStyles.inspectorHeader}>
              <span className={wltStyles.inspectorTitle}>تفاصيل حقيبة النقدية الموردة</span>
              <button onClick={() => setSelectedBagId(null)} className={wltStyles.inspectorCloseBtn}>
                ✕
              </button>
            </div>
            <hr className={wltStyles.inspectorSeparator} />

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>رقم ومرجع الحقيبة</span>
              <span className={wltStyles.inspectorMetaVal}>
                {selectedBag.bagId}
              </span>
            </Box>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>طلب التوصيل المرتبط</span>
              <span className={wltStyles.inspectorMetaVal}>
                {selectedBag.orderId}
              </span>
            </Box>

            <div className={wltStyles.storeDetailsCard || wltStyles.inspectorImpactCard}>
              <span className={wltStyles.inspectorMetaKey} style={{ display: 'block', marginBottom: 4 }}>
                تفاصيل المبالغ والوديعة:
              </span>
              <div className={wltStyles.storeDetailsRow || wltStyles.inspectorImpactRow}>
                <span>المبلغ المقبوض COD:</span>
                <span className={wltStyles.storeDetailsRowTabular || wltStyles.inspectorImpactRowTabular}>{selectedBag.amountLabel}</span>
              </div>
              <div className={wltStyles.storeDetailsRow || wltStyles.inspectorImpactRow}>
                <span>تاريخ التوريد البنكي:</span>
                <span>{selectedBag.date}</span>
              </div>
              <hr className={wltStyles.storeDetailsSeparator || wltStyles.inspectorImpactSeparator} />
              <div className={wltStyles.inspectorImpactTotalRow}>
                <span>القيمة للمطابقة:</span>
                <span className={wltStyles.storeDetailsRowTabular || wltStyles.inspectorImpactRowTabular}>{selectedBag.amountLabel}</span>
              </div>
            </div>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>إيصال الإيداع البنكي الرقمي (Evidence)</span>
              <code className={wltStyles.inspectorEvidenceCode}>
                {selectedBag.evidenceRef}
              </code>
            </Box>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>ملاحظات المطابقة</span>
              <p style={{ fontSize: 11, margin: 0, lineHeight: '1.4' }}>
                {selectedBag.notes}
              </p>
            </Box>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>حالة التسوية والفرز</span>
              <span className={wltStyles.inspectorMetaVal} style={{ color: selectedBag.status === 'cleared' ? 'var(--bth-success-text)' : 'var(--bth-warning-text)' }}>
                {COD_BAG_STATUS_LABEL[selectedBag.status]}
              </span>
            </Box>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => console.warn('[WLT-PREVIEW] إعادة مطابقة الحقيبة:', selectedBag.bagId)}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: radius.xs,
                  border: '1px solid var(--bth-control-panel-border)',
                  background: 'var(--bth-control-panel-surface-raised)',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                إعادة مطابقة فنية
              </button>
              {selectedBag.status !== 'cleared' && (
                <button
                  onClick={() => console.warn('[WLT-PREVIEW] تسوية الحقيبة يدوياً:', selectedBag.bagId)}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    borderRadius: radius.xs,
                    border: 'none',
                    background: 'var(--bth-success-text)',
                    color: 'var(--bth-text-inverse)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  تسوية فورية ✓
                </button>
              )}
            </div>
          </Box>
        )}

        {selectedEarning && (
          <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={3}>
            <div className={wltStyles.inspectorHeader}>
              <span className={wltStyles.inspectorTitle}>تفاصيل مستحقات حركة التوصيل</span>
              <button onClick={() => setSelectedEarningId(null)} className={wltStyles.inspectorCloseBtn}>
                ✕
              </button>
            </div>
            <hr className={wltStyles.inspectorSeparator} />

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>رقم الحركة والأرباح</span>
              <span className={wltStyles.inspectorMetaVal}>
                {selectedEarning.earningId}
              </span>
            </Box>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>الطلب التابع</span>
              <span className={wltStyles.inspectorMetaVal}>
                {selectedEarning.orderId}
              </span>
            </Box>

            <div className={wltStyles.storeDetailsCard || wltStyles.inspectorImpactCard}>
              <span className={wltStyles.inspectorMetaKey} style={{ display: 'block', marginBottom: 4 }}>
                مكونات الحركة الماليّة:
              </span>
              <div className={wltStyles.storeDetailsRow || wltStyles.inspectorImpactRow}>
                <span>أجرة التوصيل الأساسية:</span>
                <span className={wltStyles.storeDetailsRowTabular || wltStyles.inspectorImpactRowTabular}>{selectedEarning.deliveryFeeLabel}</span>
              </div>
              <div className={wltStyles.storeDetailsRow || wltStyles.inspectorImpactRow}>
                <span>الحوافز والمكافآت:</span>
                <span className={wltStyles.storeDetailsRowTabular || wltStyles.inspectorImpactRowTabular} style={{ color: 'var(--bth-success-text)' }}>+ {selectedEarning.bonusLabel}</span>
              </div>
              <div className={wltStyles.storeDetailsRow || wltStyles.inspectorImpactRow}>
                <span>عمولة / رسوم المنصة:</span>
                <span className={wltStyles.storeDetailsRowTabular || wltStyles.inspectorImpactRowTabular} style={{ color: 'var(--bth-danger-text)' }}>- {selectedEarning.platformFeeLabel}</span>
              </div>
              <hr className={wltStyles.storeDetailsSeparator || wltStyles.inspectorImpactSeparator} />
              <div className={wltStyles.inspectorImpactTotalRow}>
                <span>صافي أرباح الكابتن:</span>
                <span className={wltStyles.storeDetailsRowTabular || wltStyles.inspectorImpactRowTabular}>{selectedEarning.netLabel}</span>
              </div>
            </div>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>مرجع قيد التحويل والصرف البنكي</span>
              <code className={wltStyles.inspectorEvidenceCode}>
                {selectedEarning.evidenceRef}
              </code>
            </Box>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>تاريخ صرف الحركة ماليّاً</span>
              <span className={wltStyles.inspectorMetaVal}>
                {selectedEarning.payoutDate}
              </span>
            </Box>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>حالة الدفعة</span>
              <span className={wltStyles.inspectorMetaVal}>
                {EARNING_STATUS_LABEL[selectedEarning.status]}
              </span>
            </Box>
          </Box>
        )}
      </div>

    </Box>
  );
}

export default WltDshCaptainStatement;
