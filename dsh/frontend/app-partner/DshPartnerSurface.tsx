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
import { storeScopeOptions } from './dsh-partner.navigation-bridge';
import { useDshPartnerSurfaceModel } from '../shared/view-models/partner/useDshPartnerSurfaceModel';
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

  const {
    state,
    actions,
    selectedStoreScope,
    runtimePartnerProfile,
    partnerOrdersState,
    partnerOrders,
    deliveryOpsSummary,
  } = useDshPartnerSurfaceModel(initialRoute, initialOrderId);

  const {
    route,
    storeScopeVisible,
    accountHubSection,
    ordersSearchMode,
    selectedStoreScopeId,
    editingProductId,
    activeOrderId,
    supportNav,
  } = state;

  const selectedSupportScreen = supportNav.screen;
  const supportCommandContext = supportNav.context;

  const setRoute = actions.setRoute;
  const setActiveOrderId = actions.setActiveOrderId;
  const setOrdersSearchMode = actions.setOrdersSearchMode;
  const setAccountHubSection = actions.setAccountHubSection;
  const setEditingProductId = actions.setEditingProductId;

  const openOrdersBoard = actions.openOrdersBoard;
  const openOrdersSearch = actions.openOrdersSearch;
  const openAccountHub = actions.openAccountHub;
  const goBackToHub = actions.goBackToHub;
  const openSupportDirectory = actions.openSupportDirectory;
  const returnToSupportDirectory = actions.returnToSupportDirectory;
  const openSupportScreen = actions.openSupportScreen;
  const openInventoryManagement = actions.openInventoryManagement;
  const openStoreCourier = actions.openStoreCourier;
  const openSupportCommandFromOperationalFlow = actions.handleOperationalFlowNavigation;
  const handleMarkReady = actions.handleMarkReady;

  React.useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      return actions.handleHardwareBackPress();
    });
    return () => subscription.remove();
  }, [actions]);

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
