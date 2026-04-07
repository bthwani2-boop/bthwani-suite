# 07_STATUS_AND_SCOPE_AUDIT

## Mandatory Header

- WorkMode: `VIOLATION AUDIT MODE`
- CurrentPhase: `Phase 09 complete; Phase 10 next`
- TargetService: `dsh`
- RequestType: `target_fit_review`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `phase 07-09 rerun audited, stale phase framing removed, and donor counts corrected`
- BlockingGaps: `Phase 10 surface responsibility lock is still not executed in this pass`
- NextAllowed: `Use this audit as a guard before Phase 10 starts`

## Executive Verdict

`docs/services/dsh` was previously mixing a deeper donor appendix set with stale `Phase 13` framing and simplified donor counts.
The deeper DSH truth already existed under `kdt/factory/dsh`, but the stable dossier was overstating its current lawful phase and flattening donor contradictions.
This rerun realigns the stable dossier to the lawful Phase `07` through Phase `09` baseline while retaining downstream reference appendices for completeness.

## Confirmed Numeric Facts

- donor service-scope claim: `92`
- donor catalog rows captured locally: `98`
- donor operation dossier directories physically present: `96`
- donor route-binding rows captured locally: `94`
- donor unified wrapper operations outside the claimed `92`: `5`
- current normalized actor rows: `7`
- current normalized operation families: `13`
- current normalized surface rows: `7`
- current normalized operation/surface coverage rows: `17`
- downstream reference screen candidates retained: `43`
- downstream reference canonical screens retained: `20`

## Confirmed Donor Contradiction

- donor `DSH_SERVICE_SEAL_STATUS.yaml` says `operations_implemented: 8`
- donor `DSH_TRACEABILITY.csv` contains `10` rows with `seal_status=VERIFIED`
- both cannot be treated as one exact implementation count without losing accuracy
- clean target conclusion: donor implementation count is materially inconsistent and must stay recorded as a conflict

## Exact Gap That Existed In This Repo

Before this refresh, `docs/services/dsh` had only:

- a bootstrap-era service profile
- a bootstrap-era actor matrix
- a bootstrap-era operation summary
- a bootstrap-era surface summary
- a bootstrap-era flow note
- bootstrap-era non-goals

It did not contain:

- normalized operation/surface coverage
- candidate screen inventory
- canonical screen catalog
- screen purpose lock
- primary, staff, and failure/recovery flow maps
- donor operation appendix
- donor wrapper-operation appendix
- donor master reference guidance
- donor implementation contradiction audit

It also continued to state `Phase 13` as the current completed position even though this rerun was explicitly reopening only Phase `07` through Phase `09`.

## Target Repo Fit Summary

- naming alignment: `PASS`
- surface normalization alignment: `PASS`
- customer surface normalization to `app-client`: `PASS`
- internal ops surface normalization to `control-panel`: `PASS`
- phase alignment after rerun: `PASS`
- webapp and website exclusion from current DSH first-service truth: `PASS`
- duplication risk after this refresh: `LOW`
- remaining lawful next step: `Phase 10 - Surface Responsibility Lock`

## Clean Adoption Verdict

- donor DSH governance is rich enough to support current DSH truth extraction
- donor route and screen sprawl must not be copied as-is
- current target normalized packs are cleaner than the donor screen tree and should remain the primary adoption model
- this refreshed directory is now suitable as the stable DSH service dossier for the current Phase `07` through Phase `09` band, while downstream appendices remain explicitly reference-only