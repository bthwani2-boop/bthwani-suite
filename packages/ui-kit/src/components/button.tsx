import React, { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { bthColors, bthRadius, bthSpacing, bthToneColors, type BthTone } from '../foundation';

export type BthButtonSize = 'sm' | 'md' | 'lg';

export type BthButtonProps = {
  children: ReactNode;
  tone?: BthTone;
  size?: BthButtonSize;
  disabled?: boolean;
  loading?: boolean;
  stretch?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};

function resolveSize(size: BthButtonSize) {
  if (size === 'sm') return styles.sm;
  if (size === 'lg') return styles.lg;
  return styles.md;
}

export function BthButton({
  children,
  tone = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  stretch = false,
  onPress,
  style,
  textStyle,
  testID,
}: BthButtonProps) {
  const toneColor = bthToneColors[tone];

  return (
    <Pressable
      testID={testID}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.root,
        resolveSize(size),
        { backgroundColor: toneColor.background, borderColor: toneColor.border },
        stretch ? styles.stretch : undefined,
        disabled ? styles.disabled : undefined,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={toneColor.foreground} /> : null}
      <Text style={[styles.label, { color: toneColor.foreground }, textStyle]}>{children}</Text>
    </Pressable>
  );
}

export const Button = BthButton;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderRadius: bthRadius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: bthSpacing.sm,
    justifyContent: 'center',
  },
  sm: {
    minHeight: 36,
    paddingHorizontal: bthSpacing.md,
  },
  md: {
    minHeight: 44,
    paddingHorizontal: bthSpacing.lg,
  },
  lg: {
    minHeight: 52,
    paddingHorizontal: bthSpacing.xl,
  },
  stretch: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: bthColors.brand.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
