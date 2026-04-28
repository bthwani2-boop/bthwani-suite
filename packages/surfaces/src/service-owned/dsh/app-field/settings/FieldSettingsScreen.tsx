import React from 'react';
import { Box, Button, Icon, MobileScrollView, Surface, Text, TopBar, useDirection } from '@bthwani/ui-kit';

type FieldSettingsScreenProps = {
  onBack: () => void;
};

export function FieldSettingsScreen({ onBack }: FieldSettingsScreenProps) {
  const { language, setLanguage } = useDirection();

  return (
    <Box style={{ flex: 1 }} background="background">
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
        <TopBar
          variant="secondary"
          title="الإعدادات"
          subtitle="إعدادات منظمة، بدون تبويب مشوه أو تغيير نوع مستقل"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={{ id: 'back', icon: <Icon name="arrow-back" size={24} tone="brand" />, mirrorInRtl: true, accessibilityLabel: 'العودة', onPress: onBack }}
        />

        <Surface tone="raised" padding={4} gap={3} radiusToken="xl">
          <Text role="titleMd" style={{ textAlign: 'right' }}>لغة العرض</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>نوع الدور ثابت كميداني onboarding فقط، لذلك لم يعد هناك أي خيار منفصل لتغيير النوع.</Text>
          <Box layoutDirection="row" gap={2}>
            <Button label="العربية" tone={language === 'ar' ? 'primary' : 'secondary'} fullWidth={false} style={{ flex: 1 }} onPress={() => setLanguage('ar')} />
            <Button label="English" tone={language === 'en' ? 'primary' : 'secondary'} fullWidth={false} style={{ flex: 1 }} onPress={() => setLanguage('en')} />
          </Box>
        </Surface>
      </MobileScrollView>
    </Box>
  );
}

export default FieldSettingsScreen;