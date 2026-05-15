# V4-2 — CLOSE WIRING GAPS AND DEAD/NOISE MAP

## Purpose

A file existing is not closure. Every source skeleton must be wired into a real flow, or explicitly blocked/deferred/obsolete.

## Allowed edits

- DSH source files required to wire already-created skeletons.
- Existing DSH registries/routes/exports when the file already exists and the gap requires routing/mounting.
- `dsh/docs/closure/DSH_SKELETON_WIRING_MATRIX.csv`
- `dsh/docs/closure/DSH_FRONTEND_DEAD_NOISE_CLEANUP_MATRIX.csv`
- `dsh/docs/closure/DSH_V4_2_WIRING_AND_NOISE_EVIDENCE.md`
- `dsh/docs/closure/DSH_MISSING_LOGIC_AND_UI_GAPS.csv`

## Forbidden

- No new arbitrary screens.
- No broad redesign.
- No backend/API/runtime.
- No OpenAPI.
- No WLT semantics.
- No ui-kit source edits.
- No deletion without proven safe classification.

## Required wiring targets

Audit and handle at least these families:

- `dsh/frontend/control-panel/support/*`
- `dsh/frontend/control-panel/finance/*`
- `dsh/frontend/app-client/sheets/CancelOrderSheet.tsx`
- `dsh/frontend/app-captain/sheets/OfferDeclineSheet.tsx`
- `dsh/frontend/app-partner/sheets/AcceptanceTimerSheet.tsx`
- `DshCaptainMapScreen.tsx` registration/mounting gap
- captain availability state
- Field ops activation approval
- catalog item approval/publishing gate
- partner deactivation/performance review
- ops messaging surfaces

## TODO handling

No TODO/FIXME/XXX should remain in changed DSH source unless the final blocker file explicitly lists it. Prefer moving contract blockers into `DSH_FINAL_REMAINING_BLOCKERS.md`, not leaving TODO comments in source.

## Required matrices

`DSH_SKELETON_WIRING_MATRIX.csv` columns:

```csv
file_path,gap_id,surface,actor,placement_type,wiring_status,imported_by,exported_by,registered_by,mounted_by,source_owner,reason,remaining_action,status,notes
```

`DSH_FRONTEND_DEAD_NOISE_CLEANUP_MATRIX.csv` columns:

```csv
path,classification,reason,used_by,duplicate_of,recommended_action,delete_safe_now,owner_decision_required,notes
```

## Gate

V4-2 is complete only if every skeleton source file is classified and every wired file has proof.
