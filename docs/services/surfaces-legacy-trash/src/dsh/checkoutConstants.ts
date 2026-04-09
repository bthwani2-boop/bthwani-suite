/**
 * DSH Checkout — Single Source of Truth (SSoT)
 * DSH_PARTNER_AGREEMENT_AND_CHECKOUT_SPEC.md
 *
 * - طرق الدفع: WLT | COD | WLT+COD فقط.
 * - نسخ واجهة اختيار طريقة التوصيل (عند تعدد الأنماط).
 * - لا استدعاء t() على مستوى الموديول؛ المستهلك يمرّر t من useI18n().
 */

export type DshPaymentMethodType = 'wlt' | 'cod' | 'wlt_cod_hybrid';

export interface DshPaymentOption {
  id: DshPaymentMethodType;
  label: string;
  description: string;
  icon: string;
}

/** خيارات الدفع بالمنصة — يُستدعى من داخل component مع t من useI18n(). */
export function getDshPaymentOptions(t: (key: string) => string): DshPaymentOption[] {
  return [
    {
      id: 'wlt',
      label: t('dsh.checkoutConstants.modeDeliveryLabel'),
      description: t('dsh.checkoutConstants.modeDeliveryDescription'),
      icon: '💳',
    },
    {
      id: 'cod',
      label: t('dsh.checkoutConstants.modePickupLabel'),
      description: t('dsh.checkoutConstants.modePickupDescription'),
      icon: '💵',
    },
    {
      id: 'wlt_cod_hybrid',
      label: t('dsh.checkoutConstants.modeDineInLabel'),
      description: t('dsh.checkoutConstants.modeDineInDescription'),
      icon: '💳💵',
    },
  ];
}

/** النص المعروض عند تعدد أنماط التوصيل — يُستدعى من component مع t. */
export function getDshDeliveryChoiceCopy(t: (key: string) => string): string {
  return t('dsh.checkoutConstants.unknownModeLabel');
}
