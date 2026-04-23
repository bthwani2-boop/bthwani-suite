import React from 'react';
import { Image, Pressable, ScrollView, View, type ImageSourcePropType, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { radius, spacing } from '../foundation';
import { useTheme } from '../providers';
import { BthBadge, BthButton } from './button';
import { BthSurface, BthText } from '../primitives';
import { BthStateView } from './state';

type PressableStyle = PressableProps['style'];

function resolvePressableStyle(style: PressableStyle | undefined, state: PressableStateCallbackType): StyleProp<ViewStyle> {
  return typeof style === 'function' ? style(state) : style;
}

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

export type BthProductCardPrice = {
  value?: number;
  label?: string;
  currency?: string;
};

export type BthProductCardProps = {
  id?: string;
  title: string;
  subtitle?: string;
  imageUri?: string;
  showImage?: boolean;
  price?: BthProductCardPrice;
  oldPrice?: BthProductCardPrice;
  discountLabel?: string;
  badges?: string[];
  isFavorited?: boolean;
  onAdd?: (anchor?: { x: number; y: number }) => void;
  onFavorite?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

function formatCurrencyAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function BthProductCard({
  title,
  subtitle,
  imageUri,
  showImage = true,
  price,
  oldPrice,
  discountLabel,
  badges = [],
  isFavorited,
  onAdd,
  onFavorite,
  onPress,
  style,
}: BthProductCardProps) {
  const { theme } = useTheme();
  const imageSize = 120;

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
      <View style={{ flex: 1 }}>
        <View style={{ gap: spacing[1] }}>
          <BthText role="bodyStrong">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
          {badges.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1] }}>{badges.map((badge) => <BthBadge key={badge} label={badge} tone="default" />)}</View> : null}
        </View>

        <View style={{ marginTop: spacing[3], gap: spacing[1] }}>
          {price?.value != null ? <BthText role="titleSm">{formatCurrencyAmount(price.value, price.currency ?? 'SAR')}</BthText> : null}
          {oldPrice?.value != null ? <BthText role="bodySm" tone="soft">{formatCurrencyAmount(oldPrice.value, oldPrice.currency ?? 'SAR')}</BthText> : null}
        </View>

        <View style={{ marginTop: spacing[3], flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {onFavorite ? <BthButton label={isFavorited ? 'Favorited' : 'Favorite'} tone="secondary" size="sm" fullWidth={false} onPress={onFavorite} /> : null}
          {onAdd ? <BthButton label="Add" size="sm" fullWidth={false} onPress={() => onAdd()} /> : null}
        </View>
      </View>

      {showImage && imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: imageSize, height: imageSize, borderRadius: radius.md }} resizeMode="cover" />
      ) : (
        <View style={{ width: imageSize, height: imageSize, borderRadius: radius.md, backgroundColor: theme.surfaceInset }} />
      )}
    </View>
  );

  const footer = discountLabel ? <View style={{ position: 'relative', marginTop: spacing[3] }}><BthBadge label={discountLabel} tone="warning" /></View> : null;

  return (
    <BthCard onPress={onPress} footer={footer} style={style}>
      {content}
    </BthCard>
  );
}

export type BthStatCardProps = {
  label: string;
  value: string;
  deltaLabel?: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
};

export function BthStatCard({ label, value, deltaLabel, tone = 'default' }: BthStatCardProps) {
  return (
    <BthCard>
      <View style={{ gap: spacing[2] }}>
        <BthText role="label" tone="muted">{label}</BthText>
        <BthText role="hero">{value}</BthText>
        {deltaLabel ? <BthBadge label={deltaLabel} tone={tone} /> : null}
      </View>
    </BthCard>
  );
}

export type BthServiceTileCardProps = PressableProps & {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  badgeLabel?: string;
  badgeTone?: React.ComponentProps<typeof BthBadge>['tone'];
  minHeight?: number;
  titleOnly?: boolean;
};

export function BthServiceTileCard({
  title,
  subtitle,
  description,
  icon,
  badgeLabel,
  badgeTone = 'brand',
  minHeight = 154,
  titleOnly = false,
  style,
  disabled,
  ...rest
}: BthServiceTileCardProps) {
  const { theme } = useTheme();
  const showTopRow = !titleOnly && (icon || badgeLabel);

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: '100%',
          minHeight,
          borderWidth: 1,
          borderColor: theme.line,
          borderRadius: 18,
          backgroundColor: pressed ? theme.surfaceInset : theme.surfaceRaised,
          padding: spacing[4],
          gap: spacing[3],
          opacity: disabled ? 0.56 : 1,
        },
        resolvePressableStyle(style, { pressed }),
      ]}
      {...rest}
    >
      {showTopRow ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
          {icon ? (
            <View style={{ width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceInset }}>
              {icon}
            </View>
          ) : null}
          {badgeLabel ? <BthBadge label={badgeLabel} tone={badgeTone} /> : null}
        </View>
      ) : null}

      <View style={titleOnly ? { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[2] } : { gap: spacing[1] }}>
        <BthText role="bodyStrong" align={titleOnly ? 'center' : 'start'}>{title}</BthText>
        {subtitle ? <BthText role="bodySm" tone="muted" align={titleOnly ? 'center' : 'start'}>{subtitle}</BthText> : null}
        {description ? <BthText role="bodySm" tone="soft" align={titleOnly ? 'center' : 'start'}>{description}</BthText> : null}
      </View>
    </Pressable>
  );
}

export type BthDashboardShellProps = {
  title: string;
  subtitle?: string;
  hero?: React.ReactNode;
  sections?: Array<{
    title: string;
    subtitle?: string;
    content: React.ReactNode;
  }>;
};

export function BthDashboardShell({ title, subtitle, hero, sections = [] }: BthDashboardShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[5] }}>
      <View style={{ gap: spacing[1] }}>
        <BthText role="titleLg">{title}</BthText>
        {subtitle ? <BthText role="bodyMd" tone="muted">{subtitle}</BthText> : null}
      </View>
      {hero ? <View>{hero}</View> : null}
      {sections.map((section, index) => (
        <View key={`${section.title}-${index}`} style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <BthText role="titleSm">{section.title}</BthText>
            {section.subtitle ? <BthText role="bodySm" tone="muted">{section.subtitle}</BthText> : null}
          </View>
          <View>{section.content}</View>
        </View>
      ))}
    </ScrollView>
  );
}

export type BthServiceHubSection = {
  id: string;
  title: string;
  subtitle?: string;
  count?: number | string;
  headingOrder?: 'title-first' | 'count-first';
  tiles: BthServiceTileCardProps[];
};

export type BthServiceHubShellProps = {
  title: string;
  subtitle?: string;
  sections: BthServiceHubSection[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  hero?: React.ReactNode;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
};

export function BthServiceHubShell({
  title,
  subtitle,
  sections,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  hero,
  emptyState,
  footer,
}: BthServiceHubShellProps) {
  const totalTiles = sections.reduce((sum, section) => sum + section.tiles.length, 0);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[5] }}>
      <View style={{ gap: spacing[1] }}>
        <BthText role="titleLg">{title}</BthText>
        {subtitle ? <BthText role="bodyMd" tone="muted">{subtitle}</BthText> : null}
      </View>

      {hero ? <View>{hero}</View> : null}

      {onSearchChange ? (
        <View style={{ gap: spacing[2] }}>
          <BthText role="label" tone="muted">{searchPlaceholder ?? 'Search'}</BthText>
          <BthSurface padding={3} tone="inset">
            <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
              <BthText role="bodyMd" tone={searchValue ? 'default' : 'soft'}>{searchValue ?? searchPlaceholder ?? 'Search'}</BthText>
            </View>
          </BthSurface>
        </View>
      ) : null}

      {totalTiles === 0
        ? (emptyState ?? <BthStateView stateId="empty" />)
        : sections.map((section) => (
            <View key={section.id} style={{ gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
                <View style={{ flex: 1, gap: spacing[1] }}>
                  <BthText role="titleSm">{section.title}</BthText>
                  {section.subtitle ? <BthText role="bodySm" tone="muted">{section.subtitle}</BthText> : null}
                </View>
                {section.count != null ? <BthBadge label={String(section.count)} tone="default" /> : null}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
                {section.tiles.map((tile) => (
                  <View key={tile.title} style={{ width: '48%' }}>
                    <BthServiceTileCard {...tile} />
                  </View>
                ))}
              </View>
            </View>
          ))}

      {footer ? <View>{footer}</View> : null}
    </ScrollView>
  );
}

export type BthDetailScreenShellProps = {
  title: string;
  subtitle?: string;
  sections: Array<{
    title: string;
    subtitle?: string;
    content: React.ReactNode;
  }>;
};

export function BthDetailScreenShell({ title, subtitle, sections }: BthDetailScreenShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
      <View style={{ gap: spacing[1] }}>
        <BthText role="titleLg">{title}</BthText>
        {subtitle ? <BthText role="bodyMd" tone="muted">{subtitle}</BthText> : null}
      </View>
      {sections.map((section, index) => (
        <BthSurface key={`${section.title}-${index}`}>
          <View style={{ gap: spacing[1] }}>
            <BthText role="titleSm">{section.title}</BthText>
            {section.subtitle ? <BthText role="bodySm" tone="muted">{section.subtitle}</BthText> : null}
          </View>
          <View>{section.content}</View>
        </BthSurface>
      ))}
    </ScrollView>
  );
}

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
  const selectedItems = items.filter((item) => item.selected);
  const selectedCount = selectedItems.length;

  return (
    <BthCard style={style}>
      <View style={{ gap: spacing[3] }}>
        <View style={{ gap: spacing[1] }}>
          <BthText role="titleSm">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>

        <View style={{ gap: spacing[2] }}>
          <BthText role="caption" tone="soft">{selectedCount ? `${selectedCount} selected` : 'Nothing selected yet'}</BthText>
          {selectedItems.map((item) => (
            <AttachmentPickerRow key={item.key} item={item} locked={locked} />
          ))}
        </View>

        {onClear ? <BthButton label="Clear" tone="secondary" size="sm" fullWidth={false} onPress={onClear} /> : null}
      </View>
    </BthCard>
  );
}

function AttachmentPickerRow({ item, locked }: { item: BthAttachmentPickerItem; locked: boolean }) {
  const { theme } = useTheme();
  const selected = Boolean(item.selected);
  const disabled = locked || Boolean(item.disabled);
  const toneScheme = {
    default: { accent: theme.lineStrong, surface: theme.surfaceInset },
    brand: { accent: theme.brand, surface: theme.brandSurface },
    success: { accent: theme.success, surface: theme.successSurface },
    warning: { accent: theme.warning, surface: theme.warningSurface },
    info: { accent: theme.info, surface: theme.infoSurface },
  }[item.tone ?? 'default'];

  return (
    <Pressable
      onPress={item.onPress}
      disabled={disabled}
      style={({ pressed }) => [{ width: '100%', padding: spacing[3], borderRadius: radius.lg, borderWidth: 1, borderColor: selected ? toneScheme.accent : theme.line, backgroundColor: selected ? toneScheme.surface : theme.surfaceRaised, opacity: disabled ? 0.48 : pressed ? 0.9 : 1, gap: spacing[2] }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        {item.leadingAccessory}
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="bodyStrong">{item.title}</BthText>
          <BthText role="bodySm" tone="muted">{item.subtitle}</BthText>
        </View>
        <BthBadge label={selected ? item.selectedLabel : item.actionLabel ?? item.selectedLabel} tone={item.tone ?? 'default'} />
      </View>
    </Pressable>
  );
}