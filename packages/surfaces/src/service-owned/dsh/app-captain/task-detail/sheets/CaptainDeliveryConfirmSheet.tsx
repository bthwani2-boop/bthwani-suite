import React from 'react';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';

export type CaptainDeliveryConfirmSheetProps = {
  visible: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CaptainDeliveryConfirmSheet({ visible, taskTitle, onConfirm, onCancel }: CaptainDeliveryConfirmSheetProps) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" gap={3} padding={4}>
      <Box gap={1} style={{ alignItems: 'flex-end' }}>
        <Text role="titleMd" style={{ textAlign: 'right' }}>Confirm delivery</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{taskTitle}</Text>
      </Box>
      <Box gap={2}>
        <Button label="Confirm" onPress={onConfirm} />
        <Button label="Cancel" tone="secondary" onPress={onCancel} />
      </Box>
    </Surface>
  );
}

export default CaptainDeliveryConfirmSheet;