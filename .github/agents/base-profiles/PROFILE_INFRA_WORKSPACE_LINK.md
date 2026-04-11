# Base Profile: infra.workspace-link

## Always Load

- `link-workspace-packages`

## Use When

- a workspace package import is unresolved
- a sibling package dependency was created but not linked correctly
- the task is specifically about monorepo dependency linking

## Isolation Rule

Do not mix this profile into normal design, UX, donor, or ready governance work.
It is a focused infra repair route only.

## Primary Contract

- detect package manager correctly
- identify consumer and provider packages
- add the real workspace dependency correctly
- verify the link instead of patching around the issue
