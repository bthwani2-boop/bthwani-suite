'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { loadWltDshFinanceRuntimeReadModel, type WltDshFinanceRuntimeResult } from '../../shared/boundary/wltDshFinanceRuntime.adapter';
export function WltDshRefundLedger({ subGroup }: { subGroup?: string } = {}) {
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

  const filteredRuntimeCases = React.useMemo(() => {
    if (!runtimeCases) return null;
    if (!subGroup) return runtimeCases;
    if (subGroup === 'refunds') {
      return runtimeCases.filter(
        (c) => c.status === 'PENDING' || c.status === 'CONFIRMED',
      );
    }
    if (subGroup === 'disputes') {
      return runtimeCases.filter((c) => c.status === 'FAILED');
    }
    if (subGroup === 'cancellations') {
      return runtimeCases.filter((c) => c.status === 'FAILED' || c.reason.includes('إلغاء'));
    }
    if (subGroup === 'holds') {
      return runtimeCases.filter((c) => c.status === 'PROCESSING');
    }
    return runtimeCases;
  }, [runtimeCases, subGroup]);

  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleMd" weight="black">سجل الاستردادات والنزاعات</Text>
        <Text role="bodySm" tone="soft">
          {filteredRuntimeCases
            ? `مرتبط بقائمة WLT runtime للاستردادات · ${runtimeData?.baseUrl ?? 'WLT runtime'}`
            : 'في انتظار بيانات WLT runtime.'}
        </Text>
      </Box>

      <div style={{ display: 'grid', gap: 12 }}>
        {filteredRuntimeCases && filteredRuntimeCases.length > 0 ? filteredRuntimeCases.map((item) => (
          <Box key={item.id} padding={3} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <Text role="titleSm" weight="black">{item.id} · {item.order_id}</Text>
                <Text role="caption" tone="muted">العميل {item.client_id} · {item.status}</Text>
              </div>
              <div style={{ textAlign: 'left', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                {item.amount.toLocaleString('ar-YE')} ر.ي
              </div>
            </div>
            <Text role="bodySm" tone="soft">{item.reason}</Text>
            <Box gap={1}>
              <Text role="caption" tone="muted">WLT status: {item.status}</Text>
              <Text role="caption" tone="muted">Created: {item.created_at}</Text>
            </Box>
          </Box>
        )) : (
          <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line">
            <Text role="bodySm" tone="muted">لا توجد استردادات أو نزاعات من WLT runtime.</Text>
          </Box>
        )}
      </div>
    </Box>
  );
}

export default WltDshRefundLedger;
