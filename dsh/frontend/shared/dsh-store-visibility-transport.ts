// HTTP transport for the DSH store visibility gate PATCH endpoints.
// Reads API base URL from EXPO_PUBLIC_DSH_API_BASE_URL (Expo/React Native)
// or NEXT_PUBLIC_DSH_API_BASE_URL (Next.js / control-panel).
// No React. No UI framework imports.

import {
  createDshStoreVisibilityClient,
  type DshStoreVisibilityClient,
  type DshStoreVisibilityTransport,
  type StoreVisibilityGateResponse,
} from './dsh-store-visibility-client';

export type DshVisibilityFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type DshStoreVisibilityOfflineError = { readonly kind: 'offline' };
export type DshStoreVisibilityHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshStoreVisibilityTransportError =
  | DshStoreVisibilityOfflineError
  | DshStoreVisibilityHttpError;

export function isDshStoreVisibilityOfflineError(
  err: unknown,
): err is DshStoreVisibilityOfflineError {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { kind?: unknown }).kind === 'offline'
  );
}

/**
 * Resolves the DSH API base URL from environment variables.
 * Tries EXPO_PUBLIC_DSH_API_BASE_URL first (mobile / Expo surfaces),
 * then NEXT_PUBLIC_DSH_API_BASE_URL (Next.js control-panel).
 * Returns null when neither is set — callers must fall back to preview.
 */
export function resolveDshStoreVisibilityBaseUrl(): string | null {
  if (typeof process === 'undefined') return null;
  const env = (process as { env?: Record<string, string | undefined> }).env;
  const raw =
    env?.EXPO_PUBLIC_DSH_API_BASE_URL ?? env?.NEXT_PUBLIC_DSH_API_BASE_URL;
  const trimmed = raw?.trim();
  return trimmed || null;
}

function buildHttpTransport(
  baseUrl: string,
  fetchFn: DshVisibilityFetchFn,
): DshStoreVisibilityTransport {
  return {
    async patch(path, body): Promise<StoreVisibilityGateResponse> {
      const url = new URL(path, baseUrl).toString();
      let response: Response;

      try {
        response = await fetchFn(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        });
      } catch {
        const err: DshStoreVisibilityOfflineError = { kind: 'offline' };
        throw err;
      }

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        const err: DshStoreVisibilityHttpError = {
          kind: 'http',
          status: response.status,
          body: text,
        };
        throw err;
      }

      return response.json() as Promise<StoreVisibilityGateResponse>;
    },
  };
}

/**
 * Creates a `DshStoreVisibilityClient` backed by an HTTP transport.
 * `fetchFn` defaults to `globalThis.fetch` (available in React Native and browsers).
 */
export function createDshStoreVisibilityHttpClient(
  baseUrl: string | null,
  fetchFn: DshVisibilityFetchFn = globalThis.fetch,
): DshStoreVisibilityClient {
  const transport = buildHttpTransport(baseUrl, fetchFn);
  return createDshStoreVisibilityClient(transport);
}
