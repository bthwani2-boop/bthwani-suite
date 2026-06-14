import {
  mapDshPartnerOperationalFlowToSupportRoute,
  mapDshPartnerSupportRouteToOperationalFlow,
  type DshPartnerOperationalFlowId,
  type DshPartnerSupportCommandContext,
  type DshPartnerSupportRouteId,
} from '../../contracts/partner';
import {
  resolveIssueCategoryFromOperationalFlow,
  resolveIssueCategoryFromRoute,
  resolveSupportFilterFromOperationalFlow,
  resolveSupportFilterFromRoute,
} from '../../policies/partner-support';

export const defaultSupportCommandContext: DshPartnerSupportCommandContext = {
  filterId: 'all',
  highlightedCaseId: null,
  highlightedIssueCategoryId: null,
  preferredOperationalFlowId: null,
  preferredSupportRouteId: null,
  source: 'operations',
};

export function buildSupportCommandContextFromOperationalFlow(
  flowId: DshPartnerOperationalFlowId,
  source: DshPartnerSupportCommandContext['source'] = 'operations',
): DshPartnerSupportCommandContext {
  return {
    filterId: resolveSupportFilterFromOperationalFlow(flowId),
    highlightedCaseId: null,
    highlightedIssueCategoryId: resolveIssueCategoryFromOperationalFlow(flowId),
    preferredOperationalFlowId: flowId,
    preferredSupportRouteId: mapDshPartnerOperationalFlowToSupportRoute(flowId),
    source,
  };
}

export function buildSupportCommandContextFromSupportRoute(
  routeId: DshPartnerSupportRouteId,
  source: DshPartnerSupportCommandContext['source'] = 'operations',
): DshPartnerSupportCommandContext {
  return {
    filterId: resolveSupportFilterFromRoute(routeId),
    highlightedCaseId: null,
    highlightedIssueCategoryId: resolveIssueCategoryFromRoute(routeId),
    preferredOperationalFlowId: mapDshPartnerSupportRouteToOperationalFlow(routeId),
    preferredSupportRouteId: routeId,
    source,
  };
}
