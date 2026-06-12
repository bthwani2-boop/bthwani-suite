/**
 * CENTRAL CATALOG ADAPTER — DEV_ONLY adapter (not UI preview mode)
 * Owner: dsh/frontend/shared (shared adapter layer)
 * Purpose: Map central data (dsh/frontend/data) to surface-specific view models.
 *
 * SCAFFOLD: not runtime truth, not backend/API binding source.
 * Used as offline fallback when API unreachable. Surfaces consume through this adapter only — they do NOT own identity.
 *
 * Client app was the donor/reference for current correct preview data.
 * Central data owner: dsh/frontend/data/legacy-preview/products.preview-data.ts
 * Central categories owner: dsh/frontend/data/legacy-preview/categories.preview-data.ts
 * Media owner: dsh/frontend/media-fixtures (via resolve-dsh-image-source.ts)
 */

import { storeItemsByStoreId } from '../data/legacy-preview/products.preview-data';
import type { StoreItemsByStoreId } from './dshStoreProductCardModel';
import { CATEGORY_TAXONOMY_MAP } from '../data/legacy-preview/categories.preview-data';

import type { DshCatalogDomainId, DshCatalogMainCategoryId, DshCatalogSubcategoryId, DshProductFacetId } from './catalog';

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

// ── Category ID → partner inventory taxonomy mapping ───────────────────────
// Maps the store-item categoryIds (from central products data) to the
// DshCatalogDomainId / DshCatalogMainCategoryId used in InventoryCatalogScreen.

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

      // Skip visibility-test items (marketing-review / partner-review without exception)
      // They exist in data for pipeline testing only and should not appear in partner inventory.
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

import { dshCategoryFixtures } from '../data/legacy-preview/categories.preview-data';
import {
  type PartnerInventoryDetail,
  CENTRAL_PRODUCT_DETAIL_LOOKUP,
} from '../data/legacy-preview/partner.preview-data';

export type { PartnerInventoryDetail };
export { CENTRAL_PRODUCT_DETAIL_LOOKUP };

/**
 * Maps the category ID to a path containing main category and optional subcategory.
 * Resolves fallback mapping rules centrally.
 */
export function getProductCategoryPath(categoryId: string): { main: string; sub?: string } {
  // Try to match the item categoryId to subcategories
  for (const cat of dshCategoryFixtures) {
    if (cat.id === categoryId) {
      return { main: cat.id };
    }
    const sub = cat.subcategories.find((s) => s.id === categoryId);
    if (sub) {
      return { main: cat.id, sub: sub.id };
    }
  }

  // Fallbacks
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

/**
 * Derives SKU from product ID.
 */
export function deriveProductSku(productId: string): string {
  return productId.toUpperCase().replace('ITEM-', 'BTH-');
}

/**
 * Derives GTIN from product ID.
 */
export function deriveProductGtin(productId: string): string | undefined {
  return productId === 'item-apple-1' ? '6281000000012' : undefined;
}

/**
 * Returns default classifications for a subcategory.
 */
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
