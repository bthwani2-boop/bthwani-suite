/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const storeFixturesDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  timezoneSemantics: 'not_applicable',
} as const;

export * from './dshStoreFixtures';
