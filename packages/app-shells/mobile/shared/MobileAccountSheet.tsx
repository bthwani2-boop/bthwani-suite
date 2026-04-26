import React from 'react';
import { Box, Button, SheetFrame, Text, useDirection } from '@bthwani/ui-kit';

type MobileAccountTypeOption = {
  id: string;
  label: string;
  description: string;
};

type MobileAccountSheetTab = 'menu' | 'settings' | 'type-switch';

type MobileAccountSheetProps = {
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
  onOpenTeam?: () => void;
  ordersLabel?: string;
  operationsLabel?: string;
  inventoryLabel?: string;
  analyticsLabel?: string;
  typeOptions: readonly MobileAccountTypeOption[];
  activeTypeId: string;
  onSelectType: (typeId: string) => void;
};

export function MobileAccountSheet({
  visible,
  onClose,
  profileLabel = 'الملف الشخصي',
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
}: MobileAccountSheetProps) {
  const [tab, setTab] = React.useState<MobileAccountSheetTab>('menu');
  const { language, setLanguage } = useDirection();

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

  return (
    <SheetFrame visible={visible} title={title} onClose={onClose}>
      {tab === 'menu' ? (
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
      ) : null}

      {tab === 'settings' ? (
        <>
          <Text role="bodySm" tone="muted">اختر لغة العرض للتطبيق.</Text>
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
          <Text role="bodySm" tone="muted">{typeSwitchPrompt}</Text>
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
