// ML-035: audit trail detail panel — read-only; populated once audit log API contract exists
import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebControlPanelDecisionRow } from '@bthwani/ui-kit/web';

type AuditTrailEntry = {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  entityId: string;
};

const PLACEHOLDER_ENTRIES: AuditTrailEntry[] = [
  { id: 'ae-001', actor: '—', action: '—', timestamp: '—', entityId: '—' },
];

export function AuditTrailDetailPanel({ ticketId, auditTag }: { ticketId?: string; auditTag?: string }) {
  const entries = PLACEHOLDER_ENTRIES;

  return (
    <Box gap={3}>
      <Box gap={1}>
        <Text role="titleSm" tone="brand" style={{ fontWeight: '700' }}>سجل التدقيق</Text>
        {auditTag && <Text role="caption" tone="muted">{auditTag}</Text>}
        {ticketId && <Text role="caption" tone="muted">رقم التذكرة: {ticketId}</Text>}
      </Box>
      {entries.map((entry) => (
        <WebControlPanelDecisionRow
          key={entry.id}
          entityId={entry.entityId}
          entityLabel={entry.action}
          status={entry.actor}
          statusTone="neutral"
          risk="neutral"
          recommendation={entry.timestamp}
          reason="BLOCKED_BY_CONTRACT — يتطلب ربط مسار GET /dsh/ops/audit/:entityId"
          sla="—"
        />
      ))}
    </Box>
  );
}

export default AuditTrailDetailPanel;
