import type { PartnerOfferRecord } from './partner-offer.preview-store';
import type { SubscriptionPlan, Entitlement } from './loyalty.preview-store';
import type { CampaignRecord } from './campaign.preview-store';

export type CommercialSource = {
  sourceOwner: string;
  sourceRecordId: string;
  sourceType: string;
  approvalStage?: string;
  conflictStatus?: 'none' | 'warning' | 'blocker';
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

  const visibleOffers = context.activeOffers.filter(offer => offer.status === 'published');

  // Conflict Detection: Unpublished offers trying to show up
  context.activeOffers.forEach(offer => {
    const isVisible = offer.status === 'published';
    if (!isVisible && offer.displayBadge) {
      sourceMap[`offer-${offer.id}`] = {
        sourceOwner: 'partner-offers',
        sourceRecordId: offer.id,
        sourceType: 'offer',
        approvalStage: offer.status,
        conflictStatus: 'blocker',
        conflictReason: `العرض في حالة (${offer.status}) وغير مسموح بظهوره للعملاء.`
      };
    }
  });

  for (const offer of visibleOffers) {
    const isOfferBlocked = sourceMap[`offer-${offer.id}`]?.conflictStatus === 'blocker' || sourceMap['offerLabel']?.conflictStatus === 'blocker';

    if (offer.displayBadge && !offerLabel && !isOfferBlocked) {
      offerLabel = offer.displayBadge;
      badges.push({ label: offer.displayBadge, source: 'partner' });
      sourceMap['offerLabel'] = {
        sourceOwner: 'partner-offers',
        sourceRecordId: offer.id,
        sourceType: 'offer',
        approvalStage: offer.status,
        conflictStatus: 'none'
      };
    }

    const isCouponBlocked = sourceMap['hasCouponAvailable']?.conflictStatus === 'blocker';
    if (offer.offerType === 'coupon' && !isCouponBlocked) {
      hasCouponAvailable = true;
      badges.push({ label: 'كوبون متاح', source: 'partner' });
      sourceMap['hasCouponAvailable'] = {
        sourceOwner: 'partner-offers',
        sourceRecordId: offer.id,
        sourceType: 'coupon',
        approvalStage: offer.status,
        conflictStatus: 'none'
      };
    }

    const isDeliveryBlocked = sourceMap['deliveryFeeLabel']?.conflictStatus === 'blocker';
    if (offer.offerType === 'free-delivery' && !deliveryFeeLabel && !isDeliveryBlocked) {
      deliveryFeeLabel = 'توصيل مجاني (شريك)';
      badges.push({ label: 'توصيل مجاني', source: 'partner' });
      sourceMap['deliveryFeeLabel'] = {
        sourceOwner: 'partner-offers',
        sourceRecordId: offer.id,
        sourceType: 'delivery',
        approvalStage: offer.status,
        conflictStatus: 'none'
      };
    }
  }

  // 2. Campaigns
  for (const camp of context.activeCampaigns) {
    const isCampaignBlocked = sourceMap[`campaign-${camp.id}`]?.conflictStatus === 'blocker';
    if (camp.channels?.includes('store-card') && !isCampaignBlocked) {
      const badgeLabel = `حملة: ${camp.title}`;
      badges.push({ label: badgeLabel, source: 'campaign' });
      sourceMap[`campaign-${camp.id}`] = {
        sourceOwner: 'campaign.preview-store',
        sourceRecordId: camp.id,
        sourceType: 'campaign',
        approvalStage: 'published',
        conflictStatus: 'none'
      };
    }
  }

  // 3. Loyalty & Subscriptions
  let hasBthwaniPro = false;
  const subscriptionPackageChips: string[] = [];

  const isProBlocked = sourceMap['hasBthwaniPro']?.conflictStatus === 'blocker';
  if (context.activeSubscriptions.some(s => s.id === 'sub-pro') && !isProBlocked) {
    hasBthwaniPro = true;
    subscriptionPackageChips.push('بثواني برو', 'توصيل سريع');
    badges.push({ label: '⚡ بثواني برو', source: 'subscription' });

    // Conflict Detection: Pro subscription without entitlement
    const hasProEntitlement = context.activeEntitlements.some(e => e.type === 'reward' || e.type === 'subscription');
    sourceMap['hasBthwaniPro'] = {
      sourceOwner: 'loyalty.preview-store',
      sourceRecordId: 'sub-pro',
      sourceType: 'subscription',
      approvalStage: 'active',
      conflictStatus: hasProEntitlement ? 'none' : 'warning',
      conflictReason: hasProEntitlement ? undefined : 'اشتراك برو فعال ولكن لا توجد استحقاقات (Entitlements) مرتبطة.'
    };
  }

  for (const e of context.activeEntitlements) {
    const isEntitlementBlocked = sourceMap[`entitlement-${e.id}`]?.conflictStatus === 'blocker';
    if (e.type === 'reward' && !isEntitlementBlocked) {
      notes.push('يوجد استحقاق مكافأة متاح');
      badges.push({ label: 'مكافأة ولاء', source: 'loyalty' });
      sourceMap[`entitlement-${e.id}`] = {
        sourceOwner: 'loyalty.preview-store',
        sourceRecordId: e.id,
        sourceType: 'entitlement',
        approvalStage: 'active',
        conflictStatus: 'none'
      };
    }
  }

  // 4. Catalog & Features
  let priceMatchLabel: string | undefined = undefined;
  const isPriceMatchBlocked = sourceMap['priceMatchLabel']?.conflictStatus === 'blocker';
  if (context.catalogFeatures?.priceMatch && !isPriceMatchBlocked) {
    priceMatchLabel = 'الأسعار مطابقة للكتالوج';
    badges.push({ label: 'تطابق السعر', source: 'catalog' });
    sourceMap['priceMatchLabel'] = {
      sourceOwner: 'catalog-sync',
      sourceRecordId: 'catalog-parity',
      sourceType: 'feature',
      conflictStatus: 'none'
    };
  }

  let hasNewProducts = context.catalogFeatures?.hasNewProducts ?? false;
  if (hasNewProducts) {
    sourceMap['hasNewProducts'] = {
      sourceOwner: 'catalog-adoption',
      sourceRecordId: 'new-arrivals',
      sourceType: 'status',
      conflictStatus: 'none'
    };
  }

  // Conflict Detection: New products visible before client-visible (mocked detection)
  if (context.hasUnpublishedNewProducts) {
    sourceMap['new-product-leak'] = {
      sourceOwner: 'catalog-gate',
      sourceRecordId: 'leak-detection',
      sourceType: 'security',
      conflictStatus: 'blocker',
      conflictReason: 'توجد منتجات جديدة معروضة في التطبيق قبل وصولها إلى مرحلة client-visible.'
    };
  }

  // 5. Operational Status
  sourceMap['supportsPickup'] = {
    sourceOwner: 'ops-settings',
    sourceRecordId: 'pickup-config',
    sourceType: 'service',
    conflictStatus: 'none'
  };

  sourceMap['supportsPartnerDelivery'] = {
    sourceOwner: 'ops-settings',
    sourceRecordId: 'partner-delivery-config',
    sourceType: 'service',
    conflictStatus: 'none'
  };

  // Final Conflict Analysis
  const detectedConflicts = Object.values(sourceMap).filter(s => s.conflictStatus && s.conflictStatus !== 'none');

  // Phase R3 Gate: Strictly filter commercialChips based on sourceMap blockers
  const filteredCommercialChips = badges.filter(badge => {
    const sourceKeys = Object.keys(sourceMap).filter(k =>
      sourceMap[k].sourceType === badge.source ||
      (badge.source === 'partner' && (k.startsWith('offer') || k === 'hasCouponAvailable' || k === 'deliveryFeeLabel'))
    );
    const isBlocked = sourceKeys.some(k => sourceMap[k].conflictStatus === 'blocker');
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
