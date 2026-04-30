---
generatedFrom: governance/GOVERNANCE_CONTROL_PLANE_STANDARD.md
generatedAt: 2026-04-30T04:48:37.4891793+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Governance Control Plane Standard

Status: CANONICAL_STANDARD
Owner: BThwani Governance
Scope: governance file classes, authority ordering, naming discipline, archive discipline, and alias discipline

## Purpose

This standard defines how the governance package is organized so it can stay:

- singular in authority
- low-noise
- traceable
- mergeable without confusion
- safe to archive without losing history

## Control-Plane Principle

`governance/` is the sovereign textual control plane.

`tools/guards/`, `tools/scripts/`, `.github/agents/`, `.github/skills/`, and `.github/workflows/` may enforce or derive from governance, but they do not outrank it.

## Canonical File Classes

| Class | Canonical location | Rule |
|---|---|---|
| Entry | `governance/` | Human entry point into the control plane. |
| Index | `governance/` | Canonical classification and reading order. |
| Policy | `governance/` | Stable decision authority. |
| Contract | `governance/` | Hard boundary or ownership law. |
| Protocol | `governance/` | Ordered operational workflow. |
| Standard | `governance/` | Repeatable quality bar or required schema. |
| Catalog | `governance/` | Canonical mapping of one family of rules. |
| Ledger | `governance/` | Evidence-backed historical or structural decision log. |
| Archive | `governance/archive/` | Historical material with no live authority. |
| Alias note | `governance/` | Transitional pointer to a stronger canonical file. |
| Guard | `tools/guards/` | Executable verification only. |
| Script | `tools/scripts/` | Controlled automation or diagnostics only. |
| Evidence | `tools/registry/runs/` | Generated proof only. |

## One-Owner-One-Role Rule

A governance file must have one dominant purpose.

If two files express the same active authority:

1. keep the stronger canonical file
2. merge any unique content into that file
3. downgrade the weaker file to one of:
	- alias note
	- archive note
	- ledger record
	- later deletion candidate

Parallel active authority is not allowed.

## Authority Order

If two sources conflict, the stronger order is:

1. canonical files under `governance/`
2. executable enforcement under `tools/guards/`
3. CI enforcement under `.github/workflows/`
4. operational guidance under `.github/agents/` and `.github/skills/`
5. archived material under `governance/archive/`, including `governance/archive/legacy-extracted/`

## Naming Discipline

During the current cleanup wave, existing canonical file names may stay in place until their replacements are ready.

For new or renamed governance files, use only one of these patterns:

- `NN_TOPIC_KIND.md` for ordered core control-plane files
- `TOPIC_KIND.md` for domain-specific canonical files

Disallowed naming patterns:

- vague temporary names
- phase-only names for permanent authority files
- duplicate names with different suffixes for the same authority
- mixed archive and policy semantics in one filename

## Archive Discipline

Historical material must move to `governance/archive/` once its active authority is removed.

Archive content may include:

- batch ledgers
- extracted legacy governance
- superseded notes kept for traceability

Archive content must not:

- act as live policy
- appear in canonical reading order
- compete with root governance files for authority

## Alias Discipline

An alias file is allowed only when active references still depend on its path.

An alias file must contain only:

- its deprecated status
- the canonical target file
- the reason it still exists
- the condition for later deletion

An alias file must not introduce new policy text.

## Bootstrap-Header Retirement Rule

Old bootstrap-style headers such as phase/session status blocks may remain as historical context only.

They must not be treated as living authority when a canonical policy, contract, or standard already owns the subject.

Any canonical file that still mixes live law with bootstrap-only metadata must be normalized in place or merged into a stronger file.

## Guard Authority Rule

The textual governance source for guard behavior must resolve to a canonical governance file, normally:

- `GOVERNANCE_GUARD_CATALOG.md`
- `WARNING_CLASSIFICATION_POLICY.md`
- the relevant domain policy or contract

Guard-specific markdown notes are subordinate and may not become parallel sovereignty.

## Required Reorganization Record

Any merge, archive move, alias downgrade, or delete-candidate decision must be recorded in:

`GOVERNANCE_REORGANIZATION_LEDGER.md`

No structural governance cleanup is complete until that ledger records the decision and proof status.

## BThwani Architecture Rule

Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only.

