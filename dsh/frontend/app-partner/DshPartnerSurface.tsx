import React from 'react';
import { BackHandler, Platform } from 'react-native';
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

type PartnerStoreScopeOption = {
  id: string;
  label: string;
  description: string;
};

type PartnerStoreHoursDay = {
  id: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

const defaultStoreHours: readonly PartnerStoreHoursDay[] = [
  { id: 'sun', label: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'mon', label: 'Monday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'tue', label: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'wed', label: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'thu', label: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'fri', label: 'Friday', isOpen: false, openTime: '14:00', closeTime: '23:30' },
  { id: 'sat', label: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '23:30' },
] as const;

const defaultServiceModes = [
  {
    id: 'partner_delivery',
    label: 'توصيل المتجر',
    description: 'تفعيل توصيل المتجر عبر موصل الشريك عند الجاهزية التشغيلية.',
    enabled: true,
  },
  {
    id: 'pickup',
    label: 'استلام بنفسي',
    description: 'إظهار الاستلام الذاتي عندما يكون المتجر جاهزًا لتسليم العميل مباشرة.',
    enabled: true,
  },
  {
    id: 'bthwani_delivery',
    label: 'توصيل بثواني',
    description: 'فتح توصيل بثواني فقط عند توفر تغطية الكباتن والإسناد.',
    enabled: false,
  },
] as const;

const defaultZone = {
  title: 'Yasmin',
} as const;

const storeScopeOptions: readonly PartnerStoreScopeOption[] = [
  {
    id: 'all',
    label: 'كل الفروع',
    description: 'عرض موحّد لكل فروع الشريك.',
  },
  {
    id: 'fakhama-1',
    label: 'الفخامة 1',
    description: 'الفرع الأساسي الحالي.',
  },
  {
    id: 'fakhama-2',
    label: 'الفخامة 2',
    description: 'فرع المدينة الثاني للتشغيل.',
  },
  {
    id: 'fakhama-3',
    label: 'الفخامة 3',
    description: 'فرع داعم لنطاق الطلبات الممتد.',
  },
] as const;

const defaultSupportCommandContext: DshPartnerSupportCommandContext = {
  filterId: 'all',
  highlightedCaseId: null,
  highlightedIssueCategoryId: null,
  preferredOperationalFlowId: null,
  preferredSupportRouteId: null,
  source: 'operations',
};

function resolveSupportFilterFromOperationalFlow(
  flowId: DshPartnerOperationalFlowId
): DshPartnerSupportCommandFilterId {
  if (flowId === 'order-alerts' || flowId === 'order-sla-risk') {
    return 'active-orders';
  }

  if (
    flowId === 'order-chat-read-ack'
    || flowId === 'order-chat-send'
    || flowId === 'order-quick-reply-config'
    || flowId === 'order-quick-reply-settings'
    || flowId === 'order-quick-reply-setup'
  ) {
    return 'conversations';
  }

  if (
    flowId === 'inventory-adjust'
    || flowId === 'inventory-update'
    || flowId === 'items-upsert'
    || flowId === 'doc-upload'
    || flowId === 'intake-start'
    || flowId === 'store-nomination'
  ) {
    return 'inventory-branch';
  }

  if (
    flowId === 'partner-finance-bridge'
    || flowId === 'partner-settlement-summary'
    || flowId === 'partner-commission-summary'
  ) {
    return 'escalation';
  }

  if (
    flowId === 'order-issue-queue'
    || flowId === 'order-issue-required'
    || flowId === 'order-reject'
  ) {
    return 'order-issues';
  }

  return 'active-orders';
}

function resolveSupportFilterFromRoute(
  routeId: DshPartnerSupportRouteId
): DshPartnerSupportCommandFilterId {
  if (
    routeId === 'chat-read-ack'
    || routeId === 'chat-send'
    || routeId === 'quick-reply-config'
    || routeId === 'quick-reply-settings'
    || routeId === 'quick-reply-setup'
  ) {
    return 'conversations';
  }

  if (
    routeId === 'inventory-adjust'
    || routeId === 'inventory-update'
    || routeId === 'items-upsert'
    || routeId === 'doc-upload'
    || routeId === 'intake-start'
    || routeId === 'store-nomination'
    || routeId === 'video-upload'
  ) {
    return 'inventory-branch';
  }

  if (routeId === 'order-issue-queue' || routeId === 'order-reject') {
    return 'order-issues';
  }

  return 'active-orders';
}

function resolveIssueCategoryFromOperationalFlow(
  flowId: DshPartnerOperationalFlowId
): DshPartnerSupportIssueCategoryId | null {
  if (flowId === 'order-sla-risk') return 'delayed-preparation';
  if (flowId === 'order-reject') return 'partner-reject-request';
  if (flowId === 'order-handoff') return 'handoff-mismatch';
  if (flowId === 'order-chat-read-ack' || flowId === 'order-chat-send') return 'customer-not-responding';
  if (flowId === 'inventory-adjust' || flowId === 'inventory-update' || flowId === 'items-upsert') return 'item-unavailable';
  if (flowId === 'partner-finance-bridge' || flowId === 'partner-settlement-summary' || flowId === 'partner-commission-summary') {
    return 'payment-refund-review';
  }

  return null;
}

function resolveIssueCategoryFromRoute(
  routeId: DshPartnerSupportRouteId
): DshPartnerSupportIssueCategoryId | null {
  if (routeId === 'order-reject') return 'partner-reject-request';
  if (routeId === 'order-handoff') return 'handoff-mismatch';
  if (routeId === 'chat-read-ack' || routeId === 'chat-send' || routeId === 'quick-reply-config' || routeId === 'quick-reply-settings' || routeId === 'quick-reply-setup') {
    return 'customer-not-responding';
  }
  if (routeId === 'inventory-adjust' || routeId === 'inventory-update' || routeId === 'items-upsert') {
    return 'item-unavailable';
  }

  return null;
}

function isCommandCenterInlineManagedRoute(routeId: DshPartnerSupportRouteId): boolean {
  return routeId === 'order-issue-queue' || routeId === 'order-reject';
}

function buildSupportCommandContextFromOperationalFlow(
  flowId: DshPartnerOperationalFlowId,
  source: DshPartnerSupportCommandContext['source'] = 'operations'
): DshPartnerSupportCommandContext {
  return {
    filterId: resolveSupportFilterFromOperationalFlow(flowId),
    highlightedCaseId: null,
    highlightedIssueCategoryId: resolveIssueCategoryFromOperationalFlow(flowId),
    preferredOperationalFlowId: flowId,
    preferredSupportRouteId: mapDshPartnerOperationalFlowToSupportRoute(flowId),
    source,
  };
}

function buildSupportCommandContextFromSupportRoute(
  routeId: DshPartnerSupportRouteId,
  source: DshPartnerSupportCommandContext['source'] = 'operations'
): DshPartnerSupportCommandContext {
  return {
    filterId: resolveSupportFilterFromRoute(routeId),
    highlightedCaseId: null,
    highlightedIssueCategoryId: resolveIssueCategoryFromRoute(routeId),
    preferredOperationalFlowId: mapDshPartnerSupportRouteToOperationalFlow(routeId),
    preferredSupportRouteId: routeId,
    source,
  };
}

// Removed PartnerWalletHubSheet in favor of self-contained WltDshPartnerBridge cockpit tabs.

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

  const deliveryOpsSummary = React.useMemo(
    () => ({
      outForDelivery: 8,
      handoffReady: defaultServiceModes.some((mode) => mode.id === 'partner_delivery' || mode.id === 'bthwani_delivery') ? 5 : 1,
      deliveredToday: 24,
      delayedRisk: 2,
    }),
    [],
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
        storeName={maintenanceProfile.storeName}
        branchLabel={selectedStoreScope.label}
        activeZoneLabel={maintenanceProfile.activeZoneLabel}
        todayHoursLabel={maintenanceProfile.todayHoursLabel}
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
