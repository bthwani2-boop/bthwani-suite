import type { CommercialConflict, CommercialEntitlement, SubscriptionPlan } from './commercial.preview-contract';
import {
  getCampaignVisibilityRecord,
  getPartnerOfferVisibilityRecord,
  isMarketingRenderable,
} from './marketing-visibility.contract';

type PartnerOfferRecord = {
  id: string;
  status: string;
  storeId?: string;
  productId?: string;
  linkedCampaignId?: string;
  category?: string;
  displayBadge?: string;
  offerType?: 'discount' | 'free-delivery' | 'bundle' | 'buy-x-get-y' | 'coupon' | string;
};

type CampaignRecord = {
  id: string;
  title: string;
  status: string;
  channels?: string[];
  targetType: string;
  targetId: string;
};

type Entitlement = CommercialEntitlement;

// Projection-local source tracking (not the same as CommercialSourceEntry from contract —
// this tracks internal projection state including approvalStage and sourceType for map filtering).
export type CommercialSource = {
  sourceOwner: string;
  sourceRecordId: string;
  sourceType: string;
  approvalStage?: string;
  conflictSeverity?: 'none' | 'warning' | 'blocker';
  conflictReason?: string;
};

export type CommercialSourceMap = {
  [key: string]: CommercialSource;
};

export type StoreCommercialContext = {
  storeId: string;
  activeOffers: PartnerOfferRecord[];
  activeSubscriptions: SubscriptionPlan[];
  activeEntitlements: Entitlement[];
  activeCampaigns: CampaignRecord[];
  catalogFeatures?: {
    priceMatch: boolean;
    hasNewProducts: boolean;
  };
  hasUnpublishedNewProducts?: boolean; // For conflict detection
};

export type CommercialBadge = {
  label: string;
  source: 'partner' | 'loyalty' | 'subscription' | 'campaign' | 'catalog';
  tone?: string;
};

export function mapStoreCommercialFeatures(context: StoreCommercialContext) {
  const badges: CommercialBadge[] = [];
  const notes: string[] = [];
  const sourceMap: CommercialSourceMap = {};

  // 1. Partner Offers
  let offerLabel: string | undefined = undefined;
  let hasCouponAvailable = false;
  let deliveryFeeLabel: string | undefined = undefined;

  const visibleOffers = context.activeOffers.filter((offer) => {
    if (offer.storeId && offer.storeId !== context.storeId) {
      return false;
    }

    return isMarketingRenderable(getPartnerOfferVisibilityRecord(offer, { targetSurface: 'store' }));
  });

  // Conflict Detection: Unpublished offers trying to show up
  context.activeOffers.forEach(offer => {
    const visibility = getPartnerOfferVisibilityRecord(offer, { targetSurface: 'store' });
    const isVisible = (!offer.storeId || offer.storeId === context.storeId) && isMarketingRenderable(visibility);
    if (!isVisible && offer.displayBadge) {
      sourceMap[`offer-${offer.id}`] = {
        sourceOwner: 'partner-offers',
        sourceRecordId: offer.id,
        sourceType: 'offer',
        approvalStage: offer.status,
        conflictSeverity: 'blocker',
        conflictReason: offer.storeId && offer.storeId !== context.storeId
          ? 'العرض مرتبط بمتجر آخر، لذلك لا يظهر داخل هذا المتجر.'
          : visibility.blockedReason ?? `العرض في حالة (${offer.status}) وغير مسموح بظهوره للعملاء.`
      };
    }
  });

  for (const offer of visibleOffers) {
    const isOfferBlocked = sourceMap[`offer-${offer.id}`]?.conflictSeverity === 'blocker' || sourceMap['offerLabel']?.conflictSeverity === 'blocker';

    if (offer.displayBadge && !offerLabel && !isOfferBlocked) {
      offerLabel = offer.displayBadge;
      badges.push({ label: offer.displayBadge, source: 'partner' });
      sourceMap['offerLabel'] = {
        sourceOwner: 'partner-offers',
        sourceRecordId: offer.id,
        sourceType: 'offer',
        approvalStage: offer.status,
        conflictSeverity: 'none'
      };
    }

    const isCouponBlocked = sourceMap['hasCouponAvailable']?.conflictSeverity === 'blocker';
    if (offer.offerType === 'coupon' && !isCouponBlocked) {
      hasCouponAvailable = true;
      badges.push({ label: 'كوبون متاح', source: 'partner' });
      sourceMap['hasCouponAvailable'] = {
        sourceOwner: 'partner-offers',
        sourceRecordId: offer.id,
        sourceType: 'coupon',
        approvalStage: offer.status,
        conflictSeverity: 'none'
      };
    }

    const isDeliveryBlocked = sourceMap['deliveryFeeLabel']?.conflictSeverity === 'blocker';
    if (offer.offerType === 'free-delivery' && !deliveryFeeLabel && !isDeliveryBlocked) {
      deliveryFeeLabel = 'توصيل مجاني (شريك)';
      badges.push({ label: 'توصيل مجاني', source: 'partner' });
      sourceMap['deliveryFeeLabel'] = {
        sourceOwner: 'partner-offers',
        sourceRecordId: offer.id,
        sourceType: 'delivery',
        approvalStage: offer.status,
        conflictSeverity: 'none'
      };
    }
  }

  // 2. Campaigns
  for (const camp of context.activeCampaigns) {
    const visibility = getCampaignVisibilityRecord(camp, { targetSurface: 'store' });
    const isCampaignBlocked = sourceMap[`campaign-${camp.id}`]?.conflictSeverity === 'blocker';
    if (camp.channels?.includes('store-card') && !isCampaignBlocked && isMarketingRenderable(visibility)) {
      const badgeLabel = `حملة: ${camp.title}`;
      badges.push({ label: badgeLabel, source: 'campaign' });
      sourceMap[`campaign-${camp.id}`] = {
        sourceOwner: 'marketing.preview-data',
        sourceRecordId: camp.id,
        sourceType: 'campaign',
        approvalStage: 'published',
        conflictSeverity: 'none'
      };
    } else if (visibility.blockedReason) {
      sourceMap[`campaign-${camp.id}`] = {
        sourceOwner: 'marketing.preview-data',
        sourceRecordId: camp.id,
        sourceType: 'campaign',
        approvalStage: camp.status,
        conflictSeverity: 'blocker',
        conflictReason: visibility.blockedReason,
      };
    }
  }

  // 3. Loyalty & Subscriptions
  let hasBthwaniPro = false;
  const subscriptionPackageChips: string[] = [];

  const isProBlocked = sourceMap['hasBthwaniPro']?.conflictSeverity === 'blocker';
  if (context.activeSubscriptions.some(s => s.id === 'sub-pro') && !isProBlocked) {
    hasBthwaniPro = true;
    subscriptionPackageChips.push('بثواني برو', 'توصيل سريع');
    badges.push({ label: '⚡ بثواني برو', source: 'subscription' });

    // Conflict Detection: Pro subscription without entitlement
    const hasProEntitlement = context.activeEntitlements.some(e => e.type === 'loyalty-reward' || e.type === 'subscription');
    sourceMap['hasBthwaniPro'] = {
      sourceOwner: 'subscriptions.preview-data',
      sourceRecordId: 'sub-pro',
      sourceType: 'subscription',
      approvalStage: 'active',
      conflictSeverity: hasProEntitlement ? 'none' : 'warning',
      conflictReason: hasProEntitlement ? undefined : 'اشتراك برو فعال ولكن لا توجد استحقاقات (Entitlements) مرتبطة.'
    };
  }

  for (const e of context.activeEntitlements) {
    const isEntitlementBlocked = sourceMap[`entitlement-${e.id}`]?.conflictSeverity === 'blocker';
    if (e.type === 'loyalty-reward' && !isEntitlementBlocked) {
      notes.push('يوجد استحقاق مكافأة متاح');
      badges.push({ label: 'مكافأة ولاء', source: 'loyalty' });
      sourceMap[`entitlement-${e.id}`] = {
        sourceOwner: 'subscriptions.preview-data',
        sourceRecordId: e.id,
        sourceType: 'entitlement',
        approvalStage: 'active',
        conflictSeverity: 'none'
      };
    }
  }

  // 4. Catalog & Features
  let priceMatchLabel: string | undefined = undefined;
  const isPriceMatchBlocked = sourceMap['priceMatchLabel']?.conflictSeverity === 'blocker';
  if (context.catalogFeatures?.priceMatch && !isPriceMatchBlocked) {
    priceMatchLabel = 'الأسعار مطابقة للكتالوج';
    badges.push({ label: 'تطابق السعر', source: 'catalog' });
    sourceMap['priceMatchLabel'] = {
      sourceOwner: 'catalog-sync',
      sourceRecordId: 'catalog-parity',
      sourceType: 'feature',
      conflictSeverity: 'none'
    };
  }

  let hasNewProducts = context.catalogFeatures?.hasNewProducts ?? false;
  if (hasNewProducts) {
    sourceMap['hasNewProducts'] = {
      sourceOwner: 'catalog-adoption',
      sourceRecordId: 'new-arrivals',
      sourceType: 'status',
      conflictSeverity: 'none'
    };
  }

  // Conflict Detection: New products visible before client-visible (mocked detection)
  if (context.hasUnpublishedNewProducts) {
    sourceMap['new-product-leak'] = {
      sourceOwner: 'catalog-gate',
      sourceRecordId: 'leak-detection',
      sourceType: 'security',
      conflictSeverity: 'blocker',
      conflictReason: 'توجد منتجات جديدة معروضة في التطبيق قبل وصولها إلى مرحلة client-visible.'
    };
  }

  // 5. Operational Status
  sourceMap['supportsPickup'] = {
    sourceOwner: 'ops-settings',
    sourceRecordId: 'pickup-config',
    sourceType: 'service',
    conflictSeverity: 'none'
  };

  sourceMap['supportsPartnerDelivery'] = {
    sourceOwner: 'ops-settings',
    sourceRecordId: 'partner-delivery-config',
    sourceType: 'service',
    conflictSeverity: 'none'
  };

  // Final Conflict Analysis — typed as CommercialConflict[]
  const detectedConflicts: CommercialConflict[] = Object.entries(sourceMap)
    .filter(([, s]) => s.conflictSeverity && s.conflictSeverity !== 'none')
    .map(([key, s]) => ({
      conflictId: key,
      severity: s.conflictSeverity as 'warning' | 'blocker',
      reason: s.conflictReason ?? key,
      sourceA: s.sourceRecordId,
    }));

  // Blocker gate: strictly filter commercialChips
  const filteredCommercialChips = badges.filter(badge => {
    const sourceKeys = Object.keys(sourceMap).filter(k =>
      sourceMap[k].sourceType === badge.source ||
      (badge.source === 'partner' && (k.startsWith('offer') || k === 'hasCouponAvailable' || k === 'deliveryFeeLabel'))
    );
    const isBlocked = sourceKeys.some(k => sourceMap[k].conflictSeverity === 'blocker');
    return !isBlocked;
  });

  return {
    offerLabel,
    hasCouponAvailable,
    deliveryFeeLabel,
    priceMatchLabel,
    hasBthwaniPro,
    subscriptionPackageChips,
    hasNewProducts,
    commercialChips: filteredCommercialChips,
    commercialNotes: notes,
    sourceMap,
    conflicts: detectedConflicts,
    supportsPickup: true,
    supportsPartnerDelivery: true,
  };
}

export const conflictList = [
  ['bthwani-pro', 'free-delivery'],
  ['partner-offer', 'price-match'],
];
