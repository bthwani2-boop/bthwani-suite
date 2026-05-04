'use client';

import React from 'react';
import { Text, Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, type ControlPanelDshActionQueueItem } from '../../shared';
import { CAPTAIN_OPERATIONS_PREVIEW } from '../operations.preview-data';

export type CaptainOperationsScreenProps = { hubHref: string; };

export function CaptainOperationsScreen({ hubHref }: CaptainOperationsScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(CAPTAIN_OPERATIONS_PREVIEW.captains[0]?.id ?? null);

  return (
    <Box gap={4}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>تشغيل الكباتن</Text>
        <Text role="bodySm" tone="muted">مراقبة جاهزية الكباتن وتغطية المناطق</Text>
      </Box>

      <ControlPanelDshActionQueue
        title="قائمة الكباتن"
        purpose="إدارة حالة وجاهزية الكباتن"
        items={CAPTAIN_OPERATIONS_PREVIEW.captains as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={() => {}}
        secondaryAction={() => {}}
        evidenceAction={() => {}}
      />
    </Box>
  );
}

export default CaptainOperationsScreen;
