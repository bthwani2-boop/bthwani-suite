/**
 * Marketing Campaigns Mock Data
 * Source of truth for campaign fixtures in CONTROL PANEL Marketing screens.
 */

export interface CampaignFixture {
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  budget: string;
  spent: string;
  reach: number;
  conversions: number;
  status: 'active' | 'paused' | 'scheduled' | 'completed';
}

export const CAMPAIGN_STATUS_CONFIG = {
  active: { bg: '#DCFCE7', text: '#16A34A', label: 'نشطة' },
  paused: { bg: '#FEF3C7', text: '#D97706', label: 'متوقفة' },
  scheduled: { bg: '#DBEAFE', text: '#2563EB', label: 'مجدولة' },
  completed: { bg: '#F3F4F6', text: '#6B7280', label: 'مكتملة' },
} as const;

export const CAMPAIGNS_STATS = [
  { label: 'إجمالي الحملات', value: '12', color: '#F97316' },
  { label: 'نشطة', value: '5', color: '#22C55E' },
  { label: 'إجمالي الإنفاق', value: '٢٥٠ ألف', color: '#3B82F6' },
  { label: 'التحويلات', value: '١٢,٤٣٠', color: '#8B5CF6' },
] as const;

export const mockCampaigns: CampaignFixture[] = [
  {
    name: 'حملة رمضان 2024',
    type: 'ترويج موسمي',
    startDate: '2024-03-10',
    endDate: '2024-04-09',
    budget: '50,000 ر.س',
    spent: '32,500 ر.س',
    reach: 125000,
    conversions: 3240,
    status: 'active',
  },
  {
    name: 'خصم المستخدم الجديد',
    type: 'اكتساب عملاء',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: '100,000 ر.س',
    spent: '45,000 ر.س',
    reach: 89000,
    conversions: 5600,
    status: 'active',
  },
  {
    name: 'حملة الصيف',
    type: 'توعية العلامة',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    budget: '75,000 ر.س',
    spent: '0 ر.س',
    reach: 0,
    conversions: 0,
    status: 'scheduled',
  },
  {
    name: 'برنامج الإحالة',
    type: 'تسويق الإحالة',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    budget: '25,000 ر.س',
    spent: '18,750 ر.س',
    reach: 45000,
    conversions: 1890,
    status: 'paused',
  },
];

