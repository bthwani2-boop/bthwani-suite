import React from 'react';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';

export type CaptainPickupConfirmSheetProps = {
  visible: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CaptainPickupConfirmSheet({ visible, taskTitle, onConfirm, onCancel }: CaptainPickupConfirmSheetProps) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" gap={3} padding={4}>
      <Box gap={1} style={{ alignItems: 'flex-end' }}>
        <Text role="titleMd" style={{ textAlign: 'right' }}>Confirm pickup</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{taskTitle}</Text>
      </Box>
      <Box gap={2}>
        <Button label="Confirm" onPress={onConfirm} />
        <Button label="Cancel" tone="secondary" onPress={onCancel} />
      </Box>
    </Surface>
  );
}

export default CaptainPickupConfirmSheet;