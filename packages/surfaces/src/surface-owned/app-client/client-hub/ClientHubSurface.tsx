import React from 'react';
import { View } from 'react-native';
import { BthDashboardShell, BthListItem, BthSurface, BthText, spacing } from '@bthwani/ui-kit';

export type ClientHubSurfaceProps = {
  headline?: string;
  summary?: string;
  quickActions?: Array<{ title: string; subtitle: string; onPress?: () => void }>;
  highlights?: Array<{ label: string; value: string }>;
};

export function ClientHubSurface({
  headline = 'الصفحة الرئيسية العامة',
  summary = 'تجميع عام يضم الدخول السريع والعناصر العابرة لكل الخدمات',
  quickActions = [],
  highlights = [
    { label: 'الحالة', value: 'جاهز' },
    { label: 'اللغة', value: 'العربية' },
    { label: 'الوضع', value: 'عام' },
  ],
}: ClientHubSurfaceProps) {
  return (
    <BthDashboardShell
      title={headline}
      subtitle={summary}
      hero={
        <BthSurface tone="raised" padding={5} gap={3}>
          <BthText role="titleSm">ملخص عام</BthText>
          <View style={{ gap: spacing[2] }}>
            {highlights.map((item) => (
              <BthListItem key={item.label} title={item.label} meta={item.value} />
            ))}
          </View>
        </BthSurface>
      }
      sections={[
        {
          title: 'الاختصارات العامة',
          subtitle: 'مؤشرات أو انتقالات لا تملك بيانات خدمة',
          content: (
            <View style={{ gap: spacing[3] }}>
              {quickActions.length ? quickActions.map((action) => (
                <BthListItem key={action.title} title={action.title} subtitle={action.subtitle} onPress={action.onPress} />
              )) : (
                <BthText role="bodySm" tone="muted">لا توجد اختصارات مضافة بعد.</BthText>
              )}
            </View>
          ),
        },
      ]}
    />
  );
}

export default ClientHubSurface;