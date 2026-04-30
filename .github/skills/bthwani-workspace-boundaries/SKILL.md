---
name: bthwani-workspace-boundaries
description: 'Enforce workspace boundaries for bthwani-suite surface work. Use when deciding live build lanes, donor-vs-target authority, naming normalization, or whether a path is live, central, or read-only.'
---

# BTHWANI Workspace Boundaries

## When to Use

- Deciding whether work belongs in `packages/ui-kit`, `packages/app-shells`, or `packages/surfaces`
- Deciding whether a source is live target truth or donor/reference only
- Normalizing legacy names before creating or updating live implementation paths
- Checking whether a file path is allowed for mutation or read-only inspection

## Repo Sovereignty Law

`bthwani-suite` is the active primary repo.

This means:

- current implementation truth lives here
- current naming truth lives here
- current ownership truth lives here
- current clean build decisions live here
- current live package boundaries live here

`bthfinal` is frozen donor/reference only.

This means:

- it may be read, traced, compared, and mined selectively
- it may not dictate the new repo automatically
- it may not be used for blind implementation carryover
- it may not silently leak naming, structure, layout, or quality drift into the new repo

`docs/services/**` inside `bthwani-suite` is governed internal intelligence.

This means:

- it may be used as service truth, planning truth, rationalization truth, and screen-wave truth
- it is not live implementation code by default

## Lane Ownership Law

Live implementation lanes:

- `C:\Users\b\Documents\GitHub\bthwani-suite\packages\app-shells`
- `C:\Users\b\Documents\GitHub\bthwani-suite\packages\surfaces`

Central reusable support lane only when pressure is proven:

- `C:\Users\b\Documents\GitHub\bthwani-suite\packages\ui-kit`

Read-only donor/reference lanes:

- `C:\Users\b\Documents\GitHub\bthwani-suite\docs\services`
- `C:\Users\b\Documents\GitHub\bthwani-suite\docs\services\surfaces-legacy-trash`
- frozen legacy repo `bthfinal`

Do not mutate donor/reference lanes during surface work.

## Naming Normalization Law

Approved clean internal names are:

### Mobile

- `app-client`
- `app-partner`
- `app-captain`
- `app-field`

### Web

- `control-panel`
- `webapp`
- `website`

Normalize legacy names in clean outputs:

- `app-user` -> `app-client`
- `mcpw` -> `control-panel`

Preserve old names only inside source trace or evidence sections when needed for forensic clarity.

No old internal name may leak into live target implementation paths.

## Practical Boundary Rule

Use the strongest available live target truth first.
If more evidence is needed, escalate through `bthwani-donor-escalation` rather than improvising a local shortcut.

## Final Law

This skill exists to keep the build line clean:

- live code changes in live lanes only
- reusable truth centralized intentionally
- donor evidence used selectively
- naming normalized before implementation