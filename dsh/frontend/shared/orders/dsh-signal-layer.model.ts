// DSH Signal Layer Model — Stub
// This file was removed but is still referenced by dsh-order.contract.ts for the
// getDshSignalActorRoute value import. This stub satisfies the Metro resolver.
// Types are erased at runtime (import type consumers can safely use this).
//
// Authority: dsh/frontend/shared/orders — no JSX, no ui-kit.

export type DshSignalEventKind =
  | 'order_created'
  | 'partner_accepted'
  | 'partner_rejected_order'
  | 'captain_assigned'
  | 'captain_declined'
  | 'picked_up'
  | 'delivered'
  | 'delivery_failed'
  | 'payment_failed'
  | 'refund_pending_wlt'
  | 'catalog_item_approved'
  | 'catalog_published'
  | 'partner_capacity_degraded'
  | 'partner_docs_missing'
  | 'partner_submitted'
  | 'ticket_escalated';

export type DshSignalPriority = 'urgent' | 'important' | 'normal';

export type DshSignalActorRoute = {
  readonly routeId: string;
  readonly auditRequired: boolean;
  readonly priority: DshSignalPriority;
};

const SIGNAL_ROUTES: Partial<Record<DshSignalEventKind, DshSignalActorRoute>> = {
  order_created: { routeId: 'cp/operations', auditRequired: false, priority: 'normal' },
  partner_accepted: { routeId: 'cp/operations', auditRequired: true, priority: 'important' },
  partner_rejected_order: { routeId: 'cp/operations', auditRequired: true, priority: 'urgent' },
  captain_assigned: { routeId: 'cp/dispatch', auditRequired: false, priority: 'normal' },
  captain_declined: { routeId: 'cp/dispatch', auditRequired: true, priority: 'important' },
  picked_up: { routeId: 'cp/operations', auditRequired: false, priority: 'normal' },
  delivered: { routeId: 'cp/operations', auditRequired: true, priority: 'normal' },
  delivery_failed: { routeId: 'cp/operations', auditRequired: true, priority: 'urgent' },
  payment_failed: { routeId: 'cp/finance', auditRequired: true, priority: 'urgent' },
  refund_pending_wlt: { routeId: 'cp/finance', auditRequired: true, priority: 'important' },
  catalog_item_approved: { routeId: 'cp/catalog', auditRequired: true, priority: 'important' },
  catalog_published: { routeId: 'cp/catalog', auditRequired: true, priority: 'normal' },
  partner_capacity_degraded: { routeId: 'cp/partners', auditRequired: true, priority: 'important' },
  partner_docs_missing: { routeId: 'cp/partners', auditRequired: true, priority: 'important' },
  partner_submitted: { routeId: 'cp/partners', auditRequired: true, priority: 'normal' },
  ticket_escalated: { routeId: 'cp/support', auditRequired: true, priority: 'urgent' },
};

export function getDshSignalActorRoute(signalKind: DshSignalEventKind): DshSignalActorRoute | undefined {
  return SIGNAL_ROUTES[signalKind];
}
