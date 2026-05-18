# 00 — Agent Start Here

You are executing a strict DSH UI/UX/Flow closure plan inside `C:\bthwani-suite`.

## Mandatory first actions

1. Read this package fully before editing.
2. Read the repo agent and skill files relevant to this task:
   - `AGENTS.md`
   - `.agents/**`
   - `CLAUDE.md` if using Claude
   - any repo skill files related to governance, registry, UI, evidence, TypeScript, Git, screenshots
3. Run:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
.\tools\plan\DSH_UI_UX_FLOW_FINAL_CLOSURE_PLAN-20260518\scripts\Invoke-DshPlanPreflight.ps1
```

4. Do not start implementation if preflight reports missing required files or dirty unaccounted changes.

## Execution instruction

نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء داخل حدود **UI/UX/Flow فقط**، ولا تتوقف إلا بعد إغلاق الحلقة الحالية بالأدلة، بصفر فجوات داخل نطاق الحلقة، صفر نقص، صفر تكرار، صفر أخطاء، وبدون الانتقال لأي مهمة أخرى.

## Critical constraints

- Do not implement API/backend/database/runtime/WLT mutations.
- Do not claim runtime readiness.
- Do not redesign app-client screens. They are protected, except specific `MySpaceScreen` tabs if proven broken.
- Correct ML-001/ML-004 owner terminology: Partner Management / قسم الشركاء, not general ops.
- Do not use `Workspace` generically. Use `Screen / Section / Sheet / State / Panel / Queue / Workspace` precisely.
- Remove/treat/correct noise, duplication, dead code, leakage, fragmentation, and scattering only with evidence. No blind deletion.
- توجب الالتزام بنظام الألوان المركزي.
- Reusable UI must use `@bthwani/ui-kit` public exports; do not create new ui-kit files unless non-negotiable and human-approved.

## Loop rule

For each loop:

1. Diagnose current state.
2. List exact files to touch.
3. Apply bounded correction.
4. Run verification.
5. Produce evidence.
6. Mark each ML row: `DONE_UI_FLOW`, `NEEDS_VISUAL_EVIDENCE`, `OWNER_DECISION_REQUIRED`, `BLOCKED_BY_CONTRACT`, `BLOCKED_BY_WLT_AUTH`, or `RUNTIME_LATER`.
7. Do not move to the next loop until the current loop is DONE/BLOCKED with evidence.
