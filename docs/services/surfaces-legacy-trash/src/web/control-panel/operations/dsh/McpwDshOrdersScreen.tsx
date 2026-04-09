'use client';

/**
 * CONTROL PANEL DSH — إدارة الطلبات (operations/dsh/orders)
 * قائمة طلبات عونك + إسناد للكابتن.
 * تفاصيل طلب: /operations/dsh/orders/[orderId]
 */
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SectionScreenTemplate } from '../../components/SectionScreenTemplate';
import { ShoppingCart, RefreshCw, UserPlus } from 'lucide-react';
import { useI18n } from '@bthwani/ui-kit';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import {
  getDshOperationsOrders,
  getDshOperationsCaptains,
  assignDshOrderToCaptain,
  type DshOperationsOrder,
} from '@bthwani/api-clients/dsh/dsh-operations-api';

export default function McpwDshOrdersScreen() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<DshOperationsOrder[]>([]);
  const [captains, setCaptains] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ords, caps] = await Promise.all([
        getDshOperationsOrders({ source: 'awnak' }),
        getDshOperationsCaptains(),
      ]);
      setOrders(ords);
      setCaptains(caps.captains);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAssign = async (orderId: string, captainId: string) => {
    if (!captainId) return;
    setAssigning(orderId);
    try {
      const ok = await assignDshOrderToCaptain(orderId, captainId);
      if (ok) await load();
    } finally {
      setAssigning(null);
    }
  };

  const formatDate = (s: string) => {
    try {
      const d = new Date(s);
      return d.toLocaleDateString('ar-SA', { dateStyle: 'short' }) + ' ' + d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return s;
    }
  };

  return (
    <SectionScreenTemplate
      title={t('web.control panel.operations.dsh.McpwDshOrdersScreen.ordersManagement')}
      subtitle={t('web.control panel.operations.dsh.McpwDshOrdersScreen.manageDshOrders')}
      icon={ShoppingCart}
      primaryAction={
        <button
          onClick={load}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid ' + semanticRoles.border,
            backgroundColor: semanticRoles.surface,
            color: semanticRoles.text,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          <RefreshCw className="h-4 w-4" style={{ opacity: loading ? 0.5 : 1 }} />
          {t('web.control panel.operations.dsh.McpwDshOrdersScreen.refresh')}
        </button>
      }
    >
      <div style={{ marginTop: '24px' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: semanticRoles.textMuted }}>
            {t('web.control panel.operations.dsh.McpwDshOrdersScreen.loading')}
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px dashed ' + semanticRoles.border,
              borderRadius: '12px',
              backgroundColor: semanticRoles.surfaceSubtle,
            }}
          >
            <ShoppingCart className="h-12 w-12" style={{ color: semanticRoles.textMuted, margin: '0 auto 16px' }} />
            <p style={{ color: semanticRoles.text, fontWeight: 600, marginBottom: '8px' }}>
              {t('web.control panel.operations.dsh.McpwDshOrdersScreen.emptyTitle')}
            </p>
            <p style={{ color: semanticRoles.textMuted, fontSize: '14px' }}>
              {t('web.control panel.operations.dsh.McpwDshOrdersScreen.emptySubtitle')}
            </p>
          </div>
        ) : (
          <div
            style={{
              border: '1px solid ' + semanticRoles.border,
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: semanticRoles.surface,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: semanticRoles.surfaceSubtle, borderBottom: '1px solid ' + semanticRoles.border }}>
                  <th style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: semanticRoles.text }}>الطلب</th>
                  <th style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: semanticRoles.text }}>من ← إلى</th>
                  <th style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: semanticRoles.text }}>النوع</th>
                  <th style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: semanticRoles.text }}>التقدير</th>
                  <th style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: semanticRoles.text }}>الحالة</th>
                  <th style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: semanticRoles.text }}>الكابتن</th>
                  <th style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: semanticRoles.text }}>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid ' + semanticRoles.border }}>
                    <td style={{ padding: '12px 16px' }}>
                      <Link
                        href={`/operations/dsh/orders/${o.id}`}
                        style={{ color: BTHWANI_COLORS.info, textDecoration: 'none', fontWeight: 500 }}
                      >
                        {o.id}
                      </Link>
                      <div style={{ fontSize: '12px', color: semanticRoles.textMuted, marginTop: '2px' }}>
                        {formatDate(o.created_at)}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: semanticRoles.text }}>
                      {o.from_label ?? '—'} ← {o.to_label ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: semanticRoles.text }}>{o.order_type}</td>
                    <td style={{ padding: '12px 16px', color: semanticRoles.text }}>
                      {o.price_estimate} {o.currency}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: o.status === 'ASSIGNED' ? semanticRoles.stateInfo.background : semanticRoles.stateWarning.background,
                          color: o.status === 'ASSIGNED' ? semanticRoles.stateInfo.text : semanticRoles.stateWarning.text,
                        }}
                      >
                        {o.status === 'ASSIGNED' ? 'معيّن' : o.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: semanticRoles.text }}>
                      {o.captain_id
                        ? captains.find((c) => c.id === o.captain_id)?.name ?? o.captain_id
                        : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {!o.captain_id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <select
                            value=""
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v) handleAssign(o.id, v);
                            }}
                            disabled={assigning === o.id}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid ' + semanticRoles.border,
                              backgroundColor: semanticRoles.surface,
                              color: semanticRoles.text,
                              fontSize: '13px',
                              minWidth: '140px',
                            }}
                          >
                            <option value="">إسناد للكابتن</option>
                            {captains.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          {assigning === o.id && (
                            <span style={{ fontSize: '12px', color: semanticRoles.textMuted }}>جاري...</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: semanticRoles.textMuted }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionScreenTemplate>
  );
}

