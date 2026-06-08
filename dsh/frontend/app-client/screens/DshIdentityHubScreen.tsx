import React from 'react';
import { View } from 'react-native';
import {
  Box,
  Icon,
  MobileScrollView,
  Text,
  TopBar,
  colorPalette,
  safeArea,
  spacing,
  useTheme,
  TextField,
  Button,
} from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshIdentityHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  const { theme } = useTheme();

  // Profile data state
  const [displayName, setDisplayName] = React.useState('أحمد الحربي');
  const [phoneNumber, setPhoneNumber] = React.useState('+966 50 123 4567');
  const [email, setEmail] = React.useState('ahmed.harbi@example.com');

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = React.useState('');
  const [passwordStatusTone, setPasswordStatusTone] = React.useState<'success' | 'danger' | 'default'>('default');

  // Deletion state
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState('');
  const [deleteStatusMsg, setDeleteStatusMsg] = React.useState('');

  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title="الملف الشخصي"
        subtitle="البيانات الشخصية والأمان"
        primaryActionLabel="العودة لمساحتي"
        onPrimaryAction={onBack}
        onRetry={onRetry}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="الملف الشخصي"
        actions={onBack ? [{
          id: 'back',
          icon: <Icon name="chevron-back" mirrored size={18} />,
          accessibilityLabel: 'العودة',
          onPress: onBack,
        }] : []}
      />

      <MobileScrollView
        fill
        padding={4}
        gap={4}
        contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}
      >
        <View style={{ gap: spacing[3] }}>
          {/* Header & Verification Status Badge */}
          <Box align="center" gap={2} style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
            <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>بيانات الحساب الشخصي</Text>
            <Box align="center" gap={1} style={{ flexDirection: 'row-reverse' }}>
              <Icon name="checkmark-circle" size={16} color={colorPalette.success} />
              <Text role="bodySm" style={{ color: colorPalette.success, fontWeight: 'bold' }}>نشط وآمن</Text>
            </Box>
          </Box>

          {/* Details / Fields */}
          <Box gap={3} style={{ marginTop: spacing[2] }}>
            {/* Display Name Input */}
            <Box gap={1}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>الاسم الظاهر</Text>
              <TextField
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="الاسم الظاهر"
                style={{ textAlign: 'right', color: theme.text }}
              />
            </Box>

            {/* Mobile Number Input */}
            <Box gap={1}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>رقم الجوال</Text>
              <TextField
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="رقم الجوال"
                style={{ textAlign: 'right', color: theme.text }}
                keyboardType="phone-pad"
              />
            </Box>

            {/* Email Address Input */}
            <Box gap={1}>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>البريد الإلكتروني</Text>
              <TextField
                value={email}
                onChangeText={setEmail}
                placeholder="البريد الإلكتروني"
                style={{ textAlign: 'right', color: theme.text }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Box>

            {/* Change Password Action Section */}
            <Box style={{ borderTopWidth: 1, borderColor: theme.line, paddingTop: spacing[3], marginTop: spacing[1] }}>
              {!isChangingPassword ? (
                <Button
                  label="تغيير كلمة المرور"
                  tone="brand"
                  onPress={() => setIsChangingPassword(true)}
                  style={{ width: '100%' }}
                />
              ) : (
                <Box gap={3}>
                  <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>تحديث كلمة المرور</Text>

                  <Box gap={1}>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>كلمة المرور الجديدة</Text>
                    <TextField
                      value={password}
                      onChangeText={setPassword}
                      placeholder="أدخل كلمة المرور الجديدة"
                      secureTextEntry
                      style={{ textAlign: 'right', color: theme.text }}
                    />
                  </Box>

                  <Box gap={1}>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>تأكيد كلمة المرور</Text>
                    <TextField
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="أعد كتابة كلمة المرور للتأكيد"
                      secureTextEntry
                      style={{ textAlign: 'right', color: theme.text }}
                    />
                  </Box>

                  {passwordStatusMsg ? (
                    <Text
                      role="bodySm"
                      style={{
                        textAlign: 'right',
                        color: passwordStatusTone === 'success' ? colorPalette.success : colorPalette.danger
                      }}
                    >
                      {passwordStatusMsg}
                    </Text>
                  ) : null}

                  <Box gap={2} style={{ flexDirection: 'row-reverse' }}>
                    <Button
                      label="حفظ كلمة المرور"
                      tone="brand"
                      onPress={() => {
                        if (!password || !confirmPassword) {
                          setPasswordStatusMsg('يرجى ملء جميع الحقول المطلوبة');
                          setPasswordStatusTone('danger');
                          return;
                        }
                        if (password !== confirmPassword) {
                          setPasswordStatusMsg('كلمتا المرور غير متطابقتين');
                          setPasswordStatusTone('danger');
                          return;
                        }
                        setPasswordStatusMsg('تم تحديث كلمة المرور بنجاح وآمن');
                        setPasswordStatusTone('success');
                        setTimeout(() => {
                          setIsChangingPassword(false);
                          setPassword('');
                          setConfirmPassword('');
                          setPasswordStatusMsg('');
                        }, 2000);
                      }}
                      style={{ flex: 1 }}
                    />
                    <Button
                      label="إلغاء"
                      tone="ghost"
                      onPress={() => {
                        setIsChangingPassword(false);
                        setPassword('');
                        setConfirmPassword('');
                        setPasswordStatusMsg('');
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>

            {/* Danger Zone: Delete Account */}
            <Box style={{ borderTopWidth: 1, borderColor: theme.line, paddingTop: spacing[3], marginTop: spacing[2] }}>
              {!isDeletingAccount ? (
                <Button
                  tone="danger"
                  onPress={() => setIsDeletingAccount(true)}
                  style={{ width: '100%', backgroundColor: colorPalette.dangerSoft, borderColor: colorPalette.dangerSoft, borderWidth: 1 }}
                >
                  <Text role="bodyStrong" style={{ color: colorPalette.danger }}>حذف الحساب</Text>
                </Button>
              ) : (
                <Box gap={2} padding={3} style={{ backgroundColor: colorPalette.dangerSoft, borderRadius: 15, borderWidth: 1, borderColor: colorPalette.dangerSoft }}>
                  <Text role="bodyStrong" style={{ textAlign: 'right', color: colorPalette.dangerStrong }}>تنبيه أمان حساس وحرِج!</Text>
                  <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.dangerStrong }}>
                    حذف الحساب سيؤدي إلى مسح كافة البيانات والطلبات والمحفظة بشكل نهائي ولا يمكن استرجاعها.
                  </Text>
                  <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.dangerStrong, marginTop: 4 }}>
                    لتأكيد الإجراء, يرجى كتابة "حذف" في الحقل أدناه:
                  </Text>

                  <TextField
                    value={deleteConfirmText}
                    onChangeText={setDeleteConfirmText}
                    placeholder="اكتب حذف لتأكيد الطلب"
                    style={{ textAlign: 'right', color: colorPalette.dangerStrong, backgroundColor: theme.fieldBackground, borderColor: colorPalette.dangerSoft }}
                  />

                  {deleteStatusMsg ? (
                    <Text role="bodySm" style={{ textAlign: 'right', color: colorPalette.success, fontWeight: 'bold', marginTop: 4 }}>
                      {deleteStatusMsg}
                    </Text>
                  ) : null}

                  <Box gap={2} style={{ marginTop: spacing[2], flexDirection: 'row-reverse' }}>
                    <Button
                      label="حذف الحساب نهائياً"
                      disabled={deleteConfirmText !== 'حذف'}
                      tone="danger"
                      onPress={() => {
                        setDeleteStatusMsg('تم إرسال طلب حذف الحساب للإدارة للمراجعة بنجاح.');
                        setTimeout(() => {
                          setIsDeletingAccount(false);
                          setDeleteConfirmText('');
                          setDeleteStatusMsg('');
                        }, 2000);
                      }}
                      style={{ flex: 1, backgroundColor: deleteConfirmText === 'حذف' ? colorPalette.danger : colorPalette.dangerSoft }}
                    />
                    <Button
                      label="تراجع"
                      tone="ghost"
                      onPress={() => {
                        setIsDeletingAccount(false);
                        setDeleteConfirmText('');
                        setDeleteStatusMsg('');
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </View>
      </MobileScrollView>
    </View>
  );
}

export default DshIdentityHubScreen;
