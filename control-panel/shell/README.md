# control-panel Shell

Status: MIGRATION_SCAFFOLD

Target root for control-panel shell concerns:

```text
providers
navigation
layout
app-frame
```

This folder must not own service implementation.

Forbidden here:

```text
DSH dashboard internals
WLT finance business logic
KNZ service logic
backend/domain implementation
ui-kit primitives
local design system
```

Current shell and app composition remain in existing paths until a verified migration phase.
