# CI and Gates

## Purpose

CI enforces governance; it does not replace governance.

## Gate types

| Gate | Mode | Blocks? |
|---|---|---|
| TypeScript | blocking for code | yes |
| diff check | blocking for any tracked change | yes |
| secrets scan | blocking for secrets | yes |
| package boundary | blocking when boundary is affected | yes |
| UI-kit/Tamagui boundary | blocking when frontend affected | yes |
| route/runtime entrypoint | blocking when route affected | yes |
| evidence registry hygiene | blocking for release/checkpoint | yes |
| docs link/reference | report-only unless canonical break | conditional |
| warning baseline | report-only until promoted | conditional |

## Gradual promotion

A report-only gate may become blocking after:

1. false positives are classified
2. baseline is recorded
3. remediation plan exists
4. ownership is clear
5. CI signal is stable

## CI evidence

CI-related evidence must include:

- workflow name
- run ID or local command
- commit SHA
- status
- failed jobs/steps
- artifacts
- accepted warnings
- decision

## Forbidden CI behavior

- no hiding errors by broad ignore
- no disabling workflow without governance decision
- no lockfile/dependency change to silence unrelated checks
- no final READY if required CI is unknown
