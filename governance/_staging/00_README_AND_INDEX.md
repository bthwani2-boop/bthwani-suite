---
mergedFrom: governance/README.md, governance/00_GOVERNANCE_INDEX.md
mergedAt: 2026-04-30T04:50:00+03:00
note: STAGING merged draft — review required before promoting to canonical
---

# Merged: README.md + 00_GOVERNANCE_INDEX.md (STAGING)

This file is a safe, reviewable merge of `governance/README.md` and `governance/00_GOVERNANCE_INDEX.md` created as part of the governance consolidation staging area. It preserves the full original text from both sources under clear provenance markers. Do not treat this file as canonical until reviewers sign off and ledger entries are recorded in `GOVERNANCE_REORGANIZATION_LEDGER.md`.

---

## Source: governance/README.md

---
generatedFrom: governance/README.md
generatedAt: 2026-04-30T04:48:37.8534154+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# BThwani Governance

Status: CANONICAL_CONTROL_PLANE_ENTRY
Owner: BThwani Governance
Scope: governance control plane, canonical reading order, archival boundaries, and authority routing

This directory is the only textual governance source of truth for `C:\bthwani-suite`.

## Authority

`governance/` is the active policy root for:

- repository identity and boundaries
- architecture and ownership rules
- UI, UX, RTL, and flow rules
- API, binding, runtime, and verification rules
- evidence, branch, and checkpoint rules
- security, secrets, and AI execution governance
- guard authority and warning classification

No other textual root may override `governance/`.

The following roots are non-authoritative unless a canonical governance file explicitly points to them for implementation or evidence:

- `docs/governance/`
- `governance/archive/legacy-extracted/`
- `tools/guards/`
- `tools/scripts/`
- `.github/agents/`
- `.github/skills/`

## Operating Rule

Every governance file must have one clear role:

- entry/index
- policy
- contract
- protocol
- standard
- catalog
- ledger
- archive note
- alias note

Two files must not hold the same active authority.

If two files overlap, keep one canonical authority and convert the other into exactly one of:

- merged content with no remaining authority
- alias note pointing to the canonical file
- archived historical material
- deletion candidate recorded in the reorganization ledger

## Control-Plane Reading Order

Read these files first in this order:

1. `00_GOVERNANCE_INDEX.md`
2. `GOVERNANCE_CONTROL_PLANE_STANDARD.md`
3. `GOVERNANCE_REORGANIZATION_LEDGER.md`
4. `02_BRANCH_AND_EVIDENCE_POLICY.md`
5. `18_EVIDENCE_PACK_STANDARD.md`
6. `14_AGENT_EXECUTION_RULES.md`
7. `16_SECURITY_AND_SECRETS_POLICY.md`
8. `GOVERNANCE_GUARD_CATALOG.md`

## Active Structural Rules

- The canonical repo path is `C:\bthwani-suite`.
- Do not use or revive any old standalone repo/path named `bth` as active truth.
- No delete, move, or rename without traceable proof and a recorded reason.
- No `CLOSED`, `READY`, `FINAL`, or `100%` claim without evidence.
- Evidence packs live under `tools/registry/runs/{SESSION_ID}`.
- Apps are shell/host only.
- `packages/app-shells` owns shell/root behavior only.
- `packages/surfaces` owns screens, flows, and experiences.
- `packages/ui-kit` is the reusable design authority only.
- Screen / Surface / App consumes `@bthwani/ui-kit` public exports; Tamagui is used internally inside ui-kit only.
- `tools/guards/` is executable enforcement only; governance text remains sovereign.

## Reorganization Rule

Control-plane cleanup, merge, archive, replacement, aliasing, and delete-candidate decisions must be recorded in:

`GOVERNANCE_REORGANIZATION_LEDGER.md`

That ledger is the mandatory internal record for why a governance file was kept, merged, archived, downgraded to alias, or left as a later deletion candidate.

## Canonical Index

Read `00_GOVERNANCE_INDEX.md` first.

---

## Source: governance/00_GOVERNANCE_INDEX.md

---
generatedFrom: governance/00_GOVERNANCE_INDEX.md
generatedAt: 2026-04-30T04:48:37.1112843+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# BThwani Governance Index

Status: CANONICAL_INDEX
Owner: BThwani Governance
Scope: canonical file classification, reading order, and authority routing

## How To Use This Index

This file classifies governance content into four authority states:

- `CANONICAL` — active authority for its subject
- `CANONICAL_NEEDS_NORMALIZATION` — active authority, but still needs rewrite or consolidation
- `TRANSITIONAL_ALIAS_OR_SUBORDINATE` — may still exist, but must not compete with a stronger canonical file
- `ARCHIVE_ONLY` — historical material only, never active authority

If a file is not listed here as canonical or canonical-needs-normalization, it must not be treated as a sovereign governance source.

## Canonical Roots

| Root | Role | Authority |
|---|---|---|
| `governance/` | Canonical governance control plane | CANONICAL |
| `tools/guards/` | Executable guard implementation | IMPLEMENTATION_ONLY |
| `tools/scripts/` | Controlled automation and diagnostics | IMPLEMENTATION_ONLY |
| `tools/registry/runs/` | Evidence output root | CANONICAL_OUTPUT_ONLY |
| `.github/workflows/` | CI enforcement | ENFORCEMENT_ONLY |
| `.github/agents/` | Agent operational behavior | DERIVED_ONLY |
| `.github/skills/` | Skill operational behavior | DERIVED_ONLY |

## Canonical Reading Order

| Order | File | Role | Status |
|---|---|---|---|
| 1 | `README.md` | control-plane entry | CANONICAL |
| 2 | `00_GOVERNANCE_INDEX.md` | authority classification index | CANONICAL |
| 3 | `GOVERNANCE_CONTROL_PLANE_STANDARD.md` | control-plane organization law | CANONICAL |
| 4 | `GOVERNANCE_REORGANIZATION_LEDGER.md` | structural cleanup ledger | CANONICAL |
| 5 | `02_BRANCH_AND_EVIDENCE_POLICY.md` | branch, checkpoint, and evidence workflow | CANONICAL |
| 6 | `18_EVIDENCE_PACK_STANDARD.md` | evidence pack schema | CANONICAL |
| 7 | `GOVERNANCE_CLOSURE_STANDARD.md` | closure and decision binding law | CANONICAL |
| 8 | `14_AGENT_EXECUTION_RULES.md` | AI execution and patch safety law | CANONICAL |
| 9 | `16_SECURITY_AND_SECRETS_POLICY.md` | security and secrets law | CANONICAL |
| 10 | `GOVERNANCE_GUARD_CATALOG.md` | guard authority catalog | CANONICAL |
