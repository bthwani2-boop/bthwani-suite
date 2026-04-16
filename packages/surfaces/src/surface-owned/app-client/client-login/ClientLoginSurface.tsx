import React from 'react';
import { View } from 'react-native';
import {
  BthBadge,
  BthButton,
  BthSurface,
  BthText,
  BthTextField,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';

export type ClientLoginSurfaceProps = {
  identityValue: string;
  verificationCodeValue: string;
  onChangeIdentity?: (value: string) => void;
  onChangeVerificationCode?: (value: string) => void;
  onRequestCode?: () => void;
  onSubmit?: () => void;
  onBack?: () => void;
  onDeveloperLogin?: () => void;
  submitDisabled?: boolean;
};

export function ClientLoginSurface({
  identityValue,
  verificationCodeValue,
  onChangeIdentity,
  onChangeVerificationCode,
  onRequestCode,
  onSubmit,
  onBack,
  onDeveloperLogin,
  submitDisabled = false,
}: ClientLoginSurfaceProps) {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, paddingHorizontal: spacing[5], paddingVertical: spacing[6], justifyContent: 'space-between', backgroundColor: theme.background }}>
      <View style={{ gap: spacing[4], marginTop: spacing[4] }}>
        <BthBadge label="دخول آمن · 2026" tone="brand" />
        <View style={{ gap: spacing[2] }}>
          <BthText role="titleLg" style={{ fontSize: 36, lineHeight: 44 }}>
            دخول موحد
          </BthText>
          <BthText role="bodyMd" tone="muted">
            طبقة دخول أهدأ وأكثر نضجًا للوصول إلى حسابك العام، مع مسار منفصل ومحدد للمطور.
          </BthText>
        </View>
      </View>

      <View style={{ gap: spacing[3] }}>
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
            <BthText role="titleSm" tone="inverse">بيانات الدخول</BthText>
            <BthText role="bodySm" tone="inverse" style={{ opacity: 0.88 }}>
              أدخل هويتك العامة ثم أكمل التحقق بخطوة واحدة واضحة.
            </BthText>
          </View>

          <View style={{ gap: spacing[3] }}>
            <BthTextField
              label="رقم الجوال أو البريد"
              value={identityValue}
              onChangeText={onChangeIdentity}
              placeholder="05xxxxxxxx أو name@example.com"
              autoCapitalize="none"
              keyboardType="default"
              hint="استخدم بياناتك العامة للدخول الموحد"
            />
            <BthTextField
              label="رمز التحقق"
              value={verificationCodeValue}
              onChangeText={onChangeVerificationCode}
              placeholder="0000"
              keyboardType="number-pad"
              hint="رمز مؤقت لتأكيد الدخول بشكل آمن"
            />
          </View>

          <View style={{ gap: spacing[2] }}>
            <BthButton label="دخول آمن" onPress={onSubmit} disabled={submitDisabled} size="lg" />
            <BthButton label="إرسال رمز التحقق" onPress={onRequestCode} tone="secondary" size="md" />
          </View>
        </BthSurface>

        <BthSurface tone="inset" padding={4} gap={3} border={false} style={{ borderRadius: 24 }}>
          <View style={{ gap: spacing[1] }}>
            <BthBadge label="خاص بالمطور" tone="warning" />
            <BthText role="bodyStrong">مدخل المطور</BthText>
            <BthText role="bodySm" tone="muted">
              هذا المسار مخصص للدخول المحلي السريع أثناء الاختبار والتطوير فقط.
            </BthText>
          </View>

          <View style={{ gap: spacing[2], alignItems: 'flex-start' }}>
            <BthButton label="دخول المطور المحلي" onPress={onDeveloperLogin} tone="ghost" fullWidth={false} />
            <BthButton label="العودة إلى الترحيب" onPress={onBack} tone="ghost" fullWidth={false} />
          </View>
        </BthSurface>
      </View>
    </View>
  );
}

export default ClientLoginSurface;
