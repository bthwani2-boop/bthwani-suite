import React from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colorPalette, resolveRowDirection, type Direction } from '../foundation';
import { Surface, Text } from '../primitives';
import { Icon } from './icons';

// Dynamic safe-area insets loader
let useSafeAreaInsets: () => { top: number; bottom: number; left: number; right: number } = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
try {
  // eslint-disable-next-line no-eval
  const r: any = eval('require');
  const safe = r('react-native-safe-area-context');
  if (safe && typeof safe.useSafeAreaInsets === 'function') {
    useSafeAreaInsets = safe.useSafeAreaInsets;
  }
} catch (err) {
  // fallback is zero
}

// ----- Modern Premium Header -----

export type ModernPremiumHeaderProps = {
  title: string;
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
  direction?: Direction;
};

function SmartNewsTicker({ message, status, isRtl, onPress }: { message: string, status?: string, isRtl: boolean, onPress?: () => void }) {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [textWidth, setTextWidth] = React.useState(0);

  React.useEffect(() => {
    if (containerWidth > 0 && textWidth > 0) {
      // Loop: Start from one side and move to the other
      const startValue = isRtl ? -textWidth : containerWidth;
      const endValue = isRtl ? containerWidth : -textWidth;

      translateX.setValue(startValue);

      // Duration depends on total distance to maintain speed
      const duration = (containerWidth + textWidth) * 45; // Slower for readability

      const animation = Animated.loop(
        Animated.timing(translateX, {
          toValue: endValue,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      animation.start();
      return () => animation.stop();
    }
  }, [containerWidth, textWidth, isRtl]);

  return (
    <Pressable
      onPress={onPress}
      style={styles.tickerBar}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.tickerStatusBadge}>
        <Text role="label" style={styles.tickerStatusText}>{status ?? 'مباشر'}</Text>
      </View>
      <View style={styles.tickerScrollContainer}>
        <Animated.View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', transform: [{ translateX }] }}>
          <Text
            role="bodySm"
            style={styles.tickerMessage}
            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
            numberOfLines={1}
          >
            {message}
          </Text>
          {/* Spacer for loop gap */}
          <View style={{ width: 100 }} />
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
  direction = 'rtl',
}: ModernPremiumHeaderProps) {
  const isRtl = direction === 'rtl';
  const rowDirection = resolveRowDirection(direction);

  return (
    <View style={styles.headerContainer}>
      {/* Row 1: Actions | Location | Profile */}
      <View style={[styles.headerTopRow, { flexDirection: rowDirection }]}>
        <View style={[styles.actionCluster, { flexDirection: rowDirection }]}>
          <HeaderIconButton
            icon="search-outline"
            onPress={onSearchPress}
          />
          <HeaderIconButton
            icon="notifications-outline"
            onPress={onNotificationsPress}
            badge={notificationCount > 0 ? notificationCount : undefined}
          />
          <HeaderIconButton
            icon="cart-outline"
            onPress={onCartPress}
            badge={cartCount > 0 ? cartCount : undefined}
          />
        </View>

        <View style={styles.locationContainer}>
          <Text role="caption" style={styles.deliveryToText}>التوصيل إلى</Text>
          <View style={[styles.locationBadge, { flexDirection: rowDirection }]}>
            <Icon name="location" size={12} color={colorPalette.white} />
            <Text role="bodyStrong" style={styles.locationText} numberOfLines={1}>{locationLabel ?? 'حدد الموقع'}</Text>
          </View>
        </View>

        <Pressable onPress={onProfilePress} style={styles.profileAvatar}>
          <Icon name="person" size={20} color={colorPalette.brand} />
        </Pressable>
      </View>

      {/* Row 2: Animated News Ticker */}
      {tickerMessage && (
        <SmartNewsTicker
          message={tickerMessage}
          status={tickerStatus}
          isRtl={isRtl}
          onPress={onTickerPress}
        />
      )}
    </View>
  );
}

function HeaderIconButton({ icon, onPress, badge }: { icon: any; onPress?: () => void; badge?: number }) {
  return (
    <Pressable onPress={onPress} style={styles.headerIconButton}>
      <Icon name={icon} size={22} color={colorPalette.white} />
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
};

export function BottomNavBar({
  items,
  activeId,
  onSelect,
  onLauncherPress,
  direction = 'rtl',
}: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 44 : 12);
  const { width } = useWindowDimensions();
  const rowDirection = resolveRowDirection(direction);

  // Height strategy: base height 64 + safe area
  const totalHeight = 64 + bottomPadding;

  // Split items to place launcher in middle
  const leftItems = items.slice(0, 2);
  const rightItems = items.slice(2, 4);

  return (
    <View style={[styles.navContainer, { width, height: totalHeight }]}>
      <Surface tone="raised" style={[styles.navSurface, { height: totalHeight, paddingBottom: bottomPadding }]}>
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
              <Text role="caption" style={styles.launcherLabel}>الخدمات</Text>
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
      <Pressable onPress={onLauncherPress} style={styles.floatingLauncher}>
        <View style={styles.launcherInner}>
          <Icon name="grid" size={24} color={colorPalette.white} />
        </View>
      </Pressable>
    </View>
  );
}

function NavButton({ item, isActive, onPress }: { item: NavItem; isActive: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.navButton}>
      <Icon
        name={isActive ? item.activeIcon : item.icon}
        size={22}
        color={isActive ? colorPalette.brand : colorPalette.textMuted}
      />
      <Text
        role="caption"
        style={[styles.navLabel, { color: isActive ? colorPalette.brand : colorPalette.textMuted }]}
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
    paddingTop: 12, // Much smaller because it's inside SafeAreaView
    paddingBottom: 8,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  headerTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 42,
  },
  locationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  deliveryToText: {
    color: 'rgba(255,255,255,0.7)',
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
  },
  headerIconButton: {
    width: 34, // Slightly smaller to fit 3
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: '#FF3B30',
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
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchBarWrapper: {
    // Hidden by default in ModernPremiumHeader but kept styles for expand logic if needed
    display: 'none',
  },
  searchText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  tickerBar: {
    backgroundColor: 'rgba(0,0,0,0.12)',
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
  tickerStatusBadge: {
    backgroundColor: '#FF500D',
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
        shadowColor: '#0A2F5C',
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
    backgroundColor: '#0A2F5C',
    padding: 3,
    shadowColor: '#0A2F5C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 1001,
  },
  launcherInner: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: '#FF500D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
