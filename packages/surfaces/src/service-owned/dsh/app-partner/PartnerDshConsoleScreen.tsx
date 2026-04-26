import React from 'react';
import { Box, Button, MobileScrollView, ScreenHeader, Surface, Text } from '@bthwani/ui-kit';

type Props = {
  activeServiceType: 'dsh' | 'arb';
  onOpenOrdersBoard: () => void;
  onOpenInventoryManagement: () => void;
  onOpenEntry: () => void;
  openStoreScope: () => void;
  onOpenWalletHub?: () => void;
  onOpenAccountHub?: () => void;
  onOpenSupportDirectory?: () => void;
};

export function PartnerDshConsoleScreen({ activeServiceType, onOpenOrdersBoard, onOpenInventoryManagement, onOpenEntry, openStoreScope }: Props) {
  const primaryAreas = activeServiceType === 'dsh' ? ['الطلبات', 'المنتجات', 'ساعات العمل'] as const : (['قائمة عرب', 'جدولة المسارات', 'تتبع التوزيع'] as const);
  const shortcuts = activeServiceType === 'dsh' ? ['الطلبات الجديدة', 'إدارة المنتجات', 'تحديث التوفر'] as const : (['فتح عرب اليوم', 'تحديث مسار', 'مراجعة التسليمات'] as const);

  const todayActionLabel = activeServiceType === 'dsh' ? 'ابدأ من entry' : 'إدارة عرب';

  return (
    <MobileScrollView fill padding={5} gap={5}>
      <ScreenHeader
        title={activeServiceType === 'dsh' ? 'لوحة الشريك' : 'لوحة الشريك - ARB'}
        subtitle={
          activeServiceType === 'dsh'
            ? 'هذه هي نقطة البداية الرسمية لتطبيق الشريك.'
            : 'هذه هي نقطة البداية الرسمية لتشغيل ARB.'
        }
        actionLabel={todayActionLabel}
        onActionPress={activeServiceType === 'dsh' ? onOpenEntry : undefined}
      />

      <Box layoutDirection="row" gap={3} style={{ justifyContent: 'flex-end' }}>
        <Button label="🔍" tone="ghost" onPress={() => { onOpenSupportDirectory?.(); }} />
        <Button label="الفروع" tone="ghost" onPress={() => { openStoreScope(); }} />
        <Button label="المحفظة" tone="ghost" onPress={() => { onOpenWalletHub?.(); }} />
        <Button label="الحساب" tone="ghost" onPress={() => { onOpenAccountHub?.(); }} />
      </Box>

      <Surface tone="brand" padding={5} gap={3} radiusToken="xl" border={false}>
        <Text role="label" tone="inverse">نقطة البداية الرسمية</Text>
        <Text role="titleLg" tone="inverse">
          {activeServiceType === 'dsh' ? 'تشغيل الشريك من console مركزي' : 'تشغيل ARB من console'}
        </Text>
        <Text role="bodyMd" tone="inverse">
          {activeServiceType === 'dsh'
            ? 'البداية الصحيحة لتطبيق الشريك تعرض المهام الأساسية وتشكل مدخلاً واحداً وواضحاً لفِرق التشغيل.'
            : 'وضع ARB يعرض المسارات والملاحظات الخاصة بتشغيل عرب.'}
        </Text>
      </Surface>

      <Surface tone="raised" padding={5} gap={4} radiusToken="xl">
        <Text role="label">المساحات الأساسية</Text>
        {primaryAreas.map((item) => (
          <Surface key={item} tone="default" padding={4} gap={2} radiusToken="lg">
            <Text role="bodyStrong">{item}</Text>
            <Text role="bodySm" tone="muted">هذه مساحة عملية داخل console الشريك.</Text>
          </Surface>
        ))}
      </Surface>

      <Surface tone="raised" padding={5} gap={4} radiusToken="xl">
        <Text role="label">اختصارات البداية</Text>
        <Box gap={3}>
          {shortcuts.map((item, index) => (
            <Button
              key={item}
              label={item}
              tone="secondary"
              onPress={() => {
                if (activeServiceType !== 'dsh') return;
                if (index === 0) {
                  onOpenEntry();
                  return;
                }
                if (index === 1) {
                  onOpenInventoryManagement();
                  return;
                }
                onOpenOrdersBoard();
              }}
            />
          ))}
        </Box>
      </Surface>

      <Surface tone="inset" padding={4} gap={2} radiusToken="lg">
        <Text role="label">حكم معماري</Text>
        <Text role="bodySm" tone="muted">
          {activeServiceType === 'dsh'
            ? 'DSH يجب أن يظل داخل مسارات التشغيل الحقيقية ويعرض عناصر التشغيل الأساسية.'
            : 'ARB يعزل مسارات عرب ويعرض أدوات التشغيل المناسبة.'}
        </Text>
      </Surface>

      <Button label={todayActionLabel} onPress={onOpenEntry} />
    </MobileScrollView>
  );
}

export default PartnerDshConsoleScreen;
