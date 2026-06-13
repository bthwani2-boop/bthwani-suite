import * as React from 'react';
import type { DshStoreMenuItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import type { DshStoreSearchCategory } from '../shared/store-search-helpers';
import { buildStoreSearchCategories } from '../shared/store-search-helpers';
import { getAllDeliveryModes } from '../shared/store-formatting';
import { getDshFulfillmentDeliveryModeMeta } from '../contracts/dsh-client-binding.contracts';
import { canRenderInClientSurface } from '../../shared/workflow';

type StoreDeliveryModeOption = {
  id: DshFulfillmentDeliveryMode;
  label: string;
  icon: string;
};

type UseStoreDerivedItemsParams = {
  menuItems?: DshStoreGetMenuItem[];
  storeCategories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
  storeDeliveryModes?: Array<{ id: DshFulfillmentDeliveryMode; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
  favoriteIds: ReadonlySet<string>;
};

type UseStoreDerivedItemsResult = {
  clientVisibleItems: DshStoreGetMenuItem[];
  categories: DshStoreSearchCategory[];
  deliveryModes: StoreDeliveryModeOption[];
};

/**
 * Derives filtered item list, search categories, and delivery modes from store props.
 * Pure data hook â€” no JSX, no react-native UI imports.
 * Caller holds useStoreState() to avoid duplicate state instances.
 */
export function useStoreDerivedItems({
  menuItems,
  storeCategories,
  storeDeliveryModes,
  favoriteIds,
}: UseStoreDerivedItemsParams): UseStoreDerivedItemsResult {
  const resolvedMenuItems = React.useMemo<DshStoreGetMenuItem[]>(
    () => menuItems ?? [],
    [menuItems],
  );

  const clientVisibleItems = React.useMemo(
    () =>
      resolvedMenuItems.filter(
        (item) =>
          item.isAvailable !== false &&
          canRenderInClientSurface(item.publishStage, 'product'),
      ),
    [resolvedMenuItems],
  );

  const categories = React.useMemo(
    () =>
      buildStoreSearchCategories({
        storeCategories,
        clientVisibleItems,
        favoriteIds,
      }),
    [clientVisibleItems, favoriteIds, storeCategories],
  );

  const deliveryModes = React.useMemo<StoreDeliveryModeOption[]>(() => {
    if (storeDeliveryModes?.length) {
      return storeDeliveryModes
        .filter((m) => m.isAvailable)
        .map((m) => {
          const meta = getDshFulfillmentDeliveryModeMeta(m.id);
          return { id: m.id, label: meta.label, icon: meta.icon };
        });
    }
    return getAllDeliveryModes();
  }, [storeDeliveryModes]);

  return { clientVisibleItems, categories, deliveryModes };
}
