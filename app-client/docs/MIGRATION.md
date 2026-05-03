# app-client Root Migration Notes

Status: ACTIVE_MIGRATION_NOTE

Phase 3 created only the app-client root scaffold.

No files were moved.

Current runtime remains under:

```text
apps/mobile/app-client
```

Target compact structure:

```text
app-client
├── runtime
├── shell
├── composition
└── docs
```

Next app-client migration phase must be blocked until evidence proves:

```text
imports safe
runtime command safe
TypeScript safe
service implementation not moved into app root
visual or RTL proof if UI changes
```
