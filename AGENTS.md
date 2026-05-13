<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->

<!-- BTHWANI_CURRENT_AGENT_CONTRACT_START -->

## BThwani current agent contract

This repo is `bthwani-suite`. The active local root is:

```text
C:\bthwani-suite
```

Read `pnpm-workspace.yaml` before choosing paths. Current workspace roots are flat:

```text
webapp/runtime
website/runtime
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
ui-kit
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

Do not use legacy nested app/package roots from older layouts as active mutation targets unless the current branch proves them active.

Global agent source:

- `.agents/`

Use these project-owned skills when relevant:

- `.agents/skills/bthwani-current-workspace-authority/SKILL.md`
- `.agents/skills/bthwani-agent-governance-execution/SKILL.md`
- `.agents/skills/bthwani-local-evidence-pack/SKILL.md`
- `.agents/skills/bthwani-ui-kit-surface-contract/SKILL.md`
- `.agents/skills/bthwani-screen-flow-binding-contract/SKILL.md`
- `.agents/skills/bthwani-go-backend-target-boundary/SKILL.md`
- `.agents/skills/bthwani-dsh-ui-kit-golden-slice/SKILL.md`
- `.agents/skills/nx-workspace/SKILL.md`
- `.agents/skills/nx-generate/SKILL.md`
- `.agents/skills/nx-run-tasks/SKILL.md`

Core laws:

- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local execution.
- Do not use the npm shim for local tool execution; prefer `pnpm exec` or `pnpm dlx` only when required.
- Evidence root is `tools/registry/runs/{SESSION_ID}`.
- New registry ZIPs must be named `{SESSION_ID}.zip`, not the legacy handoff zip pattern.
- Backend target is Go unless current repo evidence explicitly says otherwise.
- UI architecture: Screen / Surface / App -> `@bthwani/ui-kit` public exports -> Tamagui internally inside ui-kit only.
- Arabic/RTL UI must be directionally correct: icon+text cluster on the right, action/chevron opposite, right-aligned text, safe spacing, no clipping.
- Do not claim `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

<!-- BTHWANI_CURRENT_AGENT_CONTRACT_END -->
