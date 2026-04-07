# Repo Target Ownership - wlt

Ownership matrix:
- services/wlt: business rules, settlement state transitions, reconciliation truth.
- packages/surfaces: shared composition and screen contracts.
- apps/mobile/*: thin shells for app-client, app-partner, app-captain, app-field.
- apps/web/control-panel: finance administration shell only.
- contracts/master: operation contracts and schema deltas.

Boundary lock:
- dsh, amn, arb, knz consume WLT through contracts; they do not own WLT finance truth.
