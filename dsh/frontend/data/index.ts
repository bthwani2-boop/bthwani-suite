/**
 * CENTRAL DSH DOMAIN PREVIEW DATA — INDEX
 * Owner: dsh/frontend/data
 * UI_PREVIEW_ONLY: not runtime truth, not API/binding source
 *
 * SSoT for ALL DSH frontend preview/fixture data across all surfaces:
 * app-client, app-captain, app-field, app-partner, control-panel.
 *
 * No surface owns preview data locally. All imports must reference this package.
 *
 * Public API (38 domain files → 16 canonical entry points + raw domain anchors):
 *   categories   stores (+ discovery + items)   home   client-state   cart
 *   notifications   subscriptions   captain-state   captain-orders
 *   field-stores   partner-orders   commercial   loyalty   partner-offer
 *   campaign   promo   banner   video   growth   news-ticker
 *   marketing-review   catalog-adoption   operations-support
 *   dsh-assisted-order   dsh-customer-360   dsh-call-intake   dsh-order-rescue
 *   dsh-ops-intervention-playbook   cp-administration   cp-geo-heatmap
 *   cp-operations   platform   cp-vars   cp-recommendation   cp-fixture-locations
 */

// ── Core domain entities ────────────────────────────────────────────────────
export * from './categories.preview-data';
export * from './stores.preview-data';     // includes discovery + items + store builders

// ── app-client surface ──────────────────────────────────────────────────────
export * from './home.preview-data';
export * from './client-state.preview-data';
export * from './cart.preview-data';
export * from './notifications.preview-data';
export * from './subscriptions.preview-data'; // loyalty-commercial + subscriptions-commercial

// ── app-captain surface ─────────────────────────────────────────────────────
export * from './captain-state.preview-data'; // includes finance + profile types
export * from './captain-orders.preview-data';

// ── app-field surface ───────────────────────────────────────────────────────
export * from './field-stores.preview-data';  // includes state + visit + finance types

// ── app-partner surface ─────────────────────────────────────────────────────
export * from './partner-orders.preview-data'; // alert + conversation merged

// ── Commercial contracts + preview stores (cross-surface) ───────────────────
export * from './commercial.preview-contract';
export * from './loyalty.preview-store';
export * from './partner-offer.preview-store';
export * from './campaign.preview-store';
export * from './promo.preview-store';
export * from './banner.preview-store';
export * from './video.preview-store';
export * from './growth.preview-store';
export * from './news-ticker.preview-store'; // includes seed fixtures
export * from './marketing-review.preview-store';
export * from './catalog-adoption.preview-store';

// ── Operations + support (cross-surface) ───────────────────────────────────
export * from './operations-support.preview';
export * from './dsh-ops-intervention-playbook.preview';
export * from './dsh-assisted-order.preview';
export * from './dsh-customer-360.preview';
export * from './dsh-call-intake.preview';
export * from './dsh-order-rescue.preview';

// ── control-panel surface ───────────────────────────────────────────────────
export * from './cp-administration.mock';
export * from './cp-geo-heatmap.preview-data';
export * from './cp-operations.preview-data';
export * from './platform.preview-data';      // appearance + providers + services merged
export * from './cp-vars.preview';
export * from './cp-recommendation.preview-data'; // includes journey fixtures
export * from './cp-fixture-locations';
