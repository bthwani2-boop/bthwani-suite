import React from 'react';
import { View } from 'react-native';
import { BthBadge, BthButton, BthSurface, BthText, spacing, useTheme } from '@bthwani/ui-kit';

export type ClientEntrySurfaceProps = {
  appName?: string;
  userLabel?: string;
  primaryServiceLabel?: string;
  secondaryServiceLabel?: string;
  onEnterApp?: () => void;
  onOpenLogin?: () => void;
  onOpenAccount?: () => void;
  onOpenNotifications?: () => void;
  onOpenSupport?: () => void;
};

export function ClientEntrySurface({
  appName = 'بوابة التطبيق',
  userLabel = 'المستخدم العام',
  primaryServiceLabel = 'دخول أنيق وسريع',
  secondaryServiceLabel = 'حساب موحد وتجربة مشتركة',
  onEnterApp,
  onOpenLogin,
  onOpenAccount,
  onOpenNotifications,
  onOpenSupport,
}: ClientEntrySurfaceProps) {
  const loginAction = onOpenLogin ?? onOpenAccount;
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[5], paddingVertical: spacing[6], justifyContent: 'space-between', backgroundColor: theme.background }}>
      <View style={{ gap: spacing[5], marginTop: spacing[6] }}>
        <BthBadge label={`2026 · ${appName}`} tone="brand" />

        <View style={{ gap: spacing[2] }}>
          <BthText role="titleLg" style={{ fontSize: 42, lineHeight: 52 }}>
            دخول أنيق يبدأ من هنا
          </BthText>
          <BthText role="titleSm" tone="muted" style={{ lineHeight: 34 }}>
            تجربة أولى هادئة ومصقولة تقودك مباشرة إلى الحساب، الإعدادات، والمسارات العامة دون أي ضوضاء.
          </BthText>
        </View>

        <View style={{ gap: spacing[1] }}>
          <BthText role="bodyStrong">{primaryServiceLabel}</BthText>
          <BthText role="bodySm" tone="muted">{secondaryServiceLabel}</BthText>
        </View>
      </View>

      <BthSurface
        tone="default"
        padding={5}
        gap={4}
        border={false}
        style={{
          borderRadius: 32,
          backgroundColor: '#151823',
          shadowColor: '#000000',
          shadowOpacity: 0.18,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }}
      >
        <View style={{ gap: spacing[2] }}>
          <BthText role="titleSm" tone="inverse">جاهز للدخول</BthText>
          <BthText role="bodyMd" tone="inverse" style={{ opacity: 0.92 }}>
            شاشة افتتاحية أنظف، قرار أوضح، وبداية تليق بالمنتج.
          </BthText>
        </View>

        <View style={{ gap: spacing[2] }}>
          <BthButton label="تسجيل الدخول" onPress={loginAction} size="lg" />
          <BthButton label="استكشف بدون تسجيل" onPress={onEnterApp} tone="secondary" size="md" />
        </View>
      </BthSurface>
    </View>
  );
}

export default ClientEntrySurface;