import React from 'react';
import { Badge, Box, Button, KeyValueList, ListItem, MobileScrollView, SectionHeader, SheetFrame, Surface, Text, useDirection } from '@bthwani/ui-kit';

type MobileAccountTypeOption = {
  id: string;
  label: string;
  description: string;
};

type MobileAccountSheetTab = 'menu' | 'settings' | 'type-switch';

type MobileAccountSheetMode = 'generic' | 'captain';

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
}: MobileAccountSheetProps) {
  const [tab, setTab] = React.useState<MobileAccountSheetTab>('menu');
  const { language, setLanguage } = useDirection();
  const isCaptainMode = mode === 'captain';

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
    const summary = captainSummaryItems?.length ? <KeyValueList dense items={captainSummaryItems} /> : null;

    return (
      <MobileScrollView style={{ maxHeight: 620 }} gap={3} contentContainerStyle={{ gap: 12 }}>
        <Surface tone="brand" padding={4} gap={3} radiusToken="xl" border={false}>
          <Box gap={1} style={{ alignItems: 'flex-end' }}>
            <Badge label={activeTypeId === 'dsh' ? 'DSH' : 'AMN [TBD]'} tone={activeTypeId === 'dsh' ? 'success' : 'warning'} />
            <Text role="titleMd" tone="inverse" style={{ textAlign: 'right' }}>
              حساب الكابتن
            </Text>
            <Text role="bodySm" tone="inverse" style={{ textAlign: 'right' }}>
              DSH هو السياق النشط. AMN يبقى [TBD].
            </Text>
          </Box>
          {summary}
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
      {tab === 'menu' ? (isCaptainMode ? renderCaptainMenu() : <>{renderGenericMenu()}</>) : null}

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
