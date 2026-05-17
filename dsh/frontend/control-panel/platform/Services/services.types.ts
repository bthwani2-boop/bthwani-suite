export type ServiceStatus = 'live' | 'paused' | 'internal-only' | 'pilot' | 'maintenance';
export type ServiceClientVisibility = 'visible' | 'hidden';
export type ServiceScope = 'Global' | 'Region' | 'City' | 'Zone' | 'Service';
export type ServiceOwner = 'Platform' | 'Operations' | 'DesignSystem';
export type ServiceRisk = 'low' | 'medium' | 'high' | 'critical';

export interface ServiceRecord {
  id: string;
  /** Human-readable Arabic label shown as primary heading */
  label: string;
  description: string;
  owner: ServiceOwner;
  status: ServiceStatus;
  clientVisibility: ServiceClientVisibility;
  scope: ServiceScope;
  risk: ServiceRisk;
  effectSummary: string;
  auditRollbackHint: string;
  reason?: string;
  evidence?: string;
  rollbackTarget?: ServiceStatus;
}
