import React from 'react';
import { BthBox, BthButton, BthSheetFrame, BthText } from '@bthwani/ui-kit';

export type PartnerReadyConfirmSheetProps = {
  visible: boolean;
  orderTitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function PartnerReadyConfirmSheet({
  visible,
  orderTitle = 'this order',
  confirmLabel = 'Confirm ready',
  cancelLabel = 'Cancel',
  confirming = false,
  onConfirm,
  onCancel,
}: PartnerReadyConfirmSheetProps) {
  return (
    <BthSheetFrame visible={visible} title="Confirm readiness" onClose={onCancel}>
      <BthBox gap={2}>
        <BthText role="bodyMd">
          Confirm that {orderTitle} is packed and ready for captain handoff.
        </BthText>
        <BthText role="caption" tone="muted">
          This stays a lightweight sheet and does not become a standalone route.
        </BthText>
      </BthBox>

      <BthButton label={confirmLabel} tone="success" loading={confirming} onPress={onConfirm} />
      <BthButton label={cancelLabel} tone="secondary" onPress={onCancel} />
    </BthSheetFrame>
  );
}

export default PartnerReadyConfirmSheet;
