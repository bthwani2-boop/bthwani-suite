// Thin re-exports from shared — all domain logic lives in dsh/frontend/shared.
export type { PartnerStoreScopeOption } from '../shared/view-models/partner';
export { storeScopeOptions } from '../shared/view-models/partner';

export type { PartnerStoreHoursDay } from '../shared/policies/fulfillment';
export { defaultServiceModes, defaultZone, defaultStoreHours } from '../shared/policies/fulfillment';

export {
  defaultSupportCommandContext,
  buildSupportCommandContextFromOperationalFlow,
  buildSupportCommandContextFromSupportRoute,
} from '../shared/adapters/support/dsh-partner-support-context.adapter';

export {
  isCommandCenterInlineManagedRoute,
  resolveSupportFilterFromOperationalFlow,
  resolveSupportFilterFromRoute,
  resolveIssueCategoryFromOperationalFlow,
  resolveIssueCategoryFromRoute,
} from '../shared/policies/partner-support';
