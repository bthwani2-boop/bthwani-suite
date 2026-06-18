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
import type { DshPartnerIntakeStage } from '../../shared/stores/partner/partner.workflow';

export type PartnerIntakeLaneProps = {
  readonly state?: 'ready' | 'loading' | 'error';
  readonly hubHref: string;
  readonly onRetry?: () => void;
  readonly onOpenHubItem?: (itemId: string, intent: 'approve' | 'fix' | 'inspect') => void;
};

function resolveStatusTone(stage: DshPartnerIntakeStage): 'warning' | 'success' | 'neutral' {
  if (stage === 'pending-partner') return 'warning';
  if (stage === 'pending-marketing') return 'neutral';
  return 'success';
}

function resolveApproveLabel(stage: DshPartnerIntakeStage): string {
  if (stage === 'pending-partner') return 'اعتماد أولي';
  if (stage === 'pending-marketing') return 'اعتماد تسويقي';
  return 'عرض المنشور';
}

function resolveStageLabel(stage: DshPartnerIntakeStage): string {
  if (stage === 'pending-partner') return 'بانتظار مراجعة الشركاء';
  if (stage === 'pending-marketing') return 'بانتظار مراجعة التسويق';
  return 'منشور';
}

function resolveNextStep(stage: DshPartnerIntakeStage): string {
  if (stage === 'pending-partner') return 'مراجعة بيانات المنتج واتخاذ القرار الأولي.';
  if (stage === 'pending-marketing') return 'اعتماد العرض التسويقي قبل النشر.';
  return 'فتح العنصر المنشور ومراجعة حالته الحالية.';
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
    <div dir="rtl">
      <Box gap={6}>
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
            value: String(m.value),
            tone: i === 0 ? ('warning' as const) : ('neutral' as const),
          })),
          { id: 'decision-time', label: 'متوسط وقت القرار', value: '١٤ د', tone: 'success' as const },
        ]}
      />

      <Box gap={3}>
        {dshPartnerIntakeItems.map((item) => {
          const statusTone = resolveStatusTone(item.stage);
          const approveLabel = resolveApproveLabel(item.stage);

          return (
            <WebControlPanelDecisionRow
              key={item.id}
              entityId={item.id}
              entityLabel={item.productName}
              status={resolveStageLabel(item.stage)}
              statusTone={statusTone}
              risk={item.stage === 'pending-partner' ? 'warning' : 'neutral'}
              recommendation={resolveNextStep(item.stage)}
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
    </div>
  );
}

export default PartnerIntakeLane;
