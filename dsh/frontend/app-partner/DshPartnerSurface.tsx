import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { BottomNavBar, Box, ModernPremiumHeader, spacing } from '@bthwani/ui-kit';
import type {
  DshPartnerOperationalFlowId,
  DshPartnerRoute,
  DshPartnerSupportCommandContext,
  DshPartnerSupportRouteId,
  DshPartnerSurfaceProps,
  PartnerHubSection,
} from './dsh-partner.types';
import {
  buildSupportCommandContextFromOperationalFlow,
  buildSupportCommandContextFromSupportRoute,
  defaultSupportCommandContext,
  isCommandCenterInlineManagedRoute,
  storeScopeOptions,
} from './dsh-partner.navigation-bridge';
import { buildPartnerDeliveryOpsSummary, buildPartnerProfileFromScope } from '../shared/view-models/partner';
import { getActionableHandoffsForSurface } from '../shared/contracts/dsh-order-lifecycle-handoffs';
import { usePartnerOrdersRuntime } from '../shared';
import { PlatformVarsProvider, FeatureFlagProvider, usePlatformVars } from '../platform';
import { PartnerStoreScopeSheet } from './parts/PartnerStoreScopeSheet';
import { DshPartnerRouteRenderer } from './screens/DshPartnerRouteRenderer';
import type { PartnerOrderItem } from './screens/OrdersInboxScreen';

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

  // ── Visual state ──────────────────────────────────────────────────────────
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
  const setSelectedSupportScreen = (screen: DshPartnerSupportRouteId) =>
    setSupportNav((s) => ({ ...s, screen }));
  const setSupportCommandContext = (context: DshPartnerSupportCommandContext) =>
    setSupportNav((s) => ({ ...s, context }));

  const routeHistoryRef = React.useRef<DshPartnerRoute[]>([initialRoute]);
  const routeTransitionFromBackRef = React.useRef(false);
  const supportDirectoryIntentRef = React.useRef(false);

  // ── Runtime data (from shared) ────────────────────────────────────────────
  const { orders: partnerOrders, state: partnerOrdersState, markReady: handleMarkReady } = usePartnerOrdersRuntime(route) as {
    orders: readonly PartnerOrderItem[];
    state: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'partial';
    markReady: (orderId: string) => void;
  };

  // ── Route history (UI-only navigation tracking) ───────────────────────────
  React.useEffect(() => {
    const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1];
    if (route !== prev) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
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

  // ── Derived model from shared pure functions ───────────────────────────────
  const selectedStoreScope = React.useMemo(
    () => storeScopeOptions.find((o) => o.id === selectedStoreScopeId) ?? storeScopeOptions[0],
    [selectedStoreScopeId],
  );
  const runtimePartnerProfile = React.useMemo(
    () => buildPartnerProfileFromScope(selectedStoreScope),
    [selectedStoreScope],
  );
  const partnerActionableHandoffs = React.useMemo(
    () => getActionableHandoffsForSurface('app-partner'),
    [],
  );
  const deliveryOpsSummary = React.useMemo(
    () => buildPartnerDeliveryOpsSummary(partnerOrders, partnerActionableHandoffs),
    [partnerActionableHandoffs, partnerOrders],
  );

  // ── Navigation actions (UI-only) ──────────────────────────────────────────
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
  const goBackToHub = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry');
      return;
    }
    openAccountHub('hub');
  }, [openAccountHub]);
  const markSupportDirectoryIntent = React.useCallback(() => {
    supportDirectoryIntentRef.current = true;
    Promise.resolve().then(() => { supportDirectoryIntentRef.current = false; });
  }, []);
  const openSupportDirectory = React.useCallback((context?: Partial<DshPartnerSupportCommandContext>) => {
    markSupportDirectoryIntent();
    setSupportCommandContext({ ...defaultSupportCommandContext, ...context } as DshPartnerSupportCommandContext);
    setRoute('support-directory');
  }, [markSupportDirectoryIntent]);
  const returnToSupportDirectory = React.useCallback(() => setRoute('support-directory'), []);
  const openSupportCommandFromOperationalFlow = React.useCallback(
    (flowId: DshPartnerOperationalFlowId, source: DshPartnerSupportCommandContext['source'] = 'operations') => {
      openSupportDirectory(buildSupportCommandContextFromOperationalFlow(flowId, source));
    },
    [openSupportDirectory],
  );
  const openInventoryManagement = React.useCallback(() => setRoute('inventory-management'), []);
  const openStoreCourier = React.useCallback(() => setRoute('store-courier'), []);
  const openWalletHub = React.useCallback(() => openAccountHub('wallet'), [openAccountHub]);
  const openStoreScope = React.useCallback(() => setStoreScopeVisible(true), []);
  const openSupportScreen = React.useCallback(
    (screenId: DshPartnerSupportRouteId, source: DshPartnerSupportCommandContext['source'] = 'operations') => {
      const nextContext = buildSupportCommandContextFromSupportRoute(screenId, source);
      const shouldStay = supportDirectoryIntentRef.current && isCommandCenterInlineManagedRoute(screenId);
      supportDirectoryIntentRef.current = false;
      setSupportCommandContext(nextContext);
      if (shouldStay) { setRoute('support-directory'); return; }
      setSelectedSupportScreen(screenId);
      setRoute('support-screen');
    },
    [],
  );

  // ── UI chrome ────────────────────────────────────────────────────────────
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
    if (route === 'inbox') return 'orders';
    if (route === 'home') {
      if (accountHubSection === 'wallet') return 'wallet';
      if (accountHubSection === 'operations') return 'operations';
      if (accountHubSection === 'inventory') return 'inventory';
      return 'profile';
    }
    if (route === 'inventory-management') return 'inventory';
    if (route === 'support-directory' || route === 'support-screen' || route === 'order-rejection') return 'operations';
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
        onSelect={(id) => {
          if (id === 'profile') openAccountHub('hub');
          else if (id === 'wallet') openAccountHub('wallet');
          else if (id === 'inventory') openInventoryManagement();
          else if (id === 'operations') openSupportDirectory({ source: 'operations' });
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

  const renderMainShell = (content: React.ReactNode): React.ReactElement => (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      {topBar}
      <Box
        background="background" padding={0} gap={0} radiusToken="none" border={false}
        style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'visible', paddingBottom: Platform.OS === 'android' ? 112 : 80 }}
      >
        {content}
      </Box>
      {storeScopeSheet}
      {bottomNavBar}
    </Box>
  );

  const renderSurfaceShell = (content: React.ReactNode): React.ReactElement => (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      <Box
        background="background" padding={0} gap={0} radiusToken="none" border={false}
        style={{ flex: 1, overflow: 'visible', paddingBottom: Platform.OS === 'android' ? 112 : 80 }}
      >
        {content}
      </Box>
      {storeScopeSheet}
      {bottomNavBar}
    </Box>
  );

  return (
    <DshPartnerRouteRenderer
      route={route}
      initialOrderId={initialOrderId}
      activeOrderId={activeOrderId}
      ordersSearchMode={ordersSearchMode}
      accountHubSection={accountHubSection}
      editingProductId={editingProductId}
      selectedSupportScreen={selectedSupportScreen}
      supportCommandContext={supportCommandContext}
      partnerOrdersState={partnerOrdersState}
      partnerOrders={partnerOrders}
      runtimePartnerProfile={runtimePartnerProfile}
      selectedStoreScope={selectedStoreScope}
      selectedStoreScopeId={selectedStoreScopeId}
      deliveryOpsSummary={deliveryOpsSummary}
      dshAuthBearerToken={dshAuthBearerToken ?? undefined}
      dshClientId={dshClientId ?? undefined}
      renderMainShell={renderMainShell}
      renderSurfaceShell={renderSurfaceShell}
      setRoute={setRoute}
      setActiveOrderId={setActiveOrderId}
      setOrdersSearchMode={setOrdersSearchMode}
      setAccountHubSection={setAccountHubSection}
      setEditingProductId={setEditingProductId}
      setSupportState={({ screenId, commandContext }) => {
        setSelectedSupportScreen(screenId);
        setSupportCommandContext(commandContext);
      }}
      openOrdersBoard={openOrdersBoard}
      openOrdersSearch={openOrdersSearch}
      openAccountHub={openAccountHub}
      goBackToHub={goBackToHub}
      openSupportDirectory={openSupportDirectory}
      returnToSupportDirectory={returnToSupportDirectory}
      openSupportScreen={openSupportScreen}
      openInventoryManagement={openInventoryManagement}
      openStoreCourier={openStoreCourier}
      openSupportCommandFromOperationalFlow={openSupportCommandFromOperationalFlow}
      handleMarkReady={handleMarkReady}
    />
  );
}

export default DshPartnerSurface;
