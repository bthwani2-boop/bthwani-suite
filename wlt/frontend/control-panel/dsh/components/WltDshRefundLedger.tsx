'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { getWltDshRefundLedgerPreview } from '../financeContracts';
import { loadWltDshFinanceRuntimeReadModel, type WltDshFinanceRuntimeResult } from '../adapters/wltDshFinanceRuntime.adapter';

const STATUS_LABEL: Record<string, string> = {
  pending_wlt_review: 'قيد مراجعة WLT',
  approved_preview: 'معتمد كمعاينة',
  rejected_preview: 'مرفوض كمعاينة',
  disputed: 'نزاع',
};

export function WltDshRefundLedger() {
  const previewCases = React.useMemo(() => getWltDshRefundLedgerPreview(), []);
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

  const runtimeData = runtimeFinance?.state === 'runtime' ? runtimeFinance.data : null;
  const runtimeCases = runtimeData?.refunds ?? null;

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleMd" style={{ fontWeight: 800 }}>سجل الاستردادات والنزاعات</Text>
        <Text role="bodySm" tone="soft">
          {runtimeCases
            ? `مرتبط بقائمة WLT runtime للاستردادات · ${runtimeData?.baseUrl ?? 'WLT runtime'}`
            : 'Fallback preview عند تعذر WLT runtime.'}
        </Text>
      </Box>

      <div style={{ display: 'grid', gap: 12 }}>
        {runtimeCases ? runtimeCases.map((item) => (
          <Box key={item.refundRefId} padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <Text role="titleSm" style={{ fontWeight: 800 }}>{item.refundRefId} · {item.orderId}</Text>
                <Text role="caption" tone="muted">العميل {item.clientId} · المتجر {item.storeId} · {item.status}</Text>
              </div>
              <div style={{ textAlign: 'left', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                {(item.amountMinorUnits / 100).toLocaleString('ar-YE')} ر.ي
              </div>
            </div>
            <Text role="bodySm" tone="soft">{item.reason}</Text>
            <Box gap={1}>
              <Text role="caption" tone="muted">WLT status: {item.status}</Text>
              <Text role="caption" tone="muted">Created: {item.createdAt}</Text>
            </Box>
          </Box>
        )) : previewCases.map((item) => (
          <Box key={item.refundCaseId} padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <Text role="titleSm" style={{ fontWeight: 800 }}>{item.refundCaseId} · {item.orderId}</Text>
                <Text role="caption" tone="muted">العميل {item.customerId} · المتجر {item.storeId} · {STATUS_LABEL[item.status]}</Text>
              </div>
              <div style={{ textAlign: 'left', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                {item.approvedAmountLabel}
              </div>
            </div>
            <Text role="bodySm" tone="soft">{item.reason}</Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
              <div>الأصل: <strong>{item.originalAmountLabel}</strong></div>
              <div>المعتمد: <strong>{item.approvedAmountLabel}</strong></div>
              <div>المرفوض: <strong>{item.rejectedAmountLabel}</strong></div>
            </div>
            <Box gap={1}>
              <Text role="caption" tone="muted">Ledger: {item.ledgerImpact}</Text>
              <Text role="caption" tone="muted">Wallet: {item.walletImpact}</Text>
              <Text role="caption" tone="muted">Settlement: {item.settlementImpact}</Text>
              <Text role="caption" tone="muted">Evidence: {item.evidence.join('، ')}</Text>
            </Box>
          </Box>
        ))}
      </div>
    </Box>
  );
}

export default WltDshRefundLedger;
