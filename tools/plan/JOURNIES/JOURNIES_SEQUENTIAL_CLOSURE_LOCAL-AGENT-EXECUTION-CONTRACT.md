# 04 — Local Agent Execution Contract

انسخ هذا العقد فوق أي طلب ترسله إلى VS Code Copilot / Gemini / أي وكيل محلي.

```text
You are executing one local BThwani work item only inside C:\bthwani-suite.

Before execution:
- Read the relevant agent files and skills.
- Read the target journey/slice file.
- Read DSH/WLT truth docs referenced by the work item.
- Inspect first. Do not edit until you list intended files and reasons.

Allowed:
- Modify only files required to close the current slice.
- Add missing code, UI states, API/OpenAPI, backend, binding, tests, evidence, docs truth sync only when inside scope.
- Remove duplication/dead code/noise only when proven by usage/import scan and inside scope.

Forbidden:
- No GitHub write.
- No commit, push, PR, merge.
- No broad refactor.
- No unrelated files.
- No dependency/lockfile/CI changes unless explicitly required and proven.
- No local financial logic outside WLT.
- No design system local to screens/surfaces/apps.
- No PASS/CLOSED/READY/100% claim without evidence.

Mandatory:
- Apply on-demand retrieval.
- Use central color system.
- Preserve strict RTL.
- Keep DSH data/media fixtures centralized.
- Produce evidence in tools/registry/runs/{SESSION_ID}.
- Final zip must be {SESSION_ID}.zip.
```
