'use client';

// P0-12: Live Orders screen — approval queue + live decision rows.
// Heavy components extracted: OpsOrderDetailPanel, FulfillmentModeQueueSection.
// Decision state persisted via workflow.ts; no direct lifecycle mutation here.

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { LIVE_ORDERS_OPERATIONAL_PREVIEW } from '../../data/orders.preview-data';
import { Box, useTheme } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import type { DshOperationsDecisionKind, DshOrderLifecycleStatus } from '../../shared/dsh-order-journey.model';
import { mapOperationsDecisionToLifecycle } from '../../shared/dsh-order-journey.model';
import { buildOperationsHref } from './operations.registry';
import { getLiveOrderDecisions, updateLiveOrderDecision } from '../../shared/workflow';
import { OpsOrderDetailPanel, PENDING_APPROVAL_ORDERS } from './OpsOrderDetailPanel';
import { FulfillmentModeQueueSection, getOperationsActorLabel } from './FulfillmentModeQueueSection';
import type { DshFulfillmentOperationalMode } from './operations.types';

export type LiveOrdersScreenProps = {
  state?: 'ready' | 'loading' | 'error' | 'empty';
  hubHref: string;
  subGroup?: string;
  onRetry?: () => void;
};

const TONE_MAP: Record<string, 'neutral' | 'success' | 'warning' | 'danger'> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

type OpsDecision = DshOperationsDecisionKind;
type DecisionState = Record<string, { decision: OpsDecision; note: string; submitted: boolean; nextLifecycleStatus: DshOrderLifecycleStatus }>;

const FULFILLMENT_MODE_IDS: readonly DshFulfillmentOperationalMode[] = ['bthwani_delivery', 'partner_delivery', 'pickup'];

export function LiveOrdersScreen({ state = 'ready', subGroup, onRetry }: LiveOrdersScreenProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const preview = LIVE_ORDERS_OPERATIONAL_PREVIEW;
  const activeMode = FULFILLMENT_MODE_IDS.find((m) => m === subGroup) ?? null;
  const [expandedApprovalId, setExpandedApprovalId] = React.useState<string | null>(null);
  const [decisions, setDecisions] = React.useState<DecisionState>(() => getLiveOrderDecisions() as any);

  const handleDecision = React.useCallback((orderId: string, decision: OpsDecision, note: string) => {
    const nextStatus = mapOperationsDecisionToLifecycle(decision);
    updateLiveOrderDecision(orderId, decision, note, nextStatus);
    setDecisions(getLiveOrderDecisions() as any);
    setExpandedApprovalId(null);
  }, []);

  const handlePrimaryAction = React.useCallback((orderId: string, actionLabel: string) => {
    if (actionLabel.includes('إسناد')) {
      router.push(buildOperationsHref('dispatch-assignment', { orderId }));
    } else if (actionLabel.includes('إثبات') || actionLabel.includes('طلب')) {
      alert(`تم طلب إثبات الاستلام للطلب ${orderId} بنجاح. قيد المتابعة مع الدعم.`);
    } else {
      router.push(buildOperationsHref('order-rescue', { orderId }));
    }
  }, [router]);

  const handleSecondaryAction = React.useCallback((orderId: string, actionLabel: string) => {
    if (actionLabel.includes('دعم') || actionLabel.includes('الدعم')) {
      router.push(`/support?orderId=${orderId}`);
    } else {
      router.push(buildOperationsHref('order-rescue', { orderId }));
    }
  }, [router]);

  if (state === 'loading') {
    return (
      <div className={styles.surfaceInnerScroll} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p style={{ color: theme.textMuted, fontSize: '13px' }}>جارٍ تحميل العمليات الحية...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={styles.surfaceInnerScroll} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ textAlign: 'center', border: `1px solid ${theme.danger}`, padding: '24px', borderRadius: '10px', background: theme.dangerSurface }}>
          <p style={{ color: theme.dangerText, fontSize: '13px', marginBottom: '12px' }}>تعذر الاتصال بخادم العمليات المباشرة.</p>
          <button type="button" onClick={onRetry} style={{ padding: '6px 18px', background: theme.danger, color: theme.textInverse, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  const summaryKpi = [
    { id: 'awaiting', label: 'بانتظار التأكيد', value: String(preview.summary.awaitingAcknowledgement), tone: 'neutral' as const },
    { id: 'pending-approval', label: 'قيد الموافقة', value: String(PENDING_APPROVAL_ORDERS.filter((o) => !decisions[o.id]).length), tone: 'warning' as const },
    { id: 'blocked', label: 'رنينات محجوبة', value: String(preview.summary.blockedRings), tone: 'danger' as const },
    { id: 'hint', label: preview.summary.ringLabel, value: preview.summary.actionHint, tone: 'neutral' as const },
  ];

  return (
    <div className={styles.surfaceCockpitContent}>
      <WebControlPanelKpiStrip items={summaryKpi} />

      {/* Operations approval queue */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: theme.text, marginBottom: '10px', direction: 'rtl', textAlign: 'right', borderBottom: `1px solid ${theme.line}`, paddingBottom: '8px' }}>
          طلبات قيد الموافقة التشغيلية
          <span style={{ marginRight: '8px', fontSize: '11px', background: theme.warningSurface, color: theme.warning, padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>
            {PENDING_APPROVAL_ORDERS.filter((o) => !decisions[o.id]).length} طلب
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PENDING_APPROVAL_ORDERS.map((order) => {
            const submitted = decisions[order.id];
            const isExpanded = expandedApprovalId === order.id;

            if (submitted) {
              const decisionLabel = submitted.decision === 'approve' ? 'تمت الموافقة' : submitted.decision === 'reject' ? 'تم الرفض' : 'طلب تعديل';
              const decisionColor = submitted.decision === 'approve' ? theme.success : submitted.decision === 'reject' ? theme.danger : theme.warning;
              return (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: `1px solid ${theme.line}`, borderRadius: '10px', background: theme.surfaceRaised, direction: 'rtl', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: theme.textMuted }}>الحالة التالية: <strong style={{ color: theme.text }}>{submitted.nextLifecycleStatus}</strong></span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: decisionColor }}>{decisionLabel}</span>
                  <span style={{ fontSize: '13px', color: theme.text }}>#{order.id} — {order.customerName}</span>
                </div>
              );
            }

            return (
              <div key={order.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setExpandedApprovalId(isExpanded ? null : order.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', border: `1px solid ${isExpanded ? theme.brand : theme.line}`,
                    borderRadius: '10px', background: isExpanded ? theme.brandSurface : theme.surfaceRaised,
                    cursor: 'pointer', direction: 'rtl', textAlign: 'right', width: '100%',
                  }}
                >
                  <span style={{ fontSize: '12px', color: theme.textMuted }}>{isExpanded ? 'إخفاء التفاصيل ▲' : 'عرض التفاصيل ▼'}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: theme.text }}>#{order.id} — {order.customerName} — {order.storeName}</span>
                </button>
                {isExpanded && <OpsOrderDetailPanel order={order} onDecision={handleDecision} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live decision rows */}
      <div style={{ fontSize: '14px', fontWeight: 800, color: theme.text, marginBottom: '10px', direction: 'rtl', textAlign: 'right', borderBottom: `1px solid ${theme.line}`, paddingBottom: '8px' }}>
        الطلبات المباشرة
      </div>
      <Box gap={2}>
        {preview.rows.map((order) => (
          <WebControlPanelDecisionRow
            key={order.id}
            entityId={order.id}
            entityLabel={`${order.destination} — ${getOperationsActorLabel(order.fulfillmentMode)}: ${order.captain}`}
            status={order.status}
            statusTone={TONE_MAP[order.statusTone] ?? 'neutral'}
            risk={TONE_MAP[order.statusTone] === 'danger' ? 'danger' : TONE_MAP[order.statusTone] === 'warning' ? 'warning' : 'neutral'}
            recommendation={order.suggestion.label}
            reason={order.suggestion.reason}
            sla={`ETA: ${order.eta} | ${order.ringLabel}`}
            primaryAction={{
              id: `${order.id}-primary`,
              label: order.suggestion.action,
              onAction: () => handlePrimaryAction(order.id, order.suggestion.action),
            }}
            secondaryAction={order.suggestion.secondary ? {
              id: `${order.id}-secondary`,
              label: order.suggestion.secondary,
              onAction: () => handleSecondaryAction(order.id, order.suggestion.secondary),
            } : undefined}
          />
        ))}
      </Box>

      {activeMode && <FulfillmentModeQueueSection mode={activeMode} />}
    </div>
  );
}

export default LiveOrdersScreen;
