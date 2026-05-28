export type FilterType = 'all' | 'active' | 'review' | 'conflict' | 'master' | 'partner' | 'needs-link' | 'needs-image';

import type { CatalogApprovalStage, CatalogMediaPolicy, CatalogProductMaster } from './catalogs.data';
import type {
  CatalogPreviewProposal,
  CatalogPreviewProposalStatus,
  CatalogPreviewProposalType,
} from './catalog-workspace.types';

export const initialColumnFilters = {
  name: [],
  category: [],
  classification: [],
  sku: [],
  price: [],
  policy: [],
  status: [],
  source: [],
  categoryMode: [],
} satisfies Record<string, string[]>;

export type CatalogFilterColumnId = keyof typeof initialColumnFilters;

export const catalogMediaPolicyOptions = [
  'catalog-owned-media',
  'partner-owned-exception',
  'partner-proposed-review',
  'marketing-enhancement-required',
] as const satisfies readonly CatalogMediaPolicy[];

export const catalogApprovalStageOptions = [
  'catalog-draft',
  'catalog-approved',
  'partner-proposed',
  'partner-review',
  'marketing-review',
  'catalog-adopted',
  'client-visible',
] as const satisfies readonly CatalogApprovalStage[];

export function toCatalogMediaPolicy(value: string, fallback: CatalogMediaPolicy): CatalogMediaPolicy {
  switch (value) {
    case 'catalog-owned-media':
    case 'partner-owned-exception':
    case 'partner-proposed-review':
    case 'marketing-enhancement-required':
      return value;
    default:
      return fallback;
  }
}

export function toCatalogApprovalStage(value: string, fallback: CatalogApprovalStage): CatalogApprovalStage {
  switch (value) {
    case 'catalog-draft':
    case 'catalog-approved':
    case 'partner-proposed':
    case 'partner-review':
    case 'marketing-review':
    case 'catalog-adopted':
    case 'client-visible':
      return value;
    default:
      return fallback;
  }
}

export type CatalogTaxonomyNodeType = 'main' | 'sub' | 'mainClassif' | 'subClassif';

export type CatalogTaxonomyNodeRef = {
  type: CatalogTaxonomyNodeType;
  mainId: string;
  subId?: string;
  mainClassifId?: string;
  subClassifId?: string;
};

export type CatalogEditEntry = CatalogTaxonomyNodeRef;

const proposalTypeByPatchKey: Record<string, CatalogPreviewProposalType> = {
  price: 'price-change',
  mediaPolicy: 'media-policy-change',
  mediaKey: 'media-policy-change',
  imageUri: 'media-policy-change',
  categoryPath: 'category-change',
  conflictReason: 'conflict-resolution',
  approvalStage: 'visibility-change',
  gtin: 'barcode-reservation',
  barcode: 'barcode-reservation',
};

export function createCatalogPreviewProposal(params: {
  productId?: string;
  productIds?: readonly string[];
  label: string;
  note: string;
  type?: CatalogPreviewProposalType;
  status?: CatalogPreviewProposalStatus;
  apiBoundary?: string;
}): CatalogPreviewProposal {
  const target = params.productId ?? params.productIds?.join('-') ?? 'catalogs';
  return {
    id: `proposal-${params.type ?? 'edit-product'}-${target}-${Date.now()}`,
    type: params.type ?? 'edit-product',
    productId: params.productId,
    productIds: params.productIds,
    label: params.label,
    status: params.status ?? 'ready-for-api',
    owner: 'control-panel-catalogs',
    note: `UI_PREVIEW_ONLY | ${params.note}`,
    apiBoundary: params.apiBoundary,
  };
}

export function createCatalogProductPatchProposal(params: {
  product: CatalogProductMaster;
  patchKeys: readonly string[];
  label: string;
  note: string;
  apiBoundary?: string;
}): CatalogPreviewProposal {
  const type = params.patchKeys.map((key) => proposalTypeByPatchKey[key]).find(Boolean) ?? 'edit-product';
  return createCatalogPreviewProposal({
    productId: params.product.id,
    type,
    label: params.label,
    note: params.note,
    apiBoundary: params.apiBoundary ?? 'PATCH /catalog/products/{id}',
  });
}
