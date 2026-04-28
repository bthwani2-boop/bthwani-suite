import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Badge, Box, Button, Icon, KeyValueList, MobileScrollView, MobileWorkspaceHeader, SheetFrame, StateView, Surface, Text, TopBar, Switch, useTheme } from '@bthwani/ui-kit';
import { dshCaptain } from '@bthwani/surfaces/app-captain';
import { MobileAccountSheet, type MobileAccountTypeOption } from '../shared/MobileAccountSheet';

const {
  DshEntryScreen,
  CaptainDeliveryConfirmSheet,
  CaptainPickupConfirmSheet,
  CaptainOrderDetailScreen,
  DshCaptainOrderChatScreen,
  DshCaptainBellScreen,
  CaptainOrdersInboxScreen,
  DshCaptainSupportDirectoryScreen,
  DshCaptainChatReadAckScreen,
  DshCaptainChatSendScreen,
  DshCaptainCodBalanceScreen,
  DshCaptainJobRejectScreen,
  DshCaptainOrderAcceptScreen,
  DshCaptainOrderDeliverScreen,
  DshCaptainOrderDetailsScreen,
  DshCaptainOrderGetScreen,
  DshCaptainOrderPickupScreen,
  DshCaptainOrdersListScreen,
  DshCaptainOrdersOffersListScreen,
  DshCaptainProfileGetScreen,
  DshCaptainProofUploadScreen,
  DshCaptainTierEvaluateScreen,
  DshCaptainTierInfoScreen,
} = dshCaptain;

type CaptainOrderDetailSummary = React.ComponentProps<typeof CaptainOrderDetailScreen>['summary'];
type CaptainOrdersInboxScreenState = React.ComponentProps<typeof CaptainOrdersInboxScreen>['state'];
type CaptainSupportRoute =
  | 'chat-read-ack'
  | 'chat-send'
  | 'cod-balance'
  | 'job-reject'
  | 'order-accept'
  | 'order-deliver'
  | 'order-details'
  | 'order-get'
  | 'order-pickup'
  | 'orders-list'
  | 'orders-offers-list'
  | 'profile-get'
  | 'proof-upload'
  | 'tier-evaluate'
  | 'tier-info';

type CaptainRoute = 'home' | 'entry' | 'inbox' | 'detail' | 'orderchat' | 'bell' | 'support-directory' | 'support-screen';
type CaptainServiceType = 'dsh' | 'amn';
type CaptainAvailabilityStatus = 'available' | 'unavailable' | 'break' | 'planned-leave';
type CaptainGpsStatus = 'ready' | 'limited' | 'offline' | 'disabled';

const captainTypeOptions: readonly MobileAccountTypeOption[] = [
  { id: 'dsh', label: 'DSH', description: 'السياق النشط الآن' },
  { id: 'amn', label: 'AMN', description: 'مسار [TBD] غير مكتمل' },
];

const defaultDetailByOrderId: Record<string, CaptainOrderDetailSummary> = {
  'captain-order-9021': {
    orderId: 'captain-order-9021',
    pickupLabel: 'Burger Lab - فرع حطين',
    dropoffLabel: 'حي العليا، طريق الملك فهد',
    etaLabel: 'مدة الوصول إلى الاستلام: 8 دقائق',
    currentStageLabel: 'في الطريق إلى الاستلام',
    nextActionLabel: 'أكد الاستلام بعد التقاط الطلب',
  },
  'captain-order-9024': {
    orderId: 'captain-order-9024',
    pickupLabel: 'Green Bowl - فرع الياسمين',
    dropoffLabel: 'طريق الملك فهد، الحي الشمالي',
    etaLabel: 'مدة الوصول إلى الاستلام: 15 دقيقة',
    currentStageLabel: 'في قائمة الإرسال',
    nextActionLabel: 'ابدأ المسار وأكد الاستلام عند الوصول',
  },
};

const captainDisplayName = 'الكابتن عبدالله السبيعي';
const captainWalletBalanceLabel = '348 ر.س';

const availabilityStatusMeta: Record<
  CaptainAvailabilityStatus,
  {
    label: string;
    description: string;
    chipTone: 'success' | 'warning' | 'default';
    orderBadgeLabel: string;
  }
> = {
  available: {
    label: 'متاح',
    description: 'جاهز الآن لاستقبال الطلبات والتنقل مباشرة إلى مناطق الطلب.',
    chipTone: 'success',
    orderBadgeLabel: 'نشط',
  },
  unavailable: {
    label: 'غير متاح',
    description: 'تم إيقاف استقبال الطلبات مؤقتًا حتى إعادة التفعيل.',
    chipTone: 'warning',
    orderBadgeLabel: 'موقوف',
  },
  break: {
    label: 'استراحة',
    description: 'استراحة قصيرة محلية بلا أي ربط تشغيلي خارجي.',
    chipTone: 'warning',
    orderBadgeLabel: 'استراحة',
  },
  'planned-leave': {
    label: 'إجازة مخططة',
    description: 'إدارة الإجازات والغياب ستُربط لاحقًا مع عمليات الأسطول [TBD].',
    chipTone: 'default',
    orderBadgeLabel: 'إجازة',
  },
};

const gpsStatusMeta: Record<
  CaptainGpsStatus,
  {
    label: string;
    description: string;
    chipTone: 'success' | 'warning' | 'default';
  }
> = {
  ready: {
    label: 'GPS جاهز',
    description: 'إشارة الموقع مستقرة محليًا ويمكن عرض الخريطة التجريبية بثقة.',
    chipTone: 'success',
  },
  limited: {
    label: 'GPS محدود',
    description: 'الإشارة متاحة جزئيًا ويجب التعامل معها كإرشاد تقريبي فقط.',
    chipTone: 'warning',
  },
  offline: {
    label: 'GPS دون اتصال',
    description: 'تعذر تحديث الموقع الآن. المسار يعمل كـ placeholder فقط.',
    chipTone: 'warning',
  },
  disabled: {
    label: 'GPS معطل',
    description: 'الموقع مغلق من الجهاز ويحتاج تفعيلًا لاحقًا [TBD].',
    chipTone: 'default',
  },
};

const demandHeatZones = [
  { id: 'demand-1', top: 58, right: 34, size: 164, color: 'rgba(255, 80, 13, 0.20)', label: 'طلب مرتفع' },
  { id: 'demand-2', top: 188, left: 26, size: 118, color: 'rgba(255, 80, 13, 0.14)', label: 'ذروة قريبة' },
  { id: 'demand-3', bottom: 108, right: 96, size: 146, color: 'rgba(255, 133, 75, 0.16)', label: 'متاجر نشطة' },
] as const;

const captainHeatZones = [
  { id: 'captain-1', top: 128, left: 112, size: 132, color: 'rgba(10, 47, 92, 0.14)', label: 'كباتن أكثر' },
  { id: 'captain-2', bottom: 138, left: 154, size: 104, color: 'rgba(10, 47, 92, 0.10)', label: 'تغطية قريبة' },
] as const;

export function CaptainSurfaceHost() {
  const { theme } = useTheme();
  const [activeServiceType, setActiveServiceType] = React.useState<CaptainServiceType>('dsh');
  const [route, setRoute] = React.useState<CaptainRoute>('home');
  const [inboxState, setInboxState] = React.useState<CaptainOrdersInboxScreenState>('active');
  const [activeOrderId, setActiveOrderId] = React.useState<string>('captain-order-9021');
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<CaptainSupportRoute>('orders-list');
  const [isPickupSheetVisible, setIsPickupSheetVisible] = React.useState(false);
  const [isDeliverySheetVisible, setIsDeliverySheetVisible] = React.useState(false);
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);
  const [captainAvailabilityStatus, setCaptainAvailabilityStatus] = React.useState<CaptainAvailabilityStatus>('available');
  const [gpsStatus, setGpsStatus] = React.useState<CaptainGpsStatus>('limited');
  const [activeOrderExpanded, setActiveOrderExpanded] = React.useState(false);
  const routeHistoryRef = React.useRef<CaptainRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);

  const activeSummary = defaultDetailByOrderId[activeOrderId] ?? defaultDetailByOrderId['captain-order-9021'];
  const activeOrderDisplayId = activeSummary.orderId.replace('captain-order-', '');
  const orderChatState = inboxState === 'delivered' ? 'readOnly' : 'active';
  const isCaptainAvailable = captainAvailabilityStatus === 'available';
  const currentAvailabilityMeta = availabilityStatusMeta[captainAvailabilityStatus];
  const currentGpsMeta = gpsStatusMeta[gpsStatus];

  // Binary toggle: available <-> unavailable (owner decision)
  const cycleAvailabilityStatus = React.useCallback(() => {
    setCaptainAvailabilityStatus((current) => (current === 'available' ? 'unavailable' : 'available'));
  }, []);

  // Simple GPS toggle: ready <-> disabled. No sheet/screen opened by toggle.
  const cycleGpsStatus = React.useCallback(() => {
    setGpsStatus((current) => (current === 'ready' ? 'disabled' : 'ready'));
  }, []);

  const goBack = React.useCallback(() => {
    if (accountSheetVisible) {
      setAccountSheetVisible(false);
      return true;
    }

    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
      setRoute(previousRoute);
      return true;
    }

    if (route !== 'home') {
      setRoute('home');
      return true;
    }

    return false;
  }, [accountSheetVisible, route]);

  if (!activeSummary) {
    return null;
  }

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
      return goBack();
    });

    return () => subscription.remove();
  }, [goBack]);

  const openOrderDetail = (orderId: string) => {
    setActiveOrderId(orderId);
    setRoute('detail');
  };

  const openCaptainEntry = () => {
    setRoute('entry');
  };

  const openSupportDirectory = () => {
    setRoute('support-directory');
  };

  const openCaptainSupportScreen = (screenId: CaptainSupportRoute) => {
    setSelectedSupportScreen(screenId);
    setRoute('support-screen');
  };

  const handleSelectServiceType = React.useCallback((typeId: string) => {
    const nextType: CaptainServiceType = typeId === 'amn' ? 'amn' : 'dsh';
    setActiveServiceType(nextType);
    setRoute('home');
    setInboxState('active');
    setActiveOrderId('captain-order-9021');
    setActiveOrderExpanded(false);
    setIsPickupSheetVisible(false);
    setIsDeliverySheetVisible(false);
  }, []);

  const captainEntryState = inboxState === 'loading' ? 'loading' : inboxState === 'noOrders' ? 'empty' : 'ready';

  const renderCaptainFlow = () => {
    if (route === 'entry') {
      return (
        <DshEntryScreen
          state={captainEntryState}
          onOpenOffersPress={() => setRoute('inbox')}
          onOpenExecutionPress={() => setRoute('detail')}
          onOpenProofCapturePress={() => {
            setActiveOrderId('captain-order-9021');
            setIsDeliverySheetVisible(true);
            setRoute('detail');
          }}
        />
      );
    }

    if (route === 'inbox') {
      return (
        <CaptainOrdersInboxScreen
          state={inboxState}
          onRetry={() => setInboxState('active')}
          onOpenOrder={openOrderDetail}
          onOpenNextOrder={openOrderDetail}
        />
      );
    }

    if (route === 'detail') {
      return (
        <>
          <Box gap={3}>
            <CaptainOrderDetailScreen
              summary={activeSummary}
              onConfirmPickup={() => setIsPickupSheetVisible(true)}
              onConfirmDelivery={() => setIsDeliverySheetVisible(true)}
              onOpenNextOrder={() => setRoute('inbox')}
              onRetry={() => setRoute('detail')}
            />
            <Button label="فتح تواصل الطلب" tone="secondary" fullWidth={false} onPress={() => setRoute('orderchat')} />
          </Box>

          <CaptainPickupConfirmSheet
            visible={isPickupSheetVisible}
            orderTitle={activeSummary.orderId}
            onConfirm={() => setIsPickupSheetVisible(false)}
            onCancel={() => setIsPickupSheetVisible(false)}
          />

          <CaptainDeliveryConfirmSheet
            visible={isDeliverySheetVisible}
            orderTitle={activeSummary.orderId}
            onConfirm={() => {
              setIsDeliverySheetVisible(false);
              setInboxState('delivered');
              setRoute('inbox');
            }}
            onCancel={() => setIsDeliverySheetVisible(false)}
          />
        </>
      );
    }

    if (route === 'bell') {
      return (
        <DshCaptainBellScreen
          onOpenInbox={() => setRoute('inbox')}
          onOpenNextOrder={() => openOrderDetail(activeOrderId)}
          onRetry={() => setRoute('bell')}
        />
      );
    }

    if (route === 'orderchat') {
      return (
        <DshCaptainOrderChatScreen
          orderId={activeSummary.orderId}
          pickupLabel={activeSummary.pickupLabel}
          dropoffLabel={activeSummary.dropoffLabel}
          state={orderChatState}
        />
      );
    }

    return null;
  };

  const captainSummaryItems = [
    {
      label: 'الاسم',
      value: <Badge label={captainDisplayName} tone="brand" />,
      helperText: 'يظهر الاسم الحقيقي داخل الهيدر والـ account sheet دون title block إضافي.',
    },
    {
      label: 'النوع',
      value: <Badge label={activeServiceType === 'dsh' ? 'DSH' : 'AMN [TBD]'} tone={activeServiceType === 'dsh' ? 'success' : 'warning'} />,
      helperText: 'DSH هو السياق النشط. AMN يبقى [TBD].',
    },
    {
      label: 'التوفر',
      value: <Badge label={currentAvailabilityMeta.label} tone={currentAvailabilityMeta.chipTone} />,
      helperText: 'يمكن تبديله محليًا من chip التوفر أو من الشيت نفسه.',
    },
    {
      label: 'المحفظة',
      value: <Badge label={captainWalletBalanceLabel} tone="success" />,
      helperText: 'عرض محلي مؤقت بدون أي API مالي جديد.',
    },
    {
      label: 'التقييم',
      value: <Badge label="4.9 / 5" tone="info" />,
      helperText: 'عرض محلي واضح حتى اكتمال الربط التشغيلي [TBD].',
    },
    {
      label: 'المستوى',
      value: <Badge label="Elite 3" tone="brand" />,
      helperText: 'المستوى الحالي placeholder واضح بدل قيمة باهتة غير مقروءة.',
    },
  ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

  const captainMenuSections = [
    {
      title: 'الجاهزية والارتباط',
      subtitle: 'الحضور والموقع وربط الإجازات يبقون واضحين من دون runtime جديد.',
      items: [
        {
          id: 'availability',
          title: 'حالة التوفر',
          subtitle: currentAvailabilityMeta.description,
          meta: currentAvailabilityMeta.label,
          badgeLabel: currentAvailabilityMeta.label,
          onPress: cycleAvailabilityStatus,
        },
        {
          id: 'gps',
          title: 'GPS / الموقع',
          subtitle: currentGpsMeta.description,
          meta: currentGpsMeta.label,
          badgeLabel: currentGpsMeta.label,
          onPress: cycleGpsStatus,
        },
        {
          id: 'leave-absence',
          title: 'الإجازة والغياب',
          subtitle: 'يرتبط لاحقًا مع إدارة الأسطول وطلبات الغياب [TBD].',
          meta: '[TBD]',
          badgeLabel: '[TBD]',
          disabled: true,
        },
      ],
    },
    {
      title: 'التشغيل',
      subtitle: 'الطريق والطلبات والخريطة تبقى في واجهة واحدة.',
      items: [
        {
          id: 'entry',
          title: 'بوابة التنفيذ',
          subtitle: 'الفرز والقبول قبل الخروج للميدان.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: openCaptainEntry,
        },
        {
          id: 'orders',
          title: 'الطلبات',
          subtitle: 'فتح صندوق الطلبات الحالي.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => setRoute('inbox'),
        },
        {
          id: 'map',
          title: 'الخريطة',
          subtitle: 'العودة إلى الشاشة الرئيسية.',
          meta: 'الرئيسية',
          badgeLabel: 'الرئيسية',
          onPress: () => setRoute('home'),
        },
      ],
    },
    {
      title: 'المالية',
      subtitle: 'المحفظة والأرباح والتسويات.',
      items: [
        {
          id: 'wallet',
          title: 'المحفظة',
          subtitle: 'عرض المحفظة والملخص المالي المؤقت.',
          meta: 'مالية',
          badgeLabel: captainWalletBalanceLabel,
          onPress: () => openCaptainSupportScreen('cod-balance'),
        },
        {
          id: 'earnings',
          title: 'الأرباح',
          subtitle: 'الأرباح النهائية ما تزال [TBD].',
          meta: '[TBD]',
          badgeLabel: '[TBD]',
          disabled: true,
        },
        {
          id: 'settlements',
          title: 'التسويات',
          subtitle: 'التسويات ما تزال غير موصولة [TBD].',
          meta: '[TBD]',
          badgeLabel: '[TBD]',
          disabled: true,
        },
      ],
    },
    {
      title: 'الهوية والتقييم',
      subtitle: 'الملف الشخصي والوثائق ومستوى الأداء.',
      items: [
        {
          id: 'profile',
          title: 'الملف الشخصي',
          subtitle: 'بيانات الكابتن الأساسية.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => openCaptainSupportScreen('profile-get'),
        },
        {
          id: 'documents',
          title: 'الوثائق',
          subtitle: 'المرفقات والملفات الداعمة.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => openCaptainSupportScreen('proof-upload'),
        },
        {
          id: 'rating',
          title: 'التقييم',
          subtitle: 'مؤشرات الأداء والتقييم الحالي.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => openCaptainSupportScreen('tier-evaluate'),
        },
        {
          id: 'level',
          title: 'المستوى',
          subtitle: 'قراءة المستوى الحالي والامتيازات.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => openCaptainSupportScreen('tier-info'),
        },
      ],
    },
  ] as const;

  const homeTicker = !isCaptainAvailable
    ? {
        statusLabel: currentAvailabilityMeta.label,
        message: currentAvailabilityMeta.description,
        onPress: cycleAvailabilityStatus,
        marquee: false,
      }
    : inboxState === 'loading'
      ? {
          statusLabel: 'تحميل',
        message: 'جارٍ تجهيز حركة الكابتن وطبقة الحرارة التجريبية على الخريطة.',
          onPress: () => setRoute('inbox'),
        marquee: false,
        }
      : inboxState === 'error'
        ? {
            statusLabel: 'تنبيه',
            message: 'تعذر تحميل الطلب النشط. أعد المحاولة أو افتح صندوق الطلبات.',
            onPress: () => setInboxState('active'),
            marquee: false,
          }
        : inboxState === 'noOrders'
          ? {
              statusLabel: 'انتظار',
              message: 'لا يوجد طلب نشط الآن. ابقَ على الخريطة وانتظر الحركة التالية.',
              onPress: () => setRoute('inbox'),
              marquee: false,
            }
          : inboxState === 'delivered'
            ? {
                statusLabel: 'مغلق',
                message: 'تم تسليم الطلب الأخير. افتح صندوق الطلبات لالتقاط الحركة التالية.',
                onPress: () => setRoute('inbox'),
                marquee: false,
              }
            : {
                statusLabel: `#${activeOrderDisplayId}`,
                message: `${activeSummary.currentStageLabel} · ${activeSummary.etaLabel}`,
                onPress: () => setActiveOrderExpanded((current) => !current),
                marquee: false,
              };

  const topBar = (
    <TopBar
      variant="brand"
      title={captainDisplayName}
      locationLabel={`المحفظة · ${captainWalletBalanceLabel}`}
      locationIcon={<Icon name="wallet-outline" size={14} color={theme.brandContrast} />}
      actions={[
        {
          id: 'account',
          icon: <Icon name="person-outline" size={20} color={theme.brandContrast} />,
          accessibilityLabel: 'الحساب',
          onPress: () => setAccountSheetVisible(true),
        },
        { id: 'search', icon: <Icon name="search-outline" size={20} color={theme.brandContrast} />, accessibilityLabel: 'البحث', onPress: openSupportDirectory },
        {
          id: 'notifications',
          icon: <Icon name="notifications-outline" size={20} color={theme.brandContrast} />,
          badgeCount: 2,
          accessibilityLabel: 'الإشعارات',
          onPress: () => setRoute('bell'),
        },
        {
          id: 'wallet',
          icon: <Icon name="wallet-outline" size={20} color={theme.brandContrast} />,
          accessibilityLabel: 'المحفظة',
          onPress: () => openCaptainSupportScreen('cod-balance'),
        },
      ]}
      ticker={homeTicker}
    />
  );

  const renderRouteHeader = () => {
    if (route === 'entry') {
      return <MobileWorkspaceHeader title="بوابة التنفيذ" description="ابدأ من الفرز والقبول قبل الخروج للميدان." icon="navigate-outline" backLabel="العودة للخريطة" onBack={goBack} />;
    }

    if (route === 'inbox') {
      return <MobileWorkspaceHeader title="صندوق الطلبات" description="الطلب النشط أولًا ثم بقية الصف." icon="list-outline" backLabel="العودة للخريطة" onBack={goBack} />;
    }

    if (route === 'detail') {
      return <MobileWorkspaceHeader title="تفاصيل الطلب" description="راجع الطلب قبل التنفيذ أو التسليم." icon="document-text-outline" backLabel="العودة للخريطة" onBack={goBack} />;
    }

    if (route === 'orderchat') {
      return <MobileWorkspaceHeader title="تواصل الطلب" description="مراسلات قصيرة مرتبطة بالطلب النشط." icon="chatbubble-ellipses-outline" backLabel="العودة للخريطة" onBack={goBack} />;
    }

    if (route === 'bell') {
      return <MobileWorkspaceHeader title="الإشعارات" description="تنبيهات الطلبات الجديدة دون ضجيج." icon="notifications-outline" backLabel="العودة للخريطة" onBack={goBack} />;
    }

    if (route === 'support-directory') {
      return <MobileWorkspaceHeader title="دليل الدعم" description="كل مسارات DSH المتبقية في مكان واحد." icon="albums-outline" backLabel="العودة للخريطة" onBack={goBack} />;
    }

    if (route === 'support-screen') {
      return <MobileWorkspaceHeader title="الدعم" description="المسار المفتوح من الدليل." icon="layers-outline" backLabel="العودة للخريطة" onBack={goBack} />;
    }

    return null;
  };

  const renderHomeOrderPanel = () => {
    if (!isCaptainAvailable) {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={3}
          radiusToken="xl"
          style={{ shadowColor: '#020617', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label={currentAvailabilityMeta.label} tone={currentAvailabilityMeta.chipTone} />
          <Box gap={1}>
            <Text role="bodyStrong">الواجهة متوقفة حتى يعود الكابتن للتوفر</Text>
            <Text role="bodySm" tone="muted">
              {currentAvailabilityMeta.description}
            </Text>
          </Box>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button size="sm" fullWidth={false} tone="success" label="تبديل الحالة" onPress={cycleAvailabilityStatus} />
            <Button size="sm" fullWidth={false} tone="ghost" label="فتح الطلبات" onPress={() => setRoute('inbox')} />
          </Box>
        </Surface>
      );
    }

    if (inboxState === 'loading') {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={3}
          radiusToken="xl"
          style={{ shadowColor: '#020617', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label="تحميل" tone="info" />
          <Box gap={1}>
            <Text role="bodyStrong">الخريطة قيد التحضير</Text>
            <Text role="bodySm" tone="muted">
              سيظهر الطلب النشط هنا عندما تكتمل بيانات التشغيل المحلية.
            </Text>
          </Box>
        </Surface>
      );
    }

    if (inboxState === 'error') {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={3}
          radiusToken="xl"
          style={{ shadowColor: '#020617', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label="تنبيه" tone="danger" />
          <Box gap={1}>
            <Text role="bodyStrong">تعذر تحميل الطلب النشط</Text>
            <Text role="bodySm" tone="muted">
              أعد المحاولة من نفس البطاقة أو افتح صندوق الطلبات لمراجعة الصف الحالي.
            </Text>
          </Box>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button size="sm" fullWidth={false} label="إعادة المحاولة" onPress={() => setInboxState('active')} />
            <Button size="sm" fullWidth={false} tone="ghost" label="صندوق الطلبات" onPress={() => setRoute('inbox')} />
          </Box>
        </Surface>
      );
    }

    if (inboxState === 'noOrders') {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={3}
          radiusToken="xl"
          style={{ shadowColor: '#020617', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label="انتظار" tone="warning" />
          <Box gap={1}>
            <Text role="bodyStrong">لا يوجد طلب نشط</Text>
            <Text role="bodySm" tone="muted">
              ابقَ على الخريطة حتى تصل الحركة التالية ثم افتح صندوق الطلبات عند الحاجة.
            </Text>
          </Box>
          <Button size="sm" fullWidth={false} label="فتح الطلبات" onPress={() => setRoute('inbox')} />
        </Surface>
      );
    }

    if (inboxState === 'delivered') {
      return (
        <Surface
          tone="raised"
          padding={3}
          gap={3}
          radiusToken="xl"
          style={{ shadowColor: '#020617', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
        >
          <Badge label="مغلق" tone="success" />
          <Box gap={1}>
            <Text role="bodyStrong">تم تسليم الطلب</Text>
            <Text role="bodySm" tone="muted">
              أُغلق الطلب الأخير بنجاح ويمكنك الانتقال مباشرة إلى الصف التالي.
            </Text>
          </Box>
          <Button size="sm" fullWidth={false} label="فتح الطلب التالي" onPress={() => setRoute('inbox')} />
        </Surface>
      );
    }

    return (
      <Surface
        tone="raised"
        padding={3}
        gap={3}
        radiusToken="xl"
        style={{ shadowColor: '#020617', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}
      >
        <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
          <Box gap={1} style={{ flex: 1 }}>
            <Text role="caption" tone="muted">
              الطلب النشط
            </Text>
            <Text role="bodyStrong">#{activeOrderDisplayId}</Text>
          </Box>
          <Badge label={currentAvailabilityMeta.orderBadgeLabel} tone={currentAvailabilityMeta.chipTone} />
        </Box>
        {!activeOrderExpanded ? (
          <>
            <Text role="bodySm" numberOfLines={1} tone="muted">
              {activeSummary.pickupLabel} → {activeSummary.dropoffLabel}
            </Text>

            <Box layoutDirection="row" align="center" gap={2} style={{ marginTop: 8 }}>
              <Text role="bodySm" tone="muted" style={{ flex: 1 }}>{activeSummary.etaLabel}</Text>
              <Button size="sm" fullWidth={false} label="تفاصيل مختصرة" onPress={() => setActiveOrderExpanded(true)} />
            </Box>
          </>
        ) : (
          <Box gap={2}>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">الاستلام</Text>
              <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>{activeSummary.pickupLabel}</Text>
            </Box>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">التسليم</Text>
              <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>{activeSummary.dropoffLabel}</Text>
            </Box>
            <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
              <Text role="caption" tone="muted">المرحلة</Text>
              <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>{activeSummary.currentStageLabel}</Text>
            </Box>

            <Box layoutDirection="row" gap={2} style={{ marginTop: 6 }}>
              <Button size="sm" fullWidth={false} label="إخفاء المختصر" onPress={() => setActiveOrderExpanded(false)} />
            </Box>
          </Box>
        )}
      </Surface>
    );
  };

  const renderHomeScreen = () => (
      <MobileScrollView
        fill
        padding={4}
        gap={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 220 }}
      >
      <Box layoutDirection="row" gap={3} align="center" style={{ alignItems: 'center' }}>
        <Switch
          label={`التوفر · ${currentAvailabilityMeta.label}`}
          value={isCaptainAvailable}
          onValueChange={(v) => setCaptainAvailabilityStatus(v ? 'available' : 'unavailable')}
          style={{ paddingVertical: 2 }}
        />

        <Switch
          label={`GPS · ${currentGpsMeta.label}`}
          value={gpsStatus === 'ready'}
          onValueChange={(v) => setGpsStatus(v ? 'ready' : 'disabled')}
          style={{ paddingVertical: 2 }}
        />
      </Box>

      <Surface tone="inset" padding={0} gap={0} radiusToken="xl" style={{ minHeight: 560, overflow: 'hidden', borderColor: theme.lineStrong }}>
        <Box style={{ minHeight: 560, backgroundColor: '#EFF5FA', overflow: 'hidden' }}>
          <Box style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.12)' }} />
          <Box style={{ position: 'absolute', top: 78, left: 40, width: 7, height: 222, borderRadius: 999, backgroundColor: 'rgba(10, 47, 92, 0.10)' }} />
          <Box style={{ position: 'absolute', top: 136, left: 40, right: 74, height: 7, borderRadius: 999, backgroundColor: 'rgba(10, 47, 92, 0.08)' }} />
          <Box style={{ position: 'absolute', top: 214, right: 58, width: 148, height: 7, borderRadius: 999, backgroundColor: 'rgba(10, 47, 92, 0.08)', transform: [{ rotate: '-18deg' }] }} />
          <Box style={{ position: 'absolute', bottom: 122, left: 92, right: 42, height: 7, borderRadius: 999, backgroundColor: 'rgba(10, 47, 92, 0.06)', transform: [{ rotate: '14deg' }] }} />

          {demandHeatZones.map((zone) => (
            <Box
              key={zone.id}
              style={{
                position: 'absolute',
                width: zone.size,
                height: zone.size,
                borderRadius: zone.size / 2,
                backgroundColor: zone.color,
                borderWidth: 1,
                borderColor: 'rgba(255, 80, 13, 0.12)',
                ...(zone.top != null ? { top: zone.top } : {}),
                ...(zone.bottom != null ? { bottom: zone.bottom } : {}),
                ...(zone.left != null ? { left: zone.left } : {}),
                ...(zone.right != null ? { right: zone.right } : {}),
              }}
            />
          ))}

          {captainHeatZones.map((zone) => (
            <Box
              key={zone.id}
              style={{
                position: 'absolute',
                width: zone.size,
                height: zone.size,
                borderRadius: zone.size / 2,
                backgroundColor: zone.color,
                borderWidth: 1,
                borderColor: 'rgba(10, 47, 92, 0.12)',
                ...(zone.top != null ? { top: zone.top } : {}),
                ...(zone.bottom != null ? { bottom: zone.bottom } : {}),
                ...(zone.left != null ? { left: zone.left } : {}),
                ...(zone.right != null ? { right: zone.right } : {}),
              }}
            />
          ))}

          {/* Small fixed legend (compact, privacy-safe) */}
          <Surface tone="inset" padding={2} gap={2} radiusToken="lg" style={{ position: 'absolute', left: 14, bottom: 14, minWidth: 180 }}>
            <Box layoutDirection="row" gap={2} align="center">
              <Box style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255, 80, 13, 0.95)' }} />
              <Text role="bodySm">كثافة طلبات</Text>
              <Box style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(10, 47, 92, 0.95)', marginLeft: 8 }} />
              <Text role="bodySm">تجمع كباتن</Text>
            </Box>
            <Box layoutDirection="row" gap={2} align="center" style={{ marginTop: 6 }}>
              <Box style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: theme.brand, backgroundColor: '#FFFFFF' }} />
              <Text role="bodySm">نطاقك</Text>
              <Box style={{ flex: 1 }} />
              <Badge label={currentGpsMeta.label} tone={currentGpsMeta.chipTone} />
            </Box>
          </Surface>

          <Box style={{ position: 'absolute', top: 182, left: 148, alignItems: 'center', gap: 6 }}>
            <Box style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#0A2F5C', borderWidth: 4, borderColor: '#FFFFFF' }} />
            <Badge label="نطاقك الحالي" tone="brand" />
          </Box>
        </Box>
      </Surface>

      {renderHomeOrderPanel()}
    </MobileScrollView>
  );

  const accountSheet = (
    <MobileAccountSheet
      mode="captain"
      visible={accountSheetVisible}
      onClose={() => setAccountSheetVisible(false)}
      captainDisplayName={captainDisplayName}
      typeOptions={captainTypeOptions}
      activeTypeId={activeServiceType}
      onSelectType={handleSelectServiceType}
      typeSwitchTitle="تغيير نوع تشغيل الكابتن"
      typeSwitchPrompt="DSH هو السياق النشط الآن. AMN يبقى مسارًا غير مكتمل [TBD]."
      captainSummaryItems={captainSummaryItems}
      captainSections={captainMenuSections}
    />
  );

  /* GPS sheet removed: GPS toggles are local-only and do not open sheets (Phase A) */

  if (activeServiceType === 'amn') {
    return (
      <Box style={{ flex: 1 }} background="background">
        <MobileWorkspaceHeader
          title="AMN [TBD]"
          description="هذا المسار غير مكتمل ولا ينافس DSH النشط حاليًا."
          icon="alert-circle-outline"
          backLabel="العودة إلى DSH"
          onBack={() => handleSelectServiceType('dsh')}
        />
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
          <MobileScrollView fill padding={4} gap={4}>
            <StateView
              stateId="warning"
              title="AMN يبقى [TBD]"
              description="DSH هو السياق التنفيذي النشط، بينما AMN يظهر هنا كمسار placeholder فقط حتى يكتمل الربط."
              actionLabel="العودة إلى DSH"
              onActionPress={() => handleSelectServiceType('dsh')}
            />
            <Surface tone="inset" padding={4} gap={2} radiusToken="xl">
              <Text role="bodyStrong">لا نضيف أي binding جديد هنا.</Text>
              <Text role="bodySm" tone="muted">
                AMN حاضر فقط كمرجع غير مكتمل [TBD]، ولا ينبغي أن يزاحم DSH في هذا السطح.
              </Text>
            </Surface>
          </MobileScrollView>
        </Surface>
        {accountSheet}
      </Box>
    );
  }

  if (route !== 'home') {
    const supportScreens: Record<CaptainSupportRoute, React.ReactNode> = {
      'chat-read-ack': <DshCaptainChatReadAckScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'chat-send': <DshCaptainChatSendScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'cod-balance': <DshCaptainCodBalanceScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'job-reject': <DshCaptainJobRejectScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-accept': <DshCaptainOrderAcceptScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('order-get')} />,
      'order-deliver': <DshCaptainOrderDeliverScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('proof-upload')} />,
      'order-details': <DshCaptainOrderDetailsScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-get': <DshCaptainOrderGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'order-pickup': <DshCaptainOrderPickupScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('order-deliver')} />,
      'orders-list': <DshCaptainOrdersListScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('orders-offers-list')} />,
      'orders-offers-list': <DshCaptainOrdersOffersListScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('order-accept')} />,
      'profile-get': <DshCaptainProfileGetScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'proof-upload': <DshCaptainProofUploadScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
      'tier-evaluate': <DshCaptainTierEvaluateScreen onBack={openSupportDirectory} onSecondaryAction={() => openCaptainSupportScreen('tier-info')} />,
      'tier-info': <DshCaptainTierInfoScreen onBack={openSupportDirectory} onSecondaryAction={openSupportDirectory} />,
    };

    let content: React.ReactNode = renderCaptainFlow();

    if (route === 'support-directory') {
      content = <DshCaptainSupportDirectoryScreen onOpenScreen={(screenId) => openCaptainSupportScreen(screenId as CaptainSupportRoute)} />;
    }

    if (route === 'support-screen') {
      content = supportScreens[selectedSupportScreen];
    }

    return (
      <Box style={{ flex: 1 }} background="background">
        {renderRouteHeader()}
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
      </Box>
    );
  }

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
        {renderHomeScreen()}
      </Surface>
      {accountSheet}
    </Box>
  );
}

export default CaptainSurfaceHost;
