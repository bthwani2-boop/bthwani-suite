'use client';

import React from 'react';
import { Text, Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, type ControlPanelDshActionQueueItem } from '../../shared';
import { AREA_CAPACITY_PREVIEW } from '../operations.preview-data';

export type AreaCapacityScreenProps = { hubHref: string; };

export function AreaCapacityScreen({ hubHref }: AreaCapacityScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(AREA_CAPACITY_PREVIEW.areas[0]?.id ?? null);

  return (
    <Box gap={4}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>المناطق والسعة</Text>
        <Text role="bodySm" tone="muted">مراقبة ضغط المناطق وتوافر السعة</Text>
      </Box>

      <ControlPanelDshActionQueue
        title="قائمة المناطق"
        purpose="إدارة سعة التوصيل لكل منطقة"
        items={AREA_CAPACITY_PREVIEW.areas as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={() => {}}
        secondaryAction={() => {}}
        evidenceAction={() => {}}
      />
    </Box>
  );
}

export default AreaCapacityScreen;
