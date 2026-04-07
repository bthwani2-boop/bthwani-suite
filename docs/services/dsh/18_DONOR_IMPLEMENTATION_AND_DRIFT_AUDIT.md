# 18_DONOR_IMPLEMENTATION_AND_DRIFT_AUDIT

## Mandatory Header

- WorkMode: `ANTI-PATTERN MODE`
- CurrentPhase: `Phase 09 complete; Phase 10 next`
- TargetService: `dsh`
- RequestType: `violation_audit`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `downstream donor implementation audit retained as a prevention appendix for the phase 07-09 rerun`
- BlockingGaps: `Later implementation phases are still downstream in the target repo`
- NextAllowed: `Use this audit to prevent donor drift while Phase 10+ work is reopened lawfully`

## Confirmed Donor Implementation Facts

- donor backend entity exists at `services/dsh/src/entities/shein-proxy-request.entity.ts`
- donor backend service exists at `services/dsh/src/dsh-shein.service.ts`
- donor backend controller exists at `services/dsh/src/controllers/dsh.controller.ts`
- donor traceability marks these `10` operations as `VERIFIED`:
  - `dsh_external_order_create`
  - `dsh_proxy_request_create`
  - `dsh_proxy_request_estimate`
  - `dsh_proxy_request_offer`
  - `dsh_proxy_request_approve`
  - `dsh_proxy_request_reject`
  - `dsh_proxy_request_schedule`
  - `dsh_field_store_activation_request`
  - `dsh_field_store_geo_pin`
  - `dsh_field_store_visit_log`

## Confirmed Donor Contradiction

- donor `DSH_SERVICE_SEAL_STATUS.yaml` says `operations_implemented: 8`
- donor `DSH_TRACEABILITY.csv` says `10` operations are `VERIFIED`
- this is a real donor contradiction, not a target-repo mistake
- target-repo rule: keep the contradiction visible and do not claim a fake exact count

## Confirmed Donor Drift Patterns

### Drift 1 - Split-Screen Sprawl

The donor screen set repeatedly splits one operational workspace into many route-shaped screens.
The current target model correctly merges these back into canonical workspaces.

### Drift 2 - Control-Panel Overreach

Donor internal ops surface material spills into partner, captain, store-item, zone, and miscellaneous action space.
The current target model correctly narrows `control-panel` to governance, proxy review, and explicit operational controls.

### Drift 3 - Customer-Side Marketing And Loyalty Noise

Donor customer-side DSH material includes loyalty, subscription, favorites, promo, profile, and preferences spillover that is not part of the current DSH first-service operational truth.

### Drift 4 - Staff Admin Spillover

Donor partner identity, intake, staff invite, and document-admin clusters expand the partner surface beyond the current operational journey.

### Drift 5 - Captain Finance Spillover

Donor captain COD, tier, wallet, payments, settlements, and earnings clusters blur the DSH boundary and create finance drift.

### Drift 6 - Optional Field Becoming Bigger Than Needed

Donor field support exists and is real, but it must remain optional and narrow in the clean target model.

## Prevention Rules For The Target Repo

- do not reopen donor split steps as separate clean screens
- do not let `control-panel` absorb partner or captain execution ownership
- do not let customer tracking become customer action ownership
- do not let finance or wallet clusters leak into DSH because checkout exists here
- do not promote optional field support into a mandatory baseline branch
- do not treat donor master route density as a target navigation blueprint

## Final Audit Verdict

The donor repo is useful as a source of evidence and problem discovery.
It is not clean enough to copy directly.
The current normalized DSH packs in `bthwani-suite` remain the correct adoption base.