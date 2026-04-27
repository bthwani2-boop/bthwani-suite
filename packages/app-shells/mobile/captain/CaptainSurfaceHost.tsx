import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Badge, Box, Button, Icon, KeyValueList, MobileScrollView, MobileWorkspaceHeader, SheetFrame, StateView, Surface, Text, TopBar, useTheme } from '@bthwani/ui-kit';
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
  const [gpsSheetVisible, setGpsSheetVisible] = React.useState(false);
  const [isCaptainAvailable, setIsCaptainAvailable] = React.useState(true);
  const routeHistoryRef = React.useRef<CaptainRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);

  const activeSummary = defaultDetailByOrderId[activeOrderId] ?? defaultDetailByOrderId['captain-order-9021'];
  const activeOrderDisplayId = activeSummary.orderId.replace('captain-order-', '');
  const orderChatState = inboxState === 'delivered' ? 'readOnly' : 'active';
  const goBack = React.useCallback(() => {
    if (gpsSheetVisible) {
      setGpsSheetVisible(false);
      return true;
    }

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
  }, [accountSheetVisible, gpsSheetVisible, route]);

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
      value: <Badge label="الكابتن [TBD]" tone="warning" />,
      helperText: 'الاسم النهائي غير مرتبط بعد.',
    },
    {
      label: 'النوع',
      value: <Badge label={activeServiceType === 'dsh' ? 'DSH' : 'AMN [TBD]'} tone={activeServiceType === 'dsh' ? 'success' : 'warning'} />,
      helperText: 'DSH هو السياق النشط. AMN يبقى [TBD].',
    },
    {
      label: 'التوفر',
      value: <Badge label={isCaptainAvailable ? 'متاح الآن' : 'خارج التوفر'} tone={isCaptainAvailable ? 'success' : 'warning'} />,
      helperText: 'يمكن تبديله مباشرة من الخريطة الرئيسية.',
    },
    {
      label: 'المركبة',
      value: <Badge label="[TBD]" tone="warning" />,
      helperText: 'المركبة ولوحة التسجيل غير مربوطتين بعد.',
    },
    {
      label: 'المحفظة',
      value: <Badge label="[TBD]" tone="warning" />,
      helperText: 'الرصيد والربط المالي غير مكتملين.',
    },
    {
      label: 'المستوى',
      value: <Badge label="[TBD]" tone="warning" />,
      helperText: 'المستوى غير محسوم بعد.',
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
          subtitle: isCaptainAvailable ? 'الكابتن متاح الآن لاستقبال الحركة.' : 'الكابتن خارج التوفر حاليًا.',
          meta: isCaptainAvailable ? 'متاح' : 'موقوف',
          badgeLabel: isCaptainAvailable ? 'متاح' : 'موقوف',
          onPress: () => {
            setAccountSheetVisible(false);
            setIsCaptainAvailable((current) => !current);
          },
        },
        {
          id: 'gps',
          title: 'GPS / الموقع',
          subtitle: 'فتح حالة GPS والموقع والخرائط التجريبية.',
          meta: '[TBD]',
          badgeLabel: '[TBD]',
          onPress: () => {
            setAccountSheetVisible(false);
            setGpsSheetVisible(true);
          },
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
          onPress: () => {
            setAccountSheetVisible(false);
            openCaptainEntry();
          },
        },
        {
          id: 'orders',
          title: 'الطلبات',
          subtitle: 'فتح صندوق الطلبات الحالي.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => {
            setAccountSheetVisible(false);
            setRoute('inbox');
          },
        },
        {
          id: 'map',
          title: 'الخريطة',
          subtitle: 'العودة إلى الشاشة الرئيسية.',
          meta: 'الرئيسية',
          badgeLabel: 'الرئيسية',
          onPress: () => {
            setAccountSheetVisible(false);
            setRoute('home');
          },
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
          badgeLabel: '[TBD]',
          onPress: () => {
            setAccountSheetVisible(false);
            openCaptainSupportScreen('cod-balance');
          },
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
          onPress: () => {
            setAccountSheetVisible(false);
            openCaptainSupportScreen('profile-get');
          },
        },
        {
          id: 'documents',
          title: 'الوثائق',
          subtitle: 'المرفقات والملفات الداعمة.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => {
            setAccountSheetVisible(false);
            openCaptainSupportScreen('proof-upload');
          },
        },
        {
          id: 'rating',
          title: 'التقييم',
          subtitle: 'مؤشرات الأداء والتقييم الحالي.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => {
            setAccountSheetVisible(false);
            openCaptainSupportScreen('tier-evaluate');
          },
        },
        {
          id: 'level',
          title: 'المستوى',
          subtitle: 'قراءة المستوى الحالي والامتيازات.',
          meta: 'مباشر',
          badgeLabel: 'مباشر',
          onPress: () => {
            setAccountSheetVisible(false);
            openCaptainSupportScreen('tier-info');
          },
        },
      ],
    },
  ] as const;

  const homeTicker = !isCaptainAvailable
    ? {
        statusLabel: 'متوقف',
        message: 'أنت خارج التوفر الآن. فعّل التوفر للعودة إلى استقبال الطلبات.',
        onPress: () => setIsCaptainAvailable(true),
      }
    : inboxState === 'loading'
      ? {
          statusLabel: 'تحميل',
          message: 'جارٍ تجهيز حركة الكابتن وتهيئة الخريطة الرئيسية.',
          onPress: () => setRoute('inbox'),
        }
      : inboxState === 'error'
        ? {
            statusLabel: 'تنبيه',
            message: 'تعذر تحميل الطلب النشط. أعد المحاولة أو افتح صندوق الطلبات.',
            onPress: () => setInboxState('active'),
          }
        : inboxState === 'noOrders'
          ? {
              statusLabel: 'انتظار',
              message: 'لا يوجد طلب نشط الآن. ابقَ على الخريطة وانتظر الحركة التالية.',
              onPress: () => setRoute('inbox'),
            }
          : inboxState === 'delivered'
            ? {
                statusLabel: 'مغلق',
                message: 'تم تسليم الطلب الأخير. افتح صندوق الطلبات لالتقاط الحركة التالية.',
                onPress: () => setRoute('inbox'),
              }
            : {
                statusLabel: `#${activeOrderDisplayId}`,
                message: `${activeSummary.currentStageLabel} · ${activeSummary.etaLabel}`,
                onPress: () => setRoute('detail'),
              };

  const topBar = (
    <TopBar
      variant="brand"
      layoutMode="relaxed-main"
      title="الكابتن [TBD]"
      subtitle="DSH · القيادة اليومية"
      locationLabel="الرياض · تغطية DSH"
      actions={[
        { id: 'account', icon: <Icon name="person-outline" size={21} color={theme.brandContrast} />, accessibilityLabel: 'الحساب', onPress: () => setAccountSheetVisible(true) },
        {
          id: 'notifications',
          icon: <Icon name="notifications-outline" size={21} color={theme.brandContrast} />,
          badgeCount: 2,
          accessibilityLabel: 'الإشعارات',
          onPress: () => setRoute('bell'),
        },
        {
          id: 'wallet',
          icon: <Icon name="wallet-outline" size={21} color={theme.brandContrast} />,
          accessibilityLabel: 'المحفظة',
          onPress: () => openCaptainSupportScreen('cod-balance'),
        },
        { id: 'search', icon: <Icon name="search-outline" size={21} color={theme.brandContrast} />, accessibilityLabel: 'البحث', onPress: openSupportDirectory },
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
          padding={4}
          gap={3}
          radiusToken="xl"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            shadowColor: '#020617',
            shadowOpacity: 0.14,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
        >
          <Badge label="خارج التوفر" tone="warning" />
          <Box gap={1}>
            <Text role="bodyStrong">الكابتن غير متاح الآن</Text>
            <Text role="bodySm" tone="muted">
              فعّل التوفر من هذه البطاقة أو من الشريحة العلوية للعودة إلى استقبال الطلبات.
            </Text>
          </Box>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button size="sm" fullWidth={false} tone="success" label="تفعيل التوفر" onPress={() => setIsCaptainAvailable(true)} />
            <Button size="sm" fullWidth={false} tone="ghost" label="فتح الطلبات" onPress={() => setRoute('inbox')} />
          </Box>
        </Surface>
      );
    }

    if (inboxState === 'loading') {
      return (
        <Surface
          tone="raised"
          padding={4}
          gap={3}
          radiusToken="xl"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            shadowColor: '#020617',
            shadowOpacity: 0.14,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
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
          padding={4}
          gap={3}
          radiusToken="xl"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            shadowColor: '#020617',
            shadowOpacity: 0.14,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
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
          padding={4}
          gap={3}
          radiusToken="xl"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            shadowColor: '#020617',
            shadowOpacity: 0.14,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
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
          padding={4}
          gap={3}
          radiusToken="xl"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            shadowColor: '#020617',
            shadowOpacity: 0.14,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
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
        padding={4}
        gap={3}
        radiusToken="xl"
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          shadowColor: '#020617',
          shadowOpacity: 0.14,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        }}
      >
        <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
          <Box gap={1} style={{ flex: 1 }}>
            <Text role="caption" tone="muted">
              الطلب النشط
            </Text>
            <Text role="bodyStrong">#{activeOrderDisplayId}</Text>
          </Box>
          <Badge label={activeSummary.currentStageLabel} tone="warning" />
        </Box>

        <Box gap={2}>
          <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
            <Text role="caption" tone="muted">
              الاستلام
            </Text>
            <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>
              {activeSummary.pickupLabel}
            </Text>
          </Box>
          <Box layoutDirection="row" align="center" justify="space-between" gap={2}>
            <Text role="caption" tone="muted">
              التسليم
            </Text>
            <Text role="bodySm" align="end" numberOfLines={1} style={{ flex: 1 }}>
              {activeSummary.dropoffLabel}
            </Text>
          </Box>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Badge label={activeSummary.etaLabel} tone="info" />
          <Badge label={activeSummary.nextActionLabel} tone="brand" />
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button size="sm" fullWidth={false} label="تفاصيل الطلب" onPress={() => setRoute('detail')} />
          <Button size="sm" fullWidth={false} tone="secondary" label="تواصل الطلب" onPress={() => setRoute('orderchat')} />
          <Button size="sm" fullWidth={false} tone="ghost" label="صندوق الطلبات" onPress={() => setRoute('inbox')} />
        </Box>
      </Surface>
    );
  };

  const renderHomeScreen = () => (
    <MobileScrollView
      fill
      padding={4}
      gap={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 128 }}
    >
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Button
          size="sm"
          fullWidth={false}
          tone={isCaptainAvailable ? 'success' : 'secondary'}
          label={isCaptainAvailable ? 'متاح الآن' : 'خارج التوفر'}
          leadingAccessory={<Icon name={isCaptainAvailable ? 'checkmark-circle-outline' : 'pause-circle-outline'} size={16} color={isCaptainAvailable ? '#FFFFFF' : theme.warning} />}
          style={{ borderRadius: 999 }}
          onPress={() => setIsCaptainAvailable((current) => !current)}
        />
        <Button
          size="sm"
          fullWidth={false}
          tone="secondary"
          label="GPS / الموقع [TBD]"
          leadingAccessory={<Icon name="navigate-outline" size={16} color={theme.brand} />}
          style={{ borderRadius: 999 }}
          onPress={() => setGpsSheetVisible(true)}
        />
      </Box>

      <Surface tone="inset" padding={0} gap={0} radiusToken="xl" style={{ minHeight: 432, overflow: 'hidden', borderColor: theme.lineStrong }}>
        <Box style={{ minHeight: 432, backgroundColor: '#F7F4EF', overflow: 'hidden' }}>
          <Box style={{ position: 'absolute', top: 62, right: 36, width: 148, height: 148, borderRadius: 74, backgroundColor: 'rgba(255, 80, 13, 0.16)' }} />
          <Box style={{ position: 'absolute', top: 120, left: 28, width: 126, height: 126, borderRadius: 63, backgroundColor: 'rgba(10, 47, 92, 0.09)' }} />
          <Box style={{ position: 'absolute', bottom: 126, right: 112, width: 176, height: 176, borderRadius: 88, backgroundColor: 'rgba(255, 197, 94, 0.18)' }} />
          <Box style={{ position: 'absolute', bottom: 182, left: 98, width: 112, height: 112, borderRadius: 56, backgroundColor: 'rgba(255, 80, 13, 0.12)' }} />

          <Box style={{ position: 'absolute', top: 96, left: 46, width: 6, height: 188, borderRadius: 999, backgroundColor: 'rgba(10, 47, 92, 0.10)' }} />
          <Box style={{ position: 'absolute', top: 154, left: 46, right: 72, height: 6, borderRadius: 999, backgroundColor: 'rgba(10, 47, 92, 0.08)' }} />
          <Box style={{ position: 'absolute', top: 206, right: 68, width: 132, height: 6, borderRadius: 999, backgroundColor: 'rgba(10, 47, 92, 0.08)', transform: [{ rotate: '-18deg' }] }} />

          <Surface tone="raised" padding={3} gap={2} radiusToken="lg" style={{ position: 'absolute', top: 16, right: 16, maxWidth: 250 }}>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <Badge label="حرارة تجريبية" tone="warning" />
              <Badge label="بدون تتبع فعلي" tone="info" />
            </Box>
            <Text role="bodySm" tone="muted">
              الكثافة المعروضة تقديرية وآمنة بصريًا حتى اكتمال ربط مزود الخرائط لاحقًا.
            </Text>
          </Surface>

          <Box style={{ position: 'absolute', top: 216, left: 54, alignItems: 'center', gap: 6 }}>
            <Box style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: theme.brand, borderWidth: 3, borderColor: '#FFFFFF' }} />
            <Badge label="أنت" tone="brand" />
          </Box>
          <Box style={{ position: 'absolute', top: 140, right: 58, alignItems: 'center', gap: 6 }}>
            <Box style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: theme.warning, borderWidth: 3, borderColor: '#FFFFFF' }} />
            <Badge label="استلام" tone="warning" />
          </Box>
          <Box style={{ position: 'absolute', bottom: 152, left: 132, alignItems: 'center', gap: 6 }}>
            <Box style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: theme.info, borderWidth: 3, borderColor: '#FFFFFF' }} />
            <Badge label="تسليم" tone="info" />
          </Box>

          {renderHomeOrderPanel()}
        </Box>
      </Surface>
    </MobileScrollView>
  );

  const accountSheet = (
    <MobileAccountSheet
      mode="captain"
      visible={accountSheetVisible}
      onClose={() => setAccountSheetVisible(false)}
      typeOptions={captainTypeOptions}
      activeTypeId={activeServiceType}
      onSelectType={handleSelectServiceType}
      typeSwitchTitle="تغيير نوع تشغيل الكابتن"
      typeSwitchPrompt="DSH هو السياق النشط الآن. AMN يبقى مسارًا غير مكتمل [TBD]."
      captainSummaryItems={captainSummaryItems}
      captainSections={captainMenuSections}
    />
  );

  const gpsSheet = (
    <SheetFrame visible={gpsSheetVisible} title="GPS / الموقع [TBD]" onClose={() => setGpsSheetVisible(false)}>
      <MobileScrollView fill padding={0} gap={3} style={{ maxHeight: 620 }}>
        <Text role="bodySm" tone="muted">
          لا يوجد ربط runtime مع مزود الخرائط أو الموقع حتى الآن. ما يلي مجرد قوالب حالة واضحة للاستخدام لاحقًا.
        </Text>
        <StateView
          stateId="offline"
          title="GPS غير مفعل"
          description="فعّل GPS قبل البدء بالتوجيه أو قبول الحركة التالية."
        />
        <StateView
          stateId="warning"
          title="الموقع غير متاح"
          description="تم فتح الخريطة لكن موقع الجهاز الدقيق ما يزال غير متاح."
        />
        <StateView
          stateId="warning"
          title="بيانات الخريطة غير مكتملة [TBD]"
          description="مزود الخريطة والربط المستقبلي ما يزالان في مرحلة placeholder."
        />
        <Button label="العودة إلى الخريطة" tone="secondary" onPress={() => setGpsSheetVisible(false)} />
      </MobileScrollView>
    </SheetFrame>
  );

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
        {gpsSheet}
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
        {gpsSheet}
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
      {gpsSheet}
    </Box>
  );
}

export default CaptainSurfaceHost;
