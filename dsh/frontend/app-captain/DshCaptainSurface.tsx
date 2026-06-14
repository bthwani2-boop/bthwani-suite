import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { useAppCaptainAppearance } from '../../../app-captain/shell/appearance';

let useSafeAreaInsets: () => { top: number; bottom: number; left: number; right: number } = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
try {
  // eslint-disable-next-line no-eval
  const r: any = eval('require');
  const safe = r('react-native-safe-area-context');
  if (safe && typeof safe.useSafeAreaInsets === 'function') {
    useSafeAreaInsets = safe.useSafeAreaInsets;
  }
} catch (err) {
  void err;
}

import {
  Badge, BottomNavBar, Box, Button, colorPalette, Divider, Icon, KeyValueList,
  MobileScrollView, MobileWorkspaceHeader, ModernPremiumHeader,
  StateView, Surface, Text, TopBar, useTheme, spacing,
} from '@bthwani/ui-kit';
import { wltDshCaptainUiCopy, buildWltDshCaptainTopBarLocationLabel } from '../../../wlt/frontend/dsh/app-captain/wlt-dsh-captain.ui-copy';
import { DshCaptainFinanceScreen } from './screens/DshCaptainFinanceScreen';
import { DshCaptainStoreCourierHomeContent } from './screens/DshCaptainStoreCourierHomeContent';
import { DshCaptainAccountSettingsContent } from './screens/DshCaptainAccountSettingsContent';
import { DshCaptainMapLayer } from './screens/DshCaptainMapLayer';
import { DshCaptainHomeOrderPanel } from './screens/DshCaptainHomeOrderPanel';
import { DshCaptainSupportDirectoryScreen } from './screens/DshCaptainOperationsScreen';
import { CaptainSupportScreenRouter } from './CaptainSupportScreenRouter';
import { CaptainAccountNavRow } from './parts/CaptainAccountNavRow';
import { DshCaptainRouteRenderer, DshCaptainAccountShell } from './DshCaptainRouteRenderer';
import type { DshCaptainCommandTarget, DshCaptainRoute, DshCaptainSurfaceProps } from './dsh-captain.types';
import { isModeVisibleInCaptainInbox, isCaptainPodRequiredForMode, isCaptainCodCollectorForMode } from '../shared/contracts/dsh-fulfillment-surface-visibility';
import { resolveDshRuntimeOrderId, useCaptainActiveLocationPush, useCaptainOrderRuntime } from '../shared';
import { PlatformVarsProvider, FeatureFlagProvider, usePlatformVars } from '../platform';
import { OfferDeclineSheet } from './sheets';
import type {
  CaptainSupportRoute, CompactOrderChatMessage, CaptainServiceType,
} from '../shared/view-models/captain';
import { getCaptainAvailabilityMeta } from '../shared/view-models/captain';
import { getRouteForCommandTarget, isCaptainInboxVisibleForMode, getCaptainLifecycleForOrderStage } from '../shared/policies/captain-route-policy';
import { EMPTY_CAPTAIN_ORDER_SUMMARY } from '../shared/view-models/captain/captain-cod.model';
import type { DshCaptainBellEvent } from '../shared/state-machines/dsh-order-journey.model';
import {
  CaptainDeliveryConfirmSheet,
  CaptainOrderDetailScreen,
  CaptainOrdersInboxScreen,
  CaptainPickupConfirmSheet,
  DshCaptainBellScreen,
  DshCaptainOrderChatScreen,
} from './screens/DshCaptainOrdersScreen';

type CaptainOrderDetailSummary = React.ComponentProps<typeof CaptainOrderDetailScreen>['summary'];
type CaptainOrdersInboxScreenState = NonNullable<React.ComponentProps<typeof CaptainOrdersInboxScreen>>['state'];
type _PodScreenProps = NonNullable<React.ComponentProps<any>['state']>;

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
  const setValue = React.useCallback(<K extends keyof S>(key: K, value: S[K] | ((current: S[K]) => S[K])) => {
    dispatch({ key, value: value as ObjectStateAction<S>['value'] });
  }, []);
  return [state, setValue] as const;
}

export function DshCaptainSurface(props: DshCaptainSurfaceProps) {
  return (
    <PlatformVarsProvider>
      <FeatureFlagProvider>
        <DshCaptainSurfaceInner {...props} />
      </FeatureFlagProvider>
    </PlatformVarsProvider>
  );
}

function DshCaptainSurfaceInner({ command, captainId, walletBalanceLabel }: DshCaptainSurfaceProps) {
  const { theme } = useTheme();
  const { dshAuthBearerToken, dshClientId } = usePlatformVars();
  const captainRuntimeId = React.useMemo(() => (captainId ?? dshClientId ?? '').trim(), [captainId, dshClientId]);
  const { hydrated: appearanceHydrated, mode: appearanceMode, setMode: setAppearanceMode } = useAppCaptainAppearance();
  const insets = useSafeAreaInsets();

  const [ui, set] = useObjectState({
    activeServiceType: 'dsh' as CaptainServiceType,
    route: getRouteForCommandTarget(command.target),
    inboxState: 'ready' as CaptainOrdersInboxScreenState,
    activeOrderId: '',
    selectedSupportScreen: 'orders-list' as CaptainSupportRoute,
    isPickupSheetVisible: false,
    isDeliverySheetVisible: false,
    captainAvailabilityStatus: 'available' as CaptainAvailabilityStatus,
    gpsStatus: 'limited' as CaptainGpsStatus,
    activeOrderExpanded: false,
    activeOrderPhase: 'pickup' as ActiveOrderPhase,
    captainAppMode: 'bthwani_captain_mode' as CaptainAppMode,
    activeOrderDraft: '',
    activeOrderMessages: [] as CompactOrderChatMessage[],
    storeCourierStage: 'ready_for_pickup' as StoreCourierStage,
    captainPodState: 'ready' as _PodScreenProps,
    captainPodPhotoUri: undefined as string | undefined,
    captainPodMediaKey: undefined as string | undefined,
    isDeclineSheetVisible: false,
    declineSheetState: 'ready' as 'ready' | 'loading' | 'success' | 'error',
    declineOrderId: '',
    pickupSheetState: 'ready' as 'ready' | 'loading' | 'success' | 'error',
  });

  const {
    activeServiceType, route, inboxState, activeOrderId, selectedSupportScreen,
    isPickupSheetVisible, isDeliverySheetVisible, captainAvailabilityStatus, gpsStatus,
    activeOrderExpanded, activeOrderPhase, captainAppMode, activeOrderDraft, activeOrderMessages,
    storeCourierStage, captainPodState, captainPodPhotoUri, captainPodMediaKey,
    isDeclineSheetVisible, declineSheetState, declineOrderId, pickupSheetState,
  } = ui;

  const mk = <K extends keyof typeof ui>(key: K) =>
    (v: typeof ui[K] | ((c: typeof ui[K]) => typeof ui[K])) => set(key, v);
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

  const isStoreCourierMode = captainAppMode === 'store_courier_mode';
  const bthwaniDeliveryVisibleInInbox = isModeVisibleInCaptainInbox('bthwani_delivery') && isCaptainInboxVisibleForMode('bthwani_delivery');
  void bthwaniDeliveryVisibleInInbox;
  const captainPodRequired = !isStoreCourierMode && isCaptainPodRequiredForMode('bthwani_delivery');
  const captainCollectsCod = !isStoreCourierMode && isCaptainCodCollectorForMode('bthwani_delivery');
  const showCaptainBottomNav = isStoreCourierMode ? route === 'home' || route === 'account' : CAPTAIN_BOTTOM_NAV_ROUTES.has(route);
  const captainOrderRuntime = useCaptainOrderRuntime();
  useCaptainActiveLocationPush({ activeOrderId, captainId: captainRuntimeId, lifecycleStatus: inboxState });

  const activeSummary = EMPTY_CAPTAIN_ORDER_SUMMARY as NonNullable<CaptainOrderDetailSummary>;
  const activeOrderDisplayId = activeOrderId ? resolveDshRuntimeOrderId(activeOrderId) : '';
  const captainDisplayName = '';
  const orderChatState = inboxState === 'delivered' ? 'readOnly' : 'active';
  const isCaptainAvailable = captainAvailabilityStatus === 'available';
  const isGpsEnabled = gpsStatus !== 'disabled';
  const currentAvailabilityMeta = getCaptainAvailabilityMeta(captainAvailabilityStatus);

  const routeHistoryRef = React.useRef<DshCaptainRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);
  const commandKeyRef = React.useRef(`${command.target}:${command.token ?? ''}`);

  const resetOrderState = React.useCallback(() => {
    setActiveOrderExpanded(false);
    setActiveOrderPhase('pickup');
    setActiveOrderDraft('');
    setActiveOrderMessages([]);
    setCaptainPodState('ready');
    setCaptainPodPhotoUri(undefined);
    setCaptainPodMediaKey(undefined);
  }, []);

  const goBack = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
      setRoute(prev);
      return true;
    }
    if (route !== 'home') { setRoute('home'); return true; }
    return false;
  }, [route]);

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
    if (route !== previousRoute) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
    }
  }, [command.target, command.token, route]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => goBack());
    return () => sub.remove();
  }, [goBack]);

  // ─── Action handlers (UI state orchestration calling shared runtime) ───────────

  const handleAcceptTask = React.useCallback(async (orderId: string) => {
    if (!captainRuntimeId) return void setInboxState('error');
    try {
      setInboxState('offer-accepting');
      await captainOrderRuntime.acceptTask(resolveDshRuntimeOrderId(orderId), captainRuntimeId);
      setInboxState('offer-accepted');
      setActiveOrderId(orderId);
      resetOrderState();
      if (!isStoreCourierMode) setStoreCourierStage('ready_for_pickup');
      setRoute('detail');
      setInboxState('ready');
    } catch { setInboxState('error'); }
  }, [captainOrderRuntime, captainRuntimeId, isStoreCourierMode, resetOrderState]);

  const handleDeclineConfirm = React.useCallback(async (orderId: string, reason: string) => {
    if (!captainRuntimeId) return void setDeclineSheetState('error');
    try {
      setDeclineSheetState('loading');
      await captainOrderRuntime.declineTask(resolveDshRuntimeOrderId(orderId), captainRuntimeId, reason);
      setDeclineSheetState('success');
      setTimeout(() => { setIsDeclineSheetVisible(false); setDeclineSheetState('ready'); setRoute('inbox'); }, 1000);
    } catch { setDeclineSheetState('error'); }
  }, [captainOrderRuntime, captainRuntimeId]);

  const confirmPickup = React.useCallback(async () => {
    if (!captainRuntimeId) return void setPickupSheetState('error');
    try {
      setPickupSheetState('loading');
      await captainOrderRuntime.confirmPickup(resolveDshRuntimeOrderId(activeOrderId), captainRuntimeId);
      setPickupSheetState('success');
      setTimeout(() => {
        setIsPickupSheetVisible(false);
        setPickupSheetState('ready');
        setActiveOrderPhase('delivery');
        setActiveOrderMessages((cur) => [...cur, { id: `msg-${cur.length + 1}`, sender: 'النظام', text: 'تم تأكيد الاستلام. المرحلة التالية هي التسليم.', time: 'الآن', side: 'start' }]);
      }, 1000);
    } catch { setPickupSheetState('error'); }
  }, [activeOrderId, captainOrderRuntime, captainRuntimeId]);

  const confirmDelivery = React.useCallback(async () => {
    if (!captainRuntimeId) return void setCaptainPodState('error');
    try {
      await captainOrderRuntime.deliverOrder(resolveDshRuntimeOrderId(activeOrderId), captainRuntimeId);
      setInboxState('delivered');
      setActiveOrderExpanded(false);
    } catch { setCaptainPodState('error'); }
  }, [activeOrderId, captainOrderRuntime, captainRuntimeId]);

  const confirmPodSubmission = React.useCallback(async () => {
    if (!captainRuntimeId || !captainPodPhotoUri || !captainPodMediaKey) return;
    setCaptainPodState('loading');
    try {
      await captainOrderRuntime.deliverOrder(resolveDshRuntimeOrderId(activeOrderId), captainRuntimeId, captainPodMediaKey);
      setCaptainPodState('success');
      if (isStoreCourierMode) { setStoreCourierStage('delivered'); setInboxState('delivered'); }
    } catch { setCaptainPodState('error'); }
  }, [activeOrderId, captainAppMode, captainOrderRuntime, captainRuntimeId, captainPodMediaKey, captainPodPhotoUri, isStoreCourierMode]);

  const reportPodFailure = React.useCallback(async () => {
    if (!captainRuntimeId) return void setCaptainPodState('error');
    try {
      await captainOrderRuntime.failDelivery(resolveDshRuntimeOrderId(activeOrderId), captainRuntimeId);
      setCaptainPodState('retry-required');
      if (isStoreCourierMode) setStoreCourierStage('delivery_failed');
    } catch { setCaptainPodState('error'); }
  }, [activeOrderId, captainOrderRuntime, captainRuntimeId, isStoreCourierMode]);

  // ─── Navigation helpers ────────────────────────────────────────────────────────

  const openOrderDetail = React.useCallback((id: string) => { setActiveOrderId(id); setRoute('detail'); }, []);
  const openCaptainAccount = React.useCallback(() => setRoute('account'), []);
  const openCaptainAccountSection = React.useCallback((r: DshCaptainRoute) => setRoute(r), []);
  const openSupportDirectory = React.useCallback(() => setRoute('support-directory'), []);
  const openCaptainSupportScreen = React.useCallback((screenId: CaptainSupportRoute) => { setSelectedSupportScreen(screenId); setRoute('support-screen'); }, []);
  const goToInbox = React.useCallback(() => setRoute('inbox'), []);
  const resetInboxState = React.useCallback(() => setInboxState('ready'), []);

  const sendQuickMessage = React.useCallback(() => {
    const text = activeOrderDraft.trim();
    if (!text) return;
    setActiveOrderMessages((cur) => [...cur, { id: `msg-${cur.length + 1}`, sender: 'الكابتن', text, time: 'الآن', side: 'end' }]);
    setActiveOrderDraft('');
  }, [activeOrderDraft]);

  const handleSelectServiceType = React.useCallback((typeId: string) => {
    setActiveServiceType(typeId === 'amn' ? 'amn' : 'dsh');
    setRoute('home'); setInboxState('ready'); setActiveOrderId('');
    setActiveOrderExpanded(false); setIsPickupSheetVisible(false); setIsDeliverySheetVisible(false);
  }, []);

  const openStoreCourierProof = React.useCallback(() => {
    setCaptainPodState('ready');
    setRoute(getCaptainLifecycleForOrderStage('proof', isStoreCourierMode).captainRoute);
  }, [isStoreCourierMode]);

  // ─── Home ticker (UI display model) ──────────────────────────────────────────

  const homeTicker = React.useMemo(() => {
    if (!isCaptainAvailable) return { statusLabel: currentAvailabilityMeta.label, message: currentAvailabilityMeta.description, onPress: () => setCaptainAvailabilityStatus((c) => c === 'available' ? 'unavailable' : 'available'), marquee: false };
    if (inboxState === 'loading') return { statusLabel: 'تحميل', message: 'جارٍ تجهيز حركة الكابتن.', onPress: goToInbox, marquee: false };
    if (inboxState === 'error') return { statusLabel: 'تنبيه', message: 'تعذر تحميل الطلب النشط.', onPress: resetInboxState, marquee: false };
    if (inboxState === 'empty') return { statusLabel: 'انتظار', message: 'لا يوجد طلب نشط الآن.', onPress: goToInbox, marquee: false };
    if (inboxState === 'delivered') return { statusLabel: 'مغلق', message: 'تم تسليم الطلب الأخير.', onPress: goToInbox, marquee: false };
    return { statusLabel: `#${activeOrderDisplayId}`, message: `${activeSummary.currentStageLabel} · ${activeSummary.etaLabel}`, onPress: () => setActiveOrderExpanded((c) => !c), marquee: false };
  }, [isCaptainAvailable, inboxState, currentAvailabilityMeta, activeOrderDisplayId, activeSummary, goToInbox, resetInboxState]);

  const captainAccountNavItems = React.useMemo(() => [
    { title: 'بيانات الكابتن', subtitle: 'الهوية، النوع، والحالة الحالية.', badgeLabel: 'مباشر', icon: 'person-outline' as const, onPress: () => openCaptainAccountSection('account-profile') },
    { title: wltDshCaptainUiCopy.financeTitle, subtitle: wltDshCaptainUiCopy.financeSubtitle, badgeLabel: wltDshCaptainUiCopy.financeBadgeLabel, icon: 'wallet-outline' as const, onPress: () => openCaptainAccountSection('account-finance') },
    { title: 'الطلبات', subtitle: 'الطلب النشط والسجل المختصر.', badgeLabel: 'نشط', icon: 'receipt-outline' as const, onPress: () => openCaptainAccountSection('account-orders') },
    { title: 'الوثائق والتقييم', subtitle: 'الملفات، التقييم، والمستوى.', badgeLabel: 'جاهز', icon: 'document-text-outline' as const, onPress: () => openCaptainAccountSection('account-docs') },
    { title: 'الدوام / الإجازات', subtitle: 'الحضور وجدول اليوم.', badgeLabel: 'اليوم', icon: 'calendar-outline' as const, onPress: () => openCaptainAccountSection('account-shifts') },
    { title: 'الإعدادات', subtitle: 'المظهر ووضع التطبيق.', badgeLabel: 'محلي', icon: 'settings-outline' as const, onPress: () => openCaptainAccountSection('account-support') },
    { title: 'الدعم', subtitle: 'دليل مسارات DSH.', badgeLabel: 'مفتوح', icon: 'help-circle-outline' as const, onPress: openSupportDirectory },
  ], [openCaptainAccountSection, openSupportDirectory]);

  // ─── Bottom nav bar (UI display only) ─────────────────────────────────────────

  const isStoreCourier = isStoreCourierMode;
  let captainBottomActiveId = '';
  if (isStoreCourier) {
    captainBottomActiveId = route === 'home' ? 'my-orders' : route === 'account' ? 'profile' : '';
  } else {
    if (route === 'inbox' || route === 'account-orders') captainBottomActiveId = 'orders';
    else if (route === 'account-finance') captainBottomActiveId = 'wallet';
    else if (route === 'support-directory' || route === 'support-screen') captainBottomActiveId = 'support';
    else if (['account', 'account-profile', 'account-docs', 'account-shifts', 'account-support'].includes(route)) captainBottomActiveId = 'profile';
  }

  const captainBottomNavBar = isStoreCourier ? (
    <BottomNavBar
      activeId={captainBottomActiveId} direction="rtl"
      launcherLabel="طلباتي" launcherIcon="receipt-outline" launcherActive={route === 'home'}
      onLauncherPress={() => setRoute('home')}
      onSelect={(id: string) => {
        if (id === 'history') openCaptainAccountSection('account-orders');
        if (id === 'earnings') openCaptainAccountSection('account-finance');
        if (id === 'support') openSupportDirectory();
        if (id === 'profile') openCaptainAccount();
      }}
      items={[
        { id: 'history',  label: 'السجل',    icon: 'time-outline',        activeIcon: 'time' },
        { id: 'support',  label: 'الدعم',     icon: 'help-circle-outline', activeIcon: 'help-circle' },
        { id: 'earnings', label: 'مستحقاتي',  icon: 'cash-outline',        activeIcon: 'cash' },
        { id: 'profile',  label: 'حسابي',     icon: 'person-outline',      activeIcon: 'person' },
      ]}
    />
  ) : (
    <BottomNavBar
      activeId={captainBottomActiveId} direction="rtl"
      launcherLabel="الخريطة" launcherIcon="map-outline" launcherActive={route === 'home' || route === 'map'}
      onLauncherPress={() => setRoute('home')}
      onSelect={(id: string) => {
        if (id === 'orders') setRoute('inbox');
        if (id === 'wallet') openCaptainAccountSection('account-finance');
        if (id === 'support') openSupportDirectory();
        if (id === 'profile') openCaptainAccount();
      }}
      items={[
        { id: 'orders',  label: 'الطلبات',  icon: 'receipt-outline',      activeIcon: 'receipt' },
        { id: 'wallet',  label: 'المحفظة',  icon: 'wallet-outline',        activeIcon: 'wallet' },
        { id: 'support', label: 'الدعم',    icon: 'help-circle-outline',   activeIcon: 'help-circle' },
        { id: 'profile', label: 'حسابي',    icon: 'person-outline',        activeIcon: 'person' },
      ]}
    />
  );

  // ─── AMN mode placeholder ──────────────────────────────────────────────────────

  if (activeServiceType === 'amn') {
    return (
      <Box style={{ flex: 1 }} background="background">
        <MobileWorkspaceHeader
          title="AMN — قيد الربط"
          description="هذا المسار غير نشط داخل DSH حاليًا."
          icon="alert-circle-outline"
          backLabel="العودة إلى DSH"
          onBack={() => handleSelectServiceType('dsh')}
        />
        <Surface tone="raised" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <MobileScrollView fill padding={4} gap={4}>
            <StateView stateId="warning" title="AMN غير نشط داخل هذا السطح" description="DSH هو السياق التنفيذي النشط." actionLabel="العودة إلى DSH" onActionPress={() => handleSelectServiceType('dsh')} />
          </MobileScrollView>
        </Surface>
      </Box>
    );
  }

  // ─── Top bar ──────────────────────────────────────────────────────────────────

  const topBar = (
    <ModernPremiumHeader
      title={isStoreCourier ? 'موصل المتجر' : captainDisplayName}
      locationLabel={isStoreCourier ? 'وضع موصل المتجر — طلبات المتجر فقط' : buildWltDshCaptainTopBarLocationLabel(walletBalanceLabel)}
      actions={[
        { id: 'account',       icon: <Icon name="person-outline"        size={20} color={colorPalette.white} />, accessibilityLabel: 'الحساب',    onPress: openCaptainAccount },
        { id: 'search',        icon: <Icon name="search-outline"         size={20} color={colorPalette.white} />, accessibilityLabel: 'البحث',     onPress: openSupportDirectory },
        { id: 'notifications', icon: <Icon name="notifications-outline"  size={20} color={colorPalette.white} />, badgeCount: 2, accessibilityLabel: 'الإشعارات', onPress: () => setRoute('bell') },
        ...(isStoreCourier ? [] : [{
          id: 'wallet',
          icon: <Icon name="wallet-outline" size={20} color={colorPalette.white} />,
          accessibilityLabel: wltDshCaptainUiCopy.walletAccessibilityLabel,
          onPress: () => openCaptainSupportScreen('cod-liability'),
        }]),
      ]}
      tickerStatus={isStoreCourier ? 'موصل المتجر' : homeTicker?.statusLabel}
      tickerMessage={isStoreCourier ? 'انتظر تعيين الطلب التالي.' : homeTicker?.message}
      onTickerPress={isStoreCourier ? undefined : homeTicker?.onPress}
      direction="rtl"
    />
  );

  // ─── Account section routes ────────────────────────────────────────────────────

  if (route === 'account-finance') return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <View style={{ flex: 1, paddingBottom: showCaptainBottomNav ? 80 : 0 }}>
        <DshCaptainFinanceScreen onBack={() => setRoute('account')} dshAuthBearerToken={dshAuthBearerToken ?? undefined} dshClientId={dshClientId ?? undefined} />
      </View>
      {showCaptainBottomNav && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>{captainBottomNavBar}</View>}
    </View>
  );

  if (route !== 'home') {
    const kv = (label: string, value: string, tone?: string) => ({ label, value, ...(tone ? { tone } : {}) } as React.ComponentProps<typeof KeyValueList>['items'][number]);

    if (route === 'account-profile') return (
      <DshCaptainAccountShell title="بيانات الكابتن" subtitle="الهوية والحالة والملف التشغيلي" showBottomNav={showCaptainBottomNav} bottomNavNode={captainBottomNavBar} surfaceBackground={theme.surface}>
        <KeyValueList items={[kv('الاسم', captainDisplayName), kv('النوع', 'DSH', 'success'), kv('الحالة', currentAvailabilityMeta.label, currentAvailabilityMeta.chipTone === 'success' ? 'success' : 'warning'), kv('التقييم', '4.9 / 5', 'info'), kv('المستوى', 'Elite 3', 'brand')]} />
      </DshCaptainAccountShell>
    );

    if (route === 'account-orders') return (
      <DshCaptainAccountShell title="الطلبات" subtitle="الطلب النشط والسجل المختصر" showBottomNav={showCaptainBottomNav} bottomNavNode={captainBottomNavBar} surfaceBackground={theme.surface}>
        <KeyValueList items={[kv('الطلب النشط', `#${activeOrderDisplayId}`, 'success'), kv('المرحلة الحالية', activeSummary.currentStageLabel, 'info'), kv('الاستلام', activeSummary.pickupLabel), kv('التسليم', activeSummary.dropoffLabel), kv('الخطوة التالية', activeSummary.nextActionLabel, 'warning')]} />
      </DshCaptainAccountShell>
    );

    if (route === 'account-docs') return (
      <DshCaptainAccountShell title="الوثائق والتقييم" subtitle="الملفات والمستوى وجاهزية الاعتماد" showBottomNav={showCaptainBottomNav} bottomNavNode={captainBottomNavBar} surfaceBackground={theme.surface}>
        <KeyValueList items={[kv('التقييم', '4.9 / 5', 'info'), kv('المستوى', 'Elite 3', 'brand'), kv('حالة المراجعة', 'جاهز'), kv('الاعتماد الحقيقي', 'قيد الربط', 'warning')]} />
      </DshCaptainAccountShell>
    );

    if (route === 'account-shifts') return (
      <DshCaptainAccountShell title="الدوام / الإجازات" subtitle="الحضور وجدول اليوم" showBottomNav={showCaptainBottomNav} bottomNavNode={captainBottomNavBar} surfaceBackground={theme.surface}>
        <KeyValueList items={[kv('حالة الدوام', isCaptainAvailable ? 'متاح اليوم' : 'غير متاح اليوم', isCaptainAvailable ? 'success' : 'warning'), kv('جدول اليوم', 'صباحي', 'brand'), kv('الإجازة القادمة', 'قيد المراجعة')]} />
      </DshCaptainAccountShell>
    );

    if (route === 'account-support') return (
      <DshCaptainAccountShell title="الإعدادات" subtitle="المظهر ووضع التطبيق" showBottomNav={showCaptainBottomNav} bottomNavNode={captainBottomNavBar} surfaceBackground={theme.surface}>
        <DshCaptainAccountSettingsContent
          appearanceHydrated={appearanceHydrated}
          appearanceMode={appearanceMode}
          isStoreCourierMode={isStoreCourier}
          onSetAppearanceMode={setAppearanceMode}
          onToggleStoreCourierMode={(next) => { setCaptainAppMode(next ? 'store_courier_mode' : 'bthwani_captain_mode'); setRoute('home'); }}
        />
      </DshCaptainAccountShell>
    );

    if (route === 'account') return (
      <DshCaptainAccountShell title="حساب الكابتن" subtitle="ملف التشغيل والمالية والدوام" showBottomNav={showCaptainBottomNav} bottomNavNode={captainBottomNavBar} surfaceBackground={theme.surface}>
        <Box gap={4}>
          <Box layoutDirection="row" align="center" gap={3} style={{ flexDirection: 'row-reverse' }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.brandSurface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.brand + '44' }}>
              <Icon name="person" size={28} tone="brand" />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
              <Text role="titleSm">{captainDisplayName}</Text>
              <Box layoutDirection="row" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
                <Badge label="كابتن DSH" tone="success" />
                <Badge label={currentAvailabilityMeta.label} tone={currentAvailabilityMeta.chipTone} />
              </Box>
            </View>
          </Box>
          <Divider />
          <Box layoutDirection="row" gap={3} style={{ flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}><Text role="caption" tone="muted">التقييم</Text><Text role="bodyStrong" tone="info">4.9 ★</Text></View>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}><Text role="caption" tone="muted">المستوى</Text><Text role="bodyStrong" tone="brand">Elite 3</Text></View>
            <View style={{ flex: 1, minWidth: 80, alignItems: 'center', gap: 1 }}><Text role="caption" tone="muted">{wltDshCaptainUiCopy.summaryLabel}</Text><Text role="bodyStrong" tone="success">{walletBalanceLabel ?? '—'}</Text></View>
          </Box>
          <Divider />
          <Box gap={0}>{captainAccountNavItems.map((item) => <CaptainAccountNavRow key={item.title} title={item.title} subtitle={item.subtitle} badgeLabel={item.badgeLabel} icon={item.icon} onPress={item.onPress} />)}</Box>
        </Box>
      </DshCaptainAccountShell>
    );

    if (route === 'support-directory') return (
      <DshCaptainAccountShell title="دليل الدعم" subtitle="كل مسارات DSH المتبقية" showBottomNav={showCaptainBottomNav} bottomNavNode={captainBottomNavBar} surfaceBackground={theme.surface}>
        <DshCaptainSupportDirectoryScreen onOpenScreen={(id) => openCaptainSupportScreen(id as CaptainSupportRoute)} />
      </DshCaptainAccountShell>
    );

    if (route === 'support-screen') return (
      <DshCaptainAccountShell
        title={selectedSupportScreen === 'cod-liability' ? 'ذمة الدفع عند الاستلام' : 'الدعم'}
        subtitle="المسار المفتوح من الدليل"
        showBottomNav={showCaptainBottomNav}
        bottomNavNode={captainBottomNavBar}
        surfaceBackground={theme.surface}
      >
        <CaptainSupportScreenRouter
          selectedSupportScreen={selectedSupportScreen}
          onBack={openSupportDirectory}
          onNavigate={openCaptainSupportScreen}
          captainCollectsCod={captainCollectsCod}
          dshAuthBearerToken={dshAuthBearerToken}
          dshClientId={dshClientId}
          activeOrderId={activeOrderId}
          onAcceptTask={handleAcceptTask}
          onDeclineTask={(id) => { setDeclineOrderId(id); setIsDeclineSheetVisible(true); }}
        />
      </DshCaptainAccountShell>
    );

    if (route === 'bell') return (
      <DshCaptainAccountShell title="الإشعارات" subtitle="تنبيهات الطلبات الجديدة" showBottomNav={showCaptainBottomNav} bottomNavNode={captainBottomNavBar} surfaceBackground={theme.surface}>
        <DshCaptainBellScreen onOpenInbox={goToInbox} onOpenNextOrder={() => openOrderDetail(activeOrderId)} onRetry={() => setRoute('bell')} />
      </DshCaptainAccountShell>
    );

    // All other non-home routes go through the route renderer
    return (
      <DshCaptainRouteRenderer
        route={route}
        activeOrderId={activeOrderId}
        activeOrderDisplayId={activeOrderDisplayId}
        activeSummary={activeSummary}
        inboxState={inboxState}
        orderChatState={orderChatState}
        captainRuntimeId={captainRuntimeId}
        captainPodRequired={captainPodRequired}
        captainCollectsCod={captainCollectsCod}
        isStoreCourierMode={isStoreCourierMode}
        selectedSupportScreen={selectedSupportScreen}
        isPickupSheetVisible={isPickupSheetVisible}
        isDeliverySheetVisible={isDeliverySheetVisible}
        isDeclineSheetVisible={isDeclineSheetVisible}
        declineOrderId={declineOrderId}
        declineSheetState={declineSheetState}
        pickupSheetState={pickupSheetState}
        captainPodState={captainPodState}
        captainPodPhotoUri={captainPodPhotoUri}
        activeOrderMessages={activeOrderMessages}
        activeOrderDraft={activeOrderDraft}
        showBottomNav={showCaptainBottomNav}
        bottomNavNode={captainBottomNavBar}
        dshAuthBearerToken={dshAuthBearerToken ?? undefined}
        dshClientId={dshClientId ?? undefined}
        onOpenOrder={openOrderDetail}
        onRetryInbox={() => setInboxState('ready')}
        onConfirmPickup={confirmPickup}
        onConfirmDelivery={confirmDelivery}
        onConfirmPodSubmission={confirmPodSubmission}
        onReportPodFailure={reportPodFailure}
        onCapturePhoto={() => { setCaptainPodPhotoUri(undefined); setCaptainPodMediaKey(undefined); setCaptainPodState('retry-required'); }}
        onRetryPod={() => setCaptainPodState('ready')}
        onBack={goBack}
        onGoToInbox={goToInbox}
        onClosePickupSheet={() => { setIsPickupSheetVisible(false); setPickupSheetState('ready'); }}
        onCloseDeliverySheet={() => setIsDeliverySheetVisible(false)}
        onCloseDeclineSheet={() => setIsDeclineSheetVisible(false)}
        onConfirmDecline={handleDeclineConfirm}
        onAcceptTask={handleAcceptTask}
        onDeclineTask={(id) => { setDeclineOrderId(id); setIsDeclineSheetVisible(true); }}
        onOpenSupportScreen={openCaptainSupportScreen}
        onOpenSupportDirectory={openSupportDirectory}
        onPushLocation={captainOrderRuntime.pushLocation}
        onRingBell={() => {}}
      />
    );
  }

  // ─── Home screen ───────────────────────────────────────────────────────────────

  const orderPanelNode = (
    <DshCaptainHomeOrderPanel
      isAvailable={isCaptainAvailable}
      availabilityLabel={currentAvailabilityMeta.label}
      availabilityDescription={currentAvailabilityMeta.description}
      availabilityChipTone={currentAvailabilityMeta.chipTone}
      orderBadgeLabel={currentAvailabilityMeta.orderBadgeLabel}
      inboxState={inboxState as Parameters<typeof DshCaptainHomeOrderPanel>[0]['inboxState']}
      activeOrderDisplayId={activeOrderDisplayId}
      activeSummary={activeSummary as any}
      activeOrderPhase={activeOrderPhase}
      activeOrderExpanded={activeOrderExpanded}
      activeOrderMessages={activeOrderMessages}
      activeOrderDraft={activeOrderDraft}
      onSetActiveOrderDraft={setActiveOrderDraft}
      onCycleAvailability={() => setCaptainAvailabilityStatus((c) => c === 'available' ? 'unavailable' : 'available')}
      onOpenInbox={goToInbox}
      onRetryInbox={resetInboxState}
      onExpandOrder={() => setActiveOrderExpanded(true)}
      onCollapseOrder={() => setActiveOrderExpanded(false)}
      onConfirmPickup={confirmPickup}
      onConfirmDelivery={confirmDelivery}
      onOpenMap={() => setRoute('map')}
      onSendMessage={sendQuickMessage}
    />
  );

  return (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      {topBar}
      <Box background="background" padding={0} gap={0} radiusToken="none" border={false} style={{ flex: 1, marginTop: -2, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', paddingBottom: showCaptainBottomNav ? (Platform.OS === 'android' ? 112 : 80) : 0 }}>
        {isStoreCourier ? (
          <DshCaptainStoreCourierHomeContent
            courierStage={storeCourierStage}
            showBottomNav={showCaptainBottomNav}
            isAndroid={Platform.OS === 'android'}
            safeAreaBottom={insets.bottom}
            onMarkPickedUp={() => { set('storeCourierStage', 'picked_up'); set('activeOrderPhase', 'delivery'); }}
            onMarkOutForDelivery={() => { set('storeCourierStage', 'out_for_delivery'); set('activeOrderPhase', 'delivery'); }}
            onOpenProof={openStoreCourierProof}
            onMarkDeliveryFailed={() => { set('storeCourierStage', 'delivery_failed'); openSupportDirectory(); }}
            onRetryDelivery={() => set('storeCourierStage', storeCourierStage === 'picked_up' ? 'ready_for_pickup' : 'out_for_delivery')}
            onOpenSupport={openSupportDirectory}
            onOpenOrders={() => openCaptainAccountSection('account-orders')}
            bottomNavNode={captainBottomNavBar}
          />
        ) : (
          <DshCaptainMapLayer
            isAvailable={isCaptainAvailable}
            availabilityLabel={currentAvailabilityMeta.label}
            isGpsEnabled={isGpsEnabled}
            onToggleAvailability={(v) => setCaptainAvailabilityStatus(v ? 'available' : 'unavailable')}
            onToggleGps={(v) => setGpsStatus(v ? 'ready' : 'disabled')}
            orderPanelNode={orderPanelNode}
            bottomNavOffset={showCaptainBottomNav ? (Platform.OS === 'android' ? 112 : 80) : 0}
            safeAreaBottom={insets.bottom}
            showBottomNav={showCaptainBottomNav}
          />
        )}
      </Box>
      {showCaptainBottomNav && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>{captainBottomNavBar}</View>}
    </Box>
  );
}

export default DshCaptainSurface;
