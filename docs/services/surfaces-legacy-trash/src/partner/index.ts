/**
 * Partner Surfaces — SSoT export for app-partner shell
 * DSH, ARB partner screens. Shell wires routes only.
 */

// Partner Base Screens
export { PartnerHomeScreen } from './PartnerHomeScreen';
export type { PartnerHomeScreenProps } from './PartnerHomeScreen';
export { PartnerMapScreen } from './PartnerMapScreen';
export { PartnerProfileScreen } from './PartnerProfileScreen';
export type { PartnerProfileScreenProps } from './PartnerProfileScreen';
export { PartnerModeSwitchSheet } from './PartnerModeSwitchSheet';
export type { PartnerModeSwitchSheetProps, PartnerType as PartnerModeSwitchType } from './PartnerModeSwitchSheet';
export { PartnerTypeSelectScreen } from './PartnerTypeSelectScreen';
export type { PartnerTypeSelectScreenProps } from './PartnerTypeSelectScreen';
export { PartnerNotificationsScreen } from './PartnerNotificationsScreen';

// DSH Partner (default exports as named for consistency)
export { default as AutoDshPartnerDeliveryZonesUpdate } from '../dsh/app-partner/mobile/auto_dsh_partner_delivery_zones_update';
export { default as AutoDshPartnerHoursUpdate } from '../dsh/app-partner/mobile/auto_dsh_partner_hours_update';
export { default as AutoDshPartnerItemsUpsert } from '../dsh/app-partner/mobile/auto_dsh_partner_items_upsert';
export { default as AutoDshPartnerOrderAccept } from '../dsh/app-partner/mobile/auto_dsh_partner_order_accept';
export { default as AutoDshPartnerOrderGet } from '../dsh/app-partner/mobile/auto_dsh_partner_order_get';
export { default as AutoDshPartnerOrderHandoff } from '../dsh/app-partner/mobile/auto_dsh_partner_order_handoff';
export { default as AutoDshPartnerOrderPrepare } from '../dsh/app-partner/mobile/auto_dsh_partner_order_prepare';
export { default as AutoDshPartnerOrderReady } from '../dsh/app-partner/mobile/auto_dsh_partner_order_ready';
export { default as AutoDshPartnerOrderReject } from '../dsh/app-partner/mobile/auto_dsh_partner_order_reject';
export { default as AutoDshPartnerOrdersList } from '../dsh/app-partner/mobile/auto_dsh_partner_orders_list';
export { default as AutoDshPartnerProfileGet } from '../dsh/app-partner/mobile/auto_dsh_partner_profile_get';
export { default as AutoDshPartnerStoreGet } from '../dsh/app-partner/mobile/auto_dsh_partner_store_get';
export { default as AutoDshPartnerStoreStatusUpdate } from '../dsh/app-partner/mobile/auto_dsh_partner_store_status_update';
export { default as AutoDshPartnerStoreUpdate } from '../dsh/app-partner/mobile/auto_dsh_partner_store_update';

// ARB Partner (default exports as named for consistency)
export { default as AutoArbBookingsBookingIdActivatePost } from '../arb/app-partner/mobile/auto_arb_bookings_bookingId_activate_post';
export { default as AutoArbBookingsBookingIdApprovePost } from '../arb/app-partner/mobile/auto_arb_bookings_bookingId_approve_post';
export { default as AutoArbBookingsBookingIdAssignPost } from '../arb/app-partner/mobile/auto_arb_bookings_bookingId_assign_post';
export { default as AutoArbBookingsBookingIdRatePost } from '../arb/app-partner/mobile/auto_arb_bookings_bookingId_rate_post';
export { default as AutoArbBookingsBookingIdVerifyPost } from '../arb/app-partner/mobile/auto_arb_bookings_bookingId_verify_post';
export { default as AutoArbPartnerBookingsList } from '../arb/app-partner/mobile/auto_arb_partner_bookings_list';
export { default as AutoArbPartnerFinanceOverview } from '../arb/app-partner/mobile/auto_arb_partner_finance_overview';
