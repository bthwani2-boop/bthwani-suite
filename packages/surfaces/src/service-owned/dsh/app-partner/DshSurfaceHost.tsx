import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { PartnerOrdersHomeScreen } from './orders';
import { DshEntryScreen } from './entry/screens';
import { DshPartnerStoreMaintenanceWorkspaceScreen } from './store-maintenance/screens';
import { DshInventoryManagementScreen } from './inventory-management/screens';
import { DshPartnerSupportDirectoryScreen } from './support/screens';
import {
  DshPartnerAuctionStatusUpdateScreen,
  DshPartnerAudienceInsightsGetScreen,
  DshPartnerChatReadAckScreen,
  DshPartnerChatSendScreen,
  DshPartnerCommissionByModeGetScreen,
  DshPartnerDocUploadScreen,
  DshPartnerIdentitySubmitScreen,
  DshPartnerIntakeStartScreen,
  DshPartnerInventoryAdjustScreen,
  DshPartnerInventoryUpdateScreen,
  DshPartnerItemsUpsertScreen,
  DshPartnerListingStatusUpdateScreen,
  DshPartnerManagerInviteScreen,
  DshPartnerOrderAcceptScreen,
  DshPartnerOrderGetScreen,
  DshPartnerOrderHandoffScreen,
  DshPartnerOrderIssueQueueScreen,
  DshPartnerOrderOutForDeliveryScreen,
  DshPartnerOrderPrepareScreen,
  DshPartnerOrderReadyScreen,
  DshPartnerOrderRejectScreen,
  DshPartnerOrderStoreDeliveredScreen,
  DshPartnerProfileGetScreen,
  DshPartnerQuickReplyConfigGetScreen,
  DshPartnerQuickReplySettingsScreen,
  DshPartnerQuickReplySetupScreen,
  DshPartnerStaffAnalyticsGetScreen,
  DshPartnerStoreNominationScreen,
  DshPartnerStoreServiceModesUpdateScreen,
  DshPartnerStoreStatusUpdateScreen,
  DshPartnerStoreUpdateScreen,
  DshPartnerSubscriptionScreen,
  DshPartnerVideoUploadScreen,
  type PartnerSupportScreenId,
} from './support/screens/DshPartnerGeneratedSupportScreens';

export type DshRoute =
  | 'orders-home'
  | 'entry'
  | 'store-maintenance'
  | 'inventory-management'
  | 'support-directory'
  | 'support-screen'
  | 'success';

export type DshCommandTarget = 'orders-home' | 'store-maintenance';

type DshNavigationCommand = {
  token: number;
  target: DshCommandTarget;
  payload?: any;
};

type DshSurfaceHostProps = {
  command?: DshNavigationCommand;
  onExit?: () => void;
  initialRoute?: Exclude<DshRoute, 'success'>;
};

export function DshSurfaceHost({ command, onExit, initialRoute = 'orders-home' }: DshSurfaceHostProps) {
  const [route, setRoute] = React.useState<DshRoute>(initialRoute);
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<PartnerSupportScreenId>('profile-get');
  const routeHistoryRef = React.useRef<DshRoute[]>([initialRoute]);
  const routeTransitionFromBackRef = React.useRef(false);

  React.useEffect(() => {
    if (!command) return;
    const map: Record<DshCommandTarget, DshRoute> = {
      'orders-home': 'orders-home',
      'store-maintenance': 'store-maintenance',
    };
    const next = map[command.target] ?? initialRoute;
    if (next !== route) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(next);
      }
      setRoute(next);
    }
  }, [command, initialRoute, route]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1]);
        return true;
      }

      onExit?.();
      return true;
    });

    return () => subscription.remove();
  }, [onExit]);

  const handleBack = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeHistoryRef.current.pop();
      setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1]);
    } else {
      onExit?.();
    }
  }, [onExit]);

  const openOrdersHome = React.useCallback(() => {
    routeHistoryRef.current.push('orders-home');
    setRoute('orders-home');
  }, []);

  const openEntry = React.useCallback(() => {
    routeHistoryRef.current.push('entry');
    setRoute('entry');
  }, []);

  const openMaintenance = React.useCallback(() => {
    routeHistoryRef.current.push('store-maintenance');
    setRoute('store-maintenance');
  }, []);

  const openInventoryManagement = React.useCallback(() => {
    routeHistoryRef.current.push('inventory-management');
    setRoute('inventory-management');
  }, []);

  const openSupportDirectory = React.useCallback(() => {
    routeHistoryRef.current.push('support-directory');
    setRoute('support-directory');
  }, []);

  const openSupportScreen = React.useCallback((screenId: PartnerSupportScreenId) => {
    setSelectedSupportScreen(screenId);
    routeHistoryRef.current.push('support-screen');
    setRoute('support-screen');
  }, []);

  function openOrderActionFromHub(actionId: 'accept' | 'details' | 'prepare' | 'ready' | 'handoff' | 'issue' | 'delivering') {
    if (actionId === 'accept') {
      openSupportScreen('order-accept');
      return;
    }
    if (actionId === 'details') {
      openSupportScreen('order-get');
      return;
    }
    if (actionId === 'prepare') {
      openSupportScreen('order-prepare');
      return;
    }
    if (actionId === 'ready') {
      openSupportScreen('order-ready');
      return;
    }
    if (actionId === 'handoff') {
      openSupportScreen('order-handoff');
      return;
    }
    if (actionId === 'delivering') {
      openSupportScreen('order-out-for-delivery');
      return;
    }
    openSupportScreen('order-issue-queue');
  }

  if (route === 'orders-home') {
    return (
      <PartnerOrdersHomeScreen
        onOpenEntryPress={openEntry}
        onOpenOrderAction={openOrderActionFromHub}
        onOpenMaintenancePress={openMaintenance}
        onOpenInventoryManagementPress={openInventoryManagement}
        onRetry={openOrdersHome}
      />
    );
  }

  if (route === 'entry') {
    return (
      <DshEntryScreen
        onOpenOrdersBoardPress={openOrdersHome}
        onOpenOrderWorkspacePress={() => openOrderActionFromHub('details')}
        onOpenMaintenancePress={openMaintenance}
        onOpenIssueQueuePress={() => openOrderActionFromHub('issue')}
      />
    );
  }

  if (route === 'store-maintenance') {
    return (
      <DshPartnerStoreMaintenanceWorkspaceScreen
        onOpenSupportDirectory={openSupportDirectory}
        onOpenDeliveryBoard={() => openOrderActionFromHub('delivering')}
        onSave={openOrdersHome}
      />
    );
  }

  if (route === 'inventory-management') {
    return <DshInventoryManagementScreen />;
  }

  if (route === 'support-directory') {
    return <DshPartnerSupportDirectoryScreen onOpenScreen={openSupportScreen} />;
  }

  if (route === 'support-screen') {
    const supportScreens: Record<PartnerSupportScreenId, React.ReactNode> = {
      'auction-status-update': <DshPartnerAuctionStatusUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'audience-insights': <DshPartnerAudienceInsightsGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'chat-read-ack': <DshPartnerChatReadAckScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('quick-reply-config')} />,
      'chat-send': <DshPartnerChatSendScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('quick-reply-setup')} />,
      'commission-by-mode': <DshPartnerCommissionByModeGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'doc-upload': <DshPartnerDocUploadScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'identity-submit': <DshPartnerIdentitySubmitScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'intake-start': <DshPartnerIntakeStartScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'inventory-adjust': <DshPartnerInventoryAdjustScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('inventory-update')} />,
      'inventory-update': <DshPartnerInventoryUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'items-upsert': <DshPartnerItemsUpsertScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'listing-status-update': <DshPartnerListingStatusUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'manager-invite': <DshPartnerManagerInviteScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-accept': <DshPartnerOrderAcceptScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('order-get')} />,
      'order-get': <DshPartnerOrderGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-handoff': <DshPartnerOrderHandoffScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-issue-queue': <DshPartnerOrderIssueQueueScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-out-for-delivery': <DshPartnerOrderOutForDeliveryScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-prepare': <DshPartnerOrderPrepareScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-ready': <DshPartnerOrderReadyScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-reject': <DshPartnerOrderRejectScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-store-delivered': <DshPartnerOrderStoreDeliveredScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'profile-get': <DshPartnerProfileGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'quick-reply-config': <DshPartnerQuickReplyConfigGetScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('quick-reply-settings')} />,
      'quick-reply-settings': <DshPartnerQuickReplySettingsScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('quick-reply-setup')} />,
      'quick-reply-setup': <DshPartnerQuickReplySetupScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'staff-analytics': <DshPartnerStaffAnalyticsGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'store-nomination': <DshPartnerStoreNominationScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'store-service-modes-update': <DshPartnerStoreServiceModesUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'store-status-update': <DshPartnerStoreStatusUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'store-update': <DshPartnerStoreUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      subscription: <DshPartnerSubscriptionScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'video-upload': <DshPartnerVideoUploadScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
    };

    return supportScreens[selectedSupportScreen];
  }

  return (
    <PartnerOrdersHomeScreen
      onOpenEntryPress={openEntry}
      onOpenOrderAction={openOrderActionFromHub}
      onOpenMaintenancePress={openMaintenance}
      onOpenInventoryManagementPress={openInventoryManagement}
      onRetry={openOrdersHome}
    />
  );
}

export default DshSurfaceHost;
