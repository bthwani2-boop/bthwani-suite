import React, { memo, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, type GestureResponderEvent, type ImageSourcePropType, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { radius, resolveRowDirection, resolveTextAlign, spacing, type SpacingToken } from '../foundation';
import { useBThwaniAppearance, useDirection, useTheme } from '../providers';
import { Badge, Button } from './button';
import { Icon } from './icons';
import { Surface, Text, type SurfaceTone } from '../primitives';
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
  padding?: SpacingToken;
  gap?: SpacingToken;
  tone?: SurfaceTone;
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
  padding = 5,
  gap = 3,
  tone = 'default',
  style,
  onPress,
  disabled = false,
  accessibilityLabel,
  testID,
}: CardProps) {
  const surface = (
    <Surface tone={tone} padding={padding} gap={gap} style={style}>
      <View style={{ gap: spacing[gap] }}>
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
  imageSource?: ImageSourcePropType | string | null;
  partnerImageUri?: string;
  partnerImageSource?: ImageSourcePropType | string | null;
  emoji?: string;
  showImage?: boolean;
  statusLabel?: string;
  statusTone?: 'default' | 'success' | 'warning' | 'danger';
  categoryLabel?: string;
  preparationTime?: string;
  price?: ProductCardPrice;
  oldPrice?: ProductCardPrice;
  discountLabel?: string;
  badges?: string[];
  isFavorited?: boolean;
  onAdd?: (anchor?: { x: number; y: number }) => void;
  onFavorite?: () => void;
  onImagePress?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function resolveImageSource(source?: ImageSourcePropType | string | null): ImageSourcePropType | undefined {
  if (!source) {
    return undefined;
  }

  return typeof source === 'string' ? { uri: source } : source;
}

function formatCurrencyAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function resolveStatusTone(statusLabel?: string, statusTone?: ProductCardProps['statusTone']): ProductCardProps['statusTone'] {
  if (statusTone) {
    return statusTone;
  }

  if (!statusLabel) {
    return 'default';
  }

  const normalized = statusLabel.trim().toLowerCase();
  if (normalized.includes('مغلق') || normalized.includes('closed') || normalized.includes('غير متاح')) {
    return 'danger';
  }

  if (normalized.includes('مفتوح') || normalized.includes('open') || normalized.includes('متاح')) {
    return 'success';
  }

  return 'default';
}

function formatPriceLabel(price?: ProductCardPrice) {
  if (!price) {
    return undefined;
  }

  if (price.label) {
    return price.label;
  }

  if (price.value == null) {
    return undefined;
  }

  return formatCurrencyAmount(price.value, price.currency ?? 'SAR');
}

type ProductCardStyles = ReturnType<typeof createProductCardStyles>;

function createProductCardStyles(
  theme: ReturnType<typeof useTheme>['theme'],
  productColors: ReturnType<typeof useBThwaniAppearance>['tokens']['components']['commerce']['productCard'],
  rowDirection: 'row' | 'row-reverse',
  textAlign: 'left' | 'right' | 'center',
) {
  const alignItemsDirection = textAlign === 'right' ? 'flex-end' : 'flex-start';

  return StyleSheet.create({
    card: {
      width: '100%',
      backgroundColor: productColors.backgroundColor,
      borderRadius: 18,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 1,
      borderColor: productColors.rimLightColor,
      flexDirection: rowDirection,
      alignItems: 'stretch',
      height: 126,
      overflow: 'hidden',
      ...productColors.shadowSoft,
    },
    cardPressed: {
      opacity: 0.98,
    },
    imageWrap: {
      width: 176,
      alignItems: 'stretch',
      justifyContent: 'center',
    },
    imageCard: {
      flex: 1,
      width: '100%',
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      backgroundColor: productColors.imageBackground,
      borderWidth: 0,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    image: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: productColors.imageBackground,
    },
    partnerTile: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 64,
      height: 52,
      backgroundColor: theme.surface,
      borderTopLeftRadius: 32,
      borderBottomRightRadius: 18,
      borderWidth: 1,
      borderColor: productColors.favoriteBorder,
      zIndex: 6,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      ...productColors.partnerTileShadow,
    },
    partnerTileImage: {
      width: '100%',
      height: '100%',
    },
    emoji: {
      position: 'absolute',
      top: 36,
      right: 36,
      fontSize: 48,
    },
    imagePressable: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    favoriteButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 36,
      height: 36,
      backgroundColor: theme.surface,
      borderBottomLeftRadius: 24,
      borderTopRightRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0.8,
      borderColor: productColors.favoriteBorder,
      zIndex: 3,
    },
    body: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'flex-start',
      gap: 4,
      alignItems: alignItemsDirection,
      marginEnd: 0,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    infoZone: {
      width: '100%',
      minHeight: 0,
      justifyContent: 'flex-start',
      gap: 0,
      alignItems: alignItemsDirection,
      flexShrink: 1,
    },
    title: {
      color: productColors.titleColor,
      fontSize: 16,
      fontWeight: '900',
      lineHeight: 20,
      textAlign,
    },
    subtitle: {
      color: productColors.subtitleColor,
      fontSize: 11.5,
      marginTop: 1,
      lineHeight: 15,
      textAlign,
    },
    timingRow: {
      marginTop: 2,
      flexDirection: rowDirection,
      alignItems: 'center',
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
      gap: 4,
      flexWrap: 'wrap',
    },
    prep: {
      color: productColors.subtitleColor,
      fontSize: 10.5,
      fontWeight: '600',
    },
    commerceZone: {
      width: '100%',
      justifyContent: 'flex-start',
      gap: 2,
      alignItems: alignItemsDirection,
      marginTop: 'auto',
      flexShrink: 1,
    },
    priceRow: {
      marginTop: 0,
      flexDirection: rowDirection,
      alignItems: 'center',
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
      gap: 4,
      flexWrap: 'wrap',
      maxWidth: '100%',
    },
    price: {
      color: productColors.priceColor,
      fontSize: 14,
      fontWeight: '900',
    },
    oldPrice: {
      color: productColors.oldPriceColor,
      fontSize: 10.5,
      fontWeight: '700',
      textDecorationLine: 'line-through',
    },
    discountRow: {
      marginTop: 1,
      width: '100%',
      flexDirection: rowDirection,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    discountChip: {
      backgroundColor: productColors.discountSurface,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    discountText: {
      color: productColors.discountText,
      fontSize: 10,
      fontWeight: '900',
    },
    chipRow: {
      marginTop: 2,
      width: '100%',
      flexDirection: rowDirection,
      flexWrap: 'wrap',
      gap: 4,
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
    },
    smallChipPrimary: {
      backgroundColor: productColors.statusDefaultSurface,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    smallChipPrimaryText: {
      color: productColors.statusDefaultText,
      fontSize: 11,
      fontWeight: '800',
    },
    smallChipSuccess: {
      backgroundColor: productColors.statusSuccessSurface,
    },
    smallChipSuccessText: {
      color: productColors.statusSuccessText,
    },
    smallChipDanger: {
      backgroundColor: productColors.statusDangerSurface,
    },
    smallChipDangerText: {
      color: productColors.statusDangerText,
    },
    smallChipLight: {
      backgroundColor: productColors.categorySurface,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    smallChipLightText: {
      color: productColors.categoryText,
      fontSize: 11,
      fontWeight: '700',
    },
    actionRail: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 10,
    },
    actionRailRTL: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 10,
    },
    actionBadge: {
      width: 44,
      height: 36,
      borderTopRightRadius: 24,
      borderBottomLeftRadius: 18,
      backgroundColor: '#FF500D',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      ...productColors.shadowPremium,
    },
    actionPlusBadge: {
      position: 'absolute',
      top: -3,
      left: -3,
      width: 15,
      height: 15,
      borderRadius: 7.5,
      backgroundColor: productColors.actionPlusSurface,
      borderWidth: 1,
      borderColor: productColors.actionPlusBorder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowReverse: {
      flexDirection: 'row-reverse',
    },
  });
}

export const ProductCard = memo(function ProductCard({
  title,
  subtitle,
  imageUri,
  imageSource,
  partnerImageUri,
  partnerImageSource,
  emoji,
  showImage = true,
  statusLabel,
  statusTone,
  categoryLabel,
  preparationTime,
  price,
  oldPrice,
  discountLabel,
  isFavorited,
  onAdd,
  onFavorite,
  onImagePress,
  onPress,
  style,
  testID,
}: ProductCardProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const rowDirection = resolveRowDirection(direction);
  const textAlign = resolveTextAlign(direction);
  const logicalAlign = textAlign === 'left' ? 'start' : textAlign === 'right' ? 'end' : 'center';
  const isRTL = direction === 'rtl';
  const productColors = appearanceTokens.components.commerce.productCard;
  const styles = useMemo(
    () => createProductCardStyles(theme, productColors, rowDirection, textAlign),
    [theme, productColors, rowDirection, textAlign],
  );
  const resolvedImageSource = resolveImageSource(imageSource ?? imageUri);
  const resolvedPartnerSource = resolveImageSource(partnerImageSource ?? partnerImageUri);
  const resolvedStatusTone = resolveStatusTone(statusLabel, statusTone);
  const priceLabel = formatPriceLabel(price);
  const oldPriceLabel = formatPriceLabel(oldPrice);

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.card, style, pressed && onPress ? styles.cardPressed : null]}
    >
      <View style={styles.imageWrap}>
        <View style={styles.imageCard}>
          {showImage && resolvedImageSource ? (
            <Image source={resolvedImageSource} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}

          {onFavorite ? (
            <Pressable
              hitSlop={8}
              onPress={onFavorite}
              style={styles.favoriteButton}
            >
              <Icon
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={18}
                color={isFavorited ? productColors.favoriteActive : '#0A2F5C'}
              />
            </Pressable>
          ) : null}

          {resolvedPartnerSource ? (
            <View style={styles.partnerTile}>
              <Image source={resolvedPartnerSource} style={styles.partnerTileImage} resizeMode="contain" />
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.infoZone}>
          <Text role="bodyStrong" align={logicalAlign} numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text role="bodySm" tone="muted" align={logicalAlign} numberOfLines={2} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}

          {preparationTime ? (
            <View style={styles.timingRow}>
              <Icon name="time-outline" size={14} color={theme.textMuted} />
              <Text role="bodySm" style={styles.prep} numberOfLines={1}>
                {preparationTime}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.commerceZone}>
          <View style={styles.priceRow}>
            {priceLabel ? (
              <Text role="titleSm" align={logicalAlign} style={styles.price} numberOfLines={1}>
                {priceLabel}
              </Text>
            ) : null}
            {oldPriceLabel ? (
              <Text role="bodySm" tone="soft" style={styles.oldPrice} numberOfLines={1}>
                {oldPriceLabel}
              </Text>
            ) : null}
          </View>

          {discountLabel ? (
            <View style={styles.discountRow}>
              <View style={styles.discountChip}>
                <Text role="label" style={styles.discountText} numberOfLines={1}>
                  {discountLabel}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.chipRow}>
            {statusLabel ? (
              <View
                style={[
                  styles.smallChipPrimary,
                  resolvedStatusTone === 'success' ? styles.smallChipSuccess : null,
                  resolvedStatusTone === 'danger' ? styles.smallChipDanger : null,
                ]}
              >
                <Text
                  role="label"
                  style={[
                    styles.smallChipPrimaryText,
                    resolvedStatusTone === 'success' ? styles.smallChipSuccessText : null,
                    resolvedStatusTone === 'danger' ? styles.smallChipDangerText : null,
                  ]}
                  numberOfLines={1}
                >
                  {statusLabel}
                </Text>
              </View>
            ) : null}

            {categoryLabel ? (
              <View style={styles.smallChipLight}>
                <Text role="label" style={styles.smallChipLightText} numberOfLines={1}>
                  {categoryLabel}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.actionRail}>
        {onAdd ? (
          <Pressable
            hitSlop={10}
            onPress={(event: GestureResponderEvent) => onAdd({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })}
            style={styles.actionBadge}
          >
            <View style={{ position: 'relative' }}>
              <Icon name="cart-outline" size={19} color="#FFFFFF" />
              <View style={{ position: 'absolute', top: -3, left: -5, backgroundColor: '#FFFFFF', borderRadius: 5, width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="add" size={8} color="#FF500D" />
              </View>
            </View>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
});

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
