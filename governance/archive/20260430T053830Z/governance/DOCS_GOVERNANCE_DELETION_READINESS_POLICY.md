# Docs Governance Deletion Readiness Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: deletion readiness for `docs/governance/`

## 1. Decision

`docs/governance/` is legacy/transitional only.

Its final destination is deletion, but deletion is forbidden until readiness is proven.

## 2. Deletion prerequisites

Deletion is allowed only when all are true:

- every file has extraction evidence
- rich content has been promoted or rejected
- canonical replacement exists where needed
- `governance/archive/legacy-extracted/README.md` maps source to target and SHA
- no active code/script/CI path depends on `docs/governance/`
- no unresolved owner question remains
- rollback path exists
- git diff check passes
- typecheck passes
- active guards pass with Errors: 0

## 3. Required deletion evidence

Deletion evidence must include:

- source file list
- target/replacement list
- SHA256 source map
- grep/reference scan
- owner approval
- rollback note
- evidence root
- final decision

## 4. Forbidden deletion cases

Do not delete if:

- extraction is missing
- canonical promotion is incomplete
- references still exist
- warnings are classified as BLOCKS_CLEANUP
- owner decision is missing
- working tree contains unrelated changes

## 5. Deletion commit rule

Deletion of `docs/governance/` must be its own commit.

It must not be combined with policy creation, guard changes, UI work, service work, or CI hardening.
