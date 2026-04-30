# @bthwani/media-fixtures

Canonical development-only seed media package for BThwani.

## Purpose

This package owns deterministic development media fixtures only.

It is allowed to contain:
- Static PNG/WebP seed images.
- Media catalog metadata.
- Stable media keys.
- Development-only visual assets used for deterministic UI/UX validation.

It must not contain:
- Production merchant uploads.
- Random external image URLs.
- Local machine network URLs.
- Named third-party placeholder image providers.
- Service business logic.
- UI rendering components.

## Rule

Development media is referenced by stable media keys.

Production media must come later from the official upload/storage pipeline.
