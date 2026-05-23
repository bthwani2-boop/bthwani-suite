# 04 — Mandatory Quality Gates

## القاعدة

اختبارات الجودة ليست نهاية الطريق. هي بين كل خطوة وخطوة.

```text
Inventory → Gate → UX/Flow → Gate → Visual → Gate → API Matrix → Gate
→ OpenAPI → Gate → Typed Client → Gate → Binding → Gate
→ Runtime → Gate → Closure
```

## Gate 1 — Git

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
git ls-files --others --exclude-standard
```

## Gate 2 — TypeScript / Build

```powershell
pnpm -w exec tsc --noEmit
```

ثم build/lint حسب السطح عند الحاجة.

## Gate 3 — Architecture

```powershell
pnpm run guard:tamagui-import-boundary
pnpm run guard:service-blueprint
pnpm run guard:binding-proof
pnpm run guard:protected-tokens
```

## Gate 4 — Security

```powershell
pnpm run guard:secret-scan
```

ويجب فحص:
- no secrets in frontend
- no tokens in logs
- no database credentials in Git
- no endpoint without auth if protected
- no userId trust from client without backend authorization

## Gate 5 — Visual / RTL

يتطلب:
- screenshot
- device/viewport
- state
- RTL
- overflow/clipping
- central color system
- no visual drift

## Gate 6 — OpenAPI

يتطلب:
- operationId
- request schema
- response schema
- error schema
- security
- pagination/on-demand retrieval when needed
- validation output

## Gate 7 — Runtime

يتطلب:
- request evidence
- response evidence
- logs
- DB proof when DB exists
- screen state proof
- Postman evidence when API exists

## Gate 8 — Cross-Surface

يسأل:
- هل العميل يتأثر؟
- هل الشريك يتأثر؟
- هل الكابتن يتأثر؟
- هل الميداني يتأثر؟
- هل لوحة التحكم تتأثر؟
- هل WLT/Auth/Notifications/Search/Vars تتأثر؟

## Gate 9 — Regression

بعد أي تغيير في ui-kit/shared/contract/navigation/state model:
- أعد فحص الرحلات السابقة.
- لا تبنِ فوق warning غير مفهوم.

## Gate 10 — Evidence Lock

لا قرار نهائي بدون:
- evidence pack
- zip under tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip
- summary
- commands log
- decision
