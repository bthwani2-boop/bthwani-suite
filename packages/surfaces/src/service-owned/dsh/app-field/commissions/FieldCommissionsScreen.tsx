import React from 'react';
import { Box, Icon, ListItem, MobileScrollView, Surface, Text, TopBar } from '@bthwani/ui-kit';
import { resolveFieldStoreStatus, type FieldStoreFile } from '../stores/fieldStoreModel';

type FieldCommissionsScreenProps = {
  stores: readonly FieldStoreFile[];
  onBack: () => void;
};

export function FieldCommissionsScreen({ stores, onBack }: FieldCommissionsScreenProps) {
  const eligibleStores = stores.filter((store) => resolveFieldStoreStatus(store) === 'offer-approved');

  return (
    <Box style={{ flex: 1 }} background="background">
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
        <TopBar
          variant="secondary"
          title="العمولة"
          subtitle="تبقى ظاهرة للميداني بعد اكتمال الاعتماد فقط"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={{ id: 'back', icon: <Icon name="arrow-back" size={24} tone="brand" />, mirrorInRtl: true, accessibilityLabel: 'العودة', onPress: onBack }}
        />

        <Surface tone="raised" padding={4} gap={2} radiusToken="xl">
          <Text role="titleMd" style={{ textAlign: 'right' }}>إجمالي العمولة المتاحة</Text>
          <Text role="titleLg" style={{ textAlign: 'right' }}>420 ر.س</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>تُعرض فقط الملفات المكتملة للميداني والتي أصبح الشريك فيها معتمدًا.</Text>
        </Surface>

        <Surface tone="raised" padding={0} gap={0} radiusToken="xl">
          {eligibleStores.map((store) => (
            <ListItem key={store.id} title={store.name} subtitle="ملف مكتمل للميداني" meta="اعتماد نهائي" badgeLabel={store.commissionLabel} />
          ))}
        </Surface>
      </MobileScrollView>
    </Box>
  );
}

export default FieldCommissionsScreen;