---
generatedFrom: governance/13_CI_GATES_CONTRACT.md
generatedAt: 2026-04-30T04:48:37.2107976+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# CI Gates Contract

Status: CANONICAL_CONTRACT
Owner: BThwani Governance
Scope: local and CI gates, staged CI hardening, and workflow discipline

## Purpose

This contract defines the required CI and local guard behavior for BThwani governance.

## Authority

CI enforces governance. CI does not author governance. The canonical policy source remains `governance/`.

## Required Baseline Gates

Every governance-affecting change must be able to run:

```powershell
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

## Required CI Gate Classes

| Gate | Purpose | Required Before Closure |
|---|---|---|
| TypeScript | Prove workspace type safety. | Yes |
| diff-check | Prove no whitespace/conflict-marker errors. | Yes |
| i18n/direction | Prove centralized language and RTL/LTR rules. | Yes for UI/surface/app changes |
| agent governance | Prove AI/agent rules do not drift. | Yes for agent/governance changes |
| dependency boundaries | Prove package boundaries are enforced. | Yes before boundary closure |
| secrets scan | Prove no obvious secrets. | Yes before PR/release |
| OpenAPI/Spectral | Prove API contract quality where contracts exist. | Yes for API/contract changes |

## Gradual Gate Progression

CI must harden in stages:

1. report-only
2. block on hard errors only
3. classify warning baseline
4. promote selected warning families when false positives are controlled
5. require evidence summary in protected review paths
6. enforce no new unclassified warnings in protected areas

Hard-gate promotion is blocked while the warning baseline is unclassified.

## Report-Only Readiness

Use report-only when any of the following remains unresolved:

- missing script references
- unstable warning baseline
- uncalibrated false positives
- incomplete evidence routing
- missing owner for a retained workflow or guard

## Workflow Rules

- Use `pnpm`, not npm.
- Use least-privilege workflow permissions.
- Do not grant write permissions unless the workflow has a documented reason.
- Avoid broad workflow rewrites.
- `fetch-depth: 0` is allowed when history is needed for scans or branch reality.
- Workflows must not reference missing scripts.
- Workflows must not use old paths such as `kdt/volatile/registry/runs`.
- Workflows must not encode old active names such as `app-user` or `mcpw`.

## Tools and Guards

`tools/scripts` and `tools/guards` may implement checks, but they must map to a governance contract.

Every retained tool should have:

- owner
- purpose
- local or CI usage
- inputs
- outputs
- evidence path
- failure status
- consumer proof

## Missing Reference Policy

A workflow or package script referencing a missing script blocks governance closure until one of these happens:

- script is restored intentionally
- reference is removed intentionally
- reference is replaced with the canonical guard
- the workflow is archived/disabled with evidence

## Verification

After CI/tools changes, run:

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

Then run the affected guard command directly and attach output to the evidence pack.

## Provenance

This contract now absorbs the live gating rules previously split across `CI_GRADUAL_GATE_POLICY.md` and `CI_REPORT_ONLY_READINESS_PLAN.md`.

