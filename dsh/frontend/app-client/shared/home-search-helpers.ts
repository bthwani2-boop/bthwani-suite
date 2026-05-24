import type {
  DiscoveryFilter,
  DshHomeGetStore,
} from '../contracts/dsh-home-types';

export const HOME_CATEGORY_FILTER_PREFIX = 'category:';
export const HOME_MODE_FILTER_PREFIX = 'mode:';

export function buildHomeCategoryFilterId(categoryId: string) {
  return `${HOME_CATEGORY_FILTER_PREFIX}${categoryId}`;
}

export function buildHomeModeFilterId(filter: DiscoveryFilter) {
  return `${HOME_MODE_FILTER_PREFIX}${filter}`;
}

type ResolveHomeStoresForCategoryInput = {
  categoryId: string;
  stores: DshHomeGetStore[];
  activeFilter: DiscoveryFilter;
  favoriteToggles: Record<string, boolean>;
  query: string;
};

export function resolveHomeStoresForCategory({
  categoryId,
  stores,
  activeFilter,
  favoriteToggles,
  query,
}: ResolveHomeStoresForCategoryInput) {
  const categoryScopedStores =
    categoryId && categoryId !== 'all'
      ? stores.filter((store) => (store.categoryId ? store.categoryId === categoryId : false))
      : stores;

  const filteredByMode = categoryScopedStores.filter((store) => {
    const isFavorite = favoriteToggles[store.id] ?? store.isFavorite;

    if (activeFilter === 'favorites') {
      return isFavorite;
    }

    if (activeFilter === 'nearest') {
      return store.distanceLabel === '1.8 كم' || store.distanceLabel === '2.1 كم';
    }

    if (activeFilter === 'new') {
      return Boolean(store.hasOffer);
    }

    if (activeFilter === 'offers') {
      return Boolean(store.hasOffer || store.offerLabel);
    }

    return true;
  });

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return filteredByMode;
  }

  return filteredByMode.filter((store) => {
    const haystack = [
      store.name,
      store.address,
      store.deliveryLabel,
      store.serviceLabel,
      store.offerLabel ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
