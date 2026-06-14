// Canonical location: dsh/frontend/shared/contracts/marketing/marketing.types.ts
// Authority: dsh/frontend/shared — moved from control-panel/marketing/types.ts
// General marketing section types for control-panel.

export type MarketingCommandDeckTab =
  | 'ticker'
  | 'banners'
  | 'promos'
  | 'video'
  | 'campaigns'
  | 'partners'
  | 'media-review'
  | 'loyalty'
  | 'growth'
  | 'signals';

export type MarketingReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export type MarketingReviewItem = {
  id: string;
  type: 'banner' | 'video' | 'promo';
  title: string;
  submittedAt: string;
  status: MarketingReviewStatus;
  submittedBy: string;
};
