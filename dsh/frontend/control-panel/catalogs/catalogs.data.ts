/**
 * DSH Catalog Control-Panel View Models
 * Owner: control-panel/catalogs (governance/approval/mapping consumer)
 *
 * Runtime truth: DSH backend API (products/categories via dsh-product-api.client.ts).
 * This file provides: type definitions + preview-data fallback for offline/dev mode.
 * When NEXT_PUBLIC_DSH_API_BASE_URL is set, live data is fetched instead.
 *
 * Preview fallback sources (DEV_ONLY):
 *   Categories: dsh/frontend/data/categories.preview-data.ts
 *   Products:   dsh/frontend/data/products.preview-data.ts
 *
 * control-panel/catalogs is a governance/approval/mapping consumer.
 * It does NOT add canonical products or categories locally.
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
  ['id']: string;
  ['label']: string;
  emojiFallback?: string;
  imageUri?: string;
  mediaKey?: string;
};

export type CatalogMainClassification = {
  ['id']: string;
  ['label']: string;
  emojiFallback?: string;
  imageUri?: string;
  mediaKey?: string;
  subClassifications?: CatalogSubClassification[];
};

export type CatalogSubCategory = {
  ['id']: string;
  ['label']: string;
  subtitle: string;
  emojiFallback?: string;
  imageUri?: string;
  mediaKey?: string;
  mainClassifications?: CatalogMainClassification[];
};

export type CatalogCategoryMode = 'catalog-based' | 'manual-order';

export type CatalogMainCategory = {
  ['id']: string;
  ['label']: string;
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
  ['id']: string;
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
  ['id']: string;
  ['name']: string;
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
  partnerId?: string;
};

function resolveCatalogMediaPolicy(value: string | undefined): CatalogMediaPolicy {
  switch (value) {
    case 'catalog-owned-media':
    case 'partner-owned-exception':
    case 'partner-proposed-review':
    case 'marketing-enhancement-required':
      return value;
    default:
      return 'catalog-owned-media';
  }
}

import { dshCategoryFixtures } from '../../data/categories.preview-data';
import { dshCommonMediaKeyOptions } from '../../data/media.preview-data';
import {
  storeItemsByStoreId,
  dshCatalogMetrics,
  dshCatalogSmartFilters,
  dshCatalogApprovalQueues,
} from '../../data/products.preview-data';
import {
  getProductCategoryPath,
  deriveProductSku,
  deriveProductGtin,
  getSubcategoryClassifications,
} from '../../shared/catalog-central-adapter';

export { dshCatalogMetrics, dshCatalogSmartFilters, dshCatalogApprovalQueues };

export const dshCatalogCategories: CatalogMainCategory[] = dshCategoryFixtures.map((c) => {
  return {
    id: c.id,
    label: c.label,
    subtitle: c.subtitle,
    emojiFallback: c.emojiFallback || '📦',
    mediaKey: c.mediaKey,
    imageUri: c.imageUri,
    defaultMediaPolicy: 'catalog-owned-media',
    renderMode: c.renderMode,
    categoryMode: c.isManualLike ? 'manual-order' : 'catalog-based',
    subcategories: c.subcategories.map((sub) => {
      return {
        id: sub.id,
        label: sub.label,
        subtitle: sub.subtitle,
        mediaKey: sub.mediaKey,
        imageUri: sub.imageUri,
        mainClassifications: getSubcategoryClassifications(sub.id)
      };
    })
  };
});


// Deduplicate products by ID
const allProductsMap = new Map<string, CatalogProductMaster>();

Object.entries(storeItemsByStoreId).forEach(([_storeId, items]) => {
  items.forEach((item) => {
    const path = getProductCategoryPath(item.categoryId);
    const sku = deriveProductSku(item.id);
    const gtin = deriveProductGtin(item.id);

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

    const product: CatalogProductMaster = {
      id: item.id,
      name: item.name,
      sku: sku,
      gtin: gtin,
      barcode: gtin,
      measurementUnit: item.measurementType === 'weight' ? '1 كجم' : '1 حبة',
      categoryPath: {
        main: path.main,
        sub: path.sub,
        mainClassification: path.sub ? `classif-main-${path.sub}-1` : undefined,
        subClassification: path.sub ? `classif-sub-${path.sub}-1a` : undefined,
      },
      price: parseFloat(item.priceLabel ?? '') || 15,
      mediaPolicy: resolveCatalogMediaPolicy(item.mediaPolicy),
      approvalStage: approvalStage,
      sourceSurface:
        item.id.includes('restaurant') || item.id.includes('grocery') || item.id.includes('exception') || item.id.includes('sweets') || item.id.includes('dates')
          ? 'partner'
          : item.id.includes('croissant') || item.id.includes('salad')
            ? 'field'
            : 'catalog',
      surfaces: ['client', 'partner'],
      imageUri: item.imageUri,
      mediaKey: item.mediaKey,
      emojiFallback: item.name[0],
      partnerId: _storeId,
    };

    if (!allProductsMap.has(product.id)) {
      allProductsMap.set(product.id, product);
    }
  });
});

export const dshCatalogProducts: CatalogProductMaster[] = Array.from(allProductsMap.values());

export const DSH_COMMON_MEDIA_KEYS = dshCommonMediaKeyOptions;
