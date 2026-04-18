import React from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { BthBadge, BthButton, BthSurface, BthText, spacing, useTheme } from '@bthwani/ui-kit';

export type ClientEntrySurfaceProps = {
  appName?: string;
  userLabel?: string;
  primaryServiceLabel?: string;
  secondaryServiceLabel?: string;
  openLogin?: boolean;
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
  openLogin = false,
}: ClientEntrySurfaceProps) {
  const loginAction = onOpenLogin ?? onOpenAccount;
  const { theme } = useTheme();

  // theme may not expose every token on the TS type; cast to any for optional tokens
  const brandColor = (theme as any).brand ?? '#F37021';
  const mutedText = (theme as any).textMuted ?? '#8A8F98';
  const surfaceContrast = (theme as any).surfaceContrast ?? '#FFFFFF';

  const [expanded, setExpanded] = React.useState(false);
  const [identifier, setIdentifier] = React.useState('');
  const [code, setCode] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);

  React.useEffect(() => {
    if (openLogin) setExpanded(true);
  }, [openLogin]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing[5], paddingVertical: spacing[6], flexGrow: 1, justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: spacing[5], marginTop: spacing[6] }}>
          <BthBadge label={`2026 · ${appName}`} tone="brand" />

          <View style={{ gap: spacing[2] }}>
            <BthText role="titleLg" style={{ fontSize: 50, lineHeight: 60, textAlign: 'right' }}>
              دخول أنيق يبدأ من هنا
            </BthText>
            <BthText role="titleSm" tone="muted" style={{ lineHeight: 34, textAlign: 'right' }}>
              تجربة أولى هادئة ومصقولة تقودك مباشرة إلى الحساب، الإعدادات، والمسارات العامة دون أي ضوضاء.
            </BthText>
          </View>

          <View style={{ gap: spacing[1] }}>
            <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{primaryServiceLabel}</BthText>
            <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{secondaryServiceLabel}</BthText>
          </View>
        </View>

        <BthSurface
          tone="default"
          padding={5}
          gap={4}
          border={false}
          style={{
            borderRadius: 32,
            shadowColor: '#000000',
            shadowOpacity: 0.18,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 10 },
            elevation: 8,
            paddingBottom: spacing[4],
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: spacing[2] }}>
            <View style={{ width: 64, height: 6, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.06)' }} />
          </View>

          {/* Header + description inside sheet */}
          <View style={{ gap: spacing[2] }}>
            <BthText role="titleSm" tone="inverse" style={{ textAlign: 'right' }}>بيانات الدخول</BthText>
            <BthText role="bodyMd" tone="inverse" style={{ opacity: 0.9, textAlign: 'right' }}>
              أدخل هويتك العامة ثم أكمل التحقق بخطوة واحدة وواضحة.
            </BthText>
          </View>

          {/* Progressive disclosure: collapsed vs expanded */}
          {!expanded ? (
            <View style={{ gap: spacing[2] }}>
              <BthButton
                  label="تسجيل الدخول"
                  onPress={() => setExpanded(true)}
                  size="lg"
                  style={{ borderRadius: 28, paddingVertical: spacing[3], backgroundColor: brandColor }}
                />

              <BthButton label="استكشف بدون تسجيل" onPress={onEnterApp} tone="secondary" size="md" style={{ borderRadius: 28 }} />
            </View>
          ) : (
            <View style={{ gap: spacing[3] }}>
              <View style={{ gap: spacing[2] }}>
                <TextInput
                  placeholder="05xxxxxxxx أو name@example.com"
                  placeholderTextColor={mutedText}
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="default"
                  style={{
                    backgroundColor: surfaceContrast,
                    paddingHorizontal: spacing[4],
                    paddingVertical: Platform.OS === 'ios' ? spacing[3] : spacing[2],
                    borderRadius: 20,
                    textAlign: 'right',
                    fontSize: 16,
                  }}
                />

                <TextInput
                  placeholder="رمز التحقق"
                  placeholderTextColor={mutedText}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={{
                    backgroundColor: surfaceContrast,
                    paddingHorizontal: spacing[4],
                    paddingVertical: Platform.OS === 'ios' ? spacing[3] : spacing[2],
                    borderRadius: 20,
                    textAlign: 'right',
                    fontSize: 16,
                  }}
                />
              </View>

              <View style={{ gap: spacing[2] }}>
                <BthButton
                  label={otpSent ? 'دخول آمن' : 'إرسال رمز التحقق'}
                  onPress={() => {
                    if (!otpSent) {
                      setOtpSent(true);
                    } else {
                      if (onOpenLogin) onOpenLogin();
                      else if (onEnterApp) onEnterApp();
                    }
                  }}
                  size="lg"
                  style={{ borderRadius: 20 }}
                />

                <BthButton label="إلغاء" onPress={() => { setExpanded(false); setOtpSent(false); setCode(''); }} tone="secondary" size="md" style={{ borderRadius: 20 }} />
              </View>
            </View>
          )}

          {/* Optional developer path (light, non-distracting) */}
          <View style={{ marginTop: spacing[3] }}>
            <TouchableOpacity onPress={onOpenSupport} style={{ alignSelf: 'flex-start' }}>
              <BthText role="label" tone="muted">مدخل المطور</BthText>
            </TouchableOpacity>
          </View>
        </BthSurface>
      </ScrollView>
    </View>
  );
}

export default ClientEntrySurface;