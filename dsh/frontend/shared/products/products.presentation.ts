import {
  ApprovalStage,
  isClientVisibleStage,
  isLegacyPublishedPreview,
  canRenderInClientSurface,
} from '../partner/partner.workflow';
import type { CommercialSourceMap } from '../marketing/store-card-commercial-map';



export type DshCanonicalSource =
  | 'app-field'
  | 'app-partner'
  | 'control-panel-partners'
  | 'marketing'
  | 'app-client'
  | 'manual';
export type DshCanonicalPublishStage = ApprovalStage | 'published-preview' | 'field-draft';
export type DshCardTone = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';


export type MeasurementOption = {
  id: string;
  label: string;
  multiplier?: number;
  unit?: string;
};

export type DshStoreMenuItem = {
  id: string;
  name: string;
  subtitle?: string;
  priceLabel?: string;
  oldPriceLabel?: string;
  discountLabel?: string;
  priceValue?: number;
  oldPriceValue?: number;
  measurementType?: 'piece' | 'weight' | 'portion';
  measurementOptions?: string[];
  measurementOptionObjects?: MeasurementOption[];
  categoryId: string;
  categoryLabel: string;
  statusLabel?: string;
  isAvailable?: boolean;
  hasOptions?: boolean;
  preparationTime?: string;
  mediaKey?: string;
  imageUri?: string;
  sourceRecordId?: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  publishStage?: string;
  source?: string;
  isNew?: boolean;
  isFavorite?: boolean;
  isFavorited?: boolean;
  mediaPolicy?: string;
};

export type StoreItemsByStoreId = Record<string, DshStoreMenuItem[]>;


export type DshCanonicalProductCard = {
  id: string;
  sourceRecordId: string;
  storeId: string;
  source: DshCanonicalSource;
  publishStage: DshCanonicalPublishStage;
  name: string;
  subtitle?: string;
  categoryId: string;
  categoryLabel: string;
  priceLabel: string;
  oldPriceLabel?: string;
  discountLabel?: string;
  priceValue?: number;
  oldPriceValue?: number;
  measurementType?: 'piece' | 'weight' | 'portion';
  measurementOptions?: string[];
  sku?: string;
  gtin?: string;
  barcode?: string;
  manufacturerCode?: string;
  stockCount?: number;
  isAvailable: boolean;
  hasOptions: boolean;
  preparationTime?: string;
  mediaKey?: string;
  imageUri?: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
};

export type DshCanonicalEvidence = {
  storeId: string;
  productId: string;
  sourceRecordId: string;
  publishStage: DshCanonicalPublishStage;
  source: DshCanonicalSource;
  storeName: string;
  productName: string;
  priceLabel: string;
};


export function normalizeCanonicalPublishStage(stage: DshCanonicalPublishStage | 'draft' | 'review' | 'published' | string | undefined): DshCanonicalPublishStage {
  switch (stage) {
    case 'partner-submitted':
    case 'field-submitted':
    case 'partner-review':
    case 'partner-approved':
    case 'marketing-review':
    case 'marketing-approved':
    case 'catalog-adopted':
    case 'client-visible':
    case 'rejected':
    case 'needs-fix':
    case 'published-preview':
    case 'field-draft':
      return stage;
    case 'published':
      return 'published-preview';
    case 'review':
      return 'partner-review';
    case 'draft':
    default:
      return 'field-draft';
  }
}

/** @deprecated Use canRenderInClientSurface instead */
export function isClientVisible(stage: string | undefined, entityType?: string, mediaPolicy?: string): boolean {
  return canRenderInClientSurface(stage, entityType as any, { mediaPolicy });
}


function cloneStringList(values: ReadonlyArray<string> | undefined) {
  return values ? [...values] : undefined;
}

export function mapCanonicalProductToStoreMenuItem(product: DshCanonicalProductCard): DshStoreMenuItem {
  return {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    priceLabel: product.priceLabel,
    oldPriceLabel: product.oldPriceLabel,
    discountLabel: product.discountLabel,
    priceValue: product.priceValue,
    oldPriceValue: product.oldPriceValue,
    measurementType: product.measurementType,
    measurementOptions: cloneStringList(product.measurementOptions),
    categoryId: product.categoryId,
    categoryLabel: product.categoryLabel,
    statusLabel: product.isAvailable ? 'متاح الآن' : 'غير متاح',
    isAvailable: product.isAvailable,
    hasOptions: product.hasOptions,
    preparationTime: product.preparationTime,
    mediaKey: product.mediaKey,
    imageUri: product.imageUri,
    sourceRecordId: product.sourceRecordId,
    canonicalStoreId: product.canonicalStoreId,
    canonicalProductId: product.canonicalProductId,
    publishStage: product.publishStage,
    source: product.source,
  };
}


// --- DSH Approval Pipeline SSOT v1 Bridge ---
export type DshStoreProductCardApprovalState = {
  stage: ApprovalStage;
};
