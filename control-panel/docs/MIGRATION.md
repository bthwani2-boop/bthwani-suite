# control-panel Root Migration Notes

Status: ACTIVE_MIGRATION_NOTE

Phase 3 created only the control-panel root scaffold.

No files were moved.

Current runtime remains under:

```text
apps/web/control-panel
```

Target compact structure:

```text
control-panel
├── runtime
├── shell
├── composition
└── docs
```

Next control-panel migration phase must be blocked until evidence proves:

```text
imports safe
Next runtime command safe
TypeScript safe
service implementation not moved into app root
visual or RTL proof if UI changes
```
