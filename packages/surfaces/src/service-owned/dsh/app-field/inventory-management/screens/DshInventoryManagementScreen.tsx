'use client';

import React from 'react';
import { BthBox, BthFormScreenShell, BthKeyValueList, BthSectionHeader, BthText, BthTextField } from '@bthwani/ui-kit';

export function DshInventoryManagementScreen() {
  return (
    <BthFormScreenShell
      title="إدخال منتج من الميداني"
      subtitle="المنتج يبدأ من الحقل، ثم يمر على الشركاء، ثم التسويق، ثم يظهر في الكتالوج النهائي."
      submitLabel="إرسال إلى بوابة الشركاء"
    >
      <BthBox gap={3}>
        <BthSectionHeader
          title="بيانات الإضافة"
          subtitle="الحقل يثبت فقط ما تحتاجه المراجعة الأولى قبل أن ينتقل المنتج إلى البوابة التالية."
        />
        <BthTextField label="اسم المنتج" value="صندوق كوكيز موسمية" editable={false} onChangeText={() => undefined} />
        <BthTextField label="الفئة الرئيسية" value="المطاعم" editable={false} onChangeText={() => undefined} />
        <BthTextField label="مصدر الإضافة" value="app-field" editable={false} onChangeText={() => undefined} />
        <BthTextField label="ملاحظة" value="تمت إضافة المنتج من الميداني ويحتاج مراجعة الشركاء أولًا." editable={false} onChangeText={() => undefined} />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader
          title="سلسلة الحوكمة"
          subtitle="المنتج لا يصبح مرئيًا لكل الشركاء إلا بعد المرور على مراحل الاعتماد كلها."
        />
        <BthKeyValueList
          items={[
            { label: 'المرحلة 1', value: 'إرسال من الميداني' },
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
