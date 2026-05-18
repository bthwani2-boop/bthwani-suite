# BThwani Agent Index

## Reading order

1. `AGENTS.md`
2. `.agents/AUTHORITY_BOUNDARY.md`
3. Relevant adapter under `.agents/adapters/`
4. Relevant governance source under `governance/`
5. One or two relevant skills under `.agents/skills/`
6. Open `.agents/README.md` or `.agents/SKILL_CATALOG.md` only if skill selection is unclear or direct evidence requires more context

## Execution budget

- `Use relevant skills` means read only the narrowest 1-2 skills that materially help the task.
- Do not default to full lint, workspace `tsc`, all guards, registry evidence, or ZIP for LOW or MEDIUM work.
- Do not emit repetitive wait-loop chatter; one timed wait message is the maximum when a blocking operation is actually in progress.

## General BThwani skills

| Skill | Use |
|---|---|
| `bthwani-current-workspace-authority` | See `.agents/skills/bthwani-current-workspace-authority/SKILL.md`. |
| `bthwani-agent-governance-execution` | See `.agents/skills/bthwani-agent-governance-execution/SKILL.md`. |
| `bthwani-local-evidence-pack` | See `.agents/skills/bthwani-local-evidence-pack/SKILL.md`. |
| `bthwani-patch-review-and-evidence` | See `.agents/skills/bthwani-patch-review-and-evidence/SKILL.md`. |
| `bthwani-agent-restoration-forensics` | See `.agents/skills/bthwani-agent-restoration-forensics/SKILL.md`. |
| `bthwani-domain-governance-reader` | See `.agents/skills/bthwani-domain-governance-reader/SKILL.md`. |
| `bthwani-ui-kit-surface-contract` | See `.agents/skills/bthwani-ui-kit-surface-contract/SKILL.md`. |
| `bthwani-screen-flow-binding-contract` | See `.agents/skills/bthwani-screen-flow-binding-contract/SKILL.md`. |
| `bthwani-platform-vars-control-contract` | See `.agents/skills/bthwani-platform-vars-control-contract/SKILL.md`. |
| `bthwani-runtime-provider-config-contract` | See `.agents/skills/bthwani-runtime-provider-config-contract/SKILL.md`. |
| `bthwani-api-contract-client-boundary` | See `.agents/skills/bthwani-api-contract-client-boundary/SKILL.md`. |
| `bthwani-go-backend-target-boundary` | See `.agents/skills/bthwani-go-backend-target-boundary/SKILL.md`. |
| `bthwani-data-fixture-simulation-contract` | See `.agents/skills/bthwani-data-fixture-simulation-contract/SKILL.md`. |
| `bthwani-finance-ledger-contract` | See `.agents/skills/bthwani-finance-ledger-contract/SKILL.md`. |
| `bthwani-commercial-growth-contract` | See `.agents/skills/bthwani-commercial-growth-contract/SKILL.md`. |
| `bthwani-commerce-catalog-contract` | See `.agents/skills/bthwani-commerce-catalog-contract/SKILL.md`. |
| `bthwani-operations-dispatch-contract` | See `.agents/skills/bthwani-operations-dispatch-contract/SKILL.md`. |
| `bthwani-mobile-navigation-back-contract` | See `.agents/skills/bthwani-mobile-navigation-back-contract/SKILL.md`. |
| `bthwani-security-secrets-privacy-contract` | See `.agents/skills/bthwani-security-secrets-privacy-contract/SKILL.md`. |
| `bthwani-supply-chain-intake-contract` | See `.agents/skills/bthwani-supply-chain-intake-contract/SKILL.md`. |
| `bthwani-test-quality-gates-contract` | See `.agents/skills/bthwani-test-quality-gates-contract/SKILL.md`. |
| `bthwani-release-runtime-gates` | See `.agents/skills/bthwani-release-runtime-gates/SKILL.md`. |
| `bthwani-observability-performance-contract` | See `.agents/skills/bthwani-observability-performance-contract/SKILL.md`. |
| `bthwani-agent-skill-authoring-contract` | See `.agents/skills/bthwani-agent-skill-authoring-contract/SKILL.md`. |
| `bthwani-agent-registry-validator` | See `.agents/skills/bthwani-agent-registry-validator/SKILL.md`. |
| `bthwani-frontend-design-excellence-contract` | See `.agents/skills/bthwani-frontend-design-excellence-contract/SKILL.md`. |
| `bthwani-stop-slop-prose-contract` | See `.agents/skills/bthwani-stop-slop-prose-contract/SKILL.md`. |

## Preserved external/generated skills

| Skill | Use |
|---|---|
| `nx-workspace` | Preserve when already present; BThwani rules override generic examples. |
| `nx-generate` | Preserve when already present; BThwani rules override generic examples. |
| `nx-run-tasks` | Preserve when already present; BThwani rules override generic examples. |
| `nx-import` | Preserve when already present; BThwani rules override generic examples. |
| `nx-plugins` | Preserve when already present; BThwani rules override generic examples. |
| `monitor-ci` | Preserve when already present; BThwani rules override generic examples. |
| `link-workspace-packages` | Preserve when already present; BThwani rules override generic examples. |

## Adapters

| Adapter | Target |
|---|---|
| `claude.md` | Claude Code / Claude |
| `codex.md` | Codex |
| `copilot.md` | GitHub Copilot / VS Code |
| `gemini.md` | Gemini CLI |
| `cursor.md` | Cursor |
| `opencode.md` | OpenCode |

## Rule

Service/application specificity belongs in `governance/`; `.agents` stays general.
