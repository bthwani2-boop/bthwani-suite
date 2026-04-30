/**
 * App-field route map — §86 SSoT from SCREENS_CATALOG (SurfaceId=app-field only).
 * Maps route keys to screen components for DSH and ARB field screens.
 */

import React from 'react';
import { FieldHomeScreen } from '../../field/FieldHomeScreen';
import { FieldMapScreen } from '../../field/FieldMapScreen';
import { FieldProfileScreen } from '../../field/FieldProfileScreen';
import { FieldNotificationsScreen } from '../../field/FieldNotificationsScreen';
import { FieldSettingsScreen } from '../../field/FieldSettingsScreen';
import { FieldSupportScreen } from '../../field/FieldSupportScreen';

// DSH Field Screens
import { default as AutoFieldPartnerDraftCreate } from '../../field/app-field/mobile/auto_field_partner_draft_create';
import { default as AutoFieldPartnerDraftGet } from '../../field/app-field/mobile/auto_field_partner_draft_get';
import { default as AutoFieldPartnerDraftUpdate } from '../../field/app-field/mobile/auto_field_partner_draft_update';
import { default as AutoFieldPartnerDraftSubmit } from '../../field/app-field/mobile/auto_field_partner_draft_submit';
import { default as AutoFieldPartnerDraftEvidenceAdd } from '../../field/app-field/mobile/auto_field_partner_draft_evidence_add';
import { default as AutoFieldPartnerDraftLinkUploads } from '../../field/app-field/mobile/auto_field_partner_draft_link_uploads';
import { default as AutoFieldPartnerDraftPinGeo } from '../../field/app-field/mobile/auto_field_partner_draft_pin_geo';
import { default as AutoFieldPartnerDraftSetHours } from '../../field/app-field/mobile/auto_field_partner_draft_set_hours';
import { default as AutoFieldPartnerServiceAttach } from '../../field/app-field/mobile/auto_field_partner_service_attach';
import { default as AutoFieldPartnerProductsList } from '../../field/app-field/mobile/auto_field_partner_products_list';
import { default as AutoFieldPartnerProductUpdate } from '../../field/app-field/mobile/auto_field_partner_product_update';
import { default as AutoFieldPartnerProductRemove } from '../../field/app-field/mobile/auto_field_partner_product_remove';
import { default as AutoFieldPartnerLeadUpdate } from '../../field/app-field/mobile/auto_field_partner_lead_update';
import { default as AutoFieldPartnerDraftReject } from '../../field/app-field/mobile/auto_field_partner_draft_reject';
import { default as AutoFieldPartnerActivate } from '../../field/app-field/mobile/auto_field_partner_activate';
import { default as AutoFieldPartnerSuspend } from '../../field/app-field/mobile/auto_field_partner_suspend';

// DSH Field Store Screens
import { default as AutoDshFieldStoreActivationRequest } from '../../dsh/app-field/mobile/auto_dsh_field_store_activation_request';
import { default as AutoDshFieldStoreGeoPin } from '../../dsh/app-field/mobile/auto_dsh_field_store_geo_pin';
import { default as AutoDshFieldStoreVisitLog } from '../../dsh/app-field/mobile/auto_dsh_field_store_visit_log';
import { default as AutoWltRewardsHome } from '../../wlt/app-user/mobile/auto_wlt_rewards_home';
import { default as AutoWltSudadHome } from '../../wlt/app-user/mobile/auto_wlt_sudad_home';
import { default as AutoWltExchangeprice } from '../../wlt/app-user/mobile/auto_wlt_exchangeprice';
import { default as AutoWltWithdrawRequest } from '../../wlt/app-user/mobile/auto_wlt_withdraw_request';

export const ROUTE_HOME = 'Home';
export const ROUTE_FIELD_TYPE_SELECT = 'FieldTypeSelect';

export type FieldRouteKey =
  | typeof ROUTE_HOME
  | typeof ROUTE_FIELD_TYPE_SELECT
  // Base screens
  | 'FieldMap'
  | 'FieldProfile'
  | 'FieldNotifications'
  | 'platform_field_settings'
  | 'platform_field_support'
  // DSH Field routes
  | 'field_partner_draft_create'
  | 'field_partner_draft_get'
  | 'field_partner_draft_update'
  | 'field_partner_draft_submit'
  | 'field_partner_draft_evidence_add'
  | 'field_partner_draft_link_uploads'
  | 'field_partner_draft_pin_geo'
  | 'field_partner_draft_set_hours'
  | 'field_partner_service_attach'
  | 'field_partner_products_list'
  | 'field_partner_product_update'
  | 'field_partner_product_remove'
  | 'field_partner_lead_update'
  | 'field_partner_draft_reject'
  | 'field_partner_activate'
  | 'field_partner_suspend'
  // DSH Field Store routes
  | 'dsh_field_store_activation_request'
  | 'dsh_field_store_geo_pin'
  | 'dsh_field_store_visit_log'
  // ARB Field routes (same screens, different service context)
  | 'arb_field_partner_draft_create'
  | 'arb_field_partner_draft_get'
  | 'arb_field_partner_draft_update'
  | 'arb_field_partner_draft_submit'
  | 'arb_field_partner_draft_evidence_add'
  | 'arb_field_partner_draft_link_uploads'
  | 'arb_field_partner_draft_pin_geo'
  | 'arb_field_partner_draft_set_hours'
  | 'arb_field_partner_service_attach'
  | 'arb_field_partner_products_list'
  | 'arb_field_partner_product_update'
  | 'arb_field_partner_product_remove'
  | 'arb_field_partner_lead_update'
  | 'arb_field_partner_draft_reject'
  | 'arb_field_partner_activate'
  | 'arb_field_partner_suspend'
  | 'wlt_sudad_home'
  | 'wlt_rewards_home'
  | 'wlt_exchangeprice'
  | 'wlt_withdraw_request';

const FIELD_SCREEN_MAP: Record<FieldRouteKey, React.ComponentType<any>> = {
  [ROUTE_HOME]: FieldHomeScreen,
  [ROUTE_FIELD_TYPE_SELECT]: FieldHomeScreen, // Will be handled by FieldMobileSurface
  
  // Base screens
  FieldMap: FieldMapScreen,
  FieldProfile: FieldProfileScreen,
  FieldNotifications: FieldNotificationsScreen,
  platform_field_settings: FieldSettingsScreen,
  platform_field_support: FieldSupportScreen,
  
  // DSH Field screens
  field_partner_draft_create: AutoFieldPartnerDraftCreate,
  field_partner_draft_get: AutoFieldPartnerDraftGet,
  field_partner_draft_update: AutoFieldPartnerDraftUpdate,
  field_partner_draft_submit: AutoFieldPartnerDraftSubmit,
  field_partner_draft_evidence_add: AutoFieldPartnerDraftEvidenceAdd,
  field_partner_draft_link_uploads: AutoFieldPartnerDraftLinkUploads,
  field_partner_draft_pin_geo: AutoFieldPartnerDraftPinGeo,
  field_partner_draft_set_hours: AutoFieldPartnerDraftSetHours,
  field_partner_service_attach: AutoFieldPartnerServiceAttach,
  field_partner_products_list: AutoFieldPartnerProductsList,
  field_partner_product_update: AutoFieldPartnerProductUpdate,
  field_partner_product_remove: AutoFieldPartnerProductRemove,
  field_partner_lead_update: AutoFieldPartnerLeadUpdate,
  field_partner_draft_reject: AutoFieldPartnerDraftReject,
  field_partner_activate: AutoFieldPartnerActivate,
  field_partner_suspend: AutoFieldPartnerSuspend,
  
  // DSH Field Store screens
  dsh_field_store_activation_request: AutoDshFieldStoreActivationRequest,
  dsh_field_store_geo_pin: AutoDshFieldStoreGeoPin,
  dsh_field_store_visit_log: AutoDshFieldStoreVisitLog,
  
  // ARB Field screens (same components, different route keys)
  arb_field_partner_draft_create: AutoFieldPartnerDraftCreate,
  arb_field_partner_draft_get: AutoFieldPartnerDraftGet,
  arb_field_partner_draft_update: AutoFieldPartnerDraftUpdate,
  arb_field_partner_draft_submit: AutoFieldPartnerDraftSubmit,
  arb_field_partner_draft_evidence_add: AutoFieldPartnerDraftEvidenceAdd,
  arb_field_partner_draft_link_uploads: AutoFieldPartnerDraftLinkUploads,
  arb_field_partner_draft_pin_geo: AutoFieldPartnerDraftPinGeo,
  arb_field_partner_draft_set_hours: AutoFieldPartnerDraftSetHours,
  arb_field_partner_service_attach: AutoFieldPartnerServiceAttach,
  arb_field_partner_products_list: AutoFieldPartnerProductsList,
  arb_field_partner_product_update: AutoFieldPartnerProductUpdate,
  arb_field_partner_product_remove: AutoFieldPartnerProductRemove,
  arb_field_partner_lead_update: AutoFieldPartnerLeadUpdate,
  arb_field_partner_draft_reject: AutoFieldPartnerDraftReject,
  arb_field_partner_activate: AutoFieldPartnerActivate,
  arb_field_partner_suspend: AutoFieldPartnerSuspend,
  wlt_sudad_home: AutoWltSudadHome,
  wlt_rewards_home: AutoWltRewardsHome,
  wlt_exchangeprice: AutoWltExchangeprice,
  wlt_withdraw_request: AutoWltWithdrawRequest,
};

export function getFieldScreenComponent(routeKey: string): React.ComponentType<any> | null {
  const key = routeKey as FieldRouteKey;
  return FIELD_SCREEN_MAP[key] ?? null;
}

export function getFieldDefaultRoute(): FieldRouteKey {
  return ROUTE_HOME;
}
