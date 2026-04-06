# 00_REQUEST_SUMMARY

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 08 - Actor/Context Lock`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `ready to package`
- BlockingGaps: `No blocker inside this phase; Operation Lock remains next`
- NextAllowed: `Use this pack to drive Phase 09 - Operation Lock`

## Request Classification

- task kind: `source_to_target_pack`
- service scope: `dsh`
- execution mode: post-bootstrap service deepening
- output mode: implant-ready pack for target repo use

## Exact Scope

- define primary and secondary DSH actors
- define proper surface per actor
- define who must not see DSH in the current first-service build line
- lock visibility rules before operation and journey deepening

## Desired Outputs

- actor/context matrix
- visibility and exclusion rules
- source trace summary
- target-fit summary
