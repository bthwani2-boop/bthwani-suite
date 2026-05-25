/**
 * CENTRAL DSH DOMAIN PREVIEW DATA — INDEX
 * Owner: dsh/frontend/data
 * UI_PREVIEW_ONLY: not runtime truth, not API/binding source
 *
 * SSoT for ALL DSH frontend preview/fixture data across all surfaces:
 * app-client, app-captain, app-field, app-partner, control-panel.
 *
 * No surface owns preview data locally. All imports must reference this package.
 */

// Shared domain entities (categories, stores, products)
export * from './categories.preview-data';
export * from './discovery.preview-data';
export * from './items.preview-data';

// app-client surface preview data
export * from './home.preview-data';
export * from './client-state.preview-data';
export * from './store.preview-data';
export * from './cart.preview-data';
export * from './notifications.preview-data';
export * from './loyalty-commercial.preview-data';
export * from './subscriptions-commercial.preview-data';

// app-captain surface preview data
export * from './captain-state.preview-data';
export * from './captain-orders.preview-data';
export * from './captain-finance.preview-data';
export * from './captain-profile.preview-data';

// app-field surface preview data
export * from './field-stores.preview-data';
export * from './field-state.preview-data';
export * from './field-visit.preview-data';
export * from './field-finance.preview-data';

// app-field storage helper
export * from './field-onboarding.storage';

// app-partner surface preview data
export * from './partner-order-alert.preview-data';
export * from './partner-order-conversation.preview-data';

// Shared commercial contracts and preview stores (moved from dsh/frontend/shared/)
export * from './commercial.preview-contract';
export * from './loyalty.preview-store';
export * from './partner-offer.preview-store';
export * from './campaign.preview-store';
export * from './promo.preview-store';
export * from './banner.preview-store';
export * from './video.preview-store';
export * from './growth.preview-store';
export * from './news-ticker.preview-store';
export * from './news-ticker-fixtures';
export * from './marketing-review.preview-store';
export * from './catalog-adoption.preview-store';
export * from './operations-support.preview';
export * from './dsh-ops-intervention-playbook.preview';
export * from './dsh-assisted-order.preview';
export * from './dsh-customer-360.preview';
export * from './dsh-call-intake.preview';
export * from './dsh-order-rescue.preview';

// control-panel surface preview data
export * from './cp-administration.mock';
export * from './cp-geo-heatmap.preview-data';
export * from './cp-operations.preview-data';
export * from './cp-appearance.preview';
export * from './cp-providers.preview';
export * from './cp-services.preview';
export * from './cp-vars.preview';
export * from './cp-recommendation.preview-data';
export * from './cp-journey-fixtures';
export * from './cp-fixture-locations';
