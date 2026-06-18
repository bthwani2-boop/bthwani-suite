// Canonical location: dsh/frontend/shared/view-models/control-panel/marketing/section-catalog.ts
// Authority: dsh/frontend/shared — moved from control-panel/marketing/section-catalog.ts

export const sectionCatalog = [
  'ticker',
  'banners',
  'promos',
  'video',
  'campaigns',
  'partners',
  'media-review',
  'loyalty',
  'growth',
  'signals',
] as const;

export type MarketingSectionId = typeof sectionCatalog[number];
