'use client';

import React from 'react';
import { Box, KeyValueList, MobileScrollView, MobileStickyPrimaryAction, MobileWorkspaceHeader, Surface, Text, TextField } from '@bthwani/ui-kit';

export type DshInventoryManagementScreenProps = {
  onBack?: () => void;
};

export function DshInventoryManagementScreen({ onBack }: DshInventoryManagementScreenProps) {
  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 112 }}>
      <MobileWorkspaceHeader
        title="طلب منتج من الشريك"
        description="إدخال المنتج يبدأ هنا، ثم ينتقل إلى مراجعة الشركاء قبل التسويق ثم الكتالوج النهائي."
        icon="cube-outline"
        onBack={onBack}
      />

      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={2}>
          <Text role="label" tone="muted">
            بيانات المنتج
          </Text>
          <Text role="bodySm" tone="muted">
            احتفظ بالمدخلات الأساسية فقط في هذه المرحلة لتبقى الموافقة واضحة وسريعة.
          </Text>
        </Box>
        <TextField label="اسم المنتج" value="زيت زيتون بكر ممتاز" editable={false} onChangeText={() => undefined} />
        <TextField label="الفئة الرئيسية" value="المقاضي" editable={false} onChangeText={() => undefined} />
        <TextField label="مصدر الإضافة" value="app-partner" editable={false} onChangeText={() => undefined} />
        <TextField label="ملاحظة" value="يُرسل أولًا إلى بوابة الشركاء ثم التسويق." editable={false} onChangeText={() => undefined} />
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Box gap={2}>
          <Text role="label" tone="muted">
            سلسلة الاعتماد
          </Text>
          <Text role="bodySm" tone="muted">
            المنتج لا ينزل إلى الكتالوج إلا بعد أن يمر على البوابتين بترتيب واضح.
          </Text>
        </Box>
        <KeyValueList
          items={[
            { label: 'المرحلة 1', value: 'إرسال من الشريك' },
            { label: 'المرحلة 2', value: 'مراجعة الشركاء', tone: 'warning' },
            { label: 'المرحلة 3', value: 'مراجعة التسويق', tone: 'brand' },
            { label: 'المرحلة 4', value: 'نشر في الكتالوج', tone: 'success' },
          ]}
        />
      </Surface>

      <Surface tone="inset" padding={3} gap={2}>
        <Text role="bodySm" tone="muted">
          هذه الشاشة UI-only الآن وتثبت موضع الإدخال في بنية الريبو الجديد.
        </Text>
      </Surface>

      <MobileStickyPrimaryAction label="إرسال إلى مراجعة الشركاء" helperText="الإجراء محلي ولا ينفذ backend أو API." onPress={() => undefined} />
    </MobileScrollView>
  );
}

export default DshInventoryManagementScreen;
