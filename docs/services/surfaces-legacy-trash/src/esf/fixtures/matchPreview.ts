/**
 * Fixture for ESF match preview on the merged match-get surface.
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import type { EsfMatchPreview } from '../uiTypes';

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const ACCEPT_NS = 'esf.app-client.mobile.auto_esf_match_accept';
const DECLINE_NS = 'esf.app-client.mobile.auto_esf_match_decline';

export function buildEsfMatchPreviewMock(
  t: TFunction,
  matchId: string
): EsfMatchPreview {
  return {
    id: matchId,
    requestBloodType: 'O+',
    requestUnits: 2,
    donorName: t(`${ACCEPT_NS}.l102`),
    donorBloodType: 'O+',
    location: t(`${DECLINE_NS}.mockHospitalName`),
    distance: t(`${ACCEPT_NS}.l105`),
    eta: t(`${ACCEPT_NS}.l106`),
    donorRating: 4.8,
    donationCount: 12,
    medicalReasonLabel: 'عملية قلب مفتوح',
    medicalReasonNote: 'المريض يحتاج النقل اليوم قبل نهاية الإجراء الطبي.',
    contactMethod: 'in_app',
    contactInfo: '',
  };
}

