# CI and Gates

**Status:** Canonical Governance Payload v2
**Owner:** `CI Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0106-20260430-221753-governance`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 13_CI_GATES_CONTRACT, CI_GRADUAL_GATE_POLICY, CI_REPORT_ONLY_READINESS_PLAN

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Gate types

| Gate | Mode | Blocks merge when |
|---|---|---|
| Scope gate | blocking | changed files outside approved scope |
| Diff hygiene | blocking | `git diff --check` fails |
| TypeScript | blocking for code | typecheck fails |
| Security/secrets | blocking | secret risk detected |
| Boundary guard | blocking for boundary changes | forbidden imports/exports found |
| Governance references | blocking for governance changes | legacy active references remain |
| UI evidence | blocking for UI closure | screenshots missing |
| Runtime evidence | blocking for runtime closure | logs/tests missing |
| Warning classification | report/block depending severity | warnings unclassified |

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

{standard_footer()}
