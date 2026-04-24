import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Switch as RNSwitch, TextInput, View, type PressableProps, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { borders, radius, resolveLogicalPadding, resolveTextAlign, resolveRowDirection, sizes, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Button } from './button';
import { BthKeyValueList as KeyValueList } from './list';
import { BthCard as Card } from './card';
import { BthSurface as Surface, BthText as Text } from '../primitives';

const fieldFrameLaw = {
  labelGap: spacing[2],
  messageGap: spacing[1],
  controlMinHeight: sizes.controlLg,
  controlRadius: radius.lg,
  controlPaddingX: spacing[4],
  controlPaddingY: spacing[3],
  shellGap: spacing[4],
  sectionGap: spacing[3],
  itemGap: spacing[2],
  listGap: spacing[3],
} as const;

export type TextFieldProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
};

export type BthTextFieldProps = TextFieldProps;

export function TextField({ label, hint, error, style, ...rest }: TextFieldProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isDisabled = rest.editable === false;

  return (
    <View style={{ gap: fieldFrameLaw.labelGap }}>
      {label ? <Text role="label">{label}</Text> : null}
      <TextInput
        editable={rest.editable}
        placeholderTextColor={theme.fieldPlaceholder}
        style={[
          {
            minHeight: fieldFrameLaw.controlMinHeight,
            borderWidth: borders.hairline,
            borderColor: error ? theme.danger : theme.fieldBorder,
            borderRadius: fieldFrameLaw.controlRadius,
            backgroundColor: isDisabled ? theme.disabledSurface : theme.fieldBackground,
            color: isDisabled ? theme.disabledText : theme.text,
            ...resolveLogicalPadding(direction, fieldFrameLaw.controlPaddingX, fieldFrameLaw.controlPaddingX),
            textAlign: resolveTextAlign(direction, 'start'),
            writingDirection: direction,
          },
          style,
        ]}
        {...rest}
      />
      {error ? <Text role="caption" tone="danger">{error}</Text> : hint ? <Text role="caption" tone="muted">{hint}</Text> : null}
    </View>
  );
}

export const BthTextField = TextField;

export function SearchField({ placeholder, ...props }: TextFieldProps) {
  const { language } = useDirection();
  const fallbackPlaceholder = String(language).toLowerCase().startsWith('en') ? 'Search' : 'ابحث';

  return <TextField placeholder={placeholder ?? fallbackPlaceholder} {...props} />;
}

export const BthSearchField = SearchField;

export type SelectOption<Value extends string = string> = {
  value: Value;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type BthSelectOption<Value extends string = string> = SelectOption<Value>;

export type SelectFieldProps<Value extends string = string> = {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  value?: Value;
  options: readonly SelectOption<Value>[];
  disabled?: boolean;
  onValueChange?: (nextValue: Value) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export type BthSelectFieldProps<Value extends string = string> = SelectFieldProps<Value>;

export function SelectField<Value extends string = string>({
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
}: SelectFieldProps<Value>) {
  const [expanded, setExpanded] = useState(false);
  const { direction, language } = useDirection();
  const { theme } = useTheme();
  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const fallbackPlaceholder = String(language).toLowerCase().startsWith('en') ? 'Choose an option' : 'اختر خيارًا';
  const resolvedPlaceholder = placeholder ?? fallbackPlaceholder;
  const resolvedDisabled = disabled || options.length === 0;

  return (
    <View style={{ gap: fieldFrameLaw.labelGap }} testID={testID}>
      {label ? <Text role="label">{label}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={resolvedDisabled}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [
          {
            minHeight: fieldFrameLaw.controlMinHeight,
            borderWidth: borders.hairline,
            borderColor: error ? theme.danger : expanded ? theme.fieldBorderActive : theme.fieldBorder,
            borderRadius: fieldFrameLaw.controlRadius,
            backgroundColor: resolvedDisabled ? theme.disabledSurface : theme.fieldBackground,
            opacity: resolvedDisabled ? 0.56 : pressed ? 0.9 : 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            gap: spacing[3],
            ...resolveLogicalPadding(direction, fieldFrameLaw.controlPaddingX, fieldFrameLaw.controlPaddingX),
          },
          style,
        ]}
      >
        <Text role="bodyMd" tone={selectedOption ? 'default' : 'soft'}>{selectedOption ? selectedOption.label : resolvedPlaceholder}</Text>
        <Text role="label" tone="soft">▾</Text>
      </Pressable>

      {expanded ? (
        <View style={{ gap: fieldFrameLaw.itemGap }}>
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
                borderRadius: fieldFrameLaw.controlRadius,
                padding: fieldFrameLaw.controlPaddingY,
                backgroundColor: option.value === value ? theme.brandSurface : theme.surface,
              }}
            >
              <Text role="bodyStrong" tone={option.value === value ? 'brand' : 'default'}>{option.label}</Text>
              {option.description ? <Text role="caption" tone="muted">{option.description}</Text> : null}
            </Pressable>
          ))}
        </View>
      ) : null}

      {error ? <Text role="caption" tone="danger">{error}</Text> : hint ? <Text role="caption" tone="muted">{hint}</Text> : null}
    </View>
  );
}

export const BthSelectField = SelectField;

export type AmountInputProps = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  currencyLabel?: string;
};

export function AmountInput({ value, onChange, label, placeholder = '0.00', currencyLabel }: AmountInputProps) {
  return (
    <View style={{ gap: fieldFrameLaw.labelGap }}>
      {label ? <Text role="label">{label}</Text> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextField value={value} onChangeText={(t) => onChange(t.replace(/[^0-9.]/g, ''))} placeholder={placeholder} style={{ flex: 1, minWidth: 120 }} />
      </View>
      {currencyLabel ? <Text role="caption" tone="muted">{currencyLabel}</Text> : null}
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
    <View style={{ gap: fieldFrameLaw.listGap, paddingHorizontal: spacing[4], marginTop: spacing[3] }}>
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
            <Text role="bodyStrong">{method.label}</Text>
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
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3], paddingHorizontal: spacing[4], marginTop: spacing[3] }}>
      {amounts.map((amount) => (
        <Pressable key={amount} onPress={() => onSelect(amount)} style={({ pressed }) => [{ width: '30%', padding: spacing[3], borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: selected === amount ? theme.brand : theme.line, backgroundColor: selected === amount ? theme.brandSurface : 'transparent', opacity: pressed ? 0.85 : 1 }]}>
          <Text role="bodyStrong">{String(amount)}</Text>
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
    <Card>
      <KeyValueList items={items.map((item) => ({ label: item.label, value: item.value, helperText: item.helper }))} />
      {totalValue ? <View style={{ marginTop: spacing[3] }} /> : null}
      {totalValue ? <KeyValueList items={[{ label: totalLabel, value: totalValue }]} dense /> : null}
    </Card>
  );
}

export type FormScreenShellProps = {
  title: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  children?: React.ReactNode;
};

export type BthFormScreenShellProps = FormScreenShellProps;

export function FormScreenShell({
  title,
  subtitle,
  submitLabel = 'متابعة',
  onSubmit,
  submitDisabled = false,
  children,
}: FormScreenShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
      <View style={{ gap: spacing[2] }}>
        <Text role="titleLg">{title}</Text>
        {subtitle ? <Text role="bodyMd" tone="muted">{subtitle}</Text> : null}
      </View>
      <Surface gap={4}>{children}</Surface>
      <Button label={submitLabel} onPress={onSubmit} disabled={submitDisabled} />
    </ScrollView>
  );
}

export const BthFormScreenShell = FormScreenShell;

export type OptionRowProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export type BthOptionRowProps = OptionRowProps;

export function OptionRow({ title, subtitle, actionLabel, onAction, style }: OptionRowProps) {
  return (
    <Surface tone="inset" padding={2} gap={0} style={style}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] }}>
        <View style={{ gap: spacing[1], flex: 1 }}>
          <Text role="bodyStrong" numberOfLines={1}>{title}</Text>
          {subtitle ? <Text role="bodySm" tone="muted" numberOfLines={2}>{subtitle}</Text> : null}
        </View>
        {actionLabel ? <Button label={actionLabel} size="sm" tone="secondary" fullWidth={false} onPress={onAction} /> : null}
      </View>
    </Surface>
  );
}

export const BthOptionRow = OptionRow;

export type CheckboxProps = {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  error?: string;
  onCheckedChange?: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export type BthCheckboxProps = CheckboxProps;

export function Checkbox({ label, description, checked, disabled = false, error, onCheckedChange, style }: CheckboxProps) {
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
        {checked ? <Text role="label" tone="inverse">✓</Text> : null}
      </View>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <Text role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</Text>
        {description ? <Text role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</Text> : null}
        {error ? <Text role="caption" tone="danger">{error}</Text> : null}
      </View>
    </Pressable>
  );
}

export const BthCheckbox = Checkbox;

export type RadioProps = {
  label: string;
  description?: string;
  selected: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  style?: StyleProp<ViewStyle>;
};

export type BthRadioProps = RadioProps;

export function Radio({ label, description, selected, disabled = false, onSelect, style }: RadioProps) {
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
        <Text role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</Text>
        {description ? <Text role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

export const BthRadio = Radio;

export type SegmentedOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

export type BthSegmentedOption<Value extends string = string> = SegmentedOption<Value>;

export type SegmentedControlProps<Value extends string = string> = {
  options: readonly SegmentedOption<Value>[];
  value: Value;
  onValueChange?: (nextValue: Value) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type BthSegmentedControlProps<Value extends string = string> = SegmentedControlProps<Value>;

export function SegmentedControl<Value extends string = string>({ options, value, onValueChange, size = 'md', fullWidth = true, style }: SegmentedControlProps<Value>) {
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
            <Text role={sizeConfig.textRole} tone={selected ? 'inverse' : disabled ? 'soft' : 'default'} align="center">{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const BthSegmentedControl = SegmentedControl;

export type SwitchProps = {
  label: string;
  description?: string;
  value: boolean;
  disabled?: boolean;
  onValueChange?: (nextValue: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export type BthSwitchProps = SwitchProps;

export function Switch({ label, description, value, disabled = false, onValueChange, style }: SwitchProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: value, disabled }} disabled={disabled} onPress={() => onValueChange?.(!value)} style={({ pressed }) => [{ flexDirection: resolveRowDirection(direction, true), alignItems: 'center', justifyContent: 'space-between', gap: spacing[3], opacity: disabled ? 0.56 : pressed ? 0.9 : 1 }, style]}>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <Text role="bodyStrong" tone={disabled ? 'soft' : 'default'}>{label}</Text>
        {description ? <Text role="bodySm" tone={disabled ? 'soft' : 'muted'}>{description}</Text> : null}
      </View>
      <RNSwitch disabled={disabled} value={value} onValueChange={onValueChange} thumbColor={value ? theme.brandContrast : theme.surfaceRaised} trackColor={{ false: theme.lineStrong, true: theme.brand }} ios_backgroundColor={theme.lineStrong} />
    </Pressable>
  );
}

export const BthSwitch = Switch;