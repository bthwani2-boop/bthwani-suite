import { dshDiscoveryStores } from './stores.preview-data';

export const dshBranchesPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

export type DshPreviewBranch = {
  id: string;
  storeId: string;
  label: string;
  zoneLabel?: string;
};

export const dshPreviewBranches: readonly DshPreviewBranch[] = dshDiscoveryStores.map((store) => ({
  id: `${store.id}-main`,
  storeId: store.id,
  label: `${store.name} — الفرع الرئيسي`,
  zoneLabel: store.areaLabel,
}));

export function getDshPreviewBranch(branchId: string) {
  return dshPreviewBranches.find((branch) => branch.id === branchId) ?? null;
}
