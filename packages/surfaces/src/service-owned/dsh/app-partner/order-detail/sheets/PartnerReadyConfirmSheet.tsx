import React from 'react';
import { Box, Button, SheetFrame, Text } from '@bthwani/ui-kit';

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
    <SheetFrame visible={visible} title="Confirm readiness" onClose={onCancel}>
      <Box gap={2}>
        <Text role="bodyMd">
          Confirm that {orderTitle} is packed and ready for captain handoff.
        </Text>
        <Text role="caption" tone="muted">
          This stays a lightweight sheet and does not become a standalone route.
        </Text>
      </Box>

      <Button label={confirmLabel} tone="success" loading={confirming} onPress={onConfirm} />
      <Button label={cancelLabel} tone="secondary" onPress={onCancel} />
    </SheetFrame>
  );
}

export default PartnerReadyConfirmSheet;
