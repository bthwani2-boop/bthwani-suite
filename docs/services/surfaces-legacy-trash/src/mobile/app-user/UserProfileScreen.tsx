// UserProfileScreen - §86 Unified app-user screen — الملف الشخصي
// §UX-SUPREME-001: Professional Design with Avatar, Stats, Quick Actions
// Minimum Clicks + Zero Ambiguity
// WAVE 11 (Phase 8): Central contract only; menu arrow direction from useDirection.

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  BTHWANI_COLORS,
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  Loading,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';

import { ServiceIcon } from '../components/ServiceIcon';
import { getFavoriteServices } from '@bthwani/states/preferences';
import { AnimatedCard } from '../components/MicroInteractions';
import {
  buildUserProfileMock,
  buildUserProfileStatsMock,
} from '../fixtures/userProfile';

export const UserProfileScreen: React.FC<{
  navigation?: { navigate: (screen: string) => void };
}> = ({ navigation }) => {
  const { t, forwardCaret, rowStyle, textAlignStartStyle } = useDirection();
  const NS = 'mobile.app-user.UserProfileScreen';
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await getFavoriteServices();
        setFavoriteCount(favorites.length);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleNavigate = (screen: string) => {
    navigation?.navigate(screen);
  };

  const userData = useMemo(() => buildUserProfileMock(t), [t]);

  const stats = useMemo(() => {
    const base = buildUserProfileStatsMock(t, NS, favoriteCount);
    const colors = [
      semanticRoles?.primaryCTA,
      semanticRoles?.accent,
      semanticRoles?.stateSuccess?.icon || semanticRoles?.primaryCTA,
      semanticRoles?.stateWarning?.icon || semanticRoles?.accent,
    ];
    return base.map((s, i) => ({
      ...s,
      color: colors[i] ?? semanticRoles?.primaryCTA,
    }));
  }, [t, favoriteCount]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Avatar Section with Gradient Background */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {userData.avatar ? (
              <Text style={styles.avatarText}>{t(`${NS}.avatarFallback`)}</Text>
            ) : (
              <ServiceIcon
                name='person'
                size={48}
                color={semanticRoles?.primaryCTA || BTHWANI_COLORS.primary}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => handleNavigate('UserProfileUpdate')}
            activeOpacity={0.7}
          >
            <ServiceIcon
              name='person'
              size={16}
              color={semanticRoles?.surface || BTHWANI_COLORS.surface}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userPhone}>{userData.phone}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => {
            if (!stat || !stat.icon) return null;
            return (
              <AnimatedCard
                key={index}
                style={styles.statCard}
                onPress={() => {
                  if (stat.label === t(`${NS}.balance`))
                    handleNavigate('WltHome');
                  else if (stat.label === t(`${NS}.favorites`))
                    handleNavigate('Home');
                }}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: stat.color + '15' },
                  ]}
                >
                  <ServiceIcon
                    name={stat.icon || 'home'}
                    size={24}
                    color={
                      stat.color ||
                      semanticRoles?.primaryCTA ||
                      BTHWANI_COLORS.primary
                    }
                  />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </AnimatedCard>
            );
          })}
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, textAlignStartStyle]}>
          {t('profile.account_management')}
        </Text>
        <View style={styles.menuList}>
          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('UserProfileUpdate')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      (semanticRoles?.primaryCTA || BTHWANI_COLORS.primary) +
                      '15',
                  },
                ]}
              >
                <ServiceIcon
                  name='person'
                  size={20}
                  color={semanticRoles?.primaryCTA || BTHWANI_COLORS.primary}
                />
              </View>
              <Text style={styles.menuItemLabel}>{t('profile.account')}</Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('DshOrdersList')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateInfo?.background ||
                      'BTHWANI_COLORS.primaryTint',
                  },
                ]}
              >
                <ServiceIcon
                  name='receipt-long'
                  size={20}
                  color={
                    semanticRoles?.stateInfo?.icon ||
                    semanticRoles?.primaryCTA ||
                    BTHWANI_COLORS.primary
                  }
                />
              </View>
              <Text style={styles.menuItemLabel}>{t('profile.my_orders')}</Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('WltSubscriptionStatusGet')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      (semanticRoles?.accent || BTHWANI_COLORS.accent) + '15',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>📋</Text>
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.subscriptions')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('WltHome')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      (semanticRoles?.stateSuccess?.icon ||
                        semanticRoles?.primaryCTA ||
                        BTHWANI_COLORS.primary) + '15',
                  },
                ]}
              >
                <ServiceIcon
                  name='account-balance-wallet'
                  size={20}
                  color={
                    semanticRoles?.stateSuccess?.icon ||
                    semanticRoles?.primaryCTA ||
                    BTHWANI_COLORS.primary
                  }
                />
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.my_balance')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('UserAddressesList')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateInfo?.background ||
                      'BTHWANI_COLORS.primaryTint',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>📍</Text>
              </View>
              <Text style={styles.menuItemLabel}>{t('profile.addresses')}</Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('DshZoneSet')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateInfo?.background ||
                      'BTHWANI_COLORS.primaryTint',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>📍</Text>
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.change_city')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('UserNotificationsList')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateWarning?.background ||
                      'BTHWANI_COLORS.accentTint',
                  },
                ]}
              >
                <ServiceIcon
                  name='notifications'
                  size={20}
                  color={
                    semanticRoles?.stateWarning?.icon ||
                    semanticRoles?.accent ||
                    BTHWANI_COLORS.accent
                  }
                />
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.notifications')}
              </Text>
            </View>
            <View style={styles.menuItemRight}>
              <View style={styles.menuItemBadge}>
                <Text style={styles.menuItemBadgeText}>5</Text>
              </View>
              <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
            </View>
          </TouchableOpacity>

          {/* كيفية استخدام التطبيق */}
          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('SupportTickets')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateInfo?.background ||
                      'BTHWANI_COLORS.primaryTint',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>❓</Text>
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.how_to_use')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          {/* تواصل معنا / الدعم */}
          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('SupportTickets')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateInfo?.background ||
                      'BTHWANI_COLORS.primaryTint',
                  },
                ]}
              >
                <ServiceIcon
                  name='support-agent'
                  size={20}
                  color={
                    semanticRoles?.stateInfo?.icon ||
                    semanticRoles?.primaryCTA ||
                    BTHWANI_COLORS.primary
                  }
                />
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.contact_us')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          {/* التفضيلات / الإعدادات */}
          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('UserPreferencesGet')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: semanticRoles.stateInfo.background },
                ]}
              >
                <Text style={styles.menuItemIconText}>⚙️</Text>
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.preferences')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          {/* Share app */}
          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      (semanticRoles?.accent || BTHWANI_COLORS.accent) + '15',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>📲</Text>
              </View>
              <Text style={styles.menuItemLabel}>{t('profile.share_app')}</Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          {/* سياسة الخصوصية */}
          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('KnzPage')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateInfo?.background ||
                      'BTHWANI_COLORS.primaryTint',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>📜</Text>
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.privacy_policy')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          {/* إعدادات متقدمة */}
          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('UserPreferencesGet')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateInfo?.background ||
                      'BTHWANI_COLORS.primaryTint',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>⚙️</Text>
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.advanced_settings')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('UserSessionEnd')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateWarning?.background ||
                      'BTHWANI_COLORS.accentTint',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>🚪</Text>
              </View>
              <Text style={styles.menuItemLabel}>{t('profile.logout')}</Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, rowStyle]}
            onPress={() => handleNavigate('UserSessionEnd')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  {
                    backgroundColor:
                      semanticRoles?.stateError?.background ||
                      'BTHWANI_COLORS.dangerTint',
                  },
                ]}
              >
                <Text style={styles.menuItemIconText}>🗑️</Text>
              </View>
              <Text style={styles.menuItemLabel}>
                {t('profile.delete_account')}
              </Text>
            </View>
            <Text style={styles.menuItemArrow}>{forwardCaret}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Spacing */}
      <View style={styles.footerSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scrollContent: {
    paddingBottom: BTHWANI_SPACING.xl,
  },
  avatarSection: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingTop: BTHWANI_SPACING.xxl,
    paddingBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderBottomLeftRadius: BTHWANI_RADIUS.xl,
    borderBottomRightRadius: BTHWANI_RADIUS.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: BTHWANI_SPACING.md,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: semanticRoles.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: semanticRoles.surface,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: semanticRoles.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: semanticRoles.surface,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.surface,
    marginBottom: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: semanticRoles.surface,
    opacity: 0.9,
    marginBottom: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 14,
    color: semanticRoles.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.lg,
    marginTop: -BTHWANI_SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  quickActionsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.md,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  quickActionIconText: {
    fontSize: 28,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  menuList: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  menuItemIconText: {
    fontSize: 20,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: semanticRoles.text,
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  menuItemBadge: {
    backgroundColor: semanticRoles.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  menuItemBadgeText: {
    color: semanticRoles.surface,
    fontSize: 11,
    fontWeight: '700',
  },
  menuItemArrow: {
    fontSize: 18,
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
  },
  footerSpacing: {
    height: BTHWANI_SPACING.xl,
  },
});

export default UserProfileScreen;
