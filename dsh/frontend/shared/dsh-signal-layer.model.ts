/**
 * P0-08 — DSH Signal Layer Model (UI_PREVIEW_ONLY)
 *
 * Centralized signal type contract for all DSH actor surfaces.
 * On-demand retrieval enforced: lists show summaries only; details open on explicit action.
 * No backend binding, no mutation, no eager payload loading.
 *
 * Actor routing: each signal kind declares which surfaces and roles receive it,
 * and which route opens on action — ensuring every signal has a destination.
 */

// ─── Event Kinds ─────────────────────────────────────────────────────────────

export type DshSignalEventKind =
  // Partner lifecycle
  | 'partner_submitted'
  | 'partner_docs_missing'
  | 'partner_approved'
  | 'partner_rejected'
  // Catalog
  | 'catalog_item_approved'
  | 'catalog_item_rejected'
  | 'catalog_published'
  // Order lifecycle
  | 'order_created'
  | 'payment_failed'
  | 'partner_accepted'
  | 'partner_rejected_order'
  | 'captain_assigned'
  | 'captain_declined'
  | 'reassignment_required'
  | 'picked_up'
  | 'delivered'
  | 'delivery_failed'
  // Support / SLA
  | 'ticket_created'
  | 'ticket_escalated'
  | 'sla_breach'
  // WLT finance — read-only display only; DSH never mutates
  | 'refund_pending_wlt'
  | 'refund_completed_wlt'
  | 'settlement_ready_wlt';

// ─── Surface / Role ───────────────────────────────────────────────────────────

export type DshSignalRecipientSurface =
  | 'app-client'
  | 'app-partner'
  | 'app-captain'
  | 'app-field'
  | 'control-panel';

export type DshSignalRecipientRole =
  | 'client'
  | 'partner'
  | 'captain'
  | 'field'
  | 'ops'
  | 'system';

export type DshSignalEntityType =
  | 'order'
  | 'partner'
  | 'catalog'
  | 'captain'
  | 'ticket'
  | 'refund'
  | 'settlement'
  | 'payment'
  | 'sla';

export type DshSignalPriority = 'normal' | 'important' | 'urgent';

// ─── Actions & Policy ─────────────────────────────────────────────────────────

export type DshSignalAction = {
  readonly actionId: string;
  readonly label: string;
  /** Route ID — every signal action must have a destination; no orphan signals */
  readonly routeId: string;
};

export type DshSignalOnDemandPolicy = {
  /** Full detail screen route — opened only on explicit user action, never eagerly */
  readonly detailRoute: string;
  /** Lists always show summaries only — detail is never pre-loaded */
  readonly summaryOnly: true;
  /** How long the signal persists (hours). Undefined = until entity closes */
  readonly retentionHours?: number;
};

// ─── Core Signal Event ────────────────────────────────────────────────────────

export type DshSignalEvent = {
  readonly eventId: string;
  readonly kind: DshSignalEventKind;
  readonly recipientSurface: ReadonlyArray<DshSignalRecipientSurface>;
  readonly recipientRole: ReadonlyArray<DshSignalRecipientRole>;
  readonly entityType: DshSignalEntityType;
  readonly entityId: string;
  readonly priority: DshSignalPriority;
  readonly title: string;
  readonly body: string;
  /** Primary route — where this signal navigates by default */
  readonly routeId: string;
  readonly primaryAction: DshSignalAction;
  readonly secondaryAction?: DshSignalAction;
  readonly readState: 'unread' | 'read';
  readonly auditRequired: boolean;
  readonly onDemandPolicy: DshSignalOnDemandPolicy;
  /** ISO display label — UI_PREVIEW_ONLY (not runtime UTC) */
  readonly emittedAt: string;
};

// ─── Lean Summary (list-safe) ─────────────────────────────────────────────────

/** Use in lists — no body, no full actions. Load DshSignalEvent on explicit open. */
export type DshSignalSummary = {
  readonly eventId: string;
  readonly kind: DshSignalEventKind;
  readonly priority: DshSignalPriority;
  readonly title: string;
  readonly entityId: string;
  readonly entityType: DshSignalEntityType;
  readonly readState: 'unread' | 'read';
  readonly routeId: string;
  readonly emittedAt: string;
};

// ─── Actor Routing Registry ───────────────────────────────────────────────────

export type DshSignalActorRoute = {
  readonly kind: DshSignalEventKind;
  readonly surfaces: ReadonlyArray<DshSignalRecipientSurface>;
  readonly roles: ReadonlyArray<DshSignalRecipientRole>;
  readonly routeId: string;
  readonly priority: DshSignalPriority;
  readonly auditRequired: boolean;
  readonly retentionHours?: number;
};

export const DSH_SIGNAL_ACTOR_ROUTES: ReadonlyArray<DshSignalActorRoute> = [
  // Partner lifecycle
  { kind: 'partner_submitted',       surfaces: ['control-panel', 'app-partner'], roles: ['ops', 'partner'],             routeId: 'cp/partners/approval',              priority: 'important', auditRequired: true,  retentionHours: 48 },
  { kind: 'partner_docs_missing',    surfaces: ['control-panel', 'app-partner'], roles: ['ops', 'partner'],             routeId: 'cp/partners/approval',              priority: 'important', auditRequired: false, retentionHours: 48 },
  { kind: 'partner_approved',        surfaces: ['app-partner', 'control-panel'], roles: ['partner', 'ops'],             routeId: 'partner/onboarding/approved',       priority: 'important', auditRequired: true,  retentionHours: 72 },
  { kind: 'partner_rejected',        surfaces: ['app-partner', 'control-panel'], roles: ['partner', 'ops'],             routeId: 'partner/onboarding/rejected',       priority: 'urgent',    auditRequired: true,  retentionHours: 72 },
  // Catalog
  { kind: 'catalog_item_approved',   surfaces: ['app-partner', 'control-panel'], roles: ['partner', 'ops'],             routeId: 'partner/catalog/item',              priority: 'normal',    auditRequired: false, retentionHours: 24 },
  { kind: 'catalog_item_rejected',   surfaces: ['app-partner', 'control-panel'], roles: ['partner', 'ops'],             routeId: 'partner/catalog/item',              priority: 'important', auditRequired: true,  retentionHours: 24 },
  { kind: 'catalog_published',       surfaces: ['app-partner', 'control-panel'], roles: ['partner', 'ops'],             routeId: 'partner/catalog/published',         priority: 'normal',    auditRequired: false, retentionHours: 24 },
  // Order lifecycle
  { kind: 'order_created',           surfaces: ['app-client', 'control-panel'],                   roles: ['client', 'ops'],             routeId: 'client/orders/tracking',           priority: 'normal',    auditRequired: false, retentionHours: 48 },
  { kind: 'payment_failed',          surfaces: ['app-client', 'control-panel'],                   roles: ['client', 'ops'],             routeId: 'client/orders/payment-retry',      priority: 'urgent',    auditRequired: true,  retentionHours: 6  },
  { kind: 'partner_accepted',        surfaces: ['app-client', 'app-partner', 'control-panel'],    roles: ['client', 'partner', 'ops'],  routeId: 'client/orders/tracking',           priority: 'normal',    auditRequired: false, retentionHours: 24 },
  { kind: 'partner_rejected_order',  surfaces: ['app-partner', 'control-panel'],                  roles: ['partner', 'ops'],            routeId: 'cp/operations/dispatch-assignment', priority: 'urgent',   auditRequired: true,  retentionHours: 2  },
  { kind: 'captain_assigned',        surfaces: ['app-client', 'app-captain', 'control-panel'],    roles: ['client', 'captain', 'ops'],  routeId: 'client/orders/tracking',           priority: 'normal',    auditRequired: false, retentionHours: 24 },
  { kind: 'captain_declined',        surfaces: ['app-captain', 'control-panel'],                  roles: ['captain', 'ops'],            routeId: 'cp/operations/dispatch-assignment', priority: 'important', auditRequired: true, retentionHours: 2  },
  { kind: 'reassignment_required',   surfaces: ['control-panel'],                                 roles: ['ops'],                       routeId: 'cp/operations/dispatch-assignment', priority: 'urgent',   auditRequired: true,  retentionHours: 1  },
  { kind: 'picked_up',               surfaces: ['app-client', 'app-captain', 'control-panel'],    roles: ['client', 'captain', 'ops'],  routeId: 'client/orders/tracking',           priority: 'normal',    auditRequired: false, retentionHours: 12 },
  { kind: 'delivered',               surfaces: ['app-client', 'app-captain', 'control-panel'],    roles: ['client', 'captain', 'ops'],  routeId: 'client/orders/receipt',            priority: 'normal',    auditRequired: false, retentionHours: 24 },
  { kind: 'delivery_failed',         surfaces: ['app-client', 'app-captain', 'control-panel'],    roles: ['client', 'captain', 'ops'],  routeId: 'cp/operations/exceptions',         priority: 'urgent',    auditRequired: true,  retentionHours: 4  },
  // Support / SLA
  { kind: 'ticket_created',          surfaces: ['control-panel'],                                 roles: ['ops'],                       routeId: 'cp/support/ticket',                priority: 'normal',    auditRequired: false              },
  { kind: 'ticket_escalated',        surfaces: ['control-panel'],                                 roles: ['ops'],                       routeId: 'cp/support/escalation',            priority: 'urgent',    auditRequired: true               },
  { kind: 'sla_breach',              surfaces: ['control-panel'],                                 roles: ['ops'],                       routeId: 'cp/support/sla-dashboard',         priority: 'urgent',    auditRequired: true               },
  // WLT finance — view-only signals; DSH never initiates or mutates
  { kind: 'refund_pending_wlt',      surfaces: ['app-client', 'control-panel'],                   roles: ['client', 'ops'],             routeId: 'cp/finance/refunds',               priority: 'important', auditRequired: true,  retentionHours: 72 },
  { kind: 'refund_completed_wlt',    surfaces: ['app-client', 'control-panel'],                   roles: ['client', 'ops'],             routeId: 'cp/finance/refunds',               priority: 'normal',    auditRequired: false, retentionHours: 72 },
  { kind: 'settlement_ready_wlt',    surfaces: ['control-panel'],                                 roles: ['ops'],                       routeId: 'cp/finance/settlements',           priority: 'important', auditRequired: true,  retentionHours: 48 },
];

// ─── Arabic Labels ────────────────────────────────────────────────────────────

const DSH_SIGNAL_EVENT_LABELS: Record<DshSignalEventKind, string> = {
  partner_submitted:      'طلب تسجيل شريك جديد',
  partner_docs_missing:   'وثائق الشريك ناقصة',
  partner_approved:       'تم قبول الشريك',
  partner_rejected:       'تم رفض الشريك',
  catalog_item_approved:  'تم اعتماد منتج في الكتالوج',
  catalog_item_rejected:  'تم رفض منتج في الكتالوج',
  catalog_published:      'تم نشر الكتالوج',
  order_created:          'طلب جديد',
  payment_failed:         'فشل الدفع',
  partner_accepted:       'قبل الشريك الطلب',
  partner_rejected_order: 'رفض الشريك الطلب',
  captain_assigned:       'تم تعيين كابتن',
  captain_declined:       'رفض الكابتن الطلب',
  reassignment_required:  'يلزم إعادة إسناد',
  picked_up:              'تم استلام الطلب',
  delivered:              'تم تسليم الطلب',
  delivery_failed:        'فشل التسليم',
  ticket_created:         'تذكرة دعم جديدة',
  ticket_escalated:       'تصعيد تذكرة دعم',
  sla_breach:             'انتهاك SLA',
  refund_pending_wlt:     'استرداد قيد المعالجة — WLT',
  refund_completed_wlt:   'تم الاسترداد — WLT',
  settlement_ready_wlt:   'التسوية جاهزة — WLT',
};

// ─── Tone Map ─────────────────────────────────────────────────────────────────

const DSH_SIGNAL_TONES: Record<DshSignalEventKind, 'brand' | 'success' | 'warning' | 'danger' | 'default'> = {
  partner_submitted:      'brand',
  partner_docs_missing:   'warning',
  partner_approved:       'success',
  partner_rejected:       'danger',
  catalog_item_approved:  'success',
  catalog_item_rejected:  'danger',
  catalog_published:      'success',
  order_created:          'brand',
  payment_failed:         'danger',
  partner_accepted:       'success',
  partner_rejected_order: 'danger',
  captain_assigned:       'brand',
  captain_declined:       'warning',
  reassignment_required:  'danger',
  picked_up:              'brand',
  delivered:              'success',
  delivery_failed:        'danger',
  ticket_created:         'warning',
  ticket_escalated:       'danger',
  sla_breach:             'danger',
  refund_pending_wlt:     'warning',
  refund_completed_wlt:   'success',
  settlement_ready_wlt:   'brand',
};

// ─── Preview Fixtures ─────────────────────────────────────────────────────────
// UI_PREVIEW_ONLY — 8 representative events covering all actor surfaces.
// Production: server delivers signal summaries; details fetched on explicit open.

export const DSH_SIGNAL_PREVIEW_EVENTS: ReadonlyArray<DshSignalEvent> = [
  {
    eventId: 'sig-001',
    kind: 'partner_submitted',
    recipientSurface: ['control-panel', 'app-partner'],
    recipientRole: ['ops', 'partner'],
    entityType: 'partner',
    entityId: 'STORE-1091',
    priority: 'important',
    title: 'طلب تسجيل شريك جديد',
    body: 'الشريك STORE-1091 رفع طلب تسجيل جديد بانتظار المراجعة الأولية.',
    routeId: 'cp/partners/approval',
    primaryAction:   { actionId: 'view-partner', label: 'مراجعة الطلب', routeId: 'cp/partners/approval?partnerId=STORE-1091' },
    secondaryAction: { actionId: 'view-docs',    label: 'فتح الوثائق',  routeId: 'cp/partners/docs?partnerId=STORE-1091' },
    readState: 'unread',
    auditRequired: true,
    onDemandPolicy: { detailRoute: 'cp/partners/approval?partnerId=STORE-1091', summaryOnly: true, retentionHours: 48 },
    emittedAt: 'منذ 20 دقيقة',
  },
  {
    eventId: 'sig-002',
    kind: 'payment_failed',
    recipientSurface: ['app-client', 'control-panel'],
    recipientRole: ['client', 'ops'],
    entityType: 'payment',
    entityId: 'ORD-8821',
    priority: 'urgent',
    title: 'فشل الدفع — ORD-8821',
    body: 'فشل دفع الطلب ORD-8821 عبر WLT. يلزم إعادة المحاولة أو اختيار وسيلة دفع بديلة.',
    routeId: 'client/orders/payment-retry',
    primaryAction: { actionId: 'retry-payment', label: 'إعادة المحاولة', routeId: 'client/orders/payment-retry?orderId=ORD-8821' },
    readState: 'unread',
    auditRequired: true,
    onDemandPolicy: { detailRoute: 'client/orders/payment-retry?orderId=ORD-8821', summaryOnly: true, retentionHours: 6 },
    emittedAt: 'منذ 5 دقائق',
  },
  {
    eventId: 'sig-003',
    kind: 'captain_declined',
    recipientSurface: ['control-panel'],
    recipientRole: ['ops'],
    entityType: 'captain',
    entityId: 'CAP-77',
    priority: 'important',
    title: 'رفض الكابتن CAP-77 الطلب',
    body: 'الكابتن CAP-77 رفض الطلب ORD-9012. يلزم إعادة الإسناد فوراً.',
    routeId: 'cp/operations/dispatch-assignment',
    primaryAction:   { actionId: 'reassign',  label: 'إعادة الإسناد', routeId: 'cp/operations/dispatch-assignment?orderId=ORD-9012' },
    secondaryAction: { actionId: 'view-ops',  label: 'فتح العمليات',  routeId: 'cp/operations' },
    readState: 'unread',
    auditRequired: true,
    onDemandPolicy: { detailRoute: 'cp/operations/dispatch-assignment?orderId=ORD-9012', summaryOnly: true, retentionHours: 2 },
    emittedAt: 'منذ 8 دقائق',
  },
  {
    eventId: 'sig-004',
    kind: 'sla_breach',
    recipientSurface: ['control-panel'],
    recipientRole: ['ops'],
    entityType: 'sla',
    entityId: 'TKT-001',
    priority: 'urgent',
    title: 'انتهاك SLA — TKT-001',
    body: 'تذكرة TKT-001 تجاوزت نافذة الاستجابة المحددة. يلزم التصعيد الفوري.',
    routeId: 'cp/support/sla-dashboard',
    primaryAction:   { actionId: 'escalate',  label: 'تصعيد',      routeId: 'cp/support/escalation?ticketId=TKT-001' },
    secondaryAction: { actionId: 'view-sla',  label: 'لوحة SLA',   routeId: 'cp/support/sla-dashboard' },
    readState: 'unread',
    auditRequired: true,
    onDemandPolicy: { detailRoute: 'cp/support/ticket?ticketId=TKT-001', summaryOnly: true },
    emittedAt: 'منذ 3 دقائق',
  },
  {
    eventId: 'sig-005',
    kind: 'delivered',
    recipientSurface: ['app-client', 'control-panel'],
    recipientRole: ['client', 'ops'],
    entityType: 'order',
    entityId: 'ORD-7720',
    priority: 'normal',
    title: 'تم تسليم الطلب ORD-7720',
    body: 'تم تسليم الطلب ORD-7720 بنجاح. يمكن الآن تقييم التجربة.',
    routeId: 'client/orders/receipt',
    primaryAction:   { actionId: 'rate-order',   label: 'تقييم الطلب',    routeId: 'client/orders/receipt?orderId=ORD-7720' },
    secondaryAction: { actionId: 'view-orders',  label: 'قائمة الطلبات', routeId: 'client/orders' },
    readState: 'read',
    auditRequired: false,
    onDemandPolicy: { detailRoute: 'client/orders/receipt?orderId=ORD-7720', summaryOnly: true, retentionHours: 24 },
    emittedAt: 'منذ ساعة',
  },
  {
    eventId: 'sig-006',
    kind: 'refund_pending_wlt',
    recipientSurface: ['app-client', 'control-panel'],
    recipientRole: ['client', 'ops'],
    entityType: 'refund',
    entityId: 'ORD-8821',
    priority: 'important',
    title: 'استرداد قيد المعالجة — WLT',
    body: 'WLT يعالج استرداد الطلب ORD-8821. هذه الحالة للعرض فقط — لا دور لـ DSH في قرار الاسترداد.',
    routeId: 'cp/finance/refunds',
    primaryAction: { actionId: 'view-refund', label: 'عرض الاسترداد', routeId: 'cp/finance/refunds?orderId=ORD-8821' },
    readState: 'unread',
    auditRequired: true,
    onDemandPolicy: { detailRoute: 'cp/finance/refunds?orderId=ORD-8821', summaryOnly: true, retentionHours: 72 },
    emittedAt: 'منذ 15 دقيقة',
  },
  {
    eventId: 'sig-007',
    kind: 'catalog_published',
    recipientSurface: ['app-partner', 'control-panel'],
    recipientRole: ['partner', 'ops'],
    entityType: 'catalog',
    entityId: 'STORE-1091',
    priority: 'normal',
    title: 'تم نشر الكتالوج — STORE-1091',
    body: 'تم نشر كتالوج المتجر STORE-1091 وأصبح مرئياً للعملاء.',
    routeId: 'partner/catalog/published',
    primaryAction: { actionId: 'view-catalog', label: 'عرض الكتالوج', routeId: 'partner/catalog/published?storeId=STORE-1091' },
    readState: 'read',
    auditRequired: false,
    onDemandPolicy: { detailRoute: 'partner/catalog/published?storeId=STORE-1091', summaryOnly: true, retentionHours: 24 },
    emittedAt: 'منذ ساعتين',
  },
  {
    eventId: 'sig-008',
    kind: 'delivery_failed',
    recipientSurface: ['app-client', 'app-captain', 'control-panel'],
    recipientRole: ['client', 'captain', 'ops'],
    entityType: 'order',
    entityId: 'ORD-9011',
    priority: 'urgent',
    title: 'فشل التسليم — ORD-9011',
    body: 'الكابتن أبلغ عن فشل تسليم الطلب ORD-9011. يلزم التدخل من مركز العمليات.',
    routeId: 'cp/operations/exceptions',
    primaryAction:   { actionId: 'open-exceptions', label: 'فتح الاستثناءات',  routeId: 'cp/operations/exceptions?orderId=ORD-9011' },
    secondaryAction: { actionId: 'contact-client',  label: 'تواصل مع العميل', routeId: 'cp/support' },
    readState: 'unread',
    auditRequired: true,
    onDemandPolicy: { detailRoute: 'cp/operations/exceptions?orderId=ORD-9011', summaryOnly: true, retentionHours: 4 },
    emittedAt: 'منذ دقيقتين',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Get Arabic label for a signal event kind */
export function getDshSignalEventLabel(kind: DshSignalEventKind): string {
  return DSH_SIGNAL_EVENT_LABELS[kind];
}

/** Get display tone for a signal event kind */
export function getDshSignalEventTone(kind: DshSignalEventKind): 'brand' | 'success' | 'warning' | 'danger' | 'default' {
  return DSH_SIGNAL_TONES[kind];
}

/** Get actor routing config for a signal kind */
export function getDshSignalActorRoute(kind: DshSignalEventKind): DshSignalActorRoute | undefined {
  return DSH_SIGNAL_ACTOR_ROUTES.find((r) => r.kind === kind);
}

/** Get route for a signal kind on a specific surface */
export function getDshSignalRouteForSurface(
  kind: DshSignalEventKind,
  _surface: DshSignalRecipientSurface,
): string {
  return getDshSignalActorRoute(kind)?.routeId ?? 'cp/operations';
}

/**
 * Get lean signal summaries for a surface+role — for list display only.
 * Load DshSignalEvent detail on explicit user action via onDemandPolicy.detailRoute.
 * Max 10 results to prevent unbounded list inflation.
 */
export function getDshSignalSummaries(
  surface: DshSignalRecipientSurface,
  role: DshSignalRecipientRole,
): DshSignalSummary[] {
  return DSH_SIGNAL_PREVIEW_EVENTS
    .filter((e) => e.recipientSurface.includes(surface) && e.recipientRole.includes(role))
    .slice(0, 10)
    .map((e) => ({
      eventId: e.eventId,
      kind: e.kind,
      priority: e.priority,
      title: e.title,
      entityId: e.entityId,
      entityType: e.entityType,
      readState: e.readState,
      routeId: e.routeId,
      emittedAt: e.emittedAt,
    }));
}

/** Get full signal event detail — call only on explicit user open */
export function getDshSignalDetail(eventId: string): DshSignalEvent | undefined {
  return DSH_SIGNAL_PREVIEW_EVENTS.find((e) => e.eventId === eventId);
}

/** Count unread signals for a surface+role */
export function getDshSignalUnreadCount(
  surface: DshSignalRecipientSurface,
  role: DshSignalRecipientRole,
): number {
  return getDshSignalSummaries(surface, role).filter((s) => s.readState === 'unread').length;
}

/** Check if a signal kind requires audit logging */
export function isDshSignalAuditRequired(kind: DshSignalEventKind): boolean {
  return getDshSignalActorRoute(kind)?.auditRequired ?? false;
}
