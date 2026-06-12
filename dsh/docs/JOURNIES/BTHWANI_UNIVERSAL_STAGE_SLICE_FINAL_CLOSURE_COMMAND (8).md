# BTHWANI — أمر الإغلاق التنفيذي الموحّد لأي مرحلة أو شريحة

**Version:** 3.2.0-lean-essential-evidence
**Date:** 2026-06-12
**Repo:** `C:\bthwani-suite`
**Evidence Root:** `C:\bthwani-suite\tools\registry\runs`
**Use:** يُرفق مع أي مرحلة أو شريحة لضمان تنفيذ متدرج، محدود النطاق، قليل التوكنات، ومغلق بالأدلة الأساسية فقط.

---

## 0) بيانات الشريحة

املأ هذه القيم قبل البدء:

```text
JOURNEY_ID:
SLICE_ID:
PRIMARY_GOAL:
ACTOR: client | partner | captain | field | admin | WLT | system
SURFACE:
FLOW_OR_SCREEN:
KNOWN_PATHS:
FORBIDDEN_PATHS:
```

أي قيمة غير مثبتة تتحول إلى بند فحص داخل `CHECK`، لا إلى تخمين.

---

## 1) الحكم الأعلى

نفّذ داخل `C:\bthwani-suite` فقط، وعلى الشريحة المحددة فقط.
إذا كان مصدر الشريحة من `C:\bthwani-suite\dsh\docs\JOURNEYS` فتعامل معه كمرجع قراءة فقط.

الوضع المعتمد:

```text
REAL_END_TO_END_LIVE_CODE_EXECUTION
```

الوضع المرفوض:

```text
UI_PREVIEW | DEMO_ONLY | FIXTURE_DRIVEN_RUNTIME | REPORT_ONLY
```

لا تنتقل إلى شريحة أخرى إلا بعد:

```text
SLICE_VERIFIED_100_PERCENT
```

أو توقّف بسبب خارجي مثبت:

```text
BLOCKED_TRUE_EXTERNAL_REASON
```

المشاكل الموجودة داخل نطاق الشريحة لا تُعد blocker؛ تُعالج في نفس الشريحة.

---

## 2) قفل منع هروب الوكيل وإدارة السياق

هذا الأمر لا يسمح للوكيل بالهروب إلى تحليل عام أو تأجيل أو توصيات بلا تنفيذ. استخدم أقل سياق كافٍ لإصدار قرار تنفيذي صحيح.

```text
ممنوع إنهاء الشريحة بتحليل فقط أو تقرير فقط.
ممنوع طلب الانتقال أو التأجيل أو الرجوع لاحقًا إذا كان الخلل داخل نطاق الشريحة.
ممنوع إعلان blocker قبل إثبات أنه خارجي فعلًا وخارج قدرة التنفيذ الحالية.
ممنوع الاكتفاء بعبارات: يبدو، غالبًا، مبدئيًا، لاحقًا، مقبول مؤقتًا.
ممنوع تجاوز APPLY إذا أثبت CHECK وجود نقص داخل الشريحة.
ممنوع تجاوز VERIFY أو Evidence لأي تغيير.
ممنوع ترك ملف ملموس دون حالة إغلاق نهائية.
ممنوع تحويل النقص إلى ملاحظة إذا كان قابلًا للإصلاح داخل الشريحة.
افحص العلاقات أولًا بدل قراءة شاملة.
لا تلصق ملفات أو logs كاملة في الرد.
لا تحفظ المخرجات الطويلة إلا إذا كانت هي الدليل الوحيد على فشل أو تحقق مهم.
اكتب: Finding → Action → Evidence → Status.
لا تشغّل أداة إلا إذا كان ناتجها سيغير التنفيذ أو التحقق.
لا توسّع النطاق إلا بدليل اعتماد مباشر.
```

إذا لم يستطع الوكيل التنفيذ، فالرد المقبول الوحيد هو `BLOCKED_TRUE_EXTERNAL_REASON` مع دليل وسبب خارجي محدد وخطوة فك حظر واحدة فقط.

---

## 3) التسلسل الإلزامي

اتبع هذا المسار دون تجاوز:

```text
PRECHECK → CHECK → PLAN → APPLY → VERIFY → EVIDENCE → CLOSURE
```

`APPLY` ممنوع قبل تثبيت الحالة والفحص.
`CLOSURE` ممنوع قبل التحقق وحفظ الأدلة.

---

## 4) PRECHECK — تثبيت حالة Git

شغّل قبل أي تعديل واحفظ المخرجات:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git rev-parse HEAD
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git ls-files --others --exclude-standard
```

إذا ظهرت تغييرات غير مرتبطة بالشريحة، اعزلها أو وثّقها قبل المتابعة.

---

## 5) CHECK — فحص موجه

حدد ما يرتبط بالشريحة فقط:

```text
actor / surface / screen / flow
frontend / backend / API / OpenAPI / runtime / binding
imports / exports / routes / navigation / generated consumers
WLT financial boundary
data / media / fixture usage
auth / RBAC / permissions
UI states / RTL / i18n / accessibility
performance / observability / idempotency
tests / guards / smoke path
```

ابدأ بـ:

```text
bthwani-graphify-query-first
```

واستخدم عند الحاجة:

```text
bthwani-dynamic-workflow-execution-contract
bthwani-design-guard-tooling-contract
bthwani-logic-graph-guard-tooling-contract
bthwani-structure-organization-guard-tooling-contract
```

الأدوات المساندة، عند وجود سبب مباشر:

```text
graphify-out | react-scanner | ast-grep | dependency-cruiser | stylelint | style-dictionary | Playwright | Spectral | Cucumber | knip | ls-lint | jscpd | sherif
```

كل نتيجة يجب أن تتحول إلى إجراء أو تحقق أو blocker خارجي مثبت.

---

## 6) PLAN — خطة قصيرة

قبل التعديل اكتب خطة لا تتجاوز 10 أسطر:

```text
Scope:
Files to touch:
Reason per file:
Forbidden changes:
Required guards:
Rollback path:
```

أي ملف جديد خارج الخطة يعيدك إلى `CHECK`.

---

## 7) APPLY — تنفيذ الإغلاق

نفّذ أقل تغيير كافٍ لإغلاق الشريحة فعليًا، لا أقل تعديل ظاهري.

مسموح إذا أثبته `CHECK`:

```text
إضافة شاشة أو حالة أو feature لازمة.
إكمال منطق ناقص أو validation أو guard.
تصحيح API/runtime binding.
تفكيك ملف ضخم.
دمج تكرار.
حذف كود ميت بعد إثبات عدم الاستخدام.
نقل ملف للمالك الصحيح.
إصلاح UI/RTL/navigation/states.
عزل data/media fixtures عن runtime.
```

محظور:

```text
mass rename | global replace | refactor واسع بلا دليل | حذف واسع بلا proof | تغيير dependencies/lockfiles بلا ضرورة | تعطيل guards | إسكات TypeScript | any كحل تهرّبي | mocks/fallbacks/tolerated violations | إخفاء الخطأ بدل إصلاح سببه
```

---

## 8) إغلاق الملفات

كل ملف أو مجلد يتم لمسه يجب أن ينتهي إلى حالة واحدة:

```text
ACTIVE_VERIFIED
REFACTORED_VERIFIED
MERGED_VERIFIED
RETIRED_VERIFIED
MOVED_TO_OWNER_VERIFIED
UNCHANGED_VERIFIED
```

الحالات المؤقتة داخل التنفيذ فقط:

```text
KEEP_ACTIVE | REFACTOR_SPLIT | MERGE_DUPLICATE | RETIRE_DEAD | MOVE_TO_OWNER | FIX_REQUIRED | BLOCKED_NEEDS_EVIDENCE
```

لا تُغلق الشريحة مع `FIX_REQUIRED` أو `BLOCKED_NEEDS_EVIDENCE`.

قبل حذف أو نقل أو دمج أي ملف، أثبت سلامة:

```text
imports | exports | routes | navigation | screen registry | runtime dependency | API/client binding | OpenAPI/generated consumer | tests
```

---

## 9) قواعد الملكية والنطاق

### 9.1 WLT Finance

WLT هو المالك الحصري لـ:

```text
wallet | ledger | payment | refund | payout | settlement | reconciliation | balance | financial posting
```

DSH يحفظ references وحالات تشغيلية فقط.

### 9.2 DSH Data / Media Fixture Exit

أي استخدام لـ:

```text
C:\bthwani-suite\dsh\frontend\data
C:\bthwani-suite\dsh\frontend\media-fixtures
```

ينتهي إلى واحدة من الحالات التالية:

```text
MIGRATED_TO_API_VERIFIED
MIGRATED_TO_MINIO_S3_VERIFIED
ARCHIVED_LEGACY_VERIFIED
RETIRED_DEAD_VERIFIED
TEST_ONLY_VERIFIED
EVIDENCE_ONLY_VERIFIED
```

الممنوعات:

```text
runtime dependency | fallback | DSH_ENABLE_DEV_FIXTURE_MEDIA | DSH_ENABLE_MEDIA_FIXTURES | USE_PREVIEW_DATA | TOLERATED_VIOLATIONS
```

المسار الصحيح:

```text
DSH API → PostgreSQL
MinIO/S3 → media/files
dsh_media_assets → metadata/linking
```

### 9.3 UI / UX / Design

`@bthwani/ui-kit` هو سلطة التصميم.
أي مكوّن قابل لإعادة الاستخدام لا يُنفذ كنظام محلي داخل surface أو screen.

يجب حسم:

```text
loading | empty | error | offline | disabled | permission denied | validation | retry | RTL | i18n | accessibility | clear CTA | no visual drift
```

### 9.4 Umbrella / On-Demand Retrieval

الافتراضي:

```text
scoped payloads | pagination | lazy/deferred loading | IDs/references | surface-specific contracts | caching عند الحاجة
```

يُرفض over-fetching أو نسخ البيانات بين الأسطح دون سبب تشغيلي مثبت.

---

## 10) Gate Matrix

طبّق الـ Gate عندما يلامس نطاق الشريحة مجاله:

| Gate | Trigger | Closure Evidence |
|---|---|---|
| Git Safety | دائمًا | branch, SHA, status, diff, untracked |
| Scope | دائمًا | changed files داخل الشريحة |
| Rollback | حذف/نقل/refactor/API | مسار رجوع واضح |
| Security | env/logs/diff | لا secrets أو PII |
| Runtime Config | env/Docker/API base | لا hardcoding أو stale runtime truth |
| DB/Migration | schema/model/repo | migration أو سبب موثق + test |
| API/OpenAPI | endpoint/DTO/client | contract وconsumers متسقون |
| Auth/RBAC | route/action/API | UI وbackend يمنعان غير المصرح |
| Actor Journey | دائمًا | entry → action → success/failure |
| Cross-Surface | أكثر من سطح | لا تناقض بين الأسطح |
| UI States | UI | الحالات اللازمة مغطاة |
| Accessibility | UI | focus/contrast/labels/tap targets |
| RTL/i18n | UI/text | الاتجاه والصياغة سليمان |
| Performance | lists/media/API | pagination/on-demand/no over-fetching |
| Observability | runtime/backend | errors/logs قابلة للتشخيص |
| Idempotency | status/order/finance | آمن ضد retry/double submit |
| WLT Finance | مال | WLT owner وDSH references |
| Fixture Exit | data/media-fixtures | لا runtime dependency |
| Maintainability | ملف ضخم/متكرر | تفكيك أو سبب عدم المساس |
| Dependency | package/lockfile | ضرورة مثبتة + monorepo check |
| Test Strategy | دائمًا | test/guard/smoke مناسب |
| Documentation Drift | docs/contract drift | مسجل ولا يسبب لبسًا مانعًا |

فشل أي Gate منطبق يمنع `SLICE_VERIFIED_100_PERCENT`.

---

## 11) VERIFY — أوامر التحقق

الحد الأدنى دائمًا:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git ls-files --others --exclude-standard
```

أضف حسب المساس:

```powershell
pnpm -w exec tsc --noEmit   # TypeScript/frontend/shared
go test ./...               # Go/backend
```

```text
Spectral/OpenAPI guard       # API/OpenAPI
Playwright أو screenshot     # UI
knip/jscpd/dependency-cruiser/ls-lint/sherif  # تنظيم/تكرار/حدود
```

أي UI بلا دليل بصري يبقى `NEEDS_VISUAL_EVIDENCE` ولا يُغلق.

---

## 12) Evidence Pack — أدلة أساسية فقط

الهدف من Evidence هو إثبات الإغلاق بأقل ملفات كافية، لا إنشاء أرشيفات ضخمة أو هدر توكنات.

أنشئ مجلدًا واحدًا فقط لكل شريحة:

```text
C:\bthwani-suite\tools\registry\runs\<JOURNEY_OR_SLICE_ID>-YYYYMMDD-HHMMSS
```

### 12.1 الحد الأدنى الإلزامي

أنشئ هذه الملفات فقط دائمًا:

```text
summary.md
evidence.json
git-status.txt
git-diff-stat.txt
git-diff-name-status.txt
git-diff-check.txt
untracked-files.txt
files-touched.txt
```

`summary.md` يكون مختصرًا، ولا يتجاوز اللازم لإثبات:

```text
scope
files touched
changes applied
gates run
verify result
final result
```

`evidence.json` يكون فهرسًا مختصرًا للملفات والنتائج، لا نسخة مكررة من `summary.md`.

### 12.2 ملفات اختيارية فقط عند الحاجة

لا تنشئ أي ملف إضافي إلا إذا كان Gate منطبقًا أو فشل يحتاج دليلًا.

```text
commands.log                 فقط إذا احتجت تتبع الأوامر المهمة
errors.log                   فقط إذا وُجد خطأ فعلي
tsc-noemit.txt               عند لمس TypeScript/frontend/shared
go-test.txt                  عند لمس Go/backend
openapi-spectral.txt         عند لمس API/OpenAPI
knip.txt / jscpd.txt / dependency-cruiser.txt / ls-lint.txt / sherif.txt
                             عند لمس التنظيم أو التكرار أو الحدود
screenshots/                 عند لمس UI فقط وبعدد لقطات ضروري
playwright-results/          عند تشغيل Playwright فقط
runtime-logs/                فقط لمسار runtime مهم أو فشل فعلي
risk-report.md               فقط لتغيير عالي الخطورة
_HANDOFF.zip                 فقط عند الحاجة لرفع الأدلة أو تسليمها للمراجعة
```

إذا كان `_HANDOFF.zip` مطلوبًا، فيجب أن يحتوي على الملفات الأساسية والاختيارية اللازمة فقط، لا نسخة كاملة من المشروع ولا مخرجات ضخمة.

### 12.3 ممنوعات Evidence

ممنوع إنشاء أو حفظ ما يلي داخل Evidence بلا ضرورة مباشرة:

```text
نسخ كاملة من source files
نسخ كاملة من terminal logs طويلة
patch كامل إلا عند طلب Patch Review
صور كثيرة لكل الشاشة إذا تكفي لقطة أو لقطتان
raw graph dumps ضخمة من graphify-out
node_modules / dist / build / .next / coverage الضخمة
ملفات فارغة اختيارية
ملفات مكررة تحمل نفس المعنى بصيغ مختلفة
تقارير طويلة لا تضيف دليلًا جديدًا
```

قاعدة الرد النهائي: لا تلصق محتوى Evidence في الرد. اذكر المسار، أسماء الملفات الأساسية، والنتيجة المختصرة فقط.

---

## 13) CLOSURE — معيار الإغلاق

لا تستخدم `PASS / READY / CLOSED / DONE / FINAL / 100%` إلا إذا أثبتت الأدلة:

```text
النطاق محترم.
لا توجد blind spots في staged/untracked.
git diff --check ناجح.
الفحوص المطلوبة حسب نوع التغيير ناجحة.
UI/RTL/navigation سليمة عند المساس.
WLT boundary محفوظ.
لا runtime dependency على fixtures.
لا secrets.
لا dead imports أو orphan consumers في الملفات الملموسة.
يوجد test أو smoke مناسب.
Evidence Pack مختصر ومكتمل بالأساسيات فقط.
لا توجد صياغة تهرب أو تأجيل أو توصية بلا تنفيذ.
كل نقص داخل النطاق تحول إلى APPLY أو تحقق أو blocker خارجي مثبت.
```

الناتج النهائي المقبول:

```text
SLICE_VERIFIED_100_PERCENT
```

أو:

```text
BLOCKED_TRUE_EXTERNAL_REASON
```

ولا يُقبل الـ blocker إلا إذا كان سببه خارج الكود الحي وخارج قدرة التنفيذ الحالية.

---

## 14) صيغة مخرجات الوكيل

اكتب فقط:

```text
SLICE:
SCOPE:
CHECK FINDINGS:
APPLY CHANGES:
FILES CLOSED:
GATES RUN:
VERIFY RESULT:
EVIDENCE PATH:
EVIDENCE_SIZE_CHECK: هل الأدلة أساسية فقط بدون ملفات/لوجات/صور زائدة؟ نعم/لا
NO_ESCAPE_CHECK: هل بقي تحليل/تأجيل/توصية بلا تنفيذ؟ نعم/لا
RESULT:
```

إذا كان `RESULT = BLOCKED_TRUE_EXTERNAL_REASON` أضف:

```text
BLOCKER:
WHY_EXTERNAL:
EVIDENCE:
ONLY_REQUIRED_UNBLOCK_ACTION:
```
