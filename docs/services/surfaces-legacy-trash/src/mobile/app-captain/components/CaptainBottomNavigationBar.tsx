/**
 * CaptainBottomNavigationBar — 4 Tabs + Center Action
 * §UX-SUPREME-001: Action-first, 1-handed operation, Zero distraction
 *
 * Features:
 * - 4 Tabs: Jobs, Map, Wallet, Account
 * - Center Action Button (dynamic based on trip stage)
 * - State-aware (Idle/On-Trip/Critical)
 * - Height: 72px
 * - Pill Indicator for active tab
 * - Safe Area handling
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BTHWANI_SPACING, semanticRoles, useDirection } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../components';
import {
  CaptainCenterActionButton,
  CenterActionVariant,
  TripStage,
} from './CaptainCenterActionButton';

const NS = 'mobile.app-captain.CaptainBottomNavigationBar';

export type CaptainState = 'idle' | 'on_trip' | 'pickup' | 'dropoff' | 'issue';

export type CaptainType = 'dsh' | 'amn' | null;

interface CaptainBottomNavigationBarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  captainState: CaptainState;
  captainType?: CaptainType;
  centerAction?: {
    label: string;
    icon: string;
    onPress: () => void;
    variant?: CenterActionVariant;
  };
  notificationCount?: number;
  tripStage?: TripStage | null;
}

interface TabConfig {
  key: string;
  label: string;
  icon: string;
  screen: string;
}

const NAV_HEIGHT = semanticRoles.nav.height;

export const CaptainBottomNavigationBar: React.FC<
  CaptainBottomNavigationBarProps
> = ({
  currentScreen,
  onNavigate,
  captainState,
  captainType = null,
  centerAction,
  notificationCount = 0,
  tripStage = null,
}) => {
  const { rowDirection, t } = useDirection();
  const isAmn = captainType === 'amn';
  const isDsh = captainType === 'dsh';

  const CAPTAIN_TABS_FULL: TabConfig[] = React.useMemo(
    () => [
      { key: 'jobs', label: t(`${NS}.trips`), icon: 'list', screen: 'Home' },
      { key: 'map', label: t(`${NS}.map`), icon: 'map', screen: 'CaptainMap' },
      {
        key: 'wallet',
        label: t(`${NS}.wallet`),
        icon: 'account-balance-wallet',
        screen: 'captain_wallet',
      },
      {
        key: 'account',
        label: t(`${NS}.account`),
        icon: 'person',
        screen: 'CaptainProfile',
      },
    ],
    [t]
  );
  const AMN_TABS: TabConfig[] = React.useMemo(
    () => [
      {
        key: 'earnings',
        label: t(`${NS}.earnings`),
        icon: 'account-balance-wallet',
        screen: 'platform_captain_earnings_get',
      },
      {
        key: 'trips',
        label: t(`${NS}.trips`),
        icon: 'list',
        screen: 'captain_earnings_history',
      },
      {
        key: 'wallet',
        label: t(`${NS}.wallet`),
        icon: 'payment',
        screen: 'captain_wallet',
      },
    ],
    [t]
  );
  const DSH_TABS: TabConfig[] = React.useMemo(
    () => [
      {
        key: 'earnings',
        label: t(`${NS}.earnings`),
        icon: 'account-balance-wallet',
        screen: 'platform_captain_earnings_get',
      },
      {
        key: 'orders',
        label: t(`${NS}.orders`),
        icon: 'list',
        screen: 'dsh_captain_orders_list',
      },
      {
        key: 'wallet',
        label: t(`${NS}.wallet`),
        icon: 'payment',
        screen: 'captain_wallet',
      },
    ],
    [t]
  );

  const tabs = isAmn ? AMN_TABS : isDsh ? DSH_TABS : CAPTAIN_TABS_FULL;
  const showCenterAction = !isAmn && !isDsh;

  const isActive = (tab: TabConfig): boolean => {
    if (
      tab.screen === 'Home' &&
      (currentScreen === 'Home' ||
        currentScreen.startsWith('dsh_') ||
        currentScreen.startsWith('amn_'))
    ) {
      return !isAmn && !isDsh && tab.key === 'jobs';
    }
    if (isDsh && tab.key === 'orders') {
      return (
        currentScreen === 'dsh_captain_orders_list' ||
        currentScreen.startsWith('dsh_captain_order')
      );
    }
    return currentScreen === tab.screen;
  };

  const isTabEnabled = (tab: TabConfig): boolean => {
    if (
      captainState === 'on_trip' ||
      captainState === 'pickup' ||
      captainState === 'dropoff'
    ) {
      return tab.key === 'jobs' || tab.key === 'map' || tab.key === 'orders';
    }
    return true;
  };

  const getCenterActionConfig = () => {
    if (centerAction) {
      return centerAction;
    }
    if (captainState === 'idle') {
      return {
        label: t(`${NS}.availableNow`),
        icon: 'play-arrow',
        onPress: () => onNavigate('Home'),
        variant: 'primary' as CenterActionVariant,
      };
    }
    if (tripStage === 'arrived') {
      return {
        label: t(`${NS}.arrived`),
        icon: 'location-on',
        onPress: () => onNavigate('Home'),
        variant: 'warning' as CenterActionVariant,
      };
    }
    if (tripStage === 'picked') {
      return {
        label: t(`${NS}.pickedUp`),
        icon: 'check-circle',
        onPress: () => onNavigate('Home'),
        variant: 'success' as CenterActionVariant,
      };
    }
    if (tripStage === 'dropped') {
      return {
        label: t(`${NS}.arrivedAtCustomer`),
        icon: 'location-on',
        onPress: () => onNavigate('Home'),
        variant: 'warning' as CenterActionVariant,
      };
    }
    if (tripStage === 'delivered') {
      return {
        label: t(`${NS}.delivered`),
        icon: 'check-circle',
        onPress: () => onNavigate('Home'),
        variant: 'success' as CenterActionVariant,
      };
    }
    return {
      label: t(`${NS}.start`),
      icon: 'play-arrow',
      onPress: () => onNavigate('Home'),
      variant: 'primary' as CenterActionVariant,
    };
  };

  const centerActionConfig = getCenterActionConfig();

  const renderTabs = (tabList: readonly TabConfig[]) =>
    tabList.map(tab => {
      const active = isActive(tab);
      const enabled = isTabEnabled(tab);
      const hasBadge =
        (tab.key === 'jobs' || tab.key === 'orders') &&
        notificationCount > 0 &&
        captainState === 'issue';

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
    });

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View
        style={[
          styles.navContainer,
          {
            flexDirection: rowDirection,
          },
        ]}
      >
        {isAmn || isDsh ? (
          <View
            style={[
              styles.tabsContainerAmn,
              {
                flexDirection: rowDirection,
              },
            ]}
          >
            {renderTabs(tabs)}
          </View>
        ) : (
          <>
            <View
              style={[
                styles.tabsContainer,
                {
                  flexDirection: rowDirection,
                },
              ]}
            >
              {renderTabs(CAPTAIN_TABS_FULL.slice(0, 2))}
            </View>
            <View style={styles.centerActionContainer}>
              <CaptainCenterActionButton
                label={centerActionConfig.label}
                icon={centerActionConfig.icon}
                onPress={centerActionConfig.onPress}
                variant={centerActionConfig.variant}
              />
            </View>
            <View
              style={[
                styles.tabsContainer,
                {
                  flexDirection: rowDirection,
                },
              ]}
            >
              {renderTabs(CAPTAIN_TABS_FULL.slice(2))}
            </View>
          </>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: BTHWANI_SPACING.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  tabsContainerAmn: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  centerActionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: BTHWANI_SPACING.sm,
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
    bottom: 0,
    start: '50%',
    marginStart: -16,
    width: 32,
    height: semanticRoles.nav.activeIndicator.height,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: semanticRoles.nav.activeIndicator.radius,
  },
});
