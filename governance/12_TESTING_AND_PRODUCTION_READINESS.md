# Testing and Production Readiness

## Purpose

This file defines testing and readiness expectations by change type.

## Baseline commands

For code changes:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

## Test classes

| Change type | Required proof |
|---|---|
| Docs only | diff check, link/path sanity |
| UI | typecheck, screenshot/visual evidence, RTL/overflow check |
| Package exports | typecheck, import/consumer scan, guard |
| API/contract | contract test, generated type/client proof |
| Runtime behavior | logs, smoke test, relevant integration test |
| Security/config | secret scan/config review |
| Cleanup/delete | reference scan, diff, rollback plan |
| CI/guards | workflow/guard run output |

## Production readiness requires

- no fixture-only truth
- no stale compose/runtime truth
- no LAN/IP hardcoding as production route
- provider control plane or documented bootstrap exception
- observability path
- rollback plan
- seed/simulation plan if required
- access/scale gate when applicable

## Warning handling

Warnings are acceptable only if:

- classified
- non-blocking
- recorded in evidence
- owner/remediation exists
- not hiding a defect
