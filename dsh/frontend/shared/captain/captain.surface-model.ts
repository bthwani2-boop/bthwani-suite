// Canonical location: dsh/frontend/shared/captain/captain.surface-model.ts
// Authority: dsh/frontend/shared/captain — thin orchestration shell for captain surface.
// Wires topic models (navigation, chat, service-mode, pod, delivery) around shared state.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import {
  type DshCaptainRoute,
  type CaptainAvailabilityStatus,
  type CaptainAppMode,
  type CaptainSupportRoute,
  type CompactOrderChatMessage,
  type CaptainServiceType,
} from './captain.contract';
import {
  type DshCaptainLocationPush,
  useCaptainOrderRuntime,
  useCaptainActiveLocationPush,
} from './use-captain-order-runtime';
import type {
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from './captain.surface.types';
import { useCaptainDeliveryActions } from './captain.delivery-actions';
import { buildCaptainDerived } from './captain.derived';
import { getRouteForCommandTarget } from '../delivery/delivery.policy';
import { useCaptainNavigationModel } from './captain-navigation.model';
import { useCaptainChatModel } from './captain-chat.model';
import { useCaptainServiceModeModel } from './captain-service-mode.model';
import { useCaptainPodModel } from './captain-pod.model';

export type {
  ActiveOrderPhase,
  StoreCourierStage,
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from './captain.surface.types';


type ObjectStateAction<S> = { readonly key: keyof S; readonly value: S[keyof S] | ((current: S[keyof S]) => S[keyof S]) };

function useObjectState<S extends Record<string, unknown>>(initialState: S) {
  const reducer = React.useCallback((state: S, action: ObjectStateAction<S>): S => {
    const next = typeof action.value === 'function'
      ? (action.value as (c: S[keyof S]) => S[keyof S])(state[action.key])
      : action.value;
    return { ...state, [action.key]: next };
  }, []);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const set = React.useCallback(<k extends keyof S>(key: k, value: S[k] | ((current: S[k]) => S[k])) => {
    dispatch({ key, value: value as ObjectStateAction<S>['value'] });
  }, []);
  return [state, set] as const;
}

export function useDshCaptainSurfaceModel(
  command: DshCaptainNavigationCommand,
  captainRuntimeId: string,
): { state: DshCaptainSurfaceState; actions: ReturnType<typeof buildCaptainActions>; derived: DshCaptainSurfaceDerived } {
  const [state, set] = useObjectState<DshCaptainSurfaceState>({
    activeServiceType: 'dsh',
    route: getRouteForCommandTarget(command.target),
    inboxState: 'ready',
    activeOrderId: '',
    selectedSupportScreen: 'orders-list',
    isPickupSheetVisible: false,
    isDeliverySheetVisible: false,
    captainAvailabilityStatus: 'available',
    gpsStatus: 'limited',
    activeOrderExpanded: false,
    activeOrderPhase: 'pickup',
    captainAppMode: 'bthwani_captain_mode',
    activeOrderDraft: '',
    activeOrderMessages: [],
    storeCourierStage: 'ready_for_pickup',
    captainPodState: 'ready',
    captainPodPhotoUri: undefined,
    captainPodMediaKey: undefined,
    isDeclineSheetVisible: false,
    declineSheetState: 'ready',
    declineOrderId: '',
    pickupSheetState: 'ready',
  });

  const captainOrderRuntime = useCaptainOrderRuntime();
  useCaptainActiveLocationPush({
    activeOrderId: state.activeOrderId,
    captainId: captainRuntimeId,
    lifecycleStatus: state.inboxState,
  });

  // ── Topic models ─────────────────────────────────────────────────────────────
  const navModel = useCaptainNavigationModel({ command, route: state.route, set });
  const chatModel = useCaptainChatModel({ activeOrderDraft: state.activeOrderDraft, set });
  const serviceModeModel = useCaptainServiceModeModel({ set });
  const podModel = useCaptainPodModel({ captainAppMode: state.captainAppMode, set });

  // ── Reset helpers shared across delivery + pod ────────────────────────────────
  const resetOrderState = React.useCallback(() => {
    set('activeOrderExpanded', false);
    set('activeOrderPhase', 'pickup');
    set('activeOrderDraft', '');
    set('activeOrderMessages', []);
    podModel.resetPodFields();
  }, [set, podModel]);

  // ── Delivery actions ──────────────────────────────────────────────────────────
  const deliveryActions = useCaptainDeliveryActions({
    captainOrderRuntime,
    captainRuntimeId,
    activeOrderId: state.activeOrderId,
    captainPodPhotoUri: state.captainPodPhotoUri,
    captainPodMediaKey: state.captainPodMediaKey,
    captainAppMode: state.captainAppMode,
    set,
    resetOrderState,
  });

  const resetInboxState = React.useCallback(() => set('inboxState', 'ready'), [set]);

  const pushLocation = React.useCallback(
    (push: DshCaptainLocationPush) => captainOrderRuntime.pushLocation(push),
    [captainOrderRuntime],
  );

  // ── Derived state ─────────────────────────────────────────────────────────────
  const derivedCallbacks = React.useMemo(() => ({
    toggleAvailability: () => set('captainAvailabilityStatus', (c: CaptainAvailabilityStatus) => c === 'available' ? 'unavailable' : 'available'),
    goToInbox: navModel.goToInbox,
    resetInboxState,
    toggleOrderExpanded: () => set('activeOrderExpanded', (c: boolean) => !c),
  }), [set, navModel.goToInbox, resetInboxState]);

  const derived: DshCaptainSurfaceDerived = React.useMemo(
    () => buildCaptainDerived(state, derivedCallbacks),
    [state, derivedCallbacks],
  );

  const actions = buildCaptainActions({
    set,
    goBack: navModel.goBack,
    openOrderDetail: navModel.openOrderDetail,
    openCaptainAccount: navModel.openCaptainAccount,
    openCaptainAccountSection: navModel.openCaptainAccountSection,
    openSupportDirectory: navModel.openSupportDirectory,
    openCaptainSupportScreen: navModel.openCaptainSupportScreen,
    goToInbox: navModel.goToInbox,
    resetInboxState,
    sendQuickMessage: chatModel.sendQuickMessage,
    handleSelectServiceType: serviceModeModel.handleSelectServiceType,
    openStoreCourierProof: podModel.openStoreCourierProof,
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
