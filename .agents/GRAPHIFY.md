# BThwani Graphify Contract

Graphify is an agent-neutral **context and navigation layer** for `C:\bthwani-suite`.

## Role

Graphify = Context / Navigation / Impact Discovery.
Graphify ≠ Toolchain leader.
Graphify ≠ Acceptance evidence.
Graphify ≠ Final proof of any kind.

For tool and guard selection, use `bthwani-evidence-gate-router-contract` (`.agents/EVIDENCE_GATE_ROUTER.md`).

## Scope

- Applies to every local coding agent that reads `.agents/`.
- Uses `graphify-out/graph.json` as generated local cache.
- Uses exact repository files as final proof.
- Keeps `graphify-out/` untracked unless a human explicitly approves tracking generated graph output.

## Use Graphify when

- Where something lives in the repo
- Dependency or path questions (import/export chains)
- Cross-surface impact discovery before making a change
- Narrowing the file set before running targeted analysis tools

## Do NOT use Graphify when

- Final acceptance decision → evidence pack only
- Security proof → Semgrep / Trivy / Checkov / CodeQL (PR/release only)
- Type proof → `tsc`
- Runtime proof → Playwright / Cucumber
- UI proof → screenshots / Playwright / react-scanner
- API contract proof → Spectral / openapi-typescript
- Dependency safety proof → dependency-cruiser / madge / sherif
- Every task by default → Graphify is optional, not mandatory

## Optional Use

Graphify is **not required for every task**. Use it only when cross-file scope is unknown or a relationship question is present. Do not read Graphify docs or run Graphify commands on docs-only, agents-only, governance-only, or single-file tasks.

## Focused Commands

    Set-Location -LiteralPath "C:\bthwani-suite"
    graphify query "<focused question>"
    graphify path "<A>" "<B>"
    graphify explain "<concept>"

## Update Path

- Do NOT run `graphify update .` by default after every code change.
- Run `graphify update .` (or a focused update) only when:
  1. The task modified code structure or imports, AND
  2. Subsequent steps in the same session require accurate graph navigation, AND
  3. There is explicit justification for the update.
- Existing Git hooks keep Graphify current after commit, checkout, and merge for agents using this repo.
- `.codex/hooks.json` is Codex-specific only; it does not replace this shared `.agents` contract.

## Acceptance

Graphify output alone cannot justify `PASS`, `CLOSED`, `FINAL`, `READY`, `SAFE`, `100%`, or equivalent closure wording.
