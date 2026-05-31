# BTHWANI EXECUTION CYCLE RECORD — V7 TEMPLATE

> **هذا الملف قالب نظيف.** احذف هذا السطر عند ملء دورة حقيقية.
> السجلات التاريخية: `tools/registry/runs/<SESSION_ID>/CYCLE_RECORD.md`

## 1. Package Recheck
- **PACKAGE_RECHECK_DONE**: [yes / no]
- **PACKAGE_RECHECK_EVIDENCE**: [path to ZIP or PACKAGE_RECHECK_NOT_RUN_WITH_REASON]
- **PACKAGE_RECHECK_STATUS**: [PASS / FAIL / NOT_RUN]
- **PACKAGE_RECHECK_VERSION**: 7.0.0
- **USING_CURRENT_BRANCH_ONLY**: yes
- **NO_HARDCODED_BRANCH**: yes
- **NO_GITHUB_WRITE**: yes
- **ONE_TASK_ONLY**: yes
- **HUMAN_APPROVAL_GATE_ENABLED**: yes
- **DESIGN_POLISH_DEFERRED**: yes
- **SCREENSHOT_GATE_STATUS**: [SCREENSHOTS_DEFERRED / REQUIRED_AFTER_UI_CHANGE / VISUAL_REVIEW_REQUIRED / NOT_REQUIRED]
- **PRE_APPLY_HYGIENE_GATE_ENABLED**: yes

## 2. Target
[وصف المستهدف بدقة]

## 3. Current Branch Rule Status
- **Active Branch**: [ناتج git branch --show-current]
- **HEAD**: [ناتج git rev-parse HEAD]
- **Sanity**: [No branch name hardcoded / UPSTREAM_NOT_CONFIGURED / REMOTE_FRESHNESS_UNPROVEN]

## 4. Target Type
[app screen / control-panel section / control-panel tab / cross-surface journey / DSH data-media / governance-guard-agent / shared module]

## 5. Agents/Governance/Guards Fitness Result
- **tsc --noEmit**: [PASS / FAIL / NOT_RUN]
- **guard:code-hygiene**: [PASS / FAIL / NOT_RUN]
- **guard:tamagui-import-boundary**: [PASS / FAIL / NOT_RUN]
- **guard:i18n-direction**: [PASS / FAIL / NOT_RUN]
- **Relevant stale files**: [NOT_APPLICABLE / list]

## 6. Files Scanned
[قائمة الملفات المفحوصة]

## 7. Linked Surfaces Discovered and Classified
| surface/section/file | relation | evidence | required action | can edit now? | boundary | status |
|---|---|---|---|---|---|---|

## 8. Web/Open-Source Benchmark Matrix or WEB_RESEARCH_UNAVAILABLE
[ملء Matrix أو WEB_RESEARCH_UNAVAILABLE مع السبب]

## 9. Target Discovery Summary
[ملخص الاكتشاف من الريبو]

## 10. Topic Candidate Matrix
| candidate name | user/product meaning | visible entry | owner | main entity | main actions | state lifecycle | data/media source | linked surfaces | should be topic? | reason |
|---|---|---|---|---|---|---|---|---|---|---|

## 11. Topic Decision Matrix
| existing topic/path | proposed topic name | keep/rename/split/merge | topic type | product meaning | owner | entry point | state lifecycle | actions | data/media owner | linked surfaces | decision reason | risk | safe now? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 12. Topic Boundary Contract
| topic | product meaning | owner | entry point | main entity | main actions | state lifecycle | data/media | linked surfaces | belongs here | does not belong here | why separate | why not merged |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 13. Structural Hygiene Matrix
| ID | file/path | issue type | evidence | impact | fix first? | safe now? | owner | decision |
|---|---|---|---|---|---|---|---|---|

## 14. Gap Matrix
| ID | gap type | exact file/path | evidence from code | impact | required fix | safe now? | needs API/backend/runtime later? | priority | owner | blocked reason |
|---|---|---|---|---|---|---|---|---|---|---|

## 15. File Boundary Matrix
| file path | current role | correct role | current issues | exact evidence | target folder/file | should be flat? | role file needed? | remove/merge? | nested allowed? | split? | move? | delete/retire? | owner reason | shared status | risk | priority | safe now? | design impact | design preservation action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 16. Demo Data / Media Centralization Matrix
| current file/path | entity type | current owner | should be central? | central target path | duplicate/conflict? | demo-only? | safe to delete/regenerate? | adapter needed? | consumers to update | risk | action |
|---|---|---|---|---|---|---|---|---|---|---|---|

## 17. Runtime / API Readiness Matrix
| gap id | visible UI/flow need | current preview behavior | future API/runtime dependency | blocking now? | safe UI-only action | forbidden action now | owner | status |
|---|---|---|---|---|---|---|---|---|

## 18. Performance Evidence Matrix
| area | risk found | evidence | required mitigation | measured? | metric/result | status |
|---|---|---|---|---|---|---|

## 19. Target Execution Map
| task id | goal | why now | files to edit | exact changes | linked surfaces touched | preliminary only | forbidden changes | acceptance criteria | verification | rollback | blocker rule | human approval |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 20. Selected One Task
[وصف Task 1 المختارة]

## 21. Task Execution Package
- **Package version**: BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE V7
- **Task ID**: [ID]
- **Goal**: [هدف Task 1]
- **Files to edit**: [قائمة]
- **Exact changes**: [التغييرات]
- **Forbidden changes**: [المحظورات]
- **Acceptance criteria**: [معايير القبول]
- **Rollback files**: [قائمة]
- **Rollback command**: `git restore -- "<path>"`

## 22. Files Changed / Patch / Script / Exact Instructions
[patch أو قائمة التعديلات]

## 23. Verification Commands / Results
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

نتائج:
- git diff --check: [PASS / تفاصيل]
- tsc --noEmit: [PASS (0 errors) / تفاصيل]
- guard results: [PASS / تفاصيل]

## 24. Re-Diagnosis Result
[تشخيص ما بعد التطبيق]

## 25. Remaining Gaps or BLOCKED_WITH_REASON
[قائمة الفجوات المتبقية أو: None]

## 26. Screenshot/Visual Evidence Status
- **Status**: [SCREENSHOTS_DEFERRED / NEEDS_VISUAL_EVIDENCE_AFTER_APPLY / NOT_REQUIRED]
- **Reason**: [السبب]

## 27. Human Approval Gate
- **HUMAN_APPROVAL_REQUIRED_BEFORE_NEXT_TASK**: yes
- **STOP_NOW**: yes
- **Status**: [Ready for human approval / BLOCKED]

## 28. Final Decision
- **Verdict**: [TARGET_TASK_APPLIED_NEXT_TASK_REQUIRED / TARGET_CYCLE_BLOCKED_WITH_REASON / AUDIT_ONLY_ALLOWED_WITH_REASON / CYCLE_INVALID]
