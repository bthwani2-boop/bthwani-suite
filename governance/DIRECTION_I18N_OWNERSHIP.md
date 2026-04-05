# DIRECTION_I18N_OWNERSHIP

## Mandatory Header

- WorkMode: `BOOTSTRAP MODE`
- CurrentPhase: `Phase 05 - Master Foundation Minimal`
- TargetService: `_shared`
- RequestType: `bootstrap_artifact_work`
- PrimaryRepo: `bthwani-suite`
- LegacyRepo: `bthfinal`
- PackStatus: `Phase 05 active`
- BlockingGaps: `UI Kit foundation is not created yet`
- NextAllowed: `Use this rule to avoid split ownership later`

## Ownership Rule

Language and direction behavior must have one shared owner.

Current owner:

- `ui-kit owner` for shared direction and language rendering rules

## Scope Of Ownership

Shared owner controls:

- RTL/LTR behavior rules
- shared direction primitives and helpers
- shared typography direction compatibility
- shared spacing and row-direction conventions
- shared language and direction behavior exposed through reusable foundation

## Explicit Prohibition

- no app may redefine shared direction law locally
- no service may fork shared i18n or direction ownership inside its own feature tree
- no surface may become the canonical owner of direction behavior
