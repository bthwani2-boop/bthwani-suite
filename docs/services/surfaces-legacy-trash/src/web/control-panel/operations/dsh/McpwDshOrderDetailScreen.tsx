'use client';

/**
 * CONTROL PANEL — تفاصيل طلب DSH + Arrival Bell Timeline
 * المواصفة: DSH_ARRIVAL_BELL_SPEC §9 — تفاصيل الطلب: Arrival Bell Timeline (وصل، رن، إقرار، أسباب منع).
 * API: GET /api/dsh/orders/:orderId، GET /api/dsh/orders/:orderId/arrival/status
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';

import Link from 'next/link';
import { getApiConfig } from '../../../../config';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

function buildDshApiUrl(baseURL: string, path: string): string {
  const base = baseURL.endsWith('/api') ? baseURL.slice(0, -4) : baseURL.replace(/\/$/, '');
  return `${base}/api/dsh${path.startsWith('/') ? path : `/${path}`}`;
}

interface OrderData {
  id: string;
  restaurant?: string;
  status?: string;
  orderTime?: string;
  total?: number;
  itemsCount?: number;
  deliveryTime?: string;
  delivery_location?: string;
}

interface ArrivalStatusData {
  orderId: string;
  arrived: boolean;
  arrivedAt: string | null;
  ringCount: number;
  lastRingAt: string | null;
  cooldownUntil: string | null;
  canRing: boolean;
  blockReason: string | null;
  customerAcknowledged: boolean;
  acknowledgedAt: string | null;
}

interface McpwDshOrderDetailScreenProps {
  orderId: string;
}

export default function McpwDshOrderDetailScreen({ orderId }: McpwDshOrderDetailScreenProps) {
  const { t } = useI18n();
  const [orderLoading, setOrderLoading] = useState(true);
  const [arrivalLoading, setArrivalLoading] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [arrivalError, setArrivalError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [arrival, setArrival] = useState<ArrivalStatusData | null>(null);

  const load = useCallback(async () => {
    const id = (orderId ?? '').trim();
    if (!id) {
      setOrderError(t('surfaces.معرف_الطلب_مطلوب'));
      setOrderLoading(false);
      setArrivalLoading(false);
      return;
    }
    const { baseURL } = getApiConfig({ isWeb: true });

    setOrderLoading(true);
    setOrderError(null);
    try {
      const orderRes = await rawFetch(buildDshApiUrl(baseURL, `/orders/${encodeURIComponent(id)}`), { method: 'GET' });
      if (!orderRes.ok) throw new Error(`HTTP ${orderRes.status}`);
      const orderJson = await orderRes.json();
      if (orderJson?.data) setOrder(orderJson.data as OrderData);
      else setOrder({ id });
    } catch (e) {
      setOrderError(e instanceof Error ? e.message : t('web.control panel.operations.dsh.McpwDshOrderDetailScreen.errorLoadMessage'));
    } finally {
      setOrderLoading(false);
    }

    setArrivalLoading(true);
    setArrivalError(null);
    try {
      const statusRes = await rawFetch(buildDshApiUrl(baseURL, `/orders/${encodeURIComponent(id)}/arrival/status`), { method: 'GET' });
      if (!statusRes.ok) throw new Error(`HTTP ${statusRes.status}`);
      const statusJson = await statusRes.json();
      if (statusJson?.data) setArrival(statusJson.data as ArrivalStatusData);
    } catch (e) {
      setArrivalError(e instanceof Error ? e.message : t('web.control panel.operations.dsh.McpwDshOrderDetailScreen.errorLoadMessage_86'));
    } finally {
      setArrivalLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const id = (orderId ?? '').trim();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/operations/dsh/orders" style={{ color: BTHWANI_COLORS.info, textDecoration: 'none', fontSize: '14px' }}>
          ← إدارة الطلبات
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: BTHWANI_COLORS.info, borderRadius: '4px' }} />
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>تفاصيل الطلب</h1>
          <p style={{ color: BTHWANI_COLORS.onSurfaceMuted, margin: 0 }}>معرف الطلب: {id || '—'}</p>
        </div>
      </div>

      {orderLoading && <p style={{ color: BTHWANI_COLORS.onSurfaceMuted }}>جاري تحميل الطلب...</p>}
      {orderError && <p style={{ color: BTHWANI_COLORS.danger }}>{orderError}</p>}
      {!orderLoading && order && (
        <section style={{ marginBottom: '24px', padding: '16px', border: '1px solid ' + BTHWANI_COLORS.borderSubtle, borderRadius: '8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>الطلب</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <tbody>
              <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>المعرف</td><td>{order.id}</td></tr>
              {order.restaurant != null && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>المتجر</td><td>{order.restaurant}</td></tr>}
              {order.status != null && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>الحالة</td><td>{order.status}</td></tr>}
              {order.orderTime != null && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>وقت الطلب</td><td>{order.orderTime}</td></tr>}
              {order.total != null && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>المجموع</td><td>{order.total}</td></tr>}
              {order.delivery_location != null && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>عنوان التسليم</td><td>{order.delivery_location}</td></tr>}
            </tbody>
          </table>
        </section>
      )}

      <section style={{ padding: '16px', border: '1px solid ' + BTHWANI_COLORS.borderSubtle, borderRadius: '8px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Arrival Bell Timeline</h2>
        {arrivalLoading && <p style={{ color: BTHWANI_COLORS.onSurfaceMuted }}>جاري تحميل حالة جرس الوصول...</p>}
        {arrivalError && <p style={{ color: BTHWANI_COLORS.danger }}>{arrivalError}</p>}
        {!arrivalLoading && arrival && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <tbody>
              <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>وصل الكابتن</td><td>{arrival.arrived ? (arrival.arrivedAt ?? t('surfaces.نعم')) : 'لا'}</td></tr>
              {arrival.arrivedAt && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>وقت الوصول</td><td>{arrival.arrivedAt}</td></tr>}
              <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>عدد الرنات</td><td>{arrival.ringCount}</td></tr>
              {arrival.lastRingAt && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>آخر رنة</td><td>{arrival.lastRingAt}</td></tr>}
              <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>العميل قال «أنا قادم»</td><td>{arrival.customerAcknowledged ? (arrival.acknowledgedAt ?? 'نعم') : 'لا'}</td></tr>
              {arrival.acknowledgedAt && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>وقت الإقرار</td><td>{arrival.acknowledgedAt}</td></tr>}
              {arrival.blockReason && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.danger }}>سبب المنع</td><td>{arrival.blockReason}</td></tr>}
              {arrival.cooldownUntil && <tr><td style={{ padding: '6px 0', color: BTHWANI_COLORS.onSurfaceMuted }}>تبريد حتى</td><td>{arrival.cooldownUntil}</td></tr>}
            </tbody>
          </table>
        )}
        {!arrivalLoading && !arrival && !arrivalError && <p style={{ color: BTHWANI_COLORS.onSurfaceMuted }}>لا توجد بيانات جرس وصول لهذا الطلب.</p>}
      </section>
    </div>
  );
}

