'use client';

/**
 * KWD CONTROL PANEL — Unified operating page (single-page, decision-first).
 * Goal: one primary CTA + progressive disclosure; all KWD in CONTROL PANEL lives here.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  ListChecks,
  RefreshCw,
  Send,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import {
  completeTaskSession,
  startTaskSession,
  trackMcpwTelemetry,
} from '../../../utils/mcpwTelemetry';

const VAR_SERVICE_ENABLED = 'VAR_SVC_KWD_ENABLED';

const VAR_LISTING_RETENTION_DAYS = 'VAR_KWD_LISTING_RETENTION_DAYS';
const VAR_MAX_LISTING_ATTACHMENTS = 'VAR_KWD_MAX_LISTING_ATTACHMENTS';
const VAR_MODERATION_RESPONSE_HOURS = 'VAR_KWD_MODERATION_RESPONSE_HOURS';
const VAR_RANKING_PROXIMITY_WEIGHT = 'VAR_KWD_RANKING_PROXIMITY_WEIGHT';
const VAR_RANKING_FRESHNESS_WEIGHT = 'VAR_KWD_RANKING_FRESHNESS_WEIGHT';
const VAR_MAX_DISTANCE_KM = 'VAR_KWD_MAX_DISTANCE_KM';
const VAR_RATE_LIMIT_PER_MINUTE = 'VAR_KWD_RATE_LIMIT_PER_MINUTE';
const VAR_TIMEOUT_SECONDS = 'VAR_KWD_TIMEOUT_SECONDS';
const VAR_MAX_RETRY_ATTEMPTS = 'VAR_KWD_MAX_RETRY_ATTEMPTS';

const I18N_NS = 'surfaces.mcpwKwdWorkspace';

type RuntimeVarResolveResponse = {
  key: string;
  resolved_value?: unknown;
  value?: unknown;
};

type RuntimeVarUpsertRequest = {
  key: string;
  value: boolean | string | number | object;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  category?: string;
};

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
  const data: RuntimeVarResolveResponse = await response.json();
  return data?.resolved_value ?? data?.value;
}

async function upsertRuntimeVar(
  key: string,
  value: RuntimeVarUpsertRequest['value'],
  type: NonNullable<RuntimeVarUpsertRequest['type']>,
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
    } satisfies RuntimeVarUpsertRequest),
  });
  return response.ok;
}

function parseBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === 'boolean') return v;
  if (v === undefined || v === null) return fallback;
  return String(v).toLowerCase() === 'true';
}

function parseNumber(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (v === undefined || v === null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

type ScopeMode = 'jobs' | 'apply' | 'applications' | 'report';

function CompactPill({
  label,
  tone,
}: {
  label: string;
  tone: 'ok' | 'warn' | 'danger' | 'info' | 'neutral';
}) {
  const colors =
    tone === 'ok'
      ? {
          bg: semanticRoles.stateSuccess.background,
          fg: semanticRoles.stateSuccess.icon,
        }
      : tone === 'warn'
        ? {
            bg: semanticRoles.stateWarning.background,
            fg: semanticRoles.stateWarning.icon,
          }
        : tone === 'danger'
          ? {
              bg: semanticRoles.stateError.background,
              fg: semanticRoles.stateError.icon,
            }
          : tone === 'info'
            ? {
                bg: semanticRoles.stateInfo.background,
                fg: semanticRoles.stateInfo.icon,
              }
            : { bg: semanticRoles.surfaceSubtle, fg: semanticRoles.textMuted };

  return (
    <span
      className='inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold'
      style={{ background: colors.bg, color: colors.fg }}
    >
      {label}
    </span>
  );
}

function RuntimeReference({
  value,
  visible,
}: {
  value: string;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div
      className='mt-2 text-[11px]'
      style={{ color: semanticRoles.textMuted }}
    >
      المرجع التقني: {value}
    </div>
  );
}

type KwdJobListItem = {
  id?: string;
  job_id?: string;
  title?: string;
  category?: string;
  location?: string;
  status?: 'active' | 'closed';
  createdAt?: string;
  created_at?: string;
};

type KwdJobsListResponse = {
  data?: { items?: KwdJobListItem[]; total?: number };
  items?: KwdJobListItem[];
  total?: number;
};

async function kwdJobsList(params: {
  limit: number;
  offset: number;
  location?: string;
  category?: string;
}) {
  const qs = new URLSearchParams();
  qs.set('limit', String(params.limit));
  qs.set('offset', String(params.offset));
  if (params.location) qs.set('location', params.location);
  if (params.category) qs.set('category', params.category);
  const response = await fetch(`/api/kwd/jobs?${qs.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: KwdJobsListResponse = await response.json();
  const items = (data?.data?.items ?? data?.items ?? []).filter(
    Boolean
  ) as KwdJobListItem[];
  const total = data?.data?.total ?? data?.total;
  return { items, total };
}

async function kwdJobApply(payload: {
  jobId: string;
  name: string;
  phone: string;
  skill: string;
  availability: string;
}): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const response = await fetch(
    `/api/kwd/jobs/${encodeURIComponent(payload.jobId)}/apply`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        skill: payload.skill,
        availability: payload.availability,
        portfolioImages: [],
      }),
    }
  );
  if (!response.ok) {
    const txt = await response.text().catch(() => '');
    return { ok: false, error: txt || `HTTP ${response.status}` };
  }
  const data = await response.json().catch(() => null);
  return { ok: true, data };
}

async function kwdMyApplicationsList(params: {
  userId: string;
  limit: number;
  offset: number;
}) {
  const qs = new URLSearchParams();
  qs.set('userId', params.userId);
  qs.set('limit', String(params.limit));
  qs.set('offset', String(params.offset));
  const response = await fetch(`/api/kwd/applications/me?${qs.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json().catch(() => null);
  return data as unknown;
}

async function kwdListingReport(payload: {
  listingId: string;
  reason: string;
  details?: string;
}): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const response = await fetch('/api/kwd/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const txt = await response.text().catch(() => '');
    return { ok: false, error: txt || `HTTP ${response.status}` };
  }
  const data = await response.json().catch(() => null);
  return { ok: true, data };
}

function jsonPreview(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function getJobStatusPresentation(status?: 'active' | 'closed') {
  if (status === 'active') {
    return { label: 'نشطة', tone: 'ok' as const };
  }

  if (status === 'closed') {
    return { label: 'مغلقة', tone: 'warn' as const };
  }

  return { label: 'غير محددة', tone: 'neutral' as const };
}

export function McpwKwdWorkspacePage() {
  const { t, isRTL } = useI18n();

  const tx = useCallback((key: string) => t(`${I18N_NS}.${key}`), [t]);
  const txSafe = useCallback(
    (key: string, fallback: string) => {
      const value = tx(key);
      if (!value) return fallback;
      if (typeof value === 'string' && value.startsWith(`${I18N_NS}.`))
        return fallback;
      return value as string;
    },
    [tx]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState('—');

  const [svcEnabled, setSvcEnabled] = useState(true);

  // runtime vars (smart defaults)
  const [retentionDays, setRetentionDays] = useState(90);
  const [maxAttachments, setMaxAttachments] = useState(10);
  const [moderationHours, setModerationHours] = useState(24);
  const [proximityWeight, setProximityWeight] = useState(0.3);
  const [freshnessWeight, setFreshnessWeight] = useState(0.2);
  const [maxDistanceKm, setMaxDistanceKm] = useState(50);
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(100);
  const [timeoutSeconds, setTimeoutSeconds] = useState(30);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState(3);
  const [showRuntimePanel, setShowRuntimePanel] = useState(false);
  const [showRuntimeReferences, setShowRuntimeReferences] = useState(false);

  const [scopeMode, setScopeMode] = useState<ScopeMode>('jobs');

  // jobs list
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<KwdJobListItem[]>([]);
  const [jobsTotal, setJobsTotal] = useState<number | undefined>(undefined);
  const [jobsLocation, setJobsLocation] = useState('');
  const [jobsCategory, setJobsCategory] = useState('');

  // apply
  const [applyJobId, setApplyJobId] = useState('');
  const [applyName, setApplyName] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applySkill, setApplySkill] = useState('');
  const [applyAvailability, setApplyAvailability] = useState('');
  const [applyResult, setApplyResult] = useState<unknown>(null);

  // applications
  const [appsUserId, setAppsUserId] = useState('');
  const [appsResult, setAppsResult] = useState<unknown>(null);

  // report
  const [reportListingId, setReportListingId] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportResult, setReportResult] = useState<unknown>(null);

  const hasFormDraft = useMemo(
    () =>
      Boolean(
        jobsLocation.trim() ||
          jobsCategory.trim() ||
          applyJobId.trim() ||
          applyName.trim() ||
          applyPhone.trim() ||
          applySkill.trim() ||
          applyAvailability.trim() ||
          appsUserId.trim() ||
          reportListingId.trim() ||
          reportReason.trim() ||
          reportDetails.trim()
      ),
    [
      jobsLocation,
      jobsCategory,
      applyJobId,
      applyName,
      applyPhone,
      applySkill,
      applyAvailability,
      appsUserId,
      reportListingId,
      reportReason,
      reportDetails,
    ]
  );

  const primaryCta = useMemo(() => {
    if (!svcEnabled) {
      return {
        label: 'تفعيل KWD الآن',
        hint: 'لن تعمل عمليات KWD قبل التفعيل.',
        intent: 'enable' as const,
      };
    }
    return {
      label: 'فتح صندوق الوظائف',
      hint: 'عرض أحدث الوظائف مع افتراضات ذكية.',
      intent: 'openJobs' as const,
    };
  }, [svcEnabled]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setViewError(null);
    setNotice(null);
    try {
      const result = await Promise.allSettled([
        resolveRuntimeVar(VAR_SERVICE_ENABLED),
        resolveRuntimeVar(VAR_LISTING_RETENTION_DAYS),
        resolveRuntimeVar(VAR_MAX_LISTING_ATTACHMENTS),
        resolveRuntimeVar(VAR_MODERATION_RESPONSE_HOURS),
        resolveRuntimeVar(VAR_RANKING_PROXIMITY_WEIGHT),
        resolveRuntimeVar(VAR_RANKING_FRESHNESS_WEIGHT),
        resolveRuntimeVar(VAR_MAX_DISTANCE_KM),
        resolveRuntimeVar(VAR_RATE_LIMIT_PER_MINUTE),
        resolveRuntimeVar(VAR_TIMEOUT_SECONDS),
        resolveRuntimeVar(VAR_MAX_RETRY_ATTEMPTS),
      ]);
      const values = result.map(r =>
        r.status === 'fulfilled' ? r.value : undefined
      );
      const [en, r1, r2, r3, r4, r5, r6, r7, r8, r9] = values;

      setSvcEnabled(parseBool(en, true));
      setRetentionDays(parseNumber(r1, 90));
      setMaxAttachments(parseNumber(r2, 10));
      setModerationHours(parseNumber(r3, 24));
      setProximityWeight(parseNumber(r4, 0.3));
      setFreshnessWeight(parseNumber(r5, 0.2));
      setMaxDistanceKm(parseNumber(r6, 50));
      setRateLimitPerMinute(parseNumber(r7, 100));
      setTimeoutSeconds(parseNumber(r8, 30));
      setMaxRetryAttempts(parseNumber(r9, 3));

      setLastUpdatedLabel(new Date().toLocaleString());
    } catch {
      setViewError(
        txSafe('loadError', 'تعذر تحميل الصفحة الآن. حاول التحديث.')
      );
    } finally {
      setLoading(false);
    }
  }, [txSafe]);

  const loadJobs = useCallback(async () => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const resp = await kwdJobsList({
        limit: 20,
        offset: 0,
        location: jobsLocation.trim() || undefined,
        category: jobsCategory.trim() || undefined,
      });
      setJobs(resp.items);
      setJobsTotal(resp.total);
    } catch (e) {
      setJobs([]);
      setJobsTotal(undefined);
      setJobsError(
        e instanceof Error
          ? `تعذر تحميل الوظائف: ${e.message}`
          : 'تعذر تحميل الوظائف.'
      );
    } finally {
      setJobsLoading(false);
    }
  }, [jobsCategory, jobsLocation]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!loading && svcEnabled) loadJobs();
  }, [loading, svcEnabled, loadJobs]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as any).__MCPW_UNSAVED_CHANGES__ = Boolean(saving || hasFormDraft);
    return () => {
      (window as any).__MCPW_UNSAVED_CHANGES__ = false;
    };
  }, [hasFormDraft, saving]);

  const saveRuntime = useCallback(
    async (
      key: string,
      value: boolean | number,
      type: 'boolean' | 'number',
      desc: string
    ) => {
      setSaving(true);
      setNotice(null);
      try {
        const ok = await upsertRuntimeVar(key, value, type, desc);
        if (!ok) throw new Error('فشل الحفظ');
        setNotice('تم الحفظ.');
        setLastUpdatedLabel(new Date().toLocaleString());
        return true;
      } catch (e) {
        setNotice(
          e instanceof Error
            ? `تعذر الحفظ: ${e.message}`
            : 'تعذر الحفظ. حاول مرة أخرى.'
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const handlePrimary = useCallback(async () => {
    const taskId = 'kwd_primary';
    startTaskSession(taskId, { scope: 'kwd' });
    trackMcpwTelemetry('kwd.primary_action_click', {
      task_id: taskId,
      click_target: primaryCta.intent,
    });
    if (primaryCta.intent === 'enable') {
      const prev = svcEnabled;
      setSvcEnabled(true);
      const ok = await saveRuntime(
        VAR_SERVICE_ENABLED,
        true,
        'boolean',
        'Enable/disable KWD service globally'
      );
      if (!ok) setSvcEnabled(prev);
      completeTaskSession(taskId, ok ? 'success' : 'fail', { scope: 'kwd' });
      return;
    }
    setScopeMode('jobs');
    try {
      await loadJobs();
      completeTaskSession(taskId, 'success', { scope: 'kwd' });
    } catch {
      completeTaskSession(taskId, 'fail', { scope: 'kwd' });
    }
    document
      .getElementById('kwd-jobs-block')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [loadJobs, primaryCta.intent, saveRuntime, svcEnabled]);

  const clickMap = useMemo(
    () => ({
      before: { openJobs: 3, apply: 4, myApps: 4, report: 4 },
      after: { openJobs: 1, apply: 2, myApps: 2, report: 2 },
    }),
    []
  );

  const canApply =
    applyJobId.trim() &&
    applyName.trim() &&
    applyPhone.trim() &&
    applySkill.trim() &&
    applyAvailability.trim();
  const canReport = reportListingId.trim() && reportReason.trim();

  const serviceReadiness = svcEnabled
    ? {
        label: 'الخدمة مفعّلة',
        hint: 'KWD جاهزة للتشغيل والمتابعة من نفس الشاشة.',
        tone: 'ok' as const,
      }
    : {
        label: 'الخدمة متوقفة',
        hint: 'ابدأ بتفعيل الخدمة ثم افتح المهمة المطلوبة.',
        tone: 'danger' as const,
      };

  const scopeCards: Array<{
    id: ScopeMode;
    label: string;
    description: string;
    clicks: string;
    helper: string;
    icon: ReactNode;
  }> = [
    {
      id: 'jobs',
      label: 'صندوق الوظائف',
      description: 'عرض أحدث الوظائف مع فلترين فقط ومسار أسرع للتقديم.',
      clicks: '1 نقرة إلى القيمة',
      helper:
        typeof jobsTotal === 'number'
          ? `${jobs.length} من ${jobsTotal} معروضة الآن`
          : 'الفرص الأحدث أولاً',
      icon: <BriefcaseBusiness size={16} />,
    },
    {
      id: 'apply',
      label: 'تقديم سريع',
      description: 'نموذج مختصر من 4 حقول فقط مع تجهيز أسرع لمعرّف الوظيفة.',
      clicks: 'نقرتان للإرسال',
      helper: applyJobId.trim()
        ? `معرّف الوظيفة جاهز: ${applyJobId.trim()}`
        : 'ابدأ من صندوق الوظائف أو أدخل المعرّف مباشرة',
      icon: <Send size={16} />,
    },
    {
      id: 'applications',
      label: 'طلبات المستخدم',
      description: 'جلب الطلبات ومتابعة الحالة من مسار واحد داخل CONTROL PANEL.',
      clicks: 'نقرتان إلى النتيجة',
      helper: appsUserId.trim()
        ? `جاهز للجلب: ${appsUserId.trim()}`
        : 'أدخل معرّف المستخدم لإظهار الطلبات',
      icon: <ListChecks size={16} />,
    },
    {
      id: 'report',
      label: 'بلاغ على إعلان',
      description: 'تصعيد سريع مع SLA واضح للإشراف ومسار أقل احتكاكًا.',
      clicks: 'نقرتان للإرسال',
      helper: `زمن الاستجابة المستهدف: ${moderationHours} ساعة`,
      icon: <ShieldCheck size={16} />,
    },
  ];

  const activeScopeCard =
    scopeCards.find(card => card.id === scopeMode) ?? scopeCards[0];

  const firstScanSteps = [
    serviceReadiness.hint,
    'اختر المهمة التالية من بطاقات العمل بدل التنقل بين أقسام متفرقة.',
    'افتح ضوابط التشغيل فقط عندما تحتاج تعديل السياسة الحية أو حدود الأمان.',
  ];

  const governanceSignals = [
    { label: 'الاحتفاظ بالإعلانات', value: `${retentionDays} يومًا` },
    { label: 'صور الأعمال', value: `${maxAttachments} صور` },
    { label: 'SLA الإشراف', value: `${moderationHours} ساعة` },
    { label: 'أقصى نطاق بحث', value: `${maxDistanceKm} كم` },
  ];

  return (
    <div
      className='w-full min-h-screen p-6 sm:p-8'
      style={{
        background: `linear-gradient(180deg, ${semanticRoles.surfaceSubtle} 0%, ${semanticRoles.surface} 55%, ${semanticRoles.surfaceSubtle} 100%)`,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6 grid gap-4 lg:grid-cols-3 items-start'>
          <div
            className='lg:col-span-2 rounded-3xl border p-5 sm:p-6'
            style={{
              background: `radial-gradient(1000px 400px at 90% -20%, ${semanticRoles.accent}22 0%, transparent 60%), ${semanticRoles.surface}`,
              borderColor: semanticRoles.border,
              boxShadow: `0 24px 60px -40px rgba(0,0,0,0.35)`,
            }}
          >
            <div className='flex flex-wrap items-center gap-2 mb-3'>
              <Link
                href='/service-catalog/services'
                className='inline-flex items-center gap-2 text-sm font-semibold hover:underline'
                style={{ color: semanticRoles.textMuted }}
              >
                <DirectionalIcon
                  icon={ArrowLeft}
                  mirrorInRTL={true}
                  size={16}
                />
                الخدمات
              </Link>
              <span
                className='text-sm'
                style={{ color: semanticRoles.textMuted }}
              >
                /
              </span>
              <span
                className='text-sm font-semibold'
                style={{ color: semanticRoles.text }}
              >
                KWD
              </span>
              <CompactPill
                label={serviceReadiness.label}
                tone={serviceReadiness.tone}
              />
              <CompactPill label='4 عمليات رسمية في النطاق' tone='info' />
              <CompactPill label='CONTROL PANEL / Operations' tone='neutral' />
            </div>

            <div className='max-w-3xl'>
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                لوحة تشغيل KWD
              </div>
              <h1
                className='mt-2 text-2xl sm:text-3xl font-bold'
                style={{ color: semanticRoles.text }}
              >
                تشغيل KWD (الوظائف والعمل)
              </h1>
              <p
                className='mt-3 text-sm sm:text-base'
                style={{ color: semanticRoles.textMuted }}
              >
                مساحة عمل تشغيلية واحدة لفتح صندوق الوظائف، تنفيذ التقديمات،
                متابعة الطلبات، ورفع البلاغات مع ضوابط تشغيل تظهر فقط عند
                الحاجة.
              </p>
            </div>

            <div className='mt-5 flex flex-wrap items-center gap-3'>
              <button
                type='button'
                onClick={handlePrimary}
                className='inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold'
                style={{
                  background: semanticRoles.primaryCTA,
                  color: semanticRoles.primaryCTAText,
                }}
                disabled={loading || saving}
              >
                {primaryCta.label}
              </button>
              <button
                type='button'
                onClick={() => {
                  setShowRuntimePanel(prev => {
                    const next = !prev;
                    if (!next) setShowRuntimeReferences(false);
                    return next;
                  });
                }}
                className='inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold'
                style={{
                  background: semanticRoles.surface,
                  borderColor: semanticRoles.border,
                  color: semanticRoles.text,
                }}
                disabled={loading || saving}
              >
                <Settings2 size={16} />
                {showRuntimePanel
                  ? 'إخفاء ضوابط التشغيل'
                  : 'إظهار ضوابط التشغيل'}
              </button>
              <button
                type='button'
                onClick={() => loadAll()}
                className='inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold'
                style={{
                  background: semanticRoles.surface,
                  borderColor: semanticRoles.border,
                  color: semanticRoles.text,
                }}
                disabled={loading || saving}
              >
                <RefreshCw size={16} />
                تحديث الشاشة
              </button>
            </div>

            {viewError && (
              <div
                className='mt-4 rounded-2xl border p-4'
                style={{
                  background: semanticRoles.stateError.background,
                  borderColor: semanticRoles.stateError.icon,
                  color: semanticRoles.stateError.text,
                }}
              >
                {viewError}
              </div>
            )}

            <div className='mt-5 grid gap-3 md:grid-cols-3'>
              <div
                className='rounded-2xl border p-4'
                style={{
                  background: semanticRoles.surface,
                  borderColor: semanticRoles.border,
                }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  نقطة الدخول المهيمنة
                </div>
                <div
                  className='mt-2 text-sm font-bold'
                  style={{ color: semanticRoles.text }}
                >
                  {primaryCta.label}
                </div>
                <div
                  className='mt-1 text-xs'
                  style={{ color: semanticRoles.textMuted }}
                >
                  {primaryCta.hint}
                </div>
              </div>

              <div
                className='rounded-2xl border p-4'
                style={{
                  background: semanticRoles.surface,
                  borderColor: semanticRoles.border,
                }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  الأثر التشغيلي القابل للقياس
                </div>
                <div className='mt-2 flex flex-wrap items-center gap-2'>
                  <CompactPill
                    label={`الوظائف: ${clickMap.before.openJobs} → ${clickMap.after.openJobs}`}
                    tone='neutral'
                  />
                  <CompactPill
                    label={`التقديم: ${clickMap.before.apply} → ${clickMap.after.apply}`}
                    tone='neutral'
                  />
                </div>
                <div
                  className='mt-2 text-xs'
                  style={{ color: semanticRoles.textMuted }}
                >
                  الهدف هو تقليل المسار إلى المهمة الفعلية لا تعظيم عدد الأدوات
                  فوق الطية.
                </div>
              </div>

              <div
                className='rounded-2xl border p-4'
                style={{
                  background: semanticRoles.surface,
                  borderColor: semanticRoles.border,
                }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  الثقة الظاهرة
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  {svcEnabled ? (
                    <CheckCircle2
                      size={18}
                      color={semanticRoles.stateSuccess.icon}
                    />
                  ) : (
                    <CircleAlert
                      size={18}
                      color={semanticRoles.stateError.icon}
                    />
                  )}
                  <span
                    className='text-sm font-bold'
                    style={{ color: semanticRoles.text }}
                  >
                    {serviceReadiness.label}
                  </span>
                </div>
                <div
                  className='mt-2 text-xs'
                  style={{ color: semanticRoles.textMuted }}
                >
                  SLA الإشراف: {moderationHours} ساعة • آخر تحديث:{' '}
                  {lastUpdatedLabel}
                </div>
              </div>
            </div>
          </div>

          <div
            className='rounded-3xl border p-5'
            style={{
              background: semanticRoles.surface,
              borderColor: semanticRoles.border,
            }}
          >
            <div className='flex items-center justify-between gap-3'>
              <div>
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  أول 3 ثوانٍ
                </div>
                <div
                  className='mt-1 text-lg font-bold'
                  style={{ color: semanticRoles.text }}
                >
                  افهم الحالة ثم ابدأ المهمة
                </div>
              </div>
              <ShieldCheck size={18} color={semanticRoles.stateSuccess.icon} />
            </div>

            <div className='mt-4 grid gap-3'>
              {firstScanSteps.map((step, index) => (
                <div
                  key={index}
                  className='rounded-2xl border p-3'
                  style={{ borderColor: semanticRoles.border }}
                >
                  <div className='flex items-start gap-3'>
                    <div
                      className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold'
                      style={{
                        background: semanticRoles.surfaceSubtle,
                        color: semanticRoles.text,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div
                        className='text-sm font-bold'
                        style={{ color: semanticRoles.text }}
                      >
                        {index === 0
                          ? 'تحقق من الجاهزية'
                          : index === 1
                            ? 'اختر مسار العمل'
                            : 'أظهر الحوكمة عند الحاجة'}
                      </div>
                      <div
                        className='mt-1 text-xs'
                        style={{ color: semanticRoles.textMuted }}
                      >
                        {step}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className='mt-4 rounded-2xl border p-4'
              style={{
                background: semanticRoles.surfaceSubtle,
                borderColor: semanticRoles.border,
              }}
            >
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                أدلة الثقة والتشغيل
              </div>
              <div className='mt-3 grid gap-2'>
                <div
                  className='text-sm font-semibold'
                  style={{ color: semanticRoles.text }}
                >
                  4 عمليات رسمية في النطاق
                </div>
                <div
                  className='text-xs'
                  style={{ color: semanticRoles.textMuted }}
                >
                  وظائف، تقديم، طلبات، وبلاغات من مسار واحد داخل CONTROL PANEL.
                </div>
                <div
                  className='text-xs'
                  style={{ color: semanticRoles.textMuted }}
                >
                  آخر تحديث: {lastUpdatedLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
          {scopeCards.map(card => {
            const active = scopeMode === card.id;

            return (
              <button
                key={card.id}
                type='button'
                onClick={() => setScopeMode(card.id)}
                className='rounded-3xl border p-4 text-start transition-colors'
                style={{
                  background: active
                    ? `${semanticRoles.accent}12`
                    : semanticRoles.surface,
                  borderColor: active
                    ? semanticRoles.accent
                    : semanticRoles.border,
                  boxShadow: active
                    ? `0 20px 40px -32px rgba(0,0,0,0.4)`
                    : 'none',
                }}
                disabled={loading}
              >
                <div className='flex items-center justify-between gap-3'>
                  <div
                    className='flex h-10 w-10 items-center justify-center rounded-2xl'
                    style={{
                      background: active
                        ? semanticRoles.primaryCTA
                        : semanticRoles.surfaceSubtle,
                      color: active
                        ? semanticRoles.primaryCTAText
                        : semanticRoles.text,
                    }}
                  >
                    {card.icon}
                  </div>
                  {active ? (
                    <CompactPill label='المساحة النشطة' tone='info' />
                  ) : null}
                </div>
                <div
                  className='mt-4 text-sm font-bold'
                  style={{ color: semanticRoles.text }}
                >
                  {card.label}
                </div>
                <div
                  className='mt-1 text-xs leading-5'
                  style={{ color: semanticRoles.textMuted }}
                >
                  {card.description}
                </div>
                <div className='mt-3 flex flex-wrap items-center gap-2'>
                  <CompactPill
                    label={card.clicks}
                    tone={active ? 'info' : 'neutral'}
                  />
                </div>
                <div
                  className='mt-2 text-[11px]'
                  style={{ color: semanticRoles.textMuted }}
                >
                  {card.helper}
                </div>
              </button>
            );
          })}
        </div>

        <div
          className='mb-4 rounded-3xl border p-4 sm:p-5'
          style={{
            background: semanticRoles.surface,
            borderColor: semanticRoles.border,
          }}
        >
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                ضوابط التشغيل الحية
              </div>
              <div
                className='mt-1 text-sm font-bold'
                style={{ color: semanticRoles.text }}
              >
                Smart Defaults مخفية افتراضيًا حتى لا تزاحم نقطة الدخول الأساسية
              </div>
              <div className='mt-3 flex flex-wrap items-center gap-2'>
                {governanceSignals.map(signal => (
                  <CompactPill
                    key={signal.label}
                    label={`${signal.label}: ${signal.value}`}
                    tone='neutral'
                  />
                ))}
              </div>
              <div
                className='mt-2 text-[11px]'
                style={{ color: semanticRoles.textMuted }}
              >
                هذه الضوابط جزء من الحوكمة وليست نقطة الدخول الأساسية للعمل
                اليومي.
              </div>
            </div>

            <button
              type='button'
              onClick={() => {
                setShowRuntimePanel(prev => {
                  const next = !prev;
                  if (!next) setShowRuntimeReferences(false);
                  return next;
                });
              }}
              className='inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold'
              style={{
                background: semanticRoles.surfaceSubtle,
                borderColor: semanticRoles.border,
                color: semanticRoles.text,
              }}
              disabled={loading || saving}
            >
              {showRuntimePanel
                ? 'إخفاء الإعدادات الحية'
                : 'إظهار الإعدادات الحية'}
              {showRuntimePanel ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>
        </div>

        {showRuntimePanel && (
          <div
            className='mb-6 rounded-3xl border p-4 sm:p-5'
            style={{
              background: semanticRoles.surface,
              borderColor: semanticRoles.border,
            }}
          >
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='min-w-0'>
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  إعدادات KWD الحية
                </div>
                <div
                  className='mt-1 text-sm font-bold'
                  style={{ color: semanticRoles.text }}
                >
                  Smart Defaults + حدود آمنة
                </div>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setShowRuntimeReferences(prev => !prev)}
                  className='inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold'
                  style={{
                    background: semanticRoles.surfaceSubtle,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                  }}
                >
                  {showRuntimeReferences
                    ? 'إخفاء المراجع التقنية'
                    : 'إظهار المراجع التقنية'}
                </button>
                <div
                  className='text-xs'
                  style={{ color: semanticRoles.textMuted }}
                >
                  {notice ?? '—'}
                </div>
              </div>
            </div>

            <div className='mt-4 grid gap-3 md:grid-cols-2'>
              <div
                className='rounded-2xl border p-3'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  مدة الاحتفاظ بالإعلانات (أيام)
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <input
                    type='number'
                    min={7}
                    max={365}
                    value={retentionDays}
                    onChange={e =>
                      setRetentionDays(parseNumber(e.target.value, 90))
                    }
                    className='h-10 w-28 rounded-xl border px-3 text-sm font-semibold outline-none'
                    style={{
                      borderColor: semanticRoles.border,
                      background: semanticRoles.surface,
                      color: semanticRoles.text,
                    }}
                    disabled={loading || saving}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      saveRuntime(
                        VAR_LISTING_RETENTION_DAYS,
                        retentionDays,
                        'number',
                        'Job listing retention in days (auto-archive expired listings)'
                      )
                    }
                    className='h-10 rounded-xl px-3 text-sm font-bold'
                    style={{
                      background: semanticRoles.primaryCTA,
                      color: semanticRoles.primaryCTAText,
                    }}
                    disabled={loading || saving}
                  >
                    حفظ
                  </button>
                </div>
                <div
                  className='mt-2 text-[11px]'
                  style={{ color: semanticRoles.textMuted }}
                >
                  يحدد أرشفة الإعلانات من صفحة التشغيل نفسها.
                </div>
                <RuntimeReference
                  value={VAR_LISTING_RETENTION_DAYS}
                  visible={showRuntimeReferences}
                />
              </div>

              <div
                className='rounded-2xl border p-3'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  أقصى صور Portfolio
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <input
                    type='number'
                    min={0}
                    max={20}
                    value={maxAttachments}
                    onChange={e =>
                      setMaxAttachments(parseNumber(e.target.value, 10))
                    }
                    className='h-10 w-28 rounded-xl border px-3 text-sm font-semibold outline-none'
                    style={{
                      borderColor: semanticRoles.border,
                      background: semanticRoles.surface,
                      color: semanticRoles.text,
                    }}
                    disabled={loading || saving}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      saveRuntime(
                        VAR_MAX_LISTING_ATTACHMENTS,
                        maxAttachments,
                        'number',
                        'Maximum portfolio images per application (3-10 images)'
                      )
                    }
                    className='h-10 rounded-xl px-3 text-sm font-bold'
                    style={{
                      background: semanticRoles.primaryCTA,
                      color: semanticRoles.primaryCTAText,
                    }}
                    disabled={loading || saving}
                  >
                    حفظ
                  </button>
                </div>
                <div
                  className='mt-2 text-[11px]'
                  style={{ color: semanticRoles.textMuted }}
                >
                  يحدد الحد الأعلى لصور الأعمال أثناء التقديم.
                </div>
                <RuntimeReference
                  value={VAR_MAX_LISTING_ATTACHMENTS}
                  visible={showRuntimeReferences}
                />
              </div>

              <div
                className='rounded-2xl border p-3'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  زمن استجابة الإشراف (ساعات)
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <input
                    type='number'
                    min={1}
                    max={168}
                    value={moderationHours}
                    onChange={e =>
                      setModerationHours(parseNumber(e.target.value, 24))
                    }
                    className='h-10 w-28 rounded-xl border px-3 text-sm font-semibold outline-none'
                    style={{
                      borderColor: semanticRoles.border,
                      background: semanticRoles.surface,
                      color: semanticRoles.text,
                    }}
                    disabled={loading || saving}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      saveRuntime(
                        VAR_MODERATION_RESPONSE_HOURS,
                        moderationHours,
                        'number',
                        'Moderation response time in hours'
                      )
                    }
                    className='h-10 rounded-xl px-3 text-sm font-bold'
                    style={{
                      background: semanticRoles.primaryCTA,
                      color: semanticRoles.primaryCTAText,
                    }}
                    disabled={loading || saving}
                  >
                    حفظ
                  </button>
                </div>
                <div
                  className='mt-2 text-[11px]'
                  style={{ color: semanticRoles.textMuted }}
                >
                  يحدد التوقع التشغيلي لمعالجة البلاغات والمراجعات.
                </div>
                <RuntimeReference
                  value={VAR_MODERATION_RESPONSE_HOURS}
                  visible={showRuntimeReferences}
                />
              </div>

              <div
                className='rounded-2xl border p-3'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  نطاق البحث الأقصى (كم)
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <input
                    type='number'
                    min={0}
                    max={200}
                    value={maxDistanceKm}
                    onChange={e =>
                      setMaxDistanceKm(parseNumber(e.target.value, 50))
                    }
                    className='h-10 w-28 rounded-xl border px-3 text-sm font-semibold outline-none'
                    style={{
                      borderColor: semanticRoles.border,
                      background: semanticRoles.surface,
                      color: semanticRoles.text,
                    }}
                    disabled={loading || saving}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      saveRuntime(
                        VAR_MAX_DISTANCE_KM,
                        maxDistanceKm,
                        'number',
                        'Maximum search distance in kilometers for location-based filtering'
                      )
                    }
                    className='h-10 rounded-xl px-3 text-sm font-bold'
                    style={{
                      background: semanticRoles.primaryCTA,
                      color: semanticRoles.primaryCTAText,
                    }}
                    disabled={loading || saving}
                  >
                    حفظ
                  </button>
                </div>
                <div
                  className='mt-2 text-[11px]'
                  style={{ color: semanticRoles.textMuted }}
                >
                  يحدد أقصى نطاق للبحث بحسب الموقع.
                </div>
                <RuntimeReference
                  value={VAR_MAX_DISTANCE_KM}
                  visible={showRuntimeReferences}
                />
              </div>
            </div>

            <div className='mt-3 grid gap-3 md:grid-cols-3'>
              <div
                className='rounded-2xl border p-3'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  وزن القرب (0..1)
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <input
                    type='number'
                    min={0}
                    max={1}
                    step={0.05}
                    value={proximityWeight}
                    onChange={e =>
                      setProximityWeight(parseNumber(e.target.value, 0.3))
                    }
                    className='h-10 w-28 rounded-xl border px-3 text-sm font-semibold outline-none'
                    style={{
                      borderColor: semanticRoles.border,
                      background: semanticRoles.surface,
                      color: semanticRoles.text,
                    }}
                    disabled={loading || saving}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      saveRuntime(
                        VAR_RANKING_PROXIMITY_WEIGHT,
                        proximityWeight,
                        'number',
                        'Weight for proximity-based ranking (0.0-1.0)'
                      )
                    }
                    className='h-10 rounded-xl px-3 text-sm font-bold'
                    style={{
                      background: semanticRoles.primaryCTA,
                      color: semanticRoles.primaryCTAText,
                    }}
                    disabled={loading || saving}
                  >
                    حفظ
                  </button>
                </div>
                <RuntimeReference
                  value={VAR_RANKING_PROXIMITY_WEIGHT}
                  visible={showRuntimeReferences}
                />
              </div>
              <div
                className='rounded-2xl border p-3'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  وزن الحداثة (0..1)
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <input
                    type='number'
                    min={0}
                    max={1}
                    step={0.05}
                    value={freshnessWeight}
                    onChange={e =>
                      setFreshnessWeight(parseNumber(e.target.value, 0.2))
                    }
                    className='h-10 w-28 rounded-xl border px-3 text-sm font-semibold outline-none'
                    style={{
                      borderColor: semanticRoles.border,
                      background: semanticRoles.surface,
                      color: semanticRoles.text,
                    }}
                    disabled={loading || saving}
                  />
                  <button
                    type='button'
                    onClick={() =>
                      saveRuntime(
                        VAR_RANKING_FRESHNESS_WEIGHT,
                        freshnessWeight,
                        'number',
                        'Weight for freshness-based ranking (0.0-1.0)'
                      )
                    }
                    className='h-10 rounded-xl px-3 text-sm font-bold'
                    style={{
                      background: semanticRoles.primaryCTA,
                      color: semanticRoles.primaryCTAText,
                    }}
                    disabled={loading || saving}
                  >
                    حفظ
                  </button>
                </div>
                <RuntimeReference
                  value={VAR_RANKING_FRESHNESS_WEIGHT}
                  visible={showRuntimeReferences}
                />
              </div>
              <div
                className='rounded-2xl border p-3'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-xs font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  قيود الحماية
                </div>
                <div
                  className='mt-2 text-[11px]'
                  style={{ color: semanticRoles.textMuted }}
                >
                  الحد في الدقيقة: {rateLimitPerMinute} • المهلة:{' '}
                  {timeoutSeconds} ثانية • عدد المحاولات: {maxRetryAttempts}
                </div>
                {showRuntimeReferences ? (
                  <div
                    className='mt-2 text-[11px]'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    المراجع التقنية: {VAR_RATE_LIMIT_PER_MINUTE} •{' '}
                    {VAR_TIMEOUT_SECONDS} • {VAR_MAX_RETRY_ATTEMPTS}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        <div
          id='kwd-jobs-block'
          className='rounded-3xl border p-4 sm:p-5'
          style={{
            background: semanticRoles.surface,
            borderColor: semanticRoles.border,
          }}
        >
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                مساحة العمل النشطة
              </div>
              <div
                className='mt-1 text-lg font-bold'
                style={{ color: semanticRoles.text }}
              >
                {activeScopeCard.label}
              </div>
              <div
                className='mt-1 text-xs'
                style={{ color: semanticRoles.textMuted }}
              >
                {activeScopeCard.description}
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <CompactPill label={activeScopeCard.clicks} tone='info' />
              <button
                type='button'
                onClick={() => {
                  if (scopeMode === 'jobs') loadJobs();
                }}
                className='inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border'
                style={{
                  background: semanticRoles.surfaceSubtle,
                  color: semanticRoles.text,
                  borderColor: semanticRoles.border,
                }}
                disabled={loading || saving}
              >
                <RefreshCw size={16} />
                تحديث
              </button>
            </div>
          </div>

          {!svcEnabled && (
            <div
              className='mt-4 rounded-2xl border p-4'
              style={{
                background: semanticRoles.stateWarning.background,
                borderColor: semanticRoles.stateWarning.icon,
                color: semanticRoles.stateWarning.text,
              }}
            >
              الخدمة متوقفة الآن. فعّلها من ضوابط التشغيل لتعمل هذه المساحة.
            </div>
          )}

          {scopeMode === 'jobs' && (
            <div className='mt-4'>
              {jobsError && (
                <div
                  className='mb-3 rounded-2xl border p-3 text-sm'
                  style={{
                    background: semanticRoles.stateError.background,
                    borderColor: semanticRoles.stateError.icon,
                    color: semanticRoles.stateError.text,
                  }}
                >
                  {jobsError}
                </div>
              )}

              <div className='grid gap-2 md:grid-cols-[1fr_1fr_120px] mb-3'>
                <input
                  value={jobsLocation}
                  onChange={e => setJobsLocation(e.target.value)}
                  placeholder='فلتر موقع (اختياري)…'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <input
                  value={jobsCategory}
                  onChange={e => setJobsCategory(e.target.value)}
                  placeholder='فلتر تصنيف (اختياري)…'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <button
                  type='button'
                  onClick={async () => {
                    const taskId = 'kwd_jobs_search';
                    startTaskSession(taskId, { scope: 'kwd' });
                    trackMcpwTelemetry('kwd.jobs_search_click', {
                      task_id: taskId,
                      click_target: 'jobs_search',
                    });
                    try {
                      await loadJobs();
                      completeTaskSession(taskId, 'success', { scope: 'kwd' });
                    } catch {
                      completeTaskSession(taskId, 'fail', { scope: 'kwd' });
                    }
                  }}
                  className='h-11 rounded-2xl px-3 text-sm font-bold'
                  style={{
                    background: semanticRoles.primaryCTA,
                    color: semanticRoles.primaryCTAText,
                  }}
                  disabled={!svcEnabled || jobsLoading}
                >
                  بحث
                </button>
              </div>

              <div className='flex flex-wrap items-center gap-2 mb-3'>
                <CompactPill
                  label={`المعروض: ${jobs.length}${typeof jobsTotal === 'number' ? ` / ${jobsTotal}` : ''}`}
                  tone='neutral'
                />
                <CompactPill
                  label={`أقصى نطاق: ${maxDistanceKm} كم`}
                  tone='info'
                />
              </div>

              <div className='grid gap-2'>
                {jobsLoading ? (
                  <div
                    className='py-8 text-center text-sm'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    جاري التحميل…
                  </div>
                ) : jobs.length === 0 ? (
                  <div className='py-10 text-center'>
                    <div
                      className='text-sm font-bold'
                      style={{ color: semanticRoles.text }}
                    >
                      لا توجد وظائف للعرض
                    </div>
                    <div
                      className='mt-1 text-xs'
                      style={{ color: semanticRoles.textMuted }}
                    >
                      جرّب تغيير الفلاتر أو قدّم على وظيفة عبر تبويب “تقديم”.
                    </div>
                  </div>
                ) : (
                  jobs.map((j, i) => {
                    const id = String(j.id ?? j.job_id ?? `row-${i}`);
                    const status = getJobStatusPresentation(j.status);
                    return (
                      <div
                        key={id}
                        className='rounded-2xl border p-3'
                        style={{
                          borderColor: semanticRoles.border,
                          background: semanticRoles.surface,
                        }}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div className='min-w-0'>
                            <div className='flex flex-wrap items-center gap-2'>
                              <div
                                className='text-sm font-bold truncate'
                                style={{ color: semanticRoles.text }}
                              >
                                {j.title ?? '—'}
                              </div>
                              <CompactPill
                                label={status.label}
                                tone={status.tone}
                              />
                              {j.category ? (
                                <CompactPill
                                  label={j.category}
                                  tone='neutral'
                                />
                              ) : null}
                            </div>
                            <div
                              className='mt-1 text-xs truncate'
                              style={{ color: semanticRoles.textMuted }}
                            >
                              {j.location ?? '—'}{' '}
                              {j.createdAt || j.created_at
                                ? ` • ${(j.createdAt ?? j.created_at) as string}`
                                : ''}
                            </div>
                          </div>
                          <div className='shrink-0 flex flex-wrap items-center gap-2'>
                            <button
                              type='button'
                              onClick={() => {
                                setScopeMode('apply');
                                setApplyJobId(id);
                                setNotice(
                                  `تم تجهيز معرّف الوظيفة للتقديم: ${id}`
                                );
                              }}
                              className='rounded-xl px-3 py-2 text-xs font-bold'
                              style={{
                                background: semanticRoles.primaryCTA,
                                color: semanticRoles.primaryCTAText,
                              }}
                            >
                              قدّم على هذه الوظيفة
                            </button>
                            <button
                              type='button'
                              onClick={() => {
                                navigator.clipboard
                                  ?.writeText(id)
                                  .catch(() => undefined);
                                setNotice(`تم نسخ معرّف الوظيفة: ${id}`);
                              }}
                              className='rounded-xl px-3 py-2 text-xs font-bold border'
                              style={{
                                borderColor: semanticRoles.border,
                                background: semanticRoles.surfaceSubtle,
                                color: semanticRoles.text,
                              }}
                            >
                              نسخ المعرّف
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {scopeMode === 'apply' && (
            <div className='mt-4'>
              <div className='grid gap-2 md:grid-cols-2'>
                <input
                  value={applyJobId}
                  onChange={e => setApplyJobId(e.target.value)}
                  placeholder='معرّف الوظيفة (إجباري)'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <input
                  value={applyName}
                  onChange={e => setApplyName(e.target.value)}
                  placeholder='الاسم (إجباري)'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <input
                  value={applyPhone}
                  onChange={e => setApplyPhone(e.target.value)}
                  placeholder='الهاتف (إجباري)'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <input
                  value={applySkill}
                  onChange={e => setApplySkill(e.target.value)}
                  placeholder='المهارة (إجباري)'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <input
                  value={applyAvailability}
                  onChange={e => setApplyAvailability(e.target.value)}
                  placeholder='التوفر (إجباري)'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
              </div>
              <div className='mt-3 flex items-center justify-between gap-3'>
                <div
                  className='text-[11px]'
                  style={{ color: semanticRoles.textMuted }}
                >
                  عدد صور الأعمال الاختيارية محدود ضمن ضوابط التشغيل الحالية.
                </div>
                <button
                  type='button'
                  onClick={async () => {
                    const taskId = 'kwd_apply';
                    startTaskSession(taskId, { scope: 'kwd' });
                    trackMcpwTelemetry('kwd.apply_click', {
                      task_id: taskId,
                      click_target: 'apply_submit',
                    });
                    setSaving(true);
                    setNotice(null);
                    setApplyResult(null);
                    try {
                      const resp = await kwdJobApply({
                        jobId: applyJobId.trim(),
                        name: applyName.trim(),
                        phone: applyPhone.trim(),
                        skill: applySkill.trim(),
                        availability: applyAvailability.trim(),
                      });
                      if (!resp.ok)
                        throw new Error(resp.error || 'تعذر تقديم الطلب.');
                      setApplyResult(resp.data);
                      setNotice('تم تقديم الطلب.');
                      completeTaskSession(taskId, 'success', { scope: 'kwd' });
                    } catch (e) {
                      setNotice(
                        e instanceof Error ? e.message : 'تعذر تقديم الطلب.'
                      );
                      completeTaskSession(taskId, 'fail', { scope: 'kwd' });
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className='rounded-2xl px-4 py-3 text-sm font-bold'
                  style={{
                    background: semanticRoles.primaryCTA,
                    color: semanticRoles.primaryCTAText,
                    opacity: canApply ? 1 : 0.6,
                  }}
                  disabled={!svcEnabled || !canApply || saving}
                >
                  تقديم (نقرتين)
                </button>
              </div>
              {applyResult !== null && (
                <pre
                  className='mt-3 rounded-2xl border p-3 text-xs overflow-auto'
                  style={{
                    background: semanticRoles.surfaceSubtle,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                  }}
                >
                  {jsonPreview(applyResult)}
                </pre>
              )}
            </div>
          )}

          {scopeMode === 'applications' && (
            <div className='mt-4'>
              <div className='grid gap-2 md:grid-cols-[1fr_160px]'>
                <input
                  value={appsUserId}
                  onChange={e => setAppsUserId(e.target.value)}
                  placeholder='معرّف المستخدم (إجباري)…'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <button
                  type='button'
                  onClick={async () => {
                    const taskId = 'kwd_my_applications';
                    startTaskSession(taskId, { scope: 'kwd' });
                    trackMcpwTelemetry('kwd.my_applications_click', {
                      task_id: taskId,
                      click_target: 'my_applications_fetch',
                    });
                    setSaving(true);
                    setNotice(null);
                    setAppsResult(null);
                    try {
                      const id = appsUserId.trim();
                      if (!id) throw new Error('أدخل User ID.');
                      const data = await kwdMyApplicationsList({
                        userId: id,
                        limit: 20,
                        offset: 0,
                      });
                      setAppsResult(data);
                      setNotice('تم جلب الطلبات.');
                      completeTaskSession(taskId, 'success', { scope: 'kwd' });
                    } catch (e) {
                      setNotice(
                        e instanceof Error ? e.message : 'تعذر جلب الطلبات.'
                      );
                      completeTaskSession(taskId, 'fail', { scope: 'kwd' });
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className='h-11 rounded-2xl px-3 text-sm font-bold'
                  style={{
                    background: semanticRoles.primaryCTA,
                    color: semanticRoles.primaryCTAText,
                  }}
                  disabled={!svcEnabled || saving}
                >
                  جلب
                </button>
              </div>
              {appsResult !== null && (
                <pre
                  className='mt-3 rounded-2xl border p-3 text-xs overflow-auto'
                  style={{
                    background: semanticRoles.surfaceSubtle,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                  }}
                >
                  {jsonPreview(appsResult)}
                </pre>
              )}
            </div>
          )}

          {scopeMode === 'report' && (
            <div className='mt-4'>
              <div className='grid gap-2 md:grid-cols-2'>
                <input
                  value={reportListingId}
                  onChange={e => setReportListingId(e.target.value)}
                  placeholder='معرّف الإعلان (إجباري)'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <input
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder='السبب (إجباري)'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
              </div>
              <textarea
                value={reportDetails}
                onChange={e => setReportDetails(e.target.value)}
                placeholder='تفاصيل (اختياري)…'
                className='mt-2 min-h-[90px] w-full rounded-2xl border px-3 py-3 text-sm font-semibold outline-none'
                style={{
                  borderColor: semanticRoles.border,
                  background: semanticRoles.surface,
                  color: semanticRoles.text,
                }}
                disabled={!svcEnabled}
              />
              <div className='mt-3 flex items-center justify-between gap-3'>
                <div
                  className='text-[11px]'
                  style={{ color: semanticRoles.textMuted }}
                >
                  SLA للإشراف: {moderationHours} ساعة (
                  {VAR_MODERATION_RESPONSE_HOURS})
                </div>
                <button
                  type='button'
                  onClick={async () => {
                    const taskId = 'kwd_report';
                    startTaskSession(taskId, { scope: 'kwd' });
                    trackMcpwTelemetry('kwd.report_click', {
                      task_id: taskId,
                      click_target: 'report_submit',
                    });
                    setSaving(true);
                    setNotice(null);
                    setReportResult(null);
                    try {
                      const resp = await kwdListingReport({
                        listingId: reportListingId.trim(),
                        reason: reportReason.trim(),
                        details: reportDetails.trim() || undefined,
                      });
                      if (!resp.ok)
                        throw new Error(resp.error || 'تعذر إرسال البلاغ.');
                      setReportResult(resp.data);
                      setNotice('تم إرسال البلاغ.');
                      completeTaskSession(taskId, 'success', { scope: 'kwd' });
                    } catch (e) {
                      setNotice(
                        e instanceof Error ? e.message : 'تعذر إرسال البلاغ.'
                      );
                      completeTaskSession(taskId, 'fail', { scope: 'kwd' });
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className='rounded-2xl px-4 py-3 text-sm font-bold'
                  style={{
                    background: semanticRoles.primaryCTA,
                    color: semanticRoles.primaryCTAText,
                    opacity: canReport ? 1 : 0.6,
                  }}
                  disabled={!svcEnabled || !canReport || saving}
                >
                  إرسال (نقرتين)
                </button>
              </div>
              {reportResult !== null && (
                <pre
                  className='mt-3 rounded-2xl border p-3 text-xs overflow-auto'
                  style={{
                    background: semanticRoles.surfaceSubtle,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                  }}
                >
                  {jsonPreview(reportResult)}
                </pre>
              )}
            </div>
          )}
        </div>

        <div
          className='mt-6 text-[11px]'
          style={{ color: semanticRoles.textMuted }}
        >
          هذه الشاشة توحّد عمليات KWD الرسمية داخل CONTROL PANEL وتُبقي ضوابط التشغيل
          متاحة عند الحاجة فقط.
        </div>
      </div>
    </div>
  );
}

