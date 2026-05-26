/**
 * DSH Catalog Control-Panel View Models — UI_PREVIEW_ONLY
 * Owner: control-panel/catalogs (governance/approval/mapping consumer)
 * NOT runtime truth. NOT backend/API/DB binding source.
 *
 * Identity sources:
 *   Categories: dsh/frontend/data/categories.preview-data.ts (via dshCategoryFixtures)
 *   Products:   dsh/frontend/data/products.preview-data.ts (via storeItemsByStoreId)
 *   Media:      dsh/frontend/media-fixtures (via shared/resolve-dsh-image-source.ts)
 *
 * Client app was the donor/reference for current correct preview data.
 * Surfaces consume through adapters only.
 * Surface-specific overrides must be lean and id-based.
 *
 * control-panel/catalogs is a governance/approval/mapping consumer.
 * It does NOT add canonical products or categories locally.
 * Deferred items are marked: PREVIEW_DERIVED_ONLY / DEFERRED_DATA_CENTRALIZATION
 */

export type CatalogMediaPolicy =
  | 'catalog-owned-media'
  | 'partner-owned-exception'
  | 'partner-proposed-review'
  | 'marketing-enhancement-required';

export type CatalogApprovalStage =
  | 'catalog-draft'
  | 'catalog-approved'
  | 'partner-proposed'
  | 'partner-review'
  | 'marketing-review'
  | 'catalog-adopted'
  | 'client-visible';

export type CatalogSourceSurface = 'client' | 'partner' | 'marketing' | 'field' | 'catalog';

export type CatalogSurfaceAvailability = 'client' | 'partner' | 'marketing' | 'field';

export type CatalogQuickEntryMode =
  | 'search-name'
  | 'barcode-gtin'
  | 'csv-excel-batch'
  | 'partner-menu-import'
  | 'field-suggestion'
  | 'duplicate-resolution';

export type CatalogSubClassification = {
  id: string;
  label: string;
  emojiFallback?: string;
  imageUri?: string;
  mediaKey?: string;
};

export type CatalogMainClassification = {
  id: string;
  label: string;
  emojiFallback?: string;
  imageUri?: string;
  mediaKey?: string;
  subClassifications?: CatalogSubClassification[];
};

export type CatalogSubCategory = {
  id: string;
  label: string;
  subtitle: string;
  emojiFallback?: string;
  imageUri?: string;
  mediaKey?: string;
  mainClassifications?: CatalogMainClassification[];
};

export type CatalogCategoryMode = 'catalog-based' | 'manual-order';

export type CatalogMainCategory = {
  id: string;
  label: string;
  subtitle: string;
  subcategories: CatalogSubCategory[];
  emojiFallback: string;
  imageUri?: string;
  mediaKey?: string;
  defaultMediaPolicy: CatalogMediaPolicy;
  renderMode?: 'stores' | 'manual-order';
  categoryMode?: CatalogCategoryMode;
};

export type CatalogPartnerOverride = {
  partnerId: string;
  price?: number;
  stock?: number;
  preparationTime?: string;
  isAvailable?: boolean;
};

export type CatalogCategoryProposal = {
  id: string;
  partnerId: string;
  proposedName: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
};

export type CatalogApprovalQueueItem = {
  id: string;
  productId: string;
  stage: CatalogApprovalStage;
  requestedBy: string;
};

export type CatalogSmartFilter = {
  id: string;
  label: string;
  count: number;
};

export type CatalogProductMaster = {
  id: string;
  name: string;
  sku: string;
  gtin?: string;
  barcode?: string;
  measurementUnit?: string;
  categoryPath: {
    main: string;
    sub?: string;
    mainClassification?: string;
    subClassification?: string;
  };
  price: number;
  mediaPolicy: CatalogMediaPolicy;
  approvalStage: CatalogApprovalStage;
  sourceSurface: CatalogSourceSurface;
  surfaces: CatalogSurfaceAvailability[];
  imageUri?: string;
  mediaKey?: string;
  emojiFallback?: string;
  partnerOverrides?: CatalogPartnerOverride[];
  conflictReason?: string;
  categoryType?: string; // e.g. product, service
};

// Authoritative preview catalog metrics for control-panel governance view.
// UI_PREVIEW_ONLY — not runtime truth, not backend source.
// These values reflect the full catalog scope (categories from dshCategoryFixtures,
// products from storeItemsByStoreId + canonical field products).
// NOTE: shared/catalog.ts contains a smaller stale dshCatalogMetrics — this one supersedes it.
export const dshCatalogMetrics = {
  mainCategories: 13,
  subCategories: 24,
  approvedProducts: 14500,
  pendingPartnerReviews: 42,
  pendingMarketingReviews: 18,
  priceConflicts: 7,
  imageExceptions: 124,
} as const;

export const dshCatalogSmartFilters: CatalogSmartFilter[] = [
  { id: 'all', label: 'الكل', count: 14500 },
  { id: 'master', label: 'منتجات مركزية', count: 12300 },
  { id: 'partner-exception', label: 'استثناء صورة', count: 124 },
  { id: 'partner-review', label: 'مراجعة شريك', count: 42 },
  { id: 'marketing-review', label: 'مراجعة تسويق', count: 18 },
  { id: 'price-conflict', label: 'تعارض سعر', count: 7 },
  { id: 'non-matching', label: 'غير مطابق', count: 3 },
  { id: 'category-proposals', label: 'مقترحات فئات', count: 5 },
];

export const dshCatalogApprovalQueues: CatalogApprovalQueueItem[] = [
  { id: 'q-1', productId: 'prd-sweets-cake', stage: 'marketing-review', requestedBy: 'Partner 1002' },
  { id: 'q-2', productId: 'prd-review-coffee', stage: 'partner-review', requestedBy: 'Field Agent 3' },
];

import { dshCategoryFixtures } from '../../data/categories.preview-data';
import { storeItemsByStoreId } from '../../data/products.preview-data';

export const dshCatalogCategories: CatalogMainCategory[] = dshCategoryFixtures.map((c) => {
  return {
    id: c.id,
    label: c.label,
    subtitle: c.subtitle,
    emojiFallback: c.emojiFallback || '📦',
    defaultMediaPolicy: 'catalog-owned-media',
    renderMode: c.renderMode,
    categoryMode: c.isManualLike ? 'manual-order' : 'catalog-based',
    subcategories: c.subcategories.map((sub) => {
      // Initialize with default classifications so the user has some classifications to see/edit
      const mainClassifications: CatalogMainClassification[] = [
        {
          id: `classif-main-${sub.id}-1`,
          label: 'تصنيف رئيسي 1',
          subClassifications: [
            { id: `classif-sub-${sub.id}-1a`, label: 'تصنيف فرعي أ' },
            { id: `classif-sub-${sub.id}-1b`, label: 'تصنيف فرعي ب' }
          ]
        },
        {
          id: `classif-main-${sub.id}-2`,
          label: 'تصنيف رئيسي 2',
          subClassifications: []
        }
      ];
      return {
        id: sub.id,
        label: sub.label,
        subtitle: sub.subtitle,
        mainClassifications
      };
    })
  };
});

// Deduplicate products by ID
const allProductsMap = new Map<string, CatalogProductMaster>();

Object.entries(storeItemsByStoreId).forEach(([storeId, items]) => {
  items.forEach((item) => {
    // Find main category
    let mainCat = 'grocery';
    let subCat: string | undefined = undefined;

    // Try to match the item categoryId to subcategories
    for (const cat of dshCategoryFixtures) {
      if (cat.id === item.categoryId) {
        mainCat = cat.id;
        break;
      }
      const sub = cat.subcategories.find(s => s.id === item.categoryId);
      if (sub) {
        mainCat = cat.id;
        subCat = sub.id;
        break;
      }
    }

    // If categoryId doesn't match directly, map default fallback
    if (item.categoryId === 'fresh' || item.categoryId === 'dairy' || item.categoryId === 'bakery') {
      mainCat = 'grocery';
      if (item.categoryId === 'fresh') subCat = 'grocery_vegetables_fruits';
      else if (item.categoryId === 'dairy') subCat = 'grocery_dairy';
      else if (item.categoryId === 'bakery') subCat = 'grocery_bakeries';
    } else if (item.categoryId === 'meals' || item.categoryId === 'sides' || item.categoryId === 'drinks') {
      mainCat = 'restaurants';
      if (item.categoryId === 'meals') subCat = 'res_meals';
    } else if (item.categoryId === 'sweets' || item.categoryId === 'dessert') {
      mainCat = 'sweets_juices';
      subCat = 'sweets_juices_sweets';
    }

    const approvalStage: CatalogApprovalStage =
      item.publishStage === 'client-visible' || item.publishStage === 'published-preview'
        ? 'client-visible'
        : item.publishStage === 'catalog-adopted'
          ? 'catalog-adopted'
          : item.publishStage === 'marketing-review'
            ? 'marketing-review'
            : item.publishStage === 'partner-review'
              ? 'partner-review'
              : 'catalog-draft';

    const sku = item.id.toUpperCase().replace('ITEM-', 'BTH-');
    const gtin = item.id === 'item-apple-1' ? '6281000000012' : undefined;

    const product: CatalogProductMaster = {
      id: item.id,
      name: item.name,
      sku: sku,
      gtin: gtin,
      barcode: gtin,
      measurementUnit: item.measurementType === 'weight' ? '1 كجم' : '1 حبة',
      categoryPath: {
        main: mainCat,
        sub: subCat,
        mainClassification: subCat ? `classif-main-${subCat}-1` : undefined,
        subClassification: subCat ? `classif-sub-${subCat}-1a` : undefined,
      },
      price: parseFloat(item.priceLabel ?? '') || 15,
      mediaPolicy: (item.mediaPolicy as any) || 'catalog-owned-media',
      approvalStage: approvalStage,
      sourceSurface: 'catalog',
      surfaces: ['client', 'partner'],
      imageUri: item.imageUri,
      mediaKey: item.mediaKey,
      emojiFallback: item.name[0],
    };

    if (!allProductsMap.has(product.id)) {
      allProductsMap.set(product.id, product);
    }
  });
});

// Let's add the canonical LEAD-5 featured product specifically if not present
if (!allProductsMap.has('canonical-product-field-lead-5-featured')) {
  allProductsMap.set('canonical-product-field-lead-5-featured', {
    id: 'canonical-product-field-lead-5-featured',
    name: 'علبة تمر فاخر',
    sku: 'LEAD5-DATES-BOX',
    gtin: '6280001055001',
    barcode: '6280001055001',
    measurementUnit: '1 علبة',
    categoryPath: {
      main: 'honey_dates',
      sub: undefined,
    },
    price: 55.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'marketing-review',
    sourceSurface: 'field',
    surfaces: ['partner', 'marketing', 'field'],
    imageUri: 'dsh.product.lead-5.dates-box.v1',
    mediaKey: 'dsh.product.lead-5.dates-box.v1',
    emojiFallback: 'ت',
  });
}

export const dshCatalogProducts: CatalogProductMaster[] = Array.from(allProductsMap.values());
