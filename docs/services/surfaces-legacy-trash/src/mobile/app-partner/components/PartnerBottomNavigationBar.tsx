/**
 * PartnerBottomNavigationBar — 3-4 Tabs Navigation
 * §UX-SUPREME-001: Action-first, 1-handed operation, Zero distraction
 *
 * Features:
 * - 3-4 Tabs: Tasks, Map (optional), Profile
 * - State-aware (Idle/On-Task)
 * - Height: 72px
 * - Pill Indicator for active tab
 * - Safe Area handling
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BTHWANI_SPACING, semanticRoles, useDirection } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../components';

const NS = 'mobile.app-partner.PartnerBottomNavigationBar';

export type PartnerState = 'idle' | 'on_task' | 'issue';

interface PartnerBottomNavigationBarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  partnerState: PartnerState;
  notificationCount?: number;
}

interface TabConfig {
  key: string;
  label: string;
  icon: string;
  screen: string;
}

const NAV_HEIGHT = semanticRoles.nav.height;

export const PartnerBottomNavigationBar: React.FC<
  PartnerBottomNavigationBarProps
> = ({ currentScreen, onNavigate, partnerState, notificationCount = 0 }) => {
  const { rowStyle, t } = useDirection();
  const PARTNER_TABS: TabConfig[] = React.useMemo(
    () => [
      { key: 'tasks', label: t(`${NS}.tasks`), icon: 'list', screen: 'Home' },
      { key: 'map', label: t(`${NS}.map`), icon: 'map', screen: 'PartnerMap' },
      {
        key: 'profile',
        label: t(`${NS}.account`),
        icon: 'person',
        screen: 'PartnerProfile',
      },
    ],
    [t]
  );
  const isActive = (tab: TabConfig): boolean => {
    if (
      tab.screen === 'Home' &&
      (currentScreen === 'Home' ||
        currentScreen.startsWith('dsh_partner_') ||
        currentScreen.startsWith('arb_partner_'))
    ) {
      return tab.key === 'tasks';
    }
    return currentScreen === tab.screen;
  };

  const isTabEnabled = (tab: TabConfig): boolean => {
    // During task, all tabs are enabled
    return true;
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={[styles.navContainer, rowStyle]}>
        {PARTNER_TABS.map(tab => {
          const active = isActive(tab);
          const enabled = isTabEnabled(tab);
          const hasBadge =
            tab.key === 'tasks' &&
            notificationCount > 0 &&
            partnerState === 'issue';

          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, !enabled && styles.tabDisabled]}
              onPress={() => enabled && onNavigate(tab.screen)}
              disabled={!enabled}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconContainer}>
                <ServiceIcon
                  name={tab.icon}
                  size={semanticRoles.nav.icon.size}
                  color={
                    active
                      ? semanticRoles.primaryCTA
                      : enabled
                        ? semanticRoles.textMuted
                        : semanticRoles.textDisabled
                  }
                />
                {hasBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>!</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  active && styles.tabLabelActive,
                  !enabled && styles.tabLabelDisabled,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {active && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navContainer: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: BTHWANI_SPACING.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.xs,
    position: 'relative',
    minHeight: NAV_HEIGHT - 16,
  },
  tabDisabled: {
    opacity: 0.4,
  },
  tabIconContainer: {
    position: 'relative',
    marginBottom: BTHWANI_SPACING.xs / 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    end: -8,
    backgroundColor: semanticRoles.accent,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: semanticRoles.surface,
  },
  badgeText: {
    color: semanticRoles.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: semanticRoles.nav.label.size,
    color: semanticRoles.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
  },
  tabLabelDisabled: {
    color: semanticRoles.textDisabled,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    start: '50%',
    marginStart: -16,
    width: 32,
    height: semanticRoles.nav.activeIndicator.height,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: semanticRoles.nav.activeIndicator.radius,
  },
});
