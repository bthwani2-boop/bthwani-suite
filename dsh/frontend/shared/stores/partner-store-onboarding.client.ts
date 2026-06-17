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
  readonly created_at?: string;
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
  };
}
