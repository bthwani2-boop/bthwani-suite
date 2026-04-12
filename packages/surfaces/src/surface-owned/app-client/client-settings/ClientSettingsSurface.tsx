import React from 'react';
import { View } from 'react-native';
import {
  BthButton,
  BthFormScreenShell,
  BthKeyValueList,
  BthListItem,
  BthSurface,
  BthSwitch,
  BthText,
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
    <BthFormScreenShell
      title="إعدادات التطبيق"
      subtitle="هذه الصفحة مخصصة للتفضيلات العامة المشتركة بين كل الخدمات"
      submitLabel="إعادة الضبط"
      onSubmit={onResetPreferences}
      submitDisabled={!onResetPreferences}
    >
      <BthSurface tone="raised" padding={4} gap={3}>
        <BthText role="titleSm">ملخص سريع</BthText>
        <BthKeyValueList
          items={[
            { label: 'اللغة الحالية', value: snapshot.languageLabel },
            { label: 'المظهر الحالي', value: snapshot.themeLabel },
            { label: 'الإشعارات', value: snapshot.notificationsEnabled ? 'مفعلة' : 'معطلة' },
            { label: 'الوضع المدمج', value: snapshot.compactModeEnabled ? 'مفعل' : 'معطل' },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" padding={4} gap={3}>
        <BthText role="titleSm">تفضيلات عامة</BthText>
        <View style={{ gap: spacing[3] }}>
          <BthListItem
            title="اللغة"
            subtitle="اختر لغة الواجهة العامة"
            meta={snapshot.languageLabel}
            badgeLabel="عام"
            onPress={onOpenLanguage}
          />
          <BthListItem
            title="المظهر"
            subtitle="الوضع الفاتح أو الداكن أو التلقائي"
            meta={snapshot.themeLabel}
            badgeLabel="عام"
            onPress={onOpenTheme}
          />
          <BthListItem
            title="الخصوصية"
            subtitle="ضوابط عامة للعرض والمشاركة"
            meta={snapshot.privacyModeEnabled ? 'مشددة' : 'عادية'}
            badgeLabel="عام"
            onPress={onOpenPrivacy}
          />
          <BthListItem
            title="إمكانية الوصول"
            subtitle="تسهيلات عامة لقراءة الواجهات والتفاعل معها"
            meta={snapshot.accessibilityModeEnabled ? 'مفعلة' : 'معطلة'}
            badgeLabel="عام"
            onPress={onOpenAccessibility}
          />
        </View>
      </BthSurface>

      <BthSurface tone="raised" padding={4} gap={3}>
        <BthText role="titleSm">مفاتيح تشغيل</BthText>
        <View style={{ gap: spacing[3] }}>
          <BthSwitch
            label="الإشعارات العامة"
            description="إظهار أو إخفاء التنبيهات على مستوى التطبيق"
            value={snapshot.notificationsEnabled}
            onValueChange={onToggleNotifications}
          />
          <BthSwitch
            label="الوضع المدمج"
            description="تقليل المسافات والكثافة في العرض العام"
            value={snapshot.compactModeEnabled}
            onValueChange={onToggleCompactMode}
          />
          <BthSwitch
            label="وضع الخصوصية"
            description="تقليل ظهور التفاصيل العامة أثناء التصفح"
            value={snapshot.privacyModeEnabled}
            onValueChange={onTogglePrivacyMode}
          />
          <BthSwitch
            label="تسهيلات الوصول"
            description="زيادة قابلية القراءة والتباين في كل التطبيق"
            value={snapshot.accessibilityModeEnabled}
            onValueChange={onToggleAccessibilityMode}
          />
        </View>
      </BthSurface>

      <BthSurface tone="inset" padding={4} gap={2}>
        <BthText role="titleSm">نطاق هذا السطح</BthText>
        <BthText role="bodySm" tone="muted">
          هذه الإعدادات عامة ومشتركة بين الخدمات. أي إعداد خاص بخدمة بعينها يجب أن يبقى داخل service-owned فقط.
        </BthText>
        <View style={{ gap: spacing[2], marginTop: spacing[2] }}>
          {settingsSummary.map((item) => (
            <BthListItem
              key={item.label}
              title={item.label}
              subtitle={item.helperText}
              badgeLabel="surface-owned"
            />
          ))}
        </View>
      </BthSurface>

      <BthButton
        label="حفظ التفضيلات العامة"
        onPress={onResetPreferences}
        tone="primary"
        disabled={!onResetPreferences}
      />
    </BthFormScreenShell>
  );
}

export default ClientSettingsSurface;