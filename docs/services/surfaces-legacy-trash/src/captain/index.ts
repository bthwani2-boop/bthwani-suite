/**
 * Captain Surfaces — SSoT export for app-captain shell
 * DSH and AMN captain screens only (no KNZ per policy). Shell wires routes only.
 */

// Captain Type Definitions (single source: captainTypes.ts — avoids require cycle with CaptainTypeContext)
export type { CaptainType } from './captainTypes';
export { CAPTAIN_TYPE_STORAGE_KEY } from './captainTypes';
export type { CaptainHomeScreenProps } from './CaptainHomeScreen';
export { CaptainHomeScreen } from './CaptainHomeScreen';
export { CaptainMapScreen } from './CaptainMapScreen';
export { CaptainProfileScreen } from './CaptainProfileScreen';
export { CaptainNotificationsScreen } from './CaptainNotificationsScreen';

// DSH Captain (default exports as named for consistency)
export { default as AutoCaptainEarningsHistory } from '../dsh/app-captain/mobile/auto_captain_earnings_history';
export { default as AutoCaptainFinancialReports } from '../dsh/app-captain/mobile/auto_captain_financial_reports';
export { default as AutoCaptainPayments } from '../dsh/app-captain/mobile/auto_captain_payments';
export { default as AutoCaptainSettlements } from '../dsh/app-captain/mobile/auto_captain_settlements';
export { default as AutoCaptainWallet } from '../dsh/app-captain/mobile/auto_captain_wallet';
export { default as AutoDshCaptainChatReadAck } from '../dsh/app-captain/mobile/auto_dsh_captain_chat_read_ack';
export { default as AutoDshCaptainChatSend } from '../dsh/app-captain/mobile/auto_dsh_captain_chat_send';
export { default as AutoDshCaptainCodBalance } from '../dsh/app-captain/mobile/auto_dsh_captain_cod_balance';
export { default as AutoDshCaptainJobReject } from '../dsh/app-captain/mobile/auto_dsh_captain_job_reject';
export { default as AutoDshCaptainProofUpload } from '../dsh/app-captain/mobile/auto_dsh_captain_proof_upload';
export { default as AutoDshCaptainTierEvaluate } from '../dsh/app-captain/mobile/auto_dsh_captain_tier_evaluate';
export { default as AutoDshCaptainTierInfo } from '../dsh/app-captain/mobile/auto_dsh_captain_tier_info';
export { default as AutoDshCaptainOrderAccept } from '../dsh/app-captain/mobile/auto_dsh_captain_order_accept';
export { default as AutoDshCaptainOrderDeliver } from '../dsh/app-captain/mobile/auto_dsh_captain_order_deliver';
export { default as AutoDshCaptainOrderDetails } from '../dsh/app-captain/mobile/auto_dsh_captain_order_details';
export { default as AutoDshCaptainOrderGet } from '../dsh/app-captain/mobile/auto_dsh_captain_order_get';
export { default as AutoDshCaptainOrderPickup } from '../dsh/app-captain/mobile/auto_dsh_captain_order_pickup';
export { default as AutoDshCaptainOrdersList } from '../dsh/app-captain/mobile/auto_dsh_captain_orders_list';

// AMN Captain (default exports as named for consistency)
export { default as AutoAmnCaptainAvailabilityUpdate } from '../amn/app-captain/mobile/auto_amn_captain_availability_update';
export { default as AutoAmnCaptainsNearby } from '../amn/app-captain/mobile/auto_amn_captains_nearby';
export { default as AutoAmnCaptainStatusUpdate } from '../amn/app-captain/mobile/auto_amn_captain_status_update';
export { default as AutoAmnCaptainTierEvaluate } from '../amn/app-captain/mobile/auto_amn_captain_tier_evaluate';
export { default as AutoAmnCaptainTierInfo } from '../amn/app-captain/mobile/auto_amn_captain_tier_info';
export { default as AutoAmnCaptainOfferRespond } from '../amn/app-captain/mobile/auto_amn_captain_offer_respond';
export { default as AutoAmnCaptainOffersList } from '../amn/app-captain/mobile/auto_amn_captain_offers_list';
export { default as AutoAmnCaptainTripAssignedGet } from '../amn/app-captain/mobile/auto_amn_captain_trip_assigned_get';

// PLATFORM Captain (Shared across DSH, AMN)
export { default as AutoPlatformCaptainDocumentsGet } from '../platform/app-captain/mobile/auto_platform_captain_documents_get';

// UNIFIED SCREENS - Work across DSH, AMN captain types
export { default as AutoPlatformCaptainLocationPing } from '../platform/app-captain/mobile/auto_platform_captain_location_ping';
export { default as AutoPlatformCaptainProfileGet } from '../platform/app-captain/mobile/auto_platform_captain_profile_get';
export { default as AutoPlatformCaptainEarningsGet } from '../platform/app-captain/mobile/auto_platform_captain_earnings_get';
export { default as AutoPlatformCaptainDocumentsUpsert } from '../platform/app-captain/mobile/auto_platform_captain_documents_upsert';
export { default as AutoPlatformCaptainIncidentCreate } from '../platform/app-captain/mobile/auto_platform_captain_incident_create';
export { default as AutoPlatformCaptainIncidentGet } from '../platform/app-captain/mobile/auto_platform_captain_incident_get';
export { default as AutoPlatformCaptainIncidentsList } from '../platform/app-captain/mobile/auto_platform_captain_incidents_list';
export { default as AutoPlatformCaptainSettings } from '../platform/app-captain/mobile/auto_platform_captain_settings';
export { default as AutoPlatformCaptainSupport } from '../platform/app-captain/mobile/auto_platform_captain_support';
export { default as AutoPlatformCaptainTierInfo } from '../platform/app-captain/mobile/auto_platform_captain_tier_info';
export { default as AutoPlatformCaptainTierEvaluate } from '../platform/app-captain/mobile/auto_platform_captain_tier_evaluate';
