# JOURNIES Design Surface Lens and UI-Kit Gate

**Purpose:** bind DSH/WLT journey closure to the central visual identity and reusable design ownership.

## Surface Lens required

Every reusable pattern must be classified as one or more:

- `control-panel-first`
- `website-first`
- `webapp-first`
- `mobile-first`
- `client-first`
- `partner-first`
- `captain-first`
- `field-first`

## Mandatory design checks

- توجب الالتزام بنظام الألوان المركزي.
- Reusable UI must come from `@bthwani/ui-kit` public exports.
- Tamagui is internal to ui-kit only.
- No local design system in screens/apps/surfaces.
- No hardcoded random visual values when a token/variant exists.
- No large eager-loaded images, duplicated assets, heavy effects in repeated lists, or local expensive visual recipes.
- Use on-demand retrieval for media/content: IDs, references, lean summaries, detail-on-open, pagination, caching, deferred loading.

## Pattern tournament before centralization

Do not move the first local pattern into ui-kit. First inventory comparable patterns, score them, select a winner, then migrate 1-3 consumers only.
