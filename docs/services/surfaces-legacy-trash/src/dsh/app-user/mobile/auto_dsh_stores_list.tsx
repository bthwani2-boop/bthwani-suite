// Auto-generated screen for dsh_stores_list
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content
// بطاقة متجر موحّدة: StoreCardPremium (يدعم item أو props منفصلة)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { StoreCardPremium, type DshStoreCompactCardData } from '../../components/StoreCardPremium';

interface auto_dsh_stores_listProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

export const auto_dsh_stores_list: React.FC<auto_dsh_stores_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');

  const [stores, setStores] = useState<DshStoreCompactCardData[]>([
    {
      id: '1',
      name: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore1Name'),
      subtitle: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore1Subtitle'),
      image: { uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
      rating: 4.6,
      distanceKm: 2.1,
      isOpen: true,
      supportsPickup: true,
      supportsPartnerDelivery: true,
      isFavorite: false,
      isFollowing: false,
      followersCount: 985,
      hasBthwaniPro: true,
    },
    {
      id: '2',
      name: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore2Name'),
      subtitle: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore2Subtitle'),
      image: { uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
      rating: 4.3,
      distanceKm: 1.2,
      isOpen: true,
      supportsPickup: true,
      supportsPartnerDelivery: true,
      isFavorite: false,
      isFollowing: false,
      followersCount: 1248,
      hasBthwaniPro: false,
    },
    {
      id: '3',
      name: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore3Name'),
      subtitle: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore3Subtitle'),
      image: { uri: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop' },
      rating: 4.5,
      distanceKm: 2.3,
      isOpen: false,
      supportsPickup: true,
      supportsPartnerDelivery: true,
      isFavorite: false,
      isFollowing: true,
      followersCount: 856,
      hasBthwaniPro: false,
    },
    {
      id: '4',
      name: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore4Name'),
      subtitle: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore4Subtitle'),
      image: { uri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop' },
      rating: 4.8,
      distanceKm: 3.5,
      isOpen: false,
      supportsPickup: true,
      supportsPartnerDelivery: true,
      isFavorite: true,
      isFollowing: false,
      followersCount: 2104,
      hasBthwaniPro: true,
    },
    {
      id: '5',
      name: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore5Name'),
      subtitle: t('dsh.app-client.mobile.auto_dsh_stores_list.mockStore5Subtitle'),
      image: { uri: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop' },
      rating: 4.9,
      distanceKm: 3.1,
      isOpen: true,
      supportsPickup: true,
      supportsPartnerDelivery: false,
      isFavorite: true,
      isFollowing: true,
      followersCount: 2400,
      hasBthwaniPro: true,
    },
  ]);

  useEffect(() => {
    const loadStores = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setState('content');
      } catch {
        setState('error');
      }
    };

    loadStores();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 700);
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) {
      navigation.navigate(screen, params);
    } else if (onNavigate) {
      onNavigate(screen, params);
    }
  };

  const onPressStore = (id: string) => {
    handleNavigate('DshStoreGet', { storeId: id });
  };

  const onToggleFavorite = (id: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === id
          ? { ...store, isFavorite: !store.isFavorite }
          : store
      )
    );
  };

  const onToggleFollow = (id: string) => {
    setStores((prev) =>
      prev.map((store) => {
        if (store.id !== id) return store;

        const nextFollowing = !store.isFollowing;
        const nextFollowersCount = Math.max(
          0,
          store.followersCount + (nextFollowing ? 1 : -1)
        );

        return {
          ...store,
          isFollowing: nextFollowing,
          followersCount: nextFollowersCount,
        };
      })
    );
  };

  /** فتح تفاصيل الاشتراك/الباقات (Bottom Sheet أو شاشة) — يُربط لاحقًا */
  const handlePressSubscriptionChip = (storeId: string) => {
    if (onNavigate) onNavigate('DshStoreProDetails', { storeId });
    else if (navigation) navigation.navigate('DshStoreProDetails', { storeId });
  };

  const renderStoreItem = ({ item }: { item: DshStoreCompactCardData }) => (
    <StoreCardPremium
      item={item}
      onPress={onPressStore}
      onToggleFavorite={onToggleFavorite}
      onToggleFollow={onToggleFollow}
      onPressSubscriptionChip={handlePressSubscriptionChip}
    />
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
            <View>
              <Text style={[styles.title, { textAlign: textAlignStart }]}>{t('dsh.stores_list.title')}</Text>
              <Text style={[styles.subtitle, { textAlign: textAlignStart }]}>{t('dsh.stores_list.subtitle')}</Text>
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleNavigate('DshSearch')}
              activeOpacity={0.8}
            >
              <Text style={styles.searchButtonText}>بحث</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={stores}
            keyExtractor={(item) => item.id}
            renderItem={renderStoreItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>لا توجد متاجر متاحة حالياً</Text>
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
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_stores_list.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_stores_list.errorMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_stores_list"
      operationName="dsh_stores_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.borderGray,
  },

  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: BTHWANI_COLORS.onPrimaryContainer,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: BTHWANI_COLORS.textMutedAlt,
  },

  searchButton: {
    minWidth: 64,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: BTHWANI_COLORS.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButtonText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    color: BTHWANI_COLORS.surface,
  },

  listContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: 12,
    paddingBottom: 24,
  },

  separator: {
    height: 12,
  },

  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: BTHWANI_COLORS.textMutedAlt,
  },
});

