import React from 'react';
import { View } from 'react-native';
import { BthButton, BthFormScreenShell, BthKeyValueList, BthListItem, BthSurface, BthSwitch, BthText, spacing } from '@bthwani/ui-kit';

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
    <BthFormScreenShell
      title="الحساب العام"
      subtitle="تفضيلات وهوية مشتركة بين كل الخدمات"
      submitLabel="تحديث الحساب"
      onSubmit={onEditProfile}
      submitDisabled={!onEditProfile}
    >
      <BthSurface tone="raised" padding={4} gap={3}>
        <BthText role="titleSm">بيانات أساسية</BthText>
        <BthKeyValueList
          items={[
            { label: 'الاسم', value: snapshot.displayName },
            { label: 'الهاتف', value: snapshot.phoneLabel },
            { label: 'البريد', value: snapshot.emailLabel },
            { label: 'اللغة', value: snapshot.languageLabel },
            { label: 'الحماية', value: snapshot.securityLabel },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" padding={4} gap={3}>
        <BthText role="titleSm">إجراءات الحساب</BthText>
        <View style={{ gap: spacing[3] }}>
          <BthListItem title="تعديل الملف الشخصي" subtitle="الاسم والصورة والعرض العام" meta="عام" onPress={onEditProfile} />
          <BthListItem title="رقم الهاتف" subtitle="معلومات التواصل المشتركة" meta={snapshot.phoneLabel} onPress={onEditPhone} />
          <BthListItem title="اللغة" subtitle="لغة الواجهة العامة" meta={snapshot.languageLabel} onPress={onEditLanguage} />
          <BthListItem title="الأمان" subtitle="قفل أو تحقق إضافي عام" meta={snapshot.securityLabel} onPress={onEditSecurity} />
        </View>
      </BthSurface>

      <BthSurface tone="inset" padding={4} gap={3}>
        <BthText role="titleSm">مفاتيح مرتبطة بالحساب</BthText>
        <View style={{ gap: spacing[3] }}>
          <BthSwitch
            label="إشعارات الحساب"
            description="تفعيل التنبيهات العامة المرتبطة بالحساب"
            value={notificationsEnabled}
            onValueChange={onToggleNotifications}
          />
          <BthSwitch
            label="ملف مضغوط"
            description="عرض الحساب بكثافة أقل"
            value={compactProfileEnabled}
            onValueChange={onToggleCompactProfile}
          />
        </View>
      </BthSurface>

      <BthButton label="إدارة الحساب" onPress={onEditProfile} disabled={!onEditProfile} />
    </BthFormScreenShell>
  );
}

export default ClientAccountSurface;