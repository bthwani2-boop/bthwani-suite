/**
 * UI_PREVIEW_ONLY: DSH stores, discovery, and items consolidated fixtures.
 * Merged from: store.preview-data.ts + discovery.preview-data.ts + items.preview-data.ts
 * Owner: dsh/frontend/data
 */

// Re-export all discovery + items content (canonical SSoT files kept intact)
export * from './discovery.preview-data';
export * from './items.preview-data';

// Store domain type re-exports from shared (consolidated from store.preview-data.ts)
export type {
  DshDiscoveryStore,
  DshStoreFixtureItem,
  MeasurementOption,
  StoreItemsByStoreId,
} from '../shared/dshStoreProductCardModel';
export {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  dshStoreBuildersContractMeta as buildersDataContract,
} from '../shared/dsh-store-builders';

export const dshStoresPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;
