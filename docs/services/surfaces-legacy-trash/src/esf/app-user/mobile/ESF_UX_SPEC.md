# ESF UX Specification - Current Runtime Contract

## Scope

This is a maintenance spec for the current ESF mobile runtime in app-client. It supersedes older planning notes that described removed components or obsolete multi-screen flows.

## Core Rules

1. Donor tab shows blood requests.
2. Requester tab shows donors for the active request.
3. Request creation happens through `EsfRequestQuickComposeSheet.tsx`.
4. Accept actions appear only when a request has a real `matchId`.
5. When no real match exists, donor surfaces stay review-first instead of pretending the request can be accepted.

## Donor Contract

### Card Behavior

- card tap opens `EsfRequestMiniDetailsSheet.tsx`
- swipe-to-accept is enabled only when the request has `matchId`
- inline quick accept is enabled only when the request has `matchId`
- pending requests without `matchId` show review guidance instead of an accept CTA

### Critical Popup

- `EsfCriticalRequestPopup.tsx` may still alert on critical nearby requests
- its primary action is `accept` only when `matchId` exists
- otherwise the primary action opens details for review

### Mini Details Sheet

- shows compact request summary
- keeps directions available when coordinates exist
- shows the accept button only when the backend already resolved a real match

## Requester Contract

### Primary Hierarchy

- donor opportunity cards are the primary content
- the request switcher is compact and secondary
- the active request summary exists to support donor selection, not to replace it

### Requester Actions

- primary CTA: `اطلب الدم الآن`
- secondary CTA: open the active request
- donor cards open the concrete match using the donor-side match id

### Demo Behavior

- demo rotation is independent of `homeInsights?.isDemo`
- several requester requests rotate through the donor preview state
- demo data in requester mode must always represent donors, not duplicate request cards

## Layout Contract

### Header And Controls

- ESF uses the orange shell/header behavior from `UserMobileSurface.tsx`
- donor/requester mode switching is handled inline inside the home hub
- blood type and distance controls are inline, not separate retired bars or sheets except for the blood-type picker that still exists

### Active Files

- `auto_esf_home_get.tsx`
- `components/home/EsfRequestCardContent.tsx`
- `components/EsfBottomSheet.tsx`
- `components/EsfBloodTypePickerSheet.tsx`
- `components/EsfRequestMiniDetailsSheet.tsx`
- `components/EsfRequestQuickComposeSheet.tsx`
- `components/EsfSwipeableCard.tsx`
- `components/EsfCriticalRequestPopup.tsx`
- `utils/esfFilters.ts`

## Retired References

The following items are not part of the current runtime contract:

- `EsfSegmentedControl.tsx`
- `EsfFilterChipsBar.tsx`
- `EsfDistancePickerSheet.tsx`
- `auto_esf_availability_update.tsx`
- `auto_esf_request_create.tsx`

## Validation Notes

- current ESF card semantics were re-audited after the donor/requester review cycle
- the touched ESF files are editor-clean
- any remaining full-workspace build failure outside ESF should be treated separately

## Last Updated

Updated after the donor accept-gating fix and stale-doc cleanup.

