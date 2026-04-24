import React from 'react';
import { View } from 'react-native';
import { Button, FormScreenShell, ListItem, Surface, Text, spacing } from '@bthwani/ui-kit';

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
    <FormScreenShell
      title="مركز الدعم العام"
      subtitle="مركز مساعدة موحد للتطبيق كله"
      submitLabel="تواصل الآن"
      onSubmit={onContactSupport}
      submitDisabled={!onContactSupport}
    >
      <Surface tone="brand" padding={4} gap={3}>
        <Text role="titleSm" tone="inverse">ملخص الدعم</Text>
        <View style={{ gap: spacing[3] }}>
          <ListItem title="الأسئلة الشائعة" subtitle="إجابات عامة على مستوى التطبيق" meta={`${faqCount} عنصر`} badgeLabel="عام" onPress={onOpenFaq} />
          <ListItem title="التذاكر" subtitle="متابعة الحالات العامة المفتوحة" meta={`${ticketCount} حالة`} badgeLabel="عام" onPress={onOpenTickets} />
          <ListItem title="إرسال ملاحظة" subtitle="ملاحظات أو اقتراحات عامة" meta="عام" badgeLabel="عام" onPress={onSendFeedback} />
        </View>
      </Surface>

      <Surface tone="inset" padding={4} gap={2}>
        <Text role="titleSm">مبادئ الدعم العام</Text>
        <Text role="bodySm" tone="muted">
          هذا السطح يخدم التطبيق كله. أي مساعدة أو سياسة أو طلب محلي يجب أن ينتقل إلى مساره الخاص.
        </Text>
      </Surface>

      <View style={{ gap: spacing[3] }}>
        <Button label="الأسئلة الشائعة" onPress={onOpenFaq} tone="secondary" />
        <Button label="التذاكر العامة" onPress={onOpenTickets} tone="secondary" />
        <Button label="إرسال feedback" onPress={onSendFeedback} tone="ghost" fullWidth={false} />
      </View>
    </FormScreenShell>
  );
}

export default ClientSupportSurface;