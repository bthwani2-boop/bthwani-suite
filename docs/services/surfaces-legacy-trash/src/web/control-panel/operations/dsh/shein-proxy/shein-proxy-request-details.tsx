// SHEIN Proxy Request Details - CONTROL PANEL Admin Interface (within DSH operations)
// Surface: CONTROL PANEL | Service: dsh
// Detailed view of individual SHEIN proxy request

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Calendar, DollarSign } from 'lucide-react';
import { BTHWANI_COLORS, DirectionalIcon } from '@bthwani/ui-kit';

interface Props {
  requestId?: string;
}

export const SheinProxyRequestDetails: React.FC<Props> = ({ requestId = 'SR-001' }) => {
  const [state, setState] = useState<'loading' | 'content' | 'error'>('loading');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setState('content'), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'UNDER_REVIEW': return BTHWANI_COLORS.amber;
      case 'PRICE_ESTIMATED': return BTHWANI_COLORS.info;
      case 'OFFER_SENT': return BTHWANI_COLORS.emerald;
      case 'WAITING_CUSTOMER_APPROVAL': return BTHWANI_COLORS.violet;
      case 'APPROVED': return BTHWANI_COLORS.emeraldDark;
      case 'SCHEDULED_PICKUP': return BTHWANI_COLORS.teal;
      case 'CANCELLED': return BTHWANI_COLORS.danger;
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  if (state === 'loading') {
    return (
      <div style={{ padding: '24px', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div style={{
            width: '32px',
            height: '32px',
            border: '4px solid ' + BTHWANI_COLORS.surfaceVariant,
            borderTop: '4px solid ' + BTHWANI_COLORS.info,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ fontSize: '18px' }}>جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: BTHWANI_COLORS.info
          }}
        >
          <DirectionalIcon icon={ArrowLeft} mirrorInRTL={true} style={{ width: '16px', height: '16px' }}  />
          العودة
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag style={{ width: '24px', height: '24px' }} />
          تفاصيل الطلب {requestId}
        </h1>
        <span
          style={{
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: getStatusColor('OFFER_SENT')
          }}
        >
          تم إرسال العرض
        </span>
      </div>

      <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: BTHWANI_COLORS.background, borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>معلومات الطلب</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: BTHWANI_COLORS.onPrimaryContainer }}>رابط المنتج:</label>
            <p style={{ fontSize: '14px', color: BTHWANI_COLORS.info, marginTop: '4px' }}>https://shein.com/women-dress-123456.html</p>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: BTHWANI_COLORS.onPrimaryContainer }}>الكمية:</label>
            <p style={{ fontSize: '14px', color: BTHWANI_COLORS.textDark, marginTop: '4px' }}>2</p>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: BTHWANI_COLORS.onPrimaryContainer }}>المقاس/اللون:</label>
            <p style={{ fontSize: '14px', color: BTHWANI_COLORS.textDark, marginTop: '4px' }}>L - Black</p>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: BTHWANI_COLORS.onPrimaryContainer }}>تاريخ الإنشاء:</label>
            <p style={{ fontSize: '14px', color: BTHWANI_COLORS.textDark, marginTop: '4px' }}>27 فبراير 2026</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: BTHWANI_COLORS.successSubtle, borderRadius: '8px', border: '1px solid ' + BTHWANI_COLORS.successLight }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign style={{ width: '20px', height: '20px' }} />
          العرض المقدم
        </h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: BTHWANI_COLORS.onPrimaryContainer }}>عنوان المنتج:</label>
            <p style={{ fontSize: '14px', color: BTHWANI_COLORS.textDark, marginTop: '4px' }}>فستان نسائي أنيق</p>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: BTHWANI_COLORS.onPrimaryContainer }}>السعر النهائي:</label>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: BTHWANI_COLORS.emeraldDark, marginTop: '4px' }}>
              45.99 USD
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', backgroundColor: BTHWANI_COLORS.background, borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>الإجراءات</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: BTHWANI_COLORS.violet,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            جدولة الاستلام
          </button>
        </div>
      </div>
    </div>
  );
};

export default SheinProxyRequestDetails;

