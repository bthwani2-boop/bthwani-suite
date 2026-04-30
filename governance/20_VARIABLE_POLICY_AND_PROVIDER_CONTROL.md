# Variable Policy and Provider Control

## Purpose

This file owns mutable platform policy variables, provider settings, overrides, and operational control.

## VAR law

Mutable policies must use `VAR_*` style governance or equivalent structured control, not hardcoded scattered constants.

Examples:

- fees
- commissions
- delivery ranges
- ETA buffers
- service availability windows
- retry limits
- OTP rules
- provider selection
- refund windows
- operational modes
- risk thresholds

## Override precedence

Highest to lowest:

1. Store
2. Subcategory
3. Category
4. Zone
5. City
6. Region
7. Global

Every override must include:

- owner
- reason
- effective date
- expiry or review date
- audit trail
- rollback path

## Provider control plane

Providers must be controlled through documented configuration, not ENV-only hidden truth for live operation.

Provider changes require:

- provider name
- scope
- credentials redaction
- health check
- fallback behavior
- monitoring
- rollback
- evidence

## Preview and rollback

Policy changes should support:

- preview
- dry run where possible
- validation
- staged rollout
- rollback/restore
- audit trail

## Forbidden

- hardcoded live policy values in screens
- hidden finance variables outside WLT
- provider switching without evidence
- production behavior controlled only by undocumented local env
