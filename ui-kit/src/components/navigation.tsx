import React from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colorPalette, resolveRowDirection, type Direction, spacing, withAlpha } from '../foundation';
import { useBThwaniAppearance } from '../providers';
import { Surface, Text } from '../primitives';
import { Icon } from './icons';

// Dynamic safe-area insets loader with robust fallbacks
let useSafeAreaInsets: () => { top: number; bottom: number; left: number; right: number } = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const safe = require('react-native-safe-area-context');
  const loader = safe?.useSafeAreaInsets || (safe?.default && safe.default.useSafeAreaInsets);
  if (typeof loader === 'function') {
    useSafeAreaInsets = loader;
  }
} catch (err) {
  // Safe Area Context might not be linked, use zero fallbacks
}

// ----- Modern Premium Header -----

import type { TopBarAction } from './header';

export type ModernPremiumHeaderProps = {
  title?: string;
  locationLabel?: string;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  notificationCount?: number;
  onCartPress?: () => void;
  cartCount?: number;
  onSearchPress?: () => void;
  searchPlaceholder?: string;
  tickerMessage?: string;
  tickerStatus?: string;
  onTickerPress?: () => void;
  onLocationPress?: () => void;
  direction?: Direction;
  actions?: TopBarAction[];
};

function SmartNewsTicker({ message, status, onPress }: { message: string, status?: string, onPress?: () => void }) {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [trackWidth, setTrackWidth] = React.useState(0);
  const loopGap = 72;
  const hasMeasurements = containerWidth > 0 && trackWidth > 0;
  const distance = hasMeasurements ? containerWidth + trackWidth : 0;

  React.useEffect(() => {
    translateX.stopAnimation();

    if (!hasMeasurements) {
      translateX.setValue(0);
      return undefined;
    }

    translateX.setValue(-distance);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: distance,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: false,
        isInteraction: false,
      }),
      { resetBeforeIteration: true },
    );

    animation.start();

    return () => {
      animation.stop();
      translateX.stopAnimation();
      translateX.setValue(-distance);
    };
  }, [distance, hasMeasurements, message, translateX]);

  return (
    <Pressable
      onPress={onPress}
      style={styles.tickerBar}
    >
      <View style={styles.tickerStatusBadge}>
        <Text role="label" style={styles.tickerStatusText}>{status ?? 'مباشر'}</Text>
      </View>
      <View style={styles.tickerScrollContainer} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        <View
          pointerEvents="none"
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          style={styles.tickerMeasurement}
        >
          <View style={styles.tickerTrack}>
            <Text role="bodySm" style={styles.tickerMessage} numberOfLines={1}>
              {message}
            </Text>
            <View style={{ width: loopGap }} />
            <Text role="bodySm" style={styles.tickerMessage} numberOfLines={1}>
              {message}
            </Text>
          </View>
        </View>
        <Animated.View
          style={[
            styles.tickerTrack,
            {
              opacity: hasMeasurements ? 1 : 0,
              transform: [{ translateX }],
            },
          ]}
        >
          <Text
            role="bodySm"
            style={styles.tickerMessage}
            numberOfLines={1}
          >
            {message}
          </Text>
          <View style={{ width: loopGap }} />
          <Text
            role="bodySm"
            style={styles.tickerMessage}
            numberOfLines={1}
          >
            {message}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

export function ModernPremiumHeader({
  title,
  locationLabel,
  onProfilePress,
  onNotificationsPress,
  notificationCount = 0,
  onCartPress,
  cartCount = 0,
  onSearchPress,
  searchPlaceholder,
  tickerMessage,
  tickerStatus,
  onTickerPress,
  onLocationPress,
  direction = 'rtl',
  actions,
}: ModernPremiumHeaderProps) {
  const insets = useSafeAreaInsets();
  const rowDirection = resolveRowDirection(direction);
  const { tokens, mode } = useBThwaniAppearance();
  const isDark = mode === 'darkGlass';
  const navTokens = tokens.components.navigation;
  const headerBg = isDark ? navTokens.headerSurface : colorPalette.brand;

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerBg }]}>
      {/* Row 1: Actions | Location | Profile */}
      <View style={[styles.headerTopRow, { flexDirection: rowDirection }]}>
        <View style={[styles.actionCluster, { flexDirection: rowDirection }]}>
          {actions ? (
            actions.map((action) => (
              <HeaderIconButton
                key={action.id}
                icon={action.icon}
                onPress={action.onPress}
                badge={action.badgeCount}
              />
            ))
          ) : (
            <>
              {onSearchPress && (
                <HeaderIconButton
                  icon="search-outline"
                  onPress={onSearchPress}
                />
              )}
              {onNotificationsPress && (
                <HeaderIconButton
                  icon="notifications-outline"
                  onPress={onNotificationsPress}
                  badge={notificationCount > 0 ? notificationCount : undefined}
                />
              )}
              {onCartPress && (
                <HeaderIconButton
                  icon="cart-outline"
                  onPress={onCartPress}
                  badge={cartCount > 0 ? cartCount : undefined}
                />
              )}
            </>
          )}
        </View>

        <Pressable
          onPress={onLocationPress}
          hitSlop={4}
          style={styles.locationContainer}
        >
          <Text style={styles.brandText}>{title ?? 'بثواني'}</Text>
          {locationLabel ? (
            <View style={[styles.locationBadge, { flexDirection: rowDirection }]}>
              <Icon name="location" size={10} color={colorPalette.white} />
              <Text role="caption" style={[styles.locationText, { fontSize: 11 }]} numberOfLines={1}>{locationLabel}</Text>
            </View>
          ) : null}
        </Pressable>

        {onProfilePress ? (
          <Pressable onPress={onProfilePress} style={styles.profileAvatar}>
            <Icon name="person" size={20} color={colorPalette.brand} />
          </Pressable>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      {/* Row 2: Animated News Ticker */}
      {tickerMessage && (
        <SmartNewsTicker
          message={tickerMessage}
          status={tickerStatus}
          onPress={onTickerPress}
        />
      )}
    </View>
  );
}

function HeaderIconButton({ icon, onPress, badge }: { icon: any; onPress?: () => void; badge?: number }) {
  return (
    <Pressable onPress={onPress} style={styles.headerIconButton}>
      {React.isValidElement(icon) ? icon : <Icon name={icon} size={22} color={colorPalette.white} />}
      {badge !== undefined && badge > 0 && (
        <View style={styles.iconBadge} />
      )}
    </Pressable>
  );
}

// ----- Bottom Navigation Bar -----

export type NavItem = {
  id: string;
  label: string;
  icon: any;
  activeIcon: any;
};

export type BottomNavBarProps = {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onLauncherPress?: () => void;
  direction?: Direction;
  launcherLabel?: string;
  launcherIcon?: React.ComponentProps<typeof Icon>['name'];
  launcherActive?: boolean;
};

export function BottomNavBar({
  items,
  activeId,
  onSelect,
  onLauncherPress,
  direction = 'rtl',
  launcherLabel = 'الخدمات',
  launcherIcon = 'grid',
  launcherActive = false,
}: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 44 : 12);
  const { width } = useWindowDimensions();
  const rowDirection = resolveRowDirection(direction);
  const { tokens, mode } = useBThwaniAppearance();
  const isDark = mode === 'darkGlass';
  const navTokens = tokens.components.navigation;

  // Height strategy: base height 64 + safe area
  const totalHeight = 64 + bottomPadding;

  // Split items to place launcher in middle
  const leftItems = items.slice(0, 2);
  const rightItems = items.slice(2, 4);

  return (
    <View style={[styles.navContainer, { width, height: totalHeight }]}>
      <Surface tone="raised" style={[styles.navSurface, { height: totalHeight, paddingBottom: bottomPadding, backgroundColor: navTokens.navSurface }]}>
        <View style={[styles.navContent, { flexDirection: rowDirection }]}>
          {leftItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onPress={() => onSelect(item.id)}
            />
          ))}

          <View style={styles.launcherPlaceholder}>
            <Pressable onPress={onLauncherPress} style={styles.launcherButtonArea}>
              <Text role="caption" style={[styles.launcherLabel, { color: tokens.accent }]}>{launcherLabel}</Text>
            </Pressable>
          </View>

          {rightItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onPress={() => onSelect(item.id)}
            />
          ))}
        </View>
      </Surface>

      {/* Floating Center Launcher */}
      <Pressable onPress={onLauncherPress} style={[styles.floatingLauncher, isDark ? { backgroundColor: tokens.glassSurfaceStrong } : null, launcherActive ? { borderWidth: 2.5, borderColor: colorPalette.white } : null]}>
        <View style={styles.launcherInner}>
          <Icon name={launcherIcon} size={24} color={colorPalette.white} />
        </View>
      </Pressable>
    </View>
  );
}

function NavButton({ item, isActive, onPress }: { item: NavItem; isActive: boolean; onPress: () => void }) {
  const { tokens } = useBThwaniAppearance();
  const activeColor = tokens.accent;
  const inactiveColor = tokens.components.navigation.navInactiveText;

  return (
    <Pressable onPress={onPress} style={styles.navButton}>
      <Icon
        name={isActive ? item.activeIcon : item.icon}
        size={22}
        color={isActive ? activeColor : inactiveColor}
      />
      <Text
        role="caption"
        style={[styles.navLabel, { color: isActive ? activeColor : inactiveColor }]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

// ----- Styles -----

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colorPalette.brand,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 12, // Compacted further as per user request
    paddingBottom: 2,
    paddingHorizontal: 16,
    gap: 0,
    marginBottom: spacing[1],
    shadowColor: colorPalette.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  headerTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    marginTop: 4, // Compacted further
  },
  brandText: {
    color: colorPalette.white,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.8,
    textShadowColor: withAlpha(colorPalette.black, 0.25),
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
  locationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    zIndex: 1,
  },
  deliveryToText: {
    color: withAlpha(colorPalette.white, 0.7),
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 0,
  },
  locationBadge: {
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: colorPalette.white,
    fontWeight: '900',
    fontSize: 14,
  },
  actionCluster: {
    alignItems: 'center',
    gap: 4, // Slightly tighter for 3 icons
    zIndex: 10,
  },
  headerIconButton: {
    width: 34, // Slightly smaller to fit 3
    height: 34,
    borderRadius: 10,
    backgroundColor: withAlpha(colorPalette.white, 0.12),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: colorPalette.danger,
    minWidth: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colorPalette.brand,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colorPalette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: withAlpha(colorPalette.white, 0.3),
  },
  searchBarWrapper: {
    // Hidden by default in ModernPremiumHeader but kept styles for expand logic if needed
    display: 'none',
  },
  searchText: {
    color: withAlpha(colorPalette.white, 0.6),
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  tickerBar: {
    backgroundColor: withAlpha(colorPalette.brand, 0.08),
    borderRadius: 10,
    height: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    overflow: 'hidden',
  },
  tickerScrollContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  tickerMeasurement: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0,
  },
  tickerTrack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickerStatusBadge: {
    backgroundColor: colorPalette.brand,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    zIndex: 10,
  },
  tickerStatusText: {
    color: colorPalette.white,
    fontSize: 9,
    fontWeight: '900',
  },
  tickerMessage: {
    color: colorPalette.white,
    fontWeight: '700',
    fontSize: 11,
    paddingHorizontal: 4,
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navSurface: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colorPalette.white,
    ...Platform.select({
      ios: {
        shadowColor: colorPalette.brandStrong,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  navContent: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 56,
    gap: 2,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    width: '100%',
  },
  launcherPlaceholder: {
    width: 64,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  launcherButtonArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  launcherLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colorPalette.brand,
    textAlign: 'center',
  },
  floatingLauncher: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colorPalette.brandStrong,
    padding: 3,
    shadowColor: colorPalette.brandStrong,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 1001,
  },
  launcherInner: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: colorPalette.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: withAlpha(colorPalette.white, 0.3),
  },
});
