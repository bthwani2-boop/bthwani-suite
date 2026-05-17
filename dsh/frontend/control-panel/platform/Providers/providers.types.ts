export type ProviderCategory =
  | 'الدفع'
  | 'الرسائل SMS'
  | 'الخرائط'
  | 'الإشعارات'
  | 'البريد الإلكتروني'
  | 'التخزين'
  | 'التحليلات'
  | 'البحث'
  | 'الذكاء الاصطناعي'
  | 'المخاطر والاحتيال';

export type ProviderEnvironment = 'test' | 'sandbox' | 'production';
export type ProviderStatus = 'active' | 'inactive' | 'test-only' | 'pending-approval';
export type ProviderOwner = 'Platform' | 'DesignSystem' | 'ServiceOwner';

export interface ProviderRecord {
  id: string;
  /** Human-readable Arabic label shown as primary heading */
  label: string;
  category: ProviderCategory;
  selectedProvider: string;
  /** Always masked — never show real keys */
  maskedCredential: string;
  environment: ProviderEnvironment;
  status: ProviderStatus;
  owner: ProviderOwner;
  priority: number;
  fallbackProvider?: string;
  lastTestResult?: 'pass' | 'fail' | 'not-run';
  rollbackTarget?: string;
  evidence?: string;
  activationNote: string;
}
