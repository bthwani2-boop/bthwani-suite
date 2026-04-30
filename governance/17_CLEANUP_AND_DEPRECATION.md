# Cleanup, Deletion, Deprecation

## Purpose

This file defines safe cleanup, archive, deletion, and deprecation.

## Cleanup modes

| Mode | Meaning |
|---|---|
| `DEDUP` | merge duplicate truth into owner file |
| `QUARANTINE` | move out of active authority |
| `ARCHIVE` | preserve as historical evidence |
| `DEPRECATE` | keep temporarily with removal date |
| `DELETE` | remove after gates pass |
| `REJECT` | reviewed and intentionally not adopted |

## Deletion readiness gates

Before deleting or moving a file/folder:

1. classify it
2. search references/imports/links
3. identify owner replacement
4. update ledger
5. capture before/after status
6. run diff check
7. provide rollback path

## Governance legacy rule

`governance-legacy` must not remain active authority. It can only be:

- archived outside the canonical authority path
- quarantined under explicit archive/read-only label
- removed after `99_LEGACY_MERGE_LEDGER.md` proves every source file disposition

## No blind deletion

Never run broad delete/clean commands without:

- exact target list
- risk note
- backup or Git safety
- verification
- user approval for destructive action

## Deprecation record

Every deprecation must include:

- old path/name
- replacement
- reason
- date
- owner
- removal gate
- rollback
