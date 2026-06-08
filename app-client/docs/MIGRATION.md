# app-client Root Migration Notes

Status: MIGRATION_COMPLETED

Canonical root:

```text
app-client
```

Runtime lives under:

```text
app-client/runtime
```

Target compact structure:

```text
app-client
â”œâ”€â”€ runtime
â”œâ”€â”€ shell
â”œâ”€â”€ composition
â””â”€â”€ docs
```

Compatibility bridge:

The compatibility bridge at `apps/mobile/app-client` has been retired. All references now point to the canonical flat active root.
