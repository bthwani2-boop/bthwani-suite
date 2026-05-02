import React from 'react';
import { Box, Icon, KeyValueList, MobileScrollView, Surface, TopBar } from '@bthwani/ui-kit';

type DshFieldProfileScreenProps = {
  onBack: () => void;
};

export function DshFieldProfileScreen({ onBack }: DshFieldProfileScreenProps) {
  return (
    <Box style={{ flex: 1 }} background="background">
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
        <TopBar
          variant="secondary"
          title="بيانات الميداني"
          subtitle="بيانات عملية يحتاجها الحساب فقط"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={{ id: 'back', icon: <Icon name="arrow-back" size={24} tone="brand" />, mirrorInRtl: true, accessibilityLabel: 'العودة', onPress: onBack }}
        />

        <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
          <KeyValueList
            items={[
              { label: 'الاسم', value: 'ناصر القحطاني' },
              { label: 'الدور', value: 'fieldMember' },
              { label: 'المنطقة', value: 'شمال الرياض' },
              { label: 'بداية الوردية', value: '08:00 ص' },
              { label: 'الملفات النشطة', value: '4', tone: 'brand' },
            ]}
          />
        </Surface>
      </MobileScrollView>
    </Box>
  );
}

export default DshFieldProfileScreen;
