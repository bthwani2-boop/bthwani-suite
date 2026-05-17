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

Read `pnpm-workspace.yaml` before choosing paths. Treat current flat workspace roots as active unless the current branch proves otherwise.

Global agent source:

- `.agents/`

Project truth source:

- `governance/`

Core laws:

- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local execution.
- Do not use unsafe or unjustified launchers for local tool execution; prefer `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`.
- Evidence root is `tools/registry/runs/{SESSION_ID}`.
- New registry ZIPs must be named `{SESSION_ID}.zip`.
- If a task touches `.github/`, GitHub automation, CI, workflows, prompts, or CODEOWNERS, read `.github/copilot-instructions.md` and the relevant `.github/*` files before acting.
- Backend target is Go unless current repo evidence explicitly says otherwise.
- UI architecture: Screen / Surface / App -> `@bthwani/ui-kit` public exports -> Tamagui internally inside ui-kit only.
- Arabic/RTL UI must be directionally correct: icon+text cluster on the right, action/chevron opposite, right-aligned text, safe spacing, no clipping.
- ØªÙˆØ¬Ø¨ Ø§Ù„Ø§Ù„ØªØ²Ø§Ù… Ø¨Ù†Ø¸Ø§Ù… Ø§Ù„Ø£Ù„ÙˆØ§Ù† Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ.
- ØªØ¬Ø¨ Ø¥Ø²Ø§Ù„Ø© ÙˆÙ…Ø¹Ø§Ù„Ø¬Ø© ÙˆØªØµØ­ÙŠØ­ Ø§Ù„Ø¶Ø¬ÙŠØ¬ ÙˆØ§Ù„ØªÙƒØ±Ø§Ø± ÙˆØ§Ù„ÙƒÙˆØ¯ Ø§Ù„Ù…ÙŠØª ÙˆØ§Ù„ØªØ³Ø±Ø¨ ÙˆØ§Ù„ØªØ´Ø¸ÙŠ ÙˆØ§Ù„ØªØ¨Ø¹Ø«Ø±.
- Any reusable design belongs in approved design system / `@bthwani/ui-kit`.
- No new UI-kit files unless the need is non-negotiable, proven by evidence, and human-approved.
- Service/application/domain specialization belongs in `governance/`; `.agents` skills remain general.
- Do not claim `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` without Git diff, verification, and evidence.

Use these project-owned skills when relevant:

- `.agents/skills/bthwani-current-workspace-authority/SKILL.md`
- `.agents/skills/bthwani-agent-governance-execution/SKILL.md`
- `.agents/skills/bthwani-local-evidence-pack/SKILL.md`
- `.agents/skills/bthwani-patch-review-and-evidence/SKILL.md`
- `.agents/skills/bthwani-agent-restoration-forensics/SKILL.md`
- `.agents/skills/bthwani-domain-governance-reader/SKILL.md`
- `.agents/skills/bthwani-ui-kit-surface-contract/SKILL.md`
- `.agents/skills/bthwani-frontend-design-excellence-contract/SKILL.md`
- `.agents/skills/bthwani-screen-flow-binding-contract/SKILL.md`
- `.agents/skills/bthwani-platform-vars-control-contract/SKILL.md`
- `.agents/skills/bthwani-runtime-provider-config-contract/SKILL.md`
- `.agents/skills/bthwani-api-contract-client-boundary/SKILL.md`
- `.agents/skills/bthwani-go-backend-target-boundary/SKILL.md`
- `.agents/skills/bthwani-data-fixture-simulation-contract/SKILL.md`
- `.agents/skills/bthwani-finance-ledger-contract/SKILL.md`
- `.agents/skills/bthwani-commercial-growth-contract/SKILL.md`
- `.agents/skills/bthwani-commerce-catalog-contract/SKILL.md`
- `.agents/skills/bthwani-operations-dispatch-contract/SKILL.md`
- `.agents/skills/bthwani-mobile-navigation-back-contract/SKILL.md`
- `.agents/skills/bthwani-security-secrets-privacy-contract/SKILL.md`
- `.agents/skills/bthwani-supply-chain-intake-contract/SKILL.md`
- `.agents/skills/bthwani-test-quality-gates-contract/SKILL.md`
- `.agents/skills/bthwani-release-runtime-gates/SKILL.md`
- `.agents/skills/bthwani-observability-performance-contract/SKILL.md`
- `.agents/skills/bthwani-agent-skill-authoring-contract/SKILL.md`
- `.agents/skills/bthwani-agent-registry-validator/SKILL.md`
- `.agents/skills/nx-workspace/SKILL.md`
- `.agents/skills/nx-generate/SKILL.md`
- `.agents/skills/nx-run-tasks/SKILL.md`

<!-- BTHWANI_CURRENT_AGENT_CONTRACT_END -->
