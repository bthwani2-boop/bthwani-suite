# Contract Deltas - wlt

Baseline:
- WLT contracts govern all settlement and monetary side effects.

Required deltas:
- add or lock sync endpoints for dsh, amn, arb, knz.
- lock finance approval/reconciliation endpoints for control-panel finance.
- ensure mobile consumer endpoints for app-client, app-partner, app-captain, app-field.

Guard:
- no direct financial mutation in upstream services.
