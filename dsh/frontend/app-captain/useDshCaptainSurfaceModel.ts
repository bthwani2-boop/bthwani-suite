// Thin composition shell — authority moved to dsh/frontend/shared/captain/captain.surface-model.ts
// Instantiates the topic state-holding hooks and passes them to the shared orchestration model.

import React from 'react';
import {
  useDshCaptainSurfaceModel as useDshCaptainSurfaceModelShared,
  type DshCaptainRoute,
  type CaptainSupportRoute,
  type DshCaptainNavigationCommand,
} from '../shared/captain';

// Import state-holding topic hooks from shared
import { useCaptainAvailabilityModel } from '../shared/captain/captain-availability.model';
import { useCaptainGpsModel } from '../shared/captain/captain-gps.model';
import { useCaptainProfileModel } from '../shared/captain/captain-profile.model';
import { useDeliveryLifecycle } from '../shared/delivery/delivery.lifecycle';
import { useCaptainDeliveryActions } from '../shared/delivery/delivery.actions';
import { usePodUploadFlow } from '../shared/media/pod/pod-upload-flow';
import { useCaptainOrderModel } from '../shared/orders/captain-order.model';
import { useCaptainChatModel } from '../shared/support/captain-chat.model';
import { useCaptainNavigationModel } from '../shared/captain/captain-navigation.model';
import { useCaptainServiceModeModel } from '../shared/captain/captain-service-mode.model';
import { getRouteForCommandTarget } from '../shared/delivery/delivery.policy';
import {
  useCaptainOrderRuntime,
  useCaptainActiveLocationPush,
} from '../shared/captain/use-captain-order-runtime';

export type {
  ActiveOrderPhase,
  StoreCourierStage,
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from '../shared/captain';

export function useDshCaptainSurfaceModel(
  command: DshCaptainNavigationCommand,
  captainRuntimeId: string,
) {
  const [route, setRoute] = React.useState<DshCaptainRoute>(getRouteForCommandTarget(command.target));
  const [selectedSupportScreen, setSelectedSupportScreen] = React.useState<CaptainSupportRoute>('orders-list');

  // Topic states and actions
  const availabilityModel = useCaptainAvailabilityModel();
  const gpsModel = useCaptainGpsModel();
  const profileModel = useCaptainProfileModel();
  const lifecycle = useDeliveryLifecycle();
  const podUpload = usePodUploadFlow();
  const orderModel = useCaptainOrderModel();
  const chatModel = useCaptainChatModel();

  const captainOrderRuntime = useCaptainOrderRuntime();
  useCaptainActiveLocationPush({
    activeOrderId: orderModel.activeOrderId,
    captainId: captainRuntimeId,
    lifecycleStatus: lifecycle.inboxState,
  });

  // ── Topic models navigation & mode switching ─────────────────────────────────
  const navModel = useCaptainNavigationModel({
    command,
    route,
    setRoute,
    setActiveOrderId: orderModel.setActiveOrderId,
    setSelectedSupportScreen,
  });

  const serviceModeModel = useCaptainServiceModeModel({
    setActiveServiceType: profileModel.setActiveServiceType,
    setRoute,
    setInboxState: lifecycle.setInboxState,
    setActiveOrderId: orderModel.setActiveOrderId,
    setActiveOrderExpanded: orderModel.setActiveOrderExpanded,
    setIsPickupSheetVisible: lifecycle.setIsPickupSheetVisible,
    setIsDeliverySheetVisible: lifecycle.setIsDeliverySheetVisible,
    setCaptainAppMode: profileModel.setCaptainAppMode,
  });

  // ── Reset helpers shared across delivery + pod ────────────────────────────────
  const resetOrderState = React.useCallback(() => {
    orderModel.setActiveOrderExpanded(false);
    lifecycle.setActiveOrderPhase('pickup');
    chatModel.setActiveOrderDraft('');
    chatModel.setActiveOrderMessages([]);
    podUpload.resetPodFields();
  }, [orderModel, lifecycle, chatModel, podUpload]);

  // ── Delivery actions ──────────────────────────────────────────────────────────
  const deliveryActions = useCaptainDeliveryActions({
    captainRuntimeId,
    activeOrderId: orderModel.activeOrderId,
    setActiveOrderId: orderModel.setActiveOrderId,
    captainPodPhotoUri: podUpload.captainPodPhotoUri,
    captainPodMediaKey: podUpload.captainPodMediaKey,
    captainAppMode: profileModel.captainAppMode,
    setRoute,
    resetOrderState,
    inboxState: lifecycle.inboxState,
    setInboxState: lifecycle.setInboxState,
    setStoreCourierStage: lifecycle.setStoreCourierStage,
    setIsDeclineSheetVisible: lifecycle.setIsDeclineSheetVisible,
    setDeclineSheetState: lifecycle.setDeclineSheetState,
    setIsPickupSheetVisible: lifecycle.setIsPickupSheetVisible,
    setPickupSheetState: lifecycle.setPickupSheetState,
    setActiveOrderPhase: lifecycle.setActiveOrderPhase,
    setActiveOrderMessages: chatModel.setActiveOrderMessages,
    setCaptainPodState: podUpload.setCaptainPodState,
    setActiveOrderExpanded: orderModel.setActiveOrderExpanded,
  });

  // ── Location push bridge ──────────────────────────────────────────────────────
  const pushLocation = React.useCallback((push: any) => {
    return captainOrderRuntime.pushLocation(push);
  }, [captainOrderRuntime]);

  return useDshCaptainSurfaceModelShared({
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
  });
}
