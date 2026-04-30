/**
 * Fixture for ESF requests search (auto_esf_requests_search).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import type { BloodDonationRequest } from '../uiTypes';
export type { BloodDonationRequest };

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'esf.app-client.mobile.auto_esf_requests_search';

export function buildEsfRequestsSearchMock(t: TFunction): BloodDonationRequest[] {
  return [
    { id: 'REQ-001', bloodType: 'O+', units: 2, status: 'pending', location: t(`${NS}.l61`), hospitalName: t(`${NS}.l62`), timestamp: '', urgency: 'high' },
    { id: 'REQ-002', bloodType: 'A-', units: 1, status: 'pending', location: t(`${NS}.l70`), hospitalName: t(`${NS}.l71`), timestamp: '', urgency: 'medium' },
    { id: 'REQ-003', bloodType: 'B+', units: 3, status: 'matched', location: t(`${NS}.l79`), hospitalName: t(`${NS}.l80`), timestamp: '', urgency: 'low' },
    { id: 'REQ-004', bloodType: 'O-', units: 4, status: 'pending', location: t(`${NS}.l88`), hospitalName: t(`${NS}.l89`), timestamp: '', urgency: 'critical' },
  ];
}

