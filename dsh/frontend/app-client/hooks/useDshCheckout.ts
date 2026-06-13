import React from 'react';
import {
  getDshCheckoutRuntimeClient,
  type DshCheckoutAuthContext,
  type DshCheckoutClient,
  type DshOrderItemInput,
} from '../../shared';
import { resolveDshDiscoveryStoresRuntimeConfig } from '../adapters/dsh-discovery-stores-runtime-config';
import { parseCartItemPrice } from '../adapters/store-formatting';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import type { CreateOrderValues, HostCartItem, HostOrderSummary } from '../dsh-client.navigation-bridge';
import { hostClientStates } from '../dsh-client.navigation-bridge';
import { isCodAllowedForMode } from '../../shared/finance-boundary';

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
  /** Called when an order has been confirmed and paid — caller should persist the new order and navigate to tracking. */
  onOrderExecute: (payload: {
    fulfillmentMode?: DshFulfillmentDeliveryMode;
    orderDraft?: Partial<CreateOrderValues>;
    wltPaymentRefId?: string;
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

  // Stable client — recreated only when baseUrl or auth changes
  const checkoutClientMemo = React.useMemo(() => {
    const apiConfig = resolveDshDiscoveryStoresRuntimeConfig();
    return apiConfig ? getDshCheckoutRuntimeClient(apiConfig.baseUrl, checkoutAuth) : undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutAuth]);

  const handleConfirmCheckout = React.useCallback(async () => {
    setCheckoutState('loading');

    // Create checkout intent if API is available and not already created.
    // The intent response carries the backend-computed total (non-authoritative snapshot).
    const apiConfig = resolveDshDiscoveryStoresRuntimeConfig();
    let resolvedIntentId: string | null = checkoutIntentId;
    let cartTotal: number;

    if (apiConfig && !resolvedIntentId) {
      try {
        const client: DshCheckoutClient = getDshCheckoutRuntimeClient(apiConfig.baseUrl, checkoutAuth);
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
        // Use backend-computed total when available (Postgres mode).
        // Fall back to parsed display labels when backend returns 0 (in-memory dev mode).
        cartTotal = intentResp.total_amount_minor_units > 0
          ? intentResp.total_amount_minor_units
          : cartItems.reduce((sum, item) => sum + parseCartItemPrice(item.priceLabel) * item.qty, 0)
            + (selectedFulfillmentMode === 'pickup' ? 0 : 1500);
      } catch {
        setCheckoutState('payment-failed');
        setPaymentErrorMessage('تعذر إنشاء جلسة الدفع. تحقق من تسجيل الدخول وحاول مرة أخرى.');
        return;
      }
    } else {
      // Intent already created in a previous attempt — use parsed fallback (no re-fetch).
      cartTotal = cartItems.reduce((sum, item) => sum + parseCartItemPrice(item.priceLabel) * item.qty, 0)
        + (selectedFulfillmentMode === 'pickup' ? 0 : 1500);
    }

    if (selectedPaymentMethod === 'wallet') {
      try {
        const result = await walletPreview.requestPayment(cartTotal, resolvedIntentId ?? undefined);
        if (result.success && result.txId) {
          onOrderExecute({ wltPaymentRefId: result.txId, fulfillmentMode: selectedFulfillmentMode });
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
      } catch {
        setCheckoutState('payment-failed');
        setPaymentErrorMessage('حدث خطأ أثناء الاتصال بمحفظتك. يُرجى المحاولة لاحقاً.');
      }
    } else {
      if (selectedPaymentMethod === 'cod' && !isCodAllowedForMode(selectedFulfillmentMode)) {
        setCheckoutState('payment-failed');
        setPaymentErrorMessage('الدفع عند الاستلام غير متاح لهذا النوع من التوصيل.');
        return;
      }
      onOrderExecute({ wltPaymentRefId: resolvedIntentId ?? undefined, fulfillmentMode: selectedFulfillmentMode });
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
