# BThwani Safe Root Architecture Migration Execution Plan — Detailed

**File:** `BTHWANI_SAFE_ROOT_ARCH_MIGRATION_EXECUTION_PLAN_DETAILED.md`  
**Version:** 2.0.0  
**Date:** 2026-05-03  
**Repo:** `C:\bthwani-suite`  
**Purpose:** خطة تنفيذ تفصيلية وآمنة لهجرة `bthwani-suite` إلى Root Apps + Root Services + Root ui-kit  
**Mode:** Evidence-first / PowerShell-only / No direct mass move  
**Closure rule:** No PASS / CLOSED / 100% without evidence

---

## 1. القرار التنفيذي

الهدف النهائي المعتمد:

```text
Root Apps + Root Services + Root ui-kit
```

هذا يعني:

```text
1. التطبيقات تصبح مجلدات رئيسية:
   app-client / app-partner / app-captain / app-field / control-panel / webapp / website

2. الخدمات تصبح مجلدات رئيسية:
   dsh / wlt / knz / arb / amn / esf / mrf / snd / kwd

3. ui-kit يصبح مجلدًا رئيسيًا ومصدر التصميم الوحيد.

4. master.openapi.yaml يكون في الجذر ويربط ملفات OpenAPI الخاصة بالخدمات.

5. packages يتم تفكيكه تدريجيًا فقط بعد zero-reference proof.
```

قرار التنفيذ:

```text
Target architecture: APPROVED
Direct mass migration: FORBIDDEN
Phased migration: REQUIRED
Bridge before delete: REQUIRED
Evidence before closure: REQUIRED
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

## 3. القوالب النهائية

### 3.1 قالب التطبيق

```text
{app}
├── runtime
├── shell
├── composition
└── docs
```

وظيفة كل مجلد:

```text
runtime
= Expo / Next / boot / env / entry wiring

shell
= providers / navigation / layout / frame

composition
= service registry / public surface registry / app-level composition

docs
= decisions / QA notes / risks / migration notes / evidence references
```

ممنوع داخل التطبيق:

```text
service business logic
service backend
service domain
service screen internals
ui-kit primitives
local design system
```

---

### 3.2 قالب الخدمة

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

وظيفة كل مجلد:

```text
SERVICE_BLUEPRINT.md
= الحقيقة الحية للخدمة ومراحل الإغلاق

{service}.openapi.yaml
= عقد API الخاص بالخدمة

frontend
= أجزاء واجهة الخدمة حسب التطبيق فقط

backend
= NestJS / runtime implementation

domain
= model / rules / flows / invariants

media-fixtures
= أصول وfixtures خاصة بالخدمة

docs
= QA / binding / integration / risks / changelog / decisions
```

---

### 3.3 خريطة frontend لكل خدمة

لا يتم إنشاء مجلدات frontend غير مستخدمة.

```text
dsh:
  app-client
  app-partner
  app-captain
  app-field
  control-panel

wlt:
  app-client
  control-panel

knz:
  app-client
  control-panel

arb:
  app-client
  app-partner
  app-field
  control-panel

amn:
  app-client
  app-captain
  control-panel

esf:
  app-client
  webapp
  control-panel

mrf:
  app-client
  webapp
  control-panel

snd:
  app-client
  webapp
  control-panel

kwd:
  app-client
  webapp
  control-panel
```

---

### 3.4 قاعدة OpenAPI

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
master.openapi.yaml = index فقط
{service}.openapi.yaml = contract truth
أي endpoint غير مثبت = TBD / UNPROVEN
```

---

## 4. شرط البداية قبل أي تنفيذ

شغّل قبل كل مرحلة:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

إذا ظهرت مشاكل:

```text
تغييرات محلية غير مرتبطة = BLOCKED
diff check fails = FIX_REQUIRED
TypeScript fails قبل المرحلة = BASELINE_FAIL / BLOCKED
untracked غير معروف = NEEDS_EVIDENCE
```

---

# 5. مراحل التنفيذ التفصيلية

---

## Phase 1 — Inventory كامل بدون تعديل

### الهدف

بناء خريطة دقيقة لكل المسارات والاعتمادات قبل أي نقل.

### نوع المرحلة

```text
READ-ONLY
```

### نطاق الفحص

```text
apps/**
packages/**
services/**
governance/**
tools/**
package.json
pnpm-workspace.yaml
nx.json
tsconfig.base.json
**/project.json
```

### المطلوب عمله

أنشئ evidence folder:

```text
tools/registry/runs/ROOT_ARCH_INVENTORY-{YYYYMMDD-HHMMSS}
```

واجمع:

```text
1. imports التي تحتوي:
   @bthwani/surfaces
   @bthwani/app-shells
   @bthwani/ui-kit
   @bthwani/media-fixtures
   @bthwani/api-types
   @bthwani/api-clients

2. references النصية التي تحتوي:
   packages/
   packages\
   apps/mobile
   apps\mobile
   apps/web
   apps\web

3. كل project.json roots

4. كل tsconfig paths

5. كل pnpm workspace globs

6. كل scripts التي تشير إلى apps أو packages

7. كل governance references التي تشير إلى packages كحقيقة حالية

8. كل guard scripts التي تفترض packages/surfaces
```

### ملفات evidence المطلوبة

```text
SUMMARY.md
evidence.json
import-inventory.csv
path-reference-inventory.csv
project-root-inventory.csv
config-inventory.md
script-reference-inventory.csv
governance-reference-inventory.csv
guard-reference-inventory.csv
risk-register.md
_HANDOFF.zip
```

### ممنوع

```text
لا تعديل source files
لا تعديل configs
لا نقل ملفات
لا حذف ملفات
لا إنشاء root app/service folders
```

### التحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
```

المسموح في `git status` فقط:

```text
?? tools/registry/runs/ROOT_ARCH_INVENTORY-...
```

### بوابة الخروج

```text
PASS إذا:
- لا توجد تعديلات خارج tools/registry/runs
- _HANDOFF.zip موجود
- كل inventories موجودة
- SUMMARY.md يحدد blockers وfirst safe pilot
```

---

## Phase 2 — Compatibility Layer

### الهدف

تمكين المسارات الجديدة قبل نقل الملفات.

### نوع المرحلة

```text
CONTROLLED CONFIG + BRIDGE
```

### الملفات المتوقع لمسها حسب الجرد فقط

```text
tsconfig.base.json
pnpm-workspace.yaml
nx.json
package.json
packages/*/index.ts
packages/surfaces/src/index.ts
packages/surfaces/src/public/*
```

### المطلوب عمله

#### 2.1 إضافة aliases جديدة بدون حذف القديمة

أمثلة:

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
@bthwani/app-partner/*
@bthwani/app-captain/*
@bthwani/app-field/*
@bthwani/control-panel/*
@bthwani/webapp/*
@bthwani/website/*

@bthwani/ui-kit
@bthwani/ui-kit/*
```

#### 2.2 إضافة bridges عند وجود target فعلي

لا تنشئ bridge قبل وجود target.

مثال بعد وجود `dsh`:

```text
packages/surfaces/src/service-owned/dsh/*
→ bridge إلى dsh/frontend/*
```

### ممنوع

```text
لا حذف aliases القديمة
لا حذف packages
لا نقل خدمة كاملة
لا تغيير imports دفعة واحدة
لا كسر public exports
```

### التحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### evidence

```text
tools/registry/runs/ROOT_ARCH_COMPAT-{timestamp}/
  SUMMARY.md
  evidence.json
  changed-files.txt
  tsconfig-paths-before-after.md
  diff-check.txt
  tsc-noemit.txt
  _HANDOFF.zip
```

### بوابة الخروج

```text
PASS إذا:
- old aliases باقية
- new aliases موجودة
- TypeScript PASS
- لا حذف لمسارات قديمة
- evidence موجود
```

---

## Phase 3 — DSH Pilot

### الهدف

نقل أول خدمة كاختبار معماري مضبوط.

### المصدر

```text
packages/surfaces/src/service-owned/dsh
```

### الهدف

```text
dsh
├── SERVICE_BLUEPRINT.md
├── dsh.openapi.yaml
├── frontend
├── backend
├── domain
├── media-fixtures
└── docs
```

### خطوات التنفيذ

#### Step 1 — إنشاء root dsh skeleton

أنشئ:

```text
dsh/
dsh/frontend/
dsh/backend/
dsh/domain/
dsh/media-fixtures/
dsh/docs/
dsh/dsh.openapi.yaml
```

#### Step 2 — نقل SERVICE_BLUEPRINT.md

```text
packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md
→ dsh/SERVICE_BLUEPRINT.md
```

ثم أضف داخله:

```text
Previous owner root: packages/surfaces/src/service-owned/dsh
New target owner root: dsh
Migration status: IN_PROGRESS / BRIDGED
```

#### Step 3 — نقل frontend slices الفعلية فقط

```text
packages/surfaces/src/service-owned/dsh/app-client
→ dsh/frontend/app-client

packages/surfaces/src/service-owned/dsh/app-partner
→ dsh/frontend/app-partner

packages/surfaces/src/service-owned/dsh/app-captain
→ dsh/frontend/app-captain

packages/surfaces/src/service-owned/dsh/app-field
→ dsh/frontend/app-field

packages/surfaces/src/service-owned/dsh/control-panel
→ dsh/frontend/control-panel
```

إذا لم يكن أحدها موجودًا فعليًا، لا تنشئه كادعاء. سجله `TBD`.

#### Step 4 — إنشاء bridges

اترك bridge في المسار القديم حتى لا تنكسر imports.

#### Step 5 — إنشاء OpenAPI أولي

```text
dsh/dsh.openapi.yaml
```

محتوى أولي آمن:

```yaml
openapi: 3.1.0
info:
  title: BThwani DSH API
  version: 0.1.0
x-bthwani-status: CONTRACT_TBD
paths: {}
```

### ممنوع

```text
لا حذف المسار القديم قبل bridge
لا تغيير كامل imports دفعة واحدة
لا إدعاء API closure
لا إدعاء full DSH closure
لا نقل خدمات أخرى
```

### التحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### evidence

```text
tools/registry/runs/ROOT_ARCH_DSH_PILOT-{timestamp}/
  SUMMARY.md
  moved-paths.csv
  bridge-files.csv
  blueprint-update.md
  diff-check.txt
  tsc-noemit.txt
  _HANDOFF.zip
```

### بوابة الخروج

```text
PASS إذا:
- dsh root موجود
- SERVICE_BLUEPRINT.md محفوظ ومحدث
- dsh.openapi.yaml موجود بدون API fake truth
- old imports لا تنكسر
- TypeScript PASS
- evidence موجود
```

---

## Phase 4 — app-client Pilot

### الهدف

نقل أول تطبيق root مع فصل واضح بين التطبيق والخدمات.

### المصادر

```text
apps/mobile/app-client
packages/app-shells
packages/surfaces/src/public
packages/surfaces/src/surface-owned/app-client
```

حسب inventory فقط.

### الهدف

```text
app-client
├── runtime
├── shell
├── composition
└── docs
```

### خطوات التنفيذ

#### Step 1 — runtime

انقل app boot/runtime فقط:

```text
apps/mobile/app-client/*
→ app-client/runtime
```

لا تنقل ملفات service screens إلى runtime.

#### Step 2 — shell

انقل أو اربط فقط:

```text
providers
navigation
layout
safe-area
app-frame
```

إلى:

```text
app-client/shell
```

#### Step 3 — composition

ضع registry الخاص بتركيب خدمات app-client في:

```text
app-client/composition
```

يشير إلى الخدمات الموجودة فعليًا:

```text
dsh/frontend/app-client
wlt/frontend/app-client
knz/frontend/app-client
arb/frontend/app-client
amn/frontend/app-client
esf/frontend/app-client
mrf/frontend/app-client
snd/frontend/app-client
kwd/frontend/app-client
```

#### Step 4 — bridge

اترك bridge في:

```text
apps/mobile/app-client
```

إلى أن يتم تحديث Nx/pnpm/scripts.

### ممنوع

```text
لا نقل DSH screens إلى app-client
لا نقل WLT domain إلى app-client
لا إنشاء design system داخل app-client
لا كسر Expo commands
```

### التحقق

قبل تغيير runtime commands:

```powershell
pnpm --dir apps/mobile/app-client exec expo config --json
```

بعد تغيير runtime commands لاحقًا:

```powershell
pnpm --dir app-client/runtime exec expo config --json
```

دائمًا:

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### evidence

```text
tools/registry/runs/ROOT_ARCH_APP_CLIENT_PILOT-{timestamp}/
  SUMMARY.md
  moved-paths.csv
  bridge-files.csv
  runtime-check.txt
  diff-check.txt
  tsc-noemit.txt
  _HANDOFF.zip
```

### بوابة الخروج

```text
PASS إذا:
- app-client root موجود
- runtime/shell/composition واضحة
- لا service internals داخل app-client
- TypeScript PASS
- runtime config PASS
- evidence موجود
```

---

## Phase 5 — control-panel Pilot

### الهدف

إثبات النموذج على web/Next.

### المصدر

```text
apps/web/control-panel
packages/app-shells
packages/surfaces/src/public
packages/surfaces/src/surface-owned/control-panel
```

حسب inventory فقط.

### الهدف

```text
control-panel
├── runtime
├── shell
├── composition
└── docs
```

### خطوات التنفيذ

```text
1. نقل Next/runtime files إلى control-panel/runtime
2. نقل shell/providers/layout إلى control-panel/shell
3. نقل registry/composition إلى control-panel/composition
4. ترك bridge مؤقت للمسار القديم
5. تحديث project.json فقط عندما تكون المسارات الجديدة جاهزة
```

### ممنوع

```text
لا نقل service dashboards إلى control-panel
لا نقل DSH/WLT implementation إلى control-panel
لا تغيير visual system خارج ui-kit
```

### التحقق

قبل تغيير runtime commands:

```powershell
pnpm --dir apps/web/control-panel build
```

بعد تغيير runtime commands:

```powershell
pnpm --dir control-panel/runtime build
```

دائمًا:

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### بوابة الخروج

```text
PASS إذا:
- control-panel root موجود
- build يعمل
- لا service internals داخله
- TypeScript PASS
- evidence موجود
```

---

## Phase 6 — ui-kit Root Migration

### الهدف

نقل مصدر التصميم المركزي إلى الجذر.

### المصدر

```text
packages/ui-kit
```

### الهدف

```text
ui-kit
└── src
```

### خطوات التنفيذ

```text
1. إنشاء ui-kit root
2. نقل src كما هو
3. تحديث tsconfig path لـ @bthwani/ui-kit
4. إبقاء bridge مؤقت في packages/ui-kit إذا احتاجت الأدوات
5. تحديث Nx project root لاحقًا بعد PASS
6. تشغيل ui-kit typecheck/proof إن وجدت
```

### ممنوع

```text
لا تغيير API العام لـ ui-kit في نفس مرحلة النقل
لا إعادة تصميم components
لا إدخال service-specific components
لا إدخال Tamagui خارج ui-kit
```

### التحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

إذا كان target موجودًا:

```powershell
pnpm nx run ui-kit:typecheck
```

### بوابة الخروج

```text
PASS إذا:
- @bthwani/ui-kit يعمل
- TypeScript PASS
- ui-kit لا يستورد services/apps
- Tamagui boundary محفوظ
- evidence موجود
```

---

## Phase 7 — Remaining Services

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

### خطوات تنفيذ كل خدمة

```text
1. إنشاء root {service}
2. إنشاء SERVICE_BLUEPRINT.md أو نقله إن وجد
3. إنشاء {service}.openapi.yaml
4. نقل frontend slices الفعلية فقط
5. نقل/إنشاء backend إن وجد
6. نقل/إنشاء domain إن وجد
7. نقل media-fixtures الخاصة بالخدمة
8. إنشاء docs
9. إنشاء bridge للمسارات القديمة
10. تحديث imports تدريجيًا
11. تشغيل تحقق
```

### ممنوع

```text
لا نقل أكثر من خدمة في نفس الدفعة
لا إنشاء frontend غير مستخدم
لا API endpoints غير مثبتة
لا حذف bridge قبل تحديث كل imports
```

### بوابة الخروج لكل خدمة

```text
PASS إذا:
- root service موجود
- blueprint موجود
- openapi موجود
- media-fixtures داخل الخدمة
- old imports تعمل أو تم تحديثها بدليل
- TypeScript PASS
- evidence موجود
```

---

## Phase 8 — Remaining Apps

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

### خطوات تنفيذ كل تطبيق

```text
1. إنشاء root {app}
2. نقل runtime فقط
3. نقل shell فقط
4. إنشاء composition registry
5. نقل docs
6. إنشاء bridge للمسار القديم
7. تحديث project.json عند الاستعداد
8. تشغيل runtime check
9. تشغيل TypeScript
```

### ممنوع

```text
لا service internals داخل التطبيق
لا ui-kit duplication
لا تغيير runtime command قبل وجود المسار الجديد
```

### بوابة الخروج لكل تطبيق

```text
PASS إذا:
- root app موجود
- runtime يعمل
- لا service internals
- TypeScript PASS
- evidence موجود
```

---

## Phase 9 — Config Finalization

### الهدف

تحديث config بعد اكتمال الجذور.

### الملفات المستهدفة

```text
pnpm-workspace.yaml
tsconfig.base.json
nx.json
package.json
**/project.json
tools/scripts/*
governance/*
```

### المطلوب

```text
1. pnpm workspace يشير للجذور الجديدة
2. tsconfig paths تشير للجذور الجديدة
3. Nx roots تشير للجذور الجديدة
4. package scripts تستخدم المسارات الجديدة
5. guards تفحص المسارات الجديدة
6. governance يوسم المسارات القديمة كـ retired/legacy
```

### ممنوع

```text
لا حذف old paths حتى Phase 10
لا تغيير config بدون TypeScript PASS
```

### التحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pnpm -w exec tsc --noEmit
pnpm nx show projects
git --no-pager diff --check
```

### بوابة الخروج

```text
PASS إذا:
- workspace يعرف الجذور الجديدة
- TypeScript PASS
- Nx يرى المشاريع المطلوبة
- scripts لا تشير لمسارات قديمة إلا bridge
```

---

## Phase 10 — Package Retirement

### الهدف

تقاعد `packages` بعد zero-reference proof.

### zero-reference proof

يجب إثبات:

```text
No imports from packages/*
No tsconfig paths to packages/*
No Nx roots under packages/*
No pnpm dependency on packages/*
No scripts depend on packages/*
No active governance truth points to packages as current architecture
```

### القرار النهائي

واحد فقط:

```text
REMOVE packages
ARCHIVE packages
KEEP packages as compatibility-only temporarily
```

### ممنوع

```text
لا git clean عشوائي
لا حذف untracked بدون listing
لا حذف packages إذا بقي reference واحد
```

### التحقق

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

ثم runtime checks حسب التطبيقات المتأثرة.

### بوابة الخروج

```text
PASS إذا:
- zero-reference proof موجود
- TypeScript PASS
- runtime checks PASS
- packages retired safely
- evidence موجود
```

---

## 6. أوامر evidence القياسية

بعد كل phase:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$Session = "ROOT_ARCH_PHASE_NAME-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path "tools\registry\runs" $Session
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

git --no-pager status --short > (Join-Path $RunRoot "git-status.txt")
git --no-pager diff --check > (Join-Path $RunRoot "git-diff-check.txt")
git --no-pager diff --stat > (Join-Path $RunRoot "git-diff-stat.txt")
git --no-pager diff --name-status > (Join-Path $RunRoot "git-name-status.txt")
git ls-files --others --exclude-standard > (Join-Path $RunRoot "untracked-files.txt")
pnpm -w exec tsc --noEmit *> (Join-Path $RunRoot "tsc-noemit.txt")

Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath (Join-Path $RunRoot "_HANDOFF.zip") -Force
Write-Host "HANDOFF: $RunRoot\_HANDOFF.zip"
```

---

## 7. أوامر patch review

عند أي تغيير حساس:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

git --no-pager status --short > ".\LOCAL_CHANGE_STATUS.txt"
git --no-pager diff --stat > ".\LOCAL_CHANGE_DIFF_STAT.txt"
git --no-pager diff --name-status > ".\LOCAL_CHANGE_NAME_STATUS.txt"
git --no-pager diff --check > ".\LOCAL_CHANGE_DIFF_CHECK.txt"
git --no-pager diff --binary > ".\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > ".\LOCAL_CHANGE_UNTRACKED_FILES.txt"
```

إذا ظهرت untracked files، لا تقبل الإغلاق حتى تتم مراجعتها.

---

## 8. أوامر Copilot/Agent لكل مرحلة

### 8.1 Inventory prompt

```text
Inspect only. Do not edit any source file.

Goal:
Create full inventory for Root Apps + Root Services + Root ui-kit migration.

Scope:
C:\bthwani-suite

Find references to:
packages/
apps/mobile
apps/web
@bthwani/surfaces
@bthwani/app-shells
@bthwani/ui-kit
@bthwani/media-fixtures
@bthwani/api-types
@bthwani/api-clients

Write evidence only under:
tools/registry/runs/ROOT_ARCH_INVENTORY-{timestamp}

Create:
SUMMARY.md
evidence.json
import-inventory.csv
path-reference-inventory.csv
project-root-inventory.csv
config-inventory.md
script-reference-inventory.csv
governance-reference-inventory.csv
guard-reference-inventory.csv
risk-register.md
_HANDOFF.zip

Forbidden:
No source edits.
No moves.
No deletes.
No config changes.
No claims of PASS/CLOSED.

Final:
DONE or BLOCKED only with handoff zip path.
```

### 8.2 Compatibility prompt

```text
Execute only compatibility preparation for Root Architecture migration.

Allowed:
- Add new aliases only if inventory proves required.
- Keep all old aliases.
- Add bridge files only where target root already exists.

Forbidden:
- Do not delete old paths.
- Do not move services/apps.
- Do not rewrite all imports.
- Do not touch unrelated files.

Required verification:
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Final:
DONE or BLOCKED only with changed files and evidence path.
```

### 8.3 Pilot prompt

```text
Execute pilot migration only for:
dsh
app-client
control-panel
ui-kit

Do not touch other services or apps.

Rules:
- Preserve DSH SERVICE_BLUEPRINT truth.
- Keep old paths bridged.
- Do not move service internals into app roots.
- Do not change ui-kit public API.
- Do not delete packages.

Verification:
git --no-pager diff --check
pnpm -w exec tsc --noEmit
affected runtime checks

Final:
DONE or BLOCKED only.
```

---

## 9. الإغلاق النهائي

لا يوجد إغلاق نهائي إلا إذا:

```text
1. كل الجذور الجديدة موجودة
2. كل خدمة تملك SERVICE_BLUEPRINT.md
3. كل خدمة تملك {service}.openapi.yaml
4. كل خدمة تملك media-fixtures داخلها
5. كل تطبيق يملك runtime/shell/composition/docs فقط
6. ui-kit في الجذر ولا يملك منطق خدمة
7. master.openapi.yaml يربط كل الخدمات
8. packages لا يملك أي مرجع حي أو موسوم compatibility-only
9. tsconfig محدث
10. nx محدث
11. pnpm محدث
12. TypeScript PASS
13. diff check PASS
14. runtime checks PASS
15. evidence pack موجود
16. لا untracked/staged risk غير مفسر
```

إذا فشل شرط واحد:

```text
FIX_REQUIRED أو BLOCKED
```

ممنوع:

```text
PASS
CLOSED
100%
```

---

## 10. القرار النهائي للخطة

```text
Baseline
→ Inventory
→ Compatibility
→ DSH Pilot
→ app-client Pilot
→ control-panel Pilot
→ ui-kit Pilot
→ Remaining Services
→ Remaining Apps
→ Config Finalization
→ Package Retirement
→ Final Closure
```

لا توجد مرحلة كبرى بدون بوابة.  
لا يوجد حذف قبل صفر مراجع.  
لا يوجد إغلاق قبل أدلة.  
لا يوجد توسيع نطاق داخل نفس المرحلة.  
لا يوجد اعتماد على كلام الوكيل بدون Git evidence.
