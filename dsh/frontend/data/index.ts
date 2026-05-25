/**
 * CENTRAL DSH DOMAIN PREVIEW DATA — INDEX
 * Owner: dsh/frontend/data
 * UI_PREVIEW_ONLY: not runtime truth, not API/binding source
 *
 * This is the single source of truth for all DSH domain preview entities.
 * Surfaces may own only: presentation adapters, view models, labels,
 * layout state, and screen-only UI fixtures.
 *
 * Exports only files that have actual data. Do not export screen-only surface fixtures.
 */

export * from './categories.preview-data';
export * from './discovery.preview-data';
export * from './items.preview-data';
