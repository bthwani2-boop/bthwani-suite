/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const dshStoreFixturesDataContract = {
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
} from './types';
export {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  buildersDataContract,
} from './builders';
export {
  dshDiscoveryStores,
  dshDiscoveryStoresDataContract,
} from './discoveryFixtures';
export {
  itemsFixturesDataContract,
  storeItemsByStoreId,
} from './itemsFixtures';
