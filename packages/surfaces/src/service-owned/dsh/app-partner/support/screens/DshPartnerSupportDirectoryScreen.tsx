import React from 'react';
import {
  Box,
  Icon,
  ListItem,
  MobileScrollView,
  SectionHeader,
  Surface,
  Text,
  TopBar,
} from '@bthwani/ui-kit';
import type { PartnerSupportScreenId } from './DshPartnerGeneratedSupportScreens';

export type DshPartnerSupportDirectoryScreenProps = {
  onBack?: () => void;
  onOpenScreen?: (screenId: PartnerSupportScreenId) => void;
};

const groups: Array<{
  title: string;
  subtitle: string;
  items: Array<{ id: PartnerSupportScreenId; title: string; subtitle: string; badgeLabel: string }>;
}> = [
  {
    title: 'التهيئة والامتثال',
    subtitle: 'مهام الإدخال والامتثال غير الموجودة داخل مركز الحساب الأساسي.',
    items: [
      { id: 'auction-status-update', title: 'Auction status update', subtitle: 'Control auction participation.', badgeLabel: 'Update' },
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
      { id: 'chat-read-ack', title: 'Chat read acknowledgement', subtitle: 'Clear unread branch chat.', badgeLabel: 'Comms' },
      { id: 'chat-send', title: 'Chat send', subtitle: 'Send an operational message.', badgeLabel: 'Comms' },
      { id: 'quick-reply-config', title: 'Quick reply config', subtitle: 'Review quick-reply presets.', badgeLabel: 'Comms' },
      { id: 'quick-reply-settings', title: 'Quick reply settings', subtitle: 'Adjust quick-reply policy.', badgeLabel: 'Comms' },
      { id: 'quick-reply-setup', title: 'Quick reply setup', subtitle: 'Create a new preset.', badgeLabel: 'Comms' },
    ],
  },
  {
    title: 'المحتوى التسويقي',
    subtitle: 'المحتوى الذي يحتاج مراجعة أو مرورًا منفصلًا قبل النشر.',
    items: [
      { id: 'video-upload', title: 'رفع الفيديو التسويقي', subtitle: 'أرسل فيديو قصيرًا ليغذي مراجعة التسويق.', badgeLabel: 'Content' },
    ],
  },
];

export function DshPartnerSupportDirectoryScreen({ onBack, onOpenScreen }: DshPartnerSupportDirectoryScreenProps) {
  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
      <TopBar
        variant="secondary"
        title="مداخل الحساب للشريك"
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


