import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Switch, TextInput, View, type PressableProps, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { borders, colorPalette, radius, resolveLogicalPadding, resolveTextAlign, resolveRowDirection, sizes, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { BthBadge, BthButton } from './button';
import { BthKeyValueList } from './list';
import { BthCard } from './card';
import { BthSurface, BthText } from '../primitives';

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
            writingDirection: direction,
          },
          style,
        ]}
        {...rest}
      />
      {error ? <BthText role="caption" tone="danger">{error}</BthText> : hint ? <BthText role="caption" tone="muted">{hint}</BthText> : null}
    </View>
  );
}

export function BthSearchField({ placeholder, ...props }: BthTextFieldProps) {
  const { language } = useDirection();
  const fallbackPlaceholder = String(language).toLowerCase().startsWith('en') ? 'Search' : 'ابحث';

  return <BthTextField placeholder={placeholder ?? fallbackPlaceholder} {...props} />;
}

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
  testID,
}: BthSelectFieldProps<Value>) {
  const [expanded, setExpanded] = useState(false);
  const { direction, language } = useDirection();
  const { theme } = useTheme();
  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const fallbackPlaceholder = String(language).toLowerCase().startsWith('en') ? 'Choose an option' : 'اختر خيارًا';
  const resolvedPlaceholder = placeholder ?? fallbackPlaceholder;
  const resolvedDisabled = disabled || options.length === 0;

  return (
    <View style={{ gap: spacing[2] }} testID={testID}>
      {label ? <BthText role="label">{label}</BthText> : null}
      <Pressable
        accessibilityRole="button"
        disabled={resolvedDisabled}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [
          {
            minHeight: sizes.controlLg,
            borderWidth: borders.hairline,
            borderColor: error ? theme.danger : expanded ? theme.fieldBorderActive : theme.fieldBorder,
            borderRadius: radius.lg,
            backgroundColor: resolvedDisabled ? theme.disabledSurface : theme.fieldBackground,
            opacity: resolvedDisabled ? 0.56 : pressed ? 0.9 : 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            gap: spacing[3],
            ...resolveLogicalPadding(direction, spacing[4], spacing[4]),
          },
          style,
        ]}
      >
        <BthText role="bodyMd" tone={selectedOption ? 'default' : 'soft'}>{selectedOption ? selectedOption.label : resolvedPlaceholder}</BthText>
        <BthText role="label" tone="soft">▾</BthText>
      </Pressable>

      {expanded ? (
        <View style={{ gap: spacing[2] }}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              disabled={option.disabled}
              onPress={() => {
                onValueChange?.(option.value);
                setExpanded(false);
              }}
              style={{
                borderWidth: borders.hairline,
                borderColor: option.value === value ? theme.brand : theme.line,
                borderRadius: radius.lg,
                padding: spacing[3],
                backgroundColor: option.value === value ? theme.brandSurface : theme.surface,
              }}
            >
              <BthText role="bodyStrong" tone={option.value === value ? 'brand' : 'default'}>{option.label}</BthText>
              {option.description ? <BthText role="caption" tone="muted">{option.description}</BthText> : null}
            </Pressable>
          ))}
        </View>
      ) : null}

      {error ? <BthText role="caption" tone="danger">{error}</BthText> : hint ? <BthText role="caption" tone="muted">{hint}</BthText> : null}
    </View>
  );
}

export type AmountInputProps = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  currencyLabel?: string;
};

export function AmountInput({ value, onChange, label, placeholder = '0.00', currencyLabel }: AmountInputProps) {
  return (
    <View style={{ gap: spacing[2] }}>
      {label ? <BthText role="label">{label}</BthText> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BthTextField value={value} onChangeText={(t) => onChange(t.replace(/[^0-9.]/g, ''))} placeholder={placeholder} style={{ flex: 1, minWidth: 120 }} />
      </View>
      {currencyLabel ? <BthText role="caption" tone="muted">{currencyLabel}</BthText> : null}
    </View>
  );
}

export type PaymentMethod = { id: string; label: string; icon?: string };

export type PaymentMethodListProps = {
  methods: PaymentMethod[];
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export function PaymentMethodList({ methods, selectedId, onSelect }: PaymentMethodListProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: spacing[3], paddingHorizontal: spacing[4], marginTop: spacing[3] }}>
      {methods.map((method) => {
        const selected = selectedId === method.id;
        const hasRemoteIcon = typeof method.icon === 'string' && (method.icon.startsWith('http://') || method.icon.startsWith('https://'));
        return (
          <Pressable
            key={method.id}
            onPress={() => onSelect?.(method.id)}
            style={({ pressed }) => [
              {
                paddingVertical: spacing[3],
                paddingHorizontal: spacing[4],
                borderRadius: radius.lg,
                borderWidth: borders.hairline,
                borderColor: selected ? theme.brand : theme.line,
                backgroundColor: pressed ? theme.surfaceInset : theme.surface,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[3],
              },
            ]}
          >
            {hasRemoteIcon ? <Image source={{ uri: method.icon }} style={{ width: 44, height: 44, borderRadius: radius.sm }} /> : <View style={{ width: 44, height: 44, borderRadius: radius.sm, backgroundColor: theme.surfaceInset }} />}
            <BthText role="bodyStrong">{method.label}</BthText>
          </Pressable>
        );
      })}
    </View>
  );
}

export type QuickAmountGridProps = {
  amounts: number[];
  onSelect: (n: number) => void;
  selected?: number;
};

export function QuickAmountGrid({ amounts, onSelect, selected }: QuickAmountGridProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3], paddingHorizontal: spacing[4], marginTop: spacing[3] }}>
      {amounts.map((amount) => (
        <Pressable key={amount} onPress={() => onSelect(amount)} style={({ pressed }) => [{ width: '30%', padding: spacing[3], borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: selected === amount ? colorPalette.brand : '#E6E6E6', backgroundColor: selected === amount ? colorPalette.brandSoft : 'transparent', opacity: pressed ? 0.85 : 1 }]}>
          <BthText role="bodyStrong">{String(amount)}</BthText>
        </Pressable>
      ))}
    </View>
  );
}

export type SummaryItem = { label: string; value: React.ReactNode; helper?: string };

export type SummaryCardProps = {
  items: SummaryItem[];
  totalLabel?: string;
  totalValue?: React.ReactNode;
};

export function SummaryCard({ items, totalLabel = 'Total', totalValue }: SummaryCardProps) {
  return (
    <BthCard>
      <BthKeyValueList items={items.map((item) => ({ label: item.label, value: item.value, helperText: item.helper }))} />
      {totalValue ? <View style={{ marginTop: 12 }} /> : null}
      {totalValue ? <BthKeyValueList items={[{ label: totalLabel, value: totalValue }]} dense /> : null}
    </BthCard>
  );
}

export type BthFormScreenShellProps = {
  title: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  children?: React.ReactNode;
};

export function BthFormScreenShell({
  title,
  subtitle,
  submitLabel = 'متابعة',
  onSubmit,
  submitDisabled = false,
  children,
}: BthFormScreenShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
      <View style={{ gap: spacing[2] }}>
        <BthText role="titleLg">{title}</BthText>
        {subtitle ? <BthText role="bodyMd" tone="muted">{subtitle}</BthText> : null}
      </View>
      <BthSurface gap={4}>{children}</BthSurface>
      <BthButton label={submitLabel} onPress={onSubmit} disabled={submitDisabled} />
    </ScrollView>
  );
}

export type BthOptionRowProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BthOptionRow({ title, subtitle, actionLabel, onAction, style }: BthOptionRowProps) {
  return (
    <BthSurface tone="inset" padding={2} gap={0} style={style}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] }}>
        <View style={{ gap: spacing[1], flex: 1 }}>
          <BthText role="bodyStrong" numberOfLines={1}>{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted" numberOfLines={2}>{subtitle}</BthText> : null}
        </View>
        {actionLabel ? <BthButton label={actionLabel} size="sm" tone="secondary" fullWidth={false} onPress={onAction} /> : null}
      </View>
    </BthSurface>
  );
}

export type BthCheckboxProps = {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  error?: string;
  onCheckedChange?: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function BthCheckbox({ label, description, checked, disabled = false, error, onCheckedChange, style }: BthCheckboxProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={({ pressed }) => [
        {
          flexDirection: resolveRowDirection(direction),
          alignItems: 'flex-start',
          gap: spacing[3],
          opacity: disabled ? 0.56 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <View style={{ width: sizes.iconLg, height: sizes.iconLg, marginTop: 1, borderRadius: radius.sm, borderWidth: 1, borderColor: error ? theme.danger : checked ? theme.brand : theme.lineStrong, backgroundColor: disabled ? theme.disabledSurface : checked ? theme.brand : theme.surface, alignItems: 'center', justifyContent: 'center' }}>
        {checked ? <BthText role="label" tone="inverse">✓</BthText> : null}
      </View>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <BthText role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</BthText>
        {description ? <BthText role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</BthText> : null}
        {error ? <BthText role="caption" tone="danger">{error}</BthText> : null}
      </View>
    </Pressable>
  );
}

export type BthRadioProps = {
  label: string;
  description?: string;
  selected: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BthRadio({ label, description, selected, disabled = false, onSelect, style }: BthRadioProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onSelect}
      style={({ pressed }) => [
        {
          flexDirection: resolveRowDirection(direction),
          alignItems: 'flex-start',
          gap: spacing[3],
          opacity: disabled ? 0.56 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <View style={{ width: sizes.iconLg, height: sizes.iconLg, marginTop: 1, borderRadius: radius.pill, borderWidth: 1, borderColor: selected ? theme.brand : theme.lineStrong, backgroundColor: disabled ? theme.disabledSurface : theme.surface, alignItems: 'center', justifyContent: 'center' }}>
        {selected ? <View style={{ width: sizes.iconSm - 2, height: sizes.iconSm - 2, borderRadius: radius.pill, backgroundColor: theme.brand }} /> : null}
      </View>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <BthText role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</BthText>
        {description ? <BthText role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</BthText> : null}
      </View>
    </Pressable>
  );
}

export type BthSegmentedOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

export type BthSegmentedControlProps<Value extends string = string> = {
  options: readonly BthSegmentedOption<Value>[];
  value: Value;
  onValueChange?: (nextValue: Value) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BthSegmentedControl<Value extends string = string>({ options, value, onValueChange, size = 'md', fullWidth = true, style }: BthSegmentedControlProps<Value>) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const sizeConfig = { sm: { minHeight: sizes.controlSm, textRole: 'label' as const }, md: { minHeight: sizes.controlMd, textRole: 'bodyStrong' as const } }[size];

  return (
    <View style={[{ width: fullWidth ? '100%' : undefined, flexDirection: resolveRowDirection(direction), alignItems: 'stretch', gap: spacing[2], padding: spacing[2], borderRadius: radius.pill, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.surfaceInset }, style]}>
      {options.map((option) => {
        const selected = option.value === value;
        const disabled = option.disabled;
        return (
          <Pressable key={option.value} accessibilityRole="button" accessibilityState={{ selected, disabled }} disabled={disabled} onPress={() => onValueChange?.(option.value)} style={({ pressed }) => [{ flex: fullWidth ? 1 : undefined, minHeight: sizeConfig.minHeight, paddingHorizontal: spacing[4], borderRadius: radius.pill, backgroundColor: selected ? theme.brand : 'transparent', alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.56 : pressed ? 0.9 : 1 }]}>
            <BthText role={sizeConfig.textRole} tone={selected ? 'inverse' : disabled ? 'soft' : 'default'} align="center">{option.label}</BthText>
          </Pressable>
        );
      })}
    </View>
  );
}

export type BthSwitchProps = {
  label: string;
  description?: string;
  value: boolean;
  disabled?: boolean;
  onValueChange?: (nextValue: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function BthSwitch({ label, description, value, disabled = false, onValueChange, style }: BthSwitchProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: value, disabled }} disabled={disabled} onPress={() => onValueChange?.(!value)} style={({ pressed }) => [{ flexDirection: resolveRowDirection(direction, true), alignItems: 'center', justifyContent: 'space-between', gap: spacing[3], opacity: disabled ? 0.56 : pressed ? 0.9 : 1 }, style]}>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <BthText role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</BthText>
        {description ? <BthText role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</BthText> : null}
      </View>
      <Switch disabled={disabled} value={value} onValueChange={onValueChange} thumbColor={value ? theme.brandContrast : theme.surfaceRaised} trackColor={{ false: theme.lineStrong, true: theme.brand }} ios_backgroundColor={theme.lineStrong} />
    </Pressable>
  );
}