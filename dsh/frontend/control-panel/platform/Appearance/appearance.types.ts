export type AppearanceStatus = 'preview-only' | 'contract-needed' | 'ready-for-binding';
export type AppearanceScope = 'Global' | 'Platform' | 'App' | 'Surface' | 'Service';
export type AppearanceRisk = 'low' | 'medium' | 'high' | 'visual-identity';
export type AppearanceOwner = 'Platform' | 'DesignSystem' | 'AppShell' | 'ServiceOwner';

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
