# BThwani Graphify Contract

Graphify is an agent-neutral navigation layer for `C:\bthwani-suite`.

## Scope

- Applies to every local coding agent that reads `.agents/`.
- Uses `graphify-out/graph.json` as generated local cache.
- Uses exact repository files as final proof.
- Keeps `graphify-out/` untracked unless a human explicitly approves tracking generated graph output.

## Required Use

For repository architecture, ownership, route, dependency, import/export, UI-kit, DSH data/media, or cross-surface questions:

1. Start from `C:\bthwani-suite`.
2. Run a focused Graphify command before broad raw-file search:
   - `graphify query "<focused question>"`
   - `graphify path "<A>" "<B>"`
   - `graphify explain "<concept>"`
3. Read the exact files surfaced by Graphify before recommending or editing.
4. Treat Graphify as navigation only, not acceptance evidence.

## Update Path

- After code changes, run `graphify update .` when the change affects code structure or imports.
- Do not run full semantic extraction unless the human explicitly asks.
- Existing Git hooks keep Graphify current after commit, checkout, and merge for any agent using this repo.
- `.codex/hooks.json` is Codex-specific only; it does not replace this shared `.agents` contract.

## Acceptance

Graphify output alone cannot justify `PASS`, `CLOSED`, `FINAL`, `READY`, `SAFE`, `100%`, or equivalent closure wording.
