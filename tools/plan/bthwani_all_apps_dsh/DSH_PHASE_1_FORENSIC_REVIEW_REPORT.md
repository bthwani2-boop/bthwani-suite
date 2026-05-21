# DSH Phase 1 Forensic Review Report
## Decision
**FIX_REQUIRED قبل Phase 2.** التنفيذ اتجاهه صحيح لكنه ليس 100%. لا يجوز اعتباره مغلقًا بسبب فجوات evidence وسلوك registry غير مستهلك فعليًا عبر الأسطح.
## Numeric Evidence Summary
- Repo ZIP inspected: `bthwani-suite-ghb-0163-20260521-055416-gitattributes-dsh`
- Evidence ZIP inspected: `DSH_PHASE_1_FLOW_REGISTRY-20260521-054141.zip`
- Files in repo ZIP: `1530` paths including directories
- Phase 1 evidence files: `12`
- Registry entries detected: `40`
- Partner operational IDs detected in `dsh-partner.types.ts`: `27`
- Partner support route IDs detected: `22`
- Missing partner IDs from registry: `0` → `[]`
- Hidden compat entries detected by object parse: `8` → `['order-alerts', 'order-sla-risk', 'order-issue-required', 'auction-status-update', 'order-rejection', 'partner-finance-bridge', 'partner-settlement-summary', 'partner-commission-summary']`
- Finance preview entries: `3`
- Escalation owner entries: `26`
- Registry consumers in DSH frontend: `4` → `['dsh/frontend/app-partner/dsh-partner.types.ts', 'dsh/frontend/shared/dsh-flow-registry.ts', 'dsh/frontend/shared/index.ts', 'dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx']`
- Direct Tamagui imports in DSH frontend: `0`
- DSH files with hardcoded color patterns: `12`

## Folder Inventory
| Folder | Files | TS/TSX | Bytes |
|---|---:|---:|---:|
| `dsh/frontend/app-client` | 48 | 48 | 725544 |
| `dsh/frontend/app-partner` | 27 | 27 | 343757 |
| `dsh/frontend/app-captain` | 22 | 22 | 201875 |
| `dsh/frontend/app-field` | 25 | 25 | 123371 |
| `dsh/frontend/control-panel` | 122 | 120 | 845169 |
| `dsh/frontend/shared` | 23 | 23 | 266066 |
| `wlt/frontend` | 65 | 64 | 162438 |

## Changed / Added Files Review
| Path | Action | Lines | Bytes | Imports | Exports | Review |
|---|---|---:|---:|---:|---:|---|
| `.gitattributes` | ADDED | 1 | 17 | 0 | 0 | New repo-level normalization file. Harmless by itself, but Phase 1 evidence did not mention it. |
| `dsh/frontend/shared/dsh-flow-registry.ts` | ADDED | 783 | 31891 | 0 | 12 | Core Phase 1 output. Metadata-only registry exists; no UI/backend side effects. Needs tighter validation/consumption before Phase 2. |
| `dsh/frontend/shared/index.ts` | MODIFIED | 386 | 9659 | 0 | 30 | Public export added. Acceptable, but public API change requires scope/evidence accounting. |
| `dsh/frontend/app-partner/dsh-partner.types.ts` | MODIFIED | 249 | 8457 | 0 | 21 | Only adds registry alignment comment; it does not actually derive types from registry. Existing local source remains independent. |
| `dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx` | MODIFIED | 684 | 30568 | 7 | 4 | Adds import and comments, but import is unused and no runtime guard/consumer behavior is changed. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_1_FLOW_REGISTRY_AND_REACHABILITY_PROMPT.md` | ADDED | 372 | 15451 | 0 | 1 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/DSH_PHASE_0_SYSTEM_AUDIT_REPORT.md` | ADDED | 346 | 18152 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/dsh-control-panel-alignment.csv` | ADDED | 126 | 41969 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/dsh-cross-surface-consistency.csv` | ADDED | 14 | 36981 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/dsh-flow-inventory.csv` | ADDED | 352 | 98739 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/dsh-on-demand-audit.csv` | ADDED | 227 | 79146 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/dsh-priority-roadmap.csv` | ADDED | 9 | 6295 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/dsh-route-reachability.csv` | ADDED | 118 | 40156 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/dsh-surface-inventory.csv` | ADDED | 11 | 17720 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/dsh-ui-ux-audit.csv` | ADDED | 226 | 63353 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/evidence.json` | ADDED | 66 | 2064 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/git-diff-check.txt` | ADDED | 7 | 4171 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034/git-status.txt` | ADDED | 7 | 165 | 0 | 0 | Plan/evidence artifact added under tools/plan; should be accounted separately from source code and staged diff. |

## Critical Findings
| ID | Severity | Finding |
|---|---|---|
| P0-EVIDENCE-001 | HIGH | Evidence incomplete: `git-status.txt` shows staged Phase 0 plan/evidence files and untracked `dsh-flow-registry.ts`, while `git-diff-stat/name-status` only cover three tracked modified files. Staged and untracked content were not included in a review patch. |
| P0-EVIDENCE-002 | HIGH | Evidence summary claims 31 partner operational flows, but current `DSH_PARTNER_OPERATIONAL_FLOW_IDS` contains 27 IDs. The registry covers those 27 plus 13 cross-surface/control entries. This is not fatal, but the numeric claim is incorrect. |
| P1-REGISTRY-001 | HIGH | Registry exists and is exported, but real consumption is nearly absent. Only `PartnerSupportScreen.tsx` imports `isDshHiddenCompatFlow`, and the import is not used in executable logic. |
| P1-REGISTRY-002 | HIGH | `dsh-partner.types.ts` remains an independent source for operational IDs and route mapping. The new registry is not yet the real SSoT; it is parallel metadata. |
| P1-REACH-001 | MEDIUM | `route-reachability-baseline.csv` marks many flows REACHABLE by screen hints/route strings, not by enforcing registry-driven route tests. It is a useful baseline but not proof of integrated reachability. |
| P1-NOISE-001 | MEDIUM | Comment-only annotations were added inside `PartnerSupportScreen.tsx` data rows. This documents intent but adds visual/source noise without preventing misuse. |
| P1-SCOPE-001 | MEDIUM | Uploaded repo includes `.gitattributes` and `tools/plan/bthwani_all_apps_dsh/**` additions not represented in Phase 1 `changed-files.txt`. They may be acceptable artifacts, but they were not fully accounted in evidence. |

## What Worked
- A shared metadata registry was created at `dsh/frontend/shared/dsh-flow-registry.ts`.
- The registry is pure data/types and does not introduce backend/API/runtime mutations.
- Shared barrel exports were added through `dsh/frontend/shared/index.ts`.
- Finance preview flows are marked with `financialImpact=true` and `finance-preview-only`.
- Hidden compatibility flows are represented in the registry.
- Evidence reports `tsc`, Tamagui guard, and i18n/direction guard as clean, but local output files are limited.

## 100% Accuracy Verdict
**No.** Phase 1 is directionally correct and probably safe as a baseline, but it is not 100% closed. The main blockers are incomplete evidence accounting, a wrong numeric coverage claim, registry parallelism, and missing real consumption by surfaces.

## Required Next Step
Do **Phase 1.1 — Registry Evidence Closure + Runtime Consumption Baseline**, not Phase 2. This must clean evidence gaps, remove dead imports/comment-only guards, and make registry the actual read-only baseline consumed by partner/control-panel checks without broad UI changes.
