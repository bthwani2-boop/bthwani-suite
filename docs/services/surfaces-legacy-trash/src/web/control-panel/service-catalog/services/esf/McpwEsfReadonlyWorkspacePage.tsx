'use client';

/**
 * ESF CONTROL PANEL — Workspace operating page (single-page, decision-first).
 * Decision grammar: one status badge, one primary CTA, 3 summary cards, progressive disclosure inline.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  MapPin,
  Pencil,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import {
  OverviewBadge,
  SectionHeader,
} from '../../../components/CommandCenterPrimitives';
import {
  completeTaskSession,
  startTaskSession,
  trackMcpwTelemetry,
} from '../../../utils/mcpwTelemetry';

const VAR_SERVICE_ENABLED = 'VAR_SVC_ESF_ENABLED';
const VAR_REGIONS = 'VAR_ESF_AVAILABLE_REGIONS';
const VAR_CITIES = 'VAR_ESF_AVAILABLE_CITIES';
const VAR_ACCEPT_NEW = 'VAR_ESF_ACCEPT_NEW_REQUESTS';
const VAR_BANNER = 'VAR_ESF_BANNER_TEXT';
const VAR_ELIGIBILITY_RULES = 'VAR_ESF_DONOR_ELIGIBILITY_RULES';
const VAR_ELIGIBILITY_TITLE = 'VAR_ESF_DONOR_ELIGIBILITY_TITLE';
const VAR_ELIGIBILITY_SUBTITLE = 'VAR_ESF_DONOR_ELIGIBILITY_SUBTITLE';
const VAR_ELIGIBILITY_NOTE = 'VAR_ESF_DONOR_ELIGIBILITY_NOTE';
const VAR_ELIGIBILITY_CONFIRM_LABEL = 'VAR_ESF_DONOR_ELIGIBILITY_CONFIRM_LABEL';
const VAR_ELIGIBILITY_CANCEL_LABEL = 'VAR_ESF_DONOR_ELIGIBILITY_CANCEL_LABEL';
const VAR_ELIGIBILITY_ACTIVATING_LABEL =
  'VAR_ESF_DONOR_ELIGIBILITY_ACTIVATING_LABEL';

const I18N_NS = 'surfaces.mcpwEsfWorkspace';

type EsfEligibilityCopyDraft = {
  title: string;
  subtitle: string;
  note: string;
  confirmLabel: string;
  cancelLabel: string;
  activatingLabel: string;
};

const DEFAULT_ELIGIBILITY_COPY: EsfEligibilityCopyDraft = {
  title: 'قبل تفعيل الجاهزية للتبرع',
  subtitle:
    'راجع هذه الاشتراطات العامة أولًا. عند الموافقة سيتم تشغيل الجاهزية مباشرة.',
  note: 'مرجع الشروط العامة مستند إلى WHO وإرشادات NHS Blood and Transplant، لكن الحسم النهائي يكون حسب بروتوكول جهة الدم المحلية.',
  confirmLabel: 'أوافق وتفعيل الجاهزية',
  cancelLabel: 'ليس الآن',
  activatingLabel: 'جارٍ التفعيل...',
};

const DEFAULT_ELIGIBILITY_RULES_LIST = [
  'أن يكون المتبرع بصحة عامة جيدة وقت التفعيل ولا يعاني أعراضًا مرضية حالية.',
  'أن تكون المدة الدنيا منذ آخر تبرع مكتملة حسب سياسة جهة الدم المحلية.',
  'ألا توجد عدوى أو موانع طبية أو أمراض تمنع التبرع الآمن.',
  'ألا يوجد سبب تأجيل مؤقت حديث مثل حمل أو ولادة أو وشم أو ثقب أو إجراء طبي حديث.',
  'أن يكون العمر والوزن والحالة الصحية ضمن المعايير المعتمدة لدى جهة التبرع.',
] as const;

const DEFAULT_ELIGIBILITY_RULES_TEMPLATE =
  DEFAULT_ELIGIBILITY_RULES_LIST.join('\n');

const ELIGIBILITY_TEMPLATE_LIBRARY = [
  {
    id: 'safe-default',
    title: 'الافتراضي الآمن',
    detail: 'القالب العام الأقرب لتجربة التطبيق الحالية.',
    rules: [...DEFAULT_ELIGIBILITY_RULES_LIST],
  },
  {
    id: 'concise-screening',
    title: 'صياغة مختصرة',
    detail: 'نسخة أخف للمتبرع الجديد مع نفس المنطق العام.',
    rules: [
      'أن تكون بصحة جيدة اليوم ولا تعاني أعراضًا مرضية حالية.',
      'أن تكون المدة المطلوبة منذ آخر تبرع مكتملة.',
      'ألا توجد عدوى أو مانع طبي أو سبب تأجيل حديث.',
      'أن يكون العمر والوزن والحالة الصحية ضمن المعايير المعتمدة لدى جهة التبرع.',
    ],
  },
  {
    id: 'local-protocol',
    title: 'مرجعية الجهة المحلية',
    detail: 'يحافظ على الأساس مع توضيح حسم الجهة المحلية.',
    rules: [
      'أن يكون المتبرع بصحة عامة جيدة وقت التفعيل ولا يعاني أعراضًا مرضية حالية.',
      'أن تكون المدة الدنيا منذ آخر تبرع مكتملة حسب سياسة جهة الدم المحلية.',
      'ألا توجد عدوى أو موانع طبية أو أمراض تمنع التبرع الآمن.',
      'ألا يوجد سبب تأجيل مؤقت حديث مثل حمل أو ولادة أو وشم أو ثقب أو إجراء طبي حديث.',
      'أن يلتزم المتبرع بأي تحقق إضافي تطلبه جهة الدم المحلية قبل قبول الجاهزية النهائية.',
    ],
  },
] as const;

type EligibilityTemplateId =
  (typeof ELIGIBILITY_TEMPLATE_LIBRARY)[number]['id'];

type SmartPresetId = 'go-live' | 'pause-intake' | 'seed-coverage';

async function resolveRuntimeVar(key: string): Promise<unknown> {
  const response = await fetch(
    `/api/platform/governance/runtime-vars/key/${encodeURIComponent(key)}/resolve`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  if (!response.ok) return undefined;
  const data = await response.json();
  return data?.resolved_value ?? data?.value;
}

async function upsertRuntimeVar(
  key: string,
  value: unknown,
  type: 'boolean' | 'string',
  description: string
): Promise<boolean> {
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
    }),
  });
  return response.ok;
}

function parseBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === 'boolean') return v;
  if (v === undefined || v === null) return fallback;
  return String(v).toLowerCase() === 'true';
}

function parseString(v: unknown, fallback: string): string {
  if (typeof v === 'string') return v;
  if (v === undefined || v === null) return fallback;
  return String(v);
}

function splitCsvLike(input: string): string[] {
  return input
    .split(/[,\n]/g)
    .map(s => s.trim())
    .filter(Boolean);
}

function joinCsvLike(tokens: string[]): string {
  return tokens.join(', ');
}

function uniqStable(tokens: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const token of tokens) {
    const key = token.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(token);
  }
  return out;
}

function splitLineList(input: string): string[] {
  return input
    .split(/\r?\n/g)
    .map(s => s.trim())
    .filter(Boolean);
}

type EsfHomeAggregate = {
  active_requests?: number;
  available_responders?: number;
};

type EsfDraftState = {
  serviceEnabled: boolean;
  regions: string;
  cities: string;
  acceptNew: boolean;
  banner: string;
  eligibilityRules: string;
  eligibilityCopy: EsfEligibilityCopyDraft;
};

type ExpandedPanel = 'coverage' | 'banner' | 'acceptNew' | 'eligibility';

async function loadEsfHomeAggregate(): Promise<EsfHomeAggregate | null> {
  const response = await fetch('/api/esf/home', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) return null;
  const data = await response.json();
  return (data?.data ?? null) as EsfHomeAggregate | null;
}

export function McpwEsfWorkspacePage() {
  const { t, isRTL } = useI18n();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const [lastUpdatedLabel, setLastUpdatedLabel] = useState<string>('—');
  const [loadWarning, setLoadWarning] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const [draftServiceEnabled, setDraftServiceEnabled] = useState(true);
  const [draftRegions, setDraftRegions] = useState('');
  const [draftCities, setDraftCities] = useState('');
  const [draftAcceptNew, setDraftAcceptNew] = useState(true);
  const [draftBanner, setDraftBanner] = useState('');
  const [draftEligibilityRules, setDraftEligibilityRules] = useState('');
  const [draftEligibilityCopy, setDraftEligibilityCopy] =
    useState<EsfEligibilityCopyDraft>(DEFAULT_ELIGIBILITY_COPY);

  const [baseline, setBaseline] = useState<EsfDraftState | null>(null);
  const [homeAgg, setHomeAgg] = useState<EsfHomeAggregate | null>(null);

  const [regionsSelect, setRegionsSelect] = useState<string>('');
  const [citiesSelect, setCitiesSelect] = useState<string>('');

  const [focusedPanel, setFocusedPanel] = useState<ExpandedPanel | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<ExpandedPanel | null>(
    null
  );
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showGovernanceDeck, setShowGovernanceDeck] = useState(false);

  const tx = useCallback((key: string) => t(`${I18N_NS}.${key}`), [t]);
  const txSafe = useCallback(
    (key: string, fallback: string) => {
      const value = tx(key);
      if (!value) return fallback;
      if (typeof value === 'string' && value.startsWith(`${I18N_NS}.`)) {
        return fallback;
      }
      return value as string;
    },
    [tx]
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadWarning(null);
    setViewError(null);

    try {
      const result = await Promise.allSettled([
        resolveRuntimeVar(VAR_SERVICE_ENABLED),
        resolveRuntimeVar(VAR_REGIONS),
        resolveRuntimeVar(VAR_CITIES),
        resolveRuntimeVar(VAR_ACCEPT_NEW),
        resolveRuntimeVar(VAR_BANNER),
        resolveRuntimeVar(VAR_ELIGIBILITY_RULES),
        resolveRuntimeVar(VAR_ELIGIBILITY_TITLE),
        resolveRuntimeVar(VAR_ELIGIBILITY_SUBTITLE),
        resolveRuntimeVar(VAR_ELIGIBILITY_NOTE),
        resolveRuntimeVar(VAR_ELIGIBILITY_CONFIRM_LABEL),
        resolveRuntimeVar(VAR_ELIGIBILITY_CANCEL_LABEL),
        resolveRuntimeVar(VAR_ELIGIBILITY_ACTIVATING_LABEL),
      ]);

      const values = result.map(item =>
        item.status === 'fulfilled' ? item.value : undefined
      );
      const [
        en,
        reg,
        cit,
        acc,
        ban,
        elig,
        title,
        subtitle,
        note,
        confirm,
        cancel,
        activating,
      ] = values;

      const nextServiceEnabled = parseBool(en, true);
      const nextRegions = parseString(reg, '');
      const nextCities = parseString(cit, '');
      const nextAcceptNew = parseBool(acc, true);
      const nextBanner = parseString(ban, '');
      const nextEligibilityRules = parseString(elig, '');
      const nextEligibilityCopy: EsfEligibilityCopyDraft = {
        title: parseString(title, DEFAULT_ELIGIBILITY_COPY.title),
        subtitle: parseString(subtitle, DEFAULT_ELIGIBILITY_COPY.subtitle),
        note: parseString(note, DEFAULT_ELIGIBILITY_COPY.note),
        confirmLabel: parseString(
          confirm,
          DEFAULT_ELIGIBILITY_COPY.confirmLabel
        ),
        cancelLabel: parseString(cancel, DEFAULT_ELIGIBILITY_COPY.cancelLabel),
        activatingLabel: parseString(
          activating,
          DEFAULT_ELIGIBILITY_COPY.activatingLabel
        ),
      };

      setDraftServiceEnabled(nextServiceEnabled);
      setDraftRegions(nextRegions);
      setDraftCities(nextCities);
      setDraftAcceptNew(nextAcceptNew);
      setDraftBanner(nextBanner);
      setDraftEligibilityRules(nextEligibilityRules);
      setDraftEligibilityCopy(nextEligibilityCopy);
      setBaseline({
        serviceEnabled: nextServiceEnabled,
        regions: nextRegions,
        cities: nextCities,
        acceptNew: nextAcceptNew,
        banner: nextBanner,
        eligibilityRules: nextEligibilityRules,
        eligibilityCopy: { ...nextEligibilityCopy },
      });
      setRegionsSelect('');
      setCitiesSelect('');

      const unresolvedCount = result.filter(
        item => item.status === 'rejected'
      ).length;
      setLoadWarning(
        unresolvedCount > 0
          ? txSafe(
              'loadDegradedWarning',
              'تعذر قراءة بعض الإعدادات الحية الآن.'
            )
          : null
      );

      const agg = await loadEsfHomeAggregate();
      setHomeAgg(agg);
      setLastUpdatedLabel(new Date().toLocaleString());
    } catch {
      setViewError(
        txSafe('loadError', 'تعذر تحميل الصفحة الآن. حاول التحديث.')
      );
    } finally {
      setLoading(false);
    }
  }, [txSafe]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const dirty = useMemo(() => {
    if (!baseline) return false;
    return (
      baseline.serviceEnabled !== draftServiceEnabled ||
      baseline.acceptNew !== draftAcceptNew ||
      baseline.banner !== draftBanner ||
      baseline.eligibilityRules !== draftEligibilityRules ||
      baseline.eligibilityCopy.title !== draftEligibilityCopy.title ||
      baseline.eligibilityCopy.subtitle !== draftEligibilityCopy.subtitle ||
      baseline.eligibilityCopy.note !== draftEligibilityCopy.note ||
      baseline.eligibilityCopy.confirmLabel !==
        draftEligibilityCopy.confirmLabel ||
      baseline.eligibilityCopy.cancelLabel !==
        draftEligibilityCopy.cancelLabel ||
      baseline.eligibilityCopy.activatingLabel !==
        draftEligibilityCopy.activatingLabel ||
      baseline.regions !== draftRegions ||
      baseline.cities !== draftCities
    );
  }, [
    baseline,
    draftAcceptNew,
    draftBanner,
    draftCities,
    draftEligibilityCopy,
    draftEligibilityRules,
    draftRegions,
    draftServiceEnabled,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as any).__MCPW_UNSAVED_CHANGES__ = Boolean(dirty || saving);
    return () => {
      (window as any).__MCPW_UNSAVED_CHANGES__ = false;
    };
  }, [dirty, saving]);

  const persistDraft = useCallback(
    async (nextDraft: EsfDraftState, taskId: string = 'esf_save') => {
      if (loading || saving) return;
      startTaskSession(taskId, { scope: 'esf' });
      setSaving(true);
      setSaveNotice(null);
      setViewError(null);

      try {
        const results = await Promise.all([
          upsertRuntimeVar(
            VAR_SERVICE_ENABLED,
            nextDraft.serviceEnabled,
            'boolean',
            'ESF service_enabled (VAR_SVC_ESF_ENABLED)'
          ),
          upsertRuntimeVar(
            VAR_REGIONS,
            nextDraft.regions.trim(),
            'string',
            'ESF available_regions (comma-separated)'
          ),
          upsertRuntimeVar(
            VAR_CITIES,
            nextDraft.cities.trim(),
            'string',
            'ESF available_cities (comma-separated)'
          ),
          upsertRuntimeVar(
            VAR_ACCEPT_NEW,
            nextDraft.acceptNew,
            'boolean',
            'ESF accept_new_requests'
          ),
          upsertRuntimeVar(
            VAR_BANNER,
            nextDraft.banner.trim(),
            'string',
            'ESF banner_text for app-client'
          ),
          upsertRuntimeVar(
            VAR_ELIGIBILITY_RULES,
            nextDraft.eligibilityRules.trim(),
            'string',
            'ESF donor eligibility rules (one line per rule shown before donor readiness enablement)'
          ),
          upsertRuntimeVar(
            VAR_ELIGIBILITY_TITLE,
            nextDraft.eligibilityCopy.title.trim(),
            'string',
            'ESF donor eligibility sheet title shown before donor readiness enablement'
          ),
          upsertRuntimeVar(
            VAR_ELIGIBILITY_SUBTITLE,
            nextDraft.eligibilityCopy.subtitle.trim(),
            'string',
            'ESF donor eligibility sheet subtitle shown before donor readiness enablement'
          ),
          upsertRuntimeVar(
            VAR_ELIGIBILITY_NOTE,
            nextDraft.eligibilityCopy.note.trim(),
            'string',
            'ESF donor eligibility sheet note shown before donor readiness enablement'
          ),
          upsertRuntimeVar(
            VAR_ELIGIBILITY_CONFIRM_LABEL,
            nextDraft.eligibilityCopy.confirmLabel.trim(),
            'string',
            'ESF donor eligibility sheet primary action label'
          ),
          upsertRuntimeVar(
            VAR_ELIGIBILITY_CANCEL_LABEL,
            nextDraft.eligibilityCopy.cancelLabel.trim(),
            'string',
            'ESF donor eligibility sheet secondary action label'
          ),
          upsertRuntimeVar(
            VAR_ELIGIBILITY_ACTIVATING_LABEL,
            nextDraft.eligibilityCopy.activatingLabel.trim(),
            'string',
            'ESF donor eligibility sheet in-progress label while readiness is being enabled'
          ),
        ]);

        const allOk = results.every(Boolean);
        setSaveNotice(
          allOk
            ? txSafe('saveOk', 'تم الحفظ.')
            : txSafe('savePartial', 'تعذر حفظ بعض الإعدادات.')
        );

        if (allOk) {
          completeTaskSession(taskId, 'success', { scope: 'esf' });
          setLastUpdatedLabel(new Date().toLocaleString());
          setDraftServiceEnabled(nextDraft.serviceEnabled);
          setDraftRegions(nextDraft.regions);
          setDraftCities(nextDraft.cities);
          setDraftAcceptNew(nextDraft.acceptNew);
          setDraftBanner(nextDraft.banner);
          setDraftEligibilityRules(nextDraft.eligibilityRules);
          setDraftEligibilityCopy(nextDraft.eligibilityCopy);
          setBaseline({
            ...nextDraft,
            eligibilityCopy: { ...nextDraft.eligibilityCopy },
          });
          setShowStopConfirm(false);
        } else {
          completeTaskSession(taskId, 'fail', {
            scope: 'esf',
            reason: 'partial_save',
          });
        }
      } catch {
        completeTaskSession(taskId, 'fail', {
          scope: 'esf',
          reason: 'exception',
        });
        setViewError(txSafe('saveError', 'تعذر الحفظ الآن. حاول لاحقًا.'));
      } finally {
        setSaving(false);
      }
    },
    [loading, saving, txSafe]
  );

  const buildCurrentDraft = useCallback(
    (): EsfDraftState => ({
      serviceEnabled: draftServiceEnabled,
      regions: draftRegions,
      cities: draftCities,
      acceptNew: draftAcceptNew,
      banner: draftBanner,
      eligibilityRules: draftEligibilityRules,
      eligibilityCopy: { ...draftEligibilityCopy },
    }),
    [
      draftAcceptNew,
      draftBanner,
      draftCities,
      draftEligibilityCopy,
      draftEligibilityRules,
      draftRegions,
      draftServiceEnabled,
    ]
  );

  const handleSave = async (taskId: string = 'esf_save') => {
    await persistDraft(buildCurrentDraft(), taskId);
  };

  const regionsTokens = useMemo(
    () => uniqStable(splitCsvLike(draftRegions)),
    [draftRegions]
  );

  const citiesTokens = useMemo(
    () => uniqStable(splitCsvLike(draftCities)),
    [draftCities]
  );

  const coverageConfigured = useMemo(
    () => regionsTokens.length > 0 || citiesTokens.length > 0,
    [citiesTokens.length, regionsTokens.length]
  );

  const addRegionToken = useCallback(
    (raw: string) => {
      const token = raw.trim();
      if (!token) return;
      setDraftRegions(joinCsvLike(uniqStable([...regionsTokens, token])));
    },
    [regionsTokens]
  );

  const removeRegion = useCallback(
    (token: string) => {
      setDraftRegions(
        joinCsvLike(
          regionsTokens.filter(
            current => current.toLowerCase() !== token.toLowerCase()
          )
        )
      );
    },
    [regionsTokens]
  );

  const addCityToken = useCallback(
    (raw: string) => {
      const token = raw.trim();
      if (!token) return;
      setDraftCities(joinCsvLike(uniqStable([...citiesTokens, token])));
    },
    [citiesTokens]
  );

  const removeCity = useCallback(
    (token: string) => {
      setDraftCities(
        joinCsvLike(
          citiesTokens.filter(
            current => current.toLowerCase() !== token.toLowerCase()
          )
        )
      );
    },
    [citiesTokens]
  );

  const viewState = useMemo(() => {
    if (saving) return 'SAVING' as const;
    if (viewError) return 'ERROR' as const;
    if (!draftServiceEnabled) return 'PAUSED' as const;
    if (!coverageConfigured) return 'MISCONFIGURED' as const;
    return 'ACTIVE' as const;
  }, [coverageConfigured, draftServiceEnabled, saving, viewError]);

  const labelMuted =
    'mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500';
  const panel =
    'overflow-hidden rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5';
  const compactCard = 'rounded-2xl border border-stone-200 bg-stone-50/80 p-4';
  const metaPill =
    'inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-gray-700';
  const chip =
    'inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm';
  const shellSurface = 'rounded-3xl border border-slate-200 bg-white shadow-sm';
  const elevatedSurface = 'rounded-3xl border border-slate-200 bg-white shadow-lg';
  const tintedSurface = 'rounded-3xl border border-slate-200 bg-slate-50 shadow-sm';
  const warmTintSurface = 'rounded-3xl border border-amber-200 bg-amber-50 shadow-sm';
  const infoTintSurface = 'rounded-3xl border border-blue-200 bg-blue-50 shadow-sm';
  const calmButton =
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50';

  const resolvedEligibilityCopy = useMemo(
    () => ({
      title:
        draftEligibilityCopy.title.trim() || DEFAULT_ELIGIBILITY_COPY.title,
      subtitle:
        draftEligibilityCopy.subtitle.trim() ||
        DEFAULT_ELIGIBILITY_COPY.subtitle,
      note: draftEligibilityCopy.note.trim() || DEFAULT_ELIGIBILITY_COPY.note,
      confirmLabel:
        draftEligibilityCopy.confirmLabel.trim() ||
        DEFAULT_ELIGIBILITY_COPY.confirmLabel,
      cancelLabel:
        draftEligibilityCopy.cancelLabel.trim() ||
        DEFAULT_ELIGIBILITY_COPY.cancelLabel,
      activatingLabel:
        draftEligibilityCopy.activatingLabel.trim() ||
        DEFAULT_ELIGIBILITY_COPY.activatingLabel,
    }),
    [draftEligibilityCopy]
  );

  const updateEligibilityCopyField = useCallback(
    (field: keyof EsfEligibilityCopyDraft, value: string) => {
      setDraftEligibilityCopy(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const statusBadge = useMemo(() => {
    if (loading) {
      return {
        label: txSafe('statusLoading', 'جارٍ التحميل…'),
        cls: 'bg-gray-100 text-gray-700 ring-gray-200',
      };
    }
    switch (viewState) {
      case 'ACTIVE':
        return {
          label: txSafe('statusActive', 'تعمل الآن'),
          cls: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
        };
      case 'PAUSED':
        return {
          label: txSafe('statusPaused', 'متوقفة'),
          cls: 'bg-gray-100 text-gray-700 ring-gray-200',
        };
      case 'MISCONFIGURED':
        return {
          label: txSafe('statusMisconfigured', 'تحتاج إكمال إعداد'),
          cls: 'bg-amber-50 text-amber-900 ring-amber-200',
        };
      case 'SAVING':
        return {
          label: txSafe('statusSaving', 'جارٍ الحفظ…'),
          cls: 'bg-slate-50 text-slate-800 ring-slate-200',
        };
      default:
        return {
          label: txSafe('statusError', 'خطأ'),
          cls: 'bg-rose-50 text-rose-800 ring-rose-200',
        };
    }
  }, [loading, txSafe, viewState]);

  const primaryAction = useMemo(() => {
    if (loading) {
      return {
        intent: 'complete' as const,
        label: txSafe('primaryLoading', 'جارٍ التحميل…'),
        disabled: true,
      };
    }
    if (saving) {
      return {
        intent: 'complete' as const,
        label: txSafe('primarySaving', 'جارٍ الحفظ…'),
        disabled: true,
      };
    }
    if (viewState === 'MISCONFIGURED') {
      return {
        intent: 'complete' as const,
        label: txSafe('primaryCompleteCoverage', 'إكمال التغطية ثم التشغيل'),
        disabled: false,
      };
    }
    if (viewState === 'PAUSED') {
      return {
        intent: 'start' as const,
        label: txSafe('primaryStart', 'تشغيل الخدمة'),
        disabled: false,
      };
    }
    if (viewState === 'ACTIVE') {
      return {
        intent: 'stop' as const,
        label: txSafe('primaryStop', 'إيقاف الخدمة'),
        disabled: false,
      };
    }
    return {
      intent: 'retry' as const,
      label: txSafe('primaryRetry', 'إعادة المحاولة'),
      disabled: false,
    };
  }, [loading, saving, txSafe, viewState]);

  const coverageSummary = useMemo(() => {
    const r = regionsTokens.length;
    const c = citiesTokens.length;
    if (r === 0 && c === 0) return txSafe('coverageEmpty', 'غير مضبوطة');
    const parts: string[] = [];
    parts.push(
      txSafe('coverageRegionsCount', 'المناطق: {{count}}').replace(
        '{{count}}',
        String(r)
      )
    );
    parts.push(
      txSafe('coverageCitiesCount', 'المدن: {{count}}').replace(
        '{{count}}',
        String(c)
      )
    );
    return parts.join(' • ');
  }, [regionsTokens.length, citiesTokens.length, txSafe]);

  const bannerSummary = useMemo(() => {
    const trimmed = draftBanner.trim();
    if (!trimmed) return txSafe('bannerEmpty', 'غير موجودة');
    if (trimmed.length <= 44) return trimmed;
    return `${trimmed.slice(0, 44)}…`;
  }, [draftBanner, txSafe]);

  const acceptNewSummary = useMemo(() => {
    return draftAcceptNew
      ? txSafe('acceptNewOn', 'مفعّل')
      : txSafe('acceptNewOff', 'موقوف');
  }, [draftAcceptNew, txSafe]);

  const eligibilitySummary = useMemo(() => {
    const count = splitLineList(draftEligibilityRules).length;
    if (count === 0) {
      return txSafe('eligibilityDefaultSummary', 'الافتراضي النشط');
    }
    return txSafe('eligibilityCountSummary', '{{count}} شرطًا').replace(
      '{{count}}',
      String(count)
    );
  }, [draftEligibilityRules, txSafe]);

  const analytics = useMemo(() => {
    const active =
      typeof homeAgg?.active_requests === 'number'
        ? homeAgg.active_requests
        : null;
    const responders =
      typeof homeAgg?.available_responders === 'number'
        ? homeAgg.available_responders
        : null;
    const max = Math.max(active ?? 0, responders ?? 0, 1);
    const pct = (v: number | null) =>
      v === null ? 0 : Math.max(0, Math.min(100, (v / max) * 100));
    return {
      active,
      responders,
      max,
      activePct: pct(active),
      respondersPct: pct(responders),
    };
  }, [homeAgg?.active_requests, homeAgg?.available_responders]);

  const handlePrimaryAction = async () => {
    if (primaryAction.disabled) return;
    trackMcpwTelemetry('esf.primary_action_click', {
      task_id: 'esf_primary',
      click_target: 'primary_cta',
      intent: primaryAction.intent,
      viewState,
      dirty,
    });

    if (primaryAction.intent === 'retry') {
      await loadAll();
      return;
    }

    if (primaryAction.intent === 'complete') {
      setFocusedPanel('coverage');
      return;
    }

    if (primaryAction.intent === 'start') {
      const nextDraft = buildCurrentDraft();
      nextDraft.serviceEnabled = true;
      nextDraft.acceptNew = true;
      await persistDraft(nextDraft, 'esf_primary_start');
      return;
    }

    // stop flow: inline confirm inside card (2 taps total)
    if (!showStopConfirm) {
      setShowStopConfirm(true);
      return;
    }
    const nextDraft = buildCurrentDraft();
    nextDraft.serviceEnabled = false;
    await persistDraft(nextDraft, 'esf_primary_stop');
  };

  const applyCoverageSmartDefaults = () => {
    // Minimal smart defaults: only fill when empty to avoid surprising edits.
    if (regionsTokens.length === 0)
      setDraftRegions(joinCsvLike(['منطقة الرياض']));
    if (citiesTokens.length === 0) setDraftCities(joinCsvLike(['الرياض']));
  };

  const applyEligibilityDefaults = () => {
    setDraftEligibilityRules(DEFAULT_ELIGIBILITY_RULES_TEMPLATE);
  };

  const openPanel = useCallback((panel: ExpandedPanel) => {
    setFocusedPanel(panel);
    setShowGovernanceDeck(false);
    setShowStopConfirm(false);
  }, []);

  const openEditor = useCallback((panel: ExpandedPanel) => {
    setFocusedPanel(panel);
    setExpandedPanel(panel);
    setShowGovernanceDeck(false);
    setShowStopConfirm(false);
  }, []);

  const operatingModel = useMemo(() => {
    const hasBanner = draftBanner.trim().length > 0;
    const eligibilityCount = splitLineList(draftEligibilityRules).length;
    const active = analytics.active ?? 0;
    const responders = analytics.responders ?? 0;
    const gap = Math.max(active - responders, 0);
    const ratio =
      active > 0
        ? Math.max(0, Math.min(100, Math.round((responders / active) * 100)))
        : responders > 0
          ? 100
          : 0;
    const footprint = regionsTokens.length + citiesTokens.length;
    const controlScore = Math.max(
      0,
      Math.min(
        100,
        (draftServiceEnabled ? 30 : 0) +
          (coverageConfigured ? 25 : 0) +
          (draftAcceptNew ? 15 : 0) +
          (hasBanner ? 10 : 0) +
          (eligibilityCount > 0 ? 20 : 15)
      )
    );

    let headline = txSafe(
      'heroPausedTitle',
      'خدمة ESF متوقفة الآن بقرار تشغيلي.'
    );
    let summary = txSafe(
      'heroPausedSummary',
      'أعد فتح الخدمة فقط بعد مراجعة التغطية، سياسة الاستقبال، والرسالة الميدانية.'
    );
    let accent = txSafe('heroPausedAccent', 'وضع متوقف');
    let surfaceClass = 'border-stone-800 bg-stone-950 text-white';
    let accentClass = 'bg-white/10 text-white ring-1 ring-white/15';
    let pressureLabel = txSafe('pressureIdle', 'هادئ');

    if (viewState === 'ERROR') {
      headline = txSafe(
        'heroErrorTitle',
        'الصورة التشغيلية غير مكتملة الآن بسبب خطأ في التحميل.'
      );
      summary = txSafe(
        'heroErrorSummary',
        'حدّث البيانات أولًا قبل اتخاذ قرار تشغيل أو تعديل الإعدادات.'
      );
      accent = txSafe('heroErrorAccent', 'تنبيه تشغيلي');
      surfaceClass = 'border-rose-800 bg-rose-950 text-white';
      accentClass = 'bg-white/10 text-white ring-1 ring-white/15';
      pressureLabel = txSafe('pressureUnknown', 'غير واضح');
    } else if (viewState === 'MISCONFIGURED') {
      headline = txSafe(
        'heroMisconfiguredTitle',
        'الخدمة تحتاج إكمال الضبط قبل أن تعمل بثقة.'
      );
      summary = coverageConfigured
        ? txSafe(
            'heroMisconfiguredSummaryPartial',
            'هناك إعداد أساسي ناقص في مسار التشغيل. راجع الاستقبال والسياسة قبل الاعتماد.'
          )
        : txSafe(
            'heroMisconfiguredSummaryCoverage',
            'أضف منطقة أو مدينة واحدة على الأقل حتى لا يبدو المسار حيًا بينما التغطية فارغة.'
          );
      accent = txSafe('heroMisconfiguredAccent', 'حالة ناقصة');
      surfaceClass = 'border-amber-700 bg-amber-950 text-white';
      accentClass = 'bg-white/10 text-white ring-1 ring-white/15';
      pressureLabel = txSafe('pressureBlocked', 'محجوز');
    } else if (viewState === 'ACTIVE' && gap > 0) {
      headline = txSafe(
        'heroPressureTitle',
        'الطلبات الحالية أسرع من جاهزية المتبرعين.'
      );
      summary = txSafe(
        'heroPressureSummary',
        'هناك فجوة بين الطلب الحالي والعرض المتاح. استخدم التغطية والجاهزية والرسالة لاحتواء الضغط قبل أن ينعكس على تجربة التطبيق.'
      );
      accent = txSafe('heroPressureAccent', 'ضغط تشغيلي');
      surfaceClass = 'border-orange-800 bg-orange-950 text-white';
      accentClass = 'bg-white/10 text-white ring-1 ring-white/15';
      pressureLabel = txSafe('pressureHigh', 'مرتفع');
    } else if (viewState === 'ACTIVE') {
      headline = txSafe(
        'heroActiveTitle',
        'ESF تعمل الآن كغرفة عمليات متوازنة.'
      );
      summary = txSafe(
        'heroActiveSummary',
        'التحكم الآن ليس مجرد حفظ إعدادات، بل الحفاظ على توازن الطلب والتوفر ورسائل الميدان داخل التطبيق.'
      );
      accent = txSafe('heroActiveAccent', 'وضع نشط');
      surfaceClass = 'border-emerald-800 bg-emerald-950 text-white';
      accentClass = 'bg-white/10 text-white ring-1 ring-white/15';
      pressureLabel =
        gap > 0
          ? txSafe('pressureHigh', 'مرتفع')
          : txSafe('pressureBalanced', 'متوازن');
    } else if (viewState === 'SAVING') {
      headline = txSafe('heroSavingTitle', 'جارٍ تثبيت القرار التشغيلي…');
      summary = txSafe(
        'heroSavingSummary',
        'يتم الآن مزامنة متغيرات ESF الحية مع مساحة التشغيل.'
      );
      accent = txSafe('heroSavingAccent', 'قيد الحفظ');
      surfaceClass = 'border-slate-800 bg-slate-900 text-white';
      accentClass = 'bg-white/10 text-white ring-1 ring-white/15';
      pressureLabel = txSafe('pressureSync', 'قيد المزامنة');
    }

    return {
      active,
      responders,
      gap,
      ratio,
      footprint,
      controlScore,
      eligibilityCount,
      hasBanner,
      headline,
      summary,
      accent,
      surfaceClass,
      accentClass,
      pressureLabel,
    };
  }, [
    analytics.active,
    analytics.responders,
    coverageConfigured,
    draftAcceptNew,
    draftBanner,
    draftEligibilityRules,
    draftServiceEnabled,
    regionsTokens.length,
    citiesTokens.length,
    txSafe,
    viewState,
  ]);

  const defaultWorkspacePanel = useMemo<ExpandedPanel>(() => {
    if (viewState === 'MISCONFIGURED') return 'coverage';
    if (!draftAcceptNew && draftServiceEnabled) return 'acceptNew';
    if (!draftBanner.trim()) return 'banner';
    if (operatingModel.eligibilityCount === 0) return 'eligibility';
    return 'coverage';
  }, [
    draftAcceptNew,
    draftBanner,
    draftServiceEnabled,
    operatingModel.eligibilityCount,
    viewState,
  ]);

  const activeWorkspacePanel = focusedPanel ?? defaultWorkspacePanel;

  const panelMetaMap = useMemo(
    () => ({
      coverage: {
        title: txSafe('panelCoverageTitle', 'تغطية الخدمة'),
        description: txSafe(
          'panelCoverageDescription',
          'هذه القيم تحدد أين يظهر مسار ESF داخل تجربة العميل كخدمة قابلة للاستخدام.'
        ),
        saveTaskId: 'esf_inline_save_coverage',
      },
      banner: {
        title: txSafe('panelBannerTitle', 'نصوص واجهة ESF داخل التطبيق'),
        description: txSafe(
          'panelBannerDescription',
          'حرر الرسالة الميدانية ونصوص ورقة أهلية المتبرع التي تظهر قبل تفعيل الجاهزية.'
        ),
        saveTaskId: 'esf_inline_save_texts',
      },
      acceptNew: {
        title: txSafe('panelAcceptNewTitle', 'سياسة استقبال الطلبات الجديدة'),
        description: txSafe(
          'panelAcceptNewDescription',
          'افصل بين تشغيل الخدمة ككل وبين قرار استقبال طلبات جديدة حتى يبقى القرار الإداري واضحًا.'
        ),
        saveTaskId: 'esf_inline_save_accept_new',
      },
      eligibility: {
        title: txSafe('panelEligibilityTitle', 'اشتراطات أهلية التبرع'),
        description: txSafe(
          'panelEligibilityDescription',
          'هذه الشروط تظهر قبل تفعيل جاهزية المتبرع داخل التطبيق، لذلك هي جزء من المنطق لا مجرد نص مرجعي.'
        ),
        saveTaskId: 'esf_inline_save_eligibility',
      },
    }),
    [txSafe]
  );

  const activePanelConfig = expandedPanel ? panelMetaMap[expandedPanel] : null;

  const workspacePanelConfig = panelMetaMap[activeWorkspacePanel];

  const eligibilityPreviewItems = useMemo(() => {
    const customItems = splitLineList(draftEligibilityRules);
    const sourceItems =
      customItems.length > 0
        ? customItems
        : splitLineList(DEFAULT_ELIGIBILITY_RULES_TEMPLATE);
    return sourceItems.slice(0, 5);
  }, [draftEligibilityRules]);

  const mainEligibilityPreviewItems = useMemo(
    () => eligibilityPreviewItems.slice(0, 3),
    [eligibilityPreviewItems]
  );

  const remainingEligibilityPreviewCount = Math.max(
    eligibilityPreviewItems.length - mainEligibilityPreviewItems.length,
    0
  );

  const statusBadgeTone = useMemo(() => {
    switch (viewState) {
      case 'ACTIVE':
        return 'success' as const;
      case 'MISCONFIGURED':
        return 'warning' as const;
      case 'SAVING':
        return 'info' as const;
      case 'ERROR':
        return 'critical' as const;
      default:
        return 'neutral' as const;
    }
  }, [viewState]);

  const eligibilitySourceLabel = useMemo(
    () =>
      operatingModel.eligibilityCount > 0
        ? txSafe('eligibilitySourceCustom', 'شروط مخصصة')
        : txSafe('eligibilitySourceDefault', 'القالب الافتراضي'),
    [operatingModel.eligibilityCount, txSafe]
  );

  const eligibilitySourceTone = useMemo(
    () =>
      operatingModel.eligibilityCount > 0
        ? ('info' as const)
        : ('warning' as const),
    [operatingModel.eligibilityCount]
  );

  const firstScreenMetrics = useMemo(
    () => [
      {
        id: 'active',
        label: txSafe('railMetricActive', 'الطلبات النشطة'),
        value:
          typeof analytics.active === 'number'
            ? analytics.active
            : ('—' as const),
        detail:
          analytics.active && analytics.active > 0
            ? txSafe('railMetricActiveDetail', 'لقطة مباشرة من /api/esf/home')
            : txSafe('railMetricActiveEmpty', 'لا توجد حركة ظاهرة الآن'),
        icon: Activity,
        toneClass: 'border-orange-200 bg-orange-50/70 text-orange-900',
      },
      {
        id: 'responders',
        label: txSafe('railMetricResponders', 'المتبرعون الجاهزون'),
        value:
          typeof analytics.responders === 'number'
            ? analytics.responders
            : ('—' as const),
        detail:
          operatingModel.responders > 0
            ? txSafe('railMetricRespondersDetail', 'جاهزية فعلية مرصودة')
            : txSafe('railMetricRespondersEmpty', 'لا توجد جاهزية كافية الآن'),
        icon: Users,
        toneClass:
          operatingModel.responders > 0
            ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
            : 'border-slate-200 bg-slate-50/70 text-slate-900',
      },
      {
        id: 'gap',
        label: txSafe('railMetricGap', 'الفجوة المباشرة'),
        value: operatingModel.gap,
        detail:
          operatingModel.gap > 0
            ? txSafe('railMetricGapDetail', 'الطلب أعلى من الجاهزية الحالية')
            : txSafe('railMetricGapBalanced', 'لا توجد فجوة ضاغطة الآن'),
        icon: AlertTriangle,
        toneClass:
          operatingModel.gap > 0
            ? 'border-rose-200 bg-rose-50/70 text-rose-900'
            : 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
      },
    ],
    [
      analytics.active,
      analytics.responders,
      operatingModel.gap,
      operatingModel.responders,
      txSafe,
    ]
  );

  const applyEligibilityTemplate = useCallback(
    (templateId: EligibilityTemplateId) => {
      const template = ELIGIBILITY_TEMPLATE_LIBRARY.find(
        item => item.id === templateId
      );
      if (!template) return;
      setDraftEligibilityRules(template.rules.join('\n'));
      openPanel('eligibility');
    },
    [openPanel]
  );

  const persistEligibilityTemplate = useCallback(
    async (templateId: EligibilityTemplateId) => {
      const template = ELIGIBILITY_TEMPLATE_LIBRARY.find(
        item => item.id === templateId
      );
      if (!template) return;

      const nextDraft = buildCurrentDraft();
      nextDraft.eligibilityRules = template.rules.join('\n');

      await persistDraft(nextDraft, `esf_eligibility_${templateId}`);
    },
    [buildCurrentDraft, persistDraft]
  );

  const smartPresets = useMemo<
    Array<{
      id: SmartPresetId;
      title: string;
      detail: string;
      tone: 'emerald' | 'slate' | 'amber' | 'orange';
    }>
  >(
    () => [
      {
        id: 'go-live',
        title: txSafe('presetGoLiveTitle', 'تشغيل جاهز'),
        detail: txSafe('presetGoLiveDetail', 'فتح الخدمة + الاستقبال'),
        tone:
          draftServiceEnabled && draftAcceptNew
            ? ('emerald' as const)
            : ('slate' as const),
      },
      {
        id: 'pause-intake',
        title: txSafe('presetPauseIntakeTitle', 'إيقاف الطلبات الجديدة'),
        detail: txSafe(
          'presetPauseIntakeDetail',
          'إبقاء الخدمة مع إغلاق الاستقبال'
        ),
        tone: !draftAcceptNew ? ('amber' as const) : ('slate' as const),
      },
      {
        id: 'seed-coverage',
        title: txSafe('presetSeedCoverageTitle', 'تعبئة تغطية أولية'),
        detail: txSafe('presetSeedCoverageDetail', 'منطقة + مدينة بداية'),
        tone: coverageConfigured ? ('slate' as const) : ('orange' as const),
      },
    ],
    [coverageConfigured, draftAcceptNew, draftServiceEnabled, txSafe]
  );

  const workspaceSections = useMemo(
    () => [
      {
        id: 'coverage' as const,
        title: txSafe('regionsBoxTitle', 'مناطق التشغيل'),
        summary: coverageSummary,
        detail: txSafe(
          'regionsBoxSubtitle',
          'حدد أين تظهر الخدمة وتعمل.'
        ),
        icon: MapPin,
        badgeTone: coverageConfigured ? ('info' as const) : ('warning' as const),
        surfaceClass: coverageConfigured
          ? 'border-[#d9e7f6] bg-[#eff6ff] text-[#1d4ed8]'
          : 'border-[#f3d3ae] bg-[#fff7ed] text-[#c2410c]',
      },
      {
        id: 'acceptNew' as const,
        title: txSafe('acceptNewCardTitle', 'الطلبات الجديدة'),
        summary: acceptNewSummary,
        detail: txSafe(
          'panelAcceptNewDescription',
          'افصل بين تشغيل الخدمة ككل وبين قرار استقبال طلبات جديدة حتى يبقى القرار الإداري واضحًا.'
        ),
        icon: Activity,
        badgeTone: draftAcceptNew ? ('success' as const) : ('warning' as const),
        surfaceClass: draftAcceptNew
          ? 'border-[#cdebd9] bg-[#ecfdf5] text-[#15803d]'
          : 'border-[#f3d3ae] bg-[#fff7ed] text-[#c2410c]',
      },
      {
        id: 'banner' as const,
        title: txSafe('textsBoxTitle', 'نصوص واجهة العميل'),
        summary: bannerSummary,
        detail: txSafe(
          'textsBoxSubtitle',
          'الرسالة الميدانية ونصوص ورقة الأهلية.'
        ),
        icon: Bell,
        badgeTone: draftBanner.trim() ? ('info' as const) : ('neutral' as const),
        surfaceClass: draftBanner.trim()
          ? 'border-[#d9e7f6] bg-[#f5f9ff] text-[#1d4ed8]'
          : 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569]',
      },
      {
        id: 'eligibility' as const,
        title: txSafe('eligibilityBoxTitle', 'صندوق اشتراطات الأهلية'),
        summary: eligibilitySummary,
        detail: txSafe(
          'eligibilityBoxSubtitle',
          'الاشتراطات التي تسبق تفعيل الجاهزية.'
        ),
        icon: ShieldCheck,
        badgeTone:
          operatingModel.eligibilityCount > 0
            ? ('info' as const)
            : ('warning' as const),
        surfaceClass:
          operatingModel.eligibilityCount > 0
            ? 'border-[#e6defb] bg-[#f7f2ff] text-[#6d28d9]'
            : 'border-[#f4e0a7] bg-[#fffbea] text-[#a16207]',
      },
    ],
    [
      acceptNewSummary,
      bannerSummary,
      coverageConfigured,
      coverageSummary,
      draftAcceptNew,
      draftBanner,
      eligibilitySummary,
      operatingModel.eligibilityCount,
      txSafe,
    ]
  );

  const surfaceNotice = useMemo(() => {
    if (viewError) {
      return {
        label: txSafe('errorTitle', 'تعذر التنفيذ'),
        message: viewError,
        className: 'border-rose-200 bg-rose-50 text-rose-900',
      };
    }

    if (loadWarning) {
      return {
        label: txSafe('degradedTitle', 'تنبيه'),
        message: loadWarning,
        className: 'border-amber-200 bg-amber-50 text-amber-900',
      };
    }

    if (saveNotice) {
      return {
        label: txSafe('save', 'حفظ'),
        message: saveNotice,
        className: 'border-slate-200 bg-slate-50 text-slate-800',
      };
    }

    return null;
  }, [loadWarning, saveNotice, txSafe, viewError]);

  const headerSnapshots = useMemo(
    () => [
      {
        id: 'state',
        label: txSafe('headerStateSnapshot', 'الوضع الحالي'),
        value: statusBadge.label,
        detail: txSafe('serviceActionRailLabel', 'القرار السريع'),
      },
      {
        id: 'pressure',
        label: txSafe('headerPressure', 'الضغط الحالي'),
        value: operatingModel.pressureLabel,
        detail: txSafe('analyticsBoxSubtitle', 'قراءة سريعة للطلب والجاهزية والفجوة.'),
      },
      {
        id: 'focus',
        label: txSafe('headerFocusSnapshot', 'محور العمل'),
        value: workspacePanelConfig.title,
        detail: workspacePanelConfig.description,
      },
    ],
    [
      operatingModel.pressureLabel,
      statusBadge.label,
      txSafe,
      workspacePanelConfig.description,
      workspacePanelConfig.title,
    ]
  );

  const activeExperienceLens = useMemo(() => {
    switch (activeWorkspacePanel) {
      case 'coverage':
        return {
          title: txSafe('coverageLensTitle', 'التغطية تحكم أول انطباع'),
          body: coverageConfigured
            ? txSafe(
                'coverageLensBodyReady',
                'النطاق الحالي واضح، لذلك قرار التشغيل صار مقنعًا بدل أن يبدو شكليًا.'
              )
            : txSafe(
                'coverageLensBodyMissing',
                'عندما تبقى التغطية فارغة، تبدو الخدمة حية لكن بلا نطاق حقيقي. هذا أول سبب لفقدان الثقة.'
              ),
          highlights: [
            `${txSafe('regionsLabel', 'المناطق')}: ${regionsTokens.join('، ') || '—'}`,
            `${txSafe('citiesLabel', 'المدن')}: ${citiesTokens.join('، ') || '—'}`,
            `${txSafe('coverageSummaryLabel', 'ملخص التغطية')}: ${coverageSummary}`,
          ],
          surfaceClass: coverageConfigured
            ? 'border-[#dbeafe] bg-[#f4f9ff]'
            : 'border-[#fed7aa] bg-[#fff7ed]',
        };
      case 'acceptNew':
        return {
          title: txSafe('acceptNewLensTitle', 'فتح الطلبات الجديدة قرار تشغيل لا زخرفة'),
          body: draftAcceptNew
            ? txSafe(
                'acceptNewLensBodyOpen',
                'المسار مفتوح الآن للطلبات الجديدة، لذلك أي ضعف في التغطية أو الرسالة سينعكس مباشرة على العميل.'
              )
            : txSafe(
                'acceptNewLensBodyPaused',
                'إيقاف الطلبات الجديدة هنا يحمي المسار عند الضغط، مع إبقاء التحكم العام في الخدمة قائمًا.'
              ),
          highlights: [
            `${txSafe('acceptNewCardTitle', 'الطلبات الجديدة')}: ${acceptNewSummary}`,
            `${txSafe('headerPressure', 'الضغط الحالي')}: ${operatingModel.pressureLabel}`,
            `${txSafe('headerControlScore', 'تماسك غرفة التشغيل')}: ${operatingModel.controlScore}%`,
          ],
          surfaceClass: draftAcceptNew
            ? 'border-[#bbf7d0] bg-[#f0fdf4]'
            : 'border-[#fde68a] bg-[#fffbeb]',
        };
      case 'banner':
        return {
          title: txSafe('bannerLensTitle', 'النصوص هي الواجهة لا هامشها'),
          body: draftBanner.trim()
            ? txSafe(
                'bannerLensBodyReady',
                'الرسالة الحالية تساعد العميل على فهم وضع الخدمة قبل أن يلتزم أو يتوقع أكثر من الواقع.'
              )
            : txSafe(
                'bannerLensBodyMissing',
                'من دون رسالة ميدانية، يتحمل العميل عبء تفسير الضغط وحدود النطاق وحده.'
              ),
          highlights: [
            draftBanner.trim() ||
              txSafe('bannerPreviewEmpty', 'لا توجد رسالة حالية مرتبطة بـ ESF.'),
            resolvedEligibilityCopy.title,
            resolvedEligibilityCopy.confirmLabel,
          ],
          surfaceClass: draftBanner.trim()
            ? 'border-[#dbeafe] bg-[#f5f9ff]'
            : 'border-[#e2e8f0] bg-[#f8fafc]',
        };
      default:
        return {
          title: txSafe('eligibilityLensTitle', 'الجاهزية تبدأ من الشروط لا من الزر'),
          body:
            operatingModel.eligibilityCount > 0
              ? txSafe(
                  'eligibilityLensBodyReady',
                  'هناك صياغة تشغيلية مخصصة قبل تفعيل الجاهزية، وهذا يرفع دقة المسار بدل الاكتفاء بالقالب الافتراضي.'
                )
              : txSafe(
                  'eligibilityLensBodyDefault',
                  'المنطق يعمل الآن بالقالب الآمن الافتراضي، وهو مقبول وظيفيًا لكنه أقل ذكاءً من سياسة ميدانية مخصصة.'
                ),
          highlights: eligibilityPreviewItems.slice(0, 3),
          surfaceClass:
            operatingModel.eligibilityCount > 0
              ? 'border-[#ddd6fe] bg-[#f7f2ff]'
              : 'border-[#fde68a] bg-[#fffbeb]',
        };
    }
  }, [
    acceptNewSummary,
    activeWorkspacePanel,
    coverageConfigured,
    coverageSummary,
    draftAcceptNew,
    draftBanner,
    eligibilityPreviewItems,
    operatingModel.controlScore,
    operatingModel.eligibilityCount,
    operatingModel.pressureLabel,
    regionsTokens,
    citiesTokens,
    resolvedEligibilityCopy.confirmLabel,
    resolvedEligibilityCopy.title,
    txSafe,
  ]);

  const handleSmartPreset = useCallback(
    async (presetId: SmartPresetId) => {
      trackMcpwTelemetry('esf.smart_preset_click', {
        task_id: 'esf_smart_preset',
        click_target: presetId,
        viewState,
      });

      const nextDraft: EsfDraftState = buildCurrentDraft();

      if (presetId === 'go-live') {
        nextDraft.serviceEnabled = true;
        nextDraft.acceptNew = true;
        if (!nextDraft.regions.trim() && !nextDraft.cities.trim()) {
          nextDraft.regions = joinCsvLike(['منطقة الرياض']);
          nextDraft.cities = joinCsvLike(['الرياض']);
        }
        if (!nextDraft.banner.trim()) {
          nextDraft.banner = 'الخدمة تعمل الآن ضمن النطاق المحدد.';
        }
        await persistDraft(nextDraft, 'esf_preset_go_live');
        return;
      }

      if (presetId === 'pause-intake') {
        nextDraft.serviceEnabled = true;
        nextDraft.acceptNew = false;
        if (!nextDraft.banner.trim()) {
          nextDraft.banner =
            'الطلبات الجديدة متوقفة مؤقتًا مع استمرار متابعة الحالات القائمة.';
        }
        await persistDraft(nextDraft, 'esf_preset_pause_intake');
        return;
      }

      if (coverageConfigured) {
        setSaveNotice(
          txSafe('presetCoverageExisting', 'التغطية مضبوطة بالفعل.')
        );
        openPanel('coverage');
        return;
      }

      nextDraft.regions = joinCsvLike(['منطقة الرياض']);
      nextDraft.cities = joinCsvLike(['الرياض']);
      await persistDraft(nextDraft, 'esf_preset_seed_coverage');
      openPanel('coverage');
    },
    [
      buildCurrentDraft,
      coverageConfigured,
      openPanel,
      persistDraft,
      txSafe,
      viewState,
    ]
  );

  return (
    <main
      className='h-[calc(100dvh-4.5rem)] max-h-[calc(100dvh-4.5rem)] overflow-hidden bg-slate-50 text-slate-950'
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className='mx-auto flex h-full min-h-0 w-full max-w-[1540px] flex-col gap-4 px-4 py-4 min-[900px]:px-5'>
        <section className={`shrink-0 p-4 ${elevatedSurface}`}>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='min-w-0 flex-1'>
              <div className='mb-2 flex flex-wrap items-center gap-2'>
                <OverviewBadge label='ESF' tone='info' />
                <OverviewBadge label={statusBadge.label} tone={statusBadgeTone} />
                <OverviewBadge label={workspacePanelConfig.title} tone='neutral' />
                {dirty ? (
                  <OverviewBadge
                    label={txSafe('unsavedChanges', 'تغييرات غير محفوظة')}
                    tone='warning'
                  />
                ) : null}
              </div>

              <h1 className='m-0 text-[26px] font-black tracking-tight text-[#111827]'>
                {txSafe('pageTitle', 'غرفة تشغيل ESF')}
              </h1>
              <p className='m-0 mt-1 max-w-[58rem] text-[12px] leading-6 text-[#64748b]'>
                {txSafe(
                  'pageSubtitle',
                  'واجهة قرار ثابتة بدون scroll: تركز على النطاق، استقبال الطلبات، نصوص العميل، واشتراطات الجاهزية بدون تكديس بصري.'
                )}
              </p>

              <div className='mt-4 flex flex-wrap gap-2'>
                {headerSnapshots.map(snapshot => (
                  <div key={snapshot.id} className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2'>
                    <span className='text-[11px] font-bold text-[#8b6b55]'>
                      {snapshot.label}
                    </span>
                    <span className='mx-2 text-[#d4a373]'>•</span>
                    <span className='text-[12px] font-black text-[#111827]'>
                      {snapshot.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className='w-full min-[1080px]:w-[20rem]'>
              <div className={`p-3 ${shellSurface}`}>
                <div className='flex items-center justify-end gap-2'>
                <Link
                  href='/service-catalog/services'
                  className='inline-flex items-center justify-center gap-2 rounded-full border border-[#dbe1ea] bg-white px-3 py-2 text-[11px] font-black text-[#475569] transition hover:border-[#cbd5e1] hover:text-[#111827]'
                >
                  <DirectionalIcon
                    icon={ArrowLeft}
                    mirrorInRTL={true}
                    className='h-4 w-4'
                    aria-hidden
                  />
                  {txSafe('backToServices', 'رجوع')}
                </Link>

                <button
                  type='button'
                  onClick={() => setShowGovernanceDeck(true)}
                  className='inline-flex items-center justify-center gap-2 rounded-full border border-[#dbe1ea] bg-white px-3 py-2 text-[11px] font-black text-[#475569] transition hover:border-[#cbd5e1] hover:text-[#111827]'
                >
                  <ShieldCheck className='h-4 w-4' aria-hidden />
                  {txSafe('logicAnchors', 'مراسي المنطق')}
                </button>

                <button
                  type='button'
                  onClick={() => void loadAll()}
                  disabled={loading}
                  className='inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#dbe1ea] bg-white text-[#475569] transition hover:border-[#cbd5e1] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-60'
                  aria-label={txSafe('refresh', 'تحديث')}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                    aria-hidden
                  />
                </button>
                </div>

                <div className={`mt-3 p-4 ${warmTintSurface}`}>
                  <p className='text-[11px] font-bold uppercase tracking-[0.14em] text-[#8b6b55]'>
                    {txSafe('serviceActionRailLabel', 'القرار السريع')}
                  </p>
                  <p className='mt-2 text-base font-black text-[#111827]'>
                    {showStopConfirm && primaryAction.intent === 'stop'
                      ? txSafe('confirmStop', 'تأكيد الإيقاف')
                      : primaryAction.label}
                  </p>
                  <button
                    type='button'
                    onClick={() => void handlePrimaryAction()}
                    disabled={primaryAction.disabled}
                    className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      primaryAction.intent === 'stop'
                        ? 'bg-rose-600 text-white shadow-sm hover:bg-rose-700'
                        : primaryAction.intent === 'start'
                          ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                          : primaryAction.intent === 'retry'
                            ? 'bg-slate-700 text-white shadow-sm hover:bg-slate-800'
                            : 'bg-orange-500 text-white shadow-sm hover:bg-orange-600'
                    }`}
                  >
                    {showStopConfirm && primaryAction.intent === 'stop'
                      ? txSafe('confirmStop', 'تأكيد الإيقاف')
                      : primaryAction.label}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {surfaceNotice ? (
          <section
            className={`shrink-0 rounded-2xl border px-4 py-3 text-sm ${surfaceNotice.className}`}
          >
            <p className='font-semibold'>{surfaceNotice.label}</p>
            <p className='mt-0.5 opacity-90'>{surfaceNotice.message}</p>
          </section>
        ) : null}

        <section className='min-h-0 flex-1 overflow-hidden'>
          <div className='grid h-full min-h-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]'>
            <aside className={`flex min-h-0 flex-col overflow-hidden p-4 ${shellSurface}`}>
              <div className='shrink-0'>
                <p className={labelMuted}>{txSafe('controlAxesLabel', 'محاور التحكم')}</p>
                <h2 className='text-lg font-black text-slate-900'>
                  {txSafe('controlAxesTitle', 'بوصلة ESF')}
                </h2>
                <p className='mt-1 text-sm leading-6 text-slate-600'>
                  {txSafe(
                    'controlAxesHint',
                    'اختيار المحور هنا يبدّل سطح العمل نفسه. لا حاجة لعرض صناديق كثيرة أو فتح محرر كامل في كل مرة.'
                  )}
                </p>
              </div>

              <div className='mt-4 grid gap-2'>
                {workspaceSections.map(section => {
                  const Icon = section.icon;
                  const isActive = activeWorkspacePanel === section.id;

                  return (
                    <button
                      key={section.id}
                      type='button'
                      onClick={() => openPanel(section.id)}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-4 text-start transition ${
                        isActive
                          ? 'border-amber-300 bg-amber-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${section.surfaceClass}`}
                      >
                        <Icon className='h-5 w-5' aria-hidden />
                      </div>

                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <p className='text-sm font-black text-slate-900'>
                            {section.title}
                          </p>
                          <OverviewBadge
                            label={section.summary}
                            tone={section.badgeTone}
                          />
                        </div>
                        <p className='mt-1 text-xs leading-6 text-slate-600'>
                          {section.detail}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={`mt-4 p-4 text-[#6e4122] ${warmTintSurface}`}>
                <p className={labelMuted}>{txSafe('smartPresetLabel', 'مختصر مفيد')}</p>
                <p className='text-sm font-black text-slate-900'>
                  {txSafe('smartPresetTitle', 'أوامر عند التعطل فقط')}
                </p>
                <div className='mt-3 grid gap-2'>
                  {smartPresets.slice(0, 2).map(preset => (
                    <button
                      key={preset.id}
                      type='button'
                      onClick={() => void handleSmartPreset(preset.id)}
                      disabled={loading || saving}
                      className={`rounded-2xl border px-4 py-3 text-start text-sm font-semibold shadow-sm transition disabled:opacity-60 ${
                        preset.tone === 'emerald'
                          ? 'border-[#caefd9] bg-white text-[#15803d] hover:bg-[#f0fdf4]'
                          : preset.tone === 'amber'
                            ? 'border-[#f3d3ae] bg-white text-[#c2410c] hover:bg-[#fff7ed]'
                            : preset.tone === 'orange'
                              ? 'border-[#f3d3ae] bg-white text-[#c2410c] hover:bg-[#fff7ed]'
                              : 'border-[#e5e7eb] bg-white text-[#475569] hover:bg-[#f8fafc]'
                      }`}
                    >
                      <span className='block font-black'>{preset.title}</span>
                      <span className='mt-1 block text-xs leading-5 opacity-80'>
                        {preset.detail}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <section className={`flex min-h-0 flex-col overflow-hidden p-5 ${elevatedSurface}`}>
              <div className='flex flex-wrap items-start justify-between gap-3'>
                <div className='min-w-0 flex-1'>
                  <div className='mb-2 flex flex-wrap items-center gap-2'>
                    <OverviewBadge label={workspacePanelConfig.title} tone='info' />
                    <OverviewBadge
                      label={dirty ? txSafe('unsavedChanges', 'تغييرات غير محفوظة') : txSafe('syncedState', 'متزامن')}
                      tone={dirty ? 'warning' : 'neutral'}
                    />
                  </div>
                  <h2 className='text-[24px] font-black text-[#111827]'>
                    {workspacePanelConfig.title}
                  </h2>
                  <p className='mt-1 max-w-3xl text-[13px] leading-6 text-[#64748b]'>
                    {workspacePanelConfig.description}
                  </p>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <button
                    type='button'
                    onClick={() => openEditor(activeWorkspacePanel)}
                    className={calmButton}
                  >
                    <Pencil className='h-4 w-4' aria-hidden />
                    {txSafe('openEditor', 'فتح المحرر')}
                  </button>

                  <button
                    type='button'
                    onClick={() =>
                      void handleSave(`esf_quick_save_${activeWorkspacePanel}`)
                    }
                    disabled={loading || saving || !dirty}
                    className='inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {saving ? txSafe('saving', 'جارٍ الحفظ…') : txSafe('save', 'حفظ')}
                  </button>
                </div>
              </div>

              <div className='mt-4 grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                <div className='grid min-h-0 gap-4'>
                  <section className={`p-4 ${tintedSurface} ${activeExperienceLens.surfaceClass}`}>
                    <div className='flex flex-wrap items-start justify-between gap-3'>
                      <div className='min-w-0 flex-1'>
                        <p className={labelMuted}>{txSafe('activeLensLabel', 'ما الذي يحتاج قرارًا الآن')}</p>
                        <h3 className='text-xl font-black text-slate-900'>
                          {activeExperienceLens.title}
                        </h3>
                        <p className='mt-2 text-sm leading-7 text-slate-700'>
                          {activeExperienceLens.body}
                        </p>
                      </div>

                      <div className='flex flex-wrap gap-2'>
                        {firstScreenMetrics.slice(0, 2).map(metric => (
                          <div
                            key={metric.id}
                            className='rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm'
                          >
                            <p className='text-[11px] font-bold text-slate-500'>
                              {metric.label}
                            </p>
                            <p className='mt-1 text-lg font-black text-slate-900'>
                              {metric.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {activeWorkspacePanel === 'coverage' ? (
                    <section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                      <div className={`p-4 ${shellSurface}`}>
                        <div className='grid gap-4 lg:grid-cols-2'>
                          <div className={compactCard}>
                            <p className={labelMuted}>{txSafe('regionsFieldLabel', 'المناطق')}</p>
                            <div className='mt-2 flex gap-2'>
                              <input
                                className='w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                                value={regionsSelect}
                                onChange={e => setRegionsSelect(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addRegionToken(regionsSelect);
                                    setRegionsSelect('');
                                  }
                                }}
                                disabled={loading}
                                placeholder={txSafe('regionPlaceholder', 'أضف منطقة ثم اضغط Enter')}
                                aria-label={txSafe('regionsFieldLabel', 'المناطق')}
                              />
                              <button
                                type='button'
                                onClick={() => {
                                  addRegionToken(regionsSelect);
                                  setRegionsSelect('');
                                }}
                                disabled={loading || !regionsSelect.trim()}
                                className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60'
                              >
                                {txSafe('add', 'إضافة')}
                              </button>
                            </div>
                            <div className='mt-3 flex flex-wrap gap-2'>
                              {regionsTokens.length > 0 ? (
                                regionsTokens.map(token => (
                                  <button
                                    key={token}
                                    type='button'
                                    onClick={() => removeRegion(token)}
                                    className={chip}
                                  >
                                    {token}
                                    <span aria-hidden>×</span>
                                  </button>
                                ))
                              ) : (
                                <p className='text-sm text-gray-500'>
                                  {txSafe('regionsEmptyState', 'لا توجد مناطق معرفة بعد.')}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className={compactCard}>
                            <p className={labelMuted}>{txSafe('citiesFieldLabel', 'المدن')}</p>
                            <div className='mt-2 flex gap-2'>
                              <input
                                className='w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                                value={citiesSelect}
                                onChange={e => setCitiesSelect(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addCityToken(citiesSelect);
                                    setCitiesSelect('');
                                  }
                                }}
                                disabled={loading}
                                placeholder={txSafe('cityPlaceholder', 'أضف مدينة ثم اضغط Enter')}
                                aria-label={txSafe('citiesFieldLabel', 'المدن')}
                              />
                              <button
                                type='button'
                                onClick={() => {
                                  addCityToken(citiesSelect);
                                  setCitiesSelect('');
                                }}
                                disabled={loading || !citiesSelect.trim()}
                                className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60'
                              >
                                {txSafe('add', 'إضافة')}
                              </button>
                            </div>
                            <div className='mt-3 flex flex-wrap gap-2'>
                              {citiesTokens.length > 0 ? (
                                citiesTokens.map(token => (
                                  <button
                                    key={token}
                                    type='button'
                                    onClick={() => removeCity(token)}
                                    className={chip}
                                  >
                                    {token}
                                    <span aria-hidden>×</span>
                                  </button>
                                ))
                              ) : (
                                <p className='text-sm text-gray-500'>
                                  {txSafe('citiesEmptyState', 'لا توجد مدن معرفة بعد.')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className='mt-4 flex flex-wrap items-center justify-between gap-2'>
                          <p className='text-xs leading-6 text-slate-500'>
                            {txSafe('coverageInlineHint', 'أدخل منطقة أو مدينة واحدة على الأقل حتى يصبح مسار ESF قابلاً للتصديق داخل تجربة العميل.')}
                          </p>
                          <button
                            type='button'
                            onClick={applyCoverageSmartDefaults}
                            disabled={loading}
                            className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:opacity-60'
                          >
                            <SlidersHorizontal className='h-4 w-4' aria-hidden />
                            {txSafe('applyCoverageDefaults', 'تعبئة ذكية أولية')}
                          </button>
                        </div>
                      </div>

                      <aside className={`p-4 ${warmTintSurface}`}>
                        <p className={labelMuted}>{txSafe('coveragePreviewTitle', 'لقطة النطاق')}</p>
                        <div className='space-y-2'>
                          {activeExperienceLens.highlights.map((highlight, index) => (
                            <div key={`coverage-highlight-${index}`} className='rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-7 text-slate-700'>
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </aside>
                    </section>
                  ) : null}

                  {activeWorkspacePanel === 'acceptNew' ? (
                    <section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                      <div className={`p-4 ${shellSurface}`}>
                        <label className='flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-[#fcfcfd] px-4 py-4 transition hover:bg-gray-50'>
                          <div className='min-w-0'>
                            <p className='text-base font-black text-gray-900'>
                              {txSafe('cfgAcceptNew', 'استقبال طلبات جديدة')}
                            </p>
                            <p className='mt-1 text-sm leading-7 text-gray-600'>
                              {txSafe('acceptNewHint', 'افصل بين فتح الخدمة وفتح الطلبات الجديدة حتى يبقى القرار الإداري واضحًا.')}
                            </p>
                          </div>
                          <input
                            type='checkbox'
                            className='h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500'
                            checked={draftAcceptNew}
                            onChange={e => setDraftAcceptNew(e.target.checked)}
                            disabled={loading}
                            aria-label={txSafe('cfgAcceptNew', 'استقبال طلبات جديدة')}
                          />
                        </label>

                        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                          <div className='rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-4'>
                            <p className={labelMuted}>{txSafe('acceptNewEffectTitle', 'عند الفتح')}</p>
                            <p className='text-sm leading-7 text-slate-700'>
                              {txSafe('acceptNewEffectOn', 'يسمح بإنشاء طلبات جديدة ويزيد الحمل المباشر على التغطية والرسالة والجاهزية.')}
                            </p>
                          </div>
                          <div className='rounded-2xl border border-[#ffedd5] bg-[#fff7ed] p-4'>
                            <p className={labelMuted}>{txSafe('acceptNewPauseTitle', 'عند الإيقاف')}</p>
                            <p className='text-sm leading-7 text-slate-700'>
                              {txSafe('acceptNewEffectOff', 'يوقف الطلبات الجديدة فقط مع إبقاء الخدمة نفسها تحت السيطرة.')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <aside className={`p-4 ${infoTintSurface}`}>
                        <p className={labelMuted}>{txSafe('acceptNewPreviewTitle', 'الأثر على المسار')}</p>
                        <div className='rounded-2xl border border-white bg-white px-4 py-3'>
                          <p className='text-base font-black text-slate-900'>{acceptNewSummary}</p>
                          <p className='mt-2 text-sm leading-7 text-slate-700'>
                            {draftAcceptNew
                              ? txSafe('acceptNewPreviewOn', 'العميل يستطيع بدء طلب جديد الآن، لذلك لا بد أن تكون التغطية والرسالة واضحة ومقنعة.')
                              : txSafe('acceptNewPreviewOff', 'العميل لن يبدأ طلبًا جديدًا الآن، وهذه وضعية حماية مناسبة عند الضغط أو إعادة الضبط.')}
                          </p>
                        </div>
                      </aside>
                    </section>
                  ) : null}

                  {activeWorkspacePanel === 'banner' ? (
                    <section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                      <div className={`p-4 ${shellSurface}`}>
                        <div className='grid gap-4'>
                          <div className={compactCard}>
                            <p className={labelMuted}>{txSafe('cfgBanner', 'الرسالة داخل التطبيق')}</p>
                            <textarea
                              className='mt-2 min-h-24 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                              value={draftBanner}
                              onChange={e => setDraftBanner(e.target.value)}
                              disabled={loading}
                              placeholder={txSafe('cfgBannerPlaceholder', 'رسالة قصيرة تشرح وضع الخدمة للعميل بوضوح.')}
                              maxLength={140}
                              aria-label={txSafe('cfgBanner', 'الرسالة داخل التطبيق')}
                            />
                            <p className='mt-2 text-xs text-gray-500'>
                              {txSafe('bannerHint', 'الأحرف: {{count}} / 140').replace('{{count}}', String(draftBanner.trim().length))}
                            </p>
                          </div>

                          <div className='grid gap-4 lg:grid-cols-2'>
                            <div className={compactCard}>
                              <p className={labelMuted}>{txSafe('eligibilitySheetTitleLabel', 'عنوان ورقة الأهلية')}</p>
                              <input
                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                                value={draftEligibilityCopy.title}
                                onChange={e => updateEligibilityCopyField('title', e.target.value)}
                                disabled={loading}
                                placeholder={DEFAULT_ELIGIBILITY_COPY.title}
                                aria-label={txSafe('eligibilitySheetTitleLabel', 'عنوان ورقة الأهلية')}
                              />
                              <p className={`mt-4 ${labelMuted}`}>{txSafe('eligibilitySheetSubtitleLabel', 'النص التوضيحي')}</p>
                              <textarea
                                className='mt-2 min-h-20 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                                value={draftEligibilityCopy.subtitle}
                                onChange={e => updateEligibilityCopyField('subtitle', e.target.value)}
                                disabled={loading}
                                placeholder={DEFAULT_ELIGIBILITY_COPY.subtitle}
                                aria-label={txSafe('eligibilitySheetSubtitleLabel', 'النص التوضيحي')}
                              />
                            </div>

                            <div className={compactCard}>
                              <p className={labelMuted}>{txSafe('eligibilityConfirmLabel', 'زر التأكيد')}</p>
                              <input
                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                                value={draftEligibilityCopy.confirmLabel}
                                onChange={e => updateEligibilityCopyField('confirmLabel', e.target.value)}
                                disabled={loading}
                                placeholder={DEFAULT_ELIGIBILITY_COPY.confirmLabel}
                                aria-label={txSafe('eligibilityConfirmLabel', 'زر التأكيد')}
                              />
                              <p className={`mt-4 ${labelMuted}`}>{txSafe('eligibilityCancelLabel', 'زر الإرجاع')}</p>
                              <input
                                className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                                value={draftEligibilityCopy.cancelLabel}
                                onChange={e => updateEligibilityCopyField('cancelLabel', e.target.value)}
                                disabled={loading}
                                placeholder={DEFAULT_ELIGIBILITY_COPY.cancelLabel}
                                aria-label={txSafe('eligibilityCancelLabel', 'زر الإرجاع')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <aside className={`p-4 ${infoTintSurface}`}>
                        <p className={labelMuted}>{txSafe('bannerPreviewTitle', 'المعاينة الحية')}</p>
                        <div className='rounded-2xl border border-white bg-white p-4 shadow-sm'>
                          <p className='text-xs font-bold text-orange-700'>
                            {txSafe('bannerPreviewLabel', 'رسالة ميدانية')}
                          </p>
                          <p className='mt-3 text-sm leading-7 text-gray-800'>
                            {draftBanner.trim() || txSafe('bannerPreviewEmpty', 'لا توجد رسالة حالية، وهذا يحمّل العميل عبء التفسير وحده.')}
                          </p>
                        </div>
                        <div className='mt-3 rounded-2xl border border-white bg-white p-4 shadow-sm'>
                          <p className='text-xs font-bold text-blue-700'>
                            {txSafe('eligibilityPreviewLabel', 'ورقة أهلية المتبرع')}
                          </p>
                          <h4 className='mt-2 text-base font-black text-gray-900'>
                            {resolvedEligibilityCopy.title}
                          </h4>
                          <p className='mt-2 text-sm leading-7 text-gray-700'>
                            {resolvedEligibilityCopy.subtitle}
                          </p>
                        </div>
                      </aside>
                    </section>
                  ) : null}

                  {activeWorkspacePanel === 'eligibility' ? (
                    <section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                      <div className={`p-4 ${shellSurface}`}>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                          <p className='text-sm font-semibold text-gray-900'>
                            {txSafe('eligibilityHint', 'اكتب كل شرط في سطر مستقل. هذه الشروط تظهر في انبثاق الجاهزية داخل تطبيق العميل.')}
                          </p>
                          <button
                            type='button'
                            onClick={applyEligibilityDefaults}
                            disabled={loading}
                            className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:opacity-60'
                          >
                            <SlidersHorizontal className='h-4 w-4' aria-hidden />
                            {txSafe('restoreEligibilityDefaults', 'إرجاع الافتراضي')}
                          </button>
                        </div>

                        <div className='mt-4 grid gap-2 sm:grid-cols-2'>
                          {ELIGIBILITY_TEMPLATE_LIBRARY.slice(0, 4).map(template => (
                            <button
                              key={template.id}
                              type='button'
                              onClick={() => applyEligibilityTemplate(template.id)}
                              disabled={loading}
                              className='rounded-xl border border-amber-200 bg-white px-4 py-3 text-start shadow-sm transition hover:bg-amber-50 disabled:opacity-60'
                            >
                              <p className='text-sm font-black text-gray-900'>
                                {template.title}
                              </p>
                              <p className='mt-1 text-xs leading-6 text-gray-600'>
                                {template.detail}
                              </p>
                            </button>
                          ))}
                        </div>

                        <div className='mt-4'>
                          <p className={labelMuted}>{txSafe('eligibilityTextareaLabel', 'قائمة الشروط')}</p>
                          <textarea
                            className='mt-2 min-h-44 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                            value={draftEligibilityRules}
                            onChange={e => setDraftEligibilityRules(e.target.value)}
                            disabled={loading}
                            placeholder={txSafe('eligibilityTextareaPlaceholder', 'كل سطر يمثل شرطًا مستقلًا يظهر قبل تفعيل جاهزية التبرع.')}
                            aria-label={txSafe('eligibilityTextareaLabel', 'قائمة الشروط')}
                          />
                        </div>
                      </div>

                      <aside className={`p-4 ${tintedSurface}`}>
                        <p className={labelMuted}>{txSafe('eligibilityPreviewTitle', 'المعاينة الحية')}</p>
                        <div className='space-y-2'>
                          {eligibilityPreviewItems.slice(0, 4).map((item, index) => (
                            <div
                              key={`${item}-${index}`}
                              className='flex items-start gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-sm'
                            >
                              <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-700'>
                                {index + 1}
                              </span>
                              <p className='text-sm leading-7 text-gray-700'>
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </aside>
                    </section>
                  ) : null}
                </div>

                <aside className='grid min-h-0 gap-4'>
                  <section className={`p-4 ${shellSurface}`}>
                    <p className={labelMuted}>{txSafe('activeLensHighlights', 'أثر القرار المختار')}</p>
                    <div className='mt-3 space-y-2'>
                      {activeExperienceLens.highlights.map((highlight, index) => (
                        <div
                          key={`${activeWorkspacePanel}-${index}`}
                          className='flex items-start gap-3 rounded-2xl border border-[#edf2f7] bg-[#f8fafc] px-4 py-3'
                        >
                          <span className='mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ee8348]' />
                          <p className='text-sm leading-7 text-slate-700'>
                            {highlight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className={`p-4 ${tintedSurface}`}>
                    <p className={labelMuted}>{txSafe('stabilityLabel', 'ثبات القرار')}</p>
                    <div className='mt-3 grid gap-2'>
                      <div className='rounded-2xl border border-white bg-white px-4 py-3'>
                        <p className='text-[11px] font-bold text-[#8b6b55]'>
                          {txSafe('headerControlScore', 'تماسك غرفة التشغيل')}
                        </p>
                        <p className='mt-1 text-sm font-black text-slate-900'>
                          {operatingModel.controlScore}%
                        </p>
                      </div>
                      <div className='rounded-2xl border border-white bg-white px-4 py-3'>
                        <p className='text-[11px] font-bold text-[#8b6b55]'>
                          {txSafe('headerLastUpdated', 'آخر تحديث')}
                        </p>
                        <p className='mt-1 text-sm font-black text-slate-900'>
                          {lastUpdatedLabel}
                        </p>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </section>
          </div>
        </section>

        {expandedPanel && activePanelConfig ? (
          <div className='fixed inset-0 z-40 flex items-start justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]'>
            <section className='mt-2 flex h-[min(860px,calc(100dvh-2rem))] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl'>
              <div className='shrink-0 border-b border-stone-200 px-5 py-5 sm:px-6'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='min-w-0'>
                    <p className={labelMuted}>
                      {txSafe('activeEditorLabel', 'المحرر النشط')}
                    </p>
                    <h3 className='text-xl font-black text-gray-900'>
                      {activePanelConfig.title}
                    </h3>
                    <p className='mt-2 max-w-3xl text-sm leading-7 text-gray-600'>
                      {activePanelConfig.description}
                    </p>
                  </div>

                  <div className='flex shrink-0 flex-wrap gap-2'>
                    <button
                      type='button'
                      onClick={() => setExpandedPanel(null)}
                      className='inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50'
                    >
                      {txSafe('closeEditor', 'إغلاق المحرر')}
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        trackMcpwTelemetry('esf.inline_save_click', {
                          task_id: 'esf_inline_save',
                          click_target: 'inline_save',
                          panel: expandedPanel,
                        });
                        void handleSave(activePanelConfig.saveTaskId);
                      }}
                      disabled={loading || saving || !dirty}
                      className='inline-flex items-center justify-center rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                      {saving
                        ? txSafe('saving', 'جارٍ الحفظ…')
                        : txSafe('save', 'حفظ')}
                    </button>
                  </div>
                </div>
              </div>

              <div className='min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6'>
                {expandedPanel === 'coverage' ? (
                  <div className='mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2'>
                    <div className='space-y-4'>
                      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        <div className={compactCard}>
                          <p className={labelMuted}>
                            {txSafe('regionsFieldLabel', 'المناطق')}
                          </p>
                          <div className='mt-2 flex gap-2'>
                            <input
                              className='w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                              value={regionsSelect}
                              onChange={e => setRegionsSelect(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addRegionToken(regionsSelect);
                                  setRegionsSelect('');
                                }
                              }}
                              disabled={loading}
                              placeholder={txSafe(
                                'regionPlaceholder',
                                'أضف منطقة ثم اضغط Enter'
                              )}
                              aria-label={txSafe(
                                'regionsFieldLabel',
                                'المناطق'
                              )}
                            />
                            <button
                              type='button'
                              onClick={() => {
                                addRegionToken(regionsSelect);
                                setRegionsSelect('');
                              }}
                              disabled={loading || !regionsSelect.trim()}
                              className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60'
                            >
                              {txSafe('add', 'إضافة')}
                            </button>
                          </div>
                          <div className='mt-3 flex flex-wrap gap-2'>
                            {regionsTokens.length > 0 ? (
                              regionsTokens.map(token => (
                                <button
                                  key={token}
                                  type='button'
                                  onClick={() => removeRegion(token)}
                                  className={chip}
                                >
                                  {token}
                                  <span aria-hidden>×</span>
                                </button>
                              ))
                            ) : (
                              <p className='text-sm text-gray-500'>
                                {txSafe(
                                  'regionsEmptyState',
                                  'لا توجد مناطق معرفة بعد.'
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className={compactCard}>
                          <p className={labelMuted}>
                            {txSafe('citiesFieldLabel', 'المدن')}
                          </p>
                          <div className='mt-2 flex gap-2'>
                            <input
                              className='w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                              value={citiesSelect}
                              onChange={e => setCitiesSelect(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addCityToken(citiesSelect);
                                  setCitiesSelect('');
                                }
                              }}
                              disabled={loading}
                              placeholder={txSafe(
                                'cityPlaceholder',
                                'أضف مدينة ثم اضغط Enter'
                              )}
                              aria-label={txSafe('citiesFieldLabel', 'المدن')}
                            />
                            <button
                              type='button'
                              onClick={() => {
                                addCityToken(citiesSelect);
                                setCitiesSelect('');
                              }}
                              disabled={loading || !citiesSelect.trim()}
                              className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60'
                            >
                              {txSafe('add', 'إضافة')}
                            </button>
                          </div>
                          <div className='mt-3 flex flex-wrap gap-2'>
                            {citiesTokens.length > 0 ? (
                              citiesTokens.map(token => (
                                <button
                                  key={token}
                                  type='button'
                                  onClick={() => removeCity(token)}
                                  className={chip}
                                >
                                  {token}
                                  <span aria-hidden>×</span>
                                </button>
                              ))
                            ) : (
                              <p className='text-sm text-gray-500'>
                                {txSafe(
                                  'citiesEmptyState',
                                  'لا توجد مدن معرفة بعد.'
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-wrap items-center justify-between gap-2'>
                        <p className='text-xs text-gray-500'>
                          {txSafe(
                            'coverageInlineHint',
                            'كل عنصر تضيفه هنا يوسع أين يمكن أن تبدو الخدمة قابلة للاستخدام داخل التطبيق.'
                          )}
                        </p>
                        <button
                          type='button'
                          onClick={applyCoverageSmartDefaults}
                          disabled={loading}
                          className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:opacity-60'
                        >
                          <SlidersHorizontal className='h-4 w-4' aria-hidden />
                          {txSafe('applyCoverageDefaults', 'تعبئة ذكية أولية')}
                        </button>
                      </div>
                    </div>

                    <aside className='rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm'>
                      <p className={labelMuted}>
                        {txSafe('coveragePreviewTitle', 'أثر هذا الضبط')}
                      </p>
                      <p className='text-sm leading-7 text-gray-700'>
                        {txSafe(
                          'coveragePreviewCopy',
                          'حين تكون التغطية فارغة، يبدو المسار حيًا لكنه بلا نطاق حقيقي. هذه أول فجوة يجب إغلاقها.'
                        )}
                      </p>
                      <div className='mt-4 space-y-2'>
                        <div className='rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm'>
                          {txSafe('coverageSummaryLabel', 'ملخص التغطية')} :{' '}
                          {coverageSummary}
                        </div>
                        <div className='rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm'>
                          {txSafe('coverageRegionsList', 'المناطق')} :{' '}
                          {regionsTokens.join('، ') || '—'}
                        </div>
                        <div className='rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm'>
                          {txSafe('coverageCitiesList', 'المدن')} :{' '}
                          {citiesTokens.join('، ') || '—'}
                        </div>
                      </div>
                    </aside>
                  </div>
                ) : null}

                {expandedPanel === 'banner' ? (
                  <div className='mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2'>
                    <div className='space-y-4'>
                      <div className={compactCard}>
                        <p className={labelMuted}>
                          {txSafe('cfgBanner', 'الرسالة داخل التطبيق')}
                        </p>
                        <textarea
                          className='mt-2 min-h-28 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                          value={draftBanner}
                          onChange={e => setDraftBanner(e.target.value)}
                          disabled={loading}
                          placeholder={txSafe(
                            'cfgBannerPlaceholder',
                            'رسالة قصيرة اختيارية تظهر في تطبيق المستخدم'
                          )}
                          maxLength={140}
                          aria-label={txSafe(
                            'cfgBanner',
                            'الرسالة داخل التطبيق'
                          )}
                        />
                        <p className='mt-2 text-xs text-gray-500'>
                          {txSafe(
                            'bannerHint',
                            'الأحرف: {{count}} / 140'
                          ).replace(
                            '{{count}}',
                            String(draftBanner.trim().length)
                          )}
                        </p>
                      </div>

                      <div className={compactCard}>
                        <p className={labelMuted}>
                          {txSafe(
                            'eligibilitySheetTitleLabel',
                            'عنوان ورقة الأهلية'
                          )}
                        </p>
                        <input
                          className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                          value={draftEligibilityCopy.title}
                          onChange={e =>
                            updateEligibilityCopyField('title', e.target.value)
                          }
                          disabled={loading}
                          placeholder={DEFAULT_ELIGIBILITY_COPY.title}
                          aria-label={txSafe(
                            'eligibilitySheetTitleLabel',
                            'عنوان ورقة الأهلية'
                          )}
                        />

                        <p className={`mt-4 ${labelMuted}`}>
                          {txSafe(
                            'eligibilitySheetSubtitleLabel',
                            'النص التوضيحي'
                          )}
                        </p>
                        <textarea
                          className='mt-2 min-h-24 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                          value={draftEligibilityCopy.subtitle}
                          onChange={e =>
                            updateEligibilityCopyField(
                              'subtitle',
                              e.target.value
                            )
                          }
                          disabled={loading}
                          placeholder={DEFAULT_ELIGIBILITY_COPY.subtitle}
                          aria-label={txSafe(
                            'eligibilitySheetSubtitleLabel',
                            'النص التوضيحي'
                          )}
                        />
                      </div>

                      <div className={compactCard}>
                        <p className={labelMuted}>
                          {txSafe(
                            'eligibilitySheetNoteLabel',
                            'الملاحظة المرجعية'
                          )}
                        </p>
                        <textarea
                          className='mt-2 min-h-24 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                          value={draftEligibilityCopy.note}
                          onChange={e =>
                            updateEligibilityCopyField('note', e.target.value)
                          }
                          disabled={loading}
                          placeholder={DEFAULT_ELIGIBILITY_COPY.note}
                          aria-label={txSafe(
                            'eligibilitySheetNoteLabel',
                            'الملاحظة المرجعية'
                          )}
                        />

                        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                          <div>
                            <p className={labelMuted}>
                              {txSafe('eligibilityCancelLabel', 'زر الإرجاع')}
                            </p>
                            <input
                              className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                              value={draftEligibilityCopy.cancelLabel}
                              onChange={e =>
                                updateEligibilityCopyField(
                                  'cancelLabel',
                                  e.target.value
                                )
                              }
                              disabled={loading}
                              placeholder={DEFAULT_ELIGIBILITY_COPY.cancelLabel}
                              aria-label={txSafe(
                                'eligibilityCancelLabel',
                                'زر الإرجاع'
                              )}
                            />
                          </div>

                          <div>
                            <p className={labelMuted}>
                              {txSafe('eligibilityConfirmLabel', 'زر التأكيد')}
                            </p>
                            <input
                              className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                              value={draftEligibilityCopy.confirmLabel}
                              onChange={e =>
                                updateEligibilityCopyField(
                                  'confirmLabel',
                                  e.target.value
                                )
                              }
                              disabled={loading}
                              placeholder={
                                DEFAULT_ELIGIBILITY_COPY.confirmLabel
                              }
                              aria-label={txSafe(
                                'eligibilityConfirmLabel',
                                'زر التأكيد'
                              )}
                            />
                          </div>
                        </div>

                        <div className='mt-4'>
                          <p className={labelMuted}>
                            {txSafe(
                              'eligibilityActivatingLabel',
                              'نص جارٍ التفعيل'
                            )}
                          </p>
                          <input
                            className='mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                            value={draftEligibilityCopy.activatingLabel}
                            onChange={e =>
                              updateEligibilityCopyField(
                                'activatingLabel',
                                e.target.value
                              )
                            }
                            disabled={loading}
                            placeholder={
                              DEFAULT_ELIGIBILITY_COPY.activatingLabel
                            }
                            aria-label={txSafe(
                              'eligibilityActivatingLabel',
                              'نص جارٍ التفعيل'
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <aside className='rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm'>
                      <p className={labelMuted}>
                        {txSafe('bannerPreviewTitle', 'معاينة العميل')}
                      </p>

                      <div className='mt-3 rounded-2xl border border-white bg-white p-4 shadow-sm'>
                        <p className='text-xs font-bold text-orange-700'>
                          {txSafe('bannerPreviewLabel', 'رسالة ميدانية')}
                        </p>
                        <p className='mt-3 text-sm leading-7 text-gray-800'>
                          {draftBanner.trim() ||
                            txSafe(
                              'bannerPreviewEmpty',
                              'لا توجد رسالة حالية، وهذا يعني أن المستخدم لا يحصل على شرح مباشر للضغط أو النطاق.'
                            )}
                        </p>
                      </div>

                      <div className='mt-4 rounded-2xl border border-white bg-white p-4 shadow-sm'>
                        <p className='text-xs font-bold text-blue-700'>
                          {txSafe(
                            'eligibilityPreviewLabel',
                            'ورقة أهلية المتبرع'
                          )}
                        </p>
                        <h4 className='mt-2 text-lg font-black text-gray-900'>
                          {resolvedEligibilityCopy.title}
                        </h4>
                        <p className='mt-2 text-sm leading-7 text-gray-700'>
                          {resolvedEligibilityCopy.subtitle}
                        </p>

                        <div className='mt-4 space-y-2'>
                          {mainEligibilityPreviewItems
                            .slice(0, 2)
                            .map((item, index) => (
                              <div
                                key={`banner-preview-${item}-${index}`}
                                className='flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3'
                              >
                                <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-black text-orange-700'>
                                  {index + 1}
                                </span>
                                <p className='text-sm leading-6 text-gray-700'>
                                  {item}
                                </p>
                              </div>
                            ))}
                        </div>

                        <div className='mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-7 text-gray-700'>
                          {resolvedEligibilityCopy.note}
                        </div>

                        <div className='mt-4 flex flex-wrap gap-2'>
                          <span className='inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700'>
                            {resolvedEligibilityCopy.cancelLabel}
                          </span>
                          <span className='inline-flex items-center rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800'>
                            {resolvedEligibilityCopy.confirmLabel}
                          </span>
                          <span className='inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800'>
                            {resolvedEligibilityCopy.activatingLabel}
                          </span>
                        </div>
                      </div>
                    </aside>
                  </div>
                ) : null}

                {expandedPanel === 'acceptNew' ? (
                  <div className='mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2'>
                    <div className='space-y-3'>
                      <label className='flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:bg-gray-50'>
                        <div className='min-w-0'>
                          <p className='text-sm font-black text-gray-900'>
                            {txSafe('cfgAcceptNew', 'استقبال طلبات جديدة')}
                          </p>
                          <p className='mt-1 text-sm leading-7 text-gray-600'>
                            {txSafe(
                              'acceptNewHint',
                              'يمكن إيقاف استقبال الطلبات مع إبقاء الخدمة مفعلة.'
                            )}
                          </p>
                        </div>
                        <input
                          type='checkbox'
                          className='h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500'
                          checked={draftAcceptNew}
                          onChange={e => setDraftAcceptNew(e.target.checked)}
                          disabled={loading}
                          aria-label={txSafe(
                            'cfgAcceptNew',
                            'استقبال طلبات جديدة'
                          )}
                        />
                      </label>

                      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        <div className='rounded-2xl border border-white bg-slate-50 p-4 shadow-sm'>
                          <p className={labelMuted}>
                            {txSafe('acceptNewEffectTitle', 'عند الفتح')}
                          </p>
                          <p className='text-sm leading-7 text-gray-700'>
                            {txSafe(
                              'acceptNewEffectOn',
                              'يسمح بإنشاء طلبات جديدة ويزيد الحمل المباشر على التغطية والجاهزية.'
                            )}
                          </p>
                        </div>
                        <div className='rounded-2xl border border-white bg-slate-50 p-4 shadow-sm'>
                          <p className={labelMuted}>
                            {txSafe('acceptNewPauseTitle', 'عند الإيقاف')}
                          </p>
                          <p className='text-sm leading-7 text-gray-700'>
                            {txSafe(
                              'acceptNewEffectOff',
                              'يوقف الطلبات الجديدة فقط، لكنه لا يعني إلغاء كل ما هو قائم داخل الخدمة.'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <aside className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm'>
                      <p className={labelMuted}>
                        {txSafe('acceptNewPreviewTitle', 'الوضع الحالي')}
                      </p>
                      <div className='mt-3 rounded-2xl border border-white bg-white p-4 shadow-sm'>
                        <p className='text-sm font-black text-gray-900'>
                          {acceptNewSummary}
                        </p>
                        <p className='mt-2 text-sm leading-7 text-gray-700'>
                          {draftAcceptNew
                            ? txSafe(
                                'acceptNewPreviewOn',
                                'العميل يستطيع بدء طلب جديد الآن، لذلك يجب أن تبقى التغطية والرسالة في مستوى واضح ومقنع.'
                              )
                            : txSafe(
                                'acceptNewPreviewOff',
                                'العميل لن يبدأ طلبًا جديدًا الآن، لذلك هذه الحالة مفيدة عند الضغط أو أثناء إعادة ضبط التغطية.'
                              )}
                        </p>
                      </div>
                    </aside>
                  </div>
                ) : null}

                {expandedPanel === 'eligibility' ? (
                  <div className='mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2'>
                    <div className='space-y-3'>
                      <div className='flex flex-wrap items-center justify-between gap-2'>
                        <p className='text-sm font-semibold text-gray-900'>
                          {txSafe(
                            'eligibilityHint',
                            'اكتب كل شرط في سطر مستقل. هذه الشروط تظهر في انبثاق الجاهزية داخل تطبيق العميل.'
                          )}
                        </p>
                        <button
                          type='button'
                          onClick={applyEligibilityDefaults}
                          disabled={loading}
                          className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:opacity-60'
                        >
                          <SlidersHorizontal className='h-4 w-4' aria-hidden />
                          {txSafe(
                            'restoreEligibilityDefaults',
                            'إرجاع الافتراضي'
                          )}
                        </button>
                      </div>

                      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                        {ELIGIBILITY_TEMPLATE_LIBRARY.map(template => (
                          <button
                            key={template.id}
                            type='button'
                            onClick={() =>
                              applyEligibilityTemplate(template.id)
                            }
                            disabled={loading}
                            className='rounded-xl border border-amber-200 bg-white px-4 py-3 text-start shadow-sm transition hover:bg-amber-50 disabled:opacity-60'
                          >
                            <p className='text-sm font-black text-gray-900'>
                              {template.title}
                            </p>
                            <p className='mt-1 text-xs leading-6 text-gray-600'>
                              {template.detail}
                            </p>
                          </button>
                        ))}
                      </div>

                      <div className={compactCard}>
                        <p className={labelMuted}>
                          {txSafe('eligibilityTextareaLabel', 'قائمة الشروط')}
                        </p>
                        <textarea
                          className='mt-2 min-h-48 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
                          value={draftEligibilityRules}
                          onChange={e =>
                            setDraftEligibilityRules(e.target.value)
                          }
                          disabled={loading}
                          placeholder={txSafe(
                            'eligibilityTextareaPlaceholder',
                            'كل سطر يمثل شرطًا مستقلًا يظهر قبل تفعيل جاهزية التبرع.'
                          )}
                          aria-label={txSafe(
                            'eligibilityTextareaLabel',
                            'قائمة الشروط'
                          )}
                        />
                        <p className='mt-2 text-xs text-gray-500'>
                          {txSafe(
                            'eligibilityTextareaFootnote',
                            'إذا تركت الحقل فارغًا سيعود التطبيق إلى الشروط الافتراضية الآمنة.'
                          )}
                        </p>
                      </div>
                    </div>

                    <aside className='rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm'>
                      <p className={labelMuted}>
                        {txSafe(
                          'eligibilityPreviewTitle',
                          'معاينة ورقة المتبرع'
                        )}
                      </p>
                      <p className='text-sm font-black text-gray-900'>
                        {resolvedEligibilityCopy.title}
                      </p>
                      <p className='mt-2 text-sm leading-7 text-gray-700'>
                        {resolvedEligibilityCopy.subtitle}
                      </p>
                      <div className='mt-3 space-y-2'>
                        {eligibilityPreviewItems.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className='flex items-start gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-sm'
                          >
                            <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-700'>
                              {index + 1}
                            </span>
                            <p className='text-sm leading-7 text-gray-700'>
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className='mt-4 rounded-xl border border-white bg-white px-4 py-3 text-sm leading-7 text-gray-700 shadow-sm'>
                        {resolvedEligibilityCopy.note}
                      </div>
                    </aside>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}

        {showGovernanceDeck ? (
          <div className='fixed inset-0 z-30 flex items-start justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]'>
            <section className='mt-8 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl'>
              <div className='flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-5 sm:px-6'>
                <div className='min-w-0'>
                  <p className={labelMuted}>
                    {txSafe('governanceDeckTitle', 'عقد التشغيل ومراسي المنطق')}
                  </p>
                  <p className='text-xl font-black text-gray-900'>
                    {txSafe(
                      'governanceDeckSubtitle',
                      'مرجع الحماية المنطقية لهذه الصفحة عند الحاجة فقط.'
                    )}
                  </p>
                </div>

                <button
                  type='button'
                  onClick={() => setShowGovernanceDeck(false)}
                  className='inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50'
                >
                  {txSafe('closeGovernanceDeck', 'إغلاق')}
                </button>
              </div>

              <div className='max-h-[calc(100dvh-10rem)] overflow-y-auto px-5 py-5 sm:px-6'>
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                  <section className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700'>
                        <CheckCircle2 className='h-5 w-5' aria-hidden />
                      </div>
                      <div>
                        <p className={labelMuted}>
                          {txSafe('contractTitle', 'عقد التشغيل')}
                        </p>
                        <p className='text-lg font-black text-gray-900'>
                          {txSafe(
                            'contractSubtitle',
                            'ثلاث حقائق يجب أن تبقى واضحة في CONTROL PANEL مهما تغيرت الواجهة.'
                          )}
                        </p>
                      </div>
                    </div>

                    <ul className='mt-4 space-y-3 text-sm leading-7 text-gray-700'>
                      <li className='flex gap-3'>
                        <span className='mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500' />
                        <span>
                          {txSafe(
                            'contractPoint1',
                            'CONTROL PANEL لا يجمّل الخدمة فقط؛ بل يضبط أين يمكن استخدامها، وكيف تُشرح للمستخدم، ومتى يسمح النظام بإنشاء طلب جديد.'
                          )}
                        </span>
                      </li>
                      <li className='flex gap-3'>
                        <span className='mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500' />
                        <span>
                          {txSafe(
                            'contractPoint2',
                            'منطق التطبيق الحقيقي يمر عبر: طالب دم، متبرع، مطابقة فعلية، ثم استجابة. لذلك قرارات التغطية والأهلية هنا مؤثرة مباشرة على المخرجات.'
                          )}
                        </span>
                      </li>
                      <li className='flex gap-3'>
                        <span className='mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500' />
                        <span>
                          {txSafe(
                            'contractPoint3',
                            'الهدف من هذه الصفحة هو قرار تشغيلي سريع، لا التنقل بين حقول رمادية بلا معنى تشغيلي.'
                          )}
                        </span>
                      </li>
                    </ul>
                  </section>

                  <section className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700'>
                        <AlertTriangle className='h-5 w-5' aria-hidden />
                      </div>
                      <div>
                        <p className={labelMuted}>
                          {txSafe('watchoutsTitle', 'مراسي المنطق')}
                        </p>
                        <p className='text-lg font-black text-gray-900'>
                          {txSafe(
                            'watchoutsSubtitle',
                            'ما يجب أن يظل محميًا عند أي تطوير لاحق لهذه الصفحة.'
                          )}
                        </p>
                      </div>
                    </div>

                    <ul className='mt-4 space-y-3 text-sm leading-7 text-gray-700'>
                      <li className='flex gap-3'>
                        <span className='mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500' />
                        <span>
                          {txSafe(
                            'watchoutsPoint1',
                            'قبول التبرع في التطبيق لا يجوز أن يُفهم إداريًا على أنه متاح دائمًا؛ ظهوره مرتبط بوجود matchId فعلي.'
                          )}
                        </span>
                      </li>
                      <li className='flex gap-3'>
                        <span className='mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500' />
                        <span>
                          {txSafe(
                            'watchoutsPoint2',
                            'إيقاف استقبال الطلبات الجديدة لا يعني بالضرورة إيقاف الخدمة بالكامل، لذلك يجب الفصل بين القرارين بصريًا ومنطقيًا.'
                          )}
                        </span>
                      </li>
                      <li className='flex gap-3'>
                        <span className='mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500' />
                        <span>
                          {txSafe(
                            'watchoutsPoint3',
                            'التغطية والرسالة والأهلية ليست إعدادات ثانوية؛ هي عناصر تصوغ التجربة العميلة بالكامل حين يكون الضغط مرتفعًا أو التوفر محدودًا.'
                          )}
                        </span>
                      </li>
                    </ul>
                  </section>
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

