'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { AREA_CAPACITY_OPERATIONAL_PREVIEW } from '../../data/cp-operations.preview-data';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type AreaCapacityScreenProps = { hubHref: string; subGroup?: string; };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

const runPreviewOperation = () => undefined;

export function AreaCapacityScreen({ hubHref: _hubHref, subGroup: _subGroup }: AreaCapacityScreenProps) {
  const preview = AREA_CAPACITY_OPERATIONAL_PREVIEW;

  const summaryKpi = [
    { id: 'load', label: 'حِمل المنطقة', value: preview.summary.zoneLoad, tone: 'danger' as const },
    { id: 'protected', label: 'المناطق المحمية', value: String(preview.summary.protectedZones), tone: 'neutral' as const },
    { id: 'free', label: 'المناطق الحرة', value: String(preview.summary.freeZones), tone: 'neutral' as const },
    { id: 'surge', label: 'الحافز المقترح', value: preview.summary.surgeBonus, tone: 'success' as const },
  ];

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>المناطق والسعة</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <Box gap={2}>
        {preview.zones.map((area) => (
          <WebControlPanelDecisionRow
            key={area.id}
            entityId={area.id}
            entityLabel={area.zone}
            status={area.zoneLoad}
            statusTone={TONE_MAP[area.statusTone] ?? 'neutral'}
            risk={area.statusTone === 'danger' ? 'danger' : area.statusTone === 'warning' ? 'warning' : 'neutral'}
            recommendation={area.recommendation}
            reason={area.note}
            sla={`محمية: ${area.protectedZones} | حرة: ${area.freeZones} | ${area.surgeBonus}`}
            primaryAction={{
              id: 'bonus',
              label: 'تفعيل الحافز',
              onAction: runPreviewOperation,
            }}
            secondaryAction={{
              id: 'stop',
              label: 'إيقاف مؤقت',
              onAction: runPreviewOperation,
            }}
          />
        ))}
      </Box>
    </div>
  );
}

export default AreaCapacityScreen;
