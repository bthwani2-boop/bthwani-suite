/**
 * Fixture for ESF request get (auto_esf_request_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import type { EsfRequestDetail } from '../uiTypes';
export type { EsfRequestDetail };

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'esf.app-client.mobile.auto_esf_request_get';

export function buildEsfRequestGetMock(
  t: TFunction,
  requestId: string
): EsfRequestDetail {
  return {
    id: requestId,
    bloodType: 'O+',
    units: 2,
    status: 'matched',
    urgency: 'high',
    location: { address: t(`${NS}.l135`), coordinates: '24.7136, 46.6753' },
    hospitalName: t(`${NS}.l138`),
    beneficiary: 'other',
    medicalReason: 'open_heart',
    medicalReasonLabel: 'عملية قلب مفتوح',
    medicalReasonNote: 'الحالة تحتاج وحدتين اليوم قبل نهاية المناوبة.',
    contactMethod: 'in_app',
    contactInfo: '',
    requester: { name: t(`${NS}.l140`), phone: '+966501234567' },
    patient: { name: t(`${NS}.l144`), age: 45, condition: t(`${NS}.l146`) },
    matchedDonors: [
      {
        id: 'DONOR-001',
        name: t(`${NS}.l149`),
        distance: '2.5 كم',
        eta: '15 دقيقة',
      },
      {
        id: 'DONOR-002',
        name: t(`${NS}.l150`),
        distance: '3.8 كم',
        eta: '20 دقيقة',
      },
    ],
    timeline: [
      { time: '14:32', event: t(`${NS}.l155`), details: t(`${NS}.l156`) },
      { time: '14:35', event: t(`${NS}.l160`), details: t(`${NS}.l161`) },
      { time: '14:37', event: t(`${NS}.l165`), details: t(`${NS}.l166`) },
    ],
    notes: t(`${NS}.l169`),
    createdAt: '2024-02-10 14:30',
    expiresAt: '2024-02-11 14:30',
  };
}

