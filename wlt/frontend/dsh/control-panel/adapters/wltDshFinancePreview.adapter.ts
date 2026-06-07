// Adapter state for legacy preview-only finance surfaces.
// Runtime-bound finance reads use wltDshFinanceRuntime.adapter.ts.

export type WltDshFinanceAdapterState = 'preview_only' | 'contract_tbd' | 'runtime_unbound' | 'runtime_bound';

export const WLT_DSH_FINANCE_ADAPTER_STATE: WltDshFinanceAdapterState = 'runtime_bound';
