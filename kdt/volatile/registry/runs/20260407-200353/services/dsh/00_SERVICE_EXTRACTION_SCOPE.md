# 00_SERVICE_EXTRACTION_SCOPE

## Mandatory Header

- WorkMode: `FORENSIC EXTRACT MODE`
- CurrentPhase: `Phase 08 - Actor Context Exhaustive Extraction`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- InputClassification: `service_operations_extract`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `scope locked and seeded from inherited step-1 evidence`
- BlockingGaps: `donor numerical drift remains unresolved at 92 vs 96 vs 98 until later reconciliation`
- NextAllowed: `complete KDT artifacts 03 through 14 and hand off to docs/services/dsh`
- EvidenceRoot: `kdt/volatile/registry/runs/20260407-200353/services/dsh/`

## Service Scope Lock

- active service scope: `dsh` only
- donor service root: `C:/Users/b/Documents/GitHub/bthfinal/services/dsh`
- inherited evidence roots:
  - `kdt/volatile/registry/runs/20260407-192701-dsh-step1-source-index/services/dsh/01_DONOR_SOURCE_INDEX.md`
  - `kdt/volatile/registry/runs/20260407-192701-dsh-step1-source-index/services/dsh/02_DONOR_EXHAUSTIVE_CENSUS.csv`
- current execution root: `kdt/volatile/registry/runs/20260407-200353/services/dsh/`

## Exact Scope

- recover actor and context truth across `app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel`
- normalize donor `app-user` to target `app-client`
- normalize donor `mcpw` to target `control-panel`
- compress donor operation sprawl into evidence-backed canonical operation families without erasing trace
- compress donor screen sprawl into the clean target candidate set already declared in `packages/surfaces/src/dsh/**`
- classify donor runtime and binding material as `reference-only`, `extract-partial`, or `rebuild-clean`

## Output Contract

This run must leave behind:

- one complete `KDT Evidence Pack` under the current run path
- one complete `docs/services/dsh` execution operating pack
- no runtime implementation code
- no generated contract or binding code
- no donor naming leakage into clean target outputs outside source trace

## Confirmed Facts

- confirmed fact: donor exhaustive census already exists with `1292` rows and is inherited into this run
- confirmed fact: donor operation catalog currently exposes `98` rows while operation dossier folders expose `96` and service scope still claims `92`
- confirmed fact: target repo already contains the clean `dsh` preview candidate registry under `packages/surfaces/src/dsh/**`
- confirmed fact: target repo does not yet contain `services/dsh/`

## Open Gaps

- `[TBD]` donor parity between governance root and `service-level` shadow copy
- `[TBD]` exact ownership of donor `finance/dsh`, `analytics/dsh-orders`, and `partner/store` control-panel carryovers
- `[TBD]` exact later contract delta set once screen-to-API pressure is locked

## Rejected Carryover

- reject blind donor route mirroring into `control-panel`
- reject donor customer loyalty, subscription, profile, and marketing spillover as first-service screen truth
- reject captain finance and wallet spillover as first-service DSH execution truth
- reject creating `webapp` or `website` DSH ownership from absent evidence

## Current Readiness Verdict

- `scope_lock = PASS`
- `inherited_evidence = PASS`
- `ready_for_kdt_completion = PASS`
- `ready_for_runtime_implementation = NO`