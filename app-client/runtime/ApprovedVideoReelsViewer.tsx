import React from 'react';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';

export type DshHomeApprovedVideoReelsViewerProps = {
  onClose?: () => void;
};

export function ApprovedVideoReelsViewer({ onClose }: DshHomeApprovedVideoReelsViewerProps) {
  return (
    <Surface tone="raised" padding={5} gap={4} radiusToken="xl">
      <Text role="titleMd">الفيديوهات المعتمدة</Text>
      <Text role="bodyMd" tone="muted">
        تم فصل هذا الـ viewer عن طبقة `packages/surfaces` المحذوفة. يمكن الآن تشغيل الـ runtime بدون import
        chain مكسور.
      </Text>
      <Box gap={2}>
        <Text role="bodySm">- Reel review queue placeholder</Text>
        <Text role="bodySm">- Approval summary placeholder</Text>
        <Text role="bodySm">- Publish bridge placeholder</Text>
      </Box>
      <Button onPress={() => onClose?.()}>إغلاق</Button>
    </Surface>
  );
}

export default ApprovedVideoReelsViewer;
