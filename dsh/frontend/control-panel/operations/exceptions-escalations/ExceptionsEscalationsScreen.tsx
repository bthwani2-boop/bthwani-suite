'use client';

import React from 'react';
import { Text, Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, type ControlPanelDshActionQueueItem } from '../../shared';
import { EXCEPTIONS_ESCALATIONS_PREVIEW } from '../operations.preview-data';

export type ExceptionsEscalationsScreenProps = { hubHref: string; };

export function ExceptionsEscalationsScreen({ hubHref }: ExceptionsEscalationsScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(EXCEPTIONS_ESCALATIONS_PREVIEW.exceptions[0]?.id ?? null);

  return (
    <Box gap={4}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>الاستثناءات والتصعيد</Text>
        <Text role="bodySm" tone="muted">إدارة الحالات الاستثنائية والتعافي</Text>
      </Box>

      <ControlPanelDshActionQueue
        title="قائمة الاستثناءات"
        purpose="متابعة الحالات التي تحتاج تدخل سريع"
        items={EXCEPTIONS_ESCALATIONS_PREVIEW.exceptions as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={() => {}}
        secondaryAction={() => {}}
        evidenceAction={() => {}}
      />
    </Box>
  );
}

export default ExceptionsEscalationsScreen;
