import type { BloodType } from '../app-client/mobile/components/EsfBloodTypePickerSheet';
import type { EsfRequest } from '../uiTypes';

type EsfFixturePackId = 'PACK_A_HAPPY' | 'PACK_B_EDGE' | 'PACK_C_STRESS';

export interface EsfHomeFixtureInsights {
  activeRequests: number;
  readyDonors: number;
  responseWindowMinutes: number;
}

const BLOOD_TYPES: BloodType[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

function pick<T>(arr: T[], n: number): T {
  return arr[Math.max(0, Math.min(arr.length - 1, n % arr.length))];
}

function minutesAgoLabel(minutes: number): string {
  if (minutes <= 0) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (minutes < 24 * 60) return `منذ ${Math.floor(minutes / 60)} ساعة`;
  return `منذ ${Math.floor(minutes / (24 * 60))} يوم`;
}

function urgencyByIndex(i: number): EsfRequest['urgency'] {
  if (i % 17 === 0) return 'critical';
  if (i % 7 === 0) return 'high';
  if (i % 3 === 0) return 'medium';
  return 'low';
}

function distanceKmByIndex(i: number, max: number): number {
  const v = (i * 37) % Math.max(1, Math.floor(max * 10));
  return Math.max(0.4, Math.round((v / 10) * 10) / 10);
}

function makeRequest(
  i: number,
  opts: { bloodType?: BloodType; maxDistanceKm?: number }
): EsfRequest {
  const maxD = opts.maxDistanceKm ?? 20;
  const distance = distanceKmByIndex(i, maxD);
  const bloodType = opts.bloodType ?? pick(BLOOD_TYPES, i);
  const urgency = urgencyByIndex(i);

  return {
    id: `FX-REQ-${String(i + 1).padStart(3, '0')}`,
    bloodType,
    units: (i % 3) + 1,
    status: 'pending',
    isMyRequest: false,
    location: pick(
      [
        'الرياض — العليا',
        'الرياض — النرجس',
        'جدة — الشاطئ',
        'جدة — الروضة',
        'الدمام — الفيصلية',
        'الخبر — الراكة',
      ],
      i
    ),
    timestamp: minutesAgoLabel((i * 3) % 180),
    urgency,
    hospitalName: pick(
      [
        'مستشفى الملك فيصل التخصصي',
        'مدينة الملك سعود الطبية',
        'مستشفى الحبيب',
        'مستشفى دلة',
        'مستشفى جامعة الملك عبدالعزيز',
      ],
      i
    ),
    distance,
  };
}

export function createEsfHomeFixturePack(packId: EsfFixturePackId): {
  id: EsfFixturePackId;
  labelAr: string;
  requests: EsfRequest[];
  myRequests: EsfRequest[];
  insights: EsfHomeFixtureInsights;
} {
  if (packId === 'PACK_A_HAPPY') {
    const requests = Array.from({ length: 12 }, (_, i) =>
      makeRequest(i, { maxDistanceKm: 10 })
    ).map((r, i) => ({
      ...r,
      urgency: i < 2 ? 'high' : r.urgency,
      distance: Math.max(0.5, Math.min(5, r.distance ?? 1)),
    }));
    const matchedDonorsPrimary: NonNullable<EsfRequest['matchedDonors']> = [
      {
        id: 'FX-MATCH-001',
        name: 'عبدالله فهد',
        distance: '1.2 كم',
        eta: '6 دقائق',
        donorBloodType: 'O-',
        donorRating: 4.9,
      },
      {
        id: 'FX-MATCH-002',
        name: 'سلمان علي',
        distance: '2.4 كم',
        eta: '11 دقيقة',
        donorBloodType: 'O-',
        donorRating: 4.7,
      },
      {
        id: 'FX-MATCH-003',
        name: 'نورة خالد',
        distance: '3.1 كم',
        eta: '14 دقيقة',
        donorBloodType: 'O-',
        donorRating: 4.8,
      },
    ];
    const matchedDonorsRecovery: NonNullable<EsfRequest['matchedDonors']> = [
      {
        id: 'FX-MATCH-004',
        name: 'سارة محمد',
        distance: '0.9 كم',
        eta: '5 دقائق',
        donorBloodType: 'A+',
        donorRating: 4.9,
      },
      {
        id: 'FX-MATCH-005',
        name: 'أحمد ريان',
        distance: '1.8 كم',
        eta: '8 دقائق',
        donorBloodType: 'A+',
        donorRating: 4.6,
      },
      {
        id: 'FX-MATCH-006',
        name: 'ريم عادل',
        distance: '2.7 كم',
        eta: '12 دقيقة',
        donorBloodType: 'A+',
        donorRating: 4.7,
      },
    ];
    const matchedDonorsUrgent: NonNullable<EsfRequest['matchedDonors']> = [
      {
        id: 'FX-MATCH-007',
        name: 'خالد ياسر',
        distance: '1.4 كم',
        eta: '7 دقائق',
        donorBloodType: 'B+',
        donorRating: 4.8,
      },
      {
        id: 'FX-MATCH-008',
        name: 'تركي مازن',
        distance: '2.2 كم',
        eta: '10 دقائق',
        donorBloodType: 'B+',
        donorRating: 4.5,
      },
      {
        id: 'FX-MATCH-009',
        name: 'هند سعد',
        distance: '3.6 كم',
        eta: '16 دقيقة',
        donorBloodType: 'B+',
        donorRating: 4.9,
      },
    ];
    const matchedDonorsMaternity: NonNullable<EsfRequest['matchedDonors']> = [
      {
        id: 'FX-MATCH-010',
        name: 'لجين فؤاد',
        distance: '0.7 كم',
        eta: '4 دقائق',
        donorBloodType: 'AB+',
        donorRating: 4.9,
      },
      {
        id: 'FX-MATCH-011',
        name: 'محمد نايف',
        distance: '1.6 كم',
        eta: '7 دقائق',
        donorBloodType: 'AB+',
        donorRating: 4.6,
      },
    ];
    const matchedDonorsTherapy: NonNullable<EsfRequest['matchedDonors']> = [
      {
        id: 'FX-MATCH-012',
        name: 'نواف سامي',
        distance: '1.1 كم',
        eta: '5 دقائق',
        donorBloodType: 'O+',
        donorRating: 4.8,
      },
      {
        id: 'FX-MATCH-013',
        name: 'رغد عبدالعزيز',
        distance: '2.5 كم',
        eta: '9 دقائق',
        donorBloodType: 'O+',
        donorRating: 4.7,
      },
      {
        id: 'FX-MATCH-014',
        name: 'سلطان بدر',
        distance: '3.4 كم',
        eta: '13 دقيقة',
        donorBloodType: 'O+',
        donorRating: 4.5,
      },
      {
        id: 'FX-MATCH-015',
        name: 'غلا منصور',
        distance: '4.2 كم',
        eta: '18 دقيقة',
        donorBloodType: 'O+',
        donorRating: 4.9,
      },
    ];
    const myRequests: EsfRequest[] = [
      {
        id: 'FX-MY-REQ-001',
        bloodType: 'O-',
        units: 2,
        status: 'pending',
        isMyRequest: true,
        location: 'الرياض — النرجس',
        timestamp: 'منذ 8 دقائق',
        urgency: 'high',
        hospitalName: 'مستشفى الحبيب',
        medicalReason: 'major_surgery',
        medicalReasonLabel: 'عملية جراحية',
        matchedDonors: matchedDonorsPrimary,
        responsesCount: matchedDonorsPrimary.length,
      },
      {
        id: 'FX-MY-REQ-002',
        bloodType: 'A+',
        units: 1,
        status: 'matched',
        isMyRequest: true,
        location: 'الرياض — الصحافة',
        timestamp: 'منذ 4 دقائق',
        urgency: 'medium',
        hospitalName: 'مدينة الملك سعود الطبية',
        medicalReason: 'blood_disorder',
        medicalReasonLabel: 'مرض دم',
        matchedDonors: matchedDonorsRecovery,
        responsesCount: matchedDonorsRecovery.length,
      },
      {
        id: 'FX-MY-REQ-003',
        bloodType: 'B+',
        units: 3,
        status: 'pending',
        isMyRequest: true,
        location: 'الرياض — الياسمين',
        timestamp: 'منذ 13 دقيقة',
        urgency: 'critical',
        hospitalName: 'مستشفى دلة',
        medicalReason: 'accident',
        medicalReasonLabel: 'حادث',
        matchedDonors: matchedDonorsUrgent,
        responsesCount: matchedDonorsUrgent.length,
      },
      {
        id: 'FX-MY-REQ-004',
        bloodType: 'AB+',
        units: 2,
        status: 'matched',
        isMyRequest: true,
        location: 'الرياض — إشبيلية',
        timestamp: 'منذ دقيقة واحدة',
        urgency: 'high',
        hospitalName: 'مستشفى المملكة',
        medicalReason: 'postpartum_bleeding',
        medicalReasonLabel: 'نزيف بعد الولادة',
        matchedDonors: matchedDonorsMaternity,
        responsesCount: matchedDonorsMaternity.length,
      },
      {
        id: 'FX-MY-REQ-005',
        bloodType: 'O+',
        units: 4,
        status: 'pending',
        isMyRequest: true,
        location: 'الرياض — الملقا',
        timestamp: 'منذ 16 دقيقة',
        urgency: 'medium',
        hospitalName: 'مستشفى الملك خالد الجامعي',
        medicalReason: 'cancer_treatment',
        medicalReasonLabel: 'جلسات علاج الأورام',
        matchedDonors: matchedDonorsTherapy,
        responsesCount: matchedDonorsTherapy.length,
      },
    ];
    return {
      id: packId,
      labelAr: 'معاينة حية تتبدل بين عدة طلبات نشطة',
      requests,
      myRequests,
      insights: {
        activeRequests: requests.length,
        readyDonors: 34,
        responseWindowMinutes: 6,
      },
    };
  }

  if (packId === 'PACK_B_EDGE') {
    const nonMatching = Array.from({ length: 10 }, (_, i) =>
      makeRequest(i + 50, { bloodType: 'AB-' })
    );
    const far = Array.from({ length: 3 }, (_, i) =>
      makeRequest(i + 80, { maxDistanceKm: 60 })
    ).map(r => ({ ...r, distance: (r.distance ?? 25) + 25 }));
    const critical = Array.from({ length: 2 }, (_, i) =>
      makeRequest(i + 90, { maxDistanceKm: 5 })
    ).map(r => ({ ...r, urgency: 'critical' as const, distance: 1.2 }));
    return {
      id: packId,
      labelAr: 'معاينة حالات متباينة',
      requests: [...critical, ...far, ...nonMatching],
      myRequests: [],
      insights: {
        activeRequests: 15,
        readyDonors: 9,
        responseWindowMinutes: 14,
      },
    };
  }

  const stress = Array.from({ length: 60 }, (_, i) =>
    makeRequest(i + 200, { maxDistanceKm: 30 })
  );
  return {
    id: packId,
    labelAr: 'معاينة كثافة مرتفعة',
    requests: stress,
    myRequests: [],
    insights: {
      activeRequests: stress.length,
      readyDonors: 41,
      responseWindowMinutes: 5,
    },
  };
}

