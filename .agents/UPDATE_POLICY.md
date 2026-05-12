# BThwani Agent Update Policy

## Update routing

- General agent workflow changes go in `.agents/`.
- Tool-specific entry behavior goes in the relevant adapter and root entry file.
- Project decisions go in `governance/`.
- Programmatic verification rules go in `tools/guards/`.
- Run history and temporary review material go in `tools/registry/runs/{SESSION_ID}/`.

## What not to create

- Duplicate skills
- Bridge-only files
- Mirror folders
- Trivial one-line skills
- Long copied donor docs
- Long copied external docs
- New active instructions under `.github/skills`, `.github/agents`, or `.opencode/skills`

## BTH token rename and alias rule

When a change touches `Bth`, `bth`, or `BTH` tokens:

1. Work file by file.
2. Classify each token as safe internal, public/shared, brand/package/repo, live dependency, or ambiguous.
3. Use direct rename only when repo evidence proves the token is local, internal, non-public, non-brand, and unambiguous.
4. Add an alias only when compatibility would otherwise break.
5. Never run blind global replace.
6. If certainty is incomplete, stop at analysis or proposal.

## Review rule

Every agent update must leave active references pointed at `.agents` and must keep deleted donor structures rejected unless a future user explicitly broadens scope.

## Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

