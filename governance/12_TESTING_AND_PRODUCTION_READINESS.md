# Testing and Production Readiness

**Status:** Canonical Governance Payload v2
**Owner:** `Quality Governance`

## Test categories

| Category | Required when | Evidence |
|---|---|---|
| TypeScript | TS/TSX/config/export impact | targeted typecheck for the affected project/path; workspace `tsc` only for high-risk, release, broad architecture, or explicit human request |
| Lint | a direct lint question exists or an affected-project lint target is available | targeted lint output or NOT_RUN_REASON; workspace lint only on explicit PR/release/human request |
| Unit | pure logic changed | test output |
| Integration | API/client/service binding changed | integration output |
| Contract | OpenAPI/schema/client changed | contract test output |
| Runtime | behavior changed | logs/manual reproduction |
| Visual | UI changed | screenshots |
| Mobile device | mobile navigation/native behavior changed | device evidence |
| Build | release/deploy/config changed | build output |

## Baseline commands

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
# Then choose the minimum targeted gate justified by the Smart Execution Budget.
```

## Smart Execution Budget

الجدول الكامل لـ task classes (LOW / MEDIUM / UI_VISIBLE / HIGH / COMMIT/PUSH) وحجم الدليل المقابل محدد في [`governance/11_EVIDENCE_AND_TRACEABILITY.md`](11_EVIDENCE_AND_TRACEABILITY.md).
اختر الحد الأدنى من التحقق الذي تبرره طبيعة المهمة وطلب الإنسان. لا تعد تعريف الـ tiers هنا.

## Production readiness dimensions

A feature is not production-ready until these are understood:

- data plane,
- auth and permissions,
- error handling,
- observability,
- rollback,
- provider/config policy,
- seed/migration state,
- fixtures exit path,
- performance risk,
- security risk,
- support/ops path.

## Fixture law

Fixtures may support development, but fixture success is not runtime success. Any feature relying on fixtures must be marked `BOOTSTRAP`, `DEMO`, or `TBD`, not `CLOSED`.

## Mobile readiness

Mobile work must classify:

```text
JS-only
Metro/bundler
native/dev-client rebuild
dependency/native module rebuild
```

Expo Dev Client is canonical. Expo Go is not acceptance evidence.

## Web/control-panel readiness

Control-panel readiness requires:

- route loads,
- action state,
- permission state,
- audit/log path for operations,
- no huge page-scroll replacement for control-room workflows,
- responsive density appropriate for web-first admin.

## Readiness decision

Use:

```text
READY_FOR_PR
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
```

Never use `READY` without exact evidence.
