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
