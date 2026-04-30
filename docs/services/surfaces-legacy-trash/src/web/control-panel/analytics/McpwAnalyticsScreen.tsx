'use client';

/**
 * McpwAnalyticsScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import {
  BarChart3,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users,
  Gauge,
  FileBarChart,
} from 'lucide-react';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwAnalyticsScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title="التحليلات"
        subtitle="تقارير وإحصائيات شاملة عن النظام"
        icon={<BarChart3 size={28} color="#FFF" />}
        gradientFrom="#EC4899"
        gradientTo="#DB2777"
        shadowColor="rgba(236, 72, 153, 0.3)"
      />

      <RestoredHubSectionIntro
        title="أقسام التحليلات"
        description="بوابة سريعة للتقارير التشغيلية والمالية وتحليلات النمو"
        icon={<BarChart3 size={20} color="#EC4899" />}
        accentColor="#EC4899"
      />
      <RestoredHubGrid>
        <RestoredHubQuickLink
          title="طلبات DSH"
          description="تقارير الطلبات والكباتن والشركاء"
          href="/analytics/dsh-orders"
          icon={<ShoppingCart size={22} color="#F97316" />}
          color="#F97316"
          badge="جديد"
        />
        <RestoredHubQuickLink
          title="تحليلات العمليات"
          description="إحصائيات العمليات والأداء"
          href="/analytics/operations"
          icon={<TrendingUp size={22} color="#3B82F6" />}
          color="#3B82F6"
        />
        <RestoredHubQuickLink
          title="التحليلات المالية"
          description="تقارير الإيرادات والمصروفات"
          href="/analytics/finance"
          icon={<DollarSign size={22} color="#22C55E" />}
          color="#22C55E"
        />
        <RestoredHubQuickLink
          title="تحليلات المستخدمين"
          description="إحصائيات العملاء والنمو"
          href="/analytics/users"
          icon={<Users size={22} color="#8B5CF6" />}
          color="#8B5CF6"
        />
        <RestoredHubQuickLink
          title="تحليلات الأداء"
          description="مقاييس الأداء والسرعة"
          href="/analytics/performance"
          icon={<Gauge size={22} color="#EF4444" />}
          color="#EF4444"
        />
        <RestoredHubQuickLink
          title="تقارير مخصصة"
          description="إنشاء تقارير حسب الطلب"
          href="/analytics/custom"
          icon={<FileBarChart size={22} color="#F59E0B" />}
          color="#F59E0B"
        />
      </RestoredHubGrid>
    </div>
  );
}
