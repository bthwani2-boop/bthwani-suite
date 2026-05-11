export { surfaceMeta } from './data/surface-meta.preview-data';
export { surfaceCatalog } from './data/surface-catalog.preview-data';

// Screens
export { DshAwnakOrderCreateScreen } from './parts/AwnakOrderCreateScreen';
export type {
	DshAwnakOrderCreateScreenProps,
	DshAwnakOrderCreateScreenState,
} from './parts/AwnakOrderCreateScreen';

export {
	DshCartGetScreen,
	DshCartUnifiedScreen,
} from './screens/CartScreen';
export type { DshCartUnifiedScreenProps } from './screens/CartScreen';

export { DshSearchScreen } from './screens/SearchScreen';
export type {
	DshSearchResult,
	DshSearchScreenProps,
} from './screens/SearchScreen';

export { DshEntryScreen } from './screens/EntryScreen';
export type {
	DshEntryScreenProps,
	DshEntryScreenState,
} from './screens/EntryScreen';

export { DshFavoriteToggleScreen } from './screens/FavoriteToggleScreen';
export type { DshFavoriteToggleScreenProps } from './screens/FavoriteToggleScreen';

export { DshFavoritesListScreen } from './screens/FavoritesScreen';
export type {
	DshFavoritesListItem,
	DshFavoritesListScreenProps,
} from './screens/FavoritesScreen';

export { DshClientBellScreen } from './screens/BellScreen';
export type { DshClientBellScreenProps } from './screens/BellScreen';

export { DshHomeGetScreen } from './screens/HomeScreen';
export type {
	DshHomeBannerActionType,
	DshHomeCategory,
	DshHomeGetPromo,
	DshHomeGetScreenProps,
	DshHomeGetStore,
	DshHomeRecentOrder,
} from './screens/HomeScreen';

export { DshMySpaceScreen } from './screens/MySpaceScreen';
export type {
	DshMySpaceItem,
	DshMySpaceScreenProps,
} from './screens/MySpaceScreen';

export { DshMySpaceCommercialScreen } from './parts/MySpaceCommercialScreen';
export type {
	DshMySpaceCommercialProgram,
	DshMySpaceCommercialScreenProps,
} from './parts/MySpaceCommercialScreen';

export { DshMySpaceOrdersScreen } from './parts/MySpaceOrdersScreen';
export type { DshMySpaceOrdersScreenProps } from './parts/MySpaceOrdersScreen';

export { DshNotificationsScreen } from './screens/NotificationsScreen';
export type {
	DshNotificationActionTarget,
	DshNotificationItem,
	DshNotificationsScreenProps,
} from './screens/NotificationsScreen';

export { DshBenefitsHubScreen } from './screens/BenefitsScreen';
export type { DshBenefitsHubScreenProps } from './screens/BenefitsScreen';

export { DshLoyaltyRewardsScreen } from './parts/LoyaltyRewardsScreen';
export type { DshLoyaltyRewardsScreenProps } from './parts/LoyaltyRewardsScreen';

export {
	DshIntakeHubScreen,
	DshOrdersListScreen,
	DshTrackingScreen,
} from './screens/OrdersTrackingScreens';
export type {
	DshIntakeHubScreenProps,
	DshOrdersListScreenProps,
	DshTrackingScreenProps,
} from './screens/OrdersTrackingScreens';

export { DshSheinOrderCreateScreen } from './parts/SheinOrderCreateScreen';
export type {
	DshSheinOrderCreateScreenProps,
	DshSheinOrderCreateScreenState,
} from './parts/SheinOrderCreateScreen';

export { DshStoreGetScreen } from './screens/StoreScreen';
export type { DshStoreGetScreenProps } from './screens/StoreScreen';

export { DshStoreItemsScreen } from './screens/StoreItemsScreen';
export type {
	DshStoreItem,
	DshStoreItemsScreenProps,
} from './screens/StoreItemsScreen';

export {
	DshConversationHubScreen,
	DshListingStatusUpdateScreen,
	DshOrderIssueHubScreen,
	DshProxyHubScreen,
	DshServiceSettingsHubScreen,
	DshZoneSetScreen,
	getCanonicalDestination,
} from './screens/OperationScreens';
export type { ClientOperationScreenId } from './screens/OperationScreens';

export { DshSubscriptionsScreen } from './parts/SubscriptionsScreen';
export type { DshSubscriptionsScreenProps } from './parts/SubscriptionsScreen';

// Data & Shared
export {
	getDshClientStateMeta,
	isDshClientExceptionState,
	isDshClientTerminalState,
	isDshClientWalletVisibleState,
} from './data/client-state.preview-data';
export type {
	DshClientState,
	DshClientStateGroup,
	DshClientStateMeta,
	DshClientStateVisibility,
} from './data/client-state.preview-data';

export type {
	DshClientAddressSnapshot,
	DshClientBindingError,
	DshClientCartLine,
	DshClientCartSnapshot,
	DshClientCheckoutSnapshot,
	DshClientCheckoutState,
	DshClientCreateOrderRequest,
	DshClientCreateOrderResponse,
	DshClientDeliveryLifecycleStatus,
	DshClientEventActorRole,
	DshClientEventSource,
	DshClientEventTimelineItem,
	DshClientEvidenceAttachment,
	DshClientExceptionReason,
	DshClientFulfillmentCapacityState,
	DshClientFulfillmentMode,
	DshClientFulfillmentModeSnapshot,
	DshClientFulfillmentWindow,
	DshClientGeocodeConfidence,
	DshClientHandoffVerification,
	DshClientId,
	DshClientIssueReportRequest,
	DshClientIssueReportResponse,
	DshClientOrderListItem,
	DshClientOrderSuccessPayload,
	DshClientOrderSuccessSnapshot,
	DshClientOrdersListResponse,
	DshClientPinAdjustment,
	DshClientProofCapturedBy,
	DshClientProofOfDeliveryType,
	DshClientProofOfDeliveryVisibility,
	DshClientProofVerificationResult,
	DshClientQuoteSnapshot,
	DshClientRatingPayload,
	DshClientRefundSummary,
	DshClientRefundVisibility,
	DshClientServiceabilityQuote,
	DshClientServiceabilitySnapshot,
	DshClientServiceabilityState,
	DshClientStoreItem,
	DshClientStoreSummary,
	DshClientSupportIssuePayload,
	DshClientTrackingSnapshot,
	DshClientTrackingState,
	DshClientTrackingTimelineItem,
	DshClientWalletImpactVisibility,
	DshClientWalletVisibility,
} from './contracts/dsh-client-binding.contracts';

export { DshHomeApprovedVideoReelsViewer } from './parts/ApprovedVideoReelsViewer';
export type { DshHomeApprovedVideoReelsViewerProps } from './parts/ApprovedVideoReelsViewer';

export { DshClientSurface, DshSurfaceHost } from './DshClientSurface';
export type {
	DshClientSurfaceProps,
	DshCommandTarget,
	DshRoute,
	DshSurfaceHostProps,
} from './dsh-client.types';

export { dshClientRoutes } from './dsh-client.routes';
export type {
	DshClientLegacyRoute,
	DshClientRouteId,
	DshClientRouteRecord,
} from './dsh-client.routes';

export { dshClientScreenRegistry } from './dsh-client.screen-registry';
export type { DshClientScreenRegistryItem } from './dsh-client.screen-registry';
