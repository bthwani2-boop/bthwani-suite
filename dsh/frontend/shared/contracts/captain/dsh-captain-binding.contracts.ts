import type { DshCaptainOrderAction, DshCaptainOrderId, DshCaptainOrderMode, DshCaptainOrderProofStatus, DshCaptainOrderStage } from '../dsh-order.contract';

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

// Registry flow IDs owned by the captain surface
import type { DshOnDemandPolicy } from '../../policies/dsh-flow-registry';
import { getDshFlowById } from '../../policies/dsh-flow-registry';

export const DSH_CAPTAIN_REGISTRY_FLOW_IDS = [
  'captain-order-pickup',
  'captain-proof-of-delivery',
  'captain-map-navigation',
] as const;
export type DshCaptainRegistryFlowId = (typeof DSH_CAPTAIN_REGISTRY_FLOW_IDS)[number];

export function getDshCaptainFlowPolicy(flowId: DshCaptainRegistryFlowId): DshOnDemandPolicy | undefined {
  return getDshFlowById(flowId)?.onDemandPolicy;
}
