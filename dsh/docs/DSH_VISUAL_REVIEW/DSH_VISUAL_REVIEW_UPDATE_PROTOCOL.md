# DSH Visual Review — Update Protocol

How to update the evidence system after a human screenshot review session.

---

## Per-Screen Update Steps

### Step 1 — Copy Screenshot

Copy the real screenshot to the path specified in the ledger's `screenshot_path` column.

- Do **not** modify existing screenshot files.
- Use a new filename for each revision (change the `<result>` suffix or add a revision counter).
- Example filename pattern:
  ```
  dsh/docs/DSH_VISUAL_REVIEW/screenshots/<surface>/<priority>__<surface>__<screen_id>__<state>__<device>__rtl__<result>.png
  ```
- Replace `<result>` with the actual result: `PASS`, `FAIL`, or `BLOCKED`.

### Step 2 — Update Ledger Row

Open `DSH_VISUAL_REVIEW_LEDGER.csv` and update the row for the reviewed screen:

| Column | What to update |
|---|---|
| `screenshot_path` | Exact path to the real screenshot file |
| `result` | `PASS`, `FAIL`, `BLOCKED`, or `DEFERRED` |
| `issue_type` | Required if FAIL (e.g., `RTL_BREAK`, `LAYOUT_OVERFLOW`, `CRASH`, `MISSING_CONTENT`) |
| `issue_summary` | Required if FAIL or BLOCKED — one sentence description |
| `reviewer` | Reviewer name or handle |
| `reviewed_at` | ISO date (e.g., `2026-05-16`) |
| `next_action` | What happens next (e.g., `NONE`, `FIX_REQUIRED`, `RETEST`, `ESCALATE`) |

### Step 3 — Create or Update Per-Screen Review Doc

Create a markdown file at the `review_doc_path` from the ledger:
```
dsh/docs/DSH_VISUAL_REVIEW/reviews/<surface>/<review_id>__<screen_id>.md
```

Include at minimum:
- `review_id`
- `screen_id`
- `surface`
- `result`
- `reviewer`
- `reviewed_at`
- Screenshot path
- Notes on what was checked

### Step 4 — Update DSH_VISUAL_REVIEW_SUMMARY.md

Manually update the result distribution table in `DSH_VISUAL_REVIEW_SUMMARY.md` to reflect the new counts.

### Step 5 — Update DSH_VISUAL_REVIEW_FAILURES.md (if FAIL)

If the result is `FAIL`, add a row to `DSH_VISUAL_REVIEW_FAILURES.md` with:
- `review_id`
- `screen_id`
- `surface`
- `file_path`
- `issue_type`
- `issue_summary`
- `screenshot_path`
- `next_action`
- `status` (e.g., `OPEN`, `IN_PROGRESS`, `FIXED_PENDING_RETEST`)

### Step 6 — Update DSH_VISUAL_REVIEW_SIGNOFF.md

Add a row to `DSH_VISUAL_REVIEW_SIGNOFF.md`:

| screen_id | surface | result | reviewer | reviewed_at | notes |
|---|---|---|---|---|---|
| {screen_id} | {surface} | {result} | {reviewer} | {date} | {optional notes} |

---

## Screenshot Filename Revision Convention

When retesting a screen after a fix, do not overwrite the old screenshot.
Use a revision suffix:
```
P1__app-client__client.dsh.home.feed__WIRED_IN_FLOW__iPhone15__rtl__PASS__r2.png
```

---

## What Not to Do

- Do **not** mark PASS without a real screenshot_path.
- Do **not** delete or overwrite old screenshots.
- Do **not** modify the ledger's `review_id`, `screen_id`, `surface`, `file_path`, `queue_list`, or `priority` columns.
- Do **not** add rows for List 3 (BLOCKED_NOT_RENDERED) screens.
- Do **not** claim PASS for a screen reviewed by the same engineer who wired it.
