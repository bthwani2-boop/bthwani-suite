export const dshCheckoutFamily = {
  id: 'checkout',
  title: 'Checkout',
  screens: [
    'DshCheckoutHubScreen',
    'DshCreateOrderScreen',
    'DshAwnakOrderCreateScreen',
    'DshReviewOrderScreen',
  ],
  note: 'Order creation and confirmation surfaces.',
} as const;
