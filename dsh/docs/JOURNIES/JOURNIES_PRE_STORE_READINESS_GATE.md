# JOURNIES Pre-Store Readiness Gate

**Decision:** `NO_STORE_ACTION_NOW`

No AAB, Google Play Internal Testing, TestFlight, App Store Connect submission, or public release step is allowed until this gate passes across:

- app-client
- app-partner
- app-captain
- app-field
- control-panel
- webapp/website if linked to the same release narrative
- DSH backend/runtime
- WLT finance/payment/refund/payout boundary
- Auth/RBAC/session/account
- Platform/Vars/provider policy
- Data/media/demo fixture centralization
- UI/RTL/design-system regression
- performance regression
- evidence zip review

## Required final evidence

| Gate | Required proof |
|---|---|
| Git | clean `git diff --check`, known changed files, no hidden untracked/staged risk |
| Typecheck/test | project checks run or blockers documented |
| Runtime | DSH/WLT/Auth local stack smoke + real app/control-panel flows |
| Visual | screenshots for each changed surface and state |
| WLT | no DSH money mutation; WLT owns wallet/ledger/refund/payout/settlement |
| UI kit | reusable design centralized; no Tamagui outside ui-kit; no local design system |
| Data/media | DSH preview data/media central paths validated |
| Performance | large files/N+1/polling/overfetch risks addressed or blocked |

## Decision vocabulary

`BLOCKED`, `NEEDS_EVIDENCE`, `NEEDS_VISUAL_EVIDENCE`, `FIX_REQUIRED`, `READY_FOR_STORE_DISTRIBUTION_REVIEW`.

Do not use `READY_FOR_GOOGLE_PLAY` until the human explicitly accepts store-distribution evidence.
