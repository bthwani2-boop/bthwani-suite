'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { SHEIN_PROXY_OPERATIONAL_PREVIEW } from './operations.preview-data';
import styles from './dsh-surface.module.css';

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

export function ControlPanelDshSheinProxyScreen({ hubHref = '/operations', subGroup }: ControlPanelDshSheinProxyScreenProps) {
  const router = useRouter();
  const preview = SHEIN_PROXY_OPERATIONAL_PREVIEW;

  const summaryKpi = [
    { id: 'review', label: 'قيد المراجعة', value: String(preview.summary.underReview), tone: 'neutral' as const },
    { id: 'estimated', label: 'مقدّرة', value: String(preview.summary.estimated), tone: 'neutral' as const },
    { id: 'offered', label: 'العرض المرسل', value: String(preview.summary.offered), tone: 'neutral' as const },
    { id: 'scheduled', label: 'مجدولة', value: String(preview.summary.scheduled), tone: 'danger' as const },
  ];

  return (
    <div className={styles.liveOrdersScreen} dir="rtl">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>شي إن</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <div className={styles.liveOrdersCardsStack}>
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
            sla={`التحديث: ${request.updated} | الإجمالي: ${request.total}`}
            primaryAction={{
              id: 'inspect',
              label: 'افحص الطلب',
              onAction: () => router.push(`${hubHref}?workspace=sheinproxy&requestId=${request.id}`)
            }}
            secondaryAction={{
              id: 'awnak',
              label: 'عرض عونك',
              onAction: () => router.push(`${hubHref}?workspace=proxy-shein-awnak`)
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ControlPanelDshSheinProxyScreen;
