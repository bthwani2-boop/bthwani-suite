# 12 — DSH Backend and Domain Target Structure

## متى نفتح هذا الهيكل؟

ليس الآن. يفتح بعد أول contract-bound runtime slice.

## dsh/domain

`domain` هو القانون.

```text
dsh/domain/
  README.md
  models/
    store.md
    product.md
    cart.md
    order.md
    delivery.md
  state-machines/
    order-state-machine.md
    partner-preparation-state-machine.md
    captain-assignment-state-machine.md
  policies/
    serviceability-policy.md
    catalog-policy.md
    order-policy.md
    dispatch-policy.md
    cancellation-policy.md
  events/
    order-created.event.md
    partner-accepted.event.md
    captain-assigned.event.md
  matrices/
    surface-matrix.md
    screen-api-matrix.md
    actor-permission-matrix.md
    order-state-matrix.md
    cross-surface-impact-matrix.md
  vars/
    dsh-vars-catalog.md
    provider-policy.md
```

## dsh/backend

`backend` هو التنفيذ.

```text
dsh/backend/
  cmd/
    dsh-api/
      main.go
  internal/
    app/
      server.go
      routes.go
      middleware.go
    config/
      config.go
      env.go
    http/
      handlers/
      dto/
      errors/
    service/
      store_service.go
      catalog_service.go
      cart_service.go
      order_service.go
      dispatch_service.go
    repository/
      postgres/
        store_repository.go
        catalog_repository.go
        cart_repository.go
        order_repository.go
    authz/
      actor_context.go
      permissions.go
    observability/
      logger.go
      health.go
  migrations/
  seeds/
  tests/
    contract/
    integration/
    runtime/
  .env.example
```

## media-fixtures

لا تتحول كلها إلى DB.

الصحيح:
- files/images تبقى fixtures.
- DB تحفظ metadata/references فقط.
- production لاحقًا يستخدم object storage.
