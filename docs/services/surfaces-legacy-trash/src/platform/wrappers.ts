// Platform Operation Wrappers for Pattern Unification
// Compliance: RULE_UNIFICATION_ZERO_NOISE.mdc §2.5.6 (Wrapper Sunset Plan)
// Status: TRANSITIONAL - Will be deprecated after 90 days

import { rawFetch, getApiConfig } from '@bthwani/api-clients';
import { generateCorrelationId, logger } from '@bthwani/platform-utils';

type ProfileGetParams = {
  actorType: 'user' | 'partner' | 'captain' | 'field';
  actorId?: string;
  domain?: 'DSH' | 'AMN' | 'KNZ' | 'ARB' | 'ESF' | 'MRF';
};

function getBaseUrl(): string {
  const config = getApiConfig();
  const envBase =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_BASE_URL ??
    process.env.EXPO_PUBLIC_API_URL ??
    '';
  const base = (config.baseURL ?? envBase) || '/api';
  return base.endsWith('/api') ? base : `${base}/api`;
}

async function profile_get(params: ProfileGetParams) {
  const query = new URLSearchParams();
  query.set('actorType', params.actorType);
  if (params.actorId) {
    query.set('actorId', params.actorId);
  }
  if (params.domain) {
    query.set('domain', params.domain);
  }

  const response = await rawFetch(
    `${getBaseUrl()}/profile?${query.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * DEPRECATED: Use profile_get instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 * Will be removed after sunset + 30 days grace period
 */
export async function user_profile_get(params?: { actorId?: string }) {
  logger.warn({
    message: 'DEPRECATED: user_profile_get - Use profile_get instead',
    operation: 'user_profile_get',
    unified_operation: 'profile_get',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await profile_get({
    actorType: 'user',
    actorId: params?.actorId,
  });
}

/**
 * DEPRECATED: Use profile_get instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function dsh_partner_profile_get(params?: { partnerId?: string }) {
  logger.warn({
    message: 'DEPRECATED: dsh_partner_profile_get - Use profile_get instead',
    operation: 'dsh_partner_profile_get',
    unified_operation: 'profile_get',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await profile_get({
    actorType: 'partner',
    actorId: params?.partnerId,
    domain: 'DSH',
  });
}

/**
 * DEPRECATED: Use profile_get instead
 * Sunset Date: 2026-05-12 (90 days from implementation)
 */
export async function platform_captain_profile_get(params?: {
  captainId?: string;
  service_mode?: 'DSH' | 'AMN' | 'KNZ';
}) {
  logger.warn({
    message:
      'DEPRECATED: platform_captain_profile_get - Use profile_get instead',
    operation: 'platform_captain_profile_get',
    unified_operation: 'profile_get',
    sunset_date: '2026-05-12',
    correlationId: generateCorrelationId(),
  });

  return await profile_get({
    actorType: 'captain',
    actorId: params?.captainId,
    domain: params?.service_mode,
  });
}
