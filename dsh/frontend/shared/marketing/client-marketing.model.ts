// Canonical location: dsh/frontend/shared/marketing/client-marketing.model.ts
// Authority: dsh/frontend/shared/marketing — client marketing state topic model.
// No JSX. No ui-kit. No Tamagui.

import { useDshClientMarketingState } from './marketing.client-state';

type HasStoreFn = (storeId?: string) => boolean;
type HasStoreCategoryFn = (storeId?: string, categoryId?: string) => boolean;
type HasProductFn = (storeId?: string, productId?: string) => boolean;

type UseDshClientMarketingModelOptions = {
  hasStoreTarget: HasStoreFn;
  hasStoreCategoryTarget: HasStoreCategoryFn;
  hasProductTarget: HasProductFn;
};

export function useDshClientMarketingModel(options: UseDshClientMarketingModelOptions) {
  return useDshClientMarketingState(options);
}
