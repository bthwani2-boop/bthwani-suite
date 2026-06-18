import {
  getDshPartnerActivationStateMetadata,
  isDshPartnerClientVisible,
  type DshPartnerActivationStatus,
} from '../stores/partner/dsh-partner-activation.model';
import {
  getDshProductApprovalStateMetadata,
  isDshProductClientVisible,
  type DshProductIdentityApprovalStatus,
} from '../products';
import { canRenderInClientSurface } from '../stores/partner/partner.workflow';

type CampaignRecord = {
  id: string;
  status: string;
  targetType: string;
  targetId: string;
};

type LoyaltyRecord = {
  status: string;
};

type PartnerOfferRecord = {
  linkedCampaignId?: string;
  status: string;
  storeId?: string;
  productId?: string;
  category?: string;
};

type HomePromoRecord = {
  status: string;
  targetType?: string;
  actionType?: string;
  targetId?: string;
  actionTarget?: string;
};

type MarketingVideoRecord = {
  status: string;
  targetType: string;
  targetId: string;
};

export const marketingVisibilityContractMeta = {
  dataKind: 'SCAFFOLD_PENDING_BINDING',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  loyaltyBoundary: 'DSH renders loyalty summaries only and never owns WLT money truth.',
} as const;

export const DSH_LOYALTY_UI_BOUNDARY_NOTE = 'الولاء داخل DSH هو واجهة عرض وتجربة فقط، ولا يمثل حقيقة أموال أو أرصدة WLT.';

export type MarketingVisibilityContentType = 'campaign' | 'offer' | 'promo' | 'video' | 'loyalty';

export type MarketingVisibilityTargetSurface =
  | 'home'
  | 'discovery'
  | 'benefits'
  | 'store'
  | 'partner-promotions'
  | 'control-panel'
  | 'signals'
  | 'catalog'
  | 'checkout';

export type MarketingVisibilityApprovalStatus =
  | 'draft'
  | 'inbound'
  | 'eligible'
  | 'review'
  | 'marketing-ready'
  | 'active'
  | 'published'
  | 'paused'
  | 'archived'
  | 'rejected'
  | 'expired'
  | 'exhausted'
  | 'partner-review'
  | 'partner-approved'
  | 'marketing-review'
  | 'marketing-approved'
  | 'catalog-adopted'
  | 'client-visible'
  | 'needs-fix';

export type MarketingVisibilityDisplayStatus = 'visible' | 'summary-only' | 'hidden' | 'blocked';

export type MarketingRouteHint =
  | 'discovery'
  | 'store'
  | 'product'
  | 'category'
  | 'benefits'
  | 'partner-promotions'
  | 'campaigns'
  | 'signals'
  | 'catalog';

export type MarketingVisibilityRecord = {
  campaignId?: string;
  contentType: MarketingVisibilityContentType;
  targetSurface: MarketingVisibilityTargetSurface;
  linkedStoreId?: string;
  linkedProductId?: string;
  linkedCategoryId?: string;
  partnerVisibilityRequired: boolean;
  catalogPublishingRequired: boolean;
  approvalStatus: MarketingVisibilityApprovalStatus;
  displayStatus: MarketingVisibilityDisplayStatus;
  routeHint: MarketingRouteHint;
  blockedReason?: string;
};

type MarketingVisibilityInput = {
  campaignId?: string;
  contentType: MarketingVisibilityContentType;
  targetSurface: MarketingVisibilityTargetSurface;
  approvalStatus: string;
  linkedStoreId?: string;
  linkedProductId?: string;
  linkedCategoryId?: string;
  partnerStatus?: DshPartnerActivationStatus;
  productApprovalStatus?: DshProductIdentityApprovalStatus;
  publishStage?: string;
  partnerVisibilityRequired?: boolean;
  catalogPublishingRequired?: boolean;
};

type MarketingOfferVisibilityOptions = {
  targetSurface: MarketingVisibilityTargetSurface;
  partnerStatus?: DshPartnerActivationStatus;
  productApprovalStatus?: DshProductIdentityApprovalStatus;
};

type MarketingCampaignVisibilityOptions = {
  targetSurface: MarketingVisibilityTargetSurface;
  partnerStatus?: DshPartnerActivationStatus;
  productApprovalStatus?: DshProductIdentityApprovalStatus;
};

type MarketingPromoVisibilityOptions = {
  targetSurface: MarketingVisibilityTargetSurface;
  partnerStatus?: DshPartnerActivationStatus;
  productApprovalStatus?: DshProductIdentityApprovalStatus;
};

type MarketingVideoVisibilityOptions = {
  targetSurface: MarketingVisibilityTargetSurface;
  partnerStatus?: DshPartnerActivationStatus;
  productApprovalStatus?: DshProductIdentityApprovalStatus;
};

function normalizeMarketingApprovalStatus(status: string): MarketingVisibilityApprovalStatus {
  switch (status) {
    case 'draft':
    case 'inbound':
    case 'eligible':
    case 'review':
    case 'marketing-ready':
    case 'active':
    case 'published':
    case 'paused':
    case 'archived':
    case 'rejected':
    case 'expired':
    case 'exhausted':
    case 'partner-review':
    case 'partner-approved':
    case 'marketing-review':
    case 'marketing-approved':
    case 'catalog-adopted':
    case 'client-visible':
    case 'needs-fix':
      return status;
    case 'pending':
      return 'review';
    case 'published-preview':
      return 'client-visible';
    default:
      return 'draft';
  }
}

function resolveMarketingEntityType(contentType: MarketingVisibilityContentType): 'partner-offer' | 'video' | 'promo' | 'banner' | undefined {
  switch (contentType) {
    case 'offer': return 'partner-offer';
    case 'video': return 'video';
    case 'promo': return 'promo';
    case 'campaign': return 'banner';
    default: return undefined;
  }
}

function resolveMarketingPublishStage(input: MarketingVisibilityInput, approvalStatus: MarketingVisibilityApprovalStatus): string | undefined {
  if (input.publishStage) return input.publishStage;
  if (approvalStatus === 'client-visible') return 'client-visible';
  if (approvalStatus === 'catalog-adopted') return 'catalog-adopted';
  if (approvalStatus === 'marketing-approved') return 'marketing-approved';
  if (approvalStatus === 'partner-approved') return 'partner-approved';
  if (approvalStatus === 'active' || approvalStatus === 'published') return 'published-preview';
  return 'draft';
}

function resolveMarketingRouteHint(input: MarketingVisibilityInput): MarketingRouteHint {
  if (input.contentType === 'loyalty') return 'benefits';
  if (input.linkedProductId) return 'product';
  if (input.linkedStoreId) return 'store';
  if (input.linkedCategoryId) return 'category';
  if (input.targetSurface === 'partner-promotions') return 'partner-promotions';
  if (input.targetSurface === 'control-panel') return 'campaigns';
  if (input.targetSurface === 'signals') return 'signals';
  return 'discovery';
}

function resolvePartnerBlockedReason(status: DshPartnerActivationStatus | undefined): string {
  if (!status) return 'العنصر مرتبط بمتجر لكن حالة ظهور الشريك للعملاء غير مؤكدة بعد.';
  const metadata = getDshPartnerActivationStateMetadata(status);
  return `الشريك المرتبط غير ظاهر للعملاء: ${metadata.nextAction ?? status}.`;
}

function resolveProductBlockedReason(status: DshProductIdentityApprovalStatus | undefined): string {
  if (!status) return 'العنصر مرتبط بمنتج لكن حالة نشره للعملاء غير مؤكدة بعد.';
  const metadata = getDshProductApprovalStateMetadata(status);
  return `المنتج المرتبط غير منشور للعملاء: ${metadata.label}.`;
}

function resolveClientBlockedReason(
  input: MarketingVisibilityInput,
  approvalStatus: MarketingVisibilityApprovalStatus,
): string | undefined {
  if (input.contentType !== 'loyalty' && input.targetSurface === 'checkout') {
    return 'مسار checkout يبقى خالياً من placements التسويقية المزعجة.';
  }

  if (input.contentType === 'loyalty') {
    return approvalStatus === 'active' ? undefined : 'الولاء لا يظهر هنا إلا كملخص UI عندما يكون البرنامج أو الميزة نشطة.';
  }

  const publishStage = resolveMarketingPublishStage(input, approvalStatus);
  const entityType = resolveMarketingEntityType(input.contentType);
  if (!canRenderInClientSurface(publishStage, entityType)) {
    return `الحالة الحالية (${approvalStatus}) لم تصل بعد إلى بوابة client visibility.`;
  }

  const partnerVisibilityRequired = input.partnerVisibilityRequired ?? Boolean(input.linkedStoreId);
  if (partnerVisibilityRequired && !isDshPartnerClientVisible(input.partnerStatus ?? 'submitted')) {
    return resolvePartnerBlockedReason(input.partnerStatus);
  }

  const catalogPublishingRequired = input.catalogPublishingRequired ?? Boolean(input.linkedProductId);
  if (catalogPublishingRequired && !isDshProductClientVisible(input.productApprovalStatus ?? 'field_draft')) {
    return resolveProductBlockedReason(input.productApprovalStatus);
  }

  return undefined;
}

function resolveDisplayStatus(
  targetSurface: MarketingVisibilityTargetSurface,
  contentType: MarketingVisibilityContentType,
  approvalStatus: MarketingVisibilityApprovalStatus,
  blockedReason: string | undefined,
): MarketingVisibilityDisplayStatus {
  if (targetSurface === 'partner-promotions' || targetSurface === 'control-panel' || targetSurface === 'signals' || targetSurface === 'catalog') {
    if (approvalStatus === 'archived' || approvalStatus === 'expired' || approvalStatus === 'exhausted') return 'hidden';
    return 'visible';
  }

  if (blockedReason) return 'blocked';

  if (contentType === 'loyalty' || targetSurface === 'home' || targetSurface === 'discovery') {
    return 'summary-only';
  }

  return 'visible';
}

export function resolveMarketingVisibility(input: MarketingVisibilityInput): MarketingVisibilityRecord {
  const approvalStatus = normalizeMarketingApprovalStatus(input.approvalStatus);
  const blockedReason = resolveClientBlockedReason(input, approvalStatus);

  return {
    campaignId: input.campaignId,
    contentType: input.contentType,
    targetSurface: input.targetSurface,
    linkedStoreId: input.linkedStoreId,
    linkedProductId: input.linkedProductId,
    linkedCategoryId: input.linkedCategoryId,
    partnerVisibilityRequired: input.partnerVisibilityRequired ?? Boolean(input.linkedStoreId),
    catalogPublishingRequired: input.catalogPublishingRequired ?? Boolean(input.linkedProductId),
    approvalStatus,
    displayStatus: resolveDisplayStatus(input.targetSurface, input.contentType, approvalStatus, blockedReason),
    routeHint: resolveMarketingRouteHint(input),
    blockedReason,
  };
}

export function isMarketingRenderable(record: MarketingVisibilityRecord): boolean {
  if (record.blockedReason) return false;
  return record.displayStatus === 'visible' || record.displayStatus === 'summary-only';
}

export function getPartnerOfferVisibilityRecord(
  offer: PartnerOfferRecord,
  options: MarketingOfferVisibilityOptions,
): MarketingVisibilityRecord {
  return resolveMarketingVisibility({
    campaignId: offer.linkedCampaignId,
    contentType: 'offer',
    targetSurface: options.targetSurface,
    approvalStatus: offer.status,
    linkedStoreId: offer.storeId || undefined,
    linkedProductId: offer.productId || undefined,
    linkedCategoryId: offer.category || undefined,
    partnerStatus: options.partnerStatus,
    productApprovalStatus: options.productApprovalStatus,
  });
}

export function getCampaignVisibilityRecord(
  campaign: CampaignRecord,
  options: MarketingCampaignVisibilityOptions,
): MarketingVisibilityRecord {
  return resolveMarketingVisibility({
    campaignId: campaign.id,
    contentType: 'campaign',
    targetSurface: options.targetSurface,
    approvalStatus: campaign.status,
    linkedStoreId: campaign.targetType === 'store' ? campaign.targetId || undefined : undefined,
    linkedProductId: campaign.targetType === 'product' ? campaign.targetId || undefined : undefined,
    linkedCategoryId: campaign.targetType === 'category' || campaign.targetType === 'subcategory' ? campaign.targetId || undefined : undefined,
    partnerStatus: options.partnerStatus,
    productApprovalStatus: options.productApprovalStatus,
    catalogPublishingRequired: campaign.targetType === 'product',
    partnerVisibilityRequired: campaign.targetType === 'store' || campaign.targetType === 'product',
  });
}

export function getHomePromoVisibilityRecord(
  promo: HomePromoRecord,
  options: MarketingPromoVisibilityOptions,
): MarketingVisibilityRecord {
  return resolveMarketingVisibility({
    contentType: 'promo',
    targetSurface: options.targetSurface,
    approvalStatus: promo.status,
    linkedStoreId: promo.targetType === 'store' ? promo.targetId || undefined : undefined,
    linkedProductId: promo.targetType === 'product' ? promo.targetId || undefined : undefined,
    linkedCategoryId: promo.targetType === 'category' || promo.targetType === 'sub_category' || promo.targetType === 'main_category' ? promo.targetId || undefined : undefined,
    partnerStatus: options.partnerStatus,
    productApprovalStatus: options.productApprovalStatus,
    catalogPublishingRequired: promo.targetType === 'product',
    partnerVisibilityRequired: promo.targetType === 'store' || promo.targetType === 'product',
  });
}

export function getMarketingVideoVisibilityRecord(
  video: MarketingVideoRecord,
  options: MarketingVideoVisibilityOptions,
): MarketingVisibilityRecord {
  return resolveMarketingVisibility({
    campaignId: video.targetType === 'campaign' ? video.targetId || undefined : undefined,
    contentType: 'video',
    targetSurface: options.targetSurface,
    approvalStatus: video.status,
    linkedStoreId: video.targetType === 'store' ? video.targetId || undefined : undefined,
    linkedProductId: video.targetType === 'product' ? video.targetId || undefined : undefined,
    linkedCategoryId: video.targetType === 'category' || video.targetType === 'subcategory' ? video.targetId || undefined : undefined,
    partnerStatus: options.partnerStatus,
    productApprovalStatus: options.productApprovalStatus,
    catalogPublishingRequired: video.targetType === 'product',
    partnerVisibilityRequired: video.targetType === 'store' || video.targetType === 'product',
  });
}

export function getLoyaltyVisibilityRecord(
  item: LoyaltyRecord,
  targetSurface: Extract<MarketingVisibilityTargetSurface, 'home' | 'benefits' | 'control-panel'>,
): MarketingVisibilityRecord {
  return resolveMarketingVisibility({
    contentType: 'loyalty',
    targetSurface,
    approvalStatus: item.status,
  });
}
