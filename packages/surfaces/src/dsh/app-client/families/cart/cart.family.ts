export const dshCartFamily = {
  id: 'cart',
  title: 'Cart',
  screens: [
    'DshCartGetScreen',
    'DshCartInitScreen',
    'DshCartItemAddScreen',
    'DshCartItemRemoveScreen',
    'DshCartItemUpdateScreen',
  ],
  note: 'Grouped cart flow with review, init, add, remove, and update steps.',
} as const;
