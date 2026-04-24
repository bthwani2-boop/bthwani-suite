'use client';

import React from 'react';
import { Box, FormScreenShell, KeyValueList, SectionHeader, Text, TextField } from '@bthwani/ui-kit';

export function DshInventoryManagementScreen() {
  return (
    <FormScreenShell
      title="طلب منتج من الشريك"
      subtitle="إدخال المنتج يبدأ هنا، ثم ينتقل إلى مراجعة الشركاء قبل التسويق ثم الكتالوج النهائي."
      submitLabel="إرسال إلى مراجعة الشركاء"
    >
      <Box gap={3}>
        <SectionHeader
          title="بيانات المنتج"
          subtitle="احتفظ بالمدخلات الأساسية فقط في هذه المرحلة لتبقى الموافقة واضحة وسريعة."
        />
        <TextField label="اسم المنتج" value="زيت زيتون بكر ممتاز" editable={false} onChangeText={() => undefined} />
        <TextField label="الفئة الرئيسية" value="المقاضي" editable={false} onChangeText={() => undefined} />
        <TextField label="مصدر الإضافة" value="app-partner" editable={false} onChangeText={() => undefined} />
        <TextField label="ملاحظة" value="يُرسل أولًا إلى بوابة الشركاء ثم التسويق." editable={false} onChangeText={() => undefined} />
      </Box>

      <Box gap={3}>
        <SectionHeader
          title="سلسلة الاعتماد"
          subtitle="المنتج لا ينزل إلى الكتالوج إلا بعد أن يمر على البوابتين بترتيب واضح."
        />
        <KeyValueList
          items={[
            { label: 'المرحلة 1', value: 'إرسال من الشريك' },
            { label: 'المرحلة 2', value: 'مراجعة الشركاء', tone: 'warning' },
            { label: 'المرحلة 3', value: 'مراجعة التسويق', tone: 'brand' },
            { label: 'المرحلة 4', value: 'نشر في الكتالوج', tone: 'success' },
          ]}
        />
      </Box>

      <Text role="caption" tone="muted">
        هذه الشاشة UI-only الآن وتثبت موضع الإدخال في بنية الريبو الجديد.
      </Text>
    </FormScreenShell>
  );
}

export default DshInventoryManagementScreen;
