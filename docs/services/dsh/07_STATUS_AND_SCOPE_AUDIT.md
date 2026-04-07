# 07_STATUS_AND_SCOPE_AUDIT

## Mandatory Header

- WorkMode: `VIOLATION AUDIT MODE`
- CurrentPhase: `Phase 13 complete; Phase 14 next`
- TargetService: `dsh`
- RequestType: `target_fit_review`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `audit completed for current docs/services/dsh uplift`
- BlockingGaps: `Phase 14 flow compression is still not executed`
- NextAllowed: `Use this audit as a guard before Phase 14 starts`

## Executive Verdict

`docs/services/dsh` was previously incomplete because it stopped at the old Phase 07 service-foundation layer.
The deeper DSH truth already existed under `kdt/factory/dsh`, but it had not been lifted into the stable service dossier.
This audit refresh closes that structural gap.

## Confirmed Numeric Facts

- donor in-scope operations: `92`
- donor operation dossiers: `92`
- donor unified wrapper operations outside the `92`: `5`
- current normalized actor rows: `7`
- current normalized operation families: `13`
- current normalized surface rows: `7`
- current normalized operation/surface coverage rows: `17`
- current DSH screen candidates reviewed: `43`
- current canonical screens accepted: `20`

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

## Target Repo Fit Summary

- naming alignment: `PASS`
- surface normalization alignment: `PASS`
- donor `APP_USER` -> `app-client`: `PASS`
- donor `MCPW` -> `control-panel`: `PASS`
- webapp and website exclusion from current DSH first-service truth: `PASS`
- duplication risk after this refresh: `LOW`
- remaining lawful next step: `Phase 14 - Flow Compression`

## Clean Adoption Verdict

- donor DSH governance is rich enough to support current DSH truth extraction
- donor route and screen sprawl must not be copied as-is
- current target normalized packs are cleaner than the donor screen tree and should remain the primary adoption model
- this refreshed directory is now suitable as the stable DSH service dossier for the current phase band