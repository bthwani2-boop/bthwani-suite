import React from 'react';
import { View } from 'react-native';
import { BthButton, BthFormScreenShell, BthListItem, BthSurface, BthText, spacing } from '@bthwani/ui-kit';

export type ClientSupportSurfaceProps = {
  faqCount?: number;
  ticketCount?: number;
  onOpenFaq?: () => void;
  onOpenTickets?: () => void;
  onContactSupport?: () => void;
  onSendFeedback?: () => void;
};

export function ClientSupportSurface({
  faqCount = 0,
  ticketCount = 0,
  onOpenFaq,
  onOpenTickets,
  onContactSupport,
  onSendFeedback,
}: ClientSupportSurfaceProps) {
  return (
    <BthFormScreenShell
      title="مركز الدعم العام"
      subtitle="مركز مساعدة موحد للتطبيق كله"
      submitLabel="تواصل الآن"
      onSubmit={onContactSupport}
      submitDisabled={!onContactSupport}
    >
      <BthSurface tone="brand" padding={4} gap={3}>
        <BthText role="titleSm" tone="inverse">ملخص الدعم</BthText>
        <View style={{ gap: spacing[3] }}>
          <BthListItem title="الأسئلة الشائعة" subtitle="إجابات عامة على مستوى التطبيق" meta={`${faqCount} عنصر`} badgeLabel="عام" onPress={onOpenFaq} />
          <BthListItem title="التذاكر" subtitle="متابعة الحالات العامة المفتوحة" meta={`${ticketCount} حالة`} badgeLabel="عام" onPress={onOpenTickets} />
          <BthListItem title="إرسال ملاحظة" subtitle="ملاحظات أو اقتراحات عامة" meta="عام" badgeLabel="عام" onPress={onSendFeedback} />
        </View>
      </BthSurface>

      <BthSurface tone="inset" padding={4} gap={2}>
        <BthText role="titleSm">مبادئ الدعم العام</BthText>
        <BthText role="bodySm" tone="muted">
          هذا السطح يخدم التطبيق كله. أي مساعدة أو سياسة أو طلب محلي يجب أن ينتقل إلى مساره الخاص.
        </BthText>
      </BthSurface>

      <View style={{ gap: spacing[3] }}>
        <BthButton label="الأسئلة الشائعة" onPress={onOpenFaq} tone="secondary" />
        <BthButton label="التذاكر العامة" onPress={onOpenTickets} tone="secondary" />
        <BthButton label="إرسال feedback" onPress={onSendFeedback} tone="ghost" fullWidth={false} />
      </View>
    </BthFormScreenShell>
  );
}

export default ClientSupportSurface;