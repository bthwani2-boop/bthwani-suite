// DSH Adapters — data mappers, operational adapters, commercial feature mapping
export * from './dsh-operational-summary-adapter';
export * from './dsh-operational-runtime-adapter';
export * from './dsh-store-builders';
export * from './dsh-color-resolver';
export * from './catalog-central-adapter';
export type {
  CommercialSource,
  CommercialSourceMap,
  StoreCommercialContext,
  CommercialBadge,
} from './store-card-commercial-map';
export { mapStoreCommercialFeatures, conflictList } from './store-card-commercial-map';
export * from './dsh-price-format';
export * from './home-service-config';
