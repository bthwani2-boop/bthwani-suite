// DSH Notifications API — wraps GET /notifications and POST /notifications/{id}/read
// from dsh.openapi.yaml (J-013).

import type { DshNotificationsClientConfig, DshNotificationsQuery, DshNotificationsListResponse } from './notifications.types';

function buildHeaders(config: DshNotificationsClientConfig): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = config.bearerToken?.trim();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (config.devClientId) {
    headers['X-Client-Id'] = config.devClientId;
  }
  return headers;
}

export type DshNotificationsFetchFn = (input: string | URL, init?: RequestInit) => Promise<Response>;

export async function listNotifications(
  config: DshNotificationsClientConfig,
  query: DshNotificationsQuery = {},
  fetchFn: DshNotificationsFetchFn = globalThis.fetch,
): Promise<DshNotificationsListResponse> {
  const params = new URLSearchParams();
  if (query.limit != null) params.set('limit', String(query.limit));
  if (query.offset != null) params.set('offset', String(query.offset));
  if (query.unread_only) params.set('unread_only', 'true');
  if (query.kind) params.set('kind', query.kind);

  const url = `${config.baseUrl}/notifications${params.size > 0 ? `?${params}` : ''}`;
  const resp = await fetchFn(url, { method: 'GET', headers: buildHeaders(config) });
  if (!resp.ok) {
    throw new Error(`[dsh-notifications] listNotifications failed (${resp.status})`);
  }
  return resp.json() as Promise<DshNotificationsListResponse>;
}

export async function markNotificationRead(
  config: DshNotificationsClientConfig,
  notificationId: string,
  fetchFn: DshNotificationsFetchFn = globalThis.fetch,
): Promise<void> {
  const resp = await fetchFn(
    `${config.baseUrl}/notifications/${notificationId}/read`,
    { method: 'POST', headers: buildHeaders(config) },
  );
  if (!resp.ok && resp.status !== 404) {
    throw new Error(`[dsh-notifications] markNotificationRead failed (${resp.status})`);
  }
}
