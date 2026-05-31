'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelSplitPane,
  WebControlPanelQueue,
  WebControlPanelStatusTag,
} from '@bthwani/ui-kit/web';
import { AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW } from '../../data/orders.preview-data';
import { Box } from '@bthwani/ui-kit';
import { AuditTrailDetailWorkspace } from './AuditTrailDetailWorkspace';
import { getDshControlPanelGovernanceEntry } from '../shared/dsh-control-panel-governance.map';
import styles from '../shared/control-panel-surface.module.css';

export type AuditSupportSlaScreenProps = { hubHref: string; subGroup?: string; };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

export function AuditSupportSlaScreen({ hubHref: _hubHref, subGroup: _subGroup }: AuditSupportSlaScreenProps) {
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
    <Box gap={3}>
      {/* ── KPIs ── */}
      <WebControlPanelKpiStrip items={summaryKpi} />

      {/* ── Governance Header Cards ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div className={styles.surfaceInfoCard} style={{ flex: '1 1 300px', padding: '6px 12px' }}>
          <div>
            <div className={styles.surfaceInfoCardTitle}>مالك التذاكر والمتابعة</div>
            <div className={styles.surfaceInfoCardDescription}>{supportGovernance.notes}</div>
          </div>
        </div>
        <div className={styles.surfaceInfoCard} style={{ flex: '1 1 300px', padding: '6px 12px' }}>
          <div>
            <div className={styles.surfaceInfoCardTitle}>مرجع السياسات والالتزام</div>
            <div className={styles.surfaceInfoCardDescription}>{platformGovernance.notes}</div>
          </div>
        </div>
      </div>

      {/* ── Split Layout ── */}
      <div className={styles.surfaceSplitGrid}>
        <Box gap={3}>
          <WebControlPanelQueue
            title="سجل التدقيق والمتابعة"
            meta={`${preview.audits.length} تدقيقات نشطة`}
          >
            {/* Table Column Headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr auto',
                gap: '8px',
                padding: '8px 12px',
                background: 'var(--bthwani-control-panel-surface-inset)',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '11px',
                color: 'var(--bthwani-control-panel-text-muted)',
                borderBottom: '1px solid var(--bthwani-control-panel-border)',
              }}
            >
              <span>المُنفّذ والسبب</span>
              <span>الملاحظة والتدقيق</span>
              <span>المستند والربط</span>
              <span>الحالة والتوقيت</span>
              <span style={{ width: '40px', textAlign: 'center' }}>العمل</span>
            </div>

            {/* Table Rows */}
            {preview.audits.map((item) => {
              const statusTone = TONE_MAP[item.statusTone] ?? 'neutral';
              const isSelected = detailOrderId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setDetailOrderId(isSelected ? null : item.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr auto',
                    gap: '8px',
                    padding: '10px 12px',
                    background: isSelected ? 'var(--bthwani-brand-surface)' : 'var(--bthwani-control-panel-surface)',
                    border: isSelected ? '1px solid var(--bthwani-brand)' : '1px solid var(--bthwani-control-panel-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    alignItems: 'center',
                  }}
                >
                  {/* Column 1: Who and Why (Clear Arabic Label) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <strong style={{ color: 'var(--bthwani-control-panel-brand)' }}>{item.who}</strong>
                    <span style={{ color: 'var(--bthwani-control-panel-text)', fontSize: '11px' }}>{item.why}</span>
                  </div>

                  {/* Column 2: Note and technical token as secondary muted tag */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'var(--bthwani-control-panel-text)' }}>{item.note}</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '9px', background: 'var(--bthwani-control-panel-surface-inset)', color: 'var(--bthwani-control-panel-text-muted)', padding: '1px 5px', borderRadius: '4px' }}>
                        ID: {item.id}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Proof and Ticket link */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text)' }}>{item.proofRequired}</span>
                    <span style={{ fontSize: '10px', color: 'var(--bthwani-control-panel-brand)' }}>{item.supportTicketLink}</span>
                  </div>

                  {/* Column 4: Status and Time */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div>
                      <WebControlPanelStatusTag label={item.permissionResult} tone={statusTone} />
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--bthwani-control-panel-text-muted)' }}>{item.when}</span>
                  </div>

                  {/* Column 5: Inspect button */}
                  <button
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--bthwani-control-panel-brand)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      width: '40px',
                      textAlign: 'center',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailOrderId(isSelected ? null : item.id);
                    }}
                    aria-label="فتح التفاصيل"
                  >
                    {isSelected ? '◀' : '►'}
                  </button>
                </div>
              );
            })}
          </Box>
        </Box>

        <Box gap={4}>
          {detailOrderId !== null ? (
            <AuditTrailDetailWorkspace
              orderId={detailOrderId}
              onClose={() => setDetailOrderId(null)}
            />
          ) : (
            <WebControlPanelRecommendation
              title="تفاصيل سجل التدقيق"
              reason="اختر أحد التدقيقات التشغيلية من سجل التدقيق لمعاينة تفاصيل الإثبات ومراجعة SLA."
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />
          )}
        </Box>
      </div>
    </Box>
  );
}

export default AuditSupportSlaScreen;
