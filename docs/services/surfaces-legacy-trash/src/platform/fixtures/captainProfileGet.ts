/**
 * Fixture for platform captain profile get (auto_platform_captain_profile_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface CaptainProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  rating: number;
  total_trips: number;
  completed_trips: number;
  service_mode: 'DSH' | 'AMN';
  status: 'active' | 'inactive' | 'suspended';
  join_date: string;
  specialization?: string;
  vehicle_type?: string;
  license_expiry?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildPlatformCaptainProfileGetMock(t: TFunction, serviceMode: 'DSH' | 'AMN'): CaptainProfile {
  return {
    id: serviceMode === 'DSH' ? 'dsh_cap_001' : 'amn_cap_001',
    name: 'أحمد محمد',
    phone: '+966501234567',
    email: 'ahmed@example.com',
    rating: 4.8,
    total_trips: serviceMode === 'DSH' ? 1250 : 340,
    completed_trips: serviceMode === 'DSH' ? 1205 : 325,
    service_mode: serviceMode,
    status: 'active',
    join_date: '2023-06-15',
    specialization: serviceMode === 'DSH' ? t('surfaces.توصيل_سريع') : t('surfaces.تنقل_آمن'),
    vehicle_type: serviceMode === 'DSH' ? t('surfaces.دراجة_نارية') : t('surfaces.سيارة'),
    license_expiry: '2025-12-31',
  };
}
