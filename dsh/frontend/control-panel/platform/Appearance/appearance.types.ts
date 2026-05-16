export type AppearanceStatus = 'preview-only' | 'contract-needed' | 'ready-for-binding';
export type AppearanceScope = 'Global' | 'Platform' | 'Service' | 'Surface' | 'Campaign';
export type AppearanceRisk = 'low' | 'medium' | 'high' | 'visual-identity';
export type AppearanceOwner = 'Platform' | 'DesignSystem' | 'DSH' | 'Marketing';

export interface AppearanceRecord {
  id: string;
  label: string;
  owner: AppearanceOwner;
  status: AppearanceStatus;
  scope: AppearanceScope;
  risk: AppearanceRisk;
  currentPreviewValue: string;
  proposedPreviewValue: string;
  effectSummary: string;
  auditRollbackHint: string;
  centralColorSystemNote: string;
  reason?: string;
  evidence?: string;
  rollbackTarget?: string;
}
