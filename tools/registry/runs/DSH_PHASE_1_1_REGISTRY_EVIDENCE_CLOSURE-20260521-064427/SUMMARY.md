# DSH Phase 1.1 Evidence Summary
## SESSION_ID
`DSH_PHASE_1_1_REGISTRY_EVIDENCE_CLOSURE-20260521-064427`

## Decision
**DONE** — Phase 1.1 source changes are committed, all verification gates pass, evidence is complete.

No claim of PASS/CLOSED/100%. What is confirmed is documented below with evidence.

---

## Git Baseline
| Item | Value |
|---|---|
| Branch | `ghb/0163-20260521-055416-gitattributes-dsh` |
| HEAD | `8e6ab3f9ef9e2a8693203f824b06ca25836ebbe5` |
| Working tree | CLEAN — no unstaged tracked changes |
| Staged | EMPTY |
| Untracked | 1 file: `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_1_1_FORENSIC_REVIEW_PACKAGE.zip` (plan artifact) |

---

## Source Files Changed in Phase 1.1
| File | Change | Status |
|---|---|---|
| `dsh/frontend/shared/dsh-flow-registry.ts` | Added `getDshFlowRegistryStats()`, `getDshFlowRegistryValidationSummary()`, `DshFlowRegistryStats`, `DshFlowRegistryValidationResult` | Committed |
| `dsh/frontend/shared/index.ts` | Added stats exports + Phase 1.1 session reference comment | Committed |
| `dsh/frontend/app-partner/dsh-partner.types.ts` | Added `DSH_PARTNER_OPERATIONAL_FLOW_IDS_EXPECTED_COUNT`; corrects Phase 1 claim of 31 → 27 | Committed |
| `dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx` | `isDshHiddenCompatFlow` activated in `resolveCaseWorkspaceTarget()` — dead import resolved | Committed |

---

## Registry Numeric Facts
| Metric | Value |
|---|---|
| Total entries | **40** |
| Primary flows | 24 |
| Contextual flows | 7 |
| Hidden-compat entries | **8** |
| Internal entries | 1 |
| Finance-preview (financialImpact=true) | **3** |
| Escalation-owner entries | **26** |
| Partner-owned entries (ownerSurface=app-partner) | 26 |
| Partner operational flow IDs (dsh-partner.types.ts) | **27** |
| Partner support route IDs | 22 |
| Duplicate IDs | **0** |

---

## Registry Validation Results
| Check | Result |
|---|---|
| Duplicate IDs | PASS — 0 duplicates |
| Missing required fields | PASS — 0 violations |
| Finance preview rule (financialImpact=true → finance-preview-only) | PASS — 3/3 entries correct |
| Hidden compat rule (hiddenCompat=true → hidden-compat visibility) | PASS — 8/8 entries correct |
| Overall `isValid` | **true** |

---

## Registry Consumption Baseline
| Consumer | Role | Executable? |
|---|---|---|
| `dsh/frontend/shared/dsh-flow-registry.ts` | Registry source | N/A (defines) |
| `dsh/frontend/shared/index.ts` | Barrel export | No (barrel only) |
| `dsh/frontend/app-partner/dsh-partner.types.ts` | Mapping alignment | Indirect — count constant + mapping tables |
| `dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx` | Active consumer | **YES** — `isDshHiddenCompatFlow` in `resolveCaseWorkspaceTarget()` |

`app-client`, `app-captain`, `app-field`, `control-panel` — no registry consumption in Phase 1.1. **TODO Phase 2.**

---

## Route Reachability Summary
| Status | Count |
|---|---|
| PROVEN_REACHABLE_BY_ROUTE | 7 |
| SCREEN_EXISTS_ONLY | 14 |
| HIDDEN_COMPAT | 8 |
| SUMMARY_ONLY_TBD | 9 (Phase 2 target) |
| CONTROL_PANEL_OWNER_TBD | 2 (Phase 2 target) |
| **Total** | **40** |

---

## Staged / Untracked Accounting
| File | Classification | Accounted |
|---|---|---|
| `tools/plan/bthwani_all_apps_dsh/DSH_PHASE_1_1_FORENSIC_REVIEW_PACKAGE.zip` | PLAN_EVIDENCE_ARTIFACT | YES — added to git tracking in final commit |
| `.gitattributes` | REPO_CONFIG | YES — intentional LF normalization; committed |
| `tools/plan/bthwani_all_apps_dsh/**` | PLAN_ARTIFACTS | YES — committed; not source changes |

No `BLOCKED_REVIEW_REQUIRED` items.

---

## Verification Results
| Gate | Result |
|---|---|
| `git diff --check` (tracked) | PASS |
| `git diff --cached --check` (staged) | PASS (empty) |
| `pnpm -w exec tsc --noEmit` | PASS (0 errors) |
| `guard:tamagui-import-boundary` | PASS (fail=0, warn=0) |
| `guard:i18n-direction:mobile-control-panel` | PASS |

---

## Evidence Files
```
tools/registry/runs/DSH_PHASE_1_1_REGISTRY_EVIDENCE_CLOSURE-20260521-064427/
  SUMMARY.md
  changed-files.txt
  source-vs-evidence-scope.csv
  registry-validation.csv
  registry-consumption.csv
  route-reachability-validation.csv
  git-status.txt
  git-diff-stat.txt
  git-diff-name-status.txt
  git-diff-check.txt
  git-staged-diff-stat.txt
  git-staged-name-status.txt
  git-staged-diff-check.txt
  git-untracked-files.txt
  tsc-noemit.txt
  guard-tamagui-import-boundary.txt
  guard-i18n-direction-mobile-control-panel.txt
  LOCAL_CHANGE_REVIEW.patch
  UNTRACKED_FILES_MANIFEST.txt
  DSH_PHASE_1_1_REGISTRY_EVIDENCE_CLOSURE-20260521-064427.zip
```

---

## What Remains After Phase 1.1
1. **Phase 2 target** — app-client, app-captain, app-field, control-panel to consume registry (9 SUMMARY_ONLY_TBD + 2 CONTROL_PANEL_OWNER_TBD flows need real surface wiring).
2. **getDshEscalationFlows()** — available in registry but not yet wired to control-panel escalation queue consumer.
3. **Route-driven tests** — PROVEN_REACHABLE_BY_ROUTE status is by route string + screenHint, not by automated navigation test. Full route integration tests are a Phase 2 concern.
4. **Color system audit** — Phase 0 flagged 12 DSH files with hardcoded color patterns. Not in Phase 1.1 scope; carry to Phase 2.
