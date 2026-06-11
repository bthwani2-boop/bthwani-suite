export type {
	DshPartnerHubSurfaceProps,
	DshPartnerOperationalFlowId,
	DshPartnerRoute,
	DshPartnerSurfaceProps,
	PartnerDshSurfaceState,
	PartnerHubSection,
} from './dsh-partner.types';
export { DshPartnerSurface } from './DshPartnerSurface';
export type { DshPartnerRouteId, DshPartnerRouteRecord } from './dsh-partner.routes';
export type { DshPartnerLegacyRoute } from './dsh-partner.routes';
export { dshPartnerRoutes } from './dsh-partner.routes';
export type { DshPartnerRegistryRouteId, DshPartnerScreenRegistryItem } from './dsh-partner.screen-registry';
export { dshPartnerScreenRegistry } from './dsh-partner.screen-registry';
export type { DshPartnerBindingContract, DshPartnerBindingContracts, DshPartnerSurfaceId } from './contracts/dsh-partner-binding.contracts';
export { DSH_PARTNER_BINDING_CONTRACTS } from './contracts/dsh-partner-binding.contracts';

// CAT-BRIDGE-01: Partner catalog readiness panel
// Shows catalog stage, blocked reason, owner, and partner-editable fields.
// SCAFFOLD: GET /partner/catalog-readiness — not yet bound
// Partner CANNOT: approve, publish, set client-visible, modify product identity.
// Partner CAN: stock, availability, price override, preparationNote, internalNote.
export { PartnerCatalogReadinessPanel } from './parts/PartnerCatalogReadinessPanel';
export type { PartnerCatalogReadinessPanelProps } from './parts/PartnerCatalogReadinessPanel';

// Order rejection screen — SCAFFOLD: wired in screen registry, pending DshPartnerSurface routing
export { DshPartnerOrderRejectionScreen } from './screens/DshPartnerOrderRejectionScreen';
export type { DshPartnerOrderRejectionScreenProps } from './screens/DshPartnerOrderRejectionScreen';
