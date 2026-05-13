import React from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Surface, Text, Icon, colorPalette, spacing, radius, type Direction, resolveRowDirection } from '../';

// ----- Modern Premium Header -----

export type ModernPremiumHeaderProps = {
  title: string;
  locationLabel?: string;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  onCartPress?: () => void;
  onSearchPress?: () => void;
  onLauncherPress?: () => void;
  tickerMessage?: string;
  tickerStatus?: string;
  onTickerPress?: () => void;
  direction?: Direction;
};

export function ModernPremiumHeader({
  title,
  locationLabel,
  onProfilePress,
  onNotificationsPress,
  onCartPress,
  onSearchPress,
  onLauncherPress,
  tickerMessage,
  tickerStatus,
  onTickerPress,
  direction = 'rtl',
}: ModernPremiumHeaderProps) {
  const isRtl = direction === 'rtl';
  const rowDirection = resolveRowDirection(direction);

  return (
    <View style={styles.headerContainer}>
      {/* Top Row: Brand & Actions */}
      <View style={[styles.headerTopRow, { flexDirection: rowDirection }]}>
        <View style={styles.brandCluster}>
          <Text role="titleLg" style={styles.brandTitle}>{title}</Text>
          {locationLabel && (
            <View style={[styles.locationBadge, { flexDirection: rowDirection }]}>
              <Icon name="location-outline" size={10} color={colorPalette.white} />
              <Text role="caption" style={styles.locationText}>{locationLabel}</Text>
            </View>
          )}
        </View>

        <View style={[styles.actionCluster, { flexDirection: rowDirection }]}>
          <HeaderIconButton icon="search-outline" onPress={onSearchPress} />
          <HeaderIconButton icon="cart-outline" onPress={onCartPress} />
          <HeaderIconButton icon="notifications-outline" onPress={onNotificationsPress} />
          <Pressable onPress={onProfilePress} style={styles.profileAvatar}>
            <Icon name="person" size={20} color={colorPalette.brand} />
          </Pressable>
        </View>
      </View>

      {/* Bottom Row: Launcher & News Ticker */}
      <View style={[styles.headerBottomRow, { flexDirection: rowDirection }]}>
        <Pressable onPress={onLauncherPress} style={[styles.launcherButton, { flexDirection: rowDirection }]}>
          <View style={styles.launcherIconWrap}>
            <Icon name="compass" size={24} color={colorPalette.white} />
          </View>
          <Text role="bodyStrong" style={styles.launcherText}>الخدمات</Text>
        </Pressable>

        {tickerMessage && (
          <Pressable onPress={onTickerPress} style={[styles.tickerBar, { flexDirection: rowDirection }]}>
            <View style={styles.tickerStatusBadge}>
              <Text role="label" style={styles.tickerStatusText}>{tickerStatus ?? 'مباشر'}</Text>
            </View>
            <Text role="bodySm" style={styles.tickerMessage} numberOfLines={1}>{tickerMessage}</Text>
            <Icon name="chevron-forward" size={14} color="rgba(255,255,255,0.6)" mirrored={isRtl} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function HeaderIconButton({ icon, onPress }: { icon: any; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.headerIconButton}>
      <Icon name={icon} size={22} color={colorPalette.white} />
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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 54, // Increased for status bar safety
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 100,
  },
  headerTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandCluster: {
    gap: 4,
  },
  brandTitle: {
    color: colorPalette.white,
    fontWeight: '900',
    fontSize: 24, // Slightly larger for premium impact
  },
  locationBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: colorPalette.white,
    fontWeight: '700',
    fontSize: 12,
  },
  actionCluster: {
    alignItems: 'center',
    gap: 14,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colorPalette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  headerBottomRow: {
    alignItems: 'center',
    gap: 14,
  },
  launcherButton: {
    backgroundColor: '#0A2F5C',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  launcherIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  launcherText: {
    color: colorPalette.white,
    fontSize: 16,
    fontWeight: '800',
  },
  tickerBar: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 10,
  },
  tickerStatusBadge: {
    backgroundColor: '#FF500D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tickerStatusText: {
    color: colorPalette.white,
    fontSize: 11,
    fontWeight: '900',
  },
  tickerMessage: {
    flex: 1,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
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
    height: 75,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: colorPalette.white,
    shadowColor: '#0A2F5C',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 25,
    paddingBottom: 10,
  },
  navContent: {
    flex: 1,
    paddingHorizontal: 20,
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
