// Canonical location: dsh/frontend/app-captain/useDshCaptainSurfaceModel.ts
// Authority: dsh/frontend/app-captain — surface state model for DshCaptainSurface.
// Consolidates all captain surface state, derived display values, and runtime actions.

import React from 'react';
import type { DshCaptainRoute, DshCaptainNavigationCommand } from './dsh-captain.types';
import {
  type CaptainSupportRoute,
  type CompactOrderChatMessage,
  type CaptainServiceType,
  type CaptainAvailabilityMeta,
  getCaptainAvailabilityMeta,
  EMPTY_CAPTAIN_ORDER_SUMMARY,
  getRouteForCommandTarget,
  getCaptainLifecycleForOrderStage,
  isCaptainPodRequiredForMode,
  isCaptainCodCollectorForMode,
  resolveDshRuntimeOrderId,
  useCaptainActiveLocationPush,
  useCaptainOrderRuntime,
} from '../shared';

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

export type DshCaptainSurfaceDerived = {
  isStoreCourierMode: boolean;
  isCaptainAvailable: boolean;
  isGpsEnabled: boolean;
  captainPodRequired: boolean;
  captainCollectsCod: boolean;
  showBottomNav: boolean;
  captainBottomActiveId: string;
  currentAvailabilityMeta: CaptainAvailabilityMeta;
  activeOrderDisplayId: string;
  homeTicker: {
    statusLabel: string;
    message: string;
    onPress: () => void;
    marquee: boolean;
  };
};

// Routes that show the bottom nav bar (not store-courier mode specific)
const CAPTAIN_BOTTOM_NAV_ROUTES = new Set<DshCaptainRoute>([
  'home', 'map', 'inbox', 'account', 'account-finance', 'account-orders',
  'account-profile', 'account-docs', 'account-shifts', 'account-support',
  'support-directory', 'support-screen',
]);

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
): { state: DshCaptainSurfaceState; actions: ReturnType<typeof buildActions>; derived: DshCaptainSurfaceDerived } {
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

  const pushLocation = React.useCallback(
    (orderId: string, lat: number, lng: number) => captainOrderRuntime.pushLocation(orderId, lat, lng),
    [captainOrderRuntime],
  );

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
      { id: `msg-${cur.length + 1}`, sender: 'الكابتن', text, time: 'الآن', side: 'end' },
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

  const toggleStoreCourierMode = React.useCallback((next: boolean) => {
    setCaptainAppMode(next ? 'store_courier_mode' : 'bthwani_captain_mode');
    setRoute('home');
  }, [setCaptainAppMode, setRoute]);

  // ── Derived display values (computed from state, no side effects) ──────────
  const isStoreCourierMode = state.captainAppMode === 'store_courier_mode';
  const isCaptainAvailable = state.captainAvailabilityStatus === 'available';
  const isGpsEnabled = state.gpsStatus !== 'disabled';
  const captainPodRequired = !isStoreCourierMode && isCaptainPodRequiredForMode('bthwani_delivery');
  const captainCollectsCod = !isStoreCourierMode && isCaptainCodCollectorForMode('bthwani_delivery');
  const currentAvailabilityMeta = getCaptainAvailabilityMeta(state.captainAvailabilityStatus);
  const activeOrderDisplayId = state.activeOrderId ? resolveDshRuntimeOrderId(state.activeOrderId) : '';
  const activeSummary = EMPTY_CAPTAIN_ORDER_SUMMARY;

  const showBottomNav = isStoreCourierMode
    ? state.route === 'home' || state.route === 'account'
    : CAPTAIN_BOTTOM_NAV_ROUTES.has(state.route);

  let captainBottomActiveId = '';
  if (isStoreCourierMode) {
    captainBottomActiveId = state.route === 'home' ? 'my-orders' : state.route === 'account' ? 'profile' : '';
  } else {
    if (state.route === 'inbox' || state.route === 'account-orders') captainBottomActiveId = 'orders';
    else if (state.route === 'account-finance') captainBottomActiveId = 'wallet';
    else if (state.route === 'support-directory' || state.route === 'support-screen') captainBottomActiveId = 'support';
    else if (['account', 'account-profile', 'account-docs', 'account-shifts', 'account-support'].includes(state.route)) captainBottomActiveId = 'profile';
  }

  const homeTicker = React.useMemo((): DshCaptainSurfaceDerived['homeTicker'] => {
    if (!isCaptainAvailable) return { statusLabel: currentAvailabilityMeta.label, message: currentAvailabilityMeta.description, onPress: () => setCaptainAvailabilityStatus((c) => c === 'available' ? 'unavailable' : 'available'), marquee: false };
    if (state.inboxState === 'loading') return { statusLabel: 'تحميل', message: 'جارٍ تجهيز حركة الكابتن.', onPress: goToInbox, marquee: false };
    if (state.inboxState === 'error') return { statusLabel: 'تنبيه', message: 'تعذر تحميل الطلب النشط.', onPress: resetInboxState, marquee: false };
    if (state.inboxState === 'empty') return { statusLabel: 'انتظار', message: 'لا يوجد طلب نشط الآن.', onPress: goToInbox, marquee: false };
    if (state.inboxState === 'delivered') return { statusLabel: 'مغلق', message: 'تم تسليم الطلب الأخير.', onPress: goToInbox, marquee: false };
    return {
      statusLabel: `#${activeOrderDisplayId}`,
      message: `${activeSummary.currentStageLabel} · ${activeSummary.etaLabel}`,
      onPress: () => setActiveOrderExpanded((c) => !c),
      marquee: false,
    };
  }, [isCaptainAvailable, state.inboxState, currentAvailabilityMeta, activeOrderDisplayId, activeSummary, goToInbox, resetInboxState, setCaptainAvailabilityStatus, setActiveOrderExpanded]);

  const derived: DshCaptainSurfaceDerived = {
    isStoreCourierMode,
    isCaptainAvailable,
    isGpsEnabled,
    captainPodRequired,
    captainCollectsCod,
    showBottomNav,
    captainBottomActiveId,
    currentAvailabilityMeta,
    activeOrderDisplayId,
    homeTicker,
  };

  const actions = buildActions({
    setRoute, setInboxState, setActiveOrderId, setSelectedSupportScreen,
    setIsPickupSheetVisible, setIsDeliverySheetVisible, setCaptainAvailabilityStatus,
    setGpsStatus, setActiveOrderExpanded, setActiveOrderPhase, setCaptainAppMode,
    setActiveOrderDraft, setActiveOrderMessages, setStoreCourierStage, setCaptainPodState,
    setCaptainPodPhotoUri, setCaptainPodMediaKey, setIsDeclineSheetVisible,
    setDeclineSheetState, setDeclineOrderId, setPickupSheetState, setActiveServiceType,
    handleAcceptTask, handleDeclineConfirm, confirmPickup, confirmDelivery,
    confirmPodSubmission, reportPodFailure, resetOrderState, goBack, openOrderDetail,
    openCaptainAccount, openCaptainAccountSection, openSupportDirectory,
    openCaptainSupportScreen, goToInbox, resetInboxState, sendQuickMessage,
    handleSelectServiceType, openStoreCourierProof, toggleStoreCourierMode, pushLocation,
  });

  return { state, actions, derived };
}

// Typed action builder — keeps the return type inference clean
function buildActions(a: {
  setRoute: (v: DshCaptainRoute | ((c: DshCaptainRoute) => DshCaptainRoute)) => void;
  setInboxState: (v: DshCaptainSurfaceState['inboxState'] | ((c: DshCaptainSurfaceState['inboxState']) => DshCaptainSurfaceState['inboxState'])) => void;
  setActiveOrderId: (v: string | ((c: string) => string)) => void;
  setSelectedSupportScreen: (v: CaptainSupportRoute | ((c: CaptainSupportRoute) => CaptainSupportRoute)) => void;
  setIsPickupSheetVisible: (v: boolean | ((c: boolean) => boolean)) => void;
  setIsDeliverySheetVisible: (v: boolean | ((c: boolean) => boolean)) => void;
  setCaptainAvailabilityStatus: (v: CaptainAvailabilityStatus | ((c: CaptainAvailabilityStatus) => CaptainAvailabilityStatus)) => void;
  setGpsStatus: (v: CaptainGpsStatus | ((c: CaptainGpsStatus) => CaptainGpsStatus)) => void;
  setActiveOrderExpanded: (v: boolean | ((c: boolean) => boolean)) => void;
  setActiveOrderPhase: (v: ActiveOrderPhase | ((c: ActiveOrderPhase) => ActiveOrderPhase)) => void;
  setCaptainAppMode: (v: CaptainAppMode | ((c: CaptainAppMode) => CaptainAppMode)) => void;
  setActiveOrderDraft: (v: string | ((c: string) => string)) => void;
  setActiveOrderMessages: (v: CompactOrderChatMessage[] | ((c: CompactOrderChatMessage[]) => CompactOrderChatMessage[])) => void;
  setStoreCourierStage: (v: StoreCourierStage | ((c: StoreCourierStage) => StoreCourierStage)) => void;
  setCaptainPodState: (v: DshCaptainSurfaceState['captainPodState'] | ((c: DshCaptainSurfaceState['captainPodState']) => DshCaptainSurfaceState['captainPodState'])) => void;
  setCaptainPodPhotoUri: (v: string | undefined | ((c: string | undefined) => string | undefined)) => void;
  setCaptainPodMediaKey: (v: string | undefined | ((c: string | undefined) => string | undefined)) => void;
  setIsDeclineSheetVisible: (v: boolean | ((c: boolean) => boolean)) => void;
  setDeclineSheetState: (v: DshCaptainSurfaceState['declineSheetState'] | ((c: DshCaptainSurfaceState['declineSheetState']) => DshCaptainSurfaceState['declineSheetState'])) => void;
  setDeclineOrderId: (v: string | ((c: string) => string)) => void;
  setPickupSheetState: (v: DshCaptainSurfaceState['pickupSheetState'] | ((c: DshCaptainSurfaceState['pickupSheetState']) => DshCaptainSurfaceState['pickupSheetState'])) => void;
  setActiveServiceType: (v: CaptainServiceType | ((c: CaptainServiceType) => CaptainServiceType)) => void;
  handleAcceptTask: (orderId: string) => Promise<void>;
  handleDeclineConfirm: (orderId: string, reason: string) => Promise<void>;
  confirmPickup: () => Promise<void>;
  confirmDelivery: () => Promise<void>;
  confirmPodSubmission: () => Promise<void>;
  reportPodFailure: () => Promise<void>;
  resetOrderState: () => void;
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
  pushLocation: (orderId: string, lat: number, lng: number) => void;
}) {
  return a;
}
