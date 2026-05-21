'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW } from './operations.preview-data';
import { Box, Text } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
// Delivery mode boundary: dispatch applies to bthwani_delivery only.
// partner_delivery and pickup orders do not enter the captain dispatch queue.
// Reference: dsh/frontend/shared/dsh-delivery-mode.model.ts → requiresDispatch
import { getDshDeliveryModeDefinition } from '../../shared/dsh-delivery-mode.model';

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
  const preview = DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW;

  const summaryKpi = [
    { id: 'waiting', label: 'بانتظار الإسناد', value: String(preview.summary.waitingAssignment), tone: 'danger' as const },
    { id: 'captains', label: 'كباتن متاحون', value: String(preview.summary.availableCaptains), tone: 'success' as const },
    { id: 'ready', label: 'جاهزون للاستلام', value: String(preview.summary.readyForPickup), tone: 'neutral' as const },
  ];

  return (
    <div className={styles.surfaceCockpitContent}>
      {/* Delivery mode scope boundary — explicit, not implied */}
      <Box paddingX={3} paddingY={1}>
        <Text role="bodySm" tone="muted">
          {`نطاق الإسناد: ${BTHWANI_DELIVERY_META.label} فقط — توصيل المتجر والاستلام الذاتي لا يحتاجان تعيين كابتن.`}
        </Text>
      </Box>

      {/* KPI summary strip */}
      <WebControlPanelKpiStrip items={summaryKpi} />

      {/* Decision rows — duplicate buttons eliminated, one primary action per row */}
      <Box gap={2} style={{}}>
        {preview.rows.map((item) => {
          const tone = TONE_MAP[item.statusTone] ?? 'neutral';
          return (
            <WebControlPanelDecisionRow
              key={item.id}
              entityId={item.id}
              entityLabel={`الكابتن: ${item.captain} | المسافة: ${item.distance}`}
              status={item.status}
              statusTone={tone}
              risk={tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : 'neutral'}
              recommendation={item.recommendation}
              reason={item.blocker}
              sla={`استلام: ${item.pickupEta} | تسليم: ${item.dropoffEta}`}
              primaryAction={{ id: 'confirm', label: 'تأكيد الإسناد' }}
              secondaryAction={{ id: 'reset', label: 'إعادة تعيين' }}
            />
          );
        })}
      </Box>
    </div>
  );
}

export default DispatchAssignmentScreen;
