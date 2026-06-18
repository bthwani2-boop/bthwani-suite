/**
 * CENTRAL CATALOG ADAPTER — DEV_ONLY adapter (not UI preview mode)
 * Owner: dsh/frontend/shared/catalog (topic-owned adapter)
 * Purpose: Map archived seed catalog data to surface-specific view models.
 *
 * SCAFFOLD: not runtime truth, not backend/API binding source.
 * Used as offline fallback when API unreachable. Surfaces consume through this adapter only — they do NOT own identity.
 *
 * Runtime catalog identity must come from DSH API, not archived seed files.
 * Runtime media must come from DSH media assets, not archived seed assets.
 */

import type { StoreItemsByStoreId } from '../products';
import type { DshCatalogDomainId, DshCatalogMainCategoryId, DshCatalogSubcategoryId, DshProductFacetId } from './catalog.types';

const storeItemsByStoreId: StoreItemsByStoreId = {};
const CATEGORY_TAXONOMY_MAP: Record<string, unknown> = {};

// ── Partner inventory list item — surface-local model ──────────────────────
// Identity (name, mediaKey, categoryLabel) comes from central data.
// Surfaces own only: stock, availability, preparationNote, internalNote, partner price override.

export type CatalogPartnerInventoryItem = {
  ['name']: string;
} & {
  id: string;
  categoryLabel: string;
  mediaKey?: string;
  publishStage?: string;
  isCatalogOwned: boolean;
  catalogLinked: boolean;
  isPrivateStoreProduct: boolean;
  reviewNeeded: boolean;
  domainId?: DshCatalogDomainId;
  mainCategoryId?: DshCatalogMainCategoryId;
  subcategoryId?: DshCatalogSubcategoryId;
  facetTags?: DshProductFacetId[];
  priceLabel: string;
  stockCount: number;
  available: boolean;
  lowStock: boolean;
};

type CategoryTaxonomy = {
  domainId?: DshCatalogDomainId;
  mainCategoryId?: DshCatalogMainCategoryId;
  subcategoryId?: DshCatalogSubcategoryId;
  facetTags?: DshProductFacetId[];
};

function resolvePublishStageOwnership(publishStage?: string): Pick<
  CatalogPartnerInventoryItem,
  'isCatalogOwned' | 'catalogLinked' | 'reviewNeeded'
> {
  const owned =
    publishStage === 'client-visible' ||
    publishStage === 'catalog-adopted' ||
    publishStage === 'published-preview';
  return {
    isCatalogOwned: owned,
    catalogLinked: owned || publishStage === 'partner-review' || publishStage === 'marketing-review',
    reviewNeeded: publishStage !== 'client-visible' && publishStage !== 'published-preview',
  };
}

/**
 * Build partner inventory items from central data (storeItemsByStoreId).
 * Returned items use identity from central data.
 * Partner-local overrides (stock, price, availability) are seeded with sensible defaults.
 *
 * SCAFFOLD — not runtime truth.
 */
export function buildCentralPartnerInventoryItems(
  storeItems: StoreItemsByStoreId = storeItemsByStoreId,
): CatalogPartnerInventoryItem[] {
  const seen = new Set<string>();
  const result: CatalogPartnerInventoryItem[] = [];

  for (const items of Object.values(storeItems)) {
    for (const item of items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);

      const taxonomy = ((CATEGORY_TAXONOMY_MAP as Record<string, unknown>)[item.categoryId] ?? {}) as { domainId?: string; mainCategoryId?: string; subcategoryId?: string; facetTags?: readonly string[] };
      const ownershipFlags = resolvePublishStageOwnership(item.publishStage);

      if (
        (item.publishStage === 'marketing-review' || item.publishStage === 'partner-review') &&
        item.mediaPolicy !== 'partner-owned-exception'
      ) {
        continue;
      }

      const partnerItem = {
        ['name']: item.name,
        categoryLabel: item.categoryLabel,
        mediaKey: item.mediaKey,
        publishStage: item.publishStage,
        isCatalogOwned: ownershipFlags.isCatalogOwned,
        catalogLinked: ownershipFlags.catalogLinked,
        reviewNeeded: ownershipFlags.reviewNeeded,
        isPrivateStoreProduct: false,
        domainId: taxonomy.domainId,
        mainCategoryId: taxonomy.mainCategoryId,
        subcategoryId: taxonomy.subcategoryId,
        facetTags: taxonomy.facetTags,
        priceLabel: item.priceLabel ?? '0.00 ر.ي',
        stockCount: ownershipFlags.isCatalogOwned ? 20 : 0,
        available: item.isAvailable ?? ownershipFlags.isCatalogOwned,
        lowStock: false,
      };

      result.push({
        ['id']: item.id,
        ...partnerItem,
      } as CatalogPartnerInventoryItem);
    }
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartnerInventoryDetail = Record<string, any>;
export const CENTRAL_PRODUCT_DETAIL_LOOKUP: Record<string, PartnerInventoryDetail> = {};
const dshCategoryData: { id: string; subcategories: { id: string }[] }[] = [];

export function getProductCategoryPath(categoryId: string): { main: string; sub?: string } {
  for (const cat of dshCategoryData) {
    if (cat.id === categoryId) {
      return { main: cat.id };
    }
    const sub = cat.subcategories.find((s) => s.id === categoryId);
    if (sub) {
      return { main: cat.id, sub: sub.id };
    }
  }

  if (categoryId === 'fresh' || categoryId === 'dairy' || categoryId === 'bakery') {
    let sub: string | undefined = undefined;
    if (categoryId === 'fresh') sub = 'grocery_vegetables_fruits';
    else if (categoryId === 'dairy') sub = 'grocery_dairy';
    else if (categoryId === 'bakery') sub = 'grocery_bakeries';
    return { main: 'grocery', sub };
  } else if (categoryId === 'meals' || categoryId === 'sides' || categoryId === 'drinks') {
    let sub: string | undefined = undefined;
    if (categoryId === 'meals') sub = 'res_meals';
    return { main: 'restaurants', sub };
  } else if (categoryId === 'sweets' || categoryId === 'dessert') {
    return { main: 'sweets_juices', sub: 'sweets_juices_sweets' };
  }

  return { main: 'grocery' };
}

export function deriveProductSku(productId: string): string {
  return productId.toUpperCase().replace('ITEM-', 'BTH-');
}

export function deriveProductGtin(productId: string): string | undefined {
  return productId === 'item-apple-1' ? '6281000000012' : undefined;
}

export function getSubcategoryClassifications(subcategoryId: string) {
  return [
    {
      id: `classif-main-${subcategoryId}-1`,
      label: 'تصنيف رئيسي 1',
      subClassifications: [
        { id: `classif-sub-${subcategoryId}-1a`, label: 'تصنيف فرعي أ' },
        { id: `classif-sub-${subcategoryId}-1b`, label: 'تصنيف فرعي ب' }
      ]
    },
    {
      id: `classif-main-${subcategoryId}-2`,
      label: 'تصنيف رئيسي 2',
      subClassifications: []
    }
  ];
}
