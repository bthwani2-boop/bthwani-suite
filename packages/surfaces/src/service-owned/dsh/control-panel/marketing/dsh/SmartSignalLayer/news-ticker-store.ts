export type MarketingNewsTickerLocale = 'ar' | 'en';

export type MarketingNewsTickerKind = 'platform' | 'order' | 'promo';
export type MarketingNewsTickerSeverity = 'info' | 'success' | 'warning' | 'danger';
export type MarketingNewsTickerStatus = 'draft' | 'published';

export type MarketingNewsTickerItem = {
  id: string;
  message: string;
  kind: MarketingNewsTickerKind;
  severity: MarketingNewsTickerSeverity;
  status: MarketingNewsTickerStatus;
  source: MarketingNewsTickerSource;
  audience: MarketingNewsTickerAudience;
  deliveryMode: MarketingNewsTickerDeliveryMode;
  priority: MarketingNewsTickerPriority;
  openHour: number;
  closeHour: number;
  cooldownMinutes: number;
  repeatGapMinutes: number;
  lastShownAt?: string | null;
};

export type MarketingNewsTickerPreview = {
  isOpen: boolean;
  statusLabel: string;
  message: string;
  windowLabel: string;
};

export type MarketingNewsTickerSource = 'operations' | 'customer' | 'marketing' | 'system';
export type MarketingNewsTickerAudience = 'all' | 'client' | 'operations';
export type MarketingNewsTickerDeliveryMode = 'auto' | 'manual' | 'pinned';
export type MarketingNewsTickerPriority = 'critical' | 'high' | 'normal' | 'low';
export type MarketingTickerPlanLane = 'automatic' | 'manual' | 'pinned';
export type MarketingTickerPlanState = 'active' | 'queued' | 'suppressed';
export type MarketingTickerPlanReason = 'outside-window' | 'cooldown' | 'duplicate' | 'draft' | 'audience';

export type MarketingTickerPlanEntry = {
  item: MarketingNewsTickerItem;
  lane: MarketingTickerPlanLane;
  state: MarketingTickerPlanState;
  score: number;
  reason?: MarketingTickerPlanReason;
};

export type MarketingTickerPlan = {
  activeEntry: MarketingTickerPlanEntry | null;
  activeItem: MarketingNewsTickerItem | null;
  automaticEntries: MarketingTickerPlanEntry[];
  manualEntries: MarketingTickerPlanEntry[];
  suppressedEntries: MarketingTickerPlanEntry[];
  totalCount: number;
  automaticCount: number;
  manualCount: number;
  pinnedCount: number;
  suppressedCount: number;
};

const sourceRank: Record<MarketingNewsTickerSource, number> = {
  customer: 4,
  operations: 3,
  marketing: 2,
  system: 1,
};

const priorityRank: Record<MarketingNewsTickerPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

const deliveryRank: Record<MarketingNewsTickerDeliveryMode, number> = {
  pinned: 3,
  auto: 2,
  manual: 1,
};

const sourceLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerSource, string>> = {
  ar: {
    operations: 'العمليات',
    customer: 'العميل',
    marketing: 'التسويق',
    system: 'النظام',
  },
  en: {
    operations: 'Operations',
    customer: 'Customer',
    marketing: 'Marketing',
    system: 'System',
  },
};

const audienceLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerAudience, string>> = {
  ar: {
    all: 'الكل',
    client: 'العميل',
    operations: 'العمليات',
  },
  en: {
    all: 'All',
    client: 'Client',
    operations: 'Operations',
  },
};

const priorityLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerPriority, string>> = {
  ar: {
    critical: 'حرج',
    high: 'عالي',
    normal: 'عادي',
    low: 'منخفض',
  },
  en: {
    critical: 'Critical',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  },
};

const deliveryLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingNewsTickerDeliveryMode, string>> = {
  ar: {
    auto: 'تلقائي',
    manual: 'يدوي',
    pinned: 'مثبّت',
  },
  en: {
    auto: 'Auto',
    manual: 'Manual',
    pinned: 'Pinned',
  },
};

const planReasonLabelByLocale: Record<MarketingNewsTickerLocale, Record<MarketingTickerPlanReason, string>> = {
  ar: {
    'outside-window': 'خارج نافذة العرض',
    cooldown: 'ضمن فترة التهدئة',
    duplicate: 'مكرر',
    draft: 'مسودة',
    audience: 'غير مطابق للجمهور',
  },
  en: {
    'outside-window': 'Outside display window',
    cooldown: 'Within cooldown',
    duplicate: 'Duplicate',
    draft: 'Draft',
    audience: 'Audience mismatch',
  },
};

const marketingNewsTickerSeed: MarketingNewsTickerItem[] = [
  {
    id: 'ticker-1',
    message: 'تمت مراجعة طلبك وسيتم تحديثك في كل مرحلة مهمة.',
    kind: 'order',
    severity: 'success',
    status: 'published',
    source: 'operations',
    audience: 'client',
    deliveryMode: 'auto',
    priority: 'critical',
    openHour: 8,
    closeHour: 23,
    cooldownMinutes: 25,
    repeatGapMinutes: 90,
  },
  {
    id: 'ticker-2',
    message: 'طلبك قيد التحضير الآن، وسنرسل لك التحديث عند انتقاله للمرحلة التالية.',
    kind: 'order',
    severity: 'info',
    status: 'published',
    source: 'customer',
    audience: 'client',
    deliveryMode: 'auto',
    priority: 'high',
    openHour: 8,
    closeHour: 23,
    cooldownMinutes: 20,
    repeatGapMinutes: 60,
    lastShownAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticker-3',
    message: 'طلبك في الطريق، ويمكنك متابعة المسار أو التواصل عند الحاجة.',
    kind: 'order',
    severity: 'success',
    status: 'published',
    source: 'customer',
    audience: 'client',
    deliveryMode: 'auto',
    priority: 'high',
    openHour: 9,
    closeHour: 23,
    cooldownMinutes: 20,
    repeatGapMinutes: 60,
  },
  {
    id: 'ticker-4',
    message: 'خصم 20% لمدة 3 ساعات على المطعم المحدد اليوم.',
    kind: 'promo',
    severity: 'success',
    status: 'draft',
    source: 'marketing',
    audience: 'client',
    deliveryMode: 'manual',
    priority: 'normal',
    openHour: 9,
    closeHour: 12,
    cooldownMinutes: 45,
    repeatGapMinutes: 180,
  },
  {
    id: 'ticker-5',
    message: 'قد تكون هناك صيانة مجدولة مساء اليوم، مع بقاء المسارات محفوظة للعودة إليها.',
    kind: 'platform',
    severity: 'warning',
    status: 'published',
    source: 'system',
    audience: 'all',
    deliveryMode: 'pinned',
    priority: 'critical',
    openHour: 18,
    closeHour: 23,
    cooldownMinutes: 60,
    repeatGapMinutes: 240,
  },
];

let store = marketingNewsTickerSeed.map((item) => ({ ...item }));
let nextTickerId = store.length + 1;

function normalizeHour(value: number) {
  const hour = Math.floor(Number(value));
  if (!Number.isFinite(hour)) {
    return 0;
  }

  return Math.max(0, Math.min(23, hour));
}

function formatHour(hour: number) {
  return `${String(normalizeHour(hour)).padStart(2, '0')}:00`;
}

function isWithinOperatingHours(now: Date, openHour: number, closeHour: number) {
  const currentHour = now.getHours();

  if (openHour === closeHour) {
    return true;
  }

  if (openHour < closeHour) {
    return currentHour >= openHour && currentHour < closeHour;
  }

  return currentHour >= openHour || currentHour < closeHour;
}

function normalizeSource(value?: MarketingNewsTickerSource): MarketingNewsTickerSource {
  return value ?? 'marketing';
}

function normalizeAudience(value?: MarketingNewsTickerAudience): MarketingNewsTickerAudience {
  return value ?? 'all';
}

function normalizeDeliveryMode(value?: MarketingNewsTickerDeliveryMode): MarketingNewsTickerDeliveryMode {
  return value ?? 'manual';
}

function normalizePriority(value?: MarketingNewsTickerPriority): MarketingNewsTickerPriority {
  return value ?? 'normal';
}

function normalizeMinutes(value: number | string | undefined, fallback: number) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.max(0, Math.floor(numericValue));
}

function minutesSince(now: Date, timestamp?: string | null) {
  if (!timestamp) {
    return Number.POSITIVE_INFINITY;
  }

  return (now.getTime() - new Date(timestamp).getTime()) / 60000;
}

function shouldApplyCooldown(now: Date, item: MarketingNewsTickerItem) {
  if (!item.lastShownAt) {
    return false;
  }

  return minutesSince(now, item.lastShownAt) < item.cooldownMinutes;
}

function getTickerFingerprint(item: MarketingNewsTickerItem) {
  return [item.source, item.audience, item.message.trim().toLowerCase()].join('::');
}

function resolveLane(item: MarketingNewsTickerItem): MarketingTickerPlanLane {
  if (item.deliveryMode === 'manual') {
    return 'manual';
  }

  if (item.deliveryMode === 'pinned') {
    return 'pinned';
  }

  return 'automatic';
}

function resolveEligibilityReason(now: Date, item: MarketingNewsTickerItem, audience: MarketingNewsTickerAudience) {
  if (item.status !== 'published') {
    return 'draft' as const;
  }

  if (!(audience === 'all' || item.audience === 'all' || item.audience === audience)) {
    return 'audience' as const;
  }

  if (!isWithinOperatingHours(now, item.openHour, item.closeHour) && item.deliveryMode !== 'manual') {
    return 'outside-window' as const;
  }

  if (shouldApplyCooldown(now, item) && item.deliveryMode !== 'manual') {
    return 'cooldown' as const;
  }

  return undefined;
}

function resolveScore(item: MarketingNewsTickerItem) {
  return (
    deliveryRank[item.deliveryMode] * 100 +
    priorityRank[item.priority] * 10 +
    sourceRank[item.source]
  );
}

function cloneTicker(item: MarketingNewsTickerItem): MarketingNewsTickerItem {
  return { ...item };
}

function normalizeTicker(item: MarketingNewsTickerItem): MarketingNewsTickerItem {
  return {
    ...item,
    source: normalizeSource(item.source),
    audience: normalizeAudience(item.audience),
    deliveryMode: normalizeDeliveryMode(item.deliveryMode),
    priority: normalizePriority(item.priority),
    openHour: normalizeHour(item.openHour),
    closeHour: normalizeHour(item.closeHour),
    cooldownMinutes: normalizeMinutes(item.cooldownMinutes, 30),
    repeatGapMinutes: normalizeMinutes(item.repeatGapMinutes, 60),
    lastShownAt: item.lastShownAt ?? null,
    message: item.message.trim() || 'رسالة شريط جديدة',
  };
}

export function getMarketingTickerItems(): ReadonlyArray<MarketingNewsTickerItem> {
  return store.map(cloneTicker);
}

export function createMarketingTickerDraft(overrides: Partial<MarketingNewsTickerItem> = {}): MarketingNewsTickerItem {
  return {
    id: `ticker-${nextTickerId++}`,
    message: 'رسالة شريط جديدة',
    kind: 'order',
    severity: 'info',
    status: 'draft',
    source: 'customer',
    audience: 'client',
    deliveryMode: 'manual',
    priority: 'normal',
    openHour: 8,
    closeHour: 23,
    cooldownMinutes: 30,
    repeatGapMinutes: 60,
    lastShownAt: null,
    ...overrides,
  };
}

export function upsertMarketingTickerItem(item: MarketingNewsTickerItem): MarketingNewsTickerItem {
  const normalized = normalizeTicker(item);
  const index = store.findIndex((entry) => entry.id === normalized.id);

  if (index >= 0) {
    store = store.map((entry) => (entry.id === normalized.id ? normalized : entry));
  } else {
    store = [...store, normalized];
  }

  return cloneTicker(normalized);
}

export function toggleMarketingTickerStatus(id: string): MarketingNewsTickerItem | null {
  let updatedItem: MarketingNewsTickerItem | null = null;

  store = store.map((entry) => {
    if (entry.id !== id) {
      return entry;
    }

    updatedItem = {
      ...entry,
      status: entry.status === 'published' ? 'draft' : 'published',
    };

    return updatedItem;
  });

  return updatedItem ? cloneTicker(updatedItem) : null;
}

export function removeMarketingTickerItem(id: string): void {
  store = store.filter((entry) => entry.id !== id);
}

export function markMarketingTickerDisplayed(id: string, now: Date = new Date()): MarketingNewsTickerItem | null {
  let updatedItem: MarketingNewsTickerItem | null = null;

  store = store.map((entry) => {
    if (entry.id !== id) {
      return entry;
    }

    updatedItem = {
      ...entry,
      lastShownAt: now.toISOString(),
    };

    return updatedItem;
  });

  return updatedItem ? cloneTicker(updatedItem) : null;
}

export function buildMarketingTickerPlan(
  now: Date,
  audience: MarketingNewsTickerAudience = 'all',
  items: ReadonlyArray<MarketingNewsTickerItem> = store,
): MarketingTickerPlan {
  const normalizedItems = items.map(normalizeTicker);
  const orderedItems = [...normalizedItems].sort((left, right) => {
    const laneDelta = deliveryRank[right.deliveryMode] - deliveryRank[left.deliveryMode];
    if (laneDelta !== 0) {
      return laneDelta;
    }

    const priorityDelta = priorityRank[right.priority] - priorityRank[left.priority];
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return sourceRank[right.source] - sourceRank[left.source];
  });

  const automaticEntries: MarketingTickerPlanEntry[] = [];
  const manualEntries: MarketingTickerPlanEntry[] = [];
  const suppressedEntries: MarketingTickerPlanEntry[] = [];
  const activeFingerprints = new Set<string>();
  let activeEntry: MarketingTickerPlanEntry | null = null;

  orderedItems.forEach((item) => {
    const lane = resolveLane(item);
    const score = resolveScore(item);
    const eligibilityReason = resolveEligibilityReason(now, item, audience);
    const fingerprint = getTickerFingerprint(item);

    const entry: MarketingTickerPlanEntry = {
      item,
      lane,
      state: 'queued',
      score,
      reason: eligibilityReason,
    };

    if (lane === 'manual') {
      if (eligibilityReason) {
        entry.state = 'suppressed';
        suppressedEntries.push(entry);
      } else {
        manualEntries.push(entry);
      }

      return;
    }

    if (eligibilityReason) {
      entry.state = 'suppressed';
      suppressedEntries.push(entry);
      return;
    }

    if (activeFingerprints.has(fingerprint)) {
      entry.state = 'suppressed';
      entry.reason = 'duplicate';
      suppressedEntries.push(entry);
      return;
    }

    activeFingerprints.add(fingerprint);

    if (!activeEntry) {
      entry.state = 'active';
      activeEntry = entry;
    }

    automaticEntries.push(entry);
  });

  const activeItem = activeEntry ? (activeEntry as MarketingTickerPlanEntry).item : null;

  return {
    activeEntry,
    activeItem,
    automaticEntries,
    manualEntries,
    suppressedEntries,
    totalCount: normalizedItems.length,
    automaticCount: automaticEntries.length,
    manualCount: manualEntries.length,
    pinnedCount: normalizedItems.filter((item) => item.deliveryMode === 'pinned').length,
    suppressedCount: suppressedEntries.length,
  };
}

export function resolveMarketingTickerPreviewForItem(
  now: Date,
  item: MarketingNewsTickerItem,
  locale: MarketingNewsTickerLocale,
): MarketingNewsTickerPreview {
  const isOpen = item.status === 'published' && isWithinOperatingHours(now, item.openHour, item.closeHour);
  const isEnglish = locale === 'en';

  return {
    isOpen,
    statusLabel: item.status === 'published'
      ? isOpen
        ? isEnglish
          ? 'Live'
          : 'مباشر'
        : isEnglish
          ? 'Scheduled'
          : 'مجدول'
      : isEnglish
        ? 'Draft'
        : 'مسودة',
    message: item.message.trim() || (isEnglish ? 'New ticker message' : 'رسالة شريط جديدة'),
    windowLabel: `${formatHour(item.openHour)} - ${formatHour(item.closeHour)}`,
  };
}

export function resolveMarketingTickerSourceLabel(locale: MarketingNewsTickerLocale, source: MarketingNewsTickerSource) {
  return sourceLabelByLocale[locale][source];
}

export function resolveMarketingTickerAudienceLabel(locale: MarketingNewsTickerLocale, audience: MarketingNewsTickerAudience) {
  return audienceLabelByLocale[locale][audience];
}

export function resolveMarketingTickerPriorityLabel(locale: MarketingNewsTickerLocale, priority: MarketingNewsTickerPriority) {
  return priorityLabelByLocale[locale][priority];
}

export function resolveMarketingTickerDeliveryLabel(locale: MarketingNewsTickerLocale, deliveryMode: MarketingNewsTickerDeliveryMode) {
  return deliveryLabelByLocale[locale][deliveryMode];
}

export function resolveMarketingTickerPlanReasonLabel(locale: MarketingNewsTickerLocale, reason?: MarketingTickerPlanReason) {
  if (!reason) {
    return locale === 'en' ? 'Ready' : 'جاهز';
  }

  return planReasonLabelByLocale[locale][reason];
}