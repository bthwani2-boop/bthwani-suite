# WLT Migration Notes

Root service moved from `packages/surfaces/src/service-owned/wlt` to `wlt`.

Current state:
- root service scaffold exists
- frontend slices live under `wlt/frontend`
- old service-owned path is kept as a compatibility bridge
- API contract remains TBD
