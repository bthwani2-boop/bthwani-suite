# Implementation Scope - wlt

In scope:
- Wallet reads and payment actions for app-client.
- Settlement and payout actions for app-partner, app-captain, app-field.
- Finance approval and reconciliation surfaces in control-panel.
- Cross-service sync operations: wlt_sync_dsh, wlt_sync_amn, wlt_sync_arb, wlt_sync_knz.

Out of scope in bootstrap:
- Runtime stack expansion beyond documented closure path.
- Service-specific UI-kit forks.
- Direct money mutation outside WLT service boundary.
