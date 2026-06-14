// Canonical location: dsh/frontend/shared/view-models/captain/useDshCaptainSurfaceModel.ts
// Authority: dsh/frontend/shared — surface state model for DshCaptainSurface.
// Consolidates all captain surface state into a single hook.

import React from 'react';
import type { DshCaptainRoute, DshCaptainNavigationCommand } from '../../../app-captain/dsh-captain.types';
import type { CaptainSupportRoute, CompactOrderChatMessage, CaptainServiceType } from './index';
import { getCaptainAvailabilityMeta } from './captain-availability.model';
import { EMPTY_CAPTAIN_ORDER_SUMMARY } from './captain-cod.model';
import { getRouteForCommandTarget, getCaptainLifecycleForOrderStage } from '../../policies/captain-route-policy';
import { resolveDshRuntimeOrderId, useCaptainActiveLocationPush, useCaptainOrderRuntime } from '../../../shared';

export type CaptainAvailabilityStatus = 'available' | 'unavailable';
export type CaptainGpsStatus = 'disabled' | 'limited' | 'ready';
export type ActiveOrderPhase = 'pickup' | 'delivery';
export type CaptainAppMode = 'bthwani_captain_mode' | 'store_courier_mode';
export type StoreCourierStage = 'ready_for_pickup' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'delivery_failed';

export type DshCaptainSurfaceState = {
  activeServiceType: CaptainServiceType;
  route: DshCaptainRoute;
  inboxState: 'ready' | 'loading' | 'error' | 'empty' | 'delivered' | 'offer-accepting' | 'offer-accepted';
  activeOrderId: string;
  selectedSupportScreen: CaptainSupportRoute;
  isPickupSheetVisible: boolean;
  isDeliverySheetVisible: boolean;
  captainAvailabilityStatus: CaptainAvailabilityStatus;
  gpsStatus: CaptainGpsStatus;
  activeOrderExpanded: boolean;
  activeOrderPhase: ActiveOrderPhase;
  captainAppMode: CaptainAppMode;
  activeOrderDraft: string;
  activeOrderMessages: CompactOrderChatMessage[];
  storeCourierStage: StoreCourierStage;
  captainPodState: 'ready' | 'loading' | 'success' | 'error' | 'retry-required';
  captainPodPhotoUri: string | undefined;
  captainPodMediaKey: string | undefined;
  isDeclineSheetVisible: boolean;
  declineSheetState: 'ready' | 'loading' | 'success' | 'error';
  declineOrderId: string;
  pickupSheetState: 'ready' | 'loading' | 'success' | 'error';
};

// ── useObjectState utility ─────────────────────────────────────────────────────
type ObjectStateAction<S> = { readonly key: keyof S; readonly value: S[keyof S] | ((current: S[keyof S]) => S[keyof S]) };

function useObjectState<S extends Record<string, unknown>>(initialState: S) {
  const reducer = React.useCallback((state: S, action: ObjectStateAction<S>): S => {
    const next = typeof action.value === 'function'
      ? (action.value as (c: S[keyof S]) => S[keyof S])(state[action.key])
      : action.value;
    return { ...state, [action.key]: next };
  }, []);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const setValue = React.useCallback(<k extends keyof S>(key: k, value: S[k] | ((current: S[k]) => S[k])) => {
    dispatch({ key, value: value as ObjectStateAction<S>['value'] });
  }, []);
  return [state, setValue] as const;
}

export function useDshCaptainSurfaceModel(
  command: DshCaptainNavigationCommand,
  captainRuntimeId: string,
) {
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

  const mk = React.useCallback(<k extends keyof DshCaptainSurfaceState>(key: k) =>
    (v: DshCaptainSurfaceState[k] | ((c: DshCaptainSurfaceState[k]) => DshCaptainSurfaceState[k])) => set(key, v), [set]);

  const setRoute = mk('route');
  const setInboxState = mk('inboxState');
  const setActiveOrderId = mk('activeOrderId');
  const setSelectedSupportScreen = mk('selectedSupportScreen');
  const setIsPickupSheetVisible = mk('isPickupSheetVisible');
  const setIsDeliverySheetVisible = mk('isDeliverySheetVisible');
  const setCaptainAvailabilityStatus = mk('captainAvailabilityStatus');
  const setGpsStatus = mk('gpsStatus');
  const setActiveOrderExpanded = mk('activeOrderExpanded');
  const setActiveOrderPhase = mk('activeOrderPhase');
  const setCaptainAppMode = mk('captainAppMode');
  const setActiveOrderDraft = mk('activeOrderDraft');
  const setActiveOrderMessages = mk('activeOrderMessages');
  const setStoreCourierStage = mk('storeCourierStage');
  const setCaptainPodState = mk('captainPodState');
  const setCaptainPodPhotoUri = mk('captainPodPhotoUri');
  const setCaptainPodMediaKey = mk('captainPodMediaKey');
  const setIsDeclineSheetVisible = mk('isDeclineSheetVisible');
  const setDeclineSheetState = mk('declineSheetState');
  const setDeclineOrderId = mk('declineOrderId');
  const setPickupSheetState = mk('pickupSheetState');
  const setActiveServiceType = mk('activeServiceType');

  const captainOrderRuntime = useCaptainOrderRuntime();
  useCaptainActiveLocationPush({
    activeOrderId: state.activeOrderId,
    captainId: captainRuntimeId,
    lifecycleStatus: state.inboxState,
  });

  const resetOrderState = React.useCallback(() => {
    setActiveOrderExpanded(false);
    setActiveOrderPhase('pickup');
    setActiveOrderDraft('');
    setActiveOrderMessages([]);
    setCaptainPodState('ready');
    setCaptainPodPhotoUri(undefined);
    setCaptainPodMediaKey(undefined);
  }, [setActiveOrderExpanded, setActiveOrderPhase, setActiveOrderDraft, setActiveOrderMessages, setCaptainPodState, setCaptainPodPhotoUri, setCaptainPodMediaKey]);

  const routeHistoryRef = React.useRef<DshCaptainRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);
  const commandKeyRef = React.useRef(`${command.target}:${command.token ?? ''}`);

  const goBack = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
      setRoute(prev);
      return true;
    }
    if (state.route !== 'home') { setRoute('home'); return true; }
    return false;
  }, [state.route, setRoute]);

  React.useEffect(() => {
    const commandKey = `${command.target}:${command.token ?? ''}`;
    if (commandKey !== commandKeyRef.current) {
      commandKeyRef.current = commandKey;
      const nextRoute = getRouteForCommandTarget(command.target);
      routeHistoryRef.current = [nextRoute];
      routeTransitionFromBackRef.current = false;
      setRoute(nextRoute);
      return;
    }
    const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1];
    if (state.route !== previousRoute) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(state.route);
      }
    }
  }, [command.target, command.token, state.route, setRoute]);

  const handleAcceptTask = React.useCallback(async (orderId: string) => {
    if (!captainRuntimeId) return void setInboxState('error');
    try {
      setInboxState('offer-accepting');
      await captainOrderRuntime.acceptTask(resolveDshRuntimeOrderId(orderId), captainRuntimeId);
      setInboxState('offer-accepted');
      setActiveOrderId(orderId);
      resetOrderState();
      if (state.captainAppMode !== 'store_courier_mode') setStoreCourierStage('ready_for_pickup');
      setRoute('detail');
      setInboxState('ready');
    } catch { setInboxState('error'); }
  }, [captainOrderRuntime, captainRuntimeId, state.captainAppMode, resetOrderState, setInboxState, setActiveOrderId, setStoreCourierStage, setRoute]);

  const handleDeclineConfirm = React.useCallback(async (orderId: string, reason: string) => {
    if (!captainRuntimeId) return void setDeclineSheetState('error');
    try {
      setDeclineSheetState('loading');
      await captainOrderRuntime.declineTask(resolveDshRuntimeOrderId(orderId), captainRuntimeId, reason);
      setDeclineSheetState('success');
      setTimeout(() => {
        setIsDeclineSheetVisible(false);
        setDeclineSheetState('ready');
        setRoute('inbox');
      }, 1000);
    } catch { setDeclineSheetState('error'); }
  }, [captainOrderRuntime, captainRuntimeId, setDeclineSheetState, setIsDeclineSheetVisible, setRoute]);

  const confirmPickup = React.useCallback(async () => {
    if (!captainRuntimeId) return void setPickupSheetState('error');
    try {
      setPickupSheetState('loading');
      await captainOrderRuntime.confirmPickup(resolveDshRuntimeOrderId(state.activeOrderId), captainRuntimeId);
      setPickupSheetState('success');
      setTimeout(() => {
        setIsPickupSheetVisible(false);
        setPickupSheetState('ready');
        setActiveOrderPhase('delivery');
        setActiveOrderMessages((cur) => [
          ...cur,
          {
            id: `msg-${cur.length + 1}`,
            sender: 'النظام',
            text: 'تم تأكيد الاستلام. المرحلة التالية هي التسليم.',
            time: 'الآن',
            side: 'start',
          },
        ]);
      }, 1000);
    } catch { setPickupSheetState('error'); }
  }, [state.activeOrderId, captainOrderRuntime, captainRuntimeId, setPickupSheetState, setIsPickupSheetVisible, setActiveOrderPhase, setActiveOrderMessages]);

  const confirmDelivery = React.useCallback(async () => {
    if (!captainRuntimeId) return void setCaptainPodState('error');
    try {
      await captainOrderRuntime.deliverOrder(resolveDshRuntimeOrderId(state.activeOrderId), captainRuntimeId);
      setInboxState('delivered');
      setActiveOrderExpanded(false);
    } catch { setCaptainPodState('error'); }
  }, [state.activeOrderId, captainOrderRuntime, captainRuntimeId, setCaptainPodState, setInboxState, setActiveOrderExpanded]);

  const confirmPodSubmission = React.useCallback(async () => {
    if (!captainRuntimeId || !state.captainPodPhotoUri || !state.captainPodMediaKey) return;
    setCaptainPodState('loading');
    try {
      await captainOrderRuntime.deliverOrder(resolveDshRuntimeOrderId(state.activeOrderId), captainRuntimeId, state.captainPodMediaKey);
      setCaptainPodState('success');
      if (state.captainAppMode === 'store_courier_mode') {
        setStoreCourierStage('delivered');
        setInboxState('delivered');
      }
    } catch { setCaptainPodState('error'); }
  }, [state.activeOrderId, state.captainAppMode, captainOrderRuntime, captainRuntimeId, state.captainPodMediaKey, state.captainPodPhotoUri, setCaptainPodState, setStoreCourierStage, setInboxState]);

  const reportPodFailure = React.useCallback(async () => {
    if (!captainRuntimeId) return void setCaptainPodState('error');
    try {
      await captainOrderRuntime.failDelivery(resolveDshRuntimeOrderId(state.activeOrderId), captainRuntimeId);
      setCaptainPodState('retry-required');
      if (state.captainAppMode === 'store_courier_mode') setStoreCourierStage('delivery_failed');
    } catch { setCaptainPodState('error'); }
  }, [state.activeOrderId, captainOrderRuntime, captainRuntimeId, state.captainAppMode, setCaptainPodState, setStoreCourierStage]);

  const openOrderDetail = React.useCallback((id: string) => { setActiveOrderId(id); setRoute('detail'); }, [setActiveOrderId, setRoute]);
  const openCaptainAccount = React.useCallback(() => setRoute('account'), [setRoute]);
  const openCaptainAccountSection = React.useCallback((r: DshCaptainRoute) => setRoute(r), [setRoute]);
  const openSupportDirectory = React.useCallback(() => setRoute('support-directory'), [setRoute]);
  const openCaptainSupportScreen = React.useCallback((screenId: CaptainSupportRoute) => { setSelectedSupportScreen(screenId); setRoute('support-screen'); }, [setSelectedSupportScreen, setRoute]);
  const goToInbox = React.useCallback(() => setRoute('inbox'), [setRoute]);
  const resetInboxState = React.useCallback(() => setInboxState('ready'), [setInboxState]);

  const sendQuickMessage = React.useCallback(() => {
    const text = state.activeOrderDraft.trim();
    if (!text) return;
    setActiveOrderMessages((cur) => [
      ...cur,
      {
        id: `msg-${cur.length + 1}`,
        sender: 'الكابتن',
        text,
        time: 'الآن',
        side: 'end',
      },
    ]);
    setActiveOrderDraft('');
  }, [state.activeOrderDraft, setActiveOrderMessages, setActiveOrderDraft]);

  const handleSelectServiceType = React.useCallback((typeId: string) => {
    setActiveServiceType(typeId === 'amn' ? 'amn' : 'dsh');
    setRoute('home');
    setInboxState('ready');
    setActiveOrderId('');
    setActiveOrderExpanded(false);
    setIsPickupSheetVisible(false);
    setIsDeliverySheetVisible(false);
  }, [setActiveServiceType, setRoute, setInboxState, setActiveOrderId, setActiveOrderExpanded, setIsPickupSheetVisible, setIsDeliverySheetVisible]);

  const openStoreCourierProof = React.useCallback(() => {
    setCaptainPodState('ready');
    setRoute(getCaptainLifecycleForOrderStage('proof', state.captainAppMode === 'store_courier_mode').captainRoute);
  }, [state.captainAppMode, setCaptainPodState, setRoute]);

  const actions = {
    setRoute,
    setInboxState,
    setActiveOrderId,
    setSelectedSupportScreen,
    setIsPickupSheetVisible,
    setIsDeliverySheetVisible,
    setCaptainAvailabilityStatus,
    setGpsStatus,
    setActiveOrderExpanded,
    setActiveOrderPhase,
    setCaptainAppMode,
    setActiveOrderDraft,
    setActiveOrderMessages,
    setStoreCourierStage,
    setCaptainPodState,
    setCaptainPodPhotoUri,
    setCaptainPodMediaKey,
    setIsDeclineSheetVisible,
    setDeclineSheetState,
    setDeclineOrderId,
    setPickupSheetState,
    setActiveServiceType,
    handleAcceptTask,
    handleDeclineConfirm,
    confirmPickup,
    confirmDelivery,
    confirmPodSubmission,
    reportPodFailure,
    resetOrderState,
    goBack,
    openOrderDetail,
    openCaptainAccount,
    openCaptainAccountSection,
    openSupportDirectory,
    openCaptainSupportScreen,
    goToInbox,
    resetInboxState,
    sendQuickMessage,
    handleSelectServiceType,
    openStoreCourierProof,
  };

  return {
    state,
    actions,
    captainOrderRuntime,
  };
}
