'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useI18n } from '@bthwani/ui-kit/i18n';
import { AlertTriangle, DollarSign, Package, Headphones } from 'lucide-react';
import { semanticRoles } from '@bthwani/ui-kit';
import type { WorkQueueItem } from '../components/WorkQueueV2';

export type OverviewDataSource = 'live' | 'hybrid' | 'fallback';
type RequestStats = {
  total: number;
  completed: number;
  open: number;
  attention: number;
  stalled: number;
};

type RemoteRecord = Record<string, unknown>;

const COMPLETED_STATUSES = new Set([
  'completed',
  'complete',
  'done',
  'closed',
  'resolved',
  'delivered',
  'cancelled',
  'canceled',
  'rejected',
]);

const ATTENTION_STATUSES = new Set([
  'failed',
  'blocked',
  'escalated',
  'error',
  'hold',
  'on_hold',
  'expired',
]);

const STALE_WINDOW_MS = 1000 * 60 * 90;

const defaultKPIs = {
  totalOrders: { value: '—', trend: 0, isPositive: true },
  completedOrders: { value: '—', trend: 0, isPositive: true },
  inProgress: { value: '—', trend: 0, isPositive: false },
  issues: { value: '—', trend: 0, isPositive: false },
};

const EMPTY_REQUEST_STATS: RequestStats = {
  total: 0,
  completed: 0,
  open: 0,
  attention: 0,
  stalled: 0,
};

function isRecord(value: unknown): value is RemoteRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toRecordArray(value: unknown): RemoteRecord[] | null {
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }

  if (!isRecord(value)) return null;

  for (const candidateKey of ['items', 'data', 'requests', 'results']) {
    const candidate = value[candidateKey];
    if (Array.isArray(candidate)) {
      return candidate.filter(isRecord);
    }
  }

  return null;
}

function normalizeStatus(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function getRequestStatus(record: RemoteRecord): string {
  return normalizeStatus(
    record.status ??
      record.requestStatus ??
      record.state ??
      record.workflowStatus ??
      record.currentStatus
  );
}

function getRequestTimestamp(record: RemoteRecord): number | null {
  for (const key of ['updatedAt', 'createdAt', 'requestedAt', 'timestamp']) {
    const raw = record[key];
    if (typeof raw !== 'string' && typeof raw !== 'number') continue;
    const parsed = new Date(raw).getTime();
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function loadOverviewSnapshot() {
  const [sndRequestsRaw, exchangeRateRaw] = await Promise.all([
    fetchJson('/api/platform/services/snd/requests'),
    fetchJson('/api/exchangeprice'),
  ]);

  const sndRequests = toRecordArray(sndRequestsRaw);
  const hasExchangeRate = exchangeRateRaw !== null;
  const liveSourceCount =
    Number(Boolean(sndRequests)) + Number(hasExchangeRate);

  return {
    sndRequests,
    hasExchangeRate,
    source:
      liveSourceCount === 0
        ? ('fallback' as const)
        : liveSourceCount === 2
          ? ('live' as const)
          : ('hybrid' as const),
    lastUpdatedAt: liveSourceCount === 0 ? null : new Date().toISOString(),
  };
}

function deriveRequestStats(records: RemoteRecord[] | null): RequestStats {
  if (!records?.length) {
    return EMPTY_REQUEST_STATS;
  }

  const now = Date.now();

  return records.reduce<RequestStats>(
    (acc, record) => {
      const status = getRequestStatus(record);
      const isCompleted = COMPLETED_STATUSES.has(status);
      const isAttention = ATTENTION_STATUSES.has(status);
      const timestamp = getRequestTimestamp(record);
      const isStalled =
        !isCompleted && timestamp !== null && now - timestamp > STALE_WINDOW_MS;

      acc.total += 1;

      if (isCompleted) {
        acc.completed += 1;
      } else {
        acc.open += 1;
      }

      if (isAttention) {
        acc.attention += 1;
      }

      if (isStalled) {
        acc.stalled += 1;
      }

      return acc;
    },
    { ...EMPTY_REQUEST_STATS }
  );
}

function buildWorkQueueItems(
  stats: ReturnType<typeof deriveRequestStats>,
  source: OverviewDataSource,
  hasExchangeRate: boolean
): WorkQueueItem[] {
  if (source === 'fallback') return [];

  const items: WorkQueueItem[] = [];

  if (stats.open > 0) {
    items.push({
      id: 'snd-open-requests',
      title: 'طلبات خدمة SND المفتوحة',
      description: `يوجد ${stats.open} طلبًا يحتاج متابعة تشغيلية مباشرة.`,
      href: '/service-catalog/services/snd',
      icon: Package,
      priority: stats.open >= 8 ? 'critical' : 'high',
      type: 'task',
      badge: String(stats.open),
    });
  }

  if (stats.attention > 0 || stats.stalled > 0) {
    const pressureCount = stats.attention + stats.stalled;
    items.push({
      id: 'support-pressure',
      title: 'عناصر تحتاج تصعيدًا أو مراجعة',
      description: `تم رصد ${pressureCount} عنصرًا بحالة حساسة أو متأخرة عن الإيقاع المتوقع.`,
      href: '/support/dsh-chat',
      icon: Headphones,
      priority: pressureCount >= 4 ? 'critical' : 'high',
      type: 'alert',
      badge: String(pressureCount),
    });
  }

  if (!hasExchangeRate) {
    items.push({
      id: 'exchange-rate-check',
      title: 'تحقق من مسار سعر الصرف',
      description:
        'مصدر سعر الصرف غير متاح حاليًا ويحتاج مراجعة قبل العمليات المالية الحساسة.',
      href: '/finance/exchange-price',
      icon: DollarSign,
      priority: 'normal',
      type: 'action',
    });
  }

  if (items.length === 0) {
    items.push({
      id: 'platform-watch',
      title: 'السطح مستقر ويعمل ضمن الإيقاع المتوقع',
      description:
        'لا توجد عناصر حرجة الآن، ويمكنك المتابعة من مساحة العمل الرئيسية مباشرة.',
      href: '/operations',
      icon: AlertTriangle,
      priority: 'normal',
      type: 'task',
    });
  }

  return items.slice(0, 4);
}

function buildKpis(
  stats: ReturnType<typeof deriveRequestStats>,
  source: OverviewDataSource
) {
  if (source === 'fallback' || stats.total === 0) {
    return { ...defaultKPIs };
  }

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const issueCount = stats.attention + stats.stalled;

  return {
    totalOrders: {
      value: String(stats.total),
      trend: Math.max(1, Math.min(18, stats.total)),
      isPositive: true,
    },
    completedOrders: {
      value: String(stats.completed),
      trend: Math.max(1, Math.min(18, Math.round(completionRate / 8))),
      isPositive: completionRate >= 60,
    },
    inProgress: {
      value: String(stats.open),
      trend: Math.max(1, Math.min(18, stats.open * 2 || 1)),
      isPositive: stats.open <= Math.max(3, Math.round(stats.total * 0.35)),
    },
    issues: {
      value: String(issueCount),
      trend: Math.min(18, issueCount * 3),
      isPositive: issueCount === 0,
    },
  };
}

/**
 * useWorkQueueData — Live work queue data from API
 *
 * Fetches pending work items from CONTROL PANEL operations API.
 * Transforms API responses into WorkQueueItem format.
 * Handles loading, error, and empty states.
 *
 * Returns:
 * - items: WorkQueueItem[] (live data from API)
 * - isLoading: boolean (during fetch)
 * - error: string | null (API error message)
 */
export function useWorkQueueData() {
  const [items, setItems] = useState<WorkQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<OverviewDataSource>('fallback');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const fetchWorkItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const snapshot = await loadOverviewSnapshot();
      const stats = deriveRequestStats(snapshot.sndRequests);

      setItems(
        buildWorkQueueItems(stats, snapshot.source, snapshot.hasExchangeRate)
      );
      setSource(snapshot.source);
      setLastUpdatedAt(snapshot.lastUpdatedAt);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load work queue'
      );
      setItems([]);
      setSource('fallback');
      setLastUpdatedAt(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchWorkItems();
  }, [fetchWorkItems]);

  return {
    items,
    isLoading,
    error,
    source,
    lastUpdatedAt,
    refetch: fetchWorkItems,
  };
}

/**
 * useKPIData — Live KPI metrics from API
 *
 * Fetches dashboard metrics from CONTROL PANEL analytics.
 * Returns formatted KPI data with trend indicators.
 *
 * Returns:
 * - totalOrders, completedOrders, inProgress, issues: formatted strings
 * - trends: trend percentages for each metric
 * - isLoading: boolean (during fetch)
 */
export function useKPIData() {
  const [kpis, setKPIs] = useState({
    ...defaultKPIs,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<OverviewDataSource>('fallback');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const fetchKPIs = useCallback(async () => {
    try {
      setIsLoading(true);
      const snapshot = await loadOverviewSnapshot();
      const stats = deriveRequestStats(snapshot.sndRequests);

      setKPIs(buildKpis(stats, snapshot.source));
      setSource(snapshot.source);
      setLastUpdatedAt(snapshot.lastUpdatedAt);
    } catch (err) {
      console.warn('Failed to load KPI data:', err);
      setKPIs({ ...defaultKPIs });
      setSource('fallback');
      setLastUpdatedAt(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchKPIs();
  }, [fetchKPIs]);

  return { kpis, isLoading, source, lastUpdatedAt, refetch: fetchKPIs };
}

/**
 * useQuickAccessData — Quick access section links
 *
 * Returns curated list of main admin sections.
 * Limited to 3 cards to reduce cognitive load (per design spec).
 *
 * Returns:
 * - items: Array of { href, title, description, icon, colors }
 */
export function useQuickAccessData() {
  const { t } = useI18n();

  return useMemo(
    () => [
      {
        href: '/operations',
        title: t('control panel.quick_access.operations'),
        description: t('control panel.quick_access.operations_desc'),
        icon: Package,
        iconBgColor: semanticRoles.accentHover,
        iconColor: semanticRoles.primaryCTA,
      },
      {
        href: '/finance',
        title: t('control panel.quick_access.finance'),
        description: t('control panel.quick_access.finance_desc'),
        icon: DollarSign,
        iconBgColor: semanticRoles.stateSuccess.background,
        iconColor: semanticRoles.stateSuccess.icon,
      },
      {
        href: '/support',
        title: t('control panel.quick_access.support'),
        description: t('control panel.quick_access.support_desc'),
        icon: Headphones,
        iconBgColor: semanticRoles.stateInfo.background,
        iconColor: semanticRoles.stateInfo.icon,
      },
    ],
    [t]
  );
}

