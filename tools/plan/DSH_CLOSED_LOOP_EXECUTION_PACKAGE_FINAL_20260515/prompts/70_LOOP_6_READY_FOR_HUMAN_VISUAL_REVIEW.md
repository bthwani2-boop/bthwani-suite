# LOOP 6 — Ready for Human Visual Review

## Objective

Prepare the user to review final screen design manually. Do not redesign.

## Required outputs

```text
dsh/docs/closure/DSH_FINAL_UI_REVIEW_QUEUE.md
dsh/docs/closure/DSH_READY_FOR_HUMAN_VISUAL_REVIEW_GATE.md
dsh/docs/closure/DSH_REMAINING_BLOCKERS.md
```

## Required checks

For every screen/workspace:
- screen_id,
- surface,
- actor,
- file_path,
- owner,
- primary CTA,
- route/mount status,
- state coverage,
- RTL risk,
- clipping/overflow risk,
- fragmentation risk,
- god-screen risk,
- related lifecycle IDs,
- related control-panel sections,
- WLT bridge if finance-related,
- visual review priority P0/P1/P2.

## Decision

If no blockers remain, write:
```text
READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
```

If evidence is incomplete, write:
```text
NEEDS_EVIDENCE
```

If screenshots are missing for visual acceptance, write:
```text
NEEDS_VISUAL_EVIDENCE
```

Do not claim final closure.
