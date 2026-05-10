/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const dshStoreFixturesDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  timezoneSemantics: 'not_applicable',
} as const;

export * from './types';
export * from './discoveryFixtures';
export * from './itemsFixtures';
export * from './builders';
