# DSH Visual Review — Single Screen Update Command

Copy this prompt and fill in the bracketed placeholders, then send it to Claude.

---

نفّذ تحديث أدلة المراجعة البصرية لشاشة واحدة فقط. لا تعدّل source code. لا تعدّل التصميم. لا تعدّل ui-kit. لا تعدّل WLT. هذه مهمة evidence فقط.

Target repo:
C:\bthwani-suite

Branch:
ghb/0164-20260521-205754-dsh

Evidence root:
dsh/docs/DSH_VISUAL_REVIEW.md

Screen to update:
review_id: [REVIEW_ID]
surface: [app-client | app-partner | app-captain | app-field | control-panel]
screen_id: [SCREEN_ID]
file_path: [FILE_PATH]
state: [default | loading | empty | error | disabled | expanded | detail | success | custom]
device: [DEVICE_NAME]
viewport: [VIEWPORT]
locale: ar
direction: rtl
screenshot_path: [RELATIVE_SCREENSHOT_PATH]
human_result: [PASS | FAIL | BLOCKED | DEFERRED]
issue_type: [RTL | OVERFLOW | CLIPPING | CTA | STATE | NAVIGATION | TYPOGRAPHY | SPACING | COLOR_TOKEN | DENSITY | CRASH | NOT_RENDERED | BLOCKED_BY_CONTRACT | BLOCKED_BY_WLT | OWNER_DECISION | NONE]
issue_summary: [SHORT_SUMMARY_OR_EMPTY]
next_action: [confirmed | fix_now | owner_decision | blocked_by_contract | blocked_by_wlt | defer]

Required checks before updating:
1. Confirm `dsh/docs/DSH_VISUAL_REVIEW.md` exists.
2. Confirm the `review_id` exists in the embedded ledger row inside that file.
3. Confirm `screenshot_path` is not empty if `human_result` is PASS or FAIL.
4. Confirm the screenshot file exists on disk if `human_result` is PASS or FAIL.
5. If the screenshot file is missing, do not mark PASS or FAIL. Mark BLOCKED and write reason: SCREENSHOT_FILE_MISSING.
6. Do not create fake screenshot files.
7. Do not overwrite previous screenshot references. If this is a revision, add a new screenshot filename and update the ledger row to point to the latest one.

Update:
1. In `dsh/docs/DSH_VISUAL_REVIEW.md`, update the embedded ledger row:
   - `result` = `human_result`
   - `screenshot_path`
   - `issue_type`
   - `issue_summary`
   - `reviewed_at`
   - `next_action`
   - `review_doc_path`

2. Update the failure tracking section in `dsh/docs/DSH_VISUAL_REVIEW.md` if `result = FAIL`.
3. Update the signoff section in `dsh/docs/DSH_VISUAL_REVIEW.md` if `result = PASS`.
4. Update the summary counts and status metadata inside `dsh/docs/DSH_VISUAL_REVIEW.md`.
5. Do not change these row values:
   - `review_id`
   - `screen_id`
   - `surface`
   - `file_path`
   - `queue_list`
   - `priority`

Verification:
Run:
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- git status --short

Final response:
Report only:
DONE_LOCAL
or
BLOCKED

Then list:
- updated ledger row
- screenshot_path
- result
- next_action

Do not claim PASS/CLOSED/FINAL/100%.
Do not say the whole DSH is complete.

---

## Available review_ids

| review_id | surface | screen_id | queue_list | priority |
|---|---|---|---|---|
| VR-L1-001 | app-client | client.dsh.home.feed | LIST_1_READY_NOW | P1 |
| VR-L1-002 | app-client | client.dsh.cart.review | LIST_1_READY_NOW | P1 |
| VR-L1-003 | app-client | client.dsh.order.tracking.live | LIST_1_READY_NOW | P1 |
| VR-L1-004 | app-client | client.dsh.orders.history | LIST_1_READY_NOW | P1 |
| VR-L1-005 | app-client | client.dsh.store.details | LIST_1_READY_NOW | P1 |
| VR-L1-006 | app-client | client.dsh.order.issue.workspace | LIST_1_READY_NOW | P1 |
| VR-L1-007 | app-partner | partner.dsh.orders.inbox | LIST_1_READY_NOW | P1 |
| VR-L1-008 | app-partner | partner.dsh.order.detail | LIST_1_READY_NOW | P1 |
| VR-L1-009 | app-partner | partner.dsh.inventory.catalog | LIST_1_READY_NOW | P1 |
| VR-L1-010 | app-partner | partner.dsh.order.rejection | LIST_1_READY_NOW | P1 |
| VR-L1-011 | app-partner | partner.dsh.entry.status | LIST_1_READY_NOW | P1 |
| VR-L1-012 | app-partner | partner.dsh.home.dashboard | LIST_1_READY_NOW | P1 |
| VR-L1-013 | app-captain | captain.dsh.orders.inbox | LIST_1_READY_NOW | P1 |
| VR-L1-014 | app-captain | captain.dsh.orders.detail | LIST_1_READY_NOW | P1 |
| VR-L1-015 | app-field | field.dsh.stores.list | LIST_1_READY_NOW | P1 |
| VR-L1-016 | app-field | field.dsh.store.onboarding | LIST_1_READY_NOW | P1 |
| VR-L1-017 | app-field | field.dsh.store.visit | LIST_1_READY_NOW | P1 |
| VR-L1-018 | control-panel | ops.dsh.operations.hub | LIST_1_READY_NOW | P1 |
| VR-L1-019 | control-panel | ops.dsh.dispatch | LIST_1_READY_NOW | P1 |
| VR-L1-020 | control-panel | ops.dsh.exceptions | LIST_1_READY_NOW | P1 |
| VR-L1-021 | control-panel | ops.dsh.live.orders | LIST_1_READY_NOW | P1 |
| VR-L1-022 | control-panel | ops.dsh.audit.sla | LIST_1_READY_NOW | P1 |
| VR-L2-001 | app-client | client.dsh.checkout.intent | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-002 | app-captain | captain.dsh.orders.pickup-dropoff | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-003 | app-captain | captain.dsh.orders.pod-submission | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-004 | app-captain | captain.dsh.orders.map | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-005 | app-field | field.dsh.store.onboarding/documents | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-006 | app-field | field.dsh.store.visit/evidence | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-007 | control-panel | ops.dsh.audit.sla/detail | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-008 | control-panel | ops.dsh.catalog.approvals.quality | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-009 | control-panel | ops.dsh.catalog.approvals.pricing | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-010 | app-captain | captain.wlt.dsh.finance.bridge | LIST_2_DISABLED_PREVIEW | P2 |
| VR-L2-011 | app-partner | partner.wlt.dsh.wallet.bridge | LIST_2_DISABLED_PREVIEW | P2 |

## Screenshot path convention

```
dsh/docs/DSH_VISUAL_REVIEW/screenshots/<surface>/<priority>__<surface>__<screen_id>__<state>__<device>__rtl__<result>.png
```

Example:
```
dsh/docs/DSH_VISUAL_REVIEW/screenshots/app-client/P1__app-client__client.dsh.home.feed__default__iPhone15Pro__rtl__PASS.png
```
