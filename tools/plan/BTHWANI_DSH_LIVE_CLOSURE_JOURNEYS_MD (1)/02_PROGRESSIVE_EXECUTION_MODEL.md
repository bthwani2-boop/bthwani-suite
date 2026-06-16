---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: نموذج التنفيذ التدريجي
---

# 02 — نموذج التنفيذ التدريجي دون حرق الرحلات

## القرار المنهجي

لا نحتاج أن نغلق كل شيء في المشروع قبل بدء أول رحلة. لكن نحتاج بوابة حد أدنى تمنع الدخول إلى اختبار يدوي حي فوق بناء مكسور أو منطق مشوه.

## مستويات العمل

### المستوى A — قبل الاختبار اليدوي الحي

يجب إغلاق blockers التي تمنع:

- `pnpm -w exec tsc --noEmit`
- `pnpm --dir control-panel/runtime build`
- تشغيل Control Panel dev على 3000
- فتح `/` و`/administration` بـ 200
- DSH/WLT runtime guards
- `git diff --check`

### المستوى B — أثناء كل رحلة

كل رحلة تنفذ وتشخص وتصحح تدريجيًا. عند لمس موضوع معين مثل `marketing`, `catalog`, `orders`, `captain`, `finance` يجب تطبيق قواعد ownership فورًا.

### المستوى C — التنظيف الشامل

التنظيف الشامل لا يعني تأجيل المشاكل الواضحة. يعني المرور المنهجي على كل الجذور بعد تثبيت الرحلات الأساسية.

## مبدأ عدم الانحراف

إذا ظهر خلل في topic أثناء رحلة، يعالج داخل نفس الموضوع. لا تنتقل إلى refactor شامل خارج نطاق الرحلة إلا إذا كان الخلل يمنع build/runtime أو يسبب تشظيًا مباشرًا.

## مثال تطبيقي

إذا بدأت رحلة Marketing/Banners ووجدت منطق carousel داخل:

```text
dsh/frontend/app-client
-dsh/frontend/control-panel/marketing
```

فالعمل الصحيح:

```text
1. إثبات الاستهلاك بالبحث والـ graph.
2. نقل العقل إلى dsh/frontend/shared/marketing.
3. إبقاء app-client/control-panel كـ UI-only renderers.
4. حذف أو دمج الملفات القديمة بعد proof.
5. منع أي banner/carousel policy خارج shared/marketing.
```

العمل الخاطئ:

```text
1. إنشاء banner-client-bridge.ts لا يفعل شيئًا.
2. ترك منطق مختلف في control-panel.
3. تغيير import path فقط.
4. إعلان cleanup بدون tsc/build/guards.
```
