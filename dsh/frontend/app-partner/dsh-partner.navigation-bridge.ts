// Thin re-exports from shared — all domain logic lives in dsh/frontend/shared.
export type { PartnerStoreScopeOption } from '../shared/partner';
export { storeScopeOptions } from '../shared/partner';

export type { PartnerStoreHoursDay } from '../shared/delivery/fulfillment';
export { defaultServiceModes, defaultZone, defaultStoreHours } from '../shared/delivery/fulfillment';

export {
  defaultSupportCommandContext,
  buildSupportCommandContextFromOperationalFlow,
  buildSupportCommandContextFromSupportRoute,
} from '../shared/support/support.partner-context';

export {
  isCommandCenterInlineManagedRoute,
  resolveSupportFilterFromOperationalFlow,
  resolveSupportFilterFromRoute,
  resolveIssueCategoryFromOperationalFlow,
  resolveIssueCategoryFromRoute,
} from '../shared/support/support.partner-policies';
