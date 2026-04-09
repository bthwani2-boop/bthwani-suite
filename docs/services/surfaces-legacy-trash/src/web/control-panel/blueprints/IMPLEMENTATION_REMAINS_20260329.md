# CONTROL PANEL Implementation Review (2026-03-29)

Design Direction: AI-Native Premium Command Center

## Executed In This Pass

- Replaced the noisy topbar service chip rail with a compact in-header service scope selector.
- Reduced shell header height to the intended command-surface footprint.
- Wired topbar command search requests to the overview command palette.
- Upgraded overview refresh from cosmetic spinner behavior to actual hook refetch calls.
- Added retry and dismiss actions for hard overview errors.
- Normalized shell/sidebar click telemetry to `control panel.click.telemetry.v2`.

## Already Aligned With The Attachment

- Overview is structured as: command header, focus strip, action center, insight rail, quick workspaces.
- Sidebar behavior is single-expand and first-level focused.
- Shell geometry now follows a calmer command-center profile.
- Click-budget evidence artifacts already exist:
  - `FLOW_STATE_COMPONENT_MATRIX.json`
  - `CLICK_BUDGET_BEFORE_AFTER.json`
  - `AI_NATIVE_PREMIUM_COMMAND_CENTER_BLUEPRINT.md`

## Remaining Work That Still Must Be Executed

1. Real data wiring
   `packages/surfaces/src/web/control panel/hooks/useWorkQueueData.ts` still returns fallback/sentinel states and placeholder KPI values.

2. AI insight rail is still curated, not model-backed
   `packages/surfaces/src/web/control panel/home/McpwHomeScreenV2.tsx` currently uses static strategy notes and static health signals.

3. Command palette is not shell-global yet
   The topbar search is now wired to the overview screen, but other screens do not yet expose a shared command layer.

4. Final component contracts are still local to the overview
   `FocusKpiCard`, `QueueActionRow`, `WorkspaceLaunchCard`, and insight blocks still live inside the home screen file instead of a reusable shared module.

5. Final command-center language is not yet generalized repo-wide
   The overview is the flagship reference, but the rest of CONTROL PANEL still mixes:
   - restored hub screens
   - compact operational indexes
   - older service workspaces

## Recommended Next Execution Order

1. Wire real queue/KPI APIs into `useWorkQueueData.ts`.
2. Extract overview card contracts into shared components.
3. Promote command search to a shell-level/global command palette.
4. Roll the final overview language into the next highest-traffic screens:
   - operations
   - finance
   - support
   - analytics

