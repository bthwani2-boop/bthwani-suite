# Governance Control Plane Standard

Status: CANONICAL_STANDARD
Owner: BThwani Governance
LastStandardizedBy: GOVERNANCE_BATCH_09_RESCUE_STANDARDIZE_CLOSE-20260430-001242

## Purpose

This file defines the canonical organization standard for BThwani governance and guard files.

## File classes

| Class | Canonical location | Rule |
|---|---|---|
| Policy | governance/ | Stable rule or authority |
| Standard | governance/ | Repeatable quality bar |
| Decision | governance/ | Evidence-backed decision |
| Ledger | governance/ | Historical closure evidence |
| Guard | tools/guards/ | Executable verification |
| Script | tools/scripts/ | Controlled automation or diagnostics |
| Evidence | tools/registry/runs/ | Generated proof only |
| Agent | .github/agents/ | Agent behavior contract |
| Skill | .github/skills/ | Reusable task skill |
| Workflow | .github/workflows/ | CI enforcement |

## Anti-duplication rule

A file must have one owner and one purpose. If two files express the same authority, keep the canonical file and convert the other into a ledger, extraction note, or removal candidate.

## Anti-contradiction rule

If two files conflict, the stronger source order is:

1. governance/ canonical control plane
2. tools/guards executable enforcement
3. .github/workflows CI enforcement
4. .github/agents and .github/skills operational guidance
5. governance/legacy-extracted reference-only material

## BThwani UI/architecture guard

Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only.
