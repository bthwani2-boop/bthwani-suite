import React from 'react';
import { Pressable, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { opacities, radius, spacing } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthSurface, BthText } from '../../primitives';
import { BthBadge } from '../display/BthBadge';
import { BthButton } from '../actions/BthButton';
import { BthSectionHeader } from '../navigation/BthTopBar';

export type BthAttachmentPickerTone = 'default' | 'brand' | 'success' | 'warning' | 'info';

export type BthAttachmentPickerItem = {
  key: string;
  title: string;
  subtitle: string;
  selectedLabel: string;
  actionLabel?: string;
  tone?: BthAttachmentPickerTone;
  selected?: boolean;
  disabled?: boolean;
  leadingAccessory?: React.ReactNode;
  onPress?: () => void;
};

export type BthAttachmentPickerProps = {
  title: string;
  subtitle?: string;
  items: BthAttachmentPickerItem[];
  locked?: boolean;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BthAttachmentPicker({ title, subtitle, items, locked = false, onClear, style }: BthAttachmentPickerProps) {
  const { theme } = useTheme();
  const selectedItems = items.filter((item) => item.selected);
  const selectedCount = selectedItems.length;

  return (
    <BthSurface tone={locked ? 'inset' : 'raised'} padding={2} gap={2} style={[{ borderRadius: 22, borderWidth: 1, borderColor: theme.line }, style]}>
      <BthSectionHeader
        title={title}
        subtitle={subtitle}
        count={selectedCount ? `${selectedCount}/${items.length}` : undefined}
        countTone={selectedCount ? 'brand' : 'default'}
        trailing={onClear && selectedCount && !locked ? <BthButton label="مسح الكل" size="sm" tone="secondary" fullWidth={false} onPress={onClear} /> : undefined}
      />

      <BthSurface tone="inset" padding={2} gap={1} style={{ borderRadius: 18, borderWidth: 1, borderColor: theme.line }}>
        <AttachmentSummary locked={locked} selectedItems={selectedItems} />
      </BthSurface>

      <View style={{ gap: spacing[1] }}>
        {items.map((item) => (
          <AttachmentPickerRow key={item.key} item={item} locked={locked} />
        ))}
      </View>
    </BthSurface>
  );
}

function AttachmentSummary({ locked, selectedItems }: { locked: boolean; selectedItems: BthAttachmentPickerItem[] }) {
  const { direction } = useDirection();

  return (
    <View style={{ gap: spacing[1] }}>
      <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
        <BthBadge label={locked ? 'المرفقات مقفلة' : selectedItems.length ? 'جاهز للإرسال' : 'اختر مرفقًا'} tone={locked ? 'warning' : selectedItems.length ? 'success' : 'default'} />
        {locked ? <BthBadge label="قراءة فقط" tone="warning" /> : null}
      </View>

      <BthText role="bodySm" tone="muted" align="end">
        {locked
          ? 'تم إغلاق المرفقات بعد التسليم ولا يمكن إضافة وسيط جديد.'
          : selectedItems.length
            ? 'هذه المرفقات ستُرسل داخل نفس الطلب مع الرسالة الحالية.'
            : 'يمكنك اختيار صورة أو فيديو أو رسالة صوتية، ثم إرسالها بسرعة.'}
      </BthText>

      {selectedItems.length ? (
        <View style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', justifyContent: 'flex-end', gap: spacing[1] }}>
          {selectedItems.map((item) => (
            <BthBadge key={item.key} label={item.selectedLabel} tone={item.tone ?? 'default'} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function AttachmentPickerRow({ item, locked }: { item: BthAttachmentPickerItem; locked: boolean }) {
  const { theme } = useTheme();
  const { direction } = useDirection();
  const selected = Boolean(item.selected);
  const disabled = locked || Boolean(item.disabled);

  const toneScheme = {
    default: {
      accent: theme.lineStrong,
      surface: theme.surfaceInset,
    },
    brand: {
      accent: theme.brand,
      surface: theme.brandSurface,
    },
    success: {
      accent: theme.success,
      surface: theme.successSurface,
    },
    warning: {
      accent: theme.warning,
      surface: theme.warningSurface,
    },
    info: {
      accent: theme.info,
      surface: theme.infoSurface,
    },
  }[item.tone ?? 'default'];

  const resolveStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [{
    width: '100%',
    padding: spacing[3],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: selected ? toneScheme.accent : theme.line,
    backgroundColor: selected ? toneScheme.surface : theme.surfaceRaised,
    opacity: disabled ? opacities.disabled : pressed ? opacities.pressed : 1,
  }];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={item.onPress}
      style={resolveStyle}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: spacing[3] }}>
        <View style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? toneScheme.surface : theme.surfaceInset,
          borderWidth: 1,
          borderColor: selected ? toneScheme.accent : theme.line,
        }}>
          {item.leadingAccessory}
        </View>

        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="bodyStrong" align="end">
            {item.title}
          </BthText>
          <BthText role="bodySm" tone="muted" align="end" numberOfLines={2}>
            {item.subtitle}
          </BthText>
        </View>

        <BthBadge label={selected ? item.selectedLabel : item.actionLabel ?? 'إرفاق'} tone={selected ? (item.tone ?? 'default') : 'default'} />
      </View>
    </Pressable>
  );
}