import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal as RNModal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  Switch,
  View,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle
} from 'react-native';
import {
  borders,
  colorPalette,
  directionConfig,
  radius,
  resolveDirectionFromLanguage,
  resolveLogicalPadding,
  resolveRowDirection,
  resolveTextAlign,
  resolveTextRole,
  safeArea,
  shadowByElevation,
  sizes,
  spacing,
  type BthLanguage,
  type BorderToken,
  type Direction,
  type ElevationToken,
  type FontFamilyToken,
  type FontWeightToken,
  type LogicalTextAlign,
  type RadiusToken,
  type SafeAreaToken,
  type SpacingToken,
  type TextRole,
  type ThemeMode
} from './foundation';
import { getBthStateDefinition, type BthStateId, type BthStateKind, type BthStateTone } from './states';
import { useDirection, useTheme } from './hooks';
import { BthBox, BthDivider, BthMobileScrollView, BthSurface, BthText } from './primitives';
import { BthPortalLayer } from './BthPortalHost';

type PressableStyle = StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);

function resolvePressableStyle(style: PressableStyle | undefined, state: PressableStateCallbackType) {
  return typeof style === 'function' ? style(state) : style;
}

function formatCurrencyAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function toneToForeground(theme: ReturnType<typeof useTheme>['theme'], tone: string) {
  switch (tone) {
    case 'brand': return theme.brand;
    case 'success': return theme.success;
    case 'warning': return theme.warning;
    case 'danger': return theme.danger;
    case 'info': return theme.info;
    case 'inverse': return theme.textInverse;
    case 'muted': return theme.textMuted;
    case 'soft': return theme.textSoft;
    default: return theme.text;
  }
}

function toneToSurface(theme: ReturnType<typeof useTheme>['theme'], tone: string) {
  switch (tone) {
    case 'brand': return theme.brandSurface;
    case 'success': return theme.successSurface;
    case 'warning': return theme.warningSurface;
    case 'danger': return theme.dangerSurface;
    case 'info': return theme.infoSurface;
    case 'inset': return theme.surfaceInset;
    case 'raised': return theme.surfaceRaised;
    default: return theme.surface;
  }
}

export type BthButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

export type BthButtonProps = PressableProps & {
  label: string;
  tone?: BthButtonTone;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leadingAccessory?: React.ReactNode;
  trailingAccessory?: React.ReactNode;
};

export function BthButton({
  label,
  tone = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth = true,
  leadingAccessory,
  trailingAccessory,
  style,
  ...rest
}: BthButtonProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const resolvedDisabled = disabled || loading;

  const toneConfig = {
    primary: { backgroundColor: theme.brand, borderColor: theme.brand, labelColor: theme.brandContrast },
    secondary: { backgroundColor: theme.surface, borderColor: theme.lineStrong, labelColor: theme.text },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent', labelColor: theme.brand },
    danger: { backgroundColor: theme.danger, borderColor: theme.danger, labelColor: '#FFFFFF' },
    success: { backgroundColor: theme.success, borderColor: theme.success, labelColor: '#FFFFFF' }
  }[tone];

  const sizeConfig = {
    sm: { minHeight: sizes.controlSm, paddingHorizontal: spacing[3], textRole: 'label' as const },
    md: { minHeight: sizes.controlMd, paddingHorizontal: spacing[4], textRole: 'bodyStrong' as const },
    lg: { minHeight: sizes.controlLg, paddingHorizontal: spacing[5], textRole: 'bodyStrong' as const }
  }[size];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={resolvedDisabled}
      style={({ pressed }) => [
        {
          width: fullWidth ? '100%' : undefined,
          minHeight: sizeConfig.minHeight,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: radius.lg,
          borderWidth: tone === 'ghost' ? 0 : borders.hairline,
          borderColor: toneConfig.borderColor,
          backgroundColor: toneConfig.backgroundColor,
          opacity: resolvedDisabled ? 0.56 : pressed ? 0.9 : 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: resolveRowDirection(direction),
          gap: spacing[2]
        },
        resolvePressableStyle(style as PressableStyle, { pressed } as PressableStateCallbackType)
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color={toneConfig.labelColor} /> : null}
      {leadingAccessory}
      <BthText role={sizeConfig.textRole} style={{ color: toneConfig.labelColor }}>{label}</BthText>
      {trailingAccessory}
    </Pressable>
  );
}

export function Button(props: BthButtonProps) {
  return <BthButton {...props} />;
}

export type StickyActionBarProps = {
  primaryLabel: string;
  primaryOnPress: () => void;
  secondaryLabel?: string;
  secondaryOnPress?: () => void;
  total?: string;
  fixed?: boolean;
};

export function StickyActionBar({
  primaryLabel,
  primaryOnPress,
  secondaryLabel,
  secondaryOnPress,
  total,
  fixed = false
}: StickyActionBarProps) {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    width: '100%',
    paddingTop: spacing[4],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: theme.surface
  };

  if (fixed) {
    containerStyle.position = 'absolute';
    containerStyle.left = 0;
    containerStyle.right = 0;
    containerStyle.bottom = 0;
    containerStyle.paddingBottom = spacing[4] + (safeArea.comfortable ?? 0);
  }

  return (
    <BthSurface style={containerStyle} elevationToken="raised" radiusToken="none" border={false}>
      <View style={{ gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', gap: spacing[3] }}>
          <View style={{ flex: 1 }}>
            {secondaryLabel ? <BthButton tone="secondary" label={secondaryLabel} onPress={secondaryOnPress} /> : null}
          </View>

          <View style={{ flex: 2 }}>
            <BthButton label={primaryLabel + (total ? ` — ${total}` : '')} onPress={primaryOnPress} />
          </View>
        </View>
      </View>
    </BthSurface>
  );
}

export type ScreenState = 'content' | 'loading' | 'success' | 'error';

export type ScreenWrapperProps = {
  state?: ScreenState;
  loadingMessage?: string;
  successMessage?: string;
  onSuccessAction?: () => void;
  children?: React.ReactNode;
};

export function ScreenWrapper({ state = 'content', loadingMessage, successMessage, onSuccessAction, children }: ScreenWrapperProps) {
  if (state === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] }}>
        <ActivityIndicator size="large" />
        {loadingMessage ? <Text style={{ marginTop: spacing[3], textAlign: 'center' }}>{loadingMessage}</Text> : null}
      </View>
    );
  }

  if (state === 'success') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] }}>
        <Text style={{ marginTop: spacing[3], textAlign: 'center' }}>{successMessage ?? 'Success'}</Text>
        {onSuccessAction ? <BthButton label="OK" onPress={onSuccessAction} /> : null}
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] }}>
        <Text style={{ marginTop: spacing[3], textAlign: 'center' }}>حدث خطأ، الرجاء المحاولة لاحقًا</Text>
        {children}
      </View>
    );
  }

  return <>{children}</>;
}

export type BthBadgeProps = {
  label: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  style?: StyleProp<ViewStyle>;
};

export function BthBadge({ label, tone = 'default', style }: BthBadgeProps) {
  const { theme } = useTheme();
  const palette = {
    default: { backgroundColor: theme.surfaceInset, textColor: theme.textMuted, borderColor: theme.line },
    brand: { backgroundColor: theme.brandSurface, textColor: theme.brand, borderColor: theme.brandSurface },
    success: { backgroundColor: theme.successSurface, textColor: theme.successText, borderColor: theme.successSurface },
    warning: { backgroundColor: theme.warningSurface, textColor: theme.warningText, borderColor: theme.warningSurface },
    danger: { backgroundColor: theme.dangerSurface, textColor: theme.dangerText, borderColor: theme.dangerSurface },
    info: { backgroundColor: theme.infoSurface, textColor: theme.infoText, borderColor: theme.infoSurface }
  }[tone];

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: palette.borderColor,
          backgroundColor: palette.backgroundColor
        },
        style
      ]}
    >
      <BthText role="label" style={{ color: palette.textColor }}>{label}</BthText>
    </View>
  );
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
  testID
}: BthCardProps) {
  const { theme } = useTheme();
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

export type BthDisclosureRowProps = {
  title: string;
  subtitle?: string;
  expanded?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BthDisclosureRow({ title, subtitle, expanded = false, onPress, children, style }: BthDisclosureRowProps) {
  return (
    <BthSurface
      tone={expanded ? 'raised' : 'default'}
      padding={2}
      gap={expanded ? 2 : 1}
      style={style}
    >
      <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={onPress}>
        <BthBox layoutDirection="row" justify="space-between" align="center" gap={2}>
          <BthBox gap={1} style={{ flex: 1 }}>
            <BthText role="bodyStrong" numberOfLines={1}>{title}</BthText>
            {subtitle ? <BthText role="bodySm" tone="muted" numberOfLines={1}>{subtitle}</BthText> : null}
          </BthBox>
          <BthText role="bodyStrong" tone={expanded ? 'brand' : 'soft'}>{expanded ? '▾' : '▸'}</BthText>
        </BthBox>
      </Pressable>
      {expanded ? <BthBox gap={1}>{children}</BthBox> : null}
    </BthSurface>
  );
}

export type BthKeyValueItem = {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  helperText?: string;
};

export type BthKeyValueListProps = {
  items: readonly BthKeyValueItem[];
  dense?: boolean;
  dividers?: boolean;
};

export function BthKeyValueList({ items, dense = false, dividers = true }: BthKeyValueListProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <View style={{ width: '100%', gap: dense ? spacing[2] : spacing[3] }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={`${item.label}-${index}`} style={{ gap: spacing[2] }}>
            <View
              style={{
                width: '100%',
                flexDirection: resolveRowDirection(direction),
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: spacing[3]
              }}
            >
              <BthText role={dense ? 'caption' : 'label'} tone="muted">{item.label}</BthText>
              <View style={{ flex: 1, gap: spacing[1], alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end' }}>
                {typeof item.value === 'string' || typeof item.value === 'number' ? (
                  <BthText role={dense ? 'bodySm' : 'bodyStrong'} tone={item.tone ?? 'default'}>{String(item.value)}</BthText>
                ) : item.value}
                {item.helperText ? <BthText role="caption" tone="soft">{item.helperText}</BthText> : null}
              </View>
            </View>
            {dividers && !isLast ? <BthDivider color={theme.line} /> : null}
          </View>
        );
      })}
    </View>
  );
}

export type BthListItemProps = PressableProps & {
  title: string;
  subtitle?: string;
  meta?: string;
  badgeLabel?: string;
};

export function BthListItem({ title, subtitle, meta, badgeLabel, style, ...rest }: BthListItemProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        {
          width: '100%',
          borderWidth: 1,
          borderColor: theme.line,
          borderRadius: 18,
          backgroundColor: pressed ? theme.surfaceInset : theme.surfaceRaised,
          padding: spacing[4],
          gap: spacing[2]
        },
        resolvePressableStyle(style as PressableStyle, { pressed: false } as PressableStateCallbackType)
      ]}
      {...rest}
    >
      <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="bodyStrong">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>
        {badgeLabel ? <BthBadge label={badgeLabel} tone="brand" /> : null}
      </View>
      {meta ? <BthText role="caption" tone="soft">{meta}</BthText> : null}
    </Pressable>
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
      <BthBox layoutDirection="row" justify="space-between" align="center" gap={2}>
        <BthBox gap={1} style={{ flex: 1 }}>
          <BthText role="bodyStrong" numberOfLines={1}>{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted" numberOfLines={2}>{subtitle}</BthText> : null}
        </BthBox>
        {actionLabel ? <BthButton label={actionLabel} size="sm" tone="secondary" fullWidth={false} onPress={onAction} /> : null}
      </BthBox>
    </BthSurface>
  );
}

export type BthDataTableColumn<Row extends Record<string, unknown>> = {
  id: string;
  header: string;
  renderCell: (row: Row) => React.ReactNode;
  align?: 'start' | 'center' | 'end';
  grow?: number;
};

export type BthDataTableProps<Row extends Record<string, unknown>> = {
  columns: readonly BthDataTableColumn<Row>[];
  rows: readonly Row[];
  rowKey: keyof Row | ((row: Row, index: number) => string);
  caption?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  dense?: boolean;
  language?: string;
};

function resolveCellAlignment(direction: 'rtl' | 'ltr', align: 'start' | 'center' | 'end') {
  if (align === 'center') return 'center';
  if (align === 'end') return direction === 'rtl' ? 'flex-start' : 'flex-end';
  return direction === 'rtl' ? 'flex-end' : 'flex-start';
}

export function BthDataTable<Row extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  caption,
  emptyTitle,
  emptyDescription,
  dense = false,
  language
}: BthDataTableProps<Row>) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowGap = dense ? spacing[2] : spacing[3];

  if (rows.length === 0) {
    return <BthEmptyState title={emptyTitle} description={emptyDescription} language={language} />;
  }

  const resolveRowId = (row: Row, index: number) => (typeof rowKey === 'function' ? rowKey(row, index) : String(row[rowKey]));

  return (
    <BthSurface tone="raised" padding={0} gap={0} radiusToken="xl" style={{ overflow: 'hidden' }}>
      {caption ? (
        <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[2] }}>
          <BthText role="caption" tone="muted">{caption}</BthText>
        </View>
      ) : null}

      <View style={{ flexDirection: resolveRowDirection(direction), paddingHorizontal: spacing[4], paddingBottom: spacing[2], gap: spacing[3] }}>
        {columns.map((column) => (
          <View key={column.id} style={{ flex: column.grow ?? 1, alignItems: resolveCellAlignment(direction, column.align ?? 'start') }}>
            <BthText role="label" tone="muted">{column.header}</BthText>
          </View>
        ))}
      </View>

      <View style={{ gap: 1, backgroundColor: theme.line }}>
        {rows.map((row, index) => (
          <View key={resolveRowId(row, index)} style={{ flexDirection: resolveRowDirection(direction), gap: rowGap, paddingHorizontal: spacing[4], paddingVertical: dense ? spacing[2] : spacing[3], backgroundColor: theme.surface }}>
            {columns.map((column) => (
              <View key={column.id} style={{ flex: column.grow ?? 1, alignItems: resolveCellAlignment(direction, column.align ?? 'start') }}>
                {column.renderCell(row)}
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={{ height: 1, backgroundColor: theme.line, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl }} />
    </BthSurface>
  );
}

export type ProductCardPrice = {
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

export type BthServiceTileCardProps = PressableProps & {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  badgeLabel?: string;
  badgeTone?: BthBadgeProps['tone'];
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
        resolvePressableStyle(style as PressableStyle, { pressed: false } as PressableStateCallbackType)
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

export type CartLine = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  qty: number;
};

export type CartDetailsProps = {
  visible: boolean;
  onClose: () => void;
  items: CartLine[];
  currency?: string;
  onChangeQty?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
  onCheckout?: () => void;
};

export function CartDetails({ visible, onClose, items, currency = 'SAR', onChangeQty, onRemove, onCheckout }: CartDetailsProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <BthSheetFrame visible={visible} onClose={onClose} title={`Cart — ${formatCurrencyAmount(total, currency)}`}>
      <View style={{ gap: spacing[3] }}>
        <ScrollView>
          <View style={{ gap: spacing[2] }}>
            {items.map((item) => (
              <BthListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                meta={`${item.qty} × ${formatCurrencyAmount(item.price, currency)} = ${formatCurrencyAmount(item.qty * item.price, currency)}`}
              />
            ))}
          </View>
        </ScrollView>

        <BthSurface tone="inset" gap={2}>
          <BthText role="bodyMd">Order total</BthText>
          <BthText role="titleSm">{formatCurrencyAmount(total, currency)}</BthText>
          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            <BthButton label="Proceed to checkout" onPress={() => onCheckout && onCheckout()} />
            <BthButton label="Close" tone="secondary" onPress={onClose} />
          </View>
        </BthSurface>
      </View>
    </BthSheetFrame>
  );
}

export type CartSummaryProps = {
  totalAmount: number;
  currency?: string;
  itemsCount?: number;
  storeName?: string;
  deliveryStatus?: string;
  onOpenCart?: () => void;
  onBack?: () => void;
  formatAmount?: (n: number) => string;
  showActions?: boolean;
  store?: {
    id?: string;
    name?: string;
    subtitle?: string;
    ratingLabel?: string;
    statusLabel?: string;
  };
  order?: {
    id?: string;
    title?: string;
    subtitle?: string;
    meta?: string;
    statusLabel?: string;
  };
};

export function CartSummary({
  totalAmount,
  currency = 'SAR',
  itemsCount,
  storeName,
  deliveryStatus,
  onOpenCart,
  onBack,
  formatAmount,
  showActions = true,
  store,
  order,
}: CartSummaryProps) {
  const format = formatAmount ?? ((n: number) => formatCurrencyAmount(n, currency));
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ gap: spacing[3] }}>
      <BthCard title="Cart overview" subtitle="A compact view of everything in your cart.">
        <View style={{ gap: spacing[2], marginTop: spacing[2] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <BthText role="bodyStrong">Total</BthText>
            <BthText role="titleSm">{format(totalAmount)}</BthText>
          </View>

          {store || storeName ? (
            <BthText role="bodySm" tone="muted">{store?.name ?? storeName}</BthText>
          ) : null}

          {deliveryStatus || store?.statusLabel ? (
            <BthText role="caption" tone="soft">{deliveryStatus ?? store?.statusLabel}</BthText>
          ) : null}

          {order ? (
            <BthText role="bodySm" tone="muted">{order.title ?? order.subtitle ?? order.meta}</BthText>
          ) : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing[2] }}>
            <BthText role="caption" tone="soft">{itemsCount ? `${itemsCount} items` : 'Cart items'}</BthText>
            {showActions ? <BthButton label="Open cart" size="sm" fullWidth={false} onPress={onOpenCart} /> : null}
          </View>
        </View>
      </BthCard>

      <BthCard title="Cart context confirmed" subtitle="One clear total keeps the next action obvious.">
        <View style={{ gap: spacing[3], marginTop: spacing[2] }}>
          <BthText role="bodyMd" align="center">Initialize the cart session before moving into the checkout route.</BthText>

          {showActions ? (
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              {onBack ? <BthButton label="Back" tone="secondary" size="sm" fullWidth={false} onPress={onBack} /> : null}
              {onOpenCart ? <BthButton label={expanded ? 'Collapse' : 'Expand'} size="sm" fullWidth={false} onPress={() => setExpanded((current) => !current)} /> : null}
            </View>
          ) : null}
        </View>
      </BthCard>
    </View>
  );
}

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
  testID
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
            ...resolveLogicalPadding(direction, spacing[4], spacing[4])
          },
          style
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
                backgroundColor: option.value === value ? theme.brandSurface : theme.surface
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

export const AmountInput: React.FC<AmountInputProps> = ({ value, onChange, label, placeholder = '0.00', currencyLabel }) => {
  return (
    <View style={{ gap: spacing[2] }}>
      {label ? <BthText role="label">{label}</BthText> : null}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BthTextField value={value} onChangeText={(t) => onChange(t.replace(/[^0-9.]/g, ''))} placeholder={placeholder} style={{ flex: 1, minWidth: 120 }} />
      </View>
      {currencyLabel ? <BthText role="caption" tone="muted">{currencyLabel}</BthText> : null}
    </View>
  );
};

export type PaymentMethod = { id: string; label: string; icon?: string };

export type PaymentMethodListProps = {
  methods: PaymentMethod[];
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ methods, selectedId, onSelect }) => {
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
                gap: spacing[3]
              }
            ]}
          >
            {hasRemoteIcon ? <Image source={{ uri: method.icon }} style={{ width: 44, height: 44, borderRadius: radius.sm }} /> : <View style={{ width: 44, height: 44, borderRadius: radius.sm, backgroundColor: theme.surfaceInset }} />}
            <BthText role="bodyStrong">{method.label}</BthText>
          </Pressable>
        );
      })}
    </View>
  );
};

export type QuickAmountGridProps = {
  amounts: number[];
  onSelect: (n: number) => void;
  selected?: number;
};

export const QuickAmountGrid: React.FC<QuickAmountGridProps> = ({ amounts, onSelect, selected }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3], paddingHorizontal: spacing[4], marginTop: spacing[3] }}>
      {amounts.map((amount) => (
        <Pressable key={amount} onPress={() => onSelect(amount)} style={({ pressed }) => [{ width: '30%', padding: spacing[3], borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: selected === amount ? colorPalette.brand : '#E6E6E6', backgroundColor: selected === amount ? colorPalette.brandSoft : 'transparent', opacity: pressed ? 0.85 : 1 }]}>
          <BthText role="bodyStrong">{String(amount)}</BthText>
        </Pressable>
      ))}
    </View>
  );
};

export type SummaryItem = { label: string; value: React.ReactNode; helper?: string };

export type SummaryCardProps = {
  items: SummaryItem[];
  totalLabel?: string;
  totalValue?: React.ReactNode;
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ items, totalLabel = 'Total', totalValue }) => {
  return (
    <BthCard>
      <BthKeyValueList items={items.map((item) => ({ label: item.label, value: item.value, helperText: item.helper }))} />
      {totalValue ? <View style={{ marginTop: 12 }} /> : null}
      {totalValue ? <BthKeyValueList items={[{ label: totalLabel, value: totalValue }]} dense /> : null}
    </BthCard>
  );
};

export type BthStateViewProps = {
  kind?: BthStateKind;
  stateId?: BthStateId;
  language?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthStateView({ kind, stateId, language, title, description, actionLabel, onActionPress }: BthStateViewProps) {
  const { language: contextLanguage } = useDirection();
  const { theme } = useTheme();
  const stateDefinition = stateId ? getBthStateDefinition(stateId, language ?? contextLanguage) : undefined;
  const resolvedKind = kind ?? stateDefinition?.kind ?? 'empty';
  const resolvedTitle = title ?? stateDefinition?.title ?? (resolvedKind === 'loading' ? 'جار التحميل' : 'No state title');
  const resolvedDescription = description ?? stateDefinition?.description;
  const resolvedActionLabel = actionLabel ?? stateDefinition?.actionLabel;
  const tone = stateDefinition?.tone ?? (resolvedKind === 'error' ? 'danger' : resolvedKind === 'success' ? 'success' : resolvedKind === 'warning' ? 'warning' : resolvedKind === 'loading' ? 'info' : 'neutral');
  const appearance = {
    neutral: { surfaceTone: 'inset' as const, accentColor: theme.lineStrong, textTone: 'muted' as const, buttonTone: 'secondary' as const },
    info: { surfaceTone: 'info' as const, accentColor: theme.info, textTone: 'info' as const, buttonTone: 'secondary' as const },
    success: { surfaceTone: 'success' as const, accentColor: theme.success, textTone: 'success' as const, buttonTone: 'success' as const },
    warning: { surfaceTone: 'warning' as const, accentColor: theme.warning, textTone: 'warning' as const, buttonTone: 'secondary' as const },
    danger: { surfaceTone: 'danger' as const, accentColor: theme.danger, textTone: 'danger' as const, buttonTone: 'danger' as const }
  }[tone];

  return (
    <BthSurface tone={appearance.surfaceTone} padding={6} gap={4} style={{ alignItems: 'center' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', gap: spacing[3], width: '100%' }}>
        <View style={{ width: 56, height: 5, borderRadius: 999, backgroundColor: appearance.accentColor }} />
        {resolvedKind === 'loading' ? <ActivityIndicator color={appearance.accentColor} size="large" /> : null}
        <View style={{ alignItems: 'center', gap: spacing[2], width: '100%' }}>
          <BthText role="titleMd" align="center">{resolvedTitle}</BthText>
          {resolvedDescription ? <BthText role="bodyMd" tone={appearance.textTone} align="center">{resolvedDescription}</BthText> : null}
        </View>
        {resolvedActionLabel && onActionPress ? <BthButton label={resolvedActionLabel} tone={appearance.buttonTone} onPress={onActionPress} /> : null}
      </View>
    </BthSurface>
  );
}

export function BthEmptyState(props: Omit<BthStateViewProps, 'kind' | 'stateId'>) {
  return <BthStateView stateId="empty" {...props} />;
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
  const { theme } = useTheme();
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
      style={({ pressed }) => [{
        width: '100%',
        padding: spacing[3],
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: selected ? toneScheme.accent : theme.line,
        backgroundColor: selected ? toneScheme.surface : theme.surfaceRaised,
        opacity: disabled ? 0.48 : pressed ? 0.9 : 1,
        gap: spacing[2]
      }]}
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
          opacity: disabled ? 0.56 : pressed ? 0.9 : 1
        },
        style
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

export type BthChipProps = {
  label: string;
  selected?: boolean;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  onPress?: () => void;
};

export function BthChip({ label, selected = false, tone = 'default', onPress }: BthChipProps) {
  const { theme } = useTheme();
  const toneScheme = {
    default: { accent: theme.lineStrong, surface: theme.surface, label: theme.text, selectedSurface: theme.surfaceInset, selectedLabel: theme.text },
    brand: { accent: theme.brand, surface: theme.surface, label: theme.brand, selectedSurface: theme.brand, selectedLabel: theme.brandContrast },
    success: { accent: theme.success, surface: theme.surface, label: theme.success, selectedSurface: theme.successSurface, selectedLabel: theme.success },
    warning: { accent: theme.warning, surface: theme.surface, label: theme.warning, selectedSurface: theme.warningSurface, selectedLabel: theme.warning },
    danger: { accent: theme.danger, surface: theme.surface, label: theme.danger, selectedSurface: theme.dangerSurface, selectedLabel: theme.danger },
    info: { accent: theme.info, surface: theme.surface, label: theme.info, selectedSurface: theme.infoSurface, selectedLabel: theme.info }
  }[tone];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ alignSelf: 'flex-start', paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: radius.pill, borderWidth: 1, borderColor: selected ? toneScheme.accent : theme.line, backgroundColor: selected ? toneScheme.selectedSurface : toneScheme.surface, opacity: pressed ? 0.9 : 1 }]}>
      <BthText role="label" style={{ color: selected ? toneScheme.selectedLabel : toneScheme.label }}>{label}</BthText>
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
          opacity: disabled ? 0.56 : pressed ? 0.9 : 1
        },
        style
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

export type BthNewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
};

export function BthNewsTickerBar({ statusLabel, message, onPress }: BthNewsTickerBarProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ paddingVertical: spacing[2], paddingHorizontal: spacing[4], backgroundColor: colorPalette.surfaceInset, opacity: pressed ? 0.9 : 1 }]}>
      <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
        <BthBadge label={statusLabel} tone="info" />
        <BthText role="bodySm">{message}</BthText>
      </View>
    </Pressable>
  );
}

export type BthScreenHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthScreenHeader({ title, subtitle, actionLabel, onActionPress }: BthScreenHeaderProps) {
  return (
    <BthSurface tone="raised" padding={4} gap={2}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="titleSm">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>
        {actionLabel ? <BthButton label={actionLabel} size="sm" fullWidth={false} onPress={onActionPress} /> : null}
      </View>
    </BthSurface>
  );
}

export type BthSectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  count?: number | string;
  countTone?: BthBadgeProps['tone'];
  headingOrder?: 'title-first' | 'count-first';
};

export function BthSectionHeader({ title, subtitle, trailing, count, countTone = 'default', headingOrder = 'title-first' }: BthSectionHeaderProps) {
  return (
    <View style={{ gap: spacing[2] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {headingOrder === 'count-first' && count != null ? <BthBadge label={String(count)} tone={countTone} /> : null}
          <View style={{ flex: 1, gap: spacing[1] }}>
            <BthText role="titleSm">{title}</BthText>
            {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
          </View>
          {headingOrder === 'title-first' && count != null ? <BthBadge label={String(count)} tone={countTone} /> : null}
        </View>
        {trailing}
      </View>
    </View>
  );
}

export type BthTabItem<Value extends string = string> = {
  value: Value;
  label: string;
  badgeLabel?: string;
  disabled?: boolean;
};

export type BthTabsProps<Value extends string = string> = {
  items: readonly BthTabItem<Value>[];
  value: Value;
  onValueChange?: (nextValue: Value) => void;
  stretch?: boolean;
  variant?: 'line' | 'pill';
  scrollable?: boolean;
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function BthTabs<Value extends string = string>({ items, value, onValueChange, stretch = false, variant = 'line', scrollable = false, wrap = false, style, testID }: BthTabsProps<Value>) {
  const { theme } = useTheme();
  const content = (
    <View style={[{ flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', gap: spacing[2] }, style]} testID={testID}>
      {items.map((item) => {
        const selected = item.value === value;
        const tab = (
          <Pressable key={String(item.value)} accessibilityRole="tab" accessibilityState={{ selected, disabled: item.disabled }} disabled={item.disabled} onPress={() => onValueChange?.(item.value)} style={({ pressed }) => [{ flex: stretch ? 1 : undefined, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: variant === 'pill' ? radius.pill : radius.md, borderWidth: 1, borderColor: selected ? theme.brand : theme.line, backgroundColor: selected ? theme.brand : theme.surface, opacity: item.disabled ? 0.56 : pressed ? 0.9 : 1, alignItems: 'center', gap: spacing[1] }]}>
            <BthText role="label" tone={selected ? 'inverse' : 'default'}>{item.label}</BthText>
            {item.badgeLabel ? <BthBadge label={item.badgeLabel} /> : null}
          </Pressable>
        );
        return tab;
      })}
    </View>
  );

  return scrollable ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>{content}</ScrollView> : content;
}

export type BthTopBarAction = {
  id: string;
  icon: React.ReactNode;
  badgeCount?: number;
  mirrorInRtl?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export type BthTopBarProps = {
  title: string;
  subtitle?: string;
  actions?: BthTopBarAction[];
  trailingAction?: BthTopBarAction;
  ticker?: BthNewsTickerBarProps;
  tabs?: BthTabsProps<string>;
  style?: StyleProp<ViewStyle>;
};

export function BthTopBar({ title, subtitle, actions = [], trailingAction, ticker, tabs, style }: BthTopBarProps) {
  return (
    <BthSurface tone="raised" padding={4} gap={3} style={style}>
      {ticker ? <BthNewsTickerBar {...ticker} /> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="titleSm">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {actions.map((action) => (
            <Pressable key={action.id} accessibilityLabel={action.accessibilityLabel} onPress={action.onPress} style={{ padding: spacing[2] }}>
              {action.icon}
              {action.badgeCount ? <BthBadge label={String(action.badgeCount)} tone="danger" /> : null}
            </Pressable>
          ))}
          {trailingAction ? (
            <Pressable accessibilityLabel={trailingAction.accessibilityLabel} onPress={trailingAction.onPress} style={{ padding: spacing[2] }}>
              {trailingAction.icon}
              {trailingAction.badgeCount ? <BthBadge label={String(trailingAction.badgeCount)} tone="danger" /> : null}
            </Pressable>
          ) : null}
        </View>
      </View>
      {tabs ? <BthTabs {...tabs} /> : null}
    </BthSurface>
  );
}

export type BthDialogAction = {
  label: string;
  onPress: () => void;
  tone?: BthButtonTone;
};

export type BthDialogTone = 'default' | 'danger' | 'warning' | 'success' | 'info';

export type BthDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  tone?: BthDialogTone;
  onClose: () => void;
  dismissible?: boolean;
  primaryAction?: BthDialogAction;
  secondaryAction?: BthDialogAction;
  children?: React.ReactNode;
};

export function BthDialog({ visible, title, description, tone = 'default', onClose, dismissible = true, primaryAction, secondaryAction, children }: BthDialogProps) {
  const { theme } = useTheme();
  const accentColor = { default: theme.brand, danger: theme.danger, warning: theme.warning, success: theme.success, info: theme.info }[tone];

  const overlayContent = (
    <Pressable onPress={dismissible ? onClose : undefined} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4], backgroundColor: theme.overlay }}>
      <Pressable style={{ width: '100%', maxWidth: 520 }}>
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="xl" style={{ overflow: 'hidden' }}>
          <View style={{ height: 5, backgroundColor: accentColor }} />
          <BthBox padding={5} gap={4} style={{ borderRadius: radius.xl }}>
            <BthBox gap={2}>
              <BthText role="titleMd">{title}</BthText>
              {description ? <BthText role="bodyMd" tone="muted">{description}</BthText> : null}
            </BthBox>
            {children ? <BthBox gap={3}>{children}</BthBox> : null}
            {primaryAction || secondaryAction ? (
              <View style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'flex-end' }}>
                {secondaryAction ? <BthButton label={secondaryAction.label} tone={secondaryAction.tone ?? 'secondary'} onPress={secondaryAction.onPress} /> : null}
                {primaryAction ? <BthButton label={primaryAction.label} tone={primaryAction.tone ?? 'primary'} onPress={primaryAction.onPress} /> : null}
              </View>
            ) : null}
          </BthBox>
        </BthSurface>
      </Pressable>
    </Pressable>
  );

  return overlayContent;

}

export type BthSheetFrameProps = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export function BthSheetFrame({ visible, title, onClose, children }: BthSheetFrameProps) {
  const { theme } = useTheme();

  const sheetContent = (
    <Pressable onPress={onClose} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: theme.overlay }}>
      <Pressable>
        <BthBox background="surface" padding={4} gap={3} radiusToken="xl" style={{ borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          {title ? <BthText role="titleSm">{title}</BthText> : null}
          <BthBox gap={3}>{children}</BthBox>
        </BthBox>
      </Pressable>
    </Pressable>
  );

  return (
    <BthPortalLayer
      active={visible}
      fallback={
        <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
          {sheetContent}
        </RNModal>
      }
    >
      {sheetContent}
    </BthPortalLayer>
  );
}

export type BthToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type BthToastProps = {
  visible: boolean;
  title: string;
  description?: string;
  tone?: BthToastTone;
  placement?: 'top' | 'bottom';
  durationMs?: number;
  onDismiss?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthToast({ visible, title, description, tone = 'neutral', placement = 'bottom', durationMs = 3200, onDismiss, actionLabel, onActionPress }: BthToastProps) {
  const { theme } = useTheme();

  useEffect(() => {
    if (!visible || !onDismiss || durationMs <= 0) return undefined;
    const timeoutId = setTimeout(() => onDismiss(), durationMs);
    return () => clearTimeout(timeoutId);
  }, [durationMs, onDismiss, visible]);

  if (!visible) return null;

  const toneConfig = {
    neutral: { surfaceTone: 'raised' as const, textTone: 'default' as const, actionTone: 'secondary' as const, accentColor: theme.lineStrong },
    info: { surfaceTone: 'info' as const, textTone: 'info' as const, actionTone: 'secondary' as const, accentColor: theme.info },
    success: { surfaceTone: 'success' as const, textTone: 'success' as const, actionTone: 'success' as const, accentColor: theme.success },
    warning: { surfaceTone: 'warning' as const, textTone: 'warning' as const, actionTone: 'secondary' as const, accentColor: theme.warning },
    danger: { surfaceTone: 'danger' as const, textTone: 'danger' as const, actionTone: 'danger' as const, accentColor: theme.danger }
  }[tone];

  const toastContent = (
    <View pointerEvents="box-none" style={{ flex: 1, justifyContent: placement === 'top' ? 'flex-start' : 'flex-end', padding: spacing[4] }}>
      <BthSurface tone={toneConfig.surfaceTone} padding={4} gap={3} elevationToken="floating" style={{ borderColor: toneConfig.accentColor }}>
        <BthBox gap={1}>
          <BthText role="bodyStrong" tone={toneConfig.textTone}>{title}</BthText>
          {description ? <BthText role="bodySm" tone={toneConfig.textTone}>{description}</BthText> : null}
        </BthBox>
        {actionLabel ? <BthButton label={actionLabel} tone={toneConfig.actionTone} size="sm" fullWidth={false} onPress={onActionPress} /> : null}
      </BthSurface>
    </View>
  );

  return (
    <BthPortalLayer
      active={visible}
      fallback={
        <RNModal transparent visible animationType="fade" onRequestClose={onDismiss}>
          {toastContent}
        </RNModal>
      }
    >
      {toastContent}
    </BthPortalLayer>
  );
}

export type LegacyBthAttachmentPickerProps = {
  title: string;
  subtitle?: string;
  items: BthAttachmentPickerItem[];
  locked?: boolean;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function LegacyBthAttachmentPicker({ title, subtitle, items, locked = false, onClear, style }: LegacyBthAttachmentPickerProps) {
  const selectedItems = items.filter((item) => item.selected);

  return (
    <BthCard style={style}>
      <View style={{ gap: spacing[3] }}>
        <View style={{ gap: spacing[1] }}>
          <BthText role="titleSm">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>

        <View style={{ gap: spacing[2] }}>
          <BthText role="caption" tone="soft">{selectedItems.length ? `${selectedItems.length} selected` : 'Nothing selected yet'}</BthText>
          {selectedItems.map((item) => <LegacyAttachmentPickerRow key={item.key} item={item} locked={locked} />)}
        </View>

        {onClear ? <BthButton label="Clear" tone="secondary" size="sm" fullWidth={false} onPress={onClear} /> : null}
      </View>
    </BthCard>
  );
}

function LegacyAttachmentPickerRow({ item, locked }: { item: BthAttachmentPickerItem; locked: boolean }) {
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
    <Pressable onPress={item.onPress} disabled={disabled} style={({ pressed }) => [{ width: '100%', padding: spacing[3], borderRadius: radius.lg, borderWidth: 1, borderColor: selected ? toneScheme.accent : theme.line, backgroundColor: selected ? toneScheme.surface : theme.surfaceRaised, opacity: disabled ? 0.48 : pressed ? 0.9 : 1, gap: spacing[2] }]}>
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

export type LegacyBthTopBarAction = {
  id: string;
  icon: React.ReactNode;
  badgeCount?: number;
  mirrorInRtl?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export type LegacyBthTopBarProps = {
  title: string;
  subtitle?: string;
  actions?: LegacyBthTopBarAction[];
  trailingAction?: LegacyBthTopBarAction;
  ticker?: BthNewsTickerBarProps;
  tabs?: BthTabsProps<string>;
  style?: StyleProp<ViewStyle>;
};

export function LegacyBthTopBar({ title, subtitle, actions = [], trailingAction, ticker, tabs, style }: LegacyBthTopBarProps) {
  return (
    <BthSurface tone="raised" padding={4} gap={3} style={style}>
      {ticker ? <BthNewsTickerBar {...ticker} /> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="titleSm">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
          {actions.map((action) => (
            <Pressable key={action.id} accessibilityLabel={action.accessibilityLabel} onPress={action.onPress} style={{ padding: spacing[2] }}>
              {action.icon}
              {action.badgeCount ? <BthBadge label={String(action.badgeCount)} tone="danger" /> : null}
            </Pressable>
          ))}
          {trailingAction ? (
            <Pressable accessibilityLabel={trailingAction.accessibilityLabel} onPress={trailingAction.onPress} style={{ padding: spacing[2] }}>
              {trailingAction.icon}
              {trailingAction.badgeCount ? <BthBadge label={String(trailingAction.badgeCount)} tone="danger" /> : null}
            </Pressable>
          ) : null}
        </View>
      </View>
      {tabs ? <BthTabs {...tabs} /> : null}
    </BthSurface>
  );
}



