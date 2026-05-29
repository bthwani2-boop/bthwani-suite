# BTHWANI AGENT FAILURE MODES — V6

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
