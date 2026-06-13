# BThwani Cursor Adapter

This adapter is intentionally thin.

Read order:

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/AUTHORITY_BOUNDARY.md`
4. `.agents/INDEX.md`
5. One or two relevant `.agents/skills/*/SKILL.md` files only
6. Relevant `governance/` source

Rules:

- Do not create tool-specific mirrors of BThwani rules.
- Do not restore deleted donor trees.
- Do not widen scope.
- Follow the Smart Execution Budget; do not default to full lint, workspace `tsc`, all guards, evidence pack, or ZIP. Evidence is human-requested and task-specific. Full law: [`governance/15_AGENT_AND_AI_EXECUTION.md`](../../governance/15_AGENT_AND_AI_EXECUTION.md).
- `Use relevant skills` does not mean read the whole catalog.
- Do not emit repetitive wait-loop status messages.
- Do not claim completion without evidence.
- Use PowerShell and `pnpm` conventions for `C:\bthwani-suite`.
- If a tool's generic skill conflicts with BThwani rules, BThwani rules win.
- Use `bthwani-evidence-gate-router-contract` to select the minimum gate tier and tools before any analysis.
- Use `.agents/GRAPHIFY.md` only when cross-file scope discovery or relationship questions are present -- not before every search.
