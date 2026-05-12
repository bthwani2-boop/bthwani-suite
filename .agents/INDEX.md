# BThwani Agent Index

## Reading order

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/AUTHORITY_BOUNDARY.md`
4. The relevant skill under `.agents/skills/`
5. The relevant adapter under `.agents/adapters/`

## Skills

| Skill | Use |
| --- | --- |
| `bthwani-current-workspace-authority` | Resolve active roots, stale paths, and mutation boundaries. |
| `bthwani-agent-governance-execution` | Enforce scoped execution, evidence, and verification. |
| `bthwani-local-evidence-pack` | Build local registry evidence packs and root review artifacts. |
| `bthwani-ui-kit-surface-contract` | Enforce UI kit ownership, RTL, and brand rules. |
| `bthwani-screen-flow-binding-contract` | Lock visible flow, route, and binding contracts. |
| `bthwani-go-backend-target-boundary` | Keep backend decisions aligned to the Go target boundary. |
| `bthwani-dsh-ui-kit-golden-slice` | Keep DSH UI closure narrow and evidence-driven. |
| `bthwani-patch-review-and-evidence` | Review diffs, patches, and evidence packs before acceptance. |
| `bthwani-agent-restoration-forensics` | Rebuild deleted agent sources from read-only history without direct restore. |
| `nx-workspace` | Inspect Nx workspace truth before path or project decisions. |
| `nx-generate` | Review scaffolding impact before any generator or project-structure work. |
| `nx-run-tasks` | Run verification through Nx with the correct workspace conventions. |

## Adapters

| Adapter | Root entry |
| --- | --- |
| `copilot.md` | `.github/copilot-instructions.md` |
| `codex.md` | `.codex/config.toml` |
| `gemini.md` | `GEMINI.md` |
| `claude.md` | `CLAUDE.md` |
| `opencode.md` | `opencode.json` |
| `cursor.md` | adapter only unless a future tool proves a root entry is required |

## Governance and evidence

- Governance lives under `governance/`.
- Guard implementations live under `tools/guards/`.
- Evidence lives under `tools/registry/runs/{SESSION_ID}/`.
- Active agent files must stay short and must not duplicate long governance or legacy reference trees.

