/**
 * ثوابت نسب مزودي الدفع وقواعد الاستقطاع — WLT
 * §ظ WLT_PROVIDER_FEE_AND_ABSORPTION_SPEC
 * Labels require t from useI18n — use getAbsorptionRuleLabels(t) / getFeePolicyLabels(t) in components.
 */

export const ABSORPTION_RULE_CODES = {
  DELIVERY_COST: 'DELIVERY_COST',
  PRODUCT_PRICE: 'PRODUCT_PRICE',
  PLATFORM: 'PLATFORM',
  CUSTOMER: 'CUSTOMER',
  SPLIT: 'SPLIT',
} as const;

export type AbsorptionRuleCode = (typeof ABSORPTION_RULE_CODES)[keyof typeof ABSORPTION_RULE_CODES];

export type TFunction = (key: string) => string;

export function getAbsorptionRuleLabels(t: TFunction): Record<AbsorptionRuleCode, string> {
  return {
    [ABSORPTION_RULE_CODES.DELIVERY_COST]: t('surfaces.استقطاع_من_تكلفة_التوصيل'),
    [ABSORPTION_RULE_CODES.PRODUCT_PRICE]: t('surfaces.إضافةاستقطاع_في_سعر_المنتج'),
    [ABSORPTION_RULE_CODES.PLATFORM]: t('surfaces.استقطاع_من_حصة_المنصة'),
    [ABSORPTION_RULE_CODES.CUSTOMER]: t('surfaces.استقطاع_من_العميل'),
    [ABSORPTION_RULE_CODES.SPLIT]: t('surfaces.توزيع_بين_أطراف'),
  };
}

export const FEE_POLICY_TYPES = {
  FIXED: 'fixed',
  PER_TRANSACTION: 'per_transaction',
  HYBRID: 'hybrid',
} as const;

export type FeePolicyType = (typeof FEE_POLICY_TYPES)[keyof typeof FEE_POLICY_TYPES];

/** Provider control-plane runtime mode (api-host persisted). */
export const PROVIDER_RUNTIME_MODES = ['local', 'mock', 'sandbox', 'real'] as const;
export type ProviderRuntimeMode = (typeof PROVIDER_RUNTIME_MODES)[number];

export function getFeePolicyLabels(t: TFunction): Record<FeePolicyType, string> {
  return {
    [FEE_POLICY_TYPES.FIXED]: t('surfaces.نسبة_ثابتة'),
    [FEE_POLICY_TYPES.PER_TRANSACTION]: t('surfaces.حسب_المعاملات'),
    [FEE_POLICY_TYPES.HYBRID]: t('surfaces.هجين_نسبة_رسوم'),
  };
}

export interface ProviderFeeConfig {
  id: string;
  providerId: string;
  providerName: string;
  feePolicy: FeePolicyType;
  feePct: number;
  feeFixedMinYer: number;
  feeFixedMaxYer: number;
  enabled: boolean;
  mode: ProviderRuntimeMode;
  updatedAt?: string;
}

export interface AbsorptionRuleConfig {
  primaryRule: AbsorptionRuleCode;
  splitDeliveryPct: number;
  splitProductPct: number;
  splitPlatformPct: number;
  splitCustomerPct: number;
  updatedAt?: string;
}
