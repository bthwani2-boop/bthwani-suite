'use client';

/**
 * CONTROL PANEL Admin — ترشيحات المتاجر (DSH)
 * GET /api/dsh/operations/store-nominations
 * POST .../operations/store-nominations/:id/approve | reject
 */
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { Store, Check, X, RefreshCw } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

function getApiBase(): string {
  if (typeof window === 'undefined') return '';
  const base =
    process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || '';
  return (base || '').replace(/\/+$/, '');
}

interface Nomination {
  id: string;
  partnerId?: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export function McpwStoreNominationsScreen() {
  const { t } = useI18n();
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setError(null);
    try {
      const base = getApiBase();
      const url = base
        ? `${base}/api/dsh/operations/store-nominations?status=${filter}`
        : `/api/dsh/operations/store-nominations?status=${filter}`;
      const res = await rawFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success)
        throw new Error(json?.error || 'فشل في تحميل القائمة');
      setNominations(
        Array.isArray(json?.data?.nominations) ? json.data.nominations : []
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : t('web.control panel.admin.McpwStoreNominationsScreen.errorLoadMessage')
      );
      setNominations([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    fetchList();
  }, [fetchList]);

  const handleApprove = useCallback(
    async (id: string) => {
      setActioningId(id);
      try {
        const base = getApiBase();
        const url = base
          ? `${base}/api/dsh/operations/store-nominations/${encodeURIComponent(id)}/approve`
          : `/api/dsh/operations/store-nominations/${encodeURIComponent(id)}/approve`;
        const res = await rawFetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'فشل في الموافقة');
        await fetchList();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : t('web.control panel.admin.McpwStoreNominationsScreen.errorMessage')
        );
      } finally {
        setActioningId(null);
      }
    },
    [fetchList]
  );

  const handleReject = useCallback(
    async (id: string) => {
      if (!confirm(t('surfaces.هل_أنت_متأكد_من_رفض_هذا_الترشيح؟'))) return;
      setActioningId(id);
      try {
        const base = getApiBase();
        const url = base
          ? `${base}/api/dsh/operations/store-nominations/${encodeURIComponent(id)}/reject`
          : `/api/dsh/operations/store-nominations/${encodeURIComponent(id)}/reject`;
        const res = await rawFetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: t('surfaces.رفض_من_لوحة_التحكم') }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'فشل في الرفض');
        await fetchList();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : t('web.control panel.admin.McpwStoreNominationsScreen.errorMessage_95')
        );
      } finally {
        setActioningId(null);
      }
    },
    [fetchList]
  );

  const statusLabel = (s: string) =>
    s === 'pending'
      ? t('web.control panel.admin.McpwStoreNominationsScreen.underReview')
      : s === 'approved'
        ? t('web.control panel.admin.McpwStoreNominationsScreen.rejected')
        : t('web.control panel.admin.McpwStoreNominationsScreen.rejected');
  const statusColor = (s: string) =>
    s === 'pending'
      ? semanticRoles.accent
      : s === 'approved'
        ? BTHWANI_COLORS.onSuccess
        : semanticRoles.stateError?.icon || BTHWANI_COLORS.danger;

  return (
    <div className='w-full'>
      <div
        className='mb-6 pb-4 border-b flex flex-wrap items-center justify-between gap-4'
        style={{ borderColor: semanticRoles.border }}
      >
        <div className='flex items-center gap-3'>
          <div
            className='p-2 rounded-lg'
            style={{
              backgroundColor: `${semanticRoles.accent}20`,
              color: semanticRoles.accent,
            }}
          >
            <Store className='h-6 w-6' strokeWidth={2} />
          </div>
          <div>
            <h1
              className='text-2xl font-bold'
              style={{ color: semanticRoles.text }}
            >
              ترشيحات المتاجر
            </h1>
            <p
              className='text-sm mt-1'
              style={{ color: semanticRoles.textSecondary }}
            >
              عرض وموافقة/رفض ترشيحات متاجر الشريك (DSH)
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Link
            href='/admin'
            className='text-sm font-medium px-4 py-2 rounded-lg border'
            style={{
              borderColor: semanticRoles.border,
              color: semanticRoles.text,
            }}
          >
            ← الإدارة
          </Link>
          <button
            type='button'
            onClick={() => {
              setLoading(true);
              void fetchList();
            }}
            disabled={loading}
            className='flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border'
            style={{
              borderColor: semanticRoles.border,
              color: semanticRoles.accent,
            }}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as 'pending' | 'all')}
            className='text-sm border rounded-lg px-3 py-2'
            style={{
              borderColor: semanticRoles.border,
              color: semanticRoles.text,
              backgroundColor: semanticRoles.surface,
            }}
          >
            <option value='pending'>قيد المراجعة فقط</option>
            <option value='all'>الكل</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          className='mb-4 p-4 rounded-lg border'
          style={{
            backgroundColor:
              semanticRoles.stateError?.background ||
              BTHWANI_COLORS.warningSubtle,
            borderColor: semanticRoles.border,
          }}
        >
          <p
            style={{
              color: semanticRoles.stateError?.icon || BTHWANI_COLORS.danger,
            }}
          >
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <div
          className='py-12 text-center'
          style={{ color: semanticRoles.textSecondary }}
        >
          جاري التحميل...
        </div>
      ) : nominations.length === 0 ? (
        <div
          className='py-12 text-center rounded-lg border'
          style={{
            borderColor: semanticRoles.border,
            color: semanticRoles.textSecondary,
          }}
        >
          لا توجد ترشيحات {filter === 'pending' ? 'قيد المراجعة' : ''}.
        </div>
      ) : (
        <div className='space-y-4'>
          {nominations.map(n => (
            <div
              key={n.id}
              className='rounded-lg p-5 border flex flex-wrap items-start justify-between gap-4'
              style={{
                backgroundColor: semanticRoles.surface,
                borderColor: semanticRoles.border,
              }}
            >
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <span
                    className='font-semibold'
                    style={{ color: semanticRoles.text }}
                  >
                    {n.name}
                  </span>
                  <span
                    className='text-xs font-medium px-2 py-0.5 rounded'
                    style={{
                      backgroundColor: `${statusColor(n.status)}20`,
                      color: statusColor(n.status),
                    }}
                  >
                    {statusLabel(n.status)}
                  </span>
                </div>
                <p
                  className='text-sm mt-1'
                  style={{ color: semanticRoles.textSecondary }}
                >
                  {n.address}
                </p>
                {(n.phone || n.email) && (
                  <p
                    className='text-xs mt-1'
                    style={{ color: semanticRoles.textSecondary }}
                  >
                    {[n.phone, n.email].filter(Boolean).join(' · ')}
                  </p>
                )}
                {n.createdAt && (
                  <p
                    className='text-xs mt-1 opacity-80'
                    style={{ color: semanticRoles.textSecondary }}
                  >
                    {new Date(n.createdAt).toLocaleString('ar-SA')}
                  </p>
                )}
              </div>
              {n.status === 'pending' && (
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    onClick={() => handleApprove(n.id)}
                    disabled={actioningId !== null}
                    className='flex items-center gap-1 px-4 py-2 rounded-lg text-white text-sm font-medium'
                    style={{ backgroundColor: BTHWANI_COLORS.onSuccess }}
                  >
                    <Check className='h-4 w-4' /> موافقة
                  </button>
                  <button
                    type='button'
                    onClick={() => handleReject(n.id)}
                    disabled={actioningId !== null}
                    className='flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium'
                    style={{
                      borderColor:
                        semanticRoles.stateError?.icon || BTHWANI_COLORS.danger,
                      color:
                        semanticRoles.stateError?.icon || BTHWANI_COLORS.danger,
                    }}
                  >
                    <X className='h-4 w-4' /> رفض
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

