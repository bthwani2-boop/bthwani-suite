/**
 * HR Employees Mock Data
 * Source of truth for employee fixtures in CONTROL PANEL HR screens.
 */

export interface EmployeeFixture {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: 'active' | 'on_leave' | 'inactive';
}

export const EMPLOYEE_STATUS_CONFIG = {
  active: { bg: '#DCFCE7', text: '#16A34A', label: 'نشط' },
  on_leave: { bg: '#FEF3C7', text: '#D97706', label: 'في إجازة' },
  inactive: { bg: '#FEE2E2', text: '#DC2626', label: 'غير نشط' },
} as const;

export const EMPLOYEES_STATS = [
  { label: 'إجمالي الموظفين', value: '124', color: '#3B82F6' },
  { label: 'نشط', value: '112', color: '#22C55E' },
  { label: 'في إجازة', value: '8', color: '#F59E0B' },
  { label: 'غير نشط', value: '4', color: '#EF4444' },
] as const;

export const mockEmployees: EmployeeFixture[] = [
  {
    name: 'أحمد محمد',
    role: 'مهندس برمجيات أول',
    department: 'التطوير',
    email: 'ahmed@bthwani.com',
    phone: '+966 50 123 4567',
    location: 'الرياض',
    joinDate: '2023-01-15',
    status: 'active',
  },
  {
    name: 'سارة العلي',
    role: 'مدير المنتج',
    department: 'المنتجات',
    email: 'sara@bthwani.com',
    phone: '+966 50 234 5678',
    location: 'جدة',
    joinDate: '2022-06-20',
    status: 'active',
  },
  {
    name: 'محمد خالد',
    role: 'مصمم واجهات',
    department: 'التصميم',
    email: 'mohammed@bthwani.com',
    phone: '+966 50 345 6789',
    location: 'الرياض',
    joinDate: '2023-03-10',
    status: 'on_leave',
  },
  {
    name: 'فاطمة أحمد',
    role: 'محاسب',
    department: 'المالية',
    email: 'fatima@bthwani.com',
    phone: '+966 50 456 7890',
    location: 'الدمام',
    joinDate: '2021-09-01',
    status: 'active',
  },
];

