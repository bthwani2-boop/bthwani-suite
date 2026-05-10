import type { DshCaptainOrderAction, DshCaptainOrderId, DshCaptainOrderMode, DshCaptainOrderProofStatus, DshCaptainOrderStage } from './captain-orders.preview-data';

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
