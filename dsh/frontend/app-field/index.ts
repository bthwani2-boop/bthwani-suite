/**
 * DSH Field App Public API
 *
 * The primary surface contract now mirrors the app-client structure:
 * surface, route metadata, screen registry, and surface props are exported first.
 */

export { DshFieldSurface } from './DshFieldSurface';
export { DshFieldSurface as FieldSurfaceHost } from './DshFieldSurface';
export { default } from './mobile-entry';

export type {
	DshFieldCommandTarget,
	DshFieldNavigationCommand,
	DshFieldRoute,
	DshFieldRouteState,
	DshFieldSurfaceHostProps,
	DshFieldSurfaceProps,
} from './dsh-field.types';

export { dshFieldRoutes } from './dsh-field.routes';
export type {
	DshFieldLegacyRoute,
	DshFieldRouteId,
	DshFieldRouteRecord,
} from './dsh-field.routes';

export { dshFieldScreenRegistry } from './dsh-field.screen-registry';
export type { DshFieldScreenRegistryItem } from './dsh-field.screen-registry';

// Legacy compatibility exports kept intentionally until all namespace consumers move to DshFieldSurface.
export { DshFieldStoresScreen } from './screens/DshFieldStoresScreen';
export { DshFieldStoresHistoryScreen } from './screens/DshFieldStoresHistoryScreen';
export { DshFieldStoreOnboardingScreen } from './screens/DshFieldStoreOnboardingScreen';
export { DshFieldStoreVisitScreen } from './screens/DshFieldStoreVisitScreen';
export { DshFieldFinanceScreen } from './screens/DshFieldFinanceScreen';
export { DshFieldProfileScreen } from './screens/DshFieldProfileScreen';
export { DshFieldProfileHomeScreen } from './screens/DshFieldProfileHomeScreen';

export type {
	FieldLeadFilter,
	FieldLeadSource,
	FieldLeadStatus,
	FieldOnboardingDraft,
	FieldOnboardingSectionId,
	FieldSectionSummary,
	FieldStatusTone,
	FieldStoreFile,
} from './data/field-stores.preview-data';

export {
	createEmptyDraft,
	createFieldSeedStores,
	createManualFieldStore,
	fieldFilterOptions,
	fieldSectionLabels,
	fieldSectionOrder,
	fieldStatusLabels,
	fieldStatusTones,
	getFieldRequiredMissingItems,
	isFieldStoreReadOnly,
	mapFieldStoreToCanonicalProductCard,
	mapFieldStoreToCanonicalStoreCard,
	matchesFieldStoreFilter,
	resolveFieldCompletionPercent,
	resolveFieldFilterCounts,
	resolveFieldSectionSummaries,
	resolveFieldStoreLifecycleLabel,
	resolveFieldStoreNextActionLabel,
	resolveFieldStoreStatus,
	resolveFieldStoreStatusLabel,
	resolveFieldStoreStatusTone,
	submitFieldStoreForReview,
	syncFieldStoreFromDraft,
	touchFieldStoreDraft,
} from './data/field-stores.preview-data';

export {
	readFieldStoresLocal,
	writeFieldStoresLocal,
} from './data/field-onboarding.storage';

export type {
	DshFieldStoreVisitErrors,
	DshFieldStoreVisitScreenProps,
	DshFieldStoreVisitState,
	DshFieldStoreVisitValues,
	DshFieldVisitEvidenceItem,
} from './screens/DshFieldStoreVisitScreen';

export type {
	DshFieldStateModel,
	DshFieldSurfaceId,
	DshFieldSurfaceState,
} from './data/field-state.preview-data';

export type {
	DshFieldBindingContract,
	DshFieldBindingContracts,
} from './contracts/dsh-field-binding.contracts';

export { DSH_FIELD_BINDING_CONTRACTS } from './contracts/dsh-field-binding.contracts';
