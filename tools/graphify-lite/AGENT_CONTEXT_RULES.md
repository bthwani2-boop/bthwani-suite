# BThwani Graphify Lite Agent Context Rules

These rules are mandatory for AI agents working inside `C:\bthwani-suite`.

## Do not ingest generated or noisy folders

Do not read, summarize, index, or send the full contents of:

- `graphify-out/`
- `tools/registry/runs/`
- `.next/`
- `.tamagui/`
- `node_modules/`
- `dist/`
- `build/`
- `coverage/`

## Treat graphify-out as volatile output

`graphify-out/` is not source code. It is local diagnostic output only.

Allowed graphify-out files for an implementation agent are only:

- `graphify-out/agent-neutral-deep-diagnostic/10-agent-task.md`
- `graphify-out/agent-neutral-deep-diagnostic/09-repomix-selected.xml`
- `graphify-out/agent-neutral-deep-diagnostic/11-verification.md`

Do not use full `madge-graph.json`, full cache files, full graph manifests, or full historical outputs as agent context unless a human explicitly asks for that exact file.

## Evidence policy

Official evidence is stored under:

- `tools/registry/runs/{SESSION_ID}`

Agents may inspect targeted evidence files only, such as:

- `SUMMARY.md`
- `evidence.json`
- specific guard output files

Do not ingest the full registry history.

## Tool roles

- `dependency-cruiser`: boundary guard.
- `ast-grep`: exact structural rule guard.
- `react-scanner`: UI usage signal.
- `jscpd`: duplication signal.
- `knip`: unused-code suspicion signal only.
- `madge`: dependency graph and circular dependency signal only.
- `repomix`: small selected context pack for agents.

No tool result alone is sufficient to delete code or claim closure.

## Execution scope

Use slices. Do not process the whole repository unless explicitly requested.

Prefer small scoped packs over broad context:

- Targeted source files.
- Direct dependencies.
- Direct contracts.
- Direct verification commands.

## Completion policy

Do not claim ready, closed, clean, or 100% unless backed by:

- Git status/diff evidence.
- TypeScript evidence where relevant.
- Guard evidence where relevant.
- Runtime or smoke evidence where relevant.
