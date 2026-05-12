# Agent Routing Index

**Status:** Canonical Agent Routing Index
**Owner:** Agent Governance
**Canonical repo:** `C:\bthwani-suite`

This file defines how BThwani agent instructions are selected and composed.

## Routing Law

Agents must not invent routing behavior. Use this index to select the correct base profile and overlays.

## Base Profile First

Choose exactly one base profile before applying overlays:

| Route | Base profile | Use when |
|---|---|---|
| `analyze.first-pass` | `.github/agents/base-profiles/PROFILE_ANALYZE_FIRST_PASS.md` | analysis, inventory, diagnosis, read-only review |
| `build.slice` | `.github/agents/base-profiles/PROFILE_BUILD_SLICE.md` | narrow implementation slice with evidence |
| `donor.trace-reconstruct` | `.github/agents/base-profiles/PROFILE_DONOR_TRACE_RECONSTRUCT.md` | donor/reference reconstruction and provenance tracing |
| `ready.pack` | `.github/agents/base-profiles/PROFILE_READY_PACK.md` | final evidence pack and readiness review |
| `infra.workspace-link` | `.github/agents/base-profiles/PROFILE_INFRA_WORKSPACE_LINK.md` | workspace, infra, paths, scripts, and execution wiring |

## Overlay Second

After selecting the base profile, apply only relevant overlays:

| Overlay | File | Use when |
|---|---|---|
| Design review | `.github/agents/overlays/OVERLAY_DESIGN_REVIEW.md` | visual/design-system/brand review |
| UX flow review | `.github/agents/overlays/OVERLAY_UX_FLOW_REVIEW.md` | flow, states, navigation, interaction review |
| User review gates | `.github/agents/overlays/OVERLAY_USER_REVIEW_GATES.md` | user acceptance, evidence gate, closure checks |
| Violation audit | `.github/agents/overlays/OVERLAY_VIOLATION_AUDIT.md` | boundary, policy, drift, legacy, or rule violation audit |

## Governance References

- `governance/15_AGENT_AND_AI_EXECUTION.md`
- `governance/AGENT_CHANGE_LEDGER.md`
- `.github/agents/AGENT_ROUTING_INDEX.md`

## Anti-Drift Rules

- Do not use broad “fix everything” routing.
- Do not apply overlays before choosing a base profile.
- Do not mix unrelated routes in one task.
- Do not claim `PASS`, `READY`, `CLOSED`, or `100%` without evidence.
- If a required base profile or overlay is missing, stop and report `BLOCKED`.
