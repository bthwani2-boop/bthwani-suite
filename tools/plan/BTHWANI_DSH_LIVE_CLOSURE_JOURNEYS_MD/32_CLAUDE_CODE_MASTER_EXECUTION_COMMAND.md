---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: أمر Claude Code الرئيسي
---

# 32 — أمر Claude Code الرئيسي قبل الاختبار اليدوي الحي

انسخ هذا الأمر داخل Claude Code عند الحاجة لإغلاق blockers الأساسية قبل بدء الاختبار اليدوي الحي.

```text
اعمل داخل C:\bthwani-suite فقط وعلى الفرع الحالي. لا تعمل commit ولا push ولا PR. لا تعدل dsh/docs/JOURNEYS. لا تستخدم any/cast لتعطيل TypeScript. لا تنشئ حلول preview/demo/mock/fallback. لا تكتفِ بتحديث imports إذا كانت الملكية خاطئة؛ انقل وادمج واحذف حقيقيًا وفق graph proof.

العقيدة الحاكمة:
Separate UI Shells + Unified Topic-first Full-stack Shared Engine.

القواعد:
1. dsh/frontend/shared هو عقل DSH التشغيلي.
2. wlt/frontend/dsh/shared هو عقل DSH المالي.
3. app roots وcontrol-panel roots UI-only live roots.
4. packages/ui-kit هو مصدر التصميم المركزي.
5. ممنوع منطق business/runtime/API/state-machine/status-map/next-action داخل roots.
6. ممنوع finance logic خارج WLT shared.
7. ممنوع preview/demo/mock/fallback runtime.
8. ممنوع files رفيعة/proxy لا تضيف قيمة.
9. ممنوع حذف أو نقل بدون graph/import/export/route/registry/test/consumer proof.
10. لا تعلن PASS/READY/CLOSED/100% إلا بعد أدلة رقمية.

المطلوب الآن قبل الاختبار اليدوي الحي:
1. افحص git status وdiff ولا ترجع أي تعديل سابق.
2. شغّل:
   pnpm -w exec tsc --noEmit
   pnpm --dir control-panel/runtime build
3. أصلح كل blockers بالتتابع حتى يمرّ tsc وbuild.
4. أول blockers معروفة يجب إعادة فحصها:
   - missing module داخل administration.types
   - AdminRoleId / PlatformPermissionId exports
   - DshPartnerActivationStatus غير مصدّر من ../../shared في catalogs.listing-governance.tsx
   - conflicting star exports
   - Attempted import error من stores.view-model/stores.adapters
5. عند إصلاح أي export/type:
   - ابحث عن المصدر الصحيح في shared topic.
   - إن كان النوع موجودًا داخليًا وغير مصدّر، صدّره من canonical topic/barrel.
   - إن كان غير موجود، أنشئ type مركزيًا داخل shared topic المناسب لا داخل الشاشة.
   - لا تضع type محلي داخل control-panel إذا سيستخدم عبر أسطح أو topic.
6. عند لمس أي topic:
   - انقل business/runtime/read-model logic إلى shared.
   - أبق UI-only في roots.
   - احذف duplicate بعد proof.
7. بعد نجاح build:
   - أوقف port 3000 إذا كان node/pwsh/powershell فقط.
   - امسح control-panel/runtime/.next/cache فقط.
   - شغّل:
     NEXT_PUBLIC_DSH_API_BASE_URL=http://localhost:8080
     NEXT_PUBLIC_AUTH_API_BASE_URL=http://localhost:18082
     NEXT_PUBLIC_WLT_API_BASE_URL=http://localhost:18083
     BTHWANI_ENV=local
     BTHWANI_LOCAL_LIVE_TEST=1
     pnpm --dir control-panel/runtime dev
8. افحص:
   - http://localhost:3000/
   - http://localhost:3000/administration
   - route واضح للـ catalogs/marketing إذا موجود
9. راقب logs. ممنوع وجود:
   - Attempted import error
   - conflicting star exports
   - Cannot find module
   - has no exported member
   - DshPartnerActivationStatus
   - administration.types
   - buildStoreCategories/buildStoreDeliveryModes/buildStoreTags/mapStoreDetailToScreenStore
10. Webpack PackFileCacheStrategy unexpected end of file:
   - امسح .next/cache وأعد التشغيل مرة واحدة.
   - إذا بقي وحده بدون build/type/import/export errors، صنفه WEBPACK_CACHE_WARNING_NON_BLOCKING.
11. شغّل:
   node tools/guards/guard-service-runtime.mjs --service dsh
   node tools/guards/guard-service-runtime.mjs --service wlt
   pnpm run guard:service-postgres-runtime
   pnpm run guard:no-broken-imports
   pnpm run guard:ui-kit-central-design-ownership
   pnpm run guard:tamagui-import-boundary
   git --no-pager diff --check
12. في النهاية أعطني:
   - الملفات المعدلة
   - قرار كل ملف من المصفوفة
   - سبب كل تعديل
   - نتائج tsc/build/routes/guards
   - blocker متبقٍ إن وجد

لا تبدأ رحلة يدوية إذا build يفشل. لا تعمل docs-only closure. لا تعمل commit.
```
