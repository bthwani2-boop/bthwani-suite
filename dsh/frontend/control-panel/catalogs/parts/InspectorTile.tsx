import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';

export function InspectorTile({ tileTitle, children, dashed = false, warning = false }: { tileTitle: string, children: React.ReactNode, dashed?: boolean, warning?: boolean }) {
  const { theme } = useTheme();
  return (
    <Box
      gap={2}
      style={{
        padding: 12,
        backgroundColor: warning ? theme.dangerSurface : dashed ? theme.surface : theme.surfaceInset,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: warning ? theme.danger : dashed ? theme.lineStrong : theme.line,
        borderStyle: dashed ? 'dashed' : 'solid',
      }}
    >
       <Text role="caption" style={{ fontWeight: '800', color: warning ? theme.danger : theme.brandHeaderBackground }}>{tileTitle}</Text>
       {children}
    </Box>
  );
}
