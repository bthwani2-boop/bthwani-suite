'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import {
  DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW,
} from '../../data/orders.preview-data';
import { DISPATCH_LIFECYCLE_STATE_MAP } from '../../shared/dsh-order-preview.contract';
import { Box, Text } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import { buildOperationsHref } from './operations.registry';
// Delivery mode boundary: dispatch applies to bthwani_delivery only.
// partner_delivery and pickup orders do not enter the captain dispatch queue.
// Reference: dsh/frontend/shared/dsh-delivery-mode.model.ts → requiresDispatch
import { getDshDeliveryModeDefinition } from '../../shared/dsh-delivery-mode.model';
import { getDshLifecycleStateMetadata } from '../../shared/dsh-order-journey.model';

export type DispatchAssignmentScreenProps = { hubHref: string; subGroup?: string };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

// Resolved once at module level — no runtime cost.
const BTHWANI_DELIVERY_META = getDshDeliveryModeDefinition('bthwani_delivery');

export function DispatchAssignmentScreen({ subGroup }: DispatchAssignmentScreenProps) {
  const router = useRouter();
  const preview = DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW;

  const summaryKpi = [
    { id: 'waiting', label: 'بانتظار الإسناد', value: String(preview.summary.waitingAssignment), tone: 'danger' as const },
    { id: 'captains', label: 'كباتن متاحون', value: String(preview.summary.availableCaptains), tone: 'success' as const },
    { id: 'ready', label: 'جاهزون للاستلام', value: String(preview.summary.readyForPickup), tone: 'neutral' as const },
    { id: 'blockers', label: 'معوقات الإسناد', value: String(preview.summary.dispatchBlockers), tone: 'warning' as const },
  ];

  return (
    <Box gap={3}>
      {/* Delivery mode scope boundary — explicit, not implied */}
      <Box paddingX={3} paddingY={1}>
        <Text role="bodySm" tone="muted">
          {`نطاق الإسناد: ${BTHWANI_DELIVERY_META.label} فقط — توصيل المتجر والاستلام الذاتي لا يحتاجان تعيين كابتن.`}
        </Text>
      </Box>

      {/* KPI summary strip */}
      <WebControlPanelKpiStrip items={summaryKpi} />

      <Box paddingX={3} paddingY={1}>
        <Text role="bodySm" tone="muted">
          ترتبط صفوف الإسناد هنا الآن بحالات lifecycle الموحدة. تفاصيل الطلب تُفتح عند الطلب فقط، مع إبقاء هذه المساحة summary-first.
        </Text>
      </Box>

      {/* Decision rows — duplicate buttons eliminated, one primary action per row */}
      <Box gap={2}>
        {preview.rows.map((item) => {
          const lifecycleState = DISPATCH_LIFECYCLE_STATE_MAP[item.id] ?? 'captain_assignment';
          const lifecycleMetadata = getDshLifecycleStateMetadata(lifecycleState);
          const tone = TONE_MAP[item.statusTone] ?? 'neutral';
          const lifecycleLabel = lifecycleMetadata?.controlPanelLabel ?? item.status;
          const primaryLabel = lifecycleMetadata?.primaryAction?.label ?? 'تأكيد الإسناد';
          const secondaryLabel = lifecycleState === 'reassignment_required'
            ? 'فتح الطلب الحي'
            : lifecycleState === 'captain_unavailable'
              ? 'فتح السعة والمناطق'
              : 'عرض التفاصيل';
          const reason = item.blocker !== 'لا يوجد'
            ? `حالة المسار: ${lifecycleLabel} · المانع: ${item.blocker}`
            : `حالة المسار: ${lifecycleLabel} · ${item.note}`;

          return (
            <WebControlPanelDecisionRow
              key={item.id}
              entityId={item.id}
              entityLabel={`الكابتن: ${item.captain} | المسافة: ${item.distance} | الثقة: ${item.confidence}`}
              status={lifecycleLabel}
              statusTone={tone}
              risk={tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : 'neutral'}
              recommendation={item.recommendation}
              reason={reason}
              sla={`استلام: ${item.pickupEta} | تسليم: ${item.dropoffEta}`}
              primaryAction={{
                id: `${item.id}-primary`,
                label: primaryLabel,
                onAction: () => router.push(buildOperationsHref('dispatch-assignment', { orderId: item.id })),
              }}
              secondaryAction={{
                id: `${item.id}-secondary`,
                label: secondaryLabel,
                onAction: () => router.push(
                  lifecycleState === 'captain_unavailable'
                    ? buildOperationsHref('area-capacity')
                    : buildOperationsHref('live-orders', { orderId: item.id }),
                ),
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default DispatchAssignmentScreen;
