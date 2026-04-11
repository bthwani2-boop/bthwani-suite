import React from 'react';
import { BthBox, BthButton, BthMobileScrollView, BthScreenHeader, BthStateView, BthSurface, BthText } from '@bthwani/ui-kit';
import { dsh } from '@bthwani/surfaces';
import { UnifiedMobileTopBar } from '../shared/UnifiedMobileTopBar';
import { MobileAccountSheet, type MobileAccountTypeOption } from '../shared/MobileAccountSheet';

const {
  DshEntryScreen,
  CaptainDeliveryConfirmSheet,
  CaptainPickupConfirmSheet,
  CaptainTaskDetailScreen,
  CaptainTasksInboxScreen,
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
} = dsh.dshAppCaptain;

type CaptainTaskDetailSummary = React.ComponentProps<typeof CaptainTaskDetailScreen>['summary'];
type CaptainTasksInboxScreenState = React.ComponentProps<typeof CaptainTasksInboxScreen>['state'];
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
  'المهام',
  'الأرباح',
  'الحالة'
] as const;

const shortcuts = [
  'المهام الحالية',
  'ملخص الأرباح',
  'تبديل الحالة'
] as const;

type CaptainRoute = 'home' | 'entry' | 'inbox' | 'detail' | 'support-directory' | 'support-screen';
type CaptainServiceType = 'dsh' | 'amn';

const captainTypeOptions: readonly MobileAccountTypeOption[] = [
  { id: 'dsh', label: 'DSH', description: 'تشغيل الطلبات والمهام اليومية' },
  { id: 'amn', label: 'AMN', description: 'تشغيل الأمان والمراقبة' },
];

const defaultDetailByTaskId: Record<string, CaptainTaskDetailSummary> = {
  'captain-task-9021': {
    taskId: 'captain-task-9021',
    pickupLabel: 'Burger Lab - Hittin branch',
    dropoffLabel: 'Olaya District, King Fahad Road',
    etaLabel: 'ETA to pickup: 8 min',
    currentStageLabel: 'Heading to pickup',
    nextActionLabel: 'Confirm pickup once package is collected',
  },
  'captain-task-9024': {
    taskId: 'captain-task-9024',
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
  const [inboxState, setInboxState] = React.useState<CaptainTasksInboxScreenState>('active');
  const [activeTaskId, setActiveTaskId] = React.useState<string>('captain-task-9021');
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<CaptainSupportRoute>('orders-list');
  const [isPickupSheetVisible, setIsPickupSheetVisible] = React.useState(false);
  const [isDeliverySheetVisible, setIsDeliverySheetVisible] = React.useState(false);
  const [accountSheetVisible, setAccountSheetVisible] = React.useState(false);

  const activeSummary = defaultDetailByTaskId[activeTaskId] ?? defaultDetailByTaskId['captain-task-9021'];

  if (!activeSummary) {
    return null;
  }

  const openTaskDetail = (taskId: string) => {
    setActiveTaskId(taskId);
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
    setActiveTaskId('captain-task-9021');
    setIsPickupSheetVisible(false);
    setIsDeliverySheetVisible(false);
  }, []);

  const captainEntryState = inboxState === 'loading' ? 'loading' : inboxState === 'noTasks' ? 'empty' : 'ready';

  const renderCaptainFlow = () => {
    if (route === 'entry') {
      return (
        <DshEntryScreen
          state={captainEntryState}
          onOpenOffersPress={() => setRoute('inbox')}
          onOpenExecutionPress={() => setRoute('detail')}
          onOpenProofCapturePress={() => {
            setActiveTaskId('captain-task-9021');
            setIsDeliverySheetVisible(true);
            setRoute('detail');
          }}
        />
      );
    }

    if (route === 'inbox') {
      return (
        <CaptainTasksInboxScreen
          state={inboxState}
          onRetry={() => setInboxState('active')}
          onOpenTask={openTaskDetail}
          onOpenNextTask={openTaskDetail}
        />
      );
    }

    if (route === 'detail') {
      return (
        <>
          <CaptainTaskDetailScreen
            summary={activeSummary}
            onConfirmPickup={() => setIsPickupSheetVisible(true)}
            onConfirmDelivery={() => setIsDeliverySheetVisible(true)}
            onOpenNextTask={() => setRoute('inbox')}
            onBackToInbox={() => setRoute('inbox')}
            onRetry={() => setRoute('detail')}
          />

          <CaptainPickupConfirmSheet
            visible={isPickupSheetVisible}
            taskTitle={activeSummary.taskId}
            onConfirm={() => setIsPickupSheetVisible(false)}
            onCancel={() => setIsPickupSheetVisible(false)}
          />

          <CaptainDeliveryConfirmSheet
            visible={isDeliverySheetVisible}
            taskTitle={activeSummary.taskId}
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

    return null;
  };

  const topBar = (
    <UnifiedMobileTopBar
      title="بثواني"
      subtitle="تطبيق الكابتن"
      locationLabel="الرياض، خط التشغيل الشمالي"
      actions={[
        {
          id: 'profile',
          iconName: 'person-outline',
          accessibilityLabel: 'الحساب',
          onPress: () => setAccountSheetVisible(true),
        },
        { id: 'notifications', iconName: 'notifications-outline', badgeCount: 2, accessibilityLabel: 'الإشعارات' },
        {
          id: 'tasks',
          iconName: 'bicycle-outline',
          accessibilityLabel: 'المهام',
          onPress: () => {
            if (activeServiceType === 'dsh') {
              setRoute('entry');
            }
          },
        },
        { id: 'search', iconName: 'search-outline', accessibilityLabel: 'الدعم', onPress: openSupportDirectory },
      ]}
      ticker={{
        statusLabel: activeServiceType === 'dsh' ? 'مباشر' : 'وضع AMN',
        message:
          activeServiceType === 'dsh'
            ? 'أولوية اليوم: مهمة الاستلام الأولى خلال 8 دقائق'
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
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthSurface
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
          <BthStateView stateId="loading" title="تم تفعيل وضع AMN" description="التطبيق الآن في سياق AMN بالكامل. يجري تجهيز الشاشات التنفيذية الخاصة بهذا النوع." />
          <BthButton label="العودة للرئيسية" tone="secondary" onPress={() => setRoute('home')} />
        </BthSurface>
        {accountSheet}
      </BthBox>
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
      <BthBox style={{ flex: 1 }} background="background">
        {topBar}
        <BthBox padding={4} gap={3}>
          <BthButton label="العودة للرئيسية" tone="secondary" onPress={() => setRoute('home')} />
          <BthSurface tone="inset" padding={3} gap={2} radiusToken="lg">
            <BthText role="label">حالة تشغيل الاختبار</BthText>
            <BthBox gap={2}>
              <BthButton label="Active" tone="secondary" onPress={() => setInboxState('active')} />
              <BthButton label="No tasks" tone="secondary" onPress={() => setInboxState('noTasks')} />
              <BthButton label="Delivered" tone="secondary" onPress={() => setInboxState('delivered')} />
              <BthButton label="Error" tone="secondary" onPress={() => setInboxState('error')} />
            </BthBox>
          </BthSurface>
        </BthBox>
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
          {content}
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
            title="مهام الكابتن"
            subtitle="هذه هي نقطة البداية الحقيقية لتطبيق الكابتن."
            actionLabel="ابدأ من entry"
            onActionPress={openCaptainEntry}
          />

          <BthSurface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
            <BthText role="label" tone="inverse">نقطة البداية الرسمية</BthText>
            <BthText role="titleLg" tone="inverse">بداية تشغيلية حقيقية للكابتن</BthText>
            <BthText role="bodyMd" tone="inverse">تطبيق الكابتن يجب أن يبدأ من shell تُظهر المهام والحالة والاختصارات، لا من preview service entry.</BthText>
          </BthSurface>

          <BthSurface tone="raised" padding={5} gap={4} radiusToken="xl">
            <BthText role="label">المساحات الأساسية</BthText>
            {primaryAreas.map((item) => (
              <BthSurface key={item} tone="default" padding={4} gap={2} radiusToken="lg">
                <BthText role="bodyStrong">{item}</BthText>
                <BthText role="bodySm" tone="muted">هذه مساحة رئيسية داخل التطبيق الحقيقي وليست preview route.</BthText>
              </BthSurface>
            ))}
          </BthSurface>

          <BthSurface tone="default" padding={5} gap={4} radiusToken="xl">
            <BthText role="label">اختصارات البداية</BthText>
            <BthBox gap={3}>
              {shortcuts.map((item, index) => (
                <BthButton
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
            </BthBox>
          </BthSurface>

          <BthSurface tone="raised" padding={5} gap={4} radiusToken="xl">
            <BthText role="label">أدلة الدعم التنفيذية</BthText>
            <BthText role="bodySm" tone="muted">كل شاشات DSH المتبقية للكابتن أصبحت مجمعة في دليل دعم مركزي داخل نفس shell.</BthText>
            <BthButton label="فتح دليل دعم الكابتن" tone="secondary" onPress={openSupportDirectory} />
          </BthSurface>

          <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
            <BthText role="label">حكم معماري</BthText>
            <BthText role="bodySm" tone="muted">البدء من home shell يمنع خلط feature preview مع التشغيل الفعلي للتطبيق.</BthText>
          </BthSurface>

          <BthButton label="ابدأ من entry" onPress={openCaptainEntry} />
        </BthMobileScrollView>
      </BthSurface>
      {accountSheet}
    </BthBox>
  );
}

export default CaptainSurfaceHost;