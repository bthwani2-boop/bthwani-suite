import type { DshCaptainOrderAction, DshCaptainOrderId, DshCaptainOrderMode, DshCaptainOrderProofStatus, DshCaptainOrderStage } from '../../shared/dsh-order-preview.contract';

export type DshCaptainOrderSnapshot = {
	id: DshCaptainOrderId;
	mode: DshCaptainOrderMode;
	stage: DshCaptainOrderStage;
	pickupLabel: string;
	dropoffLabel: string;
	etaLabel: string;
};

export type DshCaptainOrderActionPayload = {
	orderId: DshCaptainOrderId;
	action: DshCaptainOrderAction;
	note?: string;
};

export type DshCaptainProofPayload = {
	orderId: DshCaptainOrderId;
	status: DshCaptainOrderProofStatus;
	attachmentLabel?: string;
};

export type DshCaptainFinanceSnapshot = {
	codBalanceLabel: string;
	earningsLabel: string;
	settlementLabel: string;
};

export type DshCaptainProfileSnapshot = {
	displayName: string;
	tierLabel: string;
	readinessLabel: string;
};

export type DshCaptainOperationsSnapshot = {
	availabilityLabel: string;
	routeReadinessLabel: string;
	safetyLabel: string;
};

// --- Phase 2: DSH Flow Registry — captain surface on-demand policy bridge ---
// DSH_PHASE_2_CROSS_SURFACE_REGISTRY_CONSUMPTION-20260521
// Registry is the SSoT for on-demand policy. Do not duplicate policy constants locally.
import type { DshOnDemandPolicy } from '../../shared/dsh-flow-registry';
import { getDshFlowById } from '../../shared/dsh-flow-registry';

/** Canonical registry flow IDs owned by the captain surface. */
export const DSH_CAPTAIN_REGISTRY_FLOW_IDS = [
  'captain-order-pickup',
  'captain-proof-of-delivery',
  'captain-map-navigation',
] as const;
export type DshCaptainRegistryFlowId = (typeof DSH_CAPTAIN_REGISTRY_FLOW_IDS)[number];

/**
 * Returns the on-demand loading policy for a captain registry flow from the central registry.
 * - 'captain-order-pickup'       → 'detail-on-open'
 * - 'captain-proof-of-delivery'  → 'evidence-on-open' (PoD MUST NOT be loaded eagerly — evidence only on explicit open)
 * - 'captain-map-navigation'     → 'summary-only'
 * Returns undefined if the flow is not found in the registry.
 */
export function getDshCaptainFlowPolicy(flowId: DshCaptainRegistryFlowId): DshOnDemandPolicy | undefined {
  return getDshFlowById(flowId)?.onDemandPolicy;
}
