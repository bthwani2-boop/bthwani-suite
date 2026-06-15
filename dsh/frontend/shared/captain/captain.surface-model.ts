// Canonical location: dsh/frontend/shared/captain/captain.surface-model.ts
// Authority: dsh/frontend/shared/captain — thin orchestration shell for captain surface.
// Wires topic models (navigation, chat, service-mode, pod, delivery) around shared state.
// Composition-only: no local React state or side-effects.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type {
  DshCaptainRoute,
  CaptainSupportRoute,
  CompactOrderChatMessage,
} from './captain.contract';
import type {
  DshCaptainLocationPush,
} from './use-captain-order-runtime';
import type {
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from './captain.surface.types';
import { buildCaptainDerived } from './captain.derived';

// Import type annotations for sub-models
import type { useCaptainAvailabilityModel } from './captain-availability.model';
import type { useCaptainGpsModel } from './captain-gps.model';
import type { useCaptainProfileModel } from './captain-profile.model';
import type { useDeliveryLifecycle } from '../delivery/delivery.lifecycle';
import type { useCaptainDeliveryActions } from '../delivery/delivery.actions';
import type { usePodUploadFlow } from '../media/pod/pod-upload-flow';
import type { useCaptainOrderModel } from '../orders/captain-order.model';
import type { useCaptainChatModel } from '../support/captain-chat.model';
import type { useCaptainNavigationModel } from './captain-navigation.model';
import type { useCaptainServiceModeModel } from './captain-service-mode.model';

export type {
  ActiveOrderPhase,
  StoreCourierStage,
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from './captain.surface.types';

export type DshCaptainSurfaceSharedProps = {
  command: DshCaptainNavigationCommand;
  captainRuntimeId: string;

  // Pre-instantiated state & setters
  route: DshCaptainRoute;
  setRoute: React.Dispatch<React.SetStateAction<DshCaptainRoute>>;
  selectedSupportScreen: CaptainSupportRoute;
  setSelectedSupportScreen: React.Dispatch<React.SetStateAction<CaptainSupportRoute>>;

  // Pre-instantiated topic models
  availabilityModel: ReturnType<typeof useCaptainAvailabilityModel>;
  gpsModel: ReturnType<typeof useCaptainGpsModel>;
  profileModel: ReturnType<typeof useCaptainProfileModel>;
  lifecycle: ReturnType<typeof useDeliveryLifecycle>;
  podUpload: ReturnType<typeof usePodUploadFlow>;
  orderModel: ReturnType<typeof useCaptainOrderModel>;
  chatModel: ReturnType<typeof useCaptainChatModel>;
  navModel: ReturnType<typeof useCaptainNavigationModel>;
  serviceModeModel: ReturnType<typeof useCaptainServiceModeModel>;
  deliveryActions: ReturnType<typeof useCaptainDeliveryActions>;
  pushLocation: (push: DshCaptainLocationPush) => Promise<any>;
};

export function useDshCaptainSurfaceModel({
  command,
  captainRuntimeId,
  route,
  setRoute,
  selectedSupportScreen,
  setSelectedSupportScreen,
  availabilityModel,
  gpsModel,
  profileModel,
  lifecycle,
  podUpload,
  orderModel,
  chatModel,
  navModel,
  serviceModeModel,
  deliveryActions,
  pushLocation,
}: DshCaptainSurfaceSharedProps): {
  state: DshCaptainSurfaceState;
  actions: ReturnType<typeof buildCaptainActions>;
  derived: DshCaptainSurfaceDerived;
} {
  // ── State aggregation for backward compatibility ──────────────────────────────
  const state: DshCaptainSurfaceState = {
    activeServiceType: profileModel.activeServiceType,
    route,
    inboxState: lifecycle.inboxState,
    activeOrderId: orderModel.activeOrderId,
    selectedSupportScreen,
    isPickupSheetVisible: lifecycle.isPickupSheetVisible,
    isDeliverySheetVisible: lifecycle.isDeliverySheetVisible,
    captainAvailabilityStatus: availabilityModel.captainAvailabilityStatus,
    gpsStatus: gpsModel.gpsStatus,
    activeOrderExpanded: orderModel.activeOrderExpanded,
    activeOrderPhase: lifecycle.activeOrderPhase,
    captainAppMode: profileModel.captainAppMode,
    activeOrderDraft: chatModel.activeOrderDraft,
    activeOrderMessages: chatModel.activeOrderMessages,
    storeCourierStage: lifecycle.storeCourierStage,
    captainPodState: podUpload.captainPodState,
    captainPodPhotoUri: podUpload.captainPodPhotoUri,
    captainPodMediaKey: podUpload.captainPodMediaKey,
    isDeclineSheetVisible: lifecycle.isDeclineSheetVisible,
    declineSheetState: lifecycle.declineSheetState,
    declineOrderId: lifecycle.declineOrderId,
    pickupSheetState: lifecycle.pickupSheetState,
  };

  // ── Derived state ─────────────────────────────────────────────────────────────
  const derivedCallbacks = React.useMemo(() => ({
    toggleAvailability: availabilityModel.toggleAvailability,
    goToInbox: navModel.goToInbox,
    resetInboxState: () => lifecycle.setInboxState('ready'),
    toggleOrderExpanded: orderModel.toggleOrderExpanded,
  }), [availabilityModel.toggleAvailability, navModel.goToInbox, lifecycle, orderModel.toggleOrderExpanded]);

  const derived: DshCaptainSurfaceDerived = React.useMemo(
    () => buildCaptainDerived(state, derivedCallbacks),
    [state, derivedCallbacks],
  );

  const actions = buildCaptainActions({
    set: <k extends keyof DshCaptainSurfaceState>(
      key: k,
      value: DshCaptainSurfaceState[k] | ((current: DshCaptainSurfaceState[k]) => DshCaptainSurfaceState[k]),
    ) => {
      const applySetter = (setter: any, val: any) => {
        if (typeof val === 'function') {
          setter((cur: any) => val(cur));
        } else {
          setter(val);
        }
      };
      if (key === 'route') applySetter(setRoute, value);
      else if (key === 'inboxState') applySetter(lifecycle.setInboxState, value);
      else if (key === 'activeOrderId') applySetter(orderModel.setActiveOrderId, value);
      else if (key === 'selectedSupportScreen') applySetter(setSelectedSupportScreen, value);
      else if (key === 'isPickupSheetVisible') applySetter(lifecycle.setIsPickupSheetVisible, value);
      else if (key === 'isDeliverySheetVisible') applySetter(lifecycle.setIsDeliverySheetVisible, value);
      else if (key === 'captainAvailabilityStatus') applySetter(availabilityModel.setCaptainAvailabilityStatus, value);
      else if (key === 'gpsStatus') applySetter(gpsModel.setGpsStatus, value);
      else if (key === 'activeOrderExpanded') applySetter(orderModel.setActiveOrderExpanded, value);
      else if (key === 'activeOrderPhase') applySetter(lifecycle.setActiveOrderPhase, value);
      else if (key === 'captainAppMode') applySetter(profileModel.setCaptainAppMode, value);
      else if (key === 'activeOrderDraft') applySetter(chatModel.setActiveOrderDraft, value);
      else if (key === 'activeOrderMessages') applySetter(chatModel.setActiveOrderMessages, value);
      else if (key === 'storeCourierStage') applySetter(lifecycle.setStoreCourierStage, value);
      else if (key === 'captainPodState') applySetter(podUpload.setCaptainPodState, value);
      else if (key === 'captainPodPhotoUri') applySetter(podUpload.setCaptainPodPhotoUri, value);
      else if (key === 'captainPodMediaKey') applySetter(podUpload.setCaptainPodMediaKey, value);
      else if (key === 'isDeclineSheetVisible') applySetter(lifecycle.setIsDeclineSheetVisible, value);
      else if (key === 'declineSheetState') applySetter(lifecycle.setDeclineSheetState, value);
      else if (key === 'declineOrderId') applySetter(lifecycle.setDeclineOrderId, value);
      else if (key === 'pickupSheetState') applySetter(lifecycle.setPickupSheetState, value);
    },
    goBack: navModel.goBack,
    openOrderDetail: navModel.openOrderDetail,
    openCaptainAccount: navModel.openCaptainAccount,
    openCaptainAccountSection: navModel.openCaptainAccountSection,
    openSupportDirectory: navModel.openSupportDirectory,
    openCaptainSupportScreen: navModel.openCaptainSupportScreen,
    goToInbox: navModel.goToInbox,
    resetInboxState: () => lifecycle.setInboxState('ready'),
    sendQuickMessage: chatModel.sendQuickMessage,
    handleSelectServiceType: serviceModeModel.handleSelectServiceType,
    openStoreCourierProof: () => podUpload.openStoreCourierProof(profileModel.captainAppMode, setRoute),
    toggleStoreCourierMode: serviceModeModel.toggleStoreCourierMode,
    pushLocation,
    ...deliveryActions,
  });

  return { state, actions, derived };
}

function buildCaptainActions(a: {
  set: <k extends keyof DshCaptainSurfaceState>(key: k, value: DshCaptainSurfaceState[k] | ((c: DshCaptainSurfaceState[k]) => DshCaptainSurfaceState[k])) => void;
  handleAcceptTask: (orderId: string) => Promise<void>;
  handleDeclineConfirm: (orderId: string, reason: string) => Promise<void>;
  confirmPickup: () => Promise<void>;
  confirmDelivery: () => Promise<void>;
  confirmPodSubmission: () => Promise<void>;
  reportPodFailure: () => Promise<void>;
  goBack: () => boolean;
  openOrderDetail: (id: string) => void;
  openCaptainAccount: () => void;
  openCaptainAccountSection: (r: DshCaptainRoute) => void;
  openSupportDirectory: () => void;
  openCaptainSupportScreen: (screenId: CaptainSupportRoute) => void;
  goToInbox: () => void;
  resetInboxState: () => void;
  sendQuickMessage: () => void;
  handleSelectServiceType: (typeId: string) => void;
  openStoreCourierProof: () => void;
  toggleStoreCourierMode: (next: boolean) => void;
  pushLocation: (push: DshCaptainLocationPush) => void;
}) {
  return a;
}
