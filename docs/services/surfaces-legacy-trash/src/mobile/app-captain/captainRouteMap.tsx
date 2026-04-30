/**
 * App-captain route map — §86 SSoT from SCREENS_CATALOG (SurfaceId=app-captain only).
 * Maps route keys to screen components for DSH and AMN captain screens only (no KNZ per policy).
 */

import React from 'react';
import { CaptainHomeScreen } from '../../captain/CaptainHomeScreen';
import { CaptainMapScreen } from '../../captain/CaptainMapScreen';
import { CaptainProfileScreen } from '../../captain/CaptainProfileScreen';
import { CaptainNotificationsScreen } from '../../captain/CaptainNotificationsScreen';

// DSH Captain Screens
import { default as AutoDshCaptainOrdersList } from '../../dsh/app-captain/mobile/auto_dsh_captain_orders_list';
import { default as AutoDshCaptainOrderGet } from '../../dsh/app-captain/mobile/auto_dsh_captain_order_get';
import { default as AutoDshCaptainOrderAccept } from '../../dsh/app-captain/mobile/auto_dsh_captain_order_accept';
import { default as AutoDshCaptainOrderPickup } from '../../dsh/app-captain/mobile/auto_dsh_captain_order_pickup';
import { default as AutoDshCaptainOrderDeliver } from '../../dsh/app-captain/mobile/auto_dsh_captain_order_deliver';
import { default as AutoDshCaptainOrderDetails } from '../../dsh/app-captain/mobile/auto_dsh_captain_order_details';
import { default as AutoDshCaptainCodBalance } from '../../dsh/app-captain/mobile/auto_dsh_captain_cod_balance';
import { default as AutoDshCaptainChatReadAck } from '../../dsh/app-captain/mobile/auto_dsh_captain_chat_read_ack';
import { default as AutoDshCaptainChatSend } from '../../dsh/app-captain/mobile/auto_dsh_captain_chat_send';
import { default as AutoDshCaptainJobReject } from '../../dsh/app-captain/mobile/auto_dsh_captain_job_reject';
import { default as AutoDshCaptainProofUpload } from '../../dsh/app-captain/mobile/auto_dsh_captain_proof_upload';
import { default as AutoDshCaptainProfileGet } from '../../dsh/app-captain/mobile/auto_dsh_captain_profile_get';
import { default as AutoDshCaptainTierEvaluate } from '../../dsh/app-captain/mobile/auto_dsh_captain_tier_evaluate';
import { default as AutoDshCaptainTierInfo } from '../../dsh/app-captain/mobile/auto_dsh_captain_tier_info';
import { default as AutoCaptainWallet } from '../../dsh/app-captain/mobile/auto_captain_wallet';
import { default as AutoCaptainSettlements } from '../../dsh/app-captain/mobile/auto_captain_settlements';
import { default as AutoCaptainEarningsHistory } from '../../dsh/app-captain/mobile/auto_captain_earnings_history';
import { default as AutoCaptainPayments } from '../../dsh/app-captain/mobile/auto_captain_payments';
import { default as AutoCaptainFinancialReports } from '../../dsh/app-captain/mobile/auto_captain_financial_reports';

// AMN Captain Screens
import { default as AutoAmnCaptainOffersList } from '../../amn/app-captain/mobile/auto_amn_captain_offers_list';
import { default as AutoAmnCaptainOfferRespond } from '../../amn/app-captain/mobile/auto_amn_captain_offer_respond';
import { default as AutoAmnCaptainTripAssignedGet } from '../../amn/app-captain/mobile/auto_amn_captain_trip_assigned_get';
import { default as AutoAmnCaptainAvailabilityUpdate } from '../../amn/app-captain/mobile/auto_amn_captain_availability_update';
import { default as AutoAmnCaptainStatusUpdate } from '../../amn/app-captain/mobile/auto_amn_captain_status_update';
import { default as AutoAmnCaptainsNearby } from '../../amn/app-captain/mobile/auto_amn_captains_nearby';
import { default as AutoAmnCaptainTierEvaluate } from '../../amn/app-captain/mobile/auto_amn_captain_tier_evaluate';
import { default as AutoAmnCaptainTierInfo } from '../../amn/app-captain/mobile/auto_amn_captain_tier_info';

// Platform Captain Screens (Shared across DSH, AMN)
import { default as AutoPlatformCaptainDocumentsGet } from '../../platform/app-captain/mobile/auto_platform_captain_documents_get';
import { default as AutoPlatformCaptainDocumentsUpsert } from '../../platform/app-captain/mobile/auto_platform_captain_documents_upsert';
import { default as AutoPlatformCaptainLocationPing } from '../../platform/app-captain/mobile/auto_platform_captain_location_ping';
import { default as AutoPlatformCaptainProfileGet } from '../../platform/app-captain/mobile/auto_platform_captain_profile_get';
import { default as AutoPlatformCaptainEarningsGet } from '../../platform/app-captain/mobile/auto_platform_captain_earnings_get';
import { default as AutoPlatformCaptainIncidentCreate } from '../../platform/app-captain/mobile/auto_platform_captain_incident_create';
import { default as AutoPlatformCaptainIncidentGet } from '../../platform/app-captain/mobile/auto_platform_captain_incident_get';
import { default as AutoPlatformCaptainIncidentsList } from '../../platform/app-captain/mobile/auto_platform_captain_incidents_list';
import { default as AutoPlatformCaptainSettings } from '../../platform/app-captain/mobile/auto_platform_captain_settings';
import { default as AutoPlatformCaptainSupport } from '../../platform/app-captain/mobile/auto_platform_captain_support';
import { default as AutoPlatformCaptainTierInfo } from '../../platform/app-captain/mobile/auto_platform_captain_tier_info';
import { default as AutoPlatformCaptainTierEvaluate } from '../../platform/app-captain/mobile/auto_platform_captain_tier_evaluate';

// WLT Captain: transfer to customer only (unofficial wallet)
import { default as AutoWltCaptainTransferToCustomer } from '../../wlt/app-captain/mobile/auto_wlt_captain_transfer_to_customer';
// WLT Captain: balance top-up (same screen as app-user)
import { default as AutoWltRewardsHome } from '../../wlt/app-user/mobile/auto_wlt_rewards_home';
import { default as AutoWltSudadHome } from '../../wlt/app-user/mobile/auto_wlt_sudad_home';
import { default as AutoWltTopup } from '../../wlt/app-user/mobile/auto_wlt_topup';
import { default as AutoWltExchangeprice } from '../../wlt/app-user/mobile/auto_wlt_exchangeprice';
import { default as AutoWltWithdrawRequest } from '../../wlt/app-user/mobile/auto_wlt_withdraw_request';

export const ROUTE_HOME = 'Home';
export const ROUTE_CAPTAIN_TYPE_SELECT = 'CaptainTypeSelect';

export type CaptainRouteKey =
  | typeof ROUTE_HOME
  | typeof ROUTE_CAPTAIN_TYPE_SELECT
  // DSH routes
  | 'dsh_captain_orders_list'
  | 'dsh_captain_order_get'
  | 'dsh_captain_order_accept'
  | 'dsh_captain_order_pickup'
  | 'dsh_captain_order_deliver'
  | 'dsh_captain_order_details'
  | 'dsh_captain_cod_balance'
  | 'dsh_captain_chat_read_ack'
  | 'dsh_captain_chat_send'
  | 'dsh_captain_job_reject'
  | 'dsh_captain_proof_upload'
  | 'dsh_captain_profile_get'
  | 'dsh_captain_tier_evaluate'
  | 'dsh_captain_tier_info'
  | 'captain_wallet'
  | 'captain_settlements'
  | 'captain_earnings_history'
  | 'captain_payments'
  | 'captain_financial_reports'
  | 'wlt_captain_transfer_to_customer'
  | 'wlt_rewards_home'
  | 'wlt_sudad_home'
  | 'wlt_topup'
  | 'wlt_exchangeprice'
  | 'wlt_withdraw_request'
  // AMN routes
  | 'amn_captain_offers_list'
  | 'amn_captain_offer_respond'
  | 'amn_captain_trip_assigned_get'
  | 'amn_captain_availability_update'
  | 'amn_captain_status_update'
  | 'amn_captains_nearby'
  | 'amn_captain_tier_evaluate'
  | 'amn_captain_tier_info'
  // Platform routes (shared across DSH, AMN)
  | 'platform_captain_documents_get'
  | 'platform_captain_documents_upsert'
  | 'platform_captain_location_ping'
  | 'platform_captain_profile_get'
  | 'platform_captain_earnings_get'
  | 'platform_captain_incident_create'
  | 'platform_captain_incident_get'
  | 'platform_captain_incidents_list'
  | 'platform_captain_settings'
  | 'platform_captain_support'
  | 'platform_captain_tier_info'
  | 'platform_captain_tier_evaluate'
  // Base screens
  | 'CaptainMap'
  | 'CaptainProfile'
  | 'CaptainNotifications'
  | 'CaptainSettings';

const CAPTAIN_SCREEN_MAP: Record<CaptainRouteKey, React.ComponentType<any>> = {
  [ROUTE_HOME]: CaptainHomeScreen,
  [ROUTE_CAPTAIN_TYPE_SELECT]: CaptainHomeScreen, // Will be handled by CaptainMobileSurface
  
  // DSH screens
  dsh_captain_orders_list: AutoDshCaptainOrdersList,
  dsh_captain_order_get: AutoDshCaptainOrderGet,
  dsh_captain_order_accept: AutoDshCaptainOrderAccept,
  dsh_captain_order_pickup: AutoDshCaptainOrderPickup,
  dsh_captain_order_deliver: AutoDshCaptainOrderDeliver,
  dsh_captain_order_details: AutoDshCaptainOrderDetails,
  dsh_captain_cod_balance: AutoDshCaptainCodBalance,
  dsh_captain_chat_read_ack: AutoDshCaptainChatReadAck,
  dsh_captain_chat_send: AutoDshCaptainChatSend,
  dsh_captain_job_reject: AutoDshCaptainJobReject,
  dsh_captain_proof_upload: AutoDshCaptainProofUpload,
  dsh_captain_profile_get: AutoDshCaptainProfileGet,
  dsh_captain_tier_evaluate: AutoDshCaptainTierEvaluate,
  dsh_captain_tier_info: AutoDshCaptainTierInfo,
  captain_wallet: AutoCaptainWallet,
  captain_settlements: AutoCaptainSettlements,
  captain_earnings_history: AutoCaptainEarningsHistory,
  captain_payments: AutoCaptainPayments,
  captain_financial_reports: AutoCaptainFinancialReports,
  wlt_captain_transfer_to_customer: AutoWltCaptainTransferToCustomer,
  wlt_rewards_home: AutoWltRewardsHome,
  wlt_sudad_home: AutoWltSudadHome,
  wlt_topup: AutoWltTopup,
  wlt_exchangeprice: AutoWltExchangeprice,
  wlt_withdraw_request: AutoWltWithdrawRequest,

  // AMN screens
  amn_captain_offers_list: AutoAmnCaptainOffersList,
  amn_captain_offer_respond: AutoAmnCaptainOfferRespond,
  amn_captain_trip_assigned_get: AutoAmnCaptainTripAssignedGet,
  amn_captain_availability_update: AutoAmnCaptainAvailabilityUpdate,
  amn_captain_status_update: AutoAmnCaptainStatusUpdate,
  amn_captains_nearby: AutoAmnCaptainsNearby,
  amn_captain_tier_evaluate: AutoAmnCaptainTierEvaluate,
  amn_captain_tier_info: AutoAmnCaptainTierInfo,
  
  // Platform screens (shared across DSH, AMN)
  platform_captain_documents_get: AutoPlatformCaptainDocumentsGet,
  platform_captain_documents_upsert: AutoPlatformCaptainDocumentsUpsert,
  platform_captain_location_ping: AutoPlatformCaptainLocationPing,
  platform_captain_profile_get: AutoPlatformCaptainProfileGet,
  platform_captain_earnings_get: AutoPlatformCaptainEarningsGet,
  platform_captain_incident_create: AutoPlatformCaptainIncidentCreate,
  platform_captain_incident_get: AutoPlatformCaptainIncidentGet,
  platform_captain_incidents_list: AutoPlatformCaptainIncidentsList,
  platform_captain_settings: AutoPlatformCaptainSettings,
  platform_captain_support: AutoPlatformCaptainSupport,
  platform_captain_tier_info: AutoPlatformCaptainTierInfo,
  platform_captain_tier_evaluate: AutoPlatformCaptainTierEvaluate,
  
  // Base screens
  CaptainMap: CaptainMapScreen,
  CaptainProfile: CaptainProfileScreen,
  CaptainNotifications: CaptainNotificationsScreen,
  CaptainSettings: AutoPlatformCaptainSettings,
};

export function getCaptainScreenComponent(routeKey: string): React.ComponentType<any> | null {
  const key = routeKey as CaptainRouteKey;
  return CAPTAIN_SCREEN_MAP[key] ?? null;
}

export function getCaptainDefaultRoute(): CaptainRouteKey {
  return 'CaptainMap';
}
