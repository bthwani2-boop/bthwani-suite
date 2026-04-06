# Phase 04 Service Order Decision

## Review Header

- Session: `f0b4b460-01e3-46fb-b37f-19737d6a04d9`
- Phase: `04 - Service Order`
- PrimaryRepo: `bthwani-suite`
- EvidencePath: `kdt/volatile/registry/runs/f0b4b460-01e3-46fb-b37f-19737d6a04d9/phase-04/`

## Required Repo Artifact Review

- `docs/services/00_SERVICE_BUILD_ORDER.md` -> PASS

## Required Evidence Artifact Review

- `phase-04/service-order-decision.md` -> PASS

## Pass Condition Review

- exactly one first service slug is selected -> PASS
- the reason for that selection is recorded -> PASS
- multi-service parallel start is explicitly rejected -> PASS

## Evidence Used

- `docs/platform/00_PLATFORM_VALUE_LOCK.md`
- `docs/platform/01_SERVICE_PRIORITY_LIST.md`
- `docs/platform/02_NON_GOALS_REGISTER.md`
- `docs/reality-intake/01_REPO_CENSUS.md`
- donor service governance references summarized in `docs/services/00_SERVICE_BUILD_ORDER.md`

## Rejected Alternatives

- `wlt` was rejected as the first service because it would front-load runtime and finance complexity before a visible operational service is proven
- `snd` was rejected as the first service because it offers less cross-surface leverage and less pressure on UI Kit and contract shape than `dsh`
- deferred-bucket services were rejected from first-service consideration because Phase 03 did not establish enough scope evidence to promote them responsibly

## Remaining `[TBD]` Risks

- deeper evidence for deferred services remains incomplete at this phase, but that does not block the first-service decision
- the first-service choice still requires later validation through Phases 05-07 and post-bootstrap execution before closure can be claimed

## Final Phase 04 Verdict

Phase 04 is ready for gate review.

Selected first service: `dsh`.
