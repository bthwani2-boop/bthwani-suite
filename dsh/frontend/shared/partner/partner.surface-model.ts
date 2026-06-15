// Canonical location: dsh/frontend/shared/partner/partner.surface-model.ts
// Authority: dsh/frontend/shared/partner — thin orchestration shell for partner surface.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type {
  DshPartnerRoute,
  DshPartnerSupportRouteId,
  DshPartnerSupportCommandContext,
  DshPartnerOperationalFlowId,
  PartnerHubSection,
  DshPartnerSurfaceState,
  DshPartnerSurfaceActions,
  DshPartnerSurfaceModel,
} from './partner.types';
import { storeScopeOptions } from './partner.types';
import type { PartnerOrderItem } from '../orders';

// Topic models
import { usePartnerProfileModel } from './partner-profile.model';
import { useStoreScopeModel } from '../stores/store-scope.model';
import { usePartnerOrdersModel } from '../orders/partner-orders.model';
import { usePartnerSupportModel } from '../support/partner-support.model';
import { usePartnerOpsSummaryModel } from '../operations/partner-ops-summary.model';

export type {
  DshPartnerSurfaceState,
  DshPartnerSurfaceActions,
  DshPartnerSurfaceModel,
};

export function useDshPartnerSurfaceModel(
  initialRoute: DshPartnerRoute = 'inbox',
  initialOrderId: string = '',
): DshPartnerSurfaceModel {
  // ── Sub-hooks ──────────────────────────────────────────────────────────────
  const profile = usePartnerProfileModel(initialRoute);
  const storeScope = useStoreScopeModel();
  const orders = usePartnerOrdersModel({
    route: profile.route,
    initialOrderId,
    setRoute: profile.setRoute,
  });
  const support = usePartnerSupportModel({
    initialRoute,
    setRoute: profile.setRoute,
  });
  const opsSummary = usePartnerOpsSummaryModel(orders.partnerOrders);

  // ── Sync order search mode when route changes ─────────────────────────────
  React.useEffect(() => {
    if (profile.route !== 'inbox' && orders.ordersSearchMode) {
      orders.setOrdersSearchMode(false);
    }
  }, [profile.route, orders]);

  // ── Orchestrated back press ───────────────────────────────────────────────
  const handleHardwareBackPress = React.useCallback(() => {
    if (storeScope.storeScopeVisible) {
      storeScope.setStoreScopeVisible(false);
      return true;
    }
    if (orders.ordersSearchMode) {
      orders.setOrdersSearchMode(false);
      return true;
    }
    if (profile.route === 'home' && profile.accountHubSection !== 'hub') {
      profile.setAccountHubSection('hub');
      return true;
    }
    if (profile.routeHistoryRef.current.length > 1) {
      profile.routeTransitionFromBackRef.current = true;
      profile.routeHistoryRef.current.pop();
      profile.setRoute(profile.routeHistoryRef.current[profile.routeHistoryRef.current.length - 1] ?? 'entry');
      return true;
    }
    return false;
  }, [storeScope, orders, profile]);

  const state: DshPartnerSurfaceState = {
    route: profile.route,
    storeScopeVisible: storeScope.storeScopeVisible,
    accountHubSection: profile.accountHubSection,
    ordersSearchMode: orders.ordersSearchMode,
    selectedStoreScopeId: storeScope.selectedStoreScopeId,
    editingProductId: orders.editingProductId,
    activeOrderId: orders.activeOrderId,
    supportNav: support.supportNav,
  };

  const actions: DshPartnerSurfaceActions = {
    setRoute: profile.setRoute,
    setStoreScopeVisible: storeScope.setStoreScopeVisible,
    setAccountHubSection: profile.setAccountHubSection,
    setOrdersSearchMode: orders.setOrdersSearchMode,
    setSelectedStoreScopeId: storeScope.setSelectedStoreScopeId,
    setEditingProductId: orders.setEditingProductId,
    setActiveOrderId: orders.setActiveOrderId,
    setSelectedSupportScreen: support.setSelectedSupportScreen,
    setSupportCommandContext: support.setSupportCommandContext,
    handleOperationalFlowNavigation: support.handleOperationalFlowNavigation,
    openOrdersBoard: orders.openOrdersBoard,
    openOrdersSearch: orders.openOrdersSearch,
    openAccountHub: profile.openAccountHub,
    goBackToHub: profile.goBackToHub,
    openSupportDirectory: support.openSupportDirectory,
    returnToSupportDirectory: support.returnToSupportDirectory,
    openInventoryManagement: profile.openInventoryManagement,
    openStoreCourier: profile.openStoreCourier,
    openWalletHub: profile.openWalletHub,
    openStoreScope: storeScope.openStoreScope,
    openSupportScreen: support.openSupportScreen,
    handleMarkReady: orders.handleMarkReady,
    handleHardwareBackPress,
  };

  return {
    state,
    actions,
    selectedStoreScope: storeScope.selectedStoreScope,
    runtimePartnerProfile: storeScope.runtimePartnerProfile,
    partnerOrdersState: orders.partnerOrdersState,
    partnerOrders: orders.partnerOrders,
    deliveryOpsSummary: opsSummary.deliveryOpsSummary,
    isCommandCenterInline: support.isCommandCenterInline,
  };
}
