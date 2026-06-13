import React from 'react';
import { resolveDshDiscoveryStoresRuntimeConfig } from '../shared/dsh-discovery-stores-runtime-config';
import { parseCartItemPrice } from '../shared/store-formatting';
import {
  createDshOrderLifecycleHttpClient,
  type DshOrderItemInput,
  type DshCheckoutAuthContext,
} from '../../shared';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import type { CreateOrderValues, HostOrderSummary, HostCartItem } from '../dsh-client.navigation-bridge';
import { hostClientStates } from '../dsh-client.navigation-bridge';
import { mapLiveOrderToSummary } from '../adapters/dshClientOrderAdapters';
import { useDshCheckout, type WalletSessionContext, type ActiveStore } from './useDshCheckout';
import type { DshRoute } from '../dsh-client.types';
import type { DshClientState } from '../../shared/client-state';

type UseDshClientOrderExecutionOptions = {
  cartItems: HostCartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<HostCartItem[]>>;
  activeStore: ActiveStore;
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  setSelectedFulfillmentMode: (mode: DshFulfillmentDeliveryMode) => void;
  checkoutAuth: DshCheckoutAuthContext;
  walletPreview: WalletSessionContext;
  createOrderValues: CreateOrderValues;
  setCreateOrderValues: React.Dispatch<React.SetStateAction<CreateOrderValues>>;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  openTrackedOrder: (orderId?: string, opts?: Record<string, unknown>) => void;
  setOrdersListState: React.Dispatch<React.SetStateAction<HostOrderSummary[]>>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<string>>;
  setTrackingClientState: React.Dispatch<React.SetStateAction<DshClientState>>;
  setTrackingOrderOverride: React.Dispatch<React.SetStateAction<Partial<CreateOrderValues> | null>>;
};

export function useDshClientOrderExecution({
  cartItems,
  setCartItems,
  activeStore,
  selectedFulfillmentMode,
  setSelectedFulfillmentMode,
  checkoutAuth,
  walletPreview,
  createOrderValues,
  setCreateOrderValues,
  setRoute,
  openTrackedOrder,
  setOrdersListState,
  setSelectedOrderId,
  setTrackingClientState,
  setTrackingOrderOverride,
}: UseDshClientOrderExecutionOptions) {

  const handleConfirmedOrderExecution = React.useCallback((payload?: {
    fulfillmentMode?: DshFulfillmentDeliveryMode;
    orderDraft?: Partial<CreateOrderValues>;
    wltPaymentRefId?: string;
  }) => {
    const config = resolveDshDiscoveryStoresRuntimeConfig();
    if (config && cartItems.length > 0) {
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + parseCartItemPrice(item.priceLabel) * item.qty,
        0
      );

      const items: DshOrderItemInput[] = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        price: parseCartItemPrice(item.priceLabel),
      }));

      const orderClient = createDshOrderLifecycleHttpClient(config.baseUrl, undefined, checkoutAuth);
      orderClient.createOrder({
        store_id: activeStore.id,
        client_id: checkoutAuth.clientId ?? 'client-101',
        total_price: totalPrice,
        wlt_payment_ref_id: payload?.wltPaymentRefId,
        items,
      }).then((resp) => {
        const liveOrder = resp.order;
        const targetFulfillment = (payload?.fulfillmentMode ?? selectedFulfillmentMode) as DshFulfillmentDeliveryMode;
        const nextOrderSummary = mapLiveOrderToSummary(
          liveOrder,
          activeStore,
          totalPrice,
          targetFulfillment,
          payload?.orderDraft?.dropoffAddress || '',
          payload?.orderDraft?.note || 'تم الإنشاء برمجياً',
          cartItems,
        );

        setOrdersListState((current) => [nextOrderSummary, ...current]);
        setSelectedOrderId(liveOrder.id);
        setTrackingClientState(hostClientStates.trackingActive);
        setTrackingOrderOverride(null);
        setCreateOrderValues((current) => ({
          ...current,
          fulfillmentMode: nextOrderSummary.fulfillmentMode,
          dropoffAddress: nextOrderSummary.dropoffAddress,
          note: nextOrderSummary.note ?? '',
        }));
        setSelectedFulfillmentMode(nextOrderSummary.fulfillmentMode);
        setCartItems([]);
        setRoute('tracking');
      }).catch((err) => {
        console.error("Failed to place live order:", err);
        openTrackedOrder(undefined, {
          fulfillmentMode: payload?.fulfillmentMode ?? payload?.orderDraft?.fulfillmentMode ?? selectedFulfillmentMode,
          orderDraft: payload?.orderDraft,
        });
      });
    } else {
      openTrackedOrder(undefined, {
        fulfillmentMode: payload?.fulfillmentMode ?? payload?.orderDraft?.fulfillmentMode ?? selectedFulfillmentMode,
        orderDraft: payload?.orderDraft,
      });
    }
  }, [
    checkoutAuth,
    openTrackedOrder,
    selectedFulfillmentMode,
    cartItems,
    activeStore,
    setOrdersListState,
    setSelectedOrderId,
    setTrackingClientState,
    setTrackingOrderOverride,
    setCreateOrderValues,
    setSelectedFulfillmentMode,
    setCartItems,
    setRoute,
  ]);

  const checkoutHooksResult = useDshCheckout({
    cartItems,
    activeStore,
    selectedFulfillmentMode,
    checkoutAuth,
    walletPreview,
    createOrderValues,
    onOrderExecute: handleConfirmedOrderExecution,
  });

  return {
    handleConfirmedOrderExecution,
    ...checkoutHooksResult,
  };
}
