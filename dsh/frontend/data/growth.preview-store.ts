// Inline hex value derived from ui-kit/src/foundation.ts rawColorPalettes.brand[500].
// dsh/frontend/data must not import from @bthwani/ui-kit.
const _BRAND = '#FF500D' as const;

/**
 * LEGACY COMPATIBILITY:
 * 'promotion', 'subscription', 'shorts' are marked for migration.
 * Please use campaign-store.ts or partner-offer-store.ts for new commercial data ownership.
 */
/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const growthStoreDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

export type MarketingGrowthFamily = 'campaign' | /* @deprecated moved to partner-offer-store */ 'promotion' | /* @deprecated moved to loyalty-store */ 'subscription' | /* @deprecated moved to video-store */ 'shorts';
export type MarketingGrowthSource = 'marketing' | 'partner';
export type MarketingGrowthStatus = 'draft' | 'pending-marketing' | 'published' | 'paused';
export type MarketingGrowthAudience = 'all' | 'client' | 'operations';
export type MarketingGrowthRouteTarget =
  | 'home'
  | 'promo-apply'
  | 'main_category'
  | 'sub_category'
  | 'store'
// --- LEGACY COMPATIBILITY EXPORTS ---
// These are kept strictly for type compatibility across the monolithic application
// until all older consumers are fully migrated to their new respective stores.
// DO NOT use these for new commercial features.
  | 'product'
  | 'search';

export type MarketingGrowthRecord = {
  id: string;
  title: string;
  subtitle: string;
  family: MarketingGrowthFamily;
  status: MarketingGrowthStatus;
  audience: MarketingGrowthAudience;
  source: MarketingGrowthSource;
  routeTarget: MarketingGrowthRouteTarget;
  routeTargetId?: string;
  routeTargetExtra?: string;
  ctaLabel: string;
  highlight: string;
  metricValue: string;
  accentColor: string;
  impressions: number;
  clicks: number;
};

const STORE_KEY = '__BTHWANI_DSH_MARKETING_GROWTH__';

const seededGrowthItems: MarketingGrowthRecord[] = [];

function getGlobalStore(): typeof globalThis & { [STORE_KEY]?: MarketingGrowthRecord[] } {
  return globalThis as typeof globalThis & { [STORE_KEY]?: MarketingGrowthRecord[] };
}

function getMutableStore(): MarketingGrowthRecord[] {
  const scope = getGlobalStore();
  if (!scope[STORE_KEY]) {
    scope[STORE_KEY] = seededGrowthItems.map((item) => ({ ...item }));
  }
  return scope[STORE_KEY] ?? [];
}

function setMutableStore(next: MarketingGrowthRecord[]) {
  getGlobalStore()[STORE_KEY] = next.map((item) => ({ ...item }));
}

function sortGrowthItems(items: MarketingGrowthRecord[]) {
  return [...items].sort((left, right) => {
    const leftWeight = left.status === 'published' ? 0 : left.status === 'pending-marketing' ? 1 : left.status === 'draft' ? 2 : 3;
    const rightWeight = right.status === 'published' ? 0 : right.status === 'pending-marketing' ? 1 : right.status === 'draft' ? 2 : 3;
    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }
    return left.title.localeCompare(right.title, 'ar');
  });
}

export function getMarketingGrowthItems(): MarketingGrowthRecord[] {
  return sortGrowthItems(getMutableStore());
}

export function getLiveMarketingGrowthItems(audience: MarketingGrowthAudience | 'all' = 'all'): MarketingGrowthRecord[] {
  return getMarketingGrowthItems().filter((item) => {
    if (item.status !== 'published') return false;
    return audience === 'all' || item.audience === 'all' || item.audience === audience;
  });
}

export function getMarketingGrowthKpis() {
  const items = getMarketingGrowthItems();
  const live = items.filter((item) => item.status === 'published');
  return {
    total: items.length,
    live: live.length,
    pendingMarketing: items.filter((item) => item.status === 'pending-marketing').length,
    promotions: live.length,
    impressions: live.reduce((sum, item) => sum + item.impressions, 0),
    clicks: live.reduce((sum, item) => sum + item.clicks, 0),
  };
}

export function upsertMarketingGrowthItem(item: Partial<MarketingGrowthRecord>) {
  const current = getMarketingGrowthItems();
  const nextId = item.id ?? `marketing-growth-${Date.now()}`;
  const existing = current.find((entry) => entry.id === nextId);

  const nextEntry: MarketingGrowthRecord = {
    id: nextId,
    title: item.title?.trim() || existing?.title || 'برنامج تسويقي جديد',
    subtitle: item.subtitle?.trim() || existing?.subtitle || 'أضف وصفًا واضحًا للمسار الترويجي.',
    family: item.family ?? existing?.family ?? 'campaign',
    status: item.status ?? existing?.status ?? 'draft',
    audience: item.audience ?? existing?.audience ?? 'client',
    source: item.source ?? existing?.source ?? 'marketing',
    routeTarget: item.routeTarget ?? existing?.routeTarget ?? 'home',
    routeTargetId: item.routeTargetId?.trim() || existing?.routeTargetId,
    routeTargetExtra: item.routeTargetExtra?.trim() || existing?.routeTargetExtra,
    ctaLabel: item.ctaLabel?.trim() || existing?.ctaLabel || 'فتح الآن',
    highlight: item.highlight?.trim() || existing?.highlight || 'مهيأ للنشر',
    metricValue: item.metricValue?.trim() || existing?.metricValue || 'بدون بيانات',
    accentColor: item.accentColor?.trim() || existing?.accentColor || _BRAND,
    impressions: item.impressions ?? existing?.impressions ?? 0,
    clicks: item.clicks ?? existing?.clicks ?? 0,
  };

  const next = existing
    ? current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry))
    : [nextEntry, ...current];

  setMutableStore(next);
  return nextEntry;
}

export function approveMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'published' as const } : item));
  setMutableStore(next);
}

export function pauseMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'paused' as const } : item));
  setMutableStore(next);
}

export function submitMarketingGrowthItem(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => (item.id === id ? { ...item, status: 'pending-marketing' as const } : item));
  setMutableStore(next);
}

export function toggleMarketingGrowthStatus(id: string) {
  const current = getMarketingGrowthItems();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const nextStatus: MarketingGrowthStatus = item.status === 'published' ? 'paused' : 'published';
    return { ...item, status: nextStatus };
  });
  setMutableStore(next);
}

export function duplicateMarketingGrowthItem(id: string) {
  const source = getMarketingGrowthItems().find((item) => item.id === id);
  if (!source) return null;
  return upsertMarketingGrowthItem({
    ...source,
    id: undefined,
    title: `${source.title} — نسخة`,
    status: 'draft',
  });
}

export function removeMarketingGrowthItem(id: string) {
  setMutableStore(getMarketingGrowthItems().filter((item) => item.id !== id));
}

// --- NEW GROWTH INTELLIGENCE MODELS (PHASE 1) ---

export type GrowthRecommendationType = 'opportunity' | 'gap' | 'risk';

export type GrowthRecommendation = {
  id: string;
  type: GrowthRecommendationType;
  title: string;
  description: string;
  nextAction: string;
  actionTargetTab: 'partners' | 'campaigns' | 'loyalty' | 'video' | 'ticker';
  owner: string;
  source: string;
  affectedSurface: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: 'low' | 'medium' | 'high';
  linkedRecordId?: string;
};

export function getGrowthRecommendations(): GrowthRecommendation[] {
  return [
    {
      id: 'rec-1',
      type: 'opportunity',
      title: 'عرض شريك جاهز ولم يدخل حملة',
      description: 'يوجد عرض "خصم 20%" جاهز للتسويق، يمكن ربطه بحملة لزيادة التفاعل.',
      nextAction: 'ربط بحملة',
      actionTargetTab: 'campaigns',
      owner: 'عروض الشركاء',
      source: 'محرك التسويق',
      affectedSurface: 'واجهة الرئيسية',
      severity: 'medium',
      confidence: 'high',
      linkedRecordId: 'offer-1',
    },
    {
      id: 'rec-2',
      type: 'gap',
      title: 'فيديو جاهز بدون حملة',
      description: 'فيديو "إطلاق الهوية الجديدة" معتمد لكن لم يتم ربطه بحملة ترويجية.',
      nextAction: 'إنشاء حملة',
      actionTargetTab: 'campaigns',
      owner: 'استوديو الفيديو',
      source: 'محرك المحتوى',
      affectedSurface: 'تبويب الفيديوهات',
      severity: 'high',
      confidence: 'high',
      linkedRecordId: 'video-launch-2026',
    },
    {
      id: 'rec-3',
      type: 'risk',
      title: 'تضارب شارات بطاقة المتجر',
      description: 'متجر يعرض شارة توصيل مجاني ولكن العرض موقوف في الكتالوج.',
      nextAction: 'مراجعة عروض الشركاء',
      actionTargetTab: 'partners',
      owner: 'مزامنة الكتالوج',
      source: 'فاحص التطابق',
      affectedSurface: 'بطاقة المتجر',
      severity: 'critical',
      confidence: 'high',
    },
    {
      id: 'rec-4',
      type: 'opportunity',
      title: 'ميزة بثواني برو معطلة للمشتركين',
      description: 'يوجد مشتركين في باقة برو لم تفعل لهم الاستحقاقات.',
      nextAction: 'مراجعة الولاء',
      actionTargetTab: 'loyalty',
      owner: 'محرك الولاء',
      source: 'مزامنة الاشتراكات',
      affectedSurface: 'صفحة الدفع',
      severity: 'high',
      confidence: 'high',
    },
    {
      id: 'rec-5',
      type: 'risk',
      title: 'شارة تجارية يتيمة (Orphaned Badge)',
      description: 'تم اكتشاف شارة "خصم 50%" نشطة في البطاقة ولكن لا يوجد سجل عرض مرتبط في النظام.',
      nextAction: 'إزالة أو تصحيح العرض',
      actionTargetTab: 'partners',
      owner: 'فاحص التطابق',
      source: 'نظام التدقيق التجاري',
      affectedSurface: 'تطبيق العميل',
      severity: 'critical',
      confidence: 'high',
    },
    {
      id: 'rec-6',
      type: 'risk',
      title: 'عرض منشور لا يظهر في البطاقة',
      description: 'عرض "توصيل مجاني" في حالة النشر ولكن تم حجبه بسبب تضارب مع ميزة بثواني برو.',
      nextAction: 'حل تضارب المصادر',
      actionTargetTab: 'campaigns',
      owner: 'منسق الحملات',
      source: 'محرك القواعد',
      affectedSurface: 'بطاقة المتجر',
      severity: 'medium',
      confidence: 'high',
    }
  ];
}
