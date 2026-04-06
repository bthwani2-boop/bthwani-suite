import React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useDirection, useTheme } from '../../hooks';
import { radius, spacing, sizes } from '../../foundation/tokens';
import { BthText } from '../../primitives';

export type BthTextFieldProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
};

export function BthTextField({ label, hint, error, style, ...rest }: BthTextFieldProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const toneColor = error ? theme.danger : theme.text;

  return (
    <View style={{ gap: spacing[2] }}>
      {label ? <BthText role="label">{label}</BthText> : null}
      <TextInput
        placeholderTextColor={theme.textSoft}
        style={[
          {
            minHeight: sizes.controlLg,
            borderWidth: 1,
            borderColor: error ? theme.danger : theme.line,
            borderRadius: radius.lg,
            backgroundColor: theme.surface,
            color: theme.text,
            paddingHorizontal: spacing[4],
            textAlign: direction === 'rtl' ? 'right' : 'left',
            writingDirection: direction
          },
          style
        ]}
        {...rest}
      />
      {error ? <BthText role="caption" tone="danger">{error}</BthText> : hint ? <BthText role="caption" tone="muted">{hint}</BthText> : null}
    </View>
  );
}
