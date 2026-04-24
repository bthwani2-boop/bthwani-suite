import React from 'react';
import { ScrollView, View } from 'react-native';
import { Badge, Button, Surface, Text, TextField, spacing, useTheme } from '@bthwani/ui-kit';

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
  const { theme } = useTheme();
  const secureEntryAction = onOpenLogin ?? onOpenAccount ?? onEnterApp;

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
        contentContainerStyle={{ paddingHorizontal: spacing[5], paddingVertical: spacing[6], flexGrow: 1, justifyContent: 'space-between', gap: spacing[5] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: spacing[4], marginTop: spacing[6] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
            <Badge label={`2026 · ${appName}`} tone="brand" />
            <Text role="label" tone="muted" style={{ textAlign: 'left' }}>{userLabel}</Text>
          </View>

          <View style={{ gap: spacing[2] }}>
            <Text role="titleLg" style={{ fontSize: 48, lineHeight: 58, textAlign: 'right' }}>
              دخول أنيق يبدأ من هنا
            </Text>
            <Text role="titleSm" tone="muted" style={{ lineHeight: 34, textAlign: 'right' }}>
              تجربة أولى هادئة ومصقولة تقودك مباشرة إلى الحساب، الإعدادات، والمسارات العامة دون أي ضوضاء.
            </Text>
          </View>

          <View style={{ gap: spacing[1] }}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>{primaryServiceLabel}</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{secondaryServiceLabel}</Text>
          </View>
        </View>

        <Surface
          tone="raised"
          padding={5}
          gap={4}
          border
          style={{
            borderRadius: 32,
            shadowColor: '#000000',
            shadowOpacity: 0.16,
            shadowRadius: 22,
            shadowOffset: { width: 0, height: 10 },
            elevation: 8,
            paddingBottom: spacing[4],
            backgroundColor: theme.surfaceRaised,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: spacing[2] }}>
            <View style={{ width: 64, height: 6, borderRadius: 4, backgroundColor: theme.line }} />
          </View>

          <View style={{ gap: spacing[2] }}>
            <Text role="titleSm" tone="default" style={{ textAlign: 'right' }}>بيانات الدخول</Text>
            <Text role="bodyMd" tone="muted" style={{ textAlign: 'right' }}>
              أدخل هويتك العامة ثم أكمل التحقق بخطوة واحدة وواضحة.
            </Text>
          </View>

          {!expanded ? (
            <View style={{ gap: spacing[2] }}>
              <Button
                label="تسجيل الدخول"
                onPress={() => setExpanded(true)}
                size="lg"
                style={{ borderRadius: 28, paddingVertical: spacing[3] }}
              />

              <Button label="استكشف بدون تسجيل" onPress={onEnterApp} tone="secondary" size="md" style={{ borderRadius: 28 }} />
            </View>
          ) : (
            <View style={{ gap: spacing[3] }}>
              <View style={{ gap: spacing[2] }}>
                <TextField
                  label="رقم الجوال أو البريد"
                  placeholder="05xxxxxxxx أو name@example.com"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="default"
                  hint="استخدم بياناتك العامة للدخول الموحد"
                />

                <TextField
                  label="رمز التحقق"
                  placeholder="رمز التحقق"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  hint={otpSent ? 'تم إرسال الرمز، أدخله هنا لإكمال الدخول' : 'اطلب الرمز أولاً ثم اكتب هنا'}
                />
              </View>

              <View style={{ gap: spacing[2] }}>
                <Button
                  label={otpSent ? 'دخول آمن' : 'إرسال رمز التحقق'}
                  onPress={() => {
                    if (!otpSent) {
                      setOtpSent(true);
                      return;
                    }

                    secureEntryAction?.();
                  }}
                  size="lg"
                  disabled={otpSent && !secureEntryAction}
                  style={{ borderRadius: 20 }}
                />

                <Button
                  label="إلغاء"
                  onPress={() => {
                    setExpanded(false);
                    setOtpSent(false);
                    setCode('');
                  }}
                  tone="secondary"
                  size="md"
                  style={{ borderRadius: 20 }}
                />
              </View>
            </View>
          )}

          <Button label="مدخل المطور" onPress={onOpenSupport} tone="ghost" fullWidth={false} />
        </Surface>
      </ScrollView>
    </View>
  );
}

export default ClientEntrySurface;