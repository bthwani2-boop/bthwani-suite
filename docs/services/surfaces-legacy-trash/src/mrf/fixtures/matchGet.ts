/**
 * Fixture for MRF match get (auto_mrf_match_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface MrfMatchDetail {
  id: string;
  reportId: string;
  person: {
    name: string;
    age: string;
    gender: string;
    description: string;
    lastSeen: string;
    missingSince: string;
  };
  possibleMatch: {
    foundPerson: {
      name: string;
      age: string;
      gender: string;
      description: string;
      foundLocation: string;
      foundDate: string;
    };
    similarity: number;
    confidence: string;
    matchingDetails: string[];
    differences: string[];
  };
  policeInfo: {
    officer: string;
    station: string;
    contact: string;
  };
  actions: Array<{ id: string; label: string; type: string }>;
}

export function buildMrfMatchGetMock(t: TFunction, matchId?: string): MrfMatchDetail {
  return {
    id: matchId ?? 'MATCH-001',
    reportId: 'RPT-001',
    person: {
      name: 'سارة أحمد',
      age: t('surfaces.25_عاماً'),
      gender: t('surfaces.أنثى'),
      description: t('mrf.app-client.mobile.auto_mrf_match_get.165'),
      lastSeen: t('surfaces.شارع_الملك_فيصل،_حي_العليا،_الرياض'),
      missingSince: '2024-02-08 12:00',
    },
    possibleMatch: {
      foundPerson: {
        name: t('surfaces.سارة_محمد'),
        age: t('surfaces.26_عاماً'),
        gender: 'أنثى',
        description: t('mrf.app-client.mobile.auto_mrf_match_get.168'),
        foundLocation: t('surfaces.مستشفى_الملك_فيصل،_الرياض'),
        foundDate: '2024-02-10 14:30',
      },
      similarity: 85,
      confidence: 'high',
      matchingDetails: [
        t('surfaces.تطابق_في_الاسم_الأول'),
        t('surfaces.تطابق_في_العمر_تقريباً'),
        t('surfaces.تطابق_في_لون_الشعر_والطول'),
        t('surfaces.تطابق_في_الملابس'),
      ],
      differences: [
        t('surfaces.اختلاف_طفيف_في_طول_الشعر'),
        t('surfaces.اختلاف_بسيط_في_لون_القميص'),
      ],
    },
    policeInfo: {
      officer: t('surfaces.الملازم_أحمد_العتيبي'),
      station: t('surfaces.مركز_شرطة_حي_العليا'),
      contact: '+966112345678',
    },
    actions: [
      { id: 'accept', label: t('mrf.app-client.mobile.auto_mrf_match_get.confirmMatch'), type: 'primary' },
      { id: 'decline', label: t('mrf.app-client.mobile.auto_mrf_match_get.declineMatch'), type: 'secondary' },
      { id: 'investigate', label: t('mrf.app-client.mobile.auto_mrf_match_get.requestFollowUp'), type: 'outline' },
    ],
  };
}

