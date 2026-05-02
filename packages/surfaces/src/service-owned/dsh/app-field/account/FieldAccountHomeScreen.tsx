import React from 'react';
import { View } from 'react-native';
import { Badge, Box, Button, Icon, ListItem, MobileScrollView, Surface, Text, TopBar } from '@bthwani/ui-kit';
import { resolveFieldFilterCounts, type FieldStoreFile } from '../stores/dshFieldStoresModel';

type FieldAccountHomeScreenProps = {
  stores: readonly FieldStoreFile[];
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
  onOpenFinance: () => void;
  onLogout: () => void;
};

export function FieldAccountHomeScreen({
  stores,
  onBack,
  onOpenProfile,
  onOpenHistory,
  onOpenFinance,
  onLogout,
}: FieldAccountHomeScreenProps) {
  const counts = React.useMemo(() => resolveFieldFilterCounts(stores), [stores]);

  return (
    <Box style={{ flex: 1 }} background="background">
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
        <TopBar
          variant="secondary"
          title="حساب الميدان"
          subtitle="صفحة حساب طبيعية، بدون Sheet أو Popup"
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
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>الفريق الشمالي · دورك ينتهي عند اكتمال الملف وإرساله للمراجعة ثم متابعة حالته والمالية المرتبطة به.</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge label={`ملفات اليوم ${counts.today}`} tone="brand" />
            <Badge label={`مرسل ${counts.submitted}`} tone="info" />
            <Badge label={`مالية جاهزة ${counts.done}`} tone="success" />
          </View>
        </Surface>

        <Surface tone="raised" padding={0} gap={0} radiusToken="xl">
          <ListItem title="بيانات الميداني" subtitle="الهوية، التغطية، والوردية الحالية." onPress={onOpenProfile} />
          <ListItem title="السجل" subtitle="ملفات الانضمام التي مررت عليها والحالة الأخيرة لكل ملف." onPress={onOpenHistory} />
          <ListItem title="المالية" subtitle="المستحقات والملخص المالي بعد اكتمال الاعتماد." onPress={onOpenFinance} />
        </Surface>

        <Button label="تسجيل الخروج" tone="secondary" onPress={onLogout} />
      </MobileScrollView>
    </Box>
  );
}

export default FieldAccountHomeScreen;
