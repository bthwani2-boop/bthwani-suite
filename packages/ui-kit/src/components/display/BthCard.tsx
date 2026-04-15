import React from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthSurface, BthText } from '../../primitives';

export type BthCardProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

export function BthCard({
  title,
  subtitle,
  children,
  footer,
  style,
  onPress,
  disabled = false,
  accessibilityLabel,
  testID,
}: BthCardProps) {
  const surface = (
    <BthSurface style={style}>
      {(title || subtitle) ? (
        <View style={{ gap: spacing[1] }}>
          {title ? <BthText role="titleSm">{title}</BthText> : null}
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>
      ) : null}
      {children}
      {footer ? <View>{footer}</View> : null}
    </BthSurface>
  );

  if (!onPress) {
    return surface;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title ?? subtitle}
      testID={testID}
    >
      {surface}
    </Pressable>
  );
}
