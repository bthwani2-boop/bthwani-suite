'use client';

// P0-09: CP audit trail detail workspace — full audit entry display.
// Shows: actor/role, timestamp, section, decision, reason, evidence,
// related entity, affected surfaces, rollback note, section policy.
// All data is UI preview — no backend binding, no runtime auth.
import React from 'react';
import { Box, KeyValueList, Surface, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelInspectorShell,
} from '@bthwani/ui-kit/web';
import type { DshAuditEntry } from '../../shared/dsh-role-permission.model';
import {
  getDshAuditEntryById,
  getDshRoleArabicName,
  getDshRolePermission,
  DSH_AUDIT_PREVIEW_ENTRIES,
} from '../../shared/dsh-role-permission.model';

export type AuditTrailDetailWorkspaceProps = {
  orderId?: string;
  /** Look up by entryId; falls back to first preview entry when absent. */
  entryId?: string;
  /** Pass a resolved entry directly (overrides entryId lookup). */
  auditEntry?: DshAuditEntry;
  onClose?: () => void;
};

const DECISION_TONE: Record<DshAuditEntry['decision'], 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  rejected: 'danger',
  pending:  'warning',
};

const DECISION_LABEL: Record<DshAuditEntry['decision'], string> = {
  approved: 'معتمد ✓',
  rejected: 'مرفوض ✗',
  pending:  'بانتظار القرار',
};

export function AuditTrailDetailWorkspace({
  orderId = '—',
  entryId,
  auditEntry: auditEntryProp,
  onClose,
}: AuditTrailDetailWorkspaceProps) {
  const entry =
    auditEntryProp ??
    (entryId ? getDshAuditEntryById(entryId) : DSH_AUDIT_PREVIEW_ENTRIES[0]);
  const policy = entry ? getDshRolePermission(entry.section) : undefined;

  const shellTitle = entry
    ? `سجل التدقيق — ${entry.relatedEntityLabel ?? orderId}`
    : `سجل التدقيق — ${orderId}`;

  if (!entry) {
    return (
      <WebControlPanelInspectorShell title={shellTitle} onClose={onClose}>
        <Box gap={4} padding={4}>
          <Text role="bodySm" tone="muted">
            لا يوجد سجل تدقيق مرتبط بهذا الكيان.
          </Text>
        </Box>
      </WebControlPanelInspectorShell>
    );
  }

  const decisionTone = DECISION_TONE[entry.decision];

  return (
    <WebControlPanelInspectorShell title={shellTitle} onClose={onClose}>
      <Box gap={4} padding={4}>

        {/* ── Decision banner ── */}
        <Surface tone={decisionTone} padding={3} radiusToken="md" border>
          <Box layoutDirection="row" justify="space-between" align="center" gap={2}>
            <Text role="titleSm" tone="inverse">{DECISION_LABEL[entry.decision]}</Text>
            <Text role="caption" tone="inverse">{entry.timestamp}</Text>
          </Box>
          {entry.rollbackNote ? (
            <Text role="caption" tone="inverse" style={{ marginTop: 6 }}>
              ↩ {entry.rollbackNote}
            </Text>
          ) : null}
        </Surface>

        {/* ── Actor & section ── */}
        <KeyValueList
          items={[
            { label: 'المنفّذ',        value: entry.actorName },
            { label: 'الدور',          value: getDshRoleArabicName(entry.actorRoleId) },
            { label: 'القسم',          value: policy?.arabicLabel ?? entry.section },
            { label: 'الإجراء',        value: entry.sensitiveAction },
            {
              label: 'الكيان المرتبط',
              value: entry.relatedEntityLabel
                ? `${entry.relatedEntityLabel} (${entry.relatedEntityId ?? '—'})`
                : '—',
            },
          ]}
        />

        {/* ── Reason ── */}
        <Box gap={1}>
          <Text role="titleSm">السبب</Text>
          <Surface tone="inset" padding={3} radiusToken="md">
            <Text role="bodySm">{entry.reason}</Text>
          </Surface>
        </Box>

        {/* ── Evidence (conditional) ── */}
        {entry.evidence ? (
          <Box gap={1}>
            <Text role="titleSm">الإثبات / الدليل</Text>
            <Surface tone="inset" padding={3} radiusToken="md">
              <Text role="bodySm">{entry.evidence}</Text>
            </Surface>
          </Box>
        ) : null}

        {/* ── Affected surfaces ── */}
        <Box gap={1}>
          <Text role="titleSm">الأسطح المتأثرة</Text>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {entry.affectedSurfaces.map((s) => (
              <Surface key={s} tone="raised" padding={1} radiusToken="pill" border>
                <Text role="caption" tone="muted">{s}</Text>
              </Surface>
            ))}
          </Box>
        </Box>

        {/* ── WLT read-only notice ── */}
        {entry.wltReadOnly ? (
          <Surface tone="warning" padding={3} radiusToken="md" border>
            <Text role="bodySm" tone="warning">
              WLT — قراءة فقط: أي إجراء مالي مرتبط بهذا السجل يُنفَّذ في WLT فقط. DSH يعرض ولا يُعدّل.
            </Text>
          </Surface>
        ) : null}

        {/* ── Section policy context ── */}
        {policy ? (
          <Surface tone="inset" padding={3} gap={2} radiusToken="md">
            <Text role="caption" tone="muted" weight="bold">سياسة القسم</Text>
            <Text role="bodySm" tone="muted">{policy.arabicDescription}</Text>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              {policy.auditRequired ? (
                <Surface tone="warning" padding={1} radiusToken="pill" border={false}>
                  <Text role="caption" tone="muted">تدقيق إلزامي</Text>
                </Surface>
              ) : null}
              {policy.reasonRequired ? (
                <Surface tone="raised" padding={1} radiusToken="pill" border>
                  <Text role="caption" tone="muted">سبب مطلوب</Text>
                </Surface>
              ) : null}
              {policy.evidenceRequired ? (
                <Surface tone="raised" padding={1} radiusToken="pill" border>
                  <Text role="caption" tone="muted">إثبات مطلوب</Text>
                </Surface>
              ) : null}
              {policy.wltMutationForbidden ? (
                <Surface tone="danger" padding={1} radiusToken="pill" border={false}>
                  <Text role="caption" tone="inverse">mutation مالي ممنوع</Text>
                </Surface>
              ) : null}
            </Box>
          </Surface>
        ) : null}

      </Box>
    </WebControlPanelInspectorShell>
  );
}

export default AuditTrailDetailWorkspace;
