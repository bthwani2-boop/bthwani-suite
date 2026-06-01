// Adapter: WLT DSH Finance Preview — bridges preview data to WLT screen read models.
// CONTRACT_SCAFFOLD_PREVIEW_ONLY — no runtime data, no backend mutations.

export type WltDshFinanceAdapterState = 'preview_only' | 'contract_tbd' | 'runtime_unbound';

export const WLT_DSH_FINANCE_ADAPTER_STATE: WltDshFinanceAdapterState = 'preview_only';
