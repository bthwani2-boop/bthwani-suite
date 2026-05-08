import { ApprovalRecord } from './workflow';

export const marketingReviewRecords: ApprovalRecord[] = [
  {
    id: 'mkt-1',
    entityType: 'partner-offer',
    source: 'control-panel-partners',
    stage: 'marketing-review',
    title: 'عرض شريك جاهز للتسويق',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'mkt-2',
    entityType: 'product-media',
    source: 'app-partner',
    stage: 'marketing-approved',
    title: 'صورة منتج مطعم partner-owned-exception',
    submittedAt: new Date().toISOString(),
  }
];

export function getMarketingReviewItems(): ApprovalRecord[] {
  return marketingReviewRecords;
}
