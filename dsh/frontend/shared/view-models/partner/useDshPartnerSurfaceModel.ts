// Canonical location: dsh/frontend/shared/view-models/partner/useDshPartnerSurfaceModel.ts
// Authority: dsh/frontend/shared — surface state model for DshPartnerSurface.
// Consolidates all partner surface state into a single hook.

import React from 'react';
import type {
  DshPartnerRoute,
  DshPartnerSupportRouteId,
  DshPartnerSupportCommandContext,
  DshPartnerOperationalFlowId,
  PartnerHubSection,
} from '../../contracts/partner';
import { usePartnerOrdersRuntime } from '../../../shared';
import {
  buildSupportCommandContextFromOperationalFlow,
  buildSupportCommandContextFromSupportRoute,
  defaultSupportCommandContext,
} from '../../adapters/support/dsh-partner-support-context.adapter';
import { isCommandCenterInlineManagedRoute } from '../../policies/partner-support';
import {
  buildPartnerDeliveryOpsSummary,
  buildPartnerProfileFromScope,
  storeScopeOptions,
} from './index';
import { getActionableHandoffsForSurface } from '../../contracts/dsh-order-lifecycle-handoffs';
import type { PartnerOrderItem } from '../../../app-partner/screens/OrdersInboxScreen';

export type DshPartnerSurfaceState = {
  route: DshPartnerRoute;
  storeScopeVisible: boolean;
  accountHubSection: PartnerHubSection;
  ordersSearchMode: boolean;
  selectedStoreScopeId: string;
  editingProductId: string | undefined;
  activeOrderId: string;
  supportNav: {
    screen: DshPartnerSupportRouteId;
    context: DshPartnerSupportCommandContext;
  };
};

export type DshPartnerSurfaceActions = {
  setRoute: (route: DshPartnerRoute) => void;
  setStoreScopeVisible: (v: boolean) => void;
  setAccountHubSection: (section: PartnerHubSection) => void;
  setOrdersSearchMode: (v: boolean) => void;
  setSelectedStoreScopeId: (id: string) => void;
  setEditingProductId: (id: string | undefined) => void;
  setActiveOrderId: (id: string) => void;
  setSelectedSupportScreen: (screen: DshPartnerSupportRouteId) => void;
  setSupportCommandContext: (context: DshPartnerSupportCommandContext) => void;
  handleOperationalFlowNavigation: (flow: DshPartnerOperationalFlowId, orderId?: string) => void;
  openOrdersBoard: () => void;
  openOrdersSearch: () => void;
  openAccountHub: (section: PartnerHubSection) => void;
  goBackToHub: () => void;
  openSupportDirectory: (context?: Partial<DshPartnerSupportCommandContext>) => void;
  returnToSupportDirectory: () => void;
  openInventoryManagement: () => void;
  openStoreCourier: () => void;
  openWalletHub: () => void;
  openStoreScope: () => void;
  openSupportScreen: (screenId: DshPartnerSupportRouteId, source?: DshPartnerSupportCommandContext['source']) => void;
  handleMarkReady: (orderId: string) => void;
  handleHardwareBackPress: () => boolean;
};

export type DshPartnerSurfaceModel = {
  state: DshPartnerSurfaceState;
  actions: DshPartnerSurfaceActions;
  selectedStoreScope: typeof storeScopeOptions[number];
  runtimePartnerProfile: ReturnType<typeof buildPartnerProfileFromScope>;
  partnerOrdersState: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'partial';
  partnerOrders: readonly PartnerOrderItem[];
  deliveryOpsSummary: ReturnType<typeof buildPartnerDeliveryOpsSummary>;
  isCommandCenterInline: boolean;
};

export function useDshPartnerSurfaceModel(
  initialRoute: DshPartnerRoute = 'inbox',
  initialOrderId: string = '',
): DshPartnerSurfaceModel {
  const [route, setRoute] = React.useState<DshPartnerRoute>(initialRoute);
  const [storeScopeVisible, setStoreScopeVisible] = React.useState(false);
  const [accountHubSection, setAccountHubSection] = React.useState<PartnerHubSection>('hub');
  const [ordersSearchMode, setOrdersSearchMode] = React.useState(false);
  const [selectedStoreScopeId, setSelectedStoreScopeId] = React.useState('all');
  const [editingProductId, setEditingProductId] = React.useState<string | undefined>(undefined);
  const [activeOrderId, setActiveOrderId] = React.useState(initialOrderId);
  const [supportNav, setSupportNav] = React.useState<{
    screen: DshPartnerSupportRouteId;
    context: DshPartnerSupportCommandContext;
  }>({
    screen: initialRoute === 'order-rejection' ? 'order-reject' : 'order-issue-queue',
    context: initialRoute === 'order-rejection'
      ? buildSupportCommandContextFromSupportRoute('order-reject', 'orders')
      : { ...defaultSupportCommandContext },
  });

  const selectedSupportScreen = supportNav.screen;
  const supportCommandContext = supportNav.context;
  const setSelectedSupportScreen = (screen: DshPartnerSupportRouteId) =>
    setSupportNav((s) => ({ ...s, screen }));
  const setSupportCommandContext = (context: DshPartnerSupportCommandContext) =>
    setSupportNav((s) => ({ ...s, context }));

  const routeHistoryRef = React.useRef<DshPartnerRoute[]>([initialRoute]);
  const routeTransitionFromBackRef = React.useRef(false);
  const supportDirectoryIntentRef = React.useRef(false);

  // ── Runtime data (from shared) ────────────────────────────────────────────
  const { orders: partnerOrders, state: partnerOrdersState, markReady: handleMarkReady } = usePartnerOrdersRuntime(route) as {
    orders: readonly PartnerOrderItem[];
    state: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'partial';
    markReady: (orderId: string) => void;
  };

  // ── Route history (UI-only navigation tracking) ───────────────────────────
  React.useEffect(() => {
    const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1];
    if (route !== prev) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
    }
    if (route !== 'inbox' && ordersSearchMode) setOrdersSearchMode(false);
  }, [ordersSearchMode, route]);

  // ── Derived model from shared pure functions ───────────────────────────────
  const selectedStoreScope = React.useMemo(
    () => storeScopeOptions.find((o) => o.id === selectedStoreScopeId) ?? storeScopeOptions[0],
    [selectedStoreScopeId],
  );
  const runtimePartnerProfile = React.useMemo(
    () => buildPartnerProfileFromScope(selectedStoreScope),
    [selectedStoreScope],
  );
  const partnerActionableHandoffs = React.useMemo(
    () => getActionableHandoffsForSurface('app-partner'),
    [],
  );
  const deliveryOpsSummary = React.useMemo(
    () => buildPartnerDeliveryOpsSummary(partnerOrders, partnerActionableHandoffs),
    [partnerActionableHandoffs, partnerOrders],
  );

  const isCommandCenterInline = isCommandCenterInlineManagedRoute(selectedSupportScreen);

  // ── Navigation actions (UI-only) ──────────────────────────────────────────
  const openOrdersBoard = React.useCallback(() => {
    setOrdersSearchMode(false);
    setRoute('inbox');
  }, []);
  const openOrdersSearch = React.useCallback(() => {
    setOrdersSearchMode(true);
    setRoute('inbox');
  }, []);
  const openAccountHub = React.useCallback((section: PartnerHubSection) => {
    setAccountHubSection(section);
    setRoute('home');
  }, []);
  const goBackToHub = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry');
      return;
    }
    openAccountHub('hub');
  }, [openAccountHub]);
  const markSupportDirectoryIntent = React.useCallback(() => {
    supportDirectoryIntentRef.current = true;
    Promise.resolve().then(() => { supportDirectoryIntentRef.current = false; });
  }, []);
  const openSupportDirectory = React.useCallback((context?: Partial<DshPartnerSupportCommandContext>) => {
    markSupportDirectoryIntent();
    setSupportCommandContext({ ...defaultSupportCommandContext, ...context } as DshPartnerSupportCommandContext);
    setRoute('support-directory');
  }, [markSupportDirectoryIntent]);
  const returnToSupportDirectory = React.useCallback(() => setRoute('support-directory'), []);
  const openSupportCommandFromOperationalFlow = React.useCallback(
    (flowId: DshPartnerOperationalFlowId, source: DshPartnerSupportCommandContext['source'] = 'operations') => {
      openSupportDirectory(buildSupportCommandContextFromOperationalFlow(flowId, source));
    },
    [openSupportDirectory],
  );
  const openInventoryManagement = React.useCallback(() => setRoute('inventory-management'), []);
  const openStoreCourier = React.useCallback(() => setRoute('store-courier'), []);
  const openWalletHub = React.useCallback(() => openAccountHub('wallet'), [openAccountHub]);
  const openStoreScope = React.useCallback(() => setStoreScopeVisible(true), []);
  const openSupportScreen = React.useCallback(
    (screenId: DshPartnerSupportRouteId, source: DshPartnerSupportCommandContext['source'] = 'operations') => {
      const nextContext = buildSupportCommandContextFromSupportRoute(screenId, source);
      const shouldStay = supportDirectoryIntentRef.current && isCommandCenterInlineManagedRoute(screenId);
      supportDirectoryIntentRef.current = false;
      setSupportCommandContext(nextContext);
      if (shouldStay) { setRoute('support-directory'); return; }
      setSelectedSupportScreen(screenId);
      setRoute('support-screen');
    },
    [],
  );

  const handleOperationalFlowNavigation = React.useCallback((flowId: DshPartnerOperationalFlowId, orderId?: string) => {
    const ctx = buildSupportCommandContextFromOperationalFlow(flowId, orderId);
    setSupportCommandContext(ctx);
    setRoute('support');
  }, []);

  const handleHardwareBackPress = React.useCallback(() => {
    if (storeScopeVisible) { setStoreScopeVisible(false); return true; }
    if (ordersSearchMode) { setOrdersSearchMode(false); return true; }
    if (route === 'home' && accountHubSection !== 'hub') { setAccountHubSection('hub'); return true; }
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'entry');
      return true;
    }
    return false;
  }, [storeScopeVisible, ordersSearchMode, route, accountHubSection]);

  const state: DshPartnerSurfaceState = {
    route,
    storeScopeVisible,
    accountHubSection,
    ordersSearchMode,
    selectedStoreScopeId,
    editingProductId,
    activeOrderId,
    supportNav,
  };

  const actions: DshPartnerSurfaceActions = {
    setRoute,
    setStoreScopeVisible,
    setAccountHubSection,
    setOrdersSearchMode,
    setSelectedStoreScopeId,
    setEditingProductId,
    setActiveOrderId,
    setSelectedSupportScreen,
    setSupportCommandContext,
    handleOperationalFlowNavigation,
    openOrdersBoard,
    openOrdersSearch,
    openAccountHub,
    goBackToHub,
    openSupportDirectory,
    returnToSupportDirectory,
    openInventoryManagement,
    openStoreCourier,
    openWalletHub,
    openStoreScope,
    openSupportScreen,
    handleMarkReady,
    handleHardwareBackPress,
  };

  return {
    state,
    actions,
    selectedStoreScope,
    runtimePartnerProfile,
    partnerOrdersState,
    partnerOrders,
    deliveryOpsSummary,
    isCommandCenterInline,
  };
}
