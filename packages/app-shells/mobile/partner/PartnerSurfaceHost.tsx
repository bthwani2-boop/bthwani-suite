import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { BthBox, BthButton, BthMobileScrollView, BthScreenHeader, BthSurface, BthText, BthTopBar } from '@bthwani/ui-kit';
import { dshPartner } from '@bthwani/surfaces/app-partner';
import { MobileAccountSheet, type MobileAccountTypeOption } from '../shared/MobileAccountSheet';

const {
  DshEntryScreen,
  PartnerOrdersInboxScreen,
  PartnerOrderDetailScreen,
  DshPartnerDeliveryOpsBoardScreen,
  DshPartnerBellScreen,
  DshPartnerStoreMaintenanceWorkspaceScreen,
  DshPartnerHoursUpdateScreen,
  DshPartnerZoneSetScreen,
  DshPartnerSupportDirectoryScreen,
  DshPartnerAuctionStatusUpdateScreen,
  DshPartnerAudienceInsightsGetScreen,
  DshPartnerChatReadAckScreen,
  DshPartnerChatSendScreen,
  DshPartnerCommissionByModeGetScreen,
  DshPartnerDocUploadScreen,
  DshPartnerIdentitySubmitScreen,
  DshPartnerIntakeStartScreen,
  DshPartnerInventoryAdjustScreen,
    DshInventoryManagementScreen,
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
} = dshPartner;

type PartnerRoute = 'home' | 'entry' | 'inbox' | 'detail' | 'bell' | 'operations' | 'maintenance' | 'hours' | 'zones' | 'support-directory' | 'support-screen' | 'inventory-management';
type PartnerSupportRoute =
  | 'auction-status-update'
  | 'audience-insights'
  | 'chat-read-ack'
  | 'chat-send'
  | 'commission-by-mode'
  | 'doc-upload'
  | 'identity-submit'
  | 'intake-start'
  | 'inventory-adjust'
  | 'inventory-update'
  | 'items-upsert'
  | 'listing-status-update'
  | 'manager-invite'
  | 'order-accept'
  | 'order-get'
  | 'order-handoff'
  | 'order-issue-queue'
  | 'order-out-for-delivery'
  | 'order-prepare'
  | 'order-ready'
  | 'order-reject'
  | 'order-store-delivered'
  | 'profile-get'
  | 'quick-reply-config'
  | 'quick-reply-settings'
  | 'quick-reply-setup'
  | 'staff-analytics'
  | 'store-nomination'
  | 'store-service-modes-update'
  | 'store-status-update'
  | 'store-update'
  | 'subscription'
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

const partnerTypeOptions: readonly MobileAccountTypeOption[] = [
  { id: 'dsh', label: 'DSH', description: 'تشغيل الطلبات والتسليم' },
  { id: 'arb', label: 'ARB', description: 'تشغيل عرب الشركاء والمسارات' },
];

export function PartnerSurfaceHost() {
  const [activeServiceType, setActiveServiceType] = React.useState<PartnerServiceType>('dsh');
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);
  const [route, setRoute] = React.useState<PartnerRoute>('entry');
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
  const routeHistoryRef = React.useRef<PartnerRoute[]>(['entry']);
  const routeTransitionFromBackRef = React.useRef(false);

  const activePrimaryAreas =
    activeServiceType === 'dsh'
      ? primaryAreas
      : (['قائمة عرب', 'جدولة المسارات', 'تتبع التوزيع'] as const);

  const activeShortcuts =
    activeServiceType === 'dsh'
      ? shortcuts
      : (['فتح عرب اليوم', 'تحديث مسار', 'مراجعة التسليمات'] as const);

  const activeOrderSummary = React.useMemo(() => {
    if (activeOrderId === 'partner-order-1048') {
      return {
        orderId: 'partner-order-1048',
        merchantName: 'Green Bowl',
        customerName: 'Nora A.',
        serviceWindowLabel: '18 min to SLA',
        nextActionLabel: 'confirm packaging',
        readinessNote: 'Packaging check is pending before the order moves to handoff.',
      };
    }

    if (activeOrderId === 'partner-order-1051') {
      return {
        orderId: 'partner-order-1051',
        merchantName: 'Bean House',
        customerName: 'Sara M.',
        serviceWindowLabel: '24 min to SLA',
        nextActionLabel: 'open order workspace',
        readinessNote: 'Dispatch slot is booked and customer wait time is increasing.',
      };
    }

    return {
      orderId: 'partner-order-1042',
      merchantName: 'Burger Lab',
      customerName: 'Omar A.',
      serviceWindowLabel: '12 min to SLA',
      nextActionLabel: 'confirm ready and release to captain',
      readinessNote: 'Packaging is complete and handoff lane is available.',
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
      branchLabel: 'Yasmin branch',
      cityLabel: 'Riyadh',
      managerLabel: 'Khaled A.',
      todayHoursLabel,
      activeZoneLabel: selectedZone.title,
    }),
    [activeOrderSummary.merchantName, selectedZone.title, todayHoursLabel],
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
      if (accountSheetVisible) {
        setAccountSheetVisible(false);
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
  }, [accountSheetVisible]);

  const openOrdersBoard = () => {
    setRoute('inbox');
  };

  const openOrderWorkspace = () => {
    setActiveOrderId('partner-order-1042');
    setRoute('detail');
  };

  const openStoreMaintenance = () => {
    setRoute('maintenance');
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

  const topBar = (
    <BthTopBar
      variant="brand"
      title="بثواني"
      subtitle={activeServiceType === 'dsh' ? 'لوحة الشريك - DSH' : 'لوحة الشريك - ARB'}
      locationLabel="الرياض، فرع الياسمين"
      actions={[
        {
          id: 'profile',
          icon: <Ionicons name="person-outline" size={21} color="#FFFFFF" />,
          accessibilityLabel: 'الحساب',
          onPress: () => setAccountSheetVisible(true),
        },
        {
          id: 'notifications',
          icon: <Ionicons name="notifications-outline" size={21} color="#FFFFFF" />,
          badgeCount: 3,
          accessibilityLabel: 'الإشعارات',
          onPress: () => {
            if (activeServiceType === 'dsh') {
              setRoute('bell');
            }
          },
        },
        { id: 'orders', icon: <Ionicons name="receipt-outline" size={21} color="#FFFFFF" />, accessibilityLabel: 'الطلبات', onPress: openOrdersBoard },
        { id: 'search', icon: <Ionicons name="search-outline" size={21} color="#FFFFFF" />, accessibilityLabel: 'الدعم', onPress: openSupportDirectory },
      ]}
      ticker={{
        statusLabel: activeServiceType === 'dsh' ? 'نشط' : 'ARB نشط',
        message:
          activeServiceType === 'dsh'
            ? 'المساحة مخصصة للتحديثات العاجلة الخاصة بعمليات الشريك'
            : 'وضع ARB مفعل. الواجهة تعمل الآن ضمن سياق ARB الكامل.',
      }}
    />
  );

  const accountSheet = (
    <MobileAccountSheet
      visible={accountSheetVisible}
      onClose={() => setAccountSheetVisible(false)}
      onOpenProfile={() => {}}
      typeOptions={partnerTypeOptions}
      activeTypeId={activeServiceType}
      onSelectType={(typeId) => {
        setActiveServiceType(typeId === 'arb' ? 'arb' : 'dsh');
      }}
      typeSwitchTitle="تغيير نوع تشغيل الشريك"
      typeSwitchPrompt="بدّل بين DSH و ARB. عند التبديل يتم تحديث محتوى التطبيق بالكامل حسب النوع المختار."
    />
  );

  if (activeServiceType === 'arb') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface
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
          <BthMobileScrollView fill padding={5} gap={5}>
            <BthScreenHeader
              title="عمليات الشريك - ARB"
              subtitle="التطبيق الآن في سياق ARB بالكامل."
              actionLabel="تحديث المسارات"
              onActionPress={() => {}}
            />

            <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
              <BthText role="label" tone="inverse">وضع التشغيل الحالي</BthText>
              <BthText role="titleLg" tone="inverse">تم تفعيل نوع ARB</BthText>
              <BthText role="bodyMd" tone="inverse">كل محتوى التطبيق الآن موجّه إلى مسارات ARB، مع منع خلط مسارات DSH داخل نفس السياق.</BthText>
            </BthSurface>

            <BthSurface tone="raised" padding={5} gap={4} radiusToken="xl">
              <BthText role="label">المساحات الأساسية - ARB</BthText>
              <BthSurface tone="default" padding={4} gap={2} radiusToken="lg">
                <BthText role="bodyStrong">إدارة المسارات</BthText>
                <BthText role="bodySm" tone="muted">تجهيز المسار، ترتيب نقاط الخدمة، ومتابعة الإنجاز.</BthText>
              </BthSurface>
              <BthSurface tone="default" padding={4} gap={2} radiusToken="lg">
                <BthText role="bodyStrong">مهام الميدان</BthText>
                <BthText role="bodySm" tone="muted">عرض المهام المرتبطة بنوع ARB فقط.</BthText>
              </BthSurface>
            </BthSurface>

            <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
              <BthText role="label">حالة الربط</BthText>
              <BthText role="bodySm" tone="muted">واجهات ARB الميدانية قيد التوسعة، لكن التبديل مطبق ويبدّل سياق التطبيق بالكامل بالفعل.</BthText>
            </BthSurface>
          </BthMobileScrollView>
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'entry') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshEntryScreen
            state={partnerEntryState}
            onOpenOrdersBoardPress={() => setRoute('inbox')}
            onOpenOrderWorkspacePress={() => {
              setActiveOrderId('partner-order-1042');
              setRoute('detail');
            }}
            onOpenMaintenancePress={openStoreMaintenance}
            onOpenIssueQueuePress={() => setRoute('operations')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'bell') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshPartnerBellScreen
            onOpenInbox={() => setRoute('inbox')}
            onOpenNextOrder={() => setRoute('detail')}
            onBack={() => setRoute('inbox')}
            onRetry={() => setRoute('bell')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'inbox') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <PartnerOrdersInboxScreen
            onOpenOrder={(orderId) => {
              setActiveOrderId(orderId);
              setRoute('detail');
            }}
            onOpenNextOrder={(orderId) => {
              setActiveOrderId(orderId);
              setRoute('detail');
            }}
            onRetry={() => setRoute('inbox')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'detail') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <PartnerOrderDetailScreen
            summary={activeOrderSummary}
            onConfirmReady={() => setRoute('inbox')}
            onOpenNextOrder={() => setRoute('inbox')}
            onBackToInbox={() => setRoute('inbox')}
            onRetry={() => setRoute('detail')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'operations') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshPartnerDeliveryOpsBoardScreen
            summary={deliveryOpsSummary}
            orders={deliveryOpsOrders}
            onOpenOrder={(orderId) => {
              setActiveOrderId(orderId);
              setRoute('detail');
            }}
            onOpenIssueQueue={() => setRoute('inbox')}
            onRetry={() => setRoute('operations')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'maintenance') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshPartnerStoreMaintenanceWorkspaceScreen
            profile={maintenanceProfile}
            serviceModes={serviceModes}
            listingEnabled={listingEnabled}
            storeOpen={storeOpen}
            onToggleListingEnabled={setListingEnabled}
            onToggleStoreOpen={setStoreOpen}
            onToggleServiceMode={toggleServiceMode}
            onOpenHours={() => setRoute('hours')}
            onOpenZones={() => setRoute('zones')}
            onOpenDeliveryBoard={() => setRoute('operations')}
            onOpenSupportDirectory={openSupportDirectory}
            onSave={() => setRoute('entry')}
            onRetry={() => setRoute('maintenance')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'hours') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshPartnerHoursUpdateScreen
            days={storeHours}
            onToggleDay={toggleStoreHoursDay}
            onChangeDayTime={changeStoreHoursDayTime}
            onSave={() => setRoute('maintenance')}
            onBack={() => setRoute('maintenance')}
            onRetry={() => setRoute('hours')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'zones') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshPartnerZoneSetScreen
            zones={zoneOptions}
            onSelectZone={setSelectedZoneId}
            onSave={() => setRoute('maintenance')}
            onBack={() => setRoute('maintenance')}
            onRetry={() => setRoute('zones')}
          />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'inventory-management') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshInventoryManagementScreen />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'support-directory') {
    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <DshPartnerSupportDirectoryScreen onOpenScreen={(screenId) => openSupportScreen(screenId as PartnerSupportRoute)} />
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  if (route === 'support-screen') {
    const supportScreens: Record<PartnerSupportRoute, React.ReactNode> = {
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

    return (
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          {supportScreens[selectedSupportScreen]}
        </BthSurface>
        {accountSheet}
      </BthBox>
    );
  }

  return (
    <BthBox style={{ flex: 1 }} background="background">
      {topBar}
      <BthSurface
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
        <BthMobileScrollView fill padding={5} gap={5}>
          <BthScreenHeader
            title={activeServiceType === 'dsh' ? 'لوحة الشريك' : 'لوحة الشريك - ARB'}
            subtitle={
              activeServiceType === 'dsh'
                ? 'هذه هي نقطة البداية الحقيقية لتطبيق الشريك.'
                : 'هذه هي نقطة البداية الحقيقية لتشغيل الشريك على نوع ARB.'
            }
            actionLabel={activeServiceType === 'dsh' ? 'ابدأ من entry' : 'إدارة عرب'}
            onActionPress={activeServiceType === 'dsh' ? openOrdersBoard : undefined}
          />

          <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
            <BthText role="label" tone="inverse">نقطة البداية الرسمية</BthText>
            <BthText role="titleLg" tone="inverse">
              {activeServiceType === 'dsh' ? 'تشغيل الشريك من shell رسمية' : 'تشغيل ARB من shell رسمية'}
            </BthText>
            <BthText role="bodyMd" tone="inverse">
              {activeServiceType === 'dsh'
                ? 'البداية الصحيحة لتطبيق الشريك هي home shell تُظهر المهام الأساسية، لا شاشة preview مرتبطة بخدمة واحدة.'
                : 'البداية الصحيحة لوضع ARB هي shell تشغيلية تعرض المسارات والمهام ذات العلاقة بهذا النوع فقط.'}
            </BthText>
          </BthSurface>

          <BthSurface tone="raised" padding={5} gap={4} radiusToken="xl">
            <BthText role="label">المساحات الأساسية</BthText>
            {activePrimaryAreas.map((item) => (
              <BthSurface key={item} tone="default" padding={4} gap={2} radiusToken="lg">
                <BthText role="bodyStrong">{item}</BthText>
                <BthText role="bodySm" tone="muted">هذه مساحة رئيسية داخل التطبيق الحقيقي وليست preview route.</BthText>
              </BthSurface>
            ))}
          </BthSurface>

          <BthSurface tone="default" padding={5} gap={4} radiusToken="xl">
            <BthText role="label">اختصارات البداية</BthText>
            <BthBox gap={3}>
              {activeShortcuts.map((item, index) => (
                <BthButton
                  key={item}
                  label={item}
                  tone="secondary"
                  onPress={() => {
                    if (activeServiceType !== 'dsh') {
                      return;
                    }

                    if (index === 0) {
                      setRoute('entry');
                      return;
                    }

                    if (index === 1) {
                      openInventoryManagement();
                      return;
                    }
                    setActiveOrderId('partner-order-1051');
                    setRoute('inbox');
                  }}
                />
              ))}
            </BthBox>
          </BthSurface>

          <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
            <BthText role="label">حكم معماري</BthText>
            <BthText role="bodySm" tone="muted">
              {activeServiceType === 'dsh'
                ? 'DSH يظل ضمن feature flows الداخلية، وليس الشاشة الافتراضية عند فتح التطبيق.'
                : 'عند اختيار ARB يجب أن تظهر فقط عناصر ARB بدون خلط مع مسارات DSH.'}
            </BthText>
          </BthSurface>

          <BthButton label={activeServiceType === 'dsh' ? 'ابدأ من entry' : 'إدارة عرب'} onPress={activeServiceType === 'dsh' ? openOrdersBoard : undefined} />
        </BthMobileScrollView>
      </BthSurface>
      {accountSheet}
    </BthBox>
  );
}

export default PartnerSurfaceHost;