
# DSH First Screen Decision

> **ملاحظة توثيقية (2026-04-09):**
> هذه الشاشة baseline فقط وليست أول شاشة تنفيذية. المصدر الوحيد لحقيقة أول شاشة تنفيذية هو [11_FIRST_SCREEN_RULE.md](11_FIRST_SCREEN_RULE.md). تم توحيد القرار لمنع التضارب وضمان التسلسل الحوكمي الصارم.

Status: CLOSED
Legal Gate: PRE_SCREEN
Gate Result: PASS
Closed At: 2026-04-08

## Decision

- first_screen_id: SCR_W1_001
- first_screen_name: dsh_entry_screen
- implementation_file: packages/surfaces/src/dsh/app-client/entry/screens/DshEntryScreen.tsx
- primary_cta: Start delivery
- source: WAVE 1 app-client gate decision (2026-04-08)

## Purpose Lock

- purpose: Single-purpose service entry screen for app-client delivery flow.
- non_purpose: Not a platform-wide home screen.

## Base States Lock

- loading: required
- empty: required
- ready: required

## Constraints

- no_business_logic: required
- no_raw_fetch: required
- no_layout_clutter: required
- ui_kit_pattern_pressure: required

## Preconditions

- operation_registry: CLOSED
- journey_map: CLOSED
- screen_registry: CLOSED
- build_queue: CLOSED
- ui_kit_prereqs: CLOSED
- state_coverage: CLOSED

## Lock

If any precondition above is not CLOSED, screen work is blocked.
