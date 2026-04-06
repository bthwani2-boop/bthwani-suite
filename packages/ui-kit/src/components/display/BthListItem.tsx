import React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthBadge } from './BthBadge';
import { BthText } from '../../primitives';
import { useTheme } from '../../hooks';

export type BthListItemProps = PressableProps & {
  title: string;
  subtitle?: string;
  meta?: string;
  badgeLabel?: string;
};

export function BthListItem({ title, subtitle, meta, badgeLabel, style, ...rest }: BthListItemProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [{
        width: '100%',
        borderWidth: 1,
        borderColor: theme.line,
        borderRadius: 18,
        backgroundColor: theme.surface,
        padding: spacing[4],
        gap: spacing[2],
        opacity: pressed ? 0.95 : 1
      }, style as never]}
      {...rest}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="bodyStrong">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>
        {badgeLabel ? <BthBadge label={badgeLabel} tone="brand" /> : null}
      </View>
      {meta ? <BthText role="caption" tone="soft">{meta}</BthText> : null}
    </Pressable>
  );
}
