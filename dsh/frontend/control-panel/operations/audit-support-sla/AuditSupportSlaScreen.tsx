'use client';

import React from 'react';
import { Text, Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, type ControlPanelDshActionQueueItem } from '../../shared';
import { AUDIT_SUPPORT_SLA_PREVIEW } from '../operations.preview-data';

export type AuditSupportSlaScreenProps = { hubHref: string; };

export function AuditSupportSlaScreen({ hubHref }: AuditSupportSlaScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(AUDIT_SUPPORT_SLA_PREVIEW.audits[0]?.id ?? null);

  return (
    <Box gap={4}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>التدقيق والدعم وSLA</Text>
        <Text role="bodySm" tone="muted">متابعة جودة التنفيذ والالتزام بالاتفاقيات</Text>
      </Box>

      <ControlPanelDshActionQueue
        title="قائمة التدقيق"
        purpose="مراجعة الأدلة والالتزام بـ SLA"
        items={AUDIT_SUPPORT_SLA_PREVIEW.audits as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={() => {}}
        secondaryAction={() => {}}
        evidenceAction={() => {}}
      />
    </Box>
  );
}

export default AuditSupportSlaScreen;
