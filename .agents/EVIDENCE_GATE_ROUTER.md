# Evidence Gate Router — BThwani Central Contract

## Principle

There is no single tool leader in BThwani.

Tool selection is driven by task classification, guard-manifest routing, and the smallest viable gate set for the current change. No tool coordinates or leads any other tool automatically.

## Graphify Role (Context / Navigation only)

Graphify (`graphify-out/graph.json`) is a **context and navigation layer**.

Use Graphify when:
- Discovering where something lives in the repo
- Finding dependency paths or import/export chains
- Identifying cross-surface impact before making a change
- Narrowing the file set before running any analysis tool

Do NOT use Graphify when:
- Proving type safety → use `tsc`
- Proving security boundaries → use Semgrep / Trivy / Checkov / CodeQL (PR/release only)
- Proving API contract compliance → use Spectral / openapi-typescript
- Proving UI correctness → use screenshots / Playwright / react-scanner
- Proving runtime behavior → use Playwright / Cucumber
- Making a final PASS / READY / CLOSED / 100% decision → evidence pack only

Graphify output alone cannot justify acceptance.

## Gate Tiers

### Fast Gate (LOW / MEDIUM tasks)
Docs, prompts, single-file text, port checks, git-status work.
- `git status`
- `git diff --check`
- Targeted syntax/type check only when writes occurred in code files

Tools blocked by default: Graphify, repomix, madge, react-scanner, Playwright, Cucumber, Spectral, knip, jscpd, sherif, ls-lint, dependency-cruiser, ast-grep, style-dictionary, stylelint, CodeQL, SonarQube, Semgrep, Trivy, Checkov.

### Scoped Gate (MEDIUM / UI_VISIBLE / HIGH tasks)
One to a few targeted files, UI changes, architecture changes.
- `git status`, `git diff --check`
- Targeted `tsc` when TS files changed
- Domain-specific contract skill (selected from guard-manifest)
- Optional Graphify when cross-file scope is unknown

Tools unlocked on justified need only: repomix, madge, dependency-cruiser, ast-grep, react-scanner, stylelint, style-dictionary, Spectral, openapi-typescript, knip, ls-lint, jscpd, sherif, Playwright (smoke), Cucumber (targeted scenario).

### Heavy Gate (PR / Release / Security-sensitive only)
Multi-surface changes, native changes, security changes, release candidates.
- All Scoped Gate tools
- Full Playwright / Cucumber suite
- CodeQL, SonarQube, Semgrep, Trivy, Checkov

Heavy gates do NOT run on daily work, docs-only, agents-only, or governance-only changes.

## Tool Inventory (with gate tier)

### Design / UI
| Tool | Gate tier |
|---|---|
| `@ast-grep/cli` | Scoped |
| `@tamagui/cli` | Scoped |
| `react-scanner` | Scoped |
| `style-dictionary` | Scoped |
| `stylelint` | Scoped |
| `dependency-cruiser` | Scoped |
| `babel-plugin-react-compiler` | Scoped |
| `eslint-plugin-react-compiler` | Scoped |

### Journey / Runtime
| Tool | Gate tier |
|---|---|
| `@playwright/test` | Scoped (smoke) / Heavy (full suite) |
| `@cucumber/cucumber` | Scoped (targeted) / Heavy (full suite) |

### Structure / Organization
| Tool | Gate tier |
|---|---|
| `@ls-lint/ls-lint` | Scoped |
| `jscpd` | Scoped |
| `knip` | Scoped |
| `madge` | Scoped |
| `sherif` | Scoped |
| `repomix` | Scoped |

### API
| Tool | Gate tier |
|---|---|
| `@stoplight/spectral-cli` | Scoped |
| `openapi-typescript` | Scoped |

### Build / Workspace
| Tool | Gate tier |
|---|---|
| `typescript` / `tsc` | Scoped |
| `nx` | Scoped |
| `next` | Scoped |
| `expo` | Scoped |

### Heavy Gates (PR / Release / Security only)
| Tool | Gate tier |
|---|---|
| CodeQL | Heavy only |
| SonarQube | Heavy only |
| Semgrep | Heavy only |
| Trivy | Heavy only |
| Checkov | Heavy only |

Heavy gates must not run automatically on daily work, docs-only changes, agent or governance changes, or prompt-only changes.

## Routing Logic

1. Classify the task (LOW / MEDIUM / UI_VISIBLE / HIGH / COMMIT_PUSH).
2. Read `guard-manifest.json` (when present) to identify which domain guards apply.
3. Select the minimum gate tier.
4. Run only the tools that the gate tier permits and the task context justifies.
5. If cross-file scope is unknown, use Graphify to narrow scope first, then select tools.
6. Produce evidence: `decision.txt`, `evidence-summary.json`, `tool-selection.json`, `blocking-findings.csv`, `full-logs/`.
7. No PASS / READY / CLOSED / FINAL / SAFE / 100% without a complete evidence pack.

## Skill Routing

Use `bthwani-evidence-gate-router-contract` as the entry skill for all tool-selection decisions.

Do NOT use `bthwani-graphify-query-first` as the primary orchestrator. Graphify is one optional tool within the gate, not the gate itself.

## Evidence Pack (normalized output)

```text
tools/registry/runs/{SESSION_ID}/
  decision.txt
  evidence-summary.json
  tool-selection.json
  blocking-findings.csv
  full-logs/
  before/
```

Evidence pack is mandatory only when: human explicitly requests it, or task is HIGH / PR / Release / sensitive scripted change.

## Acceptance Criteria

PASS_WITH_WARNINGS requires:
- Correct gate tier selected and justified
- Only permitted tools ran
- No Heavy gate tools ran on daily / docs / agents / governance changes
- Evidence pack present if required by task class
- No PASS / CLOSED / READY claimed from Graphify output alone
- `git diff --check` clean
