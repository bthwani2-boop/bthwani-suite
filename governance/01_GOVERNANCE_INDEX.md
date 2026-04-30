# Governance Index and Authority Map

## Purpose

This file is the routing table for every governance decision. It prevents duplication by assigning one owner file per decision family.

## Precedence order

1. User's latest explicit instruction for the current task.
2. Safety/security constraints.
3. This governance package.
4. Repository evidence.
5. Project resources/SOPs.
6. Historical attachments or legacy files only as donor/reference.

When repo evidence contradicts policy text, mark the status `FIX_REQUIRED` or `BLOCKED`; do not silently rewrite truth.

## Authority map

| Decision family | Owner file |
|---|---|
| Platform naming, stack, service catalog, surface catalog | `02_PLATFORM_SSOT.md` |
| Repository roots, active/current/legacy/archive classification | `03_REPO_BOUNDARIES.md` |
| Architecture direction and dependency ladder | `04_ARCHITECTURE_RULES.md` |
| Package exports/imports/deep-import boundaries | `05_PACKAGE_BOUNDARIES.md` |
| App shells and shell-only responsibilities | `06_APPS_AND_SHELLS.md` |
| Service-owned and surface-owned registry | `07_SURFACES_AND_SERVICES.md` |
| UI kit, Tamagui, brand, RTL, states | `08_UI_KIT_AND_BRAND.md` |
| API contracts, binding, runtime proof | `09_API_BINDING_RUNTIME.md` |
| Service closure and golden-slice gates | `10_SERVICE_CLOSURE.md` |
| Evidence schema and traceability | `11_EVIDENCE_AND_TRACEABILITY.md` |
| Testing and production readiness | `12_TESTING_AND_PRODUCTION_READINESS.md` |
| CI gates and blocking/report-only policy | `13_CI_AND_GATES.md` |
| Guards catalog and severity | `14_GUARDS_CATALOG.md` |
| AI agents, Copilot, scripts, patch handoff | `15_AGENT_AND_AI_EXECUTION.md` |
| Security, secrets, privacy, threat posture | `16_SECURITY_AND_SECRETS.md` |
| Cleanup, deletion, deprecation, archive | `17_CLEANUP_AND_DEPRECATION.md` |
| Branches, checkpoints, divergence, PR readiness | `18_BRANCH_AND_CHECKPOINTS.md` |
| Control panel and operating model | `19_CONTROL_PANEL_AND_OPERATING_MODEL.md` |
| Mutable policy variables and provider control plane | `20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md` |
| Runtime observability and production operations | `21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| DSH golden-slice closure plan | `22_DSH_GOLDEN_SLICE.md` |
| Warning families and false-positive governance | `23_WARNINGS_AND_FALSE_POSITIVES.md` |
| Traceability matrix and roadmap | `24_TRACEABILITY_AND_ROADMAP.md` |
| Service blueprint and operation catalog standard | `25_SERVICE_BLUEPRINT_AND_OPERATION_CATALOG.md` |
| Legacy source merge accounting | `99_LEGACY_MERGE_LEDGER.md` |

## Canonical status vocabulary

- `CANONICAL`: approved authority.
- `CURRENT`: actual repo state, may need correction.
- `LEGACY`: historical donor/reference, not authority.
- `TRANSITIONAL`: temporary migration state with expiry.
- `TBD`: unknown until proven.
- `DEPRECATED`: approved for removal after gates.
- `REJECTED`: reviewed and intentionally not adopted.

## Decision vocabulary

Final decisions: `PASS`, `PASS_WITH_WARNINGS`, `FIX_REQUIRED`, `BLOCKED`, `READY_FOR_PR`, `REVERT_REQUIRED`, `NEEDS_EVIDENCE`, `NEEDS_VISUAL_EVIDENCE`

## Duplication rule

A rule may be restated only as a short pointer. The full rule lives in exactly one owner file.

## Missing evidence rule

If a claim cannot be supported by repo output, source hash, CI output, screenshot, runtime log, or patch evidence, it must be marked `UNPROVEN` or `TBD`.
