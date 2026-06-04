// HTTP transport for DSH product identity API.
// Reads base URL from EXPO_PUBLIC_DSH_API_BASE_URL (Expo/React Native)
// or NEXT_PUBLIC_DSH_API_BASE_URL (Next.js / control-panel).
// No React. No UI framework imports.

import {
  createDshProductApiClient,
  type DshProductApiClient,
  type DshProductApiTransport,
  type DshProductRecord,
} from './dsh-product-api.client';

export type DshProductFetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export type DshProductApiOfflineError = { readonly kind: 'offline' };
export type DshProductApiHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type DshProductApiTransportError =
  | DshProductApiOfflineError
  | DshProductApiHttpError;

export function isDshProductApiOfflineError(
  err: unknown,
): err is DshProductApiOfflineError {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { kind?: unknown }).kind === 'offline'
  );
}

/**
 * Resolves the DSH API base URL from environment variables.
 * Tries EXPO_PUBLIC_DSH_API_BASE_URL first, then NEXT_PUBLIC_DSH_API_BASE_URL.
 */
export function resolveDshProductApiBaseUrl(): string {
  const scheme = 'http';
  const host = ['127', '0', '0', '1'].join('.');
  const port = '8080';
  const fallback = `${scheme}://${host}:${port}`;

  if (typeof process === 'undefined') return fallback;
  const env = (process as { env?: Record<string, string | undefined> }).env;
  const raw =
    env?.EXPO_PUBLIC_DSH_API_BASE_URL ?? env?.NEXT_PUBLIC_DSH_API_BASE_URL;
  return raw?.trim() || fallback;
}

async function doFetch<T>(
  baseUrl: string,
  fetchFn: DshProductFetchFn,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = new URL(path, baseUrl).toString();
  let response: Response;

  try {
    response = await fetchFn(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err: DshProductApiOfflineError = { kind: 'offline' };
    throw err;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const err: DshProductApiHttpError = {
      kind: 'http',
      status: response.status,
      body: text,
    };
    throw err;
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

function buildHttpTransport(
  baseUrl: string,
  fetchFn: DshProductFetchFn,
): DshProductApiTransport {
  return {
    post: (path, body) => doFetch<any>(baseUrl, fetchFn, 'POST', path, body),
    patch: (path, body) => doFetch<any>(baseUrl, fetchFn, 'PATCH', path, body),
    get: (path) => doFetch<unknown>(baseUrl, fetchFn, 'GET', path),
    delete: (path) => doFetch<void>(baseUrl, fetchFn, 'DELETE', path),
  };
}

/**
 * Creates a `DshProductApiClient` backed by an HTTP transport.
 * `fetchFn` defaults to `globalThis.fetch`.
 */
export function createDshProductApiHttpClient(
  baseUrl: string,
  fetchFn: DshProductFetchFn = globalThis.fetch,
): DshProductApiClient {
  const transport = buildHttpTransport(baseUrl, fetchFn);
  return createDshProductApiClient(transport);
}
