# ESF Final UX Implementation - Current Runtime Truth

## Status

This document reflects the current ESF mobile runtime after the donor/requester audit and card-contract correction.

- Runtime owner: `auto_esf_home_get.tsx`
- Canonical decision: `Final closure/esf/DECISION__esf__FINAL.md`
- Current focus: one ESF hub in app-client, donor cards that never fake acceptance, and requester views that lead with donors rather than stale request summaries.

## Active Runtime Pieces

### Home Hub

- `auto_esf_home_get.tsx`
  - single ESF hub for donor and requester modes
  - inline blood-type and distance controls
  - ESF-specific orange shell behavior
  - demo rotation for requester-side donor previews

### Active Components

- `components/EsfBottomSheet.tsx`
- `components/EsfBloodTypePickerSheet.tsx`
- `components/EsfRequestMiniDetailsSheet.tsx`
- `components/EsfRequestQuickComposeSheet.tsx`
- `components/EsfSwipeableCard.tsx`
- `components/EsfCriticalRequestPopup.tsx`
- `components/EsfDonationEligibilitySheet.tsx`
- `components/home/EsfRequestCardContent.tsx`
- `utils/esfFilters.ts`

## Current Interaction Contract

### Donor Mode

- donors see blood requests, not donor profiles
- request cards remain tappable for detail review
- quick accept and swipe accept appear only when the request carries a real `matchId`
- mini details and critical popup degrade to review-only behavior when no real match exists

### Requester Mode

- primary content is donor opportunity cards for the active request
- the request switcher is secondary and compact
- requester CTAs remain centered on `اطلب الدم الآن` and opening the active request
- demo mode rotates across several requests instead of freezing on one fixture

### Request Creation

- `EsfRequestQuickComposeSheet.tsx` is the active compose surface
- beneficiary toggle UI was removed
- GPS hospital capture is supported
- medical reason options include oncology treatment cases

## Superseded Or Removed Artifacts

These references appeared in older drafts and should not be treated as current runtime truth:

- `EsfSegmentedControl.tsx`: not part of the current ESF mobile runtime
- `EsfFilterChipsBar.tsx`: replaced by inline controls inside the home hub
- `EsfDistancePickerSheet.tsx`: deleted as dead code
- `auto_esf_availability_update.tsx`: not part of the current app-client ESF runtime
- `auto_esf_request_create.tsx`: replaced by the quick compose sheet flow

## Verified Constraints

- donor-home accept flows are now gated by explicit match context
- requester cards are donor-first and semantically aligned with the tab purpose
- blood type labels are rendered safely in mixed RTL/LTR text
- the recently touched ESF runtime files are editor-clean
- full `surfaces` build can still fail because of an unrelated `app-captain` type error outside ESF

## Source Files To Read First

1. `auto_esf_home_get.tsx`
2. `components/home/EsfRequestCardContent.tsx`
3. `components/EsfRequestMiniDetailsSheet.tsx`
4. `components/EsfCriticalRequestPopup.tsx`
5. `components/EsfRequestQuickComposeSheet.tsx`
6. `utils/esfFilters.ts`

## Last Updated

- Updated for current runtime truth after the donor/requester card audit
- Older March 2026 implementation notes in this file are superseded

