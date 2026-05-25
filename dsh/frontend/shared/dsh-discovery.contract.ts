/**
 * UI_PREVIEW_ONLY: DSH discovery/home surface shared types.
 * These are preview-neutral contracts used by dsh/frontend/data fixtures
 * and shared across DSH surfaces without surface-specific coupling.
 *
 * Owner: dsh/frontend/shared
 * Not a runtime binding — not API/backend source.
 */

export const dshDiscoveryContractMeta = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

/** Service identifiers shown in the home service dial. */
export type DshServiceId = 'dsh' | 'knz' | 'amn' | 'arb' | 'wlt' | 'esf' | 'kwd' | 'mrf' | 'snd';

/** Discovery/store-list filter values used in home and store-list surfaces. */
export type DiscoveryFilter = 'all' | 'favorites' | 'nearest' | 'new' | 'offers';
