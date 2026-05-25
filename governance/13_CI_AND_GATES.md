# CI and Gates

**Status:** Canonical Governance Payload v2
**Owner:** `CI Governance`

## Gate types

Only applicable gates run for a given change. A docs/policy/agents/governance-only change does not trigger TypeScript, UI evidence, or runtime evidence gates.

| Gate | Mode | Blocks merge when | Applicable to |
|---|---|---|---|
| Scope gate | blocking | changed files outside approved scope | all changes |
| Diff hygiene | blocking | `git diff --check` fails | all changes with writes |
| TypeScript | blocking for code | typecheck fails | TS/TSX/config/export changes |
| Security/secrets | blocking | secret risk detected | all changes |
| Boundary guard | blocking for boundary changes | forbidden imports/exports found | import/export/package changes |
| Governance references | blocking for governance changes | retired or invalid active references remain | governance/agent changes |
| UI evidence | blocking for UI closure | screenshots missing | visible UI changes |
| Runtime evidence | blocking for runtime closure | logs/tests missing | runtime/behavior changes |
| Warning classification | report/block depending severity | warnings unclassified | when warnings are produced |

## Report-only gates

A gate may be report-only only when:

- governance says it is report-only,
- the warning is classified,
- owner and expiry exist,
- risk is documented,
- no safety/security issue exists.

## CI responsibilities

CI should verify what can be automated:

- TypeScript,
- lint/test/build,
- dependency/boundary scans,
- secrets,
- link checks,
- guard catalog,
- governance evidence shape.

CI cannot replace human visual review for UI/UX, but it can require screenshot artifacts.

## Workflow ownership

`.github/workflows/*` is implementation. It must not invent governance policy. If a workflow enforces a rule, the rule must be defined in `governance/`.

## Minimum CI evidence in PR

- workflow name,
- run URL or run id,
- status,
- commit SHA,
- failed jobs if any,
- artifact links if any,
- warning classification.

## Failing gate protocol

If a gate fails:

1. Do not declare PASS.
2. Classify failure.
3. Determine owner file.
4. Fix root cause or mark BLOCKED.
5. Re-run.
6. Save evidence.
