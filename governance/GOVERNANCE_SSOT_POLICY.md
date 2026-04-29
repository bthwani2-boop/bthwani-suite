# Governance SSOT Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: Repository governance, evidence roots, and source-of-truth ownership

## 1. Canonical governance root

`governance/` is the only canonical governance root.

Any governance rule, policy, standard, guard contract, evidence policy, architecture rule, blueprint standard, warning classification rule, or execution rule must resolve to `governance/`.

## 2. Transitional governance root

`docs/governance/` is temporary legacy/transitional content.

It may contain rich historic content, but it is not a canonical source of truth. Its final destiny is deletion after content extraction, classification, and owner approval.

No file may be deleted from `docs/governance/` until its unique value has been classified as one of:

- MIGRATED_TO_GOVERNANCE
- DUPLICATE_OF_CANONICAL
- REJECTED_LEGACY
- ARCHIVED_AS_EVIDENCE_ONLY
- DELETE_APPROVED

## 3. Evidence root

`tools/registry/runs/<SESSION_ID>/` is the canonical evidence root.

Every evidence-producing run must create:

- `_HANDOFF.zip`
- `<SESSION_ID>_HANDOFF.zip`
- `SUMMARY.md`
- `status.txt`
- `evidence.json`

## 4. Repository identity

The active repository is:

- local path: `C:\bthwani-suite`
- GitHub repository: `bthwani2-boop/bthwani-suite`

Allowed names include:

- BThwani
- bthwani
- bthwani-suite
- `@bthwani/*`
- `bthwani2-boop/bthwani-suite`

Old standalone repo/path/token noise is not allowed as active truth.

## 5. Architecture authority

The minimum ownership ladder is:

```text
apps / app-shells
→ packages/surfaces
→ packages/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

Apps host runtime wiring. They do not own service logic, duplicate design systems, or canonical service truth.

## 6. Change safety

No governance cleanup may delete, move, rename, rewrite, or promote warnings to errors without:

- owner decision
- evidence
- rollback path
- `git --no-pager diff --check`
- `pnpm -w exec tsc --noEmit`
- GUARD-01 through active guard range proving `Errors: 0`