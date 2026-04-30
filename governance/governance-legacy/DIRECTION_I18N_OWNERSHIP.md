---
generatedFrom: governance/DIRECTION_I18N_OWNERSHIP.md
generatedAt: 2026-04-30T04:48:37.3830638+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Direction I18n Ownership

Status: CANONICAL_POLICY
Owner: BThwani Governance
Scope: shared direction behavior, reusable i18n foundations, and ownership boundaries across apps, app-shells, surfaces, and ui-kit

## Purpose

Language and direction behavior must have one shared owner so RTL, LTR, spacing, layout mirroring, and reusable language foundations do not drift across surfaces.

## Canonical Owner

`packages/ui-kit` is the canonical owner of shared direction and reusable i18n foundation behavior.

This ownership includes reusable primitives, helpers, and rules that more than one app, shell, or surface depends on.

## Shared Ownership Scope

The shared owner controls:

- RTL and LTR behavior rules
- shared direction primitives and helpers
- shared typography direction compatibility
- shared spacing and row-direction conventions
- mirrored layout behavior in reusable components
- reusable language and direction behavior exposed through public ui-kit exports

## Local Consumer Scope

Apps, app-shells, and surfaces may own:

- service-specific copy
- screen-specific content wording
- translation keys and content values owned by the service domain
- feature-level localization decisions that do not redefine shared direction law

Local consumers must not become the canonical owner of shared direction behavior.

## Explicit Prohibitions

- no app may redefine shared direction law locally
- no app-shell may fork shared direction primitives
- no service may fork shared i18n or direction ownership inside its own feature tree
- no surface may become the canonical owner of direction behavior
- no direct local replacement of reusable direction helpers is allowed outside ui-kit

## Architecture Binding

This policy follows the platform architecture rule:

```text
Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only
```

Direction and reusable i18n foundations must follow the same path.

## Closure Rule

Direction and i18n ownership is not considered closed unless:

- reusable direction law points to ui-kit as the shared owner
- local consumers do not redefine shared direction primitives
- public consumption paths are clear
- conflicting ownership claims are removed from governance text

