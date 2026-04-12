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
      title="الإشعارات العامة"
      subtitle="مركز واحد للتنبيهات المشتركة بين الخدمات"
      hero={
        <BthSurface tone="info" padding={5} gap={3}>
          <BthText role="titleSm">عداد الإشعارات</BthText>
          <BthText role="titleLg" tone="info">{unreadCount}</BthText>
          <BthText role="bodySm" tone="muted">تنبيهات عامة لا ترتبط بخدمة بعينها</BthText>
        </BthSurface>
      }
      sections={[
        {
          title: 'صندوق الوارد',
          subtitle: 'عناصر عامة قابلة للفتح أو المسح',
          content: (
            <View style={{ gap: spacing[3] }}>
              {items.length ? items.map((item) => (
                <BthListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  badgeLabel={item.badgeLabel}
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
          subtitle: 'Handoff مباشر دون منطق خدمة',
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