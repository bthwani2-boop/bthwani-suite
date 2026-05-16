'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW } from './operations.preview-data';
import { Box } from '@bthwani/ui-kit';
import { AuditTrailDetailWorkspace } from './AuditTrailDetailWorkspace';
import styles from '../shared/control-panel-surface.module.css';

export type AuditSupportSlaScreenProps = { hubHref: string; subGroup?: string; };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

export function AuditSupportSlaScreen({ hubHref, subGroup }: AuditSupportSlaScreenProps) {
  const preview = AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW;
  const [detailOrderId, setDetailOrderId] = React.useState<string | null>(null);

  const summaryKpi = [
    { id: 'audits', label: 'التدقيقات اليدوية', value: String(preview.summary.manualAudits), tone: 'neutral' as const },
    { id: 'support', label: 'تذاكر الدعم', value: String(preview.summary.supportTickets), tone: 'neutral' as const },
    { id: 'sla', label: 'خطر SLA', value: String(preview.summary.slaRisk), tone: 'danger' as const },
    { id: 'evidence', label: 'اكتمال الإثبات', value: `${preview.summary.evidenceComplete}%`, tone: 'success' as const },
  ];

  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>التدقيق والدعم وSLA</h2>
      </div>

      <WebControlPanelKpiStrip items={summaryKpi} />

      <div style={{ display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'flex-start' }}>
        <Box gap={2} style={{ flex: 1 }}>
          {preview.audits.map((item) => (
            <WebControlPanelDecisionRow
              key={item.id}
              entityId={item.id}
              entityLabel={`${item.who} — ${item.why}`}
              status={item.permissionResult}
              statusTone={TONE_MAP[item.statusTone] ?? 'neutral'}
              risk={item.statusTone === 'danger' ? 'danger' : item.statusTone === 'warning' ? 'warning' : 'neutral'}
              recommendation={item.resolutionPath}
              reason={item.note}
              sla={`الوقت: ${item.when} | الإثبات: ${item.proofRequired}`}
              primaryAction={{
                id: 'resolve',
                label: item.resolutionPath === 'حل' ? 'حل التدقيق' : 'تصعيد',
                onAction: () => console.log('Resolve/Escalate', item.id)
              }}
              secondaryAction={{
                id: 'detail',
                label: detailOrderId === item.id ? 'إخفاء التفاصيل' : 'سجل التدقيق',
                onAction: () => setDetailOrderId(detailOrderId === item.id ? null : item.id)
              }}
            />
          ))}
        </Box>
        {detailOrderId !== null && (
          <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid #E2E8F0' }}>
            <AuditTrailDetailWorkspace
              orderId={detailOrderId}
              onClose={() => setDetailOrderId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditSupportSlaScreen;
