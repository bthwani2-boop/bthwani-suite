# DSH Media Fixtures Archive Boundary

`dsh/frontend/media-fixtures` is no longer a runtime media source of truth.

Live authority:
- Media/file metadata: PostgreSQL `dsh_media_assets`
- Public media URLs: `DSH API` backed by `MinIO/S3`

What remains here:
- archived preview assets under `legacy-preview/`,
- local manifest/docs needed for legacy preview compatibility only.

Rules:
- Do not add new runtime image/file reads from archived fixture keys.
- Active surfaces must prefer `public_url` and runtime media APIs.
- Preview keys are legacy-only and should remain quarantined.
