// SHEIN Proxy Request Offer - CONTROL PANEL Admin
// PATCH /api/dsh/proxy-request/:id/offer
'use client';

import React, { useState } from 'react';
import { BTHWANI_COLORS, DirectionalIcon } from '@bthwani/ui-kit';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  requestId: string;
  /** من التقدير — تعبئة تلقائية */
  initialFinalPrice?: number;
  initialCurrency?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SheinProxyRequestOffer: React.FC<Props> = ({
  requestId,
  initialFinalPrice,
  initialCurrency,
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const isModal = Boolean(onSuccess || onCancel);
  const [productTitle, setProductTitle] = useState('');
  const [offerNotes, setOfferNotes] = useState('');
  const [finalPrice, setFinalPrice] = useState(
    initialFinalPrice != null ? String(initialFinalPrice) : ''
  );
  const [currency, setCurrency] = useState(initialCurrency ?? 'USD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const price = Number(finalPrice);
    if (!productTitle.trim()) {
      setError('أدخل عنوان المنتج');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError(t('surfaces.أدخل_السعر_النهائي_صحيحاً'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await rawFetch(`/api/dsh/proxy-request/${encodeURIComponent(requestId)}/offer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: productTitle.trim(),
          offerNotes: offerNotes.trim() || undefined,
          finalPrice: price,
          currency: currency.trim() || 'USD',
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
      setError(err?.message || t('surfaces.فشل_في_إرسال_العرض'));
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
        <Send style={{ width: '22px', height: '22px' }} />
        إرسال عرض للطلب {requestId}
      </h2>
      {success && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: BTHWANI_COLORS.successSubtle, borderRadius: '8px', color: BTHWANI_COLORS.onSuccess }}>
          تم إرسال العرض بنجاح. جاري العودة للقائمة...
        </div>
      )}
      {error && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: BTHWANI_COLORS.dangerLight, borderRadius: '8px', color: BTHWANI_COLORS.dangerDark }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>عنوان المنتج *</label>
          <input
            type="text"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            placeholder={t('web.control panel.operations.dsh.shein-proxy.shein-proxy-request-offer.sheinProductName')}
            style={{ width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>ملاحظات العرض</label>
          <textarea
            value={offerNotes}
            onChange={(e) => setOfferNotes(e.target.value)}
            rows={3}
            placeholder={t('web.control panel.operations.dsh.shein-proxy.shein-proxy-request-offer.customerNotes')}
            style={{ width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>السعر النهائي *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>العملة</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' }}
          >
            <option value="USD">USD</option>
            <option value="YER">YER</option>
            <option value="SAR">SAR</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 24px', backgroundColor: submitting ? BTHWANI_COLORS.gray400 : BTHWANI_COLORS.emeraldDark, color: 'white', border: 'none',
              borderRadius: '6px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '600',
            }}
          >
            {submitting ? 'جاري الإرسال...' : t('surfaces.إرسال_العرض')}
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

export default SheinProxyRequestOffer;

