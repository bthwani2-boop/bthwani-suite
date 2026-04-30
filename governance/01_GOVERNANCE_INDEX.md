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
| Platform truth | `02`, `07`, `19`, `20`, `22`, `25` | What BThwani is and how services operate. |
| Architecture | `03`, `04`, `05`, `06`, `08`, `09` | Where code belongs and how it connects. |
| Closure | `10`, `11`, `12`, `13`, `14`, `21`, `23`, `24` | How proof, testing, warnings, roadmap, and runtime are accepted. |
| AI/workflow/security | `15`, `16`, `17`, `18` | How AI, secrets, cleanup, branches, and checkpoints behave. |
| Ledger | `99` | Legacy source coverage and extraction accountability. |

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

## Current package structure

```text
governance/
  00_README.md
  01_GOVERNANCE_INDEX.md
  ...
  25_SERVICE_BLUEPRINT_AND_OPERATION_CATALOG.md
  99_LEGACY_MERGE_LEDGER.md
```

No active `governance-legacy` folder is required after this package is applied. If retained locally for review, it must be quarantined/archive-only and excluded from active policy.
