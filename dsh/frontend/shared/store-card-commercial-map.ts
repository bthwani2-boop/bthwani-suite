import React from 'react';
import { colorPalette } from '@bthwani/ui-kit';
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

export function CommercialParityPreview({ features, storeName }: { features: ReturnType<typeof mapStoreCommercialFeatures>; storeName?: string }) {
  const getBadgeColor = (source: CommercialBadge['source']) => {
    switch (source) {
      case 'partner': return { bg: colorPalette.warningSoft, fg: colorPalette.warningStrong };
      case 'loyalty': return { bg: colorPalette.infoSoft, fg: colorPalette.infoStrong };
      case 'subscription': return { bg: colorPalette.brandSurface, fg: colorPalette.brandStrong };
      case 'campaign': return { bg: colorPalette.brandSoft, fg: colorPalette.brand };
      case 'catalog': return { bg: colorPalette.surfaceInset, fg: colorPalette.inkMuted };
      default: return { bg: colorPalette.surfaceInset, fg: colorPalette.inkMuted };
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

  // Limit chips to max 2 to match StoreCardPremium logic
  const visibleChips = features.commercialChips.slice(0, 2);

  return React.createElement(
    'div',
    {
      style: {
        backgroundColor: colorPalette.surface,
        borderRadius: '12px',
        padding: '12px',
        border: `1px solid ${colorPalette.line}`,
        display: 'flex',
        flexDirection: 'row-reverse', // RTL Layout
        gap: '12px',
        minHeight: '98px',
        position: 'relative',
        overflow: 'hidden'
      }
    },
    // Right Side: Image Section (Placeholder)
    React.createElement(
      'div',
      {
        style: {
          width: '74px',
          height: '74px',
          borderRadius: '8px',
          backgroundColor: colorPalette.surfaceInset,
          position: 'relative',
          flexShrink: 0
        }
      },
      // Status Badge (Absolute on image)
      features.offerLabel && React.createElement(
        'div',
        {
          style: {
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: colorPalette.brand,
            color: colorPalette.white,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '9px',
            fontWeight: '900',
            zIndex: 10,
          }
        },
        features.offerLabel
      ),
      // Image Glyph Placeholder
      React.createElement('div', { style: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', opacity: 0.2 } }, '🏪')
    ),

    // Left Side: Content Section
    React.createElement(
      'div',
      { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' } },
      React.createElement('div', { style: { fontSize: '13px', fontWeight: '800', color: colorPalette.brandStrong } }, storeName || 'اسم المتجر'),
      React.createElement('div', { style: { fontSize: '10px', color: colorPalette.inkMuted, fontWeight: '600' } }, 'توصيل سريع • بثواني برو'),

      // Metadata Row (Rating / ETA)
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'row-reverse', gap: '8px', marginTop: '2px' } },
        React.createElement('span', { style: { fontSize: '9px', fontWeight: '800', color: colorPalette.warning } }, '★ 4.9'),
        React.createElement('span', { style: { fontSize: '9px', color: colorPalette.inkMuted } }, '18 دقيقة')
      ),

      // Commercial Chips (Max 2)
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'row-reverse', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' } },
        visibleChips.map((badge, idx) => {
          const colors = getBadgeColor(badge.source);
          return React.createElement(
            'div',
            { key: idx, style: { display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: colors.bg, padding: '2px 6px', borderRadius: '4px' } },
            React.createElement('span', { style: { color: colors.fg, fontSize: '9px', fontWeight: '800' } }, badge.label),
            React.createElement('span', { style: { color: colors.fg, fontSize: '7px', opacity: 0.6 } }, `(${getSourceLabel(badge.source).split(' ')[1] || '—'})`)
          );
        })
      )
    ),

    // Favorite Icon Placeholder (Top Left in RTL)
    React.createElement('div', { style: { position: 'absolute', top: '12px', left: '12px', fontSize: '14px', opacity: 0.1 } }, '♡'),

    // Conflict Alert Overlay
    features.conflicts.length > 0 && React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colorPalette.dangerSoft,
          padding: '4px 8px',
          borderTop: `1px solid ${colorPalette.danger}`,
          fontSize: '8px',
          color: colorPalette.dangerStrong,
          fontWeight: '700',
          textAlign: 'center'
        }
      },
      `تضارب نشط: ${features.conflicts[0].conflictReason}`
    )
  );
}


export const conflictList = [
  ['bthwani-pro', 'free-delivery'],
  ['partner-offer', 'price-match'],
];
