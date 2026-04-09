'use client';

/**
 * McpwHrScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import {
  Users,
  UserPlus,
  Banknote,
  Briefcase,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwHrScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title='الموارد البشرية'
        subtitle='إدارة الموظفين والرواتب والتوظيف'
        icon={<Users size={28} color='#FFF' />}
        gradientFrom='#06B6D4'
        gradientTo='#0891B2'
        shadowColor='rgba(6, 182, 212, 0.3)'
      />

      <div
        style={{
          marginBottom: 20,
          padding: '14px 16px',
          borderRadius: 14,
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F59E0B12',
            flexShrink: 0,
          }}
        >
          <Sparkles size={18} color='#F59E0B' />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>
            قيد التطوير
          </div>
          <div style={{ fontSize: 13, color: '#A16207' }}>
            هذا القسم قيد التطوير وسيتم إضافة المزيد من الميزات قريباً
          </div>
        </div>
      </div>

      <RestoredHubSectionIntro
        title='أقسام الموارد البشرية'
        description='إدارة الموظفين والتوظيف'
        icon={<Users size={20} color='#06B6D4' />}
        accentColor='#06B6D4'
      />

      <RestoredHubGrid>
        <RestoredHubQuickLink
          title='الموظفين'
          description='إدارة بيانات وملفات الموظفين'
          href='/hr/employees'
          icon={<UserPlus size={22} color='#3B82F6' />}
          color='#3B82F6'
        />
        <RestoredHubQuickLink
          title='الوظائف الشاغرة'
          description='إدارة الوظائف والتوظيف'
          href='/hr/jobs'
          icon={<Briefcase size={22} color='#8B5CF6' />}
          color='#8B5CF6'
        />
        <RestoredHubQuickLink
          title='الرواتب'
          description='إدارة الرواتب والمستحقات'
          href='/hr/payroll'
          icon={<Banknote size={22} color='#22C55E' />}
          color='#22C55E'
        />
        <RestoredHubQuickLink
          title='التقارير'
          description='تقارير وتحليلات الموارد البشرية'
          href='/hr/reports'
          icon={<FileText size={22} color='#F59E0B' />}
          color='#F59E0B'
        />
      </RestoredHubGrid>
    </div>
  );
}
