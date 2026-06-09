import React from 'react';
import { Pressable, View } from 'react-native';
import { Badge, Box, Button, Divider, Icon, MobileScrollView, Text, TopBar, useTheme } from '@bthwani/ui-kit';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import { resolveFieldFilterCounts, type FieldStoreFile } from '../../data/stores.preview-data';

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

  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="ملف الميداني"
        subtitle="صفحة الهوية والملف التشغيلي للميدان"
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'العودة',
          onPress: onBack,
        }}
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 96 }}>
        <Box padding={4} gap={4}>
          <Box gap={3} paddingY={2}>
            <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }}>
              <Badge label="DSH" tone="success" />
              <Badge label="الميداني" tone="brand" />
            </View>
            <Text role="titleMd" style={{ textAlign: 'right' }}>ناصر القحطاني</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              الفريق الشمالي · الملف التشغيلي يبقى عند الميداني حتى اكتمال الملف والمراجعة والمالية المرتبطة به.
            </Text>
            <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }}>
              <Badge label={`ملفات اليوم ${counts.today}`} tone="brand" />
              <Badge label={`مرسل ${counts.submitted}`} tone="info" />
              <Badge label={`مالية جاهزة ${counts.done}`} tone="success" />
            </View>
          </Box>

          <Divider />

          <Box gap={3} paddingY={2}>
            <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
              المظهر والتحكم
            </Text>

            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 14,
                backgroundColor: theme.surface,
              }}
            >
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 12, flexShrink: 1, minWidth: 0 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.surfaceInset,
                    borderWidth: 1,
                    borderColor: theme.line,
                    flexShrink: 0,
                  }}
                >
                  <Icon name="color-palette-outline" size={17} tone="default" />
                </View>
                <View style={{ flexShrink: 1, minWidth: 0, gap: 2, alignItems: 'flex-end' }}>
                  <Text role="bodyStrong" style={{ textAlign: 'right' }} numberOfLines={1}>مظهر التطبيق</Text>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }} numberOfLines={1}>
                    {appearanceHydrated ? 'فاتح أبيض أو داكن زجاجي' : 'جارٍ الاستعادة...'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row-reverse',
                  backgroundColor: theme.surfaceInset,
                  borderRadius: 12,
                  padding: 3,
                  borderWidth: 1,
                  borderColor: theme.line,
                  gap: 4,
                }}
              >
                <Pressable
                  onPress={() => onAppearanceModeChange('lightPremium')}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 9,
                    backgroundColor: appearanceMode === 'lightPremium' ? theme.brand : 'transparent',
                  }}
                >
                  <Text role="bodyStrong" style={{ fontSize: 12, color: appearanceMode === 'lightPremium' ? theme.brandContrast : theme.text }}>
                    فاتح
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => onAppearanceModeChange('darkGlass')}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 9,
                    backgroundColor: appearanceMode === 'darkGlass' ? theme.brand : 'transparent',
                  }}
                >
                  <Text role="bodyStrong" style={{ fontSize: 12, color: appearanceMode === 'darkGlass' ? theme.brandContrast : theme.text }}>
                    داكن
                  </Text>
                </Pressable>
              </View>
            </View>
          </Box>

          <Divider />

          <Box gap={0}>
            <Pressable onPress={onOpenProfile}>
              <Box paddingY={3} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
                    <Text role="bodyStrong">بيانات الميداني</Text>
                    <Text role="bodySm" tone="muted">الهوية، التغطية، والوردية الحالية.</Text>
                  </View>
                  <Icon name="chevron-back" size={20} tone="muted" mirrorInRtl />
                </View>
              </Box>
            </Pressable>

            <Pressable onPress={onOpenHistory}>
              <Box paddingY={3} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
                    <Text role="bodyStrong">السجل</Text>
                    <Text role="bodySm" tone="muted">آخر حالة لكل متجر والتقدم المرتبط به.</Text>
                  </View>
                  <Icon name="chevron-back" size={20} tone="muted" mirrorInRtl />
                </View>
              </Box>
            </Pressable>

            <Pressable onPress={onOpenFinance}>
              <Box paddingY={3} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
                    <Text role="bodyStrong">المالية</Text>
                    <Text role="bodySm" tone="muted">المستحقات والملخص المالي بعد اكتمال الاعتماد.</Text>
                  </View>
                  <Icon name="chevron-back" size={20} tone="muted" mirrorInRtl />
                </View>
              </Box>
            </Pressable>
          </Box>

          <Divider />

          <Button label="تسجيل الخروج" tone="secondary" onPress={onLogout} />
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default DshFieldProfileHomeScreen;
