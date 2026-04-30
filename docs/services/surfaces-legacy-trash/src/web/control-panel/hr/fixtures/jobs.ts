/**
 * HR Jobs Mock Data
 * Source of truth for job fixtures in CONTROL PANEL HR screens.
 */

export interface JobFixture {
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract';
  applicants: number;
  postedDate: string;
  status: 'open' | 'closed' | 'draft';
}

export const JOB_TYPE_LABELS = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  contract: 'عقد',
} as const;

export const JOB_STATUS_CONFIG = {
  open: { bg: '#DCFCE7', text: '#16A34A', label: 'مفتوح' },
  closed: { bg: '#FEE2E2', text: '#DC2626', label: 'مغلق' },
  draft: { bg: '#F3F4F6', text: '#6B7280', label: 'مسودة' },
} as const;

export const JOBS_STATS = [
  { label: 'إجمالي الوظائف', value: '12', color: '#3B82F6' },
  { label: 'مفتوحة', value: '8', color: '#22C55E' },
  { label: 'المتقدمين', value: '156', color: '#8B5CF6' },
  { label: 'مسودات', value: '2', color: '#9CA3AF' },
] as const;

export const mockJobs: JobFixture[] = [
  {
    title: 'مهندس برمجيات أول',
    department: 'التطوير',
    location: 'الرياض',
    type: 'full_time',
    applicants: 24,
    postedDate: '2024-01-15',
    status: 'open',
  },
  {
    title: 'مصمم واجهات مستخدم',
    department: 'التصميم',
    location: 'جدة',
    type: 'full_time',
    applicants: 18,
    postedDate: '2024-01-10',
    status: 'open',
  },
  {
    title: 'محاسب',
    department: 'المالية',
    location: 'الدمام',
    type: 'full_time',
    applicants: 32,
    postedDate: '2024-01-05',
    status: 'closed',
  },
  {
    title: 'مدير مشروع',
    department: 'العمليات',
    location: 'الرياض',
    type: 'contract',
    applicants: 0,
    postedDate: '2024-01-20',
    status: 'draft',
  },
];

