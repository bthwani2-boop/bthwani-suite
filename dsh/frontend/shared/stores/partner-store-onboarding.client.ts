// dsh/frontend/shared/stores/onboarding/partner-store-onboarding.client.ts
// Authority: dsh/frontend/shared/stores — shared DSH stores/onboarding/review domain.
// No JSX. No ui-kit. No Tamagui.

import { PlatformVarsRegistry } from '../platform/platform-vars';

export type PartnerCreateStoreRequest = {
  readonly name: string;
  readonly address: string;
  readonly category_id?: string;
  readonly supports_pickup: boolean;
  readonly supports_partner_delivery: boolean;
  readonly contact_number?: string;
  readonly opening_hours?: string;
  readonly catalog_summary?: string;
};

export type PartnerCreateStoreResponse = {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly category_id?: string;
  readonly publish_stage: string;
  readonly created_at: string;
};

export type PartnerPendingReviewStore = {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly category_id?: string;
  readonly publish_stage?: string;
  readonly supports_pickup?: boolean;
  readonly supports_partner_delivery?: boolean;
  readonly created_at?: string;
};

export type PartnerStoreDetail = PartnerPendingReviewStore & {
  readonly image_url?: string;
  readonly logo_image_url?: string;
  readonly rating?: number;
  readonly distance_label?: string;
  readonly delivery_label?: string;
  readonly service_label?: string;
  readonly status_label?: string;
  readonly status_tone?: string;
  readonly has_offer?: boolean;
  readonly offer_label?: string;
  readonly contact_number?: string;
  readonly opening_hours?: string;
  readonly catalog_summary?: string;
  readonly partner_readiness_status?: string;
  readonly catalog_quality_status?: string;
  readonly catalog_pricing_status?: string;
  readonly marketing_visibility_status?: string;
};

export type PartnerStoreOnboardingFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type PartnerStoreOnboardingOfflineError = { readonly kind: 'offline' };
export type PartnerStoreOnboardingHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type PartnerStoreOnboardingError =
  | PartnerStoreOnboardingOfflineError
  | PartnerStoreOnboardingHttpError;

export interface PartnerStoreOnboardingClient {
  createStore(req: PartnerCreateStoreRequest): Promise<PartnerCreateStoreResponse>;
  getPendingReviewStores(): Promise<readonly PartnerPendingReviewStore[]>;
  getStoreDetail(id: string): Promise<PartnerStoreDetail>;
}

export function isPartnerStoreOnboardingOfflineError(
  err: unknown,
): err is PartnerStoreOnboardingOfflineError {
  return typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'offline';
}

export function resolvePartnerStoreOnboardingBaseUrl(): string | null {
  return PlatformVarsRegistry.get('dshApiBaseUrl');
}

export function createPartnerStoreOnboardingHttpClient(
  baseUrl: string | null,
  fetchFn?: PartnerStoreOnboardingFetchFn,
): PartnerStoreOnboardingClient {
  return {
    createStore: async (req) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);

      if (!baseUrl || !transport) {
        throw { kind: 'offline' } satisfies PartnerStoreOnboardingOfflineError;
      }

      const clientId = (PlatformVarsRegistry.get('dshClientId') ?? 'field-agent-dev').trim() || 'field-agent-dev';
      const response = await transport(`${baseUrl.replace(/\/$/, '')}/stores`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Client-Id': clientId,
          'X-Actor-Type': 'field',
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw {
          kind: 'http',
          status: response.status,
          body: await response.text(),
        } satisfies PartnerStoreOnboardingHttpError;
      }

      return response.json() as Promise<PartnerCreateStoreResponse>;
    },
    getPendingReviewStores: async () => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);

      if (!baseUrl || !transport) {
        throw { kind: 'offline' } satisfies PartnerStoreOnboardingOfflineError;
      }

      const response = await transport(`${baseUrl.replace(/\/$/, '')}/stores/pending-review`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw {
          kind: 'http',
          status: response.status,
          body: await response.text(),
        } satisfies PartnerStoreOnboardingHttpError;
      }

      return response.json() as Promise<readonly PartnerPendingReviewStore[]>;
    },
    getStoreDetail: async (id) => {
      const transport = fetchFn ?? globalThis.fetch?.bind(globalThis);

      if (!baseUrl || !transport) {
        throw { kind: 'offline' } satisfies PartnerStoreOnboardingOfflineError;
      }

      const safeId = encodeURIComponent(id.trim());
      const response = await transport(`${baseUrl.replace(/\/$/, '')}/stores/${safeId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw {
          kind: 'http',
          status: response.status,
          body: await response.text(),
        } satisfies PartnerStoreOnboardingHttpError;
      }

      return response.json() as Promise<PartnerStoreDetail>;
    },
  };
}
