'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW } from './operations.preview-data';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type DispatchAssignmentScreenProps = { hubHref: string; subGroup?: string };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

export function DispatchAssignmentScreen({ subGroup }: DispatchAssignmentScreenProps) {
  const preview = DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW;

  const summaryKpi = [
    { id: 'waiting', label: 'بانتظار الإسناد', value: String(preview.summary.waitingAssignment), tone: 'danger' as const },
    { id: 'captains', label: 'كباتن متاحون', value: String(preview.summary.availableCaptains), tone: 'success' as const },
    { id: 'ready', label: 'جاهزون للاستلام', value: String(preview.summary.readyForPickup), tone: 'neutral' as const },
  ];

  return (
    <div className={styles.surfaceCockpitContent} dir="rtl">
      {/* KPI summary strip */}
      <WebControlPanelKpiStrip items={summaryKpi} />

      {/* Decision rows — duplicate buttons eliminated, one primary action per row */}
      <Box gap={2} style={{ display: 'grid' }}>
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
