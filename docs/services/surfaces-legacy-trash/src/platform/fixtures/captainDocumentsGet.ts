/**
 * Fixture for platform captain documents get (auto_platform_captain_documents_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface Document {
  id: string;
  type: 'id' | 'license' | 'vehicle' | 'background_check' | 'insurance';
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  upload_date: string;
  expiry_date?: string;
  url?: string;
  rejection_reason?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

export function buildPlatformCaptainDocumentsGetMock(t: TFunction): Document[] {
  return [
    { id: 'doc_1', type: 'id', name: t('surfaces.الهوية_الشخصية'), status: 'approved', upload_date: '2024-01-15', expiry_date: '2030-01-15' },
    { id: 'doc_2', type: 'license', name: t('surfaces.رخصة_القيادة'), status: 'approved', upload_date: '2024-01-16', expiry_date: '2026-01-16' },
    { id: 'doc_3', type: 'vehicle', name: t('surfaces.استمارة_المركبة'), status: 'pending', upload_date: '2024-02-10' },
    { id: 'doc_4', type: 'background_check', name: t('surfaces.فحص_الخلفية'), status: 'approved', upload_date: '2024-01-20' },
    {
      id: 'doc_5',
      type: 'insurance',
      name: t('surfaces.تأمين_المركبة'),
      status: 'expired',
      upload_date: '2024-01-18',
      expiry_date: '2024-01-18',
      rejection_reason: t('surfaces.انتهت_صلاحية_التأمين'),
    },
  ];
}
