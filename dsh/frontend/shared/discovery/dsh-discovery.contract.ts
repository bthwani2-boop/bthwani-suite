/**
 * DSH discovery/home surface shared types.
 * These are shared type contracts used across DSH surfaces.
 * DiscoveryFilter is used in the live typed client (dsh-discovery-stores-client.ts).
 *
 * Owner: dsh/frontend/shared
 * Not an API source — types only. The live source of truth is the DSH backend via OpenAPI.
 */

export const dshDiscoveryContractMeta = {
  dataKind: 'SHARED_TYPES',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

/** Service identifiers shown in the home service dial. */
export type DshServiceId = 'dsh' | 'knz' | 'amn' | 'arb' | 'wlt' | 'esf' | 'kwd' | 'mrf' | 'snd';

/** Discovery/store-list filter values used in home and store-list surfaces. */
export type DiscoveryFilter = 'all' | 'favorites' | 'nearest' | 'new' | 'offers';
