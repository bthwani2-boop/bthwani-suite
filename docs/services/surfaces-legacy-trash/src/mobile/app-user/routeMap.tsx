/**
 * App-user route map — §86 SSoT from SCREENS_CATALOG (SurfaceId=app-user only).
 * Maps HomeScreen route keys to screen components. Zero duplication.
 * NO imports from ../platform/ (folder does not exist). Case/Platform/User screens use UserFeaturePlaceholderScreen only.
 * WLT plans: use auto_wlt_subscriptions_plans_list (with 's' in subscriptions).
 * Cache invalidation: 2026-02-10T19:45:00Z
 */

import React from 'react';
import { HomeScreen } from './HomeScreen';
import { UserProfileScreen } from './UserProfileScreen';
import { SupportTicketsListScreen } from './SupportTicketsListScreen';
import { UserAddressesListScreen } from './UserAddressesListScreen';
import { UserNotificationsListScreen } from './UserNotificationsListScreen';
import { UserPreferencesGetScreen } from './UserPreferencesGetScreen';
import { UserProfileUpdateScreen } from './UserProfileUpdateScreen';
import { UserFeaturePlaceholderScreen } from './UserFeaturePlaceholderScreen';

const auto_amn_booking_create = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_booking_create').then(m => ({
    default: m.auto_amn_booking_create,
  }))
);
const auto_amn_captains_nearby = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_captains_nearby').then(m => ({
    default: m.auto_amn_captains_nearby,
  }))
);
const auto_amn_home_get = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_home_get').then(m => ({
    default: m.auto_amn_home_get,
  }))
);
const auto_amn_quote_create = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_quote_create').then(m => ({
    default: m.auto_amn_quote_create,
  }))
);
const auto_amn_quote_get = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_quote_get').then(m => ({
    default: m.auto_amn_quote_get,
  }))
);
const auto_amn_sos_trigger = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_sos_trigger').then(m => ({
    default: m.auto_amn_sos_trigger,
  }))
);
const auto_amn_trip_cancel = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_cancel').then(m => ({
    default: m.auto_amn_trip_cancel,
  }))
);
const auto_amn_trip_create = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_create').then(m => ({
    default: m.auto_amn_trip_create,
  }))
);
const auto_amn_trip_estimate = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_estimate').then(m => ({
    default: m.auto_amn_trip_estimate,
  }))
);
const auto_amn_trip_estimate_get = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_estimate_get').then(m => ({
    default: m.auto_amn_trip_estimate_get,
  }))
);
const auto_amn_trip_get = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_get').then(m => ({
    default: m.auto_amn_trip_get,
  }))
);
const auto_amn_trip_rate = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_rate').then(m => ({
    default: m.auto_amn_trip_rate,
  }))
);
const auto_amn_trip_receipt_get = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_receipt_get').then(m => ({
    default: m.auto_amn_trip_receipt_get,
  }))
);
const auto_amn_trip_report = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_report').then(m => ({
    default: m.auto_amn_trip_report,
  }))
);
const auto_amn_trip_status_update = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_status_update').then(m => ({
    default: m.auto_amn_trip_status_update,
  }))
);
const auto_amn_trip_track_get = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trip_track_get').then(m => ({
    default: m.auto_amn_trip_track_get,
  }))
);
const auto_amn_trips_list = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_trips_list').then(m => ({
    default: m.auto_amn_trips_list,
  }))
);
const auto_amn_vehicle_availability_get = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_vehicle_availability_get').then(
    m => ({ default: m.auto_amn_vehicle_availability_get })
  )
);
const auto_amn_vehicle_types_list = React.lazy(() =>
  import('../../amn/app-user/mobile/auto_amn_vehicle_types_list').then(m => ({
    default: m.auto_amn_vehicle_types_list,
  }))
);
const auto_arb_amendment_accept = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_amendment_accept').then(m => ({
    default: m.auto_arb_amendment_accept,
  }))
);
const auto_arb_amendment_create = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_amendment_create').then(m => ({
    default: m.auto_arb_amendment_create,
  }))
);
const auto_arb_home_get = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_home_get').then(m => ({
    default: m.auto_arb_home_get,
  }))
);
const auto_arb_amendment_reject = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_amendment_reject').then(m => ({
    default: m.auto_arb_amendment_reject,
  }))
);
const auto_arb_amendments_list = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_amendments_list').then(m => ({
    default: m.auto_arb_amendments_list,
  }))
);
const auto_arb_booking_cancel = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_booking_cancel').then(m => ({
    default: m.auto_arb_booking_cancel,
  }))
);
const auto_arb_booking_confirm = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_booking_confirm').then(m => ({
    default: m.auto_arb_booking_confirm,
  }))
);
const auto_arb_booking_create = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_booking_create').then(m => ({
    default: m.auto_arb_booking_create,
  }))
);
const auto_arb_booking_escrow_status_get = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_booking_escrow_status_get').then(
    m => ({ default: m.auto_arb_booking_escrow_status_get })
  )
);
const auto_arb_booking_get = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_booking_get').then(m => ({
    default: m.auto_arb_booking_get,
  }))
);
const auto_arb_booking_reject = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_booking_reject').then(m => ({
    default: m.auto_arb_booking_reject,
  }))
);
const auto_arb_booking_status_update = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_booking_status_update').then(
    m => ({ default: m.auto_arb_booking_status_update })
  )
);
const auto_arb_bookings_list = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_bookings_list').then(m => ({
    default: m.auto_arb_bookings_list,
  }))
);
const auto_arb_escrow_fund_intent_create = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_escrow_fund_intent_create').then(
    m => ({ default: m.auto_arb_escrow_fund_intent_create })
  )
);
const auto_arb_escrow_release_request = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_escrow_release_request').then(
    m => ({ default: m.auto_arb_escrow_release_request })
  )
);
const auto_arb_offer_get = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_offer_get').then(m => ({
    default: m.auto_arb_offer_get,
  }))
);
const auto_arb_offers_search = React.lazy(() =>
  import('../../arb/app-user/mobile/auto_arb_offers_search').then(m => ({
    default: m.auto_arb_offers_search,
  }))
);
const auto_dsh_cart_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_cart_get').then(m => ({
    default: m.auto_dsh_cart_get,
  }))
);
const auto_dsh_cart_init = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_cart_init').then(m => ({
    default: m.auto_dsh_cart_init,
  }))
);
const auto_dsh_cart_item_add = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_cart_item_add').then(m => ({
    default: m.auto_dsh_cart_item_add,
  }))
);
const auto_dsh_cart_item_remove = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_cart_item_remove').then(m => ({
    default: m.auto_dsh_cart_item_remove,
  }))
);
const auto_dsh_cart_item_update = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_cart_item_update').then(m => ({
    default: m.auto_dsh_cart_item_update,
  }))
);
const auto_dsh_categories_list = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_categories_list').then(m => ({
    default: m.auto_dsh_categories_list,
  }))
);
const auto_dsh_category_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_category_get').then(m => ({
    default: m.auto_dsh_category_get,
  }))
);
const auto_dsh_checkout_gate = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_checkout_gate').then(m => ({
    default: m.auto_dsh_checkout_gate,
  }))
);
const auto_dsh_delivery_attempt_create = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_delivery_attempt_create').then(
    m => ({ default: m.auto_dsh_delivery_attempt_create })
  )
);
const auto_dsh_delivery_attempts_list = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_delivery_attempts_list').then(
    m => ({ default: m.auto_dsh_delivery_attempts_list })
  )
);
const auto_dsh_delivery_close = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_delivery_close').then(m => ({
    default: m.auto_dsh_delivery_close,
  }))
);
const auto_dsh_delivery_eta_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_delivery_eta_get').then(m => ({
    default: m.auto_dsh_delivery_eta_get,
  }))
);
const auto_dsh_delivery_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_delivery_get').then(m => ({
    default: m.auto_dsh_delivery_get,
  }))
);
const auto_dsh_delivery_track_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_delivery_track_get').then(m => ({
    default: m.auto_dsh_delivery_track_get,
  }))
);
const auto_dsh_entitlements_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_entitlements_get').then(m => ({
    default: m.auto_dsh_entitlements_get,
  }))
);
const auto_dsh_favorite_toggle = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_favorite_toggle').then(m => ({
    default: m.auto_dsh_favorite_toggle,
  }))
);
const auto_dsh_favorites_list = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_favorites_list').then(m => ({
    default: m.auto_dsh_favorites_list,
  }))
);
const auto_dsh_home_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_home_get').then(m => ({
    default: m.auto_dsh_home_get,
  }))
);
const auto_dsh_order_cancel = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_cancel').then(m => ({
    default: m.auto_dsh_order_cancel,
  }))
);
const auto_dsh_order_accept = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_accept').then(m => ({
    default: m.auto_dsh_order_accept,
  }))
);
const auto_dsh_order_complete = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_complete').then(m => ({
    default: m.auto_dsh_order_complete,
  }))
);
const auto_dsh_order_create = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_create').then(m => ({
    default: m.auto_dsh_order_create,
  }))
);
const auto_dsh_order_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_get').then(m => ({
    default: m.auto_dsh_order_get,
  }))
);
const auto_dsh_order_issue_flag = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_issue_flag').then(m => ({
    default: m.auto_dsh_order_issue_flag,
  }))
);
const auto_dsh_order_proof_code_generate = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_proof_code_generate').then(
    m => ({ default: m.auto_dsh_order_proof_code_generate })
  )
);
const auto_dsh_order_proof_verify = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_proof_verify').then(m => ({
    default: m.auto_dsh_order_proof_verify,
  }))
);
const auto_dsh_order_rate = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_rate').then(m => ({
    default: m.auto_dsh_order_rate,
  }))
);
const auto_dsh_order_receipt_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_receipt_get').then(m => ({
    default: m.auto_dsh_order_receipt_get,
  }))
);
const auto_dsh_order_status_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_status_get').then(m => ({
    default: m.auto_dsh_order_status_get,
  }))
);
const auto_dsh_orders_list = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_orders_list').then(m => ({
    default: m.auto_dsh_orders_list,
  }))
);
const auto_dsh_pricing_preview = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_pricing_preview').then(m => ({
    default: m.auto_dsh_pricing_preview,
  }))
);
const auto_dsh_pricing_snapshot_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_pricing_snapshot_get').then(m => ({
    default: m.auto_dsh_pricing_snapshot_get,
  }))
);
const auto_dsh_review_create = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_review_create').then(m => ({
    default: m.auto_dsh_review_create,
  }))
);
const auto_dsh_reviews_list = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_reviews_list').then(m => ({
    default: m.auto_dsh_reviews_list,
  }))
);
const auto_dsh_search = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_search').then(m => ({
    default: m.auto_dsh_search,
  }))
);
const auto_dsh_service_modes_resolve = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_service_modes_resolve').then(
    m => ({ default: m.auto_dsh_service_modes_resolve })
  )
);
const auto_dsh_store_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_store_get').then(m => ({
    default: m.auto_dsh_store_get,
  }))
);
const auto_dsh_store_items_list = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_store_items_list').then(m => ({
    default: m.auto_dsh_store_items_list,
  }))
);
const auto_dsh_stores_list = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_stores_list').then(m => ({
    default: m.auto_dsh_stores_list,
  }))
);
const auto_dsh_subscription_sync = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_subscription_sync').then(m => ({
    default: m.auto_dsh_subscription_sync,
  }))
);
const auto_dsh_zone_set = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_zone_set').then(m => ({
    default: m.auto_dsh_zone_set,
  }))
);
// §86 Catalog parity — DSH app-user mobile (Master_SCREENS_CATALOG primary_operations)
const auto_dsh_booking_create = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_booking_create').then(m => ({
    default: m.auto_dsh_booking_create,
  }))
);
const auto_dsh_chat_read_ack = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_chat_read_ack').then(m => ({
    default: m.auto_dsh_chat_read_ack,
  }))
);
const auto_dsh_chat_send = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_chat_send').then(m => ({
    default: m.auto_dsh_chat_send,
  }))
);
const auto_dsh_estimate_create = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_estimate_create').then(m => ({
    default: m.auto_dsh_estimate_create,
  }))
);
const auto_dsh_estimate_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_estimate_get').then(m => ({
    default: m.auto_dsh_estimate_get,
  }))
);
const auto_dsh_external_order_create = React.lazy(
  () => import('../../dsh/app-user/mobile/auto_dsh_external_order_create')
);
const auto_dsh_awnak_order_create = React.lazy(
  () => import('../../dsh/app-user/mobile/auto_dsh_awnak_order_create')
);
const GasRefillOrderCreateScreen = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_gas_refill_order_create').then(
    m => ({ default: m.GasRefillOrderCreateScreen })
  )
);
const auto_dsh_loyalty_points_redeem = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_loyalty_points_redeem').then(
    m => ({ default: m.auto_dsh_loyalty_points_redeem })
  )
);
const auto_dsh_loyalty_points_user_balance = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_loyalty_points_user_balance').then(
    m => ({ default: m.auto_dsh_loyalty_points_user_balance })
  )
);
const auto_dsh_loyalty_points_user_history = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_loyalty_points_user_history').then(
    m => ({ default: m.auto_dsh_loyalty_points_user_history })
  )
);
const auto_dsh_order_escrow_hold = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_escrow_hold').then(m => ({
    default: m.auto_dsh_order_escrow_hold,
  }))
);
const auto_dsh_order_escrow_release = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_escrow_release').then(m => ({
    default: m.auto_dsh_order_escrow_release,
  }))
);
const auto_dsh_order_status_update = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_order_status_update').then(m => ({
    default: m.auto_dsh_order_status_update,
  }))
);
const auto_dsh_subscription_family_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_subscription_family_get').then(
    m => ({ default: m.auto_dsh_subscription_family_get })
  )
);
const auto_dsh_subscription_family_members_get = React.lazy(() =>
  import(
    '../../dsh/app-user/mobile/auto_dsh_subscription_family_members_get'
  ).then(m => ({ default: m.auto_dsh_subscription_family_members_get }))
);
const auto_dsh_subscription_family_members_post = React.lazy(() =>
  import(
    '../../dsh/app-user/mobile/auto_dsh_subscription_family_members_post'
  ).then(m => ({ default: m.auto_dsh_subscription_family_members_post }))
);
const auto_dsh_subscription_tier_get = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_subscription_tier_get').then(
    m => ({ default: m.auto_dsh_subscription_tier_get })
  )
);
const auto_dsh_subscription_upgrade_post = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_subscription_upgrade_post').then(
    m => ({ default: m.auto_dsh_subscription_upgrade_post })
  )
);
const auto_dsh_subscription_pro_catalog = React.lazy(() =>
  import('../../dsh/app-user/mobile/auto_dsh_subscription_pro_catalog').then(
    m => ({ default: m.auto_dsh_subscription_pro_catalog })
  )
);
// SHEIN: proxy service screens
const auto_dsh_shein_info = React.lazy(
  () => import('../../dsh/app-user/mobile/auto_dsh_shein_info')
);
const auto_dsh_proxy_request_review = React.lazy(
  () => import('../../dsh/app-user/mobile/auto_dsh_proxy_request_review')
);
const auto_dsh_proxy_request_approve = React.lazy(
  () => import('../../dsh/app-user/mobile/auto_dsh_proxy_request_approve')
);
const auto_dsh_proxy_request_tracking = React.lazy(
  () => import('../../dsh/app-user/mobile/auto_dsh_proxy_request_tracking')
);
import {
  auto_esf_home_get,
  auto_esf_match_get,
  auto_esf_matches_inbox,
  auto_esf_request_get,
} from '../../esf/app-user/mobile';

const auto_knz_cart_get = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_cart_get').then(m => ({
    default: m.auto_knz_cart_get,
  }))
);
const auto_knz_cart_item_add = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_cart_item_add').then(m => ({
    default: m.auto_knz_cart_item_add,
  }))
);
const auto_knz_categories_list = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_categories_list').then(m => ({
    default: m.auto_knz_categories_list,
  }))
);
const auto_knz_chat_message_send = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_chat_message_send').then(m => ({
    default: m.auto_knz_chat_message_send,
  }))
);
const auto_knz_chat_thread_list = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_chat_thread_list').then(m => ({
    default: m.auto_knz_chat_thread_list,
  }))
);
const auto_knz_favorite_toggle = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_favorite_toggle').then(m => ({
    default: m.auto_knz_favorite_toggle,
  }))
);
const auto_knz_favorites_list = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_favorites_list').then(m => ({
    default: m.auto_knz_favorites_list,
  }))
);
const auto_knz_home_get = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_home_get').then(m => ({
    default: m.auto_knz_home_get,
  }))
);
const auto_knz_listing_create = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_listing_create').then(m => ({
    default: m.auto_knz_listing_create,
  }))
);
const auto_knz_listing_delete = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_listing_delete').then(m => ({
    default: m.auto_knz_listing_delete,
  }))
);
const auto_knz_listing_get = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_listing_get').then(m => ({
    default: m.auto_knz_listing_get,
  }))
);
const auto_knz_listing_report = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_listing_report').then(m => ({
    default: m.auto_knz_listing_report,
  }))
);
const auto_knz_listing_update = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_listing_update').then(m => ({
    default: m.auto_knz_listing_update,
  }))
);
const auto_knz_listings_list = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_listings_list').then(m => ({
    default: m.auto_knz_listings_list,
  }))
);
const auto_knz_listings_search = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_listings_search').then(m => ({
    default: m.auto_knz_listings_search,
  }))
);
const auto_knz_my_listings = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_my_listings').then(m => ({
    default: m.auto_knz_my_listings,
  }))
);
const auto_knz_auctions_list = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_auctions_list').then(m => ({
    default: m.auto_knz_auctions_list,
  }))
);
const auto_knz_auction_get = React.lazy(() =>
  import('../../knz/app-user/mobile/auto_knz_auction_get').then(m => ({
    default: m.auto_knz_auction_get,
  }))
);
const KnzAccountScreen = React.lazy(() =>
  import('../../knz/app-user/mobile/KnzAccountScreen').then(m => ({
    default: m.KnzAccountScreen,
  }))
);
const KnzPageScreen = React.lazy(() =>
  import('../../knz/app-user/mobile/KnzPageScreen').then(m => ({
    default: m.KnzPageScreen,
  }))
);
const auto_kwd_application_get = React.lazy(() =>
  import('../../kwd/app-user/mobile/auto_kwd_application_get').then(m => ({
    default: m.auto_kwd_application_get,
  }))
);
// KwdHome loaded lazily to avoid module-level t() eval before I18n is ready
const auto_kwd_home_get = React.lazy(() =>
  import('../../kwd/app-user/mobile/auto_kwd_home_get').then(m => ({
    default: m.auto_kwd_home_get,
  }))
);
const auto_kwd_job_apply = React.lazy(() =>
  import('../../kwd/app-user/mobile/auto_kwd_job_apply').then(m => ({
    default: m.auto_kwd_job_apply,
  }))
);
const auto_kwd_job_get = React.lazy(() =>
  import('../../kwd/app-user/mobile/auto_kwd_job_get').then(m => ({
    default: m.auto_kwd_job_get,
  }))
);
const auto_kwd_jobs_list = React.lazy(() =>
  import('../../kwd/app-user/mobile/auto_kwd_jobs_list').then(m => ({
    default: m.auto_kwd_jobs_list,
  }))
);
const auto_kwd_listing_report = React.lazy(() =>
  import('../../kwd/app-user/mobile/auto_kwd_listing_report').then(m => ({
    default: m.auto_kwd_listing_report,
  }))
);
const auto_kwd_my_applications_list = React.lazy(() =>
  import('../../kwd/app-user/mobile/auto_kwd_my_applications_list').then(m => ({
    default: m.auto_kwd_my_applications_list,
  }))
);
const KwdMyFileScreen = React.lazy(() =>
  import('../../kwd/app-user/mobile/KwdMyFileScreen').then(m => ({
    default: m.KwdMyFileScreen,
  }))
);
const KwdMyListingsScreen = React.lazy(() =>
  import('../../kwd/app-user/mobile/KwdMyListingsScreen').then(m => ({
    default: m.KwdMyListingsScreen,
  }))
);
const auto_mrf_claim_create = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_claim_create').then(m => ({
    default: m.auto_mrf_claim_create,
  }))
);
const auto_mrf_claim_get = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_claim_get').then(m => ({
    default: m.auto_mrf_claim_get,
  }))
);
const auto_mrf_home_get = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_home_get').then(m => ({
    default: m.auto_mrf_home_get,
  }))
);
const auto_mrf_match_get = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_match_get').then(m => ({
    default: m.auto_mrf_match_get,
  }))
);
const auto_mrf_match_respond = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_match_respond').then(m => ({
    default: m.auto_mrf_match_respond,
  }))
);
const auto_mrf_report_create = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_report_create').then(m => ({
    default: m.auto_mrf_report_create,
  }))
);
const auto_mrf_report_get = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_report_get').then(m => ({
    default: m.auto_mrf_report_get,
  }))
);
const auto_mrf_report_update = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_report_update').then(m => ({
    default: m.auto_mrf_report_update,
  }))
);
const auto_mrf_reports_list = React.lazy(() =>
  import('../../mrf/app-user/mobile/auto_mrf_reports_list').then(m => ({
    default: m.auto_mrf_reports_list,
  }))
);
const auto_snd_home_get = React.lazy(() =>
  import('../../snd/app-user/mobile/auto_snd_home_get').then(m => ({
    default: m.auto_snd_home_get,
  }))
);
const auto_snd_request_get = React.lazy(() =>
  import('../../snd/app-user/mobile/auto_snd_request_get').then(m => ({
    default: m.auto_snd_request_get,
  }))
);
const auto_snd_requests_list = React.lazy(() =>
  import('../../snd/app-user/mobile/auto_snd_requests_list').then(m => ({
    default: m.auto_snd_requests_list,
  }))
);
const auto_wlt_account_snapshot = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_account_snapshot').then(m => ({
    default: m.auto_wlt_account_snapshot,
  }))
);
const auto_wlt_addresses_addressId_deactivate_post = React.lazy(() =>
  import(
    '../../wlt/app-user/mobile/auto_wlt_addresses_addressId_deactivate_post'
  ).then(m => ({ default: m.auto_wlt_addresses_addressId_deactivate_post }))
);
const auto_wlt_assets_assetId_activate_post = React.lazy(() =>
  import(
    '../../wlt/app-user/mobile/auto_wlt_assets_assetId_activate_post'
  ).then(m => ({ default: m.auto_wlt_assets_assetId_activate_post }))
);
const auto_wlt_assets_assetId_approve_post = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_assets_assetId_approve_post').then(
    m => ({ default: m.auto_wlt_assets_assetId_approve_post })
  )
);
const auto_wlt_assets_assetId_cancel_post = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_assets_assetId_cancel_post').then(
    m => ({ default: m.auto_wlt_assets_assetId_cancel_post })
  )
);
const auto_wlt_assets_assetId_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_assets_assetId_get').then(m => ({
    default: m.auto_wlt_assets_assetId_get,
  }))
);
const auto_wlt_assets_assetId_reject_post = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_assets_assetId_reject_post').then(
    m => ({ default: m.auto_wlt_assets_assetId_reject_post })
  )
);
const auto_wlt_assets_assetId_report_post = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_assets_assetId_report_post').then(
    m => ({ default: m.auto_wlt_assets_assetId_report_post })
  )
);
const auto_wlt_balance_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_balance_get').then(m => ({
    default: m.auto_wlt_balance_get,
  }))
);
const auto_wlt_home_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_home_get').then(m => ({
    default: m.auto_wlt_home_get,
  }))
);
const auto_wlt_hold_create = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_hold_create').then(m => ({
    default: m.auto_wlt_hold_create,
  }))
);
const auto_wlt_hold_release = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_hold_release').then(m => ({
    default: m.auto_wlt_hold_release,
  }))
);
const auto_wlt_intent_cancel = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_intent_cancel').then(m => ({
    default: m.auto_wlt_intent_cancel,
  }))
);
const auto_wlt_intent_confirm = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_intent_confirm').then(m => ({
    default: m.auto_wlt_intent_confirm,
  }))
);
const auto_wlt_intent_create = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_intent_create').then(m => ({
    default: m.auto_wlt_intent_create,
  }))
);
const auto_wlt_intent_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_intent_get').then(m => ({
    default: m.auto_wlt_intent_get,
  }))
);
const auto_wlt_kyc_submit = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_kyc_submit').then(m => ({
    default: m.auto_wlt_kyc_submit,
  }))
);
const auto_wlt_partner_finance_overview = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_partner_finance_overview').then(
    m => ({ default: m.auto_wlt_partner_finance_overview })
  )
);
const auto_wlt_partner_ledger_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_partner_ledger_get').then(m => ({
    default: m.auto_wlt_partner_ledger_get,
  }))
);
const auto_wlt_partner_settlements_list = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_partner_settlements_list').then(
    m => ({ default: m.auto_wlt_partner_settlements_list })
  )
);
// UNIFIED SCREENS
import { AutoPlatformHomeGet } from '../../platform/app-user/mobile/auto_platform_home_get';
const auto_wlt_payout_approve = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_payout_approve').then(m => ({
    default: m.auto_wlt_payout_approve,
  }))
);
const auto_wlt_payout_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_payout_get').then(m => ({
    default: m.auto_wlt_payout_get,
  }))
);
const auto_wlt_payout_request = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_payout_request').then(m => ({
    default: m.auto_wlt_payout_request,
  }))
);
const auto_wlt_payouts_list = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_payouts_list').then(m => ({
    default: m.auto_wlt_payouts_list,
  }))
);
const auto_wlt_provider_charge = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_provider_charge').then(m => ({
    default: m.auto_wlt_provider_charge,
  }))
);
const auto_wlt_provider_webhook = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_provider_webhook').then(m => ({
    default: m.auto_wlt_provider_webhook,
  }))
);
const auto_wlt_refund_create = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_refund_create').then(m => ({
    default: m.auto_wlt_refund_create,
  }))
);
const auto_wlt_refund_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_refund_get').then(m => ({
    default: m.auto_wlt_refund_get,
  }))
);
const auto_wlt_settlement_approve = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_settlement_approve').then(m => ({
    default: m.auto_wlt_settlement_approve,
  }))
);
const auto_wlt_settlement_create = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_settlement_create').then(m => ({
    default: m.auto_wlt_settlement_create,
  }))
);
const auto_wlt_settlement_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_settlement_get').then(m => ({
    default: m.auto_wlt_settlement_get,
  }))
);
const auto_wlt_settlements_list = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_settlements_list').then(m => ({
    default: m.auto_wlt_settlements_list,
  }))
);
const auto_wlt_statements_export = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_statements_export').then(m => ({
    default: m.auto_wlt_statements_export,
  }))
);
const auto_wlt_subscription_cancel = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_subscription_cancel').then(m => ({
    default: m.auto_wlt_subscription_cancel,
  }))
);
const auto_wlt_subscription_checkout = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_subscription_checkout').then(
    m => ({ default: m.auto_wlt_subscription_checkout })
  )
);
const auto_wlt_subscription_invoice_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_subscription_invoice_get').then(
    m => ({ default: m.auto_wlt_subscription_invoice_get })
  )
);
const auto_wlt_subscription_invoices_list = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_subscription_invoices_list').then(
    m => ({ default: m.auto_wlt_subscription_invoices_list })
  )
);
const auto_wlt_subscription_status_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_subscription_status_get').then(
    m => ({ default: m.auto_wlt_subscription_status_get })
  )
);
const auto_wlt_subscriptions_plans_list = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_subscriptions_plans_list').then(
    m => ({ default: m.auto_wlt_subscriptions_plans_list })
  )
);
const auto_wlt_topup = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_topup').then(m => ({
    default: m.auto_wlt_topup,
  }))
);
const auto_wlt_transactions_list = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_transactions_list').then(m => ({
    default: m.auto_wlt_transactions_list,
  }))
);
const auto_wlt_transfer_create = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_transfer_create').then(m => ({
    default: m.auto_wlt_transfer_create,
  }))
);
const auto_wlt_transfer_get = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_transfer_get').then(m => ({
    default: m.auto_wlt_transfer_get,
  }))
);
const auto_wlt_transfers_list = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_transfers_list').then(m => ({
    default: m.auto_wlt_transfers_list,
  }))
);
const auto_wlt_receive_change_from_captain = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_receive_change_from_captain').then(
    m => ({ default: m.auto_wlt_receive_change_from_captain })
  )
);
const AutoWltRewardsHome = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_rewards_home').then(m => ({
    default: m.AutoWltRewardsHome,
  }))
);
// WltSudadHome loaded lazily to avoid any module eval before I18n is ready
const AutoWltSudadHome = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_sudad_home').then(m => ({
    default: m.AutoWltSudadHome,
  }))
);
const auto_wlt_exchangeprice = React.lazy(() =>
  import('../../wlt/app-user/mobile/auto_wlt_exchangeprice').then(m => ({
    default: m.auto_wlt_exchangeprice,
  }))
);
export const ROUTE_HOME = 'Home';

export type AppUserRouteKey =
  | typeof ROUTE_HOME
  // USER operations (19)
  | 'UserAddressCreate'
  | 'UserAddressDefaultSet'
  | 'UserAddressDelete'
  | 'UserAddressUpdate'
  | 'UserAddressesList'
  | 'UserContextGet'
  | 'UserMeGet'
  | 'UserNotificationRead'
  | 'UserNotificationsList'
  | 'UserOtpSend'
  | 'UserOtpVerify'
  | 'UserPreferencesGet'
  | 'UserPreferencesUpdate'
  | 'UserProfile'
  | 'UserProfileUpdate'
  | 'UserPushTokenUpsert'
  | 'UserSessionCreate'
  | 'UserSessionEnd'
  | 'UserSessionRefresh'
  // AMN operations
  | 'AmnHome'
  | 'AmnTripsList'
  | 'AmnTripCreate'
  | 'AmnTripTrack'
  | 'AmnCaptainsNearby'
  | 'AmnQuoteCreate'
  | 'AmnQuoteGet'
  | 'AmnSosTrigger'
  | 'AmnTripCancel'
  | 'AmnTripEstimate'
  | 'AmnTripEstimateGet'
  | 'AmnTripGet'
  | 'AmnTripRate'
  | 'AmnTripReceiptGet'
  | 'AmnTripReport'
  | 'AmnBookingCreate'
  | 'AmnTripStatusUpdate'
  | 'AmnVehicleAvailabilityGet'
  | 'AmnVehicleTypesList'
  // ARB operations
  | 'ArbHome'
  | 'ArbAmendmentAccept'
  | 'ArbAmendmentCreate'
  | 'ArbAmendmentReject'
  | 'ArbAmendmentsList'
  | 'ArbBookingCancel'
  | 'ArbBookingConfirm'
  | 'ArbBookingCreate'
  | 'ArbBookingEscrowStatusGet'
  | 'ArbBookingGet'
  | 'ArbBookingReject'
  | 'ArbBookingStatusUpdate'
  | 'ArbBookingsList'
  | 'ArbEscrowFundIntentCreate'
  | 'ArbEscrowReleaseRequest'
  | 'ArbOfferGet'
  | 'ArbOffersSearch'
  // DSH operations
  | 'DshCartGet'
  | 'DshCartInit'
  | 'DshCartItemAdd'
  | 'DshCartItemRemove'
  | 'DshCartItemUpdate'
  | 'DshCategoriesList'
  | 'DshCategoryGet'
  | 'DshCheckoutGate'
  | 'DshDeliveryAttemptCreate'
  | 'DshDeliveryAttemptsList'
  | 'DshDeliveryClose'
  | 'DshDeliveryEtaGet'
  | 'DshDeliveryGet'
  | 'DshDeliveryTrackGet'
  | 'DshEntitlementsGet'
  | 'DshFavoriteToggle'
  | 'DshFavoritesList'
  | 'DshHome'
  | 'DshOrderAccept'
  | 'DshOrderComplete'
  | 'DshOrderCancel'
  | 'DshOrderCreate'
  | 'DshOrderGet'
  | 'DshOrderIssueFlag'
  | 'DshOrderProofCodeGenerate'
  | 'DshOrderProofVerify'
  | 'DshOrderRate'
  | 'DshOrderReceiptGet'
  | 'DshOrderStatusGet'
  | 'DshOrdersList'
  | 'DshPricingPreview'
  | 'DshPricingSnapshotGet'
  | 'DshReviewCreate'
  | 'DshReviewsList'
  | 'DshSearch'
  | 'DshServiceModesResolve'
  | 'DshStoreGet'
  | 'DshStoreItemsList'
  | 'DshStoresList'
  | 'DshSubscriptionSync'
  | 'DshZoneSet'
  // 'DshSheinList' removed: SHEIN is manual proxy request only (no store list)
  | 'DshBookingCreate'
  | 'DshChatReadAck'
  | 'DshChatSend'
  | 'DshEstimateCreate'
  | 'DshEstimateGet'
  | 'DshExternalOrderCreate'
  | 'DshAwnakOrderCreate'
  | 'DshGasRefillOrderCreate'
  | 'DshLoyaltyPointsRedeem'
  | 'DshLoyaltyPointsUserBalance'
  | 'DshLoyaltyPointsUserHistory'
  | 'DshOrderEscrowHold'
  | 'DshOrderEscrowRelease'
  | 'DshOrderStatusUpdate'
  | 'DshSubscriptionFamilyGet'
  | 'DshSubscriptionFamilyMembersGet'
  | 'DshSubscriptionFamilyMembersPost'
  | 'DshSubscriptionTierGet'
  | 'DshSubscriptionUpgradePost'
  | 'DshSubscriptionProCatalog'
  // SHEIN proxy operations
  | 'DshSheinInfo'
  | 'DshProxyRequestReview'
  | 'DshProxyRequestApprove'
  | 'DshProxyRequestTracking'
    // ESF final surfaces
  | 'EsfHome'
  | 'EsfMatchGet'
  | 'EsfMatchesInbox'
  | 'EsfRequestGet'
  // KNZ operations
  | 'KnzCartGet'
  | 'KnzCartItemAdd'
  | 'KnzCategoriesList'
  | 'KnzChatMessageSend'
  | 'KnzChatThreadList'
  | 'KnzFavoriteToggle'
  | 'KnzFavoritesList'
  | 'KnzHome'
  | 'KnzListingCreate'
  | 'KnzListingDelete'
  | 'KnzListingGet'
  | 'KnzListingReport'
  | 'KnzListingUpdate'
  | 'KnzListingsList'
  | 'KnzListingsSearch'
  | 'KnzMyListings'
  | 'KnzAuctionsList'
  | 'KnzAuctionGet'
  | 'KnzAccount'
  | 'KnzPage'
  // KWD operations
  | 'KwdHome'
  | 'KwdMyFile'
  | 'KwdMyListings'
  | 'KwdApplicationGet'
  | 'KwdJobApply'
  | 'KwdJobGet'
  | 'KwdJobsList'
  | 'KwdListingReport'
  | 'KwdMyApplicationsList'
  // MRF operations
  | 'MrfClaimCreate'
  | 'MrfClaimGet'
  | 'MrfHome'
  | 'MrfMatchGet'
  | 'MrfMatchRespond'
  | 'MrfReportCreate'
  | 'MrfReportGet'
  | 'MrfReportUpdate'
  | 'MrfReportsList'
  // SND operations
  | 'SndHome'
  | 'SndRequestGet'
  | 'SndRequests'
  // PLATFORM operations
  | 'CaseActionApply'
  | 'CaseBind'
  | 'CaseClose'
  | 'CaseGet'
  | 'CaseMessageCreate'
  | 'CaseOpen'
  | 'CasesList'
  | 'ChatMessageCreate'
  | 'ChatMessagesList'
  | 'ChatReadAck'
  | 'ChatThreadBind'
  | 'ChatThreadGet'
  | 'ChatThreadOpen'
  | 'FxRatesGet'
  | 'PlatformAttachmentAdd'
  | 'PlatformAttachmentDelete'
  | 'PlatformAttachmentsList'
  | 'PlatformBootstrapGet'
  | 'PlatformDevicesList'
  | 'PlatformDevicesUpsert'
  | 'PlatformGeoCitiesList'
  | 'PlatformGeoZonesList'
  | 'PlatformHealthCheck'
  | 'PlatformPlacesAutocomplete'
  | 'PlatformUploadComplete'
  | 'PlatformUploadGet'
  | 'PlatformUploadInit'
  | 'SupportTicketClose'
  | 'SupportTicketCreate'
  | 'SupportTicketGet'
  | 'SupportTicketMessageCreate'
  | 'SupportTickets'
  // USER operations
  | 'UserAddressCreate'
  | 'UserAddressDefaultSet'
  | 'UserAddressDelete'
  | 'UserAddressUpdate'
  | 'UserAddressesList'
  | 'UserContextGet'
  | 'UserMeGet'
  | 'UserNotificationRead'
  | 'UserNotificationsList'
  | 'UserOtpSend'
  | 'UserOtpVerify'
  | 'UserPreferencesGet'
  | 'UserPreferencesUpdate'
  | 'UserProfile'
  | 'UserProfileUpdate'
  | 'UserPushTokenUpsert'
  | 'UserSessionCreate'
  | 'UserSessionEnd'
  | 'UserSessionRefresh'
  // WLT operations
  | 'WltAccountSnapshot'
  | 'WltAddressesAddressIdDeactivatePost'
  | 'WltAssetsAssetIdActivatePost'
  | 'WltAssetsAssetIdApprovePost'
  | 'WltAssetsAssetIdCancelPost'
  | 'WltAssetsAssetIdGet'
  | 'WltAssetsAssetIdRejectPost'
  | 'WltAssetsAssetIdReportPost'
  | 'WltBalanceGet'
  | 'WltHoldCreate'
  | 'WltHoldRelease'
  | 'WltHome'
  | 'WltIntentCancel'
  | 'WltIntentConfirm'
  | 'WltIntentCreate'
  | 'WltIntentGet'
  | 'WltKycSubmit'
  | 'WltPartnerFinanceOverview'
  | 'WltPartnerLedgerGet'
  | 'WltPartnerSettlementsList'
  | 'WltPayoutApprove'
  | 'WltPayoutGet'
  | 'WltPayoutRequest'
  | 'WltPayoutsList'
  | 'WltProviderCharge'
  | 'WltProviderWebhook'
  | 'WltRefundCreate'
  | 'WltRefundGet'
  | 'WltSettlementApprove'
  | 'WltSettlementCreate'
  | 'WltSettlementGet'
  | 'WltSettlementsList'
  | 'WltStatementsExport'
  | 'WltSubscriptionCancel'
  | 'WltSubscriptionCheckout'
  | 'WltSubscriptionInvoiceGet'
  | 'WltSubscriptionInvoicesList'
  | 'WltSubscriptionStatusGet'
  | 'WltSubscriptionPlansList'
  | 'WltTopup'
  | 'WltTransactionsList'
  | 'WltTransferCreate'
  | 'WltTransferGet'
  | 'WltTransfersList'
  | 'WltReceiveChangeFromCaptain'
  | 'WltRewardsHome'
  | 'WltSudadHome'
  | 'WltExchangePrice';

const SCREEN_MAP: Record<AppUserRouteKey, React.ComponentType<any>> = {
  Home: HomeScreen,
  // AMN operations
  AmnHome: auto_amn_home_get,
  AmnTripsList: auto_amn_trips_list,
  AmnTripCreate: auto_amn_trip_create,
  AmnTripTrack: auto_amn_trip_track_get,
  AmnCaptainsNearby: auto_amn_captains_nearby,
  AmnQuoteCreate: auto_amn_quote_create,
  AmnQuoteGet: auto_amn_quote_get,
  AmnSosTrigger: auto_amn_sos_trigger,
  AmnTripCancel: auto_amn_trip_cancel,
  AmnTripEstimate: auto_amn_trip_estimate,
  AmnTripEstimateGet: auto_amn_trip_estimate_get,
  AmnTripGet: auto_amn_trip_get,
  AmnTripRate: auto_amn_trip_rate,
  AmnTripReceiptGet: auto_amn_trip_receipt_get,
  AmnTripReport: auto_amn_trip_report,
  AmnBookingCreate: auto_amn_booking_create,
  AmnTripStatusUpdate: auto_amn_trip_status_update,
  AmnVehicleAvailabilityGet: auto_amn_vehicle_availability_get,
  AmnVehicleTypesList: auto_amn_vehicle_types_list,
  // ARB operations
  ArbHome: auto_arb_home_get,
  ArbAmendmentAccept: auto_arb_amendment_accept,
  ArbAmendmentCreate: auto_arb_amendment_create,
  ArbAmendmentReject: auto_arb_amendment_reject,
  ArbAmendmentsList: auto_arb_amendments_list,
  ArbBookingCancel: auto_arb_booking_cancel,
  ArbBookingConfirm: auto_arb_booking_confirm,
  ArbBookingCreate: auto_arb_booking_create,
  ArbBookingEscrowStatusGet: auto_arb_booking_escrow_status_get,
  ArbBookingGet: auto_arb_booking_get,
  ArbBookingReject: auto_arb_booking_reject,
  ArbBookingStatusUpdate: auto_arb_booking_status_update,
  ArbBookingsList: auto_arb_bookings_list,
  ArbEscrowFundIntentCreate: auto_arb_escrow_fund_intent_create,
  ArbEscrowReleaseRequest: auto_arb_escrow_release_request,
  ArbOfferGet: auto_arb_offer_get,
  ArbOffersSearch: auto_arb_offers_search,
  // DSH operations
  DshCartGet: auto_dsh_cart_get,
  DshCartInit: auto_dsh_cart_init,
  DshCartItemAdd: auto_dsh_cart_item_add,
  DshCartItemRemove: auto_dsh_cart_item_remove,
  DshCartItemUpdate: auto_dsh_cart_item_update,
  DshCategoriesList: auto_dsh_categories_list,
  DshCategoryGet: auto_dsh_category_get,
  DshCheckoutGate: auto_dsh_checkout_gate,
  DshDeliveryAttemptCreate: auto_dsh_delivery_attempt_create,
  DshDeliveryAttemptsList: auto_dsh_delivery_attempts_list,
  DshDeliveryClose: auto_dsh_delivery_close,
  DshDeliveryEtaGet: auto_dsh_delivery_eta_get,
  DshDeliveryGet: auto_dsh_delivery_get,
  DshDeliveryTrackGet: auto_dsh_delivery_track_get,
  DshEntitlementsGet: auto_dsh_entitlements_get,
  DshFavoriteToggle: auto_dsh_favorite_toggle,
  DshFavoritesList: auto_dsh_favorites_list,
  DshHome: auto_dsh_home_get,
  DshOrderAccept: auto_dsh_order_accept,
  DshOrderComplete: auto_dsh_order_complete,
  DshOrderCancel: auto_dsh_order_cancel,
  DshOrderCreate: auto_dsh_order_create,
  DshOrderGet: auto_dsh_order_get,
  DshOrderIssueFlag: auto_dsh_order_issue_flag,
  DshOrderProofCodeGenerate: auto_dsh_order_proof_code_generate,
  DshOrderProofVerify: auto_dsh_order_proof_verify,
  DshOrderRate: auto_dsh_order_rate,
  DshOrderReceiptGet: auto_dsh_order_receipt_get,
  DshOrderStatusGet: auto_dsh_order_status_get,
  DshOrdersList: auto_dsh_orders_list,
  DshPricingPreview: auto_dsh_pricing_preview,
  DshPricingSnapshotGet: auto_dsh_pricing_snapshot_get,
  DshReviewCreate: auto_dsh_review_create,
  DshReviewsList: auto_dsh_reviews_list,
  DshSearch: auto_dsh_search,
  DshServiceModesResolve: auto_dsh_service_modes_resolve,
  DshStoreGet: auto_dsh_store_get,
  DshStoreItemsList: auto_dsh_store_items_list,
  DshStoresList: auto_dsh_stores_list,
  DshSubscriptionSync: auto_dsh_subscription_sync,
  DshZoneSet: auto_dsh_zone_set,
  DshBookingCreate: auto_dsh_booking_create,
  DshChatReadAck: auto_dsh_chat_read_ack,
  DshChatSend: auto_dsh_chat_send,
  DshEstimateCreate: auto_dsh_estimate_create,
  DshEstimateGet: auto_dsh_estimate_get,
  DshExternalOrderCreate: auto_dsh_external_order_create,
  DshAwnakOrderCreate: auto_dsh_awnak_order_create,
  DshGasRefillOrderCreate: GasRefillOrderCreateScreen,
  DshLoyaltyPointsRedeem: auto_dsh_loyalty_points_redeem,
  DshLoyaltyPointsUserBalance: auto_dsh_loyalty_points_user_balance,
  DshLoyaltyPointsUserHistory: auto_dsh_loyalty_points_user_history,
  DshOrderEscrowHold: auto_dsh_order_escrow_hold,
  DshOrderEscrowRelease: auto_dsh_order_escrow_release,
  DshOrderStatusUpdate: auto_dsh_order_status_update,
  DshSubscriptionFamilyGet: auto_dsh_subscription_family_get,
  DshSubscriptionFamilyMembersGet: auto_dsh_subscription_family_members_get,
  DshSubscriptionFamilyMembersPost: auto_dsh_subscription_family_members_post,
  DshSubscriptionTierGet: auto_dsh_subscription_tier_get,
  DshSubscriptionUpgradePost: auto_dsh_subscription_upgrade_post,
  DshSubscriptionProCatalog: auto_dsh_subscription_pro_catalog,
  // SHEIN proxy operations
  DshSheinInfo: auto_dsh_shein_info,
  DshProxyRequestReview: auto_dsh_proxy_request_review,
  DshProxyRequestApprove: auto_dsh_proxy_request_approve,
  DshProxyRequestTracking: auto_dsh_proxy_request_tracking,
  // ESF operations
  EsfHome: auto_esf_home_get,
  EsfMatchGet: auto_esf_match_get,
  EsfMatchesInbox: auto_esf_matches_inbox,
  EsfRequestGet: auto_esf_request_get,
  // KNZ operations
  KnzCartGet: auto_knz_cart_get,
  KnzCartItemAdd: auto_knz_cart_item_add,
  KnzCategoriesList: auto_knz_categories_list,
  KnzChatMessageSend: auto_knz_chat_message_send,
  KnzChatThreadList: auto_knz_chat_thread_list,
  KnzFavoriteToggle: auto_knz_favorite_toggle,
  KnzFavoritesList: auto_knz_favorites_list,
  KnzHome: auto_knz_home_get,
  KnzListingCreate: auto_knz_listing_create,
  KnzListingDelete: auto_knz_listing_delete,
  KnzListingGet: auto_knz_listing_get,
  KnzListingReport: auto_knz_listing_report,
  KnzListingUpdate: auto_knz_listing_update,
  KnzListingsList: auto_knz_listings_list,
  KnzListingsSearch: auto_knz_listings_search,
  KnzMyListings: auto_knz_my_listings,
  KnzAuctionsList: auto_knz_auctions_list,
  KnzAuctionGet: auto_knz_auction_get,
  KnzAccount: KnzAccountScreen,
  KnzPage: KnzPageScreen,
  // KWD operations
  KwdHome: auto_kwd_home_get,
  KwdMyFile: KwdMyFileScreen,
  KwdMyListings: KwdMyListingsScreen,
  KwdApplicationGet: auto_kwd_application_get,
  KwdJobApply: auto_kwd_job_apply,
  KwdJobGet: auto_kwd_job_get,
  KwdJobsList: auto_kwd_jobs_list,
  KwdListingReport: auto_kwd_listing_report,
  KwdMyApplicationsList: auto_kwd_my_applications_list,
  // MRF operations
  MrfClaimCreate: auto_mrf_claim_create,
  MrfClaimGet: auto_mrf_claim_get,
  MrfHome: auto_mrf_home_get,
  MrfMatchGet: auto_mrf_match_get,
  MrfMatchRespond: auto_mrf_match_respond,
  MrfReportCreate: auto_mrf_report_create,
  MrfReportGet: auto_mrf_report_get,
  MrfReportUpdate: auto_mrf_report_update,
  MrfReportsList: auto_mrf_reports_list,
  // SND operations
  SndHome: auto_snd_home_get,
  SndRequestGet: auto_snd_request_get,
  SndRequests: auto_snd_requests_list,
  // PLATFORM operations (35+ screens - placeholders)
  CaseActionApply: UserFeaturePlaceholderScreen,
  CaseBind: UserFeaturePlaceholderScreen,
  CaseClose: UserFeaturePlaceholderScreen,
  CaseGet: UserFeaturePlaceholderScreen,
  CaseMessageCreate: UserFeaturePlaceholderScreen,
  CaseOpen: UserFeaturePlaceholderScreen,
  CasesList: UserFeaturePlaceholderScreen,
  ChatMessageCreate: UserFeaturePlaceholderScreen,
  ChatMessagesList: UserFeaturePlaceholderScreen,
  ChatReadAck: UserFeaturePlaceholderScreen,
  ChatThreadBind: UserFeaturePlaceholderScreen,
  ChatThreadGet: UserFeaturePlaceholderScreen,
  ChatThreadOpen: UserFeaturePlaceholderScreen,
  FxRatesGet: UserFeaturePlaceholderScreen,
  PlatformAttachmentAdd: UserFeaturePlaceholderScreen,
  PlatformAttachmentDelete: UserFeaturePlaceholderScreen,
  PlatformAttachmentsList: UserFeaturePlaceholderScreen,
  PlatformBootstrapGet: UserFeaturePlaceholderScreen,
  PlatformDevicesList: UserFeaturePlaceholderScreen,
  PlatformDevicesUpsert: UserFeaturePlaceholderScreen,
  PlatformGeoCitiesList: UserFeaturePlaceholderScreen,
  PlatformGeoZonesList: UserFeaturePlaceholderScreen,
  PlatformHealthCheck: UserFeaturePlaceholderScreen,
  PlatformPlacesAutocomplete: UserFeaturePlaceholderScreen,
  PlatformUploadComplete: UserFeaturePlaceholderScreen,
  PlatformUploadGet: UserFeaturePlaceholderScreen,
  PlatformUploadInit: UserFeaturePlaceholderScreen,
  SupportTicketClose: UserFeaturePlaceholderScreen,
  SupportTicketCreate: UserFeaturePlaceholderScreen,
  SupportTicketGet: UserFeaturePlaceholderScreen,
  SupportTicketMessageCreate: UserFeaturePlaceholderScreen,
  SupportTickets: SupportTicketsListScreen,
  // USER operations (19 screens - placeholders)
  UserAddressCreate: UserFeaturePlaceholderScreen,
  UserAddressDefaultSet: UserFeaturePlaceholderScreen,
  UserAddressDelete: UserFeaturePlaceholderScreen,
  UserAddressUpdate: UserFeaturePlaceholderScreen,
  UserAddressesList: UserAddressesListScreen,
  UserContextGet: UserFeaturePlaceholderScreen,
  UserMeGet: UserFeaturePlaceholderScreen,
  UserNotificationRead: UserFeaturePlaceholderScreen,
  UserNotificationsList: UserNotificationsListScreen,
  UserOtpSend: UserFeaturePlaceholderScreen,
  UserOtpVerify: UserFeaturePlaceholderScreen,
  UserPreferencesGet: UserPreferencesGetScreen,
  UserPreferencesUpdate: UserFeaturePlaceholderScreen,
  UserProfile: UserProfileScreen,
  UserProfileUpdate: UserProfileUpdateScreen,
  UserPushTokenUpsert: UserFeaturePlaceholderScreen,
  UserSessionCreate: UserFeaturePlaceholderScreen,
  UserSessionEnd: UserFeaturePlaceholderScreen,
  UserSessionRefresh: UserFeaturePlaceholderScreen,
  // WLT operations
  WltAccountSnapshot: auto_wlt_account_snapshot,
  WltAddressesAddressIdDeactivatePost:
    auto_wlt_addresses_addressId_deactivate_post,
  WltAssetsAssetIdActivatePost: auto_wlt_assets_assetId_activate_post,
  WltAssetsAssetIdApprovePost: auto_wlt_assets_assetId_approve_post,
  WltAssetsAssetIdCancelPost: auto_wlt_assets_assetId_cancel_post,
  WltAssetsAssetIdGet: auto_wlt_assets_assetId_get,
  WltAssetsAssetIdRejectPost: auto_wlt_assets_assetId_reject_post,
  WltAssetsAssetIdReportPost: auto_wlt_assets_assetId_report_post,
  WltBalanceGet: auto_wlt_balance_get,
  WltHoldCreate: auto_wlt_hold_create,
  WltHoldRelease: auto_wlt_hold_release,
  WltHome: auto_wlt_home_get,
  WltIntentCancel: auto_wlt_intent_cancel,
  WltIntentConfirm: auto_wlt_intent_confirm,
  WltIntentCreate: auto_wlt_intent_create,
  WltIntentGet: auto_wlt_intent_get,
  WltKycSubmit: auto_wlt_kyc_submit,
  WltPartnerFinanceOverview: auto_wlt_partner_finance_overview,
  WltPartnerLedgerGet: auto_wlt_partner_ledger_get,
  WltPartnerSettlementsList: auto_wlt_partner_settlements_list,
  WltPayoutApprove: auto_wlt_payout_approve,
  WltPayoutGet: auto_wlt_payout_get,
  WltPayoutRequest: auto_wlt_payout_request,
  WltPayoutsList: auto_wlt_payouts_list,
  WltProviderCharge: auto_wlt_provider_charge,
  WltProviderWebhook: auto_wlt_provider_webhook,
  WltRefundCreate: auto_wlt_refund_create,
  WltRefundGet: auto_wlt_refund_get,
  WltSettlementApprove: auto_wlt_settlement_approve,
  WltSettlementCreate: auto_wlt_settlement_create,
  WltSettlementGet: auto_wlt_settlement_get,
  WltSettlementsList: auto_wlt_settlements_list,
  WltStatementsExport: auto_wlt_statements_export,
  WltSubscriptionCancel: auto_wlt_subscription_cancel,
  WltSubscriptionCheckout: auto_wlt_subscription_checkout,
  WltSubscriptionInvoiceGet: auto_wlt_subscription_invoice_get,
  WltSubscriptionInvoicesList: auto_wlt_subscription_invoices_list,
  WltSubscriptionStatusGet: auto_wlt_subscription_status_get,
  WltSubscriptionPlansList: auto_wlt_subscriptions_plans_list,
  WltTopup: auto_wlt_topup,
  WltTransactionsList: auto_wlt_transactions_list,
  WltTransferCreate: auto_wlt_transfer_create,
  WltTransferGet: auto_wlt_transfer_get,
  WltTransfersList: auto_wlt_transfers_list,
  WltReceiveChangeFromCaptain: auto_wlt_receive_change_from_captain,
  WltRewardsHome: AutoWltRewardsHome,
  WltSudadHome: AutoWltSudadHome,
  WltExchangePrice: auto_wlt_exchangeprice,
};

const ROUTE_ALIASES: Record<string, AppUserRouteKey> = {
  auto_dsh_proxy_request_tracking: 'DshProxyRequestTracking',
  auto_dsh_proxy_request_review: 'DshProxyRequestReview',
  auto_dsh_proxy_request_approve: 'DshProxyRequestApprove',
  wlt_rewards_home: 'WltRewardsHome',
  wlt_exchangeprice: 'WltExchangePrice',
};

export function getScreenComponent(
  routeKey: string
): React.ComponentType<any> | null {
  const key = (ROUTE_ALIASES[routeKey] ?? routeKey) as AppUserRouteKey;
  return SCREEN_MAP[key] ?? null;
}

export function getDefaultRoute(): AppUserRouteKey {
  return ROUTE_HOME;
}
