// CONTROL PANEL | Service: dsh | Operation: POST /api/dsh/zone/set — تعيين نطاق التوصيل
'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { BTHWANI_COLORS, useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

const MOCK_ZONES = [
  {
    id: '1',
    name: 'وسط الرياض',
    city: 'الرياض',
    deliveryFee: 0,
    estimatedTime: '20-30 دقيقة',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'شمال الرياض',
    city: 'الرياض',
    deliveryFee: 5,
    estimatedTime: '25-40 دقيقة',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'جنوب الرياض',
    city: 'الرياض',
    deliveryFee: 8,
    estimatedTime: '30-45 دقيقة',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'شرق الرياض',
    city: 'الرياض',
    deliveryFee: 6,
    estimatedTime: '25-35 دقيقة',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'غرب الرياض',
    city: 'الرياض',
    deliveryFee: 7,
    estimatedTime: '28-42 دقيقة',
    isAvailable: false,
  },
];

export function DshZoneSetScreen() {
  const { t } = useI18n();
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [state, setState] = useState<'content' | 'loading' | 'error'>(
    'content'
  );
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async () => {
    if (!selectedZoneId.trim()) {
      setState('error');
      return;
    }
    const zone = MOCK_ZONES.find(z => z.id === selectedZoneId);
    setState('loading');
    try {
      const res = await rawFetch('/api/dsh/zone/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId: selectedZoneId,
          zoneName: zone?.name ?? selectedZoneId,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في الحفظ');
      setSuccess(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [selectedZoneId]);

  const handleRetry = () => {
    setState('content');
    void submit();
  };

  const cardStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px',
    border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
    borderRadius: '8px',
    backgroundColor: BTHWANI_COLORS.surface,
    dir: 'rtl' as const,
  };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 500 };
  const btnPrimary = {
    padding: '12px 24px',
    backgroundColor: BTHWANI_COLORS.info,
    color: BTHWANI_COLORS.surface,
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  };
  const btnSecondary = {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: BTHWANI_COLORS.onPrimaryContainer,
    border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
    borderRadius: '8px',
    marginTop: '12px',
    cursor: 'pointer',
    textDecoration: 'none' as const,
    display: 'inline-block',
    textAlign: 'center' as const,
  };
  const zoneCard = (active: boolean, disabled: boolean) => ({
    padding: '16px',
    border: `1px solid ${active ? BTHWANI_COLORS.info : BTHWANI_COLORS.borderSubtle}`,
    borderRadius: '8px',
    marginBottom: '8px',
    backgroundColor: active
      ? BTHWANI_COLORS.infoSubtle
      : BTHWANI_COLORS.surface,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  });

  if (state === 'loading') {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <p style={{ textAlign: 'center' }}>جاري حفظ نطاق التوصيل...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={cardStyle}>
          <p style={{ color: BTHWANI_COLORS.danger, marginBottom: '16px' }}>
            فشل في حفظ نطاق التوصيل
          </p>
          <button type='button' style={btnPrimary} onClick={handleRetry}>
            إعادة المحاولة
          </button>
          <Link href='/operations/dsh' style={btnSecondary}>
            العودة لعمليات DSH
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link
          href='/operations/dsh'
          style={{
            color: BTHWANI_COLORS.onSurfaceMuted,
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          ← عمليات DSH
        </Link>
      </div>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>
          نطاق التوصيل
        </h1>
        <p
          style={{ color: BTHWANI_COLORS.onSurfaceMuted, marginBottom: '16px' }}
        >
          حدد المناطق التي يخدمها المتجر
        </p>
        <label style={labelStyle}>اختر المنطقة</label>
        <div style={{ marginBottom: '16px' }}>
          {MOCK_ZONES.map(z => (
            <div
              key={z.id}
              role='button'
              tabIndex={0}
              onClick={() => z.isAvailable && setSelectedZoneId(z.id)}
              onKeyDown={e =>
                z.isAvailable &&
                (e.key === 'Enter' || e.key === ' ') &&
                setSelectedZoneId(z.id)
              }
              style={zoneCard(selectedZoneId === z.id, !z.isAvailable)}
            >
              <div style={{ fontWeight: 600 }}>{z.name}</div>
              <div
                style={{
                  fontSize: '14px',
                  color: BTHWANI_COLORS.onSurfaceMuted,
                }}
              >
                {z.city} —{' '}
                {z.deliveryFee === 0
                  ? t('surfaces.مجاني')
                  : `${z.deliveryFee} ريال`}{' '}
                — {z.estimatedTime}
              </div>
            </div>
          ))}
        </div>
        <button
          type='button'
          style={btnPrimary}
          onClick={() => void submit()}
          disabled={!selectedZoneId}
        >
          حفظ النطاق
        </button>
        {success && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: BTHWANI_COLORS.successSubtle,
              borderRadius: '8px',
            }}
          >
            تم حفظ نطاق التوصيل بنجاح
          </div>
        )}
        <Link
          href='/operations/dsh'
          style={{ ...btnSecondary, display: 'block', marginTop: '16px' }}
        >
          العودة لعمليات DSH
        </Link>
      </div>
    </div>
  );
}

