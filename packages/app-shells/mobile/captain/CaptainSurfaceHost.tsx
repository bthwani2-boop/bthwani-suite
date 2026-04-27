import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box, Button, Icon, MobileScrollView, ScreenHeader, StateView, Surface, Text, TopBar } from '@bthwani/ui-kit';
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

const primaryAreas = [
  'الطلبات',
  'الأرباح',
  'الحالة'
] as const;

type CaptainRoute = 'home' | 'entry' | 'inbox' | 'detail' | 'orderchat' | 'bell' | 'support-directory' | 'support-screen';
type CaptainServiceType = 'dsh' | 'amn';

const shortcuts = [
  'الطلبات الحالية',
  'ملخص الأرباح',
  'تبديل الحالة',
] as const;

const captainTypeOptions: readonly MobileAccountTypeOption[] = [
  { id: 'dsh', label: 'DSH', description: 'تشغيل الطلبات اليومية' },
  { id: 'amn', label: 'AMN', description: 'تشغيل الأمان والمراقبة' },
];

const defaultDetailByOrderId: Record<string, CaptainOrderDetailSummary> = {
  'captain-order-9021': {
    orderId: 'captain-order-9021',
    pickupLabel: 'Burger Lab - Hittin branch',
    dropoffLabel: 'Olaya District, King Fahad Road',
    etaLabel: 'ETA to pickup: 8 min',
    currentStageLabel: 'Heading to pickup',
    nextActionLabel: 'Confirm pickup once package is collected',
  },
  'captain-order-9024': {
    orderId: 'captain-order-9024',
    pickupLabel: 'Green Bowl - Yasmin branch',
    dropoffLabel: 'King Fahad Road, North district',
    etaLabel: 'ETA to pickup: 15 min',
    currentStageLabel: 'Queued for dispatch',
    nextActionLabel: 'Start route and confirm pickup on arrival',
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
  const routeHistoryRef = React.useRef<CaptainRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);

  const activeSummary = defaultDetailByOrderId[activeOrderId] ?? defaultDetailByOrderId['captain-order-9021'];
  const orderChatState = inboxState === 'delivered' ? 'readOnly' : 'active';

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

      return false;
    });

    return () => subscription.remove();
  }, [accountSheetVisible]);

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
          onBack={() => setRoute('inbox')}
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
          onBack={() => setRoute('detail')}
        />
      );
    }

    return null;
  };

  const topBar = (
    <TopBar
      variant="brand"
      title="بثواني"
      subtitle="تطبيق الكابتن"
      locationLabel="الرياض، خط التشغيل الشمالي"
      actions={[
        {
          id: 'profile',
          icon: <Icon name="person-outline" size={21} color="#FFFFFF" />,
          accessibilityLabel: 'الحساب',
          onPress: () => setAccountSheetVisible(true),
        },
        {
          id: 'notifications',
          icon: <Icon name="notifications-outline" size={21} color="#FFFFFF" />,
          badgeCount: 2,
          accessibilityLabel: 'الإشعارات',
          onPress: () => {
            if (activeServiceType === 'dsh') {
              setRoute('bell');
            }
          },
        },
        {
          id: 'orders',
          icon: <Icon name="bicycle-outline" size={21} color="#FFFFFF" />,
          accessibilityLabel: 'الطلبات',
          onPress: () => {
            if (activeServiceType === 'dsh') {
              setRoute('entry');
            }
          },
        },
        { id: 'search', icon: <Icon name="search-outline" size={21} color="#FFFFFF" />, accessibilityLabel: 'الدعم', onPress: openSupportDirectory },
      ]}
      ticker={{
        statusLabel: activeServiceType === 'dsh' ? 'مباشر' : 'وضع AMN',
        message:
          activeServiceType === 'dsh'
            ? 'أولوية اليوم: طلب الاستلام الأول خلال 8 دقائق'
            : 'تم تفعيل وضع AMN. سيتم تحميل مسارات الأمان فور اكتمال ربط الشاشات.',
        onPress: () => {
          if (activeServiceType === 'dsh') {
            setRoute('entry');
          }
        },
      }}
    />
  );

  const accountSheet = (
    <MobileAccountSheet
      visible={accountSheetVisible}
      onClose={() => setAccountSheetVisible(false)}
      onOpenProfile={() => setRoute('home')}
      typeOptions={captainTypeOptions}
      activeTypeId={activeServiceType}
      onSelectType={handleSelectServiceType}
      typeSwitchTitle="تغيير نوع تشغيل الكابتن"
      typeSwitchPrompt="اختر نوع التشغيل للكابتن. عند التبديل يتم إعادة ضبط المسار وتحديث التطبيق بالكامل بحسب النوع الجديد."
    />
  );

  if (activeServiceType === 'amn') {
    return (
      <Box style={{ flex: 1 }} background="background">
        {topBar}
        <Surface
          tone="raised"
          padding={5}
          gap={4}
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
          <StateView stateId="loading" title="تم تفعيل وضع AMN" description="التطبيق الآن في سياق AMN بالكامل. يجري تجهيز الشاشات التنفيذية الخاصة بهذا النوع." />
          <Button label="العودة للرئيسية" tone="secondary" onPress={() => setRoute('home')} />
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
        {topBar}
        <Box padding={4} gap={3}>
          <Button label="العودة للرئيسية" tone="secondary" onPress={() => setRoute('home')} />
          <Surface tone="inset" padding={3} gap={2} radiusToken="lg">
            <Text role="label">حالة تشغيل الاختبار</Text>
            <Box gap={2}>
              <Button label="Active" tone="secondary" onPress={() => setInboxState('active')} />
              <Button label="No orders" tone="secondary" onPress={() => setInboxState('noOrders')} />
              <Button label="Delivered" tone="secondary" onPress={() => setInboxState('delivered')} />
              <Button label="Error" tone="secondary" onPress={() => setInboxState('error')} />
            </Box>
          </Surface>
        </Box>
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
        <MobileScrollView fill padding={5} gap={5}>
          <ScreenHeader
            title="طلبات الكابتن"
            subtitle="هذه هي نقطة البداية الحقيقية لتطبيق الكابتن."
            actionLabel="ابدأ من entry"
            onActionPress={openCaptainEntry}
          />

          <Surface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
            <Text role="label" tone="inverse">نقطة البداية الرسمية</Text>
            <Text role="titleLg" tone="inverse">بداية تشغيلية حقيقية للكابتن</Text>
            <Text role="bodyMd" tone="inverse">تطبيق الكابتن يجب أن يبدأ من shell تُظهر الطلبات والحالة والاختصارات، لا من preview service entry.</Text>
          </Surface>

          <Surface tone="raised" padding={5} gap={4} radiusToken="xl">
            <Text role="label">المساحات الأساسية</Text>
            {primaryAreas.map((item) => (
              <Surface key={item} tone="default" padding={4} gap={2} radiusToken="lg">
                <Text role="bodyStrong">{item}</Text>
                <Text role="bodySm" tone="muted">هذه مساحة رئيسية داخل التطبيق الحقيقي وليست preview route.</Text>
              </Surface>
            ))}
          </Surface>

          <Surface tone="default" padding={5} gap={4} radiusToken="xl">
            <Text role="label">اختصارات البداية</Text>
            <Box gap={3}>
              {shortcuts.map((item, index) => (
                <Button
                  key={item}
                  label={item}
                  tone="secondary"
                  onPress={() => {
                    if (index === 0) {
                      setInboxState('active');
                      setRoute('entry');
                      return;
                    }

                    if (index === 1) {
                      openCaptainSupportScreen('cod-balance');
                      return;
                    }

                    openCaptainSupportScreen('profile-get');
                  }}
                />
              ))}
            </Box>
          </Surface>

          <Surface tone="raised" padding={5} gap={4} radiusToken="xl">
            <Text role="label">أدلة الدعم التنفيذية</Text>
            <Text role="bodySm" tone="muted">كل شاشات DSH المتبقية للكابتن أصبحت مجمعة في دليل دعم مركزي داخل نفس shell.</Text>
            <Button label="فتح دليل دعم الكابتن" tone="secondary" onPress={openSupportDirectory} />
          </Surface>

          <Surface tone="inset" padding={4} gap={2} radiusToken="lg">
            <Text role="label">حكم معماري</Text>
            <Text role="bodySm" tone="muted">البدء من home shell يمنع خلط feature preview مع التشغيل الفعلي للتطبيق.</Text>
          </Surface>

          <Button label="ابدأ من entry" onPress={openCaptainEntry} />
        </MobileScrollView>
      </Surface>
      {accountSheet}
    </Box>
  );
}

export default CaptainSurfaceHost;
