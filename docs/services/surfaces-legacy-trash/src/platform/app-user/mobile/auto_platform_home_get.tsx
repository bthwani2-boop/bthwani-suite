// Auto-generated screen for platform_home_get
// Surface: app-user | Service: platform
// Operation: GET /api/platform/home
// Description: Unified home screen - works across DSH, ESF, KNZ, MRF, WLT services

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import {
  buildPlatformHomeGetMock,
  type HomeData,
  type QuickAction,
  type Activity,
  type ServiceStats,
  type Promotion,
} from '../../fixtures/homeGet';

interface AutoPlatformHomeGetProps {
  navigation?: any;
  route?: {
    params?: {
      service_mode?: 'DSH' | 'ESF' | 'KNZ' | 'MRF' | 'WLT';
    };
  };
}

export const AutoPlatformHomeGet: React.FC<AutoPlatformHomeGetProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceMode, setServiceMode] = useState<'DSH' | 'ESF' | 'KNZ' | 'MRF' | 'WLT'>('DSH');

  useEffect(() => {
    // Get service mode from route params or determine from context
    const mode = route?.params?.service_mode || 'DSH';
    setServiceMode(mode);

    loadHomeData();
  }, [route]);

  const loadHomeData = useCallback(async () => {
    try {
      setIsLoading(true);

      setHomeData(buildPlatformHomeGetMock(t, serviceMode));
    } catch (error) {
      Alert.alert(
        'خطأ',
        'فشل في تحميل الصفحة الرئيسية',
        [{ text: 'موافق' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [serviceMode]);

  const getServiceDisplayName = (mode: string) => {
    switch (mode) {
      case 'DSH': return '🚚 توصيل وتسوق';
      case 'ESF': return t('surfaces.خدمات_وفعاليات');
      case 'KNZ': return t('surfaces.سوق_مفتوح');
      case 'MRF': return t('surfaces.طلبات_وخدمات');
      case 'WLT': return t('surfaces.المحفظة');
      default: return mode;
    }
  };

  const handleQuickAction = (action: string) => {
    Alert.alert(t('platform.app-user.mobile.auto_platform_home_get.comingSoon'), `ميزة "${action}" ستكون متاحة قريباً`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return BTHWANI_COLORS.success;
      case 'pending': return BTHWANI_COLORS.warning;
      case 'cancelled': return BTHWANI_COLORS.error;
      default: return BTHWANI_COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'pending': return 'معلق';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري تحميل الصفحة الرئيسية...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!homeData) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>لم يتم العثور على البيانات</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadHomeData}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>{t('platform.welcome_name', { name: homeData.user_name })}</Text>
          <Text style={styles.service}>{getServiceDisplayName(homeData.service_mode)}</Text>
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>{t('platform.quick_actions_section')}</Text>
          <View style={[styles.quickActionsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
            {homeData.quick_actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.color }]}
                onPress={() => handleQuickAction(action.action)}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {homeData.stats && Object.keys(homeData.stats).length > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>الإحصائيات</Text>
            <View style={[styles.statsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {homeData.stats.total_orders !== undefined && (
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{homeData.stats.total_orders}</Text>
                  <Text style={styles.statLabel}>إجمالي الطلبات</Text>
                </View>
              )}
              {homeData.stats.active_bookings !== undefined && (
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{homeData.stats.active_bookings}</Text>
                  <Text style={styles.statLabel}>حجوزات نشطة</Text>
                </View>
              )}
              {homeData.stats.deliveries_completed !== undefined && (
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{homeData.stats.deliveries_completed}</Text>
                  <Text style={styles.statLabel}>توصيلات مكتملة</Text>
                </View>
              )}
              {homeData.stats.wallet_balance !== undefined && (
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{homeData.stats.wallet_balance?.toFixed(0)} ريال</Text>
                  <Text style={styles.statLabel}>رصيد المحفظة</Text>
                </View>
              )}
              {homeData.stats.rating !== undefined && (
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{homeData.stats.rating}</Text>
                  <Text style={styles.statLabel}>التقييم</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>النشاط الأخير</Text>
          {homeData.recent_activity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[styles.activityHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) }]}>
                  <Text style={styles.statusBadgeText}>{getStatusText(activity.status)}</Text>
                </View>
              </View>
              <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
              <Text style={styles.activityTime}>
                {new Date(activity.timestamp).toLocaleString('ar-SA')}
              </Text>
            </View>
          ))}
        </View>

        {homeData.promotions && homeData.promotions.length > 0 && (
          <View style={styles.promotionsSection}>
            <Text style={styles.sectionTitle}>العروض الخاصة</Text>
            {homeData.promotions.map((promo) => (
              <View key={promo.id} style={styles.promotionCard}>
                <View style={[styles.promotionHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.promotionTitle}>{promo.title}</Text>
                  <Text style={styles.promotionDiscount}>{promo.discount}</Text>
                </View>
                <Text style={styles.promotionDescription}>{promo.description}</Text>
                <Text style={styles.promotionValidity}>
                  صالح حتى: {new Date(promo.valid_until).toLocaleDateString('ar-SA')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  loadingText: {
    fontSize: 16,
    color: BTHWANI_COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  errorText: {
    fontSize: 16,
    color: BTHWANI_COLORS.error,
    marginBottom: BTHWANI_SPACING.md,
  },
  retryButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surface,
    marginBottom: BTHWANI_SPACING.md,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  service: {
    fontSize: 16,
    color: BTHWANI_COLORS.textSecondary,
  },
  quickActionsSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: BTHWANI_SPACING.sm,
  },
  quickActionTitle: {
    fontSize: 12,
    color: BTHWANI_COLORS.surface,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.primary,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
  },
  activitySection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  activityCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusBadgeText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 10,
    fontWeight: '600',
  },
  activitySubtitle: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    marginBottom: BTHWANI_SPACING.xs,
  },
  activityTime: {
    fontSize: 12,
    color: BTHWANI_COLORS.textMuted,
  },
  promotionsSection: {
    padding: BTHWANI_SPACING.md,
  },
  promotionCard: {
    backgroundColor: BTHWANI_COLORS.successLight,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: BTHWANI_COLORS.success,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.success,
  },
  promotionDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.success,
  },
  promotionDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  promotionValidity: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
  },
});

export default AutoPlatformHomeGet;
