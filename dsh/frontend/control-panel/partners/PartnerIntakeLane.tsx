'use client';

import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
} from '@bthwani/ui-kit/web';
import { dshPartnerIntakeItems, dshPartnerIntakeMetrics } from './workflow';

export type PartnerIntakeLaneProps = {
  state?: 'ready' | 'loading' | 'error';
  hubHref: string;
  onRetry?: () => void;
  onOpenHubItem?: (itemId: string, intent: 'approve' | 'fix' | 'inspect') => void;
};

export function PartnerIntakeLane({ state = 'ready', hubHref, onRetry, onOpenHubItem }: PartnerIntakeLaneProps) {
  const { theme } = useTheme();
  const openHubItem = React.useCallback((itemId: string, intent: 'approve' | 'fix' | 'inspect') => {
    if (onOpenHubItem) {
      onOpenHubItem(itemId, intent);
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const url = new URL(hubHref, window.location.origin);
    url.searchParams.set('focus', itemId);
    url.searchParams.set('intent', intent);
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  }, [hubHref, onOpenHubItem]);
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
        <Text role="titleSm" style={{ color: theme.danger }}>تعذر تحميل طلبات الشركاء</Text>
        <button onClick={onRetry} style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${theme.danger}`, color: theme.danger, background: 'transparent', cursor: 'pointer' }}>
          إعادة المحاولة
        </button>
      </Box>
    );
  }

  return (
    <Box gap={6} style={{ direction: 'rtl' }}>
      <Box layoutDirection="row" justify="space-between" align="center">
        <Box gap={1}>
          <Text role="caption" style={{ color: theme.brand, fontWeight: '800' }}>مسار استقبال الشركاء</Text>
          <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900', color: theme.brandHeaderBackground }}>طلبات الميدان والشركاء</Text>
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
          { id: 'decision-time', label: 'متوسط وقت القرار', value: '١٤ د', tone: 'success' }
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
                onAction: () => openHubItem(item.id, 'approve')
              }}
              secondaryAction={{
                label: 'تعديل',
                onAction: () => openHubItem(item.id, 'fix')
              }}
              onInspect={() => openHubItem(item.id, 'inspect')}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default PartnerIntakeLane;
