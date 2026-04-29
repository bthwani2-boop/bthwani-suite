# BThwani Governance

This directory is the canonical governance SSoT for `C:\bthwani-suite`.

## Authority

`governance/` is the active decision source for architecture, execution rules, evidence, branch handling, package boundaries, AI-assisted development, and staged service closure.

`docs/governance/` is transitional/reference/archive material until each useful item is reconciled into this directory. It must not override this directory.

## Current Execution State

Governance diagnostics GOV-01 through GOV-10 completed the read-only discovery and planning track.

The next allowed implementation track starts with:

```text
APPLY-01 — Canonical Governance SSoT Skeleton
```

This APPLY phase is intentionally narrow and must not touch DSH, apps, packages, surfaces, ui-kit, workflows, tools, agents, or legacy cleanup.

## Non-Negotiable Rules

- The canonical repo path is `C:\bthwani-suite`.
- Do not use or revive any old standalone repo/path named `bth`.
- Keep `bth` only when it is part of legitimate current names such as `bthwani`, `BThwani`, `@bthwani/*`, or `bthwani-suite`.
- No DSH work before governance reaches the DSH-ready gate.
- No delete, move, or rename before zero-reference proof.
- No CLOSED, READY, or 100% claim without evidence.
- Evidence packs live under `tools/registry/runs/{SESSION_ID}`.
- Apps are shell/host only.
- `packages/app-shells` owns shell/root behavior only.
- `packages/surfaces` owns screens, flows, and experiences.
- `packages/ui-kit` is the reusable design authority only.
- Screen / Surface / App consumes `@bthwani/ui-kit` public exports; Tamagui is used internally inside ui-kit only.
- Use `pnpm`, not npm, as the canonical workspace package manager.

## Canonical Index

Read `00_GOVERNANCE_INDEX.md` first.
