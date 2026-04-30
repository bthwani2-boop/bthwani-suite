# Governance (Canonical)

**Status**: Canonical governance package for `bthwani-suite`.

**Canonical local repo**: `C:\bthwani-suite`

**Canonical GitHub repo**: `bthwani2-boop/bthwani-suite`

**Canonical docs root**: `governance/`

**Canonical evidence root**: `tools/registry/runs/{SESSION_ID}/`

## Executive law

This governance folder is the single textual authority for repository governance, architecture boundaries, service/surface ownership, UI authority, API/runtime binding, verification, evidence, guards, cleanup, and AI-assisted execution.

No result may be called `PASS`, `READY`, `CLOSED`, `FINAL`, `LOCKED`, or `100%` unless an evidence pack proves it.

## What this package replaces

This package replaces weak extracted summaries with a closure-grade governance control plane. Legacy files are treated as source evidence only; they must not remain a parallel authority.

If an old `governance/governance-legacy/` folder exists in the repository, it is read-only reference material until the install/audit process quarantines it or removes it after ledger verification.

## Mandatory stack

`Node.js / TypeScript / pnpm / Nx / React / React Native / Expo / Next.js / NestJS`

## Mandatory BThwani architecture rule

`Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only`

## Mandatory brand DNA

Deep Blue `#0A2F5C`, Orange `#FF500D`, White `#FFFFFF`, RTL-correct, premium 2026, low-noise, cohesive, practical, clear, elegant.

## Read order

1. `01_GOVERNANCE_INDEX.md`
2. `02_PLATFORM_SSOT.md`
3. `03_REPO_BOUNDARIES.md`
4. `04_ARCHITECTURE_RULES.md`
5. `07_SURFACES_AND_SERVICES.md`
6. `11_EVIDENCE_AND_TRACEABILITY.md`
7. `14_GUARDS_CATALOG.md`
8. `99_LEGACY_MERGE_LEDGER.md`

## Change law

Any governance change must include:

- exact scope
- reason
- changed files
- source evidence
- conflict review
- `git diff --check`
- status/evidence pack
- decision using the canonical decision vocabulary

## Forbidden

- No parallel governance root.
- No stale `docs/governance` authority.
- No `governance-legacy` as active authority.
- No broad undocumented deletion.
- No silent path drift.
- No blind global replace.
- No old standalone repo/path named `bth` as an active target.
- No removal of valid names such as `BThwani`, `bthwani-suite`, `@bthwani/*`, or `bthwani2-boop/bthwani-suite`.
