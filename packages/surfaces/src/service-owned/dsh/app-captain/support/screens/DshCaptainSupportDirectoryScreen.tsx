import React from 'react';
import {
  Box,
  ListItem,
  MobileScrollView,
  SectionHeader,
  Surface,
  Text,
} from '@bthwani/ui-kit';
import type { CaptainSupportScreenId } from './DshCaptainGeneratedSupportScreens';

export type DshCaptainSupportDirectoryScreenProps = {
  onOpenScreen?: (screenId: CaptainSupportScreenId) => void;
};

const groups: Array<{
  title: string;
  subtitle: string;
  items: Array<{ id: CaptainSupportScreenId; title: string; subtitle: string; badgeLabel: string }>;
}> = [
  {
    title: 'مسار التنفيذ',
    subtitle: 'دورة مسار الكابتن من العرض حتى الإتمام.',
    items: [
      { id: 'orders-offers-list', title: 'قائمة عروض الطلبات', subtitle: 'راجع العروض المفتوحة قبل الالتزام.', badgeLabel: 'عروض' },
      { id: 'orders-list', title: 'قائمة الطلبات', subtitle: 'تصفح صف المسار النشط.', badgeLabel: 'صف' },
      { id: 'order-accept', title: 'قبول الطلب', subtitle: 'اقبل الطلب.', badgeLabel: 'تنفيذ' },
      { id: 'order-get', title: 'عرض الطلب', subtitle: 'افتح لقطة المسار.', badgeLabel: 'قراءة' },
      { id: 'order-details', title: 'تفاصيل الطلب', subtitle: 'افحص تفاصيل الطلب.', badgeLabel: 'قراءة' },
      { id: 'order-pickup', title: 'استلام الطلب', subtitle: 'أكد الاستلام.', badgeLabel: 'تنفيذ' },
      { id: 'order-deliver', title: 'تسليم الطلب', subtitle: 'أكد التسليم.', badgeLabel: 'إغلاق' },
      { id: 'proof-upload', title: 'رفع الإثبات', subtitle: 'ارفع دليل التسليم.', badgeLabel: 'إثبات' },
      { id: 'job-reject', title: 'رفض المهمة', subtitle: 'ارفض مع ذكر السبب.', badgeLabel: 'استثناء' },
    ],
  },
  {
    title: 'دعم الكابتن',
    subtitle: 'التواصل والرصيد والملف الشخصي والأداء.',
    items: [
      { id: 'chat-read-ack', title: 'تأكيد قراءة الدردشة', subtitle: 'امسح رسائل المسار غير المقروءة.', badgeLabel: 'تواصل' },
      { id: 'chat-send', title: 'إرسال رسالة', subtitle: 'أرسل رسالة مسار.', badgeLabel: 'تواصل' },
      { id: 'cod-balance', title: 'رصيد الدفع عند الاستلام', subtitle: 'راجع تحصيل النقد.', badgeLabel: 'مالية' },
      { id: 'profile-get', title: 'ملف الكابتن', subtitle: 'اقرأ ملف الكابتن.', badgeLabel: 'ملف' },
      { id: 'tier-evaluate', title: 'تقييم الطبقة', subtitle: 'قيّم جاهزية الطبقة التالية.', badgeLabel: 'طبقة' },
      { id: 'tier-info', title: 'معلومات الطبقة', subtitle: 'اقرأ مزايا الطبقة الحالية.', badgeLabel: 'طبقة' },
    ],
  },
];

export function DshCaptainSupportDirectoryScreen({ onOpenScreen }: DshCaptainSupportDirectoryScreenProps) {
  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">دليل دعم الكابتن</Text>
        <Text role="bodyMd" tone="muted">
          دليل مركزي لباقي أسطح DSH الخاصة بالكابتن حتى يصبح كل مسار مسمّى قابلًا للوصول من خط تنفيذ واحد مملوك.
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
                meta="افتح سطح الكابتن المسمّى"
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

export default DshCaptainSupportDirectoryScreen;
