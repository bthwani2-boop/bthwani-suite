import React from 'react';
import { Box, Button, ListItem, Surface, Text } from '@bthwani/ui-kit';
import { DshPartnerOrderIssuePanel } from '../parts/PartnerOrderIssuePanel';

export type PartnerSupportRouteId =
  | 'auction-status-update'
  | 'chat-read-ack'
  | 'chat-send'
  | 'doc-upload'
  | 'intake-start'
  | 'inventory-adjust'
  | 'inventory-update'
  | 'items-upsert'
  | 'order-accept'
  | 'order-get'
  | 'order-handoff'
  | 'order-issue-queue'
  | 'order-out-for-delivery'
  | 'order-prepare'
  | 'order-ready'
  | 'order-reject'
  | 'order-store-delivered'
  | 'quick-reply-config'
  | 'quick-reply-settings'
  | 'quick-reply-setup'
  | 'store-nomination'
  | 'video-upload';

type PartnerSupportDirectoryItem = {
  id: PartnerSupportRouteId;
  title: string;
  subtitle: string;
  badgeLabel: string;
};

const orderExecutionItems: readonly PartnerSupportDirectoryItem[] = [
  { id: 'order-accept', title: 'قبول الطلب', subtitle: 'بدء دورة التنفيذ من نقطة القبول الرسمية.', badgeLabel: 'تنفيذ' },
  { id: 'order-get', title: 'استلام الطلب', subtitle: 'تأكيد استلام الطلب داخل الفرع.', badgeLabel: 'تنفيذ' },
  { id: 'order-handoff', title: 'تسليم الطلب للكابتن', subtitle: 'ربط التسليم بخطوة handoff الرسمية.', badgeLabel: 'تنفيذ' },
  { id: 'order-out-for-delivery', title: 'قيد التوصيل', subtitle: 'متابعة الطلب بعد مغادرته للعميل.', badgeLabel: 'توصيل' },
  { id: 'order-prepare', title: 'تحضير الطلب', subtitle: 'إدارة مرحلة التحضير قبل الجاهزية.', badgeLabel: 'تنفيذ' },
  { id: 'order-ready', title: 'الطلب جاهز', subtitle: 'تأكيد الجاهزية قبل handoff أو التسليم.', badgeLabel: 'تنفيذ' },
  { id: 'order-store-delivered', title: 'تم التسليم من الفرع', subtitle: 'إغلاق حالة التسليم من جهة الفرع.', badgeLabel: 'إغلاق' },
] as const;

const communicationItems: readonly PartnerSupportDirectoryItem[] = [
  { id: 'auction-status-update', title: 'تحديث حالة المزاد', subtitle: 'إدارة تحديثات الحالات الخاصة بالعمليات الموسمية.', badgeLabel: 'دعم' },
  { id: 'chat-read-ack', title: 'تأكيد قراءة المحادثة', subtitle: 'مزامنة قراءة الرسائل المرتبطة بالطلب.', badgeLabel: 'محادثة' },
  { id: 'chat-send', title: 'إرسال محادثة', subtitle: 'الانتقال إلى قناة الرسائل التشغيلية.', badgeLabel: 'محادثة' },
  { id: 'quick-reply-config', title: 'إعداد الردود السريعة', subtitle: 'مراجعة قوالب الردود الأساسية.', badgeLabel: 'ردود' },
  { id: 'quick-reply-settings', title: 'إعدادات الردود السريعة', subtitle: 'ضبط التفضيلات الخاصة بالردود الجاهزة.', badgeLabel: 'ردود' },
  { id: 'quick-reply-setup', title: 'تهيئة الردود السريعة', subtitle: 'إكمال تهيئة الردود داخل المسار التشغيلي.', badgeLabel: 'ردود' },
] as const;

const branchOpsItems: readonly PartnerSupportDirectoryItem[] = [
  { id: 'inventory-adjust', title: 'تعديل المخزون', subtitle: 'فتح تعديل الكميات والتوافر من نفس الدليل.', badgeLabel: 'مخزون' },
  { id: 'inventory-update', title: 'تحديث المخزون', subtitle: 'تحديث بيانات التوافر والسعر والمخزون.', badgeLabel: 'مخزون' },
  { id: 'items-upsert', title: 'إضافة أو تحديث عنصر', subtitle: 'إدارة إدخال العناصر وتحديثها.', badgeLabel: 'مخزون' },
  { id: 'doc-upload', title: 'رفع المستندات', subtitle: 'رفع الملفات والمرفقات التشغيلية المطلوبة.', badgeLabel: 'فرع' },
  { id: 'intake-start', title: 'بدء الإدخال', subtitle: 'بدء مسار الإدخال أو الاستقبال التشغيلي.', badgeLabel: 'فرع' },
  { id: 'store-nomination', title: 'ترشيح الفرع', subtitle: 'مراجعة جاهزية الفرع لمسارات الترشح.', badgeLabel: 'فرع' },
  { id: 'video-upload', title: 'رفع الفيديو', subtitle: 'إرفاق فيديو إثبات أو مراجعة مرتبطة بالعملية.', badgeLabel: 'فرع' },
] as const;

export type PartnerSupportScreenProps = {
  onBack?: () => void;
  onOpenScreen?: (screenId: PartnerSupportRouteId) => void;
};

function SupportDirectorySection({
  title,
  items,
  onOpenScreen,
}: {
  title: string;
  items: readonly PartnerSupportDirectoryItem[];
  onOpenScreen?: (screenId: PartnerSupportRouteId) => void;
}) {
  return (
    <Surface tone="raised" padding={0} gap={0}>
      <Text role="label" tone="muted" style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        {title}
      </Text>
      {items.map((item) => (
        <ListItem
          key={item.id}
          title={item.title}
          subtitle={item.subtitle}
          badgeLabel={item.badgeLabel}
          meta="فتح المسار"
          onPress={() => onOpenScreen?.(item.id)}
        />
      ))}
    </Surface>
  );
}

export function PartnerSupportScreen({ onBack, onOpenScreen }: PartnerSupportScreenProps) {
  return (
    <Box gap={4}>
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="titleSm">دليل العمليات والدعم</Text>
        <Text role="bodySm" tone="muted">
          هذا الدليل يجمع المسارات التشغيلية الفعلية في مكان واحد بدل placeholder عام أو bridge مؤقت.
        </Text>
        {onBack ? <Button label="العودة" tone="secondary" fullWidth={false} onPress={onBack} /> : null}
      </Surface>

      <DshPartnerOrderIssuePanel onSelectFlow={(flowId) => onOpenScreen?.(flowId)} />

      <SupportDirectorySection title="تنفيذ الطلب" items={orderExecutionItems} onOpenScreen={onOpenScreen} />
      <SupportDirectorySection title="المحادثات والردود" items={communicationItems} onOpenScreen={onOpenScreen} />
      <SupportDirectorySection title="عمليات الفرع والمخزون" items={branchOpsItems} onOpenScreen={onOpenScreen} />
    </Box>
  );
}

export default PartnerSupportScreen;
