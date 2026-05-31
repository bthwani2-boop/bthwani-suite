'use client';

// Extracted from LiveOrdersScreen — order detail panel for pending approval workflow.
// Owns: inline approval fixtures, chat history, cart display, and decision buttons.
// Parent (LiveOrdersScreen) owns decision state and lifecycle transitions.

import React from 'react';
import { useTheme } from '@bthwani/ui-kit';
import type { DshOperationsDecisionKind, DshOperationsOrderDetail } from '../../shared/dsh-order-journey.model';
import { DSH_FULFILLMENT_OPERATIONAL_MODE_META } from './operations.types';
import type { DshFulfillmentOperationalMode } from './operations.types';

export type PendingApprovalOrder = DshOperationsOrderDetail & {
  fulfillmentMode: DshFulfillmentOperationalMode;
};

type OpsDecision = DshOperationsDecisionKind;

// Preview fixtures — approval queue data. Owned here, not in preview-data, because
// this is structural detail of the approval panel, not a shared operational preview.
export const PENDING_APPROVAL_ORDERS: PendingApprovalOrder[] = [
  {
    id: 'PA-0081',
    fulfillmentMode: 'bthwani_delivery',
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
    fulfillmentMode: 'pickup',
    customerName: 'سارة خالد',
    customerPhone: '771111111',
    dropoffAddress: '',
    pickupAddress: 'الواحة مول، المدخل الرئيسي',
    storeName: 'برغر لاب',
    paymentMethod: 'محفظة WLT',
    paymentStatus: 'تجريبي — مسجل محليًا',
    cartItems: [
      { title: 'برغر لاب كلاسيك', qty: 2, priceLabel: '2,500 ر.ي' },
      { title: 'بطاطس كبير', qty: 1, priceLabel: '800 ر.ي' },
    ],
    subtotalLabel: '5,800 ر.ي',
    deliveryLabel: '0 ر.ي',
    totalLabel: '5,800 ر.ي',
    customerNote: 'سأصل خلال 15 دقيقة.',
    customerInstructions: 'أبرز رقم الطلب للمتجر عند الاستلام.',
    couponCode: 'DSH10',
    eventLog: [
      { status: 'تم إنشاء الطلب', actor: 'العميل', timestamp: '2026-05-16T10:15:00+03:00' },
      { status: 'قيد مراجعة العمليات', actor: 'النظام', timestamp: '2026-05-16T10:15:20+03:00' },
    ],
  },
];

// Support ticket preview — keyed by orderId, loaded inline (summary-first, no external fetch).
const MOCK_TICKETS_FOR_ORDER: Record<string, {
  ticketId: string;
  status: string;
  statusTone: 'warning' | 'success' | 'danger';
  type: string;
  description: string;
  attachedImage: string;
  chatHistory: Array<{ sender: 'العميل' | 'الكابتن' | 'موصل المتجر' | 'المتجر' | 'النظام'; text: string; time: string }>;
}> = {
  'PA-0081': {
    ticketId: 'TK-4022',
    status: 'نشط / قيد المراجعة',
    statusTone: 'warning',
    type: 'تأخير في الاستلام من المتجر',
    description: 'الكابتن يفيد بازدحام شديد عند بوابة التحضير في بيك إن بريستو.',
    attachedImage: '',
    chatHistory: [
      { sender: 'العميل', text: 'مرحباً كابتن، هل استلمت الطلب؟ مكتوب في التطبيق قيد التحضير.', time: '10:11' },
      { sender: 'الكابتن', text: 'أهلاً بك يا غالي. نعم أنا متواجد بالمتجر الآن، لكن هناك ازدحام كبير جداً عند كاونتر الاستلام.', time: '10:12' },
      { sender: 'النظام', text: '🔔 تم قرع جرس تنبيه الكابتن من قبل العميل للاستفسار عن الحالة.', time: '10:13' },
      { sender: 'الكابتن', text: 'قمت برفع بلاغ دعم لتنبيه العمليات بتأخر المتجر في تسليم الأصناف.', time: '10:14' },
      { sender: 'العميل', text: 'شكراً جزيلاً لك على التوضيح والمتابعة، بانتظارك.', time: '10:15' },
    ],
  },
  'PA-0082': {
    ticketId: 'TK-4025',
    status: 'نشط / متابعة جاهزية الاستلام',
    statusTone: 'warning',
    type: 'الطلب غير جاهز في المتجر',
    description: 'العميل يسأل عن جاهزية الطلب قبل التوجه إلى المتجر.',
    attachedImage: '',
    chatHistory: [
      { sender: 'العميل', text: 'هل أصبح الطلب جاهزًا للاستلام من المتجر؟', time: '10:16' },
      { sender: 'المتجر', text: 'يتبقى بضع دقائق على الجاهزية. سنؤكد لك فور الانتهاء.', time: '10:17' },
      { sender: 'النظام', text: '🔔 تم تنبيه العمليات بوجود طلب استلام ذاتي بانتظار تأكيد الجاهزية.', time: '10:18' },
    ],
  },
};

// React.memo — re-renders only when order ref or onDecision callback ref changes.
// Parent (LiveOrdersScreen) uses useCallback on onDecision, so this is stable.
export const OpsOrderDetailPanel = React.memo(function OpsOrderDetailPanel({
  order,
  onDecision,
}: {
  order: PendingApprovalOrder;
  onDecision: (id: string, decision: OpsDecision, note: string) => void;
}) {
  const { theme } = useTheme();
  const [note, setNote] = React.useState('');
  const [pending, setPending] = React.useState<OpsDecision | null>(null);
  const modeMeta = DSH_FULFILLMENT_OPERATIONAL_MODE_META[order.fulfillmentMode];
  const isPickupMode = order.fulfillmentMode === 'pickup';
  const deliveryActorLabel = isPickupMode ? 'المتجر' : order.fulfillmentMode === 'partner_delivery' ? 'موصل المتجر' : 'الكابتن';
  const locationRows = isPickupMode
    ? [{ label: 'موقع الاستلام', value: order.pickupAddress }]
    : [
        { label: 'عنوان الاستلام', value: order.pickupAddress },
        { label: 'عنوان التسليم', value: order.dropoffAddress },
      ];
  const supportConversationTitle = isPickupMode
    ? '💬 سجل تواصل العميل والمتجر'
    : `💬 سجل دردشة العميل و${deliveryActorLabel}`;

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

  const ticketData = MOCK_TICKETS_FOR_ORDER[order.id] || {
    ticketId: 'TK-0000',
    status: 'لا يوجد بلاغات نشطة',
    statusTone: 'success' as const,
    type: 'عام',
    description: 'لا توجد بلاغات دعم مرتبطة بهذا الطلب.',
    attachedImage: '',
    chatHistory: [],
  };

  return (
    <div style={{ border: `1px solid ${theme.line}`, borderRadius: '14px', padding: '20px', background: theme.surfaceRaised, display: 'flex', flexDirection: 'column', gap: '16px', direction: 'rtl', textAlign: 'right' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: theme.brand }}>#{order.id}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', background: theme.surfaceInset, color: theme.textMuted, padding: '3px 10px', borderRadius: '99px', fontWeight: 700 }}>
            {modeMeta.label}
          </span>
          <span style={{ fontSize: '11px', background: theme.warningSurface, color: theme.warning, padding: '3px 10px', borderRadius: '99px', fontWeight: 700 }}>قيد مراجعة العمليات</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          { label: 'العميل', value: order.customerName },
          { label: 'الجوال', value: order.customerPhone },
          ...locationRows,
          { label: 'المتجر/الشريك', value: order.storeName },
          { label: 'المالك التشغيلي', value: modeMeta.operationalOwner },
          { label: 'طريقة الدفع', value: order.paymentMethod },
          { label: 'حالة الدفع', value: order.paymentStatus },
          ...(order.couponCode ? [{ label: 'القسيمة', value: order.couponCode }] : []),
          ...(order.customerNote ? [{ label: 'ملاحظة العميل', value: order.customerNote }] : []),
          ...(order.customerInstructions ? [{ label: isPickupMode ? 'تعليمات الاستلام' : 'تعليمات التسليم', value: order.customerInstructions }] : []),
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

      {/* بلاغات الدعم */}
      <div style={{ borderTop: `1px solid ${theme.line}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: theme.text }}>🚨 بلاغات الدعم والشكاوى (DSH)</div>
        <div style={{ background: theme.surfaceInset, borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: theme.text }}>بلاغ رقم: {ticketData.ticketId}</span>
            <span style={{
              fontSize: '11px', padding: '2px 8px', borderRadius: '99px', fontWeight: 700,
              background: ticketData.statusTone === 'warning' ? theme.warningSurface : ticketData.statusTone === 'danger' ? theme.dangerSurface : theme.successSurface,
              color: ticketData.statusTone === 'warning' ? theme.warning : ticketData.statusTone === 'danger' ? theme.danger : theme.success,
            }}>{ticketData.status}</span>
          </div>
          <div style={{ fontSize: '12px', color: theme.text, fontWeight: 600 }}>نوع البلاغ: <span style={{ color: theme.brand }}>{ticketData.type}</span></div>
          <div style={{ fontSize: '12px', color: theme.textMuted }}>{ticketData.description}</div>
          {ticketData.attachedImage && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px' }}>🖼️ المرفقات وصورة الإثبات:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: theme.surfaceRaised, border: `1px dashed ${theme.line}`, padding: '8px', borderRadius: '8px' }}>
                <span style={{ fontSize: '20px' }}>📸</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: theme.brand }}>{ticketData.attachedImage}</div>
                  <div style={{ fontSize: '10px', color: theme.success }}>محملة ومؤمنة بنجاح عبر نظام DSH</div>
                </div>
                <button type="button" style={{ padding: '4px 10px', background: theme.surfaceInset, border: `1px solid ${theme.line}`, borderRadius: '6px', fontSize: '11px', cursor: 'pointer', color: theme.text }}>معاينة</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* سجل الدردشة */}
      <div style={{ borderTop: `1px solid ${theme.line}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: theme.text }}>{supportConversationTitle}</div>
        {ticketData.chatHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', background: theme.surfaceInset, borderRadius: '10px', padding: '12px' }}>
            {ticketData.chatHistory.map((chat, idx) => {
              const isSystem = chat.sender === 'النظام';
              const isCustomer = chat.sender === 'العميل';
              return (
                <div key={idx} style={{
                  display: 'flex', flexDirection: 'column',
                  alignSelf: isSystem ? 'center' : isCustomer ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  background: isSystem ? theme.surfaceRaised : isCustomer ? theme.infoSurface : theme.surfaceRaised,
                  border: isSystem ? `1px solid ${theme.line}` : 'none',
                  borderRadius: '10px', padding: '8px 12px', gap: '2px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '10px', fontWeight: 700, color: isSystem ? theme.danger : isCustomer ? theme.info : theme.brand }}>
                    <span>{chat.sender}</span>
                    <span style={{ color: theme.textMuted, fontWeight: 'normal' }}>{chat.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: theme.text, marginTop: '2px', textAlign: 'right' }}>{chat.text}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: theme.surfaceInset, borderRadius: '10px', padding: '12px', textAlign: 'center', fontSize: '12px', color: theme.textMuted }}>
            لا توجد محادثات جارية للطلب.
          </div>
        )}
      </div>

      {/* ملاحظة القرار */}
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
        <button type="button" style={decisionButtonStyle('approve')} onClick={() => handleDecision('approve')}>موافقة</button>
        <button type="button" style={decisionButtonStyle('request_edit')} onClick={() => handleDecision('request_edit')}>طلب تعديل</button>
        <button type="button" style={decisionButtonStyle('reject')} onClick={() => handleDecision('reject')}>رفض</button>
      </div>
    </div>
  );
});
