# ESF — FINAL UI / UX / FLOW LOCK

## Scope
This lock covers ESF from the design layer only:
- app-client UX
- app-client flow
- CONTROL PANEL readonly/light-config shape

Out of scope in this lock:
- APIs
- Binding
- OpenAPI
- backend/runtime changes

## Final app-client rule
ESF is a hub-first service.

### Canonical routes that may remain
- EsfHome
- EsfRequestGet
- EsfMatchesInbox
- EsfMatchGet

### Must stay as sheet / inline / confirm
- request creation
- request cancellation
- filter adjustments
- quick decisions
- tiny secondary steps

## Primary CTA rule
- requester: اطلب دم الآن
- donor: سأتبرع الآن
- no competing primary CTA in the same context

## Requester flow
1. EsfHome
2. اطلب دم الآن
3. compose sheet
4. submit
5. EsfRequestGet

## Donor flow
1. EsfHome
2. relevant requests only
3. direct action or quick details
4. no route inflation

## CONTROL PANEL rule
CONTROL PANEL is readonly + light-config only.
Forbidden:
- operator inbox
- queue
- assign / reject / escalate desk
- heavy analytics
- tab maze

## Design closure rule
No UI/UX/Flow seal should be treated as trustworthy while a contradictory UX spec or false readiness marker still exists.

