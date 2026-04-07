# 01_SERVICE_EXECUTION_CHARTER

## Charter

- service slug: `dsh`
- service role: `first governed multi-surface delivery and store operations service`
- main objective: `rebuild the clean DSH flow from customer entry to partner fulfillment to captain execution without donor drift`
- hard boundary: `wallet, ledger, settlement, payout, and general finance stay outside DSH and route through WLT`

## Clean Ownership Rules

- `app-client` owns customer entry, cart, checkout, submission, tracking, and customer-side proxy entry
- `app-partner` owns store-side order handling and store maintenance
- `app-captain` owns offer acceptance, execution, and proof capture
- `control-panel` owns internal oversight, exception work, peak mode, and proxy review only
- `app-field` owns optional activation and visit support only when explicitly opened

## Charter Stops

- stop if `control-panel` starts mirroring partner or captain execution
- stop if donor loyalty, subscription, profile, or finance spillover re-enters as first-service truth
- stop if `app-field` becomes mandatory without new evidence
- stop if runtime or contract implementation is opened before the queue reaches W08 and W09

## Success Condition

This charter succeeds when every retained DSH screen, operation family, wave, and target path in this folder still respects the ownership rules above.