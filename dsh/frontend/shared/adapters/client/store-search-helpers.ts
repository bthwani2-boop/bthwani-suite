import type { DshStoreMenuItem as DshStoreGetMenuItem } from '../../presentation-models/dshStoreProductCardModel';

import { normalizeDisplayText } from './store-formatting';

export type DshStoreSearchCategory = {
  id: string;
  label: string;
  itemCount: number;
  isPopular?: boolean;
};

export function isOfferItem(item: DshStoreGetMenuItem) {
  if ((item as Record<string, unknown>).isOffer) return true;
  if (item.discountLabel) return true;
  if (item.oldPriceLabel && item.priceLabel) return true;

  const discount = normalizeDisplayText(item.discountLabel ?? '').toLowerCase();
  if (discount.includes('%') || /\d+%/.test(discount)) return true;

  return false;
}

export function isNewItem(item: DshStoreGetMenuItem) {
  if (item.isNew) return true;

  const status = normalizeDisplayText(item.statusLabel ?? '').toLowerCase();
  if (status.includes('وصل') || status.includes('جديد') || status.includes('حديث')) return true;

  return false;
}

export function isFavoriteItem(item: DshStoreGetMenuItem) {
  if (item.isFavorite || item.isFavorited) return true;

  const status = normalizeDisplayText(item.statusLabel ?? '').toLowerCase();
  if (status.includes('مفضل') || status.includes('مفضلة')) return true;

  if (normalizeDisplayText(item.categoryLabel ?? '').toLowerCase().includes('مفضل')) return true;

  return false;
}

type BuildStoreSearchCategoriesInput = {
  storeCategories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
  clientVisibleItems: DshStoreGetMenuItem[];
  favoriteIds: ReadonlySet<string>;
};

export function buildStoreSearchCategories({
  storeCategories,
  clientVisibleItems,
  favoriteIds,
}: BuildStoreSearchCategoriesInput): DshStoreSearchCategory[] {
  const filteredStoreCategories = (storeCategories ?? []).filter((category) =>
    clientVisibleItems.some((item) => item.categoryId === category.id),
  );
  const popularCount = clientVisibleItems.filter((item) => {
    const status = normalizeDisplayText(item.statusLabel ?? '');
    return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
  }).length;

  const favoritesCount = clientVisibleItems.filter((item) => isFavoriteItem(item) || favoriteIds.has(item.id)).length;
  const newCount = clientVisibleItems.filter(isNewItem).length;
  const offersCount = clientVisibleItems.filter(isOfferItem).length;

  return [
    { id: 'all', label: 'جميع الأقسام', itemCount: clientVisibleItems.length, isPopular: true },
    { id: 'popular', label: 'الأكثر طلبًا', itemCount: popularCount || Math.min(clientVisibleItems.length, 4), isPopular: true },
    { id: 'favorites', label: 'المفضلة', itemCount: favoritesCount },
    { id: 'new', label: 'الجديدة', itemCount: newCount },
    { id: 'offers', label: 'العروض', itemCount: offersCount },
    ...filteredStoreCategories,
  ];
}

type ResolveStoreItemsForCategoryInput = {
  categoryId: string;
  clientVisibleItems: DshStoreGetMenuItem[];
  favoriteIds: ReadonlySet<string>;
  query: string;
};

export function resolveStoreItemsForCategory({
  categoryId,
  clientVisibleItems,
  favoriteIds,
  query,
}: ResolveStoreItemsForCategoryInput) {
  const scopedItems = (() => {
    if (categoryId === 'all') {
      return clientVisibleItems;
    }

    if (categoryId === 'popular') {
      const popularItems = clientVisibleItems.filter((item) => {
        const status = normalizeDisplayText(item.statusLabel ?? '');
        return status.includes('الأكثر') || status.includes('اختيار') || Boolean(item.hasOptions);
      });

      return popularItems.length ? popularItems : clientVisibleItems.slice(0, Math.min(4, clientVisibleItems.length));
    }

    if (categoryId === 'favorites') {
      return clientVisibleItems.filter((item) => isFavoriteItem(item) || favoriteIds.has(item.id));
    }

    if (categoryId === 'new') {
      return clientVisibleItems.filter((item) => isNewItem(item));
    }

    if (categoryId === 'offers') {
      return clientVisibleItems.filter((item) => isOfferItem(item));
    }

    return clientVisibleItems.filter((item) => item.categoryId === categoryId);
  })();

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return scopedItems;
  }

  return scopedItems.filter((item) => {
    const searchableText = [
      normalizeDisplayText(item.name),
      normalizeDisplayText(item.subtitle),
      normalizeDisplayText(item.categoryLabel),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}
