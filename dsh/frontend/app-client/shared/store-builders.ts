/**
 * Compatibility shim — canonical implementation moved to dsh/frontend/shared/dsh-store-builders.ts
 * to correct dependency direction: dsh/frontend/data must not import from surface directories.
 * This file re-exports everything so existing direct consumers are not broken.
 */
export {
  buildStoreCategories,
  buildStoreDeliveryModes,
  buildStoreTags,
  dshStoreBuildersContractMeta as buildersDataContract,
  type StoreDeliveryModeEntry,
} from '../../shared/dsh-store-builders';
