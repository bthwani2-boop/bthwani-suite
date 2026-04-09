# SND Canonical Architecture

## Source of truth
- Screens and reusable interaction logic: `packages/surfaces/src/snd/*`
- CONTROL PANEL single SND workspace surface: `packages/surfaces/src/web/control panel/service-catalog/services/Snd/SndWorkspacePage.tsx`
- App page under `apps/web/control panel/app/service-catalog/services/snd/page.tsx` is shell-only
- Canonical dev runtime seed: `services/snd/src/dev/snd.seed.ts`
- Production/local-prod truth must move to Postgres, not package fixtures

## Policy
- App-Client SND route ownership is locked to `SndHome`, `SndRequests`, and `SndRequestGet` only.
- Embedded create is the only approved create path: `SndServiceDetailWithFormSheet` from `SndHome` and `SndInterestQuickComposeSheet` from `SndRequests`.
- Successful embedded create must converge on `SndRequestGet` when request identity is available; `SndRequests` remains secondary history, not a competing primary entry.
- Any create affordance that survives on `SndRequests` must remain visually secondary to the route's history/detail-follow-up job.
- No extra CONTROL PANEL SND pages outside service-catalog
- The only approved CONTROL PANEL SND route is `/service-catalog/services/snd`; operator queue work is primary and identity/visuals/publishing/insights stay as internal sections on that same route.
- `SndWorkspacePage` must default to `requests` mode; `studio` and its identity/visuals/publishing/insights sections remain internal settings state, not competing route-level families.
- `SndHome` must keep request-history/runtime failures localized to a secondary panel; history failure cannot promote the hub into a competing history-first surface.
- `SndHome` request history now reads through `snd_home_get`, and the home mini-details path must stay preview/view-full only; cancel does not belong to the hub anymore.
- `SndRequests` must expose explicit route-level or banner-level failure states; stale history refresh cannot fail silently.
- `SndRequestGet` must recover non-retriable detail failures back to `SndRequests`, and inline cancel failure must keep the user on detail with explicit copy.
- `SndRequestGet` detail reads must use `snd_request_get`, and inline cancel must use `snd_request_status_update` with `cancelled` status from the detail route itself.
- `/service-catalog/services/snd` requests mode must disclose preview-backed queue truth and keep runtime reread and empty-filter recovery inside the same route.
- Legacy SND exports under operations/support are removed from active indexes
- Legacy `SndRequestCreate`, `SndRequestCancel`, `SndRequestStatusUpdate`, `SndRequestAccept`, and `SndRequestComplete` must not reappear as top-level route ownership.
- Package fixtures remain design/demo only, never runtime truth

