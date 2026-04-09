'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DirectionalIcon, useI18n } from '@bthwani/ui-kit';
import {
  SND_CLIENT_CATEGORIES_VAR_KEY,
  SND_SERVICE_ENABLED_VAR_KEY,
} from '../../../../../snd/hooks/sndClientCatalog';
import {
  SND_CATEGORY_FIXTURES,
  SND_REQUEST_FIXTURES,
  type SndCategoryFixture,
  type SndRequestFixture,
} from '../../fixtures/snd';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpLeft,
  Check,
  ChevronLeft,
  CopyPlus,
  Eye,
  EyeOff,
  FileText,
  Globe2,
  Hammer,
  Heart,
  LayoutGrid,
  ListTodo,
  Megaphone,
  Palette,
  Plus,
  Power,
  RefreshCw,
  Smartphone,
  TrendingUp,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

const VAR_SERVICE_ENABLED = SND_SERVICE_ENABLED_VAR_KEY;
const VAR_CLIENT_CATEGORIES = SND_CLIENT_CATEGORIES_VAR_KEY;

type Translate = (key: string, options?: Record<string, unknown>) => string;

type QueueStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

type CategoryVisual = {
  glyph: string;
  shortLabel: string;
  accent: string;
  soft: string;
  ring: string;
};

type SndClientCategory = {
  id: string;
  order: number;
  name: string;
  description: string;
  enabled: boolean;
  iconHint: string;
  iconImageUrl: string;
  visual: CategoryVisual;
};

type QueueItem = {
  id: string;
  ref: string;
  title: string;
  status: QueueStatus;
  updated: string;
  source: string;
  categoryId: string;
  owner: string;
  requester: string;
  clientName: string;
  channel: string;
  eta: string;
  summary: string;
  signals: string[];
};

type RuntimeVarResolveResponse = {
  key: string;
  resolved_value?: unknown;
  value?: unknown;
};

type RuntimeVarUpsertRequest = {
  key: string;
  value: boolean | string | number | object | Array<unknown>;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  category?: string;
};

type RuntimeVarUpsertResponse = {
  key: string;
  value: unknown;
  updatedAt?: string | null;
  updated_at?: string | null;
};

type ActionPlan = {
  label: string;
  hint: string;
  success: string;
  nextStatus?: QueueStatus;
};

type BadgeTone = 'neutral' | 'accent' | 'live' | 'warn';

type WorkspaceMode = 'studio' | 'requests';

type StudioInspectorSection =
  | 'identity'
  | 'visuals'
  | 'publishing'
  | 'insights';

type StudioPicker = 'icons' | 'themes' | null;

type AnalyticsView = 'flows' | 'forensics' | 'coverage' | 'system';

type RequestFilter = 'all' | 'active' | QueueStatus;

type RequestStageState = 'done' | 'current' | 'upcoming';

type RequestStage = {
  id: string;
  label: string;
  hint: string;
  state: RequestStageState;
};

type VisualTheme = {
  id: string;
  label: string;
  accent: string;
  soft: string;
  ring: string;
  cardClass: string;
  frameClass: string;
  iconBoxClass: string;
  labelClass: string;
  chipClass: string;
};

const ACTIVE_SURFACE_CLASS =
  'border-[#f1ceb4] bg-[linear-gradient(135deg,#fff8f1,#f7eadf)] text-[#724325] shadow-[0_18px_36px_rgba(191,127,76,0.16)]';
const ACTIVE_SURFACE_META_CLASS = 'bg-white/80 text-[#9b5b2a]';
const PRIMARY_ACTION_BUTTON_CLASS =
  'bg-[linear-gradient(135deg,#f5ad74,#ee8348)] text-white shadow-[0_18px_34px_rgba(238,131,72,0.28)] hover:brightness-105';
const SOFT_DECISION_PANEL_CLASS =
  'border-[#f1d8c2] bg-[linear-gradient(145deg,#fffaf4,#f8ebe0)] text-[#6e4122] shadow-[0_18px_36px_rgba(180,126,82,0.14)]';
const SOFT_RING_CLASS = 'ring-2 ring-[#f0bf9d]/70';

const ICON_PRESETS: Array<{
  value: string;
  label: string;
  icon: LucideIcon;
}> = [
  { value: 'phone-portrait-outline', label: 'تطبيق', icon: Smartphone },
  { value: 'color-palette-outline', label: 'تصميم', icon: Palette },
  { value: 'megaphone-outline', label: 'إعلان', icon: Megaphone },
  { value: 'wallet-outline', label: 'مالي', icon: Wallet },
  { value: 'document-text-outline', label: 'قانوني', icon: FileText },
  { value: 'globe-outline', label: 'ويب', icon: Globe2 },
  { value: 'build-outline', label: 'صيانة', icon: Hammer },
  { value: 'trending-up-outline', label: 'تسويق', icon: TrendingUp },
  { value: 'heart-outline', label: 'خير', icon: Heart },
  { value: 'construct-outline', label: 'هندسي', icon: Wrench },
  { value: 'grid-outline', label: 'عام', icon: LayoutGrid },
];

const VISUAL_THEMES: VisualTheme[] = [
  {
    id: 'sky',
    label: 'أزرق',
    accent: '#1e88ff',
    soft: '#eaf4ff',
    ring: '#c8dff8',
    cardClass: 'border-[#c8dff8] bg-[#eaf4ff]',
    frameClass: 'border-[#c8dff8]',
    iconBoxClass: 'bg-[#dbeafe]',
    labelClass: 'text-[#1e88ff]',
    chipClass: 'bg-[#eaf4ff] text-[#1e88ff]',
  },
  {
    id: 'violet',
    label: 'بنفسجي',
    accent: '#7c5cff',
    soft: '#f1ecff',
    ring: '#d8cdfd',
    cardClass: 'border-[#d8cdfd] bg-[#f1ecff]',
    frameClass: 'border-[#d8cdfd]',
    iconBoxClass: 'bg-[#ede9fe]',
    labelClass: 'text-[#7c5cff]',
    chipClass: 'bg-[#f1ecff] text-[#7c5cff]',
  },
  {
    id: 'orange',
    label: 'برتقالي',
    accent: '#ff8a3d',
    soft: '#fff2e8',
    ring: '#ffd6bd',
    cardClass: 'border-[#ffd6bd] bg-[#fff2e8]',
    frameClass: 'border-[#ffd6bd]',
    iconBoxClass: 'bg-[#ffedd5]',
    labelClass: 'text-[#ff8a3d]',
    chipClass: 'bg-[#fff2e8] text-[#ff8a3d]',
  },
  {
    id: 'amber',
    label: 'ذهبي',
    accent: '#b98418',
    soft: '#fff8e8',
    ring: '#f1dfb4',
    cardClass: 'border-[#f1dfb4] bg-[#fff8e8]',
    frameClass: 'border-[#f1dfb4]',
    iconBoxClass: 'bg-[#fef3c7]',
    labelClass: 'text-[#b98418]',
    chipClass: 'bg-[#fff8e8] text-[#b98418]',
  },
  {
    id: 'slate',
    label: 'رصاصي',
    accent: '#58708c',
    soft: '#eff4fa',
    ring: '#d7e0ea',
    cardClass: 'border-[#d7e0ea] bg-[#eff4fa]',
    frameClass: 'border-[#d7e0ea]',
    iconBoxClass: 'bg-[#e2e8f0]',
    labelClass: 'text-[#58708c]',
    chipClass: 'bg-[#eff4fa] text-[#58708c]',
  },
  {
    id: 'teal',
    label: 'فيروزي',
    accent: '#1fb7a6',
    soft: '#e8fbf6',
    ring: '#c9efe6',
    cardClass: 'border-[#c9efe6] bg-[#e8fbf6]',
    frameClass: 'border-[#c9efe6]',
    iconBoxClass: 'bg-[#ccfbf1]',
    labelClass: 'text-[#1fb7a6]',
    chipClass: 'bg-[#e8fbf6] text-[#1fb7a6]',
  },
  {
    id: 'steel',
    label: 'فولاذي',
    accent: '#6d7f95',
    soft: '#eef3f8',
    ring: '#d5dfeb',
    cardClass: 'border-[#d5dfeb] bg-[#eef3f8]',
    frameClass: 'border-[#d5dfeb]',
    iconBoxClass: 'bg-[#e2e8f0]',
    labelClass: 'text-[#6d7f95]',
    chipClass: 'bg-[#eef3f8] text-[#6d7f95]',
  },
  {
    id: 'emerald',
    label: 'أخضر',
    accent: '#28b36a',
    soft: '#ecfbf2',
    ring: '#caefd9',
    cardClass: 'border-[#caefd9] bg-[#ecfbf2]',
    frameClass: 'border-[#caefd9]',
    iconBoxClass: 'bg-[#dcfce7]',
    labelClass: 'text-[#28b36a]',
    chipClass: 'bg-[#ecfbf2] text-[#28b36a]',
  },
  {
    id: 'neutral',
    label: 'محايد',
    accent: '#0f172a',
    soft: '#f8fafc',
    ring: '#cbd5e1',
    cardClass: 'border-[#cbd5e1] bg-[#f8fafc]',
    frameClass: 'border-[#cbd5e1]',
    iconBoxClass: 'bg-[#e2e8f0]',
    labelClass: 'text-[#0f172a]',
    chipClass: 'bg-[#f8fafc] text-[#0f172a]',
  },
];

const NEUTRAL_VISUAL_THEME =
  VISUAL_THEMES.find(theme => theme.id === 'neutral') ??
  VISUAL_THEMES[VISUAL_THEMES.length - 1];

function getThemeForCategory(
  category?: Pick<SndClientCategory, 'visual'> | null
): VisualTheme {
  return NEUTRAL_VISUAL_THEME;
}

const STATUS_META: Record<
  QueueStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: 'قيد الانتظار',
    className: 'border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]',
  },
  in_progress: {
    label: 'قيد التنفيذ',
    className: 'border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]',
  },
  completed: {
    label: 'مغلق',
    className: 'border-[#cbd5e1] bg-[#f8fafc] text-[#475569]',
  },
  cancelled: {
    label: 'ملغي',
    className: 'border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]',
  },
};

const REQUEST_STAGE_FLOW: Array<Omit<RequestStage, 'state'>> = [
  {
    id: 'pending',
    label: 'انتظار',
    hint: 'الطلب ينتظر المعالجة.',
  },
  {
    id: 'in_progress',
    label: 'تنفيذ',
    hint: 'قيد التنفيذ.',
  },
  {
    id: 'completed',
    label: 'إغلاق',
    hint: 'تم الإغلاق.',
  },
];

function isClosedQueueStatus(status: QueueStatus): boolean {
  return status === 'completed' || status === 'cancelled';
}

function safeT(t: Translate, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

async function resolveRuntimeVar(key: string): Promise<unknown> {
  const response = await fetch(
    `/api/platform/governance/runtime-vars/key/${encodeURIComponent(key)}/resolve`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    return undefined;
  }

  const data: RuntimeVarResolveResponse = await response.json();
  return data?.resolved_value ?? data?.value;
}

async function upsertRuntimeVar(
  key: string,
  value: RuntimeVarUpsertRequest['value'],
  type: RuntimeVarUpsertRequest['type'],
  description: string
): Promise<RuntimeVarUpsertResponse | null> {
  const response = await fetch('/api/platform/governance/runtime-vars/upsert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      key,
      value,
      type,
      description,
      category: 'features',
    } satisfies RuntimeVarUpsertRequest),
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

function parseBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return fallback;
  return String(value).toLowerCase() === 'true';
}

function parseNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0
    ? value
    : fallback;
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

function buildDraftCategory(order: number): SndClientCategory {
  return {
    id: `snd_custom_${order}`,
    order,
    name: 'فئة جديدة',
    description: 'تفاصيل الفئة قبل نشرها لتطبيق العميل.',
    enabled: true,
    iconHint: 'grid-outline',
    iconImageUrl: '',
    visual: {
      glyph: 'ج',
      shortLabel: 'جديد',
      accent: '#0f172a',
      soft: '#f8fafc',
      ring: '#cbd5e1',
    },
  };
}

function normalizeCategory(
  value: unknown,
  fallback: SndClientCategory
): SndClientCategory {
  const source =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {};
  const visualSource =
    source.visual && typeof source.visual === 'object'
      ? (source.visual as Record<string, unknown>)
      : {};
  const iconImageSource =
    source.iconImageUrl ??
    source.iconImage ??
    source.imageUrl ??
    visualSource.iconImageUrl ??
    visualSource.imageUrl;

  return {
    id: parseString(source.id, fallback.id),
    order: parseNumber(source.order, fallback.order),
    name: parseString(source.name, fallback.name),
    description: parseString(source.description, fallback.description),
    enabled: parseBool(source.enabled, fallback.enabled),
    iconHint: parseString(
      source.iconHint ?? source.iconName ?? source.icon,
      fallback.iconHint
    ),
    iconImageUrl:
      typeof iconImageSource === 'string'
        ? iconImageSource.trim()
        : fallback.iconImageUrl,
    visual: {
      glyph: parseString(
        visualSource.glyph ?? source.glyph,
        fallback.visual.glyph
      ),
      shortLabel: parseString(
        visualSource.shortLabel ?? source.shortLabel,
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

function mergeRuntimeCategories(
  defaults: SndClientCategory[],
  runtimeValue: unknown
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

    return normalizeCategory(override, category);
  });

  const customEntries = rawEntries.filter(entry => {
    if (!entry || typeof entry !== 'object') {
      return false;
    }

    const id = (entry as { id?: unknown }).id;
    return typeof id === 'string' && !byId.has(id);
  });

  const customCategories = customEntries.map((entry, index) => {
    const fallback = {
      ...buildDraftCategory(defaults.length + index + 1),
      id:
        parseString(
          entry && typeof entry === 'object'
            ? (entry as { id?: unknown }).id
            : undefined,
          ''
        ) || `snd_custom_${defaults.length + index + 1}`,
    };

    return normalizeCategory(entry, fallback);
  });

  return [...mergedDefaults, ...customCategories].sort(
    (left, right) => left.order - right.order
  );
}

function serializeRuntimeCategories(categories: SndClientCategory[]) {
  return [...categories]
    .sort((left, right) => left.order - right.order)
    .map(category => ({
      id: category.id,
      order: category.order,
      enabled: category.enabled,
      name: category.name.trim(),
      description: category.description.trim(),
      iconHint: category.iconHint,
      iconImageUrl: category.iconImageUrl.trim(),
      visual: {
        glyph: category.visual.glyph.trim() || category.name.trim().charAt(0),
        shortLabel: category.visual.shortLabel.trim() || category.name.trim(),
        accent: category.visual.accent,
        soft: category.visual.soft,
        ring: category.visual.ring,
      },
    }));
}

function buildPageClientCategories(): SndClientCategory[] {
  return SND_CATEGORY_FIXTURES.map((seed: SndCategoryFixture) => ({
    id: seed.id,
    order: seed.order,
    name: seed.name,
    description: seed.description,
    enabled: seed.enabled,
    iconHint: seed.iconHint,
    iconImageUrl: seed.iconImageUrl ?? '',
    visual: { ...seed.visual },
  }));
}

function buildInitialQueue(): QueueItem[] {
  return SND_REQUEST_FIXTURES.map((item: SndRequestFixture) => ({
    ...item,
    signals: [...item.signals],
  }));
}

function buildRequestStages(status: QueueStatus): RequestStage[] {
  if (status === 'cancelled') {
    return [
      {
        id: 'pending',
        label: 'انتظار',
        hint: 'تم تسجيل الطلب قبل إلغائه.',
        state: 'done',
      },
      {
        id: 'cancelled',
        label: 'إلغاء',
        hint: 'أغلق الطلب دون استكمال التنفيذ.',
        state: 'current',
      },
    ];
  }

  const currentIndex = REQUEST_STAGE_FLOW.findIndex(
    stage => stage.id === status
  );
  const resolvedIndex = currentIndex < 0 ? 0 : currentIndex;

  return REQUEST_STAGE_FLOW.map((stage, index) => ({
    ...stage,
    state:
      index < resolvedIndex
        ? 'done'
        : index === resolvedIndex
          ? 'current'
          : 'upcoming',
  }));
}

function getRequestStatusGuidance(status: QueueStatus): string {
  switch (status) {
    case 'pending':
      return 'الطلب بانتظار بدء التنفيذ من فريق العمليات.';
    case 'in_progress':
      return 'الطلب قيد التنفيذ ويمكن إغلاقه بعد اكتماله.';
    case 'completed':
      return 'الطلب مغلق حاليًا.';
    case 'cancelled':
      return 'الطلب ألغي ولا توجد له خطوة تشغيلية لاحقة.';
  }
}

function getActionPlan(status: QueueStatus): ActionPlan {
  switch (status) {
    case 'pending':
      return {
        label: 'بدء التنفيذ',
        hint: 'نقل الطلب من الانتظار إلى التنفيذ',
        success: 'تم نقل الطلب إلى التنفيذ.',
        nextStatus: 'in_progress',
      };
    case 'in_progress':
      return {
        label: 'إغلاق',
        hint: 'إغلاق بعد الإنجاز',
        success: 'تم إغلاق الطلب.',
        nextStatus: 'completed',
      };
    case 'completed':
    case 'cancelled':
      return {
        label: status === 'completed' ? 'مغلق' : 'ملغي',
        hint: 'لا توجد خطوة تشغيلية لاحقة',
        success: 'لا توجد خطوة إضافية.',
      };
  }
}

function getIconPreset(iconHint: string) {
  return (
    ICON_PRESETS.find(entry => entry.value === iconHint) ??
    ICON_PRESETS[ICON_PRESETS.length - 1]
  );
}

function CategoryAvatar({
  category,
  className = '',
  iconSize = 16,
  imageClassName = '',
}: {
  category: Pick<
    SndClientCategory,
    'iconHint' | 'iconImageUrl' | 'name' | 'visual'
  >;
  className?: string;
  iconSize?: number;
  imageClassName?: string;
}) {
  const Icon = getIconPreset(category.iconHint).icon;
  const theme = getThemeForCategory(category);
  const hasCustomImage = category.iconImageUrl.trim().length > 0;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden border bg-white ${theme.frameClass} ${className}`}
    >
      {hasCustomImage ? (
        <img
          src={category.iconImageUrl}
          alt={category.name}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <Icon size={iconSize} color={NEUTRAL_VISUAL_THEME.accent} />
      )}
    </div>
  );
}

function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const tones: Record<BadgeTone, string> = {
    neutral: 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569]',
    accent: 'border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]',
    live: 'border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]',
    warn: 'border-[#fde68a] bg-[#fffbeb] text-[#a16207]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Panel({
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = 'px-5 py-5',
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[32px] border border-[#f4e7db] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,249,244,0.96))] shadow-[0_24px_60px_-28px_rgba(148,98,52,0.22)] backdrop-blur ${className}`}
    >
      <div className='flex items-start justify-between gap-3 border-b border-[#f2e8df] px-5 py-4'>
        <div>
          <h3 className='m-0 text-[17px] font-black tracking-tight text-[#111827]'>
            {title}
          </h3>
          {subtitle ? (
            <p className='m-0 mt-1 text-[13px] leading-6 text-[#64748b]'>
              {subtitle}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

function SurfaceSheet({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const subtitleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      role='presentation'
      className='absolute inset-0 z-30 flex items-start justify-end rounded-[32px] bg-[#eef3fb]/82 p-4 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        className='flex h-full w-full max-w-[430px] flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.18)]'
        onClick={event => event.stopPropagation()}
      >
        <div className='flex items-start justify-between gap-3 border-b border-[#edf2f7] px-5 py-4'>
          <div>
            <h3
              id={titleId}
              className='m-0 text-[18px] font-black text-[#111827]'
            >
              {title}
            </h3>
            <p
              id={subtitleId}
              className='m-0 mt-1 text-[12px] leading-6 text-[#64748b]'
            >
              {subtitle}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            aria-label='إغلاق اللوحة الجانبية'
            className='inline-flex items-center justify-center rounded-full border border-[#dbe1ea] bg-white px-3 py-2 text-[11px] font-black text-[#111827] transition hover:border-[#cbd5e1]'
          >
            إغلاق
          </button>
        </div>
        <div className='min-h-0 flex-1 overflow-y-auto px-4 py-4'>
          {children}
        </div>
      </div>
    </div>
  );
}

function WorkspaceModeButton({
  active,
  onClick,
  icon: Icon,
  label,
  hint,
  metric,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  hint: string;
  metric: string;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      title={hint}
      aria-label={`${label} - ${hint}`}
      className={`flex items-center gap-3 rounded-[18px] border px-3 py-2.5 text-right transition hover:-translate-y-0.5 ${
        active
          ? ACTIVE_SURFACE_CLASS
          : 'border-[#ece3d8] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] text-[#111827] hover:border-[#e3cbb6] hover:shadow-[0_14px_28px_-22px_rgba(148,98,52,0.18)]'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] ${
          active
            ? 'border border-white/60 bg-[linear-gradient(135deg,#f7b07a,#ee8248)] text-white shadow-[0_10px_18px_rgba(238,131,72,0.22)]'
            : 'border border-[#f1e3d6] bg-white text-[#f08a3e]'
        }`}
      >
        <Icon size={16} />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-3'>
          <p className='m-0 truncate text-[13px] font-black'>{label}</p>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
              active ? ACTIVE_SURFACE_META_CLASS : 'bg-[#fff4ea] text-[#c26424]'
            }`}
          >
            {metric}
          </span>
        </div>
        <p className='m-0 mt-1 text-[10px] leading-5 text-[#64748b]'>{hint}</p>
      </div>
    </button>
  );
}

export function SndWorkspacePage() {
  const { t, isRTL } = useI18n();
  const serviceName = safeT(t, 'control panel.service_snd_name', 'سند');
  const defaultCategories = useMemo(() => buildPageClientCategories(), []);
  const [studioCategories, setStudioCategories] =
    useState<SndClientCategory[]>(defaultCategories);
  const [queueItems, setQueueItems] = useState<QueueItem[]>(() =>
    buildInitialQueue()
  );
  const [selectedRequestId, setSelectedRequestId] =
    useState<string>('request-2');
  const [selectedStudioCategoryId, setSelectedStudioCategoryId] = useState(
    defaultCategories[1]?.id ?? defaultCategories[0]?.id ?? ''
  );
  const [isServiceEnabled, setIsServiceEnabled] = useState(true);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [workspaceReadFailed, setWorkspaceReadFailed] = useState(false);
  const [isSavingToggle, setIsSavingToggle] = useState(false);
  const [isPublishingCategories, setIsPublishingCategories] = useState(false);
  const [categoriesDirty, setCategoriesDirty] = useState(false);
  const [surfaceMessage, setSurfaceMessage] = useState<string | null>(null);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<WorkspaceMode>('requests');
  const [activeStudioSection, setActiveStudioSection] =
    useState<StudioInspectorSection>('identity');
  const [categorySearch, setCategorySearch] = useState('');
  const [studioPicker, setStudioPicker] = useState<StudioPicker>(null);
  const [revealedStudioCategoryId, setRevealedStudioCategoryId] = useState<
    string | null
  >(null);
  const [activeAnalyticsView, setActiveAnalyticsView] =
    useState<AnalyticsView>('flows');
  const [activeForensicFindingIndex, setActiveForensicFindingIndex] =
    useState(0);
  const [requestFilter, setRequestFilter] = useState<RequestFilter>('active');

  const filteredQueueItems = useMemo(() => {
    if (requestFilter === 'all') {
      return queueItems;
    }

    if (requestFilter === 'active') {
      return queueItems.filter(item => !isClosedQueueStatus(item.status));
    }

    return queueItems.filter(item => item.status === requestFilter);
  }, [queueItems, requestFilter]);

  useEffect(() => {
    if (!selectedStudioCategoryId && defaultCategories[0]) {
      setSelectedStudioCategoryId(defaultCategories[0].id);
    }
  }, [defaultCategories, selectedStudioCategoryId]);

  useEffect(() => {
    if (queueItems.some(item => item.id === selectedRequestId)) {
      return;
    }

    const fallback =
      queueItems.find(item => !isClosedQueueStatus(item.status))?.id ??
      queueItems[0]?.id;
    if (fallback) {
      setSelectedRequestId(fallback);
    }
  }, [queueItems, selectedRequestId]);

  useEffect(() => {
    if (filteredQueueItems.length === 0) {
      return;
    }

    if (filteredQueueItems.some(item => item.id === selectedRequestId)) {
      return;
    }

    setSelectedRequestId(filteredQueueItems[0].id);
    setSelectedStudioCategoryId(filteredQueueItems[0].categoryId);
  }, [filteredQueueItems, selectedRequestId]);

  useEffect(() => {
    if (
      studioCategories.some(
        category => category.id === selectedStudioCategoryId
      )
    ) {
      return;
    }

    const fallback = studioCategories[0]?.id;
    if (fallback) {
      setSelectedStudioCategoryId(fallback);
    }
  }, [selectedStudioCategoryId, studioCategories]);

  useEffect(() => {
    if (
      !revealedStudioCategoryId ||
      studioCategories.some(
        category => category.id === revealedStudioCategoryId
      )
    ) {
      return;
    }

    setRevealedStudioCategoryId(null);
  }, [revealedStudioCategoryId, studioCategories]);

  const selectedRequest = useMemo(
    () =>
      queueItems.find(item => item.id === selectedRequestId) ??
      queueItems[0] ??
      null,
    [queueItems, selectedRequestId]
  );

  const selectedStudioCategory = useMemo(
    () =>
      studioCategories.find(
        category => category.id === selectedStudioCategoryId
      ) ??
      studioCategories[0] ??
      null,
    [selectedStudioCategoryId, studioCategories]
  );

  const selectedRequestCategory = useMemo(() => {
    if (!selectedRequest) {
      return selectedStudioCategory;
    }

    return (
      studioCategories.find(
        category => category.id === selectedRequest.categoryId
      ) ??
      selectedStudioCategory ??
      studioCategories[0] ??
      null
    );
  }, [selectedRequest, selectedStudioCategory, studioCategories]);

  const enabledCategories = useMemo(
    () =>
      [...studioCategories]
        .filter(category => category.enabled)
        .sort((left, right) => left.order - right.order),
    [studioCategories]
  );

  const statusCounts = useMemo(
    () => ({
      pending: queueItems.filter(item => item.status === 'pending').length,
      in_progress: queueItems.filter(item => item.status === 'in_progress')
        .length,
      active: queueItems.filter(item => !isClosedQueueStatus(item.status))
        .length,
      completed: queueItems.filter(item => item.status === 'completed').length,
      cancelled: queueItems.filter(item => item.status === 'cancelled').length,
      closed: queueItems.filter(item => isClosedQueueStatus(item.status))
        .length,
    }),
    [queueItems]
  );

  const linkedCategoryCount = useMemo(
    () =>
      new Set(
        queueItems
          .filter(item => !isClosedQueueStatus(item.status))
          .map(item => item.categoryId)
      ).size,
    [queueItems]
  );

  const actionableCount = statusCounts.active;
  const selectedActionPlan = useMemo(
    () => (selectedRequest ? getActionPlan(selectedRequest.status) : null),
    [selectedRequest]
  );
  const runtimeVisibilityLabel = isLoadingWorkspace
    ? 'جارٍ التحقق'
    : isServiceEnabled
      ? 'مرئي في التطبيق'
      : 'تشغيل داخلي فقط';
  const pressureLabel =
    actionableCount >= 4 ? 'مرتفع' : actionableCount >= 2 ? 'مراقب' : 'هادئ';

  const primaryActionMode =
    activeMode === 'requests'
      ? selectedActionPlan?.nextStatus
        ? 'advance'
        : 'refresh'
      : categoriesDirty
        ? 'publish'
        : !isServiceEnabled
          ? 'toggle'
          : 'create';

  const primaryActionLabel =
    primaryActionMode === 'publish'
      ? isPublishingCategories
        ? 'جارٍ اعتماد الفئات...'
        : 'اعتماد ونشر الفئات'
      : primaryActionMode === 'create'
        ? 'إضافة فئة جديدة'
        : primaryActionMode === 'toggle'
          ? isSavingToggle
            ? 'جارٍ تفعيل الخدمة...'
            : 'تفعيل سند للعميل'
          : primaryActionMode === 'advance'
            ? `${selectedActionPlan?.label ?? 'تحريك'} ${selectedRequest?.ref ?? ''}`
            : isLoadingWorkspace
              ? 'جارٍ تحديث الحالة...'
              : 'تحديث الحالة';

  const primaryActionDisabled =
    isLoadingWorkspace ||
    (primaryActionMode === 'publish' && isPublishingCategories) ||
    (primaryActionMode === 'toggle' && isSavingToggle) ||
    (primaryActionMode === 'advance' && !selectedActionPlan?.nextStatus);

  const loadWorkspaceState = useCallback(async () => {
    setIsLoadingWorkspace(true);
    setWorkspaceReadFailed(false);
    try {
      const [serviceValue, categoriesValue] = await Promise.all([
        resolveRuntimeVar(VAR_SERVICE_ENABLED),
        resolveRuntimeVar(VAR_CLIENT_CATEGORIES),
      ]);

      setIsServiceEnabled(parseBool(serviceValue, true));
      setStudioCategories(
        mergeRuntimeCategories(defaultCategories, categoriesValue)
      );
      setCategoriesDirty(false);
      setWorkspaceReadFailed(false);
    } catch {
      setIsServiceEnabled(true);
      setStudioCategories(defaultCategories);
      setWorkspaceReadFailed(true);
      setSurfaceMessage('تعذر القراءة.');
    } finally {
      setIsLoadingWorkspace(false);
    }
  }, [defaultCategories]);

  useEffect(() => {
    void loadWorkspaceState();
  }, [loadWorkspaceState]);

  const updateSelectedCategory = useCallback(
    (updater: (category: SndClientCategory) => SndClientCategory) => {
      setStudioCategories(current =>
        current
          .map(category =>
            category.id === selectedStudioCategoryId
              ? updater(category)
              : category
          )
          .sort((left, right) => left.order - right.order)
      );
      setCategoriesDirty(true);
      setSurfaceMessage(null);
    },
    [selectedStudioCategoryId]
  );

  const handleQueueSelection = useCallback((item: QueueItem) => {
    setSelectedRequestId(item.id);
    setSelectedStudioCategoryId(item.categoryId);
    setSurfaceMessage(null);
  }, []);

  const handleToggleService = useCallback(async () => {
    const nextValue = !isServiceEnabled;
    setIsSavingToggle(true);
    setSurfaceMessage(null);

    try {
      const result = await upsertRuntimeVar(
        VAR_SERVICE_ENABLED,
        nextValue,
        'boolean',
        'SND client visibility toggle from CONTROL PANEL service catalog'
      );

      if (!result) {
        setSurfaceMessage('فشل التفعيل.');
        return;
      }

      setIsServiceEnabled(parseBool(result.value, nextValue));
      setSurfaceMessage(nextValue ? 'تم التفعيل.' : 'تم التعطيل.');
    } catch {
      setSurfaceMessage('فشل التفعيل.');
    } finally {
      setIsSavingToggle(false);
    }
  }, [isServiceEnabled]);

  const handlePublishCategories = useCallback(async () => {
    setIsPublishingCategories(true);
    setSurfaceMessage(null);

    const payload = serializeRuntimeCategories(studioCategories);

    try {
      const result = await upsertRuntimeVar(
        VAR_CLIENT_CATEGORIES,
        payload,
        'array',
        'SND client categories authoring payload from CONTROL PANEL workspace'
      );

      if (!result) {
        setSurfaceMessage('فشل النشر.');
        return;
      }

      setStudioCategories(
        mergeRuntimeCategories(defaultCategories, result.value ?? payload)
      );
      setCategoriesDirty(false);
      setLastPublishedAt(result.updatedAt ?? result.updated_at ?? 'الآن');
      setSurfaceMessage('تم نشر الفئات.');
    } catch {
      setSurfaceMessage('فشل النشر.');
    } finally {
      setIsPublishingCategories(false);
    }
  }, [defaultCategories, studioCategories]);

  const handleAdvanceSelectedRequest = useCallback(() => {
    const nextStatus = selectedActionPlan?.nextStatus;

    if (!selectedRequest || !nextStatus) {
      setSurfaceMessage('لا خطوة إضافية.');
      return;
    }

    const nextItems = queueItems.map(item =>
      item.id === selectedRequest.id
        ? {
            ...item,
            status: nextStatus,
            updated: 'الآن',
            source: selectedActionPlan.label,
          }
        : item
    );

    setQueueItems(nextItems);
    setSurfaceMessage(selectedActionPlan.success);

    if (nextStatus === 'completed') {
      const nextFocus = nextItems.find(
        item =>
          item.id !== selectedRequest.id && !isClosedQueueStatus(item.status)
      );
      if (nextFocus) {
        setSelectedRequestId(nextFocus.id);
        setSelectedStudioCategoryId(nextFocus.categoryId);
      }
    }
  }, [queueItems, selectedActionPlan, selectedRequest]);

  const handlePrimaryAction = useCallback(() => {
    if (primaryActionMode === 'publish') {
      void handlePublishCategories();
      return;
    }

    if (primaryActionMode === 'create') {
      const nextCategory = buildDraftCategory(studioCategories.length + 1);
      setStudioCategories(current => [...current, nextCategory]);
      setSelectedStudioCategoryId(nextCategory.id);
      setRevealedStudioCategoryId(nextCategory.id);
      setActiveStudioSection('identity');
      setStudioPicker(null);
      setCategoriesDirty(true);
      setSurfaceMessage('أضيفت فئة.');
      return;
    }

    if (primaryActionMode === 'toggle') {
      void handleToggleService();
      return;
    }

    if (primaryActionMode === 'advance') {
      handleAdvanceSelectedRequest();
      return;
    }

    void loadWorkspaceState();
  }, [
    handleAdvanceSelectedRequest,
    handlePublishCategories,
    handleToggleService,
    loadWorkspaceState,
    primaryActionMode,
    studioCategories.length,
  ]);

  const handleCreateCategory = useCallback(() => {
    const nextCategory = buildDraftCategory(studioCategories.length + 1);
    setStudioCategories(current => [...current, nextCategory]);
    setSelectedStudioCategoryId(nextCategory.id);
    setRevealedStudioCategoryId(nextCategory.id);
    setActiveStudioSection('identity');
    setStudioPicker(null);
    setCategoriesDirty(true);
    setSurfaceMessage('أضيفت فئة.');
  }, [studioCategories.length]);

  const handleDuplicateSelectedCategory = useCallback(() => {
    if (!selectedStudioCategory) {
      return;
    }

    const nextCategory: SndClientCategory = {
      ...selectedStudioCategory,
      id: `${selectedStudioCategory.id}_copy_${studioCategories.length + 1}`,
      order: studioCategories.length + 1,
      name: `${selectedStudioCategory.name} نسخة`,
      visual: { ...selectedStudioCategory.visual },
    };

    setStudioCategories(current => [...current, nextCategory]);
    setSelectedStudioCategoryId(nextCategory.id);
    setRevealedStudioCategoryId(nextCategory.id);
    setActiveStudioSection('identity');
    setCategoriesDirty(true);
    setSurfaceMessage('تم الاستنساخ.');
  }, [selectedStudioCategory, studioCategories.length]);

  const handleMoveSelectedCategory = useCallback(
    (direction: -1 | 1) => {
      if (!selectedStudioCategory) {
        return;
      }

      const sorted = [...studioCategories].sort(
        (left, right) => left.order - right.order
      );
      const currentIndex = sorted.findIndex(
        category => category.id === selectedStudioCategory.id
      );
      const targetIndex = currentIndex + direction;

      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sorted.length) {
        return;
      }

      const next = [...sorted];
      const currentOrder = next[currentIndex].order;
      next[currentIndex] = {
        ...next[currentIndex],
        order: next[targetIndex].order,
      };
      next[targetIndex] = { ...next[targetIndex], order: currentOrder };

      setStudioCategories(next.sort((left, right) => left.order - right.order));
      setCategoriesDirty(true);
      setSurfaceMessage('تم تعديل الترتيب.');
    },
    [selectedStudioCategory, studioCategories]
  );

  const handleIconSelection = useCallback(
    (iconHint: string) => {
      updateSelectedCategory(category => ({ ...category, iconHint }));
      setStudioPicker(null);
    },
    [updateSelectedCategory]
  );

  const handleThemeSelection = useCallback(
    (theme: VisualTheme) => {
      updateSelectedCategory(category => ({
        ...category,
        visual: {
          ...category.visual,
          accent: theme.accent,
          soft: theme.soft,
          ring: theme.ring,
        },
      }));
      setStudioPicker(null);
    },
    [updateSelectedCategory]
  );

  const handleStudioCategoryReveal = useCallback((categoryId: string) => {
    setSelectedStudioCategoryId(categoryId);
    setActiveStudioSection('identity');
    setRevealedStudioCategoryId(current =>
      current === categoryId ? null : categoryId
    );
    setSurfaceMessage(null);
  }, []);

  const selectedStudioTheme = getThemeForCategory(selectedStudioCategory);
  const orderedStudioCategories = [...studioCategories].sort(
    (left, right) => left.order - right.order
  );
  const normalizedCategorySearch = categorySearch.trim().toLowerCase();
  const filteredStudioCategories = orderedStudioCategories.filter(category => {
    if (!normalizedCategorySearch) {
      return true;
    }

    return [
      category.name,
      category.description,
      category.visual.shortLabel,
    ].some(value => value.toLowerCase().includes(normalizedCategorySearch));
  });
  const queueStatusMatrix = (Object.keys(STATUS_META) as QueueStatus[]).map(
    status => ({
      id: status,
      label: STATUS_META[status].label,
      count: queueItems.filter(item => item.status === status).length,
      className: STATUS_META[status].className,
    })
  );
  const flowProofs = [
    {
      id: 'service_toggle',
      label: 'تفعيل أو تعطيل الخدمة',
      before: 3,
      after: 1,
      note: 'المفتاح ملاصق لاسم الواجهة بدل التنقل إلى لوحة منفصلة.',
    },
    {
      id: 'publish_category',
      label: 'نشر فئة إلى تطبيق العميل',
      before: 5,
      after: 1,
      note: 'من الاستوديو إلى العميل عبر CTA واحد واضح.',
    },
    {
      id: 'advance_request',
      label: 'تحريك الطلب للخطوة التالية',
      before: 4,
      after: 1,
      note: 'اختيار الطلب ثم قرار مباشر في نفس الشاشة.',
    },
    {
      id: 'edit_category',
      label: 'تعديل فئة قائمة',
      before: 4,
      after: 2,
      note: 'اختيار الفئة ثم تعديلها مع معاينة فورية وSmart Defaults.',
    },
  ];
  const averageBeforeClicks = (
    flowProofs.reduce((sum, item) => sum + item.before, 0) / flowProofs.length
  ).toFixed(1);
  const averageAfterClicks = (
    flowProofs.reduce((sum, item) => sum + item.after, 0) / flowProofs.length
  ).toFixed(1);
  const modeTabs: Array<{
    id: WorkspaceMode;
    label: string;
    hint: string;
    metric: string;
    icon: LucideIcon;
  }> = [
    {
      id: 'requests',
      label: 'الطلبات',
      hint: 'الرحلة الأساسية الآن: متابعة الطلبات وفتح التفاصيل من لوحة واحدة مختصرة.',
      metric: `${actionableCount} مفتوح`,
      icon: ListTodo,
    },
    {
      id: 'studio',
      label: 'الإعدادات الداخلية',
      hint: 'الهوية والمظهر والنشر والرؤى تبقى داخلية وثانوية تحت نفس مسار SND.',
      metric: `${enabledCategories.length}/${studioCategories.length}`,
      icon: Palette,
    },
  ];
  const activeModeTab =
    modeTabs.find(tab => tab.id === activeMode) ?? modeTabs[0];
  const forensicFindings = [
    {
      title: 'خلط ثلاث مهام في عمود واحد',
      detail:
        'التأليف والتحليل والطلبات كانت تظهر معًا، ما يشتت القرار ويرفع زمن الإنجاز.',
    },
    {
      title: 'التمرير كان هو الرحلة',
      detail:
        'المستخدم يمر على كل الكتل حتى يصل للمهمة الأساسية، بدل أن يفتح سطح المهمة مباشرة.',
    },
    {
      title: 'مفتاح الخدمة بعيد عن الهوية',
      detail:
        'التفعيل كان منفصلًا عن رأس الصفحة، بينما القرار المنطقي يجب أن يكون بجوار الاسم فورًا.',
    },
    {
      title: 'غياب قياس واضح قبل/بعد',
      detail:
        'لم يكن هناك دليل ملموس على تحسن النقرات أو تغطية الحالات والمكوّنات القابلة لإعادة الاستخدام.',
    },
  ];
  const scenarioCoverage = [
    { label: 'مساحات اللوحة', value: 2, hint: 'لوحة التحكم والطلبات' },
    { label: 'حالات الخدمة', value: 2, hint: 'مفعلة أو مخفية' },
    {
      label: 'حالات الطلب',
      value: queueStatusMatrix.length,
      hint: 'من المسودة حتى الإغلاق',
    },
    {
      label: 'العناصر المرتبطة',
      value: linkedCategoryCount,
      hint: 'فئات مرتبطة بطلبات جارية',
    },
  ];
  const componentInventory = [
    'رأس قرار ثابت مع CTA ذكي واحد.',
    'لوحة تحكم موحدة تجمع الفئات والتحليل.',
    'بطاقات إشارة موحدة للقياس والحالة.',
    'نموذج تشغيل واحد يتبدل حسب المحور النشط.',
    'منتقيات أيقونات وألوان منبثقة لتقليل الازدحام.',
    'مركز طلبات تشغيلي ببطاقات غنية ومسار قرار بصري.',
  ];
  const analyticsTabs: Array<{
    id: AnalyticsView;
    label: string;
    hint: string;
    metric: string;
  }> = [
    {
      id: 'flows',
      label: 'مسار النقرات',
      hint: 'قياس قبل/بعد لإثبات النقرة الواحدة أو الاثنتين.',
      metric: `${averageAfterClicks} نقرة`,
    },
    {
      id: 'forensics',
      label: 'المراجعة',
      hint: 'الأسباب الجذرية لما كان يربك التجربة سابقًا.',
      metric: `${forensicFindings.length} ملاحظات`,
    },
    {
      id: 'coverage',
      label: 'تغطية الحالات',
      hint: 'الأوضاع والحالات والمراحل التشغيلية المغطاة الآن.',
      metric: `${scenarioCoverage.length} محاور`,
    },
    {
      id: 'system',
      label: 'نظام المكونات',
      hint: 'العناصر القابلة لإعادة الاستخدام التي تمنع الفجوات والتكرار.',
      metric: `${componentInventory.length} عناصر`,
    },
  ];
  const activeAnalyticsTab =
    analyticsTabs.find(tab => tab.id === activeAnalyticsView) ??
    analyticsTabs[0];
  const activeStudioSectionLabel =
    activeStudioSection === 'identity'
      ? 'الهوية والتحرير'
      : activeStudioSection === 'visuals'
        ? 'الأيقونة والمظهر'
        : activeStudioSection === 'publishing'
          ? 'النشر والظهور'
          : 'الرؤى والتحليل';
  const selectedStudioVisibilityLabel = selectedStudioCategory?.enabled
    ? 'تظهر للعميل'
    : 'مخفية';
  const selectedStudioPublishStateLabel = categoriesDirty
    ? 'يوجد نشر معلّق'
    : 'متزامنة مع العميل';
  const selectedStudioIconLabel = selectedStudioCategory
    ? getIconPreset(selectedStudioCategory.iconHint).label
    : 'اختر فئة';
  const selectedStudioMediaLabel = selectedStudioCategory?.iconImageUrl.trim()
    ? 'صورة مخصصة'
    : selectedStudioIconLabel;
  const selectedStudioPanelOpen =
    !!selectedStudioCategory &&
    revealedStudioCategoryId === selectedStudioCategory.id;
  const activeStudioSectionSummary =
    activeStudioSection === 'identity'
      ? 'تحرير الاسم والوصف والترتيب من نفس موضع التحكم.'
      : activeStudioSection === 'visuals'
        ? 'اختيار صورة الأيقونة أو أيقونة المكتبة والثيم من نفس مساحة العمل.'
        : activeStudioSection === 'publishing'
          ? 'تفعيل الفئة ونشرها من نفس اللوحة مع أثر فوري على ترتيب العميل.'
          : 'القياس والمراجعة داخل نفس لوحة الفئة.';
  const requestFilterTabs: Array<{
    id: RequestFilter;
    label: string;
    metric: number;
  }> = [
    { id: 'active', label: 'مفتوح', metric: statusCounts.active },
    { id: 'pending', label: 'انتظار', metric: statusCounts.pending },
    { id: 'in_progress', label: 'تنفيذ', metric: statusCounts.in_progress },
    { id: 'completed', label: 'مغلق', metric: statusCounts.completed },
    { id: 'cancelled', label: 'ملغي', metric: statusCounts.cancelled },
    { id: 'all', label: 'الكل', metric: queueItems.length },
  ];
  const selectedRequestTheme = getThemeForCategory(selectedRequestCategory);
  const requestsTruthTitle = workspaceReadFailed
    ? 'تعذر قراءة مفاتيح التشغيل'
    : !isServiceEnabled
      ? 'واجهة العميل متوقفة حاليًا'
      : 'الطابور الظاهر ما زال في وضع معاينة';
  const requestsTruthBody = workspaceReadFailed
    ? 'تم الإبقاء على الفئات الأخيرة والطابور التجريبي حتى لا تضيع مساحة العمل. أعد قراءة مفاتيح التشغيل لتحديث الحقيقة المتاحة.'
    : !isServiceEnabled
      ? 'ظهور سند متوقف على التطبيق حاليًا. يبقى هذا السطح داخليًا للمتابعة والتحرير فقط ولا يمثل جاهزية عميل حي.'
      : 'هذه الطلبات مستندة إلى fixtures/preview داخلية حتى يكتمل الربط الحي. لا تُعامل كحقيقة تشغيل نهائية.';
  const requestsTruthToneClass = workspaceReadFailed
    ? 'border-[#fecaca] bg-[#fff5f5]'
    : !isServiceEnabled
      ? 'border-[#fed7aa] bg-[#fff7ed]'
      : 'border-[#dbeafe] bg-[#f8fbff]';
  const showResetFilterAction =
    filteredQueueItems.length === 0 && requestFilter !== 'all';
  const selectedRequestStages = useMemo(
    () => (selectedRequest ? buildRequestStages(selectedRequest.status) : []),
    [selectedRequest]
  );
  const selectedRequestFacts = selectedRequest
    ? [
        {
          label: 'العميل',
          value: selectedRequest.clientName,
        },
        {
          label: 'الفئة',
          value: selectedRequestCategory?.name ?? 'بدون فئة',
        },
        {
          label: 'المالك',
          value: selectedRequest.owner,
        },
        {
          label: 'آخر تحديث',
          value: selectedRequest.updated,
        },
      ]
    : [];
  const unifiedRequestFacts = selectedRequestFacts;
  const requestDeckCards = [
    {
      label: 'مفتوح',
      value: `${statusCounts.active}`,
      className: 'border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]',
    },
    {
      label: 'انتظار',
      value: `${statusCounts.pending}`,
      className: 'border-[#fdba74] bg-[#fff7ed] text-[#c2410c]',
    },
    {
      label: 'تنفيذ',
      value: `${statusCounts.in_progress}`,
      className: 'border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]',
    },
    {
      label: 'مغلق',
      value: `${statusCounts.closed}`,
      className: 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569]',
    },
  ];
  const activeAnalyticsSnapshotItems =
    activeAnalyticsView === 'flows'
      ? [
          {
            label: 'المسارات الموثقة',
            value: `${flowProofs.length}`,
            hint: 'شواهد قبل/بعد جاهزة للعرض المباشر.',
          },
          {
            label: 'المتوسط الحالي',
            value: `${averageAfterClicks} نقرة`,
            hint: `بعد التحسين مقابل ${averageBeforeClicks} سابقًا.`,
          },
          {
            label: 'أقصر مسار',
            value: flowProofs[0]?.after ?? '—',
            hint: flowProofs[0]?.label ?? 'لا توجد بيانات إضافية.',
          },
        ]
      : activeAnalyticsView === 'forensics'
        ? [
            {
              label: 'الأسباب الجذرية',
              value: `${forensicFindings.length}`,
              hint: 'تم تجميعها في كشف واحد بلا كتل متنافسة.',
            },
            {
              label: 'أولوية القراءة',
              value: forensicFindings[0]?.title ?? '—',
              hint: 'ابدأ من السبب الأعلى أثرًا ثم انزل تدريجيًا.',
            },
            {
              label: 'منهج المعالجة',
              value: 'سبب واحد كل مرة',
              hint: 'نمنع التشتيت بفتح مسار تشخيص واحد فقط.',
            },
          ]
        : activeAnalyticsView === 'coverage'
          ? [
              {
                label: 'محاور التغطية',
                value: `${scenarioCoverage.length}`,
                hint: 'السيناريوهات الأساسية المغطاة الآن.',
              },
              {
                label: 'مراحل الطلب',
                value: `${queueStatusMatrix.length}`,
                hint: 'سلسلة الحالة من المسودة حتى الإغلاق.',
              },
              {
                label: 'الطلبات المقروءة',
                value: `${queueItems.length}`,
                hint: 'كلها تدخل نفس مصفوفة القرار دون تكرار.',
              },
            ]
          : [
              {
                label: 'عناصر النظام',
                value: `${componentInventory.length}`,
                hint: 'مفردات موحدة تمنع التكرار البصري.',
              },
              {
                label: 'قاعدة التفعيل',
                value: 'CTA واحد',
                hint: 'الزر يتبدل حسب الوضع بدل تكرار الأوامر.',
              },
              {
                label: 'منهج العرض',
                value: 'عرض مختصر',
                hint: 'إظهار ما يلزم فقط.',
              },
            ];

  const studioScreen = (
    <section className='relative flex h-full min-h-0 flex-col overflow-hidden rounded-[40px] border border-[#eedfd2] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(246,249,255,0.97))] shadow-[0_32px_90px_-42px_rgba(114,67,37,0.32)]'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top_right,rgba(255,216,188,0.52),transparent_52%),radial-gradient(circle_at_top_left,rgba(191,219,254,0.42),transparent_50%)]' />
      <div className='pointer-events-none absolute inset-y-0 left-0 w-56 bg-[radial-gradient(circle_at_left,rgba(255,244,230,0.48),transparent_62%)]' />

      <div className='relative flex min-h-0 flex-1 flex-col gap-4 p-4 min-[900px]:p-5'>
        <div className='shrink-0 rounded-[32px] border border-white/80 bg-white/82 p-4 shadow-[0_24px_55px_-34px_rgba(15,23,42,0.18)] backdrop-blur-xl'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <Badge tone='accent'>فئات تجريبية</Badge>
                <Badge tone={categoriesDirty ? 'warn' : 'live'}>
                  {selectedStudioPublishStateLabel}
                </Badge>
                <Badge tone='neutral'>{studioCategories.length} سجل</Badge>
                {surfaceMessage ? (
                  <Badge tone='neutral'>{surfaceMessage}</Badge>
                ) : null}
              </div>

              <h2 className='m-0 mt-3 text-[24px] font-black tracking-tight text-[#111827]'>
                الفئات التجريبية
              </h2>
              <p className='m-0 mt-2 max-w-[52rem] text-[12px] leading-7 text-[#64748b]'>
                اختر أيقونة أو صورة لعرض التفاصيل. الأسماء لا تظهر بشكل ثابت
                داخل الفهرس.
              </p>
            </div>

            <div className='flex w-full flex-col gap-3 min-[980px]:w-[24rem]'>
              <input
                value={categorySearch}
                onChange={event => setCategorySearch(event.target.value)}
                placeholder='ابحث داخل البيانات التجريبية...'
                className='w-full rounded-[18px] border border-[#dbe1ea] bg-white px-4 py-3 text-[12px] font-bold text-[#111827] outline-none transition focus:border-[#94a3b8]'
              />

              <div className='flex flex-wrap items-center justify-end gap-2'>
                <Badge tone='neutral'>
                  {filteredStudioCategories.length} معروض
                </Badge>
                <Badge tone='live'>{enabledCategories.length} ظاهر</Badge>
                <Badge tone='warn'>
                  {studioCategories.length - enabledCategories.length} مخفي
                </Badge>
                <button
                  type='button'
                  onClick={handleCreateCategory}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-[11px] font-black transition ${PRIMARY_ACTION_BUTTON_CLASS}`}
                >
                  <Plus size={14} />
                  فئة جديدة
                </button>
              </div>
            </div>
          </div>

          <div className='mt-5 flex gap-3 overflow-x-auto pb-2 pr-1'>
            {filteredStudioCategories.map(category => {
              const isSelected = category.id === selectedStudioCategoryId;
              const isExpanded = revealedStudioCategoryId === category.id;
              const categoryTheme = getThemeForCategory(category);

              return (
                <button
                  key={category.id}
                  type='button'
                  onClick={() => handleStudioCategoryReveal(category.id)}
                  className={`group flex w-[6.5rem] shrink-0 flex-col items-center gap-2 rounded-[28px] border px-3 py-3 text-center transition hover:-translate-y-1 ${
                    isSelected || isExpanded
                      ? `${categoryTheme.cardClass} ${SOFT_RING_CLASS} shadow-[0_18px_32px_-28px_rgba(15,23,42,0.28)]`
                      : 'border-[#e5ddd4] bg-white/92 hover:border-[#d4c6b8]'
                  }`}
                >
                  <CategoryAvatar
                    category={category}
                    className='h-16 w-16 rounded-[22px]'
                    iconSize={20}
                  />

                  <div className='flex items-center gap-1 text-[10px] font-black text-[#6b7280]'>
                    <span>#{category.order}</span>
                    {isExpanded ? <Check size={12} /> : <ArrowDown size={12} />}
                  </div>

                  <span
                    className={`inline-flex h-2.5 w-2.5 rounded-full ${
                      category.enabled ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'
                    }`}
                  />
                </button>
              );
            })}

            <button
              type='button'
              onClick={handleCreateCategory}
              className='flex w-[6.5rem] shrink-0 flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-[#d7cbbf] bg-white/70 px-3 py-3 text-center transition hover:border-[#f1ceb4] hover:bg-white'
            >
              <span className='flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#f1ceb4] bg-[linear-gradient(135deg,#fff3e7,#ffe2cd)] text-[#c26424]'>
                <Plus size={20} />
              </span>
              <span className='text-[10px] font-black text-[#8b6b55]'>
                إضافة
              </span>
            </button>
          </div>

          {filteredStudioCategories.length === 0 ? (
            <div className='mt-5 rounded-[22px] border border-dashed border-[#d8cdc1] bg-white/72 px-4 py-5 text-[12px] leading-6 text-[#64748b]'>
              لا توجد فئة مطابقة لهذا البحث.
            </div>
          ) : selectedStudioCategory && selectedStudioPanelOpen ? (
            <div className='mt-5 rounded-[30px] border border-[#e7eef7] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,251,255,0.94))] p-5 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.18)]'>
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Badge tone='accent'>
                      {selectedStudioCategory.visual.shortLabel}
                    </Badge>
                    <Badge
                      tone={selectedStudioCategory.enabled ? 'live' : 'warn'}
                    >
                      {selectedStudioVisibilityLabel}
                    </Badge>
                    <Badge tone='neutral'>
                      ترتيب {selectedStudioCategory.order}
                    </Badge>
                    <Badge
                      tone={
                        selectedStudioCategory.iconImageUrl.trim()
                          ? 'accent'
                          : 'neutral'
                      }
                    >
                      {selectedStudioMediaLabel}
                    </Badge>
                  </div>

                  <div className='mt-4 flex flex-wrap items-start gap-4'>
                    <CategoryAvatar
                      category={selectedStudioCategory}
                      className='h-[5.5rem] w-[5.5rem] rounded-[26px]'
                      iconSize={26}
                    />

                    <div className='min-w-0 flex-1'>
                      <p className='m-0 text-[11px] font-bold text-[#8b6b55]'>
                        الفئة المفتوحة
                      </p>
                      <h3 className='m-0 mt-2 text-[24px] font-black tracking-tight text-[#111827]'>
                        {selectedStudioCategory.name}
                      </h3>
                      <p className='m-0 mt-2 max-w-[48rem] text-[12px] leading-7 text-[#526072]'>
                        {selectedStudioCategory.description}
                      </p>
                      <p className='m-0 mt-2 text-[11px] leading-6 text-[#8b6b55]'>
                        يظهر الاسم هنا فقط بعد فتح الأيقونة، بينما يظل الفهرس
                        نفسه بصريًا وخفيفًا حتى مع زيادة أو نقص عدد السجلات
                        التجريبية.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <button
                    type='button'
                    onClick={handleDuplicateSelectedCategory}
                    className='inline-flex items-center gap-2 rounded-full border border-[#dbe1ea] bg-white px-3 py-2 text-[11px] font-black text-[#111827] transition hover:border-[#cbd5e1]'
                  >
                    <CopyPlus size={13} />
                    استنساخ
                  </button>
                  <button
                    type='button'
                    onClick={() => handleMoveSelectedCategory(-1)}
                    className='inline-flex items-center gap-2 rounded-full border border-[#dbe1ea] bg-white px-3 py-2 text-[11px] font-black text-[#111827] transition hover:border-[#cbd5e1]'
                  >
                    <ArrowUp size={13} />
                    رفع
                  </button>
                  <button
                    type='button'
                    onClick={() => handleMoveSelectedCategory(1)}
                    className='inline-flex items-center gap-2 rounded-full border border-[#dbe1ea] bg-white px-3 py-2 text-[11px] font-black text-[#111827] transition hover:border-[#cbd5e1]'
                  >
                    <ArrowDown size={13} />
                    خفض
                  </button>
                  <button
                    type='button'
                    onClick={() => setRevealedStudioCategoryId(null)}
                    className='inline-flex items-center gap-2 rounded-full border border-[#e7ddd2] bg-white px-3 py-2 text-[11px] font-black text-[#8b6b55] transition hover:border-[#d4c6b8]'
                  >
                    <ArrowUp size={13} />
                    إخفاء التفاصيل
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='mt-5 rounded-[22px] border border-dashed border-[#d8cdc1] bg-white/72 px-4 py-5 text-[12px] leading-6 text-[#64748b]'>
              اضغط على أيقونة أو صورة لعرض تفاصيل الفئة.
            </div>
          )}
        </div>

        {selectedStudioCategory && selectedStudioPanelOpen ? (
          <div className='min-h-0 flex-1 overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,251,255,0.92))] p-4 shadow-[0_28px_65px_-42px_rgba(15,23,42,0.22)] backdrop-blur-xl'>
            <div className='flex h-full min-h-0 flex-col'>
              <div className='shrink-0 flex flex-wrap gap-2'>
                <button
                  type='button'
                  onClick={() => setActiveStudioSection('identity')}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black transition ${
                    activeStudioSection === 'identity'
                      ? ACTIVE_SURFACE_CLASS
                      : 'border-[#e5ddd4] bg-white text-[#111827] hover:border-[#d8cdc1]'
                  }`}
                >
                  الهوية
                </button>
                <button
                  type='button'
                  onClick={() => setActiveStudioSection('visuals')}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black transition ${
                    activeStudioSection === 'visuals'
                      ? ACTIVE_SURFACE_CLASS
                      : 'border-[#e5ddd4] bg-white text-[#111827] hover:border-[#d8cdc1]'
                  }`}
                >
                  الأيقونة والمظهر
                </button>
                <button
                  type='button'
                  onClick={() => setActiveStudioSection('publishing')}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black transition ${
                    activeStudioSection === 'publishing'
                      ? ACTIVE_SURFACE_CLASS
                      : 'border-[#e5ddd4] bg-white text-[#111827] hover:border-[#d8cdc1]'
                  }`}
                >
                  الظهور والنشر
                </button>
                <button
                  type='button'
                  onClick={() => setActiveStudioSection('insights')}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black transition ${
                    activeStudioSection === 'insights'
                      ? ACTIVE_SURFACE_CLASS
                      : 'border-[#e5ddd4] bg-white text-[#111827] hover:border-[#d8cdc1]'
                  }`}
                >
                  الرؤى
                </button>
              </div>

              <div className='mt-4 min-h-0 flex-1 overflow-y-auto pr-1'>
                <div className='rounded-[28px] border border-[#e8eef7] bg-white px-4 py-4 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.18)]'>
                  <div className='mb-4 flex flex-wrap items-center gap-2'>
                    <Badge tone='accent'>{activeStudioSectionLabel}</Badge>
                    <Badge tone='neutral'>{selectedStudioMediaLabel}</Badge>
                    <Badge
                      tone={selectedStudioCategory.enabled ? 'live' : 'warn'}
                    >
                      {selectedStudioVisibilityLabel}
                    </Badge>
                  </div>

                  <p className='m-0 text-[12px] leading-6 text-[#526072]'>
                    {activeStudioSectionSummary}
                  </p>

                  <div className='mt-4'>
                    {activeStudioSection === 'identity' ? (
                      <div className='grid gap-4 min-[1040px]:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]'>
                        <div className='grid gap-3'>
                          <label className='block'>
                            <span className='mb-2 block text-[11px] font-bold text-[#475569]'>
                              اسم الفئة
                            </span>
                            <input
                              value={selectedStudioCategory.name}
                              onChange={event =>
                                updateSelectedCategory(category => ({
                                  ...category,
                                  name: event.target.value,
                                }))
                              }
                              className='w-full rounded-[16px] border border-[#dbe1ea] bg-white px-4 py-3 text-[13px] font-bold text-[#111827] outline-none transition focus:border-[#94a3b8]'
                            />
                          </label>

                          <div className='grid gap-3 min-[760px]:grid-cols-2'>
                            <label className='block'>
                              <span className='mb-2 block text-[11px] font-bold text-[#475569]'>
                                التسمية المختصرة
                              </span>
                              <input
                                value={selectedStudioCategory.visual.shortLabel}
                                onChange={event =>
                                  updateSelectedCategory(category => ({
                                    ...category,
                                    visual: {
                                      ...category.visual,
                                      shortLabel: event.target.value,
                                    },
                                  }))
                                }
                                className='w-full rounded-[16px] border border-[#dbe1ea] bg-white px-4 py-3 text-[13px] font-bold text-[#111827] outline-none transition focus:border-[#94a3b8]'
                              />
                            </label>

                            <label className='block'>
                              <span className='mb-2 block text-[11px] font-bold text-[#475569]'>
                                الترتيب
                              </span>
                              <input
                                type='number'
                                min={1}
                                value={selectedStudioCategory.order}
                                onChange={event =>
                                  updateSelectedCategory(category => ({
                                    ...category,
                                    order: parseNumber(
                                      event.target.value,
                                      category.order
                                    ),
                                  }))
                                }
                                className='w-full rounded-[16px] border border-[#dbe1ea] bg-white px-4 py-3 text-[13px] font-bold text-[#111827] outline-none transition focus:border-[#94a3b8]'
                              />
                            </label>
                          </div>

                          <label className='block'>
                            <span className='mb-2 block text-[11px] font-bold text-[#475569]'>
                              وصف بطاقة العميل
                            </span>
                            <textarea
                              rows={5}
                              value={selectedStudioCategory.description}
                              onChange={event =>
                                updateSelectedCategory(category => ({
                                  ...category,
                                  description: event.target.value,
                                }))
                              }
                              className='w-full rounded-[20px] border border-[#dbe1ea] bg-white px-4 py-3 text-[13px] font-bold leading-7 text-[#111827] outline-none transition focus:border-[#94a3b8]'
                            />
                          </label>
                        </div>

                        <div className='grid gap-3'>
                          <div
                            className={`rounded-[24px] border px-4 py-4 ${selectedStudioTheme.cardClass}`}
                          >
                            <p className='m-0 text-[11px] font-bold text-[#64748b]'>
                              العرض
                            </p>
                            <p className='m-0 mt-2 text-[14px] font-black text-[#111827]'>
                              الاسم يظهر عند الفتح
                            </p>
                          </div>

                          <div className='rounded-[24px] border border-[#e8eef7] bg-[#f8fbff] px-4 py-4'>
                            <p className='m-0 text-[11px] font-bold text-[#64748b]'>
                              المرونة
                            </p>
                            <p className='m-0 mt-2 text-[14px] font-black text-[#111827]'>
                              يقبل الزيادة والنقصان
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : activeStudioSection === 'visuals' ? (
                      <div className='grid gap-4 min-[1040px]:grid-cols-[minmax(0,1fr)_20rem]'>
                        <div className='grid gap-3'>
                          <label className='block'>
                            <span className='mb-2 block text-[11px] font-bold text-[#475569]'>
                              رابط أو مسار صورة الأيقونة التجريبية
                            </span>
                            <input
                              value={selectedStudioCategory.iconImageUrl}
                              onChange={event =>
                                updateSelectedCategory(category => ({
                                  ...category,
                                  iconImageUrl: event.target.value,
                                }))
                              }
                              placeholder='https://... أو /icons/experimental-category.png'
                              className='w-full rounded-[16px] border border-[#dbe1ea] bg-white px-4 py-3 text-[13px] font-bold text-[#111827] outline-none transition focus:border-[#94a3b8]'
                            />
                          </label>

                          <div className='grid gap-3 min-[760px]:grid-cols-2'>
                            <button
                              type='button'
                              onClick={() => setStudioPicker('icons')}
                              className='flex items-center justify-between gap-3 rounded-[18px] border border-[#e2e8f0] bg-white px-4 py-4 text-right transition hover:border-[#cbd5e1]'
                            >
                              <div>
                                <p className='m-0 text-[12px] font-black text-[#111827]'>
                                  مكتبة الأيقونات
                                </p>
                                <p className='m-0 mt-1 text-[11px] text-[#64748b]'>
                                  استخدم أيقونة جاهزة عندما لا تريد صورة مخصصة.
                                </p>
                              </div>
                              <Badge tone='neutral'>
                                {selectedStudioIconLabel}
                              </Badge>
                            </button>

                            <button
                              type='button'
                              onClick={() => setStudioPicker('themes')}
                              className='flex items-center justify-between gap-3 rounded-[18px] border border-[#e2e8f0] bg-white px-4 py-4 text-right transition hover:border-[#cbd5e1]'
                            >
                              <div>
                                <p className='m-0 text-[12px] font-black text-[#111827]'>
                                  قوالب الألوان
                                </p>
                                <p className='m-0 mt-1 text-[11px] text-[#64748b]'>
                                  ثيم سريع يجعل الصورة أو الأيقونة منسجمة مع
                                  اللوحة.
                                </p>
                              </div>
                              <Badge tone='accent'>
                                {selectedStudioTheme.label}
                              </Badge>
                            </button>
                          </div>

                          <div className='flex flex-wrap gap-2'>
                            {selectedStudioCategory.iconImageUrl.trim() ? (
                              <button
                                type='button'
                                onClick={() =>
                                  updateSelectedCategory(category => ({
                                    ...category,
                                    iconImageUrl: '',
                                  }))
                                }
                                className='inline-flex items-center gap-2 rounded-full border border-[#e5ddd4] bg-white px-3 py-2 text-[11px] font-black text-[#8b6b55] transition hover:border-[#d8cdc1]'
                              >
                                الرجوع لأيقونة المكتبة
                              </button>
                            ) : (
                              <Badge tone='neutral'>
                                يعتمد على أيقونة المكتبة حاليًا
                              </Badge>
                            )}

                            <Badge tone='accent'>
                              {selectedStudioTheme.accent}
                            </Badge>
                          </div>
                        </div>

                        <div
                          className={`rounded-[28px] border px-5 py-5 ${selectedStudioTheme.cardClass}`}
                        >
                          <div className='flex items-center gap-4'>
                            <CategoryAvatar
                              category={selectedStudioCategory}
                              className='h-24 w-24 rounded-[28px]'
                              iconSize={30}
                            />
                            <div className='min-w-0 flex-1'>
                              <p className='m-0 text-[11px] font-bold text-[#64748b]'>
                                معاينة الأيقونة
                              </p>
                              <p className='m-0 mt-2 text-[16px] font-black text-[#111827]'>
                                {selectedStudioMediaLabel}
                              </p>
                              <p className='m-0 mt-1 text-[11px] leading-6 text-[#526072]'>
                                {selectedStudioTheme.label} •{' '}
                                {selectedStudioTheme.accent}
                              </p>
                            </div>
                          </div>

                          <div className='mt-4 rounded-[20px] border border-white/80 bg-white/78 px-4 py-4'>
                            <p className='m-0 text-[11px] font-bold text-[#64748b]'>
                              المعاينة
                            </p>
                            <p className='m-0 mt-2 text-[11px] leading-6 text-[#526072]'>
                              صورة أو أيقونة حسب الإعداد الحالي.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : activeStudioSection === 'publishing' ? (
                      <div className='grid gap-4 min-[1040px]:grid-cols-[minmax(0,1fr)_20rem]'>
                        <div className='grid gap-3'>
                          <div className='grid gap-3 min-[760px]:grid-cols-2'>
                            <button
                              type='button'
                              onClick={() =>
                                updateSelectedCategory(category => ({
                                  ...category,
                                  enabled: !category.enabled,
                                }))
                              }
                              className={`inline-flex items-center justify-center gap-2 rounded-[18px] px-4 py-4 text-[12px] font-black transition ${
                                selectedStudioCategory.enabled
                                  ? 'bg-[#fff7ed] text-[#c2410c] hover:bg-[#ffedd5]'
                                  : 'bg-[#ecfdf5] text-[#15803d] hover:bg-[#dcfce7]'
                              }`}
                            >
                              {selectedStudioCategory.enabled ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}
                              {selectedStudioCategory.enabled
                                ? 'إخفاء الفئة عن العميل'
                                : 'إظهار الفئة للعميل'}
                            </button>

                            <button
                              type='button'
                              onClick={() => void handlePublishCategories()}
                              disabled={
                                isPublishingCategories || isLoadingWorkspace
                              }
                              className={`inline-flex items-center justify-center gap-2 rounded-[18px] px-4 py-4 text-[12px] font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${PRIMARY_ACTION_BUTTON_CLASS}`}
                            >
                              <ArrowUpLeft size={14} />
                              {isPublishingCategories
                                ? 'جارٍ النشر...'
                                : 'نشر الفئة الآن'}
                            </button>
                          </div>

                          <div className='rounded-[20px] border border-[#e8eef7] bg-[#f8fbff] px-4 py-4'>
                            <p className='m-0 text-[11px] font-bold text-[#64748b]'>
                              مفتاح التشغيل
                            </p>
                            <p className='m-0 mt-2 text-[13px] font-black text-[#111827]'>
                              {VAR_CLIENT_CATEGORIES}
                            </p>
                            <p className='m-0 mt-1 text-[11px] leading-6 text-[#64748b]'>
                              التحكم المركزي للفئات.
                            </p>
                          </div>
                        </div>

                        <div className='grid gap-3'>
                          <div
                            className={`rounded-[24px] border px-4 py-4 ${selectedStudioTheme.cardClass}`}
                          >
                            <p className='m-0 text-[11px] font-bold text-[#64748b]'>
                              وضع الفئة
                            </p>
                            <p className='m-0 mt-2 text-[16px] font-black text-[#111827]'>
                              {selectedStudioVisibilityLabel}
                            </p>
                            <p className='m-0 mt-2 text-[11px] leading-6 text-[#526072]'>
                              ترتيب {selectedStudioCategory.order} •{' '}
                              {selectedStudioPublishStateLabel}
                            </p>
                          </div>

                          <div className='rounded-[24px] border border-[#e8eef7] bg-white px-4 py-4'>
                            <p className='m-0 text-[11px] font-bold text-[#64748b]'>
                              آخر مزامنة
                            </p>
                            <p className='m-0 mt-2 text-[16px] font-black text-[#111827]'>
                              {lastPublishedAt ?? 'لم يتم النشر بعد'}
                            </p>
                            <p className='m-0 mt-2 text-[11px] leading-6 text-[#526072]'>
                              يمكن نشرها عند الجاهزية.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <AnalyticsWorkspacePanel />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='shrink-0 rounded-[28px] border border-dashed border-[#d8cdc1] bg-white/72 px-6 py-12 text-center'>
            <div>
              <p className='m-0 text-[15px] font-black text-[#111827]'>
                اضغط على أيقونة لعرض التفاصيل
              </p>
            </div>
          </div>
        )}

        <SurfaceSheet
          open={studioPicker === 'icons'}
          title='مكتبة أيقونات سند'
          subtitle='اختيار واحد فقط، ثم تعود مباشرة إلى بطاقة العميل دون ازدحام على الشاشة.'
          onClose={() => setStudioPicker(null)}
        >
          <div className='grid gap-2 min-[380px]:grid-cols-2'>
            {ICON_PRESETS.map(preset => {
              const isSelected =
                selectedStudioCategory?.iconHint === preset.value;

              return (
                <button
                  key={preset.value}
                  type='button'
                  onClick={() => handleIconSelection(preset.value)}
                  className={`flex items-center gap-3 rounded-[18px] border px-4 py-4 text-right transition ${
                    isSelected
                      ? `${selectedStudioTheme.cardClass} ${SOFT_RING_CLASS}`
                      : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#e2e8f0] bg-white'>
                    <preset.icon
                      size={16}
                      color={
                        selectedStudioCategory?.visual.accent ??
                        selectedStudioTheme.accent
                      }
                    />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='m-0 text-[13px] font-black text-[#111827]'>
                      {preset.label}
                    </p>
                    <p className='m-0 mt-1 text-[11px] text-[#64748b]'>
                      {preset.value}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </SurfaceSheet>

        <SurfaceSheet
          open={studioPicker === 'themes'}
          title='ثيمات الواجهة'
          subtitle='قوالب جاهزة تمنح الفئة مظهرًا فاخرًا ومتسقًا مع تطبيق العميل.'
          onClose={() => setStudioPicker(null)}
        >
          <div className='grid gap-2 min-[380px]:grid-cols-2'>
            {VISUAL_THEMES.map(theme => {
              const isSelected =
                selectedStudioTheme.accent === theme.accent &&
                selectedStudioTheme.soft === theme.soft &&
                selectedStudioTheme.ring === theme.ring;

              return (
                <button
                  key={theme.id}
                  type='button'
                  onClick={() => handleThemeSelection(theme)}
                  className={`rounded-[18px] border px-4 py-4 text-right transition ${theme.cardClass} ${
                    isSelected ? SOFT_RING_CLASS : ''
                  }`}
                >
                  <div className='flex items-center justify-between gap-3'>
                    <p
                      className={`m-0 text-[13px] font-black ${theme.labelClass}`}
                    >
                      {theme.label}
                    </p>
                    <Badge tone='neutral'>{theme.accent}</Badge>
                  </div>
                  <p className='m-0 mt-3 text-[11px] leading-6 text-[#64748b]'>
                    يستخدم مباشرة داخل بطاقة العميل وواجهة التصفح الداخلية.
                  </p>
                </button>
              );
            })}
          </div>
        </SurfaceSheet>
      </div>
    </section>
  );

  function AnalyticsWorkspacePanel() {
    return (
      <section className='rounded-[24px] border border-[#e8eef7] bg-white px-4 py-4 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.14)]'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <p className='m-0 text-[13px] font-black text-[#111827]'>
              التحليل المدمج
            </p>
            <p className='m-0 mt-1 text-[11px] leading-6 text-[#64748b]'>
              نفس مساحة الفئة تعرض القياس والمراجعة والتغطية دون فتح مساحة
              ثانية.
            </p>
          </div>
          <Badge tone='accent'>{activeAnalyticsTab.metric}</Badge>
        </div>

        <div className='mt-3 flex flex-wrap gap-2'>
          {analyticsTabs.map(tab => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActiveAnalyticsView(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black transition ${
                activeAnalyticsView === tab.id
                  ? ACTIVE_SURFACE_CLASS
                  : 'border-[#e5ddd4] bg-white text-[#111827] hover:border-[#d8cdc1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className='mt-4 grid gap-2'>
          {activeAnalyticsSnapshotItems.map(item => (
            <div
              key={item.label}
              className='rounded-[18px] border border-[#e8eef7] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] px-4 py-3'
            >
              <div className='flex items-center justify-between gap-3'>
                <p className='m-0 text-[11px] font-black text-[#111827]'>
                  {item.label}
                </p>
                <span className='text-[14px] font-black text-[#111827]'>
                  {item.value}
                </span>
              </div>
              <p className='m-0 mt-1 text-[10px] leading-5 text-[#64748b]'>
                {item.hint}
              </p>
            </div>
          ))}
        </div>

        <div className='mt-4'>
          {activeAnalyticsView === 'flows' ? (
            <div className='grid gap-2'>
              {flowProofs.map(proof => (
                <div
                  key={proof.id}
                  className='rounded-[18px] border border-[#e8eef7] bg-[#f8fbff] px-4 py-3'
                >
                  <div className='flex items-center justify-between gap-3'>
                    <p className='m-0 text-[12px] font-black text-[#111827]'>
                      {proof.label}
                    </p>
                    <span className='text-[11px] font-black text-[#15803d]'>
                      {proof.before} {'->'} {proof.after}
                    </span>
                  </div>
                  <p className='m-0 mt-1 text-[10px] leading-5 text-[#64748b]'>
                    {proof.note}
                  </p>
                </div>
              ))}
            </div>
          ) : activeAnalyticsView === 'forensics' ? (
            <div className='grid gap-2'>
              {forensicFindings.map((finding, index) => (
                <button
                  key={finding.title}
                  type='button'
                  onClick={() => setActiveForensicFindingIndex(index)}
                  className={`rounded-[18px] border px-4 py-3 text-right transition ${
                    activeForensicFindingIndex === index
                      ? ACTIVE_SURFACE_CLASS
                      : 'border-[#e8eef7] bg-[#f8fbff] text-[#111827]'
                  }`}
                >
                  <p className='m-0 text-[12px] font-black'>{finding.title}</p>
                  <p className='m-0 mt-1 text-[10px] leading-5 text-[#64748b]'>
                    {finding.detail}
                  </p>
                </button>
              ))}
            </div>
          ) : activeAnalyticsView === 'coverage' ? (
            <div className='grid gap-2'>
              {scenarioCoverage.map(item => (
                <div
                  key={item.label}
                  className='flex items-center justify-between gap-3 rounded-[18px] border border-[#e8eef7] bg-[#f8fbff] px-4 py-3'
                >
                  <div>
                    <p className='m-0 text-[12px] font-black text-[#111827]'>
                      {item.label}
                    </p>
                    <p className='m-0 mt-1 text-[10px] text-[#64748b]'>
                      {item.hint}
                    </p>
                  </div>
                  <span className='text-[15px] font-black text-[#111827]'>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid gap-2'>
              {componentInventory.map(item => (
                <div
                  key={item}
                  className='rounded-[18px] border border-[#e8eef7] bg-[#f8fbff] px-4 py-3 text-[11px] font-bold leading-6 text-[#334155]'
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  const requestsScreen = (
    <section className='h-full min-h-0'>
      <Panel
        title='الطلبات'
        subtitle='هذه المساحة للفرز والمعالجة واستعراض التفاصيل فقط، بينما تبقى الإعدادات في الوضع الداخلي.'
        action={<Badge tone='accent'>{filteredQueueItems.length} معروض</Badge>}
        className='flex h-full min-h-0 flex-col'
        bodyClassName='flex min-h-0 flex-1 flex-col gap-4 px-4 py-4'
      >
        <div className='grid gap-2 min-[760px]:grid-cols-4'>
          {requestDeckCards.map(card => (
            <div
              key={card.label}
              className={`rounded-[20px] border px-4 py-3 ${card.className}`}
            >
              <p className='m-0 text-[11px] font-black'>{card.label}</p>
              <p className='m-0 mt-2 text-[20px] font-black'>{card.value}</p>
            </div>
          ))}
        </div>

        <div
          role='status'
          aria-live='polite'
          className={`rounded-[22px] border px-4 py-4 ${requestsTruthToneClass}`}
        >
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <Badge tone='warn'>بيانات معاينة</Badge>
                {!isServiceEnabled ? (
                  <Badge tone='warn'>العميل مخفي</Badge>
                ) : null}
                {workspaceReadFailed ? (
                  <Badge tone='warn'>قراءة runtime vars فشلت</Badge>
                ) : null}
              </div>

              <p className='m-0 mt-3 text-[14px] font-black text-[#111827]'>
                {requestsTruthTitle}
              </p>
              <p className='m-0 mt-2 text-[11px] leading-6 text-[#64748b]'>
                {requestsTruthBody}
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              {workspaceReadFailed ? (
                <button
                  type='button'
                  onClick={() => void loadWorkspaceState()}
                  className='inline-flex items-center gap-2 rounded-full border border-[#fecaca] bg-white px-4 py-2 text-[11px] font-black text-[#b91c1c] transition hover:border-[#fca5a5]'
                >
                  <RefreshCw size={13} />
                  إعادة القراءة
                </button>
              ) : null}

              {showResetFilterAction ? (
                <button
                  type='button'
                  onClick={() => setRequestFilter('all')}
                  className='inline-flex items-center gap-2 rounded-full border border-[#dbe1ea] bg-white px-4 py-2 text-[11px] font-black text-[#111827] transition hover:border-[#cbd5e1]'
                >
                  عرض كل الطلبات
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          {requestFilterTabs.map(tab => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setRequestFilter(tab.id)}
              aria-label={`${tab.label} - ${tab.metric}`}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black transition ${
                requestFilter === tab.id
                  ? ACTIVE_SURFACE_CLASS
                  : 'border-[#e7ddd2] bg-white text-[#111827] hover:border-[#e3cbb6]'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 ${requestFilter === tab.id ? ACTIVE_SURFACE_META_CLASS : 'bg-[#f8fbff]'}`}
              >
                {tab.metric}
              </span>
            </button>
          ))}
        </div>

        <div className='grid min-h-0 flex-1 gap-4 min-[1240px]:grid-cols-[340px_minmax(0,1fr)]'>
          <div className='min-h-0 overflow-y-auto pr-1'>
            <div className='grid gap-2'>
              {filteredQueueItems.length === 0 ? (
                <div className='rounded-[22px] border border-dashed border-[#d8e0ea] bg-white/80 px-4 py-5 text-center'>
                  <p className='m-0 text-[13px] font-black text-[#111827]'>
                    لا توجد طلبات ضمن هذا المرشح.
                  </p>
                </div>
              ) : null}

              {filteredQueueItems.map(item => {
                const category =
                  studioCategories.find(
                    entry => entry.id === item.categoryId
                  ) ?? selectedRequestCategory;
                const rowTheme = getThemeForCategory(category);
                const isSelected = item.id === selectedRequestId;
                const statusMeta = STATUS_META[item.status];

                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleQueueSelection(item)}
                    aria-label={`${item.ref} - ${item.title} - ${statusMeta.label}`}
                    className={`rounded-[22px] border px-4 py-4 text-right transition hover:-translate-y-0.5 ${
                      isSelected
                        ? `${rowTheme.cardClass} ${SOFT_RING_CLASS} shadow-[0_20px_40px_-28px_rgba(15,23,42,0.24)]`
                        : 'border-[#e2e8f0] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] hover:border-[#d7e1ea] hover:shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]'
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      {category ? (
                        <CategoryAvatar
                          category={category}
                          className={`h-12 w-12 shrink-0 rounded-[16px] ${rowTheme.frameClass}`}
                          iconSize={18}
                        />
                      ) : (
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[#dbe1ea] bg-white'>
                          <LayoutGrid size={18} color='#64748b' />
                        </div>
                      )}

                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <p className='m-0 text-[12px] font-black text-[#111827]'>
                            {item.ref}
                          </p>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${statusMeta.className}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                        <p className='m-0 mt-2 text-[14px] font-black leading-6 text-[#0f172a]'>
                          {item.title}
                        </p>
                        <div className='mt-3 flex flex-wrap items-center gap-2'>
                          {[item.clientName, item.updated].map(value => (
                            <span
                              key={`${item.id}-${value}`}
                              className='rounded-full border border-[#e7ecf2] bg-white/85 px-2.5 py-1 text-[10px] font-black text-[#64748b]'
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedRequest ? (
            <div className='min-h-0 overflow-y-auto pr-1'>
              <section
                className={`overflow-hidden rounded-[34px] border ${selectedRequestTheme.cardClass} shadow-[0_26px_54px_-30px_rgba(15,23,42,0.22)]`}
              >
                <div className='border-b border-white/70 px-5 py-5'>
                  <div className='flex flex-wrap items-start justify-between gap-4'>
                    <div className='min-w-0 flex-1'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <Badge tone='accent'>{selectedRequest.ref}</Badge>
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-black ${STATUS_META[selectedRequest.status].className}`}
                        >
                          {STATUS_META[selectedRequest.status].label}
                        </span>
                        <Badge tone='neutral'>{selectedRequest.eta}</Badge>
                      </div>

                      <h3 className='m-0 mt-4 text-[28px] font-black leading-[1.45] text-[#0f172a]'>
                        {selectedRequest.title}
                      </h3>
                      <p className='m-0 mt-3 text-[13px] leading-7 text-[#475569]'>
                        {selectedRequest.summary}
                      </p>
                    </div>

                    {selectedRequestCategory ? (
                      <CategoryAvatar
                        category={selectedRequestCategory}
                        className={`h-20 w-20 shrink-0 rounded-[24px] ${selectedRequestTheme.frameClass}`}
                        iconSize={30}
                      />
                    ) : null}
                  </div>
                </div>

                <div className='grid gap-5 px-5 py-5'>
                  <div className='grid gap-3 min-[860px]:grid-cols-3'>
                    {unifiedRequestFacts.map(item => (
                      <div
                        key={item.label}
                        className='rounded-[20px] border border-white/75 bg-white/72 px-4 py-3'
                      >
                        <p className='m-0 text-[11px] font-bold text-[#8b6b55]'>
                          {item.label}
                        </p>
                        <p className='m-0 mt-2 text-[16px] font-black text-[#111827]'>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className='flex items-center justify-between gap-3'>
                      <h4 className='m-0 text-[16px] font-black text-[#111827]'>
                        الحالة
                      </h4>
                      <Badge tone='neutral'>
                        {selectedRequestStages.length} مراحل
                      </Badge>
                    </div>

                    <div className='mt-3 grid gap-2 min-[860px]:grid-cols-5'>
                      {selectedRequestStages.map((stage, index) => {
                        const stageClass =
                          stage.state === 'current'
                            ? 'border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]'
                            : stage.state === 'done'
                              ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]'
                              : 'border-[#e2e8f0] bg-white/72 text-[#64748b]';

                        return (
                          <div
                            key={stage.id}
                            className={`rounded-[18px] border px-3 py-3 ${stageClass}`}
                          >
                            <div className='flex items-center justify-between gap-2'>
                              <p className='m-0 text-[12px] font-black'>
                                {stage.label}
                              </p>
                              <span className='text-[11px] font-black'>
                                {stage.state === 'done' ? (
                                  <Check size={14} />
                                ) : (
                                  index + 1
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className='grid gap-4 min-[980px]:grid-cols-[minmax(0,1fr)_19rem]'>
                    <div className='rounded-[24px] border border-white/75 bg-white/72 px-4 py-4'>
                      <div className='flex items-start gap-3'>
                        {selectedRequestCategory ? (
                          <CategoryAvatar
                            category={selectedRequestCategory}
                            className={`h-14 w-14 shrink-0 rounded-[18px] ${selectedRequestTheme.frameClass}`}
                            iconSize={18}
                          />
                        ) : null}
                        <div className='min-w-0 flex-1'>
                          <p className='m-0 text-[11px] font-bold text-[#8b6b55]'>
                            الفئة
                          </p>
                          <p className='m-0 mt-2 text-[16px] font-black text-[#111827]'>
                            {selectedRequestCategory?.name ?? 'بدون فئة'}
                          </p>
                        </div>
                      </div>

                      <div className='mt-4 flex flex-wrap gap-2'>
                        {selectedRequest.signals.map(signal => (
                          <span
                            key={signal}
                            className='rounded-full border border-white/80 bg-white px-3 py-1.5 text-[11px] font-black text-[#6e4122]'
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`rounded-[24px] border px-4 py-4 ${SOFT_DECISION_PANEL_CLASS}`}
                    >
                      <p className='m-0 text-[11px] font-bold text-[#8a5d3f]'>
                        الإجراء
                      </p>
                      <p className='m-0 mt-2 text-[22px] font-black text-[#6e4122]'>
                        {selectedActionPlan?.label ?? 'استعراض'}
                      </p>
                      <p className='m-0 mt-2 text-[12px] leading-6 text-[#8a5d3f]'>
                        {getRequestStatusGuidance(selectedRequest.status)}
                      </p>

                      <button
                        type='button'
                        onClick={handleAdvanceSelectedRequest}
                        disabled={!selectedActionPlan?.nextStatus}
                        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[18px] px-5 py-4 text-[13px] font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${PRIMARY_ACTION_BUTTON_CLASS}`}
                      >
                        <DirectionalIcon
                          icon={ChevronLeft}
                          mirrorInRTL={true}
                          size={16}
                        />
                        {selectedActionPlan?.label ?? 'استعراض'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className='flex min-h-0 items-center justify-center rounded-[28px] border border-dashed border-[#d8cdc1] bg-white/72 px-6 text-center'>
              <p className='m-0 text-[13px] font-black text-[#111827]'>
                اختر طلبًا لعرض التفاصيل.
              </p>
            </div>
          )}
        </div>
      </Panel>
    </section>
  );

  return (
    <main
      dir={isRTL ? 'rtl' : 'ltr'}
      className='relative h-[calc(100dvh-4.5rem)] max-h-[calc(100dvh-4.5rem)] overflow-hidden bg-[linear-gradient(180deg,#faf6f1_0%,#f4f7fb_38%,#eef4fb_100%)] text-slate-950'
    >
      <div className='pointer-events-none absolute inset-x-0 top-0 h-[260px]'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_34%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_30%)]' />
      </div>

      <div className='relative mx-auto flex h-full min-h-0 w-full max-w-[1540px] flex-col gap-4 px-4 py-4 min-[900px]:px-5'>
        <section className='shrink-0 rounded-[34px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,247,241,0.92))] p-4 shadow-[0_26px_60px_-24px_rgba(148,98,52,0.22)] backdrop-blur'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='min-w-0 flex-1'>
              <div className='mb-2 flex flex-wrap items-center gap-2'>
                <Badge tone='accent'>SND</Badge>
                <Badge tone={categoriesDirty ? 'warn' : 'live'}>
                  {categoriesDirty ? 'نشر معلّق' : runtimeVisibilityLabel}
                </Badge>
                <Badge tone='neutral'>{activeModeTab.metric}</Badge>
                {activeMode === 'requests' ? (
                  <Badge tone='warn'>بيانات معاينة</Badge>
                ) : null}
                {surfaceMessage ? (
                  <Badge tone='neutral'>{surfaceMessage}</Badge>
                ) : null}
              </div>

              <h1 className='m-0 text-[26px] font-black tracking-tight text-[#111827]'>
                غرفة تشغيل {serviceName}
              </h1>
              <p className='m-0 mt-1 max-w-[58rem] text-[12px] leading-6 text-[#64748b]'>
                {activeModeTab.hint}
              </p>

              {activeMode === 'studio' ? (
                <div className='mt-4 grid gap-2 min-[980px]:grid-cols-3'>
                  <div className='rounded-[18px] border border-[#f1e3d6] bg-white/82 px-4 py-3'>
                    <p className='m-0 text-[11px] font-bold text-[#8b6b55]'>
                      الوضع الحالي
                    </p>
                    <p className='m-0 mt-2 text-[16px] font-black text-[#111827]'>
                      {activeModeTab.label}
                    </p>
                    <p className='m-0 mt-1 text-[11px] leading-5 text-[#64748b]'>
                      {activeModeTab.metric}
                    </p>
                  </div>

                  <div className='rounded-[18px] border border-[#f1e3d6] bg-white/82 px-4 py-3'>
                    <p className='m-0 text-[11px] font-bold text-[#8b6b55]'>
                      نبض التشغيل
                    </p>
                    <p className='m-0 mt-2 text-[16px] font-black text-[#111827]'>
                      {pressureLabel}
                    </p>
                    <p className='m-0 mt-1 text-[11px] leading-5 text-[#64748b]'>
                      {actionableCount} طلب يحتاج متابعة
                    </p>
                  </div>

                  <div className='rounded-[18px] border border-[#f1e3d6] bg-white/82 px-4 py-3'>
                    <p className='m-0 text-[11px] font-bold text-[#8b6b55]'>
                      آخر مزامنة فئات
                    </p>
                    <p className='m-0 mt-2 text-[16px] font-black text-[#111827]'>
                      {lastPublishedAt ?? 'لم يتم النشر بعد'}
                    </p>
                    <p className='m-0 mt-1 text-[11px] leading-5 text-[#64748b]'>
                      المفتاح {VAR_CLIENT_CATEGORIES}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className='flex w-full flex-col gap-3 min-[1080px]:w-[23rem]'>
              <div className='flex items-center justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => void handleToggleService()}
                  disabled={isSavingToggle || isLoadingWorkspace}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isServiceEnabled
                      ? 'border-[#caefd9] bg-[#ecfdf5] text-[#15803d]'
                      : 'border-[#ffd6bd] bg-[#fff7ed] text-[#c2410c]'
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                      isServiceEnabled
                        ? 'bg-white text-[#15803d]'
                        : 'bg-white text-[#c2410c]'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isServiceEnabled ? 'bg-[#22c55e]' : 'bg-[#f97316]'
                      }`}
                    />
                    {isServiceEnabled ? 'مفعلة' : 'متوقفة'}
                  </span>
                  <span className='text-[#111827]'>
                    {isServiceEnabled ? 'تعطيل الخدمة' : 'تفعيل الخدمة'}
                  </span>
                  <Power size={13} />
                </button>

                <button
                  type='button'
                  onClick={() => void loadWorkspaceState()}
                  disabled={isLoadingWorkspace}
                  className='inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#dbe1ea] bg-white text-[#475569] transition hover:border-[#cbd5e1] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-60'
                  aria-label='تحديث'
                >
                  <RefreshCw
                    size={16}
                    className={isLoadingWorkspace ? 'animate-spin' : ''}
                  />
                </button>

                {activeMode === 'studio' ? (
                  <button
                    type='button'
                    onClick={handlePrimaryAction}
                    disabled={primaryActionDisabled}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-[20px] px-5 py-4 text-[13px] font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${PRIMARY_ACTION_BUTTON_CLASS}`}
                  >
                    {primaryActionMode === 'publish' ? (
                      <ArrowUpLeft size={16} />
                    ) : primaryActionMode === 'create' ? (
                      <Plus size={16} />
                    ) : primaryActionMode === 'toggle' ? (
                      <Power size={16} />
                    ) : primaryActionMode === 'advance' ? (
                      <DirectionalIcon
                        icon={ChevronLeft}
                        mirrorInRTL={true}
                        size={16}
                      />
                    ) : (
                      <RefreshCw
                        size={16}
                        className={isLoadingWorkspace ? 'animate-spin' : ''}
                      />
                    )}
                    {primaryActionLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className='mt-4 grid gap-2 min-[860px]:grid-cols-2'>
            {modeTabs.map(tab => (
              <WorkspaceModeButton
                key={tab.id}
                active={activeMode === tab.id}
                onClick={() => setActiveMode(tab.id)}
                icon={tab.icon}
                label={tab.label}
                hint={tab.hint}
                metric={tab.metric}
              />
            ))}
          </div>
        </section>

        <section className='min-h-0 flex-1 overflow-hidden'>
          {activeMode === 'studio' ? studioScreen : requestsScreen}
        </section>
      </div>
    </main>
  );
}

