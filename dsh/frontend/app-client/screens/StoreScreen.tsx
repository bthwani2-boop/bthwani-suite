import * as React from 'react';
import { useDirection } from '@bthwani/ui-kit';
import { StoreScreenShell, type DshStoreGetScreenProps, type DshStoreGetScreenShellProps } from '../parts/store/StoreScreenShell';

import { useStoreState } from '../hooks/useStoreState';
import { useStoreDerivedItems } from '../hooks/useStoreDerivedItems';
import { useDebounce } from '../hooks/useDebounce';
import { resolveStoreItemsForCategory } store-search-helpers';

export const DshStoreGetScreen = React.memo(function DshStoreGetScreenComponent(props: DshStoreGetScreenProps) {
  const storeState = useStoreState();
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  const derivedItems = useStoreDerivedItems({
    menuItems: props.menuItems ?? [],
    storeCategories: props.store?.categories,
    storeDeliveryModes: props.store?.deliveryModes,
    favoriteIds: storeState.favoriteIds,
  });

  const debouncedHeaderSearchQuery = useDebounce(storeState.headerSearchQuery, 250);

  const resolveItemsForCategory = React.useCallback((categoryId: string) => {
    return resolveStoreItemsForCategory({
      categoryId,
      clientVisibleItems: derivedItems.clientVisibleItems,
      favoriteIds: storeState.favoriteIds,
      query: debouncedHeaderSearchQuery,
    });
  }, [derivedItems.clientVisibleItems, storeState.favoriteIds, debouncedHeaderSearchQuery]);

  const visibleItems = React.useMemo(
    () => resolveItemsForCategory(storeState.selectedCategory),
    [resolveItemsForCategory, storeState.selectedCategory]
  );
  const viewerItems = visibleItems;

  const appearanceMode = props.appearanceMode ?? 'lightPremium';

  const shellProps: DshStoreGetScreenShellProps = {
    ...props,
    appearanceMode,
    isRTL,
    storeState,
    derivedItems,
    visibleItems,
    viewerItems,
  };

  return <StoreScreenShell {...shellProps} />;
});

export type { DshStoreGetScreenProps, DshStoreGetScreenShellProps } from '../parts/store/StoreScreenShell';
