/**
 * UI_PREVIEW_ONLY: DSH Field app store-visit shared types.
 * These are preview-neutral contracts used by dsh/frontend/data fixtures.
 * Moved here from dsh/frontend/app-field/types/DshFieldStoreVisitTypes to
 * correct the dependency direction: data must not import from surface directories.
 *
 * Owner: dsh/frontend/shared
 * Not a runtime binding — not API/backend source.
 */

export const dshFieldVisitContractMeta = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

export type DshFieldStoreVisitState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldVisitEvidenceItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  capturedAtLabel: string;
};

export type DshFieldStoreVisitValues = {
  visitSummary: string;
  followUpAction: string;
};

export type DshFieldStoreVisitErrors = Partial<Record<keyof DshFieldStoreVisitValues, string>>;
