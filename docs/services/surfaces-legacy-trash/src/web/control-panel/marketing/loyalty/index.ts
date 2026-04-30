/**
 * CONTROL PANEL Loyalty — DSH_LOYALTY_MASTER_SPEC
 * مسارات: /marketing/loyalty/programs | simulate | insights | guardrails
 */

export { LoyaltyProgramsPage } from './components/LoyaltyProgramsPage';
export { LoyaltyProgramBuilder } from './components/LoyaltyProgramBuilder';
export { LoyaltyFundingPanel } from './components/LoyaltyFundingPanel';
export { LoyaltySimulationPanel } from './components/LoyaltySimulationPanel';
export { LoyaltyLiveMonitorPanel } from './components/LoyaltyLiveMonitorPanel';
export { LoyaltyOutcomeReportPanel } from './components/LoyaltyOutcomeReportPanel';
export { LoyaltyLearningInsightsPanel } from './components/LoyaltyLearningInsightsPanel';
export { LoyaltyGuardrails } from './components/LoyaltyGuardrails';

export { evaluateProgramSuccess, DEFAULT_POLICY, validateLoyaltyGuardrails } from './lib';
export type { SuccessEvaluatorPolicy, GuardrailsResult } from './lib';
export {
  LOCKED_SCOPE_TYPES,
  LOCKED_SUBSCRIPTION_TIER_LOYALTY,
  isValidScopeType,
  isValidTargetingSubscriptionTier,
  targetingUsesIdsOnly,
} from './lib';

export type {
  LoyaltyScopeType,
  BThwaniProBundleType,
  LoyaltySubscriptionState,
  LoyaltyProgramKind,
  LoyaltyFundingSource,
  LoyaltyFundingSplit,
  LoyaltyTargeting,
  LoyaltyProgramLifecycleStatus,
  LoyaltyProgramDraft,
  LoyaltyProgramOutcome,
  LoyaltySuccessEvaluationInput,
  LoyaltySuccessEvaluationOutput,
  LoyaltyLiveMetrics,
} from './types';

