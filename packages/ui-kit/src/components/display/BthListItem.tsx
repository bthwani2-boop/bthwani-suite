import React from 'react';
import { Pressable, View, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { spacing } from '../../foundation/tokens';
import { BthBadge } from './BthBadge';
import { BthText } from '../../primitives';
import { useDirection, useTheme } from '../../hooks';

export type BthListItemProps = PressableProps & {
  title: string;
  subtitle?: string;
  meta?: string;
  badgeLabel?: string;
};

export function BthListItem({ title, subtitle, meta, badgeLabel, style, ...rest }: BthListItemProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const resolveStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.line,
      borderRadius: 18,
      backgroundColor: pressed ? theme.surfaceInset : theme.surfaceRaised,
      padding: spacing[4],
      gap: spacing[2]
    },
    typeof style === 'function' ? style({ pressed }) : style
  ];

  return (
    <Pressable
      style={resolveStyle}
      {...rest}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
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
