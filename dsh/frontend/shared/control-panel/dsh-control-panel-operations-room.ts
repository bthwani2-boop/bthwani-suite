import type {
  CanonicalOperationsGroupId,
  DshControlPanelOperationalWorkspace,
  DshControlPanelSideEffectClassification,
  DshOperationalEntityId,
  DshOperationalProofRequirement,
  DshOperationalRollbackHint,
  DshWltOwnershipBoundary,
} from './dsh-operational.contract';
import type { DshSurfaceId } from './dsh-flow-registry';
import { getDshOperationalEntriesByWorkspace } from './dsh-operational-registry';

export const dshControlPanelOperationsRoomMeta = {
  dataKind: 'CONTROL_PANEL_OPERATIONS_ROOM_CONTRACT',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: true,
  phase: 'PHASE_5_OPERATIONS_ROOM_CONTRACT',
} as const;

export type DshOperationsRoomWorkspaceStatus =
  | 'metadata-bound'
  | 'preview-adapter-bound'
  | 'ui-render-binding-needed'
  | 'runtime-api-needed'
  | 'needs-visual-evidence';

export type DshOperationsRoomWorkspace = {
  readonly workspaceId: DshControlPanelOperationalWorkspace;
  readonly label: string;
  readonly purpose: string;
  readonly operationIdPattern: string;
  readonly permissionModel: string;
  readonly inputContract: string;
  readonly validationContract: string;
  readonly sideEffectClassification: DshControlPanelSideEffectClassification;
  readonly auditLog: string;
  readonly rollbackHint: DshOperationalRollbackHint;
  readonly evidenceRequirement: readonly DshOperationalProofRequirement[];
  readonly ownerService: 'dsh' | 'wlt';
  readonly wltOwnershipBoundary: DshWltOwnershipBoundary;
  readonly visibleSurfaces: readonly DshSurfaceId[];
  readonly registryEntryIds: readonly DshOperationalEntityId[];
  readonly canonicalGroupId: CanonicalOperationsGroupId;
  readonly subgroupId: string;
  readonly href: string;
  readonly status: DshOperationsRoomWorkspaceStatus;
  readonly notes: string;
};

function registryIds(workspace: DshControlPanelOperationalWorkspace): readonly DshOperationalEntityId[] {
  return getDshOperationalEntriesByWorkspace(workspace).map((entry) => entry.id);
}

function roomWorkspace(
  record: Omit<DshOperationsRoomWorkspace, 'status'>,
): DshOperationsRoomWorkspace {
  return {
    ...record,
    status: 'metadata-bound',
  };
}

export const DSH_CONTROL_PANEL_OPERATIONS_ROOM: readonly DshOperationsRoomWorkspace[] = [
  roomWorkspace({
    workspaceId: 'orders-queue',
    label: 'Orders Queue',
    purpose: 'Control order owner, SLA, lifecycle state, exception marker, support link, and settlement input readiness.',
    operationIdPattern: 'dsh.operations.orders.{orderId}.{action}',
    permissionModel: 'operations.order.write for state changes; operations.order.read for detail and evidence.',
    inputContract: 'orderId, targetLifecycleState, reasonCode, actorId, evidenceRefs, optional supportTicketId.',
    validationContract: 'Known order, allowed lifecycle transition, visible owner, no unresolved blocker, audit reason for rollback.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'orderId/action/previousState/nextState/actor/reason/evidenceRefs.',
    rollbackHint: 'restore-previous-operational-state',
    evidenceRequirement: ['audit-note', 'support-ticket-reference', 'wlt-reference'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'WLT_READ_ONLY',
    visibleSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel'],
    registryEntryIds: registryIds('orders-queue'),
    canonicalGroupId: 'live-orders',
    subgroupId: 'orders',
    href: '/operations/live-orders?subGroup=orders',
    notes: 'Payment state is displayed only from WLT reference; no DSH payment mutation is allowed.',
  }),
  roomWorkspace({
    workspaceId: 'trips-board',
    label: 'Trips Board',
    purpose: 'Track trip state, pickup/dropoff milestones, failure, return, proof, and reassignment need.',
    operationIdPattern: 'dsh.operations.trips.{tripId}.{action}',
    permissionModel: 'operations.trip.write plus assignment permission when owner changes.',
    inputContract: 'tripId, orderId, milestone, locationRef, evidenceRefs, reasonCode.',
    validationContract: 'Known trip/order pair, valid milestone order, required proof present for protected states.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'tripId/orderId/action/previousMilestone/nextMilestone/actor/evidenceRefs.',
    rollbackHint: 'reassign-owner',
    evidenceRequirement: ['pickup-code', 'photo-evidence', 'audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'DSH_SETTLEMENT_INPUT_ONLY',
    visibleSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel'],
    registryEntryIds: registryIds('trips-board'),
    canonicalGroupId: 'dispatch-capacity',
    subgroupId: 'tracking-handoff',
    href: '/operations/dispatch-capacity?subGroup=tracking-handoff',
    notes: 'Trip completion can become a WLT input candidate, not DSH accounting truth.',
  }),
  roomWorkspace({
    workspaceId: 'captain-assignment-board',
    label: 'Captain Assignment Board',
    purpose: 'Review candidates, read WLT eligibility, offer/reassign captain, and record no-show or decline.',
    operationIdPattern: 'dsh.operations.assignment.{assignmentId}.{action}',
    permissionModel: 'operations.assignment.write plus maker-checker for forced reassignment.',
    inputContract: 'assignmentId, tripId, candidateCaptainId, eligibilityRef, assignmentAttemptNo, reasonCode.',
    validationContract: 'WLT eligibility ref exists, candidate available, route still assignable, no active locked assignment.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'assignmentId/tripId/captainId/action/attemptNo/actor/eligibilityRef.',
    rollbackHint: 'reassign-owner',
    evidenceRequirement: ['wlt-reference', 'audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'WLT_READ_ONLY',
    visibleSurfaces: ['app-captain', 'control-panel', 'wlt-finance'],
    registryEntryIds: registryIds('captain-assignment-board'),
    canonicalGroupId: 'dispatch-capacity',
    subgroupId: 'dispatch-assignment',
    href: '/operations/dispatch-capacity?subGroup=dispatch-assignment',
    notes: 'Eligibility and earnings are WLT owned; DSH owns the dispatch decision record.',
  }),
  roomWorkspace({
    workspaceId: 'store-preparation-sla',
    label: 'Store Preparation SLA',
    purpose: 'Monitor preparation, item issue, substitution, store delay, ready state, and catalog readiness context.',
    operationIdPattern: 'dsh.operations.preparation.{preparationId}.{action}',
    permissionModel: 'operations.partner-prep.write for operations; catalog approval remains catalog-governed.',
    inputContract: 'preparationId, orderId, storeId, preparationState, itemIssueRef, substitutionDecision, reasonCode.',
    validationContract: 'Known store/order, unresolved item issue cannot be marked ready, substitution decision is explicit.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'preparationId/orderId/storeId/action/previousState/nextState/reason/evidenceRefs.',
    rollbackHint: 'restore-previous-operational-state',
    evidenceRequirement: ['media-reference', 'audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'DSH_SETTLEMENT_INPUT_ONLY',
    visibleSurfaces: ['app-partner', 'app-captain', 'app-field', 'control-panel'],
    registryEntryIds: registryIds('store-preparation-sla'),
    canonicalGroupId: 'live-orders',
    subgroupId: 'partner-prep',
    href: '/operations/live-orders?subGroup=partner-prep',
    notes: 'Catalog readiness is context; financial price/accounting updates remain outside DSH operations.',
  }),
  roomWorkspace({
    workspaceId: 'pickup-handoff-monitor',
    label: 'Pickup Handoff Monitor',
    purpose: 'Validate pickup code, QR/barcode/photo proof, captain arrival, store confirmation, and mismatch cases.',
    operationIdPattern: 'dsh.operations.handoff.{handoffId}.{action}',
    permissionModel: 'operations.handoff.write; mismatch closure requires audit permission.',
    inputContract: 'handoffId, orderId, tripId, proofType, evidenceRefs, mismatchItems, reasonCode.',
    validationContract: 'Arrival and store state are compatible, required proof exists, mismatch cannot close without audit.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'handoffId/orderId/tripId/action/proofType/actor/evidenceRefs/mismatch.',
    rollbackHint: 'open-exception',
    evidenceRequirement: ['pickup-code', 'qr-code', 'barcode', 'photo-evidence', 'audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'DSH_SETTLEMENT_INPUT_ONLY',
    visibleSurfaces: ['app-partner', 'app-captain', 'control-panel'],
    registryEntryIds: registryIds('pickup-handoff-monitor'),
    canonicalGroupId: 'dispatch-capacity',
    subgroupId: 'tracking-handoff',
    href: '/operations/dispatch-capacity?subGroup=tracking-handoff',
    notes: 'Handoff proof is loaded on demand and used later as settlement evidence only.',
  }),
  roomWorkspace({
    workspaceId: 'pod-review-queue',
    label: 'PoD Review Queue',
    purpose: 'Review submitted delivery proof, accept/reject proof, request manual review, and open exceptions.',
    operationIdPattern: 'dsh.operations.pod.{proofId}.{action}',
    permissionModel: 'operations.pod.review; rejection requires reason and evidence visibility.',
    inputContract: 'proofId, orderId, tripId, verificationDecision, reasonCode, evidenceRefs.',
    validationContract: 'Proof belongs to order/trip, protected delivered state requires accepted proof or explicit audit exception.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'proofId/orderId/tripId/action/decision/reason/actor/evidenceRefs.',
    rollbackHint: 'open-exception',
    evidenceRequirement: ['photo-evidence', 'otp-or-pin', 'signature', 'audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'DSH_SETTLEMENT_INPUT_ONLY',
    visibleSurfaces: ['app-client', 'app-captain', 'control-panel'],
    registryEntryIds: registryIds('pod-review-queue'),
    canonicalGroupId: 'exceptions',
    subgroupId: 'proof-review',
    href: '/operations/exceptions?subGroup=proof-review',
    notes: 'Accepted PoD may feed WLT; rejected PoD becomes an operational exception or audit candidate.',
  }),
  roomWorkspace({
    workspaceId: 'cod-discrepancy-queue',
    label: 'COD Discrepancy Queue',
    purpose: 'Compare expected and collected COD amounts and send a WLT liability candidate when complete.',
    operationIdPattern: 'dsh.operations.cod.{codEventId}.{action}',
    permissionModel: 'operations.cod.review; WLT settlement/reconciliation permission is not granted in DSH.',
    inputContract: 'codEventId, orderId, tripId, expectedAmountMinor, collectedAmountMinor, currency, reasonCode.',
    validationContract: 'Amounts are snapshots only, currency is YER, discrepancy reason required when amounts differ.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'codEventId/orderId/tripId/action/expected/collected/discrepancy/actor.',
    rollbackHint: 'wlt-review-required',
    evidenceRequirement: ['cod-amount-snapshot', 'wlt-reference', 'audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'WLT_OWNS_FINAL_FINANCIAL_TRUTH',
    visibleSurfaces: ['app-captain', 'app-partner', 'control-panel', 'wlt-finance'],
    registryEntryIds: registryIds('cod-discrepancy-queue'),
    canonicalGroupId: 'exceptions',
    subgroupId: 'cod',
    href: '/operations/exceptions?subGroup=cod',
    notes: 'DSH records operational COD facts only; WLT owns liability, ledger, and reconciliation.',
  }),
  roomWorkspace({
    workspaceId: 'exception-queue',
    label: 'Exception Queue',
    purpose: 'Triage operational exceptions, assign owner, link support, request audit, and resolve operationally.',
    operationIdPattern: 'dsh.operations.exceptions.{exceptionId}.{action}',
    permissionModel: 'operations.exception.write; critical exceptions require maker-checker.',
    inputContract: 'exceptionId, orderId, tripId, type, severity, ownerSurface, requiredAction, evidenceRefs.',
    validationContract: 'Owner is explicit, required action present, WLT-impacting cases stay as audit/input candidates.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'exceptionId/orderId/tripId/type/severity/action/owner/actor/evidenceRefs.',
    rollbackHint: 'restore-previous-operational-state',
    evidenceRequirement: ['support-ticket-reference', 'audit-note', 'wlt-reference'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'DSH_SETTLEMENT_INPUT_ONLY',
    visibleSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel', 'wlt-finance'],
    registryEntryIds: registryIds('exception-queue'),
    canonicalGroupId: 'exceptions',
    subgroupId: 'exceptions-escalations',
    href: '/operations/exceptions?subGroup=exceptions-escalations',
    notes: 'Financial adjustments are never resolved in this workspace; only WLT handoff candidates are created.',
  }),
  roomWorkspace({
    workspaceId: 'support-escalation-queue',
    label: 'Support Escalation Queue',
    purpose: 'Keep support tickets attached to order, trip, exception, and WLT read-only references.',
    operationIdPattern: 'dsh.operations.support.{ticketId}.{action}',
    permissionModel: 'operations.support.link; refund decisions remain WLT/support finance governed.',
    inputContract: 'ticketId, orderId, tripId, exceptionId, customerVisibleFlag, wltReference, reasonCode.',
    validationContract: 'Ticket remains linked to source context, WLT reference is read-only, resolution type is explicit.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'ticketId/orderId/tripId/exceptionId/action/actor/wltReference.',
    rollbackHint: 'operator-review-required',
    evidenceRequirement: ['support-ticket-reference', 'wlt-reference', 'audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'WLT_READ_ONLY',
    visibleSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel', 'wlt-finance'],
    registryEntryIds: registryIds('support-escalation-queue'),
    canonicalGroupId: 'exceptions',
    subgroupId: 'audit-support-sla',
    href: '/operations/exceptions?subGroup=audit-support-sla',
    notes: 'Support context is linked, not duplicated, and does not settle refunds in DSH.',
  }),
  roomWorkspace({
    workspaceId: 'settlement-inputs-preview',
    label: 'Settlement Inputs Preview',
    purpose: 'Build and validate operational input candidates before WLT acceptance or rejection.',
    operationIdPattern: 'dsh.operations.settlement-input.{eventId}.{action}',
    permissionModel: 'operations.settlement-input.prepare; WLT accept/reject/accounting is external.',
    inputContract: 'eventId, eventType, orderId, tripId, storeId, partnerId, proofSnapshot, codSnapshot, exceptionSnapshot.',
    validationContract: 'Required operational proof exists, blocked exceptions are declared, no missing source record.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'eventId/eventType/orderId/tripId/action/actor/proofRefs/wltReference.',
    rollbackHint: 'wlt-review-required',
    evidenceRequirement: ['pickup-code', 'photo-evidence', 'cod-amount-snapshot', 'wlt-reference', 'audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'WLT_OWNS_FINAL_FINANCIAL_TRUTH',
    visibleSurfaces: ['control-panel', 'wlt-finance'],
    registryEntryIds: registryIds('settlement-inputs-preview'),
    canonicalGroupId: 'special-ops',
    subgroupId: 'settlements',
    href: '/operations/special-ops?subGroup=settlements',
    notes: 'This workspace prepares candidates only; WLT owns the result and all accounting semantics.',
  }),
  roomWorkspace({
    workspaceId: 'wlt-finance-bridge',
    label: 'WLT Finance Bridge',
    purpose: 'Show WLT-owned references and rejection state for DSH operational candidates.',
    operationIdPattern: 'dsh.operations.wlt-bridge.{wltReference}.{action}',
    permissionModel: 'operations.wlt-bridge.read; no DSH write permission over WLT financial truth.',
    inputContract: 'wltReference, sourceEventId, sourceRecordId, handoffStatus, rejectionReason.',
    validationContract: 'Reference maps to a DSH settlement input candidate; no ledger/payout/refund mutation requested.',
    sideEffectClassification: 'preview-only',
    auditLog: 'wltReference/sourceEventId/action/actor/status/rejectionReason.',
    rollbackHint: 'wlt-review-required',
    evidenceRequirement: ['wlt-reference', 'audit-note'],
    ownerService: 'wlt',
    wltOwnershipBoundary: 'WLT_OWNS_FINAL_FINANCIAL_TRUTH',
    visibleSurfaces: ['control-panel', 'wlt-finance'],
    registryEntryIds: registryIds('wlt-finance-bridge'),
    canonicalGroupId: 'special-ops',
    subgroupId: 'finance',
    href: '/operations/special-ops?subGroup=finance',
    notes: 'Bridge is read-only from DSH. WLT remains the system of record for money.',
  }),
  roomWorkspace({
    workspaceId: 'audit-rollback',
    label: 'Audit and Rollback',
    purpose: 'Review control-panel operation records, permissions, inputs, validation, audit logs, and rollback hints.',
    operationIdPattern: 'dsh.operations.audit.{operationId}.{action}',
    permissionModel: 'operations.audit.read; rollback execution requires explicit runtime permission later.',
    inputContract: 'operationId, sourceRecordId, previousState, nextState, actorId, evidenceRefs, rollbackReason.',
    validationContract: 'Operation is known, previous state exists, rollback target is allowed, evidence reason is present.',
    sideEffectClassification: 'runtime-later',
    auditLog: 'operationId/sourceRecordId/action/actor/previousState/nextState/evidenceRefs.',
    rollbackHint: 'operator-review-required',
    evidenceRequirement: ['audit-note'],
    ownerService: 'dsh',
    wltOwnershipBoundary: 'NO_WLT_IMPACT',
    visibleSurfaces: ['control-panel'],
    registryEntryIds: registryIds('audit-rollback'),
    canonicalGroupId: 'command-center',
    subgroupId: 'audit-evidence',
    href: '/operations/command-center?subGroup=audit-evidence',
    notes: 'Audit metadata is defined here; runtime rollback implementation is a later API slice.',
  }),
] as const;

export function getDshControlPanelOperationsRoom(): readonly DshOperationsRoomWorkspace[] {
  return DSH_CONTROL_PANEL_OPERATIONS_ROOM;
}

export function getDshOperationsRoomWorkspaceById(
  workspaceId: DshControlPanelOperationalWorkspace,
): DshOperationsRoomWorkspace | undefined {
  return DSH_CONTROL_PANEL_OPERATIONS_ROOM.find((workspace) => workspace.workspaceId === workspaceId);
}

export function getDshOperationsRoomWorkspacesByGroup(
  canonicalGroupId: CanonicalOperationsGroupId,
): readonly DshOperationsRoomWorkspace[] {
  return DSH_CONTROL_PANEL_OPERATIONS_ROOM.filter((workspace) => workspace.canonicalGroupId === canonicalGroupId);
}

export function getDshOperationsRoomWorkspacesForRegistryEntry(
  registryEntryId: DshOperationalEntityId,
): readonly DshOperationsRoomWorkspace[] {
  return DSH_CONTROL_PANEL_OPERATIONS_ROOM.filter((workspace) =>
    workspace.registryEntryIds.includes(registryEntryId),
  );
}
