import React from 'react';
import type { PartnerOfferRecord } from './partner-offer-store';
import type { SubscriptionPlan, Entitlement } from './loyalty-store';
import type { CampaignRecord } from './campaign-store';

export type StoreCommercialContext = {
  storeId: string;
  activeOffers: PartnerOfferRecord[];
  activeSubscriptions: SubscriptionPlan[];
  activeEntitlements: Entitlement[];
  activeCampaigns: CampaignRecord[];
  catalogFeatures?: { priceMatch: boolean };
};

export type CommercialBadge = {
  label: string;
  source: 'partner' | 'loyalty' | 'subscription' | 'campaign' | 'catalog';
  tone?: string;
};

export function mapStoreCommercialFeatures(context: StoreCommercialContext) {
  // NOTE: This mapper is the Single Source of Truth (SSOT) for commercial parity.
  // The client application (DshHomeGetScreen and store card models) should ideally bridge
  // their fixtures to use this mapper in the future to ensure exactly parity with the Control Plane.
  // Currently, we use this for UI preview simulation in the Marketing Control Decks.

  const badges: CommercialBadge[] = [];
  const notes: string[] = [];

  // Partner Offers
  let offerLabel: string | undefined = undefined;
  let hasCouponAvailable = false;
  let deliveryFeeLabel: string | undefined = undefined;

  for (const offer of context.activeOffers) {
    if (offer.displayBadge && !offerLabel) {
      offerLabel = offer.displayBadge;
      badges.push({ label: offer.displayBadge, source: 'partner' });
    }
    if (offer.offerType === 'coupon') {
      hasCouponAvailable = true;
      badges.push({ label: 'كوبون متاح', source: 'partner' });
    }
    if (offer.offerType === 'free-delivery' && !deliveryFeeLabel) {
      deliveryFeeLabel = 'توصيل مجاني (شريك)';
      badges.push({ label: 'توصيل مجاني', source: 'partner' });
    }
  }

  // Campaigns
  for (const camp of context.activeCampaigns) {
    if (camp.channels?.includes('store-card')) {
      badges.push({ label: `حملة: ${camp.title}`, source: 'campaign' });
    }
  }

  // Loyalty & Subscriptions
  let hasBthwaniPro = false;
  const subscriptionPackageChips: string[] = [];

  if (context.activeSubscriptions.some(s => s.id === 'sub-pro')) {
    hasBthwaniPro = true;
    subscriptionPackageChips.push('بثواني برو', 'توصيل سريع');
    badges.push({ label: '⚡ بثواني برو', source: 'subscription' });
  }

  for (const e of context.activeEntitlements) {
    if (e.type === 'reward') {
      notes.push('يوجد استحقاق مكافأة متاح');
      badges.push({ label: 'مكافأة ولاء', source: 'loyalty' });
    }
  }

  // Catalog
  let priceMatchLabel: string | undefined = undefined;
  if (context.catalogFeatures?.priceMatch) {
    priceMatchLabel = 'الأسعار مطابقة للكتالوج';
    badges.push({ label: 'تطابق السعر', source: 'catalog' });
  }

  return {
    offerLabel,
    hasCouponAvailable,
    deliveryFeeLabel,
    priceMatchLabel,
    hasBthwaniPro,
    subscriptionPackageChips,
    commercialBadges: badges,
    commercialNotes: notes,
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
      features.commercialBadges.map((badge, idx) => {
        const colors = getBadgeColor(badge.source);
        return React.createElement(
          'div',
          { key: idx, style: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: colors.bg, padding: '2px 6px', borderRadius: '4px' } },
          React.createElement('span', { style: { color: colors.fg, fontSize: '10px', fontWeight: '800' } }, badge.label),
          React.createElement('span', { style: { color: colors.fg, fontSize: '8px', opacity: 0.7 } }, `(${getSourceLabel(badge.source)})`)
        );
      })
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
    ),
    features.commercialNotes.length > 0 && React.createElement(
      'div',
      { style: { marginTop: '4px', padding: '8px', backgroundColor: '#FEF2F2', borderRadius: '6px', border: '1px dashed #FECACA' } },
      features.commercialNotes.map((n, i) => React.createElement('span', { key: i, style: { display: 'block', fontSize: '10px', color: '#DC2626' } }, `⚠️ ${n}`))
    )
  );
}
