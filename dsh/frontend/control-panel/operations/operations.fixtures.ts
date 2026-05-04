import { COMMAND_CENTER_PREVIEW, LIVE_ORDERS_PREVIEW, DISPATCH_ASSIGNMENT_PREVIEW, CAPTAIN_OPERATIONS_PREVIEW, PARTNER_STORES_PREVIEW, AREA_CAPACITY_PREVIEW, EXCEPTIONS_ESCALATIONS_PREVIEW, AUDIT_SUPPORT_SLA_PREVIEW } from './operations.preview-data';
import type { CanonicalOperationsGroupId } from './operations.types';

export const OPERATIONS_TOP_FILTERS = [
  { id: 'pulse', label: 'Operational pulse', group: 'command-center' },
  { id: 'queues', label: 'Queue focus', group: 'live-orders' },
  { id: 'risk', label: 'Risk focus', group: 'exceptions-escalations' },
] as const satisfies ReadonlyArray<{ id: string; label: string; group: CanonicalOperationsGroupId }>;

export const OPERATIONS_PULSE_METRICS = COMMAND_CENTER_PREVIEW.signals.map((signal) => ({
  id: signal.id,
  title: signal.title,
  value: signal.value,
  description: signal.description,
  tone: signal.tone,
}));

export const OPERATIONS_OVERVIEW_ACTIONS = COMMAND_CENTER_PREVIEW.actions.map((action) => ({
  id: action.id,
  title: action.label,
  description: action.description,
  href: action.href,
  footerLabel: action.badge ?? 'Open',
}));

export const AWNAK_OPERATIONAL_NOTES = [
  'Manual assignment stays inside the proxy lane.',
  'Estimate and offer review remain visible without opening a separate workspace.',
  'Schedule and follow-up actions stay close to Shein proxy requests.',
] as const;

export const OPERATIONS_PREVIEW_DATA = {
  commandCenter: COMMAND_CENTER_PREVIEW,
  liveOrders: LIVE_ORDERS_PREVIEW,
  dispatchAssignment: DISPATCH_ASSIGNMENT_PREVIEW,
  captainOperations: CAPTAIN_OPERATIONS_PREVIEW,
  partnerStores: PARTNER_STORES_PREVIEW,
  areaCapacity: AREA_CAPACITY_PREVIEW,
  exceptionsEscalations: EXCEPTIONS_ESCALATIONS_PREVIEW,
  auditSupportSla: AUDIT_SUPPORT_SLA_PREVIEW,
} as const;