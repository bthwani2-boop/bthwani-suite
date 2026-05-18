export type {
  ApprovalRecord,
  ApprovalStage,
} from '../../shared/workflow';
export { moveApprovalRecordToStage, getPartnerIntakeItems, translateEntityType, translateOwner, translateStage } from '../../shared/workflow';

export { ControlPanelDshPartnerApprovalsScreen } from './ControlPanelDshPartnerApprovalsScreen';
export { DshPartnerPromotionEligibilityScreen } from './DshPartnerPromotionEligibilityScreen';
export { ControlPanelDshPartnerActivationScreen, ControlPanelDshPartnerDocumentReviewScreen } from './closure-workspaces';
export { default } from './closure-workspaces';

// ML-038: Partner deactivation workspace skeleton — BLOCKED_BY_CONTRACT (partner management API not proven)
export { PartnerDeactivationWorkspace } from './PartnerDeactivationWorkspace';
export type { PartnerDeactivationWorkspaceProps } from './PartnerDeactivationWorkspace';

export { PartnerFulfillmentLane } from './PartnerFulfillmentLane';
export type { PartnerFulfillmentLaneProps } from './PartnerFulfillmentLane';
export type { DshPartnerFulfillmentAgreement, DshPartnerFulfillmentMode, DshPartnerModeAgreement } from './workflow';
