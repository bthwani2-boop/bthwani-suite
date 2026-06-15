// Canonical location: dsh/frontend/shared/captain/captain.surface-model.ts
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import {
  type DshCaptainRoute,
  type CaptainAvailabilityStatus,
  type CaptainAppMode,
  type CaptainSupportRoute,
  type CompactOrderChatMessage,
  type CaptainServiceType,
  getCaptainAvailabilityMeta,
} from './captain.contract';
import { EMPTY_CAPTAIN_ORDER_SUMMARY } from './captain.cod';
import {
  type DshCaptainLocationPush,
  resolveDshRuntimeOrderId,
  useCaptainOrderRuntime,
  useCaptainActiveLocationPush,
} from './use-captain-order-runtime';
import { getCaptainLifecycleForOrderStage, getRouteForCommandTarget } from '../delivery/delivery.policy';
import { isCaptainPodRequiredForMode, isCaptainCodCollectorForMode } from '../identity-access/surface-visibility.policy';
import type {
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from './captain.surface.types';
import { useCaptainDeliveryActions } from './captain.delivery-actions';

export type {
  ActiveOrderPhase,
  StoreCourierStage,
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from './captain.surface.types';

const CAPTAIN_BOTTOM_NAV_ROUTES = new Set<DshCaptainRoute>([
  'home', 'map', 'inbox', 'account', 'account-finance', 'account-orders',
  'account-profile', 'account-docs', 'account-shifts', 'account-support',
  'support-directory', 'support-screen',
]);

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

  const resetOrderState = React.useCallback(() => {
    set('activeOrderExpanded', false);
    set('activeOrderPhase', 'pickup');
    set('activeOrderDraft', '');
    set('activeOrderMessages', []);
    set('captainPodState', 'ready');
    set('captainPodPhotoUri', undefined);
    set('captainPodMediaKey', undefined);
  }, [set]);

  const routeHistoryRef = React.useRef<DshCaptainRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);
  const commandKeyRef = React.useRef(`${command.target}:${command.token ?? ''}`);

  const goBack = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
      set('route', prev);
      return true;
    }
    if (state.route !== 'home') { set('route', 'home'); return true; }
    return false;
  }, [state.route, set]);

  React.useEffect(() => {
    const commandKey = `${command.target}:${command.token ?? ''}`;
    if (commandKey !== commandKeyRef.current) {
      commandKeyRef.current = commandKey;
      const nextRoute = getRouteForCommandTarget(command.target);
      routeHistoryRef.current = [nextRoute];
      routeTransitionFromBackRef.current = false;
      set('route', nextRoute);
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
  }, [command.target, command.token, state.route, set]);

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

  const goToInbox = React.useCallback(() => set('route', 'inbox'), [set]);
  const resetInboxState = React.useCallback(() => set('inboxState', 'ready'), [set]);
  const openOrderDetail = React.useCallback((id: string) => { set('activeOrderId', id); set('route', 'detail'); }, [set]);
  const openCaptainAccount = React.useCallback(() => set('route', 'account'), [set]);
  const openCaptainAccountSection = React.useCallback((r: DshCaptainRoute) => set('route', r), [set]);
  const openSupportDirectory = React.useCallback(() => set('route', 'support-directory'), [set]);
  const openCaptainSupportScreen = React.useCallback((screenId: CaptainSupportRoute) => { set('selectedSupportScreen', screenId); set('route', 'support-screen'); }, [set]);

  const sendQuickMessage = React.useCallback(() => {
    const text = state.activeOrderDraft.trim();
    if (!text) return;
    set('activeOrderMessages', (cur: CompactOrderChatMessage[]) => [
      ...cur,
      { id: `msg-${cur.length + 1}`, sender: 'الكابتن', text, time: 'الآن', side: 'end' },
    ]);
    set('activeOrderDraft', '');
  }, [state.activeOrderDraft, set]);

  const handleSelectServiceType = React.useCallback((typeId: string) => {
    set('activeServiceType', typeId === 'amn' ? 'amn' : ('dsh' as CaptainServiceType));
    set('route', 'home');
    set('inboxState', 'ready');
    set('activeOrderId', '');
    set('activeOrderExpanded', false);
    set('isPickupSheetVisible', false);
    set('isDeliverySheetVisible', false);
  }, [set]);

  const openStoreCourierProof = React.useCallback(() => {
    set('captainPodState', 'ready');
    set('route', getCaptainLifecycleForOrderStage('proof', state.captainAppMode === 'store_courier_mode').captainRoute);
  }, [state.captainAppMode, set]);

  const toggleStoreCourierMode = React.useCallback((next: boolean) => {
    set('captainAppMode', next ? 'store_courier_mode' : ('bthwani_captain_mode' as CaptainAppMode));
    set('route', 'home');
  }, [set]);

  const pushLocation = React.useCallback(
    (push: DshCaptainLocationPush) => captainOrderRuntime.pushLocation(push),
    [captainOrderRuntime],
  );

  // ── Derived state ─────────────────────────────────────────────────────────────
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
    if (!isCaptainAvailable) return {
      statusLabel: currentAvailabilityMeta.label,
      message: currentAvailabilityMeta.description,
      onPress: () => set('captainAvailabilityStatus', (c: CaptainAvailabilityStatus) => c === 'available' ? 'unavailable' : 'available'),
      marquee: false,
    };
    if (state.inboxState === 'loading') return { statusLabel: 'تحميل', message: 'جارٍ تجهيز حركة الكابتن.', onPress: goToInbox, marquee: false };
    if (state.inboxState === 'error') return { statusLabel: 'تنبيه', message: 'تعذر تحميل الطلب النشط.', onPress: resetInboxState, marquee: false };
    if (state.inboxState === 'empty') return { statusLabel: 'انتظار', message: 'لا يوجد طلب نشط الآن.', onPress: goToInbox, marquee: false };
    if (state.inboxState === 'delivered') return { statusLabel: 'مغلق', message: 'تم تسليم الطلب الأخير.', onPress: goToInbox, marquee: false };
    return {
      statusLabel: `#${activeOrderDisplayId}`,
      message: `${activeSummary.currentStageLabel} · ${activeSummary.etaLabel}`,
      onPress: () => set('activeOrderExpanded', (c: boolean) => !c),
      marquee: false,
    };
  }, [isCaptainAvailable, state.inboxState, currentAvailabilityMeta, activeOrderDisplayId, activeSummary, goToInbox, resetInboxState, set]);

  const derived: DshCaptainSurfaceDerived = {
    isStoreCourierMode, isCaptainAvailable, isGpsEnabled, captainPodRequired, captainCollectsCod,
    showBottomNav, captainBottomActiveId, currentAvailabilityMeta, activeOrderDisplayId, homeTicker,
  };

  const actions = buildCaptainActions({
    set,
    goBack, openOrderDetail, openCaptainAccount, openCaptainAccountSection,
    openSupportDirectory, openCaptainSupportScreen, goToInbox, resetInboxState,
    sendQuickMessage, handleSelectServiceType, openStoreCourierProof, toggleStoreCourierMode, pushLocation,
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
