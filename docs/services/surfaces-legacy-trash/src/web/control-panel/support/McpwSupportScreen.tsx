'use client';

/**
 * McpwSupportScreen — Modern Clean Hub Design
 * Uses McpwDesignSystem for unified, smooth, smart UX.
 */

import { useI18n } from '@bthwani/ui-kit';
import {
  Headphones,
  MessageCircle,
  Ticket,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import {
  RestoredHubGrid,
  RestoredHubHeader,
  RestoredHubQuickLink,
  RestoredHubSectionIntro,
} from '../components/RestoredHubPrimitives';

export default function McpwSupportScreen() {
  const { isRTL } = useI18n();

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <RestoredHubHeader
        title="الدعم"
        subtitle="إدارة المحادثات والتذاكر وخدمة العملاء"
        icon={<Headphones size={28} color="#FFF" />}
        gradientFrom="#10B981"
        gradientTo="#059669"
        shadowColor="rgba(16, 185, 129, 0.3)"
      />

      <RestoredHubSectionIntro
        title="أقسام الدعم"
        description="خدمة العملاء والمساعدة"
        icon={<Headphones size={20} color="#10B981" />}
        accentColor="#10B981"
      />
      <RestoredHubGrid>
        <RestoredHubQuickLink
          title="دعم DSH"
          description="محادثات دعم خدمة التوصيل"
          href="/support/dsh-chat"
          icon={<MessageCircle size={22} color="#F97316" />}
          color="#F97316"
          badge="12"
        />
        <RestoredHubQuickLink
          title="التذاكر"
          description="إدارة تذاكر الدعم الفني"
          href="/support"
          icon={<Ticket size={22} color="#3B82F6" />}
          color="#3B82F6"
        />
        <RestoredHubQuickLink
          title="المحادثات"
          description="جميع المحادثات مع العملاء"
          href="/support/dsh-chat"
          icon={<MessageCircle size={22} color="#8B5CF6" />}
          color="#8B5CF6"
        />
        <RestoredHubQuickLink
          title="قاعدة المعرفة"
          description="المقالات والأسئلة الشائعة"
          href="/support"
          icon={<BookOpen size={22} color="#22C55E" />}
          color="#22C55E"
        />
        <RestoredHubQuickLink
          title="الإحصائيات"
          description="تحليلات وإحصائيات الدعم"
          href="/support"
          icon={<BarChart3 size={22} color="#EC4899" />}
          color="#EC4899"
        />
      </RestoredHubGrid>
    </div>
  );
}
