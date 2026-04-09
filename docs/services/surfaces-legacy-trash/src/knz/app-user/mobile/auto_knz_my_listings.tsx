/**
 * KNZ إعلاناتي — قائمة إعلانات المستخدم الحالي
 * Surface: app-client | Service: knz
 * من الرئيسية: نقرة على "إعلاناتي" أو من القائمة الجانبية
 * نقرة على بطاقة → KnzListingGet؛ من التفاصيل يمكن التعديل/الحذف
 * Contract: البيانات = knz_listings_list مع sellerId=current (أو معامل مالك). لا entity_list لـ KNZ (العقد: Does NOT cover KNZ listings).
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import {
  KNZ_CATEGORIES,
  KNZ_LISTING_TYPES,
} from '../../shared/knz-constants';
import { buildKnzMyListingsMock, type MyListingItem } from '../../hooks';

const NS = 'knz.app-client.mobile.auto_knz_my_listings';
const NS_COMMON = 'knz.app-client.mobile.common';

interface auto_knz_my_listingsProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, string>) => void;
    goBack?: () => void;
  };
}

export const auto_knz_my_listings: React.FC<auto_knz_my_listingsProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const categoryLabels = useMemo(
    () => ({
      vehicles: t(`${NS_COMMON}.categoryVehicles`),
      real_estate: t(`${NS_COMMON}.categoryRealEstate`),
      services: t(`${NS_COMMON}.categoryServices`),
      home_garden: t(`${NS_COMMON}.categoryHomeGarden`),
      electronics: t(`${NS_COMMON}.categoryElectronics`),
      jobs: t(`${NS_COMMON}.categoryJobs`),
      family_kids: t(`${NS_COMMON}.categoryFamilyKids`),
      sports: t(`${NS_COMMON}.categorySports`),
      animals: t(`${NS_COMMON}.categoryAnimals`),
      numbers_plates: t(`${NS_COMMON}.categoryNumbersPlates`),
      travel: t(`${NS_COMMON}.categoryTravel`),
      other: t(`${NS_COMMON}.categoryOther`),
    }),
    [t]
  );
  const categoryCodeToLabel = (code: string) =>
    categoryLabels[code as keyof typeof categoryLabels] ?? code;
  const listingTypeLabels = useMemo(
    () => ({
      sale: t(`${NS_COMMON}.listingTypeSale`),
      rent: t(`${NS_COMMON}.listingTypeRent`),
      service: t(`${NS_COMMON}.listingTypeService`),
      wanted: t(`${NS_COMMON}.listingTypeWanted`),
    }),
    [t]
  );
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const [listings, setListings] = useState<MyListingItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const loadMyListings = useCallback(async () => {
    try {
      setState('loading');
      await new Promise(r => setTimeout(r, 1200));
      setListings(buildKnzMyListingsMock(t));
      setState('content');
    } catch {
      setState('error');
    }
  }, [t]);

  useEffect(() => {
    loadMyListings();
  }, [loadMyListings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMyListings().finally(() => setRefreshing(false));
  }, [loadMyListings]);

  const renderItem = ({ item }: { item: MyListingItem }) => (
    <TouchableOpacity
      style={[styles.card, { flexDirection: 'row', direction: layoutDirection }]}
      onPress={() => handleNavigate('KnzListingGet', { listingId: item.id })}
      activeOpacity={0.7}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.cardImage}
          resizeMode='cover'
        />
      ) : (
        <View
          style={[
            styles.cardImage,
            {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: BTHWANI_COLORS.borderSubtle,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>📷</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardPrice}>{item.price.toLocaleString()} ريال</Text>
        <View style={[styles.cardMeta, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.cardCategory}>
            {categoryCodeToLabel(item.category)}
          </Text>
          <Text style={styles.cardLocation}>📍 {item.location}</Text>
        </View>
        {item.listingType && (
          <Text style={styles.typeBadge}>
            {listingTypeLabels[
              item.listingType as keyof typeof listingTypeLabels
            ] ?? item.listingType}
          </Text>
        )}
        {item.deliveryAvailableFromSeller && (
          <Text style={styles.deliveryBadge}>
            🚚 {t(`${NS}.deliveryFromSeller`)}
          </Text>
        )}
        <View style={[styles.cardActions, { flexDirection: 'row', direction: layoutDirection }]}>
          <View
            style={[
              styles.statusBadge,
              item.status === 'active'
                ? styles.statusActive
                : styles.statusClosed,
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === 'active' ? t(`${NS}.active`) : t(`${NS}.closed`)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={e => {
              e.stopPropagation();
              handleNavigate('KnzListingUpdate', { listingId: item.id });
            }}
          >
            <Text style={styles.actionBtnText}>{t(`${NS}.edit`)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnDanger]}
            onPress={e => {
              e.stopPropagation();
              handleNavigate('KnzListingDelete', { listingId: item.id });
            }}
          >
            <Text style={styles.actionBtnTextDanger}>{t(`${NS}.delete`)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <View style={styles.header}>
            {navigation?.goBack && (
              <TouchableOpacity
                onPress={navigation.goBack}
                style={styles.backBtn}
              >
                <Text style={styles.backText}>
                  {t(`${NS}.back`)}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{t(`${NS}.title`)}</Text>
            <Text style={styles.subtitle}>
              {t(`${NS}.subtitle`)}
            </Text>
          </View>

          <FlatList
            data={listings}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {t(`${NS}.emptyListMessage`)}
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => handleNavigate('KnzListingCreate')}
                >
                  <Text style={styles.emptyButtonText}>
                    {t(`${NS}.emptyListAction`)}
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(
        'knz.app-client.mobile.auto_knz_my_listings.loadingMessage'
      )}
      emptyMessage={t('surfaces.لا_توجد_إعلانات')}
      emptyActionText={t('surfaces.أضف_إعلان')}
      onEmptyAction={() => handleNavigate('KnzListingCreate')}
      errorMessage={t('surfaces.فشل_في_تحميل_الإعلانات')}
      onErrorAction={loadMyListings}
      screenName='auto_knz_my_listings'
      operationName='knz_listings_list'
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  backBtn: { marginBottom: BTHWANI_SPACING.sm },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: { fontSize: 14, color: semanticRoles.textMuted },
  listContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardImage: { width: 100, height: 100 },
  cardBody: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  cardCategory: { fontSize: 12, color: semanticRoles.textMuted },
  cardLocation: { fontSize: 12, color: semanticRoles.textMuted },
  typeBadge: {
    fontSize: 11,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
    marginTop: BTHWANI_SPACING.xs,
  },
  deliveryBadge: {
    fontSize: 11,
    color: semanticRoles.info,
    marginTop: BTHWANI_SPACING.xs,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusActive: { backgroundColor: semanticRoles.success + '30' },
  statusClosed: { backgroundColor: semanticRoles.textMuted + '30' },
  statusText: { fontSize: 12, fontWeight: '600', color: semanticRoles.text },
  actionBtn: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: semanticRoles.text },
  actionBtnDanger: { borderColor: semanticRoles.error },
  actionBtnTextDanger: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.error,
  },
  empty: { alignItems: 'center', paddingVertical: BTHWANI_SPACING.xl * 2 },
  emptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  emptyButtonText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_knz_my_listings;

