type Translate = (key: string, options?: Record<string, unknown>) => string;
type SupportedLocale = 'ar' | 'en';

type LocalizedCopy = {
  ar: string;
  en: string;
};

type CategoryVisual = {
  glyph: string;
  shortLabel: string;
  accent: string;
  soft: string;
  ring: string;
};

export type SndClientCategory = {
  id: string;
  order: number;
  name: string;
  description: string;
  enabled: boolean;
  iconHint: string;
  visual: CategoryVisual;
};

export type SndClientCategoryOverride = Partial<SndClientCategory> & {
  id: string;
  visual?: Partial<CategoryVisual>;
};

type CategorySeed = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  fallbackName: LocalizedCopy;
  fallbackDescription: LocalizedCopy;
  glyph: string;
  shortLabelKey: string;
  fallbackShortLabel: LocalizedCopy;
  accent: string;
  soft: string;
  ring: string;
  iconHint: string;
};

type SndClientCategoryDraftCopy = {
  name: LocalizedCopy;
  description: LocalizedCopy;
  shortLabel: LocalizedCopy;
};

const CATEGORY_SEEDS: CategorySeed[] = [
  {
    id: 'specialized_app_development',
    nameKey: 'snd_catalog.specialized_app_development.name',
    descriptionKey: 'snd_catalog.specialized_app_development.description',
    fallbackName: { ar: 'تطوير التطبيقات', en: 'App Development' },
    fallbackDescription: {
      ar: 'متاحة الآن',
      en: 'Available now',
    },
    glyph: 'ت',
    shortLabelKey: 'snd_catalog.specialized_app_development.short_label',
    fallbackShortLabel: { ar: 'ابدأ الطلب', en: 'Start request' },
    accent: '#1e88ff',
    soft: '#eaf4ff',
    ring: '#c8dff8',
    iconHint: 'phone-portrait-outline',
  },
  {
    id: 'specialized_graphic_design',
    nameKey: 'snd_catalog.specialized_graphic_design.name',
    descriptionKey: 'snd_catalog.specialized_graphic_design.description',
    fallbackName: { ar: 'التصميم الجرافيكي', en: 'Graphic Design' },
    fallbackDescription: {
      ar: 'متاحة الآن',
      en: 'Available now',
    },
    glyph: 'ص',
    shortLabelKey: 'snd_catalog.specialized_graphic_design.short_label',
    fallbackShortLabel: { ar: 'اختر الفئة', en: 'Choose category' },
    accent: '#7c5cff',
    soft: '#f1ecff',
    ring: '#d8cdfd',
    iconHint: 'color-palette-outline',
  },
  {
    id: 'specialized_advertising',
    nameKey: 'snd_catalog.specialized_advertising.name',
    descriptionKey: 'snd_catalog.specialized_advertising.description',
    fallbackName: { ar: 'الإعلانات', en: 'Advertising' },
    fallbackDescription: {
      ar: 'متاحة الآن',
      en: 'Available now',
    },
    glyph: 'إ',
    shortLabelKey: 'snd_catalog.specialized_advertising.short_label',
    fallbackShortLabel: { ar: 'اختر الفئة', en: 'Choose category' },
    accent: '#ff8a3d',
    soft: '#fff2e8',
    ring: '#ffd6bd',
    iconHint: 'megaphone-outline',
  },
  {
    id: 'specialized_financial_consulting',
    nameKey: 'snd_catalog.specialized_financial_consulting.name',
    descriptionKey: 'snd_catalog.specialized_financial_consulting.description',
    fallbackName: { ar: 'الاستشارات المالية', en: 'Financial Consulting' },
    fallbackDescription: {
      ar: 'متاحة الآن',
      en: 'Available now',
    },
    glyph: 'م',
    shortLabelKey: 'snd_catalog.specialized_financial_consulting.short_label',
    fallbackShortLabel: { ar: 'اختر الفئة', en: 'Choose category' },
    accent: '#b98418',
    soft: '#fff8e8',
    ring: '#f1dfb4',
    iconHint: 'wallet-outline',
  },
  {
    id: 'specialized_legal_consulting',
    nameKey: 'snd_catalog.specialized_legal_consulting.name',
    descriptionKey: 'snd_catalog.specialized_legal_consulting.description',
    fallbackName: { ar: 'الاستشارات القانونية', en: 'Legal Consulting' },
    fallbackDescription: {
      ar: 'متاحة الآن',
      en: 'Available now',
    },
    glyph: 'ق',
    shortLabelKey: 'snd_catalog.specialized_legal_consulting.short_label',
    fallbackShortLabel: { ar: 'اختر الفئة', en: 'Choose category' },
    accent: '#58708c',
    soft: '#eff4fa',
    ring: '#d7e0ea',
    iconHint: 'document-text-outline',
  },
  {
    id: 'specialized_web_development',
    nameKey: 'snd_catalog.specialized_web_development.name',
    descriptionKey: 'snd_catalog.specialized_web_development.description',
    fallbackName: { ar: 'تطوير الويب', en: 'Web Development' },
    fallbackDescription: {
      ar: 'متاحة الآن',
      en: 'Available now',
    },
    glyph: 'و',
    shortLabelKey: 'snd_catalog.specialized_web_development.short_label',
    fallbackShortLabel: { ar: 'اختر الفئة', en: 'Choose category' },
    accent: '#1fb7a6',
    soft: '#e8fbf6',
    ring: '#c9efe6',
    iconHint: 'globe-outline',
  },
  {
    id: 'specialized_maintenance',
    nameKey: 'snd_catalog.specialized_maintenance.name',
    descriptionKey: 'snd_catalog.specialized_maintenance.description',
    fallbackName: { ar: 'الصيانة المتخصصة', en: 'Specialized Maintenance' },
    fallbackDescription: {
      ar: 'متاحة الآن',
      en: 'Available now',
    },
    glyph: 'ع',
    shortLabelKey: 'snd_catalog.specialized_maintenance.short_label',
    fallbackShortLabel: { ar: 'اختر الفئة', en: 'Choose category' },
    accent: '#6d7f95',
    soft: '#eef3f8',
    ring: '#d5dfeb',
    iconHint: 'build-outline',
  },
  {
    id: 'specialized_marketing_campaigns',
    nameKey: 'snd_catalog.specialized_marketing_campaigns.name',
    descriptionKey: 'snd_catalog.specialized_marketing_campaigns.description',
    fallbackName: { ar: 'الحملات التسويقية', en: 'Marketing Campaigns' },
    fallbackDescription: {
      ar: 'متاحة الآن',
      en: 'Available now',
    },
    glyph: 'س',
    shortLabelKey: 'snd_catalog.specialized_marketing_campaigns.short_label',
    fallbackShortLabel: { ar: 'اختر الفئة', en: 'Choose category' },
    accent: '#28b36a',
    soft: '#ecfbf2',
    ring: '#caefd9',
    iconHint: 'trending-up-outline',
  },
];

export const SND_SERVICE_ENABLED_VAR_KEY = 'VAR_SVC_SND_ENABLED';
export const SND_CLIENT_CATEGORIES_VAR_KEY = 'VAR_SND_CLIENT_CATEGORIES';

function getLocaleFallback(fallback: LocalizedCopy, language: string): string {
  return language === 'en' ? fallback.en : fallback.ar;
}

function translateCatalogCopy(
  t: Translate,
  key: string,
  fallback: LocalizedCopy,
  language: string
): string {
  const translated = t(key);
  return translated === key
    ? getLocaleFallback(fallback, language)
    : translated;
}

function resolveCatalogValue(
  value: unknown,
  fallback: string,
  t: Translate,
  language: string
): string {
  const parsed = parseString(value, fallback);
  if (parsed.startsWith('snd_catalog.')) {
    const translated = t(parsed);
    return translated === parsed ? fallback : translated;
  }

  return parsed;
}

function buildDraftCategoryCopy(
  t: Translate,
  language: string
): SndClientCategoryDraftCopy {
  return {
    name: {
      ar: translateCatalogCopy(
        t,
        'snd_catalog.draft.name',
        { ar: 'فئة مخصصة', en: 'Custom Category' },
        'ar'
      ),
      en: translateCatalogCopy(
        t,
        'snd_catalog.draft.name',
        { ar: 'فئة مخصصة', en: 'Custom Category' },
        'en'
      ),
    },
    description: {
      ar: translateCatalogCopy(
        t,
        'snd_catalog.draft.description',
        { ar: 'متاحة الآن', en: 'Available now' },
        'ar'
      ),
      en: translateCatalogCopy(
        t,
        'snd_catalog.draft.description',
        { ar: 'متاحة الآن', en: 'Available now' },
        'en'
      ),
    },
    shortLabel: {
      ar: translateCatalogCopy(
        t,
        'snd_catalog.draft.short_label',
        { ar: 'اختر الفئة', en: 'Choose category' },
        'ar'
      ),
      en: translateCatalogCopy(
        t,
        'snd_catalog.draft.short_label',
        { ar: 'اختر الفئة', en: 'Choose category' },
        'en'
      ),
    },
  };
}

function parseString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function parseNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseRuntimeBoolean(
  value: unknown,
  fallback: boolean
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parseRuntimeJson(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function buildDraftCategory(
  order: number,
  draftCopy: SndClientCategoryDraftCopy,
  language: string
): SndClientCategory {
  return {
    id: `snd_custom_${order}`,
    order,
    name: getLocaleFallback(draftCopy.name, language),
    description: getLocaleFallback(draftCopy.description, language),
    enabled: true,
    iconHint: 'grid-outline',
    visual: {
      glyph: 'ج',
      shortLabel: getLocaleFallback(draftCopy.shortLabel, language),
      accent: '#0f172a',
      soft: '#f8fafc',
      ring: '#cbd5e1',
    },
  };
}

function normalizeCategory(
  value: unknown,
  fallback: SndClientCategory,
  t: Translate,
  language: string
): SndClientCategory {
  const source =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {};
  const visualSource =
    source.visual && typeof source.visual === 'object'
      ? (source.visual as Record<string, unknown>)
      : {};

  return {
    id: parseString(source.id, fallback.id),
    order: parseNumber(source.order, fallback.order),
    name: resolveCatalogValue(source.name, fallback.name, t, language),
    description: resolveCatalogValue(
      source.description,
      fallback.description,
      t,
      language
    ),
    enabled: parseRuntimeBoolean(source.enabled, fallback.enabled),
    iconHint: parseString(
      source.iconHint ?? source.iconName ?? source.icon,
      fallback.iconHint
    ),
    visual: {
      glyph: parseString(
        visualSource.glyph ?? source.glyph,
        fallback.visual.glyph
      ),
      shortLabel: parseString(
        resolveCatalogValue(
          visualSource.shortLabel ?? source.shortLabel,
          fallback.visual.shortLabel,
          t,
          language
        ),
        fallback.visual.shortLabel
      ),
      accent: parseString(
        visualSource.accent ?? visualSource.accentColor ?? source.accent,
        fallback.visual.accent
      ),
      soft: parseString(
        visualSource.soft ?? visualSource.softBg ?? source.soft,
        fallback.visual.soft
      ),
      ring: parseString(
        visualSource.ring ?? visualSource.ringBorder ?? source.ring,
        fallback.visual.ring
      ),
    },
  };
}

export function buildDefaultSndClientCategories(
  t: Translate,
  language: string = 'ar'
): SndClientCategory[] {
  return CATEGORY_SEEDS.map((seed, index) => ({
    id: seed.id,
    order: index + 1,
    name: translateCatalogCopy(t, seed.nameKey, seed.fallbackName, language),
    description: translateCatalogCopy(
      t,
      seed.descriptionKey,
      seed.fallbackDescription,
      language
    ),
    enabled: true,
    iconHint: seed.iconHint,
    visual: {
      glyph: seed.glyph,
      shortLabel: translateCatalogCopy(
        t,
        seed.shortLabelKey,
        seed.fallbackShortLabel,
        language
      ),
      accent: seed.accent,
      soft: seed.soft,
      ring: seed.ring,
    },
  }));
}

export function mergeSndClientCategories(
  defaults: SndClientCategory[],
  runtimeValue: unknown,
  t: Translate,
  language: string = 'ar'
): SndClientCategory[] {
  const parsed = parseRuntimeJson(runtimeValue);
  const rawEntries = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === 'object' &&
        Array.isArray((parsed as { categories?: unknown[] }).categories)
      ? (parsed as { categories: unknown[] }).categories
      : [];

  if (rawEntries.length === 0) {
    return [...defaults].sort((left, right) => left.order - right.order);
  }

  const byId = new Map(defaults.map(category => [category.id, category]));
  const mergedDefaults = defaults.map(category => {
    const override = rawEntries.find(entry => {
      if (!entry || typeof entry !== 'object') {
        return false;
      }

      return (entry as { id?: unknown }).id === category.id;
    });

    return normalizeCategory(override, category, t, language);
  });

  const customEntries = rawEntries.filter(entry => {
    if (!entry || typeof entry !== 'object') {
      return false;
    }

    const id = (entry as { id?: unknown }).id;
    return typeof id === 'string' && !byId.has(id);
  });

  const draftCopy = buildDraftCategoryCopy(t, language);
  const customCategories = customEntries.map((entry, index) => {
    const fallback = {
      ...buildDraftCategory(defaults.length + index + 1, draftCopy, language),
      id:
        parseString(
          entry && typeof entry === 'object'
            ? (entry as { id?: unknown }).id
            : undefined,
          ''
        ) || `snd_custom_${defaults.length + index + 1}`,
    };

    return normalizeCategory(entry, fallback, t, language);
  });

  return [...mergedDefaults, ...customCategories].sort(
    (left, right) => left.order - right.order
  );
}

export function filterEnabledSndClientCategories(
  categories: SndClientCategory[]
): SndClientCategory[] {
  return categories.filter(category => category.enabled !== false);
}
