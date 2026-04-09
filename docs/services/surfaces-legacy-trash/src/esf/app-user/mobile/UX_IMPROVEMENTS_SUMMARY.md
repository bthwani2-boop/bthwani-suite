# ESF UX Improvements - Current Summary

## What Changed

### Semantic Cleanup

- donor tab now remains request-first
- requester tab now remains donor-first
- requester demo data rotates through donor opportunities instead of freezing or duplicating the wrong content

### Action Safety

- donor quick accept no longer assumes `request.id === matchId`
- swipe accept, card accept, mini-details accept, and critical-popup accept are all gated by real match context
- unmatched donor cards stay detail-first so the UI does not promise an action the backend cannot complete

### Request Creation

- `EsfRequestQuickComposeSheet.tsx` is the active compose flow
- beneficiary toggle UI was removed
- GPS hospital capture is supported
- medical reasons include oncology treatment coverage

### Shell And Hierarchy

- ESF keeps its orange, service-specific shell behavior
- inline controls replaced earlier draft references to separate segmented/filter bars
- requester mode now emphasizes donor cards while keeping request switching secondary

## Current Runtime File Set

### Primary Runtime Files

- `auto_esf_home_get.tsx`
- `auto_esf_matches_inbox.tsx`
- `auto_esf_request_get.tsx`
- `auto_esf_match_get.tsx`

### Active Supporting Files

- `components/EsfBottomSheet.tsx`
- `components/EsfBloodTypePickerSheet.tsx`
- `components/EsfRequestMiniDetailsSheet.tsx`
- `components/EsfRequestQuickComposeSheet.tsx`
- `components/EsfSwipeableCard.tsx`
- `components/EsfCriticalRequestPopup.tsx`
- `components/home/EsfRequestCardContent.tsx`
- `utils/esfFilters.ts`

## Removed Or Superseded References

These older references should not be used for ESF maintenance decisions:

- `EsfSegmentedControl.tsx`
- `EsfFilterChipsBar.tsx`
- `EsfDistancePickerSheet.tsx`
- `auto_esf_availability_update.tsx`
- `auto_esf_request_create.tsx`

## Validation Snapshot

- touched ESF runtime files are editor-clean
- requester donor-first behavior was already validated in the home hub
- donor accept logic now respects real match identity instead of using a placeholder
- unrelated `app-captain` build issues can still affect full `surfaces` builds

## Maintenance Guidance

If you are updating ESF mobile behavior, start with:

1. `auto_esf_home_get.tsx`
2. `components/home/EsfRequestCardContent.tsx`
3. `components/EsfRequestMiniDetailsSheet.tsx`
4. `components/EsfCriticalRequestPopup.tsx`
5. `EsfRequestQuickComposeSheet.tsx`

## Last Updated

Updated after the donor/requester card audit and stale documentation cleanup.
