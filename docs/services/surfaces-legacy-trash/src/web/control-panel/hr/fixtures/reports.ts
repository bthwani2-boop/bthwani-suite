/**
 * HR Reports Mock Data
 * Source of truth for report fixtures in CONTROL PANEL HR screens.
 */

import { Calendar, TrendingUp, PieChart, BarChart3, LineChart, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ReportFixture {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  lastGenerated?: string;
}

export const mockReports: ReportFixture[] = [
  {
    title: 'تقرير الحضور والانصراف',
    description: 'ملخص الحضور والغياب لجميع الموظفين',
    icon: Calendar,
    color: '#3B82F6',
    lastGenerated: '2024-01-20',
  },
  {
    title: 'تقرير الأداء',
    description: 'تقييم أداء الموظفين ومؤشرات الإنتاجية',
    icon: TrendingUp,
    color: '#22C55E',
    lastGenerated: '2024-01-18',
  },
  {
    title: 'تقرير التوزيع الوظيفي',
    description: 'توزيع الموظفين حسب الأقسام والمستويات',
    icon: PieChart,
    color: '#8B5CF6',
    lastGenerated: '2024-01-15',
  },
  {
    title: 'تقرير الرواتب الشهري',
    description: 'ملخص الرواتب والمستحقات الشهرية',
    icon: BarChart3,
    color: '#F59E0B',
    lastGenerated: '2024-01-01',
  },
  {
    title: 'تقرير دوران الموظفين',
    description: 'معدل دخول وخروج الموظفين',
    icon: LineChart,
    color: '#EF4444',
    lastGenerated: '2024-01-10',
  },
  {
    title: 'تقرير التدريب',
    description: 'برامج التدريب والتطوير المهني',
    icon: Users,
    color: '#06B6D4',
    lastGenerated: '2024-01-12',
  },
];

