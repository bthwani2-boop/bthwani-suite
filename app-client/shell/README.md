# app-client Shell

Status: MIGRATION_SCAFFOLD

Target root for app-client shell concerns:

```text
providers
navigation
layout
safe-area
app-frame
```

This folder must not own service implementation.

Forbidden here:

```text
DSH order screens
WLT wallet business logic
KNZ service logic
backend/domain implementation
ui-kit primitives
```

Current shell and app composition remain in existing paths until a verified migration phase.
