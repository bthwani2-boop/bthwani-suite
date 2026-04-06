# 05_IMPLANT_GUIDE

## How To Use This Pack

Use this pack as the sole screen-source input to Phase 13 for `dsh`.

## Allowed Downstream Use

- assign canonical screen families only from cataloged candidates in this pack
- assign primary CTA, secondary actions, and entry or exit rules only after checking the current decision column for each candidate
- if a preview shell or route is created later, it must come from a `Keep` candidate or a `Convert` candidate that is intentionally realized as a companion
- use `Move to Legacy` and `Internal` rows to block accidental scope leakage in Phase 13 and Phase 14

## Forbidden Downstream Use

- do not create a Phase 13 screen family entry for a donor-only screen that this pack moved to legacy or future scope
- do not reopen donor split variants once they are marked `Merge`
- do not upgrade companion sheets or states into primary screens without new evidence
- do not create preview routes for `webapp` or `website` because current DSH ownership keeps them out