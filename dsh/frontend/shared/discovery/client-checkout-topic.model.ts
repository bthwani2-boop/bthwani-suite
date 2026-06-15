// Canonical location: dsh/frontend/shared/discovery/client-checkout-topic.model.ts
// Authority: dsh/frontend/shared/discovery — client checkout topic model.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';

export type ClientCheckoutTopicModelProps = {
  cart: any;
  checkoutExecution: any;
  checkoutAuth: any;
};

export function useDshClientCheckoutTopicModel({
  cart,
  checkoutExecution,
  checkoutAuth,
}: ClientCheckoutTopicModelProps) {
  const {
    cartItems,
    selectedFulfillmentMode,
  } = cart;

  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentErrorMessage,
    checkoutState,
    setCheckoutState,
    createOrderValues,
    setCreateOrderValues,
    handleConfirmCheckout,
    handleConfirmedOrderExecution,
    checkoutClientMemo,
  } = checkoutExecution;

  return {
    cartItems,
    selectedFulfillmentMode,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentErrorMessage,
    checkoutState,
    setCheckoutState,
    createOrderValues,
    setCreateOrderValues,
    handleConfirmCheckout,
    handleConfirmedOrderExecution,
    checkoutClientMemo,
    checkoutAuth,
  };
}
