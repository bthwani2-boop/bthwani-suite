import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';

export function WltDshFinanceControlPanelContent({
  hideHeader: _hideHeader = false,
}: {
  hideHeader?: boolean;
} = {}) {
  return (
    <Box gap={4} style={{ direction: 'rtl', width: '100%' }}>
      <Box padding={5} background="surfaceInset" radiusToken="lg" border borderTone="line" gap={2}>
        <Text role="titleMd" weight="black">لوحة المالية</Text>
        <Text role="bodySm" tone="muted">
          في انتظار بيانات WLT runtime. لا يوجد fallback preview — البيانات تأتي من WLT API مباشرة.
        </Text>
      </Box>
    </Box>
  );
}

export function WltDshFinanceControlPanelPreview() {
  return <WltDshFinanceControlPanelContent />;
}

export default WltDshFinanceControlPanelPreview;
