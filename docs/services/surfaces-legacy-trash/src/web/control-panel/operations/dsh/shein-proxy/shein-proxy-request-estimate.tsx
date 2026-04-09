// SHEIN Proxy Request Estimate - CONTROL PANEL Admin
// PATCH /api/dsh/proxy-request/:id/estimate
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { BTHWANI_COLORS, DirectionalIcon, useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  requestId: string;
  /** When provided (e.g. modal), call instead of navigating back */
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SheinProxyRequestEstimate: React.FC<Props> = ({
  requestId,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const { t } = useI18n();
  const isModal = Boolean(onSuccess || onCancel);
  const [productPrice, setProductPrice] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [homeDeliveryCost, setHomeDeliveryCost] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const product = Number(productPrice) || 0;
  const shipping = Number(shippingCost) || 0;
  const homeDelivery = Number(homeDeliveryCost) || 0;
  const fee = Number(serviceFee) || 0;
  const finalPrice = product + shipping + homeDelivery + fee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (product < 0 || shipping < 0 || homeDelivery < 0 || fee < 0) {
      setError('القيم الرقمية يجب أن تكون غير سالبة');
      return;
    }
    setSubmitting(true);
    try {
      const res = await rawFetch(
        `/api/dsh/proxy-request/${encodeURIComponent(requestId)}/estimate`,
        {
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
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 400);
      } else {
        setTimeout(() => router.push('/operations/dsh/sheinproxy'), 1500);
      }
    } catch (err: any) {
      setError(err?.message || t('surfaces.فشل_في_حفظ_التقدير'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '560px',
        margin: isModal ? 0 : '0 auto',
        padding: '24px',
      }}
    >
      {!isModal && (
        <button
          type='button'
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: BTHWANI_COLORS.info,
            marginBottom: '24px',
          }}
        >
          <DirectionalIcon
            icon={ArrowLeft}
            mirrorInRTL={true}
            style={{ width: '16px', height: '16px' }}
          />
          العودة
        </button>
      )}
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        <DollarSign style={{ width: '22px', height: '22px' }} />
        تقدير سعر الطلب {requestId}
      </h2>
      {success && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: BTHWANI_COLORS.successSubtle,
            borderRadius: '8px',
            color: BTHWANI_COLORS.onSuccess,
          }}
        >
          تم حفظ التقدير بنجاح. جاري العودة للقائمة...
        </div>
      )}
      {error && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: BTHWANI_COLORS.dangerLight,
            borderRadius: '8px',
            color: BTHWANI_COLORS.dangerDark,
          }}
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '6px',
            }}
          >
            سعر المنتج
          </label>
          <input
            type='number'
            step='0.01'
            min='0'
            value={productPrice}
            onChange={e => setProductPrice(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid ' + BTHWANI_COLORS.gray300,
              borderRadius: '6px',
            }}
            required
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '6px',
            }}
          >
            تكلفة الشحن
          </label>
          <input
            type='number'
            step='0.01'
            min='0'
            value={shippingCost}
            onChange={e => setShippingCost(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid ' + BTHWANI_COLORS.gray300,
              borderRadius: '6px',
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '6px',
            }}
          >
            تكلفة التوصيل للبيت
          </label>
          <input
            type='number'
            step='0.01'
            min='0'
            value={homeDeliveryCost}
            onChange={e => setHomeDeliveryCost(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid ' + BTHWANI_COLORS.gray300,
              borderRadius: '6px',
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '6px',
            }}
          >
            رسوم الخدمة
          </label>
          <input
            type='number'
            step='0.01'
            min='0'
            value={serviceFee}
            onChange={e => setServiceFee(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid ' + BTHWANI_COLORS.gray300,
              borderRadius: '6px',
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '6px',
            }}
          >
            السعر النهائي (تلقائي)
          </label>
          <input
            type='text'
            readOnly
            value={finalPrice.toFixed(2)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid ' + BTHWANI_COLORS.gray300,
              borderRadius: '6px',
              backgroundColor: BTHWANI_COLORS.background,
              color: BTHWANI_COLORS.textDark,
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '6px',
            }}
          >
            العملة
          </label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid ' + BTHWANI_COLORS.gray300,
              borderRadius: '6px',
            }}
          >
            <option value='USD'>USD</option>
            <option value='YER'>YER</option>
            <option value='SAR'>SAR</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type='submit'
            disabled={submitting}
            style={{
              padding: '12px 24px',
              backgroundColor: submitting
                ? BTHWANI_COLORS.gray400
                : BTHWANI_COLORS.info,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {submitting ? 'جاري الحفظ...' : t('surfaces.حفظ_التقدير')}
          </button>
          {onCancel && (
            <button
              type='button'
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                backgroundColor: BTHWANI_COLORS.surfaceVariant,
                color: BTHWANI_COLORS.onPrimaryContainer,
                border: '1px solid ' + BTHWANI_COLORS.gray300,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
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

export default SheinProxyRequestEstimate;

