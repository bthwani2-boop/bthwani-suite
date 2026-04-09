/**
 * Fixture for MRF report get (auto_mrf_report_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export interface MrfReportDetail {
  id: string;
  type: string;
  status: string;
  title?: string;
  description?: string;
  person: {
    name: string;
    age: string;
    gender: string;
    description: string;
  };
  location: {
    lastSeen: string;
    coordinates: string;
    area: string;
  };
  timing: {
    reportedAt: string;
    lastSeen: string;
    updatedAt: string;
  };
  investigation: {
    status: string;
    assignedOfficer: string;
    priority: string;
    clues: string[];
    actions: string[];
  };
  contactInfo: {
    reporter: string;
    phone: string;
    email: string;
    relation: string;
  };
  images: string[];
}

export function buildMrfReportGetMock(t: TFunction, reportId?: string): MrfReportDetail {
  return {
    id: reportId ?? 'RPT-001',
    type: 'missing',
    status: 'active',
    person: {
      name: 'سارة أحمد',
      age: '25 عاماً',
      gender: 'أنثى',
      description: t('mrf.app-client.mobile.auto_mrf_report_get.165'),
    },
    location: {
      lastSeen: 'شارع الملك فيصل، حي العليا، الرياض',
      coordinates: '24.7136, 46.6753',
      area: t('surfaces.حي_العليا،_الرياض'),
    },
    timing: {
      reportedAt: '2024-02-08 14:30',
      lastSeen: '2024-02-08 12:00',
      updatedAt: '2024-02-10 09:15',
    },
    investigation: {
      status: 'ongoing',
      assignedOfficer: t('surfaces.الملازم_محمد_العتيبي'),
      priority: 'high',
      clues: [
        t('surfaces.شوهدت_آخر_مرة_في_محطة_القطار'),
        t('surfaces.كانت_تحمل_حقيبة_سوداء'),
        t('surfaces.متصل_الهاتف_مغلق_منذ_الاختفاء'),
      ],
      actions: [
        t('surfaces.تم_توزيع_الصور_على_جميع_المراكز_الأم'),
        t('surfaces.جاري_فحص_كاميرات_المراقبة_في_المنطقة'),
        t('surfaces.تم_التواصل_مع_أفراد_العائلة'),
      ],
    },
    contactInfo: {
      reporter: t('surfaces.أحمد_محمد_الأب'),
      phone: '+966501234567',
      email: 'ahmed@example.com',
      relation: t('surfaces.والد_الشخص_المفقود'),
    },
    images: [
      t('surfaces.صورة_الشخص_المفقود'),
      t('surfaces.صورة_آخر_مكان_شوهد_فيه'),
    ],
  };
}

