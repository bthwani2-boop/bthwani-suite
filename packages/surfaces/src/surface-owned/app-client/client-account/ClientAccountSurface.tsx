import React from 'react';
import { View } from 'react-native';
import { Button, FormScreenShell, KeyValueList, ListItem, Surface, Switch, Text, spacing } from '@bthwani/ui-kit';

export type ClientAccountSnapshot = {
  displayName: string;
  phoneLabel: string;
  languageLabel: string;
  securityLabel: string;
  emailLabel: string;
};

export type ClientAccountSurfaceProps = {
  snapshot: ClientAccountSnapshot;
  notificationsEnabled: boolean;
  compactProfileEnabled: boolean;
  onEditProfile?: () => void;
  onEditPhone?: () => void;
  onEditLanguage?: () => void;
  onEditSecurity?: () => void;
  onToggleNotifications?: (nextValue: boolean) => void;
  onToggleCompactProfile?: (nextValue: boolean) => void;
};

export function ClientAccountSurface({
  snapshot,
  notificationsEnabled,
  compactProfileEnabled,
  onEditProfile,
  onEditPhone,
  onEditLanguage,
  onEditSecurity,
  onToggleNotifications,
  onToggleCompactProfile,
}: ClientAccountSurfaceProps) {
  return (
    <FormScreenShell
      title="الهوية العامة"
      subtitle="ملف وهوية وتفضيلات مشتركة للتطبيق كله"
      submitLabel="تحديث الحساب"
      onSubmit={onEditProfile}
      submitDisabled={!onEditProfile}
    >
      <Surface tone="brand" padding={4} gap={3}>
        <Text role="titleSm" tone="inverse">ملخص الهوية</Text>
        <KeyValueList
          items={[
            { label: 'الاسم', value: snapshot.displayName },
            { label: 'وسيلة الاتصال', value: snapshot.phoneLabel },
            { label: 'البريد', value: snapshot.emailLabel },
            { label: 'اللغة', value: snapshot.languageLabel },
            { label: 'الحماية', value: snapshot.securityLabel },
          ]}
        />
      </Surface>

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="titleSm">إجراءات عامة</Text>
        <View style={{ gap: spacing[3] }}>
          <ListItem title="تعديل الملف الشخصي" subtitle="الاسم والصورة والعرض العام" meta="عام" badgeLabel="عام" onPress={onEditProfile} />
          <ListItem title="وسيلة الاتصال" subtitle="معلومات تواصل مشتركة" meta={snapshot.phoneLabel} badgeLabel="عام" onPress={onEditPhone} />
          <ListItem title="اللغة" subtitle="لغة الواجهة العامة" meta={snapshot.languageLabel} badgeLabel="عام" onPress={onEditLanguage} />
          <ListItem title="الأمان" subtitle="قفل أو تحقق إضافي عام" meta={snapshot.securityLabel} badgeLabel="عام" onPress={onEditSecurity} />
        </View>
      </Surface>

      <Surface tone="inset" padding={4} gap={3}>
        <Text role="titleSm">مفاتيح تشغيل عامة</Text>
        <View style={{ gap: spacing[3] }}>
          <Switch
            label="إشعارات عامة"
            description="تفعيل التنبيهات المشتركة على مستوى التطبيق"
            value={notificationsEnabled}
            onValueChange={onToggleNotifications}
          />
          <Switch
            label="عرض مضغوط"
            description="تقليل الكثافة في العرض العام"
            value={compactProfileEnabled}
            onValueChange={onToggleCompactProfile}
          />
        </View>
      </Surface>

      <Button label="إدارة الهوية العامة" onPress={onEditProfile} disabled={!onEditProfile} />
    </FormScreenShell>
  );
}

export default ClientAccountSurface;