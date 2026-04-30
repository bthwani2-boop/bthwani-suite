'use client';

/**
 * McpwMarketingScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import {
  Megaphone,
  ImagePlus,
  MessageSquare,
  Gift,
  Film,
  Heart,
  Crown,
  Sparkles,
  BarChart3,
  Target,
  CheckCircle,
  Library,
  TrendingUp,
  Shield,
} from 'lucide-react';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwMarketingScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title='التسويق'
        subtitle='إدارة الحملات والعروض والمحتوى التسويقي'
        icon={<Megaphone size={28} color='#FFF' />}
        gradientFrom='#F97316'
        gradientTo='#EA580C'
        shadowColor='rgba(249, 115, 22, 0.3)'
      />

      <RestoredHubSectionIntro
        title='أقسام التسويق'
        description='الحملات والعروض والشورتات والولاء'
        icon={<ImagePlus size={20} color='#3B82F6' />}
        accentColor='#3B82F6'
      />

      <RestoredHubGrid>
        <RestoredHubQuickLink
          title='البنرات'
          description='إدارة بنرات الصفحة الرئيسية وعرضها في التطبيق'
          href='/marketing/banners'
          icon={<ImagePlus size={22} color='#3B82F6' />}
          color='#3B82F6'
          badge='2'
        />
        <RestoredHubQuickLink
          title='الشريط الإخباري'
          description='رسائل الحالة والتنبيهات في الشريط العلوي'
          href='/marketing/ticker'
          icon={<MessageSquare size={22} color='#8B5CF6' />}
          color='#8B5CF6'
        />
        <RestoredHubQuickLink
          title='صندوق العروض'
          description='الإعلانات الترويجية في صف الفئات'
          href='/marketing/promobox'
          icon={<Gift size={22} color='#EC4899' />}
          color='#EC4899'
        />
        <RestoredHubQuickLink
          title='مكتبة الشورتات'
          description='جميع الفيديوهات القصيرة المتاحة'
          href='/marketing/shorts/library'
          icon={<Library size={22} color='#F59E0B' />}
          color='#F59E0B'
        />
        <RestoredHubQuickLink
          title='الحملات'
          description='حملات الشورتات النشطة والمجدولة'
          href='/marketing/shorts/campaigns'
          icon={<Target size={22} color='#EF4444' />}
          color='#EF4444'
        />
        <RestoredHubQuickLink
          title='المواضع'
          description='أماكن عرض الشورتات في التطبيق'
          href='/marketing/shorts/placements'
          icon={<Sparkles size={22} color='#06B6D4' />}
          color='#06B6D4'
        />
        <RestoredHubQuickLink
          title='الموافقات'
          description='مراجعة واعتماد الشورتات الجديدة'
          href='/marketing/shorts/approvals'
          icon={<CheckCircle size={22} color='#22C55E' />}
          color='#22C55E'
        />
        <RestoredHubQuickLink
          title='التحليلات'
          description='إحصائيات وأداء الشورتات'
          href='/marketing/shorts/analytics'
          icon={<BarChart3 size={22} color='#6366F1' />}
          color='#6366F1'
        />
        <RestoredHubQuickLink
          title='الاشتراكات'
          description='إدارة الفئات والباقات المميزة'
          href='/marketing/subscriptions'
          icon={<Crown size={22} color='#F59E0B' />}
          color='#F59E0B'
        />
        <RestoredHubQuickLink
          title='برامج الولاء'
          description='إنشاء وإدارة برامج المكافآت'
          href='/marketing/loyalty/programs'
          icon={<Heart size={22} color='#EF4444' />}
          color='#EF4444'
        />
        <RestoredHubQuickLink
          title='محاكاة الولاء'
          description='اختبار سيناريوهات النقاط والمكافآت'
          href='/marketing/loyalty/simulate'
          icon={<Sparkles size={22} color='#8B5CF6' />}
          color='#8B5CF6'
        />
        <RestoredHubQuickLink
          title='رؤى الولاء'
          description='تحليلات وأداء برامج الولاء'
          href='/marketing/loyalty/insights'
          icon={<TrendingUp size={22} color='#3B82F6' />}
          color='#3B82F6'
        />
        <RestoredHubQuickLink
          title='حدود الحماية'
          description='قواعد وحدود استخدام المكافآت'
          href='/marketing/loyalty/guardrails'
          icon={<Shield size={22} color='#64748B' />}
          color='#64748B'
        />
      </RestoredHubGrid>
    </div>
  );
}
