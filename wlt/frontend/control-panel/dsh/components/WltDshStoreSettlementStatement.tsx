'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  getWltDshStoreSettlementStatementsPreview,
  type WltDshStoreSettlementStatement as StoreStatement,
} from '../financeContracts';
import wltStyles from '../styles/wlt-dsh-finance.module.css';

const STATUS_LABEL: Record<StoreStatement['status'], string> = {
  draft_preview: 'مسودة معاينة',
  ready_for_review: 'جاهزة للمراجعة',
  held_by_wlt: 'محجوبة من WLT 🚨',
  paid_preview: 'مدفوعة كمعاينة ✓',
};

const ORDER_STATUS_LABEL: Record<StoreStatement['orders'][number]['settlementStatus'], string> = {
  included: 'داخل الدورة',
  held: 'محجوز 🔒',
  next_cycle: 'الدورة القادمة',
  disputed: 'نزاع ⚠️',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  wallet: 'محفظة بثواني',
  cod: 'كاش عند الاستلام (COD)',
  card: 'بطاقة بنكية',
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={wltStyles.reconciliationSummaryCard}>
      <div className={wltStyles.kpiLabel}>{label}</div>
      <div className={wltStyles.kpiValue} style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}

export function WltDshStoreSettlementStatement() {
  const statements = React.useMemo(() => getWltDshStoreSettlementStatementsPreview(), []);

  const [activeStoreId, setActiveStoreId] = React.useState<string>(statements[0]?.storeId ?? '');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

  const statement = React.useMemo(() => {
    return statements.find((s) => s.storeId === activeStoreId) || statements[0];
  }, [statements, activeStoreId]);

  const selectedOrder = React.useMemo(() => {
    if (!statement) return null;
    return statement.orders.find((o) => o.orderId === selectedOrderId) || null;
  }, [statement, selectedOrderId]);

  if (!statement) {
    return (
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line">
        <Text role="titleSm">لا توجد تسويات متجر في معاينة WLT.</Text>
      </Box>
    );
  }

  return (
    <Box gap={4}>
      {/* Store Selection Switcher */}
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div className={wltStyles.storeSelectorHeaderFlex}>
          <div className={wltStyles.storeSelectorTitleFlex}>
            <Text role="titleMd" style={{ fontWeight: 800 }}>كشف تسوية متجر</Text>
            <div className={wltStyles.storeSelectorButtonsFlex}>
              {statements.map((s) => (
                <button
                  key={s.storeId}
                  onClick={() => {
                    setActiveStoreId(s.storeId);
                    setSelectedOrderId(null);
                  }}
                  className={`${wltStyles.storeSelectorBtn} ${
                    s.storeId === activeStoreId ? wltStyles.storeSelectorBtnActive : ''
                  }`}
                >
                  {s.storeName}
                </button>
              ))}
            </div>
          </div>
          <div className={wltStyles.storeSelectorMetaFlex}>
            <span className={wltStyles.storeSelectorPeriodBadge}>
              دورة: {statement.periodStart} إلى {statement.periodEnd}
            </span>
            <span
              className={`${wltStyles.storeSelectorStatusBadge} ${
                statement.status === 'held_by_wlt'
                  ? wltStyles.storeSelectorStatusDanger
                  : wltStyles.storeSelectorStatusSuccess
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
        <Metric label="موعد القطع" value={statement.cutoffDate} />
        <Metric label="موعد الدفع المتوقع" value={statement.expectedPayoutDate} />
        <Metric label="إجمالي الطلبات" value={statement.grossOrdersTotalLabel} />
        <Metric label="عدد الطلبات" value={`${statement.orderCount} طلبات`} />
        <Metric label="عمولة المنصة" value={statement.platformCommissionTotalLabel} />
        <Metric label="الاستردادات" value={statement.refundsTotalLabel} />
        <Metric label="الحجوزات" value={statement.holdsTotalLabel} />
        <Metric label="الصافي المستحق" value={statement.netPayableLabel} />
        <Metric label="مدفوع سابقًا" value={statement.paidToDateLabel} />
        <Metric label="المتبقي" value={statement.remainingPayableLabel} />
      </div>

      {/* Workbench Layout: Table + Inspector */}
      <div
        className={`${wltStyles.workbenchLayout} ${
          selectedOrder ? wltStyles.workbenchLayoutWithInspector : ''
        }`}
      >
        {/* Orders Table Container */}
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
          <div className={wltStyles.tableHeaderFlex}>
            <Text role="titleSm" style={{ fontWeight: 800 }}>الطلبات المرتبطة بالدورة الحالية</Text>
            <span className={wltStyles.readinessDesc}>
              اضغط على أي صف لعرض تفاصيل العمولات المفرزة وقيود الأستاذ.
            </span>
          </div>

          <div className={wltStyles.tableWrap}>
            <table className={wltStyles.statementTable}>
              <thead>
                <tr>
                  {['الطلب', 'تاريخ الطلب', 'الدفع', 'قيمة المبيعات', 'العمولة', 'الخصم', 'الاسترداد', 'الأثر الصافي', 'الحالة', 'الأدلة'].map((header) => (
                    <th key={header} className={wltStyles.statementTh}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statement.orders.map((order) => {
                  const isSelected = selectedOrderId === order.orderId;
                  const statusColor =
                    order.settlementStatus === 'included'
                      ? wltStyles.statusPosted
                      : order.settlementStatus === 'held'
                      ? wltStyles.statusBlocked
                      : wltStyles.statusPending;

                  return (
                    <tr
                      key={order.orderId}
                      onClick={() => setSelectedOrderId(isSelected ? null : order.orderId)}
                      className={`${wltStyles.statementRow} ${isSelected ? wltStyles.statementRowActive : ''}`}
                    >
                      <td className={`${wltStyles.statementTd} ${wltStyles.statementTdBold}`}>{order.orderId}</td>
                      <td className={wltStyles.statementTd}>{order.orderDate}</td>
                      <td className={wltStyles.statementTd}>
                        {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
                      </td>
                      <td className={`${wltStyles.statementTd} ${wltStyles.statementTdTabular}`}>
                        {order.orderGrossLabel}
                      </td>
                      <td className={`${wltStyles.statementTd} ${wltStyles.statementTdTabular}`}>
                        {order.platformCommissionLabel}
                      </td>
                      <td className={`${wltStyles.statementTd} ${wltStyles.statementTdTabular}`}>
                        {order.discountLabel}
                      </td>
                      <td className={`${wltStyles.statementTd} ${wltStyles.statementTdTabular}`}>
                        {order.refundLabel}
                      </td>
                      <td className={`${wltStyles.statementTd} ${wltStyles.statementTdBold} ${wltStyles.statementTdTabular}`}>
                        {order.netSettlementImpactLabel}
                      </td>
                      <td className={wltStyles.statementTd}>
                        <span className={`${wltStyles.statusBadge} ${statusColor}`}>
                          {ORDER_STATUS_LABEL[order.settlementStatus]}
                        </span>
                      </td>
                      <td className={wltStyles.statementTd}>
                        <code className={wltStyles.evidenceCode}>{order.evidenceRef || '—'}</code>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Box>

        {/* Order Inspector Sidebar */}
        {selectedOrder && (
          <Box padding={3} background="surfaceRaised" radiusToken="lg" border borderTone="line" gap={3}>
            <div className={wltStyles.inspectorHeader}>
              <span className={wltStyles.inspectorTitle}>تفاصيل تسوية الطلب</span>
              <button onClick={() => setSelectedOrderId(null)} className={wltStyles.inspectorCloseBtn}>
                ✕
              </button>
            </div>
            <hr className={wltStyles.inspectorSeparator} />

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>معرّف الطلب</span>
              <span className={wltStyles.inspectorMetaVal}>
                {selectedOrder.orderId} ({selectedOrder.orderDate})
              </span>
            </Box>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>طريقة الدفع وقناة التوريد</span>
              <span className={wltStyles.inspectorMetaVal}>
                {PAYMENT_METHOD_LABEL[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}
              </span>
            </Box>

            <div className={wltStyles.inspectorImpactCard}>
              <span className={wltStyles.inspectorMetaKey} style={{ display: 'block', marginBottom: 4 }}>
                حسبة الأثر الصافي (Net Impact):
              </span>
              <div className={wltStyles.inspectorImpactRow}>
                <span>قيمة المبيعات:</span>
                <span className={wltStyles.inspectorImpactRowTabular}>{selectedOrder.orderGrossLabel}</span>
              </div>
              <div className={wltStyles.inspectorImpactRow}>
                <span>رسوم التوصيل:</span>
                <span className={wltStyles.inspectorImpactRowTabular}>{selectedOrder.deliveryFeeLabel}</span>
              </div>
              <div className={`${wltStyles.inspectorImpactRow} ${wltStyles.inspectorImpactRowDanger}`}>
                <span>عمولة المنصة (8%):</span>
                <span className={wltStyles.inspectorImpactRowTabular}>- {selectedOrder.platformCommissionLabel}</span>
              </div>
              <div className={`${wltStyles.inspectorImpactRow} ${wltStyles.inspectorImpactRowDanger}`}>
                <span>الخصومات المطبقة:</span>
                <span className={wltStyles.inspectorImpactRowTabular}>- {selectedOrder.discountLabel}</span>
              </div>
              {selectedOrder.refundMinorUnits > 0 && (
                <div className={`${wltStyles.inspectorImpactRow} ${wltStyles.inspectorImpactRowDanger}`}>
                  <span>الاسترداد المدفوع:</span>
                  <span className={wltStyles.inspectorImpactRowTabular}>- {selectedOrder.refundLabel}</span>
                </div>
              )}
              <hr className={wltStyles.inspectorImpactSeparator} />
              <div className={wltStyles.inspectorImpactTotalRow}>
                <span>صافي التوريد المعتمد:</span>
                <span className={wltStyles.inspectorImpactRowTabular}>{selectedOrder.netSettlementImpactLabel}</span>
              </div>
            </div>

            <Box gap={1}>
              <span className={wltStyles.inspectorMetaKey}>حالة التصفية والأدلة الملحقة</span>
              <span className={wltStyles.inspectorMetaVal}>
                {ORDER_STATUS_LABEL[selectedOrder.settlementStatus]}
              </span>
              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className={wltStyles.inspectorMetaKey}>مرجع المستند / الحجز:</span>
                <code className={wltStyles.inspectorEvidenceCode}>{selectedOrder.evidenceRef || 'HOLD-WLT-UNRESOLVED'}</code>
              </div>
            </Box>
          </Box>
        )}
      </div>

    </Box>
  );
}

export default WltDshStoreSettlementStatement;
