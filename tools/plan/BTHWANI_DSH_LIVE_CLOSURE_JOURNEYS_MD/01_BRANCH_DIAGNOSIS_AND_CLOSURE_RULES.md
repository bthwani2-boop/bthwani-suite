---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-closure-by-journeys-and-slices
language: ar
---

# 01 — تشخيص الفرع وقواعد الإغلاق والتنظيف

## نطاق التشخيص

الفرع: `feat/dsh-surface-refactor`
المسار المحلي: `C: thwani-suite`
الوضع المطلوب: إغلاق حي كامل Full-stack، وليس UI-only ولا Preview.

## قراءة الفرع كإشارات تشغيلية

### 1. الفرع يحتوي منظومة guards كبيرة

يجب التعامل مع guards كجزء من الإغلاق، لا كأمر اختياري. الحد الأدنى:

```powershell
Set-Location -LiteralPath "C:thwani-suite"

pnpm run openapi:lint:dsh
pnpm run openapi:types:dsh
pnpm run openapi:lint:wlt
pnpm run openapi:types:wlt
pnpm run guard:ast-grep:live-boundaries
pnpm run guard:depcruise:live-boundaries
pnpm run guard:no-broken-imports
pnpm run guard:real-media-runtime
pnpm run guard:bthwani-full-stack
pnpm run guard:service-postgres-runtime
pnpm run guard:service-runtime
pnpm run guard:platform-vars
pnpm run guard:operating-model
pnpm run guard:secret-scan
pnpm run guard:ui-kit-central-design-ownership
pnpm run guard:tamagui-import-boundary
pnpm run guard:playwright:control-panel
pnpm -w exec tsc --noEmit
```

### 2. DSH API يغطي رحلة تشغيلية عميقة

يجب أن يثبت الإغلاق هذه الطبقات:

- Store onboarding/discovery.
- Field readiness.
- Store visibility gates.
- Product/category/catalog/media.
- Cart/serviceability.
- Checkout intent.
- WLT callback.
- Order lifecycle.
- Captain lifecycle.
- Support escalation.
- Refund callback.

### 3. WLT boundary غير قابل للكسر

أي منطق مالي داخل DSH يعتبر تسربًا ويجب نقله أو عزله. DSH يحتفظ بالمراجع فقط:

```text
wlt_payment_ref_id
wlt_refund_ref_id
wlt_settlement_ref_id
```

WLT وحده يملك:

```text
payment sessions
refunds
settlements
wallet balances
ledger entries
payouts
```

### 4. سطح العميل أصبح model/binding-driven

`DshClientSurface.tsx` في الفرع صغير ويستدعي model مركزي. هذا جيد تنظيميًا لكنه يخلق خطرًا آخر: أي خلل داخل binding/model قد يكسر عدة شاشات دفعة واحدة. لذلك كل رحلة يجب أن تفحص:

- هل الـ model يقرأ من runtime حقيقي؟
- هل يوجد fallback preview؟
- هل names مثل `walletPreview` مجرد تسمية قديمة أم leak فعلي؟
- هل route renderer يعرض كل states؟
- هل bottom navigation لا يخفي المحتوى؟

### 5. WLT shared layer يحتوي قاعدة واضحة

يجب الحفاظ على هذا القانون:

```text
no dev fallback IDs
no mock data
no surface-specific hooks
WLT finance mutations only in WLT layer
never in dsh/frontend/shared
```

أي مخالفة لهذه القاعدة داخل شريحة مالية = `FIX_REQUIRED`.

## مصفوفة تشخيص إلزامية لكل شريحة

استخدم هذه الجدول داخل كل شريحة قبل الإغلاق:

| البند | سؤال التشخيص | قرار |
|---|---|---|
| Runtime truth | هل الفيتشر يقرأ/يكتب عبر API حقيقي؟ | PASS/FIX/BLOCKED |
| UI action | هل كل زر ينتج أثرًا قابلًا للرصد؟ | PASS/FIX |
| API coverage | هل endpoint موجود ومستخدم؟ | PASS/FIX |
| DB proof | هل الكتابة ظهرت في PostgreSQL؟ | PASS/FIX |
| WLT boundary | هل المال بقي داخل WLT؟ | PASS/FIX |
| Media boundary | هل binary خارج DB؟ | PASS/FIX |
| Actor scope | هل الدور الصحيح فقط يرى/ينفذ؟ | PASS/FIX |
| Design | هل الشاشة premium/RTL/low-noise؟ | PASS/FIX |
| States | loading/empty/error/success/offline/disabled | PASS/FIX |
| Duplication | هل يوجد مكرر؟ | KEEP/MERGE/RETIRE |
| Dead code | هل يوجد ملف غير مستخدم؟ | KEEP/RETIRE/BLOCKED |
| Preview leak | هل يوجد preview/demo/static في runtime؟ | PASS/FIX |
| Ownership | هل الملف في owner الصحيح؟ | PASS/MOVE |
| Evidence | هل الأدلة كاملة؟ | PASS/NEEDS_EVIDENCE |


## تعريفات التشخيص والتنظيف داخل كل شريحة

### ما يعتبر كودًا مكررًا

اعتبر الملف/الدالة/المكون مكررًا إذا تحقق أي بند:

- نفس الغرض موجود في أكثر من surface: `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel` بدون سبب ملكية واضح.
- مكون UI محلي يعيد إنتاج Button/Card/Header/List/State موجود أو يجب أن يكون في `@bthwani/ui-kit`.
- mapper أو adapter يكرر تحويل نفس contract بدل shared mapper واحد.
- hook محلي يكرر runtime client أو auth/session أو visibility logic.
- screen registry أو route renderer يحتوي نفس route أو نفس screen purpose بأسماء مختلفة.
- preview/demo/static data يستخدم لتعويض endpoint موجود.

**الإجراء:** صنفه: `MERGE_DUPLICATE` أو `MOVE_TO_OWNER` أو `REFACTOR_SPLIT`. لا تحذف قبل import/export/route/runtime scan.

### ما يعتبر كودًا ميتًا

اعتبره ميتًا إذا:

- لا يوجد import/export إليه.
- لا يظهر في route registry أو screen renderer أو navigation bridge.
- لا يظهر في typed client أو API binding أو tests.
- لا يدخل في build target أو package export.
- تم استبداله بملف جديد وبقي القديم غير مستخدم.
- يحتوي أسماء preview/demo/old/legacy ولا يوجد gate dev-only واضح.

**الإجراء:** `RETIRE_DEAD` فقط بعد إثبات عدم وجود references، ثم `git diff --check` و`tsc`.

### ما يعتبر منطقًا متسربًا

اعتبر المنطق متسربًا إذا:

- DSH يحسب أو ينفذ دفع/استرداد/تسوية/ledger بدل WLT.
- app shell يملك منطق service/backend بدل أن يكون thin delivery shell.
- screen يستورد Tamagui مباشرة بدل `@bthwani/ui-kit`.
- control-panel يكتب حالة مالية مباشرة بدل WLT API.
- app-client يعتمد على hardcoded store/order/wallet data في runtime.
- dev fixture route يعمل في live runtime.

**الإجراء:** `MOVE_TO_OWNER` أو `FIX_REQUIRED` داخل نفس الشريحة.

### ما يعتبر منطقًا ناقصًا

اعتبره ناقصًا إذا:

- UI action لا ينتج request حقيقي.
- API موجود ولا توجد واجهة تشغيل له في السطح المناسب.
- success فقط موجودة بدون loading/empty/error/offline/disabled.
- لا توجد validation/error mapping من backend إلى UI.
- لا يوجد audit/status history عند تغيير حالة تشغيلية.
- لا توجد idempotency في الدفع/callback/settlement/refund.
- لا توجد DB proof أو state transition proof.
- لا يوجد role/actor boundary.

**الإجراء:** أضف المنطق فورًا أو صنفه `BLOCKED_NEEDS_EVIDENCE` مع سبب تقني محدد ومسار إصلاح.

## أوامر الأدلة المشتركة بعد كل شريحة

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

للشرائح الحساسة أو متعددة الملفات:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short > ".\LOCAL_CHANGE_STATUS.txt"
git --no-pager diff --stat > ".\LOCAL_CHANGE_DIFF_STAT.txt"
git --no-pager diff --name-status > ".\LOCAL_CHANGE_NAME_STATUS.txt"
git --no-pager diff --check > ".\LOCAL_CHANGE_DIFF_CHECK.txt"
git --no-pager diff -- . > ".\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > ".\LOCAL_CHANGE_UNTRACKED_FILES.txt"
```
