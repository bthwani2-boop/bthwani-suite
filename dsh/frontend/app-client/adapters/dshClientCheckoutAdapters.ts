export function buildPaymentMethodsList(formattedBalance: string, selectedPaymentMethod: string) {
  return [
    {
      id: 'wallet',
      label: `المحفظة (الرصيد: ${formattedBalance})`,
      icon: 'wallet-outline',
      isSelected: selectedPaymentMethod === 'wallet',
    },
    {
      id: 'cod',
      label: 'الدفع عند الاستلام (COD)',
      icon: 'cash-outline',
      isSelected: selectedPaymentMethod === 'cod',
    },
  ];
}
