# DSH Visual Review — Single Review Update Protocol

Status: ACTIVE_VISUAL_LEDGER_COMMAND
Decision: BRANCH_NEUTRAL_EVIDENCE_ONLY

Purpose:
Update one review item in the Visual Review Ledger section of `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md` without touching source code, API, backend, ui-kit, or WLT ownership.

Scope:

- allowed: `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md`
- forbidden: `dsh/frontend/**`, `dsh/dsh.openapi.yaml`, `dsh/backend/**`, `dsh/domain/**`, `ui-kit/**`, `wlt/**`

Target repo:
`C:\bthwani-suite`

Evidence root:
`tools/registry/runs/<SESSION_ID>/`

Inputs:

- `review_id`: `[REVIEW_ID_FROM_DSH_VISUAL_REVIEW_QUEUE]`
- `state`: `[default | loading | empty | error | disabled | expanded | detail | success | offline | blocked | retry | custom]`
- `device`: `[DEVICE_NAME]`
- `viewport`: `[VIEWPORT]`
- `locale`: `ar`
- `direction`: `rtl`
- `screenshot_path`: `[RELATIVE_PATH_UNDER_tools/registry/runs/<SESSION_ID>/screenshots]`
- `human_result`: `[PASS | FAIL | BLOCKED | DEFERRED]`
- `issue_type`: `[RTL | OVERFLOW | CLIPPING | CTA | STATE | NAVIGATION | TYPOGRAPHY | SPACING | COLOR_TOKEN | DENSITY | CRASH | NOT_RENDERED | BLOCKED_BY_CONTRACT | BLOCKED_BY_WLT | OWNER_DECISION | NONE]`
- `issue_summary`: `[SHORT_SUMMARY_OR_EMPTY]`
- `next_action`: `[confirmed | fix_now | owner_decision | blocked_by_contract | blocked_by_wlt | defer]`
- `decision`: `[VISUAL_PASS | NEEDS_VISUAL_EVIDENCE | NEEDS_RTL_FIX | NEEDS_OVERFLOW_FIX | NEEDS_UIKIT_FIX | NEEDS_STATE_COVERAGE | BLOCKED_BY_WLT | BLOCKED_BY_CONTRACT | BLOCKED]`

Required checks before updating:

1. Confirm `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md` exists.
2. Confirm the `review_id` exists in the Visual Review Ledger (Section 8) of that file.
3. If no Active Ledger row exists yet for that `review_id`, append the first row using the queue metadata already documented in the Review Queue.
4. Confirm `screenshot_path` is not empty if `human_result` is `PASS` or `FAIL`.
5. Confirm the screenshot file exists on disk if `human_result` is `PASS` or `FAIL`.
6. If the screenshot file is missing, do not mark `PASS` or `FAIL`. Use `human_result = BLOCKED` and record `SCREENSHOT_FILE_MISSING` in `known_warnings`.
7. Do not create fake screenshots or fake evidence folders.

Update:

1. In the Active Ledger portion of the Visual Review Ledger in `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md`, add or update:
   - `state`
   - `device`
   - `viewport`
   - `screenshot_path`
   - `rtl_result`
   - `overflow_result`
   - `ui_kit_result`
   - `central_color_result`
   - `human_result`
   - `known_warnings`
   - `reviewed_at`
   - `decision`
   - `next_action`
2. If `human_result = FAIL` or `human_result = BLOCKED`, append or update the Failure Tracking section.
3. If `decision = VISUAL_PASS`, append or update the Signoff section.
4. Update the Summary Snapshot counts in the Visual Review Ledger section of `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md`.
5. Do not change queue metadata unless you are fixing a proven docs drift:
   - `review_id`
   - `surface`
   - `screen_id`
   - `file_path`
   - `route`
   - `queue_list`
   - `priority`

Verification:

- `git --no-pager diff --check`
- `git status --short`

Final response:

- `DONE_LOCAL` or `BLOCKED`
- `review_id`
- `screenshot_path`
- `human_result`
- `decision`
- `next_action`

Do not claim `PASS`, `CLOSED`, `FINAL`, or `100%`.
Do not claim that the whole DSH service is complete.

Available `review_id` values:
Use the Review Queue in the Visual Review Ledger section of `dsh/docs/DSH_MASTER_CLOSURE_MATRIX.md`.

Screenshot path convention:

```text
tools/registry/runs/<SESSION_ID>/screenshots/<surface>/<priority>__<surface>__<screen_id>__<state>__<device>__rtl__<decision>.png
```

Example:

```text
tools/registry/runs/DSH_VISUAL_SWEEP-20260524-010000/screenshots/app-client/P1__app-client__client.dsh.home.feed__success__Pixel8__rtl__VISUAL_PASS.png
```
