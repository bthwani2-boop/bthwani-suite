# LOOP 2 — Global DSH Lifecycle Coverage

## Objective

Create full lifecycle coverage for DSH as a world-class delivery platform. Use Loop 1 inventory.

## Allowed writes only

```text
dsh/docs/closure/DSH_SERVICE_FLOW_MODEL.md
dsh/docs/closure/DSH_ACTOR_JOURNEY_MATRIX.md
dsh/docs/closure/DSH_ORDER_LIFECYCLE_COVERAGE_MATRIX.csv
dsh/docs/closure/DSH_EXCEPTION_AND_SETTLEMENT_MATRIX.csv
dsh/docs/closure/DSH_LOOP_2_EVIDENCE.md
dsh/docs/closure/DSH_NEXT_LOOP_PLAN.md
```

## Must cover

- Field partner onboarding/activation only; Field exits after partner activation.
- Client discovery/storefront/cart/checkout/tracking/support/rating.
- Partner intake/accept/reject/preparation/ready/handoff/issues.
- Operations review/monitoring/manual assignment/automatic assignment/reassignment/exceptions/audit.
- Captain offer/accept/pickup/dropoff/proof/issues.
- Client↔Captain messaging.
- Client↔Support/Ops messaging.
- Partner↔Ops messaging.
- Captain↔Ops messaging.
- Marketing/catalog relation to order journey.
- WLT-owned settlement/refund/commission/payout for partner/captain/field where applicable.
- Control-panel operations, partners, marketing, finance, support, catalogs.
- Major failure states and edge cases.

## Placement vocabulary

Every lifecycle point must be assigned one:

```text
SCREEN
WORKSPACE
SECTION
SHEET
STATE
EVENT
NOTIFICATION
OPS_ACTION
WLT_BRIDGE
AUDIT_RECORD
TBD
```

## No oversplitting

For every proposed screen/workspace, include why it cannot be a section/sheet/state.

## CSV requirements

Use exactly the headers in:
```text
templates/DSH_ORDER_LIFECYCLE_COVERAGE_MATRIX.headers.csv
templates/DSH_EXCEPTION_AND_SETTLEMENT_MATRIX.headers.csv
```

## Verification

Run diff check and untracked list.

## Final response

`DONE_LOCAL`, `BLOCKED`, or `NEEDS_NEXT_LOOP` only.
