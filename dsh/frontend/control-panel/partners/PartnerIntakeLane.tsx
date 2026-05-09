'use client';

import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
} from '@bthwani/ui-kit/web';
import { dshPartnerIntakeItems, dshPartnerIntakeMetrics } from './workflow';

export type PartnerIntakeLaneProps = {
  state?: 'ready' | 'loading' | 'error';
  hubHref: string;
  onRetry?: () => void;
};

export function PartnerIntakeLane({ state = 'ready', hubHref, onRetry }: PartnerIntakeLaneProps) {
  if (state === 'loading') {
    return (
      <Box padding={10} align="center">
        <Text role="titleSm">جارٍ تحميل طلبات الميدان...</Text>
      </Box>
    );
  }

  if (state === 'error') {
    return (
      <Box padding={10} align="center" gap={4}>
        <Text role="titleSm" style={{ color: '#DC2626' }}>تعذر تحميل طلبات الشركاء</Text>
        <button onClick={onRetry} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #DC2626', color: '#DC2626', background: 'transparent', cursor: 'pointer' }}>
          إعادة المحاولة
        </button>
      </Box>
    );
  }

  return (
    <Box gap={6} style={{ direction: 'rtl' }}>
      <Box layoutDirection="row" justify="space-between" align="center">
        <Box gap={1}>
          <Text role="caption" style={{ color: '#f97316', fontWeight: '800' }}>PARTNER INTAKE WORKFLOW</Text>
          <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900', color: '#0A2F5C' }}>طلبات الميدان والشركاء</Text>
        </Box>
      </Box>

      {/* KPI Strip */}
      <WebControlPanelKpiStrip
        items={[
          ...dshPartnerIntakeMetrics.map((m, i) => ({
            id: m.id,
            label: m.label,
            value: m.value,
            tone: i === 0 ? 'warning' : 'neutral' as const
          })),
          { id: 'decision-time', label: 'متوسط وقت القرار', value: '14m', tone: 'success' }
        ]}
      />

      {/* Intake Rows */}
      <Box gap={3}>
        {dshPartnerIntakeItems.map((item) => {
          const isWarning = item.queue === 'offer-approval';
          const isSuccess = item.queue === 'marketing-review';

          return (
            <WebControlPanelDecisionRow
              key={item.id}
              entityId={item.id}
              entityLabel={item.storeName}
              status={item.fieldStatusLabel}
              statusTone={isWarning ? 'warning' : isSuccess ? 'success' : 'neutral'}
              risk={isWarning ? 'warning' : 'neutral'}
              recommendation={item.nextStep}
              reason={item.note}
              sla={`${item.categoryLabel} · ${item.ownerLabel}`}
              primaryAction={{
                label: item.queue === 'offer-approval' ? 'اعتماد العرض' : item.queue === 'partner-review' ? 'إنشاء الكود' : 'إطلاق نهائي',
                onAction: () => {}
              }}
              secondaryAction={{
                label: 'تعديل',
                onAction: () => {}
              }}
              onInspect={() => {}}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default PartnerIntakeLane;
