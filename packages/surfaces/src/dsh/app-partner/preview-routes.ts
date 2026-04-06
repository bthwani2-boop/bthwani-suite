import type { Phase12PreviewRoute } from '../types';

export type DshAppPartnerPreviewRoute = Phase12PreviewRoute;

export const dshAppPartnerPreviewRoutes: DshAppPartnerPreviewRoute[] = [
  {
    id: 'partner-orders-board',
    candidateId: 'dsh_partner_orders_board',
    phase: 'Phase 12',
    status: 'placeholder',
  },
  {
    id: 'partner-order-workspace',
    candidateId: 'dsh_partner_order_workspace',
    phase: 'Phase 12',
    status: 'placeholder',
  },
  {
    id: 'partner-store-maintenance-workspace',
    candidateId: 'dsh_partner_store_maintenance_workspace',
    phase: 'Phase 12',
    status: 'placeholder',
  },
  {
    id: 'partner-order-issue-queue',
    candidateId: 'dsh_partner_order_issue_queue',
    phase: 'Phase 12',
    status: 'placeholder',
  },
];