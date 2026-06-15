import React from 'react';
import type { CompactOrderChatMessage, CaptainAppMode } from './captain.contract';
import type { DshCaptainSurfaceState, StoreCourierStage } from './captain.surface.types';
import { resolveDshRuntimeOrderId, useCaptainOrderRuntime } from './use-captain-order-runtime';

type SetField = <k extends keyof DshCaptainSurfaceState>(
  key: k,
  value: DshCaptainSurfaceState[k] | ((c: DshCaptainSurfaceState[k]) => DshCaptainSurfaceState[k]),
) => void;

export type CaptainDeliveryActionDeps = {
  captainOrderRuntime: ReturnType<typeof useCaptainOrderRuntime>;
  captainRuntimeId: string;
  activeOrderId: string;
  captainPodPhotoUri: string | undefined;
  captainPodMediaKey: string | undefined;
  captainAppMode: CaptainAppMode;
  set: SetField;
  resetOrderState: () => void;
};

export function useCaptainDeliveryActions(deps: CaptainDeliveryActionDeps) {
  const { captainOrderRuntime, captainRuntimeId, activeOrderId, captainPodPhotoUri, captainPodMediaKey, captainAppMode, set, resetOrderState } = deps;

  const handleAcceptTask = React.useCallback(async (orderId: string) => {
    if (!captainRuntimeId) return void set('inboxState', 'error');
    try {
      set('inboxState', 'offer-accepting');
      await captainOrderRuntime.acceptTask(resolveDshRuntimeOrderId(orderId), captainRuntimeId);
      set('inboxState', 'offer-accepted');
      set('activeOrderId', orderId);
      resetOrderState();
      if (captainAppMode !== 'store_courier_mode') set('storeCourierStage', 'ready_for_pickup' as StoreCourierStage);
      set('route', 'detail');
      set('inboxState', 'ready');
    } catch (err) {
      console.error('[captain:accept-task]', err);
      set('inboxState', 'error');
    }
  }, [captainOrderRuntime, captainRuntimeId, captainAppMode, set, resetOrderState]);

  const handleDeclineConfirm = React.useCallback(async (orderId: string, reason: string) => {
    if (!captainRuntimeId) return void set('declineSheetState', 'error');
    try {
      set('declineSheetState', 'loading');
      await captainOrderRuntime.declineTask(resolveDshRuntimeOrderId(orderId), captainRuntimeId, reason);
      set('declineSheetState', 'success');
      setTimeout(() => {
        set('isDeclineSheetVisible', false);
        set('declineSheetState', 'ready');
        set('route', 'inbox');
      }, 1000);
    } catch (err) {
      console.error('[captain:decline-task]', err);
      set('declineSheetState', 'error');
    }
  }, [captainOrderRuntime, captainRuntimeId, set]);

  const confirmPickup = React.useCallback(async () => {
    if (!captainRuntimeId) return void set('pickupSheetState', 'error');
    try {
      set('pickupSheetState', 'loading');
      await captainOrderRuntime.confirmPickup(resolveDshRuntimeOrderId(activeOrderId), captainRuntimeId);
      set('pickupSheetState', 'success');
      setTimeout(() => {
        set('isPickupSheetVisible', false);
        set('pickupSheetState', 'ready');
        set('activeOrderPhase', 'delivery');
        set('activeOrderMessages', (cur: CompactOrderChatMessage[]) => [
          ...cur,
          { id: `msg-${cur.length + 1}`, sender: 'النظام', text: 'تم تأكيد الاستلام. المرحلة التالية هي التسليم.', time: 'الآن', side: 'start' },
        ]);
      }, 1000);
    } catch (err) {
      console.error('[captain:confirm-pickup]', err);
      set('pickupSheetState', 'error');
    }
  }, [activeOrderId, captainOrderRuntime, captainRuntimeId, set]);

  const confirmDelivery = React.useCallback(async () => {
    if (!captainRuntimeId) return void set('captainPodState', 'error');
    try {
      await captainOrderRuntime.deliverOrder(resolveDshRuntimeOrderId(activeOrderId), captainRuntimeId);
      set('inboxState', 'delivered');
      set('activeOrderExpanded', false);
    } catch (err) {
      console.error('[captain:confirm-delivery]', err);
      set('captainPodState', 'error');
    }
  }, [activeOrderId, captainOrderRuntime, captainRuntimeId, set]);

  const confirmPodSubmission = React.useCallback(async () => {
    if (!captainRuntimeId || !captainPodPhotoUri || !captainPodMediaKey) return;
    set('captainPodState', 'loading');
    try {
      await captainOrderRuntime.deliverOrder(resolveDshRuntimeOrderId(activeOrderId), captainRuntimeId, captainPodMediaKey);
      set('captainPodState', 'success');
      if (captainAppMode === 'store_courier_mode') {
        set('storeCourierStage', 'delivered' as StoreCourierStage);
        set('inboxState', 'delivered');
      }
    } catch (err) {
      console.error('[captain:pod-submit]', err);
      set('captainPodState', 'error');
    }
  }, [activeOrderId, captainAppMode, captainOrderRuntime, captainRuntimeId, captainPodMediaKey, captainPodPhotoUri, set]);

  const reportPodFailure = React.useCallback(async () => {
    if (!captainRuntimeId) return void set('captainPodState', 'error');
    try {
      await captainOrderRuntime.failDelivery(resolveDshRuntimeOrderId(activeOrderId), captainRuntimeId);
      set('captainPodState', 'retry-required');
      if (captainAppMode === 'store_courier_mode') set('storeCourierStage', 'delivery_failed' as StoreCourierStage);
    } catch (err) {
      console.error('[captain:pod-fail]', err);
      set('captainPodState', 'error');
    }
  }, [activeOrderId, captainOrderRuntime, captainRuntimeId, captainAppMode, set]);

  return { handleAcceptTask, handleDeclineConfirm, confirmPickup, confirmDelivery, confirmPodSubmission, reportPodFailure };
}
