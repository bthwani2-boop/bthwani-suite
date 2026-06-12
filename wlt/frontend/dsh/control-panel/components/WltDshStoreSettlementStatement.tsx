'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  type WltDshStoreSettlementStatement as StoreStatement,
} from '../financeContracts';
import { formatWltYer } from '../models/dshFinance.types';
import {
  loadWltDshFinanceRuntimeReadModel,
  type WltDshFinanceRuntimeResult,
} from '../adapters/wltDshFinanceRuntime.adapter';
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
  manual: 'WLT runtime',
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={wltStyles.reconciliationSummaryCard}>
      <div className={wltStyles.kpiLabel}>{label}</div>
      <div className={wltStyles.kpiValue} style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}

function mapRuntimeStatementStatus(status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'): StoreStatement['status'] {
  if (status === 'COMPLETED') return 'paid_preview';
  if (status === 'FAILED') return 'held_by_wlt';
  if (status === 'PROCESSING') return 'ready_for_review';
  return 'draft_preview';
}

function mapRuntimeOrderStatus(status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'): StoreStatement['orders'][number]['settlementStatus'] {
  if (status === 'COMPLETED') return 'included';
  if (status === 'FAILED') return 'disputed';
  if (status === 'PROCESSING') return 'held';
  return 'next_cycle';
}

function resolveRuntimePeriodBounds(items: readonly { created_at: string; updated_at: string; completed_at?: string }[]) {
  const created = items.map((item) => item.created_at).filter(Boolean).sort();
  const updated = items.map((item) => item.completed_at ?? item.updated_at ?? item.created_at).filter(Boolean).sort();
  const periodStart = created[0]?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const periodEnd = updated.at(-1)?.slice(0, 10) ?? periodStart;
  return { periodStart, periodEnd };
}

function buildRuntimeStoreStatements(runtimeFinance: WltDshFinanceRuntimeResult | null): StoreStatement[] {
  if (runtimeFinance?.state !== 'runtime') {
    return [];
  }

  const grouped = new Map<string, typeof runtimeFinance.data.overview.settlements>();
  for (const settlement of runtimeFinance.data.overview.settlements) {
    const key = settlement.partner_id || 'partner-unknown';
    const current = grouped.get(key);
    if (current) {
      current.push(settlement);
    } else {
      grouped.set(key, [settlement]);
    }
  }

  return Array.from(grouped.entries())
    .map(([partnerId, settlements]) => {
      const { periodStart, periodEnd } = resolveRuntimePeriodBounds(settlements);
      const grossOrdersTotalMinorUnits = settlements.reduce((sum, item) => sum + Math.round(item.gross_amount * 100), 0);
      const platformCommissionTotalMinorUnits = settlements.reduce((sum, item) => sum + Math.round(item.platform_fee * 100), 0);
      const netPayableMinorUnits = settlements.reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);
      const paidToDateMinorUnits = settlements
        .filter((item) => item.status === 'COMPLETED')
        .reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);
      const remainingPayableMinorUnits = settlements
        .filter((item) => item.status !== 'COMPLETED')
        .reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);
      const holdsTotalMinorUnits = settlements
        .filter((item) => item.status === 'FAILED' || item.status === 'PROCESSING')
        .reduce((sum, item) => sum + Math.round(item.partner_payout * 100), 0);

      const status =
        settlements.some((item) => item.status === 'FAILED')
          ? 'held_by_wlt'
          : settlements.every((item) => item.status === 'COMPLETED')
            ? 'paid_preview'
            : settlements.some((item) => item.status === 'PROCESSING')
              ? 'ready_for_review'
              : 'draft_preview';

      return {
        statementId: `runtime-statement-${partnerId}`,
        storeId: partnerId,
        storeName: `شريك ${partnerId}`,
        settlementCycleId: `runtime-cycle-${partnerId}-${periodEnd}`,
        frequency: 'weekly',
        periodStart,
        periodEnd,
        cutoffDate: periodEnd,
        expectedPayoutDate: periodEnd,
        status,
        grossOrdersTotalMinorUnits,
        grossOrdersTotalLabel: formatWltYer(grossOrdersTotalMinorUnits),
        orderCount: settlements.length,
        deliveryFeesTotalMinorUnits: 0,
        deliveryFeesTotalLabel: formatWltYer(0),
        platformCommissionTotalMinorUnits,
        platformCommissionTotalLabel: formatWltYer(platformCommissionTotalMinorUnits),
        discountsTotalMinorUnits: 0,
        discountsTotalLabel: formatWltYer(0),
        refundsTotalMinorUnits: 0,
        refundsTotalLabel: formatWltYer(0),
        holdsTotalMinorUnits,
        holdsTotalLabel: formatWltYer(holdsTotalMinorUnits),
        netPayableMinorUnits,
        netPayableLabel: formatWltYer(netPayableMinorUnits),
        paidToDateMinorUnits,
        paidToDateLabel: formatWltYer(paidToDateMinorUnits),
        remainingPayableMinorUnits,
        remainingPayableLabel: formatWltYer(remainingPayableMinorUnits),
        orders: settlements.map((item) => {
          const orderGrossMinorUnits = Math.round(item.gross_amount * 100);
          const platformCommissionMinorUnits = Math.round(item.platform_fee * 100);
          const netSettlementImpactMinorUnits = Math.round(item.partner_payout * 100);
          return {
            orderId: item.order_id,
            orderDate: item.created_at.slice(0, 10),
            deliveryDate: (item.completed_at ?? item.updated_at ?? item.created_at).slice(0, 10),
            paymentMethod: 'manual',
            orderGrossMinorUnits,
            orderGrossLabel: formatWltYer(orderGrossMinorUnits),
            deliveryFeeMinorUnits: 0,
            deliveryFeeLabel: formatWltYer(0),
            platformCommissionMinorUnits,
            platformCommissionLabel: formatWltYer(platformCommissionMinorUnits),
            discountMinorUnits: 0,
            discountLabel: formatWltYer(0),
            refundMinorUnits: 0,
            refundLabel: formatWltYer(0),
            netSettlementImpactMinorUnits,
            netSettlementImpactLabel: formatWltYer(netSettlementImpactMinorUnits),
            includedInCycle: item.status === 'COMPLETED',
            settlementStatus: mapRuntimeOrderStatus(item.status),
            evidenceRef: item.idempotency_key || item.id,
          };
        }),
        contract: {
          contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
          runtimeTruth: false,
          backendSource: false,
          owner: 'wlt',
          currencyCode: 'YER',
          isPreview: true,
        },
      } satisfies StoreStatement;
    })
    .sort((left, right) => left.storeName.localeCompare(right.storeName, 'ar'));
}

export function WltDshStoreSettlementStatement() {
  const [runtimeFinance, setRuntimeFinance] = React.useState<WltDshFinanceRuntimeResult | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void loadWltDshFinanceRuntimeReadModel().then((result) => {
      if (!cancelled) setRuntimeFinance(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const runtimeStatements = React.useMemo(() => buildRuntimeStoreStatements(runtimeFinance), [runtimeFinance]);
  const statements = runtimeStatements;
  const usingRuntime = runtimeStatements.length > 0;

  const [activeStoreId, setActiveStoreId] = React.useState<string>(statements[0]?.storeId ?? '');
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!statements.length) {
      setActiveStoreId('');
      setSelectedOrderId(null);
      return;
    }
    if (!statements.some((entry) => entry.storeId === activeStoreId)) {
      setActiveStoreId(statements[0]!.storeId);
      setSelectedOrderId(null);
    }
  }, [activeStoreId, statements]);

  const statement = React.useMemo(() => {
    return statements.find((entry) => entry.storeId === activeStoreId) || statements[0];
  }, [statements, activeStoreId]);

  const selectedOrder = React.useMemo(() => {
    if (!statement) return null;
    return statement.orders.find((order) => order.orderId === selectedOrderId) || null;
  }, [statement, selectedOrderId]);

  if (!statement) {
    return (
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line">
        <Text role="titleSm">لا توجد تسويات متجر متاحة من WLT runtime أو preview fallback.</Text>
      </Box>
    );
  }

  return (
    <Box gap={4}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={1}>
        <Text role="bodySm" tone="soft">
          {usingRuntime
            ? 'مرتبط بـ WLT runtime settlements. تفاصيل الرسوم والخصومات والاستردادات غير المتاحة في العقد الحالي تُعرض بصفر أو manual إلى أن يتوسع العقد.'
            : 'Fallback preview عند تعذر WLT runtime.'}
        </Text>
      </Box>

      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <div className={wltStyles.storeSelectorHeaderFlex}>
          <div className={wltStyles.storeSelectorTitleFlex}>
            <Text role="titleMd" weight="black">كشف تسوية متجر</Text>
            <div className={wltStyles.storeSelectorButtonsFlex}>
              {statements.map((entry) => (
                <button
                  key={entry.storeId}
                  onClick={() => {
                    setActiveStoreId(entry.storeId);
                    setSelectedOrderId(null);
                  }}
                  className={`${wltStyles.storeSelectorBtn} ${
                    entry.storeId === activeStoreId ? wltStyles.storeSelectorBtnActive : ''
                  }`}
                >
                  {entry.storeName}
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

      <div className={`${wltStyles.workbenchLayout} ${selectedOrder ? wltStyles.workbenchLayoutWithInspector : ''}`}>
        <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
          <div className={wltStyles.tableHeaderFlex}>
            <Text role="titleSm" weight="black">الطلبات المرتبطة بالدورة الحالية</Text>
            <span className={wltStyles.readinessDesc}>
              اضغط على أي صف لعرض تفاصيل الأثر المالي والقيد المرجعي المتاح.
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
                <span>عمولة المنصة:</span>
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
                <span className={wltStyles.inspectorMetaKey}>مرجع المستند / القيد:</span>
                <code className={wltStyles.inspectorEvidenceCode}>{selectedOrder.evidenceRef || 'WLT-RUNTIME-ENTRY'}</code>
              </div>
            </Box>
          </Box>
        )}
      </div>
    </Box>
  );
}

export default WltDshStoreSettlementStatement;
