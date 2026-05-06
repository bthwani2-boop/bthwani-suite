import React from 'react';
import { Box, Icon, ListItem, MobileScrollView, SectionHeader, Surface, TopBar } from '@bthwani/ui-kit';
import type { DshPartnerOperationalFlowId } from '../../shared/dshPartnerOperationalFlowIds';

export type DshPartnerOperationsDirectoryScreenProps = {
  onBack?: () => void;
  onOpenScreen?: (screenId: DshPartnerOperationalFlowId) => void;
};

const groups: Array<{
  title: string;
  subtitle: string;
  items: Array<{ id: DshPartnerOperationalFlowId; title: string; subtitle: string; badgeLabel: string }>;
}> = [
  {
    title: 'التهيئة والامتثال',
    subtitle: 'مهام الإدخال والامتثال غير الموجودة داخل مركز الحساب الأساسي.',
    items: [
      { id: 'store-nomination', title: 'ترشيح متجر', subtitle: 'رشح فرعًا جديدًا.', badgeLabel: 'Onboarding' },
      { id: 'doc-upload', title: 'رفع المستندات', subtitle: 'حمّل ملفات الامتثال الخاصة بالفرع.', badgeLabel: 'Compliance' },
      { id: 'intake-start', title: 'بدء الاستقبال', subtitle: 'ابدأ مسار إدخال الفرع.', badgeLabel: 'Onboarding' },
    ],
  },
  {
    title: 'الكتالوج والرسائل',
    subtitle: 'أدوات المخزون، المنتجات، والتواصل التشغيلي.',
    items: [
      { id: 'inventory-adjust', title: 'تعديل مخزون سريع', subtitle: 'صحّح الكمية بسرعة.', badgeLabel: 'Catalog' },
      { id: 'inventory-update', title: 'تحديث مخزون جماعي', subtitle: 'انشر تحديثات أوسع للمخزون.', badgeLabel: 'Catalog' },
      { id: 'items-upsert', title: 'إضافة أو تحديث منتج', subtitle: 'ابدأ بالبحث في الكتالوج المركزي.', badgeLabel: 'Catalog' },
      { id: 'order-chat-read-ack', title: 'إقرار قراءة المحادثة', subtitle: 'أغلق الرسائل غير المقروءة داخل الطلب فقط.', badgeLabel: 'Order chat' },
      { id: 'order-chat-send', title: 'إرسال رسالة للطلب', subtitle: 'أرسل رسالة تشغيلية مرتبطة بطلب نشط.', badgeLabel: 'Order chat' },
      { id: 'order-quick-reply-config', title: 'تهيئة الردود السريعة', subtitle: 'راجع قوالب الرد داخل دورة الطلب.', badgeLabel: 'Order chat' },
      { id: 'order-quick-reply-settings', title: 'سياسات الردود السريعة', subtitle: 'اضبط سياسات الردود الخاصة بالطلب.', badgeLabel: 'Order chat' },
      { id: 'order-quick-reply-setup', title: 'إعداد رد سريع جديد', subtitle: 'أنشئ ردًا سريعًا لسياق الطلب.', badgeLabel: 'Order chat' },
    ],
  },
  {
    title: 'الفيديوهات',
    subtitle: 'فيديوهات الشريك التي تحتاج مرورًا تشغيليًا واضحًا قبل أي خطوة لاحقة.',
    items: [
      { id: 'video-upload', title: 'رفع فيديو الشريك', subtitle: 'أرسل فيديو قصيرًا من المسار المخصص للفيديو.', badgeLabel: 'Video' },
    ],
  },
];

export function DshPartnerOperationsDirectoryScreen({ onBack, onOpenScreen }: DshPartnerOperationsDirectoryScreenProps) {
  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
      <TopBar
        variant="secondary"
        title="مداخل عمليات الشريك"
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={onBack ? {
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBack,
        } : undefined}
      />

      {groups.map((group) => (
        <Surface key={group.title} tone="raised" gap={3}>
          <SectionHeader title={group.title} subtitle={group.subtitle} />
          <Box gap={2}>
            {group.items.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                meta="افتح المسار التشغيلي المحدد"
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

export default DshPartnerOperationsDirectoryScreen;
