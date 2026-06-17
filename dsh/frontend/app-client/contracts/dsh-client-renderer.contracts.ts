import type { Dispatch, SetStateAction, ReactNode } from 'react';
import type { DshHomeCategory, DshHomeGetPromo, DshHomeGetStore, DshHomeRecentOrder } from '../../shared/discovery/dsh-home-types';
import type { ClientOperationScreenId } from '../screens/parts/OperationScreenView';
import type { DshFulfillmentDeliveryMode } from '../../shared/checkout/dsh-client-binding.contracts';
import type { CreateOrderValues, HostCartItem, HostOrderSummary } from '../dsh-client.navigation-bridge';
import type { DshRoute } from '../dsh-client.types';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import type { DshClientWltIntentEntry } from '../../shared/finance-boundary';
import type { DshTrackingTimelineItem } from '../hooks';
import type { DshDiscoveryStoresBridgeResult } from '../../shared/stores';
import type { DshClientState } from '../dsh-client.types';
import type { DshCheckoutAuthContext } from '../../shared/checkout';
import type { DshStoreMenuItem, DshDiscoveryStore } from '../../shared/products';
import type { HomePromoRecord, MarketingGrowthRecord, MarketingVideoRecord } from '../../shared/marketing/marketing.types';
import type { WltDshWalletSessionState } from '../../shared/wlt/generated/wlt_frontend_dsh_shared.facade';
import type { DshStoreGetScreenProps } from '../screens/StoreScreen';
import type { DshSignalSummary } from '../../shared/marketing/dsh-signal-layer.model';
import type { DshOrderDetailsResponse } from '../../shared/orders';

export type DshClientSessionContext = {
  dshAuthBearerToken: string | null | undefined;
  dshClientId: string | null | undefined;
  appearanceHydrated: boolean;
  appearanceMode: BThwaniAppearanceMode;
  setAppearanceMode: (mode: BThwaniAppearanceMode) => void;
  bellSignalEvents: readonly DshSignalSummary[];
  walletSession: WltDshWalletSessionState;
};

export type DshClientRouteContext = {
  route: DshRoute;
  setRoute: Dispatch<SetStateAction<DshRoute>>;
  returnHome: () => void;
  openCreateOrderJourney: () => void;
  openTrackedOrder: (orderId?: string) => void;
  setSelectedOperationScreen: Dispatch<SetStateAction<ClientOperationScreenId>>;
  selectedOperationScreen: ClientOperationScreenId;
  onExit?: () => void;
  openSupportFlow: () => void;
  handleRegisterBackHandler: ((handler: (() => boolean) | null) => void) | undefined;
  serviceDialTrigger: number;
  onOpenService?: (serviceId: string) => void;
};

export type DshClientHomeContext = {
  categories: DshHomeCategory[];
  homeScreenState: 'ready' | 'loading' | 'empty' | 'error' | 'offline';
  homeMarketingPromos: DshHomeGetPromo[];
  homePromos: HomePromoRecord[];
  liveMarketingShorts: MarketingVideoRecord[];
  clientVisibleHomeStores: DshHomeGetStore[];
  homeRecentOrders: DshHomeRecentOrder[];
  homeSearchAutoOpenToken: number;
  favoriteOverrides: Record<string, boolean>;
  handleToggleFavorite: (storeId: string) => void;
  handleOpenHomeCategory: (categoryId: string) => void;
  handleOpenHomeStoreCategory: (storeId: string, categoryId: string) => void;
  handleOpenHomeProduct: (storeId: string, itemId: string) => void;
  handleOpenHomeBenefits: (screenId?: string) => void;
  openHomeInlineSearch: () => void;
  handleOpenHomeStore: (storeId: string) => void;
  setHomeRetryToken: Dispatch<SetStateAction<number>>;
  sheinInlineOpen: boolean;
  setSheinInlineOpen: (open: boolean) => void;
  awnakInlineOpen: boolean;
  setAwnakInlineOpen: (open: boolean) => void;
  renderApprovedVideoReelsViewer: ((props: unknown) => ReactNode) | undefined;
  clientDiscoveryStoresBridge: DshDiscoveryStoresBridgeResult;
};

export type DshClientStoreContext = {
  storeDetailState: 'loading' | 'ready' | 'empty' | 'error' | 'offline' | 'not-found';
  activeStoreScreenStore: DshStoreGetScreenProps['store'] | undefined;
  activeStoreItems: DshStoreMenuItem[];
  activeStoreId: string;
  activeStore: DshDiscoveryStore;
  itemsQuery: string;
  setItemsQuery: (q: string) => void;
  itemsCategory: string;
  setItemsCategory: (c: string) => void;
  storeItemsEntryOrigin: string;
  setSelectedItemId: (id: string) => void;
  addItemToHostCart: (item: { id: string; name?: string; title?: string; priceLabel?: string; canonicalStoreId?: string; canonicalProductId?: string; sourceRecordId?: string; publishStage?: string }, payload?: { quantity?: number; measurementOption?: string | null; deliveryMode?: string }) => void;
  handleOpenActiveStoreItems: () => void;
  handleOpenActiveStoreCart: (mode?: DshFulfillmentDeliveryMode) => void;
  fetchStoreDetail: (storeId: string, store: unknown, limit?: number) => () => void;
};

export type DshClientCheckoutContext = {
  cartItems: HostCartItem[];
  selectedFulfillmentMode: DshFulfillmentDeliveryMode;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  paymentErrorMessage: string | undefined;
  checkoutState: 'ready' | 'loading' | 'payment-failed';
  setCheckoutState: (state: 'ready' | 'loading' | 'payment-failed') => void;
  createOrderValues: CreateOrderValues;
  setCreateOrderValues: Dispatch<SetStateAction<CreateOrderValues>>;
  handleConfirmCheckout: () => void;
  handleConfirmedOrderExecution: (payload?: { fulfillmentMode?: DshFulfillmentDeliveryMode; orderDraft?: Partial<CreateOrderValues>; wltPaymentRefId?: string }) => void;
  checkoutClientMemo: import('../../shared/checkout').DshCheckoutClient | undefined;
  checkoutAuth: DshCheckoutAuthContext;
};

export type DshClientOrdersContext = {
  filteredOrders: HostOrderSummary[];
  ordersQuery: string;
  setOrdersQuery: (q: string) => void;
  handleReorderClick: (orderId: string) => void;
  trackingClientState: DshClientState;
  activeTrackedOrder: HostOrderSummary | undefined;
  trackingWltIntent: DshClientWltIntentEntry | undefined;
  liveOrderDetails: DshOrderDetailsResponse | null;
  trackingOrderValues: CreateOrderValues;
  trackingTimeline: DshTrackingTimelineItem[];
  reopenTracking: () => void;
  handleCancelOrder: () => void;
  handleSupportEscalation: (issueType: string, description: string) => Promise<void>;
  returnOrdersList: () => void;
};

export type DshClientMarketingContext = {
  liveMarketingPrograms: MarketingGrowthRecord[];
  recordMarketingBannerClick: ((id: string) => void) | undefined;
  recordMarketingBannerImpression: ((id: string) => void) | undefined;
  recordMarketingGrowthClick: ((id: string) => void) | undefined;
  recordMarketingGrowthImpression: ((id: string) => void) | undefined;
};

export type DshClientRouteRendererProps = {
  readonly session: DshClientSessionContext;
  readonly routeContext: DshClientRouteContext;
  readonly home: DshClientHomeContext;
  readonly store: DshClientStoreContext;
  readonly checkout: DshClientCheckoutContext;
  readonly orders: DshClientOrdersContext;
  readonly marketing: DshClientMarketingContext;
};
