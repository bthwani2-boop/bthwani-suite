// Auto-generated screen for dsh_store_items_list (dsh_store_products API)
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/store/{storeId}/products
// §30 States: Loading / Error / Empty / Content

function getBaseUrl(): string {
  let baseUrl = (
    process.env.EXPO_PUBLIC_API_URL || ''
  ).replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  imageEmoji?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  category: string;
  isPopular: boolean;
  preparationTime: string;
  preparationTimeMinutes?: number;
  available?: boolean;
  stockQuantity?: number | null;
}

interface auto_dsh_store_items_listProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: {
    params?: { storeId?: string; initialCategory?: string; productId?: string };
  };
}

export const auto_dsh_store_items_list: React.FC<
  auto_dsh_store_items_listProps
> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const storeId = (route?.params?.storeId ?? '').trim() || 'default';
  const initialCategory =
    (route?.params?.initialCategory ?? '').trim() || 'all';
  const productIdFromParams = (route?.params?.productId ?? '').trim();
  const [state, setState] = useState<ScreenState>('loading');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = useMemo(
    () => [
      {
        id: 'all',
        name: t('dsh.app-client.mobile.auto_dsh_store_items_list.filterAll'),
        emoji: '🍽️',
      },
      {
        id: t('dsh.app-client.mobile.auto_dsh_store_items_list.filterCategory1'),
        name: t('surfaces.برغر'),
        emoji: '🍔',
      },
      {
        id: t('dsh.app-client.mobile.auto_dsh_store_items_list.filterCategory2'),
        name: t('surfaces.بيتزا'),
        emoji: '🍕',
      },
      {
        id: t('dsh.app-client.mobile.auto_dsh_store_items_list.filterCategory3'),
        name: t('surfaces.سلطات'),
        emoji: '🥗',
      },
      {
        id: t('dsh.app-client.mobile.auto_dsh_store_items_list.filterCategory4'),
        name: t('surfaces.شاورما'),
        emoji: '🌯',
      },
      {
        id: t('dsh.app-client.mobile.auto_dsh_store_items_list.filterCategory5'),
        name: t('surfaces.حلويات'),
        emoji: '🍰',
      },
    ],
    [t]
  );
  const [apiProducts, setApiProducts] = useState<StoreItem[]>([]);

  const formatCurrency = useCallback(
    (currency?: string) => {
      const c = (currency ?? '').toUpperCase().trim();
      if (c === 'YER' || c === 'ر.ي' || c === '﷼') return 'ر.ي';
      return currency || 'ر.ي';
    },
    []
  );

  const loadItems = useCallback(async () => {
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/store/${encodeURIComponent(storeId)}/products`;
      const res = await rawFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب المنتجات');
      const raw = (json?.data?.products ?? []) as {
        id?: string;
        product_id?: string;
        name?: string;
        description?: string;
        price?: number;
        original_price?: number;
        currency?: string;
        image?: string;
        image_url?: string;
        thumbnail_url?: string;
        category?: string;
        available?: boolean;
        stock_quantity?: number | null;
        preparation_time_minutes?: number;
      }[];
      const mapped: StoreItem[] = raw.map((p, i) => ({
        id: p.id ?? p.product_id ?? `item_${i}`,
        name: p.name ?? t('dsh.app-client.mobile.auto_dsh_store_items_list.fallbackProductLabel'),
        description: p.description ?? '',
        price: Number(p.price) ?? 0,
        originalPrice:
          p.original_price != null ? Number(p.original_price) : undefined,
        currency: p.currency,
        imageEmoji: p.image ?? '🍽️',
        imageUrl: p.image_url,
        thumbnailUrl: p.thumbnail_url,
        category:
          p.category ?? t('dsh.app-client.mobile.auto_dsh_store_items_list.fallbackCategoryLabel'),
        isPopular: false,
        preparationTime: p.preparation_time_minutes
          ? `${p.preparation_time_minutes} دقيقة`
          : '',
        preparationTimeMinutes: p.preparation_time_minutes,
        available: p.available,
        stockQuantity: p.stock_quantity,
      }));
      setApiProducts(mapped);
      setState('content');
    } catch {
      setState('error');
    }
  }, [storeId]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleRetry = () => void loadItems();

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  const filteredItems =
    selectedCategory === 'all'
      ? apiProducts
      : apiProducts.filter(item => item.category === selectedCategory);

  const renderCategoryFilter = ({
    item,
  }: {
    item: { id: string; name: string; emoji: string };
  }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        selectedCategory === item.id && styles.selectedCategoryFilter,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      <Text
        style={[
          styles.categoryFilterText,
          selectedCategory === item.id && styles.selectedCategoryFilterText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderStoreItem = ({ item }: { item: StoreItem }) => {
    const isOutOfStock = item.stockQuantity === 0;
    const isUnavailable = item.available === false || isOutOfStock;
    const imageUrl = item.thumbnailUrl || item.imageUrl;
    const currencyLabel = formatCurrency(item.currency);
    const hasDiscount =
      item.originalPrice != null && item.originalPrice > item.price;

    return (
      <View style={[styles.storeItem, isUnavailable && styles.storeItemDisabled]}>
        <View style={styles.itemImage}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.itemImageAsset} resizeMode="cover" />
          ) : (
            <Text style={styles.itemEmoji}>{item.imageEmoji}</Text>
          )}
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>شائع</Text>
            </View>
          )}
          {isUnavailable && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>
                {isOutOfStock ? 'نفد' : 'غير متوفر'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          {!!item.description && (
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.itemMeta}>
            {!!item.preparationTime && (
              <Text style={styles.preparationTime}>⏱️ {item.preparationTime}</Text>
            )}
            <View style={styles.priceRow}>
              {hasDiscount && (
                <Text style={styles.originalPrice} numberOfLines={1}>
                  {item.originalPrice?.toLocaleString()} {currencyLabel}
                </Text>
              )}
              <Text style={styles.itemPrice} numberOfLines={1}>
                {item.price.toLocaleString()} {currencyLabel}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isUnavailable && styles.addButtonDisabled]}
          disabled={isUnavailable}
          onPress={() => handleNavigate('DshCartItemAdd')}
        >
          <Text style={styles.addText}>{isUnavailable ? '—' : '+'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>قائمة المنتجات</Text>
            <Text style={styles.subtitle}>اختر ما يناسبك من قائمة المتجر</Text>
          </View>

          <View style={styles.filtersSection}>
            <Text style={[styles.sectionTitle, textAlignStart]}>التصنيفات</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              renderItem={renderCategoryFilter}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>

          <View style={styles.itemsSection}>
            <Text style={[styles.sectionTitle, textAlignStart]}>
              {selectedCategory === 'all'
                ? t('dsh.app-client.mobile.auto_dsh_store_items_list.allProductsLabel')
                : selectedCategory}{' '}
              ({filteredItems.length})
            </Text>
            <FlatList
              data={filteredItems}
              keyExtractor={item => item.id}
              renderItem={renderStoreItem}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>لا منتجات في هذا المتجر</Text>
                </View>
              }
              contentContainerStyle={[
                styles.itemsList,
                filteredItems.length === 0 && styles.itemsListEmpty,
              ]}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>

          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => handleNavigate('DshCartGet')}
          >
            <Text style={styles.viewCartText}>عرض السلة (0 أصناف)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigate('DshHome')}
          >
            <Text style={styles.backText}>العودة للرئيسية</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_store_items_list.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_store_items_list.errorMessage')}
      onErrorAction={handleRetry}
      screenName='auto_dsh_store_items_list'
      operationName='dsh_store_products'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  filtersSection: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  categoriesList: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    marginEnd: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.onSurfaceMuted,
  },
  selectedCategoryFilter: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  categoryEmoji: {
    fontSize: 16,
    marginEnd: BTHWANI_SPACING.xs,
  },
  categoryFilterText: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    fontWeight: '500',
  },
  selectedCategoryFilterText: {
    color: semanticRoles.primaryCTAText,
  },
  itemsSection: {
    flex: 1,
  },
  itemsList: {
    padding: BTHWANI_SPACING.contentH,
  },
  itemsListEmpty: {
    minHeight: 80,
  },
  emptyWrap: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
  },
  storeItem: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  itemImageAsset: {
    width: '100%',
    height: '100%',
  },
  itemEmoji: {
    fontSize: 30,
  },
  popularBadge: {
    position: 'absolute',
    top: -5,
    end: -5,
    backgroundColor: semanticRoles.stateWarning.icon,
    paddingHorizontal: BTHWANI_SPACING.xs,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  unavailableBadge: {
    position: 'absolute',
    bottom: 4,
    start: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.full,
  },
  unavailableText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  itemDescription: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 16,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    textDecorationLine: 'line-through',
  },
  preparationTime: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.onSurfaceMuted,
  },
  addText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 20,
    fontWeight: '600',
  },
  storeItemDisabled: {
    opacity: 0.92,
  },
  viewCartButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  viewCartText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.onSurfaceMuted,
  },
  backText: {
    color: semanticRoles.onSurface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_dsh_store_items_list;

