# DSH Media Fixtures

Status: ACTIVE

Canonical location for DSH-owned seed media fixtures.

**CRITICAL RULE:**
These images are strictly **local-only** and are **NOT** uploaded to GitHub.
GitHub only tracks:
- This `README.md`
- The `MANIFEST.local-required.tsv` text file
- The centralized resolver in `shared/`
- The preview data objects using the mediaKeys

Do not stage or commit any image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`) inside this directory.

## Structure

Allowed local paths for media fixtures:

```text
dsh/frontend/media-fixtures/
  banners/              — home promo banners
  store_logos/          — brand and store logos
  products/             — product images
  stores/               — store cover images
  categories/
    main/               — main category images
    sub/                — sub-category images
  classifications/      — classification images
```

## Generator

Re-generate seed images:

```powershell
pwsh tools/generate-dsh-fixture-images.ps1
```
