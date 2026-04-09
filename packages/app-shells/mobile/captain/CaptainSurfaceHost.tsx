import React from 'react';
import { BthBox, BthButton, BthMobileScrollView, BthScreenHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { dsh } from '@bthwani/surfaces';

const {
  CaptainDeliveryConfirmSheet,
  CaptainPickupConfirmSheet,
  CaptainTaskDetailScreen,
  CaptainTasksInboxScreen,
} = dsh.dshAppCaptain;

type CaptainTaskDetailSummary = React.ComponentProps<typeof CaptainTaskDetailScreen>['summary'];
type CaptainTasksInboxScreenState = React.ComponentProps<typeof CaptainTasksInboxScreen>['state'];

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

type CaptainRoute = 'home' | 'inbox' | 'detail';

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
  const [route, setRoute] = React.useState<CaptainRoute>('home');
  const [inboxState, setInboxState] = React.useState<CaptainTasksInboxScreenState>('active');
  const [activeTaskId, setActiveTaskId] = React.useState<string>('captain-task-9021');
  const [isPickupSheetVisible, setIsPickupSheetVisible] = React.useState(false);
  const [isDeliverySheetVisible, setIsDeliverySheetVisible] = React.useState(false);

  const activeSummary = defaultDetailByTaskId[activeTaskId] ?? defaultDetailByTaskId['captain-task-9021'];

  if (!activeSummary) {
    return null;
  }

  const openTaskDetail = (taskId: string) => {
    setActiveTaskId(taskId);
    setRoute('detail');
  };

  const renderCaptainFlow = () => {
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

  if (route !== 'home') {
    return (
      <>
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
        {renderCaptainFlow()}
      </>
    );
  }

  return (
    <BthMobileScrollView fill padding={5} gap={5}>
      <BthScreenHeader
        title="مهام الكابتن"
        subtitle="هذه هي نقطة البداية الحقيقية لتطبيق الكابتن."
        actionLabel="ابدأ الاستلام"
        onActionPress={() => setRoute('inbox')}
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
                  setRoute('inbox');
                  return;
                }

                if (index === 1) {
                  setInboxState('delivered');
                  setRoute('inbox');
                  return;
                }

                setInboxState('noTasks');
                setRoute('inbox');
              }}
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" padding={4} gap={2} radiusToken="lg">
        <BthText role="label">حكم معماري</BthText>
        <BthText role="bodySm" tone="muted">البدء من home shell يمنع خلط feature preview مع التشغيل الفعلي للتطبيق.</BthText>
      </BthSurface>

      <BthButton label="ابدأ الاستلام" onPress={() => setRoute('inbox')} />
    </BthMobileScrollView>
  );
}

export default CaptainSurfaceHost;