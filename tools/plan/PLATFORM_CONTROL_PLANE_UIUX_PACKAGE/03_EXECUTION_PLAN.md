# 03 — Execution Plan

## Phase 0 — Read-only diagnosis

Run diagnostics before writing:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager branch --show-current
git ls-files "dsh/frontend/control-panel/platform/*"
git grep -n "dsh/frontend/control-panel/control\|from './control'\|ControlPanelDshControl" -- . || $true
git grep -n "Campaign\|Seasonal\|Marketing\|Eid\|promo\|offer" -- dsh/frontend/control-panel/platform || $true
git grep -n "provider\.\|wlt\.\|VAR_" -- dsh/frontend/control-panel/platform || $true
```

Document results before applying.

## Phase 1 — Governance

Add:

```text
governance/30_PLATFORM_CONTROL_PLANE.md
```

from package file:

```text
07_GOVERNANCE_TO_ADD/30_PLATFORM_CONTROL_PLANE.md
```

Do not add many governance files.

## Phase 2 — Guard

Add:

```text
tools/guards/platform-control-plane-uiux.guard.mjs
```

from package file:

```text
08_GUARDS/platform-control-plane-uiux.guard.mjs
```

## Phase 3 — Platform shell UI

Modify:

```text
dsh/frontend/control-panel/platform/ControlPanelDshPlatformScreen.tsx
```

Goals:

- Make Overview visible.
- Add Services and Providers workspaces.
- Keep Vars and Appearance.
- Make inactive future workspaces teaser-only.
- Update copy from preview/debug to sovereign control plane.
- Keep all live action buttons disabled.

## Phase 4 — Services workspace

Create:

```text
dsh/frontend/control-panel/platform/Services/index.ts
dsh/frontend/control-panel/platform/Services/DshPlatformServicesWorkspace.tsx
dsh/frontend/control-panel/platform/Services/services.preview.ts
dsh/frontend/control-panel/platform/Services/services.types.ts
```

Use human labels.

## Phase 5 — Providers workspace

Create:

```text
dsh/frontend/control-panel/platform/Providers/index.ts
dsh/frontend/control-panel/platform/Providers/DshPlatformProvidersWorkspace.tsx
dsh/frontend/control-panel/platform/Providers/providers.preview.ts
dsh/frontend/control-panel/platform/Providers/providers.types.ts
```

Use masked key placeholders only.

## Phase 6 — Vars humanization

Do not rebuild Vars entirely unless necessary.

Correct:

- keys as secondary.
- Arabic user-facing titles as primary.
- human scope selector.
- service-first navigation.
- no long developer records as primary content.

## Phase 7 — Appearance humanization

Correct:

- app coverage.
- header primary/secondary color control preview.
- no campaign/marketing.
- no raw token names as primary user content.
- no hardcoded color policy.
- all action buttons disabled.

## Phase 8 — Verification

Run:

```powershell
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
node tools/guards/platform-control-plane-uiux.guard.mjs
```

## Phase 9 — Evidence

Create evidence zip under:

```text
tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip
```

The zip must include:

- git status
- git diff name-status
- git diff check
- tsc output
- guard output
- patch
- untracked files
- visual screenshot checklist

## Stop conditions

Stop and report BLOCKED if:

- TypeScript fails and fix is outside allowed scope.
- Required component is missing from ui-kit and adding ui-kit file would be necessary.
- Correcting imports would require broad unrelated changes.
- Runtime/API/backend is needed to proceed.

## Phases (Updated — UI Mock Design Active)

### Phase 1: Diagnose Current Platform

- Run Invoke-PlatformControlPlaneDiagnostics.ps1
- Inspect current ControlPanelDshPlatformScreen.tsx
- Verify all 5 workspace directories exist (Services, Vars, Providers, Appearance + new ones)
- Identify any technical-first UX, raw keys as titles, or deprecated control paths

### Phase 2: Replace Technical-Record UX with Human Control UX

- Ensure no provider IDs as primary headings
- Ensure no TypeScript entity names as titles
- Ensure no hardcoded hex colors
- Ensure no enabled live-action buttons
- Remove any deprecated dsh/frontend/control-panel/control/ references
- Make all labels Arabic-first, human-readable

### Phase 3: Add Mock Data Per Workspace

#### Services — mock records required

| Service | Status | Scope | Visibility |
|---|---|---|---|
| DSH Delivery | live | Global | visible |
| عونك | live | Global | visible |
| شي إن | pilot | City | visible |
| Store Pickup | internal-only | Global | hidden |
| Scheduled Orders | pilot | City | visible |

Each record must show: status, client visibility, scope, mode, last change, effect.
Disabled buttons: تشغيل / إيقاف / إظهار / إخفاء / صيانة / rollback.

#### Providers — mock records required

| Provider | Category | Environment | Status |
|---|---|---|---|
| Google Maps Platform | الخرائط | production | active |
| Twilio | الرسائل SMS | production | active |
| Telr | الدفع | production | active |
| AWS | الاستضافة | production | active |
| Firebase Storage | التخزين | production | active |
| Mailgun | البريد الإلكتروني | production | active |
| Firebase Cloud Messaging | الإشعارات | production | active |

Each record must show: status, MASKED credential, environment, priority, fallback, last test, rollback target.
Disabled buttons: إضافة مفتاح API / اختبار الاتصال / تفعيل / إيقاف / تغيير الأولوية / rollback.

#### Vars — mock records required (human labels, NOT raw keys)

| Human label | Example value | Scope | Risk |
|---|---|---|---|
| حد أهلية الكابتن لاستلام الطلبات | 4.2 نجوم | Global | medium |
| ظهور DSH في محافظة صنعاء | مفعّل | Region | high |
| زمن قبول الشريك | 90 ثانية | Global | low |
| نصف قطر الإسناد | 3.5 كم | Zone | medium |
| موعد التسويات مع الشركاء | كل أحد 10:00 ص | Global | high |

Fields: current value, proposed value, scope, change effect, simulation, approval request, apply-later, rollback.

#### Appearance — mock records required

| Label | Token target |
|---|---|
| ألوان تطبيق العميل | primary brand color |
| الهيدر الرئيسي | header background |
| الهيدر الفرعي | subheader / section header |
| الأزرار الرئيسية | CTA button color |
| الخلفيات | surface background |
| حالة النجاح | success tone |
| حالة التحذير | warning tone |
| حالة الخطأ | error/danger tone |

Fields: current token, new color picker (disabled), contrast check, approval request, apply-later, rollback.
No campaign, no marketing, no seasonal.

#### Rollouts — teaser preview (all disabled)

Show these rollout modes as informational:
- تفعيل لمدينة فقط
- تفعيل تدريجي: 10% / 25% / 50% / 100%
- Internal only
- Pilot mode
- Kill switch

#### Health — teaser preview (all disabled)

Show these health signals as informational:
- حالة المزودين الأساسيين
- حالة الخدمات السيادية
- آخر تحديث إعدادات
- آخر rollback
- تحذيرات خطرة نشطة
- خدمات مخفية عن العملاء

#### Audit & Rollback — teaser preview (all disabled)

Show these audit fields:
- من غيّر
- ماذا تغيّر (before/after)
- السبب
- النطاق
- الأثر
- هل يمكن rollback
- أزرار rollback (disabled)

### Phase 4: Verify RTL, Overflow, Disabled Actions

- All labels right-aligned RTL
- No horizontal overflow or clipping on mobile widths
- All apply/activate/save/rollback buttons are disabled
- No real secrets visible anywhere
- No technical debug-first UI

### Phase 5: Evidence Pack

- Run Invoke-PlatformControlPlaneVerify.ps1
- Run guard: node tools/guards/platform-control-plane-uiux.guard.mjs
- Capture screenshots of all 5 active workspaces
- ZIP evidence to tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip
