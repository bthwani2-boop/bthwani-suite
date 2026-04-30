// SHEIN Proxy: تقدير السعر + إرسال العرض في نموذج واحد — لا إدخال مزدوج
// PATCH estimate ثم PATCH offer. السعر النهائي = منتج + شحن + توصيل للبيت + رسوم خدمة

'use client';

import React, { useState, useMemo } from 'react';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';

import { useRouter } from 'next/navigation';
import { DollarSign, Send } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  requestId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SheinProxyRequestEstimateAndOffer: React.FC<Props> = ({ requestId, onSuccess, onCancel }) => {
  const { t } = useI18n();
  const router = useRouter();
  const isModal = Boolean(onSuccess || onCancel);

  const [productPrice, setProductPrice] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [homeDeliveryCost, setHomeDeliveryCost] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [productTitle, setProductTitle] = useState('');
  const [offerNotes, setOfferNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const product = Number(productPrice) || 0;
  const shipping = Number(shippingCost) || 0;
  const homeDelivery = Number(homeDeliveryCost) || 0;
  const fee = Number(serviceFee) || 0;
  const finalPrice = useMemo(() => product + shipping + homeDelivery + fee, [product, shipping, homeDelivery, fee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!productTitle.trim()) {
      setError(t('surfaces.أدخل_عنوان_المنتج'));
      return;
    }
    if (product < 0 || shipping < 0 || homeDelivery < 0 || fee < 0) {
      setError(t('surfaces.القيم_الرقمية_يجب_أن_تكون_غير_سالبة'));
      return;
    }
    setSubmitting(true);
    try {
      const base = `/api/dsh/proxy-request/${encodeURIComponent(requestId)}`;
      const resEst = await rawFetch(`${base}/estimate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productPrice: product,
          shippingCost: shipping,
          homeDeliveryCost: homeDelivery,
          serviceFee: fee,
          finalPrice,
          currency: currency.trim() || 'USD',
        }),
      });
      const dataEst = await resEst.json();
      if (!resEst.ok) throw new Error(dataEst?.error || `تقدير: ${resEst.status}`);

      const resOffer = await rawFetch(`${base}/offer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: productTitle.trim(),
          offerNotes: offerNotes.trim() || undefined,
          finalPrice,
          currency: currency.trim() || 'USD',
        }),
      });
      const dataOffer = await resOffer.json();
      if (!resOffer.ok) throw new Error(dataOffer?.error || `عرض: ${resOffer.status}`);

      setSuccess(true);
      if (onSuccess) setTimeout(onSuccess, 400);
      else setTimeout(() => router.push('/operations/dsh/sheinproxy'), 1200);
    } catch (err: any) {
      setError(err?.message || t('surfaces.فشل_في_حفظ_التقدير_أو_إرسال_العرض'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' };

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
          العودة
        </button>
      )}
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <DollarSign style={{ width: '22px', height: '22px' }} />
        <Send style={{ width: '20px', height: '20px' }} />
        تقدير السعر وإرسال العرض — {requestId}
      </h2>
      {success && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: BTHWANI_COLORS.successSubtle, borderRadius: '8px', color: BTHWANI_COLORS.onSuccess }}>
          تم التقدير وإرسال العرض بنجاح.
        </div>
      )}
      {error && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: BTHWANI_COLORS.dangerLight, borderRadius: '8px', color: BTHWANI_COLORS.dangerDark }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={labelStyle}>سعر المنتج</label>
          <input type="number" step="0.01" min="0" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>تكلفة الشحن</label>
          <input type="number" step="0.01" min="0" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>تكلفة التوصيل للبيت</label>
          <input type="number" step="0.01" min="0" value={homeDeliveryCost} onChange={(e) => setHomeDeliveryCost(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>رسوم الخدمة</label>
          <input type="number" step="0.01" min="0" value={serviceFee} onChange={(e) => setServiceFee(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>السعر النهائي (تلقائي)</label>
          <input type="text" readOnly value={finalPrice.toFixed(2)} style={{ ...inputStyle, backgroundColor: BTHWANI_COLORS.background, color: BTHWANI_COLORS.textDark }} />
        </div>
        <div>
          <label style={labelStyle}>العملة</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputStyle}>
            <option value="USD">USD</option>
            <option value="YER">YER</option>
            <option value="SAR">SAR</option>
          </select>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid ' + BTHWANI_COLORS.borderSubtle }} />
        <div>
          <label style={labelStyle}>عنوان المنتج *</label>
          <input type="text" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} placeholder={t('web.control panel.operations.dsh.shein-proxy.shein-proxy-request-estimate-and-offer.sheinProductName')} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>ملاحظات العرض</label>
          <textarea value={offerNotes} onChange={(e) => setOfferNotes(e.target.value)} rows={2} placeholder={t('web.control panel.operations.dsh.shein-proxy.shein-proxy-request-estimate-and-offer.customerNotes')} style={inputStyle} />
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
            {submitting ? t('surfaces.جاري_الحفظ_والإرسال') : t('surfaces.تقدير_السعر_وإرسال_العرض')}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ padding: '12px 24px', backgroundColor: BTHWANI_COLORS.surfaceVariant, color: BTHWANI_COLORS.onPrimaryContainer, border: '1px solid ' + BTHWANI_COLORS.gray300, borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              إلغاء
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SheinProxyRequestEstimateAndOffer;

