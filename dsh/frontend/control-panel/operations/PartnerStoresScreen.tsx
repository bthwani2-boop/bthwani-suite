'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
  WebControlPanelInspectorShell,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import { buildOperationsHref } from './operations.registry';

export type PartnerStoresScreenProps = { hubHref: string; subGroup?: string; };

import { PARTNER_STORES_PREVIEW } from '../../data';

const STORES = PARTNER_STORES_PREVIEW;

export function PartnerStoresScreen({ hubHref: _hubHref, subGroup: _subGroup }: PartnerStoresScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStoreId = searchParams.get('orderId') ?? null;
  const [selectedStoreId, setSelectedStoreId] = React.useState<string | null>(null);

  const [rows, setRows] = React.useState(() =>
    STORES.map((store) => ({
      ...store,
      customStatus: null as string | null,
      customStatusTone: null as 'warning' | 'success' | 'danger' | 'neutral' | null,
    }))
  );

  React.useEffect(() => {
    if (urlStoreId && STORES.some((s) => s.id === urlStoreId)) {
      setSelectedStoreId(urlStoreId);
    }
  }, [urlStoreId]);

  const activeStore = rows.find((s) => s.id === selectedStoreId);
  const [actionStatus, setActionStatus] = React.useState<'idle' | 'pending' | 'success'>('idle');
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null);

  const handleTriggerAction = React.useCallback((storeId: string, actionLabel: string) => {
    setActionStatus('pending');
    setActionFeedback(null);

    setTimeout(() => {
      setActionStatus('success');

      let feedback = `تمت عملية (${actionLabel}) بنجاح.`;
      let statusUpdate: string | null = null;
      let statusToneUpdate: 'warning' | 'success' | 'danger' | 'neutral' | null = null;

      if (actionLabel === 'إيقاف مؤقت' || actionLabel === 'إيقاف استقبال') {
        statusUpdate = 'موقف مؤقتاً';
        statusToneUpdate = 'danger';
        feedback = 'تم إيقاف استقبال الطلبات للمتجر مؤقتاً بنجاح.';
      } else if (actionLabel === 'تحديث الجاهزية' || actionLabel === 'مستقر' || actionLabel === 'تنشيط استقبال') {
        statusUpdate = 'مفتوح';
        statusToneUpdate = 'success';
        feedback = 'تم تحديث حالة جاهزية المتجر إلى مستقر بنجاح.';
      } else if (actionLabel === 'تواصل' || actionLabel === 'تواصل مع المتجر') {
        feedback = 'تم بدء تواصل الدعم الفوري مع إدارة المتجر بنجاح.';
      }

      setActionFeedback(feedback);

      setTimeout(() => {
        if (statusUpdate) {
          setRows((prevRows) =>
            prevRows.map((r) =>
              r.id === storeId
                ? {
                    ...r,
                    customStatus: statusUpdate,
                    customStatusTone: statusToneUpdate,
                  }
                : r
            )
          );
        }
        setActionStatus('idle');
        setActionFeedback(null);
        setSelectedStoreId(null);
        router.push(buildOperationsHref('partner-stores'));
      }, 1200);
    }, 1000);
  }, [router]);

  // Inspector component
  let inspectorContent: React.ReactNode = null;
  if (selectedStoreId && activeStore) {
    const isSuspended = activeStore.customStatus === 'موقف مؤقتاً';
    const resolvedStatus = activeStore.customStatus || activeStore.status;

    inspectorContent = (
      <WebControlPanelInspectorShell
        title={`مراجعة حالة المتجر — ${activeStore.name}`}
        onClose={() => {
          setSelectedStoreId(null);
          router.push(buildOperationsHref('partner-stores'));
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', overflowY: 'auto', flex: 1, direction: 'rtl', textAlign: 'right' }}>

          {/* Store Info Card */}
          <div style={{ background: 'var(--bthwani-control-panel-surface-inset)', border: '1px solid var(--bthwani-control-panel-border)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text-muted)' }}>تفاصيل المتجر والفرع</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--bthwani-control-panel-brand)' }}>{activeStore.name} ({activeStore.branch})</div>
            <div style={{ fontSize: '12px', color: 'var(--bthwani-control-panel-text)' }}>
              <strong>وقت التجهيز:</strong> {activeStore.prepTime} | <strong>الطلبات الجاهزة:</strong> {activeStore.readyOrders}
            </div>
            {activeStore.issue && (
              <div style={{ fontSize: '12px', color: 'var(--bthwani-control-panel-danger)', fontWeight: 700 }}>
                ⚠️ {activeStore.issue}
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--bthwani-control-panel-text)' }}>
              <strong>طريقة التوصيل:</strong> {activeStore.deliveryMode === 'partner_delivery' ? 'توصيل المتجر' : 'توصيل بثواني'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--bthwani-control-panel-text)' }}>
              <strong>حالة استقبال الطلبات:</strong> <span style={{ fontWeight: 700, color: resolvedStatus === 'مفتوح' || resolvedStatus === 'مستقر' ? 'var(--bthwani-control-panel-success)' : 'var(--bthwani-control-panel-danger)' }}>{resolvedStatus}</span>
            </div>
          </div>

          {/* Governance / Boundary Rule Card */}
          <div style={{ background: 'var(--bthwani-control-panel-surface-inset)', border: '1px solid var(--bthwani-control-panel-border)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '16px' }}>⚖️</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--bthwani-control-panel-text)' }}>حوكمة حظر الكتالوج الثنائي</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text-muted)', margin: 0, lineHeight: 1.4 }}>
              لا يتم تعديل أو استنساخ كتالوج الشريك أو بيانات الفئات والمنتجات داخل لوحة العمليات. للتحكم بالعقود والكتالوجات, يرجى الانتقال إلى القسم المخصص:
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => router.push(`/catalogs?storeId=${activeStore.id}`)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'var(--bthwani-control-panel-surface)',
                  color: 'var(--bthwani-control-panel-brand)',
                  border: '1px solid var(--bthwani-control-panel-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                🔗 الكتالوجات (Catalogs)
              </button>
              <button
                type="button"
                onClick={() => router.push(`/partners?storeId=${activeStore.id}`)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'var(--bthwani-control-panel-surface)',
                  color: 'var(--bthwani-control-panel-brand)',
                  border: '1px solid var(--bthwani-control-panel-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                🔗 ملف الشريك (Partners)
              </button>
            </div>
          </div>

          {/* Action Feedback Alerts */}
          {actionFeedback && (
            <div style={{ background: 'var(--bthwani-control-panel-brand-surface)', border: '1px solid var(--bthwani-control-panel-brand)', color: 'var(--bthwani-control-panel-brand)', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}>
              {actionFeedback}
            </div>
          )}

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            <button
              type="button"
              disabled={actionStatus !== 'idle'}
              onClick={() => handleTriggerAction(activeStore.id, 'تواصل مع المتجر')}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bthwani-control-panel-surface)',
                color: 'var(--bthwani-control-panel-text)',
                border: '1px solid var(--bthwani-control-panel-border)',
                borderRadius: '8px',
                cursor: actionStatus !== 'idle' ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '12px',
              }}
            >
              {actionStatus === 'pending' ? 'جاري الاتصال...' : 'تواصل وتنبيه المتجر'}
            </button>

            {isSuspended ? (
              <button
                type="button"
                disabled={actionStatus !== 'idle'}
                onClick={() => handleTriggerAction(activeStore.id, 'تحديث الجاهزية')}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bthwani-control-panel-success)',
                  color: 'var(--bthwani-text-inverse)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: actionStatus !== 'idle' ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                {actionStatus === 'pending' ? 'جاري التنشيط...' : 'تنشيط وإلغاء الإيقاف'}
              </button>
            ) : (
              <button
                type="button"
                disabled={actionStatus !== 'idle'}
                onClick={() => handleTriggerAction(activeStore.id, 'إيقاف مؤقت')}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bthwani-control-panel-danger)',
                  color: 'var(--bthwani-text-inverse)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: actionStatus !== 'idle' ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                {actionStatus === 'pending' ? 'جاري الإيقاف...' : 'إيقاف مؤقت استقبال الطلبات'}
              </button>
            )}
          </div>

        </div>
      </WebControlPanelInspectorShell>
    );
  }

  return (
    <Box gap={3}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>المتاجر والشركاء</h2>
      </div>

      <WebControlPanelKpiStrip
        items={[
          { id: 'open', label: 'مفتوحة الآن', value: '١٤٢', tone: 'success' },
          { id: 'closed', label: 'مغلقة', value: '٣٨', tone: 'neutral' },
          { id: 'surged', label: 'متاجر مضغوطة', value: String(rows.filter(r => r.customStatus === 'مضغوط' || (r.status === 'مضغوط' && !r.customStatus)).length), tone: 'warning' },
          { id: 'delay', label: 'تأخير التجهيز', value: String(rows.filter(r => r.customStatus === 'تأخير' || (r.status === 'تأخير' && !r.customStatus)).length), tone: 'danger' },
          { id: 'suspended', label: 'موقوفة مؤقتاً', value: String(rows.filter(r => r.customStatus === 'موقف مؤقتاً').length), tone: 'danger' },
        ]}
      />

      <div className={styles.surfaceInnerLayout}>
        <Box gap={2}>
          {rows.map((store) => {
            const resolvedStatus = store.customStatus || store.status;
            const resolvedStatusTone = store.customStatusTone || store.statusTone;
            const isSuspended = resolvedStatus === 'موقف مؤقتاً';

            const primaryLabel = isSuspended ? 'تنشيط استقبال' : store.suggestion.action;
            const secondaryLabel = store.suggestion.secondary || 'عرض التفاصيل';

            return (
              <WebControlPanelDecisionRow
                key={store.id}
                entityId={store.id}
                entityLabel={`${store.name} — فرع: ${store.branch}`}
                status={resolvedStatus}
                statusTone={resolvedStatusTone}
                risk={resolvedStatusTone === 'danger' ? 'danger' : resolvedStatusTone === 'warning' ? 'warning' : 'neutral'}
                recommendation={store.suggestion.label}
                reason={store.suggestion.reason}
                sla={`التجهيز: ${store.prepTime} | جاهزة: ${store.readyOrders} | ${store.deliveryMode === 'partner_delivery' ? 'توصيل المتجر' : 'توصيل بثواني'}`}
                onInspect={() => {
                  setSelectedStoreId(store.id);
                  router.push(buildOperationsHref('partner-stores', { orderId: store.id }));
                }}
                primaryAction={{
                  id: `${store.id}-primary`,
                  label: primaryLabel,
                  onAction: () => {
                    if (primaryLabel === 'توجيه كباتن') {
                      router.push(buildOperationsHref('dispatch-assignment'));
                    } else {
                      setSelectedStoreId(store.id);
                      router.push(buildOperationsHref('partner-stores', { orderId: store.id }));
                    }
                  },
                }}
                secondaryAction={{
                  id: `${store.id}-secondary`,
                  label: secondaryLabel,
                  onAction: () => {
                    setSelectedStoreId(store.id);
                    router.push(buildOperationsHref('partner-stores', { orderId: store.id }));
                  },
                }}
              />
            );
          })}
        </Box>

        <Box gap={4}>
          {inspectorContent ?? (
            <WebControlPanelRecommendation
              title="تفاصيل الجاهزية والتحكم"
              reason="اختر متجراً من القائمة لعرض مؤشر الجاهزية التشغيلية وبوابات الحوكمة مع قسمي الشركاء والكتالوجات."
              confidence="high"
              auditTag="PARTNER_STORES_MONITOR"
            />
          )}
        </Box>
      </div>
    </Box>
  );
}

export default PartnerStoresScreen;
