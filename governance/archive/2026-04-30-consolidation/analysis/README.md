# BThwani Governance

Status: CANONICAL_CONTROL_PLANE_ENTRY
Owner: BThwani Governance
Scope: governance entry, active reading order, archive boundary, and authority routing

This directory is the only textual governance source of truth for `C:\bthwani-suite`.

## Active Root

The active governance root is intentionally reduced to 20 canonical files.

Read `00_GOVERNANCE_INDEX.md` for the exact active set and merge map.

Any other governance file is either:

- merged into an active canonical file
- preserved as historical trace under `governance/archive/`
- a temporary alias pending reference repair

No parallel policy source is allowed at the governance root.

## What Governance Owns

`governance/` is the active authority for:

- repository truth, boundaries, and ownership
- architecture and surface/service/app split
- UI kit, brand, RTL, and Tamagui rules
- API, binding, runtime, testing, and evidence rules
- CI gates, warning policy, and guard authority
- AI-assisted execution, safety, and closure vocabulary

The following roots are implementation or derivative only and cannot override governance text:

- `tools/guards/`
- `tools/scripts/`
- `tools/registry/runs/`
- `.github/workflows/`
- `.github/agents/`
- `.github/skills/`

## Required Reading Order

Use this order for real decisions:

1. `00_GOVERNANCE_INDEX.md`
2. `GOVERNANCE_CONTROL_PLANE_STANDARD.md`
3. `GOVERNANCE_CLOSURE_STANDARD.md`
4. `01_PLATFORM_SSOT.md`
5. `02_BRANCH_AND_EVIDENCE_POLICY.md`
6. `18_EVIDENCE_PACK_STANDARD.md`
7. `14_AGENT_EXECUTION_RULES.md`
8. `16_SECURITY_AND_SECRETS_POLICY.md`
9. `GOVERNANCE_GUARD_CATALOG.md`

## Hard Rules

- The canonical repo path is `C:\bthwani-suite`.
- Do not use or revive any old standalone repo/path named `bth` as active truth.
- No delete, move, rename, or archive without traceable proof and recorded reason.
- No `CLOSED`, `READY`, `FINAL`, or `100%` claim without evidence.
- Evidence packs live under `tools/registry/runs/{SESSION_ID}`.
- Apps are shell hosts only.
- `packages/app-shells` owns shell and runtime wiring only.
- `packages/surfaces` owns screens, flows, and experiences.
- `packages/ui-kit` is the reusable design authority only.
- Screen / Surface / App consumes `@bthwani/ui-kit` public exports; Tamagui is internal to ui-kit only.

## Archive Boundary

Historical material belongs under `governance/archive/` and must not compete with the active 20-file surface.

Archive content may preserve provenance, ledgers, and superseded drafts, but it cannot introduce new policy authority.

## Provenance

This entry now subsumes the overlapping root-navigation intent previously scattered across `README.md`, `GOVERNANCE_MASTER_CONTROL_PLANE.md`, and `GOVERNANCE_CANONICAL.md`.

This file is the control-plane entry only.

