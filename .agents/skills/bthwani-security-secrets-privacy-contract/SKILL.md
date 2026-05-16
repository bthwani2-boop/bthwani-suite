---
name: bthwani-security-secrets-privacy-contract
description: Review secrets, PII, logs, evidence packs, MCP/hooks/scripts, privacy boundaries, and sensitive data exposure.
version: 2026.05.17-v1
---

# bthwani-security-secrets-privacy-contract

## Purpose

Prevent sensitive leakage and unsafe agent/tool execution.

## Steps

1. Scan for secrets, tokens, env, certs, auth headers, PII, unsafe logs, and evidence leakage.
2. Review scripts/hooks/MCP/custom commands before execution.
3. Require redaction or exclusion for sensitive evidence.
4. Block external skill adoption until supply-chain intake passes.
5. Connect findings to guards such as gitleaks/trufflehog/secret scans when available.

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