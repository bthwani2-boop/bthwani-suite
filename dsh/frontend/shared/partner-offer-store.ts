/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const partnerOfferStoreDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

export type PartnerOfferType = 'discount' | 'free-delivery' | 'bundle' | 'buy-x-get-y' | 'coupon';
export type PartnerOfferStatus = 'inbound' | 'review' | 'marketing-ready' | 'published' | 'rejected' | 'paused';
export type PartnerOfferSource = 'partner' | 'field' | 'marketing' | 'catalog';
export type PartnerOfferTarget = 'store' | 'product' | 'category';

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
  linkedCampaignId?: string;
  activeFromDate?: string;
  activeToDate?: string;
};

const STORE_KEY = '__BTHWANI_DSH_PARTNER_OFFER_STORE__';

const seededOffers: PartnerOfferRecord[] = [
  {
    id: 'offer-1',
    title: 'خصم 20% على القهوة',
    partnerName: 'محمصة دانكن',
    storeId: 'store-101',
    storeLabel: 'دانكن دونتس',
    productId: 'prod-coffee-1',
    productLabel: 'قهوة سوداء',
    category: 'مشروبات',
    offerType: 'discount',
    status: 'marketing-ready',
    source: 'partner',
    valueLabel: '20%',
    eligibility: 'الجميع',
    displayBadge: 'خصم 20%',
    marginRiskNote: 'الخصم ممول بالكامل من الشريك',
  },
  {
    id: 'offer-2',
    title: 'توصيل مجاني للمطاعم',
    partnerName: 'شراكات التوصيل',
    storeId: '',
    storeLabel: 'كل المطاعم',
    productId: '',
    productLabel: '',
    category: 'مطاعم',
    offerType: 'free-delivery',
    status: 'published',
    source: 'marketing',
    valueLabel: 'توصيل مجاني',
    eligibility: 'للطلبات فوق 50 ريال',
    displayBadge: 'توصيل مجاني',
    linkedCampaignId: 'camp-summer',
  }
];

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: PartnerOfferRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: PartnerOfferRecord[] };
}

function getMutableStore(): PartnerOfferRecord[] {
  const scope = getGlobalStore();
  if (!scope[STORE_KEY]) {
    scope[STORE_KEY] = seededOffers.map((item) => ({ ...item }));
  }
  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: PartnerOfferRecord[]) {
  getGlobalStore()[STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getPartnerOfferItems(): PartnerOfferRecord[] {
  return getMutableStore();
}

export function getPartnerOfferKpis() {
  const items = getPartnerOfferItems();
  return {
    total: items.length,
    inbound: items.filter(i => i.status === 'inbound').length,
    review: items.filter(i => i.status === 'review').length,
    marketingReady: items.filter(i => i.status === 'marketing-ready').length,
    published: items.filter(i => i.status === 'published').length,
    rejected: items.filter(i => i.status === 'rejected').length,
  };
}

export function upsertPartnerOfferItem(item: Partial<PartnerOfferRecord>) {
  const current = getPartnerOfferItems();
  const nextId = item.id ?? `offer-${Date.now()}`;
  const existing = current.find(entry => entry.id === nextId);

  const nextEntry: PartnerOfferRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'عرض شريك جديد',
    partnerName: item.partnerName ?? existing?.partnerName ?? '',
    storeId: item.storeId ?? existing?.storeId ?? '',
    storeLabel: item.storeLabel ?? existing?.storeLabel ?? '',
    productId: item.productId ?? existing?.productId ?? '',
    productLabel: item.productLabel ?? existing?.productLabel ?? '',
    category: item.category ?? existing?.category ?? '',
    offerType: item.offerType ?? existing?.offerType ?? 'discount',
    status: item.status ?? existing?.status ?? 'inbound',
    source: item.source ?? existing?.source ?? 'partner',
    valueLabel: item.valueLabel ?? existing?.valueLabel ?? '',
    eligibility: item.eligibility ?? existing?.eligibility ?? 'الكل',
    displayBadge: item.displayBadge ?? existing?.displayBadge ?? 'عرض جديد',
    marginRiskNote: item.marginRiskNote ?? existing?.marginRiskNote,
    linkedCampaignId: item.linkedCampaignId ?? existing?.linkedCampaignId,
    activeFromDate: item.activeFromDate ?? existing?.activeFromDate,
    activeToDate: item.activeToDate ?? existing?.activeToDate,
  };

  const next = existing
    ? current.map(entry => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setMutableStore(next);
  return nextEntry;
}

export function approvePartnerOfferItem(id: string) {
  const current = getPartnerOfferItems();
  setMutableStore(current.map(item => item.id === id ? { ...item, status: 'marketing-ready' } : item));
}

export function publishPartnerOfferItem(id: string) {
  const current = getPartnerOfferItems();
  setMutableStore(current.map(item => item.id === id ? { ...item, status: 'published' } : item));
}

export function pausePartnerOfferItem(id: string) {
  const current = getPartnerOfferItems();
  setMutableStore(current.map(item => item.id === id ? { ...item, status: 'paused' } : item));
}

export function removePartnerOfferItem(id: string) {
  setMutableStore(getPartnerOfferItems().filter(item => item.id !== id));
}
