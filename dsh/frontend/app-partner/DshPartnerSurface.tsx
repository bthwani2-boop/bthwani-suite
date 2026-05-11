import React from 'react';
import { BackHandler, Platform, Pressable, Switch as RNSwitch, View } from 'react-native';
import { Box, Button, Chip, Icon, KeyValueList, ListItem, MobileCommandSectionList, MobileScrollView, MobileStickyPrimaryAction, StateView, Surface, Text, TextField, TopBar, useDirection, useTheme } from '@bthwani/ui-kit';
import { canonicalPreviewStores, getCanonicalPreviewStoreCard } from '../shared/dshStoreProductCardModel';
import { dshPromotionCandidates, type DshPromotionCandidate } from '../shared/workflow';
import { WltDshPartnerBridge } from '../../../wlt/frontend/app-partner/dsh';
import type { DshPartnerHubSurfaceProps, DshPartnerOperationalFlowId, PartnerDshSurfaceState, PartnerHubSection } from './dsh-partner.types';
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
import { PromotionsScreen } from './screens/PromotionsScreen';
import { StoreProfileScreen } from './screens/StoreProfileScreen';

type PartnerWalletHubDestination = 'partner_subscription' | 'partner_settlement_summary' | 'partner_payouts';

type PartnerStoreScopeOption = {
  id: string;
  label: string;
  description: string;
};

export type DshPartnerRoute =
  | 'home'
  | 'entry'
  | 'inbox'
  | 'detail'
  | 'bell'
  | 'support-directory'
  | 'support-screen'
  | 'inventory-management';

export type DshPartnerSurfaceProps = {
  initialRoute?: DshPartnerRoute;
  initialOrderId?: string;
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
    id: 'delivery',
    label: 'Delivery',
    description: 'Accept delivery demand and keep captain handoff open.',
    enabled: true,
  },
  {
    id: 'pickup',
    label: 'Pickup',
    description: 'Expose pickup-only capacity without slowing the delivery branch flow.',
    enabled: true,
  },
  {
    id: 'scheduled',
    label: 'Scheduled orders',
    description: 'Allow future slots when the branch team can commit to preparation timing.',
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
      <Text role="titleMd">المحفظة</Text>
      <Button onPress={() => onNavigate('partner_subscription')}>الاشتراك</Button>
      <Button onPress={() => onNavigate('partner_settlement_summary')}>ملخص التسويات</Button>
      <Button onPress={onClose}>إغلاق</Button>
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
      nextActionLabel: 'تأكيد الجاهزية وإرسال الطلب للكابتن',
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
      handoffReady: defaultServiceModes.find((mode) => mode.id === 'delivery')?.enabled ? 5 : 1,
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

type PartnerOperationalMode = {
  id: 'pickup' | 'delivery' | 'scheduled';
  title: string;
  subtitle: string;
  commission: string;
  enabled: boolean;
};

type PartnerTeamMember = {
  id: string;
  name: string;
  roleLabel: 'مشرف' | 'موظف' | 'موصل';
  subtitle: string;
};

type PartnerCoverageZone = {
  id: string;
  name: string;
  subtitle: string;
  active: boolean;
};

type HubNavigationItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  kind: 'orders' | 'section';
  section?: Exclude<PartnerHubSection, 'hub'>;
};

type SummaryItem = {
  id: string;
  label: string;
  value: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'info';
};

type NotificationPreferenceId =
  | 'orders'
  | 'operations'
  | 'inventory'
  | 'finance'
  | 'marketing'
  | 'system'
  | 'sound'
  | 'dailyDigest'
  | 'priorityOnly';

type NotificationPreferenceState = Record<NotificationPreferenceId, boolean>;

const defaultOperationalModes: readonly PartnerOperationalMode[] = [
  { id: 'pickup', title: 'استلم بنفسك', subtitle: 'استلام من الفرع مباشرة.', commission: '0%', enabled: true },
  { id: 'delivery', title: 'توصيل المتجر', subtitle: 'قناة توصيل داخلية.', commission: '8%', enabled: true },
  { id: 'scheduled', title: 'توصيل بثواني', subtitle: 'جدولة سريعة عند الحاجة.', commission: '15%', enabled: false },
] as const;

const defaultTeamMembers: readonly PartnerTeamMember[] = [
  { id: 'manager', name: 'خالد', roleLabel: 'مشرف', subtitle: 'مشرف الفرع الحالي' },
  { id: 'staff-1', name: 'سارة', roleLabel: 'موظف', subtitle: 'إدارة الطلبات والردود' },
  { id: 'staff-2', name: 'مروان', roleLabel: 'موظف', subtitle: 'التجهيز والكتالوج' },
  { id: 'rider-1', name: 'عمر', roleLabel: 'موصل', subtitle: 'التسليم والحركة' },
] as const;

const defaultCoverageZones: readonly PartnerCoverageZone[] = [
  { id: 'yasmin', name: 'الياسمين', subtitle: 'نطاق رئيسي عالي الجاهزية.', active: true },
  { id: 'nada', name: 'الندى', subtitle: 'نطاق قريب مع طلب ثابت.', active: true },
] as const;

const partnerHubBottomInset = 112;

const defaultNotificationPreferences: NotificationPreferenceState = {
  orders: true,
  operations: true,
  inventory: true,
  finance: true,
  marketing: false,
  system: true,
  sound: true,
  dailyDigest: false,
  priorityOnly: false,
};

const hubNavigationItems: readonly HubNavigationItem[] = [
  {
    id: 'orders',
    title: 'الطلبات',
    description: 'إدارة الطلبات الحالية والسابقة وتتبع حالتها.',
    icon: 'receipt-outline',
    kind: 'orders',
  },
  {
    id: 'profile',
    title: 'ملف المتجر',
    description: 'بيانات المتجر، الهوية، الظهور، الفرع، والنطاق في مساحة واحدة.',
    icon: 'storefront-outline',
    kind: 'section',
    section: 'profile',
  },
  {
    id: 'operations',
    title: 'العمليات والفريق',
    description: 'حالة المتجر، التوصيل، الفريق، ومناطق التغطية.',
    icon: 'people-outline',
    kind: 'section',
    section: 'operations',
  },
  {
    id: 'inventory',
    title: 'المخزون والكتالوج',
    description: 'بحث أولًا، إضافة ذكية، أسعار ومخزون بدون تكرار.',
    icon: 'cube-outline',
    kind: 'section',
    section: 'inventory',
  },
  {
    id: 'wallet',
    title: 'المحفظة والحسابات المالية',
    description: 'الرصيد، المستحقات، التسويات، وآخر حركة.',
    icon: 'wallet-outline',
    kind: 'section',
    section: 'wallet',
  },
  {
    id: 'analytics',
    title: 'التحليلات والنمو والتسويق',
    description: 'الأداء، الفرص، العروض، الاشتراك، والتوصيات العملية.',
    icon: 'trending-up-outline',
    kind: 'section',
    section: 'analytics',
  },
  {
    id: 'settings',
    title: 'الإعدادات',
    description: 'التنبيهات، اللغة، التفضيلات، وإعدادات المتجر.',
    icon: 'settings-outline',
    kind: 'section',
    section: 'settings',
  },
] as const;

const sectionCopy: Record<Exclude<PartnerHubSection, 'hub'>, { title: string; description: string; icon: React.ComponentProps<typeof Icon>['name'] }> = {
  profile: {
    title: 'ملف المتجر',
    description: 'بيانات المتجر، الهوية، الظهور، الفرع، والنطاق في مساحة واحدة.',
    icon: 'storefront-outline',
  },
  operations: {
    title: 'العمليات والفريق',
    description: 'حالة المتجر، التوصيل، الفريق، ومناطق التغطية.',
    icon: 'people-outline',
  },
  inventory: {
    title: 'المخزون والكتالوج',
    description: 'بحث أولًا، إضافة ذكية، أسعار ومخزون بدون تكرار.',
    icon: 'cube-outline',
  },
  wallet: {
    title: 'المحفظة والحسابات المالية',
    description: 'الرصيد، المستحقات، التسويات، وآخر حركة.',
    icon: 'wallet-outline',
  },
  analytics: {
    title: 'التحليلات والنمو والتسويق',
    description: 'الأداء، الفرص، العروض، الاشتراك، والتوصيات العملية.',
    icon: 'trending-up-outline',
  },
  settings: {
    title: 'الإعدادات',
    description: 'التنبيهات، اللغة، التفضيلات، وإعدادات المتجر.',
    icon: 'settings-outline',
  },
};

type PromotionIntentState = 'ready' | 'empty' | 'pending' | 'blocked';

function resolvePromotionIntentStateMeta(state: PromotionIntentState) {
  if (state === 'pending') {
    return {
      stateId: 'empty' as const,
      title: 'طلب الترويج قيد المراجعة',
      description: 'النية الترويجية مسجلة محليًا وتنتظر مواءمة التسويق أو الشريك.',
      actionLabel: 'تحديث النية',
    };
  }

  if (state === 'blocked') {
    return {
      stateId: 'blockingError' as const,
      title: 'لا يمكن إعداد النية الآن',
      description: 'العنصر المختار غير جاهز للترويج أو يحتاج معالجة قبل الإرسال.',
      actionLabel: 'مراجعة الجاهزية',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'لا توجد عناصر قابلة للترويج',
      description: 'أضف منتجًا أو متجرًا مناسبًا ثم أعد فتح المسار الترويجي.',
      actionLabel: 'اختيار عنصر',
    };
  }

  return {
    stateId: 'loading' as const,
    title: 'مسار الترويج قيد التحضير',
    description: 'نجهز مساحة الشريك لالتقاط نية الترويج قبل تسليمها للتسويق.',
    actionLabel: 'فتح المسار',
  };
}

function PromotionCandidateRow({
  item,
  selected,
  onPress,
}: {
  item: DshPromotionCandidate;
  selected: boolean;
  onPress: () => void;
}) {
  const tone = item.eligibility === 'eligible' ? 'success' : item.eligibility === 'review' ? 'warning' : 'danger';

  const statusLabel =
    item.status === 'draft' ? 'مسودة' :
    item.status === 'partner-review' ? 'قيد الإرسال' :
    item.status === 'marketing-ready' ? 'معتمد ومؤهل' :
    'مرفوض';

  const statusTone =
    item.status === 'marketing-ready' ? 'success' :
    item.status === 'partner-review' ? 'warning' :
    item.status === 'marketing-rejected' ? 'danger' :
    'default';

  return (
    <Surface tone="default" padding={3} gap={2} style={{ borderWidth: 1, borderColor: selected ? '#FF500D' : undefined }}>
      <Box gap={1}>
        <Text role="bodyStrong">{item.title}</Text>
        <Text role="bodySm" tone="muted">{item.subtitle}</Text>
      </Box>

      <Box gap={1}>
        <Text role="caption" tone="muted">{item.availability}</Text>
        <Text role="caption" tone="muted">{item.offerHint}</Text>
      </Box>

      <Box layoutDirection="row" style={{ flexWrap: 'wrap' }} gap={2}>
        <Chip label={item.kind === 'product' ? 'منتج' : 'متجر'} tone="brand" selected />
        <Chip label={item.eligibility === 'eligible' ? 'مؤهل' : item.eligibility === 'review' ? 'تحت المراجعة' : 'محجوب'} tone={tone} />
        <Chip label={statusLabel} tone={statusTone} />
      </Box>

      <Button label={selected ? 'العنصر مفتوح' : 'اختيار العنصر'} tone={selected ? 'secondary' : 'ghost'} fullWidth={false} onPress={onPress} />
    </Surface>
  );
}

function PromotionIntentPanel({
  storeName,
  branchLabel,
  activeZoneLabel,
  todayHoursLabel,
}: {
  storeName: string;
  branchLabel: string;
  activeZoneLabel: string;
  todayHoursLabel: string;
}) {
  const { direction } = useDirection();
  const [selectedId, setSelectedId] = React.useState<string>(dshPromotionCandidates[0]?.id ?? '');
  const [offerTitle, setOfferTitle] = React.useState('عرض نهاية الأسبوع');
  const [offerNote, setOfferNote] = React.useState('خصم قصير على المنتجات الأعلى طلبًا مع إبراز واضح.');
  const [actionMessage, setActionMessage] = React.useState('النية الترويجية محلية حتى يتم تسليمها للتسويق.');

  const selectedItem = dshPromotionCandidates.find((item) => item.id === selectedId) ?? dshPromotionCandidates[0];

  const statusLabel =
    selectedItem?.status === 'draft' ? 'مسودة' :
    selectedItem?.status === 'partner-review' ? 'قيد الإرسال' :
    selectedItem?.status === 'marketing-ready' ? 'معتمد ومؤهل' :
    'مرفوض';

  const statusTone =
    selectedItem?.status === 'marketing-ready' ? 'success' :
    selectedItem?.status === 'partner-review' ? 'warning' :
    selectedItem?.status === 'marketing-rejected' ? 'danger' :
    'default';

  return (
    <Box gap={4}>
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">نية الترويج من الشريك</Text>
        <Text role="titleSm">اختر منتجًا أو متجرًا قابلًا للترويج ثم جهّز الطلب للتسويق</Text>
        <Text role="bodySm" tone="muted">
          هذه الشاشة تلتقط نية الترويج فقط: اختيار العنصر، وصف العرض، وتحديد حالة الإرسال.
        </Text>

        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap' }} gap={2}>
          <Chip label={storeName} tone="brand" />
          <Chip label={branchLabel} tone="info" />
          <Chip label={activeZoneLabel} tone="success" />
          <Chip label={todayHoursLabel} tone="warning" />
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="titleSm">العناصر القابلة للترويج</Text>
        <Box gap={2}>
          {dshPromotionCandidates.map((item) => (
            <PromotionCandidateRow key={item.id} item={item} selected={item.id === selectedItem?.id} onPress={() => setSelectedId(item.id)} />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="titleSm">تفاصيل نية الترويج</Text>
        <KeyValueList
          dense
          items={[
            { label: 'العنصر المختار', value: selectedItem?.title ?? 'غير محدد' },
            { label: 'النوع', value: selectedItem?.kind === 'store' ? 'متجر' : 'منتج', tone: 'brand' },
            { label: 'الأهلية', value: selectedItem?.eligibility === 'eligible' ? 'مؤهل' : selectedItem?.eligibility === 'review' ? 'تحت المراجعة' : 'محجوب', tone: selectedItem?.eligibility === 'eligible' ? 'success' : selectedItem?.eligibility === 'review' ? 'warning' : 'danger' },
            { label: 'الحالة', value: statusLabel, tone: statusTone },
          ]}
        />

        <Box gap={2}>
          <TextField label="عنوان العرض" value={offerTitle} onChangeText={setOfferTitle} placeholder="عنوان العرض" />
          <TextField label="ملاحظات النية" value={offerNote} onChangeText={setOfferNote} placeholder="وصف مختصر للعرض أو سبب الترويج" multiline />
        </Box>

        <Surface tone="inset" padding={3} gap={2}>
          <Text role="bodyStrong">آخر رسالة</Text>
          <Text role="bodySm" tone="muted">{actionMessage}</Text>
        </Surface>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="تأكيد نية الترويج" tone="primary" fullWidth={false} onPress={() => setActionMessage(`تم إرسال النية: ${offerTitle}`)} />
          <Button label="طلب إبراز في الرئيسية" tone="secondary" fullWidth={false} onPress={() => setActionMessage(`طلب إبراز: ${selectedItem?.title ?? 'غير محدد'}`)} />
          <Button label="تمييز المنتج" tone="ghost" fullWidth={false} onPress={() => setActionMessage(`تم وضع العنصر ضمن قائمة الترويج: ${selectedItem?.title ?? 'غير محدد'}`)} />
        </Box>
      </Surface>

      <MobileStickyPrimaryAction
        label="إرسال طلب الترويج"
        helperText="النية الترويجية محلية وتذهب للمراجعة فور إرسالها."
        onPress={() => setActionMessage(`تم إرسال النية: ${offerTitle}`)}
      />
    </Box>
  );
}

function SummaryCell({ label, value, tone = 'default' }: Omit<SummaryItem, 'id'>) {
  const { theme } = useTheme();
  const accentColor =
    tone === 'success'
      ? theme.success
      : tone === 'warning'
        ? theme.warning
        : tone === 'brand'
          ? theme.brand
          : tone === 'info'
            ? theme.info
            : theme.lineStrong;

  return (
    <Surface
      tone="default"
      padding={3}
      gap={1}
      style={{ flex: 1, minWidth: 96, borderWidth: 1, borderColor: accentColor }}
    >
      <Text role="caption" tone="muted" numberOfLines={1} align="start">
        {label}
      </Text>
      <Text role="bodyStrong" tone={tone} numberOfLines={1} align="start">
        {value}
      </Text>
    </Surface>
  );
}

function SettingsOptionRow({
  title,
  subtitle,
  icon,
  value,
  onValueChange,
  onPress,
  last = false,
  disabled = false,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  value?: boolean;
  onValueChange?: (nextValue: boolean) => void;
  onPress?: () => void;
  last?: boolean;
  disabled?: boolean;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const isSwitchRow = typeof value === 'boolean' && typeof onValueChange === 'function';

  return (
    <Pressable
      accessibilityRole={isSwitchRow ? undefined : 'button'}
      accessibilityLabel={title}
      accessibilityState={isSwitchRow ? undefined : { disabled }}
      disabled={disabled}
      onPress={isSwitchRow ? undefined : onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: pressed ? theme.surfaceInset : theme.surface,
          borderBottomWidth: last ? 0 : 1,
          borderBottomColor: theme.line,
          opacity: disabled ? 0.56 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: rowDirection, alignItems: 'center' }}>
        <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 12, flexShrink: 1, minWidth: 0 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surfaceInset,
              borderWidth: 1,
              borderColor: theme.line,
              flexShrink: 0,
            }}
          >
            <Icon name={icon} size={17} tone={isSwitchRow && value ? 'brand' : 'default'} />
          </View>

          <View style={{ flexShrink: 1, minWidth: 0, gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              {title}
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {isSwitchRow ? (
          <RNSwitch
            disabled={disabled}
            value={value}
            onValueChange={onValueChange}
            thumbColor={value ? theme.brandContrast : theme.surfaceRaised}
            trackColor={{ false: theme.lineStrong, true: theme.brand }}
            ios_backgroundColor={theme.lineStrong}
          />
        ) : (
          <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
        )}
      </View>
    </Pressable>
  );
}

function HubSectionShell({
  title,
  description,
  icon,
  onBack,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  onBack: () => void;
  children?: React.ReactNode;
}) {
  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      <TopBar
        variant="secondary"
        title={title}
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBack,
        }}
      />

      <View style={{ gap: 16 }}>
        {children}
      </View>
    </MobileScrollView>
  );
}

function resolveServiceModeEnabled(serviceModes: readonly { id: string; enabled: boolean }[] | undefined, modeId: PartnerOperationalMode['id'], fallback: boolean) {
  const matched = serviceModes?.find((mode) => {
    if (modeId === 'pickup') return mode.id === 'pickup';
    if (modeId === 'delivery') return mode.id === 'delivery' || mode.id === 'store-delivery';
    return mode.id === 'scheduled' || mode.id === 'seconds';
  });

  return matched?.enabled ?? fallback;
}

function OperationsModeRow({
  mode,
  selected,
  onPress,
}: {
  mode: PartnerOperationalMode;
  selected: boolean;
  onPress: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={mode.title}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: pressed ? theme.surfaceInset : theme.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
        },
      ]}
    >
      <View
        style={{
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 13,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? theme.brandSurface : theme.surfaceInset,
              borderWidth: 1,
              borderColor: selected ? theme.brand : theme.line,
              flexShrink: 0,
            }}
          >
            <Icon name={mode.id === 'pickup' ? 'hand-left-outline' : mode.id === 'delivery' ? 'car-outline' : 'time-outline'} size={16} tone={selected ? 'brand' : 'default'} />
          </View>

          <View style={{ flexShrink: 1, minWidth: 0, gap: 2 }}>
            <Text role="bodyStrong" align="start" numberOfLines={1}>
              {mode.title}
            </Text>
            <Text role="bodySm" tone="muted" align="start" numberOfLines={1}>
              {mode.subtitle}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 4, marginEnd: 10 }}>
          <Chip label={mode.enabled ? 'مفعّل' : 'غير مفعّل'} tone={mode.enabled ? 'success' : 'warning'} />
          <Text role="caption" tone="muted">
            {`عمولة ${mode.commission}`}
          </Text>
        </View>

        <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
      </View>
    </Pressable>
  );
}

function OperationsPanel({
  branchLabel,
  cityLabel,
  storeName,
  todayHoursLabel,
  storeOpen,
  activeZoneLabel,
  serviceModes,
  onBack,
}: {
  branchLabel: string;
  cityLabel: string;
  storeName: string;
  todayHoursLabel: string;
  storeOpen: boolean;
  activeZoneLabel: string;
  serviceModes: readonly { id: string; label: string; description: string; enabled: boolean }[];
  onBack: () => void;
}) {
  const { direction } = useDirection();
  const [selectedModeId, setSelectedModeId] = React.useState<PartnerOperationalMode['id']>('pickup');
  const [modeOverrides, setModeOverrides] = React.useState<Partial<Record<PartnerOperationalMode['id'], boolean>>>({});
  const [teamPanelOpen, setTeamPanelOpen] = React.useState(false);
  const [coveragePanelOpen, setCoveragePanelOpen] = React.useState(false);
  const [inviteDraft, setInviteDraft] = React.useState('');
  const [lastSaveLabel, setLastSaveLabel] = React.useState<string | null>(null);

  const resolvedModes = React.useMemo(
    () =>
      defaultOperationalModes.map((mode) => ({
        ...mode,
        enabled: modeOverrides[mode.id] ?? resolveServiceModeEnabled(serviceModes, mode.id, mode.enabled),
      })),
    [modeOverrides, serviceModes],
  );

  const activeModesCount = resolvedModes.filter((mode) => mode.enabled).length;
  const selectedMode = resolvedModes.find((mode) => mode.id === selectedModeId) ?? resolvedModes[0];

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      <TopBar
        variant="secondary"
        title="العمليات والفريق"
        subtitle={`${storeName} · ${branchLabel}`}
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBack,
        }}
      />

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">
          حالة التشغيل الآن
        </Text>

        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <SummaryCell label="حالة المتجر" value={storeOpen ? 'مفتوح الآن' : 'مغلق الآن'} tone={storeOpen ? 'success' : 'warning'} />
          <SummaryCell label="ساعات العمل" value={todayHoursLabel} tone="info" />
          <SummaryCell label="أوضاع مفعلة" value={`${activeModesCount}/3`} tone="brand" />
          <SummaryCell label="مناطق نشطة" value="منطقتان" tone="success" />
        </View>
      </Surface>

      <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
          <Text role="label" tone="muted">
            أوضاع الخدمة
          </Text>
        </View>

        {resolvedModes.map((mode) => (
          <OperationsModeRow
            key={mode.id}
            mode={mode}
            selected={mode.id === selectedMode.id}
            onPress={() => setSelectedModeId(mode.id)}
          />
        ))}

        <Surface tone="default" padding={3} gap={2} style={{ margin: 16, marginTop: 12 }}>
          <View
            style={{
              flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Text role="bodyStrong" align="start">
                {selectedMode.title}
              </Text>
              <Text role="bodySm" tone="muted" align="start">
                {selectedMode.subtitle}
              </Text>
            </View>
            <Chip label={selectedMode.enabled ? 'مفعّل' : 'غير مفعّل'} tone={selectedMode.enabled ? 'success' : 'warning'} />
          </View>
          <Text role="caption" tone="muted" align="start">
            {`عمولة ${selectedMode.commission}`}
          </Text>
          <Text role="bodySm" tone="muted" align="start">
            تفاصيل هذا الوضع تظهر داخل نفس الصفحة فقط، ويمكن تبديل حالته محليًا دون أي route جديد.
          </Text>
          <Button
            label={selectedMode.enabled ? 'إيقاف الوضع' : 'تفعيل الوضع'}
            tone="secondary"
            fullWidth={false}
            onPress={() => {
              setModeOverrides((current) => ({
                ...current,
                [selectedMode.id]: !selectedMode.enabled,
              }));
            }}
          />
        </Surface>
      </Surface>

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">
          الفريق
        </Text>
        <Text role="bodyStrong" align="start">
          مشرف 1 · موظف 3 · موصل 2
        </Text>
        <Button
          label="إدارة الفريق"
          tone="secondary"
          fullWidth={false}
          onPress={() => setTeamPanelOpen((current) => !current)}
        />

        {teamPanelOpen ? (
          <Surface tone="inset" padding={3} gap={3}>
            <View
              style={{
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <Chip label="مشرف" tone="brand" />
              <Chip label="موظف" tone="info" />
              <Chip label="موصل" tone="success" />
            </View>

            <View style={{ gap: 10 }}>
              {defaultTeamMembers.map((member) => (
                <ListItem key={member.id} title={member.name} subtitle={member.subtitle} meta={member.roleLabel} badgeLabel={member.roleLabel} />
              ))}
            </View>

            <Surface tone="default" padding={3} gap={3}>
              <TextField
                label="اسم العضو أو البريد"
                placeholder="مثال: staff@bthwani.sa"
                value={inviteDraft}
                onChangeText={setInviteDraft}
                hint="إضافة عضو تتم داخل نفس الصفحة بدون انتقال إلى أي route جديد."
              />
              <Button
                label="إضافة عضو"
                tone="secondary"
                fullWidth={false}
                onPress={() => {
                  if (!inviteDraft.trim()) {
                    return;
                  }

                  setLastSaveLabel(`دعوة محلية: ${inviteDraft.trim()}`);
                  setInviteDraft('');
                }}
              />
              {lastSaveLabel ? (
                <Text role="caption" tone="success">
                  {lastSaveLabel}
                </Text>
              ) : null}
            </Surface>
          </Surface>
        ) : null}
      </Surface>

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">
          مناطق التغطية
        </Text>
        <Text role="bodyStrong" align="start">
          منطقتان نشطتان
        </Text>
        <Button
          label="إدارة المناطق"
          tone="secondary"
          fullWidth={false}
          onPress={() => setCoveragePanelOpen((current) => !current)}
        />

        {coveragePanelOpen ? (
          <Surface tone="inset" padding={3} gap={3}>
            <Text role="bodySm" tone="muted" align="start">
              {`النطاق الحالي: ${activeZoneLabel}`}
            </Text>

            <View style={{ gap: 10 }}>
              {defaultCoverageZones.map((zone) => (
                <ListItem key={zone.id} title={zone.name} subtitle={zone.subtitle} badgeLabel={zone.active ? 'نشط' : 'موقوف'} />
              ))}
            </View>
          </Surface>
        ) : null}
      </Surface>

      <MobileStickyPrimaryAction
        label="حفظ إعدادات العمليات"
        helperText={lastSaveLabel ? `آخر حفظ: ${lastSaveLabel}` : 'التعديلات تحفظ من نفس الصفحة.'}
        onPress={() => setLastSaveLabel(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }))}
      />
    </MobileScrollView>
  );
}

export function DshPartnerHubSurface(props: DshPartnerHubSurfaceProps) {
  const {
    state = 'ready',
    section,
    onSectionChange,
    storeName = 'متجر الفخامة',
    branchLabel = 'الرياض، فرع الياسمين',
    cityLabel = 'الرياض',
    managerLabel = 'خالد',
    todayHoursLabel = '09:00 - 23:00',
    storeOpen = true,
    listingEnabled = true,
    activeZoneLabel = 'الياسمين / الندى',
    activeOrdersCount = 13,
    serviceModes = [],
    onOpenOrdersBoard,
    onOpenStoreScope,
    onOpenSupportDirectory,
    onOpenWalletHub,
    onOpenBell,
    onOpenOperationalFlow,
    onOpenSupportScreen,
    canonicalStoreId,
  } = props;

  const { direction } = useDirection();
  const [internalSection, setInternalSection] = React.useState<PartnerHubSection>('hub');
  const [notificationPreferences, setNotificationPreferences] = React.useState<NotificationPreferenceState>(defaultNotificationPreferences);
  const activeSection = section ?? internalSection;
  const updateSection = onSectionChange ?? setInternalSection;
  const activeCanonicalStore = React.useMemo(() => {
    const activeCanonicalStoreId = canonicalStoreId ?? canonicalPreviewStores[0]?.id;
    return activeCanonicalStoreId ? getCanonicalPreviewStoreCard(activeCanonicalStoreId) : undefined;
  }, [canonicalStoreId]);
  const resolvedStoreName = activeCanonicalStore?.storeName ?? storeName;
  const resolvedBranchLabel = activeCanonicalStore?.branchLabel ?? branchLabel;
  const resolvedCityLabel = activeCanonicalStore?.cityLabel ?? cityLabel;
  const resolvedManagerLabel = activeCanonicalStore?.managerName ?? managerLabel;
  const resolvedTodayHoursLabel = activeCanonicalStore?.operatingHoursLabel ?? todayHoursLabel;
  const resolvedActiveZoneLabel = activeCanonicalStore?.zoneLabel ?? activeZoneLabel;
  const enabledNotificationChannelsCount = React.useMemo(
    () => ['orders', 'operations', 'inventory', 'finance', 'marketing', 'system'].filter((key) => notificationPreferences[key as NotificationPreferenceId]).length,
    [notificationPreferences],
  );

  function updateNotificationPreference(preferenceId: NotificationPreferenceId, nextValue: boolean) {
    setNotificationPreferences((current) => ({
      ...current,
      [preferenceId]: nextValue,
    }));
  }

  function openOrderAlerts() {
    onOpenOperationalFlow?.('order-alerts');
    onOpenBell?.();
  }

  function openOperationsDirectory() {
    onOpenOperationalFlow?.('order-issue-queue');
    onOpenSupportDirectory?.();
    onOpenSupportScreen?.('order-issue-queue');
  }

  const summaryItems = React.useMemo<readonly SummaryItem[]>(
    () => [
      { id: 'store-status', label: 'حالة المتجر', value: storeOpen ? 'مفتوح الآن' : 'مغلق الآن', tone: storeOpen ? 'success' : 'warning' },
      { id: 'active-orders', label: 'الطلبات النشطة', value: String(activeOrdersCount), tone: 'brand' },
      { id: 'hours', label: 'ساعات العمل', value: resolvedTodayHoursLabel, tone: 'info' },
    ],
    [activeOrdersCount, resolvedTodayHoursLabel, storeOpen],
  );

  if (state !== 'ready') {
    const stateId = state === 'loading' ? 'loading' : state === 'empty' ? 'empty' : state === 'offline' ? 'offline' : 'blockingError';

    return (
      <StateView
        stateId={stateId}
        title="مركز حساب الشريك"
        description="نجهز الآن نموذج التنقل الخاص بالحساب. سيبقى المسار واضحًا ومضغوطًا حتى يكتمل التحميل."
        actionLabel={onOpenOrdersBoard ? 'فتح الطلبات' : undefined}
        onActionPress={onOpenOrdersBoard}
      />
    );
  }

  if (activeSection !== 'hub') {
    if (activeSection === 'profile') {
      return (
        <HubSectionShell title={sectionCopy.profile.title} description={sectionCopy.profile.description} icon={sectionCopy.profile.icon} onBack={() => updateSection('hub')}>
          <StoreProfileScreen
            storeName={resolvedStoreName}
            branchLabel={resolvedBranchLabel}
            cityLabel={resolvedCityLabel}
            managerLabel={resolvedManagerLabel}
            todayHoursLabel={resolvedTodayHoursLabel}
            activeZoneLabel={resolvedActiveZoneLabel}
            storeOpen={storeOpen}
            listingEnabled={listingEnabled}
            canonicalStoreId={activeCanonicalStore?.id}
            sourceRecordId={activeCanonicalStore?.sourceRecordId}
            deliveryReadinessLabel={activeCanonicalStore?.deliveryReadinessLabel}
            coverageSummary={activeCanonicalStore?.coverageSummary}
            publishStage={activeCanonicalStore?.publishStage}
            onOpenStoreScope={onOpenStoreScope}
          />
        </HubSectionShell>
      );
    }

    if (activeSection === 'analytics') {
      return (
        <HubSectionShell title={sectionCopy.analytics.title} description={sectionCopy.analytics.description} icon={sectionCopy.analytics.icon} onBack={() => updateSection('hub')}>
          <PromotionsScreen
            storeName={storeName}
            branchLabel={branchLabel}
            activeZoneLabel={activeZoneLabel}
            todayHoursLabel={todayHoursLabel}
          />
          <PromotionIntentPanel
            storeName={storeName}
            branchLabel={branchLabel}
            activeZoneLabel={activeZoneLabel}
            todayHoursLabel={todayHoursLabel}
          />
        </HubSectionShell>
      );
    }

    if (activeSection === 'wallet') {
      return (
        <WltDshPartnerBridge
          branchLabel={resolvedBranchLabel}
          activeZoneLabel={resolvedActiveZoneLabel}
          serviceModes={serviceModes}
          onBack={() => updateSection('hub')}
          onOpenExpandedWallet={onOpenWalletHub}
          onOpenSettlementReview={onOpenWalletHub}
          onOpenFinancialReport={onOpenWalletHub}
        />
      );
    }

    if (activeSection === 'settings') {
      const notificationSettingRows = [
        {
          id: 'orders' as const,
          title: 'تنبيهات الطلبات',
          subtitle: 'الطلبات الجديدة، التأخير، وحالات الموافقة والإفراج.',
          icon: 'receipt-outline' as const,
          value: notificationPreferences.orders,
        },
        {
          id: 'operations' as const,
          title: 'تنبيهات التشغيل',
          subtitle: 'الفرع، الفريق، ساعات العمل، والتوصيات السريعة للورديات.',
          icon: 'people-outline' as const,
          value: notificationPreferences.operations,
        },
        {
          id: 'inventory' as const,
          title: 'تنبيهات المخزون',
          subtitle: 'النواقص، المنتجات منخفضة الكمية، وتغييرات الجاهزية.',
          icon: 'cube-outline' as const,
          value: notificationPreferences.inventory,
        },
        {
          id: 'finance' as const,
          title: 'التسويات والتنبيهات المالية',
          subtitle: 'المستحقات، التسويات، والتنبيهات ذات الأثر المالي.',
          icon: 'wallet-outline' as const,
          value: notificationPreferences.finance,
        },
        {
          id: 'marketing' as const,
          title: 'التسويق والنمو',
          subtitle: 'العروض والتوصيات الموسمية والفرص المقترحة للنمو.',
          icon: 'megaphone-outline' as const,
          value: notificationPreferences.marketing,
        },
        {
          id: 'system' as const,
          title: 'تنبيهات النظام',
          subtitle: 'الهوية، الإعدادات، وحالة الربط العام للحساب.',
          icon: 'shield-checkmark-outline' as const,
          value: notificationPreferences.system,
        },
        {
          id: 'sound' as const,
          title: 'الصوت والاهتزاز',
          subtitle: 'تفعيل التنبيه السمعي والاهتزازي عند وجود حدث مهم.',
          icon: 'volume-high-outline' as const,
          value: notificationPreferences.sound,
        },
        {
          id: 'dailyDigest' as const,
          title: 'ملخص يومي مختصر',
          subtitle: 'استلام ملخص يومي موحّد بدل فتح أكثر من شاشة منفصلة.',
          icon: 'calendar-outline' as const,
          value: notificationPreferences.dailyDigest,
        },
        {
          id: 'priorityOnly' as const,
          title: 'العاجلة فقط',
          subtitle: 'تقليل التشويش وإبراز الحالات ذات الأولوية العالية فقط.',
          icon: 'flash-outline' as const,
          value: notificationPreferences.priorityOnly,
        },
      ];

      const settingsActionRows = [
        {
          id: 'order-alerts',
          title: 'فتح تنبيهات الطلب',
          subtitle: 'الانتقال إلى نفس مسار تنبيهات الطلب المرتبط مباشرةً بلوحة الطلبات.',
          icon: 'notifications-outline' as const,
          onPress: openOrderAlerts,
        },
        {
          id: 'branch-scope',
          title: 'اختيار الفرع',
          subtitle: 'مراجعة النطاق والفرع المرتبطين بالإشعارات والتشغيل.',
          icon: 'git-branch-outline' as const,
          onPress: onOpenStoreScope,
        },
        {
          id: 'operations-directory',
          title: 'دليل العمليات',
          subtitle: 'الوصول إلى المسارات التشغيلية المرتبطة بالمشكلات والتنفيذ من نفس مساحة الإعدادات.',
          icon: 'headset-outline' as const,
          onPress: openOperationsDirectory,
        },
      ];

      return (
        <HubSectionShell title={sectionCopy.settings.title} description={sectionCopy.settings.description} icon={sectionCopy.settings.icon} onBack={() => updateSection('hub')}>
          <Box gap={4}>
            <Surface tone="raised" padding={3} gap={3}>
              <Text role="label" tone="muted">
                التفضيلات الحالية
              </Text>
              <KeyValueList
                dense
                items={[
                  { label: 'القنوات المفعّلة', value: `${enabledNotificationChannelsCount}/6`, tone: 'brand' },
                  { label: 'مستوى التنبيه', value: notificationPreferences.priorityOnly ? 'العاجلة فقط' : 'كل التنبيهات', tone: notificationPreferences.priorityOnly ? 'warning' : 'success' },
                  { label: 'الصوت والاهتزاز', value: notificationPreferences.sound ? 'مفعّل' : 'موقوف', tone: notificationPreferences.sound ? 'success' : 'warning' },
                  { label: 'الملخص اليومي', value: notificationPreferences.dailyDigest ? 'مفعّل' : 'موقوف', tone: notificationPreferences.dailyDigest ? 'info' : 'default' },
                  { label: 'الظهور في القائمة', value: listingEnabled ? 'مفعل' : 'موقوف', tone: listingEnabled ? 'success' : 'warning' },
                  { label: 'حالة المتجر', value: storeOpen ? 'مفتوح الآن' : 'مغلق الآن', tone: storeOpen ? 'success' : 'warning' },
                  { label: 'ساعات العمل', value: todayHoursLabel },
                ]}
              />
            </Surface>

            <Surface tone="raised" padding={0} gap={0}>
              <Text role="label" tone="muted">
                إعدادات الإشعارات
              </Text>
              <Text role="caption" tone="muted" style={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8 }}>
                كل سطر يضبط نوعًا واحدًا من التنبيهات دون إنشاء شاشة إعدادات ثانية أو نظام محلي منفصل.
              </Text>
              {notificationSettingRows.map((item, index) => (
                <SettingsOptionRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  value={item.value}
                  onValueChange={(nextValue) => updateNotificationPreference(item.id, nextValue)}
                  last={index === notificationSettingRows.length - 1}
                />
              ))}
            </Surface>

            <Surface tone="raised" padding={0} gap={0}>
              <Text role="label" tone="muted" style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                الوصول السريع
              </Text>
              <Text role="caption" tone="muted" style={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8 }}>
                كل الطرق التالية تعود إلى نفس الوجهة الموحدة بدل تكرار مركز إشعارات آخر داخل الحساب.
              </Text>
              {settingsActionRows.map((item, index) => (
                <SettingsOptionRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  onPress={item.onPress}
                  disabled={typeof item.onPress !== 'function'}
                  last={index === settingsActionRows.length - 1}
                />
              ))}
            </Surface>
          </Box>
        </HubSectionShell>
      );
    }

    if (activeSection === 'inventory') {
      return (
        <HubSectionShell title={sectionCopy.inventory.title} description={sectionCopy.inventory.description} icon={sectionCopy.inventory.icon} onBack={() => updateSection('hub')}>
          <InventoryCatalogScreen
            storeName={resolvedStoreName}
            branchLabel={resolvedBranchLabel}
            activeZoneLabel={resolvedActiveZoneLabel}
            todayHoursLabel={resolvedTodayHoursLabel}
            canonicalStoreId={activeCanonicalStore?.id}
          />
        </HubSectionShell>
      );
    }

    if (activeSection === 'operations') {
      return (
        <OperationsPanel
          branchLabel={branchLabel}
          cityLabel={cityLabel}
          storeName={storeName}
          todayHoursLabel={todayHoursLabel}
          storeOpen={storeOpen}
          activeZoneLabel={activeZoneLabel}
          serviceModes={serviceModes}
          onBack={() => updateSection('hub')}
        />
      );
    }

    const copy = sectionCopy[activeSection as Exclude<PartnerHubSection, 'hub'>];

    return (
      <HubSectionShell
        title={copy.title}
        description={copy.description}
        icon={copy.icon}
        onBack={() => updateSection('hub')}
      />
    );
  }

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      <TopBar
        variant="secondary"
        title="مركز حساب الشريك"
        subtitle={`${storeName} · ${branchLabel}`}
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={onOpenOrdersBoard ? {
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onOpenOrdersBoard,
        } : undefined}
      />

      <Surface tone="raised" padding={3} gap={3}>
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {summaryItems.map((item) => (
            <SummaryCell key={item.id} {...item} />
          ))}
        </View>
      </Surface>

      <MobileCommandSectionList
        title="الأقسام الرئيسية"
        subtitle="قائمة عمودية واضحة لكل قسم داخل الحساب."
        items={hubNavigationItems.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.description,
          icon: item.icon,
          onPress: () => {
            if (item.kind === 'orders') {
              onOpenOrdersBoard?.();
              return;
            }

            if (item.section) {
              updateSection(item.section);
            }
          },
        }))}
      />

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">
          إجراءات سريعة
        </Text>

        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <Button
            label="تنبيهات الطلب"
            tone="secondary"
            fullWidth={false}
            icon={<Icon name="notifications-outline" size={16} />}
            onPress={openOrderAlerts}
          />
          <Button
            label="اختيار الفرع"
            tone="secondary"
            fullWidth={false}
            icon={<Icon name="git-branch-outline" size={16} />}
            onPress={onOpenStoreScope}
          />
          <Button
            label="دليل العمليات"
            tone="secondary"
            fullWidth={false}
            icon={<Icon name="headset-outline" size={16} />}
            onPress={openOperationsDirectory}
          />
        </View>
      </Surface>
    </MobileScrollView>
  );
}

export type PartnerHomeScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function PartnerHomeScreen(props: PartnerHomeScreenProps) {
  return <DshPartnerHubSurface {...props} section="hub" />;
}

export type OperationsScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function OperationsScreen(props: OperationsScreenProps) {
  return <DshPartnerHubSurface {...props} section="operations" />;
}

export type PartnerSettingsScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function PartnerSettingsScreen(props: PartnerSettingsScreenProps) {
  return <DshPartnerHubSurface {...props} section="settings" />;
}
