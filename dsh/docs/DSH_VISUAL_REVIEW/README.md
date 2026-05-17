# DSH Visual Review Evidence System

Branch: `ghb/0144-20260516-033533-local-change-review-patch`
Commit: `cae3c7bf`
Created: 2026-05-16

---

## Purpose

This directory contains the **visual review evidence** for DSH V7 screens.

**This is visual evidence only. It is NOT:**
- Runtime closure
- API contract closure
- WLT integration closure
- TypeScript compilation certification

Visual review confirms that screens render correctly in RTL (Arabic) on real devices and browsers. It does not certify that API calls succeed, WLT bridges are live, or backend contracts are fulfilled.

---

## Rules

### Screenshots
- Screenshots **must be real captures** from a simulator, physical device, or browser.
- Do **not** add fabricated, placeholder, or AI-generated images.
- Each screenshot must match the `screenshot_path` in the ledger exactly.
- Use a new filename for each revision; do not overwrite old screenshots.

### PASS
- Requires an **actual screenshot_path** pointing to a real capture.
- Requires a human reviewer name and `reviewed_at` timestamp.
- Cannot be self-reported by the engineer who wired the screen.

### FAIL
- Requires `issue_type`, `issue_summary`, and `next_action` in the ledger row.
- Requires a corresponding row in `DSH_VISUAL_REVIEW_FAILURES.md`.

### BLOCKED
- Requires a blocker reason in `issue_summary`.
- The `next_action` must describe what resolves the block.

### NOT_REVIEWED
- The initial state of every row in this system.
- No result claim may be made for a NOT_REVIEWED row.

---

## Allowed `result` Values

| Value | Meaning |
|---|---|
| NOT_REVIEWED | No human review performed yet |
| PASS | Reviewed and confirmed on device/browser |
| FAIL | Reviewed and a visual defect was found |
| BLOCKED | Cannot be reviewed due to environment or contract block |
| DEFERRED | Intentionally deferred to a later review cycle |

---

## Directory Structure

```
DSH_VISUAL_REVIEW/
  README.md                          — this file
  DSH_VISUAL_REVIEW_LEDGER.csv       — one row per reviewable screen
  DSH_VISUAL_REVIEW_SUMMARY.md       — counts and status overview
  DSH_VISUAL_REVIEW_FAILURES.md      — failure tracking table
  DSH_VISUAL_REVIEW_SIGNOFF.md       — per-screen sign-off table
  DSH_VISUAL_REVIEW_SCREEN_INDEX.md  — grouped screen list by surface
  DSH_VISUAL_REVIEW_UPDATE_PROTOCOL.md — how to update after review
  device-profile.json                — device/locale/timezone config
  git-evidence.txt                   — git state at creation time
  screenshots/
    app-client/
    app-partner/
    app-captain/
    app-field/
    control-panel/
  reviews/
    app-client/
    app-partner/
    app-captain/
    app-field/
    control-panel/
```

---

## Source of Truth

- Screen list: `dsh/docs/closure/DSH_V7_FINAL_SCREEN_REVIEW_QUEUE.md`
- Ready gate: `dsh/docs/closure/DSH_V7_FINAL_READY_GATE.md`
- Blockers: `dsh/docs/closure/DSH_V7_FINAL_REMAINING_BLOCKERS.md`
