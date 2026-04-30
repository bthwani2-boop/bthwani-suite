'use client';

/**
 * McpwPlatformScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import {
  Globe,
  Activity,
  Shield,
  Gauge,
  FileText,
} from 'lucide-react';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwPlatformScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title="المنصة"
        subtitle="مراقبة وأمان وأداء المنصة"
        icon={<Globe size={28} color="#FFF" />}
        gradientFrom="#06B6D4"
        gradientTo="#0891B2"
        shadowColor="rgba(6, 182, 212, 0.3)"
      />

      <RestoredHubSectionIntro
        title="أقسام المنصة"
        description="مراقبة وأمان النظام"
        icon={<Globe size={20} color="#06B6D4" />}
        accentColor="#06B6D4"
      />
      <RestoredHubGrid>
        <RestoredHubQuickLink
          title="المراقبة"
          description="مراقبة حالة النظام في الوقت الفعلي"
          href="/platform/monitoring"
          icon={<Activity size={22} color="#22C55E" />}
          color="#22C55E"
        />
        <RestoredHubQuickLink
          title="الأمان"
          description="إعدادات أمان المنصة والحماية"
          href="/platform/security"
          icon={<Shield size={22} color="#EF4444" />}
          color="#EF4444"
        />
        <RestoredHubQuickLink
          title="الأداء"
          description="مقاييس وتحليلات الأداء"
          href="/platform/performance"
          icon={<Gauge size={22} color="#3B82F6" />}
          color="#3B82F6"
        />
        <RestoredHubQuickLink
          title="السجلات"
          description="سجلات النظام والأخطاء"
          href="/platform/logs"
          icon={<FileText size={22} color="#8B5CF6" />}
          color="#8B5CF6"
        />
      </RestoredHubGrid>
    </div>
  );
}
