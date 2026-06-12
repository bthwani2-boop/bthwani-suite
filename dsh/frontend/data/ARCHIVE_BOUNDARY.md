# DSH Data Archive Boundary

`dsh/frontend/data` is no longer a runtime source of truth.

Live authority:
- Data: `DSH API -> PostgreSQL`
- Media/file metadata: `dsh_media_assets`
- Binary media/files: `MinIO/S3`

What remains here:
- compatibility shims at the root,
- archived preview/seed content under `legacy-preview/`.

Rules:
- Do not add new runtime reads from `dsh/frontend/data`.
- Do not use archived preview content for real client, checkout, payment, order, or live operator flows.
- New runtime consumers must bind to API clients, not preview exports.
