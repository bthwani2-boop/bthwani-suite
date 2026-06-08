import React from 'react';
import { View } from 'react-native';
import { Icon, KeyValueList, MobileScrollView, TopBar, useTheme, Box } from '@bthwani/ui-kit';

type DshFieldProfileScreenProps = {
  onBack: () => void;
};

export function DshFieldProfileScreen({ onBack }: DshFieldProfileScreenProps) {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="بيانات الميداني"
        subtitle="بيانات عملية يحتاجها الحساب فقط"
        trailingAction={{ id: 'back', icon: <Icon name="arrow-back" size={24} tone="brand" />, mirrorInRtl: true, accessibilityLabel: 'العودة', onPress: onBack }}
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 96 }}>
        <Box padding={4} gap={4}>
          <KeyValueList
            items={[
              { label: 'الاسم', value: 'ناصر القحطاني' },
              { label: 'الدور', value: 'عضو فريق الميدان' },
              { label: 'المنطقة', value: 'شمال الرياض' },
              { label: 'بداية الوردية', value: '08:00 ص' },
              { label: 'الملفات النشطة', value: '4', tone: 'brand' },
            ]}
          />
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default DshFieldProfileScreen;
