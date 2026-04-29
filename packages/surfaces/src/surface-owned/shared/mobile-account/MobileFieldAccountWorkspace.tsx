import React from 'react';
import {
  Badge,
  Box,
  Button,
  Icon,
  MobileCommandSectionList,
  MobileCommandSummaryStrip,
  MobileScrollView,
  SectionHeader,
  Surface,
  Text,
  TopBar,
  useDirection,
} from '@bthwani/ui-kit';
import type { MobileCommandSectionItemData, MobileCommandSummaryItem } from '@bthwani/ui-kit';

export type MobileAccountTypeOption = {
  id: string;
  label: string;
  description: string;
};

export type MobileFieldAccountWorkspaceTab = {
  id: string;
  label: string;
  subtitle?: string;
  badgeLabel?: string;
  icon?: MobileCommandSectionItemData['icon'];
  statusTone?: MobileCommandSectionItemData['statusTone'];
  content: React.ReactNode;
};

type MobileFieldAccountWorkspacePanel = 'menu' | 'settings' | 'type-switch';

type MobileFieldAccountWorkspaceProps = {
  presentation?: 'sheet' | 'page';
  visible?: boolean;
  fieldTitle?: string;
  fieldSubtitle?: string;
  fieldSummaryItems?: React.ComponentProps<typeof MobileCommandSummaryStrip>['items'];
  fieldTabs?: readonly MobileFieldAccountWorkspaceTab[];
  activeTypeId: string;
  typeOptions: readonly MobileAccountTypeOption[];
  settingsLabel?: string;
  typeSwitchLabel?: string;
  typeSwitchTitle?: string;
  typeSwitchPrompt?: string;
  onSelectType: (typeId: string) => void;
  onClose?: () => void;
  onBack?: () => void;
  onOpenHome?: () => void;
};

export function MobileFieldAccountWorkspace({
  presentation = 'sheet',
  visible,
  fieldTitle = 'مركز حساب الميدان',
  fieldSubtitle = 'قائمة المتاجر تبقى في الواجهة الرئيسية. ما تبقى ينتقل هنا كأقسام عمودية واضحة مباشرة.',
  fieldSummaryItems,
  fieldTabs,
  activeTypeId,
  typeOptions,
  settingsLabel = 'إعدادات اللغة',
  typeSwitchLabel = 'تغيير النوع',
  typeSwitchTitle = 'تغيير نوع تشغيل الميدان',
  typeSwitchPrompt = 'اختر DSH أو ARB. عند التبديل يتم إعادة ضبط المسار وتحديث التطبيق بالكامل بحسب النوع الجديد.',
  onSelectType,
  onClose,
  onBack,
  onOpenHome,
}: MobileFieldAccountWorkspaceProps) {
  const [panel, setPanel] = React.useState<MobileFieldAccountWorkspacePanel>('menu');
  const [fieldSectionId, setFieldSectionId] = React.useState(fieldTabs?.[0]?.id ?? 'overview');
  const { language, setLanguage } = useDirection();
  const tabs = fieldTabs ?? [];
  const activeSection = tabs.find((item) => item.id === fieldSectionId) ?? tabs[0];
  const summaryStripItems: MobileCommandSummaryItem[] = (fieldSummaryItems ?? []).map((item, index) => ({
    id: `field-summary-${index}`,
    label: item.label,
    value: typeof item.value === 'string' ? item.value : typeof item.value === 'number' ? String(item.value) : '[TBD]',
    tone: typeof item.tone === 'string' ? item.tone : undefined,
  }));

  React.useEffect(() => {
    if (visible === false) {
      setPanel('menu');
      setFieldSectionId(fieldTabs?.[0]?.id ?? 'overview');
    }
  }, [fieldTabs, visible]);

  React.useEffect(() => {
    if (!activeSection && tabs[0]) {
      setFieldSectionId(tabs[0].id);
    }
  }, [activeSection, tabs]);

  const commandSectionItems = tabs.map((item) => ({
    id: item.id,
    title: item.label,
    subtitle: item.subtitle,
    icon: item.icon,
    statusLabel: item.badgeLabel,
    statusTone: item.statusTone ?? (item.id === fieldSectionId ? 'brand' : 'soft'),
    onPress: () => setFieldSectionId(item.id),
  }));

  const contentPadding = presentation === 'page' ? 4 : undefined;
  const contentContainerStyle = presentation === 'page' ? { paddingBottom: 112 } : { gap: 12, paddingBottom: 8 };

  return (
    <MobileScrollView
      fill={presentation === 'page'}
      padding={contentPadding}
      gap={3}
      style={presentation === 'sheet' ? { maxHeight: 620 } : undefined}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
    >
      {presentation === 'page' ? (
        <TopBar
          variant="secondary"
          title={fieldTitle}
          subtitle={`${activeTypeId.toUpperCase()} · تشغيل الميدان`}
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={onBack ? {
            id: 'back',
            icon: <Icon name="arrow-back" size={24} tone="brand" />,
            mirrorInRtl: true,
            accessibilityLabel: 'العودة',
            onPress: onBack,
          } : undefined}
        />
      ) : null}

      {panel === 'menu' ? (
        <>
          <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
            <Box gap={2} style={{ alignItems: 'flex-end' }}>
              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <Badge label={activeTypeId === 'dsh' ? 'DSH' : 'ARB'} tone={activeTypeId === 'dsh' ? 'success' : 'warning'} />
                <Badge label="مركز الحساب" tone="brand" />
              </Box>
              <Text role="titleMd" style={{ textAlign: 'right' }}>
                {fieldTitle}
              </Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {fieldSubtitle}
              </Text>
            </Box>

            {summaryStripItems.length ? <MobileCommandSummaryStrip items={summaryStripItems} /> : null}
          </Surface>

          <MobileCommandSectionList title="الأقسام الرئيسية" subtitle="قائمة عمودية واضحة لكل قسم داخل الحساب." items={commandSectionItems} />

          <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
            {activeSection ? (
              <Box gap={3}>
                <SectionHeader title={activeSection.label} subtitle={activeSection.subtitle} />
                {activeSection.content}
              </Box>
            ) : (
              <Text role="bodySm" tone="muted">لا توجد أقسام معرفة بعد.</Text>
            )}
          </Surface>

          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {presentation === 'page' && onOpenHome ? (
              <Button
                label="قائمة المتاجر"
                tone="secondary"
                fullWidth={false}
                style={{ flex: 1 }}
                onPress={onOpenHome}
              />
            ) : null}
            <Button
              label={settingsLabel}
              tone="secondary"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => setPanel('settings')}
            />
            <Button
              label={typeSwitchLabel}
              tone="primary"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => setPanel('type-switch')}
            />
          </Box>
        </>
      ) : null}

      {panel === 'settings' ? (
        <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
          <SectionHeader title={settingsLabel} subtitle="اختر لغة العرض للتطبيق من نفس صفحة الحساب دون فتح overlay إضافي." />
          <Box layoutDirection="row" gap={2}>
            <Button
              label="العربية"
              tone={language === 'ar' ? 'primary' : 'secondary'}
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => setLanguage('ar')}
            />
            <Button
              label="English"
              tone={language === 'en' ? 'primary' : 'secondary'}
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => setLanguage('en')}
            />
          </Box>
          <Button label="رجوع" tone="ghost" onPress={() => setPanel('menu')} />
        </Surface>
      ) : null}

      {panel === 'type-switch' ? (
        <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
          <SectionHeader title={typeSwitchTitle} subtitle={typeSwitchPrompt} />
          <Box gap={2}>
            {typeOptions.map((option) => (
              <Button
                key={option.id}
                label={`${option.label} - ${option.description}`}
                tone={option.id === activeTypeId ? 'primary' : 'secondary'}
                onPress={() => {
                  onSelectType(option.id);
                  onClose?.();
                  setPanel('menu');
                }}
              />
            ))}
          </Box>
          <Button label="رجوع" tone="ghost" onPress={() => setPanel('menu')} />
        </Surface>
      ) : null}
    </MobileScrollView>
  );
}