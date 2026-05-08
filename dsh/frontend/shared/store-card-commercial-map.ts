import React from 'react';
import type { PartnerOfferRecord } from './partner-offer-store';
import type { SubscriptionPlan, Entitlement } from './loyalty-store';
import type { CampaignRecord } from './campaign-store';

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
    const isVisible = offer.status === 'published' || offer.status === 'client-visible';
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
        sourceOwner: 'campaign-store',
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

  if (context.activeSubscriptions.some(s => s.id === 'sub-pro') && sourceMap['hasBthwaniPro']?.conflictStatus !== 'blocker') {
    hasBthwaniPro = true;
    subscriptionPackageChips.push('بثواني برو', 'توصيل سريع');
    badges.push({ label: '⚡ بثواني برو', source: 'subscription' });

    // Conflict Detection: Pro subscription without entitlement
    const hasProEntitlement = context.activeEntitlements.some(e => e.type === 'reward' || e.type === 'multiplier');
    sourceMap['hasBthwaniPro'] = {
      sourceOwner: 'loyalty-store',
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
        sourceOwner: 'loyalty-store',
        sourceRecordId: e.id,
        sourceType: 'entitlement',
        approvalStage: 'active',
        conflictStatus: 'none'
      };
    }
  }

  // 4. Catalog & Features
  let priceMatchLabel: string | undefined = undefined;
  if (context.catalogFeatures?.priceMatch && sourceMap['priceMatchLabel']?.conflictStatus !== 'blocker') {
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

  return {
    offerLabel,
    hasCouponAvailable,
    deliveryFeeLabel,
    priceMatchLabel,
    hasBthwaniPro,
    subscriptionPackageChips,
    hasNewProducts,
    commercialChips: badges,
    commercialNotes: notes,
    sourceMap,
    conflicts: detectedConflicts,
    supportsPickup: true,
    supportsPartnerDelivery: true,
  };
}

export function CommercialParityPreview({ features, storeName }: { features: ReturnType<typeof mapStoreCommercialFeatures>; storeName?: string }) {
  const getBadgeColor = (source: CommercialBadge['source']) => {
    switch (source) {
      case 'partner': return { bg: '#FEF3C7', fg: '#D97706' };
      case 'loyalty': return { bg: '#F3E8FF', fg: '#7E22CE' };
      case 'subscription': return { bg: '#DBEAFE', fg: '#1D4ED8' };
      case 'campaign': return { bg: '#FFEDD5', fg: '#FF500D' };
      case 'catalog': return { bg: '#F1F5F9', fg: '#475569' };
      default: return { bg: '#F1F5F9', fg: '#475569' };
    }
  };

  const getSourceLabel = (source: CommercialBadge['source']) => {
    switch (source) {
      case 'partner': return 'من عرض شريك';
      case 'loyalty': return 'من الولاء';
      case 'subscription': return 'من الاشتراك';
      case 'campaign': return 'من حملة';
      case 'catalog': return 'من الكتالوج';
      default: return source;
    }
  };

  return React.createElement(
    'div',
    { style: { backgroundColor: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' } },
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
      React.createElement('span', { style: { fontSize: '14px', fontWeight: '800', color: '#0A2F5C' } }, storeName || 'اسم المتجر الافتراضي'),
      features.offerLabel && React.createElement('span', { style: { backgroundColor: '#FF500D', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' } }, features.offerLabel)
    ),
    React.createElement(
      'div',
      { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
      features.commercialChips.map((badge, idx) => {
        const colors = getBadgeColor(badge.source);
        // Safety gate: skip rendering if the source is blocked
        const sourceKeys = Object.keys(features.sourceMap).filter(k => features.sourceMap[k].sourceType === badge.source || (badge.source === 'partner' && (k.startsWith('offer') || k === 'hasCouponAvailable' || k === 'deliveryFeeLabel')));
        const isBlocked = sourceKeys.some(k => features.sourceMap[k].conflictStatus === 'blocker');
        if (isBlocked) return null;

        return React.createElement(
          'div',
          { key: idx, style: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: colors.bg, padding: '2px 6px', borderRadius: '4px' } },
          React.createElement('span', { style: { color: colors.fg, fontSize: '10px', fontWeight: '800' } }, badge.label),
          React.createElement('span', { style: { color: colors.fg, fontSize: '8px', opacity: 0.7 } }, `(${getSourceLabel(badge.source)})`)
        );
      })
    ),
    // Source Map Debug View
    React.createElement(
      'div',
      { style: { marginTop: '12px', padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' } },
      React.createElement('div', { style: { fontSize: '10px', fontWeight: '900', color: '#64748B', marginBottom: '4px' } }, 'خارطة المصادر (SourceMap):'),
      Object.entries(features.sourceMap).map(([key, src]) => React.createElement(
        'div',
        { key, style: { fontSize: '9px', display: 'flex', justifyContent: 'space-between', marginBottom: '2px', color: src.conflictStatus === 'blocker' ? '#DC2626' : '#475569' } },
        React.createElement('span', null, `${key}:`),
        React.createElement('span', { style: { fontWeight: '700' } }, `${src.sourceOwner} | ${src.sourceType} | ${src.conflictStatus || 'none'}`)
      ))
    ),
    features.conflicts.length > 0 && React.createElement(
      'div',
      { style: { marginTop: '8px', padding: '8px', backgroundColor: '#FEF2F2', borderRadius: '6px', border: '1px solid #FECACA' } },
      React.createElement('div', { style: { fontSize: '10px', fontWeight: '900', color: '#DC2626', marginBottom: '4px' } }, 'التضاربات المكتشفة:'),
      features.conflicts.map((c, i) => React.createElement('div', { key: i, style: { fontSize: '9px', color: '#B91C1C' } }, `• [${c.conflictStatus}] ${c.sourceRecordId}: ${c.conflictReason || 'خطأ غير معروف'}`))
    ),
    features.deliveryFeeLabel && React.createElement(
      'div',
      { style: { marginTop: '8px', padding: '8px', backgroundColor: '#F0FDF4', borderRadius: '6px', border: '1px dashed #BBF7D0' } },
      React.createElement('span', { style: { fontSize: '10px', color: '#166534' } }, `🚚 ${features.deliveryFeeLabel}`)
    ),
    features.priceMatchLabel && React.createElement(
      'div',
      { style: { marginTop: '4px', padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1' } },
      React.createElement('span', { style: { fontSize: '10px', color: '#475569' } }, `⚖️ ${features.priceMatchLabel}`)
    )
  );
}

export const conflictList = [
  ['bthwani-pro', 'free-delivery'],
  ['partner-offer', 'price-match'],
];
