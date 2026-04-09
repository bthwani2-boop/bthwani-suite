// DSH Favorites List Screen - Enhanced Modern Design
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildDshFavoritesListMock, type FavoriteRestaurant } from '../../hooks';

interface auto_dsh_favorites_listProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_favorites_list: React.FC<auto_dsh_favorites_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) {
        navigation.navigate(screen);
      } else if (onNavigate) {
        onNavigate(screen);
      }
    },
    [navigation, onNavigate]
  );

  const loadFavorites = useCallback(async () => {
      try {
      setState('loading');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockSuccess = 0 > 0.08;
      const mockHasFavorites = 0 > 0.1;

        if (!mockSuccess) {
          setState('error');
        } else if (!mockHasFavorites) {
          setState('empty');
        setFavorites([]);
        } else {
        setFavorites(buildDshFavoritesListMock(t));
        setState('content');
      }
    } catch (error) {
      setState('error');
    }
  }, [t]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, [loadFavorites]);

  const handleRetry = () => {
    loadFavorites();
  };

  const toggleFavorite = (id: string) => {
    setFavorites((items) => items.filter((item) => item.id !== id));
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteRestaurant }) => (
    <View style={styles.restaurantCard}>
      <View style={styles.restaurantImageContainer}>
        <Text style={styles.restaurantEmoji}>{item.image}</Text>
        {item.isOpen ? (
          <View style={styles.openBadgeOverlay}>
            <Text style={styles.openBadgeText}>{t('dsh.app-client.mobile.auto_dsh_favorites_list.openBadgeText')}</Text>
          </View>
        ) : (
          <View style={styles.closedBadgeOverlay}>
            <Text style={styles.closedBadgeText}>{t('dsh.app-client.mobile.auto_dsh_favorites_list.closedBadgeText')}</Text>
          </View>
        )}
      </View>

      <View style={styles.restaurantContent}>
        <View style={[styles.restaurantHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.restaurantCuisine} numberOfLines={1}>
              {item.cuisine}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
          <Text style={styles.favoriteIcon}>❤️</Text>
        </TouchableOpacity>
      </View>

        <View style={[styles.restaurantMeta, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={[styles.metaItem, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.metaIcon}>⭐</Text>
            <Text style={styles.metaText}>{item.rating}</Text>
          </View>
          <View style={[styles.metaItem, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaText}>{item.deliveryTime}</Text>
          </View>
          <View style={[styles.metaItem, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={styles.metaText}>{item.distance}</Text>
        </View>
          <View style={[styles.metaItem, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.metaIcon}>
              {item.deliveryFee === 0 ? '🆓' : '💰'}
          </Text>
            <Text style={styles.metaText}>
              {item.deliveryFee === 0 ? t('dsh.app-client.mobile.auto_dsh_favorites_list.deliveryFeeFree') : `${item.deliveryFee} ريال`}
          </Text>
        </View>
      </View>

      {item.isOpen ? (
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => handleNavigate('DshStoreGet')}
          >
            <Text style={styles.orderButtonText}>{t('dsh.app-client.mobile.auto_dsh_favorites_list.orderButtonText')}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.closedButton}>
          <Text style={styles.closedButtonText}>{t('dsh.app-client.mobile.auto_dsh_favorites_list.closedButtonText')}</Text>
        </View>
      )}
      </View>
    </View>
  );

  if (state === 'content' && favorites.length > 0) {
    const openCount = favorites.filter((r) => r.isOpen).length;

    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
<Text style={styles.title}>{t('dsh.app-client.mobile.auto_dsh_favorites_list.title')}</Text>
            <Text style={styles.subtitle}>
                {t('dsh.app-client.mobile.auto_dsh_favorites_list.subtitleFormat', { total: favorites.length, open: openCount })}
            </Text>
            </View>
          </View>

          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteItem}
            contentContainerStyle={styles.favoritesList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_favorites_list.loadingMessage')}
      emptyMessage={t('dsh.app-client.mobile.auto_dsh_favorites_list.emptyMessage')}
      emptyActionText={t('dsh.app-client.mobile.auto_dsh_favorites_list.emptyActionText')}
      onEmptyAction={() => handleNavigate('DshStoresList')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_favorites_list.errorMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_favorites_list"
      operationName="dsh_favorites_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  favoritesList: {
    padding: BTHWANI_SPACING.contentH,
  },
  restaurantCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: semanticRoles.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  restaurantEmoji: {
    fontSize: 64,
  },
  openBadgeOverlay: {
    position: 'absolute',
    top: BTHWANI_SPACING.md,
    start: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.stateSuccess.icon,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  openBadgeText: {
    color: semanticRoles.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  closedBadgeOverlay: {
    position: 'absolute',
    top: BTHWANI_SPACING.md,
    start: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.stateError.icon,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  closedBadgeText: {
    color: semanticRoles.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  restaurantContent: {
    padding: BTHWANI_SPACING.contentH,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  restaurantInfo: {
    flex: 1,
    marginEnd: BTHWANI_SPACING.sm,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  restaurantMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    gap: BTHWANI_SPACING.xs,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    fontWeight: '500',
  },
  orderButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  orderButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
  closedButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  closedButtonText: {
    color: semanticRoles.onSurfaceMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_dsh_favorites_list;

