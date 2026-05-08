import { ApprovalRecord } from './workflow';

export const catalogAdoptionRecords: ApprovalRecord[] = [
  {
    id: 'cat-1',
    entityType: 'product',
    source: 'control-panel-marketing',
    stage: 'catalog-adopted',
    title: 'عنصر معتمد catalog-adopted',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    entityType: 'product',
    source: 'control-panel-catalog',
    stage: 'client-visible',
    title: 'عنصر client-visible',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    entityType: 'partner-offer',
    source: 'control-panel-marketing',
    stage: 'marketing-approved',
    title: 'عرض ترويجي من التسويق',
    submittedAt: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    entityType: 'product-media',
    source: 'control-panel-marketing',
    stage: 'marketing-approved',
    title: 'صورة مطعم مخصصة',
    submittedAt: new Date().toISOString(),
  }
];

export function getCatalogAdoptionItems(): ApprovalRecord[] {
  return catalogAdoptionRecords;
}

export function getClientVisibleItems(): ApprovalRecord[] {
  return catalogAdoptionRecords.filter(r => r.stage === 'client-visible');
}
