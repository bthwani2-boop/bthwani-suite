// SHEIN Proxy Request Schedule - CONTROL PANEL Admin
// PATCH /api/dsh/proxy-request/:id/schedule
'use client';

import React, { useState } from 'react';
import { BTHWANI_COLORS, DirectionalIcon } from '@bthwani/ui-kit';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  requestId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SheinProxyRequestSchedule: React.FC<Props> = ({ requestId, onSuccess, onCancel }) => {
  const { t } = useI18n();
  const router = useRouter();
  const isModal = Boolean(onSuccess || onCancel);
  const [etaDays, setEtaDays] = useState('7');
  const [expectedPickupDate, setExpectedPickupDate] = useState('');
  const [expectedPickupWindow, setExpectedPickupWindow] = useState('09:00-17:00');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const days = Number(etaDays);
    if (!Number.isInteger(days) || days < 1) {
      setError(t('surfaces.أدخل_عدد_أيام_التوصيل_صحيحاً_1_أو_أك'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await rawFetch(`/api/dsh/proxy-request/${encodeURIComponent(requestId)}/schedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etaDays: days,
          expectedPickupDate: expectedPickupDate.trim() || undefined,
          expectedPickupWindow: expectedPickupWindow.trim() || undefined,
          scheduleNotes: scheduleNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 400);
      } else {
        setTimeout(() => router.push('/operations/dsh/sheinproxy'), 1500);
      }
    } catch (err: any) {
      setError(err?.message || t('surfaces.فشل_في_جدولة_الاستلام'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: isModal ? 0 : '0 auto', padding: '24px' }}>
      {!isModal && (
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: 'none',
            backgroundColor: 'transparent', cursor: 'pointer', color: BTHWANI_COLORS.info, marginBottom: '24px',
          }}
        >
          <DirectionalIcon icon={ArrowLeft} mirrorInRTL={true} style={{ width: '16px', height: '16px' }}  />
          العودة
        </button>
      )}
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Calendar style={{ width: '22px', height: '22px' }} />
        جدولة استلام الطلب {requestId}
      </h2>
      {success && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: BTHWANI_COLORS.successSubtle, borderRadius: '8px', color: BTHWANI_COLORS.onSuccess }}>
          تم جدولة الاستلام بنجاح. جاري العودة للقائمة...
        </div>
      )}
      {error && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: BTHWANI_COLORS.dangerLight, borderRadius: '8px', color: BTHWANI_COLORS.dangerDark }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>عدد أيام التوصيل المتوقعة *</label>
          <input
            type="number"
            min="1"
            value={etaDays}
            onChange={(e) => setEtaDays(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>تاريخ الاستلام المتوقع</label>
          <input
            type="date"
            value={expectedPickupDate}
            onChange={(e) => setExpectedPickupDate(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>نافذة وقت الاستلام</label>
          <input
            type="text"
            value={expectedPickupWindow}
            onChange={(e) => setExpectedPickupWindow(e.target.value)}
            placeholder="09:00-17:00"
            style={{ width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>ملاحظات الجدولة</label>
          <textarea
            value={scheduleNotes}
            onChange={(e) => setScheduleNotes(e.target.value)}
            rows={3}
            placeholder={t('web.control panel.operations.dsh.shein-proxy.shein-proxy-request-schedule.customerOrLogisticsNotes')}
            style={{ width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 24px', backgroundColor: submitting ? BTHWANI_COLORS.gray400 : BTHWANI_COLORS.teal, color: 'white', border: 'none',
              borderRadius: '6px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '600',
            }}
          >
            {submitting ? 'جاري الحفظ...' : t('surfaces.جدولة_الاستلام')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '12px 24px', backgroundColor: BTHWANI_COLORS.surfaceVariant, color: BTHWANI_COLORS.onPrimaryContainer, border: '1px solid ' + BTHWANI_COLORS.gray300,
                borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              }}
            >
              إلغاء
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SheinProxyRequestSchedule;

