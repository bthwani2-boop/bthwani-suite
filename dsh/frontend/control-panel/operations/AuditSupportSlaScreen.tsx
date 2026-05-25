'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW } from '../../data/cp-operations.preview-data';
import { Box } from '@bthwani/ui-kit';
import { AuditTrailDetailWorkspace } from './AuditTrailDetailWorkspace';
import { getDshControlPanelGovernanceEntry } from '../shared/dsh-control-panel-governance.map';
import { buildOperationsHref } from './operations.registry';
import styles from '../shared/control-panel-surface.module.css';

export type AuditSupportSlaScreenProps = { hubHref: string; subGroup?: string; };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

export function AuditSupportSlaScreen({ hubHref, subGroup }: AuditSupportSlaScreenProps) {
  const router = useRouter();
  const preview = AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW;
  const [detailOrderId, setDetailOrderId] = React.useState<string | null>(null);
  const supportGovernance = getDshControlPanelGovernanceEntry('support');
  const platformGovernance = getDshControlPanelGovernanceEntry('platform');

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

      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceInfoCard}>
          <div>
            <div className={styles.surfaceInfoCardTitle}>مالك التذاكر والمتابعة</div>
            <div className={styles.surfaceInfoCardDescription}>{supportGovernance.notes}</div>
          </div>
        </div>
        <div className={styles.surfaceInfoCard}>
          <div>
            <div className={styles.surfaceInfoCardTitle}>مرجع السياسات والالتزام</div>
            <div className={styles.surfaceInfoCardDescription}>{platformGovernance.notes}</div>
          </div>
        </div>
      </div>

      <div className={styles.surfaceDetailSplit}>
        <div className={styles.surfaceListColumn}>
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
                id: `${item.id}-route`,
                label: item.resolutionPath === 'حل' ? 'فتح مسار الحل' : 'فتح مسار التصعيد',
                onAction: () => router.push(
                  buildOperationsHref(
                    item.resolutionPath === 'حل' ? 'audit-support-sla' : 'exceptions-escalations',
                    { orderId: item.id },
                  ),
                ),
              }}
              secondaryAction={{
                id: `${item.id}-detail`,
                label: detailOrderId === item.id ? 'إخفاء التفاصيل' : 'سجل التدقيق',
                onAction: () => setDetailOrderId(detailOrderId === item.id ? null : item.id),
              }}
            />
          ))}
        </div>
        {detailOrderId !== null && (
          <div className={styles.surfaceDetailRail}>
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
