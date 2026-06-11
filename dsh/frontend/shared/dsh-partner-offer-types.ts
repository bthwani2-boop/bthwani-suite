// Runtime-safe partner offer types extracted from preview-data ownership so
// live surfaces can depend on contracts without importing preview stores.

export type PartnerOfferType = 'discount' | 'free-delivery' | 'bundle' | 'buy-x-get-y' | 'coupon';
export type PartnerOfferStatus = 'inbound' | 'review' | 'marketing-ready' | 'published' | 'rejected' | 'paused' | 'archived';
export type PartnerOfferSource = 'partner' | 'field' | 'marketing' | 'catalog';

export type PartnerOfferRecord = {
  id: string;
  title: string;
  partnerName: string;
  storeId: string;
  storeLabel: string;
  productId: string;
  productLabel: string;
  category: string;
  offerType: PartnerOfferType;
  status: PartnerOfferStatus;
  source: PartnerOfferSource;
  valueLabel: string;
  eligibility: string;
  displayBadge: string;
  marginRiskNote?: string;
  rejectionReason?: string;
  linkedCampaignId?: string;
  activeFromDate?: string;
  activeToDate?: string;
};
