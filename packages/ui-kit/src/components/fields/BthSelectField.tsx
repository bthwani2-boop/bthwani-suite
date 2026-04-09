import React, { useMemo, useState } from 'react';
import { Pressable, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveLogicalPadding, resolveTextAlign } from '../../foundation/direction';
import { borders, opacities, radius, spacing, sizes } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthSurface, BthText } from '../../primitives';

export type BthSelectOption<Value extends string = string> = {
  value: Value;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type BthSelectFieldProps<Value extends string = string> = {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  value?: Value;
  options: readonly BthSelectOption<Value>[];
  disabled?: boolean;
  onValueChange?: (nextValue: Value) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function BthSelectField<Value extends string = string>({
  label,
  hint,
  error,
  placeholder,
  value,
  options,
  disabled = false,
  onValueChange,
  style,
  testID
}: BthSelectFieldProps<Value>) {
  const [expanded, setExpanded] = useState(false);
  const { direction, language } = useDirection();
  const { theme } = useTheme();

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const fallbackPlaceholder = String(language).toLowerCase().startsWith('en') ? 'Choose an option' : 'اختر خيارًا';
  const resolvedPlaceholder = placeholder ?? fallbackPlaceholder;
  const resolvedDisabled = disabled || options.length === 0;

  const resolveTriggerStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    {
      minHeight: sizes.controlLg,
      borderWidth: borders.hairline,
      borderColor: error ? theme.danger : expanded ? theme.fieldBorderActive : theme.fieldBorder,
      borderRadius: radius.lg,
      backgroundColor: resolvedDisabled ? theme.disabledSurface : theme.fieldBackground,
      opacity: resolvedDisabled ? opacities.disabled : pressed ? opacities.pressed : 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
      gap: spacing[3],
      ...resolveLogicalPadding(direction, spacing[4], spacing[4])
    },
    style
  ];

  return (
    <View style={{ gap: spacing[2] }}>
      {label ? <BthText role="label">{label}</BthText> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: resolvedDisabled, expanded }}
        disabled={resolvedDisabled}
        onPress={() => setExpanded((current) => !current)}
        style={resolveTriggerStyle}
        testID={testID}
      >
        <View style={{ flex: 1 }}>
          <BthText
            role="bodyMd"
            tone={selectedOption ? 'default' : 'soft'}
            style={{ textAlign: resolveTextAlign(direction, 'start') }}
          >
            {selectedOption?.label ?? resolvedPlaceholder}
          </BthText>
        </View>
        <BthText role="label" tone={resolvedDisabled ? 'soft' : 'brand'}>{expanded ? '▲' : '▼'}</BthText>
      </Pressable>
      {expanded ? (
        <BthSurface tone="raised" padding={2} gap={1} radiusToken="lg">
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: option.disabled }}
                disabled={option.disabled}
                onPress={() => {
                  if (!option.disabled) {
                    onValueChange?.(option.value);
                    setExpanded(false);
                  }
                }}
                style={({ pressed }) => ({
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: selected ? theme.brand : 'transparent',
                  backgroundColor: selected ? theme.brandSurface : pressed ? theme.surfaceInset : 'transparent',
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[3],
                  gap: spacing[1],
                  opacity: option.disabled ? opacities.disabled : 1
                })}
              >
                <BthText role="bodyStrong" tone={selected ? 'brand' : option.disabled ? 'soft' : 'default'}>{option.label}</BthText>
                {option.description ? <BthText role="bodySm" tone={option.disabled ? 'soft' : 'muted'}>{option.description}</BthText> : null}
              </Pressable>
            );
          })}
        </BthSurface>
      ) : null}
      {error ? <BthText role="caption" tone="danger">{error}</BthText> : hint ? <BthText role="caption" tone="muted">{hint}</BthText> : null}
    </View>
  );
}