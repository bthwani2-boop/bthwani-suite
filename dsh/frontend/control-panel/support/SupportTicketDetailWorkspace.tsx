// ML-047: CP support ticket detail workspace skeleton
// TODO: implement when CG-032 (GET/PATCH /dsh/ops/support/tickets/:ticketId) is ready
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
} from '@bthwani/ui-kit/web';

export type SupportTicketDetailWorkspaceProps = {
  ticketId?: string;
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

  return (
    <WebControlPanelInspectorShell
      title={`تذكرة ${ticketCode}`}
      subtitle={subject}
      onClose={onClose}
    >
      <Box gap={4} padding={4}>
        <Box gap={2}>
          {([
            ['رقم التذكرة', ticketCode],
            ['الحالة', statusLabel],
            ['الأولوية', priorityLabel],
            ['نوع الطرف', actorLabel],
            ['الاسم', actorName],
            ['تاريخ الإنشاء', createdAtLabel],
            ['SLA المتبقي', slaLabel],
          ] as const).map(([label, value]) => (
            <Box key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text role="bodySm" tone="muted">{label}</Text>
              <Text role="bodySm">{value}</Text>
            </Box>
          ))}
        </Box>
        <Box paddingY={2}>
          <Text role="titleSm" tone="muted">محتوى التذكرة</Text>
          <Text tone="muted">TODO: عرض رسائل التذكرة وسجل التصعيد بعد ربط CG-032</Text>
        </Box>
        <WebControlPanelActionCluster
          primary={{ id: 'resolve', label: 'حل التذكرة', onAction: onResolve }}
          secondary={{ id: 'escalate', label: 'تصعيد', onAction: onEscalate }}
        />
      </Box>
    </WebControlPanelInspectorShell>
  );
}

export default SupportTicketDetailWorkspace;
