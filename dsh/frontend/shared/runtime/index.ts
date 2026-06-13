// DSH Runtime — surface runtime contracts, operational bindings, platform providers
export * from './dsh-surface-runtime.contract';
export * from './dsh-operational-surface-binding';
export * from './use-partner-orders-runtime';
export * from './use-field-runtime-actions';
export * from './use-captain-order-runtime';
export * from './field-onboarding-storage';
export * from './ui-only-runtime-clients';
export type { PlatformVarsConfig } from '../platform/PlatformVarsProvider';
export {
  PlatformVarsProvider,
  usePlatformVars,
  PlatformVarsRegistry,
} from '../platform/PlatformVarsProvider';
export type { FeatureFlagsConfig } from '../platform/FeatureFlagProvider';
export {
  FeatureFlagProvider,
  useFeatureFlag,
  FeatureFlagsRegistry,
} from '../platform/FeatureFlagProvider';
export type { FixtureEvidenceEntry } from './dev-fixtures-isolation-guard';
export {
  DSH_FIXTURE_EVIDENCE,
  guardDevFixture,
  getFixtureEvidenceSummary,
} from './dev-fixtures-isolation-guard';
