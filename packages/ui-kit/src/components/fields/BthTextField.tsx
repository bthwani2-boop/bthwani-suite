import React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useDirection, useTheme } from '../../hooks';
import { borders, radius, spacing, sizes } from '../../foundation/tokens';
import { resolveLogicalPadding, resolveTextAlign } from '../../foundation/direction';
import { BthText } from '../../primitives';

export type BthTextFieldProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
};

export function BthTextField({ label, hint, error, style, ...rest }: BthTextFieldProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isDisabled = rest.editable === false;

  return (
    <View style={{ gap: spacing[2] }}>
      {label ? <BthText role="label">{label}</BthText> : null}
      <TextInput
        editable={rest.editable}
        placeholderTextColor={theme.textSoft}
        style={[
          {
            minHeight: sizes.controlLg,
            borderWidth: borders.hairline,
            borderColor: error ? theme.danger : theme.fieldBorder,
            borderRadius: radius.lg,
            backgroundColor: isDisabled ? theme.disabledSurface : theme.fieldBackground,
            color: isDisabled ? theme.disabledText : theme.text,
            ...resolveLogicalPadding(direction, spacing[4], spacing[4]),
            textAlign: resolveTextAlign(direction, 'start'),
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
