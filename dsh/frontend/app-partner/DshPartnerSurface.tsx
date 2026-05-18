import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Box, Button, Icon, Surface, Text, TopBar, useTheme } from '@bthwani/ui-kit';
import { wltDshPartnerUiCopy } from '../../../wlt/frontend/app-partner/dsh/wlt-dsh-partner.ui-copy';
import type {
  DshPartnerRoute,
  DshPartnerSurfaceProps,
  PartnerHubSection,
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
  OrderDetailScreen,
  type PartnerOrderDetailSummary,
} from './screens/OrdersInboxScreen';
import { PartnerEntryScreen } from './screens/PartnerEntryScreen';
import { PartnerSupportScreen, type PartnerSupportRouteId } from './screens/PartnerSupportScreen';

type PartnerWalletHubDestination = 'partner_subscription' | 'partner_settlement_summary' | 'partner_payouts';

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

function PartnerWalletHubSheet({
  visible,
  onClose,
  onNavigate,
}: {
  visible: boolean;
  onClose: () => void;
  onNavigate: (destination: PartnerWalletHubDestination) => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={5} gap={4} radiusToken="xl" border={false} style={{ margin: 16 }}>
      <Text role="titleMd">{wltDshPartnerUiCopy.walletHubTitle}</Text>
      <Button onPress={() => onNavigate('partner_subscription')}>{wltDshPartnerUiCopy.walletSubscriptionLabel}</Button>
      <Button onPress={() => onNavigate('partner_settlement_summary')}>{wltDshPartnerUiCopy.walletSettlementSummaryLabel}</Button>
      <Button onPress={onClose}>{wltDshPartnerUiCopy.walletCloseLabel}</Button>
    </Surface>
  );
}

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
        <Button key={option.id} variant={option.id === selectedId ? 'primary' : 'secondary'} onPress={() => onSelect(option.id)}>
          {option.label}
        </Button>
      ))}
      <Button onPress={onClose}>إغلاق</Button>
    </Surface>
  );
}

export function DshPartnerSurface({
  initialRoute = 'inbox',
  initialOrderId = 'partner-order-1042',
}: DshPartnerSurfaceProps = {}) {
  const { theme } = useTheme();
  const [walletHubVisible, setWalletHubVisible] = React.useState(false);
  const [storeScopeVisible, setStoreScopeVisible] = React.useState(false);
  const [accountHubSection, setAccountHubSection] = React.useState<PartnerHubSection>('hub');
  const [ordersSearchMode, setOrdersSearchMode] = React.useState(false);
  const [selectedStoreScopeId, setSelectedStoreScopeId] = React.useState('all');
  const [route, setRoute] = React.useState<DshPartnerRoute>(initialRoute);
  const [activeOrderId, setActiveOrderId] = React.useState(initialOrderId);
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<PartnerSupportRouteId>('order-issue-queue');
  const routeHistoryRef = React.useRef<DshPartnerRoute[]>([initialRoute]);
  const routeTransitionFromBackRef = React.useRef(false);

  React.useEffect(() => {
    if (route !== 'inbox' && ordersSearchMode) {
      setOrdersSearchMode(false);
    }
  }, [ordersSearchMode, route]);

  const selectedStoreScope = React.useMemo(
    () => storeScopeOptions.find((option) => option.id === selectedStoreScopeId) ?? storeScopeOptions[0],
    [selectedStoreScopeId],
  );

  const activeOrderSummary = React.useMemo<PartnerOrderDetailSummary>(() => {
    if (activeOrderId === 'partner-order-1048') {
      return {
        orderId: 'partner-order-1048',
        merchantName: 'جرين بول',
        customerName: 'نورا',
        serviceWindowLabel: 'يتبقى 18 دقيقة قبل حد الخدمة',
        nextActionLabel: 'تأكيد التغليف',
        readinessNote: 'فحص التغليف ما يزال معلقًا قبل انتقال الطلب إلى التسليم.',
      };
    }

    if (activeOrderId === 'partner-order-1051') {
      return {
        orderId: 'partner-order-1051',
        merchantName: 'بين هاوس',
        customerName: 'سارة',
        serviceWindowLabel: 'يتبقى 24 دقيقة قبل حد الخدمة',
        nextActionLabel: 'فتح مساحة الطلب',
        readinessNote: 'موعد الإرسال محجوز وزمن انتظار العميل يرتفع.',
      };
    }

    return {
      orderId: 'partner-order-1042',
      merchantName: 'برغر لاب',
      customerName: 'عمر',
      serviceWindowLabel: 'يتبقى 12 دقيقة قبل حد الخدمة',
      nextActionLabel: 'تأكيد الجاهزية وتسليم الطلب لجهة التوصيل',
      readinessNote: 'التغليف مكتمل ومسار التسليم متاح.',
    };
  }, [activeOrderId]);

  const todayHoursLabel = React.useMemo(() => {
    const today = defaultStoreHours[0];

    if (!today.isOpen) {
      return 'Closed today';
    }

    return `${today.openTime} - ${today.closeTime}`;
  }, []);

  const maintenanceProfile = React.useMemo(
    () => ({
      storeName: activeOrderSummary.merchantName,
      branchLabel: selectedStoreScope.label,
      cityLabel: 'الرياض',
      managerLabel: 'خالد',
      todayHoursLabel,
      activeZoneLabel: defaultZone.title,
    }),
    [activeOrderSummary.merchantName, selectedStoreScope.label, todayHoursLabel],
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

      if (walletHubVisible) {
        setWalletHubVisible(false);
        return true;
      }

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
  }, [accountHubSection, ordersSearchMode, route, storeScopeVisible, walletHubVisible]);

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

  const openSupportDirectory = React.useCallback(() => {
    setRoute('support-directory');
  }, []);

  const openInventoryManagement = React.useCallback(() => {
    setRoute('inventory-management');
  }, []);

  const openSupportScreen = React.useCallback((screenId: PartnerSupportRouteId) => {
    setSelectedSupportScreen(screenId);
    setRoute('support-screen');
  }, []);

  const openWalletHub = React.useCallback(() => {
    setWalletHubVisible(true);
  }, []);

  const openStoreScope = React.useCallback(() => {
    setStoreScopeVisible(true);
  }, []);

  const handleWalletHubNavigation = React.useCallback((destination: PartnerWalletHubDestination) => {
    if (destination === 'partner_subscription') {
      openAccountHub('wallet');
      return;
    }

    setRoute('support-directory');
  }, [openAccountHub]);

  const topBar = (
    <TopBar
      variant="brand"
      layoutMode="relaxed-main"
      title={maintenanceProfile.storeName}
      locationLabel={`الرياض، ${selectedStoreScope.label}`}
      onTitlePress={openStoreScope}
      titleAccessibilityLabel="فتح اختيار المتجر أو الفرع"
      actions={[
        {
          id: 'profile',
          icon: <Icon name="person-outline" size={21} color={theme.brandContrast} />,
          accessibilityLabel: 'الحساب',
          onPress: () => openAccountHub('hub'),
        },
        {
          id: 'notifications',
          icon: <Icon name="notifications-outline" size={21} color={theme.brandContrast} />,
          badgeCount: 3,
          accessibilityLabel: 'الإشعارات',
          onPress: () => setRoute('bell'),
        },
        {
          id: 'wallet',
          icon: <Icon name="wallet-outline" size={21} color={theme.brandContrast} />,
          accessibilityLabel: 'المحفظة والحسابات المالية',
          onPress: () => openAccountHub('wallet'),
        },
        {
          id: 'search',
          icon: <Icon name="search-outline" size={21} color={theme.brandContrast} />,
          accessibilityLabel: 'البحث',
          onPress: openOrdersSearch,
        },
      ]}
    />
  );

  const walletHubSheet = (
    <PartnerWalletHubSheet
      visible={walletHubVisible}
      onClose={() => setWalletHubVisible(false)}
      onNavigate={handleWalletHubNavigation}
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

  const renderMainShell = (content: React.ReactNode) => (
    <Box style={{ flex: 1 }} background="background">
      {topBar}
      <Surface
        tone="raised"
        padding={0}
        gap={0}
        radiusToken="none"
        border={false}
        style={{
          flex: 1,
          marginTop: -2,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}
      >
        {content}
      </Surface>
      {walletHubSheet}
      {storeScopeSheet}
    </Box>
  );

  const renderSurfaceShell = (content: React.ReactNode) => (
    <Box style={{ flex: 1 }} background="background">
      <Surface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, overflow: 'hidden' }}>
        {content}
      </Surface>
      {walletHubSheet}
      {storeScopeSheet}
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
        onOpenInventoryManagement={openInventoryManagement}
        onOpenStoreScope={openStoreScope}
        onOpenSupportDirectory={openSupportDirectory}
        onOpenWalletHub={openWalletHub}
        onOpenBell={() => setRoute('bell')}
      />,
    );
  }

  if (route === 'entry') {
    return renderSurfaceShell(
      <PartnerEntryScreen
        state={partnerEntryState}
        onOpenOrdersBoardPress={openOrdersBoard}
        onOpenOrderDetailPress={() => {
          setActiveOrderId('partner-order-1042');
          setRoute('detail');
        }}
        onOpenMaintenancePress={() => openAccountHub('profile')}
        onOpenIssueQueuePress={() => openAccountHub('operations')}
      />,
    );
  }

  if (route === 'bell') {
    return renderSurfaceShell(
      <NotificationsScreen
        activeOrderId={undefined}
        onOpenInbox={openOrdersBoard}
        onOpenNextOrder={() => {
          setActiveOrderId('partner-order-1042');
          setRoute('detail');
        }}
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
        onOpenOrder={(orderId) => {
          setActiveOrderId(orderId);
          setRoute('detail');
        }}
        onOpenNextOrder={(orderId) => {
          setActiveOrderId(orderId);
          setRoute('detail');
        }}
        onRetry={() => setRoute('inbox')}
      />,
    );
  }

  if (route === 'detail') {
    return renderSurfaceShell(
      <OrderDetailScreen
        summary={activeOrderSummary}
        onConfirmReady={() => setRoute('inbox')}
        onOpenNextOrder={() => setRoute('inbox')}
        onBackToInbox={() => setRoute('inbox')}
        onRetry={() => setRoute('detail')}
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
        onBack={() => openAccountHub('hub')}
        onOpenScreen={openSupportScreen}
      />,
    );
  }

  if (route === 'support-screen') {
    const supportScreens: Record<PartnerSupportRouteId, React.ReactNode> = {
      'auction-status-update': <AuctionStatusUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'chat-read-ack': <ConversationScreen activeFlowId="chat-read-ack" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('quick-reply-config')} />,
      'chat-send': <ConversationScreen activeFlowId="chat-send" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('quick-reply-setup')} />,
      'doc-upload': <OnboardingActionScreen activeFlowId="doc-upload" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'intake-start': <OnboardingActionScreen activeFlowId="intake-start" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'inventory-adjust': <InventoryActionScreen activeFlowId="inventory-adjust" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('inventory-update')} />,
      'inventory-update': <InventoryActionScreen activeFlowId="inventory-update" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'items-upsert': <InventoryActionScreen activeFlowId="items-upsert" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'order-accept': <OrderActionScreen activeFlowId="order-accept" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('order-get')} />,
      'order-get': <OrderActionScreen activeFlowId="order-get" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('order-handoff')} />,
      'order-handoff': <OrderActionScreen activeFlowId="order-handoff" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'order-issue-queue': <OrderIssueScreen activeFlowId="order-issue-queue" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'order-out-for-delivery': <OrderActionScreen activeFlowId="order-out-for-delivery" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'order-prepare': <OrderActionScreen activeFlowId="order-prepare" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'order-ready': <OrderActionScreen activeFlowId="order-ready" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'order-reject': <OrderIssueScreen activeFlowId="order-reject" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'order-store-delivered': <OrderActionScreen activeFlowId="order-store-delivered" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'quick-reply-config': <ConversationScreen activeFlowId="quick-reply-config" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('quick-reply-settings')} />,
      'quick-reply-settings': <ConversationScreen activeFlowId="quick-reply-settings" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={() => openSupportScreen('quick-reply-setup')} />,
      'quick-reply-setup': <ConversationScreen activeFlowId="quick-reply-setup" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'store-nomination': <OnboardingActionScreen activeFlowId="store-nomination" onBack={openSupportDirectory} onOpenScreen={openSupportScreen} onSecondaryAction={openSupportDirectory} />,
      'video-upload': <VideoUploadScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
    };

    return renderSurfaceShell(supportScreens[selectedSupportScreen]);
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
      onOpenSupportDirectory={openSupportDirectory}
    />,
  );
}

export default DshPartnerSurface;
