import React from 'react';
import type { DshHomeCategory, DshHomeGetStore } from '../contracts/dsh-home-types';
import { createDshProductApiHttpClient, isDshProductApiOfflineError } from '../../shared/dsh-product-api.transport';
import { resolveDshDiscoveryStoresRuntimeConfig } from '../shared/dsh-discovery-stores-runtime-config';

export type CategoriesBridgeResult = {
  state: 'loading' | 'ready' | 'empty' | 'error' | 'offline';
  categories: DshHomeCategory[];
};

export function useDshClientHomeCategories(
  visibleStores: DshHomeGetStore[],
  storesState: 'loading' | 'ready' | 'empty' | 'error' | 'offline',
  homeRetryToken: number
): CategoriesBridgeResult {
  const [categoriesState, setCategoriesState] = React.useState<'loading' | 'ready' | 'empty' | 'error' | 'offline'>('loading');
  const [categories, setCategories] = React.useState<DshHomeCategory[]>([]);

  React.useEffect(() => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (!config) {
      setCategoriesState('empty');
      setCategories([]);
      return;
    }

    if (visibleStores.length === 0) {
      setCategoriesState('ready');
      setCategories([]);
      return;
    }

    let cancelled = false;
    setCategoriesState('loading');

    const client = createDshProductApiHttpClient(config.baseUrl);

    // Fetch categories for all visible stores in parallel
    const fetchPromises = visibleStores.map((store) =>
      client.listCategories(store.id, { limit: 100 })
        .then((res) => res.categories)
        .catch((err) => {
          throw err;
        })
    );

    Promise.all(fetchPromises)
      .then((allStoreCategories) => {
        if (cancelled) return;

        // Flatten all categories
        const flatCategories = allStoreCategories.flat();

        // Separate parent categories and subcategories
        const parentCategoriesMap = new Map<string, DshHomeCategory>();
        const subcategoriesList: Array<{ parent_id: string; sub: { id: string; label: string; subtitle: string } }> = [];

        flatCategories.forEach((cat) => {
          if (!cat.parent_id) {
            if (!parentCategoriesMap.has(cat.id)) {
              parentCategoriesMap.set(cat.id, {
                id: cat.id,
                label: cat.name,
                subtitle: cat.description ?? undefined,
                renderMode: 'stores',
                subcategories: [],
              });
            }
          } else {
            subcategoriesList.push({
              parent_id: cat.parent_id,
              sub: {
                id: cat.id,
                label: cat.name,
                subtitle: cat.description ?? '',
              },
            });
          }
        });

        // Attach subcategories to parents
        subcategoriesList.forEach(({ parent_id, sub }) => {
          const parent = parentCategoriesMap.get(parent_id);
          if (parent) {
            if (!parent.subcategories) {
              parent.subcategories = [];
            }
            if (!parent.subcategories.some((s) => s.id === sub.id)) {
              parent.subcategories.push(sub);
            }
          }
        });

        const mappedCategories = Array.from(parentCategoriesMap.values());

        setCategories(mappedCategories);
        setCategoriesState(mappedCategories.length > 0 ? 'ready' : 'empty');
      })
      .catch((err) => {
        console.warn("fetch home categories failed:", err);
        if (cancelled) return;
        const state = isDshProductApiOfflineError(err) ? 'offline' : 'error';
        setCategories([]);
        setCategoriesState(state);
      });

    return () => {
      cancelled = true;
    };
  }, [visibleStores, homeRetryToken]);

  const consolidatedState = React.useMemo(() => {
    if (storesState === 'loading' || categoriesState === 'loading') return 'loading';
    if (storesState === 'offline' || categoriesState === 'offline') return 'offline';
    if (storesState === 'error' || categoriesState === 'error') return 'error';
    if (storesState === 'empty') return 'empty';
    return categoriesState;
  }, [storesState, categoriesState]);

  return {
    state: consolidatedState,
    categories,
  };
}
