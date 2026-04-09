'use client';

/**
 * MRF CONTROL PANEL — Unified operating page (single-page, decision-first).
 * Goal: one primary CTA + progressive disclosure; all MRF in CONTROL PANEL lives here.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useI18n, DirectionalIcon } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Clock,
  RefreshCw,
  Search,
  Send,
  Settings2,
} from 'lucide-react';
import {
  completeTaskSession,
  startTaskSession,
  trackMcpwTelemetry,
} from '../../../utils/mcpwTelemetry';

const VAR_SERVICE_ENABLED = 'VAR_SVC_MRF_ENABLED';
const VAR_REPORT_TTL_DAYS = 'VAR_MRF_REPORT_TTL_DAYS';
const VAR_MAX_ATTACHMENTS_PER_REPORT = 'VAR_MRF_MAX_ATTACHMENTS_PER_REPORT';
const VAR_SEARCH_RADIUS_KM = 'VAR_MRF_SEARCH_RADIUS_KM';
const VAR_MATCH_NOTIFICATION_ENABLED = 'VAR_MRF_MATCH_NOTIFICATION_ENABLED';

const I18N_NS = 'surfaces.mcpwMrfWorkspace';

type RuntimeVarResolveResponse = {
  key: string;
  resolved_value?: unknown;
  value?: unknown;
  source?: 'variable' | 'default' | 'fallback' | 'computed';
};

type RuntimeVarUpsertRequest = {
  key: string;
  value: boolean | string | number | object;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  category?: string;
};

type RuntimeVarUpsertResponse = {
  key: string;
  value: boolean | string | number | object;
  updated_at?: string;
  updated_by?: string;
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
): Promise<{ ok: boolean; data?: RuntimeVarUpsertResponse }> {
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
  if (!response.ok) return { ok: false };
  const data: RuntimeVarUpsertResponse = await response.json();
  return { ok: true, data };
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

type MrfReportListItem = {
  id?: string;
  report_id?: string;
  title?: string;
  description?: string;
  status?: 'active' | 'resolved' | 'closed';
  reportType?: 'missing' | 'found';
  report_type?: 'missing' | 'found';
  category?: string;
  createdAt?: string;
  created_at?: string;
  location?: { city?: string; region?: string };
};

type MrfReportsListResponse = {
  success?: boolean;
  data?: {
    items?: MrfReportListItem[];
    total?: number;
  };
  items?: MrfReportListItem[];
  total?: number;
};

async function loadReportsList(params: {
  status: 'active' | 'resolved' | 'closed';
  reportType?: 'missing' | 'found';
  limit: number;
}): Promise<{ items: MrfReportListItem[]; total?: number }> {
  const qs = new URLSearchParams();
  qs.set('status', params.status);
  qs.set('limit', String(params.limit));
  if (params.reportType) qs.set('reportType', params.reportType);

  const response = await fetch(`/api/mrf/reports?${qs.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: MrfReportsListResponse = await response.json();
  const items = (data?.data?.items ?? data?.items ?? []).filter(
    Boolean
  ) as MrfReportListItem[];
  const total = data?.data?.total ?? data?.total;
  return { items, total };
}

async function mrfReportsSearch(params: {
  query: string;
  status?: 'active' | 'resolved' | 'closed';
  reportType?: 'missing' | 'found';
  limit: number;
}): Promise<{ items: MrfReportListItem[]; total?: number }> {
  const qs = new URLSearchParams();
  qs.set('query', params.query);
  qs.set('limit', String(params.limit));
  if (params.status) qs.set('status', params.status);
  if (params.reportType) qs.set('reportType', params.reportType);

  const response = await fetch(`/api/mrf/reports/search?${qs.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: MrfReportsListResponse = await response.json();
  const items = (data?.data?.items ?? data?.items ?? []).filter(
    Boolean
  ) as MrfReportListItem[];
  const total = data?.data?.total ?? data?.total;
  return { items, total };
}

async function mrfReportCreate(body: {
  reportType: 'missing' | 'found';
  title: string;
  description: string;
  location?: { city?: string; region?: string };
  category?: string;
  attachments?: string[];
  lastSeenAt?: string;
}): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const response = await fetch('/api/mrf/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const txt = await response.text().catch(() => '');
    return { ok: false, error: txt || `HTTP ${response.status}` };
  }
  const data = await response.json().catch(() => null);
  return { ok: true, data };
}

async function mrfClaimGet(
  claimId: string
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const response = await fetch(
    `/api/mrf/claims/${encodeURIComponent(claimId)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  if (!response.ok) {
    const txt = await response.text().catch(() => '');
    return { ok: false, error: txt || `HTTP ${response.status}` };
  }
  const data = await response.json().catch(() => null);
  return { ok: true, data };
}

async function mrfMatchRespond(payload: {
  matchId: string;
  action: 'accept' | 'reject';
  message?: string;
}): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const response = await fetch(
    `/api/mrf/matches/${encodeURIComponent(payload.matchId)}/respond`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: payload.action,
        message: payload.message,
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

function safeId(r: MrfReportListItem, i: number): string {
  return String(r.id ?? r.report_id ?? `row-${i}`);
}

function normalizeReportType(r: MrfReportListItem): 'missing' | 'found' | '—' {
  const v = (r.reportType ?? r.report_type) as unknown;
  if (v === 'missing' || v === 'found') return v;
  return '—';
}

function normalizeStatus(
  r: MrfReportListItem
): 'active' | 'resolved' | 'closed' | '—' {
  const v = r.status as unknown;
  if (v === 'active' || v === 'resolved' || v === 'closed') return v;
  return '—';
}

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

function jsonPreview(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function McpwMrfWorkspacePage() {
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
  const [reportTtlDays, setReportTtlDays] = useState(90);
  const [maxAttachments, setMaxAttachments] = useState(5);
  const [searchRadiusKm, setSearchRadiusKm] = useState(25);
  const [matchNotifyEnabled, setMatchNotifyEnabled] = useState(true);

  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [reports, setReports] = useState<MrfReportListItem[]>([]);
  const [reportsTotal, setReportsTotal] = useState<number | undefined>(
    undefined
  );

  const [scopeMode, setScopeMode] = useState<
    'list' | 'search' | 'create' | 'claim' | 'match'
  >('list');

  // Search
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'active' | 'resolved' | 'closed'
  >('active');
  const [typeFilter, setTypeFilter] = useState<'missing' | 'found' | 'all'>(
    'all'
  );

  // Create
  const [createType, setCreateType] = useState<'missing' | 'found'>('missing');
  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createCity, setCreateCity] = useState('');
  const [createRegion, setCreateRegion] = useState('');
  const [createCategory, setCreateCategory] = useState('');

  // Claim
  const [claimId, setClaimId] = useState('');
  const [claimResult, setClaimResult] = useState<unknown>(null);

  // Match
  const [matchId, setMatchId] = useState('');
  const [matchAction, setMatchAction] = useState<'accept' | 'reject'>('accept');
  const [matchMessage, setMatchMessage] = useState('');
  const [matchResult, setMatchResult] = useState<unknown>(null);

  const primaryCta = useMemo(() => {
    if (!svcEnabled) {
      return {
        label: 'تفعيل MRF الآن',
        hint: 'لن تعمل عمليات MRF قبل التفعيل.',
        intent: 'enable' as const,
      };
    }
    return {
      label: 'فتح صندوق البلاغات',
      hint: 'عرض أحدث البلاغات النشطة مع افتراضات ذكية.',
      intent: 'openReports' as const,
    };
  }, [svcEnabled]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setViewError(null);
    setNotice(null);
    try {
      const result = await Promise.allSettled([
        resolveRuntimeVar(VAR_SERVICE_ENABLED),
        resolveRuntimeVar(VAR_REPORT_TTL_DAYS),
        resolveRuntimeVar(VAR_MAX_ATTACHMENTS_PER_REPORT),
        resolveRuntimeVar(VAR_SEARCH_RADIUS_KM),
        resolveRuntimeVar(VAR_MATCH_NOTIFICATION_ENABLED),
      ]);

      const values = result.map(item =>
        item.status === 'fulfilled' ? item.value : undefined
      );
      const [en, ttl, maxAtt, rad, notif] = values;

      setSvcEnabled(parseBool(en, true));
      setReportTtlDays(parseNumber(ttl, 90));
      setMaxAttachments(parseNumber(maxAtt, 5));
      setSearchRadiusKm(parseNumber(rad, 25));
      setMatchNotifyEnabled(parseBool(notif, true));

      setLastUpdatedLabel(new Date().toLocaleString());
    } catch {
      setViewError(
        txSafe('loadError', 'تعذر تحميل الصفحة الآن. حاول التحديث.')
      );
    } finally {
      setLoading(false);
    }
  }, [txSafe]);

  const loadDefaultReports = useCallback(async () => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const resp = await loadReportsList({
        status: 'active',
        reportType: undefined,
        limit: 20,
      });
      setReports(resp.items);
      setReportsTotal(resp.total);
    } catch (e) {
      setReports([]);
      setReportsTotal(undefined);
      setReportsError(
        e instanceof Error
          ? `تعذر تحميل البلاغات: ${e.message}`
          : 'تعذر تحميل البلاغات.'
      );
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!loading && svcEnabled) loadDefaultReports();
  }, [loading, svcEnabled, loadDefaultReports]);

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
        const resp = await upsertRuntimeVar(key, value, type, desc);
        if (!resp.ok) throw new Error('فشل الحفظ');
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
    startTaskSession('mrf_primary', { scope: 'mrf' });
    trackMcpwTelemetry('mrf.primary_action_click', {
      task_id: 'mrf_primary',
      click_target: 'primary_cta',
      intent: primaryCta.intent,
      svcEnabled,
      scopeMode,
    });
    if (primaryCta.intent === 'enable') {
      const prev = svcEnabled;
      setSvcEnabled(true);
      const ok = await saveRuntime(
        VAR_SERVICE_ENABLED,
        true,
        'boolean',
        'Enable/disable MRF service globally'
      );
      if (!ok) setSvcEnabled(prev);
      completeTaskSession('mrf_primary', ok ? 'success' : 'fail', {
        scope: 'mrf',
      });
      return;
    }

    setScopeMode('list');
    try {
      await loadDefaultReports();
      completeTaskSession('mrf_primary', 'success', { scope: 'mrf' });
      const el = document.getElementById('mrf-reports-block');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      completeTaskSession('mrf_primary', 'fail', { scope: 'mrf' });
    }
  }, [
    primaryCta.intent,
    loadDefaultReports,
    saveRuntime,
    scopeMode,
    svcEnabled,
  ]);

  const canCreate =
    createTitle.trim().length > 0 && createDesc.trim().length > 0;
  const hasFormDraft =
    createTitle.trim().length > 0 ||
    createDesc.trim().length > 0 ||
    createCity.trim().length > 0 ||
    createRegion.trim().length > 0 ||
    createCategory.trim().length > 0 ||
    claimId.trim().length > 0 ||
    matchId.trim().length > 0 ||
    matchMessage.trim().length > 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as any).__MCPW_UNSAVED_CHANGES__ = Boolean(saving || hasFormDraft);
    return () => {
      (window as any).__MCPW_UNSAVED_CHANGES__ = false;
    };
  }, [hasFormDraft, saving]);

  const clickMap = useMemo(
    () => ({
      before: {
        openReports: 3,
        createReport: 4,
        respondMatch: 4,
        getClaim: 4,
      },
      after: {
        openReports: 1,
        createReport: 2,
        respondMatch: 2,
        getClaim: 2,
      },
    }),
    []
  );

  return (
    <div
      className='w-full min-h-screen p-6 sm:p-8'
      style={{
        background: `linear-gradient(180deg, ${semanticRoles.surfaceSubtle} 0%, ${semanticRoles.surface} 55%, ${semanticRoles.surfaceSubtle} 100%)`,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <div className='max-w-6xl mx-auto'>
        <div
          className='mb-6 rounded-3xl border p-5 sm:p-6'
          style={{
            background: `radial-gradient(1000px 400px at 90% -20%, ${semanticRoles.accent}22 0%, transparent 60%), ${semanticRoles.surface}`,
            borderColor: semanticRoles.border,
            boxShadow: `0 24px 60px -40px rgba(0,0,0,0.35)`,
          }}
        >
          <div className='flex items-start justify-between gap-4'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 mb-2'>
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
                  MRF
                </span>
              </div>
              <h1
                className='text-2xl sm:text-3xl font-bold'
                style={{ color: semanticRoles.text }}
              >
                تشغيل MRF (المفقودات والمطالبات)
              </h1>
              <p
                className='mt-2 text-sm sm:text-base'
                style={{ color: semanticRoles.textMuted }}
              >
                صفحة تشغيل موحّدة: حالة + إعدادات حية + صندوق البلاغات + إجراءات
                أساسية بنقرة واحدة.
              </p>
            </div>

            <div className='shrink-0 flex items-center gap-2'>
              <button
                type='button'
                onClick={() => loadAll()}
                className='inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border'
                style={{
                  background: semanticRoles.surface,
                  borderColor: semanticRoles.border,
                  color: semanticRoles.text,
                }}
                disabled={loading || saving}
              >
                <RefreshCw size={16} />
                تحديث
              </button>
            </div>
          </div>

          {viewError && (
            <div
              className='mt-4 rounded-2xl border p-4'
              style={{
                background: semanticRoles.stateError.background,
                borderColor: semanticRoles.border,
                color: semanticRoles.stateError.text,
              }}
            >
              {viewError}
            </div>
          )}
        </div>

        <div className='mb-6 grid gap-3 md:grid-cols-3'>
          <div
            className='rounded-2xl border p-4'
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
                  حالة الخدمة
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  {svcEnabled ? (
                    <>
                      <CheckCircle2
                        size={18}
                        color={semanticRoles.stateSuccess.icon}
                      />
                      <span
                        className='font-bold'
                        style={{ color: semanticRoles.text }}
                      >
                        مفعّلة
                      </span>
                      <CompactPill label='جاهزة للتشغيل' tone='ok' />
                    </>
                  ) : (
                    <>
                      <CircleAlert
                        size={18}
                        color={semanticRoles.stateError.icon}
                      />
                      <span
                        className='font-bold'
                        style={{ color: semanticRoles.text }}
                      >
                        متوقفة
                      </span>
                      <CompactPill label='لن تعمل العمليات' tone='danger' />
                    </>
                  )}
                </div>
              </div>

              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='sr-only'
                  checked={svcEnabled}
                  onChange={async () => {
                    const next = !svcEnabled;
                    const prev = svcEnabled;
                    setSvcEnabled(next);
                    const ok = await saveRuntime(
                      VAR_SERVICE_ENABLED,
                      next,
                      'boolean',
                      'Enable/disable MRF service globally'
                    );
                    if (!ok) setSvcEnabled(prev);
                  }}
                  disabled={loading || saving}
                />
                <div
                  className='relative inline-block w-12 h-6 rounded-full transition-colors'
                  style={{
                    backgroundColor: svcEnabled
                      ? semanticRoles.stateSuccess.icon
                      : semanticRoles.border,
                    opacity: loading || saving ? 0.6 : 1,
                  }}
                >
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      svcEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </label>
            </div>
            <div
              className='mt-3 text-xs'
              style={{ color: semanticRoles.textMuted }}
            >
              آخر تحديث: {lastUpdatedLabel}
            </div>
          </div>

          <div
            className='rounded-2xl border p-4'
            style={{
              background: semanticRoles.surface,
              borderColor: semanticRoles.border,
            }}
          >
            <div className='flex items-center justify-between gap-3'>
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                CTA واحد واضح
              </div>
              <Clock size={16} color={semanticRoles.textMuted} />
            </div>
            <div
              className='mt-3 text-sm font-bold'
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
            <button
              type='button'
              onClick={handlePrimary}
              className='mt-3 w-full rounded-xl px-3 py-2.5 text-sm font-bold'
              style={{
                background: semanticRoles.primaryCTA,
                color: semanticRoles.primaryCTAText,
              }}
              disabled={loading || saving}
            >
              {primaryCta.label}
            </button>
          </div>

          <div
            className='rounded-2xl border p-4'
            style={{
              background: semanticRoles.surface,
              borderColor: semanticRoles.border,
            }}
          >
            <div className='flex items-center justify-between gap-3'>
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                دليل قابل للقياس (النقرات)
              </div>
              <Settings2 size={16} color={semanticRoles.textMuted} />
            </div>
            <div className='mt-3 grid grid-cols-2 gap-2'>
              <div
                className='rounded-xl border p-2.5'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-[11px] font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  فتح البلاغات
                </div>
                <div
                  className='mt-1 text-sm font-bold'
                  style={{ color: semanticRoles.text }}
                >
                  {clickMap.before.openReports} → {clickMap.after.openReports}
                </div>
              </div>
              <div
                className='rounded-xl border p-2.5'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-[11px] font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  إنشاء بلاغ
                </div>
                <div
                  className='mt-1 text-sm font-bold'
                  style={{ color: semanticRoles.text }}
                >
                  {clickMap.before.createReport} → {clickMap.after.createReport}
                </div>
              </div>
              <div
                className='rounded-xl border p-2.5'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-[11px] font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  رد مطابقة
                </div>
                <div
                  className='mt-1 text-sm font-bold'
                  style={{ color: semanticRoles.text }}
                >
                  {clickMap.before.respondMatch} → {clickMap.after.respondMatch}
                </div>
              </div>
              <div
                className='rounded-xl border p-2.5'
                style={{ borderColor: semanticRoles.border }}
              >
                <div
                  className='text-[11px] font-semibold'
                  style={{ color: semanticRoles.textMuted }}
                >
                  جلب مطالبة
                </div>
                <div
                  className='mt-1 text-sm font-bold'
                  style={{ color: semanticRoles.text }}
                >
                  {clickMap.before.getClaim} → {clickMap.after.getClaim}
                </div>
              </div>
            </div>
            <div
              className='mt-2 text-[11px]'
              style={{ color: semanticRoles.textMuted }}
            >
              “بعد” = CTA واحد + إفصاح تدريجي داخل الصفحة.
            </div>
          </div>
        </div>

        <div
          className='mb-6 rounded-3xl border p-4 sm:p-5'
          style={{
            background: semanticRoles.surface,
            borderColor: semanticRoles.border,
          }}
        >
          <div className='flex items-center justify-between gap-3'>
            <div className='min-w-0'>
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                إعدادات MRF الحية (Runtime Vars)
              </div>
              <div
                className='mt-1 text-sm font-bold'
                style={{ color: semanticRoles.text }}
              >
                Smart Defaults + حدود آمنة
              </div>
            </div>
            <div className='text-xs' style={{ color: semanticRoles.textMuted }}>
              {notice ?? '—'}
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
                TTL للبلاغات (أيام)
              </div>
              <div className='mt-2 flex items-center gap-2'>
                <input
                  type='number'
                  min={7}
                  max={365}
                  value={reportTtlDays}
                  onChange={e =>
                    setReportTtlDays(parseNumber(e.target.value, 90))
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
                      VAR_REPORT_TTL_DAYS,
                      reportTtlDays,
                      'number',
                      'Report time-to-live in days (auto-delete expired reports)'
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
                افتراضي: 90 — يحد من تضخم البيانات تلقائيًا.
              </div>
            </div>

            <div
              className='rounded-2xl border p-3'
              style={{ borderColor: semanticRoles.border }}
            >
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                أقصى مرفقات لكل بلاغ
              </div>
              <div className='mt-2 flex items-center gap-2'>
                <input
                  type='number'
                  min={0}
                  max={20}
                  value={maxAttachments}
                  onChange={e =>
                    setMaxAttachments(parseNumber(e.target.value, 5))
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
                      VAR_MAX_ATTACHMENTS_PER_REPORT,
                      maxAttachments,
                      'number',
                      'Maximum attachments per report'
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
                افتراضي: 5 — حماية من الإساءة/التضخم.
              </div>
            </div>

            <div
              className='rounded-2xl border p-3'
              style={{ borderColor: semanticRoles.border }}
            >
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                نصف قطر البحث الافتراضي (كم)
              </div>
              <div className='mt-2 flex items-center gap-2'>
                <input
                  type='number'
                  min={0}
                  max={100}
                  value={searchRadiusKm}
                  onChange={e =>
                    setSearchRadiusKm(parseNumber(e.target.value, 25))
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
                      VAR_SEARCH_RADIUS_KM,
                      searchRadiusKm,
                      'number',
                      'Default search radius in kilometers for location-based search'
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
                افتراضي: 25 كم — يبقي البحث سريعًا وواضحًا.
              </div>
            </div>

            <div
              className='rounded-2xl border p-3'
              style={{ borderColor: semanticRoles.border }}
            >
              <div
                className='text-xs font-semibold'
                style={{ color: semanticRoles.textMuted }}
              >
                إشعارات المطابقات
              </div>
              <div className='mt-2 flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <CompactPill
                    label={matchNotifyEnabled ? 'مفعّلة' : 'متوقفة'}
                    tone={matchNotifyEnabled ? 'ok' : 'warn'}
                  />
                  <span
                    className='text-xs'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    {matchNotifyEnabled
                      ? 'إرسال إشعارات عند المطابقة'
                      : 'بدون إشعارات'}
                  </span>
                </div>
                <button
                  type='button'
                  onClick={async () => {
                    const next = !matchNotifyEnabled;
                    const prev = matchNotifyEnabled;
                    setMatchNotifyEnabled(next);
                    const ok = await saveRuntime(
                      VAR_MATCH_NOTIFICATION_ENABLED,
                      next ? 1 : 0,
                      'number',
                      'Enable/disable match notification emails'
                    );
                    if (!ok) setMatchNotifyEnabled(prev);
                  }}
                  className='h-10 rounded-xl px-3 text-sm font-bold border'
                  style={{
                    background: semanticRoles.surfaceSubtle,
                    color: semanticRoles.text,
                    borderColor: semanticRoles.border,
                  }}
                  disabled={loading || saving}
                >
                  تبديل
                </button>
              </div>
              <div
                className='mt-2 text-[11px]'
                style={{ color: semanticRoles.textMuted }}
              >
                ({VAR_MATCH_NOTIFICATION_ENABLED})
              </div>
            </div>
          </div>
        </div>

        <div className='mb-3 flex flex-wrap items-center gap-2'>
          {(
            [
              {
                id: 'list',
                label: 'صندوق البلاغات',
                icon: <Clock size={16} />,
              },
              { id: 'search', label: 'بحث', icon: <Search size={16} /> },
              { id: 'create', label: 'إنشاء بلاغ', icon: <Send size={16} /> },
              { id: 'claim', label: 'جلب مطالبة', icon: <Search size={16} /> },
              { id: 'match', label: 'رد مطابقة', icon: <Send size={16} /> },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setScopeMode(tab.id)}
              className='inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold border'
              style={{
                background:
                  scopeMode === tab.id
                    ? semanticRoles.primaryCTA
                    : semanticRoles.surface,
                color:
                  scopeMode === tab.id
                    ? semanticRoles.primaryCTAText
                    : semanticRoles.text,
                borderColor: semanticRoles.border,
              }}
              disabled={loading}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id='mrf-reports-block'
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
                عمليات MRF (5 عمليات ضمن النطاق)
              </div>
              <div
                className='mt-1 text-lg font-bold'
                style={{ color: semanticRoles.text }}
              >
                {scopeMode === 'list'
                  ? 'أحدث البلاغات'
                  : scopeMode === 'search'
                    ? 'بحث متقدم'
                    : scopeMode === 'create'
                      ? 'إنشاء بلاغ'
                      : scopeMode === 'claim'
                        ? 'جلب مطالبة'
                        : 'رد على مطابقة'}
              </div>
              <div
                className='mt-1 text-xs'
                style={{ color: semanticRoles.textMuted }}
              >
                CTA واحد واضح + إفصاح تدريجي حسب المهمة.
              </div>
            </div>
            <button
              type='button'
              onClick={() => {
                if (scopeMode === 'list') loadDefaultReports();
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

          {!svcEnabled && (
            <div
              className='mt-4 rounded-2xl border p-4'
              style={{
                background: semanticRoles.stateWarning.background,
                borderColor: semanticRoles.border,
                color: semanticRoles.stateWarning.text,
              }}
            >
              الخدمة متوقفة. فعّل `VAR_SVC_MRF_ENABLED` لتعمل العمليات.
            </div>
          )}

          {scopeMode === 'list' && (
            <div className='mt-4'>
              {reportsError && (
                <div
                  className='mb-3 rounded-2xl border p-3 text-sm'
                  style={{
                    background: semanticRoles.stateError.background,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.stateError.text,
                  }}
                >
                  {reportsError}
                </div>
              )}

              <div className='flex flex-wrap items-center gap-2 mb-3'>
                <CompactPill label={`الحالة: ${statusFilter}`} tone='info' />
                <CompactPill label={`النوع: ${typeFilter}`} tone='neutral' />
                <CompactPill
                  label={`المعروض: ${reports.length}${typeof reportsTotal === 'number' ? ` / ${reportsTotal}` : ''}`}
                  tone='neutral'
                />
              </div>

              <div className='grid gap-2'>
                {reportsLoading ? (
                  <div
                    className='py-8 text-center text-sm'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    جاري التحميل…
                  </div>
                ) : reports.length === 0 ? (
                  <div className='py-10 text-center'>
                    <div
                      className='text-sm font-bold'
                      style={{ color: semanticRoles.text }}
                    >
                      لا توجد بلاغات للعرض
                    </div>
                    <div
                      className='mt-1 text-xs'
                      style={{ color: semanticRoles.textMuted }}
                    >
                      استخدم “بحث” أو “إنشاء بلاغ” — بنفس الصفحة.
                    </div>
                    <button
                      type='button'
                      onClick={() => setScopeMode('create')}
                      className='mt-3 rounded-xl px-3 py-2 text-sm font-bold'
                      style={{
                        background: semanticRoles.primaryCTA,
                        color: semanticRoles.primaryCTAText,
                      }}
                      disabled={!svcEnabled}
                    >
                      إنشاء بلاغ الآن
                    </button>
                  </div>
                ) : (
                  reports.map((r, i) => {
                    const status = normalizeStatus(r);
                    const rType = normalizeReportType(r);
                    const title = r.title ?? '—';
                    const subtitle =
                      r.location?.city ||
                      r.location?.region ||
                      r.category ||
                      '—';
                    const created = r.createdAt ?? r.created_at ?? '';
                    return (
                      <div
                        key={safeId(r, i)}
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
                                {title}
                              </div>
                              <CompactPill
                                label={status}
                                tone={
                                  status === 'active'
                                    ? 'ok'
                                    : status === 'resolved'
                                      ? 'info'
                                      : status === 'closed'
                                        ? 'warn'
                                        : 'neutral'
                                }
                              />
                              <CompactPill label={rType} tone='neutral' />
                            </div>
                            <div
                              className='mt-1 text-xs truncate'
                              style={{ color: semanticRoles.textMuted }}
                            >
                              {subtitle}
                              {created ? ` • ${created}` : ''}
                            </div>
                          </div>
                          <button
                            type='button'
                            onClick={() => {
                              const id = String(r.id ?? r.report_id ?? '');
                              if (id) {
                                navigator.clipboard
                                  ?.writeText(id)
                                  .catch(() => undefined);
                                setNotice(`تم نسخ Report ID: ${id}`);
                              } else {
                                setNotice(
                                  'لا يوجد معرّف قابل للنسخ في هذا العنصر.'
                                );
                              }
                            }}
                            className='shrink-0 rounded-xl px-3 py-2 text-xs font-bold border'
                            style={{
                              borderColor: semanticRoles.border,
                              background: semanticRoles.surfaceSubtle,
                              color: semanticRoles.text,
                            }}
                          >
                            نسخ ID
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {scopeMode === 'search' && (
            <div className='mt-4'>
              <div className='grid gap-2 md:grid-cols-[1fr_160px_160px_120px]'>
                <input
                  type='search'
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder='ابحث (كلمتان على الأقل)…'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                >
                  <option value='active'>active</option>
                  <option value='resolved'>resolved</option>
                  <option value='closed'>closed</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value as any)}
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                >
                  <option value='all'>all</option>
                  <option value='missing'>missing</option>
                  <option value='found'>found</option>
                </select>
                <button
                  type='button'
                  onClick={async () => {
                    trackMcpwTelemetry('mrf.search_click', {
                      task_id: 'mrf_search',
                      click_target: 'search_button',
                      statusFilter,
                      typeFilter,
                    });
                    startTaskSession('mrf_search', { scope: 'mrf' });
                    setReportsLoading(true);
                    setReportsError(null);
                    try {
                      const term = q.trim();
                      if (term.length < 2)
                        throw new Error('اكتب على الأقل حرفين.');
                      const resp = await mrfReportsSearch({
                        query: term,
                        status: statusFilter,
                        reportType:
                          typeFilter === 'all'
                            ? undefined
                            : (typeFilter as any),
                        limit: 20,
                      });
                      setReports(resp.items);
                      setReportsTotal(resp.total);
                      setScopeMode('list');
                      setNotice(
                        'تم تنفيذ البحث وعرض النتائج في صندوق البلاغات.'
                      );
                      completeTaskSession('mrf_search', 'success', {
                        scope: 'mrf',
                      });
                    } catch (e) {
                      completeTaskSession('mrf_search', 'fail', {
                        scope: 'mrf',
                      });
                      setReportsError(
                        e instanceof Error ? e.message : 'تعذر البحث.'
                      );
                    } finally {
                      setReportsLoading(false);
                    }
                  }}
                  className='h-11 rounded-2xl px-3 text-sm font-bold'
                  style={{
                    background: semanticRoles.primaryCTA,
                    color: semanticRoles.primaryCTAText,
                  }}
                  disabled={
                    !svcEnabled || reportsLoading || q.trim().length < 2
                  }
                >
                  بحث
                </button>
              </div>
              <div
                className='mt-2 text-[11px]'
                style={{ color: semanticRoles.textMuted }}
              >
                Smart default: حالة {statusFilter} + limit=20. نصف القطر
                الافتراضي يُدار عبر {VAR_SEARCH_RADIUS_KM}.
              </div>
            </div>
          )}

          {scopeMode === 'create' && (
            <div className='mt-4'>
              <div className='grid gap-2 md:grid-cols-2'>
                <div
                  className='rounded-2xl border p-3'
                  style={{ borderColor: semanticRoles.border }}
                >
                  <div
                    className='text-xs font-semibold'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    نوع البلاغ
                  </div>
                  <div className='mt-2 flex items-center gap-2'>
                    <button
                      type='button'
                      onClick={() => setCreateType('missing')}
                      className='rounded-full px-3 py-2 text-sm font-bold border'
                      style={{
                        background:
                          createType === 'missing'
                            ? semanticRoles.primaryCTA
                            : semanticRoles.surface,
                        color:
                          createType === 'missing'
                            ? semanticRoles.primaryCTAText
                            : semanticRoles.text,
                        borderColor: semanticRoles.border,
                      }}
                      disabled={!svcEnabled}
                    >
                      مفقود
                    </button>
                    <button
                      type='button'
                      onClick={() => setCreateType('found')}
                      className='rounded-full px-3 py-2 text-sm font-bold border'
                      style={{
                        background:
                          createType === 'found'
                            ? semanticRoles.primaryCTA
                            : semanticRoles.surface,
                        color:
                          createType === 'found'
                            ? semanticRoles.primaryCTAText
                            : semanticRoles.text,
                        borderColor: semanticRoles.border,
                      }}
                      disabled={!svcEnabled}
                    >
                      موجود
                    </button>
                  </div>
                </div>

                <div
                  className='rounded-2xl border p-3'
                  style={{ borderColor: semanticRoles.border }}
                >
                  <div
                    className='text-xs font-semibold'
                    style={{ color: semanticRoles.textMuted }}
                  >
                    تصنيف/موقع (اختياري)
                  </div>
                  <div className='mt-2 grid grid-cols-2 gap-2'>
                    <input
                      value={createCity}
                      onChange={e => setCreateCity(e.target.value)}
                      placeholder='مدينة'
                      className='h-10 rounded-xl border px-3 text-sm font-semibold outline-none'
                      style={{
                        borderColor: semanticRoles.border,
                        background: semanticRoles.surface,
                        color: semanticRoles.text,
                      }}
                      disabled={!svcEnabled}
                    />
                    <input
                      value={createRegion}
                      onChange={e => setCreateRegion(e.target.value)}
                      placeholder='منطقة'
                      className='h-10 rounded-xl border px-3 text-sm font-semibold outline-none'
                      style={{
                        borderColor: semanticRoles.border,
                        background: semanticRoles.surface,
                        color: semanticRoles.text,
                      }}
                      disabled={!svcEnabled}
                    />
                  </div>
                  <input
                    value={createCategory}
                    onChange={e => setCreateCategory(e.target.value)}
                    placeholder='تصنيف (مثال: هاتف، محفظة، وثائق)'
                    className='mt-2 h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none'
                    style={{
                      borderColor: semanticRoles.border,
                      background: semanticRoles.surface,
                      color: semanticRoles.text,
                    }}
                    disabled={!svcEnabled}
                  />
                </div>
              </div>

              <div className='mt-2 grid gap-2'>
                <input
                  value={createTitle}
                  onChange={e => setCreateTitle(e.target.value)}
                  placeholder='عنوان البلاغ (إجباري)'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <textarea
                  value={createDesc}
                  onChange={e => setCreateDesc(e.target.value)}
                  placeholder='وصف مختصر (إجباري)'
                  className='min-h-[120px] rounded-2xl border px-3 py-3 text-sm font-semibold outline-none'
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
                  قيود: TTL={reportTtlDays} يوم، MaxAttachments={maxAttachments}
                  .
                </div>
                <button
                  type='button'
                  onClick={async () => {
                    trackMcpwTelemetry('mrf.create_click', {
                      task_id: 'mrf_create',
                      click_target: 'create_button',
                      createType,
                    });
                    startTaskSession('mrf_create', {
                      scope: 'mrf',
                      createType,
                    });
                    setSaving(true);
                    setNotice(null);
                    try {
                      const resp = await mrfReportCreate({
                        reportType: createType,
                        title: createTitle.trim(),
                        description: createDesc.trim(),
                        category: createCategory.trim() || undefined,
                        location:
                          createCity.trim() || createRegion.trim()
                            ? {
                                city: createCity.trim() || undefined,
                                region: createRegion.trim() || undefined,
                              }
                            : undefined,
                        attachments: [],
                      });
                      if (!resp.ok)
                        throw new Error(resp.error || 'فشل إنشاء البلاغ.');
                      setNotice('تم إنشاء البلاغ بنجاح.');
                      setCreateTitle('');
                      setCreateDesc('');
                      await loadDefaultReports();
                      setScopeMode('list');
                      completeTaskSession('mrf_create', 'success', {
                        scope: 'mrf',
                        createType,
                      });
                    } catch (e) {
                      completeTaskSession('mrf_create', 'fail', {
                        scope: 'mrf',
                        createType,
                      });
                      setNotice(
                        e instanceof Error ? e.message : 'تعذر إنشاء البلاغ.'
                      );
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className='rounded-2xl px-4 py-3 text-sm font-bold'
                  style={{
                    background: semanticRoles.primaryCTA,
                    color: semanticRoles.primaryCTAText,
                    opacity: canCreate ? 1 : 0.6,
                  }}
                  disabled={!svcEnabled || !canCreate || saving}
                >
                  إنشاء (نقرة واحدة)
                </button>
              </div>
            </div>
          )}

          {scopeMode === 'claim' && (
            <div className='mt-4'>
              <div className='grid gap-2 md:grid-cols-[1fr_160px]'>
                <input
                  value={claimId}
                  onChange={e => setClaimId(e.target.value)}
                  placeholder='Claim ID…'
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
                    trackMcpwTelemetry('mrf.claim_click', {
                      task_id: 'mrf_claim_get',
                      click_target: 'claim_get_button',
                    });
                    startTaskSession('mrf_claim_get', { scope: 'mrf' });
                    setSaving(true);
                    setNotice(null);
                    setClaimResult(null);
                    try {
                      const id = claimId.trim();
                      if (!id) throw new Error('أدخل Claim ID.');
                      const resp = await mrfClaimGet(id);
                      if (!resp.ok)
                        throw new Error(resp.error || 'تعذر جلب المطالبة.');
                      setClaimResult(resp.data);
                      setNotice('تم جلب المطالبة.');
                      completeTaskSession('mrf_claim_get', 'success', {
                        scope: 'mrf',
                      });
                    } catch (e) {
                      completeTaskSession('mrf_claim_get', 'fail', {
                        scope: 'mrf',
                      });
                      setNotice(
                        e instanceof Error ? e.message : 'تعذر جلب المطالبة.'
                      );
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
              {claimResult !== null && (
                <pre
                  className='mt-3 rounded-2xl border p-3 text-xs overflow-auto'
                  style={{
                    background: semanticRoles.surfaceSubtle,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                  }}
                >
                  {jsonPreview(claimResult)}
                </pre>
              )}
            </div>
          )}

          {scopeMode === 'match' && (
            <div className='mt-4'>
              <div className='grid gap-2 md:grid-cols-[1fr_160px_160px]'>
                <input
                  value={matchId}
                  onChange={e => setMatchId(e.target.value)}
                  placeholder='Match ID…'
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                />
                <select
                  value={matchAction}
                  onChange={e => setMatchAction(e.target.value as any)}
                  className='h-11 rounded-2xl border px-3 text-sm font-semibold outline-none'
                  style={{
                    borderColor: semanticRoles.border,
                    background: semanticRoles.surface,
                    color: semanticRoles.text,
                  }}
                  disabled={!svcEnabled}
                >
                  <option value='accept'>accept</option>
                  <option value='reject'>reject</option>
                </select>
                <button
                  type='button'
                  onClick={async () => {
                    trackMcpwTelemetry('mrf.match_respond_click', {
                      task_id: 'mrf_match_respond',
                      click_target: 'match_respond_button',
                      action: matchAction,
                    });
                    startTaskSession('mrf_match_respond', {
                      scope: 'mrf',
                      action: matchAction,
                    });
                    setSaving(true);
                    setNotice(null);
                    setMatchResult(null);
                    try {
                      const id = matchId.trim();
                      if (!id) throw new Error('أدخل Match ID.');
                      const resp = await mrfMatchRespond({
                        matchId: id,
                        action: matchAction,
                        message: matchMessage.trim() || undefined,
                      });
                      if (!resp.ok)
                        throw new Error(resp.error || 'تعذر إرسال الرد.');
                      setMatchResult(resp.data);
                      setNotice('تم إرسال الرد على المطابقة.');
                      completeTaskSession('mrf_match_respond', 'success', {
                        scope: 'mrf',
                        action: matchAction,
                      });
                    } catch (e) {
                      completeTaskSession('mrf_match_respond', 'fail', {
                        scope: 'mrf',
                        action: matchAction,
                      });
                      setNotice(
                        e instanceof Error ? e.message : 'تعذر إرسال الرد.'
                      );
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
                  إرسال
                </button>
              </div>
              <textarea
                value={matchMessage}
                onChange={e => setMatchMessage(e.target.value)}
                placeholder='ملاحظة (اختياري)…'
                className='mt-2 min-h-[90px] w-full rounded-2xl border px-3 py-3 text-sm font-semibold outline-none'
                style={{
                  borderColor: semanticRoles.border,
                  background: semanticRoles.surface,
                  color: semanticRoles.text,
                }}
                disabled={!svcEnabled}
              />
              <div
                className='mt-2 text-[11px]'
                style={{ color: semanticRoles.textMuted }}
              >
                إشعارات المطابقة: {matchNotifyEnabled ? 'مفعّلة' : 'متوقفة'} (
                {VAR_MATCH_NOTIFICATION_ENABLED})
              </div>
              {matchResult !== null && (
                <pre
                  className='mt-3 rounded-2xl border p-3 text-xs overflow-auto'
                  style={{
                    background: semanticRoles.surfaceSubtle,
                    borderColor: semanticRoles.border,
                    color: semanticRoles.text,
                  }}
                >
                  {jsonPreview(matchResult)}
                </pre>
              )}
            </div>
          )}
        </div>

        <div
          className='mt-6 text-[11px]'
          style={{ color: semanticRoles.textMuted }}
        >
          هذه الصفحة تربط عمليات MRF الرسمية: `GET/POST /api/mrf/reports`, `GET
          /api/mrf/reports/search`, `GET /api/mrf/claims/:claim_id`, `POST
          /api/mrf/matches/:match_id/respond`.
        </div>
      </div>
    </div>
  );
}

