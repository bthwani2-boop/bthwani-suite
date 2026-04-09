/**
 * BottomNavigationBar - تصميم قوي وواضح
 * §UX-SUPREME-001: أقل نقرات، صفر التباس
 *
 * الشكل والأسلوب مستوحى من تطبيقات التوصيل (أيقونة + نص، مؤشر نشط).
 * الألوان: ثيم بثواني فقط — semanticRoles، لا ألوان خارجية.
 *
 * التبويبات: الرئيسية + المحفظة فقط (الإشعارات والخدمات والملف الشخصي من الشريط العلوي).
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ServiceIcon } from '../../components/ServiceIcon';
import { BTHWANI_SPACING, semanticRoles, useDirection } from '@bthwani/ui-kit';

const NS = 'mobile.app-user.BottomNavigationBar';

export interface BottomNavigationBarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  notificationCount?: number;
}

interface TabConfig {
  key: string;
  label: string;
  icon: string;
  screen: string;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  currentScreen,
  onNavigate,
  notificationCount = 0,
}) => {
  const { rowStyle, t } = useDirection();
  const isArbScreen =
    currentScreen.startsWith('Arb') ||
    currentScreen === 'ArbHome' ||
    currentScreen === 'ArbBookingsList';

  const BASE_TABS: TabConfig[] = React.useMemo(
    () => [
      { key: 'home', label: t(`${NS}.home`), icon: 'home', screen: 'Home' },
      {
        key: 'wallet',
        label: t(`${NS}.wallet`),
        icon: 'account-balance-wallet',
        screen: 'WltHome',
      },
      {
        key: 'account',
        label: t(`${NS}.account`),
        icon: 'person',
        screen: 'UserProfile',
      },
    ],
    [t]
  );

  const ARB_TABS: TabConfig[] = React.useMemo(
    () => [
      { key: 'home', label: t(`${NS}.home`), icon: 'home', screen: 'Home' },
      {
        key: 'arb',
        label: t(`${NS}.bookings`),
        icon: 'gavel',
        screen: 'ArbHome',
      },
      {
        key: 'wallet',
        label: t(`${NS}.wallet`),
        icon: 'account-balance-wallet',
        screen: 'WltHome',
      },
    ],
    [t]
  );

  const tabsToRender = isArbScreen ? ARB_TABS : BASE_TABS;

  const isActive = (tab: TabConfig): boolean => {
    if (isArbScreen && tab.key === 'arb') {
      return true;
    }

    // Map current screen to Home tab
    if (
      tab.screen === 'Home' &&
      (currentScreen === 'Home' ||
        currentScreen === 'DshHome' ||
        currentScreen === 'KnzHome' ||
        currentScreen === 'ArbHome' ||
        currentScreen === 'AmnHome')
    ) {
      return tab.key === 'home';
    }

    // Map كل شاشات المحفظة (Wlt*) لتبويب المحفظة
    if (tab.screen === 'WltHome') {
      if (currentScreen === 'WltHome' || currentScreen.startsWith('Wlt')) {
        return tab.key === 'wallet';
      }
    }

    // Map كل شاشات الحساب/الإعدادات لتبويب الحساب (بدون Wlt — المحفظة لها تبويبها)
    if (tab.screen === 'UserProfile') {
      if (
        currentScreen === 'UserProfile' ||
        currentScreen.startsWith('User') ||
        currentScreen === 'SupportTickets' ||
        currentScreen.startsWith('DshSubscription') ||
        currentScreen.startsWith('DshLoyalty')
      ) {
        return true;
      }
    }

    return currentScreen === tab.screen;
  };

  const isDshScreen =
    currentScreen === 'DshHome' || currentScreen.startsWith('Dsh');

  return (
    <View style={styles.container}>
      <View style={[styles.tabsContainer, rowStyle]}>
        {tabsToRender.map(tab => {
          const active = isActive(tab);

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => {
                const screen =
                  isDshScreen && tab.key === 'home' ? 'DshHome' : tab.screen;
                onNavigate(screen);
              }}
              activeOpacity={0.7}
              accessibilityLabel={tab.label}
              accessibilityRole='button'
              accessibilityState={{ selected: active }}
            >
              <View style={styles.tabIconContainer}>
                <ServiceIcon
                  name={tab ? tab.icon : 'home'}
                  size={26}
                  color={
                    active ? semanticRoles.primaryCTA : semanticRoles.textMuted
                  }
                />
              </View>
              <Text
                style={[styles.tabLabel, active && styles.tabLabelActive]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {active && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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
    paddingBottom:
      Platform.OS === 'ios' ? BTHWANI_SPACING.md : BTHWANI_SPACING.sm,
    paddingTop: BTHWANI_SPACING.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    position: 'relative',
    minHeight: 60,
  },
  tabIconContainer: {
    position: 'relative',
    marginBottom: BTHWANI_SPACING.xs,
  },
  tabLabel: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    start: '50%',
    marginStart: -14,
    width: 28,
    height: 3,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: 2,
  },
});
