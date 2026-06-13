// DSH Runtime — surface runtime contracts and operational bindings.
export * from './dsh-surface-runtime.contract';
export * from './dsh-operational-surface-binding';
export * from './use-partner-orders-runtime';
export * from './use-field-runtime-actions';
export * from './use-captain-order-runtime';
export * from './field-onboarding-storage';
export * from './ui-only-runtime-clients';
export type { PlatformVarsConfig } from '../platform/platform-vars';
export { PlatformVarsRegistry } from '../platform/platform-vars';
export type { FeatureFlagsConfig } from '../platform/feature-flags';
export { FeatureFlagsRegistry } from '../platform/feature-flags';
export type { FixtureEvidenceEntry } from './dev-fixtures-isolation-guard';
export {
  DSH_FIXTURE_EVIDENCE,
  guardDevFixture,
  getFixtureEvidenceSummary,
} from './dev-fixtures-isolation-guard';
