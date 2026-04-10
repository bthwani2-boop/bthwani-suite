import React from 'react';
import { BthBox, BthButton, BthSheetFrame, BthText, useDirection } from '@bthwani/ui-kit';

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
  settingsLabel?: string;
  typeSwitchLabel?: string;
  typeSwitchTitle?: string;
  typeSwitchPrompt?: string;
  onOpenProfile?: () => void;
  typeOptions: readonly MobileAccountTypeOption[];
  activeTypeId: string;
  onSelectType: (typeId: string) => void;
};

export function MobileAccountSheet({
  visible,
  onClose,
  profileLabel = 'الملف الشخصي',
  settingsLabel = 'الإعدادات',
  typeSwitchLabel = 'تغيير النوع',
  typeSwitchTitle = 'اختيار النوع التشغيلي',
  typeSwitchPrompt = 'اختر نوع التشغيل الذي تريد الانتقال إليه. سيتم تطبيق التغيير على التطبيق بالكامل.',
  onOpenProfile,
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
    <BthSheetFrame visible={visible} title={title} onClose={onClose}>
      {tab === 'menu' ? (
        <>
          <BthButton
            label={profileLabel}
            tone="secondary"
            onPress={() => {
              onClose();
              onOpenProfile?.();
            }}
          />
          <BthButton label={settingsLabel} tone="secondary" onPress={() => setTab('settings')} />
          <BthButton label={typeSwitchLabel} tone="primary" onPress={() => setTab('type-switch')} />
        </>
      ) : null}

      {tab === 'settings' ? (
        <>
          <BthText role="bodySm" tone="muted">اختر لغة العرض للتطبيق.</BthText>
          <BthBox layoutDirection="row" gap={2}>
            <BthButton
              label="العربية"
              tone={language === 'ar' ? 'primary' : 'secondary'}
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => setLanguage('ar')}
            />
            <BthButton
              label="English"
              tone={language === 'en' ? 'primary' : 'secondary'}
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => setLanguage('en')}
            />
          </BthBox>
          <BthButton label="رجوع" tone="ghost" onPress={() => setTab('menu')} />
        </>
      ) : null}

      {tab === 'type-switch' ? (
        <>
          <BthText role="bodySm" tone="muted">{typeSwitchPrompt}</BthText>
          <BthBox gap={2}>
            {typeOptions.map((option) => (
              <BthButton
                key={option.id}
                label={`${option.label} - ${option.description}`}
                tone={option.id === activeTypeId ? 'primary' : 'secondary'}
                onPress={() => {
                  onSelectType(option.id);
                  onClose();
                }}
              />
            ))}
          </BthBox>
          <BthButton label="رجوع" tone="ghost" onPress={() => setTab('menu')} />
        </>
      ) : null}
    </BthSheetFrame>
  );
}

export type { MobileAccountTypeOption };
