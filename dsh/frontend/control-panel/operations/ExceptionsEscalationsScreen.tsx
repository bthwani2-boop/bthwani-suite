'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW } from './operations.preview-data';
import styles from './dsh-surface.module.css';

export type ExceptionsEscalationsScreenProps = { hubHref: string; subGroup?: string; };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

export function ExceptionsEscalationsScreen({ hubHref, subGroup }: ExceptionsEscalationsScreenProps) {
  const preview = EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW;

  const summaryKpi = [
    { id: 'open', label: 'مفتوحة', value: String(preview.summary.open), tone: 'danger' as const },
    { id: 'escalate', label: 'تصعيد', value: String(preview.summary.escalate), tone: 'warning' as const },
    { id: 'resolve', label: 'حل', value: String(preview.summary.resolve), tone: 'neutral' as const },
    { id: 'close', label: 'إغلاق', value: String(preview.summary.close), tone: 'success' as const },
  ];

  return (
    <div className={styles.liveOrdersScreen} dir="rtl">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>الاستثناءات والتصعيد</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <div className={styles.liveOrdersCardsStack}>
        {preview.exceptions.map((exc) => (
          <WebControlPanelDecisionRow
            key={exc.id}
            entityId={exc.id}
            entityLabel={exc.type}
            status={exc.severity}
            statusTone={TONE_MAP[exc.statusTone] ?? 'neutral'}
            risk={exc.statusTone === 'danger' ? 'danger' : exc.statusTone === 'warning' ? 'warning' : 'neutral'}
            recommendation={exc.suggestedAction}
            reason={exc.note}
            sla={`البداية: ${exc.startTime} | المالك: ${exc.currentOwner}`}
            primaryAction={{
              id: 'resolve',
              label: exc.resolutionPath === 'حل' ? 'حل الاستثناء' : 'تصعيد',
              onAction: () => console.log('Resolve/Escalate', exc.id)
            }}
            secondaryAction={{
              id: 'close',
              label: 'إغلاق السجل',
              onAction: () => console.log('Close Record', exc.id)
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ExceptionsEscalationsScreen;
