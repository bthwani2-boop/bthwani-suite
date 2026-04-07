# 04_PRIMARY_FLOW_NOTES

## Mandatory Header

- WorkMode: `TARGET-FIT MODE`
- CurrentPhase: `Phase 13 complete; Phase 14 next`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `primary, staff, and failure-recovery journey truth are now consolidated here`
- BlockingGaps: `Flow compression has not started yet; route minimization and state compression remain downstream`
- NextAllowed: `Use this file and the companion flow maps to drive Phase 14 - Flow Compression`

## Current Mainline Customer Flow

The current normalized DSH mainline is:

1. customer enters through `app-client` discovery
2. customer builds or reviews cart in `app-client`
3. customer passes checkout gating and submits the order in `app-client`
4. partner handles store-side work in `app-partner`
5. captain accepts and executes the delivery in `app-captain`
6. captain records proof when the completion gate requires it
7. customer returns to `app-client` tracking for active or terminal visibility

## Current Staff And Support Paths

- partner recovery stays inside `app-partner` first and only escalates to `control-panel` when local recovery fails
- captain work stays inside one captain execution family and does not create a separate admin mirror
- ops enters through `control-panel` only for governance, exception handling, proxy review, or explicit operational control changes
- `app-field` remains an optional support branch and is omitted entirely when the service path does not need field participation

## Exception Rules

- checkout failure stays local to `app-client`
- partner blockers attempt partner-side maintenance before internal ops escalation
- captain blockers stay inside captain assignment or execution logic unless lawful exception handling is needed
- proxy-request flow is a real DSH exception family, but it is not allowed to distort the core order path
- cancelled terminal visibility remains customer-facing without giving the customer ownership of staff actions

## Screen-Layer Consequences

- canonical screens are limited to the accepted `20` screen set in `10_CANONICAL_SCREEN_CATALOG.csv`
- companion chat, inline actions, and state shells must remain subordinate to their owning canonical screens
- donor split step screens do not reopen as separate clean screens in the target repo

## Companion Flow Files

- `12_PRIMARY_FLOW_MAP.csv` contains the mainline and fast path sequence
- `13_STAFF_FLOW_MAP.csv` contains partner, captain, ops, and field paths
- `14_FAILURE_RECOVERY_FLOW_MAP.csv` contains checkout, partner, captain, proxy, field-unavailable, and cancelled flows

## Flow Rule

One actor owns one primary job at each stage.
Visibility across surfaces does not transfer action ownership.
This file records current service flow truth; it does not authorize Phase 17+ contract, binding, or runtime work.
