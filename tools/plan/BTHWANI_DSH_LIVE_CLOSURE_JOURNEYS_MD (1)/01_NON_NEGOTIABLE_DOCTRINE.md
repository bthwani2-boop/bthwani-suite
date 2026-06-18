---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: العقيدة الحاكمة
---

# 01 — العقيدة الحاكمة غير القابلة للتفاوض

## القاعدة العليا

```text
Separate UI Shells + Unified Topic-first Full-stack Shared Engine
```

لا توجد تطبيقات مستقلة بعقول مختلفة. يوجد عقل موضوعي مشترك لكل DSH، وعقل مالي مشترك لكل WLT المرتبط بـ DSH، وجذور UI فقط للأسطح.

## قواعد فول ستاك الحاكمة

- لا يوجد عقل مستقل لكل تطبيق.
- لا يوجد منطق منفصل لكل سطح.
- كل التطبيقات تعمل بعقل تشغيلي موحد داخل `dsh/frontend/shared`.
- أي منطق يخدم أكثر من شاشة أو سطح يجب أن يكون في `dsh/frontend/shared`.
- أي منطق مالي مرتبط بـ DSH يجب أن يكون في `wlt/frontend/dsh/shared`.
- التطبيقات والـ control-panel ليست مصدر حقيقة، بل واجهات عرض وتشغيل فقط.
- ممنوع تشظي المنطق بين `app-client` و`app-captain` و`app-partner` و`app-field` و`control-panel`.
- ممنوع أن يكون لكل تطبيق lifecycle أو state machine أو business rules خاصة به.
- ممنوع أن يملك أي سطح سلوكًا شاذًا أو مختلفًا عن shared إلا إذا كان UI/copy/layout فقط.

## ما لا يجوز اعتباره إنجازًا

- تشغيل route بـ 200 بينما build يفشل.
- إسكات TypeScript بـ `any` أو cast لإخفاء خلل domain.
- نقل import path دون نقل الملكية الحقيقية.
- ترك ملف proxy/bridge لا يضيف إلا redirect imports.
- إنشاء folders فارغة أو thin files كثيرة.
- تحديث docs بدل الكود الحي.
- اعتماد بيانات preview/demo/mock/fallback runtime.
- إنشاء component reusable داخل app root بدل UI Kit.

## قاعدة الصرامة العملية

الصرامة لا تعني انتظار كل المشروع حتى يصبح مغلقًا قبل البدء. الصرامة تعني أن كل شريحة يتم لمسها تُصلح مسؤولياتها فورًا:

```text
check -> graph proof -> move/merge/delete/fix -> tsc/build/guards -> runtime proof
```

## التصريحات الممنوعة

لا تستخدم:

```text
PASS
CLOSED
100%
READY
FINAL
DONE
```

إلا بعد أدلة رقمية من الأوامر والـ runtime. استخدم بدلًا من ذلك:

```text
BLOCKED_NEEDS_EVIDENCE
PARTIAL_RUNTIME_STARTED
BUILD_BLOCKER_FOUND
GUARD_CONFIG_FIXED_NEEDS_RECHECK
```
