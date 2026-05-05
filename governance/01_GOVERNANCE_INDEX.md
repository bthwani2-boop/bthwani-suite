# Governance Index and Reading Map

**Status:** Canonical Governance Payload v2
**Owner:** `Governance Control Plane`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 00_GOVERNANCE_INDEX, GOVERNANCE_REORGANIZATION_LEDGER, GOVERNANCE_CONSOLIDATION_DECISION_MATRIX

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Reading order

1. `00_README.md` — scope and authority.
2. `02_PLATFORM_SSOT.md` — platform truth.
3. `07_SURFACES_AND_SERVICES.md` — services and surfaces.
4. `04_ARCHITECTURE_RULES.md` — ownership and direction.
5. `11_EVIDENCE_AND_TRACEABILITY.md` — proof requirements.
6. Domain file for the current task.
7. `14_GUARDS_CATALOG.md` — enforcement mapping.
8. `99_LEGACY_MERGE_LEDGER.md` — source accounting.

## File classification

| Class | Files | Meaning |
|---|---|---|
| Entry | `00`, `01` | How to use governance. |
| Platform truth | `02`, `07`, `19`, `20`, `22` | What BThwani is and how services operate. |
| Architecture | `03`, `04`, `05`, `06`, `08`, `09` | Where code belongs and how it connects. |
| Closure | `10`, `11`, `12`, `13`, `14`, `23`, `24` | How proof, testing, warnings, roadmap, and runtime are accepted. |
| AI/workflow/security | `15`, `16`, `17`, `18` | How AI, secrets, cleanup, branches, and checkpoints behave. |
| Ledger | `99` | Legacy source coverage and extraction accountability. |
| Support | `AGENT_CHANGE_LEDGER.md`, `AGENT_UPDATE_VALIDATION_CHECKLIST.md` | Guard support owned by `15`; not parallel authority. |

## Authority vocabulary

| Term | Meaning |
|---|---|
| `Canonical` | Must be followed unless superseded with evidence and governance update. |
| `Current` | Exists now but may not be correct. |
| `Legacy` | Historical/donor source only. |
| `Derived` | Generated from canonical source; cannot override it. |
| `Transitional` | Temporarily tolerated with expiry and owner. |
| `TBD` | Unknown; cannot be implemented as truth. |
| `Blocked` | Must not proceed without missing decision/evidence. |

## One-owner rule

Every rule must have one owner file. If two files appear to govern the same thing, apply this resolution order:

1. More specific domain owner wins.
2. If conflict is cross-domain, `02_PLATFORM_SSOT.md` decides platform facts.
3. Evidence procedure conflicts are decided by `11_EVIDENCE_AND_TRACEABILITY.md`.
4. AI execution conflicts are decided by `15_AGENT_AND_AI_EXECUTION.md`.
5. Update `99_LEGACY_MERGE_LEDGER.md` when the conflict came from legacy.

## Required cross-links

Each file must answer:

- What does this file own?
- What is forbidden?
- What evidence proves compliance?
- Which guard enforces it?
- Which file owns adjacent domains?
- What remains out of scope?

## Minimum governance quality bar

A governance file is unacceptable if it is only slogans. It must include enforceable rules, owner paths, allowed/forbidden examples, evidence requirements, and closure conditions.

## File classification law

Governance-related files must be classified before they are promoted, retained, or removed.

| Class | Meaning |
|---|---|
| `CANONICAL_AUTHORITY` | active numbered governance owner file in `governance/` |
| `SUPPORT_FILE` | active support file owned by a numbered authority |
| `EXECUTABLE_GUARD` | implementation under `tools/guards` derived from governance |
| `EXECUTABLE_SCRIPT` | implementation helper derived from governance |
| `AGENT_OR_SKILL_CONTRACT` | `.github` agent/skill file derived from governance |
| `CI_WORKFLOW` | workflow derived from governance |
| `TRANSITIONAL_REFERENCE_ONLY` | donor/archive reference, never active authority |
| `REMOVAL_CANDIDATE` | may be deleted only through cleanup evidence |

Every file must have exactly one active classification at a time.

## Active authority set

The canonical authority set contains 25 files only:

```text
00_README.md
01_GOVERNANCE_INDEX.md
02_PLATFORM_SSOT.md
03_REPO_BOUNDARIES.md
04_ARCHITECTURE_RULES.md
05_PACKAGE_BOUNDARIES.md
06_APPS_AND_SHELLS.md
07_SURFACES_AND_SERVICES.md
08_UI_KIT_AND_BRAND.md
09_API_BINDING_RUNTIME.md
10_SERVICE_CLOSURE.md
11_EVIDENCE_AND_TRACEABILITY.md
12_TESTING_AND_PRODUCTION_READINESS.md
13_CI_AND_GATES.md
14_GUARDS_CATALOG.md
15_AGENT_AND_AI_EXECUTION.md
16_SECURITY_AND_SECRETS.md
17_CLEANUP_AND_DEPRECATION.md
18_BRANCH_AND_CHECKPOINTS.md
19_CONTROL_PANEL_AND_OPERATING_MODEL.md
20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md
22_DSH_GOLDEN_SLICE.md
23_WARNINGS_AND_FALSE_POSITIVES.md
24_TRACEABILITY_AND_ROADMAP.md
99_LEGACY_MERGE_LEDGER.md
```

Standalone runtime-observability authority is absorbed into `09_API_BINDING_RUNTIME.md`.
Standalone service-blueprint authority is absorbed into `10_SERVICE_CLOSURE.md`.

## Current package structure

```text
governance/
  00_README.md
  01_GOVERNANCE_INDEX.md
  ...
  24_TRACEABILITY_AND_ROADMAP.md
  99_LEGACY_MERGE_LEDGER.md
  AGENT_CHANGE_LEDGER.md (support-only; owner 15)
  AGENT_UPDATE_VALIDATION_CHECKLIST.md (support-only; owner 15)
```

The legacy donor folder `governance/governance-legacy` is not part of the active control plane. After extraction is complete it should be removed. Any future reintroduction is archive-only and excluded from active policy.
