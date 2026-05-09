'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { AWNAK_OPERATIONAL_PREVIEW } from './operations.preview-data';
import styles from './dsh-surface.module.css';

export type AwnakScreenProps = {
  hubHref?: string;
  subGroup?: string;
};

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

export function AwnakScreen({ hubHref = '/operations', subGroup }: AwnakScreenProps) {
  const router = useRouter();
  const preview = AWNAK_OPERATIONAL_PREVIEW;

  const summaryKpi = [
    { id: 'review', label: 'جاهز للمراجعة', value: String(preview.summary.underReview), tone: 'neutral' as const },
    { id: 'confirmed', label: 'قيد التأكيد', value: String(preview.summary.confirmed), tone: 'danger' as const },
    { id: 'follow-up', label: 'في المتابعة', value: String(preview.summary.inFollowUp), tone: 'neutral' as const },
    { id: 'escalation', label: 'يحتاج تصعيداً', value: String(preview.summary.escalationNeeded), tone: 'danger' as const },
  ];

  return (
    <div className={styles.liveOrdersScreen} dir="rtl">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>عونك</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <div className={styles.liveOrdersCardsStack}>
        {preview.rows.map((item) => (
          <WebControlPanelDecisionRow
            key={item.requestId}
            entityId={item.requestId}
            entityLabel={`${item.type} — العميل: ${item.customer}`}
            status={item.status}
            statusTone={TONE_MAP[item.statusTone] ?? 'neutral'}
            risk={item.risk === 'مرتفع' ? 'danger' : item.risk === 'متوسط' ? 'warning' : 'neutral'}
            recommendation={item.nextAction}
            reason={item.note}
            sla={`المالك: ${item.owner} | الحالة: ${item.workflowState}`}
            primaryAction={{
              id: 'approve',
              label: item.nextAction,
              onAction: () => router.push(`${hubHref}?workspace=proxy-shein-awnak`)
            }}
            secondaryAction={{
              id: 'details',
              label: 'عرض التفاصيل',
              onAction: () => router.push(`${hubHref}?workspace=sheinproxy`)
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AwnakScreen;
