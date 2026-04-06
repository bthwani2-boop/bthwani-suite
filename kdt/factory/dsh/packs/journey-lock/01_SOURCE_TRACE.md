# 01_SOURCE_TRACE

## Confirmed Source Inputs

### Target repo inputs

- `docs/services/dsh/00_SERVICE_PROFILE.md`
- `docs/services/dsh/04_PRIMARY_FLOW_NOTES.md`
- `kdt/factory/dsh/exports/operation-lock/OPERATIONS_CATALOG.csv`
- `kdt/factory/dsh/exports/surface-responsibility-lock/SURFACE_MATRIX.csv`
- `kdt/factory/dsh/exports/surface-responsibility-lock/OPERATION_SURFACE_COVERAGE.csv`

### Donor repo inputs

- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_UX_FLOW.md`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_TRACEABILITY.csv`
- `C:\Users\b\Documents\GitHub\bthfinal\services\dsh\governance\DSH_SERVICE_SCOPE.md`

## Confirmed Facts

- current target DSH primary flow already locks a customer-to-partner-to-captain-to-visibility journey
- current target surface lock narrows ownership to `app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel`
- donor UX evidence keeps the visible order lifecycle simple: `pending`, `accepted`, `in_delivery`, `completed`, `cancelled`
- donor UX evidence shows a customer-first order path, a partner handling path, and a captain execution path with minimal branching
- donor traceability confirms a real proxy-request cluster and real field-support endpoints while much of the wider donor catalog remains planned-only

## Controlled Conclusions

- the clean target journey should stay centered on one primary operational path rather than branching into screen-specific variations
- proxy request is a side path, not the mainline customer ordering journey
- field work remains an optional support journey rather than a mandatory baseline journey
- finance and wallet logic remain external to DSH journey ownership even when payment gating exists before submit

## Rejected Carryover

- donor click-count language is treated as directional UX evidence, not as a hard screen contract at this phase
- donor endpoint-level route structure is not imported into the clean target journey model
- donor blanket MCPW visibility is not treated as a primary journey path for normal customer orders