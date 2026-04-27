import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Badge, Box, Button, Icon, KeyValueList, MobileScrollView, MobileWorkspaceHeader, SectionHeader, ServiceTileCard, SheetFrame, StateView, Surface, Text, TopBar } from '@bthwani/ui-kit';
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
      label: 'المحفظة',
      value: <Badge label="[TBD]" tone="warning" />,
      helperText: 'الرصيد والربط المالي غير مكتملين.',
    },
    {
      label: 'التقييم',
      value: <Badge label="[TBD]" tone="warning" />,
      helperText: 'التقييم النهائي سيظهر عند اكتمال الربط.',
    },
    {
      label: 'المستوى',
      value: <Badge label="[TBD]" tone="warning" />,
      helperText: 'المستوى غير محسوم بعد.',
    },
  ] satisfies React.ComponentProps<typeof KeyValueList>['items'];

  const captainMenuSections = [
    {
      title: 'التشغيل',
      subtitle: 'الطريق والطلبات والخريطة تبقى في واجهة واحدة.',
      items: [
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

  const topBar = (
    <TopBar
      variant="brand"
      title="الكابتن [TBD]"
      subtitle="DSH · القيادة اليومية"
      locationLabel="المحفظة [TBD]"
      locationIcon={<Icon name="wallet-outline" size={18} color="#FFFFFF" />}
      actions={[
        { id: 'search', icon: <Icon name="search-outline" size={21} color="#FFFFFF" />, accessibilityLabel: 'البحث', onPress: openSupportDirectory },
        {
          id: 'notifications',
          icon: <Icon name="notifications-outline" size={21} color="#FFFFFF" />,
          badgeCount: 2,
          accessibilityLabel: 'الإشعارات',
          onPress: () => setRoute('bell'),
        },
        { id: 'account', icon: <Icon name="person-outline" size={21} color="#FFFFFF" />, accessibilityLabel: 'الحساب', onPress: () => setAccountSheetVisible(true) },
      ]}
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
        <StateView
          stateId="blockingError"
          title="الكابتن غير متوفر"
          description="أوقف التوفر الآن ثم عد إلى الخريطة عندما تكون جاهزًا لاستلام الطلب التالي."
          actionLabel="العودة إلى التوفر"
          onActionPress={() => setIsCaptainAvailable(true)}
        />
      );
    }

    if (inboxState === 'loading') {
      return <StateView stateId="loading" title="الخريطة قيد التحضير" description="الطلب النشط سيظهر عندما تكتمل بيانات التشغيل." />;
    }

    if (inboxState === 'error') {
      return (
        <StateView
          stateId="recoverableError"
          title="تعذر تحميل الطلب النشط"
          description="أعد المحاولة من نفس السياق أو ارجع إلى صندوق الطلبات."
          actionLabel="إعادة المحاولة"
          onActionPress={() => setInboxState('active')}
        />
      );
    }

    if (inboxState === 'noOrders') {
      return (
        <StateView
          stateId="empty"
          title="لا يوجد طلب نشط"
          description="ابقَ على الخريطة حتى تصل حركة جديدة ثم افتح صندوق الطلبات."
          actionLabel="فتح الطلبات"
          onActionPress={() => setRoute('inbox')}
        />
      );
    }

    if (inboxState === 'delivered') {
      return (
        <StateView
          stateId="success"
          title="تم تسليم الطلب"
          description="التسليم مغلق الآن ويمكنك الانتقال مباشرة إلى الطلب التالي."
          actionLabel="فتح الطلب التالي"
          onActionPress={() => setRoute('inbox')}
        />
      );
    }

    return (
      <Box gap={3}>
        <SectionHeader title="الطلب النشط" subtitle="الوجهة التالية تبقى أوضح من الخريطة نفسها." />
        <KeyValueList
          dense
          items={[
            { label: 'الطلب', value: `#${activeSummary.orderId}`, tone: 'brand', helperText: 'السياق الحي الحالي.' },
            { label: 'الاستلام', value: activeSummary.pickupLabel, helperText: 'نقطة الالتقاط الحالية.' },
            { label: 'التسليم', value: activeSummary.dropoffLabel, helperText: 'الوجهة التالية.' },
            { label: 'المرحلة', value: activeSummary.currentStageLabel, tone: 'warning', helperText: 'الخطوة الجارية.' },
            { label: 'التالي', value: activeSummary.nextActionLabel, tone: 'success', helperText: 'الإجراء التالي من نفس الخريطة.' },
          ]}
        />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="تفاصيل الطلب" onPress={() => setRoute('detail')} />
          <Button label="تواصل الطلب" tone="secondary" onPress={() => setRoute('orderchat')} />
          <Button label="بوابة التنفيذ" tone="ghost" onPress={openCaptainEntry} />
          <Button label="صندوق الطلبات" tone="ghost" onPress={() => setRoute('inbox')} />
        </Box>
      </Box>
    );
  };

  const renderHomeScreen = () => (
    <MobileScrollView fill padding={4} gap={4}>
      <Surface tone="brand" padding={4} gap={4} radiusToken="xl" border={false}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label="DSH" tone="warning" />
          <Text role="titleLg" tone="inverse" style={{ textAlign: 'right' }}>
            الخريطة الرئيسية
          </Text>
          <Text role="bodySm" tone="inverse" style={{ textAlign: 'right' }}>
            تحديد موقع العميل وتسليم الطلب من مساحة واحدة. مزود الخريطة الفعلي يبقى [TBD].
          </Text>
        </Box>

        <Surface tone="inset" padding={4} gap={3} radiusToken="xl" style={{ minHeight: 262, overflow: 'hidden' }}>
          <Box style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <Icon name="map-outline" size={42} color="#0A2F5C" />
            <Text role="titleMd" align="center">
              مزود الخريطة [TBD]
            </Text>
            <Text role="bodySm" tone="muted" align="center">
              لا يوجد binding فعلي بعد. هذه مساحة جاهزة لمزود الخرائط لاحقًا من دون API جديد.
            </Text>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              <Badge label={isCaptainAvailable ? 'متاح' : 'غير متاح'} tone={isCaptainAvailable ? 'success' : 'warning'} />
              <Badge label="العميل" tone="brand" />
              <Badge label="التسليم" tone="info" />
            </Box>
          </Box>
        </Surface>
      </Surface>

      <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
        <ServiceTileCard
          title="حالة التوفر"
          subtitle={isCaptainAvailable ? 'متاح الآن' : 'غير متاح الآن'}
          description="اضغط لتبديل حالة الكابتن من نفس الخريطة."
          icon={<Icon name={isCaptainAvailable ? 'checkmark-circle-outline' : 'pause-circle-outline'} size={24} color={isCaptainAvailable ? '#0A2F5C' : '#FF500D'} />}
          badgeLabel={isCaptainAvailable ? 'متاح' : 'غير متاح'}
          badgeTone={isCaptainAvailable ? 'success' : 'warning'}
          minHeight={156}
          style={{ flex: 1, minWidth: 160 }}
          onPress={() => setIsCaptainAvailable((current) => !current)}
        />
        <ServiceTileCard
          title="GPS / الموقع"
          subtitle="مؤشر جاهزية الموقع"
          description="افتح حالة GPS والموقع والخرائط [TBD]."
          icon={<Icon name="navigate-outline" size={24} color="#0A2F5C" />}
          badgeLabel="[TBD]"
          badgeTone="warning"
          minHeight={156}
          style={{ flex: 1, minWidth: 160 }}
          onPress={() => setGpsSheetVisible(true)}
        />
      </Box>

      <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
        <SectionHeader title="جاهزية التشغيل" subtitle="كل حالة لازمة تظهر هنا من دون تكامل runtime جديد." />
        <KeyValueList
          items={[
            { label: 'التوفر', value: <Badge label={isCaptainAvailable ? 'متاح' : 'غير متاح'} tone={isCaptainAvailable ? 'success' : 'warning'} />, helperText: 'تبديله محليًا فقط.' },
            { label: 'GPS', value: <Badge label="[TBD]" tone="warning" />, helperText: 'تفاصيل GPS داخل الشيت.' },
            { label: 'الموقع', value: <Badge label="[TBD]" tone="warning" />, helperText: 'الموقع الدقيق غير موصول بعد.' },
            { label: 'الطلب النشط', value: <Badge label={inboxState === 'noOrders' ? 'لا يوجد' : `#${activeSummary.orderId}`} tone={inboxState === 'noOrders' ? 'warning' : 'brand'} />, helperText: 'يتغير وفق الحالة الحالية.' },
            { label: 'البيانات', value: <Badge label="[TBD]" tone="warning" />, helperText: 'الخريطة والربط والتقييمات غير مكتملة.' },
          ]}
        />
      </Surface>

      <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
        {renderHomeOrderPanel()}
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
