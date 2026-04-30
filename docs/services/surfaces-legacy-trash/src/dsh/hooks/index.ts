/**
 * DSH Hooks - Data layer for DSH service screens
 *
 * هذه الطبقة تفصل الشاشات عن مصدر البيانات:
 * - الآن: تستخدم fixtures (بيانات تجريبية)
 * - لاحقاً: تستخدم api-clients (API حقيقي)
 */

// ============================================
// App-Client Hooks
// ============================================
export { useDshHome } from './useDshHome';
export type { UseDshHomeResult } from './useDshHome';

export { useDshSearch } from './useDshSearch';
export type { UseDshSearchResult } from './useDshSearch';

export { useDshStoreGet } from './useDshStoreGet';
export type { UseDshStoreGetResult } from './useDshStoreGet';

export { useDshCategoryGet } from './useDshCategoryGet';
export type { UseDshCategoryGetResult } from './useDshCategoryGet';

export { useDshOrderGet } from './useDshOrderGet';
export type { UseDshOrderGetResult } from './useDshOrderGet';

export { useDshOrderCancel } from './useDshOrderCancel';
export type { UseDshOrderCancelResult } from './useDshOrderCancel';

export { useDshReviewsList } from './useDshReviewsList';
export type { UseDshReviewsListResult } from './useDshReviewsList';

export { useDshFavoritesList } from './useDshFavoritesList';
export type { UseDshFavoritesListResult } from './useDshFavoritesList';

export { useDshCheckoutGate } from './useDshCheckoutGate';
export type { UseDshCheckoutGateResult } from './useDshCheckoutGate';

export { useDshZoneSet } from './useDshZoneSet';
export type { UseDshZoneSetResult } from './useDshZoneSet';

export { useDshSubscriptionSync } from './useDshSubscriptionSync';
export type { UseDshSubscriptionSyncResult } from './useDshSubscriptionSync';

export { useDshChatSend } from './useDshChatSend';
export type { UseDshChatSendResult } from './useDshChatSend';

export { useDshGasRefill } from './useDshGasRefill';
export type { UseDshGasRefillResult } from './useDshGasRefill';

// ============================================
// App-Partner Hooks
// ============================================
export { useDshPartnerZoneSet } from './useDshPartnerZoneSet';
export type { UseDshPartnerZoneSetResult } from './useDshPartnerZoneSet';

// ============================================
// App-Captain Hooks
// ============================================
export { useCaptainOrderAccept, useCaptainOrderDeliver, useCaptainOrderPickup } from './useCaptainOrders';
export type { UseCaptainOrderAcceptResult, UseCaptainOrderDeliverResult, UseCaptainOrderPickupResult } from './useCaptainOrders';

export { useCaptainOrderDetails, mapApiResponseToOrderDetails } from './useCaptainOrderDetails';
export type { UseCaptainOrderDetailsResult } from './useCaptainOrderDetails';

export { useCaptainWallet } from './useCaptainWallet';
export type { UseCaptainWalletResult } from './useCaptainWallet';

export { useCaptainPayments } from './useCaptainPayments';
export type { UseCaptainPaymentsResult } from './useCaptainPayments';

export { useCaptainEarningsHistory } from './useCaptainEarningsHistory';
export type { UseCaptainEarningsHistoryResult } from './useCaptainEarningsHistory';

export { useCaptainSettlements } from './useCaptainSettlements';
export type { UseCaptainSettlementsResult } from './useCaptainSettlements';

export { useCaptainFinancialReports } from './useCaptainFinancialReports';
export type { UseCaptainFinancialReportsResult } from './useCaptainFinancialReports';

export { useCaptainTierInfo } from './useCaptainTierInfo';
export type { UseCaptainTierInfoResult } from './useCaptainTierInfo';

// ============================================
// Fixture Builders (re-exported for migration)
// ============================================
// DSH Home: runtime uses api-host `GET /api/infra/dsh/home`. Design-time builders: `../data/dshHomeSeed`.

// Search
export { buildDshSearchMock, type Restaurant } from '../fixtures/search';

// Store Get
export {
  buildDshStoreGetMock,
  type StoreDetail,
  type MenuItem,
  type StoreCategory,
  type StoreDeliveryMode,
  type MenuItemOption,
  type MenuItemOptionGroup,
} from '../fixtures/storeGet';

// Category Get
export { buildDshCategoryGetMock, type CategoryItem, type CategoryHeader } from '../fixtures/categoryGet';

// Order Get
export { buildDshOrderGetMock, type OrderDetail, type OrderItem } from '../fixtures/orderGet';

// Order Cancel
export { buildDshOrderCancelMock, type DshOrderCancelInfo } from '../fixtures/orderCancel';

// Reviews List
export { buildDshReviewsListMock, type Review } from '../fixtures/reviewsList';

// Favorites List
export { buildDshFavoritesListMock, type FavoriteRestaurant } from '../fixtures/favoritesList';

// Checkout Gate
export { buildDshCheckoutGateOrderSummaryMock, type CheckoutOrderSummary, type CheckoutOrderItem } from '../fixtures/checkoutGate';

// Zone Set (app-client)
export { buildDshZoneSetMock, type Zone } from '../fixtures/zoneSet';

// Subscription Sync
export { buildDshSubscriptionSyncMock, type Subscription } from '../fixtures/subscriptionSync';

// Chat Send
export { buildDshChatSendMock, type ChatMessage, type OrderInfo } from '../fixtures/chatSend';

// Gas Refill
export {
  buildGasRefillStationsMock,
  buildGasRefillEstimateMock,
  buildGasRefillOrderMock,
  type GasRefillStation,
  type GasRefillEstimate,
  type GasRefillOrderMock,
  type GasRefillSubcategory,
} from '../fixtures/gasRefill';

// Partner Zone Set
export { buildDshPartnerZoneSetMock, type Zone as PartnerZone } from '../fixtures/partnerZoneSet';

// Captain Orders
export {
  buildOrderAcceptMock,
  buildOrderDeliverMock,
  buildOrderPickupFallback,
  type OrderAccept,
  type OrderDeliver,
  type OrderPickup,
} from '../fixtures/captainOrders';

// Captain Order Details
export {
  buildDshCaptainOrderDetailsFallback,
  mapApiResponseToOrderDetails as mapCaptainOrderApiResponse,
  type OrderDetails,
} from '../fixtures/captainOrderDetails';

// Captain Wallet
export { buildCaptainWalletMock, type WalletData, type Transaction } from '../fixtures/captainWallet';

// Captain Payments
export { buildCaptainPaymentsMock, type PaymentRecord, type PaymentStats } from '../fixtures/captainPayments';

// Captain Earnings History
export { buildCaptainEarningsHistoryMock, type EarningsRecord, type SummaryStats } from '../fixtures/captainEarningsHistory';

// Captain Settlements
export {
  buildWithdrawalRequestsMock,
  buildBankAccountsMock,
  type WithdrawalRequest,
  type BankAccount,
} from '../fixtures/captainSettlements';

// Captain Financial Reports
export { buildFinancialReportMock, type FinancialReport } from '../fixtures/captainFinancialReports';

// Captain Tier Info
export { buildTierInfoFromApi, type TierInfo, type TierInfoApi } from '../fixtures/captainTierInfo';

