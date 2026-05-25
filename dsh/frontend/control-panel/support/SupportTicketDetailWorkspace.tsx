// P0-06: Support ticket detail workspace — control-panel/support owns resolution decisions.
// Evidence note is displayed for each escalation transition. Audit log surfaced when auditRequired=true.
// Message timeline uses DSH_DEMO_SUPPORT_TICKETS for preview; real data replaces via prop injection.
// No money mutation — WLT-linked tickets render read-only preview tags only.
import React from 'react';
import { Box, Button, Chip, KeyValueList, Surface, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';
import { getDshFlowPolicySummary } from '../../shared';
import {
  findDshControlPanelGovernanceSectionByFlowId,
  getDshControlPanelGovernanceEntry,
  resolveDshControlPanelSectionLabel,
} from '../shared';
import {
  getDshSupportTicketById,
  getDshSupportTicketStatusLabel,
  getDshSupportTicketStatusTone,
  type DshSupportTicketMessage,
  DSH_DEMO_SUPPORT_TICKETS,
} from '../../data/operations-support.preview';

function MessageBubble({ message }: { message: DshSupportTicketMessage }) {
  const isOps = message.senderKind === 'ops';
  const isSystem = message.isSystem === true;

  if (isSystem) {
    return (
      <Box gap={0}>
        <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>
          {`— ${message.body} · ${message.timestampLabel} —`}
        </Text>
      </Box>
    );
  }

  return (
    <Box gap={1}>
      <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: isOps ? 'flex-start' : 'flex-end' }}>
        <Text role="caption" tone="muted">{message.senderLabel}</Text>
        <Text role="caption" tone="muted">·</Text>
        <Text role="caption" tone="muted">{message.timestampLabel}</Text>
      </Box>
      <Box style={{ alignItems: isOps ? 'flex-start' : 'flex-end' }}>
        <Surface
          tone={isOps ? 'inset' : 'raised'}
          padding={2}
          gap={0}
          style={{ maxWidth: '80%' }}
        >
          <Text role="bodySm">{message.body}</Text>
        </Surface>
      </Box>
    </Box>
  );
}

export type SupportTicketDetailWorkspaceProps = {
  ticketId?: string;
  registryFlowId?: string;
  ticketCode?: string;
  subject?: string;
  statusLabel?: string;
  priorityLabel?: string;
  actorKind?: 'client' | 'partner' | 'captain';
  actorName?: string;
  createdAtLabel?: string;
  slaLabel?: string;
  onEscalate?: () => void;
  onResolve?: () => void;
  onClose?: () => void;
};

export function SupportTicketDetailWorkspace({
  ticketId = 'TKT-001',
  registryFlowId = 'client-order-issue',
  ticketCode,
  subject,
  statusLabel,
  priorityLabel,
  actorKind,
  actorName,
  createdAtLabel,
  slaLabel,
  onEscalate,
  onResolve,
  onClose,
}: SupportTicketDetailWorkspaceProps) {
  // Resolve demo ticket for preview data; props override when provided.
  const demoTicket = getDshSupportTicketById(ticketId) ?? DSH_DEMO_SUPPORT_TICKETS[0];
  const resolvedCode = ticketCode ?? demoTicket.ticketCode;
  const resolvedSubject = subject ?? demoTicket.subject;
  const resolvedStatus = statusLabel ?? getDshSupportTicketStatusLabel(demoTicket.status);
  const resolvedStatusTone = getDshSupportTicketStatusTone(demoTicket.status);
  const resolvedPriority = priorityLabel ?? demoTicket.priorityLabel;
  const resolvedActorKind = actorKind ?? demoTicket.actorKind;
  const resolvedActorLabel =
    resolvedActorKind === 'client' ? 'عميل' : resolvedActorKind === 'partner' ? 'شريك' : 'كابتن';
  const resolvedActorName = actorName ?? demoTicket.actorName;
  const resolvedCreatedAt = createdAtLabel ?? demoTicket.createdAtLabel;
  const resolvedSla = slaLabel ?? demoTicket.slaLabel;
  const resolvedFlowId = demoTicket.flowId ?? registryFlowId;

  const policySummary = getDshFlowPolicySummary(resolvedFlowId ?? registryFlowId);
  const governanceEntry =
    findDshControlPanelGovernanceSectionByFlowId(resolvedFlowId ?? registryFlowId) ??
    getDshControlPanelGovernanceEntry('support');
  const financeEntry = getDshControlPanelGovernanceEntry('finance');
  const messages = demoTicket.messagesPreview;

  return (
    <WebControlPanelInspectorShell
      title={`تذكرة ${resolvedCode}`}
      onClose={onClose}
    >
      <Box gap={4} padding={4}>
        {/* Ticket summary */}
        <Box gap={2}>
          <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Chip label={resolvedStatus} tone={resolvedStatusTone} />
            <Chip label={`أولوية ${resolvedPriority}`} tone={resolvedPriority === 'عالية' ? 'danger' : 'default'} />
            {demoTicket.auditRequired ? <Chip label="تدقيق مطلوب" tone="warning" /> : null}
          </Box>
          <Text role="bodyStrong">{resolvedSubject}</Text>
        </Box>

        <KeyValueList
          dense
          items={[
            { label: 'رقم التذكرة', value: resolvedCode, tone: 'brand' },
            { label: 'التصنيف', value: demoTicket.categoryLabel },
            { label: 'مخرج المعالجة', value: demoTicket.outcomeLabel },
            { label: 'نوع الطرف', value: resolvedActorLabel },
            { label: 'الاسم', value: resolvedActorName },
            { label: 'الكيان المرتبط', value: demoTicket.entityId ? `${demoTicket.entityType} · ${demoTicket.entityId}` : demoTicket.entityType },
            { label: 'صف الملكية', value: demoTicket.ownerQueue },
            { label: 'تاريخ الإنشاء', value: resolvedCreatedAt },
            { label: 'SLA المتبقي', value: resolvedSla },
            { label: 'تدفق السجل', value: policySummary?.flowId ?? (resolvedFlowId ?? registryFlowId) },
            { label: 'قسم الحوكمة', value: governanceEntry?.sectionLabel ?? resolveDshControlPanelSectionLabel('support'), tone: 'brand' },
            { label: 'مالك السياسة', value: governanceEntry?.policyOwner ?? 'control-panel' },
            { label: 'مالك التصعيد', value: policySummary?.escalationOwner ?? governanceEntry?.escalationOwner ?? 'control-panel' },
            { label: 'سياسة الفتح', value: policySummary?.onDemandPolicy ?? 'summary-only' },
          ]}
        />

        {/* Governance context */}
        <Surface tone="inset" padding={3} gap={2}>
          <Text role="titleSm">سياق الحوكمة</Text>
          <Text role="bodySm" tone="muted">
            {governanceEntry?.notes ?? 'هذه المساحة للمتابعة والتدقيق فقط. القرارات المالية تبقى مرجعًا لـ WLT — لا يوجد mutation من هذا المسار.'}
          </Text>
          <Text role="caption" tone="muted">
            {policySummary?.nextPolicyActionPreview ?? 'افتح السجل أو الأدلة أو المحادثة عند الطلب فقط.'}
          </Text>
          {policySummary?.financialImpact ? (
            <Text role="caption" tone="muted">
              {`المرجع المالي: ${financeEntry?.financeReference ?? 'wlt-finance'} · القراءة فقط.`}
            </Text>
          ) : null}
        </Surface>

        {/* Message timeline preview */}
        <Box gap={2}>
          <Text role="titleSm">سجل الرسائل</Text>
          <Text role="caption" tone="muted">
            {`${messages.length} رسائل — الأدلة والمرفقات تُفتح عند الطلب فقط.`}
          </Text>
          <Surface tone="default" padding={3} gap={3}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </Surface>
        </Box>

        {/* Allowed actions */}
        {demoTicket.allowedActions.length > 0 ? (
          <Box gap={1}>
            <Text role="caption" tone="muted">الإجراءات المسموحة:</Text>
            <Box style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {demoTicket.allowedActions.map((action) => (
                <Chip key={action} label={action} />
              ))}
            </Box>
          </Box>
        ) : null}

        {/* Audit notice */}
        {demoTicket.auditRequired ? (
          <Surface tone="inset" padding={2} gap={1}>
            <Text role="caption" tone="warning">
              ⚠ هذه التذكرة تستلزم مراجعة من فريق التدقيق بعد أي تحول في الحالة.
            </Text>
          </Surface>
        ) : null}

        <WebControlPanelActionCluster
          primary={{ id: 'resolve', label: 'فتح سجل المتابعة', onAction: onResolve }}
          secondary={{ id: 'escalate', label: 'فتح مسار التصعيد', onAction: onEscalate }}
        />
      </Box>
    </WebControlPanelInspectorShell>
  );
}

export default SupportTicketDetailWorkspace;
