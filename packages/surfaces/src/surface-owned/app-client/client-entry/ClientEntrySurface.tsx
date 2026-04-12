import React from 'react';
import { View } from 'react-native';
import { BthButton, BthDashboardShell, BthKeyValueList, BthSurface, BthText, spacing } from '@bthwani/ui-kit';

export type ClientEntrySurfaceProps = {
  appName?: string;
  userLabel?: string;
  primaryServiceLabel?: string;
  secondaryServiceLabel?: string;
  onEnterApp?: () => void;
  onOpenAccount?: () => void;
  onOpenNotifications?: () => void;
  onOpenSupport?: () => void;
};

export function ClientEntrySurface({
  appName = 'بوابة التطبيق',
  userLabel = 'المستخدم العام',
  primaryServiceLabel = 'الخدمة الأولى',
  secondaryServiceLabel = 'الخدمة الثانية',
  onEnterApp,
  onOpenAccount,
  onOpenNotifications,
  onOpenSupport,
}: ClientEntrySurfaceProps) {
  return (
    <BthDashboardShell
      title={appName}
      subtitle="نقطة دخول عامة للحساب والتجربة المشتركة بين الخدمات"
      hero={
        <BthSurface tone="brand" padding={5} gap={3}>
          <BthText role="titleSm" tone="inverse">مرحبًا {userLabel}</BthText>
          <BthText role="bodyMd" tone="inverse">
            هذا السطح يجمع الدخول العام ويوجهك إلى الحساب أو الإشعارات أو الدعم دون أي خصوصية خدمية.
          </BthText>
          <View style={{ gap: spacing[3] }}>
            <BthKeyValueList
              items={[
                { label: 'المسار الأول', value: primaryServiceLabel },
                { label: 'المسار الثاني', value: secondaryServiceLabel },
              ]}
              dividers={false}
            />
          </View>
        </BthSurface>
      }
      sections={[
        {
          title: 'الاختصارات العامة',
          subtitle: 'تنقل إلى أقسام عامة لا تعتمد على خدمة بعينها',
          content: (
            <View style={{ gap: spacing[3] }}>
              <BthButton label="الدخول إلى التطبيق" onPress={onEnterApp} />
              <BthButton label="الحساب العام" onPress={onOpenAccount} tone="secondary" />
              <BthButton label="الإشعارات" onPress={onOpenNotifications} tone="secondary" />
              <BthButton label="الدعم" onPress={onOpenSupport} tone="ghost" fullWidth={false} />
            </View>
          ),
        },
      ]}
    />
  );
}

export default ClientEntrySurface;