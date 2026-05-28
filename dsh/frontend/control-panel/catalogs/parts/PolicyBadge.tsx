import React from 'react';
import { Text, useTheme } from '@bthwani/ui-kit';

export function PolicyBadge({ mediaPolicy }: { mediaPolicy: string }) {
  const { theme } = useTheme();
  const isCentral = mediaPolicy === 'catalog-owned-media';
  return (
    <Text role="caption" numberOfLines={1} style={{ fontWeight: '700', color: isCentral ? theme.success : theme.warning }}>
      {isCentral ? 'مركزي' : 'شريك'}
    </Text>
  );
}
