import React from 'react';
import type {
  DshCategoryRecord,
  DshCreateCategoryRequest,
  DshUpdateCategoryRequest,
} from '../products/dsh-product-api.client';
import { getDshProductRuntimeClient } from '../runtime/ui-only-runtime-clients';

export type DshPartnerCategoriesState = 'loading' | 'ready' | 'empty' | 'error' | 'offline';

export type DshPartnerCategoriesResult = {
  categories: DshCategoryRecord[];
  state: DshPartnerCategoriesState;
  createCategory: (storeId: string, req: DshCreateCategoryRequest) => Promise<void>;
  updateCategory: (categoryId: string, req: DshUpdateCategoryRequest) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  refresh: () => void;
};

export function useDshPartnerCategories(storeId: string): DshPartnerCategoriesResult {
  const client = React.useMemo(() => getDshProductRuntimeClient(), []);
  const [categories, setCategories] = React.useState<DshCategoryRecord[]>([]);
  const [state, setState] = React.useState<DshPartnerCategoriesState>('loading');
  const [refreshToken, setRefreshToken] = React.useState(0);

  const refresh = React.useCallback(() => setRefreshToken((t) => t + 1), []);

  React.useEffect(() => {
    if (!storeId || !client) return;
    setState('loading');
    client
      .listCategories(storeId, { limit: 100 })
      .then((resp) => {
        const cats = resp.categories ?? [];
        setCategories(cats);
        setState(cats.length === 0 ? 'empty' : 'ready');
      })
      .catch(() => setState('error'));
  }, [client, storeId, refreshToken]);

  const createCategory = React.useCallback(async (sid: string, req: DshCreateCategoryRequest) => {
    if (!client) return;
    await client.createCategory(sid, req);
    setRefreshToken((t) => t + 1);
  }, [client]);

  const updateCategory = React.useCallback(async (categoryId: string, req: DshUpdateCategoryRequest) => {
    if (!client) return;
    await client.updateCategory(categoryId, req);
    setRefreshToken((t) => t + 1);
  }, [client]);

  const deleteCategory = React.useCallback(async (categoryId: string) => {
    if (!client) return;
    await client.deleteCategory(categoryId);
    setRefreshToken((t) => t + 1);
  }, [client]);

  return { categories, state, createCategory, updateCategory, deleteCategory, refresh };
}
