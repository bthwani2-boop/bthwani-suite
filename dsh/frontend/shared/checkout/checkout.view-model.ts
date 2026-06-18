// Canonical location: dsh/frontend/shared/checkout/checkout.view-model.ts
// Authority: dsh/frontend/shared/checkout — checkout view-model hook logic.

import React from 'react';
import { createDshCheckoutHttpClient, type DshCheckoutAuthContext, type DshCheckoutClient } from './checkout.api';
import { createDshOrderLifecycleHttpClient, resolveDshOrderApiBaseUrl, type DshOrderItemInput } from '../orders/dsh-order-lifecycle-client';
import { resolveDshDiscoveryStoresRuntimeConfig, parseCartItemPrice } from '../stores';
import type {
  CreateOrderValues,
  DshClientCheckoutState,
  DshClientQuoteSnapshot,
} from './checkout.contract';
import {
  initialCreateOrderValues,
} from './checkout.contract';
import type {
  DshFulfillmentDeliveryMode,
  HostCartItem,
} from '../cart';
import type { HostOrderSummary, DshRoute } from '../checkout/dsh-client-binding.contracts';
import { hostClientStates } from '../checkout/dsh-client-binding.contracts';
import type { DshClientState } from '../orders/orders.client-state';
import { isCodAllowedForMode } from '../finance-boundary';
import { mapLiveOrderToSummary } from '../orders/orders.adapters';
import { buildPaymentMethodsList } from './dsh-client-binding.contracts';
import type { WltDshWalletSessionState } from '../../../../wlt/frontend/dsh/shared';

export type WalletSessionContext = {
  balance: number | null;
  requestPayment: (amount: number, intentId?: string) => Promise<{ success: boolean; txId?: string; error?: string }>;
  refresh: () => Promise<void>;
};

export type ActiveStore = { id: string; name: string; subtitle?: string };

type UseDshCheckoutOptions = {
  cartItems: HostCartItem[];
  activeStore: ActiveStore;
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  checkoutAuth: DshCheckoutAuthContext;
  walletPreview: WalletSessionContext;
  createOrderValues: CreateOrderValues;
  onOrderExecute: (payload: {
    fulfillmentMode?: DshFulfillmentDeliveryMode;
    orderDraft?: Partial<CreateOrderValues>;
    wltPaymentRefId?: string;
    checkoutIntentId?: string;
  }) => void;
};

export type UseDshCheckoutResult = {
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (id: string) => void;
  checkoutState: 'ready' | 'loading' | 'payment-failed';
  setCheckoutState: (state: 'ready' | 'loading' | 'payment-failed') => void;
  paymentErrorMessage: string;
  checkoutIntentId: string | null;
  setCheckoutIntentId: (id: string | null) => void;
  checkoutClientMemo: DshCheckoutClient | undefined;
  handleConfirmCheckout: () => Promise<void>;
};

export function useDshCheckout({
  cartItems,
  activeStore,
  selectedFulfillmentMode,
  checkoutAuth,
  walletPreview,
  createOrderValues,
  onOrderExecute,
}: UseDshCheckoutOptions): UseDshCheckoutResult {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>('wallet');
  const [checkoutState, setCheckoutState] = React.useState<'ready' | 'loading' | 'payment-failed'>('ready');
  const [paymentErrorMessage, setPaymentErrorMessage] = React.useState<string>('');
  const [checkoutIntentId, setCheckoutIntentId] = React.useState<string | null>(null);

  const checkoutClientMemo = React.useMemo(() => {
    const apiConfig = resolveDshDiscoveryStoresRuntimeConfig();
    return apiConfig ? createDshCheckoutHttpClient(apiConfig.baseUrl, globalThis.fetch, checkoutAuth) : undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutAuth]);

  const handleConfirmCheckout = React.useCallback(async () => {
    setCheckoutState('loading');

    const apiConfig = resolveDshDiscoveryStoresRuntimeConfig();
    let resolvedIntentId: string | null = checkoutIntentId;
    let cartTotal: number;

    if (apiConfig && !resolvedIntentId) {
      try {
        const client: DshCheckoutClient = createDshCheckoutHttpClient(apiConfig.baseUrl, globalThis.fetch, checkoutAuth);
        const intentResp = await client.createCheckoutIntent(
          {
            store_id: activeStore.id,
            items: cartItems.map((item) => ({ product_id: item.id, quantity: item.qty })),
            delivery_address: createOrderValues.dropoffAddress || 'جوار الجبل الجديد',
          },
          checkoutAuth.clientId ?? '',
        );
        resolvedIntentId = intentResp.intent_id;
        setCheckoutIntentId(resolvedIntentId);
        cartTotal = intentResp.total_amount_minor_units > 0
          ? intentResp.total_amount_minor_units
          : cartItems.reduce((sum, item) => sum + parseCartItemPrice(item.priceLabel) * item.qty, 0)
            + (selectedFulfillmentMode === 'pickup' ? 0 : 1500);
      } catch (err) {
        console.error('[checkout:intent]', err);
        setCheckoutState('payment-failed');
        setPaymentErrorMessage('تعذر إنشاء جلسة الدفع. تحقق من تسجيل الدخول وحاول مرة أخرى.');
        return;
      }
    } else {
      cartTotal = cartItems.reduce((sum, item) => sum + parseCartItemPrice(item.priceLabel) * item.qty, 0)
        + (selectedFulfillmentMode === 'pickup' ? 0 : 1500);
    }

    if (selectedPaymentMethod === 'wallet') {
      try {
        const result = await walletPreview.requestPayment(cartTotal, resolvedIntentId ?? undefined);
        if (result.success && result.txId) {
          onOrderExecute({ wltPaymentRefId: result.txId, fulfillmentMode: selectedFulfillmentMode, checkoutIntentId: resolvedIntentId ?? undefined });
          setCheckoutState('ready');
          setCheckoutIntentId(null);
          void walletPreview.refresh();
        } else {
          setCheckoutState('payment-failed');
          setPaymentErrorMessage(
            result.error === 'insufficient_balance'
              ? 'عذراً، رصيد المحفظة غير كافٍ لإتمام عملية الشراء.'
              : 'فشلت عملية الدفع. يُرجى التحقق من المحفظة والمحاولة مرة أخرى.',
          );
        }
      } catch (err) {
        console.error('[checkout:wallet-payment]', err);
        setCheckoutState('payment-failed');
        setPaymentErrorMessage('حدث خطأ أثناء الاتصال بمحفظتك. يُرجى المحاولة لاحقاً.');
      }
    } else {
      if (selectedPaymentMethod === 'cod' && !isCodAllowedForMode(selectedFulfillmentMode)) {
        setCheckoutState('payment-failed');
        setPaymentErrorMessage('الدفع عند الاستلام غير متاح لهذا النوع من التوصيل.');
        return;
      }
      onOrderExecute({ wltPaymentRefId: resolvedIntentId ?? undefined, fulfillmentMode: selectedFulfillmentMode, checkoutIntentId: resolvedIntentId ?? undefined });
      setCheckoutState('ready');
      setCheckoutIntentId(null);
    }
  }, [
    selectedPaymentMethod, cartItems, selectedFulfillmentMode,
    walletPreview, onOrderExecute, checkoutIntentId,
    activeStore, createOrderValues.dropoffAddress, checkoutAuth,
  ]);

  return {
    selectedPaymentMethod, setSelectedPaymentMethod,
    checkoutState, setCheckoutState,
    paymentErrorMessage,
    checkoutIntentId, setCheckoutIntentId,
    checkoutClientMemo,
    handleConfirmCheckout,
  };
}

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
    checkoutIntentId?: string;
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

      const orderBaseUrl = resolveDshOrderApiBaseUrl();
      const orderClient = orderBaseUrl ? createDshOrderLifecycleHttpClient(orderBaseUrl, undefined, checkoutAuth) : null;
      if (!orderClient) return;
      const intentId = payload?.checkoutIntentId ?? '';
      if (!intentId) {
        console.error('[checkout:create-order] checkout_intent_id is required but missing');
        openTrackedOrder(undefined, { fulfillmentMode: payload?.fulfillmentMode, orderDraft: payload?.orderDraft });
        return;
      }
      orderClient.createOrder({
        store_id: activeStore.id,
        client_id: checkoutAuth.clientId ?? '',
        total_price: totalPrice,
        checkout_intent_id: intentId,
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

const CONTRACT_REQUIRED_DELIVERY_FEE_YER = 1500;

export type DshClientCheckoutPresenterModel = {
  addressLabel: string;
  subtotalLabel: string;
  deliveryFeeLabel: string;
  totalLabel: string;
  etaLabel: string;
  paymentMethods: ReturnType<typeof buildPaymentMethodsList>;
};

export function buildDshClientCheckoutPresenterModel(input: {
  cartItems: HostCartItem[];
  createOrderValues: CreateOrderValues;
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  selectedPaymentMethod: string;
  walletSession: WltDshWalletSessionState;
}): DshClientCheckoutPresenterModel {
  const cartSubtotal = input.cartItems.reduce(
    (sum, item) => sum + parseCartItemPrice(item.priceLabel) * item.qty,
    0,
  );
  const deliveryFee = input.selectedFulfillmentMode === 'pickup' ? 0 : CONTRACT_REQUIRED_DELIVERY_FEE_YER;
  const formattedBalance = input.walletSession.balance !== null ? `${input.walletSession.balance} ر.ي` : '...';
  const addressLabel = input.selectedFulfillmentMode === 'pickup'
    ? input.createOrderValues.pickupAddress || 'استلام من المتجر'
    : input.createOrderValues.dropoffAddress || 'عنوان التسليم غير محدد';

  return {
    addressLabel,
    subtotalLabel: `${cartSubtotal} ر.ي`,
    deliveryFeeLabel: `${deliveryFee} ر.ي`,
    totalLabel: `${cartSubtotal + deliveryFee} ر.ي`,
    etaLabel: input.selectedFulfillmentMode === 'pickup' ? '15 - 20 دقيقة' : '30 - 45 دقيقة',
    paymentMethods: buildPaymentMethodsList(formattedBalance, input.selectedPaymentMethod),
  };
}
