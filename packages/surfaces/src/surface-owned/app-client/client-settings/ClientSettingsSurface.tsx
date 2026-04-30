import React from 'react';
import { View } from 'react-native';
import {
  Button,
  FormScreenShell,
  KeyValueList,
  ListItem,
  Surface,
  Switch,
  Text,
  spacing,
} from '@bthwani/ui-kit';

export type ClientSettingsSnapshot = {
  languageLabel: string;
  themeLabel: string;
  notificationsEnabled: boolean;
  compactModeEnabled: boolean;
  privacyModeEnabled: boolean;
  accessibilityModeEnabled: boolean;
};

export type ClientSettingsSurfaceProps = {
  snapshot: ClientSettingsSnapshot;
  onOpenLanguage?: () => void;
  onOpenTheme?: () => void;
  onOpenPrivacy?: () => void;
  onOpenAccessibility?: () => void;
  onToggleNotifications?: (nextValue: boolean) => void;
  onToggleCompactMode?: (nextValue: boolean) => void;
  onTogglePrivacyMode?: (nextValue: boolean) => void;
  onToggleAccessibilityMode?: (nextValue: boolean) => void;
  onResetPreferences?: () => void;
};

const settingsSummary = [
  {
    label: 'اللغة',
    tone: 'default' as const,
    helperText: 'تفضيل عام على مستوى التطبيق',
  },
  {
    label: 'المظهر',
    tone: 'default' as const,
    helperText: 'يؤثر على عرض التطبيق كله',
  },
  {
    label: 'الخصوصية',
    tone: 'default' as const,
    helperText: 'تفضيلات عامة لا ترتبط بخدمة واحدة',
  },
  {
    label: 'إمكانية الوصول',
    tone: 'default' as const,
    helperText: 'إعدادات مساعدة عامة',
  },
] as const;

export function ClientSettingsSurface({
  snapshot,
  onOpenLanguage,
  onOpenTheme,
  onOpenPrivacy,
  onOpenAccessibility,
  onToggleNotifications,
  onToggleCompactMode,
  onTogglePrivacyMode,
  onToggleAccessibilityMode,
  onResetPreferences,
}: ClientSettingsSurfaceProps) {
  return (
    <FormScreenShell
      title="التفضيلات العامة"
      subtitle="هذه الصفحة مخصصة للتفضيلات المشتركة في التطبيق كله"
      submitLabel="إعادة الضبط"
      onSubmit={onResetPreferences}
      submitDisabled={!onResetPreferences}
    >
      <Surface tone="brand" padding={4} gap={3}>
        <Text role="titleSm" tone="inverse">ملخص سريع</Text>
        <KeyValueList
          items={[
            { label: 'اللغة الحالية', value: snapshot.languageLabel },
            { label: 'المظهر الحالي', value: snapshot.themeLabel },
            { label: 'الإشعارات', value: snapshot.notificationsEnabled ? 'مفعلة' : 'معطلة' },
            { label: 'الوضع المدمج', value: snapshot.compactModeEnabled ? 'مفعل' : 'معطل' },
          ]}
        />
      </Surface>

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="titleSm">تفضيلات عامة</Text>
        <View style={{ gap: spacing[3] }}>
          <ListItem
            title="اللغة"
            subtitle="اختر لغة الواجهة العامة"
            meta={snapshot.languageLabel}
            badgeLabel="عام"
            onPress={onOpenLanguage}
          />
          <ListItem
            title="المظهر"
            subtitle="الوضع الفاتح أو الداكن أو التلقائي"
            meta={snapshot.themeLabel}
            badgeLabel="عام"
            onPress={onOpenTheme}
          />
          <ListItem
            title="الخصوصية"
            subtitle="ضوابط عامة للعرض والمشاركة"
            meta={snapshot.privacyModeEnabled ? 'مشددة' : 'عادية'}
            badgeLabel="عام"
            onPress={onOpenPrivacy}
          />
          <ListItem
            title="إمكانية الوصول"
            subtitle="تسهيلات عامة لقراءة الواجهات والتفاعل معها"
            meta={snapshot.accessibilityModeEnabled ? 'مفعلة' : 'معطلة'}
            badgeLabel="عام"
            onPress={onOpenAccessibility}
          />
        </View>
      </Surface>

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="titleSm">مفاتيح تشغيل عامة</Text>
        <View style={{ gap: spacing[3] }}>
          <Switch
            label="الإشعارات العامة"
            description="إظهار أو إخفاء التنبيهات على مستوى التطبيق"
            value={snapshot.notificationsEnabled}
            onValueChange={onToggleNotifications}
          />
          <Switch
            label="الوضع المدمج"
            description="تقليل المسافات والكثافة في العرض العام"
            value={snapshot.compactModeEnabled}
            onValueChange={onToggleCompactMode}
          />
          <Switch
            label="وضع الخصوصية"
            description="تقليل ظهور التفاصيل العامة أثناء التصفح"
            value={snapshot.privacyModeEnabled}
            onValueChange={onTogglePrivacyMode}
          />
          <Switch
            label="تسهيلات الوصول"
            description="زيادة قابلية القراءة والتباين في كل التطبيق"
            value={snapshot.accessibilityModeEnabled}
            onValueChange={onToggleAccessibilityMode}
          />
        </View>
      </Surface>

      <Surface tone="inset" padding={4} gap={2}>
        <Text role="titleSm">نطاق السطح</Text>
        <Text role="bodySm" tone="muted">
          هذه الإعدادات عامة ومشتركة بين كل أجزاء التطبيق. أي إعداد محلي لجزء محدد يجب أن يبقى في مساره الخاص.
        </Text>
        <View style={{ gap: spacing[2], marginTop: spacing[2] }}>
          {settingsSummary.map((item) => (
            <ListItem
              key={item.label}
              title={item.label}
              subtitle={item.helperText}
              badgeLabel="عام"
            />
          ))}
        </View>
      </Surface>

      <Button
        label="حفظ التفضيلات العامة"
        onPress={onResetPreferences}
        tone="primary"
        disabled={!onResetPreferences}
      />
    </FormScreenShell>
  );
}

export default ClientSettingsSurface;