import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';

export function MiniInfoBox({ label, value, valueColor, isBoldValue = false }: { label: string, value: string | React.ReactNode, valueColor?: string, isBoldValue?: boolean }) {
  const { theme } = useTheme();
  return (
    <Box gap={0}>
      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>{label}</Text>
      <Text role="caption" style={{ color: valueColor || theme.brandHeaderBackground, fontWeight: isBoldValue ? '800' : '600', textAlign: 'right' }}>{value}</Text>
    </Box>
  );
}
