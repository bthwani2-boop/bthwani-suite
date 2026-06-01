'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  getWltDshStoreSettlementStatementsPreview,
  type WltDshStoreSettlementStatement,
} from './financeContracts';

const STATUS_LABEL: Record<WltDshStoreSettlementStatement['status'], string> = {
  draft_preview: 'مسودة معاينة',
  ready_for_review: 'جاهزة للمراجعة',
  held_by_wlt: 'محجوبة من WLT',
  paid_preview: 'مدفوعة كمعاينة',
};

const ORDER_STATUS_LABEL: Record<WltDshStoreSettlementStatement['orders'][number]['settlementStatus'], string> = {
  included: 'داخل الدورة',
  held: 'محجوز',
  next_cycle: 'الدورة القادمة',
  disputed: 'نزاع',
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: '1px solid var(--bthwani-control-panel-border)', borderRadius: 8, padding: '10px 12px', background: 'var(--bthwani-control-panel-surface-raised)' }}>
      <div style={{ fontSize: 11, color: 'var(--bthwani-control-panel-text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--bthwani-control-panel-text)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

export function WltDshStoreSettlementStatement() {
  const statements = React.useMemo(() => getWltDshStoreSettlementStatementsPreview(), []);
  const statement = statements[0];

  if (!statement) {
    return (
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line" style={{ direction: 'rtl', textAlign: 'right' }}>
        <Text role="titleSm">لا توجد تسويات متجر في معاينة WLT.</Text>
      </Box>
    );
  }

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleMd" style={{ fontWeight: 800 }}>كشف تسوية متجر</Text>
        <Text role="bodySm" tone="soft">
          {statement.storeName} · دورة {statement.settlementCycleId} · كل أسبوعين · {STATUS_LABEL[statement.status]}
        </Text>
        <Text role="caption" tone="muted">
          PREVIEW_ONLY · WLT owns settlement truth · DSH displays only.
        </Text>
      </Box>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
        <Metric label="بداية الدورة" value={statement.periodStart} />
        <Metric label="نهاية الدورة" value={statement.periodEnd} />
        <Metric label="موعد القطع" value={statement.cutoffDate} />
        <Metric label="موعد الدفع المتوقع" value={statement.expectedPayoutDate} />
        <Metric label="إجمالي الطلبات" value={statement.grossOrdersTotalLabel} />
        <Metric label="عدد الطلبات" value={statement.orderCount.toLocaleString('ar-YE')} />
        <Metric label="عمولة المنصة" value={statement.platformCommissionTotalLabel} />
        <Metric label="الاستردادات" value={statement.refundsTotalLabel} />
        <Metric label="الحجوزات" value={statement.holdsTotalLabel} />
        <Metric label="الصافي المستحق" value={statement.netPayableLabel} />
        <Metric label="مدفوع سابقًا" value={statement.paidToDateLabel} />
        <Metric label="المتبقي" value={statement.remainingPayableLabel} />
      </div>

      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleSm" style={{ fontWeight: 800 }}>الطلبات المرتبطة بالدورة</Text>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bthwani-control-panel-border)' }}>
                {['الطلب', 'تاريخ الطلب', 'التسليم', 'الدفع', 'قيمة المنتجات', 'التوصيل', 'العمولة', 'الخصم', 'الاسترداد', 'الأثر الصافي', 'الحالة'].map((header) => (
                  <th key={header} style={{ textAlign: 'right', padding: '8px 10px', fontSize: 11, color: 'var(--bthwani-control-panel-text-muted)' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statement.orders.map((order) => (
                <tr key={order.orderId} style={{ borderBottom: '1px solid var(--bthwani-control-panel-border)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 800 }}>{order.orderId}</td>
                  <td style={{ padding: '8px 10px' }}>{order.orderDate}</td>
                  <td style={{ padding: '8px 10px' }}>{order.deliveryDate}</td>
                  <td style={{ padding: '8px 10px' }}>{order.paymentMethod}</td>
                  <td style={{ padding: '8px 10px', fontVariantNumeric: 'tabular-nums' }}>{order.orderGrossLabel}</td>
                  <td style={{ padding: '8px 10px', fontVariantNumeric: 'tabular-nums' }}>{order.deliveryFeeLabel}</td>
                  <td style={{ padding: '8px 10px', fontVariantNumeric: 'tabular-nums' }}>{order.platformCommissionLabel}</td>
                  <td style={{ padding: '8px 10px', fontVariantNumeric: 'tabular-nums' }}>{order.discountLabel}</td>
                  <td style={{ padding: '8px 10px', fontVariantNumeric: 'tabular-nums' }}>{order.refundLabel}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{order.netSettlementImpactLabel}</td>
                  <td style={{ padding: '8px 10px' }}>{ORDER_STATUS_LABEL[order.settlementStatus]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </Box>
  );
}

export default WltDshStoreSettlementStatement;
