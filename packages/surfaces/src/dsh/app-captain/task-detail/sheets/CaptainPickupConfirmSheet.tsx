import React from 'react';
import { BthBox, BthButton, BthSheetFrame, BthText } from '@bthwani/ui-kit';

export type CaptainPickupConfirmSheetProps = {
  visible: boolean;
  taskTitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CaptainPickupConfirmSheet({
  visible,
  taskTitle = 'this task',
  confirmLabel = 'Confirm pickup',
  cancelLabel = 'Cancel',
  confirming = false,
  onConfirm,
  onCancel,
}: CaptainPickupConfirmSheetProps) {
  return (
    <BthSheetFrame visible={visible} title="Confirm pickup" onClose={onCancel}>
      <BthBox gap={2}>
        <BthText role="bodyMd">Confirm that {taskTitle} has been picked up from merchant.</BthText>
        <BthText role="caption" tone="muted">
          This action stays as a lightweight sheet, not a standalone route.
        </BthText>
      </BthBox>
      <BthButton label={confirmLabel} tone="success" loading={confirming} onPress={onConfirm} />
      <BthButton label={cancelLabel} tone="secondary" onPress={onCancel} />
    </BthSheetFrame>
  );
}

export default CaptainPickupConfirmSheet;
