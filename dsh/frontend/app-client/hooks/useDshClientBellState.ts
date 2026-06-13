import React from 'react';
import { listNotifications, getDshAuthRuntimeBaseUrl } from '../../shared';
import type { DshSignalSummary, DshSignalEventKind, DshSignalEntityType } from '../../shared';
import type { DshRoute } from '../dsh-client.types';
import type { ClientOperationScreenId } from '../screens/parts/OperationScreenView';

export function useDshClientBellState({
  route,
  dshApiBaseUrl,
  checkoutAuth,
  setRoute,
}: {
  route: DshRoute;
  dshApiBaseUrl: string;
  checkoutAuth: { bearerToken?: string; clientId?: string };
  setRoute: (r: DshRoute) => void;
}) {
  const [bellSignalEvents, setBellSignalEvents] = React.useState<readonly DshSignalSummary[]>([]);
  const [selectedOperationScreen, setSelectedOperationScreen] = React.useState<ClientOperationScreenId>('entitlements-get');
  const [serviceDialTrigger, setServiceDialTrigger] = React.useState(0);

  React.useEffect(() => {
    if (route !== 'bell') return undefined;
    const authBaseUrl = getDshAuthRuntimeBaseUrl();
    const dshBase = checkoutAuth.bearerToken ? dshApiBaseUrl : null;
    const baseUrl = dshBase?.trim() || authBaseUrl?.replace(':18082', ':8080') || null;
    if (!baseUrl) return undefined;
    let cancelled = false;
    listNotifications(
      { baseUrl, bearerToken: checkoutAuth.bearerToken, devClientId: checkoutAuth.clientId },
      { limit: 30, unread_only: false },
    ).then((resp) => {
      if (cancelled) return;
      const summaries: DshSignalSummary[] = resp.notifications.map((n) => ({
        eventId: n.id,
        kind: n.kind as DshSignalEventKind,
        priority: n.priority,
        title: n.title,
        entityId: n.entity_id ?? '',
        entityType: (n.entity_type ?? 'order') as DshSignalEntityType,
        readState: n.is_read ? 'read' : 'unread',
        routeId: n.action_route ?? 'orders-list',
        emittedAt: n.created_at,
      }));
      setBellSignalEvents(summaries);
    }).catch(() => { /* non-fatal — bell shows empty state */ });
    return () => { cancelled = true; };
  }, [route, checkoutAuth, dshApiBaseUrl]);

  const handleServiceLauncherPress = React.useCallback(() => {
    setServiceDialTrigger((t) => t + 1);
  }, []);

  const handleOpenHomeBenefits = React.useCallback((screenId?: string) => {
    setSelectedOperationScreen(screenId as ClientOperationScreenId);
    setRoute('benefits');
  }, [setRoute]);

  const openSupportFlow = React.useCallback(() => {
    setSelectedOperationScreen('chat-send');
    setRoute('conversation-workspace');
  }, [setRoute]);

  return {
    bellSignalEvents,
    selectedOperationScreen,
    setSelectedOperationScreen,
    serviceDialTrigger,
    handleServiceLauncherPress,
    handleOpenHomeBenefits,
    openSupportFlow,
  };
}
