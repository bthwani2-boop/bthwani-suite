/**
 * dsh-control-panel-display.ts
 * Central display utilities shared across DSH control-panel surfaces.
 * Display-only — no business logic, no financial state, no API calls.
 */

export type DshControlPanelTone = 'neutral' | 'success' | 'warning' | 'danger';

/**
 * Normalizes data-driven tone labels (from preview/runtime data) to
 * the standard set used by UI components.
 * Used by all operations screens to render status tags and risk badges.
 */
export const DSH_CONTROL_PANEL_TONE_MAP: Record<string, DshControlPanelTone> = {
  warning: 'warning',
  danger: 'danger',
  best: 'success',
  brand: 'neutral',
};

/**
 * Resolves a UI tone from an order's UPPER_CASE runtime status string.
 * Matches status values from DshOrderRecord (dsh-order-lifecycle-client.ts).
 */
export function resolveRuntimeOrderStatusTone(status: string): DshControlPanelTone {
  if (status === 'FAILED_DELIVERY' || status === 'CANCELLED') return 'danger';
  if (status === 'CREATED' || status === 'RETURNING_TO_STORE') return 'warning';
  if (status === 'DELIVERED' || status === 'RETURNED') return 'success';
  return 'neutral';
}
