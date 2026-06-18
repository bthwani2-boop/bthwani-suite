// DSH Notifications — record types, query shapes, client config.
// No JSX. No ui-kit. No Tamagui.

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
