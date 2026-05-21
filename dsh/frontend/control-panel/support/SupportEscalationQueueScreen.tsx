// ML-049: CP support escalation queue screen skeleton
// BLOCKED_BY_CONTRACT: implement dedicated escalation queue when CG-032 READ+STREAM proven
import React from 'react';
import { Box, Surface, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import styles from '../shared/control-panel-surface.module.css';
import { getDshFlowPolicySummary } from '../../shared';
import {
  findDshControlPanelGovernanceSectionByFlowId,
  getDshControlPanelGovernanceEntry,
  resolveDshControlPanelSectionLabel,
} from '../shared';

type EscalationRow = {
  id: string;
  ticketCode: string;
  subject: string;
  registryFlowId: string;
  actorKind: 'client' | 'partner' | 'captain';
  actorName: string;
  escalatedAtLabel: string;
  slaLabel: string;
  risk: 'danger' | 'warning' | 'neutral';
  governanceSectionLabel: string;
  policyLabel: string;
  financeReference?: string;
};

const SUPPORT_GOVERNANCE = getDshControlPanelGovernanceEntry('support');
const FINANCE_GOVERNANCE = getDshControlPanelGovernanceEntry('finance');

function resolveSupportPolicyLabel(policy?: string): string {
  if (policy === 'evidence-on-open') {
    return 'أدلة عند الفتح';
  }

  if (policy === 'detail-on-open') {
    return 'تفاصيل عند الفتح';
  }

  if (policy === 'chat-on-open') {
    return 'محادثة عند الفتح';
  }

  if (policy === 'finance-preview-only') {
    return 'مالي للقراءة فقط';
  }

  if (policy === 'summary-only') {
    return 'ملخص أولًا';
  }

  return 'سياسة مرتبطة بالسجل';
}

const placeholderRows: readonly EscalationRow[] = [
  {
    id: 'esc-1',
    ticketCode: '#TKT-891',
    subject: 'مشكلة طلب عميل داخل الطلب',
    registryFlowId: 'client-order-issue',
    actorKind: 'client',
    actorName: 'العميل / الدعم',
    escalatedAtLabel: 'قبل 45 دقيقة',
    slaLabel: '15 دقيقة',
    risk: 'danger',
  },
  {
    id: 'esc-2',
    ticketCode: '#TKT-892',
    subject: 'صف مشكلة طلب يحتاج متابعة مشتركة',
    registryFlowId: 'order-issue-queue',
    actorKind: 'partner',
    actorName: 'الشريك / الدعم',
    escalatedAtLabel: 'قبل 30 دقيقة',
    slaLabel: '30 دقيقة',
    risk: 'warning',
  },
  {
    id: 'esc-3',
    ticketCode: '#TKT-893',
    subject: 'محادثة تحتاج تصعيدًا قبل فوات SLA',
    registryFlowId: 'order-chat-send',
    actorKind: 'client',
    actorName: 'العميل / الدعم',
    escalatedAtLabel: 'قبل 18 دقيقة',
    slaLabel: '20 دقيقة',
    risk: 'warning',
  },
  {
    id: 'esc-4',
    ticketCode: '#TKT-894',
    subject: 'جاهزية فرع رفعت للمراجعة المركزية',
    registryFlowId: 'field-readiness-escalation',
    actorKind: 'partner',
    actorName: 'الميدان / الشركاء',
    escalatedAtLabel: 'قبل 12 دقيقة',
    slaLabel: '45 دقيقة',
    risk: 'warning',
  },
].map((row) => {
  const summary = getDshFlowPolicySummary(row.registryFlowId);
  const governanceEntry = findDshControlPanelGovernanceSectionByFlowId(row.registryFlowId);

  return {
    ...row,
    governanceSectionLabel: governanceEntry?.sectionLabel ?? resolveDshControlPanelSectionLabel('support'),
    policyLabel: resolveSupportPolicyLabel(summary?.onDemandPolicy),
    financeReference: summary?.financialImpact ? FINANCE_GOVERNANCE?.financeReference ?? 'wlt-finance' : undefined,
  };
});

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
      <Box paddingX={4} paddingY={2}>
        <Surface tone="inset" padding={3} gap={1}>
          <Text role="titleSm">ملكية التصعيد</Text>
          <Text role="bodySm" tone="muted">
            {SUPPORT_GOVERNANCE?.notes ?? 'الدعم يملك متابعة التذاكر والمحادثات والتصعيد حتى يتضح المالك التنفيذي التالي.'}
          </Text>
          <Text role="caption" tone="muted">
            IDs وملخصات أولًا، ثم تفاصيل أو أدلة أو مرجع مالي عند الفتح فقط.
          </Text>
        </Surface>
      </Box>
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
                  recommendation={`SLA: ${row.slaLabel} · ${row.policyLabel}`}
                  reason={`${row.actorName} — تصعيد ${row.escalatedAtLabel} · القسم: ${row.governanceSectionLabel}${row.financeReference ? ` · المرجع المالي: ${row.financeReference}` : ''}`}
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
