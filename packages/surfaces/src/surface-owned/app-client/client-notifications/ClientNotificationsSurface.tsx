import React from 'react';
import { View } from 'react-native';
import { Button, DashboardShell, ListItem, Surface, Text, spacing } from '@bthwani/ui-kit';

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
    <DashboardShell
      title="مركز الإشعارات العامة"
      subtitle="مركز واحد للتنبيهات المشتركة داخل التطبيق كله"
      hero={
        <Surface tone="brand" padding={5} gap={3}>
          <Text role="titleSm" tone="inverse">عداد التنبيهات</Text>
          <Text role="titleLg" tone="inverse">{unreadCount}</Text>
          <Text role="bodySm" tone="inverse">تنبيهات عامة لا ترتبط بمسار محدد</Text>
        </Surface>
      }
      sections={[
        {
          title: 'الوارد العام',
          subtitle: 'عناصر عامة قابلة للفتح أو المسح',
          content: (
            <View style={{ gap: spacing[3] }}>
              {items.length ? items.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  badgeLabel={item.badgeLabel ?? 'عام'}
                  onPress={item.onPress}
                />
              )) : (
                <Text role="bodySm" tone="muted">لا توجد إشعارات عامة حاليًا.</Text>
              )}
            </View>
          ),
        },
        {
          title: 'الإجراءات العامة',
          subtitle: 'تحكم مباشر دون منطق خدمة',
          content: (
            <View style={{ gap: spacing[3] }}>
              <Button label="فتح الصندوق" onPress={onOpenInbox} />
              <Button label="مسح الكل" onPress={onClearAll} tone="secondary" />
            </View>
          ),
        },
      ]}
    />
  );
}

export default ClientNotificationsSurface;