/**
 * CENTRAL CATALOG ADAPTER — UI_PREVIEW_ONLY
 * Owner: dsh/frontend/shared (shared adapter layer)
 * Purpose: Map central data (dsh/frontend/data) to surface-specific view models.
 *
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API binding source.
 * Surfaces consume through this adapter only — they do NOT own identity.
 *
 * Client app was the donor/reference for current correct preview data.
 * Central data owner: dsh/frontend/data/products.preview-data.ts
 * Central categories owner: dsh/frontend/data/categories.preview-data.ts
 * Media owner: dsh/frontend/media-fixtures (via resolve-dsh-image-source.ts)
 */

import { storeItemsByStoreId } from '../data/products.preview-data';
import type { StoreItemsByStoreId } from './dshStoreProductCardModel';

import type { DshCatalogDomainId, DshCatalogMainCategoryId, DshCatalogSubcategoryId, DshProductFacetId } from './catalog';

// ── Partner inventory list item — surface-local model ──────────────────────
// Identity (name, mediaKey, categoryLabel) comes from central data.
// Surfaces own only: stock, availability, preparationNote, internalNote, partner price override.

export type CatalogPartnerInventoryItem = {
  id: string;
  // Identity from central data — do NOT override in surfaces
  name: string;
  categoryLabel: string;
  mediaKey?: string;
  // Catalog status from central pipeline
  publishStage?: string;
  isCatalogOwned: boolean;
  catalogLinked: boolean;
  isPrivateStoreProduct: boolean;
  reviewNeeded: boolean;
  domainId?: DshCatalogDomainId;
  mainCategoryId?: DshCatalogMainCategoryId;
  subcategoryId?: DshCatalogSubcategoryId;
  facetTags?: DshProductFacetId[];
  // Partner-local overrideable fields
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

const CATEGORY_TAXONOMY_MAP: Record<string, CategoryTaxonomy> = {
  fresh: { domainId: 'grocery', mainCategoryId: 'meals', subcategoryId: 'salads', facetTags: ['fresh', 'vegetarian'] },
  dairy: { domainId: 'grocery', mainCategoryId: 'health', facetTags: ['halal'] },
  bakery: { domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'breads', facetTags: ['premium'] },
  meals: { domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'chicken', facetTags: ['halal'] },
  healthy: { domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'salads', facetTags: ['vegetarian'] },
  sweets: { domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'sweets', facetTags: ['premium'] },
  dessert: { domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'cakes' },
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
 * UI_PREVIEW_ONLY — not runtime truth.
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

      const taxonomy = CATEGORY_TAXONOMY_MAP[item.categoryId] ?? {};
      const ownershipFlags = resolvePublishStageOwnership(item.publishStage);

      // Skip visibility-test items (marketing-review / partner-review without exception)
      // They exist in data for pipeline testing only and should not appear in partner inventory.
      if (
        (item.publishStage === 'marketing-review' || item.publishStage === 'partner-review') &&
        item.mediaPolicy !== 'partner-owned-exception'
      ) {
        continue;
      }

      result.push({
        id: item.id,
        // Identity — from central data, not overridden
        name: item.name,
        categoryLabel: item.categoryLabel,
        mediaKey: item.mediaKey,
        // Catalog pipeline
        publishStage: item.publishStage,
        ...ownershipFlags,
        isPrivateStoreProduct: false,
        // Taxonomy (partner inventory hierarchy)
        ...taxonomy,
        // Partner-local defaults — surfaces override these, not identity
        priceLabel: item.priceLabel ?? '0.00 ر.ي',
        stockCount: ownershipFlags.isCatalogOwned ? 20 : 0,
        available: item.isAvailable ?? ownershipFlags.isCatalogOwned,
        lowStock: false,
      });
    }
  }

  return result;
}

/**
 * Partner inventory detail record — partner-local operational data.
 * These are partner surface overrides only (sku, gtin, notes).
 * They do NOT own canonical product identity.
 */
export type PartnerInventoryDetail = {
  id: string;
  sku: string;
  gtin?: string;
  barcode?: string;
  manufacturerCode?: string;
  internalNote?: string;
  preparationNote?: string;
};

/**
 * Seed detail records for central products.
 * Owner: app-partner surface — partner operational data only.
 * PREVIEW_DERIVED_ONLY: not canonical, not runtime binding.
 */
export const CENTRAL_PRODUCT_DETAIL_LOOKUP: Record<string, PartnerInventoryDetail> = {
  // store-1001 items
  'item-apple-1': { id: 'item-apple-1', sku: 'BTH-GRO-FR-001', gtin: '6281000000012', barcode: '6281000000012', manufacturerCode: 'MFR-SL-44' },
  'item-milk-1': { id: 'item-milk-1', sku: 'BTH-GRO-DA-001', gtin: '6280001000445', barcode: '6280001000445', manufacturerCode: 'MFR-DA-01' },
  'item-bread-1': { id: 'item-bread-1', sku: 'BTH-GRO-BK-001', gtin: '6280001000308', barcode: '6280001000308', manufacturerCode: 'MFR-SA-03' },
  'item-yogurt-1': { id: 'item-yogurt-1', sku: 'BTH-GRO-DA-002', gtin: '6280001000112', barcode: '6280001000112', manufacturerCode: 'MFR-DA-02' },
  'item-croissant-2': { id: 'item-croissant-2', sku: 'BTH-BAK-001', gtin: '6280001000551', barcode: '6280001000551', manufacturerCode: 'MFR-BKR-05' },
  'item-chicken-2': { id: 'item-chicken-2', sku: 'BTH-RES-001', gtin: '6280001000148', barcode: '6280001000148', manufacturerCode: 'MFR-CH-14' },
  'item-salad-2': { id: 'item-salad-2', sku: 'BTH-RES-SL-001', gtin: '6280001000223', barcode: '6280001000223', manufacturerCode: 'MFR-SD-22' },
  'item-choco-2': { id: 'item-choco-2', sku: 'BTH-SWT-001', gtin: '6280001000551', barcode: '6280001000551', manufacturerCode: 'MFR-BKR-05', internalNote: 'يرجى تحديث صورة المنتج بدقة أعلى.' },
  // store-1002 items
  'item-croissant-1': { id: 'item-croissant-1', sku: 'BTH-BAK-002', gtin: '6280001000188', barcode: '6280001000188', manufacturerCode: 'MFR-BKR-06' },
  'item-cake-1': { id: 'item-cake-1', sku: 'BTH-SWT-002', gtin: '6280001000902', barcode: '6280001000902', manufacturerCode: 'MFR-DR-90' },
  'item-roll-1': { id: 'item-roll-1', sku: 'BTH-BAK-003', gtin: '6280001000317', barcode: '6280001000317', manufacturerCode: 'MFR-BK-31' },
  'item-choco-1': { id: 'item-choco-1', sku: 'BTH-SWT-003', gtin: '6280001000419', barcode: '6280001000419', manufacturerCode: 'MFR-SW-41' },
  // store-1003 items
  'item-pasta-1': { id: 'item-pasta-1', sku: 'BTH-RES-003', gtin: '6280001000223', barcode: '6280001000223', manufacturerCode: 'MFR-SD-22' },
  'item-salad-1': { id: 'item-salad-1', sku: 'BTH-RES-SL-002', gtin: '6280001000227', barcode: '6280001000227', manufacturerCode: 'MFR-SD-23' },
  'item-chicken-1': { id: 'item-chicken-1', sku: 'BTH-RES-002', gtin: '6280001000018', barcode: '6280001000018', manufacturerCode: 'MFR-CL-01' },
  // canonical field-lead-5
  'canonical-product-field-lead-5-featured': { id: 'canonical-product-field-lead-5-featured', sku: 'LEAD5-DATES-BOX', gtin: '6280001055001', barcode: '6280001055001', manufacturerCode: 'FIELD-LEAD5-01', internalNote: 'منتج ميداني افتتاحي — بانتظار مراجعة التسويق.' },
};
