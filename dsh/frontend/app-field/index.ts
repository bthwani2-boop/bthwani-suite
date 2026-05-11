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
export { DshFieldStoresScreen } from './DshFieldStoresScreen';
export { DshFieldStoresHistoryScreen } from './DshFieldStoresHistoryScreen';
export { DshFieldStoreOnboardingScreen } from './DshFieldStoreOnboardingScreen';
export { DshFieldStoreVisitScreen } from './DshFieldStoreVisitScreen';
export { DshFieldFinanceScreen } from './DshFieldFinanceScreen';
export { DshFieldProfileScreen } from './DshFieldProfileScreen';
export { DshFieldProfileHomeScreen } from './DshFieldProfileHomeScreen';

export type {
	FieldLeadFilter,
	FieldLeadSource,
	FieldLeadStatus,
	FieldOnboardingDraft,
	FieldOnboardingSectionId,
	FieldSectionSummary,
	FieldStatusTone,
	FieldStoreFile,
} from './field-stores.preview-data';

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
} from './field-stores.preview-data';

export {
	readFieldStoresLocal,
	writeFieldStoresLocal,
} from './FieldOnboardingStorage';

export type {
	DshFieldStoreVisitErrors,
	DshFieldStoreVisitScreenProps,
	DshFieldStoreVisitState,
	DshFieldStoreVisitValues,
	DshFieldVisitEvidenceItem,
} from './DshFieldStoreVisitScreen';

export type {
	DshFieldStateModel,
	DshFieldSurfaceId,
	DshFieldSurfaceState,
} from './field-state.preview-data';

export type {
	DshFieldBindingContract,
	DshFieldBindingContracts,
} from './dshFieldBinding.contracts';

export { DSH_FIELD_BINDING_CONTRACTS } from './dshFieldBinding.contracts';
