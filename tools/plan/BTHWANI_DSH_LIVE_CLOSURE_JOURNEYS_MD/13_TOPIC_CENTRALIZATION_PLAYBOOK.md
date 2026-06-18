---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: دليل مركزة الموضوعات
---

# 13 — دليل مركزة الموضوعات

## الهدف

إنهاء التشظي الحقيقي، وليس فقط تغيير المسارات.

## قاعدة topic-first

كل موضوع له مالك واحد:

```text
marketing -> dsh/frontend/shared/marketing
catalog -> dsh/frontend/shared/catalog أو products/categories حسب الواقع
orders -> dsh/frontend/shared/orders
captain/delivery -> dsh/frontend/shared/captain أو delivery
finance -> wlt/frontend/dsh/shared
reusable UI -> packages/ui-kit
```

## خطوات مركزة أي topic

```text
1. اجمع كل الملفات ذات العلاقة بالبحث والـ graph.
2. صنف كل ملف بقرار واحد.
3. حدد canonical folder.
4. انقل business/runtime/read-model logic إلى shared.
5. أبقِ UI في surface roots فقط.
6. حدّث imports/barrels.
7. احذف duplicates بعد proof.
8. أضف guard/search إذا كان الموضوع قابلًا للارتداد.
9. شغّل verification.
```

## منع الملفات الرفيعة

لا تنشئ:

```text
marketing-client-bridge.ts
banner-proxy.ts
control-panel-banner-forwarder.ts
legacy-banner-alias.ts
```

إلا إذا كان هناك سبب runtime حقيقي ومؤقت، مع توثيق الإزالة. الأصل أن المصدر الكانوني يُستورد مباشرة.

## قاعدة التسمية

الأسماء يجب أن تعبر عن الدور، لا السطح فقط:

```text
shared/marketing/banner-central.model.ts
shared/marketing/banner-carousel.policy.ts
shared/marketing/banner-media.mapper.ts
app-client/.../banner-client-ui.tsx
control-panel/marketing/.../banner-control-panel-ui.tsx
app-partner/.../banner-partner-ui.tsx
```

التسمية لا تفرض إذا كانت تكسر imports بدون قيمة. rename فقط عند الضرورة.
