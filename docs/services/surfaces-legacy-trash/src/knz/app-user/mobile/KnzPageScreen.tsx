import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { KNZ_LISTING_TYPES } from '../../shared/knz-constants';

const NS = 'knz.app-client.mobile.KnzPageScreen';
const NS_COMMON = 'knz.app-client.mobile.common';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

interface KnzPageScreenProps {
  route?: { params?: { sellerId?: string; sellerName?: string } };
  navigation?: { goBack?: () => void; navigate?: (screen: string, params?: Record<string, string>) => void };
}

interface KnzPageListing {
  id: string;
  title: string;
  price: number;
  categoryLabelAr: string;
  location: string;
  listingType?: string;
  postedDate: string;
}

interface KnzAccountApiModel {
  userId: string;
  displayName: string;
  followersCount?: number;
  listingsCount?: number;
}

export const KnzPageScreen: React.FC<KnzPageScreenProps> = ({ route, navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const sellerId = route?.params?.sellerId ?? '';
  const fallbackSellerName = route?.params?.sellerName ?? t(`${NS}.fallbackSellerName`);

  const [account, setAccount] = useState<KnzAccountApiModel | null>(null);
  const [listings, setListings] = useState<KnzPageListing[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'content'>('loading');

  const loadPage = useCallback(async () => {
    if (!sellerId) {
      setState('error');
      return;
    }
    try {
      setState('loading');
      const baseUrl = getBaseUrl();
      const [accountRes, listingsRes] = await Promise.all([
        rawFetch(`${baseUrl}/api/knz/accounts/${encodeURIComponent(sellerId)}`),
        rawFetch(`${baseUrl}/api/knz/accounts/${encodeURIComponent(sellerId)}/listings`),
      ]);
      if (!accountRes.ok) throw new Error(`HTTP ${accountRes.status}`);
      const accountJson = await accountRes.json();
      if (!accountJson?.success || !accountJson?.data?.account) {
        throw new Error(accountJson?.error || 'فشل في جلب صفحة كنز');
      }
      const listingsOk = listingsRes.ok;
      let nextListings: KnzPageListing[] = [];
      if (listingsOk) {
        const listingsJson = await listingsRes.json();
        const items = listingsJson?.data?.items as any[] | undefined;
        if (Array.isArray(items)) {
          nextListings = items.map((item) => ({
            id: String(item.id ?? item.listingId ?? ''),
            title: String(item.title ?? item.name ?? ''),
            price: Number(item.price ?? 0),
            categoryLabelAr: String(item.categoryLabelAr ?? item.category ?? t(`${NS}.unclassified`)),
            location: String(item.location ?? item.city ?? ''),
            listingType: item.listingType,
            postedDate: String(item.createdAt ?? item.postedAt ?? ''),
          }));
        }
      }
      setAccount(accountJson.data.account as KnzAccountApiModel);
      setListings(nextListings);
      setState('content');
    } catch {
      setState('error');
    }
  }, [sellerId, t]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const listingTypeLabels = useMemo(() => ({
    sale: t(`${NS_COMMON}.listingTypeSale`),
    rent: t(`${NS_COMMON}.listingTypeRent`),
    service: t(`${NS_COMMON}.listingTypeService`),
    wanted: t(`${NS_COMMON}.listingTypeWanted`),
  }), [t]);
  const totalListings = listings.length;

  const handleNavigate = (screen: string, params?: Record<string, string>) => {
    if (navigation?.navigate) {
      navigation.navigate(screen, params);
    }
  };

  const renderListing = ({ item }: { item: KnzPageListing }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => handleNavigate('KnzListingGet', { listingId: item.id })}
    >
      <View style={[styles.listingHeaderRow, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.listingType && (
          <Text style={styles.typeBadge}>
            {listingTypeLabels[item.listingType as keyof typeof listingTypeLabels] ?? item.listingType}
          </Text>
        )}
      </View>
      <Text style={styles.listingPrice}>{item.price.toLocaleString()} SAR</Text>
      <View style={[styles.listingMeta, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.listingMetaText}>📂 {item.categoryLabelAr}</Text>
        <Text style={styles.listingMetaText}>📍 {item.location}</Text>
      </View>
      <Text style={styles.listingDate}>{t(`${NS}.postedDateLabel`)} {item.postedDate}</Text>
    </TouchableOpacity>
  );

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t(`${NS}.loadingMessage`)}
        screenName="KnzPageScreen"
        operationName="knz_account_get"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t(`${NS}.errorMessage`)}
        onErrorAction={loadPage}
        screenName="KnzPageScreen"
        operationName="knz_account_get"
      />
    );
  }

  const displayName = account?.displayName ?? fallbackSellerName;

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.headerRow, { flexDirection: 'row', direction: layoutDirection }]}>
            {navigation?.goBack && (
              <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
                <Text style={styles.backText}>{t(`${NS}.backText`)}</Text>
              </TouchableOpacity>
            )}
              <Text style={styles.headerTitle}>{t(`${NS}.headerTitle`)}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={[styles.sellerCard, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {displayName.slice(0, 2)}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{displayName}</Text>
              <Text style={styles.sellerId}>معرّف الصفحة: {sellerId || account?.userId}</Text>
              <View style={[styles.sellerStatsRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.sellerStat}>إعلانات نشطة: {account?.listingsCount ?? totalListings}</Text>
                <Text style={styles.sellerStat}>المتابعون: {account?.followersCount ?? 0}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>إعلانات هذه الصفحة</Text>

          <FlatList
            data={listings}
            renderItem={renderListing}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listingsList}
          />
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
    marginBottom: BTHWANI_SPACING.lg,
  },
  backButton: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.sm,
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
  headerSpacer: {
    width: 40,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginBottom: BTHWANI_SPACING.lg,
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
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  sellerId: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  sellerStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sellerStat: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  listingsList: {
    gap: BTHWANI_SPACING.md,
  },
  listingCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  listingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.xs,
  },
  listingTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginEnd: BTHWANI_SPACING.sm,
  },
  typeBadge: {
    fontSize: 11,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xs,
  },
  listingMetaText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  listingDate: {
    fontSize: 11,
    color: semanticRoles.textMuted,
  },
});

export default KnzPageScreen;


