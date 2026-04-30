# DSH Golden Slice

## Purpose

DSH is the first official golden vertical slice used to prove the platform closure model.

## Required DSH surfaces

- app-client
- app-partner
- app-captain
- app-field
- control-panel

## Golden path

1. customer opens client surface
2. customer discovers categories/store/products
3. customer builds basket
4. customer confirms order/payment decision
5. partner receives/manages order
6. captain/field flow participates where applicable
7. control panel observes/supports
8. WLT records money path when money exists
9. runtime/API evidence proves the flow
10. traceability row maps every artifact

## DSH closure matrix

| Area | Required proof |
|---|---|
| UI/UX | screenshots, state coverage, RTL |
| Flow | order lifecycle states |
| API | contracts/request-response |
| Binding | typed client/surface integration |
| Runtime | logs/smoke test |
| Partner ops | acceptance/rejection/prep/status |
| Captain/field | assignment/execution if applicable |
| Finance | WLT fee/commission/refund/settlement proof |
| Control panel | admin visibility/action proof |
| Evidence | evidence pack + traceability |

## Do not start broad service closure before DSH golden path

Other services can progress, but DSH is the primary proof pattern until its closure gates are stable.
