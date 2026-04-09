/**
 * Service Shorts — resolve CTA to navigation target (Execution Spec Phase 0).
 * Uses short.cta.route_key and short.cta.params; no mixing of type/target/params.
 */

import type { AppUserRouteKey, ServiceShortItem } from '@bthwani/domain-types';

export interface ResolvedShortCtaNavigation {
  route_key: AppUserRouteKey;
  params?: Record<string, unknown>;
}

/**
 * Returns the navigation target for a Service Short CTA.
 * Consumer should call handleNavigate(result.route_key, result.params).
 */
export function resolveShortCtaToNavigation(
  short: ServiceShortItem
): ResolvedShortCtaNavigation {
  return {
    route_key: short.cta.route_key,
    params: short.cta.params,
  };
}
