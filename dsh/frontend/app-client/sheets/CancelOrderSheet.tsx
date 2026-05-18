import React from 'react';
import { Box, Button, Surface, Text, SectionHeader } from '@bthwani/ui-kit';

export type CancelOrderSheetProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function CancelOrderSheet({ visible, onConfirm, onCancel }: CancelOrderSheetProps) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
      <SectionHeader
        title="إلغاء الطلب"
        subtitle="هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟"
      />
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
        قد يترتب على الإلغاء رسوم حسب مرحلة تجهيز الطلب.
      </Text>
      <Box gap={2}>
        <Button label="تأكيد الإلغاء" tone="danger" onPress={onConfirm} />
        <Button label="الرجوع" tone="ghost" onPress={onCancel} />
      </Box>
    </Surface>
  );
}
