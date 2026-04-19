import React from 'react';
import { BthBox, BthButton, BthSurface, BthText } from '@bthwani/ui-kit';

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
    <BthSurface tone="raised" gap={3} padding={4}>
      <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
        <BthText role="titleMd" style={{ textAlign: 'right' }}>Confirm pickup</BthText>
        <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{taskTitle}</BthText>
      </BthBox>
      <BthBox gap={2}>
        <BthButton label="Confirm" onPress={onConfirm} />
        <BthButton label="Cancel" tone="secondary" onPress={onCancel} />
      </BthBox>
    </BthSurface>
  );
}

export default CaptainPickupConfirmSheet;