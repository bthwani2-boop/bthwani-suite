export type AppPartnerPreviewRoute = {
  id: string;
  candidateId: string;
  phase: 'Phase 12';
  status: 'placeholder';
};

export const appPartnerPreviewRoutes: AppPartnerPreviewRoute[] = [
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
  }
];