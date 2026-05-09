'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { LIVE_ORDERS_OPERATIONAL_PREVIEW } from './operations.preview-data';
import styles from './dsh-surface.module.css';

export type LiveOrdersScreenProps = {
  state?: 'ready' | 'loading' | 'error' | 'empty';
  hubHref: string;
  subGroup?: string;
  onRetry?: () => void;
};

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

export function LiveOrdersScreen({ state = 'ready', subGroup, onRetry }: LiveOrdersScreenProps) {
  const preview = LIVE_ORDERS_OPERATIONAL_PREVIEW;

  if (state === 'loading') {
    return (
      <div className={styles.liveOrdersScreen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p style={{ color: '#64748B', fontSize: '13px' }}>جارٍ تحميل العمليات الحية...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={styles.liveOrdersScreen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ textAlign: 'center', border: '1px solid rgba(220,38,38,0.2)', padding: '24px', borderRadius: '10px', background: '#FFF1F2' }}>
          <p style={{ color: '#991B1B', fontSize: '13px', marginBottom: '12px' }}>تعذر الاتصال بخادم العمليات المباشرة.</p>
          <button onClick={onRetry} style={{ padding: '6px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  const summaryKpi = [
    { id: 'awaiting', label: 'بانتظار التأكيد', value: String(preview.summary.awaitingAcknowledgement), tone: 'neutral' as const },
    { id: 'blocked', label: 'رنينات محجوبة', value: String(preview.summary.blockedRings), tone: 'danger' as const },
    { id: 'hint', label: preview.summary.ringLabel, value: preview.summary.actionHint, tone: 'neutral' as const },
  ];

  return (
    <div className={styles.liveOrdersScreen} dir="rtl">
      {/* KPI summary strip */}
      <WebControlPanelKpiStrip items={summaryKpi} />

      {/* Decision rows — one action cluster per row, no duplicate buttons */}
      <div className={styles.liveOrdersCardsStack}>
        {preview.rows.map((order) => (
          <WebControlPanelDecisionRow
            key={order.id}
            entityId={order.id}
            entityLabel={`${order.destination} — الكابتن: ${order.captain}`}
            status={order.status}
            statusTone={TONE_MAP[order.statusTone] ?? 'neutral'}
            risk={TONE_MAP[order.statusTone] === 'danger' ? 'danger' : TONE_MAP[order.statusTone] === 'warning' ? 'warning' : 'neutral'}
            recommendation={order.suggestion.label}
            reason={order.suggestion.reason}
            sla={`ETA: ${order.eta} | ${order.ringLabel}`}
            primaryAction={{ id: 'primary', label: order.suggestion.action }}
            secondaryAction={order.suggestion.secondary ? { id: 'secondary', label: order.suggestion.secondary } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default LiveOrdersScreen;
