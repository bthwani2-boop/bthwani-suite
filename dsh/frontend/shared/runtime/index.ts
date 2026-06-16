// DSH Runtime — surface runtime contracts and operational bindings.
// use-captain-order-runtime canonical exports: shared/orders topic (orders.view-model)
// use-partner-orders-runtime canonical exports: shared/orders topic (orders.view-model)
// platform-vars / feature-flags canonical exports: shared/platform topic
export * from './dsh-surface-runtime.contract';
export * from './dsh-operational-surface-binding';
export * from '../field/use-field-runtime-actions';
export * from './ui-only-runtime-clients';
export * from './dsh-flow-registry';
export type { FixtureEvidenceEntry } from './dev-fixtures-isolation-guard';
export {
  DSH_FIXTURE_EVIDENCE,
  guardDevFixture,
  getFixtureEvidenceSummary,
} from './dev-fixtures-isolation-guard';
