/**
 * App-partner route map — §86 SSoT from SCREENS_CATALOG (SurfaceId=app-partner only).
 * Maps route keys to screen components for DSH and ARB partner screens.
 */

import React from 'react';
import { PartnerHomeScreen } from '../../partner/PartnerHomeScreen';
import { PartnerMapScreen } from '../../partner/PartnerMapScreen';
import { PartnerProfileScreen } from '../../partner/PartnerProfileScreen';
import { PartnerNotificationsScreen } from '../../partner/PartnerNotificationsScreen';
import { default as AutoPlatformCaptainSupport } from '../../platform/app-captain/mobile/auto_platform_captain_support';

// DSH Partner Screens
import { default as AutoDshPartnerStoreGet } from '../../dsh/app-partner/mobile/auto_dsh_partner_store_get';
import { default as AutoDshPartnerStoreUpdate } from '../../dsh/app-partner/mobile/auto_dsh_partner_store_update';
import { default as AutoDshPartnerStoreNomination } from '../../dsh/app-partner/mobile/auto_dsh_partner_store_nomination';
import { default as AutoDshPartnerListingStatusUpdate } from '../../dsh/app-partner/mobile/auto_dsh_partner_listing_status_update';
import { default as AutoDshPartnerAuctionStatusUpdate } from '../../dsh/app-partner/mobile/auto_dsh_partner_auction_status_update';
import { default as AutoDshPartnerStoreStatusUpdate } from '../../dsh/app-partner/mobile/auto_dsh_partner_store_status_update';
import { default as AutoDshPartnerDeliveryZonesUpdate } from '../../dsh/app-partner/mobile/auto_dsh_partner_delivery_zones_update';
import { default as AutoDshPartnerZoneSet } from '../../dsh/app-partner/mobile/auto_dsh_partner_zone_set';
import { default as AutoDshPartnerStoreServiceModesUpdate } from '../../dsh/app-partner/mobile/auto_dsh_partner_store_service_modes_update';
import { default as AutoDshPartnerHoursUpdate } from '../../dsh/app-partner/mobile/auto_dsh_partner_hours_update';
import { default as AutoDshPartnerItemsUpsert } from '../../dsh/app-partner/mobile/auto_dsh_partner_items_upsert';
import { default as AutoDshPartnerOrderAccept } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_accept';
import { default as AutoDshPartnerOrderGet } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_get';
import { default as AutoDshPartnerOrderHandoff } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_handoff';
import { default as AutoDshPartnerOrderOutForDelivery } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_out_for_delivery';
import { default as AutoDshPartnerOrderStoreDelivered } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_store_delivered';
import { default as AutoDshPartnerOrderPrepare } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_prepare';
import { default as AutoDshPartnerOrderReady } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_ready';
import { default as AutoDshPartnerOrderReject } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_reject';
import { default as AutoDshPartnerOrdersList } from '../../dsh/app-partner/mobile/auto_dsh_partner_orders_list';
import { default as AutoDshPartnerProfileGet } from '../../dsh/app-partner/mobile/auto_dsh_partner_profile_get';
import { default as AutoDshPartnerChatReadAck } from '../../dsh/app-partner/mobile/auto_dsh_partner_chat_read_ack';
import { default as AutoDshPartnerChatSend } from '../../dsh/app-partner/mobile/auto_dsh_partner_chat_send';
import { default as AutoDshPartnerSubscription } from '../../dsh/app-partner/mobile/auto_dsh_partner_subscription';
import { default as AutoDshPartnerDocUpload } from '../../dsh/app-partner/mobile/auto_dsh_partner_doc_upload';
import { default as AutoDshPartnerIdentitySubmit } from '../../dsh/app-partner/mobile/auto_dsh_partner_identity_submit';
import { default as AutoDshPartnerIntakeStart } from '../../dsh/app-partner/mobile/auto_dsh_partner_intake_start';
import { default as AutoDshPartnerInventoryAdjust } from '../../dsh/app-partner/mobile/auto_dsh_partner_inventory_adjust';
import { default as AutoDshPartnerInventoryUpdate } from '../../dsh/app-partner/mobile/auto_dsh_partner_inventory_update';
import { default as AutoDshPartnerManagerInvite } from '../../dsh/app-partner/mobile/auto_dsh_partner_manager_invite';
import { default as AutoDshPartnerStaffAnalyticsGet } from '../../dsh/app-partner/mobile/auto_dsh_partner_staff_analytics_get';
import { default as AutoDshPartnerQuickReplySetup } from '../../dsh/app-partner/mobile/auto_dsh_partner_quick_reply_setup';
import { default as AutoDshPartnerQuickReplySettings } from '../../dsh/app-partner/mobile/auto_dsh_partner_quick_reply_settings';
import { default as AutoDshPartnerOrderIssueQueue } from '../../dsh/app-partner/mobile/auto_dsh_partner_order_issue_queue';
import { default as AutoDshPartnerDeliveryOpsBoard } from '../../dsh/app-partner/mobile/auto_dsh_partner_delivery_ops_board';
import { default as AutoDshPartnerAudienceInsightsGet } from '../../dsh/app-partner/mobile/auto_dsh_partner_audience_insights_get';
import { default as AutoDshPartnerCommissionByModeGet } from '../../dsh/app-partner/mobile/auto_dsh_partner_commission_by_mode_get';

// ARB Partner Screens (bookings-based, not orders)
import { default as AutoArbPartnerBookingsList } from '../../arb/app-partner/mobile/auto_arb_partner_bookings_list';
import { default as AutoArbPartnerFinanceOverview } from '../../arb/app-partner/mobile/auto_arb_partner_finance_overview';
import { default as AutoArbBookingsBookingIdActivatePost } from '../../arb/app-partner/mobile/auto_arb_bookings_bookingId_activate_post';
import { default as AutoArbBookingsBookingIdApprovePost } from '../../arb/app-partner/mobile/auto_arb_bookings_bookingId_approve_post';
import { default as AutoArbBookingsBookingIdAssignPost } from '../../arb/app-partner/mobile/auto_arb_bookings_bookingId_assign_post';
import { default as AutoArbBookingsBookingIdVerifyPost } from '../../arb/app-partner/mobile/auto_arb_bookings_bookingId_verify_post';
import { default as AutoArbBookingsBookingIdRatePost } from '../../arb/app-partner/mobile/auto_arb_bookings_bookingId_rate_post';
// WLT Partner (دفع/سداد/محفظة — app-partner per WLT_OPERATION_CATALOG)
import { default as AutoWltPartnerFinanceOverview } from '../../wlt/app-user/mobile/auto_wlt_partner_finance_overview';
import { default as AutoWltPartnerLedgerGet } from '../../wlt/app-user/mobile/auto_wlt_partner_ledger_get';
import { default as AutoWltPartnerSettlementsList } from '../../wlt/app-user/mobile/auto_wlt_partner_settlements_list';
import { default as AutoWltPayoutApprove } from '../../wlt/app-user/mobile/auto_wlt_payout_approve';
import { default as AutoWltPayoutGet } from '../../wlt/app-user/mobile/auto_wlt_payout_get';
import { default as AutoWltPayoutRequest } from '../../wlt/app-user/mobile/auto_wlt_payout_request';
import { default as AutoWltPayoutsList } from '../../wlt/app-user/mobile/auto_wlt_payouts_list';
import { default as AutoWltRewardsHome } from '../../wlt/app-user/mobile/auto_wlt_rewards_home';
import { default as AutoWltSudadHome } from '../../wlt/app-user/mobile/auto_wlt_sudad_home';
import { default as AutoWltSettlementCreate } from '../../wlt/app-user/mobile/auto_wlt_settlement_create';
import { default as AutoWltExchangeprice } from '../../wlt/app-user/mobile/auto_wlt_exchangeprice';
import { default as AutoWltWithdrawRequest } from '../../wlt/app-user/mobile/auto_wlt_withdraw_request';

export const ROUTE_HOME = 'Home';
export const ROUTE_PARTNER_TYPE_SELECT = 'PartnerTypeSelect';

export type PartnerRouteKey =
  | typeof ROUTE_HOME
  | typeof ROUTE_PARTNER_TYPE_SELECT
  // Base screens
  | 'PartnerMap'
  | 'PartnerProfile'
  // DSH Partner routes
  | 'dsh_partner_store_get'
  | 'dsh_partner_store_update'
  | 'dsh_partner_store_status_update'
  | 'dsh_partner_listing_status_update'
  | 'dsh_partner_auction_status_update'
  | 'dsh_partner_store_service_modes_update'
  | 'dsh_partner_quick_reply_config_get'
  | 'dsh_partner_quick_reply_setup'
  | 'dsh_partner_store_create'
  | 'dsh_partner_delivery_zones_update'
  | 'dsh_zone_set'
  | 'dsh_partner_hours_update'
  | 'dsh_partner_items_upsert'
  | 'dsh_partner_inventory_update'
  | 'dsh_partner_inventory_adjust'
  | 'dsh_partner_doc_upload'
  | 'dsh_partner_identity_submit'
  | 'dsh_partner_intake_start'
  | 'dsh_partner_order_handoff'
  | 'dsh_partner_order_out_for_delivery'
  | 'dsh_partner_order_store_delivered'
  | 'dsh_partner_order_accept'
  | 'dsh_partner_order_get'
  | 'dsh_partner_order_prepare'
  | 'dsh_partner_order_ready'
  | 'dsh_partner_order_reject'
  | 'dsh_partner_orders_list'
  | 'dsh_partner_chat_send'
  | 'dsh_partner_chat_read_ack'
  | 'dsh_partner_manager_invite'
  | 'dsh_partner_staff_analytics_get'
  | 'dsh_partner_order_issue_queue'
  | 'dsh_partner_delivery_ops_board'
  | 'dsh_partner_audience_insights_get'
  | 'dsh_partner_commission_by_mode_get'
  | 'dsh_partner_subscription_get'
  | 'dsh_partner_subscription_analytics_get'
  | 'dsh_partner_profile_get'
  // ARB Partner routes (bookings-based, not orders)
  | 'arb_partner_bookings_list'
  | 'arb_partner_finance_overview'
  | 'arb_bookings_bookingId_activate_post'
  | 'arb_bookings_bookingId_approve_post'
  | 'arb_bookings_bookingId_assign_post'
  | 'arb_bookings_bookingId_verify_post'
  | 'arb_bookings_bookingId_rate_post'
  | 'arb_partner_store_get'
  | 'arb_partner_store_update'
  | 'arb_partner_store_status_update'
  | 'arb_partner_hours_update'
  | 'arb_partner_doc_upload'
  | 'arb_partner_identity_submit'
  | 'platform_partner_support'
  | 'platform_partner_settings'
  | 'platform_partner_profile_get'
  | 'platform_partner_notifications'
  // WLT Partner (تسوية، سحب، دفتر، مدفوعات)
  | 'wlt_partner_finance_overview'
  | 'wlt_partner_ledger_get'
  | 'wlt_partner_settlements_list'
  | 'wlt_payout_approve'
  | 'wlt_payout_get'
  | 'wlt_payout_request'
  | 'wlt_payouts_list'
  | 'wlt_settlement_create'
  | 'wlt_sudad_home'
  | 'wlt_rewards_home'
  | 'wlt_exchangeprice'
  | 'wlt_withdraw_request';

const PARTNER_SCREEN_MAP: Record<PartnerRouteKey, React.ComponentType<any>> = {
  [ROUTE_HOME]: PartnerHomeScreen,
  [ROUTE_PARTNER_TYPE_SELECT]: PartnerHomeScreen, // Will be handled by PartnerMobileSurface
  
  // Base screens
  PartnerMap: PartnerMapScreen,
  PartnerProfile: PartnerProfileScreen,
  platform_partner_notifications: PartnerNotificationsScreen,
  
  // DSH Partner screens (using existing components)
  dsh_partner_store_get: AutoDshPartnerStoreGet,
  dsh_partner_store_update: AutoDshPartnerStoreUpdate,
  dsh_partner_store_status_update: AutoDshPartnerStoreStatusUpdate,
  dsh_partner_listing_status_update: AutoDshPartnerListingStatusUpdate,
  dsh_partner_auction_status_update: AutoDshPartnerAuctionStatusUpdate,
  dsh_partner_store_service_modes_update: AutoDshPartnerStoreServiceModesUpdate,
  dsh_partner_quick_reply_config_get: AutoDshPartnerQuickReplySettings,
  dsh_partner_quick_reply_setup: AutoDshPartnerQuickReplySetup,
  dsh_partner_store_create: AutoDshPartnerStoreNomination,
  dsh_partner_delivery_zones_update: AutoDshPartnerDeliveryZonesUpdate,
  dsh_zone_set: AutoDshPartnerZoneSet,
  dsh_partner_hours_update: AutoDshPartnerHoursUpdate,
  dsh_partner_items_upsert: AutoDshPartnerItemsUpsert,
  dsh_partner_inventory_update: AutoDshPartnerInventoryUpdate,
  dsh_partner_inventory_adjust: AutoDshPartnerInventoryAdjust,
  dsh_partner_doc_upload: AutoDshPartnerDocUpload,
  dsh_partner_identity_submit: AutoDshPartnerIdentitySubmit,
  dsh_partner_intake_start: AutoDshPartnerIntakeStart,
  dsh_partner_order_handoff: AutoDshPartnerOrderHandoff,
  dsh_partner_order_out_for_delivery: AutoDshPartnerOrderOutForDelivery,
  dsh_partner_order_store_delivered: AutoDshPartnerOrderStoreDelivered,
  dsh_partner_order_accept: AutoDshPartnerOrderAccept,
  dsh_partner_order_get: AutoDshPartnerOrderGet,
  dsh_partner_order_prepare: AutoDshPartnerOrderPrepare,
  dsh_partner_order_ready: AutoDshPartnerOrderReady,
  dsh_partner_order_reject: AutoDshPartnerOrderReject,
  dsh_partner_orders_list: AutoDshPartnerOrdersList,
  dsh_partner_chat_send: AutoDshPartnerChatSend,
  dsh_partner_chat_read_ack: AutoDshPartnerChatReadAck,
  dsh_partner_manager_invite: AutoDshPartnerManagerInvite,
  dsh_partner_staff_analytics_get: AutoDshPartnerStaffAnalyticsGet,
  dsh_partner_order_issue_queue: AutoDshPartnerOrderIssueQueue,
  dsh_partner_delivery_ops_board: AutoDshPartnerDeliveryOpsBoard,
  dsh_partner_audience_insights_get: AutoDshPartnerAudienceInsightsGet,
  dsh_partner_commission_by_mode_get: AutoDshPartnerCommissionByModeGet,
  dsh_partner_subscription_get: AutoDshPartnerSubscription,
  dsh_partner_subscription_analytics_get: AutoDshPartnerSubscription,
  dsh_partner_profile_get: AutoDshPartnerProfileGet,
  
  // ARB Partner screens (bookings-based, not orders)
  arb_partner_bookings_list: AutoArbPartnerBookingsList,
  arb_partner_finance_overview: AutoArbPartnerFinanceOverview,
  arb_bookings_bookingId_activate_post: AutoArbBookingsBookingIdActivatePost,
  arb_bookings_bookingId_approve_post: AutoArbBookingsBookingIdApprovePost,
  arb_bookings_bookingId_assign_post: AutoArbBookingsBookingIdAssignPost,
  arb_bookings_bookingId_verify_post: AutoArbBookingsBookingIdVerifyPost,
  arb_bookings_bookingId_rate_post: AutoArbBookingsBookingIdRatePost,
  // ARB Partner store management (shared with DSH for now)
  arb_partner_store_get: AutoDshPartnerStoreGet,
  arb_partner_store_update: AutoDshPartnerStoreUpdate,
  arb_partner_store_status_update: AutoDshPartnerStoreStatusUpdate,
  arb_partner_hours_update: AutoDshPartnerHoursUpdate,
  arb_partner_doc_upload: AutoDshPartnerDocUpload,
  arb_partner_identity_submit: AutoDshPartnerIdentitySubmit,
  platform_partner_support: AutoPlatformCaptainSupport,
  platform_partner_settings: AutoDshPartnerQuickReplySettings,
  platform_partner_profile_get: AutoDshPartnerProfileGet,
  // WLT Partner
  wlt_partner_finance_overview: AutoWltPartnerFinanceOverview,
  wlt_partner_ledger_get: AutoWltPartnerLedgerGet,
  wlt_partner_settlements_list: AutoWltPartnerSettlementsList,
  wlt_payout_approve: AutoWltPayoutApprove,
  wlt_payout_get: AutoWltPayoutGet,
  wlt_payout_request: AutoWltPayoutRequest,
  wlt_payouts_list: AutoWltPayoutsList,
  wlt_settlement_create: AutoWltSettlementCreate,
  wlt_sudad_home: AutoWltSudadHome,
  wlt_rewards_home: AutoWltRewardsHome,
  wlt_exchangeprice: AutoWltExchangeprice,
  wlt_withdraw_request: AutoWltWithdrawRequest,
};

export function getPartnerScreenComponent(routeKey: string): React.ComponentType<any> | null {
  const key = routeKey as PartnerRouteKey;
  return PARTNER_SCREEN_MAP[key] ?? null;
}

export function getPartnerDefaultRoute(): PartnerRouteKey {
  return ROUTE_HOME;
}
