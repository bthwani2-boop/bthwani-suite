import React from 'react';
import { ActivityIndicator, PanResponder, Pressable, ScrollView, View, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { borders, radius, resolveRowDirection, sizes, spacing } from '../foundation';
import { useBThwaniAppearance, useDirection } from '../providers';
import { Text } from '../primitives';

type PressableStyle = StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);

function resolvePressableStyle(style: PressableStyle | undefined, state: PressableStateCallbackType) {
  return typeof style === 'function' ? style(state) : style;
}

export type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'brand' | 'warning' | 'info' | 'default' | 'glass' | 'glassStrong';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label?: string;
  children?: React.ReactNode;
  variant?: ButtonTone;
  onClick?: PressableProps['onPress'];
  tone?: ButtonTone;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leadingAccessory?: React.ReactNode;
  trailingAccessory?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
};

export function Button({
  label,
  children,
  tone,
  variant,
  onClick,
  size = 'md',
  loading = false,
  disabled,
  fullWidth = true,
  leadingAccessory,
  trailingAccessory,
  icon,
  iconPosition = 'leading',
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const { direction } = useDirection();
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const resolvedDisabled = disabled || loading;
  const resolvedLeadingAccessory = leadingAccessory ?? (icon && iconPosition === 'leading' ? icon : null);
  const resolvedTrailingAccessory = trailingAccessory ?? (icon && iconPosition === 'trailing' ? icon : null);
  const toneConfig = {
    primary: appearanceTokens.components.buttons.primary,
    brand: appearanceTokens.components.buttons.brand,
    secondary: appearanceTokens.components.buttons.secondary,
    ghost: appearanceTokens.components.buttons.ghost,
    danger: appearanceTokens.components.buttons.danger,
    success: appearanceTokens.components.buttons.success,
    warning: appearanceTokens.components.buttons.warning,
    info: appearanceTokens.components.buttons.info,
    default: appearanceTokens.components.buttons.default,
    glass: appearanceTokens.components.buttons.glass,
    glassStrong: appearanceTokens.components.buttons.glassStrong,
  }[tone ?? variant ?? 'primary'];

  const sizeConfig = {
    sm: { minHeight: sizes.controlSm, paddingHorizontal: spacing[3], textRole: 'label' as const },
    md: { minHeight: sizes.controlMd, paddingHorizontal: spacing[4], textRole: 'bodyStrong' as const },
    lg: { minHeight: sizes.controlLg, paddingHorizontal: spacing[5], textRole: 'bodyStrong' as const },
  }[size];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={resolvedDisabled}
      onPress={onPress ?? onClick}
      style={({ pressed }) => {
        const palette = resolvedDisabled ? toneConfig.disabled : pressed ? toneConfig.pressed : toneConfig.default;

        return [
          {
            width: fullWidth ? '100%' : undefined,
            minHeight: sizeConfig.minHeight,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            borderRadius: size === 'lg' ? radius.xl : radius.lg,
            borderWidth: tone === 'ghost' ? 0 : borders.hairline,
            borderColor: palette.borderColor,
            backgroundColor: palette.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: resolveRowDirection(direction),
            gap: spacing[2],
          },
          palette.shadow,
          resolvePressableStyle(style, { pressed } as PressableStateCallbackType),
        ];
      }}
      {...rest}
    >
      {loading ? <ActivityIndicator color={(resolvedDisabled ? toneConfig.disabled : toneConfig.default).iconColor} /> : null}
      {resolvedLeadingAccessory}
      {label ? (
        <Text
          role={sizeConfig.textRole}
          style={{
            color: (resolvedDisabled ? toneConfig.disabled : toneConfig.default).textColor,
          }}
        >
          {label}
        </Text>
      ) : typeof children === 'string' || typeof children === 'number' ? (
        <Text
          role={sizeConfig.textRole}
          style={{
            color: (resolvedDisabled ? toneConfig.disabled : toneConfig.default).textColor,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {resolvedTrailingAccessory}
    </Pressable>
  );
}

export type BadgeProps = {
  label: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, tone = 'default', style }: BadgeProps) {
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const palette = {
    default: appearanceTokens.components.badges.neutral,
    brand: appearanceTokens.components.badges.brand,
    success: appearanceTokens.components.badges.success,
    warning: appearanceTokens.components.badges.warning,
    danger: appearanceTokens.components.badges.danger,
    info: appearanceTokens.components.badges.info,
  }[tone];

  return (
    <Pressable
      accessibilityRole="text"
      style={[
        {
          alignSelf: 'flex-start',
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: palette.borderColor,
          backgroundColor: palette.backgroundColor,
        },
        style,
      ]}
      disabled
    >
      <Text role="label" style={{ color: palette.textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}

export type ChipProps = {
  label: string;
  selected?: boolean;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'glass' | 'glassStrong';
  onPress?: () => void;
};

export function Chip({ label, selected = false, tone = 'default', onPress }: ChipProps) {
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const basePalette = {
    default: appearanceTokens.components.chips.default,
    brand: appearanceTokens.components.badges.brand,
    success: appearanceTokens.components.badges.success,
    warning: appearanceTokens.components.badges.warning,
    danger: appearanceTokens.components.badges.danger,
    info: appearanceTokens.components.badges.info,
    glass: appearanceTokens.components.chips.glass,
    glassStrong: appearanceTokens.components.chips.glassSelected,
  }[tone];
  const selectedPalette = tone === 'glass' || tone === 'glassStrong'
    ? appearanceTokens.components.chips.glassSelected
    : appearanceTokens.components.chips.selected;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => {
        const palette = selected ? selectedPalette : basePalette;
        const pressedPalette = selected
          ? selectedPalette
          : tone === 'glass' || tone === 'glassStrong'
            ? appearanceTokens.components.chips.glassSelected
            : appearanceTokens.components.chips.selected;

        return [
          {
            alignSelf: 'flex-start',
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: (pressed ? pressedPalette : palette).borderColor,
            backgroundColor: (pressed ? pressedPalette : palette).backgroundColor,
          },
        ];
      }}
    >
      <Text role="label" style={{ color: (selected ? selectedPalette : basePalette).textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// BThwaniFilterChip — centralised filter/category chip for HomeScreen & StoreScreen
// Pixel spec is frozen: height 34, borderRadius 12, paddingHorizontal 14,
// iconWrap 18×18, gap 6, fontSize 12, fontWeight 700.
// Colors come exclusively from the central appearance token system.
// RTL direction is handled internally via useDirection(); callers do not need
// an isRTL prop.
// ---------------------------------------------------------------------------

export type BThwaniFilterChipProps = {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** 'default' = light/neutral chip. 'glass' = dark-glass overlay chip. */
  variant?: 'default' | 'glass';
  /** Safe pass-through for ScrollView item layout only — no visual overrides. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export const BThwaniFilterChip = React.memo(function BThwaniFilterChip({
  label,
  selected = false,
  icon,
  onPress,
  disabled = false,
  variant = 'default',
  style,
  testID,
}: BThwaniFilterChipProps) {
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const { isRtl } = useDirection();

  const isGlass = variant === 'glass';
  const chipPalette = isGlass
    ? (selected
        ? appearanceTokens.components.chips.glassSelected
        : appearanceTokens.components.chips.glass)
    : (selected
        ? appearanceTokens.components.chips.selected
        : appearanceTokens.components.chips.default);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={[
        {
          height: 34,
          borderRadius: 12,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: chipPalette.borderColor,
          backgroundColor: chipPalette.backgroundColor,
          opacity: disabled ? 0.4 : 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: isRtl ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {icon != null && (
          <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </View>
        )}
        <Text
          style={{ fontSize: 12, fontWeight: '700', color: chipPalette.textColor }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
});

export type BThwaniFilterRailItemState = {
  selected: boolean;
  disabled: boolean;
};

export type BThwaniFilterRailItem = {
  id: string;
  label: string;
  icon?: React.ReactNode | ((state: BThwaniFilterRailItemState) => React.ReactNode);
  disabled?: boolean;
};

export type BThwaniFilterRailProps = {
  items: BThwaniFilterRailItem[];
  selectedId?: string;
  onSelectedIdChange?: (id: string) => void;
  onChange?: (id: string) => void;
  variant?: 'default' | 'glass';
  sticky?: boolean;
  isSelected?: (item: BThwaniFilterRailItem) => boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

export type BThwaniFilterSwipeBoundaryProps = {
  items: BThwaniFilterRailItem[];
  selectedId?: string;
  onSelectedIdChange?: (id: string) => void;
  onChange?: (id: string) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  threshold?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function resolveEnabledSelectionIndex(items: BThwaniFilterRailItem[], selectedId?: string) {
  const selectedIndex = items.findIndex((item) => item.id === selectedId && !item.disabled);
  if (selectedIndex >= 0) {
    return selectedIndex;
  }

  return items.findIndex((item) => !item.disabled);
}

function resolveAdjacentEnabledIndex(items: BThwaniFilterRailItem[], startIndex: number, step: number) {
  for (let nextIndex = startIndex + step; nextIndex >= 0 && nextIndex < items.length; nextIndex += step) {
    if (!items[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return -1;
}

function resolveFilterRailIcon(icon: BThwaniFilterRailItem['icon'], state: BThwaniFilterRailItemState) {
  if (typeof icon === 'function') {
    return icon(state);
  }

  return icon ?? null;
}

export const BThwaniFilterRail = React.memo(function BThwaniFilterRail({
  items,
  selectedId,
  onSelectedIdChange,
  onChange,
  variant = 'default',
  sticky = false,
  isSelected,
  style,
  contentContainerStyle,
  testID,
}: BThwaniFilterRailProps) {
  const { tokens: appearanceTokens } = useBThwaniAppearance();
  const { isRtl } = useDirection();
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const itemLayoutsRef = React.useRef<Record<string, { x: number; width: number }>>({});
  const [containerWidth, setContainerWidth] = React.useState(0);
  const stickyBackgroundColor = variant === 'glass'
    ? appearanceTokens.glassSurfaceStrong
    : appearanceTokens.colors.surfacePrimary;
  const stickyBorderColor = variant === 'glass'
    ? appearanceTokens.colors.glassBorder
    : appearanceTokens.colors.borderSubtle;

  const scrollSelectedChipIntoView = React.useCallback((targetId?: string) => {
    if (!targetId || !containerWidth || !scrollViewRef.current) {
      return;
    }

    const layout = itemLayoutsRef.current[targetId];
    if (!layout) {
      return;
    }

    const centerOffset = containerWidth / 2 - layout.width / 2;
    const targetX = Math.max(0, layout.x - centerOffset);
    scrollViewRef.current.scrollTo({ x: targetX, animated: true });
  }, [containerWidth]);

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      scrollSelectedChipIntoView(selectedId);
    });

    return () => cancelAnimationFrame(handle);
  }, [items, scrollSelectedChipIntoView, selectedId]);

  const handleChange = React.useCallback((id: string) => {
    onSelectedIdChange?.(id);
    onChange?.(id);
  }, [onChange, onSelectedIdChange]);

  return (
    <View
      testID={testID}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      style={[
        sticky
          ? {
              backgroundColor: stickyBackgroundColor,
              borderBottomWidth: borders.hairline,
              borderBottomColor: stickyBorderColor,
            }
          : null,
        style,
      ]}
    >
      <ScrollView
        ref={(instance) => {
          scrollViewRef.current = instance;
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        decelerationRate="fast"
        contentContainerStyle={[
          {
            flexDirection: isRtl ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: spacing[2],
          },
          contentContainerStyle,
        ]}
      >
        {items.map((item) => {
          const selected = isSelected ? isSelected(item) : item.id === selectedId;
          const iconState = { selected, disabled: Boolean(item.disabled) };

          return (
            <View
              key={item.id}
              onLayout={(event) => {
                itemLayoutsRef.current[item.id] = {
                  x: event.nativeEvent.layout.x,
                  width: event.nativeEvent.layout.width,
                };
              }}
            >
              <BThwaniFilterChip
                label={item.label}
                icon={resolveFilterRailIcon(item.icon, iconState)}
                selected={selected}
                disabled={item.disabled}
                variant={variant}
                onPress={() => {
                  if (!item.disabled) {
                    handleChange(item.id);
                  }
                }}
                testID={testID ? `${testID}-${item.id}` : undefined}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

export const BThwaniFilterSwipeBoundary = React.memo(function BThwaniFilterSwipeBoundary({
  items,
  selectedId,
  onSelectedIdChange,
  onChange,
  children,
  disabled = false,
  threshold = 60,
  style,
  testID,
}: BThwaniFilterSwipeBoundaryProps) {
  const { isRtl } = useDirection();

  const handleChange = React.useCallback((id: string) => {
    onSelectedIdChange?.(id);
    onChange?.(id);
  }, [onChange, onSelectedIdChange]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_event, gestureState) => {
          if (disabled || items.length < 2) {
            return false;
          }

          const { dx, dy } = gestureState;
          return Math.abs(dx) > Math.abs(dy) * 1.25 && Math.abs(dx) > 14;
        },
        onPanResponderRelease: (_event, gestureState) => {
          if (disabled || Math.abs(gestureState.dx) < threshold) {
            return;
          }

          const currentIndex = resolveEnabledSelectionIndex(items, selectedId);
          if (currentIndex === -1) {
            return;
          }

          const visualStep = gestureState.dx < 0 ? 1 : -1;
          const logicalStep = isRtl ? -visualStep : visualStep;
          const nextIndex = resolveAdjacentEnabledIndex(items, currentIndex, logicalStep);

          if (nextIndex !== -1) {
            handleChange(items[nextIndex].id);
          }
        },
      }),
    [disabled, handleChange, isRtl, items, selectedId, threshold],
  );

  return (
    <View testID={testID} style={style} {...panResponder.panHandlers}>
      {children}
    </View>
  );
});
