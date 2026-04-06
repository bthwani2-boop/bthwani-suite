# 07_IMPLANT_GUIDE

## How To Use This Pack

Use this pack as the single flow input to Phase 12 and Phase 13 work for `dsh`.

## Allowed Downstream Use

- derive candidate screens only after reading the primary, staff, and failure/recovery flow maps together
- use the primary path to identify real screen entry and terminal points
- use the staff path to prevent control-panel overreach during screen inventory
- use the failure/recovery path to keep exception handling inside lawful surfaces

## Phase 12 Completeness Rule

- Phase 12 must produce a full DSH service-level screen inventory, not a partial sample
- every candidate implied by the primary path, staff path, and failure/recovery path must be cataloged or explicitly classified as merged, internal, converted, or moved out
- coverage must include all current in-scope DSH surfaces: `app-client`, `app-partner`, `app-captain`, `control-panel`, and `app-field` when the optional branch is active
- chat, tracking, proof, exception, and support companions must not disappear from inventory just because they are secondary to the mainline order path

## Forbidden Downstream Use

- do not create implementation routes from these flow maps
- do not expand the flow maps back into donor endpoint-level sprawl
- do not treat optional field or proxy work as mandatory default journeys
- do not import financial ownership from `WLT` into DSH flow design