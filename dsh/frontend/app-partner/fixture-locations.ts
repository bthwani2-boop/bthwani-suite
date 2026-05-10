import type { Phase12FixtureLocation } from '../types';

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const dshAppPartnerFixtureLocationsDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

export const dshAppPartnerFixtureLocations: Phase12FixtureLocation[] = [
  {
    candidateId: 'dsh_partner_orders_board',
    canonicalTarget: 'dsh_partner_orders_board',
    surface: 'app-partner',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/app-partner/dsh_partner_orders_board/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_partner_order_workspace',
    canonicalTarget: 'dsh_partner_order_workspace',
    surface: 'app-partner',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/app-partner/dsh_partner_order_workspace/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_partner_store_maintenance_workspace',
    canonicalTarget: 'dsh_partner_store_maintenance_workspace',
    surface: 'app-partner',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/app-partner/dsh_partner_store_maintenance_workspace/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_partner_order_issue_queue',
    canonicalTarget: 'dsh_partner_order_issue_queue',
    surface: 'app-partner',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/app-partner/dsh_partner_order_issue_queue/fixtures',
    status: 'declared',
  },
];
