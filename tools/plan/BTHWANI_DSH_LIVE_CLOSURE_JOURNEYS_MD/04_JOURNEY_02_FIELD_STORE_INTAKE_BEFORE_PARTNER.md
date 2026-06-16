---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-closure-by-journeys-and-slices
language: ar
---

# 04 — الرحلة 02: إدخال المتجر من الميدان قبل إنشاء الشريك

## الهدف

بدء التشغيل من الصفر المطلق: موظف الميدان يلتقط متجرًا جديدًا قبل أن يصبح شريكًا نشطًا أو ظاهرًا للعميل.

## النطاق

app-field + control-panel readiness + DSH backend + PostgreSQL + media storage.


## القاعدة الحاكمة لكل شريحة

كل شريحة هنا ليست اختبارًا فقط. الشريحة تغلق فقط إذا أغلقت خمس طبقات معًا:

1. **التجريب الحي:** تشغيل الفيتشر من الواجهة أو API حسب مكانها الطبيعي.
2. **إضافة الناقص:** أي زر بلا API، API بلا UI، شاشة بلا state، أو مسار بلا audit يعالج فورًا داخل نفس الشريحة.
3. **التنظيف والتنظيم:** حذف/دمج/نقل/تسمية/تفكيك أي كود مكرر أو ميت أو متسرب أو خارج الملكية.
4. **مراجعة التصميم:** RTL، وضوح، CTA واحد، spacing، states، عدم drift عن `@bthwani/ui-kit`.
5. **Evidence:** screenshots + request/response + DB/logs + git/tsc/guards.

لا تستخدم `PASS / CLOSED / READY / 100%` إلا بعد Evidence Pack داخل:

```text
tools/registry/runs/<SESSION_ID>/
```

الحد الأدنى داخل كل Evidence Pack:

```text
SUMMARY.md
evidence.json
commands.log
status.txt
git-status.txt
git-diff-check.txt
tsc-noemit.txt
screenshots/
api/
db/
runtime-logs/
code-hygiene/
_HANDOFF.zip
```

## شرائح الرحلة

### Slice 02.1 Pre-Intake Taxonomy and Required Fields

**هدف الشريحة:** تحديد ما يجب جمعه قبل إنشاء store record.

#### التجريب الحي المطلوب

- تحقق من required fields في UI/API
- فحص validation للعنوان، الإحداثيات، نوع النشاط، الاتصال

#### مراجعة الفيتشرز وإضافة المنطق الناقص

- كل action ظاهر في الواجهة يجب أن يملك API/handler أو قرارًا واضحًا أنه read-only/disabled.
- كل endpoint مستخدم يجب أن يملك typed client وerror mapping وloading/success/error states.
- كل status transition يجب أن يملك precondition ورفضًا واضحًا للحالات غير المسموحة.
- كل شاشة يجب أن تغطي empty/offline/disabled، لا success فقط.
- أي feature موجود في UI ولا يعمل runtime يعتبر `FIX_REQUIRED` وليس تجميلًا.

#### تشخيص وتنظيف إلزامي داخل الشريحة

- افحص/ارفض: حقل مطلوب في API غير موجود في UI.
- افحص/ارفض: حقل في UI لا يرسل للbackend.
- افحص/ارفض: بيانات جغرافية وهمية.
- صنف كل ملف متأثر: `KEEP_ACTIVE / REFACTOR_SPLIT / MERGE_DUPLICATE / RETIRE_DEAD / MOVE_TO_OWNER / FIX_REQUIRED / BLOCKED_NEEDS_EVIDENCE`.
- لا تحذف أو تنقل قبل فحص imports/exports/routes/navigation/runtime/tests.
- أي preview/demo/mock/fallback في runtime يجب عزله أو حذفه أو ربطه بمصدر حقيقي.
- أي تكرار UI يجب أن يعود إلى `@bthwani/ui-kit` أو مكون service-owned واضح.

#### مراجعة التصميم والواجهة

- RTL صحيح: اتجاه النص، الأيقونات، chevrons، المحاذاة.
- CTA أساسي واحد لكل شاشة أو حالة.
- لا overflow/clipping في Android ولا web.
- spacing/hierarchy واضحان، بدون زحمة أو density زائدة.
- الألوان والأنماط من design authority، لا tokens محلية عشوائية.
- التفاعل الأساسي يتم في 1-2 clicks قدر الإمكان.

#### الإصلاح الفوري عند الفشل

- أضف الحقول والvalidation فورًا.

#### أدلة الإغلاق

- screenshots قبل/بعد للسطح المعني.
- request/response محفوظ داخل `api/`.
- DB proof قبل/بعد داخل `db/` عند وجود كتابة.
- runtime logs داخل `runtime-logs/`.
- code-hygiene findings داخل `code-hygiene/`.
- `git status`, `git diff --check`, `tsc`, والguards المناسبة.

#### قرار الشريحة

```text
Decision: PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | REVERT_REQUIRED
Reason:
Evidence root:
Remaining risk:
Next action:
```

### Slice 02.2 Create Field Store

**هدف الشريحة:** تنفيذ POST /stores من app-field أو tool طبيعي.

#### التجريب الحي المطلوب

- إرسال متجر جديد
- DB row
- API response
- control-panel queue

#### مراجعة الفيتشرز وإضافة المنطق الناقص

- كل action ظاهر في الواجهة يجب أن يملك API/handler أو قرارًا واضحًا أنه read-only/disabled.
- كل endpoint مستخدم يجب أن يملك typed client وerror mapping وloading/success/error states.
- كل status transition يجب أن يملك precondition ورفضًا واضحًا للحالات غير المسموحة.
- كل شاشة يجب أن تغطي empty/offline/disabled، لا success فقط.
- أي feature موجود في UI ولا يعمل runtime يعتبر `FIX_REQUIRED` وليس تجميلًا.

#### تشخيص وتنظيف إلزامي داخل الشريحة

- افحص/ارفض: store يظهر للعميل قبل الاعتماد.
- افحص/ارفض: store بلا owner/field actor.
- افحص/ارفض: عدم وجود status.
- صنف كل ملف متأثر: `KEEP_ACTIVE / REFACTOR_SPLIT / MERGE_DUPLICATE / RETIRE_DEAD / MOVE_TO_OWNER / FIX_REQUIRED / BLOCKED_NEEDS_EVIDENCE`.
- لا تحذف أو تنقل قبل فحص imports/exports/routes/navigation/runtime/tests.
- أي preview/demo/mock/fallback في runtime يجب عزله أو حذفه أو ربطه بمصدر حقيقي.
- أي تكرار UI يجب أن يعود إلى `@bthwani/ui-kit` أو مكون service-owned واضح.

#### مراجعة التصميم والواجهة

- RTL صحيح: اتجاه النص، الأيقونات، chevrons، المحاذاة.
- CTA أساسي واحد لكل شاشة أو حالة.
- لا overflow/clipping في Android ولا web.
- spacing/hierarchy واضحان، بدون زحمة أو density زائدة.
- الألوان والأنماط من design authority، لا tokens محلية عشوائية.
- التفاعل الأساسي يتم في 1-2 clicks قدر الإمكان.

#### الإصلاح الفوري عند الفشل

- أضف status lifecycle pending_review.

#### أدلة الإغلاق

- screenshots قبل/بعد للسطح المعني.
- request/response محفوظ داخل `api/`.
- DB proof قبل/بعد داخل `db/` عند وجود كتابة.
- runtime logs داخل `runtime-logs/`.
- code-hygiene findings داخل `code-hygiene/`.
- `git status`, `git diff --check`, `tsc`, والguards المناسبة.

#### قرار الشريحة

```text
Decision: PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | REVERT_REQUIRED
Reason:
Evidence root:
Remaining risk:
Next action:
```

### Slice 02.3 Field Visit Evidence

**هدف الشريحة:** تسجيل زيارة ميدانية مع notes ووقت وموقع.

#### التجريب الحي المطلوب

- POST /stores/{id}/field-visits
- DB proof
- screen state

#### مراجعة الفيتشرز وإضافة المنطق الناقص

- كل action ظاهر في الواجهة يجب أن يملك API/handler أو قرارًا واضحًا أنه read-only/disabled.
- كل endpoint مستخدم يجب أن يملك typed client وerror mapping وloading/success/error states.
- كل status transition يجب أن يملك precondition ورفضًا واضحًا للحالات غير المسموحة.
- كل شاشة يجب أن تغطي empty/offline/disabled، لا success فقط.
- أي feature موجود في UI ولا يعمل runtime يعتبر `FIX_REQUIRED` وليس تجميلًا.

#### تشخيص وتنظيف إلزامي داخل الشريحة

- افحص/ارفض: visit local-only.
- افحص/ارفض: لا يربط store_id.
- افحص/ارفض: لا audit.
- صنف كل ملف متأثر: `KEEP_ACTIVE / REFACTOR_SPLIT / MERGE_DUPLICATE / RETIRE_DEAD / MOVE_TO_OWNER / FIX_REQUIRED / BLOCKED_NEEDS_EVIDENCE`.
- لا تحذف أو تنقل قبل فحص imports/exports/routes/navigation/runtime/tests.
- أي preview/demo/mock/fallback في runtime يجب عزله أو حذفه أو ربطه بمصدر حقيقي.
- أي تكرار UI يجب أن يعود إلى `@bthwani/ui-kit` أو مكون service-owned واضح.

#### مراجعة التصميم والواجهة

- RTL صحيح: اتجاه النص، الأيقونات، chevrons، المحاذاة.
- CTA أساسي واحد لكل شاشة أو حالة.
- لا overflow/clipping في Android ولا web.
- spacing/hierarchy واضحان، بدون زحمة أو density زائدة.
- الألوان والأنماط من design authority، لا tokens محلية عشوائية.
- التفاعل الأساسي يتم في 1-2 clicks قدر الإمكان.

#### الإصلاح الفوري عند الفشل

- أضف visit repository + UI binding.

#### أدلة الإغلاق

- screenshots قبل/بعد للسطح المعني.
- request/response محفوظ داخل `api/`.
- DB proof قبل/بعد داخل `db/` عند وجود كتابة.
- runtime logs داخل `runtime-logs/`.
- code-hygiene findings داخل `code-hygiene/`.
- `git status`, `git diff --check`, `tsc`, والguards المناسبة.

#### قرار الشريحة

```text
Decision: PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | REVERT_REQUIRED
Reason:
Evidence root:
Remaining risk:
Next action:
```

### Slice 02.4 Documents and Media Proof

**هدف الشريحة:** رفع وثيقة/صورة عبر runtime media.

#### التجريب الحي المطلوب

- upload intent
- PUT object
- complete upload
- DB metadata

#### مراجعة الفيتشرز وإضافة المنطق الناقص

- كل action ظاهر في الواجهة يجب أن يملك API/handler أو قرارًا واضحًا أنه read-only/disabled.
- كل endpoint مستخدم يجب أن يملك typed client وerror mapping وloading/success/error states.
- كل status transition يجب أن يملك precondition ورفضًا واضحًا للحالات غير المسموحة.
- كل شاشة يجب أن تغطي empty/offline/disabled، لا success فقط.
- أي feature موجود في UI ولا يعمل runtime يعتبر `FIX_REQUIRED` وليس تجميلًا.

#### تشخيص وتنظيف إلزامي داخل الشريحة

- افحص/ارفض: binary في PostgreSQL.
- افحص/ارفض: dev fixture route.
- افحص/ارفض: media key وهمي.
- صنف كل ملف متأثر: `KEEP_ACTIVE / REFACTOR_SPLIT / MERGE_DUPLICATE / RETIRE_DEAD / MOVE_TO_OWNER / FIX_REQUIRED / BLOCKED_NEEDS_EVIDENCE`.
- لا تحذف أو تنقل قبل فحص imports/exports/routes/navigation/runtime/tests.
- أي preview/demo/mock/fallback في runtime يجب عزله أو حذفه أو ربطه بمصدر حقيقي.
- أي تكرار UI يجب أن يعود إلى `@bthwani/ui-kit` أو مكون service-owned واضح.

#### مراجعة التصميم والواجهة

- RTL صحيح: اتجاه النص، الأيقونات، chevrons، المحاذاة.
- CTA أساسي واحد لكل شاشة أو حالة.
- لا overflow/clipping في Android ولا web.
- spacing/hierarchy واضحان، بدون زحمة أو density زائدة.
- الألوان والأنماط من design authority، لا tokens محلية عشوائية.
- التفاعل الأساسي يتم في 1-2 clicks قدر الإمكان.

#### الإصلاح الفوري عند الفشل

- اربط MinIO/S3 أو صنف BLOCKED_MEDIA_STORAGE.

#### أدلة الإغلاق

- screenshots قبل/بعد للسطح المعني.
- request/response محفوظ داخل `api/`.
- DB proof قبل/بعد داخل `db/` عند وجود كتابة.
- runtime logs داخل `runtime-logs/`.
- code-hygiene findings داخل `code-hygiene/`.
- `git status`, `git diff --check`, `tsc`, والguards المناسبة.

#### قرار الشريحة

```text
Decision: PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | REVERT_REQUIRED
Reason:
Evidence root:
Remaining risk:
Next action:
```

### Slice 02.5 Readiness Escalation from Field

**هدف الشريحة:** إنشاء escalation عند نقص وثائق أو عنوان.

#### التجريب الحي المطلوب

- POST readiness escalation
- CP queue
- status update

#### مراجعة الفيتشرز وإضافة المنطق الناقص

- كل action ظاهر في الواجهة يجب أن يملك API/handler أو قرارًا واضحًا أنه read-only/disabled.
- كل endpoint مستخدم يجب أن يملك typed client وerror mapping وloading/success/error states.
- كل status transition يجب أن يملك precondition ورفضًا واضحًا للحالات غير المسموحة.
- كل شاشة يجب أن تغطي empty/offline/disabled، لا success فقط.
- أي feature موجود في UI ولا يعمل runtime يعتبر `FIX_REQUIRED` وليس تجميلًا.

#### تشخيص وتنظيف إلزامي داخل الشريحة

- افحص/ارفض: escalation لا يظهر في CP.
- افحص/ارفض: لا owner team.
- افحص/ارفض: لا status transition.
- صنف كل ملف متأثر: `KEEP_ACTIVE / REFACTOR_SPLIT / MERGE_DUPLICATE / RETIRE_DEAD / MOVE_TO_OWNER / FIX_REQUIRED / BLOCKED_NEEDS_EVIDENCE`.
- لا تحذف أو تنقل قبل فحص imports/exports/routes/navigation/runtime/tests.
- أي preview/demo/mock/fallback في runtime يجب عزله أو حذفه أو ربطه بمصدر حقيقي.
- أي تكرار UI يجب أن يعود إلى `@bthwani/ui-kit` أو مكون service-owned واضح.

#### مراجعة التصميم والواجهة

- RTL صحيح: اتجاه النص، الأيقونات، chevrons، المحاذاة.
- CTA أساسي واحد لكل شاشة أو حالة.
- لا overflow/clipping في Android ولا web.
- spacing/hierarchy واضحان، بدون زحمة أو density زائدة.
- الألوان والأنماط من design authority، لا tokens محلية عشوائية.
- التفاعل الأساسي يتم في 1-2 clicks قدر الإمكان.

#### الإصلاح الفوري عند الفشل

- أضف queue/list/update.

#### أدلة الإغلاق

- screenshots قبل/بعد للسطح المعني.
- request/response محفوظ داخل `api/`.
- DB proof قبل/بعد داخل `db/` عند وجود كتابة.
- runtime logs داخل `runtime-logs/`.
- code-hygiene findings داخل `code-hygiene/`.
- `git status`, `git diff --check`, `tsc`, والguards المناسبة.

#### قرار الشريحة

```text
Decision: PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | REVERT_REQUIRED
Reason:
Evidence root:
Remaining risk:
Next action:
```

### Slice 02.6 Cleanup and Design Review

**هدف الشريحة:** مراجعة app-field screens والsections.

#### التجريب الحي المطلوب

- route registry
- screen renderer
- imports
- screenshots

#### مراجعة الفيتشرز وإضافة المنطق الناقص

- كل action ظاهر في الواجهة يجب أن يملك API/handler أو قرارًا واضحًا أنه read-only/disabled.
- كل endpoint مستخدم يجب أن يملك typed client وerror mapping وloading/success/error states.
- كل status transition يجب أن يملك precondition ورفضًا واضحًا للحالات غير المسموحة.
- كل شاشة يجب أن تغطي empty/offline/disabled، لا success فقط.
- أي feature موجود في UI ولا يعمل runtime يعتبر `FIX_REQUIRED` وليس تجميلًا.

#### تشخيص وتنظيف إلزامي داخل الشريحة

- افحص/ارفض: sections/index ميت.
- افحص/ارفض: شاشة مكررة للوثائق.
- افحص/ارفض: local card بدل ui-kit.
- صنف كل ملف متأثر: `KEEP_ACTIVE / REFACTOR_SPLIT / MERGE_DUPLICATE / RETIRE_DEAD / MOVE_TO_OWNER / FIX_REQUIRED / BLOCKED_NEEDS_EVIDENCE`.
- لا تحذف أو تنقل قبل فحص imports/exports/routes/navigation/runtime/tests.
- أي preview/demo/mock/fallback في runtime يجب عزله أو حذفه أو ربطه بمصدر حقيقي.
- أي تكرار UI يجب أن يعود إلى `@bthwani/ui-kit` أو مكون service-owned واضح.

#### مراجعة التصميم والواجهة

- RTL صحيح: اتجاه النص، الأيقونات، chevrons، المحاذاة.
- CTA أساسي واحد لكل شاشة أو حالة.
- لا overflow/clipping في Android ولا web.
- spacing/hierarchy واضحان، بدون زحمة أو density زائدة.
- الألوان والأنماط من design authority، لا tokens محلية عشوائية.
- التفاعل الأساسي يتم في 1-2 clicks قدر الإمكان.

#### الإصلاح الفوري عند الفشل

- دمج المكرر ونقل components.

#### أدلة الإغلاق

- screenshots قبل/بعد للسطح المعني.
- request/response محفوظ داخل `api/`.
- DB proof قبل/بعد داخل `db/` عند وجود كتابة.
- runtime logs داخل `runtime-logs/`.
- code-hygiene findings داخل `code-hygiene/`.
- `git status`, `git diff --check`, `tsc`, والguards المناسبة.

#### قرار الشريحة

```text
Decision: PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE | REVERT_REQUIRED
Reason:
Evidence root:
Remaining risk:
Next action:
```


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
