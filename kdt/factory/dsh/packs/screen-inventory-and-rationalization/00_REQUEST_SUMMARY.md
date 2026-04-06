# 00_REQUEST_SUMMARY

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 12 - Screen Inventory And Rationalization`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `ready to package`
- BlockingGaps: `Screen Purpose Lock remains the next downstream phase`
- NextAllowed: `Use this pack to drive Phase 13 - Canonical Families And Screen Purpose Lock`

## Request Classification

- task kind: `source_to_target_pack`
- service scope: `dsh`
- execution mode: post-bootstrap service deepening
- output mode: implant-ready pack for target repo use

## Exact Scope

- build a service-wide DSH candidate inventory from current journey and surface truth
- classify each candidate as `Keep`, `Merge`, `Convert`, `Internal`, or `Move to Legacy`
- prevent partial screen sampling
- prevent donor route sprawl from silently dictating the clean target screen tree

## Desired Outputs

- full screen catalog
- screen rationalization report
- target-fit summary
- implant guide