import React from 'react';
import { Badge, Box, Button, KeyValueList, ListItem, MobileCommandSectionList, MobileCommandSummaryStrip, MobileScrollView, SectionHeader, SheetFrame, Surface, Text, useDirection } from '@bthwani/ui-kit';
import type { MobileCommandSectionItemData, MobileCommandSummaryItem } from '@bthwani/ui-kit';

type MobileAccountTypeOption = {
  id: string;
  label: string;
  description: string;
};

type MobileAccountSheetTab = 'menu' | 'settings' | 'type-switch';

type MobileAccountSheetMode = 'generic' | 'captain' | 'field';

export type MobileAccountSheetFieldTab = {
  id: string;
  label: string;
  subtitle?: string;
  badgeLabel?: string;
  icon?: MobileCommandSectionItemData['icon'];
  statusTone?: MobileCommandSectionItemData['statusTone'];
  content: React.ReactNode;
};

export type MobileAccountSheetMenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badgeLabel?: string;
  disabled?: boolean;
  onPress?: () => void;
};

export type MobileAccountSheetCaptainSection = {
  title: string;
  subtitle?: string;
  items: readonly MobileAccountSheetMenuItem[];
};

type MobileAccountSheetProps = {
  mode?: MobileAccountSheetMode;
  visible: boolean;
  onClose: () => void;
  profileLabel?: string;
  walletHubLabel?: string;
  settingsLabel?: string;
  typeSwitchLabel?: string;
  typeSwitchTitle?: string;
  typeSwitchPrompt?: string;
  onOpenProfile?: () => void;
  onOpenWalletHub?: () => void;
  onOpenOrders?: () => void;
  onOpenOperations?: () => void;
  onOpenInventory?: () => void;
  onOpenTeam?: () => void;
  onOpenAnalytics?: () => void;
  ordersLabel?: string;
  operationsLabel?: string;
  inventoryLabel?: string;
  analyticsLabel?: string;
  typeOptions: readonly MobileAccountTypeOption[];
  activeTypeId: string;
  onSelectType: (typeId: string) => void;
  captainSummaryItems?: React.ComponentProps<typeof KeyValueList>['items'];
  captainSections?: readonly MobileAccountSheetCaptainSection[];
  fieldTitle?: string;
  fieldSubtitle?: string;
  fieldSummaryItems?: React.ComponentProps<typeof KeyValueList>['items'];
  fieldTabs?: readonly MobileAccountSheetFieldTab[];
};

export function MobileAccountSheet({
  mode = 'generic',
  visible,
  onClose,
  profileLabel = 'ملف المتجر',
  walletHubLabel = 'المحفظة والحسابات المالية',
  settingsLabel = 'الإعدادات',
  typeSwitchLabel = 'تغيير النوع',
  typeSwitchTitle = 'اختيار النوع التشغيلي',
  typeSwitchPrompt = 'اختر نوع التشغيل الذي تريد الانتقال إليه. سيتم تطبيق التغيير على التطبيق بالكامل.',
  onOpenProfile,
  onOpenWalletHub,
  onOpenOrders,
  onOpenOperations,
  onOpenInventory,
  onOpenTeam,
  onOpenAnalytics,
  ordersLabel = 'الطلبات',
  operationsLabel = 'العمليات',
  inventoryLabel = 'المخزون والمنتجات',
  analyticsLabel = 'التحليلات',
  typeOptions,
  activeTypeId,
  onSelectType,
  captainSummaryItems,
  captainSections,
  fieldTitle = 'مركز حساب الميدان',
  fieldSubtitle = 'قائمة المتاجر تبقى في الواجهة الرئيسية. الأقسام الثانوية تنتقل هنا على شكل قائمة عمودية واضحة.',
  fieldSummaryItems,
  fieldTabs,
}: MobileAccountSheetProps) {
  const [tab, setTab] = React.useState<MobileAccountSheetTab>('menu');
  const [fieldSectionId, setFieldSectionId] = React.useState(fieldTabs?.[0]?.id ?? 'overview');
  const { language, setLanguage } = useDirection();
  const isCaptainMode = mode === 'captain';
  const isFieldMode = mode === 'field';

  React.useEffect(() => {
    if (!visible) {
      setTab('menu');
      setFieldSectionId(fieldTabs?.[0]?.id ?? 'overview');
    }
  }, [fieldTabs, visible]);

  const title =
    tab === 'settings'
      ? 'إعدادات اللغة'
      : tab === 'type-switch'
        ? typeSwitchTitle
        : isCaptainMode
          ? 'مركز الكابتن'
          : 'الحساب';

  const renderGenericMenu = () => (
    <>
      <Button
        label={ordersLabel}
        tone="secondary"
        onPress={() => {
          onClose();
          onOpenOrders?.();
        }}
      />
      <Button
        label={operationsLabel}
        tone="secondary"
        onPress={() => {
          onClose();
          onOpenOperations?.();
        }}
      />
      <Button
        label={inventoryLabel}
        tone="secondary"
        onPress={() => {
          onClose();
          onOpenInventory?.();
        }}
      />
      <Button
        label="إدارة الطاقم"
        tone="secondary"
        onPress={() => {
          onClose();
          onOpenTeam?.();
        }}
      />
      <Button
        label={analyticsLabel}
        tone="secondary"
        onPress={() => {
          onClose();
          onOpenAnalytics?.();
        }}
      />
      <Button
        label={profileLabel}
        tone="secondary"
        onPress={() => {
          onClose();
          onOpenProfile?.();
        }}
      />
      <Button
        label={walletHubLabel}
        tone="secondary"
        onPress={() => {
          onClose();
          onOpenWalletHub?.();
        }}
      />
      <Button label={settingsLabel} tone="secondary" onPress={() => setTab('settings')} />
      <Button label={typeSwitchLabel} tone="primary" onPress={() => setTab('type-switch')} />
    </>
  );

  const renderCaptainMenu = () => {
    const summary = captainSummaryItems?.length ? <KeyValueList dense dividers={false} items={captainSummaryItems} /> : null;

    return (
      <MobileScrollView style={{ maxHeight: 620 }} gap={3} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
        <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
          <Box gap={2} style={{ alignItems: 'flex-end' }}>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <Badge label={activeTypeId === 'dsh' ? 'DSH' : 'AMN [TBD]'} tone={activeTypeId === 'dsh' ? 'success' : 'warning'} />
              <Badge label="ملف الكابتن" tone="brand" />
            </Box>
            <Text role="titleMd" style={{ textAlign: 'right' }}>
              مركز الكابتن
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              ملخص الهوية والجاهزية والوصول إلى مسارات التشغيل من مكان واحد.
            </Text>
          </Box>
          {summary ? (
            <Surface tone="inset" padding={3} gap={3} radiusToken="lg" border={false}>
              {summary}
            </Surface>
          ) : null}
        </Surface>

        {captainSections?.map((section) => (
          <Surface key={section.title} tone="raised" padding={4} gap={3} radiusToken="xl">
            <SectionHeader title={section.title} subtitle={section.subtitle} />
            <Box gap={2}>
              {section.items.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  badgeLabel={item.badgeLabel}
                  disabled={item.disabled}
                  onPress={() => {
                    if (item.disabled) {
                      return;
                    }

                    onClose();
                    item.onPress?.();
                  }}
                />
              ))}
            </Box>
          </Surface>
        ))}

        <Button label={settingsLabel} tone="secondary" onPress={() => setTab('settings')} />
        <Button label={typeSwitchLabel} tone="primary" onPress={() => setTab('type-switch')} />
      </MobileScrollView>
    );
  };

  const renderFieldHub = () => {
    const tabs = fieldTabs ?? [];
    const activeSection = tabs.find((item) => item.id === fieldSectionId) ?? tabs[0];
    const summaryStripItems: MobileCommandSummaryItem[] = (fieldSummaryItems ?? []).map((item, index) => ({
      id: `field-summary-${index}`,
      label: item.label,
      value: typeof item.value === 'string' ? item.value : typeof item.value === 'number' ? String(item.value) : '[TBD]',
      tone: typeof item.tone === 'string' ? item.tone : undefined,
    }));

    const commandSectionItems = tabs.map((item) => ({
      id: item.id,
      title: item.label,
      subtitle: item.subtitle,
      icon: item.icon,
      statusLabel: item.badgeLabel,
      statusTone: item.statusTone ?? (item.id === fieldSectionId ? 'brand' : 'soft'),
      onPress: () => setFieldSectionId(item.id),
    }));

    return (
      <MobileScrollView style={{ maxHeight: 620 }} gap={3} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
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
          <Button label={settingsLabel} tone="secondary" fullWidth={false} style={{ flex: 1 }} onPress={() => setTab('settings')} />
          <Button label={typeSwitchLabel} tone="primary" fullWidth={false} style={{ flex: 1 }} onPress={() => setTab('type-switch')} />
        </Box>
      </MobileScrollView>
    );
  };

  return (
    <SheetFrame visible={visible} title={title} onClose={onClose}>
      {tab === 'menu' ? (isFieldMode ? renderFieldHub() : isCaptainMode ? renderCaptainMenu() : <>{renderGenericMenu()}</>) : null}

      {tab === 'settings' ? (
        <>
          <Text role="bodySm" tone="muted">
            اختر لغة العرض للتطبيق.
          </Text>
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
          <Button label="رجوع" tone="ghost" onPress={() => setTab('menu')} />
        </>
      ) : null}

      {tab === 'type-switch' ? (
        <>
          <Text role="bodySm" tone="muted">
            {typeSwitchPrompt}
          </Text>
          <Box gap={2}>
            {typeOptions.map((option) => (
              <Button
                key={option.id}
                label={`${option.label} - ${option.description}`}
                tone={option.id === activeTypeId ? 'primary' : 'secondary'}
                onPress={() => {
                  onSelectType(option.id);
                  onClose();
                }}
              />
            ))}
          </Box>
          <Button label="رجوع" tone="ghost" onPress={() => setTab('menu')} />
        </>
      ) : null}
    </SheetFrame>
  );
}

export type { MobileAccountTypeOption };
