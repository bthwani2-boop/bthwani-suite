// CONTROL PANEL | Service: dsh | Operation: PUT /api/dsh/operations/peak-mode — وضع الذروة (السماح بعدة طلبات للكابتن)
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

function getApiBase(): string {
  if (typeof window === 'undefined') return '';
  const base = process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || '';
  return base.replace(/\/+$/, '');
}

export function DshPeakModeScreen() {
  const { t } = useI18n();
  const [multiOrderAllowed, setMultiOrderAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    setError(null);
    try {
      const base = getApiBase();
      const url = base ? `${base}/api/dsh/operations/peak-mode` : '/api/dsh/operations/peak-mode';
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json?.success && json?.data?.multiOrderAllowed !== undefined) {
        setMultiOrderAllowed(json.data.multiOrderAllowed === true);
      }
    } catch (e) {
      setError(t('surfaces.تعذر_تحميل_وضع_الذروة'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const handleToggle = useCallback(async () => {
    const next = !multiOrderAllowed;
    setSaving(true);
    setError(null);
    try {
      const base = getApiBase();
      const url = base ? `${base}/api/dsh/operations/peak-mode` : '/api/dsh/operations/peak-mode';
      const res = await rawFetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiOrderAllowed: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في الحفظ');
      setMultiOrderAllowed(next);
    } catch (e) {
      setError(t('surfaces.تعذر_تحديث_وضع_الذروة'));
    } finally {
      setSaving(false);
    }
  }, [multiOrderAllowed, t]);

  const cardStyle = {
    maxWidth: '560px',
    margin: '0 auto',
    padding: '24px',
    border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
    borderRadius: '8px',
    backgroundColor: BTHWANI_COLORS.surface,
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/operations/dsh" style={{ color: BTHWANI_COLORS.info, textDecoration: 'none', fontSize: '14px' }}>
          ← العودة لعمليات DSH
        </Link>
      </div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>وضع الذروة — السماح بعدة طلبات للكابتن</h1>
      <p style={{ color: BTHWANI_COLORS.onSurfaceMuted, marginBottom: '24px', fontSize: '14px' }}>
        عند التفعيل: يُسمح للكابتن بقبول أكثر من طلب (مع مراعاة القرب والمسار). عند الإلغاء: طلب واحد نشط فقط.
      </p>

      {loading ? (
        <div style={cardStyle}>جاري التحميل...</div>
      ) : (
        <div style={cardStyle}>
          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: BTHWANI_COLORS.warningSubtle, color: BTHWANI_COLORS.dangerDark, borderRadius: '8px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>السماح بعدة طلبات للكابتن (وضع الذروة)</div>
              <div style={{ fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted }}>
                {multiOrderAllowed ? t('surfaces.مفعّل_الكباتن_يمكنهم_رؤية_وقبول_أكثر') : t('surfaces.معطّل_طلب_واحد_نشط_لكل_كابتن')}
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              disabled={saving}
              style={{
                padding: '10px 20px',
                backgroundColor: multiOrderAllowed ? BTHWANI_COLORS.successGreen : BTHWANI_COLORS.info,
                color: BTHWANI_COLORS.surface,
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'جاري الحفظ...' : multiOrderAllowed ? t('surfaces.إلغاء_التفعيل') : t('surfaces.تفعيل_وضع_الذروة')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

