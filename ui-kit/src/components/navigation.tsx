import React from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions, Animated, Easing } from 'react-native';
import { Surface, Text } from '../primitives';
import { Icon } from './icons';
import { Badge } from './button';
import { colorPalette, spacing, radius, type Direction, resolveRowDirection } from '../foundation';

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
      // Logic: Move from one side to the other.
      // User requested "From Left to Right".
      // In RTL, that's actually the natural flow of a ticker (entering from left, moving right).
      const startValue = -textWidth;
      const endValue = containerWidth;

      translateX.setValue(startValue);

      const duration = (containerWidth + textWidth) * 25; // Speed adjustment

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
  }, [containerWidth, textWidth]);

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
        <Animated.View style={{ transform: [{ translateX }] }}>
          <Text
            role="bodySm"
            style={styles.tickerMessage}
            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
            numberOfLines={1}
          >
            {message}
          </Text>
        </Animated.View>
      </View>
      <Icon name="chevron-forward" size={14} color="rgba(255,255,255,0.6)" mirrored={isRtl} />
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
          <Icon name="person" size={22} color={colorPalette.brand} />
        </Pressable>
      </View>

      {/* Row 2: Search Bar */}
      <Pressable onPress={onSearchPress} style={[styles.searchBarWrapper, { flexDirection: rowDirection }]}>
        <Icon name="search-outline" size={20} color="rgba(255,255,255,0.7)" />
        <Text style={styles.searchText}>{searchPlaceholder ?? 'ابحث عن متجر، مطعم، خدمة...'}</Text>
      </Pressable>

      {/* Row 3: Animated News Ticker */}
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
      <Icon name={icon} size={24} color={colorPalette.white} />
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
  const { width } = useWindowDimensions();
  const rowDirection = resolveRowDirection(direction);

  // Split items to place launcher in middle
  // We assume 4 items total for a balanced look
  const leftItems = items.slice(0, 2);
  const rightItems = items.slice(2, 4);

  return (
    <View style={[styles.navContainer, { width }]}>
      <Surface tone="default" style={styles.navSurface}>
        <View style={[styles.navContent, { flexDirection: rowDirection }]}>
          {leftItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onPress={() => onSelect(item.id)}
            />
          ))}

          <View style={styles.launcherPlaceholder} />

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
          <Icon name="grid" size={28} color={colorPalette.white} />
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
        size={24}
        color={isActive ? colorPalette.brand : colorPalette.textMuted}
      />
      <Text
        role="caption"
        style={[styles.navLabel, { color: isActive ? colorPalette.brand : colorPalette.textMuted }]}
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
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 58,
    paddingBottom: 8,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 100,
  },
  headerTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  locationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  deliveryToText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  locationBadge: {
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: colorPalette.white,
    fontWeight: '900',
    fontSize: 15,
  },
  actionCluster: {
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30', // Pure Red for visibility
    minWidth: 10,
    height: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colorPalette.brand,
    paddingHorizontal: 2,
  },
  iconBadgeText: {
    color: colorPalette.white,
    fontSize: 10,
    fontWeight: '900',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colorPalette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBarWrapper: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  tickerBar: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    overflow: 'hidden',
  },
  tickerScrollContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  tickerStatusBadge: {
    backgroundColor: '#FF500D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tickerStatusText: {
    color: colorPalette.white,
    fontSize: 10,
    fontWeight: '900',
  },
  tickerMessage: {
    color: colorPalette.white,
    fontWeight: '700',
    fontSize: 12,
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Total height including floating button
    zIndex: 1000,
  },
  navSurface: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colorPalette.white,
    shadowColor: '#0A2F5C',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 30,
    paddingBottom: 12,
  },
  navContent: {
    flex: 1,
    paddingHorizontal: 8, // Reduced to reach edges better
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navButton: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  launcherPlaceholder: {
    width: 72,
  },
  floatingLauncher: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0A2F5C',
    padding: 5,
    shadowColor: '#0A2F5C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 15,
  },
  launcherInner: {
    flex: 1,
    borderRadius: 31,
    backgroundColor: '#FF500D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
});
