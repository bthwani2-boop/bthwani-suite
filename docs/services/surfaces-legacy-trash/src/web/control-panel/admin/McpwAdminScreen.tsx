'use client';

/**
 * McpwAdminScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import {
  Settings,
  Users,
  ShieldCheck,
  ScrollText,
  Cog,
  UserCheck,
} from 'lucide-react';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwAdminScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title='الإدارة'
        subtitle='إعدادات النظام والمستخدمين والصلاحيات'
        icon={<Settings size={28} color='#FFF' />}
        gradientFrom='#64748B'
        gradientTo='#475569'
        shadowColor='rgba(100, 116, 139, 0.3)'
      />

      <RestoredHubSectionIntro
        title='أقسام الإدارة'
        description='إعدادات وتحكم النظام'
        icon={<Settings size={20} color='#64748B' />}
        accentColor='#64748B'
      />

      <RestoredHubGrid>
        <RestoredHubQuickLink
          title='ترشيحات المتاجر'
          description='مراجعة طلبات انضمام المتاجر'
          href='/admin/store-nominations'
          icon={<UserCheck size={22} color='#F97316' />}
          color='#F97316'
        />
        <RestoredHubQuickLink
          title='المستخدمين'
          description='إدارة مستخدمي لوحة التحكم'
          href='/admin/users'
          icon={<Users size={22} color='#3B82F6' />}
          color='#3B82F6'
        />
        <RestoredHubQuickLink
          title='الأدوار والصلاحيات'
          description='إدارة الأدوار والصلاحيات'
          href='/admin/roles'
          icon={<ShieldCheck size={22} color='#8B5CF6' />}
          color='#8B5CF6'
        />
        <RestoredHubQuickLink
          title='سجلات التدقيق'
          description='سجل جميع العمليات والتغييرات'
          href='/admin/audit-logs'
          icon={<ScrollText size={22} color='#F59E0B' />}
          color='#F59E0B'
        />
        <RestoredHubQuickLink
          title='الإعدادات'
          description='إعدادات النظام العامة'
          href='/admin/settings'
          icon={<Cog size={22} color='#64748B' />}
          color='#64748B'
        />
      </RestoredHubGrid>
    </div>
  );
}
