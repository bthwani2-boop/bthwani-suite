import type { CanonicalOperationsGroupId } from './operations.types';

export const OPERATIONS_TOP_FILTERS = [
  { id: 'pulse', label: 'Operational pulse', group: 'overview' },
  { id: 'queues', label: 'Queue focus', group: 'orders' },
  { id: 'risk', label: 'Risk focus', group: 'exceptions-sla' },
] as const satisfies ReadonlyArray<{ id: string; label: string; group: CanonicalOperationsGroupId }>;

export const OPERATIONS_PULSE_METRICS = [
  { id: 'pressure', title: 'Current pressure', value: '17 open actions', description: 'Orders, dispatch, and SLA risk are active now.', tone: 'warning' as const },
  { id: 'next', title: 'Next best action', value: 'Orders queue', description: 'Start from the queue before spreading into support lanes.', tone: 'brand' as const },
  { id: 'sla', title: 'SLA risk', value: '3 zones', description: 'Exceptions and delay pressure are clustered in one lane.', tone: 'danger' as const },
  { id: 'fleet', title: 'Fleet pressure', value: 'Capacity review', description: 'Dispatch fleet owns reassign, capacity, and peak mode.', tone: 'warning' as const },
  { id: 'proof', title: 'Evidence status', value: 'UI preview', description: 'Visual/runtime proof remains pending for this slice.', tone: 'default' as const },
  { id: 'noise', title: 'Noise level', value: 'Compressed', description: 'Non-operational areas are now shortcuts, not primary tabs.', tone: 'success' as const },
] as const;

export const OPERATIONS_OVERVIEW_ACTIONS = [
  {
    id: 'orders',
    title: 'Open orders lane',
    description: 'Queue, detail, and chat stay together in the same control room.',
    href: '/operations?workspace=orders',
    footerLabel: 'Open',
  },
  {
    id: 'dispatch-fleet',
    title: 'Dispatch fleet pressure',
    description: 'Dispatch, captains, capacity, reassign, and peak mode in one lane.',
    href: '/operations?workspace=dispatch-fleet',
    footerLabel: 'Open',
  },
  {
    id: 'exceptions-sla',
    title: 'Exceptions and SLA',
    description: 'Recovery actions, serviceability, and zone set are grouped here.',
    href: '/operations?workspace=exceptions-sla',
    footerLabel: 'Open',
  },
  {
    id: 'audit-evidence',
    title: 'Audit and closure evidence',
    description: 'Guard status and closure matrix stay visible without leaving operations.',
    href: '/operations?workspace=audit-evidence',
    footerLabel: 'Open',
  },
] as const;

export const AWNAK_OPERATIONAL_NOTES = [
  'Manual assignment stays inside the proxy lane.',
  'Estimate and offer review remain visible without opening a separate workspace.',
  'Schedule and follow-up actions stay close to Shein proxy requests.',
] as const;