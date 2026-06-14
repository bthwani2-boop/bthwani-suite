import React from 'react';
import { View } from 'react-native';
import { Box, Button, TopBar, spacing, MobileScrollView } from '@bthwani/ui-kit';
import type { DshCaptainRoute } from './dsh-captain.types';
import type { CaptainSupportRoute } from '../shared/view-models/captain';
import { DshEntryScreen } from './screens/DshCaptainEntryScreen';
import {
  CaptainDeliveryConfirmSheet,
  CaptainOrderDetailScreen,
  CaptainOrdersInboxScreen,
  CaptainPickupConfirmSheet,
  DshCaptainBellScreen,
  DshCaptainOrderChatScreen,
} from './screens/DshCaptainOrdersScreen';
import { DshCaptainMapScreen } from './screens/DshCaptainMapScreen';
import { DshCaptainPickupDropoffScreen } from './screens/DshCaptainPickupDropoffScreen';
import { DshCaptainPoDSubmissionScreen } from './screens/DshCaptainPoDSubmissionScreen';
import { OfferDeclineSheet } from './sheets';
import { CaptainSupportScreenRouter } from './CaptainSupportScreenRouter';
import type { DshCaptainBellEvent } from '../shared/state-machines/dsh-order-journey.model';
import type { CompactOrderChatMessage } from '../shared/view-models/captain';

type CaptainOrderDetailSummary = React.ComponentProps<typeof CaptainOrderDetailScreen>['summary'];
type CaptainOrdersInboxScreenState = NonNullable<React.ComponentProps<typeof CaptainOrdersInboxScreen>>['state'];
type PodScreenState = NonNullable<React.ComponentProps<typeof DshCaptainPoDSubmissionScreen>['state']>;

export type DshCaptainRouteRendererProps = {
  route: DshCaptainRoute;
  activeOrderId: string;
  activeOrderDisplayId: string;
  activeSummary: CaptainOrderDetailSummary;
  inboxState: CaptainOrdersInboxScreenState;
  orderChatState: 'readOnly' | 'active';
  captainRuntimeId: string;
  captainPodRequired: boolean;
  captainCollectsCod: boolean;
  isStoreCourierMode: boolean;
  selectedSupportScreen: CaptainSupportRoute;
  isPickupSheetVisible: boolean;
  isDeliverySheetVisible: boolean;
  isDeclineSheetVisible: boolean;
  declineOrderId: string;
  declineSheetState: 'ready' | 'loading' | 'success' | 'error';
  pickupSheetState: 'ready' | 'loading' | 'success' | 'error';
  captainPodState: PodScreenState;
  captainPodPhotoUri: string | undefined;
  activeOrderMessages: CompactOrderChatMessage[];
  activeOrderDraft: string;
  showBottomNav: boolean;
  bottomNavNode: React.ReactNode;
  dshAuthBearerToken?: string | null;
  dshClientId?: string | null;
  onOpenOrder: (id: string) => void;
  onRetryInbox: () => void;
  onConfirmPickup: () => void;
  onConfirmDelivery: () => void;
  onConfirmPodSubmission: () => void;
  onReportPodFailure: () => void;
  onCapturePhoto: () => void;
  onRetryPod: () => void;
  onBack: () => void;
  onGoToInbox: () => void;
  onClosePickupSheet: () => void;
  onCloseDeliverySheet: () => void;
  onCloseDeclineSheet: () => void;
  onConfirmDecline: (orderId: string, reason: string) => void;
  onAcceptTask: (orderId: string) => void;
  onDeclineTask: (id: string) => void;
  onOpenSupportScreen: (screenId: CaptainSupportRoute) => void;
  onOpenSupportDirectory: () => void;
  onPushLocation: (orderId: string, lat: number, lng: number) => void;
  onRingBell: () => void;
};

const routeHeaderMeta: Partial<Record<DshCaptainRoute, { title: string; subtitle: string }>> = {
  entry:          { title: 'بوابة التنفيذ',    subtitle: 'ابدأ من الفرز والقبول.' },
  inbox:          { title: 'صندوق الطلبات',    subtitle: 'الطلب النشط أولًا.' },
  detail:         { title: 'تفاصيل الطلب',     subtitle: 'راجع الطلب قبل التنفيذ.' },
  orderchat:      { title: 'تواصل الطلب',       subtitle: 'مراسلات قصيرة.' },
  map:            { title: 'خريطة المهمة',      subtitle: 'عرض المسار.' },
  'pickup-dropoff': { title: 'الاستلام والتسليم', subtitle: 'مراحل التسليم.' },
  'pod-submission': { title: 'إثبات التسليم',    subtitle: 'التقاط صورة الإثبات.' },
};

export function DshCaptainRouteRenderer(props: DshCaptainRouteRendererProps) {
  const {
    route, activeOrderId, activeOrderDisplayId, activeSummary, inboxState, orderChatState,
    captainRuntimeId, captainPodRequired, captainCollectsCod, isStoreCourierMode,
    selectedSupportScreen, isPickupSheetVisible, isDeliverySheetVisible, isDeclineSheetVisible,
    declineOrderId, declineSheetState, pickupSheetState, captainPodState, captainPodPhotoUri,
    activeOrderMessages, activeOrderDraft, showBottomNav, bottomNavNode,
    dshAuthBearerToken, dshClientId,
    onOpenOrder, onRetryInbox, onConfirmPickup, onConfirmDelivery, onConfirmPodSubmission,
    onReportPodFailure, onCapturePhoto, onRetryPod, onBack, onGoToInbox,
    onClosePickupSheet, onCloseDeliverySheet, onCloseDeclineSheet, onConfirmDecline,
    onAcceptTask, onDeclineTask, onOpenSupportScreen, onOpenSupportDirectory, onPushLocation,
    onRingBell,
  } = props;

  void captainRuntimeId;
  void activeOrderDisplayId;
  void captainCollectsCod;
  void activeOrderMessages;
  void activeOrderDraft;
  void onRingBell;

  const captainEntryState = inboxState === 'loading' ? 'loading' : inboxState === 'empty' ? 'empty' : 'ready';

  function renderFlow() {
    if (route === 'entry') return (
      <DshEntryScreen
        state={captainEntryState}
        onOpenOffersPress={onGoToInbox}
        onOpenExecutionPress={() => onOpenOrder(activeOrderId)}
        onOpenProofCapturePress={() => onOpenOrder(activeOrderId)}
      />
    );

    if (route === 'inbox') return (
      <CaptainOrdersInboxScreen
        state={inboxState}
        onRetry={onRetryInbox}
        onOpenOrder={onOpenOrder}
        onOpenNextOrder={onOpenOrder}
      />
    );

    if (route === 'detail') return (
      <>
        <Box gap={3}>
          <CaptainOrderDetailScreen
            summary={activeSummary}
            onConfirmPickup={onConfirmPickup}
            onConfirmDelivery={onConfirmDelivery}
            onOpenNextOrder={onGoToInbox}
            onRetry={() => { /* route stays on detail */ }}
          />
          <Button label="فتح تواصل الطلب" tone="secondary" fullWidth={false} onPress={() => onOpenSupportScreen('orders-list')} />
          <Button label="مرحلة الاستلام والتسليم" tone="secondary" fullWidth={false} onPress={() => onOpenSupportScreen('order-pickup')} />
        </Box>
        <CaptainPickupConfirmSheet
          visible={isPickupSheetVisible}
          orderTitle={activeSummary.orderId}
          state={pickupSheetState}
          onConfirm={onConfirmPickup}
          onCancel={onClosePickupSheet}
        />
        <CaptainDeliveryConfirmSheet
          visible={isDeliverySheetVisible}
          orderTitle={activeSummary.orderId}
          onConfirm={onConfirmDelivery}
          onCancel={onCloseDeliverySheet}
        />
        <OfferDeclineSheet
          visible={isDeclineSheetVisible}
          offerId={declineOrderId}
          state={declineSheetState}
          onConfirmDecline={onConfirmDecline}
          onClose={onCloseDeclineSheet}
        />
      </>
    );

    if (route === 'bell') return (
      <DshCaptainBellScreen
        onOpenInbox={onGoToInbox}
        onOpenNextOrder={() => onOpenOrder(activeOrderId)}
        onRetry={() => { /* bell screen self-retry */ }}
      />
    );

    if (route === 'orderchat') return (
      <DshCaptainOrderChatScreen
        orderId={activeSummary.orderId}
        pickupLabel={activeSummary.pickupLabel}
        dropoffLabel={activeSummary.dropoffLabel}
        state={orderChatState}
      />
    );

    if (route === 'map') return (
      <DshCaptainMapScreen
        orderId={activeOrderId}
        captainId={captainRuntimeId || undefined}
        onBack={onBack}
        onPushLocation={onPushLocation}
      />
    );

    if (route === 'pickup-dropoff') return (
      <DshCaptainPickupDropoffScreen
        mode="pickup"
        orderId={activeOrderId}
        storeName={activeSummary.pickupLabel}
        customerName="العميل"
        address={activeSummary.dropoffLabel}
        itemsCount={3}
        onConfirm={() => onOpenSupportScreen('proof-upload')}
        onReportIssue={onGoToInbox}
        onBack={onBack}
        onRingBell={() => {
          void ({ orderId: activeOrderId, captainId: captainRuntimeId, timestamp: new Date().toISOString(), proximityState: 'bell_rang' } satisfies DshCaptainBellEvent);
        }}
      />
    );

    if (route === 'pod-submission' && captainPodRequired) return (
      <DshCaptainPoDSubmissionScreen
        state={captainPodState}
        orderId={activeOrderId}
        onCapturePhoto={onCapturePhoto}
        onConfirm={onConfirmPodSubmission}
        onReportFailure={onReportPodFailure}
        onRetry={onRetryPod}
        onBack={captainPodState === 'success' ? onGoToInbox : onBack}
        photoUri={captainPodPhotoUri}
      />
    );

    return null;
  }

  const meta = routeHeaderMeta[route];
  return (
    <View style={{ flex: 1 }}>
      {meta && <TopBar variant="surface" title={meta.title} subtitle={meta.subtitle} />}
      <View style={{ flex: 1, paddingBottom: showBottomNav ? 80 : 0 }}>
        <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: spacing[8] }}>
          <Box padding={4} gap={4}>{renderFlow()}</Box>
        </MobileScrollView>
      </View>
      {showBottomNav && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
          {bottomNavNode}
        </View>
      )}
    </View>
  );
}

export function DshCaptainAccountShell(props: {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  showBottomNav: boolean;
  bottomNavNode: React.ReactNode;
  surfaceBackground: string;
}) {
  const { title, subtitle, content, showBottomNav, bottomNavNode, surfaceBackground } = props;
  return (
    <View style={{ flex: 1, backgroundColor: surfaceBackground }}>
      <TopBar variant="surface" title={title} subtitle={subtitle} />
      <Box style={{ flex: 1, paddingBottom: showBottomNav ? 80 : 0 }}>
        <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: spacing[8] }}>
          <Box padding={4} gap={4}>{content}</Box>
        </MobileScrollView>
      </Box>
      {showBottomNav && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
          {bottomNavNode}
        </View>
      )}
    </View>
  );
}
