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
      title="الهوية العامة"
      subtitle="ملف وهوية وتفضيلات مشتركة للتطبيق كله"
      submitLabel="تحديث الحساب"
      onSubmit={onEditProfile}
      submitDisabled={!onEditProfile}
    >
      <BthSurface tone="brand" padding={4} gap={3}>
        <BthText role="titleSm" tone="inverse">ملخص الهوية</BthText>
        <BthKeyValueList
          items={[
            { label: 'الاسم', value: snapshot.displayName },
            { label: 'وسيلة الاتصال', value: snapshot.phoneLabel },
            { label: 'البريد', value: snapshot.emailLabel },
            { label: 'اللغة', value: snapshot.languageLabel },
            { label: 'الحماية', value: snapshot.securityLabel },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" padding={4} gap={3}>
        <BthText role="titleSm">إجراءات عامة</BthText>
        <View style={{ gap: spacing[3] }}>
          <BthListItem title="تعديل الملف الشخصي" subtitle="الاسم والصورة والعرض العام" meta="عام" badgeLabel="عام" onPress={onEditProfile} />
          <BthListItem title="وسيلة الاتصال" subtitle="معلومات تواصل مشتركة" meta={snapshot.phoneLabel} badgeLabel="عام" onPress={onEditPhone} />
          <BthListItem title="اللغة" subtitle="لغة الواجهة العامة" meta={snapshot.languageLabel} badgeLabel="عام" onPress={onEditLanguage} />
          <BthListItem title="الأمان" subtitle="قفل أو تحقق إضافي عام" meta={snapshot.securityLabel} badgeLabel="عام" onPress={onEditSecurity} />
        </View>
      </BthSurface>

      <BthSurface tone="inset" padding={4} gap={3}>
        <BthText role="titleSm">مفاتيح تشغيل عامة</BthText>
        <View style={{ gap: spacing[3] }}>
          <BthSwitch
            label="إشعارات عامة"
            description="تفعيل التنبيهات المشتركة على مستوى التطبيق"
            value={notificationsEnabled}
            onValueChange={onToggleNotifications}
          />
          <BthSwitch
            label="عرض مضغوط"
            description="تقليل الكثافة في العرض العام"
            value={compactProfileEnabled}
            onValueChange={onToggleCompactProfile}
          />
        </View>
      </BthSurface>

      <BthButton label="إدارة الهوية العامة" onPress={onEditProfile} disabled={!onEditProfile} />
    </BthFormScreenShell>
  );
}

export default ClientAccountSurface;