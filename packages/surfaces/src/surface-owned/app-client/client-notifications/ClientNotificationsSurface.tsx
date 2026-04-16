import React from 'react';
import { View } from 'react-native';
import { BthButton, BthDashboardShell, BthListItem, BthSurface, BthText, spacing } from '@bthwani/ui-kit';

export type ClientNotificationItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel?: string;
  onPress?: () => void;
};

export type ClientNotificationsSurfaceProps = {
  unreadCount?: number;
  items?: ClientNotificationItem[];
  onClearAll?: () => void;
  onOpenInbox?: () => void;
};

export function ClientNotificationsSurface({
  unreadCount = 0,
  items = [],
  onClearAll,
  onOpenInbox,
}: ClientNotificationsSurfaceProps) {
  return (
    <BthDashboardShell
      title="مركز الإشعارات العامة"
      subtitle="مركز واحد للتنبيهات المشتركة داخل التطبيق كله"
      hero={
        <BthSurface tone="brand" padding={5} gap={3}>
          <BthText role="titleSm" tone="inverse">عداد التنبيهات</BthText>
          <BthText role="titleLg" tone="inverse">{unreadCount}</BthText>
          <BthText role="bodySm" tone="inverse">تنبيهات عامة لا ترتبط بمسار محدد</BthText>
        </BthSurface>
      }
      sections={[
        {
          title: 'الوارد العام',
          subtitle: 'عناصر عامة قابلة للفتح أو المسح',
          content: (
            <View style={{ gap: spacing[3] }}>
              {items.length ? items.map((item) => (
                <BthListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  badgeLabel={item.badgeLabel ?? 'عام'}
                  onPress={item.onPress}
                />
              )) : (
                <BthText role="bodySm" tone="muted">لا توجد إشعارات عامة حاليًا.</BthText>
              )}
            </View>
          ),
        },
        {
          title: 'الإجراءات العامة',
          subtitle: 'تحكم مباشر دون منطق خدمة',
          content: (
            <View style={{ gap: spacing[3] }}>
              <BthButton label="فتح الصندوق" onPress={onOpenInbox} />
              <BthButton label="مسح الكل" onPress={onClearAll} tone="secondary" />
            </View>
          ),
        },
      ]}
    />
  );
}

export default ClientNotificationsSurface;