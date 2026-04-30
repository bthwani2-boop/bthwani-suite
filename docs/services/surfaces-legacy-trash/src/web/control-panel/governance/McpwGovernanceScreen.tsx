'use client';

/**
 * McpwGovernanceScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import {
  Shield,
  FileText,
  Flag,
  Settings,
  Lock,
  ScrollText,
} from 'lucide-react';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwGovernanceScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title="الحوكمة"
        subtitle="إدارة السياسات والأمان والتدقيق"
        icon={<Shield size={28} color="#FFF" />}
        gradientFrom="#EF4444"
        gradientTo="#DC2626"
        shadowColor="rgba(239, 68, 68, 0.3)"
      />

      <RestoredHubSectionIntro
        title="أقسام الحوكمة"
        description="إدارة الأمان والسياسات"
        icon={<Shield size={20} color="#F97316" />}
        accentColor="#F97316"
      />
      <RestoredHubGrid>
        <RestoredHubQuickLink
          title="السياسات"
          description="إدارة سياسات النظام والقواعد"
          href="/governance/policies"
          icon={<FileText size={22} color="#3B82F6" />}
          color="#3B82F6"
        />
        <RestoredHubQuickLink
          title="الميزات"
          description="تفعيل وإيقاف الميزات"
          href="/governance/feature-flags"
          icon={<Flag size={22} color="#22C55E" />}
          color="#22C55E"
        />
        <RestoredHubQuickLink
          title="المتغيرات"
          description="إدارة متغيرات وقت التشغيل"
          href="/governance/runtime-vars"
          icon={<Settings size={22} color="#8B5CF6" />}
          color="#8B5CF6"
        />
        <RestoredHubQuickLink
          title="الحراس"
          description="قواعد الحماية والأمان"
          href="/governance/guards"
          icon={<Lock size={22} color="#EF4444" />}
          color="#EF4444"
        />
        <RestoredHubQuickLink
          title="سجلات التدقيق"
          description="تتبع جميع العمليات والتغييرات"
          href="/governance/audit-logs"
          icon={<ScrollText size={22} color="#F59E0B" />}
          color="#F59E0B"
        />
      </RestoredHubGrid>
    </div>
  );
}
