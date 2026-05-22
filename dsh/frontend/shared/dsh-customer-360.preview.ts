import type { DshControlPanelSectionId } from './dsh-governance.map';
import type { DshOnDemandPolicy } from './dsh-flow-registry';
import {
  buildDshSignalRoutePreview,
  type DshGlobalControlLink,
  type DshLookupInputPreview,
  type DshPreviewPlaceholderStatus,
  type DshReadOnlyFinanceVisibility,
  type DshRouteHintedAction,
  type DshVerificationStatus,
} from './dsh-assisted-order.preview';
import type { DshFulfillmentDeliveryMode } from './dsh-delivery-mode.model';

export type DshCustomer360VerificationStatus = DshVerificationStatus;

export type DshCustomer360TicketFilterStatus = 'open' | 'resolved' | 'escalated';

export type DshCustomer360TimelineNoteSource = 'support note' | 'ops note' | 'audit note';

export type DshCustomer360OrderSummary = {
  readonly orderId: string;
  readonly store: string;
  readonly deliveryMode: DshFulfillmentDeliveryMode;
  readonly deliveryModeLabel: string;
  readonly lifecycleStatus: string;
  readonly paymentVisibility: string;
  readonly refundVisibility: string;
  readonly latestTicket: string;
  readonly primaryAction: DshRouteHintedAction;
};

export type DshCustomer360TicketHistoryEntry = {
  readonly ticketId: string;
  readonly status: DshCustomer360TicketFilterStatus;
  readonly statusLabel: string;
  readonly sla: string;
  readonly owner: string;
  readonly latestNote: string;
  readonly routeHint: string;
};

export type DshCustomer360NoteEntry = {
  readonly noteId: string;
  readonly source: DshCustomer360TimelineNoteSource;
  readonly body: string;
  readonly timestampLabel: string;
};

export type DshCustomer360Record = {
  readonly customerId: string;
  readonly customerName: string;
  readonly maskedPhone: string;
  readonly cityLabel: string;
  readonly verificationStatus: DshCustomer360VerificationStatus;
  readonly activeOrderId?: string;
  readonly openTicketId?: string;
  readonly latestIssueSummary: string;
  readonly wltVisibilitySummary: string;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly quickActions: readonly DshGlobalControlLink[];
  readonly searchFilters: {
    readonly lookupInputs: readonly DshLookupInputPreview[];
    readonly dateRangeLabel: string;
    readonly deliveryMode: DshFulfillmentDeliveryMode;
    readonly ticketStatus: DshCustomer360TicketFilterStatus;
    readonly wltVisibilityLabel: string;
    readonly areaZoneLabel: string;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly lastFiveOrdersSummary: readonly DshCustomer360OrderSummary[];
  readonly ticketsHistory: readonly DshCustomer360TicketHistoryEntry[];
  readonly wltReadOnlyVisibility: DshReadOnlyFinanceVisibility;
  readonly addressServiceability: {
    readonly lastAddress: string;
    readonly serviceabilityStatus: 'serviceable' | 'blocked';
    readonly outOfZoneReason?: string;
    readonly previewClassification: DshPreviewPlaceholderStatus;
  };
  readonly notesTimeline: readonly DshCustomer360NoteEntry[];
  readonly contextSignal: ReturnType<typeof buildDshSignalRoutePreview>;
};

function buildLookupInputs(values: {
  readonly phone: string;
  readonly customerId: string;
  readonly orderId?: string;
  readonly ticketId?: string;
}): readonly DshLookupInputPreview[] {
  return [
    { key: 'phone', label: 'phone', value: values.phone, summaryFirst: true },
    { key: 'customerId', label: 'customerId', value: values.customerId, summaryFirst: true },
    { key: 'orderId', label: 'orderId', value: values.orderId ?? '—', summaryFirst: true },
    { key: 'ticketId', label: 'ticketId', value: values.ticketId ?? '—', summaryFirst: true },
  ] as const;
}

function orderAction(routeHint: string, routeId: string, label: string): DshRouteHintedAction {
  return {
    actionId: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    routeHint,
    routeId,
    onDemandPolicy: 'detail-on-open',
  };
}

export const DSH_CUSTOMER_360_PREVIEW: readonly DshCustomer360Record[] = [
  {
    customerId: 'cus-9021',
    customerName: 'لمى ناصر',
    maskedPhone: '05*******18',
    cityLabel: 'الرياض',
    verificationStatus: 'verified',
    activeOrderId: 'ORD-1102',
    openTicketId: 'TKT-1102',
    latestIssueSummary: 'بديل منتج بانتظار تثبيت نهائي قبل إرسال الطلب.',
    wltVisibilitySummary: 'المدفوعات والاستردادات والتسوية تظهر هنا كمرجع WLT للقراءة فقط.',
    allowedActions: ['فتح Assisted Order', 'فتح Order Rescue', 'فتح التذكرة أو الطلب أو WLT visibility'],
    forbiddenActions: ['بدء refund من Customer 360', 'إظهار PII غير المتحقق منها', 'نسخ payloads مالية داخل الشاشة'],
    onDemandPolicy: 'detail-on-open',
    quickActions: [
      {
        actionId: 'open-active-order',
        label: 'open active order',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=live-orders&orderId=ORD-1102&customerId=cus-9021&ticketId=TKT-1102',
        routeId: 'cp/operations/live-orders',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'create-ticket',
        label: 'create ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-1102',
        routeId: 'cp/support/ticket',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'open-assisted-order',
        label: 'open assisted order',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-9021&orderId=ORD-1102&ticketId=TKT-1102',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'open-order-rescue',
        label: 'open order rescue',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=order-rescue&customerId=cus-9021&orderId=ORD-1102&ticketId=TKT-1102',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'open-manual-call-intake',
        label: 'open manual call intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&customerId=cus-9021&orderId=ORD-1102&ticketId=TKT-1102',
        routeId: 'cp/support/call-intake',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'open-wlt-visibility',
        label: 'open WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'finance-preview-only',
        readOnly: true,
      },
    ],
    searchFilters: {
      lookupInputs: buildLookupInputs({
        phone: '05*******18',
        customerId: 'cus-9021',
        orderId: 'ORD-1102',
        ticketId: 'TKT-1102',
      }),
      dateRangeLabel: 'آخر 30 يومًا',
      deliveryMode: 'bthwani_delivery',
      ticketStatus: 'escalated',
      wltVisibilityLabel: 'payment + refund + settlement visibility',
      areaZoneLabel: 'Riyadh / Al Yasmin',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    lastFiveOrdersSummary: [
      {
        orderId: 'ORD-1102',
        store: 'سوبرماركت الواحة',
        deliveryMode: 'bthwani_delivery',
        deliveryModeLabel: 'توصيل بثواني',
        lifecycleStatus: 'partner_confirmation_pending',
        paymentVisibility: 'Paid snapshot visible',
        refundVisibility: 'No refund pending',
        latestTicket: 'TKT-1102',
        primaryAction: orderAction('/operations?workspace=assisted-order-desk&orderId=ORD-1102&customerId=cus-9021&ticketId=TKT-1102', 'cp/operations/assisted-order-desk', 'Open assisted order'),
      },
      {
        orderId: 'ORD-1081',
        store: 'حلويات قصر الشام',
        deliveryMode: 'partner_delivery',
        deliveryModeLabel: 'توصيل المتجر',
        lifecycleStatus: 'delivered',
        paymentVisibility: 'COD snapshot visible',
        refundVisibility: 'Refund completed in WLT',
        latestTicket: 'TKT-1041',
        primaryAction: orderAction('/support?workspace=queue&ticketId=TKT-1041', 'cp/support/ticket', 'Open ticket'),
      },
      {
        orderId: 'ORD-1018',
        store: 'مخبز الفجر',
        deliveryMode: 'pickup',
        deliveryModeLabel: 'استلام بنفسي',
        lifecycleStatus: 'pickup_ready',
        paymentVisibility: 'Prepaid snapshot visible',
        refundVisibility: 'No refund ticket',
        latestTicket: '—',
        primaryAction: orderAction('/operations?workspace=live-orders&orderId=ORD-1018&customerId=cus-9021', 'cp/operations/live-orders', 'Open active order'),
      },
      {
        orderId: 'ORD-0997',
        store: 'بقالة الريف',
        deliveryMode: 'bthwani_delivery',
        deliveryModeLabel: 'توصيل بثواني',
        lifecycleStatus: 'delivery_failed',
        paymentVisibility: 'Paid snapshot visible',
        refundVisibility: 'Refund review requested',
        latestTicket: 'TKT-0997',
        primaryAction: orderAction('/operations?workspace=order-rescue&orderId=ORD-0997&customerId=cus-9021&ticketId=TKT-0997', 'cp/operations/order-rescue', 'Open order rescue'),
      },
      {
        orderId: 'ORD-0932',
        store: 'محمصة المدينة',
        deliveryMode: 'partner_delivery',
        deliveryModeLabel: 'توصيل المتجر',
        lifecycleStatus: 'resolved',
        paymentVisibility: 'Wallet snapshot visible',
        refundVisibility: 'No refund action',
        latestTicket: 'TKT-0932',
        primaryAction: orderAction('/support?workspace=call-intake&customerId=cus-9021&ticketId=TKT-0932', 'cp/support/call-intake', 'Open manual call intake'),
      },
    ],
    ticketsHistory: [
      { ticketId: 'TKT-1102', status: 'escalated', statusLabel: 'مصعّد', sla: '5 دقائق', owner: 'Operations', latestNote: 'بانتظار تثبيت البديل', routeHint: '/support?workspace=queue&ticketId=TKT-1102' },
      { ticketId: 'TKT-1041', status: 'resolved', statusLabel: 'resolved view', sla: 'أغلق خلال 18 دقيقة', owner: 'Support', latestNote: 'اكتمل التوضيح للعميل', routeHint: '/support?workspace=queue&ticketId=TKT-1041' },
      { ticketId: 'TKT-0997', status: 'open', statusLabel: 'مفتوح', sla: '12 دقيقة', owner: 'Support', latestNote: 'تحويل إلى Order Rescue', routeHint: '/support?workspace=queue&ticketId=TKT-0997' },
    ],
    wltReadOnlyVisibility: {
      paymentVisibility: 'Payment snapshot visible on open only.',
      refundVisibility: 'Refund status visible on open only.',
      settlementVisibility: 'Settlement labels only, no mutation.',
      readOnly: true,
      mutationForbidden: true,
      calculationTruthOwner: 'WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
      onDemandPolicy: 'finance-preview-only',
      placeholderClassification: 'BLOCKED_BY_WLT',
    },
    addressServiceability: {
      lastAddress: 'الرياض - الياسمين - شارع الثمامة',
      serviceabilityStatus: 'serviceable',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    notesTimeline: [
      { noteId: 'note-1102-1', source: 'support note', body: 'تم تأكيد أن البديل مناسب قبل أي submit preview.', timestampLabel: 'منذ 18 دقيقة' },
      { noteId: 'note-1102-2', source: 'ops note', body: 'العمليات تراجع serviceability فقط ولا تنفذ أي أثر مالي.', timestampLabel: 'منذ 12 دقيقة' },
      { noteId: 'note-1102-3', source: 'audit note', body: 'سبب التدخل موثق ضمن سجل assisted-order.', timestampLabel: 'منذ 10 دقائق' },
    ],
    contextSignal: buildDshSignalRoutePreview('customer_360_followup'),
  },
  {
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    maskedPhone: '05*******44',
    cityLabel: 'جدة',
    verificationStatus: 'required',
    activeOrderId: 'ORD-1184',
    openTicketId: 'TKT-1184',
    latestIssueSummary: 'مكالمة خارجية لإنشاء طلب مساعد مع حساسية بيانات مرتفعة.',
    wltVisibilitySummary: 'لا تظهر أي تفاصيل مالية حساسة قبل التحقق. WLT يبقى مرجعًا منفصلًا.',
    allowedActions: ['بدء Call Intake', 'فتح ticket support', 'ربط العميل بطلبه النشط'],
    forbiddenActions: ['إظهار العنوان الكامل قبل التحقق', 'تجاوز source = external_phone_manual', 'بدء money mutation'],
    onDemandPolicy: 'detail-on-open',
    quickActions: [
      {
        actionId: 'open-active-order',
        label: 'open active order',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=live-orders&orderId=ORD-1184&customerId=cus-4188&ticketId=TKT-1184',
        routeId: 'cp/operations/live-orders',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'create-ticket',
        label: 'create ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-1184',
        routeId: 'cp/support/ticket',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
      },
      {
        actionId: 'open-assisted-order',
        label: 'open assisted order',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184',
        routeId: 'cp/operations/assisted-order-desk',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'open-order-rescue',
        label: 'open order rescue',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=order-rescue&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184',
        routeId: 'cp/operations/order-rescue',
        onDemandPolicy: 'detail-on-open',
        auditRequired: true,
        reasonRequired: true,
      },
      {
        actionId: 'open-manual-call-intake',
        label: 'open manual call intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184',
        routeId: 'cp/support/call-intake',
        onDemandPolicy: 'detail-on-open',
      },
      {
        actionId: 'open-wlt-visibility',
        label: 'open WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
        routeId: 'cp/finance/refunds',
        onDemandPolicy: 'finance-preview-only',
        readOnly: true,
      },
    ],
    searchFilters: {
      lookupInputs: buildLookupInputs({
        phone: '05*******44',
        customerId: 'cus-4188',
        orderId: 'ORD-1184',
        ticketId: 'TKT-1184',
      }),
      dateRangeLabel: 'آخر 14 يومًا',
      deliveryMode: 'pickup',
      ticketStatus: 'open',
      wltVisibilityLabel: 'payment/refund visibility on open only',
      areaZoneLabel: 'Jeddah / Al Rawdah',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    lastFiveOrdersSummary: [
      {
        orderId: 'ORD-1184',
        store: 'متجر النخبة',
        deliveryMode: 'pickup',
        deliveryModeLabel: 'استلام بنفسي',
        lifecycleStatus: 'identity_verification_required',
        paymentVisibility: 'Hidden until verification',
        refundVisibility: 'Hidden until verification',
        latestTicket: 'TKT-1184',
        primaryAction: orderAction('/support?workspace=call-intake&customerId=cus-4188&orderId=ORD-1184&ticketId=TKT-1184', 'cp/support/call-intake', 'Open manual call intake'),
      },
      {
        orderId: 'ORD-1170',
        store: 'بيت العصائر',
        deliveryMode: 'partner_delivery',
        deliveryModeLabel: 'توصيل المتجر',
        lifecycleStatus: 'delivered',
        paymentVisibility: 'Card snapshot visible',
        refundVisibility: 'No refund ticket',
        latestTicket: '—',
        primaryAction: orderAction('/operations?workspace=live-orders&orderId=ORD-1170&customerId=cus-4188', 'cp/operations/live-orders', 'Open active order'),
      },
      {
        orderId: 'ORD-1151',
        store: 'صيدلية الرحاب',
        deliveryMode: 'bthwani_delivery',
        deliveryModeLabel: 'توصيل بثواني',
        lifecycleStatus: 'delivery_failed',
        paymentVisibility: 'Paid snapshot visible',
        refundVisibility: 'Refund review pending in WLT',
        latestTicket: 'TKT-1151',
        primaryAction: orderAction('/operations?workspace=order-rescue&orderId=ORD-1151&customerId=cus-4188&ticketId=TKT-1151', 'cp/operations/order-rescue', 'Open order rescue'),
      },
      {
        orderId: 'ORD-1123',
        store: 'مخبوزات الشرق',
        deliveryMode: 'pickup',
        deliveryModeLabel: 'استلام بنفسي',
        lifecycleStatus: 'resolved',
        paymentVisibility: 'Wallet snapshot visible',
        refundVisibility: 'No refund',
        latestTicket: 'TKT-1123',
        primaryAction: orderAction('/support?workspace=queue&ticketId=TKT-1123', 'cp/support/ticket', 'Open ticket'),
      },
      {
        orderId: 'ORD-1087',
        store: 'فاكهة اليوم',
        deliveryMode: 'partner_delivery',
        deliveryModeLabel: 'توصيل المتجر',
        lifecycleStatus: 'cancelled',
        paymentVisibility: 'Card snapshot visible',
        refundVisibility: 'Refund completed in WLT',
        latestTicket: 'TKT-1087',
        primaryAction: orderAction('/finance?workspace=refunds&orderId=ORD-1087', 'cp/finance/refunds', 'Open WLT visibility'),
      },
    ],
    ticketsHistory: [
      { ticketId: 'TKT-1184', status: 'open', statusLabel: 'مفتوح', sla: '9 دقائق', owner: 'Support', latestNote: 'العميل يحتاج تحققًا إضافيًا', routeHint: '/support?workspace=queue&ticketId=TKT-1184' },
      { ticketId: 'TKT-1151', status: 'escalated', statusLabel: 'مصعّد', sla: '4 دقائق', owner: 'Operations', latestNote: 'تحويل إلى rescue بسبب delivery failed', routeHint: '/support?workspace=queue&ticketId=TKT-1151' },
      { ticketId: 'TKT-1123', status: 'resolved', statusLabel: 'resolved view', sla: 'أغلق خلال 11 دقيقة', owner: 'Support', latestNote: 'أُغلق بعد توضيح حالة pickup', routeHint: '/support?workspace=queue&ticketId=TKT-1123' },
    ],
    wltReadOnlyVisibility: {
      paymentVisibility: 'Payment visibility remains hidden until identity verification completes.',
      refundVisibility: 'Refund visibility remains read-only and contextual.',
      settlementVisibility: 'Settlement labels only after explicit open.',
      readOnly: true,
      mutationForbidden: true,
      calculationTruthOwner: 'WLT',
      routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
      onDemandPolicy: 'finance-preview-only',
      placeholderClassification: 'BLOCKED_BY_WLT',
    },
    addressServiceability: {
      lastAddress: 'جدة - الروضة - شارع الأمير سلطان',
      serviceabilityStatus: 'blocked',
      outOfZoneReason: 'آخر عنوان نشط لا يدعم bthwani_delivery حاليًا، ويحتاج pickup أو partner_delivery.',
      previewClassification: 'ACCEPTED_PREVIEW_LABEL',
    },
    notesTimeline: [
      { noteId: 'note-1184-1', source: 'support note', body: 'المكالمة الخارجية مثبتة كمصدر وحيد لهذه الحالة.', timestampLabel: 'منذ 21 دقيقة' },
      { noteId: 'note-1184-2', source: 'ops note', body: 'العمليات لن تتابع الحالة قبل اكتمال التحقق أو تحويلها رسميًا.', timestampLabel: 'منذ 15 دقيقة' },
      { noteId: 'note-1184-3', source: 'audit note', body: 'أي handoff لاحق يجب أن يحمل operator note وreason واضحين.', timestampLabel: 'منذ 11 دقيقة' },
    ],
    contextSignal: buildDshSignalRoutePreview('customer_360_followup'),
  },
] as const;

export function getDshCustomer360Record(customerId: string): DshCustomer360Record | undefined {
  return DSH_CUSTOMER_360_PREVIEW.find((entry) => entry.customerId === customerId);
}

export function getDshCustomer360ByContext(context: {
  readonly customerId?: string | null;
  readonly orderId?: string | null;
  readonly ticketId?: string | null;
}): DshCustomer360Record | undefined {
  if (context.customerId) {
    const byCustomer = getDshCustomer360Record(context.customerId);
    if (byCustomer) {
      return byCustomer;
    }
  }

  return DSH_CUSTOMER_360_PREVIEW.find((entry) => {
    if (context.orderId && entry.lastFiveOrdersSummary.some((order) => order.orderId === context.orderId)) {
      return true;
    }

    if (context.ticketId && entry.ticketsHistory.some((ticket) => ticket.ticketId === context.ticketId)) {
      return true;
    }

    return false;
  });
}

export function getDshCustomer360SectionOwnerLabel(sectionId: DshControlPanelSectionId): string {
  if (sectionId === 'operations') {
    return 'Operations';
  }

  if (sectionId === 'finance') {
    return 'WLT visibility';
  }

  return 'Support';
}
