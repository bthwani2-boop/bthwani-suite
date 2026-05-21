// ML-047: CP support ticket detail workspace skeleton
// BLOCKED_BY_CONTRACT: implement when CG-032 (GET/PATCH /dsh/ops/support/tickets/:ticketId) is ready
import React from 'react';
import { Box, KeyValueList, Surface, Text } from '@bthwani/ui-kit';
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
  ticketCode = '#TKT-001',
  subject = 'مشكلة في الطلب',
  statusLabel = 'مفتوح',
  priorityLabel = 'عالية',
  actorKind = 'client',
  actorName = 'العميل',
  createdAtLabel = '—',
  slaLabel = '—',
  onEscalate,
  onResolve,
  onClose,
}: SupportTicketDetailWorkspaceProps) {
  const actorLabel = actorKind === 'client' ? 'عميل' : actorKind === 'partner' ? 'شريك' : 'كابتن';
  const policySummary = getDshFlowPolicySummary(registryFlowId);
  const governanceEntry = findDshControlPanelGovernanceSectionByFlowId(registryFlowId) ?? getDshControlPanelGovernanceEntry('support');
  const financeEntry = getDshControlPanelGovernanceEntry('finance');

  return (
    <WebControlPanelInspectorShell
      title={`تذكرة ${ticketCode}`}
      onClose={onClose}
    >
      <Box gap={4} padding={4}>
        <KeyValueList
          dense
          items={[
            { label: 'رقم التذكرة', value: ticketCode, tone: 'brand' },
            { label: 'الحالة', value: statusLabel },
            { label: 'الأولوية', value: priorityLabel },
            { label: 'نوع الطرف', value: actorLabel },
            { label: 'الاسم', value: actorName },
            { label: 'تاريخ الإنشاء', value: createdAtLabel },
            { label: 'SLA المتبقي', value: slaLabel },
            { label: 'تدفق السجل', value: policySummary?.flowId ?? registryFlowId },
            { label: 'قسم الحوكمة', value: governanceEntry?.sectionLabel ?? resolveDshControlPanelSectionLabel('support'), tone: 'brand' },
            { label: 'مالك السياسة', value: governanceEntry?.policyOwner ?? 'control-panel' },
            { label: 'مالك التصعيد', value: policySummary?.escalationOwner ?? governanceEntry?.escalationOwner ?? 'control-panel' },
            { label: 'سياسة الفتح', value: policySummary?.onDemandPolicy ?? 'summary-only' },
          ]}
        />
        <Surface tone="inset" padding={3} gap={2}>
          <Text role="titleSm">سياق الحوكمة</Text>
          <Text role="bodySm" tone="muted">
            {governanceEntry?.notes ?? 'هذه المساحة للمتابعة والتدقيق فقط. لا يوجد تنفيذ backend أو قرار مالي من هذا المسار.'}
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
        <Box paddingY={2}>
          <Text role="titleSm" tone="muted">محتوى التذكرة</Text>
          <Text tone="muted">BLOCKED_BY_CONTRACT: عرض رسائل التذكرة وسجل التصعيد بعد ربط CG-032</Text>
        </Box>
        <WebControlPanelActionCluster
          primary={{ id: 'resolve', label: 'فتح سجل المتابعة', onAction: onResolve }}
          secondary={{ id: 'escalate', label: 'فتح مسار التصعيد', onAction: onEscalate }}
        />
      </Box>
    </WebControlPanelInspectorShell>
  );
}

export default SupportTicketDetailWorkspace;
