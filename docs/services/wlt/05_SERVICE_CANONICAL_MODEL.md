# Service Canonical Model - wlt

Core responsibility:
- WLT owns settlement, payout, reconciliation, wallet, refund, and ledger truth.

Required upstream service links:
- dsh -> wlt
- amn -> wlt
- arb -> wlt
- knz -> wlt

Mandatory consumer surfaces:
- app-client
- app-partner
- app-captain
- app-field

Control-panel ownership:
- finance section is mandatory for WLT operational governance.
