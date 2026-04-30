/**
 * KnzAccountScreen — صفحة حسابي في كنز (حساب المستخدم الحالي).
 * Surface: app-client | Service: knz
 * §86 Single source of entry for KNZ account hub; zero duplication; one tap to each destination.
 * Design: Minimal clicks, clear path. Links to KnzMyListings, KnzFavoritesList, KnzChatThreadList, KnzListingCreate.
 * PLANNED (future): knz_account_get, followers, isStore — UI ready for data binding.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { KnzRatingSummary } from './components';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

function trackKnzEvent(eventName: string, payload?: Record<string, unknown>) {
  try {
    // طبقة بسيطة لقياس الأحداث الأساسية في KNZ (يمكن استبدالها لاحقاً بـ analytics حقيقية)
    // مرجع: KNZ_UX_FORENSIC_AND_FINAL_DESIGN §10
    // eslint-disable-next-line no-console
    console.log('[KNZ_ANALYTICS]', eventName, payload ?? {});
  } catch {
    // لا شيء
  }
}

interface KnzAccountScreenProps {
  navigation?: { goBack?: () => void; navigate?: (screen: string, params?: Record<string, string>) => void };
}

interface AccountRow {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
  screen: string;
  params?: Record<string, string>;
   /** اسم حدث القياس المرتبط بهذا الاختصار، إن وجد */
  analyticsEvent?: string;
}

const NS = 'knz.app-client.mobile.KnzAccountScreen';

interface KnzAccountApiModel {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isStore?: boolean;
  storeName?: string;
  followersCount?: number;
  listingsCount?: number;
}

export const KnzAccountScreen: React.FC<KnzAccountScreenProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const ACCOUNT_ROWS = useMemo<AccountRow[]>(() => [
    { id: 'my_listings', label: t(`${NS}.myListings`), sublabel: t(`${NS}.myListingsDesc`), icon: '📋', screen: 'KnzMyListings', analyticsEvent: 'knz_account_tap_my_listings' },
    { id: 'favorites', label: t(`${NS}.favorites`), sublabel: t(`${NS}.favoritesDesc`), icon: '❤️', screen: 'KnzFavoritesList', analyticsEvent: 'knz_account_tap_favorites' },
    { id: 'chats', label: t(`${NS}.conversations`), sublabel: t(`${NS}.conversationsDesc`), icon: '💬', screen: 'KnzChatThreadList', analyticsEvent: 'knz_account_tap_chats' },
    { id: 'create', label: t(`${NS}.addListing`), sublabel: t(`${NS}.addListingDesc`), icon: '➕', screen: 'KnzListingCreate', analyticsEvent: 'knz_account_tap_add_listing' },
  ], [t]);
  const PLANNED_ROWS = useMemo(() => [
    { id: 'ratings', label: t(`${NS}.ratingsAndReviews`), sublabel: t(`${NS}.ratingsSublabel`), icon: '⭐' },
    { id: 'promoted', label: t(`${NS}.sponsoredListing`), sublabel: t(`${NS}.promotedSublabel`), icon: '📢' },
    { id: 'stores', label: t(`${NS}.stores`), sublabel: t(`${NS}.storesSublabel`), icon: '🏪' },
  ], [t]);
  const [account, setAccount] = useState<KnzAccountApiModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ratingSummary, setRatingSummary] = useState<{ average: number; count: number } | null>(null);

  const handleNavigate = (screen: string, params?: Record<string, string>) => {
    if (navigation?.navigate) {
      navigation.navigate(screen, params);
    }
  };

  const handleBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else if (navigation?.navigate) {
      navigation.navigate('KnzHome');
    }
  };

  const handleActionPress = (row: AccountRow) => {
    if (row.analyticsEvent) {
      trackKnzEvent(row.analyticsEvent);
    }
    handleNavigate(row.screen, row.params);
  };

  const loadAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const baseUrl = getBaseUrl();
      // في هذه المرحلة لا يوجد userId من المصادقة، فيُترك للـ API Gateway تمييز المستخدم الحالي من التوكن.
      const url = `${baseUrl}/api/knz/accounts/me`;
      const res = await rawFetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      // في بيئة التطوير، قد لا يكون هناك userId أو توكن، لذا نعامل 401/403/404 كعدم وجود حساب حتى الآن.
      if (!res.ok) {
        if (res.status === 401 || res.status === 403 || res.status === 404) {
          setAccount(null);
          setLoading(false);
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      if (!json?.success || !json?.data?.account) {
        // إذا لم يرجع الحساب، نُظهر الشاشة بدون بيانات إضافية بدلاً من خطأ قاتل.
        setAccount(null);
        setLoading(false);
        return;
      }
      setAccount(json.data.account as KnzAccountApiModel);
      setLoading(false);
    } catch {
      // fallback آمن: لا نعرض شاشة خطأ، فقط نُبقي الاختصارات تعمل.
      setLoading(false);
      setAccount(null);
      setError(null);
    }
  }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  useEffect(() => {
    const fetchRatingSummary = async () => {
      if (!account?.userId) return;
      try {
        const baseUrl = getBaseUrl();
        const res = await rawFetch(
          `${baseUrl}/api/knz/ratings/summary?userId=${encodeURIComponent(account.userId)}`,
        );
        if (!res.ok) return;
        const json = await res.json();
        if (json?.success && json?.data) {
          const average = typeof json.data.average === 'number' ? json.data.average : 0;
          const count = typeof json.data.count === 'number' ? json.data.count : 0;
          setRatingSummary({ average, count });
        }
      } catch {
        // في حال فشل جلب التقييم، نبقي الشاشة بدون ملخص تقييم بدون عرض خطأ منفصل
      }
    };

    void fetchRatingSummary();
  }, [account?.userId]);

  const displayName = account?.displayName ?? t(`${NS}.defaultDisplayName`);
  const initials = displayName.slice(0, 2);

  return (
    <ScreenWrapper
      state={loading ? 'loading' : error ? 'error' : 'content'}
      loadingMessage={t(`${NS}.loadingMessage`)}
      errorMessage={error ?? undefined}
      onErrorAction={loadAccount}
      screenName="KnzAccountScreen"
      operationName="knz_account_get"
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.headerRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityLabel={t(`${NS}.back`)}>
              <Text style={styles.backText}>← {t(`${NS}.back`)}</Text>
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>{t('knz.app-client.mobile.KnzAccountScreen.headerTitle')}</Text>
              {account ? (
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {account.displayName}
                </Text>
              ) : null}
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.heroCard}>
            <View style={[styles.heroTopRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroName}>{displayName}</Text>
                {account?.isStore && account.storeName ? (
                  <Text style={styles.heroStoreName} numberOfLines={1}>
                    {account.storeName}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={[styles.heroStatsRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>{t(`${NS}.activeListings`)}</Text>
                <Text style={styles.heroStatValue}>{account?.listingsCount ?? 0}</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>{t(`${NS}.followers`)}</Text>
                <Text style={styles.heroStatValue}>{account?.followersCount ?? 0}</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>{t(`${NS}.overallRating`)}</Text>
                {ratingSummary ? (
                  <KnzRatingSummary average={ratingSummary.average} count={ratingSummary.count} />
                ) : (
                  <Text style={styles.heroStatMuted}>{t(`${NS}.noRatingYet`)}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`${NS}.quickActions`)}</Text>
            <View style={[styles.quickActionsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {ACCOUNT_ROWS.map((row) => (
                <TouchableOpacity
                  key={row.id}
                  style={styles.quickActionCard}
                  onPress={() => handleActionPress(row)}
                  activeOpacity={0.8}
                  accessibilityLabel={row.label}
                  accessibilityRole="button"
                >
                  <Text style={styles.quickActionIcon}>{row.icon}</Text>
                  <Text style={styles.quickActionLabel}>{row.label}</Text>
                  {row.sublabel ? (
                    <Text style={styles.quickActionSublabel} numberOfLines={2}>
                      {row.sublabel}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t(`${NS}.comingSoon`)}</Text>
            {PLANNED_ROWS.map((row) => (
              <View key={row.id} style={[styles.plannedRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.rowIcon}>{row.icon}</Text>
                <View style={styles.rowText}>
                  <Text style={styles.plannedRowLabel}>{row.label}</Text>
                  <Text style={styles.rowSublabel} numberOfLines={1}>{row.sublabel}</Text>
                </View>
                <Text style={styles.comingSoonBadge}>{t(`${NS}.comingSoon`)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xl,
  },
  backButton: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.sm,
    minWidth: 56,
  },
  backText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  headerSpacer: {
    width: 56,
  },
  section: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  accountMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  accountMetaText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  heroCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: semanticRoles.primaryCTA + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  heroText: {
    flex: 1,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  heroStoreName: {
    marginTop: 2,
    fontSize: 13,
    color: semanticRoles.textMuted,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: BTHWANI_SPACING.md,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatLabel: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    marginBottom: 4,
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  heroStatMuted: {
    fontSize: 11,
    color: semanticRoles.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  rowIcon: {
    fontSize: 22,
    marginEnd: BTHWANI_SPACING.md,
    width: 28,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  rowSublabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: 2,
  },
  rowChevron: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  plannedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    opacity: 0.85,
  },
  plannedRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  comingSoonBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    backgroundColor: semanticRoles.border,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.md,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  quickActionIcon: {
    fontSize: 22,
    marginBottom: BTHWANI_SPACING.xs,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  quickActionSublabel: {
    marginTop: 2,
    fontSize: 11,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
});

export default KnzAccountScreen;

