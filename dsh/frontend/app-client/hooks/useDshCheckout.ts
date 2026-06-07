import React from 'react';
import {
  createDshCheckoutHttpClient,
  createDshOrderLifecycleHttpClient,
  type DshCheckoutAuthContext,
  type DshCheckoutClient,
  type DshOrderItemInput,
} from '../../shared';
import { resolveDshDiscoveryStoresRuntimeConfig } from '../shared/dsh-discovery-stores-runtime-config';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import type { CreateOrderValues, HostCartItem, HostOrderSummary } from '../dsh-client.navigation-bridge';
import { hostClientStates } from '../dsh-client.navigation-bridge';

function parsePrice(priceLabel?: string): number {
  if (!priceLabel) return 10.0;
  const match = priceLabel.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 10.0;
}

type WalletPreview = {
  balance: number | null;
  requestPayment: (amount: number, intentId?: string) => Promise<{ success: boolean; txId?: string; error?: string }>;
};

type ActiveStore = { id: string; name: string; subtitle?: string };

type UseDshCheckoutOptions = {
  cartItems: HostCartItem[];
  activeStore: ActiveStore;
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  checkoutAuth: DshCheckoutAuthContext;
  walletPreview: WalletPreview;
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
    return apiConfig ? createDshCheckoutHttpClient(apiConfig.baseUrl, globalThis.fetch, checkoutAuth) : undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutAuth]);

  const handleConfirmCheckout = React.useCallback(async () => {
    setCheckoutState('loading');

    const cartSubtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.priceLabel) * item.qty, 0);
    const deliveryFeeNum = selectedFulfillmentMode === 'pickup' ? 0 : 1500;
    const cartTotal = cartSubtotal + deliveryFeeNum;

    // Create checkout intent if API is available and not already created
    const apiConfig = resolveDshDiscoveryStoresRuntimeConfig();
    let resolvedIntentId: string | null = checkoutIntentId;

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
      } catch {
        setCheckoutState('payment-failed');
        setPaymentErrorMessage('تعذر إنشاء جلسة الدفع. تحقق من تسجيل الدخول وحاول مرة أخرى.');
        return;
      }
    }

    if (selectedPaymentMethod === 'wallet') {
      try {
        const result = await walletPreview.requestPayment(cartTotal, resolvedIntentId ?? undefined);
        if (result.success && result.txId) {
          onOrderExecute({ wltPaymentRefId: result.txId, fulfillmentMode: selectedFulfillmentMode });
          setCheckoutState('ready');
          setCheckoutIntentId(null);
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
      // COD or other payment method — execute directly using intentId as reference
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
