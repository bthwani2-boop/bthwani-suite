import React from 'react';
import { Badge, Box, Surface, Text } from '@bthwani/ui-kit';
import type { CompactOrderChatMessage } from '../../shared/view-models/captain';

export function CompactOrderChatBubble({ message }: { message: CompactOrderChatMessage }) {
  const isOutbound = message.side === 'end';

  return (
    <Surface tone={isOutbound ? 'brand' : 'raised'} padding={2} gap={1} radiusToken="lg" border={false}>
      <Box layoutDirection="row" justify="space-between" align="center" gap={2}>
        <Badge label={message.sender} tone={isOutbound ? 'brand' : 'default'} />
        <Text role="caption" tone={isOutbound ? 'inverse' : 'muted'}>{message.time}</Text>
      </Box>
      <Text role="bodySm" tone={isOutbound ? 'inverse' : 'default'}>
        {message.text}
      </Text>
    </Surface>
  );
}
