'use client';

import React from 'react';
import { Text, Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, type ControlPanelDshActionQueueItem } from '../../shared';
import { DISPATCH_ASSIGNMENT_PREVIEW } from '../operations.preview-data';

export type DispatchAssignmentScreenProps = { hubHref: string; };

export function DispatchAssignmentScreen({ hubHref }: DispatchAssignmentScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(DISPATCH_ASSIGNMENT_PREVIEW.assignments[0]?.id ?? null);

  return (
    <Box gap={4}>
      <Box gap={1}>
        <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>الإسناد والتوزيع</Text>
        <Text role="bodySm" tone="muted">إدارة توزيع الطلبات وتغطية الكباتن</Text>
      </Box>

      <ControlPanelDshActionQueue
        title="قائمة الإسناد"
        purpose="توزيع الطلبات يدوياً ومراقبة التغطية"
        items={DISPATCH_ASSIGNMENT_PREVIEW.assignments as readonly ControlPanelDshActionQueueItem[]}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={() => {}}
        secondaryAction={() => {}}
        evidenceAction={() => {}}
      />
    </Box>
  );
}

export default DispatchAssignmentScreen;
