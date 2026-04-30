# Guard Implementation Map

Status: CANONICAL_GUARD_MAP  
Owner: BThwani Governance  
Purpose: يربط السياسات السيادية داخل `governance/` بالحراس التنفيذية داخل `tools/guards/`.

## Authority Rule

`governance/` هو المرجع النصي السيادي الوحيد.

`tools/guards/` تنفيذ آلي فقط، ولا يملك سياسة سيادية مستقلة.

## Guard Map

| Guard | Executable | Policy source | Decision role |
|---|---|---|---|
| GOV-SOVEREIGNTY | `tools/guards/guard-governance-sovereignty.mjs` | `governance/00_GOVERNANCE_INDEX.md` | يمنع انحراف مصدر الحقيقة عن `governance/` ويرصد مراجع `docs/governance`. |
| UI-ARCH-BOUNDARY | `tools/guards/guard-ui-architecture-boundary.mjs` | `governance/00_GOVERNANCE_INDEX.md` | يفرض Tamagui داخل ui-kit فقط و public exports فقط من `@bthwani/ui-kit`. |
| DESIGN-TOKEN-DRIFT | `tools/guards/guard-design-token-drift.mjs` | `governance/00_GOVERNANCE_INDEX.md` | يرصد hardcoded non-brand colors خارج `packages/ui-kit`. |
| SERVICE-CONTRACT-MATRIX | `tools/guards/guard-service-contract-matrix.mjs` | `governance/00_GOVERNANCE_INDEX.md` | يرصد اكتمال service blueprint/meta ويحظر services غير canonical. |
| API-BINDING-RUNTIME | `tools/guards/guard-api-binding-runtime.mjs` | `governance/00_GOVERNANCE_INDEX.md` | يرصد نقص states و binding hints في الشاشات data-bound. |
| EVIDENCE-CLOSURE | `tools/guards/guard-evidence-closure.mjs` | `governance/00_GOVERNANCE_INDEX.md` | يمنع claims مثل PASS/CLOSED/100% بدون evidence قريب. |
| WORKFLOW-CI-PARITY | `tools/guards/guard-workflow-ci-parity.mjs` | `governance/00_GOVERNANCE_INDEX.md` | يتحقق من وجود CI guard layer بجانب governance baseline. |

## Runner

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\RUN_GOVERNANCE_GUARDS.ps1"
```

## Evidence

كل تشغيل يجب أن يكتب evidence تحت:

```text
tools/registry/runs/{SESSION_ID}/_HANDOFF.zip
```

## Closure Rule

لا يتم اعتبار هذه الحراس مقبولة إلا بعد مراجعة:

- `git --no-pager status --short`
- `git --no-pager diff --check`
- مخرجات `RUN_GOVERNANCE_GUARDS.ps1`
- ملف `_HANDOFF.zip`
- patch review عند وجود تغييرات حساسة أو ملفات جديدة.
