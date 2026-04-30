// DSH Search Screen - Enhanced Modern Design
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildDshSearchMock, type Restaurant } from '../../hooks';

interface auto_dsh_searchProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_search: React.FC<auto_dsh_searchProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const [state, setState] = useState<ScreenState>('content');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = useMemo(
    () => [
      {
        id: 'all',
        label: t('dsh.app-client.mobile.auto_dsh_search.filterLabelAll'),
        icon: '🍽️',
      },
      {
        id: 'open',
        label: t('dsh.app-client.mobile.auto_dsh_search.filterLabelOpenNow'),
        icon: '🟢',
      },
      {
        id: 'rating',
        label: t('dsh.app-client.mobile.auto_dsh_search.filterLabelTopRated'),
        icon: '⭐',
      },
      {
        id: 'delivery',
        label: t('dsh.app-client.mobile.auto_dsh_search.filterLabelFastDelivery'),
        icon: '🚀',
      },
    ],
    [t]
  );
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'open' | 'rating' | 'delivery'
  >('all');
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

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      return;
    }
    setState('loading');
    setTimeout(() => {
      const mockSuccess = 0 > 0.1;
      const mockHasResults = 0 > 0.1;
      if (!mockSuccess) {
        setState('error');
      } else if (!mockHasResults) {
        setState('empty');
      } else {
        setState('content');
      }
    }, 1500);
  }, [searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleSearch();
    setRefreshing(false);
  }, [handleSearch]);

  const handleRetry = () => {
    handleSearch();
  };

  const restaurants = useMemo(() => buildDshSearchMock(t), [t]);
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (selectedFilter === 'open' && !restaurant.isOpen) return false;
    if (selectedFilter === 'rating' && restaurant.rating < 4.5) return false;
    if (selectedFilter === 'delivery' && parseInt(restaurant.deliveryTime) > 30)
      return false;
    if (searchQuery.trim()) {
      return (
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleNavigate('DshStoreGet')}
      activeOpacity={0.7}
    >
      <View style={styles.restaurantImageContainer}>
        <Text style={styles.restaurantImage}>{item.image}</Text>
        {item.isOpen ? (
          <View style={styles.openBadgeOverlay}>
            <Text style={styles.openBadgeText}>
              {t('dsh.app-client.mobile.auto_dsh_search.openBadgeText')}
            </Text>
          </View>
        ) : (
          <View style={styles.closedBadgeOverlay}>
            <Text style={styles.closedBadgeText}>
              {t('dsh.app-client.mobile.auto_dsh_search.closedBadgeText')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.restaurantContent}>
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.restaurantCuisine} numberOfLines={1}>
              {item.cuisine}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.ratingValue}>{item.rating}</Text>
          </View>
        </View>

        <View style={styles.restaurantMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaText}>{item.deliveryTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={styles.metaText}>{item.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>
              {item.deliveryFee === 0 ? '🆓' : '💰'}
            </Text>
            <Text style={styles.metaText}>
              {item.deliveryFee === 0
                ? t('dsh.app-client.mobile.auto_dsh_search.deliveryFeeFree')
                : `${item.deliveryFee} ريال`}
            </Text>
          </View>
        </View>

        {item.isOpen ? (
          <TouchableOpacity
            style={styles.orderButton}
            onPress={e => {
              e.stopPropagation();
              handleNavigate('DshStoreGet');
            }}
          >
            <Text style={styles.orderButtonText}>
              {t('dsh.app-client.mobile.auto_dsh_search.orderButtonText')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.closedButton}>
            <Text style={styles.closedButtonText}>
              {t('dsh.app-client.mobile.auto_dsh_search.closedButtonText')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('dsh.app-client.mobile.auto_dsh_search.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('dsh.app-client.mobile.auto_dsh_search.subtitle')}
            </Text>
          </View>

          <View style={styles.searchSection}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={[
                  styles.searchInput,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
                placeholder={t('dsh.app-client.mobile.auto_dsh_search.placeholderSearch')}
                placeholderTextColor={semanticRoles.onSurfaceMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType='search'
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.searchIcon}>🔍</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filtersSection}>
            <FlatList
              data={filters}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedFilter === item.id && styles.selectedFilterChip,
                  ]}
                  onPress={() => setSelectedFilter(item.id as any)}
                >
                  <Text style={styles.filterIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === item.id && styles.selectedFilterText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {t('dsh.app-client.mobile.auto_dsh_search.resultsCount', {
                count: filteredRestaurants.length,
              })}
            </Text>
          </View>

          <FlatList
            data={filteredRestaurants}
            keyExtractor={item => item.id}
            renderItem={renderRestaurant}
            contentContainerStyle={styles.restaurantsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>
                  {t('dsh.app-client.mobile.auto_dsh_search.emptyTitle')}
                </Text>
                <Text style={styles.emptyText}>
                  {t('dsh.app-client.mobile.auto_dsh_search.emptyText')}
                </Text>
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
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_search.loadingMessage')}
      emptyMessage={t('dsh.app-client.mobile.auto_dsh_search.emptyMessage')}
      emptyActionText={t('dsh.app-client.mobile.auto_dsh_search.emptyActionText')}
      onEmptyAction={() => {
        setSearchQuery('');
        setState('content');
      }}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_search.errorMessage')}
      onErrorAction={handleRetry}
      screenName='auto_dsh_search'
      operationName='dsh_search'
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
  searchSection: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.surfaceSubtle,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
  },
  searchButton: {
    padding: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.primaryCTA,
  },
  searchIcon: {
    fontSize: 20,
  },
  filtersSection: {
    backgroundColor: semanticRoles.surface,
    paddingVertical: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.surfaceSubtle,
  },
  filtersContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.surfaceSubtle,
    gap: BTHWANI_SPACING.xs,
  },
  selectedFilterChip: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  filterIcon: {
    fontSize: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  selectedFilterText: {
    color: semanticRoles.primaryCTAText,
  },
  resultsHeader: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
  },
  resultsCount: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    fontWeight: '500',
  },
  restaurantsList: {
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
  restaurantImage: {
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    gap: BTHWANI_SPACING.xs,
  },
  ratingIcon: {
    fontSize: 14,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
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
  emptyState: {
    alignItems: 'center',
    padding: BTHWANI_SPACING.xxxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: BTHWANI_SPACING.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  emptyText: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default auto_dsh_search;

