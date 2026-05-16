# 02 — Target Information Architecture

## Platform Control Plane

Target structure:

```text
Platform
├─ Overview
├─ Services
├─ Vars
├─ Providers
├─ Appearance
├─ Rollouts
├─ Health
└─ Audit & Rollback
```

## Implement now

```text
Overview
Services
Vars
Providers
Appearance
```

## Teaser/disabled now

```text
Rollouts
Health
Audit & Rollback
Contracts
Release Gates
```

## Overview

Purpose: executive health and risk view.

Cards:

- حالة المنصة
- الخدمات النشطة
- الخدمات المخفية عن العملاء
- المزودون غير المفعّلين
- مفاتيح تحتاج اختبار
- آخر تغييرات حساسة
- آخر rollback
- تحذيرات خطرة

## Services

Purpose: sovereign service enablement and client visibility.

Human controls:

- تشغيل/إيقاف خدمة كاملة.
- إظهار/إخفاء خدمة للعملاء.
- وضع الصيانة.
- تشغيل داخلي فقط.
- pilot by city/region.
- rollback.

## Vars

Purpose: sovereign variable changes by service and scope.

Human controls:

- اختر الخدمة.
- اختر النطاق.
- اختر المجال.
- عدّل value بصيغة بشرية.
- شاهد قبل/بعد.
- حاكي الأثر.
- اطلب اعتماد.
- طبّق لاحقًا.
- rollback.

## Providers

Purpose: central provider configuration for the entire platform.

Provider categories:

- مزود الخرائط
- مزود الرسائل SMS
- مزود الدفع
- مزود الاستضافة والسيرفر
- مزود التخزين
- مزود البريد
- مزود الإشعارات
- مزود التحليلات
- مزود البحث
- مزود الذكاء الاصطناعي

Default rule:

```text
Provider is platform-wide by default.
Service-level override is exceptional, explicit, governed, and hidden behind advanced controls.
```

## Appearance

Purpose: platform identity and app-wide colors.

Targets:

- تطبيق العميل
- تطبيق الشريك
- تطبيق الكابتن
- تطبيق الميداني
- لوحة التحكم
- الموقع/الويب

Controls:

- الهيدر الرئيسي
- الهيدر الفرعي
- الأزرار الرئيسية
- الخلفيات
- النصوص
- warning/success/error states
- before/after preview
- contrast check
- rollback

## Rollouts

Purpose: staged enablement and kill switches.

Future controls:

- internal only
- city pilot
- user segment
- 10/25/50/100 rollout
- emergency off

## Health

Purpose: operator-friendly health, not developer logs.

Indicators:

- مزود SMS يعمل
- مزود الدفع يعمل
- مزود الخرائط يعمل
- تطبيق العميل يستلم config
- آخر تحديث نجح
- آخر rollback
- تحذيرات تحتاج تدخل

## Audit & Rollback

Purpose: high-level audit for sensitive changes.

Fields:

- من غيّر
- متى
- السبب
- قبل/بعد
- النطاق
- الأثر
- نتيجة الاختبار
- هدف التراجع
