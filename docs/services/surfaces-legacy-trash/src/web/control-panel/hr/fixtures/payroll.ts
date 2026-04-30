/**
 * HR Payroll Mock Data
 * Source of truth for payroll fixtures in CONTROL PANEL HR screens.
 */

import { Banknote, Users, CheckCircle2, Clock } from 'lucide-react';

export interface PayrollPeriod {
  month: string;
  total: string;
  employees: number;
  status: 'completed' | 'pending' | 'processing';
}

export const PAYROLL_STATS = [
  { label: 'إجمالي الرواتب', value: '٥٤٠,٠٠٠ ر.س', color: '#22C55E', icon: Banknote },
  { label: 'عدد الموظفين', value: '١٢٤', color: '#3B82F6', icon: Users },
  { label: 'تمت الموافقة', value: '١١٨', color: '#22C55E', icon: CheckCircle2 },
  { label: 'قيد المراجعة', value: '٦', color: '#F59E0B', icon: Clock },
] as const;

export const mockRecentPayrolls: PayrollPeriod[] = [
  { month: 'يناير 2024', total: '٥٤٠,٠٠٠ ر.س', employees: 124, status: 'completed' },
  { month: 'ديسمبر 2023', total: '٥٣٨,٥٠٠ ر.س', employees: 122, status: 'completed' },
  { month: 'نوفمبر 2023', total: '٥٣٥,٠٠٠ ر.س', employees: 120, status: 'completed' },
  { month: 'أكتوبر 2023', total: '٥٣٠,٠٠٠ ر.س', employees: 118, status: 'completed' },
];

