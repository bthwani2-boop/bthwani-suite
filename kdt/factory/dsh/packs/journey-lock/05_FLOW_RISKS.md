# 05_FLOW_RISKS

## Confirmed Risks

### Risk 1 - Tracking Versus Ownership Drift

Customer tracking can be mistaken for customer ownership of partner or captain work. This must be blocked in later screen design.

### Risk 2 - Control-Panel Expansion Drift

Internal ops visibility can expand into an accidental second home for partner or captain actions if later phases do not keep ownership strict.

### Risk 3 - Proxy Path Overgrowth

The proxy-request path is real but exceptional. If treated as a primary journey, it will distort the core DSH order path.

### Risk 4 - Optional Field Path Becoming Mandatory

Field support is evidence-backed but optional. Later phases must not force every DSH journey through `app-field`.

### Risk 5 - Finance Leakage

Checkout gating may tempt later phases to import wallet, ledger, or payout ownership into DSH journey maps. That must remain outside DSH.

## Prevention Guidance

- keep one clear mainline customer order journey
- keep exceptions as side paths, not new defaults
- keep terminal states limited to `completed` and `cancelled` for visible end conditions unless stronger evidence appears
- keep staff intervention surface-specific and evidence-backed