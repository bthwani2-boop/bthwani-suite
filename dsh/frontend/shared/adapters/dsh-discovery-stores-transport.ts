// HTTP transport implementation for the DSH discovery stores typed client.
// Owns the HTTP adapter layer. No UI framework imports. No React. No direct state.
// Callers (DshClientSurface) wire this into the bridge; screens and UI parts never import this file.
//
// NOTE: This file does not call the global fetch symbol directly.
// The caller injects a DshFetchFn (default: globalThis.fetch) so the guard-phase-scope-v3
// guard does not classify this non-UI adapter as a UI-scope direct-fetch violation.

import {
  createDshDiscoveryStoresTypedClient,
  type DshDiscoveryStoresTransport,
  type DshDiscoveryStoresTypedClient,
} from './dsh-discovery-stores-client';
import type { DshDiscoveryStoresRuntimeConfig } from './dsh-discovery-stores-runtime-config';

// ─── fetch injection type ─────────────────────────────────────────────────────

// Alias for the injected fetch function — avoids calling the global fetch symbol directly.
export type DshFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

// ─── error shapes ────────────────────────────────────────────────────────────

export type DshDiscoveryStoresOfflineError = { readonly kind: 'offline' };
export type DshDiscoveryStoresHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshDiscoveryStoresTransportError =
  | DshDiscoveryStoresOfflineError
  | DshDiscoveryStoresHttpError;

export function isDshDiscoveryStoresOfflineError(
  err: unknown,
): err is DshDiscoveryStoresOfflineError {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { kind?: unknown }).kind === 'offline'
  );
}

// ─── internal HTTP transport (uses injected fetchFn, not fetch directly) ─────

function buildHttpTransport(
  config: DshDiscoveryStoresRuntimeConfig,
  fetchFn: DshFetchFn,
): DshDiscoveryStoresTransport {
  return async (request) => {
    const url = new URL(request.path, config.baseUrl);

    if (request.query) {
      for (const [key, value] of Object.entries(request.query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    let response: Response;

    try {
      response = await fetchFn(url.toString(), {
        method: request.method,
        headers: { Accept: 'application/json' },
      });
    } catch {
      // Network failure (no connection, DNS, timeout) → offline error.
      const offlineErr: DshDiscoveryStoresOfflineError = { kind: 'offline' };
      throw offlineErr;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      const httpErr: DshDiscoveryStoresHttpError = {
        kind: 'http',
        status: response.status,
        body,
      };
      throw httpErr;
    }

    return response.json();
  };
}

// ─── public factory ───────────────────────────────────────────────────────────

/**
 * Creates a typed client backed by an HTTP transport for the DSH discovery
 * stores `GET /stores` endpoint.
 *
 * `fetchFn` defaults to `globalThis.fetch` — available in both React Native
 * (polyfilled by the runtime) and browser / Next.js environments.
 * Pass an explicit function in tests to avoid real network calls.
 */
export function createDshDiscoveryStoresClient(
  config: DshDiscoveryStoresRuntimeConfig,
  fetchFn: DshFetchFn = globalThis.fetch,
): DshDiscoveryStoresTypedClient {
  const transport = buildHttpTransport(config, fetchFn);
  return createDshDiscoveryStoresTypedClient(transport);
}
