import React from 'react';
import { Box, Icon, ListItem, MobileScrollView, Surface, TopBar } from '@bthwani/ui-kit';

type FieldSupportScreenProps = {
  onBack: () => void;
};

export function FieldSupportScreen({ onBack }: FieldSupportScreenProps) {
  return (
    <Box style={{ flex: 1 }} background="background">
      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 96 }}>
        <TopBar
          variant="secondary"
          title="الدعم"
          subtitle="قنوات مختصرة وواضحة للمساندة الميدانية"
          style={{ marginHorizontal: -16, marginTop: -16 }}
          trailingAction={{ id: 'back', icon: <Icon name="arrow-back" size={24} tone="brand" />, mirrorInRtl: true, accessibilityLabel: 'العودة', onPress: onBack }}
        />

        <Surface tone="raised" padding={0} gap={0} radiusToken="xl">
          <ListItem title="دعم الشركاء" subtitle="لملاحظات القبول، التعديل، واعتماد العرض." meta="partner-review@bthwani" />
          <ListItem title="دعم التسويق [TBD]" subtitle="بعد انتقال الملف من الشركاء إلى مرحلة الظهور." meta="marketing@bthwani [TBD]" />
          <ListItem title="دعم التطبيق" subtitle="مشاكل الصفحة أو الحفظ المحلي أو العودة للمسودة." meta="support-app@bthwani" />
        </Surface>
      </MobileScrollView>
    </Box>
  );
}

export default FieldSupportScreen;