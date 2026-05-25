'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { SHEIN_PROXY_OPERATIONAL_PREVIEW, SHEIN_PROXY_STAGE_LABELS } from '../../data/orders.preview-data';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type ControlPanelDshSheinProxyScreenProps = {
  hubHref?: string;
  subGroup?: string;
};

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

const STAGE_ORDER = Object.keys(SHEIN_PROXY_STAGE_LABELS) as Array<keyof typeof SHEIN_PROXY_STAGE_LABELS>;

export function ControlPanelDshSheinProxyScreen({ hubHref = '/operations', subGroup }: ControlPanelDshSheinProxyScreenProps) {
  const router = useRouter();
  const preview = SHEIN_PROXY_OPERATIONAL_PREVIEW;

  const summaryKpi = STAGE_ORDER.map((stage) => ({
    id: stage,
    label: SHEIN_PROXY_STAGE_LABELS[stage],
    value: String(preview.summary[stage]),
    tone: stage === 'exception' ? ('danger' as const)
      : stage === 'intake_review' || stage === 'quote_pending' || stage === 'customer_approval' ? ('neutral' as const)
      : stage === 'delivered' ? ('success' as const)
      : ('neutral' as const),
  }));

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>شي إن — عمليات الوكالة</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <Box gap={2} style={{}}>
        {preview.requests.map((request) => (
          <WebControlPanelDecisionRow
            key={request.id}
            entityId={request.id}
            entityLabel={request.customer}
            status={request.statusLabel}
            statusTone={TONE_MAP[request.statusTone] ?? 'neutral'}
            risk={request.statusTone === 'danger' ? 'danger' : request.statusTone === 'warning' ? 'warning' : 'neutral'}
            recommendation={request.nextStep}
            reason={request.note}
            sla={`المالك: ${request.owner} | SLA: ${request.sla} | الإجمالي: ${request.total}`}
            primaryAction={{
              id: 'inspect',
              label: request.nextStep,
              onAction: () => router.push(`${hubHref}?workspace=sheinproxy&requestId=${request.id}`)
            }}
            secondaryAction={{
              id: 'batches',
              label: 'إدارة الدُفعة',
              onAction: () => router.push(`${hubHref}?workspace=sheinproxy&panel=batches&requestId=${request.id}`)
            }}
          />
        ))}
      </Box>
    </div>
  );
}

export default ControlPanelDshSheinProxyScreen;
