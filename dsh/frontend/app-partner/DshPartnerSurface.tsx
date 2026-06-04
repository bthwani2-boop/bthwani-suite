import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { BottomNavBar, Box, Button, ModernPremiumHeader, Surface, Text } from '@bthwani/ui-kit';
import type {
  DshPartnerOperationalFlowId,
  DshPartnerRoute,
  DshPartnerSupportCommandContext,
  DshPartnerSupportCommandFilterId,
  DshPartnerSupportIssueCategoryId,
  DshPartnerSupportRouteId,
  DshPartnerSurfaceProps,
  PartnerHubSection,
} from './dsh-partner.types';
import {
  mapDshPartnerOperationalFlowToSupportRoute,
  mapDshPartnerSupportRouteToOperationalFlow,
} from './dsh-partner.types';
import {
  getSurfaceModeCapability,
} from '../shared/dsh-fulfillment-surface-visibility';
import {
  getActionableHandoffsForSurface,
} from '../shared/dsh-order-lifecycle-handoffs';
import { DshPartnerHubSurface } from './screens/PartnerHubScreen';
import { InventoryCatalogScreen } from './screens/InventoryCatalogScreen';
import {
  AuctionStatusUpdateScreen,
  ConversationScreen,
  InventoryActionScreen,
  NotificationsScreen,
  OnboardingActionScreen,
  OrderActionScreen,
  OrderIssueScreen,
  VideoUploadScreen,
} from './screens/OperationScreens';
import {
  OrdersInboxScreen,
} from './screens/OrdersInboxScreen';
import { DshPartnerStoreCourierScreen } from './screens/DshPartnerStoreCourierScreen';
import { PartnerEntryScreen } from './screens/PartnerEntryScreen';
import { PartnerSupportScreen } from './screens/PartnerSupportScreen';
import { ProductEditScreen } from './screens/ProductEditScreen';
import { CategoryManagementScreen } from './screens/CategoryManagementScreen';

import {
  type PartnerStoreScopeOption,
  type PartnerStoreHoursDay,
  defaultStoreHours,
  defaultServiceModes,
  defaultZone,
  storeScopeOptions,
  defaultSupportCommandContext,
  resolveSupportFilterFromOperationalFlow,
  resolveSupportFilterFromRoute,
  resolveIssueCategoryFromOperationalFlow,
  resolveIssueCategoryFromRoute,
  isCommandCenterInlineManagedRoute,
  buildSupportCommandContextFromOperationalFlow,
  buildSupportCommandContextFromSupportRoute,
} from './dsh-partner.navigation-bridge';

function PartnerStoreScopeSheet({
  visible,
  onClose,
  options,
  selectedId,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  options: readonly PartnerStoreScopeOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={5} gap={4} radiusToken="xl" border={false} style={{ margin: 16 }}>
      <Text role="titleMd">نطاق الفرع</Text>
      {options.map((option) => (
        <Button
          key={option.id}
          label={option.label}
          variant={option.id === selectedId ? 'primary' : 'secondary'}
          onPress={() => onSelect(option.id)}
        />
      ))}
      <Button label="إغلاق" onPress={onClose} />
    </Surface>
  );
}

export function DshPartnerSurface({
  initialRoute = 'inbox',
  initialOrderId = 'partner-order-1042',
}: DshPartnerSurfaceProps = {}) {
  // walletHubVisible state removed in favor of self-contained WltDshPartnerBridge cockpit tabs.
  const [storeScopeVisible, setStoreScopeVisible] = React.useState(false);
  const [accountHubSection, setAccountHubSection] = React.useState<PartnerHubSection>('hub');
  const [ordersSearchMode, setOrdersSearchMode] = React.useState(false);
  const [selectedStoreScopeId, setSelectedStoreScopeId] = React.useState('all');
  const [route, setRoute] = React.useState<DshPartnerRoute>(initialRoute);
  const [editingProductId, setEditingProductId] = React.useState<string | undefined>(undefined);
  const [activeOrderId, setActiveOrderId] = React.useState(initialOrderId);
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<DshPartnerSupportRouteId>(
    initialRoute === 'order-rejection' ? 'order-reject' : 'order-issue-queue'
  );
  const [supportCommandContext, setSupportCommandContext] = React.useState<DshPartnerSupportCommandContext>(() => (
    initialRoute === 'order-rejection'
      ? buildSupportCommandContextFromSupportRoute('order-reject', 'orders')
      : { ...defaultSupportCommandContext }
  ));
  const routeHistoryRef = React.useRef<DshPartnerRoute[]>([initialRoute]);
  const routeTransitionFromBackRef = React.useRef(false);
  const supportDirectoryIntentRef = React.useRef(false);

  React.useEffect(() => {
    if (route !== 'inbox' && ordersSearchMode) {
      setOrdersSearchMode(false);
    }
  }, [ordersSearchMode, route]);

  const selectedStoreScope = React.useMemo(
    () => storeScopeOptions.find((option) => option.id === selectedStoreScopeId) ?? storeScopeOptions[0],
    [selectedStoreScopeId],
  );

  // activeOrderSummary deprecated in favor of inline details in OrdersInboxScreen.

  const todayHoursLabel = React.useMemo(() => {
    const today = defaultStoreHours[0];

    if (!today.isOpen) {
      return 'Closed today';
    }

    return `${today.openTime} - ${today.closeTime}`;
  }, []);

  const maintenanceProfile = React.useMemo(
    () => ({
      storeName: 'جرين بول',
      branchLabel: selectedStoreScope.label,
      cityLabel: 'الرياض',
      managerLabel: 'خالد',
      todayHoursLabel,
      activeZoneLabel: defaultZone.title,
    }),
    [selectedStoreScope.label, todayHoursLabel],
  );

  const partnerActionableHandoffs = React.useMemo(
    () => getActionableHandoffsForSurface('app-partner'),
    [],
  );

  const deliveryOpsSummary = React.useMemo(
    () => ({
      outForDelivery: 8,
      handoffReady: (getSurfaceModeCapability('bthwani_delivery').partner.receivesOrder || getSurfaceModeCapability('partner_delivery').partner.receivesOrder) ? 5 : 1,
      deliveredToday: 24,
      delayedRisk: partnerActionableHandoffs.filter((h) => h.wltImpact.eventKind !== 'none').length,
    }),
    [partnerActionableHandoffs],
  );

  const partnerEntryState = 'ready' as const;

  React.useEffect(() => {
    const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1];

    if (route !== previousRoute) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
    }
  }, [route]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (storeScopeVisible) {
        setStoreScopeVisible(false);
        return true;
      }

      // walletHubVisible check removed.

      if (ordersSearchMode) {
        setOrdersSearchMode(false);
        return true;
      }

      if (route === 'home' && accountHubSection !== 'hub') {
        setAccountHubSection('hub');
        return true;
      }

      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry';
        setRoute(previousRoute);
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [accountHubSection, ordersSearchMode, route, storeScopeVisible]);

  const openOrdersBoard = React.useCallback(() => {
    setOrdersSearchMode(false);
    setRoute('inbox');
  }, []);

  const openOrdersSearch = React.useCallback(() => {
    setOrdersSearchMode(true);
    setRoute('inbox');
  }, []);

  const openAccountHub = React.useCallback((section: PartnerHubSection) => {
    setAccountHubSection(section);
    setRoute('home');
  }, []);

  const goBackInHistory = React.useCallback(() => {
    if (routeHistoryRef.current.length <= 1) {
      return false;
    }

    routeTransitionFromBackRef.current = true;
    routeHistoryRef.current.pop();
    const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry';
    setRoute(previousRoute);
    return true;
  }, []);

  const goBackToHub = React.useCallback(() => {
    if (goBackInHistory()) {
      return;
    }

    openAccountHub('hub');
  }, [goBackInHistory, openAccountHub]);

  const markSupportDirectoryIntent = React.useCallback(() => {
    supportDirectoryIntentRef.current = true;
    Promise.resolve().then(() => {
      supportDirectoryIntentRef.current = false;
    });
  }, []);

  const openSupportDirectory = React.useCallback((context?: Partial<DshPartnerSupportCommandContext>) => {
    markSupportDirectoryIntent();
    setSupportCommandContext({
      ...defaultSupportCommandContext,
      ...context,
    });
    setRoute('support-directory');
  }, [markSupportDirectoryIntent]);

  const returnToSupportDirectory = React.useCallback(() => {
    setRoute('support-directory');
  }, []);

  const openSupportCommandFromOperationalFlow = React.useCallback((
    flowId: DshPartnerOperationalFlowId,
    source: DshPartnerSupportCommandContext['source'] = 'operations',
  ) => {
    openSupportDirectory(buildSupportCommandContextFromOperationalFlow(flowId, source));
  }, [openSupportDirectory]);

  const openInventoryManagement = React.useCallback(() => {
    setRoute('inventory-management');
  }, []);

  const openStoreCourier = React.useCallback(() => {
    setRoute('store-courier');
  }, []);

  const openSupportScreen = React.useCallback((
    screenId: DshPartnerSupportRouteId,
    source: DshPartnerSupportCommandContext['source'] = 'operations',
  ) => {
    const nextContext = buildSupportCommandContextFromSupportRoute(screenId, source);
    const shouldStayInCommandCenter = supportDirectoryIntentRef.current && isCommandCenterInlineManagedRoute(screenId);

    supportDirectoryIntentRef.current = false;
    setSupportCommandContext(nextContext);

    if (shouldStayInCommandCenter) {
      setRoute('support-directory');
      return;
    }

    setSelectedSupportScreen(screenId);
    setRoute('support-screen');
  }, []);

  const openWalletHub = React.useCallback(() => {
    openAccountHub('wallet');
  }, [openAccountHub]);

  const openStoreScope = React.useCallback(() => {
    setStoreScopeVisible(true);
  }, []);

  const topBar = (
    <ModernPremiumHeader
      title={maintenanceProfile.storeName}
      locationLabel={`الرياض · ${selectedStoreScope.label} · ${maintenanceProfile.activeZoneLabel}`}
      onProfilePress={() => openAccountHub('profile')}
      onNotificationsPress={() => {
        setActiveOrderId(initialOrderId);
        setRoute('bell');
      }}
      onSearchPress={openOrdersSearch}
      onLocationPress={openStoreScope}
      tickerStatus="مباشر"
      tickerMessage="الطلبات والمخزون تحت المتابعة الآن."
      direction="rtl"
    />
  );

  // walletHubSheet removed.

  const storeScopeSheet = (
    <PartnerStoreScopeSheet
      visible={storeScopeVisible}
      onClose={() => setStoreScopeVisible(false)}
      options={storeScopeOptions}
      selectedId={selectedStoreScopeId}
      onSelect={setSelectedStoreScopeId}
    />
  );

  const showBottomNav = route !== 'entry';

  const bottomActiveId = React.useMemo(() => {
    // Orders/launcher is active when viewing inbox — cashier context
    if (route === 'inbox') {
      return 'orders';
    }
    if (route === 'home') {
      if (accountHubSection === 'wallet') {
        return 'wallet';
      }
      if (accountHubSection === 'operations') {
        return 'operations';
      }
      if (accountHubSection === 'inventory') {
        return 'inventory';
      }
      return 'profile';
    }
    if (route === 'inventory-management') {
      return 'inventory';
    }
    if (route === 'support-directory' || route === 'support-screen' || route === 'order-rejection') {
      return 'operations';
    }
    return '';
  }, [route, accountHubSection]);

  const bottomNavBar = showBottomNav ? (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <BottomNavBar
        activeId={bottomActiveId}
        direction="rtl"
        launcherLabel="الطلبات"
        launcherIcon="receipt-outline"
        launcherActive={bottomActiveId === 'orders'}
        onLauncherPress={openOrdersBoard}
        onSelect={(id: string) => {
          if (id === 'profile') {
            openAccountHub('hub');
          } else if (id === 'wallet') {
            openAccountHub('wallet');
          } else if (id === 'inventory') {
            openInventoryManagement();
          } else if (id === 'operations') {
            openSupportDirectory({ source: 'operations' });
          }
        }}
        items={[
          { id: 'operations', label: 'العمليات', icon: 'people-outline', activeIcon: 'people' },
          { id: 'wallet', label: 'المحفظة', icon: 'wallet-outline', activeIcon: 'wallet' },
          { id: 'inventory', label: 'المخزون', icon: 'cube-outline', activeIcon: 'cube' },
          { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' },
        ]}
      />
    </View>
  ) : null;

  const renderMainShell = (content: React.ReactNode) => (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      {topBar}
      <Box
        background="background"
        padding={0}
        gap={0}
        radiusToken="none"
        border={false}
        style={{
          flex: 1,
          marginTop: -2,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'visible',
          paddingBottom: Platform.OS === 'android' ? 112 : 80, // Dynamic padding to prevent overlap with Android nav bars
        }}
      >
        {content}
      </Box>
      {storeScopeSheet}
      {bottomNavBar}
    </Box>
  );

  const renderSurfaceShell = (content: React.ReactNode) => (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      <Box background="background" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, overflow: 'visible', paddingBottom: Platform.OS === 'android' ? 112 : 80 }}>
        {content}
      </Box>
      {storeScopeSheet}
      {bottomNavBar}
    </Box>
  );

  if (route === 'home') {
    return renderSurfaceShell(
      <DshPartnerHubSurface
        section={accountHubSection}
        onSectionChange={setAccountHubSection}
        storeName={maintenanceProfile.storeName}
        branchLabel={selectedStoreScope.label}
        cityLabel={maintenanceProfile.cityLabel}
        managerLabel={maintenanceProfile.managerLabel}
        todayHoursLabel={maintenanceProfile.todayHoursLabel}
        activeZoneLabel={maintenanceProfile.activeZoneLabel}
        storeOpen
        listingEnabled
        serviceModes={defaultServiceModes}
        activeOrdersCount={deliveryOpsSummary.outForDelivery + deliveryOpsSummary.handoffReady}
        urgentOrdersCount={deliveryOpsSummary.delayedRisk}
        pendingActionsCount={deliveryOpsSummary.handoffReady}
        onOpenOrdersBoard={openOrdersBoard}
        onOpenOrdersSearch={openOrdersSearch}
        onOpenInventoryManagement={openInventoryManagement}
        onOpenStoreScope={openStoreScope}
        onOpenSupportDirectory={() => openSupportDirectory({ source: 'hub' })}
        onOpenWalletHub={openWalletHub}
        onOpenBell={() => {
          setActiveOrderId(initialOrderId);
          setRoute('bell');
        }}
        onOpenOperationalFlow={(flowId) => openSupportCommandFromOperationalFlow(flowId, 'hub')}
        onOpenSupportScreen={(screenId) => openSupportScreen(screenId, 'hub')}
        onOpenStoreCourierSetup={openStoreCourier}
      />,
    );
  }

  if (route === 'entry') {
    return renderSurfaceShell(
      <PartnerEntryScreen
        state={partnerEntryState}
        onOpenOrdersBoardPress={openOrdersBoard}
        onOpenOrderDetailPress={openOrdersBoard}
        onOpenMaintenancePress={() => openAccountHub('profile')}
        onOpenIssueQueuePress={() => openSupportCommandFromOperationalFlow('order-issue-queue', 'orders')}
      />,
    );
  }

  if (route === 'bell') {
    return renderSurfaceShell(
      <NotificationsScreen
        activeOrderId={activeOrderId === initialOrderId ? undefined : activeOrderId}
        onOpenInbox={openOrdersBoard}
        onOpenOrderSupport={(orderId) => {
          setActiveOrderId(orderId);
          openSupportCommandFromOperationalFlow('order-alerts', 'bell');
        }}
        onOpenAlertsSupport={(flowId) => openSupportCommandFromOperationalFlow(flowId, 'bell')}
        onBack={openOrdersBoard}
        onRetry={() => setRoute('bell')}
      />,
    );
  }

  if (route === 'inbox') {
    return renderMainShell(
      <OrdersInboxScreen
        searchMode={ordersSearchMode}
        onCloseSearch={() => setOrdersSearchMode(false)}
        onRetry={() => setRoute('inbox')}
      />,
    );
  }

  if (route === 'inventory-management') {
    return renderSurfaceShell(
      <InventoryCatalogScreen
        onBack={() => openAccountHub('hub')}
        onNavigateToProductEdit={(prodId) => {
          setEditingProductId(prodId);
          setRoute('product-edit');
        }}
        onNavigateToCategoryManagement={() => {
          setRoute('category-management');
        }}
        storeName={maintenanceProfile.storeName}
        branchLabel={selectedStoreScope.label}
        activeZoneLabel={maintenanceProfile.activeZoneLabel}
        todayHoursLabel={maintenanceProfile.todayHoursLabel}
      />,
    );
  }

  if (route === 'product-edit') {
    return renderSurfaceShell(
      <ProductEditScreen
        storeId="store-1001"
        productId={editingProductId}
        onBack={() => setRoute('inventory-management')}
        onSaved={() => {
          setEditingProductId(undefined);
          setRoute('inventory-management');
        }}
      />,
    );
  }

  if (route === 'category-management') {
    return renderSurfaceShell(
      <CategoryManagementScreen
        storeId="store-1001"
        onBack={() => setRoute('inventory-management')}
      />,
    );
  }

  if (route === 'support-directory') {
    return renderSurfaceShell(
      <PartnerSupportScreen
        onBack={goBackToHub}
        onOpenScreen={openSupportScreen}
        initialFilterId={supportCommandContext.filterId}
        initialCaseId={supportCommandContext.highlightedCaseId ?? null}
        initialIssueCategoryId={supportCommandContext.highlightedIssueCategoryId ?? null}
        initialSupportRouteId={supportCommandContext.preferredSupportRouteId ?? null}
      />,
    );
  }

  if (route === 'store-courier') {
    return renderSurfaceShell(
      <DshPartnerStoreCourierScreen onBack={() => openAccountHub('operations')} />,
    );
  }

  if (route === 'support-screen') {
    const selectedIssueCategoryId = supportCommandContext.highlightedIssueCategoryId ?? undefined;
    const supportScreens: Record<DshPartnerSupportRouteId, React.ReactNode> = {
      'auction-status-update': <AuctionStatusUpdateScreen onBack={returnToSupportDirectory} onSecondaryAction={returnToSupportDirectory} />,
      'chat-read-ack': <ConversationScreen activeFlowId="chat-read-ack" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('quick-reply-config')} />,
      'chat-send': <ConversationScreen activeFlowId="chat-send" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('quick-reply-setup')} />,
      'doc-upload': <OnboardingActionScreen activeFlowId="doc-upload" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'intake-start': <OnboardingActionScreen activeFlowId="intake-start" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'inventory-adjust': <InventoryActionScreen activeFlowId="inventory-adjust" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('inventory-update')} />,
      'inventory-update': <InventoryActionScreen activeFlowId="inventory-update" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'items-upsert': <InventoryActionScreen activeFlowId="items-upsert" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'order-accept': <OrderActionScreen activeFlowId="order-accept" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('order-get')} />,
      'order-get': <OrderActionScreen activeFlowId="order-get" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('order-handoff')} />,
      'order-handoff': <OrderActionScreen activeFlowId="order-handoff" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'order-issue-queue': <OrderIssueScreen activeFlowId="order-issue-queue" selectedCategoryId={selectedIssueCategoryId} onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'order-out-for-delivery': <OrderActionScreen activeFlowId="order-out-for-delivery" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'order-prepare': <OrderActionScreen activeFlowId="order-prepare" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'order-ready': <OrderActionScreen activeFlowId="order-ready" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'order-reject': <OrderIssueScreen activeFlowId="order-reject" selectedCategoryId={selectedIssueCategoryId} onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'order-store-delivered': <OrderActionScreen activeFlowId="order-store-delivered" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'quick-reply-config': <ConversationScreen activeFlowId="quick-reply-config" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('quick-reply-settings')} />,
      'quick-reply-settings': <ConversationScreen activeFlowId="quick-reply-settings" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('quick-reply-setup')} />,
      'quick-reply-setup': <ConversationScreen activeFlowId="quick-reply-setup" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'store-nomination': <OnboardingActionScreen activeFlowId="store-nomination" onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />,
      'video-upload': <VideoUploadScreen onBack={returnToSupportDirectory} onSecondaryAction={returnToSupportDirectory} />,
    };

    return renderSurfaceShell(supportScreens[selectedSupportScreen]);
  }

  if (route === 'order-rejection') {
    return renderSurfaceShell(
      <OrderIssueScreen
        activeFlowId="order-reject"
        selectedCategoryId={supportCommandContext.highlightedIssueCategoryId ?? 'partner-reject-request'}
        onBack={returnToSupportDirectory}
        onOpenScreen={openSupportScreen}
        onSecondaryAction={returnToSupportDirectory}
      />,
    );
  }

  return renderMainShell(
    <DshPartnerHubSurface
      storeName={maintenanceProfile.storeName}
      branchLabel={selectedStoreScope.label}
      cityLabel={maintenanceProfile.cityLabel}
      managerLabel={maintenanceProfile.managerLabel}
      todayHoursLabel={maintenanceProfile.todayHoursLabel}
      activeZoneLabel={maintenanceProfile.activeZoneLabel}
      onOpenOrdersBoard={openOrdersBoard}
      onOpenInventoryManagement={openInventoryManagement}
      onOpenStoreScope={openStoreScope}
      onOpenWalletHub={openWalletHub}
      onOpenSupportDirectory={() => openSupportDirectory({ source: 'hub' })}
      onOpenOperationalFlow={(flowId) => openSupportCommandFromOperationalFlow(flowId, 'hub')}
      onOpenSupportScreen={(screenId) => openSupportScreen(screenId, 'hub')}
      onOpenStoreCourierSetup={openStoreCourier}
    />,
  );
}

export default DshPartnerSurface;
