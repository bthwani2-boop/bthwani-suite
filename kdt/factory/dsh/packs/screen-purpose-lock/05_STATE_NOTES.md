# 05_STATE_NOTES

## Executive Verdict

Required state shells are now explicit for every canonical Phase 13 screen while converted supporting items remain subordinate to their canonical owners.

## State Derivation Rule

- required state shells in this phase are controlled inferences derived from accepted operations journey steps and failure coverage
- every canonical screen carries local load ready and failure handling
- no required state shell becomes a separate route without a later explicit phase decision

## Explicit Phase 12 Converted State Items

- `dsh_client_checkout_block_state` stays inside `dsh_client_checkout_confirm`
- `dsh_client_cancelled_terminal_state` stays inside `dsh_client_active_order_tracking`

## Companion And Inline-Step Attachments

- `dsh_client_order_chat_companion` stays attached to `dsh_client_active_order_tracking`
- `dsh_partner_chat_companion` and `dsh_partner_handoff_action` stay attached to `dsh_partner_order_workspace`
- `dsh_captain_chat_companion` and `dsh_captain_reject_action` stay attached to `dsh_captain_execution_workspace`
- `dsh_field_geo_pin_companion` and `dsh_field_visit_log_companion` stay attached to `dsh_field_activation_workspace`
- `dsh_proxy_schedule_companion` stays attached to `dsh_proxy_request_review_workspace`

## State Shell Notes

- client discovery and detail screens require empty-result handling because selection intent may exist before purchasable content is ready
- cart and checkout require mutation and submission pending shells because the gate is meaningful only when local transitions are explicit
- tracking and proxy reflection screens use observational terminal shells rather than destructive task shells
- partner captain and ops workspaces require local blocker or intervention shells so escalation stays within the rightful owner surface
- field activation keeps `field_unavailable` as a shell so the branch disappears lawfully instead of leaking into another surface

## Prevention Notes

- do not create standalone block screens when a state shell is sufficient
- do not promote companion sheets into routes just because they have multiple states
- do not collapse terminal completion and terminal cancellation into a generic unlabeled end state