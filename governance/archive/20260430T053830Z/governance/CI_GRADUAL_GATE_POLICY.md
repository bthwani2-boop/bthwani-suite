# CI Gradual Gate Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: CI workflow adoption, guard gating, evidence requirements, and staged enforcement

## 1. Purpose

CI must become strict without breaking delivery through unclassified baseline warnings.

## 2. Stages

| Stage | Behavior |
|---|---|
| CI-REPORT | run checks and upload artifacts, do not block warnings |
| CI-ERROR-GATE | block on guard Errors only |
| CI-WARNING-CLASSIFY | require warning classification artifacts |
| CI-PROMOTE-SELECTED | promote approved warning classes to Errors |
| CI-PR-GATE | require evidence summary and traceability |
| CI-RELEASE-GATE | require full closure standards for release paths |

## 3. Minimum CI checks

- install
- typecheck
- lint when configured
- tests when configured
- build when relevant
- secret scan
- guard suite
- diff/check or formatting check
- evidence artifact upload

## 4. Guard behavior in CI

Guard Errors block.

Warnings do not block until classification policy promotes them.

New warnings in protected areas may block after baseline is established.

## 5. PR requirements

PRs should include:

- scope
- changed file summary
- evidence root or CI artifact
- warning classification delta
- traceability for major changes
- screenshots for UI changes
- runtime proof for runtime-sensitive changes

## 6. Release gate

Release gate requires:

- no guard Errors
- no unclassified release-blocking warnings
- typecheck pass
- required builds pass
- evidence pack
- rollback plan
