export type CampaignStatus = 'draft' | 'pending' | 'published' | 'paused' | 'archived';
export type CampaignGoal = 'awareness' | 'conversion' | 'retention' | 'acquisition';
export type CampaignAudience = 'all' | 'client' | 'operations' | 'targeted';
export type CampaignChannel = 'banner' | 'promo' | 'video' | 'ticker' | 'store-card';
export type CampaignPlacement = 'hero' | 'feed' | 'floating' | 'banner';
export type CampaignPriority = 'low' | 'normal' | 'high' | 'critical';
export type CampaignTargetType = 'home' | 'stores' | 'store' | 'category' | 'subcategory' | 'product' | 'offer' | 'campaign' | 'search' | 'custom';

export type CampaignRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: CampaignStatus;
  priority: CampaignPriority;
  goal: CampaignGoal;
  audience: CampaignAudience;
  channels: CampaignChannel[];
  placement: CampaignPlacement;
  targetType: CampaignTargetType;
  targetId: string;
  linkedBannerId?: string;
  linkedVideoId?: string;
  linkedOfferId?: string;
  linkedLoyaltyBenefitId?: string;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
};

const STORE_KEY = '__BTHWANI_DSH_CAMPAIGN_STORE__';

const seededCampaigns: CampaignRecord[] = [
  {
    id: 'camp-ramadan',
    title: 'حملة رمضان الكبرى',
    subtitle: 'تسليط الضوء على متاجر التمور والمقاضي الرمضانية',
    status: 'published',
    priority: 'high',
    goal: 'awareness',
    audience: 'all',
    channels: ['banner', 'promo'],
    placement: 'hero',
    targetType: 'home',
    targetId: '',
    linkedBannerId: 'banner-ramadan-1',
    impressions: 150000,
    clicks: 12000,
  },
  {
    id: 'camp-summer',
    title: 'عروض الصيف',
    subtitle: 'ترويج للمنتجات الصيفية بخصومات حصرية',
    status: 'draft',
    priority: 'normal',
    goal: 'conversion',
    audience: 'client',
    channels: ['video', 'store-card'],
    placement: 'feed',
    targetType: 'category',
    targetId: 'summer-items',
    impressions: 0,
    clicks: 0,
  }
];

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: CampaignRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: CampaignRecord[] };
}

function getMutableStore(): CampaignRecord[] {
  const scope = getGlobalStore();
  if (!scope[STORE_KEY]) {
    scope[STORE_KEY] = seededCampaigns.map((item) => ({ ...item }));
  }
  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: CampaignRecord[]) {
  getGlobalStore()[STORE_KEY] = next.map((item) => ({ ...item }));
}

export function getCampaignItems(): CampaignRecord[] {
  return getMutableStore();
}

export function getCampaignKpis() {
  const items = getCampaignItems();
  const live = items.filter(item => item.status === 'published');
  return {
    total: items.length,
    live: live.length,
    impressions: live.reduce((sum, item) => sum + item.impressions, 0),
    clicks: live.reduce((sum, item) => sum + item.clicks, 0),
  };
}

export function upsertCampaignItem(item: Partial<CampaignRecord>) {
  const current = getCampaignItems();
  const nextId = item.id ?? `campaign-${Date.now()}`;
  const existing = current.find(entry => entry.id === nextId);

  const nextEntry: CampaignRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'حملة تسويقية جديدة',
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'وصف الحملة',
    status: item.status ?? existing?.status ?? 'draft',
    priority: item.priority ?? existing?.priority ?? 'normal',
    goal: item.goal ?? existing?.goal ?? 'awareness',
    audience: item.audience ?? existing?.audience ?? 'all',
    channels: item.channels ?? existing?.channels ?? [],
    placement: item.placement ?? existing?.placement ?? 'hero',
    targetType: item.targetType ?? existing?.targetType ?? 'home',
    targetId: item.targetId ?? existing?.targetId ?? '',
    linkedBannerId: item.linkedBannerId ?? existing?.linkedBannerId,
    linkedVideoId: item.linkedVideoId ?? existing?.linkedVideoId,
    linkedOfferId: item.linkedOfferId ?? existing?.linkedOfferId,
    linkedLoyaltyBenefitId: item.linkedLoyaltyBenefitId ?? existing?.linkedLoyaltyBenefitId,
    startDate: item.startDate ?? existing?.startDate,
    endDate: item.endDate ?? existing?.endDate,
    impressions: item.impressions ?? existing?.impressions ?? 0,
    clicks: item.clicks ?? existing?.clicks ?? 0,
  };

  const next = existing
    ? current.map(entry => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setMutableStore(next);
  return nextEntry;
}

export function toggleCampaignStatus(id: string) {
  const current = getCampaignItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    return { ...item, status: item.status === 'published' ? ('paused' as const) : ('published' as const) };
  });
  setMutableStore(next);
}

export function duplicateCampaignItem(id: string) {
  const source = getCampaignItems().find(item => item.id === id);
  if (!source) return null;
  return upsertCampaignItem({
    ...source,
    id: undefined,
    title: `${source.title} — نسخة`,
    status: 'draft',
  });
}

export function removeCampaignItem(id: string) {
  setMutableStore(getCampaignItems().filter(item => item.id !== id));
}
