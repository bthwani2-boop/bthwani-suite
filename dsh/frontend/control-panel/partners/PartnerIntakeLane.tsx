'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text, Surface } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { dshPartnerIntakeItems, dshPartnerIntakeMetrics } from './workflow';

export type PartnerIntakeLaneProps = {
  readonly state?: 'ready' | 'loading' | 'error';
  readonly hubHref: string;
  readonly onRetry?: () => void;
  readonly onOpenHubItem?: (itemId: string, intent: 'approve' | 'fix' | 'inspect') => void;
};

function resolveStatusTone(queue: string): 'warning' | 'success' | 'neutral' {
  if (queue === 'offer-approval') return 'warning';
  if (queue === 'marketing-review') return 'success';
  return 'neutral';
}

function resolveApproveLabel(queue: string): string {
  if (queue === 'offer-approval') return 'اعتماد العرض';
  if (queue === 'partner-review') return 'إنشاء الكود';
  return 'إطلاق نهائي';
}

export function PartnerIntakeLane({ state = 'ready', hubHref, onRetry, onOpenHubItem }: PartnerIntakeLaneProps) {
  const router = useRouter();

  const openHubItem = React.useCallback((itemId: string, intent: 'approve' | 'fix' | 'inspect') => {
    if (onOpenHubItem) {
      onOpenHubItem(itemId, intent);
      return;
    }
    if (typeof globalThis.window === 'undefined') return;
    const url = new URL(hubHref, globalThis.location.origin);
    url.searchParams.set('focus', itemId);
    url.searchParams.set('intent', intent);
    router.push(`${url.pathname}${url.search}${url.hash}`);
  }, [hubHref, onOpenHubItem, router]);

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
        <Text role="titleSm" tone="danger">تعذر تحميل طلبات الشركاء</Text>
        <WebControlPanelActionCluster
          secondary={{
            id: 'retry',
            label: 'إعادة المحاولة',
            onAction: onRetry,
          }}
        />
      </Box>
    );
  }

  return (
    <Box gap={6} dir="rtl">
      <Box layoutDirection="row" justify="space-between" align="center">
        <Box gap={1}>
          <Text role="caption" tone="brand">مسار استقبال الشركاء</Text>
          <Text role="titleLg" tone="brand">
            طلبات الميدان والشركاء
          </Text>
        </Box>
      </Box>

      <WebControlPanelKpiStrip
        items={[
          ...dshPartnerIntakeMetrics.map((m, i) => ({
            id: m.id,
            label: m.label,
            value: m.value,
            tone: i === 0 ? ('warning' as const) : ('neutral' as const),
          })),
          { id: 'decision-time', label: 'متوسط وقت القرار', value: '١٤ د', tone: 'success' as const },
        ]}
      />

      <Box gap={3}>
        {dshPartnerIntakeItems.map((item) => {
          const statusTone = resolveStatusTone(item.queue);
          const approveLabel = resolveApproveLabel(item.queue);

          return (
            <WebControlPanelDecisionRow
              key={item.id}
              entityId={item.id}
              entityLabel={item.storeName}
              status={item.fieldStatusLabel}
              statusTone={statusTone}
              risk={item.queue === 'offer-approval' ? 'warning' : 'neutral'}
              recommendation={item.nextStep}
              reason={item.note}
              sla={`${item.categoryLabel} · ${item.ownerLabel}`}
              primaryAction={{
                id: `intake-approve-${item.id}`,
                label: approveLabel,
                onAction: () => openHubItem(item.id, 'approve'),
              }}
              secondaryAction={{
                id: `intake-fix-${item.id}`,
                label: 'تعديل',
                onAction: () => openHubItem(item.id, 'fix'),
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
