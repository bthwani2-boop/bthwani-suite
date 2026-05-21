---
name: bthwani-integrated-system-umbrella-contract
description: Enforce BThwani integrated multi-surface system reasoning before accepting logic, UI/UX, flow, operations, data, or execution work.
version: 2026.05.21-v1
---

# bthwani-integrated-system-umbrella-contract

## Purpose

Prevent isolated single-surface reasoning. Any BThwani task that touches logic, UI/UX, flow, data, runtime, operations, finance, catalog, provider control, or execution must be treated as part of one integrated multi-surface ecosystem.

## Activation

Use this skill when any task involves:

- screen, route, tab, sheet, modal, state, or flow behavior;
- DSH, WLT, delivery, order, cart, favorite, product, catalog, partner, captain, field, or control-panel logic;
- cross-surface consistency;
- operational decisions, handoffs, SLA, escalation, evidence, or failure recovery;
- UI/UX decisions that may affect shared design, navigation, or service behavior;
- API/client/data/provider/config/vars decisions;
- the Arabic activation terms agreed with the user for full umbrella reasoning.

## Required reading before execution

- `AGENTS.md`
- `.agents/INDEX.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- the relevant adapter under `.agents/adapters/`
- the relevant governance source under `governance/`
- one or two directly relevant skills only, unless evidence proves more are required

Do not rely on memory or assumption.

## Steps

1. Define the task domain:
   - service: DSH / WLT / KNZ / ARB / AMN / ESF / MRF / SND / KWD / shared / TBD
   - surface: app-client / app-partner / app-captain / app-field / control-panel / webapp / website / shared / TBD
   - layer: UI / flow / API-client / runtime / data / finance / operations / governance / agent / TBD

2. Identify the canonical owner:
   - governance owner
   - package/surface owner
   - shared UI-kit owner when reusable UI is involved
   - API/client/types owner when contracts are involved
   - control-panel owner when operational configuration or vars are involved

3. Build a cross-surface impact map before changing anything:
   - affected surfaces
   - directly affected files
   - downstream consumers
   - shared contracts
   - states and transitions
   - finance/ledger/settlement impact
   - operations/captain/field/partner impact
   - control-panel visibility/control impact
   - data loading and payload impact
   - UI/UX/RTL/accessibility impact

4. Classify the work:
   - UI-only
   - flow-only
   - contract/client
   - runtime/provider
   - data/model
   - operational
   - financial
   - governance/agent
   - mixed/high-risk

5. Forbid isolated implementation:
   - no local fix in one surface when the same logic is shared elsewhere;
   - no contradictory status names, labels, routes, actions, or state machines between surfaces;
   - no local design system outside `@bthwani/ui-kit` when a reusable pattern exists;
   - no hardcoded control logic when governance/control-panel ownership is required;
   - no API/backend/runtime/provider mutation unless explicitly requested.

6. Enforce central design-system ownership when UI is reusable:
   - Screen / Surface / App -> `@bthwani/ui-kit` public exports -> Tamagui internally inside ui-kit only.
   - توجب الالتزام بنظام الألوان المركزي.
   - تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.

7. Enforce lean data movement:
   - use `bthwani-on-demand-retrieval-contract` when data/content could inflate across surfaces;
   - prefer IDs, references, lean summaries, scoped payloads, pagination, lazy loading, caching, and deferred detail fetching.

8. Mark uncertainty explicitly:
   - use `TBD`, `UNPROVEN`, `GAP`, `BLOCKED`, or `NEEDS_EVIDENCE`;
   - do not convert unknowns into implementation.

9. Choose the safest delivery method:
   - analysis-only, prompt, command, diagnostic script, correction script, generated file, patch handoff, or evidence bundle;
   - do not default to broad Copilot prompts;
   - keep scope narrow and evidence-driven.

10. Verify before acceptance:
   - Git status/diff evidence;
   - relevant guard/typecheck/test output;
   - visual screenshots when UI changed;
   - no staged/untracked blind spots;
   - no PASS/CLOSED/READY/100% without evidence.

## Required output

```text
skill: bthwani-integrated-system-umbrella-contract
scope:
governance_sources:
evidence_used:
task_domain:
canonical_owner:
cross_surface_impact_map:
affected_surfaces:
shared_contracts:
data_loading_impact:
operational_impact:
financial_impact:
ui_ux_impact:
forbidden_local_implementations:
risks:
unknowns:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; use the safest documented launcher.
- Read `pnpm-workspace.yaml` before choosing active roots.
- `.agents` is operational guidance; `governance/` is project truth and service/application specialization.
- Do not create mirrors, bridges, long copied donor docs, or duplicate skills.
- Do not modify dependencies, lockfiles, CI, secrets, native config, backend/runtime/API, or generated files unless explicitly in scope.
- No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` claim without Git diff, verification output, and evidence.
- Unknowns must be `TBD`, `UNPROVEN`, or `BLOCKED`.
