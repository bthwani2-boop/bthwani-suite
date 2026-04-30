# PHASE_12_SCOPE

## Mandatory Header

- WorkMode: `SOURCE-TO-TARGET MODE`
- CurrentPhase: `Phase 12 - Screen Master Census And Normalization`
- TargetService: `dsh`
- RequestType: `source_to_target_pack`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 12 registry-only screen census active; implementation claims remain forbidden`
- BlockingGaps: `Phase 13 screen spec and purpose work is not complete; no screen implementation, limited-api preview, or runtime truth is allowed here`
- NextAllowed: `Phase 13 screen spec and purpose system`

## In Scope

- canonical `dsh` Phase 12 preview route registries
- fixture-location declarations for lawful current-service preview families
- service namespaces for `app-client`, `app-partner`, `app-captain`, `app-field`, and `control-panel`
- single-source exports consumed by thin surface shells

## Out Of Scope

- screen component implementation
- service logic or runtime truth
- generated API clients or binding
- `webapp` and `website` content
- donor-only clusters moved to legacy
- Phase 13 family-purpose decisions

## Rule

This package is the single source for current `dsh` Phase 12 placeholder route declarations, fixture-location manifests, and normalized screen-registry staging.
It must not absorb bound behavior, non-canonical donor spillover, or any runtime-access path.

## When Screen Work Starts Here

This package exists because `Phase 12` is the first lawful point for screen-registry entry inside the preview registry layer.

Use this boundary precisely:

- `Phase 10` allowed surface classification only; it did not allow adding screens here
- `Phase 11` completed the journey chain; it still did not allow real screen implementation here
- `Phase 12` is the first lawful point to register screen-registry rows, preview route stubs, fixture locations, and donor-normalized screen identities for exhaustive census work
- `Phase 13` is the first point where those retained screens should gain fixed family, purpose, CTA, state, and acceptance requirements
- `Phase 15-18` is where screen-driven UI growth and richer state presentation may expand, while remaining unbound unless later validation explicitly justifies more

Important distinction:

- allowed here now = preview-route declarations, screen-registry rows, fixture-location manifests, normalization metadata, and unit classification notes
- not allowed here now = bound screen logic, generated client use, runtime truth, or production claims