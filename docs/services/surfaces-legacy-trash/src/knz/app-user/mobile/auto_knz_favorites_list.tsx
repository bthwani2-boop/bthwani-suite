// Auto-generated screen for knz_favorites_list
// Surface: app-client | Service: knz
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KNZ_LISTING_TYPES } from '../../shared/knz-constants';
import { buildKnzFavoritesListMock, type FavoriteListing } from '../../hooks';

const NS = 'knz.app-client.mobile.auto_knz_favorites_list';

interface auto_knz_favorites_listProps {
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void };
}

export const auto_knz_favorites_list: React.FC<auto_knz_favorites_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');
  const favorites = useMemo(() => buildKnzFavoritesListMock(t), [t]);

  const handleNavigate = (screen: string, params?: Record<string, string>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  useEffect(() => {
    // Backend integration call
    const loadFavorites = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate different states
        const mockSuccess = 0 > 0.08; // 92% success rate
        const mockHasFavorites = 0 > 0.1; // 90% have favorites

        if (!mockSuccess) {
          setState('error');
        } else if (!mockHasFavorites) {
          setState('empty');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadFavorites();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };


  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return t(`${NS}.conditionNew`);
      case 'used': return t(`${NS}.conditionUsed`);
      case 'refurbished': return t(`${NS}.conditionRefurbished`);
      default: return condition;
    }
  };
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return semanticRoles.success;
      case 'used': return semanticRoles.warning;
      case 'refurbished': return semanticRoles.info;
      default: return semanticRoles.textMuted;
    }
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteListing }) => (
    <TouchableOpacity style={styles.listingCard} onPress={() => handleNavigate('KnzListingGet', { listingId: item.id })}>
      <View style={[styles.listingHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.listingImage}>{item.image}</Text>
        <View style={styles.listingInfo}>
          <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
          <View style={[styles.listingMeta, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.listingCategory}>📂 {item.category}</Text>
            <Text style={styles.listingLocation}>📍 {item.location}</Text>
          </View>
          {item.listingType && (
            <Text style={styles.typeBadge}>{KNZ_LISTING_TYPES.find((t) => t.code === item.listingType)?.labelAr ?? item.listingType}</Text>
          )}
          {item.deliveryAvailableFromSeller && (
            <Text style={styles.deliveryBadge}>🚚 توصيل من البائع</Text>
          )}
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>❤️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listingDetails}>
        <View style={[styles.priceRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.listingPrice}>{item.price.toLocaleString()} {item.currency}</Text>
          <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(item.condition) }]}>
            <Text style={styles.conditionText}>{getConditionText(item.condition)}</Text>
          </View>
        </View>

        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>
            {item.seller.name} {item.seller.verified && '✅'}
          </Text>
        </View>

        <View style={[styles.listingFooter, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.postedDate}>{t(`${NS}.addedToFavorites`)} {item.postedDate}</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactText}>{t(`${NS}.contact`)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={styles.title}>المفضلة</Text>
          <Text style={styles.subtitle}>إعلاناتك المحفوظة للعودة إليها لاحقاً</Text>

          <View style={styles.statsCard}>
            <Text style={styles.statsText}>
              {favorites.length} إعلانات في المفضلة
            </Text>
          </View>

          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteItem}
            contentContainerStyle={styles.favoritesList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(`${NS}.loadingMessage`)}
      emptyMessage={t(`${NS}.emptyMessage`)}
      emptyActionText={t(`${NS}.emptyActionText`)}
      onEmptyAction={() => handleNavigate('KnzListingsList')}
      errorMessage={t(`${NS}.errorMessage`)}
      onErrorAction={handleRetry}
      screenName="auto_knz_favorites_list"
      operationName="knz_favorites_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  statsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  statsText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  favoritesList: {
    padding: BTHWANI_SPACING.contentH,
  },
  listingCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  listingHeader: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.md,
  },
  listingImage: {
    fontSize: 40,
    marginEnd: BTHWANI_SPACING.md,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 22,
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingCategory: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  listingLocation: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  typeBadge: { fontSize: 11, color: semanticRoles.primaryCTA, fontWeight: '600', marginTop: BTHWANI_SPACING.xs },
  deliveryBadge: {
    fontSize: 11,
    color: semanticRoles.info,
    marginTop: BTHWANI_SPACING.xs,
  },
  favoriteButton: {
    padding: BTHWANI_SPACING.sm,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  listingDetails: {
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    paddingTop: BTHWANI_SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  listingPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  conditionBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  conditionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sellerInfo: {
    marginBottom: BTHWANI_SPACING.md,
  },
  sellerName: {
    fontSize: 14,
    color: semanticRoles.text,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  contactButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  contactText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default auto_knz_favorites_list;

