---
name: bthwani-release-runtime-gates
description: Classify release/runtime impact and enforce build, native, Expo/EAS, Next, smoke, and rollback gates.
version: 2026.05.17-v1
---

# bthwani-release-runtime-gates

## Purpose

Prevent accidental release/runtime breakage.

## Steps

1. Classify change as `DOC_ONLY`, `JS_ONLY`, `UI_ONLY`, `CONFIG`, `NATIVE`, `DEPENDENCY`, `RUNTIME`, `RELEASE`, or `UNKNOWN`.
2. Apply only applicable gates:
   - `DOC_ONLY` → no build, no runtime smoke, no evidence pack required.
   - `JS_ONLY` / `UI_ONLY` → no native rebuild; targeted typecheck when TS/config is touched.
   - `CONFIG` / `NATIVE` / `DEPENDENCY` → Expo Dev Client/EAS rebuild or Next build as needed; block unless explicitly in scope.
   - `RUNTIME` / `RELEASE` → runtime smoke and rollback evidence required.
3. Block dependency/native/config changes unless explicitly in scope.
4. Require rollback and evidence for release-impacting changes.

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; use the safest documented launcher; npx is allowed when documented or safest and justified in evidence.
- Read `pnpm-workspace.yaml` before choosing active roots.
- `.agents` is operational guidance; `governance/` is project truth and service/application specialization.
- Do not create mirrors, bridges, long copied donor docs, or duplicate skills.
- Do not modify dependencies, lockfiles, CI, secrets, native config, backend/runtime/API, or generated files unless explicitly in scope.
- No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` claim without Git diff, verification output, and evidence.
- Unknowns must be `TBD`, `UNPROVEN`, or `BLOCKED`.

## Output contract

```text
skill:
scope:
governance_sources:
evidence_used:
findings:
risks:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```
