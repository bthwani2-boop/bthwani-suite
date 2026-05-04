export type DshExceptionLane = {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedOrder: string;
  ownerRole: string;
  nextDecision: string;
  hint: string;
  auditRequired: boolean;
};

export type DshExceptionSummary = {
  open: number;
  auditRequired: number;
  refundReady: number;
  redispatchNeeded: number;
};

const exceptionSummary: DshExceptionSummary = {
  open: 8,
  auditRequired: 5,
  refundReady: 3,
  redispatchNeeded: 2,
};

const exceptionLanes: readonly DshExceptionLane[] = [
  { id: 'EX-501', title: 'store_closed', severity: 'critical', affectedOrder: 'ORD-24018', ownerRole: 'partner', nextDecision: 'Hold and escalate', hint: 'Store is closed and cannot accept the order.', auditRequired: true },
  { id: 'EX-502', title: 'item_unavailable', severity: 'high', affectedOrder: 'ORD-24019', ownerRole: 'partner', nextDecision: 'Refund or partial fulfill', hint: 'The item is missing from the partner shelf.', auditRequired: true },
  { id: 'EX-503', title: 'customer_unreachable', severity: 'medium', affectedOrder: 'ORD-24020', ownerRole: 'support', nextDecision: 'Retry contact', hint: 'Need a second contact attempt before closure.', auditRequired: false },
  { id: 'EX-504', title: 'redispatch_required', severity: 'high', affectedOrder: 'ORD-24021', ownerRole: 'operations', nextDecision: 'Reassign captain', hint: 'The current delivery should be sent back into dispatch.', auditRequired: true },
];

export function getDshExceptionPreview() {
  return {
    summary: exceptionSummary,
    lanes: exceptionLanes,
  };
}