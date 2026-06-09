# DEV_ONLY_MEDIA_FIXTURES

## Classification

DEV_ONLY_MEDIA_FIXTURES — local seed fixtures only, not runtime truth, not API/binding source.

## Runtime media storage

Runtime images and videos are stored in MinIO/S3-compatible object storage:

- **Bucket:** `bthwani-media-local` (local dev)
- **Endpoint:** `http://minio:9000` (Docker) / `http://127.0.0.1:9000` (host browser)
- **Metadata:** `dsh_media_assets` PostgreSQL table

To upload runtime media:

1. `POST /media/upload-intents` → get presigned PUT URL + `media_id`
2. PUT file bytes to the presigned URL (direct to MinIO)
3. `POST /media/{media_id}/complete` → activate the record

## DEV_ONLY scope

These fixtures may be consumed only by:

- Storybook / preview renderers
- Dev seed scripts
- Demo / fallback UI modes (never in production data flow)
- Test fixtures

Banned consumers (runtime violation):

- `app-client` runtime screens reading fixture images as live product media
- `app-partner` runtime product/store upload flow using fixture keys
- `app-captain` / `app-field` live order/proof flows using fixture keys
- `dsh-api` Docker using fixture static files as runtime storage
- `wlt-api` referencing fixture paths

## Guard

An import guard enforces this boundary. See `tools/guards/media-fixtures-runtime-guard.mjs`.

## RETIRE plan

`RETIRE_DEV_FIXTURES_AFTER_RUNTIME_MEDIA_CLOSURE` — do not delete until all conditions pass:

- MinIO running and healthy — added in this branch
- `dsh_media_assets` migration applied — `030_dsh_media_assets.sql`
- Upload intent/complete smoke verified — mark after PHASE 12
- No runtime import from `media-fixtures` — mark after guard passes
- No runtime import from `dsh/frontend/data` — mark after guard passes
- Canonical media consistency guard passes — mark after PHASE 10

## Critical rules

- Do NOT commit image/video binary files (`.png`, `.jpg`, `.webp`, `.mp4`, `.svg`).
- GitHub tracks only this README and `MANIFEST.local-required.tsv`.
- Regenerate seed images: `pwsh tools/generate-dsh-fixture-images.ps1`

## Structure

```text
dsh/frontend/media-fixtures/
  MANIFEST.local-required.tsv   — mediaKey to relativePath map
  banners/                      — home promo banners (DEV_ONLY)
  store_logos/                  — brand logos (DEV_ONLY)
  products/                     — product images (DEV_ONLY)
  stores/                       — store cover images (DEV_ONLY)
  categories/main/              — main category images (DEV_ONLY)
  categories/sub/               — sub-category images (DEV_ONLY)
  classifications/              — classification images (DEV_ONLY)
```
