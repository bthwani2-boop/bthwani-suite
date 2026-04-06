# DSH Screen Inventory And Rationalization Request

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 12 - Screen Inventory And Rationalization`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `ready to package`
- BlockingGaps: `Screen Purpose Lock remains the next downstream phase`
- NextAllowed: `Phase 13 - Canonical Families And Screen Purpose Lock`

## Request Classification

- task kind: `source_to_target_pack`
- service scope: `dsh`
- execution mode: post-bootstrap service deepening
- output mode: implant-ready pack for target repo use

## Exact Scope

- produce a full current-service DSH screen inventory rather than a partial sample
- classify every candidate implied by current surface responsibility and journey locks
- separate real screens from sheets, modals, inline steps, and state-only items
- explicitly classify donor spillover that does not belong to current DSH first-service truth

## Required Inputs

- `kdt/factory/dsh/evidence/journey-lock/02_REENTRY_REVIEW.md`
- `kdt/factory/dsh/exports/journey-lock/PRIMARY_FLOW_MAP.csv`
- `kdt/factory/dsh/exports/journey-lock/STAFF_FLOW_MAP.csv`
- `kdt/factory/dsh/exports/journey-lock/FAILURE_RECOVERY_FLOW_MAP.csv`
- donor DSH traceability and surface file census

## Required Outputs

- full screen catalog
- screen rationalization report
- target-fit summary
- implant guide
- evidence index