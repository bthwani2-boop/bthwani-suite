# MOBILE REAL BROWSING READINESS

- Session: 20260407-CHECK-MOBILE-REAL-BROWSING-20260407-033731
- Repository: C:\Users\b\Documents\GitHub\bthwani-suite
- OverallStatus: FAIL
- EvidenceRoot: C:\Users\b\Documents\GitHub\bthwani-suite\kdt\volatile\registry\runs\20260407-CHECK-MOBILE-REAL-BROWSING-20260407-033731

## Repo Signals

- readme_mentions_preview_stage_package: True
- readme_mentions_phase14_next: True
- phase12_blocks_screen_implementation: True
- phase12_blocks_runtime_truth: True
- phase12_blocks_generated_client_use: True

## app-client

- app_tsx_exists: False
- index_points_to_missing_app_tsx: True
- shell_status: thin-shell-only
- phase_gate: Phase 12
- navigation_kind: placeholder-navigation-container
- navigation_mode: fixtures-only-preview
- placeholder_route_count: 7
- fixtures_only_count: 7
- no_bound_service_logic: True
- no_generated_client_wiring: True
- no_canonical_runtime_truth: True
- no_production_claims: True
- non_shell_tsx_count: 0
- positive_real_browsing_signal_count: 7

## app-partner

- app_tsx_exists: False
- index_points_to_missing_app_tsx: True
- shell_status: thin-shell-only
- phase_gate: Phase 12
- navigation_kind: placeholder-navigation-container
- navigation_mode: fixtures-only-preview
- placeholder_route_count: 4
- fixtures_only_count: 4
- no_bound_service_logic: True
- no_generated_client_wiring: True
- no_canonical_runtime_truth: True
- no_production_claims: True
- non_shell_tsx_count: 0
- positive_real_browsing_signal_count: 7

## app-captain

- app_tsx_exists: False
- index_points_to_missing_app_tsx: True
- shell_status: thin-shell-only
- phase_gate: Phase 12
- navigation_kind: placeholder-navigation-container
- navigation_mode: fixtures-only-preview
- placeholder_route_count: 3
- fixtures_only_count: 3
- no_bound_service_logic: True
- no_generated_client_wiring: True
- no_canonical_runtime_truth: True
- no_production_claims: True
- non_shell_tsx_count: 0
- positive_real_browsing_signal_count: 7

## app-field

- app_tsx_exists: False
- index_points_to_missing_app_tsx: True
- shell_status: thin-shell-only
- phase_gate: Phase 12
- navigation_kind: placeholder-navigation-container
- navigation_mode: fixtures-only-preview
- placeholder_route_count: 1
- fixtures_only_count: 1
- no_bound_service_logic: True
- no_generated_client_wiring: True
- no_canonical_runtime_truth: True
- no_production_claims: True
- non_shell_tsx_count: 0
- positive_real_browsing_signal_count: 7

## Fail Reasons

- app-captain :: constrained by no-bound-service-logic
- app-captain :: constrained by no-canonical-runtime-truth-access
- app-captain :: constrained by no-generated-api-client-wiring
- app-captain :: fixture locations still fixtures-only (3)
- app-captain :: index.js points to missing ./App.tsx
- app-captain :: missing App.tsx Expo root entry
- app-captain :: navigation kind is placeholder-navigation-container
- app-captain :: navigation mode is fixtures-only-preview
- app-captain :: no non-shell TSX screens/components found
- app-captain :: preview routes still placeholder (3)
- app-captain :: shellStatus=thin-shell-only
- app-client :: constrained by no-bound-service-logic
- app-client :: constrained by no-canonical-runtime-truth-access
- app-client :: constrained by no-generated-api-client-wiring
- app-client :: fixture locations still fixtures-only (7)
- app-client :: index.js points to missing ./App.tsx
- app-client :: missing App.tsx Expo root entry
- app-client :: navigation kind is placeholder-navigation-container
- app-client :: navigation mode is fixtures-only-preview
- app-client :: no non-shell TSX screens/components found
- app-client :: preview routes still placeholder (7)
- app-client :: shellStatus=thin-shell-only
- app-field :: constrained by no-bound-service-logic
- app-field :: constrained by no-canonical-runtime-truth-access
- app-field :: constrained by no-generated-api-client-wiring
- app-field :: fixture locations still fixtures-only (1)
- app-field :: index.js points to missing ./App.tsx
- app-field :: missing App.tsx Expo root entry
- app-field :: navigation kind is placeholder-navigation-container
- app-field :: navigation mode is fixtures-only-preview
- app-field :: no non-shell TSX screens/components found
- app-field :: preview routes still placeholder (1)
- app-field :: shellStatus=thin-shell-only
- app-partner :: constrained by no-bound-service-logic
- app-partner :: constrained by no-canonical-runtime-truth-access
- app-partner :: constrained by no-generated-api-client-wiring
- app-partner :: fixture locations still fixtures-only (4)
- app-partner :: index.js points to missing ./App.tsx
- app-partner :: missing App.tsx Expo root entry
- app-partner :: navigation kind is placeholder-navigation-container
- app-partner :: navigation mode is fixtures-only-preview
- app-partner :: no non-shell TSX screens/components found
- app-partner :: preview routes still placeholder (4)
- app-partner :: shellStatus=thin-shell-only

