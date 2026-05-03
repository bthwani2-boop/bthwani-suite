import React from 'react';
// NOTE (example-only): This file may include decorative identifiers and example literals.
// Do NOT store runtime secrets or production tokens in repository files.
// Use secure vaults or CI-managed secrets for runtime values. Placeholder proposals live under kdt/merge-run/.../proposed/remediations/
import { BackHandler, Platform } from 'react-native';
import { Box, Button, Icon, MobileScrollView, ScreenHeader, Surface, Text, TopBar, useTheme } from '@bthwani/ui-kit';
import { dshPartner, MobileAccountSheet, PartnerWalletHubSheet, type PartnerWalletHubDestination, PartnerStoreScopeSheet, type PartnerStoreScopeOption } from '../composition';

const {
  DshEntryScreen,
  PartnerOrdersInboxScreen,
  PartnerOrderDetailScreen,
  DshPartnerBellScreen,
  DshPartnerSupportDirectoryScreen,
  DshPartnerAuctionStatusUpdateScreen,
  DshPartnerChatReadAckScreen,
  DshPartnerChatSendScreen,
  DshPartnerDocUploadScreen,
  DshPartnerIntakeStartScreen,
  DshPartnerInventoryAdjustScreen,
    DshInventoryManagementScreen,
    DshPartnerInventoryUpdateScreen,
  DshPartnerItemsUpsertScreen,
  DshPartnerOrderAcceptScreen,
  DshPartnerOrderGetScreen,
  DshPartnerOrderHandoffScreen,
  DshPartnerOrderIssueQueueScreen,
  DshPartnerOrderOutForDeliveryScreen,
  DshPartnerOrderPrepareScreen,
  DshPartnerOrderReadyScreen,
  DshPartnerOrderRejectScreen,
  DshPartnerOrderStoreDeliveredScreen,
  DshPartnerQuickReplyConfigGetScreen,
  DshPartnerQuickReplySettingsScreen,
  DshPartnerQuickReplySetupScreen,
  DshPartnerStoreNominationScreen,
  DshPartnerVideoUploadScreen,
  PartnerDshConsoleScreen,
} = dshPartner;

type PartnerRoute = 'home' | 'entry' | 'inbox' | 'detail' | 'bell' | 'support-directory' | 'support-screen' | 'inventory-management';
type PartnerSupportRoute =
  | 'auction-status-update'
  | 'chat-read-ack'
  | 'chat-send'
  | 'doc-upload'
  | 'intake-start'
  | 'inventory-adjust'
  | 'inventory-update'
  | 'items-upsert'
  | 'order-accept'
  | 'order-get'
  | 'order-handoff'
  | 'order-issue-queue'
  | 'order-out-for-delivery'
  | 'order-prepare'
  | 'order-ready'
  | 'order-reject'
  | 'order-store-delivered'
  | 'quick-reply-config'
  | 'quick-reply-settings'
  | 'quick-reply-setup'
  | 'store-nomination'
  | 'video-upload';

const primaryAreas = [
  'الطلبات',
  'المنتجات',
  'ساعات العمل'
] as const;

const shortcuts = [
  'الطلبات الجديدة',
  'إدارة المنتجات',
  'تحديث التوفر'
] as const;

const defaultStoreHours: readonly PartnerStoreHoursDay[] = [
  { id: 'sun', label: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'mon', label: 'Monday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'tue', label: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'wed', label: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'thu', label: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'fri', label: 'Friday', isOpen: false, openTime: '14:00', closeTime: '23:30' },
  { id: 'sat', label: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '23:30' },
] as const;

const defaultZones = [
  {
    id: 'yasmin',
    title: 'Yasmin',
    subtitle: 'Primary branch catchment around the current branch.',
    deliveryFeeLabel: '12 SAR',
    etaLabel: '20-28 min',
  },
  {
    id: 'malqa',
    title: 'Al Malqa',
    subtitle: 'High-value nearby district with stable captain availability.',
    deliveryFeeLabel: '15 SAR',
    etaLabel: '24-32 min',
  },
  {
    id: 'nakheel',
    title: 'Al Nakheel',
    subtitle: 'Extended zone with occasional delay risk during peak windows.',
    deliveryFeeLabel: '18 SAR',
    etaLabel: '28-38 min',
    disabled: true,
  },
] as const;

type PartnerServiceType = 'dsh' | 'arb';

type PartnerStoreHoursDay = {
  id: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

const partnerTypeOptions: readonly { id: PartnerServiceType; label: string; description: string }[] = [
  { id: 'dsh', label: 'DSH', description: 'تشغيل الطلبات والتسليم' },
  { id: 'arb', label: 'ARB', description: 'تشغيل عرب الشركاء والمسارات' },
];

type PartnerHubSection = 'hub' | 'profile' | 'operations' | 'inventory' | 'wallet' | 'analytics' | 'settings' | 'type-switch';

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
];

export function PartnerSurfaceHost() {
  const { theme } = useTheme();
  const [activeServiceType, setActiveServiceType] = React.useState<PartnerServiceType>('dsh');
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);
  const [walletHubVisible, setWalletHubVisible] = React.useState(false);
  const [storeScopeVisible, setStoreScopeVisible] = React.useState(false);
  const [accountHubSection, setAccountHubSection] = React.useState<PartnerHubSection>('hub');
  const [ordersSearchMode, setOrdersSearchMode] = React.useState(false);
  const [selectedStoreScopeId, setSelectedStoreScopeId] = React.useState('all');
  const [route, setRoute] = React.useState<PartnerRoute>(activeServiceType === 'dsh' ? 'inbox' : 'entry');
  const [activeOrderId, setActiveOrderId] = React.useState('partner-order-1042');
  const [listingEnabled, setListingEnabled] = React.useState(true);
  const [storeOpen, setStoreOpen] = React.useState(true);
  const [serviceModes, setServiceModes] = React.useState([
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
  ]);
  const [storeHours, setStoreHours] = React.useState<PartnerStoreHoursDay[]>(defaultStoreHours.map((day) => ({ ...day })));
  const [selectedZoneId, setSelectedZoneId] = React.useState('yasmin');
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<PartnerSupportRoute>('order-issue-queue');
  const routeHistoryRef = React.useRef<PartnerRoute[]>([activeServiceType === 'dsh' ? 'inbox' : 'entry']);
  const routeTransitionFromBackRef = React.useRef(false);

  React.useEffect(() => {
    if (route !== 'inbox' && ordersSearchMode) {
      setOrdersSearchMode(false);
    }
  }, [ordersSearchMode, route]);

  const activePrimaryAreas =
    activeServiceType === 'dsh'
      ? primaryAreas
      : (['قائمة عرب', 'جدولة المسارات', 'تتبع التوزيع'] as const);

  const activeShortcuts =
    activeServiceType === 'dsh'
      ? shortcuts
      : (['فتح عرب اليوم', 'تحديث مسار', 'مراجعة التسليمات'] as const);

  const selectedStoreScope = React.useMemo(
    () => storeScopeOptions.find((option) => option.id === selectedStoreScopeId) ?? storeScopeOptions[0],
    [selectedStoreScopeId],
  );

  const activeOrderSummary = React.useMemo(() => {
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

  const selectedZone = React.useMemo(
    () => defaultZones.find((zone) => zone.id === selectedZoneId) ?? defaultZones[0],
    [selectedZoneId],
  );

  const todayHoursLabel = React.useMemo(() => {
    const today = storeHours[0];

    if (!today.isOpen) {
      return 'Closed today';
    }

    return `${today.openTime} - ${today.closeTime}`;
  }, [storeHours]);

  const maintenanceProfile = React.useMemo(
    () => ({
      storeName: activeOrderSummary.merchantName,
      branchLabel: selectedStoreScope.label,
      cityLabel: 'الرياض',
      managerLabel: 'خالد',
      todayHoursLabel,
      activeZoneLabel: selectedZone.title,
    }),
    [activeOrderSummary.merchantName, selectedStoreScope.label, selectedZone.title, todayHoursLabel],
  );

  const zoneOptions = React.useMemo(
    () =>
      defaultZones.map((zone) => ({
        ...zone,
        selected: zone.id === selectedZoneId,
      })),
    [selectedZoneId],
  );

  const deliveryOpsSummary = React.useMemo(
    () => ({
      outForDelivery: 8,
      handoffReady: serviceModes.find((mode) => mode.id === 'delivery')?.enabled ? 5 : 1,
      deliveredToday: 24,
      delayedRisk: storeOpen ? 2 : 5,
    }),
    [serviceModes, storeOpen],
  );

  const deliveryOpsOrders = React.useMemo(
    () => [
      {
        id: 'partner-order-1042',
        title: 'Order #1042 - Burger Lab',
        subtitle: 'Captain is approaching the branch and packaging is complete.',
        statusLabel: 'Handoff ready',
        etaLabel: 'Captain arrives in 4 min',
        nextActionLabel: 'handoff to captain',
      },
      {
        id: 'partner-order-1048',
        title: 'Order #1048 - Green Bowl',
        subtitle: 'The order is out for delivery and customer wait time is increasing.',
        statusLabel: 'Out for delivery',
        etaLabel: '12 min to customer',
        nextActionLabel: 'watch delay risk',
      },
      {
        id: 'partner-order-1051',
        title: 'Order #1051 - Bean House',
        subtitle: 'A customer issue needs staff review before the delivery closes.',
        statusLabel: 'Issue flagged',
        etaLabel: 'Needs review now',
        nextActionLabel: 'open issue queue',
      },
    ],
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

      if (accountSheetVisible) {
        setAccountSheetVisible(false);
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
  }, [accountHubSection, accountSheetVisible, ordersSearchMode, route, storeScopeVisible, walletHubVisible]);

  const openOrdersBoard = () => {
    setOrdersSearchMode(false);
    setRoute('inbox');
  };

  const openOrdersSearch = () => {
    setOrdersSearchMode(true);
    setRoute('inbox');
  };

  const openAccountHub = (section: PartnerHubSection) => {
    setAccountHubSection(section);
    setRoute('home');
  };

  const openOrderWorkspace = () => {
    setActiveOrderId('partner-order-1042');
    setRoute('detail');
  };

  const openSupportDirectory = () => {
    setRoute('support-directory');
  };
  const openInventoryManagement = () => {
    setRoute('inventory-management');
  };

  const openSupportScreen = (screenId: PartnerSupportRoute) => {
    setSelectedSupportScreen(screenId);
    setRoute('support-screen');
  };

  const toggleServiceMode = (modeId: string, nextValue: boolean) => {
    setServiceModes((current) =>
      current.map((mode) => (mode.id === modeId ? { ...mode, enabled: nextValue } : mode)),
    );
  };

  const toggleStoreHoursDay = (dayId: string, nextValue: boolean) => {
    setStoreHours((current) =>
      current.map((day) => (day.id === dayId ? { ...day, isOpen: nextValue } : day)),
    );
  };

  const changeStoreHoursDayTime = (dayId: string, field: 'openTime' | 'closeTime', value: string) => {
    setStoreHours((current) =>
      current.map((day) => (day.id === dayId ? { ...day, [field]: value } : day)),
    );
  };

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
  }, []);

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
          onPress: activeServiceType === 'dsh' ? () => openAccountHub('hub') : () => setAccountSheetVisible(true),
        },
        {
          id: 'notifications',
          icon: <Icon name="notifications-outline" size={21} color={theme.brandContrast} />,
          badgeCount: 3,
          accessibilityLabel: 'الإشعارات',
          onPress: () => {
            if (activeServiceType === 'dsh') {
              setRoute('bell');
            }
          },
        },
        {
          id: 'wallet',
          icon: <Icon name="wallet-outline" size={21} color={theme.brandContrast} />,
          accessibilityLabel: 'المحفظة والحسابات المالية',
          onPress: activeServiceType === 'dsh' ? () => openAccountHub('wallet') : openWalletHub,
        },
        { id: 'search', icon: <Icon name="search-outline" size={21} color={theme.brandContrast} />, accessibilityLabel: 'البحث', onPress: activeServiceType === 'dsh' ? openOrdersSearch : openOrdersBoard },
      ]}
    />
  );

  const accountSheet = (
    <MobileAccountSheet
      visible={accountSheetVisible}
      onClose={() => setAccountSheetVisible(false)}
      onOpenProfile={() => openAccountHub('hub')}
      onOpenWalletHub={openWalletHub}
      onOpenOrders={openOrdersBoard}
      onOpenOperations={() => openAccountHub('operations')}
      onOpenInventory={openInventoryManagement}
      onOpenTeam={() => openAccountHub('operations')}
      onOpenAnalytics={() => openAccountHub('analytics')}
      typeOptions={partnerTypeOptions}
      activeTypeId={activeServiceType}
      onSelectType={(typeId) => {
        setActiveServiceType(typeId === 'arb' ? 'arb' : 'dsh');
      }}
      typeSwitchTitle="تغيير نوع تشغيل الشريك"
      typeSwitchPrompt="بدّل بين DSH و ARB. عند التبديل يتم تحديث محتوى التطبيق بالكامل حسب النوع المختار."
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
      {accountSheet}
      {walletHubSheet}
      {storeScopeSheet}
    </Box>
  );

  const renderWorkspaceShell = (content: React.ReactNode) => (
    <Box style={{ flex: 1 }} background="background">
      <Surface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, overflow: 'hidden' }}>
        {content}
      </Surface>
      {accountSheet}
      {walletHubSheet}
      {storeScopeSheet}
    </Box>
  );

  if (activeServiceType === 'arb') {
    return (
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
          <MobileScrollView fill padding={5} gap={5}>
            <ScreenHeader
              title="عمليات الشريك - ARB"
              subtitle="التطبيق الآن في سياق ARB بالكامل."
              actionLabel="تحديث المسارات"
              onActionPress={() => {}}
            />

            <Surface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
              <Text role="label" tone="inverse">وضع التشغيل الحالي</Text>
              <Text role="titleLg" tone="inverse">تم تفعيل نوع ARB</Text>
              <Text role="bodyMd" tone="inverse">كل محتوى التطبيق الآن موجّه إلى مسارات ARB، مع منع خلط مسارات DSH داخل نفس السياق.</Text>
            </Surface>

            <Surface tone="raised" padding={5} gap={4} radiusToken="xl">
              <Text role="label">المساحات الأساسية - ARB</Text>
              <Surface tone="default" padding={4} gap={2} radiusToken="lg">
                <Text role="bodyStrong">إدارة المسارات</Text>
                <Text role="bodySm" tone="muted">تجهيز المسار، ترتيب نقاط الخدمة، ومتابعة الإنجاز.</Text>
              </Surface>
              <Surface tone="default" padding={4} gap={2} radiusToken="lg">
                <Text role="bodyStrong">مهام الميدان</Text>
                <Text role="bodySm" tone="muted">عرض المهام المرتبطة بنوع ARB فقط.</Text>
              </Surface>
            </Surface>

            <Surface tone="inset" padding={4} gap={2} radiusToken="lg">
              <Text role="label">حالة الربط</Text>
              <Text role="bodySm" tone="muted">واجهات ARB الميدانية قيد التوسعة، لكن التبديل مطبق ويبدّل سياق التطبيق بالكامل بالفعل.</Text>
            </Surface>
          </MobileScrollView>
        </Surface>
        {accountSheet}
        {walletHubSheet}
        {storeScopeSheet}
      </Box>
    );
  }

    if (route === 'home') {
      const partnerConsoleScreen = (
        <PartnerDshConsoleScreen
          activeServiceType={activeServiceType}
          section={accountHubSection}
          onSectionChange={setAccountHubSection}
          storeName={maintenanceProfile.storeName}
          branchLabel={selectedStoreScope.label}
          cityLabel={maintenanceProfile.cityLabel}
          managerLabel={maintenanceProfile.managerLabel}
          todayHoursLabel={maintenanceProfile.todayHoursLabel}
          activeZoneLabel={maintenanceProfile.activeZoneLabel}
          storeOpen={storeOpen}
          listingEnabled={listingEnabled}
          serviceModes={serviceModes}
          activeOrdersCount={deliveryOpsSummary.outForDelivery + deliveryOpsSummary.handoffReady}
          urgentOrdersCount={deliveryOpsSummary.delayedRisk}
          pendingActionsCount={deliveryOpsSummary.handoffReady}
          typeOptions={partnerTypeOptions}
          onSelectType={(typeId) => {
            setActiveServiceType(typeId === 'arb' ? 'arb' : 'dsh');
            setRoute(typeId === 'arb' ? 'entry' : 'inbox');
          }}
          onOpenOrdersBoard={openOrdersBoard}
          onOpenInventoryManagement={openInventoryManagement}
          onOpenStoreScope={openStoreScope}
          onOpenSupportDirectory={openSupportDirectory}
          onOpenWalletHub={openWalletHub}
          onOpenBell={() => setRoute('bell')}
        />
      );

      return renderWorkspaceShell(partnerConsoleScreen);
    }

  if (route === 'entry') {
    return renderWorkspaceShell(
      <DshEntryScreen
        state={partnerEntryState}
        onOpenOrdersBoardPress={() => setRoute('inbox')}
        onOpenOrderWorkspacePress={() => {
          setActiveOrderId('partner-order-1042');
          setRoute('detail');
        }}
        onOpenMaintenancePress={() => openAccountHub('profile')}
        onOpenIssueQueuePress={() => openAccountHub('operations')}
      />,
    );
  }

  if (route === 'bell') {
    return renderWorkspaceShell(
      <DshPartnerBellScreen
        onOpenInbox={() => setRoute('inbox')}
        onOpenNextOrder={() => setRoute('detail')}
        onBack={() => setRoute('inbox')}
        onRetry={() => setRoute('bell')}
      />,
    );
  }

  if (route === 'inbox') {
    return renderMainShell(
      <PartnerOrdersInboxScreen
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
    return renderWorkspaceShell(
      <PartnerOrderDetailScreen
        summary={activeOrderSummary}
        onConfirmReady={() => setRoute('inbox')}
        onOpenNextOrder={() => setRoute('inbox')}
        onBackToInbox={() => setRoute('inbox')}
        onRetry={() => setRoute('detail')}
      />,
    );
  }

  if (route === 'inventory-management') {
    return renderWorkspaceShell(<DshInventoryManagementScreen onBack={() => openAccountHub('hub')} />);
  }

  if (route === 'support-directory') {
    return renderWorkspaceShell(
      <DshPartnerSupportDirectoryScreen
        onBack={() => openAccountHub('hub')}
        onOpenScreen={(screenId) => openSupportScreen(screenId as PartnerSupportRoute)}
      />,
    );
  }

  if (route === 'support-screen') {
    const supportScreens: Record<PartnerSupportRoute, React.ReactNode> = {
      'auction-status-update': <DshPartnerAuctionStatusUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'chat-read-ack': <DshPartnerChatReadAckScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('quick-reply-config')} />,
      'chat-send': <DshPartnerChatSendScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('quick-reply-setup')} />,
      'doc-upload': <DshPartnerDocUploadScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'intake-start': <DshPartnerIntakeStartScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'inventory-adjust': <DshPartnerInventoryAdjustScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('inventory-update')} />,
      'inventory-update': <DshPartnerInventoryUpdateScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'items-upsert': <DshPartnerItemsUpsertScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-accept': <DshPartnerOrderAcceptScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('order-get')} />,
      'order-get': <DshPartnerOrderGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-handoff': <DshPartnerOrderHandoffScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-issue-queue': <DshPartnerOrderIssueQueueScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-out-for-delivery': <DshPartnerOrderOutForDeliveryScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-prepare': <DshPartnerOrderPrepareScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-ready': <DshPartnerOrderReadyScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-reject': <DshPartnerOrderRejectScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-store-delivered': <DshPartnerOrderStoreDeliveredScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'quick-reply-config': <DshPartnerQuickReplyConfigGetScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('quick-reply-settings')} />,
      'quick-reply-settings': <DshPartnerQuickReplySettingsScreen onBack={openSupportDirectory} onSecondaryAction={() => openSupportScreen('quick-reply-setup')} />,
      'quick-reply-setup': <DshPartnerQuickReplySetupScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'store-nomination': <DshPartnerStoreNominationScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'video-upload': <DshPartnerVideoUploadScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
    };

    return renderWorkspaceShell(supportScreens[selectedSupportScreen]);
  }

  return renderMainShell(
    <PartnerDshConsoleScreen
      activeServiceType={activeServiceType}
      onOpenOrdersBoard={openOrdersBoard}
      onOpenInventoryManagement={openInventoryManagement}
      onOpenStoreScope={openStoreScope}
      onOpenWalletHub={openWalletHub}
      onOpenSupportDirectory={openSupportDirectory}
    />,
  );
}

export default PartnerSurfaceHost;


