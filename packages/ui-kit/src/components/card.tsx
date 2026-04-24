import React from 'react';
import { Image, Pressable, ScrollView, View, type ImageSourcePropType, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { radius, spacing } from '../foundation';
import { useTheme } from '../providers';
import { Badge, Button } from './button';
import { Surface, Text } from '../primitives';
import { StateView } from './state';

type PressableStyle = PressableProps['style'];

function resolvePressableStyle(style: PressableStyle | undefined, state: PressableStateCallbackType): StyleProp<ViewStyle> {
  return typeof style === 'function' ? style(state) : style;
}

export type CardProps = {
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

export function Card({
  title,
  subtitle,
  children,
  footer,
  style,
  onPress,
  disabled = false,
  accessibilityLabel,
  testID,
}: CardProps) {
  const surface = (
    <Surface style={style}>
      <View style={{ gap: spacing[3] }}>
        {(title || subtitle) ? (
          <View style={{ gap: spacing[1] }}>
            {title ? <Text role="titleSm">{title}</Text> : null}
            {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
          </View>
        ) : null}
        {children}
        {footer ? <View>{footer}</View> : null}
      </View>
    </Surface>
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
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.56 : pressed ? 0.96 : 1,
        },
        resolvePressableStyle(undefined, { pressed } as PressableStateCallbackType),
      ]}
    >
      {surface}
    </Pressable>
  );
}

export type ProductCardPrice = {
  value?: number;
  label?: string;
  currency?: string;
};

export type ProductCardProps = {
  id?: string;
  title: string;
  subtitle?: string;
  imageUri?: string;
  showImage?: boolean;
  price?: ProductCardPrice;
  oldPrice?: ProductCardPrice;
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

export function ProductCard({
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
}: ProductCardProps) {
  const { theme } = useTheme();
  const imageSize = 120;

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
      <View style={{ flex: 1 }}>
        <View style={{ gap: spacing[1] }}>
          <Text role="bodyStrong">{title}</Text>
          {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
          {badges.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1] }}>{badges.map((badge) => <Badge key={badge} label={badge} tone="default" />)}</View> : null}
        </View>

        <View style={{ marginTop: spacing[3], gap: spacing[1] }}>
          {price?.value != null ? <Text role="titleSm">{formatCurrencyAmount(price.value, price.currency ?? 'SAR')}</Text> : null}
          {oldPrice?.value != null ? <Text role="bodySm" tone="soft">{formatCurrencyAmount(oldPrice.value, oldPrice.currency ?? 'SAR')}</Text> : null}
        </View>

        <View style={{ marginTop: spacing[3], flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {onFavorite ? <Button label={isFavorited ? 'Favorited' : 'Favorite'} tone="secondary" size="sm" fullWidth={false} onPress={onFavorite} /> : null}
          {onAdd ? <Button label="Add" size="sm" fullWidth={false} onPress={() => onAdd()} /> : null}
        </View>
      </View>

      {showImage && imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: imageSize, height: imageSize, borderRadius: radius.md }} resizeMode="cover" />
      ) : (
        <View style={{ width: imageSize, height: imageSize, borderRadius: radius.md, backgroundColor: theme.surfaceInset }} />
      )}
    </View>
  );

  const footer = discountLabel ? <View style={{ position: 'relative', marginTop: spacing[3] }}><Badge label={discountLabel} tone="warning" /></View> : null;

  return (
    <Card onPress={onPress} footer={footer} style={style}>
      {content}
    </Card>
  );
}

export type StatCardProps = {
  label: string;
  value: string;
  deltaLabel?: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
};

export function StatCard({ label, value, deltaLabel, tone = 'default' }: StatCardProps) {
  return (
    <Card>
      <View style={{ gap: spacing[2] }}>
        <Text role="label" tone="muted">{label}</Text>
        <Text role="hero">{value}</Text>
        {deltaLabel ? <Badge label={deltaLabel} tone={tone} /> : null}
      </View>
    </Card>
  );
}

export type ServiceTileCardProps = PressableProps & {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  badgeLabel?: string;
  badgeTone?: React.ComponentProps<typeof Badge>['tone'];
  minHeight?: number;
  titleOnly?: boolean;
};

export function ServiceTileCard({
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
}: ServiceTileCardProps) {
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
        resolvePressableStyle(style, { pressed } as PressableStateCallbackType),
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
          {badgeLabel ? <Badge label={badgeLabel} tone={badgeTone} /> : null}
        </View>
      ) : null}

      <View style={titleOnly ? { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[2] } : { gap: spacing[1] }}>
        <Text role="bodyStrong" align={titleOnly ? 'center' : 'start'}>{title}</Text>
        {subtitle ? <Text role="bodySm" tone="muted" align={titleOnly ? 'center' : 'start'}>{subtitle}</Text> : null}
        {description ? <Text role="bodySm" tone="soft" align={titleOnly ? 'center' : 'start'}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

export type DashboardShellProps = {
  title: string;
  subtitle?: string;
  hero?: React.ReactNode;
  sections?: Array<{
    title: string;
    subtitle?: string;
    content: React.ReactNode;
  }>;
};

export function DashboardShell({ title, subtitle, hero, sections = [] }: DashboardShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[5] }}>
      <View style={{ gap: spacing[1] }}>
        <Text role="titleLg">{title}</Text>
        {subtitle ? <Text role="bodyMd" tone="muted">{subtitle}</Text> : null}
      </View>
      {hero ? <View>{hero}</View> : null}
      {sections.map((section, index) => (
        <View key={`${section.title}-${index}`} style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <Text role="titleSm">{section.title}</Text>
            {section.subtitle ? <Text role="bodySm" tone="muted">{section.subtitle}</Text> : null}
          </View>
          <View>{section.content}</View>
        </View>
      ))}
    </ScrollView>
  );
}

export type ServiceHubSection = {
  id: string;
  title: string;
  subtitle?: string;
  count?: number | string;
  headingOrder?: 'title-first' | 'count-first';
  tiles: ServiceTileCardProps[];
};

export type ServiceHubShellProps = {
  title: string;
  subtitle?: string;
  sections: ServiceHubSection[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  hero?: React.ReactNode;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
};

export function ServiceHubShell({
  title,
  subtitle,
  sections,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  hero,
  emptyState,
  footer,
}: ServiceHubShellProps) {
  const totalTiles = sections.reduce((sum, section) => sum + section.tiles.length, 0);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[5] }}>
      <View style={{ gap: spacing[1] }}>
        <Text role="titleLg">{title}</Text>
        {subtitle ? <Text role="bodyMd" tone="muted">{subtitle}</Text> : null}
      </View>

      {hero ? <View>{hero}</View> : null}

      {onSearchChange ? (
        <View style={{ gap: spacing[2] }}>
          <Text role="label" tone="muted">{searchPlaceholder ?? 'Search'}</Text>
          <Surface padding={3} tone="inset">
            <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
              <Text role="bodyMd" tone={searchValue ? 'default' : 'soft'}>{searchValue ?? searchPlaceholder ?? 'Search'}</Text>
            </View>
          </Surface>
        </View>
      ) : null}

      {totalTiles === 0
        ? (emptyState ?? <StateView stateId="empty" />)
        : sections.map((section) => (
            <View key={section.id} style={{ gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
                <View style={{ flex: 1, gap: spacing[1] }}>
                  <Text role="titleSm">{section.title}</Text>
                  {section.subtitle ? <Text role="bodySm" tone="muted">{section.subtitle}</Text> : null}
                </View>
                {section.count != null ? <Badge label={String(section.count)} tone="default" /> : null}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
                {section.tiles.map((tile) => (
                  <View key={tile.title} style={{ width: '48%' }}>
                    <ServiceTileCard {...tile} />
                  </View>
                ))}
              </View>
            </View>
          ))}

      {footer ? <View>{footer}</View> : null}
    </ScrollView>
  );
}

export type DetailScreenShellProps = {
  title: string;
  subtitle?: string;
  sections: Array<{
    title: string;
    subtitle?: string;
    content: React.ReactNode;
  }>;
};

export function DetailScreenShell({ title, subtitle, sections }: DetailScreenShellProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
      <View style={{ gap: spacing[1] }}>
        <Text role="titleLg">{title}</Text>
        {subtitle ? <Text role="bodyMd" tone="muted">{subtitle}</Text> : null}
      </View>
      {sections.map((section, index) => (
        <Surface key={`${section.title}-${index}`}>
          <View style={{ gap: spacing[1] }}>
            <Text role="titleSm">{section.title}</Text>
            {section.subtitle ? <Text role="bodySm" tone="muted">{section.subtitle}</Text> : null}
          </View>
          <View>{section.content}</View>
        </Surface>
      ))}
    </ScrollView>
  );
}

export type AttachmentPickerTone = 'default' | 'brand' | 'success' | 'warning' | 'info';

export type AttachmentPickerItem = {
  key: string;
  title: string;
  subtitle: string;
  selectedLabel: string;
  actionLabel?: string;
  tone?: AttachmentPickerTone;
  selected?: boolean;
  disabled?: boolean;
  leadingAccessory?: React.ReactNode;
  onPress?: () => void;
};

export type AttachmentPickerProps = {
  title: string;
  subtitle?: string;
  items: AttachmentPickerItem[];
  locked?: boolean;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AttachmentPicker({ title, subtitle, items, locked = false, onClear, style }: AttachmentPickerProps) {
  const selectedItems = items.filter((item) => item.selected);
  const selectedCount = selectedItems.length;

  return (
    <Card style={style}>
      <View style={{ gap: spacing[3] }}>
        <View style={{ gap: spacing[1] }}>
          <Text role="titleSm">{title}</Text>
          {subtitle ? <Text role="bodySm" tone="muted">{subtitle}</Text> : null}
        </View>

        <View style={{ gap: spacing[2] }}>
          <Text role="caption" tone="soft">{selectedCount ? `${selectedCount} selected` : 'Nothing selected yet'}</Text>
          {selectedItems.map((item) => (
            <AttachmentPickerRow key={item.key} item={item} locked={locked} />
          ))}
        </View>

        {onClear ? <Button label="Clear" tone="secondary" size="sm" fullWidth={false} onPress={onClear} /> : null}
      </View>
    </Card>
  );
}

function AttachmentPickerRow({ item, locked }: { item: AttachmentPickerItem; locked: boolean }) {
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
          <Text role="bodyStrong">{item.title}</Text>
          <Text role="bodySm" tone="muted">{item.subtitle}</Text>
        </View>
        <Badge label={selected ? item.selectedLabel : item.actionLabel ?? item.selectedLabel} tone={item.tone ?? 'default'} />
      </View>
    </Pressable>
  );
}
