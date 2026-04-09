// CONTROL PANEL | Service: dsh | Operation: POST /api/dsh/deliveries/:deliveryId/reassign (decision — إعادة تعيين)
'use client';

import React, { useState, useCallback } from 'react';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';

import Link from 'next/link';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

export function DshDeliveryReassignScreen() {
  const { t, isRTL } = useI18n();
  const dir = isRTL ? 'rtl' : 'ltr';
  const reasons = React.useMemo(
    () => [
      { value: 'customer_request', label: t('web.control panel.operations.dsh.DshDeliveryReassignScreen.customerOrder') },
      { value: 'captain_unavailable', label: t('web.control panel.operations.dsh.DshDeliveryReassignScreen.captainUnavailable') },
      { value: 'traffic_issues', label: t('web.control panel.operations.dsh.DshDeliveryReassignScreen.trafficIssue') },
      { value: 'technical_issue', label: t('web.control panel.operations.dsh.DshDeliveryReassignScreen.technicalIssue') },
    ],
    [t]
  );
  const [deliveryId, setDeliveryId] = useState('');
  const [reason, setReason] = useState<string>(reasons[0].value);
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [notes, setNotes] = useState('');
  const [state, setState] = useState<'content' | 'loading' | 'error'>('content');
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async () => {
    const id = deliveryId.trim();
    if (!id) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      const res = await rawFetch(`/api/dsh/deliveries/${encodeURIComponent(id)}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, priority, notes: notes.trim() || undefined }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في إعادة التعيين');
      setSuccess(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [deliveryId, reason, priority, notes]);

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
  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid ' + BTHWANI_COLORS.borderSubtle,
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '12px',
    boxSizing: 'border-box' as const,
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

  if (state === 'loading') {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <p style={{ textAlign: 'center' }}>جاري إعادة التعيين...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={cardStyle}>
          <p style={{ color: BTHWANI_COLORS.danger, marginBottom: '16px' }}>فشل في إعادة التعيين</p>
          <button type="button" style={btnPrimary} onClick={handleRetry}>
            إعادة المحاولة
          </button>
          <Link href="/operations/dsh" style={btnSecondary}>
            العودة لعمليات DSH
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/operations/dsh" style={{ color: BTHWANI_COLORS.onSurfaceMuted, textDecoration: 'none', fontSize: '14px' }}>
          ← عمليات DSH
        </Link>
      </div>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>إعادة تعيين التوصيل</h1>
        <label style={labelStyle}>معرف التوصيل (deliveryId)</label>
        <input
          type="text"
          style={inputStyle}
          value={deliveryId}
          onChange={(e) => setDeliveryId(e.target.value)}
          placeholder="delivery_123..."
          dir={dir}
        />
        <label style={labelStyle}>السبب</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {reasons.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setReason(r.value)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${reason === r.value ? BTHWANI_COLORS.info : BTHWANI_COLORS.borderSubtle}`,
                borderRadius: '8px',
                backgroundColor: reason === r.value ? BTHWANI_COLORS.info : 'transparent',
                color: reason === r.value ? BTHWANI_COLORS.surface : BTHWANI_COLORS.onPrimaryContainer,
                cursor: 'pointer',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        <label style={labelStyle}>الأولوية</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setPriority('normal')}
            style={{
              flex: 1,
              padding: '12px',
              border: `1px solid ${priority === 'normal' ? BTHWANI_COLORS.info : BTHWANI_COLORS.borderSubtle}`,
              borderRadius: '8px',
              backgroundColor: priority === 'normal' ? BTHWANI_COLORS.info : 'transparent',
              color: priority === 'normal' ? BTHWANI_COLORS.surface : BTHWANI_COLORS.onPrimaryContainer,
              cursor: 'pointer',
            }}
          >
            عادية
          </button>
          <button
            type="button"
            onClick={() => setPriority('urgent')}
            style={{
              flex: 1,
              padding: '12px',
              border: `1px solid ${priority === 'urgent' ? BTHWANI_COLORS.info : BTHWANI_COLORS.borderSubtle}`,
              borderRadius: '8px',
              backgroundColor: priority === 'urgent' ? BTHWANI_COLORS.info : 'transparent',
              color: priority === 'urgent' ? BTHWANI_COLORS.surface : BTHWANI_COLORS.onPrimaryContainer,
              cursor: 'pointer',
            }}
          >
            عاجلة
          </button>
        </div>
        <label style={labelStyle}>ملاحظات (اختياري)</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('web.control panel.operations.dsh.DshDeliveryReassignScreen.notesPlaceholder')}
          dir={dir}
        />
        <button type="button" style={btnPrimary} onClick={() => void submit()} disabled={!deliveryId.trim()}>
          إعادة تعيين
        </button>
        {success && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: BTHWANI_COLORS.successSubtle, borderRadius: '8px' }}>
            تمت إعادة التعيين بنجاح
          </div>
        )}
        <Link href="/operations/dsh" style={{ ...btnSecondary, display: 'block', marginTop: '16px' }}>
          العودة لعمليات DSH
        </Link>
      </div>
    </div>
  );
}

