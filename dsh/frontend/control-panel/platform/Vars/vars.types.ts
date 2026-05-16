export type DshPlatformVarOwner = 'DSH' | 'WLT' | 'Provider';

export type DshPlatformVarStatus = 'preview-only' | 'contract-needed' | 'ready-for-binding';

export type DshPlatformVarScope =
  | 'Global'
  | 'Service'
  | 'Region'
  | 'City'
  | 'Zone'
  | 'Category'
  | 'Subcategory'
  | 'Store';

export type DshPlatformVarRisk = 'low' | 'medium' | 'high' | 'financial';

export type DshPlatformVarRecord = {
  id: string;
  key: string;
  label: string;
  owner: DshPlatformVarOwner;
  status: DshPlatformVarStatus;
  scope: DshPlatformVarScope;
  risk: DshPlatformVarRisk;
  currentPreviewValue: string;
  proposedPreviewValue?: string;
  effectSummary: string;
  auditRollbackHint: string;
  precedenceNote: string;
};

export type DshPlatformProviderControlRecord = DshPlatformVarRecord & {
  providerId: string;
  capability: string;
  priority: string;
  fallback: string;
  mode: string;
  testResult: string;
  rollbackTarget: string;
};

export type DshPlatformScopeLayer = {
  id: string;
  scope: DshPlatformVarScope;
  order: number;
  title: string;
  description: string;
  ownerGuard: string;
  note: string;
};

export type DshPlatformSimulationScenario = {
  id: string;
  title: string;
  owner: DshPlatformVarOwner;
  scope: DshPlatformVarScope;
  relatedKeys: readonly string[];
  expectedImpact: string;
  guardrail: string;
  blockedReason: string;
};

export type DshPlatformAuditEntry = {
  id: string;
  title: string;
  actor: string;
  event: string;
  targetKey: string;
  stateLabel: string;
  evidenceHint: string;
  rollbackHint: string;
};
