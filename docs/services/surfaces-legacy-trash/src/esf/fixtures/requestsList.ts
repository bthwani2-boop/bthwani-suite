/**
 * Fixture for ESF requests list (auto_esf_requests_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import type { BloodDonationRequest } from '../uiTypes';
export type { BloodDonationRequest };

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'esf.app-client.mobile.auto_esf_requests_list';

export function buildEsfRequestsListMock(t: TFunction): BloodDonationRequest[] {
  return [
    { id: 'REQ-001', bloodType: 'O+', units: 2, status: 'matched', location: t(`${NS}.l74`), hospitalName: t(`${NS}.l75`), timestamp: '2024-02-10 14:30', urgency: 'high', matchedDonors: 3 },
    { id: 'REQ-002', bloodType: 'A-', units: 1, status: 'pending', location: t(`${NS}.l85`), hospitalName: t(`${NS}.l86`), timestamp: '2024-02-10 16:45', urgency: 'medium' },
    { id: 'REQ-003', bloodType: 'B+', units: 3, status: 'completed', location: t(`${NS}.l95`), hospitalName: t(`${NS}.l96`), timestamp: '2024-02-09 09:15', urgency: 'low' },
    { id: 'REQ-004', bloodType: 'O-', units: 4, status: 'pending', location: t(`${NS}.l105`), hospitalName: t(`${NS}.l106`), timestamp: '2024-02-10 18:20', urgency: 'critical' },
  ];
}

