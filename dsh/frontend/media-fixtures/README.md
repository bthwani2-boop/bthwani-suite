# DSH Media Fixtures

Status: ACTIVE

Canonical location for DSH-owned seed media fixtures.

## Structure

```text
dsh/frontend/media-fixtures/
  banners/              — home promo banners
  logos/                — brand logo, store logos
  products/             — product images
  stores/               — store cover images
  categories/
    main/               — main category images
    sub/                — sub-category images
  classifications/
    main/               — main classification images
    sub/                — sub-classification images
```

## Generator

Re-generate seed images:

```powershell
pwsh tools/generate-dsh-fixture-images.ps1
```
