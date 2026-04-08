import React from 'react';
import { BthBox, BthButton, BthSheetFrame, BthText } from '@bthwani/ui-kit';

export type CaptainDeliveryConfirmSheetProps = {
  visible: boolean;
  taskTitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CaptainDeliveryConfirmSheet({
  visible,
  taskTitle = 'this task',
  confirmLabel = 'Confirm delivery',
  cancelLabel = 'Cancel',
  confirming = false,
  onConfirm,
  onCancel,
}: CaptainDeliveryConfirmSheetProps) {
  return (
    <BthSheetFrame visible={visible} title="Confirm delivery" onClose={onCancel}>
      <BthBox gap={2}>
        <BthText role="bodyMd">Confirm that {taskTitle} has been delivered to customer.</BthText>
        <BthText role="caption" tone="muted">
          Delivery confirmation remains in a tiny sheet to keep the flow short.
        </BthText>
      </BthBox>
      <BthButton label={confirmLabel} tone="success" loading={confirming} onPress={onConfirm} />
      <BthButton label={cancelLabel} tone="secondary" onPress={onCancel} />
    </BthSheetFrame>
  );
}

export default CaptainDeliveryConfirmSheet;
