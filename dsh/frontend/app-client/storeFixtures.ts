/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const storeFixturesDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  timezoneSemantics: 'not_applicable',
} as const;

export type {
  DshDiscoveryStore,
  DshStoreFixtureItem,
  MeasurementOption,
  StoreItemsByStoreId,
} from './dshStoreFixtures';
export {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  buildersDataContract,
  dshDiscoveryStores,
  dshDiscoveryStoresDataContract,
  itemsFixturesDataContract,
  storeItemsByStoreId,
} from './dshStoreFixtures';
