/**
 * DSH Captain Navigation Bridge — re-export barrel.
 * All logic has moved to dsh/frontend/shared/policies/captain-route-policy.ts
 * and related shared modules. This file exists only to preserve legacy import paths.
 */
export type {
  DshCaptainLifecycleState,
  DshCaptainRouteMapping,
  DshCaptainOrderStageMapping,
  DshCaptainInboxModeFilter,
} from '../shared/policies/captain-route-policy';

export {
  DSH_CAPTAIN_ROUTE_MAP,
  getCaptainRouteForLifecycle,
  DSH_CAPTAIN_ORDER_STAGE_MAP,
  getCaptainLifecycleForOrderStage,
  DSH_CAPTAIN_INBOX_MODE_FILTERS,
  isCaptainInboxVisibleForMode,
  getCaptainActionableHandoffs,
} from '../shared/policies/captain-route-policy';

export type {
  DshCaptainCodState,
  DshCaptainCodEntry,
} from '../shared/view-models/captain';

export {
  DSH_CAPTAIN_COD_STATE_META,
  buildCaptainCodEntry,
} from '../shared/view-models/captain';

export type { DshCaptainPodDownstreamTarget } from '../shared/media/captain-pod-downstream';
export { DSH_CAPTAIN_POD_DOWNSTREAM } from '../shared/media/captain-pod-downstream';

export type { DshCaptainSupportEscalationContext } from '../shared/policies/captain-support-escalation';
export {
  DSH_CAPTAIN_SUPPORT_ESCALATION_MAP,
  getCaptainEscalationContext,
} from '../shared/policies/captain-support-escalation';
