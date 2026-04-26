import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Dimensions,
  Platform,
  Pressable,
  TextInput,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  radius,
  resolveRowDirection,
  safeArea,
  spacing,
} from '../foundation';
import { useDirection, useTheme } from '../providers';
import { Surface, Text, type SurfaceTone } from '../primitives';
import { Badge, Button, type BadgeProps, type ButtonTone } from './button';
import { SectionHeader } from './header';
import { KeyValueList, type KeyValueItem } from './list';

export type OperationalStatusHeroProps = {
  statusLabel: string;
  statusTone?: BadgeProps['tone'];
  title: string;
  summary: string;
  routeLabel?: string;
  routeValue?: React.ReactNode;
  nextStepLabel?: string;
  nextStepValue?: React.ReactNode;
};

export function OperationalStatusHero({
  statusLabel,
  statusTone = 'warning',
  title,
  summary,
  routeLabel,
  routeValue,
  nextStepLabel,
  nextStepValue,
}: OperationalStatusHeroProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const heroItems: KeyValueItem[] = [
    routeLabel && routeValue != null ? { label: routeLabel, value: routeValue, tone: 'brand' } : null,
    nextStepLabel && nextStepValue != null ? { label: nextStepLabel, value: nextStepValue, tone: 'warning' } : null,
  ].filter(Boolean) as KeyValueItem[];

  return (
    <Surface
      tone="default"
      padding={3}
      gap={3}
      style={{
        borderRadius: radius.xl,
        borderColor: theme.brandSurface,
        backgroundColor: theme.surface,
      }}
    >
      <View
        style={{
          flexDirection: resolveRowDirection(direction),
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: spacing[3],
        }}
      >
        <View style={{ flex: 1, gap: spacing[1], alignItems: 'flex-end' }}>
          <Text role="titleLg" style={{ color: theme.brandStrong, textAlign: 'right' }}>
            {title}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {summary}
          </Text>
        </View>
        <Badge label={statusLabel} tone={statusTone} />
      </View>

      {heroItems.length ? (
        <Surface
          tone="inset"
          padding={2}
          gap={2}
          style={{
            borderRadius: radius.lg,
            borderColor: theme.brandSurface,
          }}
        >
          <KeyValueList items={heroItems} dense dividers={heroItems.length > 1} />
        </Surface>
      ) : null}
    </Surface>
  );
}

export type CompactStatusStepState = 'done' | 'current' | 'next';

export type CompactStatusStep = {
  id: string;
  title: string;
  state: CompactStatusStepState;
};

export type CompactStatusStepperProps = {
  title: string;
  subtitle?: string;
  steps: readonly CompactStatusStep[];
};

function getStepBadgeTone(state: CompactStatusStepState): BadgeProps['tone'] {
  if (state === 'done') return 'success';
  if (state === 'current') return 'warning';
  return 'info';
}

function getStepStateLabel(state: CompactStatusStepState) {
  if (state === 'done') return 'تم';
  if (state === 'current') return 'الآن';
  return 'التالي';
}

export function CompactStatusStepper({ title, subtitle, steps }: CompactStatusStepperProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Surface tone="default" padding={2} gap={2} style={{ borderColor: theme.line }}>
      <SectionHeader title={title} subtitle={subtitle} />
      <View style={{ gap: spacing[2] }}>
        {steps.map((step, index) => {
          const isDone = step.state === 'done';
          const isCurrent = step.state === 'current';

          return (
            <React.Fragment key={step.id}>
              <View
                style={{
                  flexDirection: resolveRowDirection(direction),
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: spacing[3],
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isCurrent ? theme.brandSurface : isDone ? theme.successSurface : theme.surfaceInset,
                    borderWidth: 1,
                    borderColor: isCurrent ? theme.brand : isDone ? theme.success : theme.line,
                  }}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={16} color={theme.success} />
                  ) : (
                    <Text role="label" tone={isCurrent ? 'brand' : 'soft'}>
                      {index + 1}
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text role="bodyStrong" style={{ textAlign: 'right', color: isCurrent ? theme.brandStrong : theme.text }}>
                    {step.title}
                  </Text>
                </View>

                <Badge label={getStepStateLabel(step.state)} tone={getStepBadgeTone(step.state)} />
              </View>

              {index < steps.length - 1 ? <View style={{ height: 1, backgroundColor: theme.line }} /> : null}
            </React.Fragment>
          );
        })}
      </View>
    </Surface>
  );
}

export type KeyValueDetailsProps = {
  title: string;
  subtitle?: string;
  items: readonly KeyValueItem[];
  tone?: SurfaceTone;
  dense?: boolean;
};

export function KeyValueDetails({ title, subtitle, items, tone = 'default', dense = true }: KeyValueDetailsProps) {
  const { theme } = useTheme();

  return (
    <Surface tone={tone} padding={2} gap={2} style={{ borderColor: theme.line }}>
      <SectionHeader title={title} subtitle={subtitle} />
      <KeyValueList items={items} dense={dense} />
    </Surface>
  );
}

export type OrderLinkedChatQuickAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export type OrderLinkedChatMessage = {
  senderLabel: string;
  body: string;
  meta?: string;
  tone?: BadgeProps['tone'];
};

export type OrderLinkedChatProps = {
  title: string;
  subtitle?: string;
  statusLabel?: string;
  statusTone?: BadgeProps['tone'];
  helperText?: string;
  message?: OrderLinkedChatMessage;
  quickActions?: readonly OrderLinkedChatQuickAction[];
  inputLabel: string;
  inputPlaceholder?: string;
  value: string;
  onChangeText?: (value: string) => void;
  sendLabel: string;
  onSend?: () => void;
  sendDisabled?: boolean;
  disabledReason?: string;
};

function resolveMessageSurfaceTone(tone?: BadgeProps['tone']): SurfaceTone {
  if (tone === 'brand') return 'brand';
  if (tone === 'success') return 'success';
  if (tone === 'warning') return 'warning';
  if (tone === 'danger') return 'danger';
  if (tone === 'info') return 'info';
  return 'inset';
}

export function OrderLinkedChat({
  title,
  subtitle,
  statusLabel,
  statusTone = 'brand',
  helperText,
  message,
  quickActions = [],
  inputLabel,
  inputPlaceholder,
  value,
  onChangeText,
  sendLabel,
  onSend,
  sendDisabled = false,
  disabledReason,
}: OrderLinkedChatProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const hasValue = value.trim().length > 0;
  const canSend = Boolean(onSend) && !sendDisabled;
  const isRtl = direction === 'rtl';

  return (
    <Surface tone="default" padding={2} gap={2} style={{ borderColor: theme.line }}>
      <SectionHeader title={title} subtitle={subtitle} />

      {statusLabel ? <Badge label={statusLabel} tone={statusTone} /> : null}

      {message ? (
        <Surface tone={resolveMessageSurfaceTone(message.tone)} padding={2} gap={1} style={{ borderRadius: radius.lg }}>
          <View
            style={{
              flexDirection: resolveRowDirection(direction),
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Badge label={message.senderLabel} tone={message.tone ?? 'info'} />
            {message.meta ? <Text role="caption" tone="muted">{message.meta}</Text> : null}
          </View>
          <Text role="bodySm" style={{ textAlign: 'right' }}>
            {message.body}
          </Text>
        </Surface>
      ) : null}

      {helperText ? (
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          {helperText}
        </Text>
      ) : null}

      <Surface
        tone="inset"
        padding={2}
        gap={2}
        style={{
          borderRadius: radius.lg,
          borderColor: theme.lineStrong,
          backgroundColor: theme.surface,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                accessibilityState={{ selected: action.selected, disabled: action.disabled }}
                disabled={action.disabled}
                onPress={action.onPress}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: action.selected ? theme.brand : theme.line,
                  backgroundColor: action.selected ? theme.brandSurface : pressed ? theme.surfaceInset : theme.surface,
                  opacity: action.disabled ? 0.5 : 1,
                })}
              >
                {action.icon ?? (
                  <Text role="caption" tone={action.selected ? 'brand' : 'muted'}>
                    {action.label.slice(0, 1)}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>

          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {inputLabel}
          </Text>
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={!sendDisabled || hasValue}
          placeholder={inputPlaceholder}
          placeholderTextColor={theme.textSoft}
          multiline
          numberOfLines={4}
          textAlign={isRtl ? 'right' : 'left'}
          textAlignVertical="top"
          style={{
            minHeight: 96,
            borderWidth: 0,
            paddingHorizontal: 0,
            paddingVertical: spacing[1],
            color: theme.text,
            writingDirection: isRtl ? 'rtl' : 'ltr',
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={sendLabel}
            accessibilityState={{ disabled: !canSend }}
            disabled={!canSend}
            onPress={onSend}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: canSend ? theme.brand : theme.line,
              backgroundColor: canSend ? theme.brandSurface : theme.surface,
              opacity: canSend ? (pressed ? 0.9 : 1) : 0.45,
            })}
          >
            <Ionicons
              name={isRtl ? 'paper-plane' : 'paper-plane-outline'}
              size={18}
              color={canSend ? theme.brand : theme.textSoft}
            />
          </Pressable>
        </View>
      </Surface>

      {disabledReason ? (
        <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
          {disabledReason}
        </Text>
      ) : null}
    </Surface>
  );
}

export type DeferredReviewBlockProps = {
  title: string;
  subtitle?: string;
  enabled: boolean;
  placeholderText: string;
  currentValueLabel: string;
  stateLabel: string;
  helperText?: string;
  value: number;
  onChange?: (value: number) => void;
  submitted?: boolean;
  placeholderTone?: BadgeProps['tone'];
};

export function DeferredReviewBlock({
  title,
  subtitle,
  enabled,
  placeholderText,
  currentValueLabel,
  stateLabel,
  helperText,
  value,
  onChange,
  submitted = false,
  placeholderTone = 'info',
}: DeferredReviewBlockProps) {
  const { theme } = useTheme();

  return (
    <Surface tone="default" padding={2} gap={2} style={{ borderColor: theme.line }}>
      <SectionHeader title={title} subtitle={subtitle} />

      {!enabled ? (
        <Surface tone="inset" padding={2} gap={1} style={{ borderRadius: radius.lg }}>
          <Badge label="مؤجل" tone={placeholderTone} />
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {placeholderText}
          </Text>
        </Surface>
      ) : (
        <>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', gap: spacing[3] }}>
            <View style={{ flex: 1, gap: spacing[1], alignItems: 'flex-end' }}>
              <Text role="label" tone="muted">الحالة</Text>
              <Text role="bodyStrong" tone={submitted ? 'success' : 'brand'}>
                {stateLabel}
              </Text>
            </View>
            <View style={{ flex: 1, gap: spacing[1], alignItems: 'flex-end' }}>
              <Text role="label" tone="muted">التقييم الحالي</Text>
              <Text role="bodyStrong">{currentValueLabel}</Text>
            </View>
          </View>

          {helperText ? (
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              {helperText}
            </Text>
          ) : null}

          <View style={{ flexDirection: 'row-reverse', justifyContent: 'flex-start', gap: spacing[1] }}>
            {[5, 4, 3, 2, 1].map((score) => {
              const selected = score <= value;

              return (
                <Pressable
                  key={score}
                  accessibilityRole="button"
                  accessibilityState={{ selected, disabled: !enabled || !onChange }}
                  disabled={!enabled || !onChange}
                  onPress={() => onChange?.(score)}
                  style={{ padding: 2 }}
                >
                  <Ionicons
                    name={selected ? 'star' : 'star-outline'}
                    size={24}
                    color={selected ? theme.warning : theme.textSoft}
                  />
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </Surface>
  );
}

export type StickyActionBarAction = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: ButtonTone;
};

export type StickyActionBarProps = {
  primaryAction: StickyActionBarAction;
  secondaryAction?: StickyActionBarAction;
  note?: string;
  onHeightChange?: (height: number) => void;
  style?: StyleProp<ViewStyle>;
};

function resolveBottomInset() {
  if (Platform.OS === 'android') {
    return Math.max(safeArea.compact, Dimensions.get('screen').height - Dimensions.get('window').height);
  }

  return safeArea.comfortable;
}

export function StickyActionBar({ primaryAction, secondaryAction, note, onHeightChange, style }: StickyActionBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const bottomInset = resolveBottomInset();

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onHeightChange?.(event.nativeEvent.layout.height);
    },
    [onHeightChange],
  );

  return (
    <View
      onLayout={handleLayout}
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: spacing[4],
          paddingTop: spacing[2],
          paddingBottom: bottomInset + spacing[2],
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderColor: theme.line,
          shadowColor: '#020617',
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: -4 },
          elevation: 8,
          gap: spacing[2],
        },
        style,
      ]}
    >
      {note ? (
        <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
          {note}
        </Text>
      ) : null}

      <View style={{ flexDirection: resolveRowDirection(direction), gap: spacing[2] }}>
        <Button
          label={primaryAction.label}
          tone={primaryAction.tone ?? 'primary'}
          loading={primaryAction.loading}
          disabled={primaryAction.disabled}
          onPress={primaryAction.onPress}
          style={{ flex: 1, minHeight: 48 }}
        />

        {secondaryAction ? (
          <Button
            label={secondaryAction.label}
            tone={secondaryAction.tone ?? 'secondary'}
            loading={secondaryAction.loading}
            disabled={secondaryAction.disabled}
            onPress={secondaryAction.onPress}
            style={{ flex: 1, minHeight: 48 }}
          />
        ) : null}
      </View>
    </View>
  );
}
