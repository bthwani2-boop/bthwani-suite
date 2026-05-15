// ML-049: CP support escalation queue screen skeleton
// TODO: implement dedicated escalation queue when CG-032 READ+STREAM proven
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import styles from '../shared/control-panel-surface.module.css';

type EscalationRow = {
  id: string;
  ticketCode: string;
  subject: string;
  actorKind: 'client' | 'partner' | 'captain';
  actorName: string;
  escalatedAtLabel: string;
  slaLabel: string;
  risk: 'danger' | 'warning' | 'neutral';
};

const placeholderRows: readonly EscalationRow[] = [
  { id: 'esc-001', ticketCode: '#TKT-892', subject: 'طلب لم يصل منذ 3 ساعات', actorKind: 'client', actorName: 'نوف العتيبي', escalatedAtLabel: 'قبل 45 دقيقة', slaLabel: '15 دقيقة', risk: 'danger' },
  { id: 'esc-002', ticketCode: '#TKT-877', subject: 'شريك يرفض الطلبات', actorKind: 'partner', actorName: 'مطعم الساحة', escalatedAtLabel: 'قبل 90 دقيقة', slaLabel: '60 دقيقة', risk: 'warning' },
];

export type SupportEscalationQueueScreenProps = {
  onOpenTicket?: (ticketId: string) => void;
};

export function SupportEscalationQueueScreen({ onOpenTicket }: SupportEscalationQueueScreenProps) {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>قائمة التصعيد</h1>
              <Box paddingX={1} paddingY={0} background="dangerSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>يتطلب تدخلاً فورياً</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>تذاكر الدعم المصعدة وانتهاكات SLA</p>
          </Box>
        </div>
      </header>
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box padding={4} gap={3}>
            {placeholderRows.length === 0 ? (
              <Box padding={8} align="center" background="surfaceRaised" radiusToken="lg">
                <Text tone="muted">لا توجد تصعيدات نشطة</Text>
              </Box>
            ) : (
              placeholderRows.map((row) => (
                <WebControlPanelDecisionRow
                  key={row.id}
                  entityId={row.ticketCode}
                  entityLabel={row.subject}
                  status={row.actorKind === 'client' ? 'عميل' : row.actorKind === 'partner' ? 'شريك' : 'كابتن'}
                  statusTone="neutral"
                  risk={row.risk}
                  recommendation={`SLA: ${row.slaLabel}`}
                  reason={`${row.actorName} — تصعيد ${row.escalatedAtLabel}`}
                  sla={row.slaLabel}
                  primaryAction={{
                    id: 'open',
                    label: 'فتح التذكرة',
                    onAction: () => onOpenTicket?.(row.id),
                  }}
                />
              ))
            )}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default SupportEscalationQueueScreen;
