/**
 * UI_PREVIEW_ONLY canonical preview data graph.
 * Owner: dsh/frontend/data
 * Runtime/API/backend truth: false.
 */
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
export type PartnerOfferStatus = 'inbound' | 'review' | 'marketing-ready' | 'published' | 'rejected' | 'paused' | 'archived';
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
  rejectionReason?: string;
  linkedCampaignId?: string;
  activeFromDate?: string;
  activeToDate?: string;
};

const OFFER_STORE_KEY = '__BTHWANI_DSH_PARTNER_OFFER_STORE__';

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

function getOfferGlobalStore(): typeof globalThis & { [OFFER_STORE_KEY]?: PartnerOfferRecord[] } {
  return globalThis as typeof globalThis & { [OFFER_STORE_KEY]?: PartnerOfferRecord[] };
}

function getOfferMutableStore(): PartnerOfferRecord[] {
  const scope = getOfferGlobalStore();
  if (!scope[OFFER_STORE_KEY]) {
    scope[OFFER_STORE_KEY] = seededOffers.map((item) => ({ ...item }));
  }
  return scope[OFFER_STORE_KEY] ?? [];
}

function setOfferMutableStore(next: PartnerOfferRecord[]) {
  getOfferGlobalStore()[OFFER_STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getPartnerOfferItems(): PartnerOfferRecord[] {
  return getOfferMutableStore();
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
    rejectionReason: item.rejectionReason ?? existing?.rejectionReason,
    linkedCampaignId: item.linkedCampaignId ?? existing?.linkedCampaignId,
    activeFromDate: item.activeFromDate ?? existing?.activeFromDate,
    activeToDate: item.activeToDate ?? existing?.activeToDate,
  };

  const next = existing
    ? current.map(entry => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setOfferMutableStore(next);
  return nextEntry;
}

export function approvePartnerOfferItem(id: string) {
  const current = getPartnerOfferItems();
  setOfferMutableStore(current.map(item => item.id === id ? { ...item, status: 'marketing-ready' } : item));
}

export function publishPartnerOfferItem(id: string) {
  const current = getPartnerOfferItems();
  setOfferMutableStore(current.map(item => item.id === id ? { ...item, status: 'published' } : item));
}

export function pausePartnerOfferItem(id: string) {
  const current = getPartnerOfferItems();
  setOfferMutableStore(current.map(item => item.id === id ? { ...item, status: 'paused' } : item));
}

export function rejectPartnerOfferItem(id: string, reason: string) {
  const current = getPartnerOfferItems();
  setOfferMutableStore(current.map(item => item.id === id ? { ...item, status: 'rejected', rejectionReason: reason } : item));
}

export function archivePartnerOfferItem(id: string) {
  const current = getPartnerOfferItems();
  setOfferMutableStore(current.map(item => item.id === id ? { ...item, status: 'archived' } : item));
}

export function isPartnerOfferClientVisible(status: PartnerOfferStatus): boolean {
  return status === 'published';
}

export function removePartnerOfferItem(id: string) {
  setOfferMutableStore(getPartnerOfferItems().filter(item => item.id !== id));
}

export type PartnerOfferSummary = {
  id: string;
  title: string;
  partnerName: string;
  storeId: string;
  storeLabel: string;
  offerType: PartnerOfferType;
  status: PartnerOfferStatus;
  source: PartnerOfferSource;
  valueLabel: string;
};

export function getPartnerOfferSummaries(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 5;
  let items = getPartnerOfferItems();

  if (options.search) {
    const q = options.search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.partnerName.toLowerCase().includes(q));
  }
  if (options.status && options.status !== 'all') {
    items = items.filter(i => i.status === options.status);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated as PartnerOfferSummary[],
    total,
  };
}

export function getPartnerOfferDetail(id: string): PartnerOfferRecord | null {
  return getPartnerOfferItems().find(i => i.id === id) ?? null;
}

export function selectDshClientOffersPreview(customerId?: string) {
  void customerId;
  return getPartnerOfferItems().filter((offer) => isPartnerOfferClientVisible(offer.status));
}

export function selectDshPartnerOffersPreview(storeId: string) {
  return getPartnerOfferItems().filter((offer) => !offer.storeId || offer.storeId === storeId);
}
