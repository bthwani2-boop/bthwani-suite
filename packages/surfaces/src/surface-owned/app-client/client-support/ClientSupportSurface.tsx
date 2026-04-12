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
      title="الدعم العام"
      subtitle="مركز مساعدة موحد للتطبيق كله"
      submitLabel="تواصل الآن"
      onSubmit={onContactSupport}
      submitDisabled={!onContactSupport}
    >
      <BthSurface tone="raised" padding={4} gap={3}>
        <BthText role="titleSm">ملخص الدعم</BthText>
        <View style={{ gap: spacing[3] }}>
          <BthListItem title="الأسئلة الشائعة" subtitle="إجابات عامة على مستوى التطبيق" meta={`${faqCount} عنصر`} onPress={onOpenFaq} />
          <BthListItem title="التذاكر" subtitle="متابعة الحالات العامة المفتوحة" meta={`${ticketCount} حالة`} onPress={onOpenTickets} />
          <BthListItem title="إرسال ملاحظة" subtitle="Feedback أو اقتراحات عامة" meta="عام" onPress={onSendFeedback} />
        </View>
      </BthSurface>

      <BthSurface tone="inset" padding={4} gap={2}>
        <BthText role="titleSm">مبادئ الدعم هنا</BthText>
        <BthText role="bodySm" tone="muted">
          هذا السطح يخدم التطبيق كله. أي مساعدة أو سياسة أو ticket خاص بخدمة بعينها يجب أن ينتقل إلى service-owned.
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