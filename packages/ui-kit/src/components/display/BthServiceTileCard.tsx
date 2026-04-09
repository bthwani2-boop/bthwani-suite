import React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { useTheme } from '../../hooks';
import { BthBadge, type BthBadgeProps } from './BthBadge';

export type BthServiceTileCardProps = PressableProps & {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  badgeLabel?: string;
  badgeTone?: BthBadgeProps['tone'];
  minHeight?: number;
  titleOnly?: boolean;
};

export function BthServiceTileCard({
  title,
  subtitle,
  description,
  icon,
  badgeLabel,
  badgeTone = 'brand',
  minHeight = 154,
  titleOnly = false,
  style,
  disabled,
  ...rest
}: BthServiceTileCardProps) {
  const { theme } = useTheme();
  const showTopRow = !titleOnly && (icon || badgeLabel);
  const showTitleOnlyIcon = titleOnly && Boolean(icon);

  const resolveStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    {
      width: '100%',
      minHeight,
      borderWidth: 1,
      borderColor: theme.line,
      borderRadius: 18,
      backgroundColor: pressed ? theme.surfaceInset : theme.surfaceRaised,
      padding: spacing[4],
      gap: spacing[3],
      opacity: disabled ? 0.56 : 1,
    },
    typeof style === 'function' ? style({ pressed }) : style,
  ];

  return (
    <Pressable style={resolveStyle} disabled={disabled} {...rest}>
      {showTopRow ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
          {icon ? (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.surfaceInset,
              }}
            >
              {icon}
            </View>
          ) : null}
          {badgeLabel ? <BthBadge label={badgeLabel} tone={badgeTone} /> : null}
        </View>
      ) : null}

      <View
        style={titleOnly
          ? { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[2] }
          : { gap: spacing[1] }}
      >
        {showTitleOnlyIcon ? (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surfaceInset,
            }}
          >
            {icon}
          </View>
        ) : null}
        <BthText role="bodyStrong" align={titleOnly ? 'center' : 'start'}>{title}</BthText>
        {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        {description ? <BthText role="caption" tone="soft">{description}</BthText> : null}
      </View>
    </Pressable>
  );
}
