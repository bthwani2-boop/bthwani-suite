import type { Phase12FixtureLocation } from '../types';

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const dshAppCaptainFixtureLocationsDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'preview-only local display / not runtime UTC source',
  moneySemantics: 'not_applicable',
} as const;

export const dshAppCaptainFixtureLocations: Phase12FixtureLocation[] = [
  {
    candidateId: 'dsh_captain_offers_list',
    canonicalTarget: 'dsh_captain_offers_list',
    surface: 'app-captain',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/app-captain/dsh_captain_offers_list/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_captain_execution_workspace',
    canonicalTarget: 'dsh_captain_execution_workspace',
    surface: 'app-captain',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/app-captain/dsh_captain_execution_workspace/fixtures',
    status: 'declared',
  },
  {
    candidateId: 'dsh_captain_proof_capture',
    canonicalTarget: 'dsh_captain_proof_capture',
    surface: 'app-captain',
    phase: 'Phase 12',
    mode: 'fixtures-only',
    dataKind: 'UI_PREVIEW_ONLY',
    timezoneSemantics: 'preview-only local display / not runtime UTC source',
    location: 'dsh/frontend/app-captain/dsh_captain_proof_capture/fixtures',
    status: 'declared',
  },
];
