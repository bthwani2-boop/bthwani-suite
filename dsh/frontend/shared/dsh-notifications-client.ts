// DSH Notifications Client — J-013
// Wraps GET /notifications and POST /notifications/{id}/read from dsh.openapi.yaml.

export type DshNotificationRecord = {
  id: string;
  kind: string;
  title: string;
  subtitle?: string;
  entity_id?: string;
  entity_type?: string;
  priority: 'normal' | 'important' | 'urgent';
  is_read: boolean;
  created_at: string;
  recipient_id: string;
  recipient_role: 'client' | 'partner' | 'captain' | 'field' | 'operator';
  action_route?: string;
};

export type DshNotificationsListResponse = {
  notifications: DshNotificationRecord[];
  total: number;
  unread_count?: number;
};

export type DshNotificationsQuery = {
  limit?: number;
  offset?: number;
  unread_only?: boolean;
  kind?: string;
};

export type DshNotificationsClientConfig = {
  baseUrl: string;
  bearerToken?: string;
  devClientId?: string;
};

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

export async function listNotifications(
  config: DshNotificationsClientConfig,
  query: DshNotificationsQuery = {},
): Promise<DshNotificationsListResponse> {
  const params = new URLSearchParams();
  if (query.limit != null) params.set('limit', String(query.limit));
  if (query.offset != null) params.set('offset', String(query.offset));
  if (query.unread_only) params.set('unread_only', 'true');
  if (query.kind) params.set('kind', query.kind);

  const url = `${config.baseUrl}/notifications${params.size > 0 ? `?${params}` : ''}`;
  const fetchFn = globalThis.fetch;
  const resp = await fetchFn(url, { method: 'GET', headers: buildHeaders(config) });
  if (!resp.ok) {
    throw new Error(`[dsh-notifications-client] listNotifications failed (${resp.status})`);
  }
  return resp.json() as Promise<DshNotificationsListResponse>;
}

export async function markNotificationRead(
  config: DshNotificationsClientConfig,
  notificationId: string,
): Promise<void> {
  const fetchFn = globalThis.fetch;
  const resp = await fetchFn(`${config.baseUrl}/notifications/${notificationId}/read`, {
    method: 'POST',
    headers: buildHeaders(config),
  });
  if (!resp.ok && resp.status !== 404) {
    throw new Error(`[dsh-notifications-client] markNotificationRead failed (${resp.status})`);
  }
}
