export type DshAuditEntry = {
  id: string;
  actionId: string;
  actorId: string;
  actorRole: string;
  targetType: string;
  targetId: string;
  previousValue: string;
  nextValue: string;
  reasonCode: string;
  evidence: string;
  approvedBy: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
};

export type DshAuditSummary = {
  actions: number;
  approvalRequired: number;
  highRisk: number;
  evidenceLinked: number;
};

const auditSummary: DshAuditSummary = {
  actions: 12,
  approvalRequired: 5,
  highRisk: 3,
  evidenceLinked: 9,
};

const auditEntries: readonly DshAuditEntry[] = [
  { id: 'AUD-701', actionId: 'ACT-501', actorId: 'OPS-12', actorRole: 'operations', targetType: 'order', targetId: 'ORD-24018', previousValue: 'unassigned', nextValue: 'assigned', reasonCode: 'dispatch_override', evidence: 'dispatch note attached', approvedBy: 'supervisor', risk: 'high' },
  { id: 'AUD-702', actionId: 'ACT-502', actorId: 'SUP-03', actorRole: 'support', targetType: 'exception', targetId: 'EX-502', previousValue: 'open', nextValue: 'refund-ready', reasonCode: 'item_unavailable', evidence: 'partner proof linked', approvedBy: 'manager', risk: 'medium' },
  { id: 'AUD-703', actionId: 'ACT-503', actorId: 'OPS-08', actorRole: 'operations', targetType: 'delivery', targetId: 'DEL-8104', previousValue: 'captain-allocated', nextValue: 'redispatch', reasonCode: 'captain_no_show', evidence: 'timeline event linked', approvedBy: 'pending', risk: 'critical' },
  { id: 'AUD-704', actionId: 'ACT-504', actorId: 'FIN-14', actorRole: 'finance', targetType: 'refund', targetId: 'RF-1920', previousValue: 'queued', nextValue: 'approved', reasonCode: 'refund_required', evidence: 'ledger reference linked', approvedBy: 'finance-lead', risk: 'low' },
];

export function getDshAuditPreview() {
  return {
    summary: auditSummary,
    entries: auditEntries,
  };
}