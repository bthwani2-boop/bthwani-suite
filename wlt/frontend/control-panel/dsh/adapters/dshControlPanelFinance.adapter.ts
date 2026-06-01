// Adapter: DSH Control Panel Finance — maps DSH host context to WLT finance screens.
// DSH passes routing/panel context; WLT screens consume read models only.
// CONTRACT_SCAFFOLD_PREVIEW_ONLY — no runtime data, no backend mutations.

export type DshFinancePanelContext = {
  readonly group: string;
  readonly subGroup?: string;
  readonly panel?: string;
  readonly technicalAuditMode: boolean;
};
