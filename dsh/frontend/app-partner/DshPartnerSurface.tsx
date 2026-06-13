import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { BottomNavBar, Box, ModernPremiumHeader, spacing } from '@bthwani/ui-kit';
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
import { getSurfaceModeCapability } from '../shared/contracts/dsh-fulfillment-surface-visibility';
import { getActionableHandoffsForSurface } from '../shared/contracts/dsh-order-lifecycle-handoffs';
import { usePartnerOrdersRuntime } from '../shared';
import { PlatformVarsProvider, FeatureFlagProvider, usePlatformVars } from '../platform';
import type { PartnerOrderItem } from './screens/OrdersInboxScreen';
import { DshPartnerHubSurface } from './screens/PartnerHubScreen';
import { InventoryCatalogScreen } from './screens/InventoryCatalogScreen';
import {
  AuctionStatusUpdateScreen, ConversationScreen, InventoryActionScreen, NotificationsScreen,
  OnboardingActionScreen, OrderActionScreen, OrderIssueScreen, VideoUploadScreen,
} from './screens/OperationScreens';
import { OrdersInboxScreen } from './screens/OrdersInboxScreen';
import { DshPartnerStoreCourierScreen } from './screens/DshPartnerStoreCourierScreen';
import { PartnerEntryScreen } from './screens/PartnerEntryScreen';
import { PartnerSupportScreen } from './screens/PartnerSupportScreen';
import { ProductEditScreen } from './screens/ProductEditScreen';
import { CategoryManagementScreen } from './screens/CategoryManagementScreen';
import { ProductMediaScreen } from './screens/ProductMediaScreen';
import { ProductOverridesScreen } from './screens/ProductOverridesScreen';
import { PartnerStoreScopeSheet } from './parts/PartnerStoreScopeSheet';
import {
  defaultServiceModes, storeScopeOptions, defaultSupportCommandContext,
  isCommandCenterInlineManagedRoute,
  buildSupportCommandContextFromOperationalFlow,
  buildSupportCommandContextFromSupportRoute,
} from './dsh-partner.navigation-bridge';

export function DshPartnerSurface(props: DshPartnerSurfaceProps) {
  return (
    <PlatformVarsProvider>
      <FeatureFlagProvider>
        <DshPartnerSurfaceInner {...props} />
      </FeatureFlagProvider>
    </PlatformVarsProvider>
  );
}

function DshPartnerSurfaceInner({ initialRoute = 'inbox', initialOrderId = '' }: DshPartnerSurfaceProps = {}) {
  const { dshAuthBearerToken, dshClientId } = usePlatformVars();
  const [storeScopeVisible, setStoreScopeVisible] = React.useState(false);
  const [accountHubSection, setAccountHubSection] = React.useState<PartnerHubSection>('hub');
  const [ordersSearchMode, setOrdersSearchMode] = React.useState(false);
  const [selectedStoreScopeId, setSelectedStoreScopeId] = React.useState('all');
  const [route, setRoute] = React.useState<DshPartnerRoute>(initialRoute);
  const [editingProductId, setEditingProductId] = React.useState<string | undefined>(undefined);
  const [activeOrderId, setActiveOrderId] = React.useState(initialOrderId);
  const [supportNav, setSupportNav] = React.useState<{
    screen: DshPartnerSupportRouteId;
    context: DshPartnerSupportCommandContext;
  }>({
    screen: initialRoute === 'order-rejection' ? 'order-reject' : 'order-issue-queue',
    context: initialRoute === 'order-rejection'
      ? buildSupportCommandContextFromSupportRoute('order-reject', 'orders')
      : { ...defaultSupportCommandContext },
  });

  const selectedSupportScreen = supportNav.screen;
  const supportCommandContext = supportNav.context;
  const setSelectedSupportScreen = (screen: DshPartnerSupportRouteId) => setSupportNav((s) => ({ ...s, screen }));
  const setSupportCommandContext = (context: DshPartnerSupportCommandContext) => setSupportNav((s) => ({ ...s, context }));

  const routeHistoryRef = React.useRef<DshPartnerRoute[]>([initialRoute]);
  const routeTransitionFromBackRef = React.useRef(false);
  const supportDirectoryIntentRef = React.useRef(false);

  const { orders: partnerOrders, state: partnerOrdersState, markReady: handleMarkReady } = usePartnerOrdersRuntime(route) as {
    orders: readonly PartnerOrderItem[];
    state: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'partial';
    markReady: (orderId: string) => void;
  };

  // Merged: route history tracking + search mode reset
  React.useEffect(() => {
    const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1];
    if (route !== prev) {
      if (routeTransitionFromBackRef.current) { routeTransitionFromBackRef.current = false; }
      else { routeHistoryRef.current.push(route); }
    }
    if (route !== 'inbox' && ordersSearchMode) setOrdersSearchMode(false);
  }, [ordersSearchMode, route]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (storeScopeVisible) { setStoreScopeVisible(false); return true; }
      if (ordersSearchMode) { setOrdersSearchMode(false); return true; }
      if (route === 'home' && accountHubSection !== 'hub') { setAccountHubSection('hub'); return true; }
      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry');
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [accountHubSection, ordersSearchMode, route, storeScopeVisible]);

  const selectedStoreScope = React.useMemo(() => storeScopeOptions.find((o) => o.id === selectedStoreScopeId) ?? storeScopeOptions[0], [selectedStoreScopeId]);
  const activeStoreRuntimeId = selectedStoreScope.id === 'all' ? '' : selectedStoreScope.id;

  const runtimePartnerProfile = React.useMemo(() => ({
    storeName: selectedStoreScope.label,
    branchLabel: selectedStoreScope.label,
    cityLabel: selectedStoreScope.description,
    managerLabel: 'غير محدد',
    todayHoursLabel: 'يتطلب ربط ساعات التشغيل',
    activeZoneLabel: selectedStoreScope.label,
  }), [selectedStoreScope.description, selectedStoreScope.label]);

  const partnerActionableHandoffs = React.useMemo(() => getActionableHandoffsForSurface('app-partner'), []);

  const deliveryOpsSummary = React.useMemo(() => {
    const partnerReceivesOrders = getSurfaceModeCapability('bthwani_delivery').partner.receivesOrder || getSurfaceModeCapability('partner_delivery').partner.receivesOrder;
    return {
      outForDelivery: partnerOrders.filter((o) => o.status === 'captain_assigned' || o.status === 'captain_arriving' || o.status === 'delivering').length,
      handoffReady: partnerReceivesOrders ? partnerOrders.filter((o) => o.status === 'ready' || o.status === 'items_ready' || o.status === 'handoff').length : 0,
      deliveredToday: partnerOrders.filter((o) => o.status === 'completed').length,
      delayedRisk: partnerOrders.filter((o) => o.priority === 'high' || o.slaRisk || o.issueRequired).length + partnerActionableHandoffs.filter((h) => h.wltImpact.eventKind !== 'none').length,
    };
  }, [partnerActionableHandoffs, partnerOrders]);

  const openOrdersBoard = React.useCallback(() => { setOrdersSearchMode(false); setRoute('inbox'); }, []);
  const openOrdersSearch = React.useCallback(() => { setOrdersSearchMode(true); setRoute('inbox'); }, []);
  const openAccountHub = React.useCallback((section: PartnerHubSection) => { setAccountHubSection(section); setRoute('home'); }, []);
  const goBackToHub = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) { routeTransitionFromBackRef.current = true; routeHistoryRef.current.pop(); setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry'); return; }
    openAccountHub('hub');
  }, [openAccountHub]);
  const markSupportDirectoryIntent = React.useCallback(() => { supportDirectoryIntentRef.current = true; Promise.resolve().then(() => { supportDirectoryIntentRef.current = false; }); }, []);
  const openSupportDirectory = React.useCallback((context?: Partial<DshPartnerSupportCommandContext>) => { markSupportDirectoryIntent(); setSupportCommandContext({ ...defaultSupportCommandContext, ...context } as DshPartnerSupportCommandContext); setRoute('support-directory'); }, [markSupportDirectoryIntent]);
  const returnToSupportDirectory = React.useCallback(() => setRoute('support-directory'), []);
  const openSupportCommandFromOperationalFlow = React.useCallback((flowId: DshPartnerOperationalFlowId, source: DshPartnerSupportCommandContext['source'] = 'operations') => { openSupportDirectory(buildSupportCommandContextFromOperationalFlow(flowId, source)); }, [openSupportDirectory]);
  const openInventoryManagement = React.useCallback(() => setRoute('inventory-management'), []);
  const openStoreCourier = React.useCallback(() => setRoute('store-courier'), []);
  const openWalletHub = React.useCallback(() => openAccountHub('wallet'), [openAccountHub]);
  const openStoreScope = React.useCallback(() => setStoreScopeVisible(true), []);
  const openSupportScreen = React.useCallback((screenId: DshPartnerSupportRouteId, source: DshPartnerSupportCommandContext['source'] = 'operations') => {
    const nextContext = buildSupportCommandContextFromSupportRoute(screenId, source);
    const shouldStay = supportDirectoryIntentRef.current && isCommandCenterInlineManagedRoute(screenId);
    supportDirectoryIntentRef.current = false;
    setSupportCommandContext(nextContext);
    if (shouldStay) { setRoute('support-directory'); return; }
    setSelectedSupportScreen(screenId);
    setRoute('support-screen');
  }, []);

  const topBar = (
    <ModernPremiumHeader
      title={runtimePartnerProfile.storeName}
      locationLabel={`${selectedStoreScope.label} · ${runtimePartnerProfile.activeZoneLabel}`}
      onProfilePress={() => openAccountHub('profile')}
      onNotificationsPress={() => { setActiveOrderId(initialOrderId); setRoute('bell'); }}
      onSearchPress={openOrdersSearch}
      onLocationPress={openStoreScope}
      tickerStatus="مباشر"
      tickerMessage="الطلبات والمخزون تحت المتابعة الآن."
      direction="rtl"
    />
  );

  const storeScopeSheet = <PartnerStoreScopeSheet visible={storeScopeVisible} onClose={() => setStoreScopeVisible(false)} options={storeScopeOptions} selectedId={selectedStoreScopeId} onSelect={setSelectedStoreScopeId} />;

  const showBottomNav = route !== 'entry';
  const bottomActiveId = React.useMemo(() => {
    if (route === 'inbox') return 'orders';
    if (route === 'home') { if (accountHubSection === 'wallet') return 'wallet'; if (accountHubSection === 'operations') return 'operations'; if (accountHubSection === 'inventory') return 'inventory'; return 'profile'; }
    if (route === 'inventory-management') return 'inventory';
    if (route === 'support-directory' || route === 'support-screen' || route === 'order-rejection') return 'operations';
    return '';
  }, [route, accountHubSection]);

  const bottomNavBar = showBottomNav ? (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <BottomNavBar activeId={bottomActiveId} direction="rtl" launcherLabel="الطلبات" launcherIcon="receipt-outline" launcherActive={bottomActiveId === 'orders'} onLauncherPress={openOrdersBoard} onSelect={(id) => { if (id === 'profile') openAccountHub('hub'); else if (id === 'wallet') openAccountHub('wallet'); else if (id === 'inventory') openInventoryManagement(); else if (id === 'operations') openSupportDirectory({ source: 'operations' }); }} items={[{ id: 'operations', label: 'العمليات', icon: 'people-outline', activeIcon: 'people' }, { id: 'wallet', label: 'المحفظة', icon: 'wallet-outline', activeIcon: 'wallet' }, { id: 'inventory', label: 'المخزون', icon: 'cube-outline', activeIcon: 'cube' }, { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' }]} />
    </View>
  ) : null;

  const mainShell = (content: React.ReactNode) => (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      {topBar}
      <Box background="background" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'visible', paddingBottom: Platform.OS === 'android' ? 112 : 80 }}>
        {content}
      </Box>
      {storeScopeSheet}
      {bottomNavBar}
    </Box>
  );

  const shell = (content: React.ReactNode) => (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      <Box background="background" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, overflow: 'visible', paddingBottom: Platform.OS === 'android' ? 112 : 80 }}>
        {content}
      </Box>
      {storeScopeSheet}
      {bottomNavBar}
    </Box>
  );

  const hubSurfaceBaseProps = {
    storeName: runtimePartnerProfile.storeName, branchLabel: selectedStoreScope.label, cityLabel: runtimePartnerProfile.cityLabel,
    managerLabel: runtimePartnerProfile.managerLabel, todayHoursLabel: runtimePartnerProfile.todayHoursLabel, activeZoneLabel: runtimePartnerProfile.activeZoneLabel,
    onOpenInventoryManagement: openInventoryManagement, onOpenStoreScope: openStoreScope, onOpenWalletHub: openWalletHub,
    onOpenSupportDirectory: () => openSupportDirectory({ source: 'hub' }),
    onOpenOperationalFlow: (flowId: DshPartnerOperationalFlowId) => openSupportCommandFromOperationalFlow(flowId, 'hub'),
    onOpenSupportScreen: (screenId: DshPartnerSupportRouteId) => openSupportScreen(screenId, 'hub'),
    onOpenStoreCourierSetup: openStoreCourier,
    onOpenOrdersBoard: openOrdersBoard,
  };

  if (route === 'home') return shell(<DshPartnerHubSurface section={accountHubSection} onSectionChange={setAccountHubSection} {...hubSurfaceBaseProps} storeOpen listingEnabled serviceModes={defaultServiceModes} activeOrdersCount={deliveryOpsSummary.outForDelivery + deliveryOpsSummary.handoffReady} urgentOrdersCount={deliveryOpsSummary.delayedRisk} pendingActionsCount={deliveryOpsSummary.handoffReady} onOpenOrdersSearch={openOrdersSearch} onOpenBell={() => { setActiveOrderId(initialOrderId); setRoute('bell'); }} dshAuthBearerToken={dshAuthBearerToken} dshClientId={dshClientId} />);

  if (route === 'entry') return shell(<PartnerEntryScreen state="ready" onOpenOrdersBoardPress={openOrdersBoard} onOpenOrderDetailPress={openOrdersBoard} onOpenMaintenancePress={() => openAccountHub('profile')} onOpenIssueQueuePress={() => openSupportCommandFromOperationalFlow('order-issue-queue', 'orders')} />);

  if (route === 'bell') return shell(<NotificationsScreen activeOrderId={activeOrderId === initialOrderId ? undefined : activeOrderId} onOpenInbox={openOrdersBoard} onOpenOrderSupport={(orderId) => { setActiveOrderId(orderId); openSupportCommandFromOperationalFlow('order-alerts', 'bell'); }} onOpenAlertsSupport={(flowId) => openSupportCommandFromOperationalFlow(flowId, 'bell')} onBack={openOrdersBoard} onRetry={() => setRoute('bell')} />);

  if (route === 'inbox') return mainShell(<OrdersInboxScreen state={partnerOrdersState} items={partnerOrders} searchMode={ordersSearchMode} onCloseSearch={() => setOrdersSearchMode(false)} onMarkReady={handleMarkReady} onRetry={() => setRoute('inbox')} />);

  if (route === 'inventory-management') return shell(<InventoryCatalogScreen onBack={() => openAccountHub('hub')} onNavigateToProductEdit={(id) => { setEditingProductId(id); setRoute('product-edit'); }} onNavigateToCategoryManagement={() => setRoute('category-management')} onNavigateToProductMedia={(id) => { setEditingProductId(id); setRoute('product-media'); }} onNavigateToProductOverrides={(id) => { setEditingProductId(id); setRoute('product-overrides'); }} storeName={runtimePartnerProfile.storeName} branchLabel={selectedStoreScope.label} activeZoneLabel={runtimePartnerProfile.activeZoneLabel} todayHoursLabel={runtimePartnerProfile.todayHoursLabel} />);

  if (route === 'product-edit') return shell(<ProductEditScreen storeId={activeStoreRuntimeId} productId={editingProductId} onBack={() => setRoute('inventory-management')} onSaved={() => { setEditingProductId(undefined); setRoute('inventory-management'); }} />);
  if (route === 'category-management') return shell(<CategoryManagementScreen storeId={activeStoreRuntimeId} onBack={() => setRoute('inventory-management')} />);
  if (route === 'product-media') return shell(<ProductMediaScreen productId={editingProductId ?? ''} onBack={() => setRoute('inventory-management')} />);
  if (route === 'product-overrides') return shell(<ProductOverridesScreen productId={editingProductId ?? ''} onBack={() => setRoute('inventory-management')} />);

  if (route === 'support-directory') return shell(<PartnerSupportScreen onBack={goBackToHub} onOpenScreen={openSupportScreen} initialFilterId={supportCommandContext.filterId} initialCaseId={supportCommandContext.highlightedCaseId ?? null} initialIssueCategoryId={supportCommandContext.highlightedIssueCategoryId ?? null} initialSupportRouteId={supportCommandContext.preferredSupportRouteId ?? null} />);

  if (route === 'store-courier') return shell(<DshPartnerStoreCourierScreen onBack={() => openAccountHub('operations')} />);

  if (route === 'support-screen') {
    const catId = supportCommandContext.highlightedIssueCategoryId ?? undefined;
    const back = returnToSupportDirectory;
    const open = openSupportScreen;
    const screens: Record<DshPartnerSupportRouteId, React.ReactNode> = {
      'auction-status-update': <AuctionStatusUpdateScreen onBack={back} onSecondaryAction={back} />,
      'chat-read-ack': <ConversationScreen activeFlowId="chat-read-ack" onBack={back} onOpenScreen={open} onSecondaryAction={() => open('quick-reply-config')} />,
      'chat-send': <ConversationScreen activeFlowId="chat-send" onBack={back} onOpenScreen={open} onSecondaryAction={() => open('quick-reply-setup')} />,
      'doc-upload': <OnboardingActionScreen activeFlowId="doc-upload" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'intake-start': <OnboardingActionScreen activeFlowId="intake-start" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'inventory-adjust': <InventoryActionScreen activeFlowId="inventory-adjust" onBack={back} onOpenScreen={open} onSecondaryAction={() => open('inventory-update')} />,
      'inventory-update': <InventoryActionScreen activeFlowId="inventory-update" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'items-upsert': <InventoryActionScreen activeFlowId="items-upsert" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'order-accept': <OrderActionScreen activeFlowId="order-accept" onBack={back} onOpenScreen={open} onSecondaryAction={() => open('order-get')} />,
      'order-get': <OrderActionScreen activeFlowId="order-get" onBack={back} onOpenScreen={open} onSecondaryAction={() => open('order-handoff')} />,
      'order-handoff': <OrderActionScreen activeFlowId="order-handoff" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'order-issue-queue': <OrderIssueScreen activeFlowId="order-issue-queue" selectedCategoryId={catId} onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'order-out-for-delivery': <OrderActionScreen activeFlowId="order-out-for-delivery" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'order-prepare': <OrderActionScreen activeFlowId="order-prepare" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'order-ready': <OrderActionScreen activeFlowId="order-ready" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'order-reject': <OrderIssueScreen activeFlowId="order-reject" selectedCategoryId={catId} onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'order-store-delivered': <OrderActionScreen activeFlowId="order-store-delivered" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'quick-reply-config': <ConversationScreen activeFlowId="quick-reply-config" onBack={back} onOpenScreen={open} onSecondaryAction={() => open('quick-reply-settings')} />,
      'quick-reply-settings': <ConversationScreen activeFlowId="quick-reply-settings" onBack={back} onOpenScreen={open} onSecondaryAction={() => open('quick-reply-setup')} />,
      'quick-reply-setup': <ConversationScreen activeFlowId="quick-reply-setup" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'store-nomination': <OnboardingActionScreen activeFlowId="store-nomination" onBack={back} onOpenScreen={open} onSecondaryAction={back} />,
      'video-upload': <VideoUploadScreen onBack={back} onSecondaryAction={back} />,
    };
    return shell(screens[selectedSupportScreen]);
  }

  if (route === 'order-rejection') return shell(<OrderIssueScreen activeFlowId="order-reject" selectedCategoryId={supportCommandContext.highlightedIssueCategoryId ?? 'partner-reject-request'} onBack={returnToSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={returnToSupportDirectory} />);

  return mainShell(<DshPartnerHubSurface {...hubSurfaceBaseProps} />);
}

export default DshPartnerSurface;
