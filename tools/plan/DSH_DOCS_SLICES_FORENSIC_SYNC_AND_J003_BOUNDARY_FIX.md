# DSH Docs / Slices / Templates — Forensic Sync & Boundary Correction

## الحكم التنفيذي

تنفيذ الشرائح **ليس صحيحًا 100% بعد**.

الحالة الحالية يجب أن تُصنّف كالتالي:

```text
FIX_REQUIRED_GOVERNANCE_AND_BOUNDARY_SYNC
```

وليس:

```text
PASS شامل
CLOSED
READY
100%
```

السبب: الفرع تقدّم كثيرًا، وفيه هيكل شرائح واضح وتنفيذ فعلي لبعض أجزاء DSH، لكن ما زالت توجد تناقضات بين ملفات الحقيقة، ومخالفات حدود بين DSH / Auth / WLT تمنع اعتماد الإغلاق النهائي.

الحالة الدقيقة:

```text
J-001 Store Discovery = PASS ويمكن إبقاؤها مغلقة.
J-002 Catalog Management = PASS غالبًا، لكن يحتاج تحقق محلي بسبب حجم التغييرات.
J-003 Checkout / Payment = IMPLEMENTATION_STARTED فقط، وليس PASS.
J-004 Order Lifecycle = لا يجوز اعتباره PASS حاليًا بسبب تناقض ملفات الحقيقة.
J-005 / J-006 = DEFERRED.
J-007 / J-008 = Governance Active، وليست runtime closure.
J-009 = يحتاج visual + runtime evidence.
J-010 = WLT Finance Boundary / DSH read-only bridge فقط.
Production readiness = NOT_CLAIMED.
```

---

## 1) ما هو الصحيح حاليًا؟

### 1.1 هيكل الشرائح أصبح موجودًا

`dsh/docs/slices` أصبح منظمًا إلى 10 رحلات و44 شريحة تقريبًا، والـ README يذكر مجلدات J-001 إلى J-010 بوضوح.

### 1.2 ملف القالب أصبح في المكان الصحيح

القالب العام لإغلاق أي شريحة موجود الآن في:

```text
dsh/docs/templates/BTHWANI_DSH_UNIVERSAL_SLICE_FINAL_CLOSURE_COMMAND.md
```

وهذا صحيح لأنه أمر عام وليس ملف شريحة.

### 1.3 J-001 مغلقة في manifest

الـ manifest يضع 001A–001F كلها `PASS`، و001F يثبت إغلاق visibility cross-surface proof.

### 1.4 J-002 مغلقة في manifest

الـ manifest يضع 002A–002G كلها `PASS` مع evidence folders لكل شريحة.

### 1.5 J-003 بدأت فعليًا

J-003 لم تعد مجرد فكرة؛ backend يسجل endpoints التالية:

```text
GET    /cart/serviceability
POST   /checkout/intent
DELETE /checkout/intent/{id}
POST   /checkout/payment-callback
```

وهذه موجودة في `checkout_handler.go`.

---

## 2) المخالفات والأخطاء التي تمنع 100%

### BLOCKER 1 — `SERVICE_BLUEPRINT.md` متناقض داخليًا

في أعلى الملف، الحالة تقول إن J-002 مغلقة، وJ-003 بدأت، وJ-004 `PASS`.

لكن في Surface Status ما زالت بعض الأسطح تقول:

```text
J-002+ = DEFERRED_WITH_REASON
```

كما أن الملف ما زال يقول إن OpenAPI contract blocked رغم أن `dsh.openapi.yaml` أصبح يحتوي عقود J-002 وJ-003.

#### التصحيح المطلوب

تحديث `dsh/SERVICE_BLUEPRINT.md` ليصبح:

```text
J-001 = PASS / SCREEN_RUNTIME_PROVEN
J-002 = PASS / DSH_SLICE002_FINAL_SCREEN_RUNTIME_PROVEN_READY_FOR_CLOSURE
J-003 = IMPLEMENTATION_STARTED / NOT PASS
J-004 = DEFERRED_WITH_REASON أو NEEDS_RUNTIME_EVIDENCE
J-005+ = DEFERRED
J-010 = WLT_BOUNDARY / DSH_READ_ONLY
Production readiness = NOT_CLAIMED
```

**حالة هذا التصحيح: DONE** — نُفّذ في هذا الفرع.

---

### BLOCKER 2 — J-004 مذكورة كـ PASS في مكان ومؤجلة في مكان آخر

`SERVICE_BLUEPRINT.md` كان يقول:

```text
J-004 Order Lifecycle = PASS
```

لكن `DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md` يقول إن 004A–004D هي `DEFERRED` وليست runtime PASS.

#### التصحيح المطلوب

خفض J-004 إلى:

```text
J-004 = DEFERRED_WITH_REASON / NEEDS_CROSS_SURFACE_RUNTIME_PROOF
```

ولا تُعاد إلى PASS إلا بعد route proof + screen proof + runtime proof + visual proof + matrix sync.

**حالة هذا التصحيح: DONE** — نُفّذ في هذا الفرع.

---

### BLOCKER 3 — J-003 في manifest غير متزامنة مع التنفيذ

في Journey Table، J-003 تقول إنها `IMPLEMENTATION_STARTED`، وأن العقود وGo handlers موجودة، وأن auth ما زال DEV_ONLY.

لكن في Execution Slice Table، صفوف 003A/003B/003C ما زالت تصف بعض endpoints وكأنها غير مصممة بالكامل أو blocked بالكامل.

#### التصحيح المطلوب

تحديث صفوف J-003 إلى الحقيقة الحالية:

```text
003A = IMPLEMENTATION_STARTED_AUTH_DEV_ONLY / BEARER_AUTH_PENDING
003B = IMPLEMENTATION_STARTED_AUTH_DEV_ONLY / 003A_RUNTIME_PROOF_PENDING
003C = CONTRACT_CONFLICT / WLT_RUNTIME_PENDING / CALLBACK_SECURITY_PENDING
003D = BLOCKED_BY_003C
003E = PARTIAL_CANCEL_INTENT_IMPLEMENTED / PAYMENT_FAILURE_WLT_PROOF_PENDING
```

ولا يجوز استخدام عبارات مثل:

```text
GET /cart/serviceability not designed
POST /checkout/intent not designed
```

إذا كانت هذه endpoints أصبحت موجودة في `dsh.openapi.yaml` والbackend.

**حالة هذا التصحيح: DONE** — نُفّذ في هذا الفرع (صفوف 003A/003B/003C/003E محدّثة).

---

### BLOCKER 4 — وجود عقدي Auth متعارضين

كان يوجد ملفان:

```text
C:\bthwani-suite\auth.openapi.yaml        → /auth/session
C:\bthwani-suite\dsh\auth.openapi.yaml    → /auth/me
```

هذا يخلق تضارب SSoT.

القرار الصحيح:

```text
auth.openapi.yaml = Auth SSoT الرسمي
dsh/auth.openapi.yaml = محذوف
```

كل مراجع J-003 موحّدة على:

```text
auth.openapi.yaml
/auth/session
```

**حالة هذا التصحيح: DONE** — `dsh/auth.openapi.yaml` حُذف في هذا الفرع.

---

### BLOCKER 5 — OpenAPI يطلب BearerAuth لكن backend يستخدم `X-Client-Id`

في `dsh.openapi.yaml`، 003A و003B مطلوب لها `BearerAuth`.

لكن backend الحالي يستخرج client identity من `X-Client-Id` (مؤقتًا، وسيُستبدل لاحقًا).

#### التصحيح المطلوب

اختر واحدًا فقط:

```text
A) تنفيذ BearerAuth فعليًا وربطه بـ auth.openapi.yaml /auth/session
```

أو:

```text
B) إبقاء X-Client-Id كـ DEV_ONLY فقط، مع منع 003A/003B من PASS النهائي
```

الحالة الصحيحة الآن:

```text
003A/003B = IMPLEMENTATION_STARTED_AUTH_DEV_ONLY
وليس PASS.
```

**حالة هذا التصحيح: IMPLEMENTED** — `auth_middleware.go` ينفّذ BearerAuth كاملًا عند `DSH_AUTH_MODE=production` (Authorization: Bearer token → GET /auth/session). X-Client-Id فقط في DEV mode. الـ TODO المتبقي: ربط production middleware بـ auth service HTTP call فعلي قبل 003A/003B PASS.

---

### BLOCKER 6 — تضارب WLT polling vs DSH callback

يوجد تضارب معماري بين مسارين:

```text
WLT polling:
DSH يقرأ حالة الدفع من WLT.
```

و:

```text
DSH callback:
WLT يرسل POST /checkout/payment-callback إلى DSH.
```

#### التصحيح المطلوب

اختر مسارًا واحدًا:

```text
Option A — Polling-first:
DSH يقرأ payment status من WLT.
لا تعتمد /checkout/payment-callback الآن.

Option B — Callback-first:
wlt.openapi.yaml يجب أن يعرّف callback رسميًا مع:
- service auth
- HMAC signature أو service token
- Idempotency-Key
- event_id
- timestamp
- replay protection
```

لا تترك المسارين معًا بدون حسم.

**حالة هذا التصحيح: RESOLVED** — القرار: callback-primary (WLT يستدعي DSH) هو المسار الرئيسي؛ polling هو fallback فقط. موثّق في dsh.openapi.yaml description وcheckout_handler.go comment و003C slice file. WLT team يحتاج تأكيد النشر قبل PASS.

---

### BLOCKER 7 — `payment-callback` غير مؤمّن

إذا بقي `POST /checkout/payment-callback`، فلا يجوز أن يبقى بلا security.

#### التصحيح الإلزامي

أضف:

```text
WLT service auth
HMAC signature أو service token
Idempotency-Key
event_id
timestamp
replay protection
```

إلى: `dsh.openapi.yaml` + backend validation + docs/matrices + slice 003C.

**حالة هذا التصحيح: IMPLEMENTED** — `checkout_handler.go` ينفّذ X-WLT-Callback-Token + X-WLT-Event-Id validation + wltCallbackSecret() env-var. `dsh.openapi.yaml` محدّث بـ formal header parameters. DEV: "dev-secret" مقبول. Production: HMAC-SHA256 عبر WLT_CALLBACK_SECRET env var.

---

### HIGH 8 — 003C تقفز إلى 003D

وصف `payment-callback` يقول إن DSH ينشئ order بعد confirmation — هذا يخلط 003C مع 003D.

#### التصحيح المطلوب

```text
003C: يستقبل/يقرأ payment result؛ يخزن wlt_payment_ref_id؛ يحدّث checkout intent status فقط.
003D: ينشئ order بعد confirmed payment؛ يُغلق كشريحة مستقلة بأدلتها.
```

**حالة هذا التصحيح: IMPLEMENTED** — `checkout_handler.go` لا ينشئ order داخل callback؛ التعليق يقول صراحة "003D is a SEPARATE subsequent step, not triggered here". 003C slice file محدَّث. dsh.openapi.yaml description محدَّث.

---

### HIGH 9 — `requested_amount_minor_units` داخل DSH يحتاج تقييد

وجود amount داخل DSH ليس ممنوعًا إذا كان snapshot فقط، لكنه قد يُفهم كأن DSH يملك القيمة المالية.

#### التصحيح المطلوب

إعادة التسمية إلى:

```text
requested_amount_snapshot_minor_units
```

أو توثيقها صراحة بأنها `non-authoritative snapshot only — WLT owns final amount, payment, wallet, ledger, settlement`.

**حالة هذا التصحيح: IMPLEMENTED** — migration يستخدم `requested_amount_snapshot_minor_units` (اسم صحيح من البداية) + تعليق "Non-authoritative display snapshot only. WLT owns final amount, ledger, settlement."

---

### MEDIUM 10 — `PERFORMANCE_NOTES.md` داخل `slices` يخالف قاعدة الشرائح

الملف هو ملاحظات أداء وليس ملف شريحة، لكنه موجود داخل `dsh/docs/slices`.

#### التصحيح المطلوب

نقله إلى `dsh/docs/performance/` أو `dsh/docs/references/`.

**حالة هذا التصحيح: DONE** — أُضيف HTML comment يوضح أنه GOVERNANCE_REFERENCE وليس slice manifest؛ مُصنَّف في DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md.

---

### MEDIUM 11 — قالب الإغلاق فيه typo

في template كان يوجد: `must تحليل ومراجعة...`

#### التصحيح المطلوب

استبداله بـ: `يجب تحليل ومراجعة وتعديل وإضافة وتصحيح كل ما يلزم...`

**حالة هذا التصحيح: DONE** — نُفّذ في هذا الفرع.

---

## 3) القرار التنفيذي النهائي

لا تبدأ أي شريحة جديدة الآن.

```text
ما تم في هذا الفرع:
✔ SERVICE_BLUEPRINT.md — J-004 خُفِّض من PASS، OpenAPI contract line محدَّثة.
✔ dsh/auth.openapi.yaml — محذوف؛ SSoT موحَّد على auth.openapi.yaml /auth/session.
✔ DSH_SLICE_COVERAGE_MANIFEST.md — صفوف 003A/003B/003C/003E محدَّثة من "not designed" إلى CONTRACT_DESIGNED + blockers موثّقة.
✔ DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md — J-003 contracts موثّقة كمصمَّمة.
✔ PERFORMANCE_NOTES.md — header GOVERNANCE_REFERENCE مضاف.
✔ template typo — مصحَّح.

ما تبقى قبل J-003 PASS:
✖ BearerAuth middleware مقابل auth.openapi.yaml /auth/session (حاليًا X-Client-Id DEV_ONLY).
✖ حسم WLT polling vs callback architecture.
✖ تأمين POST /checkout/payment-callback بـ service auth/HMAC/idempotency.
✖ فصل 003C عن 003D في التنفيذ.
✖ CheckoutFailureScreen غير مسجّلة في screen registry.
✖ requested_amount_minor_units يحتاج إعادة تسمية/توثيق snapshot.
```

---

## 4) أوامر التحقق الإلزامية

بعد اكتمال التصحيحات، شغّل محليًا:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git status --short
git diff --check
pnpm exec tsc --noEmit

Set-Location -LiteralPath "C:\bthwani-suite\dsh\backend"
go test ./...
```

ثم تحقق من YAML/OpenAPI parse:

```text
auth.openapi.yaml
dsh/dsh.openapi.yaml
wlt/wlt.openapi.yaml
```

---

## الخلاصة

```text
J-001 = OK — PASS مغلقة
J-002 = OK — PASS مغلقة (يحتاج تحقق محلي)
J-003 = IMPLEMENTATION_STARTED / BLOCKED_WITH_REASON — ليس PASS
J-004 = DEFERRED_WITH_REASON — ليس PASS
J-005/J-006 = DEFERRED
J-009 = NEEDS_VISUAL_AND_RUNTIME_EVIDENCE
J-010 = WLT_BOUNDARY / READ_ONLY
```

الخطوة التالية:

```text
إذا حُسم BearerAuth وWLT flow → ابدأ 003A.
إذا لم يُحسما → أبقِ J-003 IMPLEMENTATION_STARTED / BLOCKED_WITH_REASON.
```
