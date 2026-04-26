import React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { borders, radius, resolveRowDirection, spacing } from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Badge, Button, type BadgeProps, type ButtonTone } from './button';
import { Text } from '../primitives';

export type PaymentDecisionAmountTone = 'default' | 'muted' | 'brand';

export type PaymentDecisionAmountRow = {
  label: string;
  value: React.ReactNode;
  tone?: PaymentDecisionAmountTone;
};

export type PaymentDecisionAction = {
  label: string;
  onPress?: () => void;
  tone?: ButtonTone;
  disabled?: boolean;
  loading?: boolean;
};

export type PaymentDecisionOption = {
  id: string;
  title: string;
  description: string;
  selected?: boolean;
  disabled?: boolean;
  statusLabel?: string;
  statusTone?: BadgeProps['tone'];
  helperText?: string;
  helperTone?: BadgeProps['tone'];
  amountRows?: PaymentDecisionAmountRow[];
  action?: PaymentDecisionAction;
  onSelect?: () => void;
};

export type PaymentDecisionCardProps = {
  item: PaymentDecisionOption;
  style?: StyleProp<ViewStyle>;
};

export type PaymentDecisionListProps = {
  items: PaymentDecisionOption[];
  style?: StyleProp<ViewStyle>;
};

function resolveBadgeTone(tone: BadgeProps['tone'] | undefined, selected: boolean): BadgeProps['tone'] {
  if (tone === 'warning') {
    return selected ? 'brand' : 'info';
  }

  if (tone) {
    return tone;
  }

  return selected ? 'brand' : 'info';
}

function resolveAmountTone(tone: PaymentDecisionAmountTone | undefined, theme: ReturnType<typeof useTheme>['theme']) {
  if (tone === 'brand') {
    return theme.brand;
  }

  if (tone === 'muted') {
    return theme.textMuted;
  }

  return theme.text;
}

export function PaymentDecisionCard({ item, style }: PaymentDecisionCardProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = resolveRowDirection(direction);
  const textAlign = direction === 'rtl' ? 'right' : 'left';
  const actionAlignment = direction === 'rtl' ? 'flex-end' : 'flex-start';
  const canSelect = Boolean(item.onSelect) && !item.disabled;
  const resolvedStatusTone = resolveBadgeTone(item.statusTone, Boolean(item.selected));
  const resolvedHelperTone = resolveBadgeTone(item.helperTone, Boolean(item.selected));
  const resolvedHelperColor = {
    default: theme.textMuted,
    info: theme.infoText,
    brand: theme.brand,
    success: theme.successText,
    danger: theme.dangerText,
    warning: theme.brand,
  }[resolvedHelperTone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: item.selected, disabled: item.disabled }}
      disabled={!canSelect}
      onPress={item.onSelect}
      style={({ pressed }) => [
        {
          borderWidth: borders.hairline,
          borderColor: item.selected ? theme.brand : theme.line,
          borderRadius: radius.xl,
          backgroundColor: theme.surface,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          gap: spacing[2],
          opacity: item.disabled && !item.selected ? 0.68 : pressed && canSelect ? 0.96 : 1,
          shadowColor: item.selected ? '#0A2F5C' : undefined,
          shadowOpacity: item.selected ? 0.06 : 0,
          shadowRadius: item.selected ? 10 : 0,
          shadowOffset: item.selected ? { width: 0, height: 4 } : undefined,
          elevation: item.selected ? 2 : 0,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: rowDirection, justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing[2] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: spacing[2] }}>
            <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: item.selected ? theme.brand : theme.lineStrong, marginTop: 2 }} />
            <Text role="bodyStrong" style={{ textAlign }}>
              {item.title}
            </Text>
          </View>
          <Text role="bodySm" tone="muted" style={{ textAlign, lineHeight: 17 }}>
            {item.description}
          </Text>
        </View>

        {item.statusLabel ? <Badge label={item.statusLabel} tone={resolvedStatusTone} /> : null}
      </View>

      {item.amountRows?.length ? (
        <View style={{ paddingTop: spacing[1], borderTopWidth: borders.hairline, borderTopColor: item.selected ? theme.brandSurface : theme.line, flexDirection: rowDirection, gap: spacing[2] }}>
          {item.amountRows.map((amountRow) => (
            <View
              key={`${item.id}-${amountRow.label}`}
              style={{ flex: 1, gap: spacing[0], alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}
            >
              <Text role="caption" tone="muted" style={{ textAlign }}>
                {amountRow.label}
              </Text>
              <Text role="bodyStrong" style={{ color: resolveAmountTone(amountRow.tone, theme), textAlign }}>
                {amountRow.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {item.helperText ? (
        <Text role="bodySm" style={{ color: resolvedHelperColor, textAlign, lineHeight: 18 }}>
          {item.helperText}
        </Text>
      ) : null}

      {item.action ? (
        <View style={{ alignSelf: actionAlignment, marginTop: spacing[0] }}>
          <Button
            label={item.action.label}
            tone={item.action.tone ?? 'secondary'}
            size="sm"
            fullWidth={false}
            disabled={item.action.disabled || !item.action.onPress}
            loading={item.action.loading}
            onPress={item.action.onPress}
            style={item.action.tone === 'primary' ? { minWidth: 104 } : undefined}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

export function PaymentDecisionList({ items, style }: PaymentDecisionListProps) {
  return (
    <View style={[{ gap: spacing[1] }, style]}>
      {items.map((item) => (
        <PaymentDecisionCard key={item.id} item={item} />
      ))}
    </View>
  );
}