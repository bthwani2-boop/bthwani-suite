// P0-06: Audit trail detail panel — read-only preview; real entries arrive via API binding.
// Authority: control-panel/support owns audit log display. No mutation from this panel.
// auditTag links the panel to a specific queue or ticket context for filtering.
import React from 'react';
import { Box, Chip, Text } from '@bthwani/ui-kit';
import { WebControlPanelDecisionRow } from '@bthwani/ui-kit/web';

type AuditTrailEntry = {
  id: string;
  actor: string;
  actorKind: 'client' | 'partner' | 'captain' | 'field' | 'ops' | 'system';
  action: string;
  context: string;
  timestamp: string;
  entityId: string;
  risk: 'neutral' | 'warning' | 'danger';
};

const PREVIEW_ENTRIES: ReadonlyArray<AuditTrailEntry> = [
  {
    id: 'ae-001',
    actor: 'فريق الدعم',
    actorKind: 'ops',
    action: 'تصعيد التذكرة TKT-001',
    context: 'تحول الحالة من in-review إلى escalated — SLA في خطر.',
    timestamp: '10:51 ص',
    entityId: 'TKT-001',
    risk: 'danger',
  },
  {
    id: 'ae-002',
    actor: 'محمد العتيبي',
    actorKind: 'client',
    action: 'رفع بلاغ تعذّر تسليم',
    context: 'العميل فتح تذكرة دعم من داخل الطلب ORD-4401.',
    timestamp: '10:43 ص',
    entityId: 'ORD-4401',
    risk: 'warning',
  },
  {
    id: 'ae-003',
    actor: 'النظام',
    actorKind: 'system',
    action: 'انتهاك SLA مراقبة support-sla',
    context: 'تذكرة TKT-001 تجاوزت نافذة الاستجابة المحددة.',
    timestamp: '10:55 ص',
    entityId: 'TKT-001',
    risk: 'danger',
  },
  {
    id: 'ae-004',
    actor: 'الميداني — أحمد',
    actorKind: 'field',
    action: 'رفع إثبات جاهزية فرع',
    context: 'إثبات ميداني مرتبط بتصعيد TKT-894 — جاهزية الفرع.',
    timestamp: '09:48 ص',
    entityId: 'TKT-894',
    risk: 'neutral',
  },
];

const ACTOR_KIND_LABEL: Record<AuditTrailEntry['actorKind'], string> = {
  client: 'عميل',
  partner: 'شريك',
  captain: 'كابتن',
  field: 'ميداني',
  ops: 'أوبريشن',
  system: 'نظام',
};

export function AuditTrailDetailPanel({ ticketId, auditTag }: { ticketId?: string; auditTag?: string }) {
  const entries = ticketId
    ? PREVIEW_ENTRIES.filter((e) => e.entityId === ticketId)
    : PREVIEW_ENTRIES;

  const displayEntries = entries.length > 0 ? entries : PREVIEW_ENTRIES;

  return (
    <Box gap={3}>
      <Box gap={1}>
        <Text role="titleSm" tone="brand" weight="bold" style={{ }}>سجل التدقيق</Text>
        <Box style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {auditTag ? <Chip label={auditTag} /> : null}
          {ticketId ? <Chip label={`تذكرة: ${ticketId}`} tone="brand" /> : null}
          <Text role="caption" tone="muted">{`${displayEntries.length} إدخالات`}</Text>
        </Box>
      </Box>
      {displayEntries.map((entry) => (
        <WebControlPanelDecisionRow
          key={entry.id}
          entityId={entry.entityId}
          entityLabel={entry.action}
          status={`${ACTOR_KIND_LABEL[entry.actorKind]}: ${entry.actor}`}
          statusTone="neutral"
          risk={entry.risk}
          recommendation={entry.context}
          reason={`التوقيت: ${entry.timestamp} · المرجع: ${entry.entityId}`}
          sla={entry.timestamp}
        />
      ))}
    </Box>
  );
}

export default AuditTrailDetailPanel;
