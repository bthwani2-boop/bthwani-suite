import React from 'react';
import {
  Box,
  ListItem,
  MobileScrollView,
  SectionHeader,
  Surface,
  Text,
} from '@bthwani/ui-kit';
import type { PartnerSupportScreenId } from './DshPartnerGeneratedSupportScreens';

export type DshPartnerSupportDirectoryScreenProps = {
  onOpenScreen?: (screenId: PartnerSupportScreenId) => void;
};

const groups: Array<{
  title: string;
  subtitle: string;
  items: Array<{ id: PartnerSupportScreenId; title: string; subtitle: string; badgeLabel: string }>;
}> = [
  {
    title: 'ملف المتجر والعمليات',
    subtitle: 'حالة المتجر والملف والظهور والطاقم تحت حساب واحد.',
    items: [
      { id: 'profile-get', title: 'ملف المتجر', subtitle: 'راجع ملف الفرع الحالي.', badgeLabel: 'Read' },
      { id: 'store-update', title: 'تعديل الملف', subtitle: 'أدخل تحديثات بيانات الفرع.', badgeLabel: 'Update' },
      { id: 'store-status-update', title: 'حالة المتجر', subtitle: 'افتح أو أغلق الفرع.', badgeLabel: 'Update' },
      { id: 'listing-status-update', title: 'ظهور المتجر', subtitle: 'تحكم في الظهور داخل القائمة.', badgeLabel: 'Update' },
      { id: 'store-service-modes-update', title: 'أوضاع الخدمة', subtitle: 'انشر أوضاع التوصيل والاستلام.', badgeLabel: 'Update' },
      { id: 'auction-status-update', title: 'Auction status update', subtitle: 'Control auction participation.', badgeLabel: 'Update' },
      { id: 'store-nomination', title: 'ترشيح متجر', subtitle: 'رشح فرعًا جديدًا.', badgeLabel: 'Onboarding' },
      { id: 'identity-submit', title: 'الهوية والاعتماد', subtitle: 'أرسل مستندات الهوية.', badgeLabel: 'Compliance' },
      { id: 'doc-upload', title: 'رفع المستندات', subtitle: 'حمّل ملفات الامتثال الخاصة بالفرع.', badgeLabel: 'Compliance' },
      { id: 'intake-start', title: 'بدء الاستقبال', subtitle: 'ابدأ مسار إدخال الفرع.', badgeLabel: 'Onboarding' },
      { id: 'manager-invite', title: 'دعوة مدير', subtitle: 'أضف مدير فرع بصلاحيات محدودة.', badgeLabel: 'Access' },
      { id: 'team-management', title: 'إدارة الطاقم', subtitle: 'أضف الموظفين وحدد دور موصل.', badgeLabel: 'Access' },
    ],
  },
  {
    title: 'الكتالوج والرسائل',
    subtitle: 'أدوات المخزون، المنتجات، والتواصل التشغيلي.',
    items: [
      { id: 'inventory-adjust', title: 'تعديل مخزون سريع', subtitle: 'صحّح الكمية بسرعة.', badgeLabel: 'Catalog' },
      { id: 'inventory-update', title: 'تحديث مخزون جماعي', subtitle: 'انشر تحديثات أوسع للمخزون.', badgeLabel: 'Catalog' },
      { id: 'items-upsert', title: 'إضافة أو تحديث منتج', subtitle: 'ابدأ بالبحث في الكتالوج المركزي.', badgeLabel: 'Catalog' },
      { id: 'chat-read-ack', title: 'Chat read acknowledgement', subtitle: 'Clear unread branch chat.', badgeLabel: 'Comms' },
      { id: 'chat-send', title: 'Chat send', subtitle: 'Send an operational message.', badgeLabel: 'Comms' },
      { id: 'quick-reply-config', title: 'Quick reply config', subtitle: 'Review quick-reply presets.', badgeLabel: 'Comms' },
      { id: 'quick-reply-settings', title: 'Quick reply settings', subtitle: 'Adjust quick-reply policy.', badgeLabel: 'Comms' },
      { id: 'quick-reply-setup', title: 'Quick reply setup', subtitle: 'Create a new preset.', badgeLabel: 'Comms' },
    ],
  },
  {
    title: 'النمو والتسويق والتحليلات',
    subtitle: 'العروض والاشتراكات والخصومات ومؤشرات الطلب تحت نفس المسار.',
    items: [
      { id: 'audience-insights', title: 'تحليلات الجمهور والطلب', subtitle: 'راجع الطلب والعروض قبل تعديل الخصومات.', badgeLabel: 'Insights' },
      { id: 'staff-analytics', title: 'تحليلات التشغيل', subtitle: 'راقب ضغط الفريق والسرعة قبل أن تتراجع الخدمة.', badgeLabel: 'Insights' },
      { id: 'commission-by-mode', title: 'العمولة حسب الوضع', subtitle: 'قارن أثر الوضع والخصم والاشتراك.', badgeLabel: 'Commercial' },
      { id: 'subscription', title: 'بثواني برو', subtitle: 'راجع الخطة الحالية ومسار الترقية.', badgeLabel: 'اشتراك' },
      { id: 'video-upload', title: 'رفع الفيديو التسويقي', subtitle: 'أرسل فيديو قصيرًا ليغذي مراجعة التسويق.', badgeLabel: 'Content' },
    ],
  },
];

export function DshPartnerSupportDirectoryScreen({ onOpenScreen }: DshPartnerSupportDirectoryScreenProps) {
  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">مداخل الحساب للشريك</Text>
        <Text role="bodyMd" tone="muted">
          تم تجميع المجالات غير الخاصة بالطلبات داخل الحساب في دليل واحد واضح لتقليل التشويش على مركز الطلبات.
        </Text>
      </Box>

      {groups.map((group) => (
        <Surface key={group.title} tone="raised" gap={3}>
          <SectionHeader title={group.title} subtitle={group.subtitle} />
          <Box gap={2}>
            {group.items.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                meta="Open the named support surface"
                badgeLabel={item.badgeLabel}
                onPress={() => onOpenScreen?.(item.id)}
              />
            ))}
          </Box>
        </Surface>
      ))}
    </MobileScrollView>
  );
}

export default DshPartnerSupportDirectoryScreen;