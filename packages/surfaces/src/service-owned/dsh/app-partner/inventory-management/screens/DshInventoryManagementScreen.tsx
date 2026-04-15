'use client';

import React from 'react';
import { BthBox, BthFormScreenShell, BthKeyValueList, BthSectionHeader, BthText, BthTextField } from '@bthwani/ui-kit';

export function DshInventoryManagementScreen() {
  return (
    <BthFormScreenShell
      title="طلب منتج من الشريك"
      subtitle="إدخال المنتج يبدأ هنا، ثم ينتقل إلى مراجعة الشركاء قبل التسويق ثم الكتالوج النهائي."
      submitLabel="إرسال إلى مراجعة الشركاء"
    >
      <BthBox gap={3}>
        <BthSectionHeader
          title="بيانات المنتج"
          subtitle="احتفظ بالمدخلات الأساسية فقط في هذه المرحلة لتبقى الموافقة واضحة وسريعة."
        />
        <BthTextField label="اسم المنتج" value="زيت زيتون بكر ممتاز" editable={false} onChangeText={() => undefined} />
        <BthTextField label="الفئة الرئيسية" value="المقاضي" editable={false} onChangeText={() => undefined} />
        <BthTextField label="مصدر الإضافة" value="app-partner" editable={false} onChangeText={() => undefined} />
        <BthTextField label="ملاحظة" value="يُرسل أولًا إلى بوابة الشركاء ثم التسويق." editable={false} onChangeText={() => undefined} />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader
          title="سلسلة الاعتماد"
          subtitle="المنتج لا ينزل إلى الكتالوج إلا بعد أن يمر على البوابتين بترتيب واضح."
        />
        <BthKeyValueList
          items={[
            { label: 'المرحلة 1', value: 'إرسال من الشريك' },
            { label: 'المرحلة 2', value: 'مراجعة الشركاء', tone: 'warning' },
            { label: 'المرحلة 3', value: 'مراجعة التسويق', tone: 'brand' },
            { label: 'المرحلة 4', value: 'نشر في الكتالوج', tone: 'success' },
          ]}
        />
      </BthBox>

      <BthText role="caption" tone="muted">
        هذه الشاشة UI-only الآن وتثبت موضع الإدخال في بنية الريبو الجديد.
      </BthText>
    </BthFormScreenShell>
  );
}

export default DshInventoryManagementScreen;
