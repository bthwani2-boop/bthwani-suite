# BThwani Safe Root Architecture Migration Execution Plan

**File:** `BTHWANI_SAFE_ROOT_ARCH_MIGRATION_EXECUTION_PLAN.md`  
**Version:** 1.0.0  
**Date:** 2026-05-03  
**Repo:** `C:\bthwani-suite`  
**Purpose:** خطة تنفيذ تدريجية وآمنة لهجرة `bthwani-suite` إلى Root Apps + Root Services + Root ui-kit  
**Mode:** Evidence-first / PowerShell-only / No direct mass move  
**Closure rule:** No PASS / CLOSED / 100% without evidence

---

## 1. القرار التنفيذي

الهدف المعتمد:

```text
Root Apps + Root Services + Root ui-kit
```

لكن التنفيذ يجب أن يكون تدريجيًا فقط.

```text
ممنوع:
- نقل كل شيء دفعة واحدة
- حذف packages مبكرًا
- تغيير imports عشوائيًا
- تعديل tsconfig/Nx/pnpm بدون جرد
- إعلان الإغلاق بدون evidence

مسموح:
- جرد شامل
- aliases وbridges
- pilot محدود
- تحقق بعد كل مرحلة
- حذف/تقاعد paths فقط بعد zero-reference proof
```

---

## 2. الهيكل النهائي المختصر

```text
C:\bthwani-suite
├── master.openapi.yaml
├── ui-kit
│
├── app-client
├── app-partner
├── app-captain
├── app-field
├── control-panel
├── webapp
├── website
│
├── dsh
├── wlt
├── knz
├── arb
├── amn
├── esf
├── mrf
├── snd
└── kwd
```

---

## 3. قالب التطبيق النهائي

```text
{app}
├── runtime
├── shell
├── composition
└── docs
```

التطبيق يملك:

```text
runtime
providers
navigation
layout
composition
app-level public registry
app-level docs
```

التطبيق لا يملك:

```text
service business logic
service backend
service domain
service screen internals
ui-kit primitives
```

---

## 4. قالب الخدمة النهائي

```text
{service}
├── SERVICE_BLUEPRINT.md
├── {service}.openapi.yaml
├── frontend
├── backend
├── domain
├── media-fixtures
└── docs
```

الخدمة تملك:

```text
frontend service slices
backend implementation
domain model/rules/flows
service OpenAPI
service media-fixtures
service docs / QA / binding / integration notes
```

---

## 5. قاعدة OpenAPI

```text
master.openapi.yaml
```

يربط فقط:

```yaml
x-bthwani-services:
  dsh: ./dsh/dsh.openapi.yaml
  wlt: ./wlt/wlt.openapi.yaml
  knz: ./knz/knz.openapi.yaml
  arb: ./arb/arb.openapi.yaml
  amn: ./amn/amn.openapi.yaml
  esf: ./esf/esf.openapi.yaml
  mrf: ./mrf/mrf.openapi.yaml
  snd: ./snd/snd.openapi.yaml
  kwd: ./kwd/kwd.openapi.yaml
```

قاعدة صارمة:

```text
master.openapi.yaml = فهرس فقط
{service}.openapi.yaml = عقد الخدمة
ممنوع إضافة API truth غير مثبت
```

---

## 6. التحقق الحالي قبل التنفيذ

قبل أي تنفيذ:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

إذا ظهرت تغييرات غير مرتبطة:

```text
BLOCKED حتى يتم عزلها أو حفظها أو مراجعتها.
```

---

## 7. مراحل التنفيذ الآمن

## Phase 1 — Inventory فقط

### الهدف

جرد كل الاعتمادات الحالية قبل أي نقل.

### ممنوع

```text
لا تعديل ملفات
لا نقل
لا حذف
لا تغيير imports
لا تغيير configs
```

### المطلوب

إنتاج evidence تحت:

```text
tools/registry/runs/ROOT_ARCH_INVENTORY-{timestamp}
```

يشمل:

```text
SUMMARY.md
evidence.json
import-inventory.csv
path-reference-inventory.csv
workspace-config-inventory.md
_HANDOFF.zip
```

### يجب فحص references إلى:

```text
packages/
apps/mobile
apps/web
@bthwani/surfaces
@bthwani/app-shells
@bthwani/ui-kit
@bthwani/media-fixtures
@bthwani/api-types
@bthwani/api-clients
```

### بوابة الخروج

```text
PASS فقط إذا:
- لا توجد تعديلات source
- الجرد مكتمل
- _HANDOFF.zip موجود
```

---

## Phase 2 — Compatibility Layer

### الهدف

إضافة مسارات انتقالية بدون كسر القديم.

### التنفيذ

إضافة aliases/bridges تدريجيًا مع إبقاء المسارات القديمة.

أمثلة aliases مستقبلية:

```text
@bthwani/dsh/*
@bthwani/wlt/*
@bthwani/knz/*
@bthwani/arb/*
@bthwani/amn/*
@bthwani/esf/*
@bthwani/mrf/*
@bthwani/snd/*
@bthwani/kwd/*
@bthwani/app-client/*
@bthwani/control-panel/*
@bthwani/ui-kit
```

### ممنوع

```text
لا حذف aliases القديمة
لا حذف packages
لا نقل جماعي
```

### تحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### بوابة الخروج

```text
PASS فقط إذا:
- old imports تعمل
- new aliases تعمل
- TypeScript PASS
```

---

## Phase 3 — Pilot محدود

### الهدف

إثبات النموذج على أقل نطاق ممكن.

### النطاق الوحيد

```text
dsh
app-client
control-panel
ui-kit
```

### ترتيب التنفيذ

```text
1. dsh root pilot
2. app-client root pilot
3. control-panel root pilot
4. ui-kit root pilot
```

### قواعد DSH

```text
- الحفاظ على SERVICE_BLUEPRINT.md
- API / Binding / Integration تبقى TBD ما لم توجد evidence
- لا حذف للمسار القديم قبل bridge
```

### قواعد app-client/control-panel

```text
- التطبيق يملك runtime/shell/composition فقط
- منطق الخدمة يبقى داخل الخدمة
```

### قواعد ui-kit

```text
- ui-kit يملك التصميم فقط
- Tamagui داخل ui-kit فقط
- ممنوع local design systems
```

### تحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

ثم تشغيل runtime للنطاق المتأثر حسب project config.

### بوابة الخروج

```text
PASS فقط إذا:
- Pilot يعمل
- TypeScript PASS
- runtime affected PASS
- لا كسر imports القديمة
- evidence موجود
```

---

## Phase 4 — Service Migration

### الهدف

نقل بقية الخدمات واحدة واحدة.

### الترتيب

```text
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

### قاعدة كل خدمة

```text
{service}
├── SERVICE_BLUEPRINT.md
├── {service}.openapi.yaml
├── frontend
├── backend
├── domain
├── media-fixtures
└── docs
```

### ممنوع

```text
لا إنشاء frontend غير مستخدم
لا نقل خدمة ثانية داخل نفس المرحلة
لا OpenAPI truth غير مثبت
لا حذف bridge قبل اكتمال migration
```

### تحقق بعد كل خدمة

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### بوابة الخروج لكل خدمة

```text
PASS فقط إذا:
- الخدمة في الجذر
- blueprint موجود ومحدث
- openapi موجود
- media-fixtures داخل الخدمة
- TypeScript PASS
- evidence موجود
```

---

## Phase 5 — App Migration

### الهدف

نقل بقية التطبيقات واحدة واحدة.

### الترتيب

```text
app-partner
app-captain
app-field
webapp
website
```

### قاعدة كل تطبيق

```text
{app}
├── runtime
├── shell
├── composition
└── docs
```

### ممنوع

```text
لا نقل منطق الخدمة إلى التطبيق
لا تكرار public registries
لا local design system
```

### تحقق بعد كل تطبيق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

ثم تشغيل serve/build للتطبيق المتأثر.

### بوابة الخروج لكل تطبيق

```text
PASS فقط إذا:
- التطبيق يعمل
- لا يملك service internals
- TypeScript PASS
- runtime PASS
- evidence موجود
```

---

## Phase 6 — Package Retirement

### الهدف

تقاعد `packages` فقط بعد صفر مراجع حية.

### شرط قبل التقاعد

يجب إثبات:

```text
No imports from packages/*
No tsconfig paths to packages/*
No Nx roots under packages/*
No pnpm dependency on packages/*
No scripts depend on packages/*
No active governance truth points to packages as current architecture
```

### المخرجات المقبولة

واحد فقط:

```text
1. packages removed
2. packages archived
3. packages compatibility-only temporarily
```

### بوابة الخروج

```text
PASS فقط إذا:
- zero-reference proof موجود
- TypeScript PASS
- affected runtimes PASS
- guards PASS
- evidence موجود
```

---

## 8. أوامر التحقق الموحدة

بعد كل مرحلة:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

عند وجود ملفات جديدة:

```powershell
git ls-files --others --exclude-standard
```

عند الحاجة لمراجعة:

```powershell
git --no-pager diff --binary > LOCAL_CHANGE_REVIEW.patch
```

---

## 9. شروط الإغلاق النهائي

لا يحق إعلان الإغلاق إلا إذا تحققت كلها:

```text
1. root apps موجودة
2. root services موجودة
3. ui-kit في الجذر
4. master.openapi.yaml موجود
5. كل خدمة تملك openapi وmedia-fixtures
6. كل تطبيق لا يملك service internals
7. packages متقاعد أو compatibility-only بدليل
8. tsconfig paths محدثة
9. nx roots محدثة
10. pnpm workspace محدث
11. TypeScript PASS
12. runtime affected PASS
13. diff check PASS
14. service blueprints محدثة
15. evidence pack موجود
```

إذا فشل شرط واحد:

```text
القرار = FIX_REQUIRED أو BLOCKED
ممنوع PASS
ممنوع CLOSED
ممنوع 100%
```

---

## 10. أول أمر تنفيذ آمن

استخدم هذا أولًا فقط:

```text
حلّل فقط بدون تعديل أي ملف داخل C:\bthwani-suite.

الهدف:
إعداد inventory كامل لهجرة Root Apps + Root Services + Root ui-kit.

افحص:
packages/
apps/mobile
apps/web
@bthwani/surfaces
@bthwani/app-shells
@bthwani/ui-kit
@bthwani/media-fixtures
@bthwani/api-types
@bthwani/api-clients

المطلوب:
- لا تعدّل أي ملف source
- لا تنقل أي ملف
- لا تحذف أي ملف
- أنشئ evidence فقط داخل tools/registry/runs/ROOT_ARCH_INVENTORY-{timestamp}
- أنشئ _HANDOFF.zip
- اكتب SUMMARY.md مختصرًا:
  Current state / affected paths / blockers / safest next step

Verification:
git --no-pager status --short
git --no-pager diff --check

Final:
DONE أو BLOCKED فقط.
```

---

## 11. القرار النهائي

```text
الخطة المعتمدة:
Inventory → Compatibility → Pilot → Services → Apps → Retire packages

لا توجد مرحلة حذف قبل zero-reference proof.
لا توجد مرحلة إغلاق قبل TypeScript/runtime/evidence.
لا توجد هجرة جماعية.
```
