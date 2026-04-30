// SHEIN Proxy Requests List - CONTROL PANEL Admin Interface (within DSH operations)
// Surface: CONTROL PANEL | Service: dsh
// Single screen: list + modal for estimate/offer/schedule — minimal clicks

'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { SheinProxyRequestEstimateAndOffer } from './shein-proxy-request-estimate-and-offer';
import { SheinProxyRequestOffer } from './shein-proxy-request-offer';
import { SheinProxyRequestSchedule } from './shein-proxy-request-schedule';
import { BTHWANI_COLORS, useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface SheinProxyRequest {
  requestId: string;
  status: string;
  createdAt: string;
  productUrl: string;
  quantity: number;
  sizeColor?: string;
  notes?: string;
  pricing?: {
    productPrice?: number;
    shippingCost?: number;
    homeDeliveryCost?: number;
    serviceFee?: number;
    finalPrice?: number;
    currency?: string;
  };
  offer?: {
    finalPrice: number;
    currency: string;
  };
  pickup?: {
    expectedPickupDate: string;
    expectedPickupWindow: string;
  };
}

interface Props {
  navigation?: { navigate: (screen: string, params?: any) => void };
}

type ActionModal =
  | { type: 'estimateAndOffer'; requestId: string }
  | { type: 'offer'; requestId: string; finalPrice?: number; currency?: string }
  | { type: 'schedule'; requestId: string };

export const SheinProxyRequestsList: React.FC<Props> = () => {
  const { isRTL, t } = useI18n();
  const [state, setState] = useState<'loading' | 'content' | 'error'>('loading');
  const [requests, setRequests] = useState<SheinProxyRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<ActionModal | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const handleReject = async (requestId: string) => {
    if (!confirm(t('surfaces.هل_تريد_إلغاء_هذا_الطلب؟'))) return;
    setRejectingId(requestId);
    try {
      const res = await rawFetch(`/api/dsh/proxy-request/${encodeURIComponent(requestId)}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      await loadRequests();
    } catch (err) {
      console.error(err);
      alert('فشل في إلغاء الطلب');
    } finally {
      setRejectingId(null);
    }
  };

  const loadRequests = async () => {
    try {
      setState('loading');

      // Same-origin request so Next.js rewrites to backend (avoids CORS and CSP connect-src)
      const url =
        typeof window !== 'undefined'
          ? '/api/dsh/proxy-request'
          : (() => {
              let baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
              if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
              return `${baseUrl}/api/dsh/proxy-request`;
            })();

      const response = await rawFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data = Array.isArray(result?.data) ? result.data : [];
      setRequests(data);
      setState('content');
    } catch (error) {
      console.error('Failed to load SHEIN proxy requests:', error);
      setState('error');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const closeModalAndRefresh = () => {
    setActionModal(null);
    loadRequests();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'UNDER_REVIEW': return BTHWANI_COLORS.amber; // amber
      case 'PRICE_ESTIMATED': return BTHWANI_COLORS.info; // blue
      case 'OFFER_SENT': return BTHWANI_COLORS.emerald; // green
      case 'WAITING_CUSTOMER_APPROVAL': return BTHWANI_COLORS.violet; // violet
      case 'APPROVED': return BTHWANI_COLORS.emeraldDark; // emerald
      case 'SCHEDULED_PICKUP': return BTHWANI_COLORS.teal; // teal
      case 'DELIVERED': return BTHWANI_COLORS.emeraldDark; // emerald
      case 'CANCELLED': return BTHWANI_COLORS.danger; // red
      default: return BTHWANI_COLORS.onSurfaceMuted; // gray
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'UNDER_REVIEW': 'قيد المراجعة',
      'PRICE_ESTIMATED': t('surfaces.تم_تقدير_السعر'),
      'OFFER_SENT': t('surfaces.تم_إرسال_العرض'),
      'WAITING_CUSTOMER_APPROVAL': t('surfaces.في_انتظار_موافقة_العميل'),
      'APPROVED': t('surfaces.تمت_الموافقة'),
      'SCHEDULED_PICKUP': t('surfaces.مجدول_الاستلام'),
      'DELIVERED': t('surfaces.تم_الاستلام'),
      'CANCELLED': 'ملغي'
    };
    return statusMap[status] || status;
  };

  if (state === 'loading') {
    return (
      <div style={{ padding: '24px', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <RefreshCw style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '18px' }}>جاري تحميل طلبات SHEIN...</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={{ padding: '24px', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <p style={{ fontSize: '18px', color: BTHWANI_COLORS.danger, marginBottom: '16px' }}>فشل في تحميل طلبات SHEIN</p>
          <button
            onClick={loadRequests}
            style={{
              padding: '8px 16px',
              border: '1px solid ' + BTHWANI_COLORS.gray300,
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <ShoppingBag style={{ width: '24px', height: '24px' }} />
          طلبات SHEIN
        </h1>
        <button
          onClick={onRefresh}
          style={{
            padding: '8px 16px',
            border: '1px solid ' + BTHWANI_COLORS.gray300,
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw style={{ width: '16px', height: '16px' }} />
          {refreshing ? 'جاري التحديث...' : t('surfaces.تحديث')}
        </button>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '16px', color: BTHWANI_COLORS.onSurfaceMuted }}>لا توجد طلبات. ستظهر هنا عند إنشائها من التطبيق.</p>
        </div>
      ) : (
        <div style={{ borderRadius: '12px', border: '1px solid ' + BTHWANI_COLORS.borderSubtle, overflow: 'hidden', direction: isRTL ? 'rtl' : 'ltr' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: BTHWANI_COLORS.background }}>
              <tr>
                <th style={{ padding: '12px', fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted, borderBottom: '1px solid ' + BTHWANI_COLORS.borderSubtle }}>رقم الطلب</th>
                <th style={{ padding: '12px', fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted, borderBottom: '1px solid ' + BTHWANI_COLORS.borderSubtle }}>الحالة</th>
                <th style={{ padding: '12px', fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted, borderBottom: '1px solid ' + BTHWANI_COLORS.borderSubtle }}>التاريخ</th>
                <th style={{ padding: '12px', fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted, borderBottom: '1px solid ' + BTHWANI_COLORS.borderSubtle }}>رابط المنتج</th>
                <th style={{ padding: '12px', fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted, borderBottom: '1px solid ' + BTHWANI_COLORS.borderSubtle }}>الكمية</th>
                <th style={{ padding: '12px', fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted, borderBottom: '1px solid ' + BTHWANI_COLORS.borderSubtle }}>العرض</th>
                <th style={{ padding: '12px', fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted, borderBottom: '1px solid ' + BTHWANI_COLORS.borderSubtle }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
                const canEstimateAndOffer = req.status === 'UNDER_REVIEW';
                const canOfferOnly = req.status === 'PRICE_ESTIMATED';
                const canSchedule = req.status === 'APPROVED';
                const canReject = !['CANCELLED', 'SCHEDULED_PICKUP', 'DELIVERED'].includes(req.status);
                const primaryAction = canEstimateAndOffer ? 'estimateAndOffer' : canOfferOnly ? 'offer' : canSchedule ? 'schedule' : null;
                return (
                <tr key={req.requestId} style={{ borderBottom: '1px solid ' + BTHWANI_COLORS.borderSubtle }}>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 500 }}>{req.requestId}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        backgroundColor: BTHWANI_COLORS.surfaceVariant,
                        color: getStatusColor(req.status),
                      }}
                    >
                      {getStatusText(req.status)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: BTHWANI_COLORS.onSurfaceMuted }}>
                    {new Date(req.createdAt).toLocaleString('ar-YE')}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', maxWidth: '240px' }}>
                    <a
                      href={req.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: BTHWANI_COLORS.info, textDecoration: 'underline', wordBreak: 'break-all' }}
                    >
                      {req.productUrl}
                    </a>
                    {req.sizeColor && (
                      <div style={{ fontSize: '12px', color: BTHWANI_COLORS.onSurfaceMuted, marginTop: '4px' }}>{req.sizeColor}</div>
                    )}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{req.quantity}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    {req.offer ? (
                      <span>{req.offer.finalPrice} {req.offer.currency}</span>
                    ) : req.pricing?.finalPrice != null ? (
                      <span style={{ color: BTHWANI_COLORS.onSurfaceMuted }}>{req.pricing.finalPrice} {req.pricing.currency ?? 'USD'}</span>
                    ) : (
                      <span style={{ color: BTHWANI_COLORS.gray400 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {primaryAction === 'estimateAndOffer' && (
                        <button
                          type="button"
                          onClick={() => setActionModal({ type: 'estimateAndOffer', requestId: req.requestId })}
                          style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '600', backgroundColor: BTHWANI_COLORS.info, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          تقدير السعر وإرسال العرض
                        </button>
                      )}
                      {primaryAction === 'offer' && (
                        <button
                          type="button"
                          onClick={() => setActionModal({
                            type: 'offer',
                            requestId: req.requestId,
                            finalPrice: req.pricing?.finalPrice,
                            currency: req.pricing?.currency,
                          })}
                          style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '600', backgroundColor: BTHWANI_COLORS.emeraldDark, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          إرسال عرض
                        </button>
                      )}
                      {primaryAction === 'schedule' && (
                        <button
                          type="button"
                          onClick={() => setActionModal({ type: 'schedule', requestId: req.requestId })}
                          style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '600', backgroundColor: BTHWANI_COLORS.teal, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          جدولة الاستلام
                        </button>
                      )}
                      {canReject && (
                        <button
                          type="button"
                          onClick={() => handleReject(req.requestId)}
                          disabled={rejectingId === req.requestId}
                          style={{ padding: '6px 10px', fontSize: '12px', backgroundColor: 'transparent', color: BTHWANI_COLORS.dangerDark, border: '1px solid ' + BTHWANI_COLORS.dangerLight, borderRadius: '6px', cursor: rejectingId === req.requestId ? 'not-allowed' : 'pointer' }}
                        >
                          {rejectingId === req.requestId ? 'جاري...' : 'إلغاء'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      )}

      {actionModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'BTHWANI_COLORS.overlay40',
            padding: '24px',
          }}
          onClick={(e) => e.target === e.currentTarget && setActionModal(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px BTHWANI_COLORS.overlay10, 0 8px 10px -6px BTHWANI_COLORS.overlay10',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {actionModal.type === 'estimateAndOffer' && (
              <SheinProxyRequestEstimateAndOffer
                requestId={actionModal.requestId}
                onSuccess={closeModalAndRefresh}
                onCancel={() => setActionModal(null)}
              />
            )}
            {actionModal.type === 'offer' && (
              <SheinProxyRequestOffer
                requestId={actionModal.requestId}
                initialFinalPrice={actionModal.finalPrice}
                initialCurrency={actionModal.currency}
                onSuccess={closeModalAndRefresh}
                onCancel={() => setActionModal(null)}
              />
            )}
            {actionModal.type === 'schedule' && (
              <SheinProxyRequestSchedule
                requestId={actionModal.requestId}
                onSuccess={closeModalAndRefresh}
                onCancel={() => setActionModal(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SheinProxyRequestsList;

