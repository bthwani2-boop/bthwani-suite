'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { AWNAK_OPERATIONAL_PREVIEW } from '../../data/orders.preview-data';
import { AWNAK_STAGE_LABELS } from '../../shared/dsh-order-preview.contract';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

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

const STAGE_ORDER = Object.keys(AWNAK_STAGE_LABELS) as Array<keyof typeof AWNAK_STAGE_LABELS>;

export function AwnakScreen({ hubHref = '/operations', subGroup }: AwnakScreenProps) {
  const router = useRouter();
  const preview = AWNAK_OPERATIONAL_PREVIEW;

  const summaryKpi = STAGE_ORDER.map((stage) => ({
    id: stage,
    label: AWNAK_STAGE_LABELS[stage],
    value: String(preview.summary[stage]),
    tone: stage === 'escalated' || stage === 'dispatch_pending' ? ('danger' as const)
      : stage === 'quote_review' || stage === 'proof_review' ? ('neutral' as const)
      : stage === 'completed' ? ('success' as const)
      : ('neutral' as const),
  }));

  return (
    <Box gap={3}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>عونك — العمليات</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <Box gap={2} style={{}}>
        {preview.rows.map((item) => (
          <WebControlPanelDecisionRow
            key={item.requestId}
            entityId={item.requestId}
            entityLabel={`${item.type} — ${item.customer}`}
            status={item.status}
            statusTone={TONE_MAP[item.statusTone] ?? 'neutral'}
            risk={item.risk === 'مرتفع' ? 'danger' : item.risk === 'متوسط' ? 'warning' : 'neutral'}
            recommendation={item.nextAction}
            reason={item.note}
            sla={`المالك: ${item.owner} | SLA: ${item.sla}${item.captainId ? ` | الكابتن: ${item.captainId}` : ' | غير مسند'}`}
            primaryAction={{
              id: 'approve',
              label: item.nextAction,
              onAction: () => router.push(`${hubHref}?workspace=awnak-operations&requestId=${item.requestId}`)
            }}
            secondaryAction={{
              id: 'details',
              label: 'عرض التفاصيل',
              onAction: () => router.push(`${hubHref}?workspace=awnak-operations&panel=detail&requestId=${item.requestId}`)
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default AwnakScreen;
