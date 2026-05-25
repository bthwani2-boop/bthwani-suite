import React from 'react';
import { View } from 'react-native';
import { AppearanceOptionCard, Badge, Box, Button, Icon, ListItem, MobileScrollView, Surface, Text, TopBar } from '@bthwani/ui-kit';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import { resolveFieldFilterCounts, type FieldStoreFile } from '../../data/stores.preview-data';

const fieldAppearanceOptions: ReadonlyArray<{
  mode: BThwaniAppearanceMode;
  title: string;
  description: string;
}> = [
  {
    mode: 'lightPremium',
    title: 'فاتح أبيض',
    description: 'واجهة فاتحة واضحة، والزجاج يظهر فقط فيما يحدده المطور أثناء مراجعة الشاشات',
  },
  {
    mode: 'darkGlass',
    title: 'داكن زجاجي',
    description: 'مظهر داكن فاخر مع حواف زجاجية وطبقات واضحة بدون إزعاج بصري',
  },
] as const;

type DshFieldProfileHomeScreenProps = {
  stores: readonly FieldStoreFile[];
  appearanceHydrated: boolean;
  appearanceMode: BThwaniAppearanceMode;
  onAppearanceModeChange: (mode: BThwaniAppearanceMode) => void;
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
  onOpenFinance: () => void;
  onLogout: () => void;
};

export function DshFieldProfileHomeScreen({
  stores,
  appearanceHydrated,
  appearanceMode,
  onAppearanceModeChange,
  onBack,
  onOpenProfile,
  onOpenHistory,
  onOpenFinance,
  onLogout,
}: DshFieldProfileHomeScreenProps) {
  const counts = React.useMemo(() => resolveFieldFilterCounts(stores), [stores]);

  return (
    <Box style={{ flex: 1 }} background="background">
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
        <TopBar
          variant="secondary"
          title="ملف الميداني"
          subtitle="صفحة الهوية والملف التشغيلي للميدان"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={{
            id: 'back',
            icon: <Icon name="arrow-back" size={24} tone="brand" />,
            mirrorInRtl: true,
            accessibilityLabel: 'العودة',
            onPress: onBack,
          }}
        />

        <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge label="DSH" tone="success" />
            <Badge label="الميداني" tone="brand" />
          </View>
          <Text role="titleMd" style={{ textAlign: 'right' }}>ناصر القحطاني</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            الفريق الشمالي · الملف التشغيلي يبقى عند الميداني حتى اكتمال الملف والمراجعة والمالية المرتبطة به.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge label={`ملفات اليوم ${counts.today}`} tone="brand" />
            <Badge label={`مرسل ${counts.submitted}`} tone="info" />
            <Badge label={`مالية جاهزة ${counts.done}`} tone="success" />
          </View>
        </Surface>

        <Surface tone="raised" padding={3} gap={3} radiusToken="xl">
          <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
            المظهر
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {appearanceHydrated
              ? 'يتم حفظ اختيار المظهر محليًا واستعادته عند فتح تطبيق الميدان.'
              : 'جارٍ استعادة اختيار المظهر المحفوظ...'}
          </Text>
          <Box gap={3}>
            {fieldAppearanceOptions.map((option) => (
              <AppearanceOptionCard
                key={option.mode}
                title={option.title}
                description={option.description}
                mode={option.mode}
                modeLabel={option.mode === 'lightPremium' ? 'Light Premium' : 'Dark Glass'}
                statusLabel={appearanceMode === option.mode ? 'مفعّل الآن' : 'اضغط للتفعيل'}
                selected={appearanceMode === option.mode}
                onPress={() => onAppearanceModeChange(option.mode)}
              />
            ))}
          </Box>
        </Surface>

        <Surface tone="raised" padding={0} gap={0} radiusToken="xl">
          <ListItem title="بيانات الميداني" subtitle="الهوية، التغطية، والوردية الحالية." onPress={onOpenProfile} />
          <ListItem title="السجل" subtitle="آخر حالة لكل متجر والتقدم المرتبط به." onPress={onOpenHistory} />
          <ListItem title="المالية" subtitle="المستحقات والملخص المالي بعد اكتمال الاعتماد." onPress={onOpenFinance} />
        </Surface>

        <Button label="تسجيل الخروج" tone="secondary" onPress={onLogout} />
      </MobileScrollView>
    </Box>
  );
}

export default DshFieldProfileHomeScreen;
