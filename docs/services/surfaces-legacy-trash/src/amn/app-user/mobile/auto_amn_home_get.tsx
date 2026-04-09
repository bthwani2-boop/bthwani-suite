// AMN Home Screen - Complete Design with Images & design seed
// Surface: app-client | Service: amn
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Strong, Clean, Organized - Similar to DSH Home with BTHWANI Colors + Images

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_COLORS,
} from '@bthwani/ui-kit';
import {
  buildAmnHomeMock,
  type AmnBanner,
  type AmnHomeData,
  type AmnQuickAction,
  type AmnRecentTrip,
} from '../../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface auto_amn_home_getProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

export const auto_amn_home_get: React.FC<auto_amn_home_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t } = useI18n();
  const [state, setState] = useState<ScreenState>('loading');
  const [homeData, setHomeData] = useState<AmnHomeData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        if (params) (navigation as { navigate: (s: string, p?: object) => void }).navigate(screen, params);
        else navigation.navigate(screen);
      } else if (onNavigate) {
        onNavigate(screen);
      }
    },
    [navigation, onNavigate]
  );

  const loadHomeData = useCallback(async () => {
    try {
      setState('loading');
      await new Promise(resolve => setTimeout(resolve, 1500));

      setHomeData(buildAmnHomeMock(t, semanticRoles));
      setState('content');
    } catch (error) {
      setState('error');
    }
  }, [t]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData().finally(() => setRefreshing(false));
  }, [loadHomeData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return semanticRoles.success;
      case 'in_progress':
        return semanticRoles.primaryCTA;
      case 'cancelled':
        return semanticRoles.error;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('amn.app-client.mobile.auto_amn_home_get.completed');
      case 'in_progress':
        return t('amn.app-client.mobile.auto_amn_home_get.inProgress');
      case 'cancelled':
        return t('amn.app-client.mobile.auto_amn_home_get.cancelled');
      default:
        return status;
    }
  };

  if (state === 'content' && homeData) {
    const activeTrips = homeData.active_trips ?? 0;
    const totalTrips = homeData.total_trips ?? 0;
    const totalSpent = homeData.total_spent ?? 0;
    const banners = homeData.banners ?? [];
    const quickActions = homeData.quickActions ?? [];
    const recentTrips = homeData.recentTrips ?? [];

    return (
      <ScreenWrapper state='content'>
        <View style={styles.contentFill}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>أماني - النقل الآمن</Text>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleNavigate('AmnTripsList')}
                >
                  <Text style={styles.iconText}>📋</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.primaryCTA}
                onPress={() => handleNavigate('AmnTripCreate')}
              >
                <Text style={styles.primaryCTAText}>طلب رحلة — نقرة واحدة</Text>
              </TouchableOpacity>
            </View>

            {banners.length > 0 && banners[0] && (
              <View style={styles.bannerContainer}>
                {(banners[0] as AmnBanner).image_url ? (
                  <Image
                    source={{ uri: (banners[0] as AmnBanner).image_url }}
                    style={styles.bannerImage}
                    resizeMode='cover'
                  />
                ) : (
                  <View style={[styles.bannerImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: BTHWANI_COLORS.borderSubtle }]}>
                    <Text style={{ fontSize: 40 }}>🖼️</Text>
                  </View>
                )}
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>
                    {(banners[0] as AmnBanner).title ?? ''}
                  </Text>
                  <Text style={styles.bannerDescription}>
                    {(banners[0] as AmnBanner).description ?? ''}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{String(activeTrips)}</Text>
                <Text style={styles.statLabel}>رحلة نشطة</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{String(totalTrips)}</Text>
                <Text style={styles.statLabel}>إجمالي الرحلات</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {totalSpent != null && !Number.isNaN(Number(totalSpent))
                    ? String(Number(totalSpent).toLocaleString())
                    : '0'}
                </Text>
                <Text style={styles.statLabel}>ريال</Text>
              </View>
            </View>

            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.slice(0, 3).map((action: AmnQuickAction) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.quickActionCard,
                      { backgroundColor: semanticRoles.surface },
                    ]}
                    onPress={() => handleNavigate(action.screen)}
                  >
                    <View
                      style={[
                        styles.quickActionIcon,
                        {
                          backgroundColor:
                            action.color ?? semanticRoles.primaryCTA,
                        },
                      ]}
                    >
                      <Text style={styles.quickActionIconText}>
                        {action.icon ?? '🚗'}
                      </Text>
                    </View>
                    <Text style={styles.quickActionLabel}>
                      {action.name ?? ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.moreActionsButton}
                onPress={() => setShowMoreActions((v) => !v)}
              >
                <Text style={styles.moreActionsButtonText}>
                  {showMoreActions ? t('amn.app-client.mobile.auto_amn_home_get.more') : t('amn.app-client.mobile.auto_amn_home_get.more')}
                </Text>
              </TouchableOpacity>
              {showMoreActions && (
                <View style={styles.quickActionsGrid}>
                  {quickActions.slice(3, 6).map((action: AmnQuickAction) => (
                    <TouchableOpacity
                      key={action.id}
                      style={[
                        styles.quickActionCard,
                        { backgroundColor: semanticRoles.surface },
                      ]}
                      onPress={() => handleNavigate(action.screen)}
                    >
                      <View
                        style={[
                          styles.quickActionIcon,
                          {
                            backgroundColor:
                              action.color ?? semanticRoles.primaryCTA,
                          },
                        ]}
                      >
                        <Text style={styles.quickActionIconText}>
                          {action.icon ?? '🚗'}
                        </Text>
                      </View>
                      <Text style={styles.quickActionLabel}>
                        {action.name ?? ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.recentTripsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>رحلات حديثة</Text>
                {recentTrips.length > 0 && (
                  <TouchableOpacity
                    onPress={() => handleNavigate('AmnTripsList')}
                  >
                    <Text style={styles.seeAllText}>عرض الكل</Text>
                  </TouchableOpacity>
                )}
              </View>
              {recentTrips.length === 0 ? (
                <View style={styles.recentTripsEmpty}>
                  <Text style={styles.recentTripsEmptyText}>لا رحلات بعد</Text>
                  <TouchableOpacity
                    style={styles.recentTripsEmptyCTA}
                    onPress={() => handleNavigate('AmnTripCreate')}
                  >
                    <Text style={styles.recentTripsEmptyCTAText}>طلب رحلة</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                {recentTrips.map((trip: AmnRecentTrip) => (
                  <TouchableOpacity
                    key={trip.id}
                    style={styles.tripCard}
                    onPress={() => handleNavigate('AmnTripGet', { tripId: trip.id })}
                  >
                    <View style={styles.tripHeader}>
                      <Text style={styles.tripId}>{String(trip?.id ?? '')}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusColor(trip.status),
                          },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {getStatusText(trip.status)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tripRoute}>
                      <View style={styles.routePoint}>
                        <Text style={styles.routeIcon}>📍</Text>
                        <Text style={styles.routeText} numberOfLines={1}>
                          {trip.pickupLocation ?? ''}
                        </Text>
                      </View>
                      <View style={styles.routePoint}>
                        <Text style={styles.routeIcon}>🏁</Text>
                        <Text style={styles.routeText} numberOfLines={1}>
                          {trip.destination ?? ''}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tripFooter}>
                      <Text style={styles.tripDate}>{trip.date ?? ''}</Text>
                      {trip.fare != null && trip.fare > 0 ? (
                        <Text style={styles.tripFare}>
                          {String(trip.fare)} ريال
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ))}
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_home_get.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_home_get.errorLoadMessage')}
      onErrorAction={loadHomeData}
      screenName='auto_amn_home_get'
      operationName='amn_home_get'
    />
  );
};

const styles = StyleSheet.create({
  contentFill: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scrollContent: {
    paddingBottom: BTHWANI_SPACING.xl,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  primaryCTA: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  primaryCTAText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    padding: BTHWANI_SPACING.sm,
  },
  iconText: {
    fontSize: 24,
  },
  bannerContainer: {
    margin: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    backgroundColor: 'BTHWANI_COLORS.overlay',
    padding: BTHWANI_SPACING.contentH,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.surface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  bannerDescription: {
    fontSize: 14,
    color: semanticRoles.surface,
    opacity: 0.9,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: semanticRoles.border,
    marginHorizontal: BTHWANI_SPACING.contentH,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
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
    justifyContent: 'space-between',
    marginHorizontal: -BTHWANI_SPACING.xs,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - BTHWANI_SPACING.contentH * 2 - BTHWANI_SPACING.md * 2) / 3,
    marginBottom: BTHWANI_SPACING.md,
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  moreActionsButton: {
    alignSelf: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.sm,
  },
  moreActionsButtonText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  recentTripsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  seeAllText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  recentTripsEmpty: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  recentTripsEmptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  recentTripsEmptyCTA: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  recentTripsEmptyCTAText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  tripCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  tripId: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  tripRoute: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  routeIcon: {
    fontSize: 16,
    marginEnd: BTHWANI_SPACING.sm,
  },
  routeText: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xs,
  },
  tripDate: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  tripFare: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
});

export default auto_amn_home_get;

