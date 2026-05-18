# Codex / Claude Execution Prompt

Read `tools\plan\DSH_UI_UX_FLOW_FINAL_CLOSURE_PLAN-20260518\00_AGENT_START_HERE.md` first.

Execute only one loop at a time. Do not skip preflight. Do not implement Runtime/API/Backend/WLT mutations.

Use the package matrices and phase files as the execution source of truth. Before editing, produce a local plan listing exact files to touch and why. After editing, run the package evidence script.

Critical human constraint: app-client UI has already been visually reviewed and designed; do not redesign it. Only minimal logic-safe wiring is allowed, except proven `MySpaceScreen` tab fixes.

Classification rule: do not use `Workspace` generically. Use Screen / Section / Sheet / State / Panel / Queue / Workspace precisely.

Every loop must end with evidence and one of: DONE_UI_FLOW, NEEDS_VISUAL_EVIDENCE, OWNER_DECISION_REQUIRED, BLOCKED_BY_CONTRACT, BLOCKED_BY_WLT_AUTH, RUNTIME_LATER.
