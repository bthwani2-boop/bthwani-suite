import React from 'react';
import { Badge, Box, Button, KeyValueList, ListItem, MobileScrollView, SectionHeader, SheetFrame, Surface, Text } from '@bthwani/ui-kit';
import { MobileFieldAccountWorkspace, type MobileAccountTypeOption, type MobileFieldAccountWorkspaceTab } from './MobileFieldAccountWorkspace';

type MobileAccountSheetTab = 'menu' | 'settings' | 'type-switch';

type MobileAccountSheetMode = 'generic' | 'captain' | 'field';

export type MobileAccountSheetFieldTab = MobileFieldAccountWorkspaceTab;

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
  items: ReadonlyArray<MobileAccountSheetMenuItem>;
};

type MobileAccountSheetProps = {
  mode?: MobileAccountSheetMode;
  visible: boolean;
  onClose: () => void;
  captainDisplayName?: string;
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
  typeOptions: ReadonlyArray<MobileAccountTypeOption>;
  activeTypeId: string;
  onSelectType: (typeId: string) => void;
  captainSummaryItems?: React.ComponentProps<typeof KeyValueList>['items'];
  captainSections?: ReadonlyArray<MobileAccountSheetCaptainSection>;
  fieldTitle?: string;
  fieldSubtitle?: string;
  fieldSummaryItems?: React.ComponentProps<typeof KeyValueList>['items'];
  fieldTabs?: ReadonlyArray<MobileAccountSheetFieldTab>;
};

export function MobileAccountSheet({
  mode = 'generic',
  visible,
  onClose,
  captainDisplayName = 'الكابتن',
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
  const [language, setLanguage] = React.useState<'ar' | 'en'>('ar');
  const isCaptainMode = mode === 'captain';
  const isFieldMode = mode === 'field';

  React.useEffect(() => {
    if (!visible) {
      setTab('menu');
    }
  }, [visible]);

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
              {captainDisplayName}
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              مركز موحد للكابتن: الطلبات والمحفظة والأرباح والتسويات والملف الشخصي والوثائق والخريطة والإعدادات من نفس الشيت المشترك.
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

  return (
    <SheetFrame visible={visible} title={title} onClose={onClose}>
      {tab === 'menu' ? (
        isFieldMode ? (
          <MobileFieldAccountWorkspace
            presentation="sheet"
            visible={visible}
            fieldTitle={fieldTitle}
            fieldSubtitle={fieldSubtitle}
            fieldSummaryItems={fieldSummaryItems}
            fieldTabs={fieldTabs}
            activeTypeId={activeTypeId}
            typeOptions={typeOptions}
            settingsLabel={settingsLabel}
            typeSwitchLabel={typeSwitchLabel}
            typeSwitchTitle={typeSwitchTitle}
            typeSwitchPrompt={typeSwitchPrompt}
            onSelectType={onSelectType}
            onClose={onClose}
          />
        ) : isCaptainMode ? (
          renderCaptainMenu()
        ) : (
          <>{renderGenericMenu()}</>
        )
      ) : null}

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
