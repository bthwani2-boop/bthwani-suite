# BTHWANI AGENT FAILURE MODES — V7

If any item occurs, output `CYCLE_INVALID` or `FIX_REQUIRED`.

| Failure | Required response |
|---|---|
| Agent skips package check evidence | `PACKAGE_RECHECK_NOT_RUN_WITH_REASON` and stop before apply |
| Agent executes multiple tasks | `CYCLE_INVALID` |
| Agent starts design polish early | `CYCLE_INVALID` |
| Agent asks for screenshots during discovery | `SCREENSHOTS_DEFERRED` |
| Agent creates role files without proof | `FIX_REQUIRED` |
| Agent moves files without Topic Decision Matrix | `CYCLE_INVALID` |
| Agent adds code over dead/duplicate/leaked code | `HYGIENE_FIX_FIRST` |
| Agent creates shared for one-use code | demote or block |
| Agent claims performance without metrics | `PERFORMANCE_NUMBERS_UNPROVEN_WITH_REASON` |
| Agent claims ready with remaining gaps | `CYCLE_INVALID` |
| Agent changes UI in refactor without reason | `NEEDS_VISUAL_EVIDENCE_AFTER_APPLY` + risk |
| Agent ignores untracked files | `EVIDENCE_INCOMPLETE` |
| Agent cannot run web benchmark for major decision | `BENCHMARK_CONFIDENCE_REDUCED` + human approval |
| Agent skips Technical / Logic Gap Discovery gate and proceeds to design | `CYCLE_INVALID` — logic gate must precede design |
| Agent claims UI ready while logic/handler/state/flow gaps remain unclassified | `CYCLE_INVALID` — all gaps must be classified before READY |
| Agent produces screenshots outside the permitted visual gate | `EVIDENCE_NOISE` — `SCREENSHOTS_DEFERRED` must remain until visual gate |
| Agent detects navigation drift and continues without stopping | `NAVIGATION_DRIFT_DETECTED: yes` + `STOP_APPLYING: yes` + `RETURN_TO_FILE: BTHWANI_AGENT_NAVIGATION_MAP.md` + `HUMAN_APPROVAL_REQUIRED_BEFORE_CONTINUING: yes` |
| Agent opens all package files at once without reason | `NAVIGATION_DRIFT_DETECTED` + `TOKEN_WASTE_RISK: yes` — restart from QUICK_START |
| Agent moves to implementation without declaring NAVIGATION_STATE | `NAVIGATION_GATE_MISSING` + `CYCLE_INVALID` |
| Agent claims PASS with manifest.version mismatch or SHA256 failure | `PACKAGE_INVALID_DO_NOT_USE` — fix package identity before proceeding |
