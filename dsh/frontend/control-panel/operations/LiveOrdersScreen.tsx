'use client';

import React from 'react';
import {
  WebControlPanelKpiStrip,
  WebControlPanelDecisionRow,
} from '@bthwani/ui-kit/web';
import { LIVE_ORDERS_OPERATIONAL_PREVIEW } from './operations.preview-data';
import { Box, useTheme } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import type { DshClientDeliveryLifecycleStatus, DshClientOperationsDecisionKind } from '../../app-client/contracts/dsh-client-binding.contracts';

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

type OpsDecision = DshClientOperationsDecisionKind;

const OPS_DECISION_NEXT_LIFECYCLE: Record<OpsDecision, DshClientDeliveryLifecycleStatus> = {
  approve: 'operations_approved',
  request_edit: 'confirmed',
  reject: 'cancelled',
};

type PendingApprovalOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  dropoffAddress: string;
  pickupAddress: string;
  storeName: string;
  paymentMethod: string;
  paymentStatus: string;
  cartItems: Array<{ title: string; qty: number; priceLabel: string }>;
  subtotalLabel: string;
  deliveryLabel: string;
  totalLabel: string;
  customerNote: string;
  customerInstructions: string;
  couponCode: string;
  eventLog: Array<{ status: string; actor: string; timestamp: string }>;
};

const PENDING_APPROVAL_ORDERS: PendingApprovalOrder[] = [
  {
    id: 'PA-0081',
    customerName: 'أحمد محمد',
    customerPhone: '770000000',
    dropoffAddress: 'العليا، طريق الملك فهد',
    pickupAddress: 'رياض بارك، البوابة 2',
    storeName: 'بيك إن بريستو',
    paymentMethod: 'عند الاستلام',
    paymentStatus: 'معلق — لم يتم تحصيله بعد',
    cartItems: [
      { title: 'دجاج فحم تركي', qty: 1, priceLabel: '3,000 ر.ي' },
      { title: 'كريسبي رول', qty: 2, priceLabel: '1,500 ر.ي' },
    ],
    subtotalLabel: '6,000 ر.ي',
    deliveryLabel: '950 ر.ي',
    totalLabel: '6,950 ر.ي',
    customerNote: 'سلّم عند الباب الجانبي.',
    customerInstructions: 'اتصل قبل الوصول بـ 5 دقائق.',
    couponCode: '',
    eventLog: [
      { status: 'تم إنشاء الطلب', actor: 'العميل', timestamp: '2026-05-16T10:10:00+03:00' },
      { status: 'قيد مراجعة العمليات', actor: 'النظام', timestamp: '2026-05-16T10:10:30+03:00' },
    ],
  },
  {
    id: 'PA-0082',
    customerName: 'سارة خالد',
    customerPhone: '771111111',
    dropoffAddress: 'حي النزهة، شارع 15',
    pickupAddress: 'الواحة مول، المدخل الرئيسي',
    storeName: 'برغر لاب',
    paymentMethod: 'محفظة WLT',
    paymentStatus: 'تجريبي — مسجل محليًا',
    cartItems: [
      { title: 'برغر لاب كلاسيك', qty: 2, priceLabel: '2,500 ر.ي' },
      { title: 'بطاطس كبير', qty: 1, priceLabel: '800 ر.ي' },
    ],
    subtotalLabel: '5,800 ر.ي',
    deliveryLabel: '950 ر.ي',
    totalLabel: '6,750 ر.ي',
    customerNote: '',
    customerInstructions: 'سلّم للحارس في المدخل.',
    couponCode: 'DSH10',
    eventLog: [
      { status: 'تم إنشاء الطلب', actor: 'العميل', timestamp: '2026-05-16T10:15:00+03:00' },
      { status: 'قيد مراجعة العمليات', actor: 'النظام', timestamp: '2026-05-16T10:15:20+03:00' },
    ],
  },
];

type DecisionState = Record<string, { decision: OpsDecision; note: string; submitted: boolean; nextLifecycleStatus: DshClientDeliveryLifecycleStatus }>;

function OpsOrderDetailPanel({ order, onDecision }: { order: PendingApprovalOrder; onDecision: (id: string, decision: OpsDecision, note: string) => void }) {
  const { theme } = useTheme();
  const [note, setNote] = React.useState('');
  const [pending, setPending] = React.useState<OpsDecision | null>(null);

  const handleDecision = (decision: OpsDecision) => {
    setPending(decision);
    onDecision(order.id, decision, note);
  };

  const decisionButtonStyle = (decision: OpsDecision) => ({
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
    opacity: pending && pending !== decision ? 0.5 : 1,
    background: decision === 'approve' ? theme.success : decision === 'reject' ? theme.danger : theme.warning,
    color: theme.textInverse,
  });

  return (
    <div style={{ border: `1px solid ${theme.line}`, borderRadius: '14px', padding: '20px', background: theme.surfaceRaised, display: 'flex', flexDirection: 'column', gap: '16px', direction: 'rtl', textAlign: 'right' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: theme.brand }}>#{order.id}</span>
        <span style={{ fontSize: '11px', background: theme.warningSurface, color: theme.warning, padding: '3px 10px', borderRadius: '99px', fontWeight: 700 }}>قيد مراجعة العمليات</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          { label: 'العميل', value: order.customerName },
          { label: 'الجوال', value: order.customerPhone },
          { label: 'عنوان الاستلام', value: order.pickupAddress },
          { label: 'عنوان التسليم', value: order.dropoffAddress },
          { label: 'المتجر/الشريك', value: order.storeName },
          { label: 'طريقة الدفع', value: order.paymentMethod },
          { label: 'حالة الدفع', value: order.paymentStatus },
          ...(order.couponCode ? [{ label: 'القسيمة', value: order.couponCode }] : []),
          ...(order.customerNote ? [{ label: 'ملاحظة العميل', value: order.customerNote }] : []),
          ...(order.customerInstructions ? [{ label: 'تعليمات التسليم', value: order.customerInstructions }] : []),
        ].map(({ label, value }) => (
          <div key={label} style={{ background: theme.surfaceInset, borderRadius: '8px', padding: '8px 12px' }}>
            <div style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: theme.text }}>{value}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: theme.text, marginBottom: '8px' }}>محتويات السلة</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {order.cartItems.map((item) => (
            <div key={item.title} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 10px', background: theme.surfaceInset, borderRadius: '6px' }}>
              <span style={{ color: theme.brand, fontWeight: 700 }}>{item.priceLabel}</span>
              <span>{item.title} × {item.qty}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 10px', borderTop: `1px solid ${theme.line}` }}>
            <span style={{ fontWeight: 700, color: theme.text }}>{order.totalLabel}</span>
            <span style={{ color: theme.textMuted }}>الإجمالي الكلي</span>
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: theme.text, marginBottom: '8px' }}>سجل الأحداث</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {order.eventLog.map((ev) => (
            <div key={ev.timestamp} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '5px 10px', background: theme.surfaceInset, borderRadius: '6px' }}>
              <span style={{ color: theme.textMuted }}>{ev.timestamp.replace('T', ' ').slice(0, 16)}</span>
              <span><strong>{ev.status}</strong> — {ev.actor}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: theme.text, display: 'block', marginBottom: '6px' }}>ملاحظة القرار (اختياري)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="سبب الرفض أو التعديل المطلوب..."
          rows={2}
          style={{ width: '100%', borderRadius: '8px', border: `1px solid ${theme.line}`, padding: '8px', fontSize: '13px', direction: 'rtl', resize: 'vertical', background: theme.surface, color: theme.text, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-start' }}>
        <button style={decisionButtonStyle('approve')} onClick={() => handleDecision('approve')}>
          موافقة
        </button>
        <button style={decisionButtonStyle('request_edit')} onClick={() => handleDecision('request_edit')}>
          طلب تعديل
        </button>
        <button style={decisionButtonStyle('reject')} onClick={() => handleDecision('reject')}>
          رفض
        </button>
      </div>
    </div>
  );
}

export function LiveOrdersScreen({ state = 'ready', subGroup, onRetry }: LiveOrdersScreenProps) {
  const { theme } = useTheme();
  const preview = LIVE_ORDERS_OPERATIONAL_PREVIEW;
  const [expandedApprovalId, setExpandedApprovalId] = React.useState<string | null>(null);
  const [decisions, setDecisions] = React.useState<DecisionState>({});

  const handleDecision = (orderId: string, decision: OpsDecision, note: string) => {
    setDecisions((prev) => ({ ...prev, [orderId]: { decision, note, submitted: true, nextLifecycleStatus: OPS_DECISION_NEXT_LIFECYCLE[decision] } }));
    setExpandedApprovalId(null);
  };

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
          <button onClick={onRetry} style={{ padding: '6px 18px', background: theme.danger, color: theme.textInverse, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>إعادة المحاولة</button>
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

                {isExpanded && (
                  <OpsOrderDetailPanel order={order} onDecision={handleDecision} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Existing live decision rows */}
      <div style={{ fontSize: '14px', fontWeight: 800, color: theme.text, marginBottom: '10px', direction: 'rtl', textAlign: 'right', borderBottom: `1px solid ${theme.line}`, paddingBottom: '8px' }}>
        الطلبات المباشرة
      </div>
      <Box gap={2}>
        {preview.rows.map((order) => (
          <WebControlPanelDecisionRow
            key={order.id}
            entityId={order.id}
            entityLabel={`${order.destination} — الكابتن: ${order.captain}`}
            status={order.status}
            statusTone={TONE_MAP[order.statusTone] ?? 'neutral'}
            risk={TONE_MAP[order.statusTone] === 'danger' ? 'danger' : TONE_MAP[order.statusTone] === 'warning' ? 'warning' : 'neutral'}
            recommendation={order.suggestion.label}
            reason={order.suggestion.reason}
            sla={`ETA: ${order.eta} | ${order.ringLabel}`}
            primaryAction={{ id: 'primary', label: order.suggestion.action }}
            secondaryAction={order.suggestion.secondary ? { id: 'secondary', label: order.suggestion.secondary } : undefined}
          />
        ))}
      </Box>
    </div>
  );
}

export default LiveOrdersScreen;
