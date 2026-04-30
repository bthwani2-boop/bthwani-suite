/**
 * Fixture for ESF request cancel (auto_esf_request_cancel).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import type { EsfRequestCancelDetail } from '../uiTypes';
export type { EsfRequestCancelDetail };

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'esf.app-client.mobile.auto_esf_request_cancel';

export function buildEsfRequestCancelMock(t: TFunction, requestId: string): EsfRequestCancelDetail {
  return {
    id: requestId,
    bloodType: 'O+',
    units: 2,
    location: t(`${NS}.l81`),
    hospitalName: t(`${NS}.l82`),
    status: 'matched',
    matchedDonors: 2,
  };
}

