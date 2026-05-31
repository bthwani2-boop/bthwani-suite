'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelRecommendation,
} from '@bthwani/ui-kit/web';
import {
  DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW,
} from '../../data/orders.preview-data';
import { DISPATCH_LIFECYCLE_STATE_MAP } from '../../shared/dsh-order-preview.contract';
import { Box, Text } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import { buildOperationsHref } from './operations.registry';
// Delivery mode boundary: dispatch applies to bthwani_delivery only.
// partner_delivery and pickup orders do not enter the captain dispatch queue.
// Reference: dsh/frontend/shared/dsh-delivery-mode.model.ts → requiresDispatch
import { getDshDeliveryModeDefinition } from '../../shared/dsh-delivery-mode.model';
import { getDshLifecycleStateMetadata } from '../../shared/dsh-order-journey.model';

export type DispatchAssignmentScreenProps = { hubHref: string; subGroup?: string };

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

// Resolved once at module level — no runtime cost.
const BTHWANI_DELIVERY_META = getDshDeliveryModeDefinition('bthwani_delivery');

const alternativesMap: Record<string, Array<{ name: string; distance: string; status: string }>> = {
  'DA-2001': [
    { name: 'سعد م.', distance: '1.2 كم', status: 'متاح (موصى به)' },
    { name: 'خالد أ.', distance: '1.5 كم', status: 'متاح' },
    { name: 'ماجد س.', distance: '2.1 كم', status: 'متاح' },
  ],
  'DA-2002': [
    { name: 'محمد ع.', distance: '0.8 كم', status: 'متاح (موصى به)' },
    { name: 'عمر ف.', distance: '1.1 كم', status: 'متاح' },
    { name: 'علي ي.', distance: '1.8 كم', status: 'متاح' },
  ],
  'DA-2003': [
    { name: 'وليد ع.', distance: '3.4 كم', status: 'متاح (بعيد)' },
    { name: 'أحمد ر.', distance: '4.2 كم', status: 'متاح (بعيد)' },
  ],
};

export function DispatchAssignmentScreen({ subGroup }: DispatchAssignmentScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get('orderId') ?? null;
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);

  const [rows, setRows] = React.useState(() =>
    DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW.rows.map((row) => ({
      ...row,
      assignedCaptain: null as string | null,
      customStatus: null as string | null,
      customStatusTone: null as 'warning' | 'success' | 'danger' | 'neutral' | null,
    }))
  );

  React.useEffect(() => {
    if (urlOrderId) {
      setSelectedRowId(urlOrderId);
    }
  }, [urlOrderId]);

  const activeRow = rows.find((r) => r.id === selectedRowId);
  const [actionStatus, setActionStatus] = React.useState<'idle' | 'pending' | 'success'>('idle');
  const [chosenCaptain, setChosenCaptain] = React.useState<string>('');

  React.useEffect(() => {
    if (activeRow) {
      setChosenCaptain(activeRow.assignedCaptain || (activeRow.captain !== 'لا يوجد' ? activeRow.captain : ''));
      setActionStatus('idle');
    }
  }, [selectedRowId, activeRow]);

  const handleConfirmAssignment = React.useCallback((orderId: string, captainName: string) => {
    setActionStatus('pending');

    setTimeout(() => {
      setActionStatus('success');
      setTimeout(() => {
        setRows((prevRows) =>
          prevRows.map((r) =>
            r.id === orderId
              ? {
                  ...r,
                  assignedCaptain: captainName,
                  customStatus: 'تم الإسناد للكابتن',
                  customStatusTone: 'success',
                }
              : r
          )
        );
        setActionStatus('idle');
        setSelectedRowId(null);
        router.push(buildOperationsHref('dispatch-assignment'));
      }, 1000);
    }, 1200);
  }, [router]);

  const summaryKpi = [
    { id: 'waiting', label: 'بانتظار الإسناد', value: String(rows.filter(r => !r.assignedCaptain && r.statusTone !== 'danger').length), tone: 'danger' as const },
    { id: 'captains', label: 'كباتن متاحون', value: String(DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW.summary.availableCaptains), tone: 'success' as const },
    { id: 'ready', label: 'جاهزون للاستلام', value: String(DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW.summary.readyForPickup), tone: 'neutral' as const },
    { id: 'blockers', label: 'معوقات الإسناد', value: String(rows.filter(r => r.statusTone === 'danger').length), tone: 'warning' as const },
  ];

  // Inspector component
  let inspectorContent: React.ReactNode = null;
  if (selectedRowId && activeRow) {
    const captainsList = alternativesMap[activeRow.id] || [];
    const isCompleted = activeRow.customStatus === 'تم الإسناد للكابتن';

    inspectorContent = (
      <WebControlPanelInspectorShell
        title={`إسناد وتعيين الكابتن — ${activeRow.id}`}
        onClose={() => {
          setSelectedRowId(null);
          router.push(buildOperationsHref('dispatch-assignment'));
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', overflowY: 'auto', flex: 1, direction: 'rtl', textAlign: 'right' }}>
          <div style={{ background: 'var(--bthwani-control-panel-surface-inset)', border: '1px solid var(--bthwani-control-panel-border)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text-muted)' }}>تفاصيل الطلب الحالي</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--bthwani-control-panel-brand)' }}>{activeRow.id}</div>
            <div style={{ fontSize: '12px', color: 'var(--bthwani-control-panel-text)' }}>
              <strong>التوصية المقترحة:</strong> {activeRow.recommendation}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--bthwani-control-panel-text-muted)' }}>
              {activeRow.note}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800 }}>اختر الكابتن للتعيين:</span>
            {captainsList.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {captainsList.map((cap) => (
                  <label
                    key={cap.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: chosenCaptain === cap.name ? 'var(--bthwani-control-panel-brand-surface)' : 'var(--bthwani-control-panel-surface-inset)',
                      border: chosenCaptain === cap.name ? '1px solid var(--bthwani-control-panel-brand)' : '1px solid var(--bthwani-control-panel-border)',
                      borderRadius: '8px',
                      cursor: isCompleted || actionStatus !== 'idle' ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      type="radio"
                      name="captain-select"
                      value={cap.name}
                      checked={chosenCaptain === cap.name}
                      disabled={isCompleted || actionStatus !== 'idle'}
                      onChange={() => setChosenCaptain(cap.name)}
                      style={{ accentColor: 'var(--bthwani-control-panel-brand)' }}
                    />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><strong>{cap.name}</strong> ({cap.status})</span>
                      <span style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text-muted)' }}>{cap.distance}</span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--bthwani-control-panel-text-muted)' }}>لا يوجد كباتن متاحون بالقرب.</span>
            )}
          </div>

          {isCompleted ? (
            <div style={{ background: 'var(--bthwani-control-panel-success-surface)', border: '1px solid var(--bthwani-control-panel-success)', color: 'var(--bthwani-control-panel-success-text)', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}>
              ✓ تم تعيين الكابتن وإرسال الطلب للمتابعة بنجاح!
            </div>
          ) : (
            <>
              {actionStatus === 'success' && (
                <div style={{ background: 'var(--bthwani-control-panel-success-surface)', border: '1px solid var(--bthwani-control-panel-success)', color: 'var(--bthwani-control-panel-success-text)', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}>
                  ✓ تم تأكيد الإسناد وإرسال الطلب بنجاح!
                </div>
              )}
              <button
                type="button"
                onClick={() => handleConfirmAssignment(activeRow.id, chosenCaptain)}
                disabled={!chosenCaptain || actionStatus !== 'idle'}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: !chosenCaptain || actionStatus !== 'idle' ? 'var(--bthwani-control-panel-border)' : 'var(--bthwani-control-panel-brand)',
                  color: 'var(--bthwani-text-inverse)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: !chosenCaptain || actionStatus !== 'idle' ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '13px',
                  transition: 'background 0.2s',
                  textAlign: 'center',
                }}
              >
                {actionStatus === 'pending' ? 'قيد إرسال الإسناد للكابتن...' : 'تأكيد التعيين وإرسال الطلب'}
              </button>
            </>
          )}
        </div>
      </WebControlPanelInspectorShell>
    );
  }

  return (
    <Box gap={3}>
      {/* Delivery mode scope boundary — explicit, not implied */}
      <Box paddingX={3} paddingY={1}>
        <Text role="bodySm" tone="muted">
          {`نطاق الإسناد: ${BTHWANI_DELIVERY_META.label} — توصيل المتجر والاستلام الذاتي لا يحتاجان تعيين كابتن.`}
        </Text>
      </Box>

      {/* KPI summary strip */}
      <WebControlPanelKpiStrip items={summaryKpi} />

      <div className={styles.surfaceInnerLayout}>
        <Box gap={4}>
          <Box paddingX={3} paddingY={1}>
            <Text role="bodySm" tone="muted">
              ترتبط صفوف الإسناد هنا الآن بحالات دورة الحياة الموحدة. تفاصيل الطلب تُفتح عند الطلب فقط، مع إبقاء هذه المساحة ملخصاً أولاً.
            </Text>
          </Box>

          {/* Decision rows — duplicate buttons eliminated, one primary action per row */}
          <Box gap={2}>
            {rows.map((item) => {
              const lifecycleState = DISPATCH_LIFECYCLE_STATE_MAP[item.id] ?? 'captain_assignment';
              const lifecycleMetadata = getDshLifecycleStateMetadata(lifecycleState);

              // Use dynamic states if they exist
              const resolvedCaptain = item.assignedCaptain || item.captain;
              const resolvedStatusLabel = item.customStatus || (lifecycleMetadata?.controlPanelLabel ?? item.status);
              const resolvedStatusTone = item.customStatusTone || TONE_MAP[item.statusTone] || 'neutral';

              const primaryLabel = item.customStatus ? 'تم الإسناد' : (lifecycleMetadata?.primaryAction?.label ?? 'تأكيد الإسناد');

              const secondaryLabel = lifecycleState === 'reassignment_required'
                ? 'فتح الطلب الحي'
                : lifecycleState === 'captain_unavailable'
                  ? 'فتح السعة والمناطق'
                  : 'عرض التفاصيل';
              const reason = item.blocker !== 'لا يوجد'
                ? `حالة المسار: ${resolvedStatusLabel} · المانع: ${item.blocker}`
                : `حالة المسار: ${resolvedStatusLabel} · ${item.note}`;

              return (
                <WebControlPanelDecisionRow
                  key={item.id}
                  entityId={item.id}
                  entityLabel={`الكابتن: ${resolvedCaptain} | المسافة: ${item.distance} | الثقة: ${item.confidence}`}
                  status={resolvedStatusLabel}
                  statusTone={resolvedStatusTone}
                  risk={resolvedStatusTone === 'danger' ? 'danger' : resolvedStatusTone === 'warning' ? 'warning' : 'neutral'}
                  recommendation={item.recommendation}
                  reason={reason}
                  sla={`استلام: ${item.pickupEta} | تسليم: ${item.dropoffEta}`}
                  onInspect={() => {
                    setSelectedRowId(item.id);
                    router.push(buildOperationsHref('dispatch-assignment', { orderId: item.id }));
                  }}
                  primaryAction={item.customStatus ? undefined : {
                    id: `${item.id}-primary`,
                    label: primaryLabel,
                    onAction: () => {
                      setSelectedRowId(item.id);
                      router.push(buildOperationsHref('dispatch-assignment', { orderId: item.id }));
                    },
                  }}
                  secondaryAction={{
                    id: `${item.id}-secondary`,
                    label: secondaryLabel,
                    onAction: () => router.push(
                      lifecycleState === 'captain_unavailable'
                        ? buildOperationsHref('area-capacity')
                        : buildOperationsHref('live-orders', { orderId: item.id }),
                    ),
                  }}
                />
              );
            })}
          </Box>
        </Box>

        <Box gap={4}>
          {inspectorContent ?? (
            <WebControlPanelRecommendation
              title="تفاصيل الإسناد وتعيين الكابتن"
              reason="اختر طلباً بانتظار الإسناد من القائمة لعرض الكباتن المتاحين بالقرب وتأكيد التعيين."
              confidence="high"
              auditTag="DISPATCH_ASSIGNMENT_MONITOR"
            />
          )}
        </Box>
      </div>
    </Box>
  );
}

export default DispatchAssignmentScreen;
