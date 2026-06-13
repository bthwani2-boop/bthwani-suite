import { buildPaymentMethodsList } from '../adapters/dshClientCheckoutAdapters';
import type { DshFulfillmentDeliveryMode } from '../contracts/dsh-client-binding.contracts';
import type { CreateOrderValues, HostCartItem } from '../dsh-client.navigation-bridge';
import { parseCartItemPrice } store-formatting';
import type { WltDshWalletSessionState } from '../../../../wlt/frontend/dsh/app-client/wlt-dsh-client.types';

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
