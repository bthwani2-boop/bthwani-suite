# 07_IMPLANT_GUIDE

## Purpose

Use this pack to stabilize DSH preview route semantics after Phase 12 without introducing implementation drift.

## Implant Rules

- use the `screen_id` set in `03_SCREEN_PURPOSE_LOCK.csv` as the only lawful current-service canonical route identity set
- do not add route entries for `Merge`, `Convert`, or `Move to Legacy` candidates
- keep `dsh_partner_order_issue_queue` internal and avoid promoting it into a top-level partner navigation family
- keep `webapp` and `website` excluded from DSH until a later service decision changes surface ownership

## How To Apply In Existing Repo Structure

- keep `apps/mobile/*/src/shell/routes.ts` and `apps/web/control-panel/src/shell/routes.ts` bound only to canonical route ids already accepted in Phase 12
- use the Phase 13 family and CTA data to drive fixture folder naming screen headers and route labels in later phases
- attach companions inline steps and state shells under the owning canonical screen path inside `packages/surfaces` when fixture content is created

## What Not To Do

- do not reopen donor split routes as separate clean screens
- do not treat observational screens as hidden action hubs
- do not let internal ops screens absorb partner or captain execution tasks
- do not use fixture-driven convenience as a reason to change service ownership

## Next Allowed

- Phase 14 flow compression over the accepted canonical set
- Phase 15 screen-driven UI Kit expansion only where compressed real screens prove demand