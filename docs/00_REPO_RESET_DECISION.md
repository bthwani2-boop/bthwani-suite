# 00_REPO_RESET_DECISION

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 00 - Repo Reset Decision`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 00 active`
- BlockingGaps: `Phase 01 and later artifacts are not created yet`
- NextAllowed: `Complete Phase 00 evidence review, then enter Phase 01`

## Decision

The target repository `bthwani-suite` is the clean build line for all new governed work.

The legacy repository `bthfinal` is reference-only and donor-only.
It may inform extraction, comparison, anti-pattern detection, and naming recovery, but it may not define the structure of the new repository automatically.

## Phase 00 Laws

- no donor app, package, service, or feature folder may be copied into `bthwani-suite`
- no feature implementation may begin during Phase 00
- no runtime stack, binding chain, generated layer, or service shell may be created during Phase 00
- bootstrap decisions must be evidence-backed under `kdt/volatile/registry/runs/{SESSION_ID}/phase-00/`
- if donor material is consulted later, the need in `bthwani-suite` must drive the search

## Decision Rationale

- a clean build line prevents legacy entropy from silently becoming current structure
- repo role separation keeps ownership, naming, and future adoption decisions explicit
- a reset decision before tooling or structure creation reduces early drift
- `REBUILD_CLEAN` remains the default adoption bias unless a narrower carryover is later justified with evidence

## Explicit Rejections

- reject bulk copy of old apps
- reject bulk copy of old services
- reject bulk copy of old packages
- reject binding-first rebuild
- reject API-first rebuild
- reject runtime-first rebuild
- reject multi-service parallel start during bootstrap

## Current Repo State At Decision Time

Observed root state during this phase:

- `.git/`
- `.github/`
- `docs/`

Observed absence at decision time:

- no workspace shell files yet
- no `apps/`, `services/`, `packages/`, `contracts/`, `governance/`, `tools/`, or `runtime/` roots yet
- no feature implementation code observed

## Phase 00 Exit Expectation

Phase 00 is complete only when:

- `.gitignore` exists
- `README.md` exists
- this decision file exists with real content
- `docs/01_DONOR_REPO_POLICY.md` exists with real content
- evidence artifacts exist under the session `phase-00/` folder
- the repo still contains no copied donor feature tree and no implementation code
