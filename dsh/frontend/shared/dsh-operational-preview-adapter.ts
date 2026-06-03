import {
  dshOperationalPreviewRecords,
  type DshOperationalPreviewRecord,
} from '../data/operational.preview-data';
import type { DshOperationalEntityId } from './dsh-operational.contract';
import {
  getDshOperationalEntriesBySurface,
  getDshOperationalEntriesByWorkspace,
  getDshOperationalEntryById,
} from './dsh-operational-registry';
import type { DshSurfaceId } from './dsh-flow-registry';

export const dshOperationalPreviewAdapterMeta = {
  dataKind: 'UI_PREVIEW_ONLY_ADAPTER',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  sourceDataOwner: 'dsh/frontend/data/operational.preview-data.ts',
  adapterOwner: 'dsh/frontend/shared/dsh-operational-preview-adapter.ts',
} as const;

export type DshOperationalSurfaceSummary = {
  readonly summaryId: string;
  readonly registryEntryId: DshOperationalEntityId;
  readonly label: string;
  readonly summary: string;
  readonly ownerSurface: DshSurfaceId;
  readonly status: DshOperationalPreviewRecord['status'];
  readonly controlPanelWorkspace: DshOperationalPreviewRecord['controlPanelWorkspace'];
  readonly dataClassification: DshOperationalPreviewRecord['dataClassification'];
  readonly detailRef: string;
  readonly evidenceRef?: string;
  readonly wltImpact: DshOperationalPreviewRecord['wltImpact'];
  readonly runtimeTruth: false;
  readonly backendSource: false;
  readonly bindingSource: false;
};

export type DshControlPanelOperationsPreview = {
  readonly workspace: DshOperationalPreviewRecord['controlPanelWorkspace'];
  readonly purpose: string;
  readonly records: readonly DshOperationalSurfaceSummary[];
};

function toSummary(record: DshOperationalPreviewRecord): DshOperationalSurfaceSummary {
  return {
    summaryId: record.recordId,
    registryEntryId: record.registryEntryId,
    label: record.label,
    summary: record.summary,
    ownerSurface: record.ownerSurface,
    status: record.status,
    controlPanelWorkspace: record.controlPanelWorkspace,
    dataClassification: record.dataClassification,
    detailRef: record.detailRef,
    evidenceRef: record.evidenceRef,
    wltImpact: record.wltImpact,
    runtimeTruth: false,
    backendSource: false,
    bindingSource: false,
  };
}

function byRegistryEntry(entryId: DshOperationalEntityId): readonly DshOperationalSurfaceSummary[] {
  return dshOperationalPreviewRecords
    .filter((record) => record.registryEntryId === entryId)
    .map(toSummary);
}

function byWorkspace(workspace: DshOperationalPreviewRecord['controlPanelWorkspace']): readonly DshOperationalSurfaceSummary[] {
  const registryEntryIds = new Set(getDshOperationalEntriesByWorkspace(workspace).map((entry) => entry.id));
  return dshOperationalPreviewRecords
    .filter((record) => registryEntryIds.has(record.registryEntryId))
    .map(toSummary);
}

export function buildDshOperationalSummaryForSurface(surfaceId: DshSurfaceId): readonly DshOperationalSurfaceSummary[] {
  const entryIds = new Set(getDshOperationalEntriesBySurface(surfaceId).map((entry) => entry.id));
  return dshOperationalPreviewRecords
    .filter((record) => record.ownerSurface === surfaceId || record.visibleSurfaces.includes(surfaceId) || entryIds.has(record.registryEntryId))
    .map(toSummary);
}

export function buildDshControlPanelOperationsPreview(): readonly DshControlPanelOperationsPreview[] {
  return [
    { workspace: 'orders-queue', purpose: 'Order status, owner, SLA, exception, support, and settlement input visibility.', records: byWorkspace('orders-queue') },
    { workspace: 'trips-board', purpose: 'Trip status, assignment, pickup/dropoff, proof, failure, and return visibility.', records: byWorkspace('trips-board') },
    { workspace: 'captain-assignment-board', purpose: 'Captain candidates, WLT eligibility read-only, and assignment decision preview.', records: byWorkspace('captain-assignment-board') },
    { workspace: 'store-preparation-sla', purpose: 'Store preparation, item issue, substitution, ready, and handoff visibility.', records: byWorkspace('store-preparation-sla') },
    { workspace: 'pickup-handoff-monitor', purpose: 'Pickup code, QR/barcode/photo, mismatch, and store delay evidence.', records: byWorkspace('pickup-handoff-monitor') },
    { workspace: 'pod-review-queue', purpose: 'Proof of delivery submitted, accepted, rejected, and audit-required states.', records: byWorkspace('pod-review-queue') },
    { workspace: 'cod-discrepancy-queue', purpose: 'COD expected, collected, discrepancy, and WLT handoff candidate visibility.', records: byWorkspace('cod-discrepancy-queue') },
    { workspace: 'exception-queue', purpose: 'Operational exceptions by type, severity, owner, status, action, and audit need.', records: byWorkspace('exception-queue') },
    { workspace: 'support-escalation-queue', purpose: 'Ticket, order, trip, exception, WLT reference, and rollback visibility.', records: byWorkspace('support-escalation-queue') },
    { workspace: 'settlement-inputs-preview', purpose: 'DSH settlement input events for WLT review only.', records: byWorkspace('settlement-inputs-preview') },
    { workspace: 'wlt-finance-bridge', purpose: 'WLT-owned finance bridge visibility; no DSH ledger or accounting truth.', records: byWorkspace('wlt-finance-bridge') },
    { workspace: 'audit-rollback', purpose: 'Operation history, preview rollback hint, permission, and evidence requirement.', records: byWorkspace('audit-rollback') },
  ] as const;
}

export function buildDshSettlementInputPreview(): readonly DshOperationalSurfaceSummary[] {
  return byRegistryEntry('settlement-input-bridge');
}

export function buildDshTripPreviewForOrder(orderId: string): readonly DshOperationalSurfaceSummary[] {
  return dshOperationalPreviewRecords
    .filter((record) => record.orderId === orderId && record.registryEntryId === 'delivery-trip')
    .map(toSummary);
}

export function buildDshExceptionQueuePreview(): readonly DshOperationalSurfaceSummary[] {
  return byRegistryEntry('operational-exception');
}

export function buildDshCodQueuePreview(): readonly DshOperationalSurfaceSummary[] {
  return byRegistryEntry('cod-collection');
}

export function buildDshPodReviewPreview(): readonly DshOperationalSurfaceSummary[] {
  return byRegistryEntry('proof-of-delivery');
}

export function getDshOperationalPreviewRegistryEntry(record: DshOperationalPreviewRecord) {
  return getDshOperationalEntryById(record.registryEntryId);
}
