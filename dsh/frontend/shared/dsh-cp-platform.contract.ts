/**
 * SCAFFOLD: DSH Control Panel platform workspace shared types.
 * These are preview-neutral contracts for the Appearance, Providers, Services,
 * and Vars workspaces inside dsh/frontend/control-panel/platform/.
 *
 * Moved here from surface-local types files to correct the dependency direction:
 * dsh/frontend/data must not import from dsh/frontend/control-panel.
 *
 * Owner: dsh/frontend/shared
 * Not a runtime binding — not API/backend source.
 */

export const dshCpPlatformContractMeta = {
  dataKind: 'SCAFFOLD_PENDING_BINDING',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

// ─── Appearance ──────────────────────────────────────────────────────────────

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

// ─── Providers ───────────────────────────────────────────────────────────────

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
  | 'المخاطر والاحتيال'
  | 'البنية التحتية';

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

// ─── Services ────────────────────────────────────────────────────────────────

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

// ─── Platform Vars ───────────────────────────────────────────────────────────

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
  affectedSurfaces: readonly string[];
  auditRequired: boolean;
  mutationAllowed: false;
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
