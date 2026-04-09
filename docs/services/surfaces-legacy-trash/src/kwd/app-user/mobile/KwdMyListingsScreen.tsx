/**
 * KWD منشوراتي — مركز موحد لإعلاناتك وتقديماتك
 * لصاحب العمل: إعلانات "أبحث عن عامل" (وظائفي)
 * للباحث: إعلانات "أبحث عن عمل" + تقديماتي على الوظائف
 * بطاقات مختصرة، نقر واحد للتفاصيل — تغيير الحالة (نشط/مغلق)، تعديل، حذف
 */

const IS_DEV =
  process.env.EXPO_PUBLIC_DEV_MODE === 'true' ||
  process.env.NODE_ENV === 'development';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { ScreenWrapper, semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { AppLoadingState, AppEmptyState } from '@bthwani/ui-kit';
import {
  buildKwdMyListingsMockJobs,
  buildKwdMyListingsMockApplications,
} from '../../hooks';

type TabId = 'ads' | 'applications';

interface MyJobItem {
  id: string;
  title: string;
  status?: string;
  location?: string;
  createdAt?: string;
}

interface ApplicationItem {
  id: string;
  job: { id: string; title: string };
  status: string;
  appliedAt?: string;
}

interface KwdMyListingsScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack?: () => void;
  };
  onNavigate?: (screen: string, params?: any) => void;
  route?: { params?: { highlightListingId?: string; userId?: string } };
}

export const KwdMyListingsScreen: React.FC<KwdMyListingsScreenProps> = ({
  navigation,
  onNavigate,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const layoutDirection = useMemo(
    () => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    [isRTL]
  );
  const [activeTab, setActiveTab] = useState<TabId>('ads');
  const [myJobs, setMyJobs] = useState<MyJobItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigate = useCallback(
    (screen: string, params?: any) => {
      if (navigation?.navigate) {
        navigation.navigate(screen as any, params);
      } else if (onNavigate) {
        onNavigate(screen, params);
      }
    },
    [navigation, onNavigate]
  );

  const userId = route?.params?.userId || 'user_123';
  const baseUrl = getBaseUrl();

  const loadMyJobs = useCallback(async () => {
    setLoadingAds(true);
    try {
      const res = await rawFetch(`${baseUrl}/api/kwd/jobs/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        const list = json?.jobs ?? json?.data ?? [];
        const jobs = Array.isArray(list) ? list : [];
        if (jobs.length === 0 && IS_DEV) {
          setMyJobs(buildKwdMyListingsMockJobs(t, 'default'));
        } else {
          setMyJobs(
            jobs.map((j: any) => ({
              id: j.id || j.jobId,
              title:
                j.title ||
                t('kwd.app-client.mobile.KwdMyListingsScreen.noAddressLabel'),
              status: j.status || 'active',
              location: j.location?.city || j.location || j.region,
              createdAt: j.createdAt || j.postedDate,
            }))
          );
        }
      } else {
        if (IS_DEV) {
          setMyJobs(buildKwdMyListingsMockJobs(t, 'alt'));
        } else {
          setMyJobs([]);
        }
      }
    } catch {
      if (IS_DEV) {
        setMyJobs(buildKwdMyListingsMockJobs(t, 'city'));
      } else {
        setMyJobs([]);
      }
    } finally {
      setLoadingAds(false);
    }
  }, [baseUrl, t]);

  const loadApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const res = await rawFetch(
        `${baseUrl}/api/kwd/applications/me?userId=${encodeURIComponent(userId)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      if (!res.ok) {
        if (IS_DEV) {
          setApplications(buildKwdMyListingsMockApplications(t, 'default'));
        } else {
          setApplications([]);
        }
        return;
      }
      const json = await res.json();
      const list =
        json?.data?.applications ?? json?.applications ?? json?.data ?? [];
      let apps: ApplicationItem[] = (Array.isArray(list) ? list : []).map(
        (app: any) => ({
          id: app.id || app.applicationId,
          job: {
            id: app.job?.id ?? app.jobId,
            title:
              app.job?.title ??
              t('kwd.app-client.mobile.KwdMyListingsScreen.noAddressLabelAlt'),
          },
          status: app.status || 'pending',
          appliedAt: app.appliedAt ?? app.submittedAt,
        })
      );
      if (apps.length === 0 && IS_DEV) {
        apps = buildKwdMyListingsMockApplications(
          t,
          'alt'
        ) as ApplicationItem[];
      }
      setApplications(apps);
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  }, [baseUrl, userId, t]);

  useEffect(() => {
    loadMyJobs();
  }, [loadMyJobs]);

  useEffect(() => {
    if (activeTab === 'applications') {
      loadApplications();
    }
  }, [activeTab, loadApplications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadMyJobs(),
      activeTab === 'applications' ? loadApplications() : Promise.resolve(),
    ]);
    setRefreshing(false);
  }, [loadMyJobs, loadApplications, activeTab]);

  const getStatusText = (status: string): string => {
    const map: Record<string, string> = {
      active: t('surfaces.listingStatusActive'),
      closed: t('surfaces.listingStatusClosed'),
      pending: t('surfaces.statusUnderReview'),
      contacted: t('surfaces.statusContacted'),
      accepted: t('surfaces.statusAccepted'),
      rejected: t('surfaces.statusRejected'),
      completed: t('surfaces.statusCompleted'),
    };
    return map[status] || status;
  };

  const renderAdCard = ({ item }: { item: MyJobItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        handleNavigate('KwdJobGet', { jobId: item.id, fromMyListings: true })
      }
      activeOpacity={0.8}
      accessibilityLabel={item.title}
      accessibilityRole='button'
    >
      <Text style={[styles.cardTitle, textAlignStart]} numberOfLines={2}>
        {item.title ||
          t('kwd.app-client.mobile.KwdMyListingsScreen.noAddressLabelAlt2')}
      </Text>
      {item.status && (
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>
            {getStatusText(item.status)}
          </Text>
        </View>
      )}
      {item.location && (
        <Text style={[styles.cardMeta, textAlignStart]}>
          📍 {item.location}
        </Text>
      )}
      <Text style={[styles.tapHint, textAlignStart]}>
        {t('surfaces.tapForDetails')}
      </Text>
    </TouchableOpacity>
  );

  const renderApplicationCard = ({ item }: { item: ApplicationItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        handleNavigate('KwdApplicationGet', {
          applicationId: item.id,
          jobId: item.job?.id,
        })
      }
      activeOpacity={0.8}
      accessibilityLabel={item.job?.title ?? t('surfaces.application')}
      accessibilityRole='button'
    >
      <Text style={[styles.cardTitle, textAlignStart]} numberOfLines={2}>
        {item.job?.title ||
          t('kwd.app-client.mobile.KwdMyListingsScreen.noAddressLabelAlt3')}
      </Text>
      <View style={styles.statusChip}>
        <Text style={styles.statusChipText}>{getStatusText(item.status)}</Text>
      </View>
      {item.appliedAt && (
        <Text style={[styles.cardMeta, textAlignStart]}>
          📅 {item.appliedAt}
        </Text>
      )}
      <Text style={[styles.tapHint, textAlignStart]}>
        {t('surfaces.tapForDetails')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      state='content'
      screenName='KwdMyListingsScreen'
      operationName='kwd_my_listings'
    >
      <View style={styles.container}>
        <View style={[styles.header, { direction: layoutDirection }]}>
          <TouchableOpacity
            onPress={() =>
              (navigation as any)?.goBack?.() ?? handleNavigate('KwdHome')
            }
            style={styles.backButton}
            accessibilityLabel={t('common.back')}
            accessibilityRole='button'
          >
            <Text style={styles.backText}>
              {isRTL
                ? `\u200F${t('common.back')} \u200E→`
                : `← \u200E${t('common.back')}`}
            </Text>
          </TouchableOpacity>
          <View style={styles.headerTitleBlock}>
            <Text style={[styles.title, textAlignStart]}>
              {t('surfaces.myListings')}
            </Text>
            <Text style={[styles.subtitle, textAlignStart]}>
              {t('surfaces.myListingsSubtitle')}
            </Text>
          </View>
        </View>

        <View style={[styles.tabs, { direction: layoutDirection }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'ads' && styles.tabActive,
              { direction: layoutDirection },
            ]}
            onPress={() => setActiveTab('ads')}
            accessibilityLabel={t('surfaces.myAds')}
            accessibilityRole='tab'
            accessibilityState={{ selected: activeTab === 'ads' }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ads' && styles.tabTextActive,
              ]}
            >
              {t('surfaces.myAds')}
            </Text>
            {myJobs.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{myJobs.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'applications' && styles.tabActive,
              { direction: layoutDirection },
            ]}
            onPress={() => setActiveTab('applications')}
            accessibilityLabel={t('surfaces.myApplications')}
            accessibilityRole='tab'
            accessibilityState={{ selected: activeTab === 'applications' }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'applications' && styles.tabTextActive,
              ]}
            >
              {t('surfaces.myApplications')}
            </Text>
            {applications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{applications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {activeTab === 'ads' && (
          <>
            {loadingAds ? (
              <View style={styles.centered}>
                <AppLoadingState message={t('states.loading')} />
              </View>
            ) : myJobs.length === 0 ? (
              <View style={styles.empty}>
                <AppEmptyState
                  title={t('states.empty')}
                  message={t('surfaces.createListingFromHomeMessage')}
                />
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => handleNavigate('KwdHome')}
                  accessibilityLabel={t('surfaces.goToHome')}
                  accessibilityRole='button'
                >
                  <Text style={styles.primaryButtonText}>
                    {t('surfaces.goToHome')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={myJobs}
                keyExtractor={item => item.id}
                renderItem={renderAdCard}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[semanticRoles.primaryCTA]}
                  />
                }
              />
            )}
          </>
        )}

        {activeTab === 'applications' && (
          <>
            {loadingApps ? (
              <View style={styles.centered}>
                <AppLoadingState message={t('states.loading')} />
              </View>
            ) : applications.length === 0 ? (
              <View style={styles.empty}>
                <AppEmptyState
                  title={t('states.empty')}
                  message={t('surfaces.applyFromHomeMessage')}
                />
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => handleNavigate('KwdJobsList')}
                  accessibilityLabel={t('surfaces.browseOpportunities')}
                  accessibilityRole='button'
                >
                  <Text style={styles.primaryButtonText}>
                    {t('surfaces.browseOpportunities')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={applications}
                keyExtractor={item => item.id}
                renderItem={renderApplicationCard}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[semanticRoles.primaryCTA]}
                  />
                }
              />
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
    backgroundColor: semanticRoles.surface,
  },
  backButton: { marginEnd: BTHWANI_SPACING.md },
  backText: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  headerTitleBlock: { flex: 1, alignItems: 'flex-end' },
  title: { fontSize: 20, fontWeight: '700', color: semanticRoles.text },
  subtitle: { fontSize: 12, color: semanticRoles.textMuted, marginTop: 2 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    gap: BTHWANI_SPACING.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  tabActive: { backgroundColor: semanticRoles.primaryCTA },
  tabText: { fontSize: 15, fontWeight: '600', color: semanticRoles.text },
  tabTextActive: { color: semanticRoles.primaryCTAText },
  badge: {
    marginEnd: BTHWANI_SPACING.xs,
    backgroundColor: BTHWANI_COLORS.overlay20,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: semanticRoles.text },
  listContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  cardMeta: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  tapHint: { fontSize: 12, color: semanticRoles.primaryCTA },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default KwdMyListingsScreen;

