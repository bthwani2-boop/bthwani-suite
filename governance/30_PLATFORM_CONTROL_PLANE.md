# Platform Control Plane

**Status:** Canonical Governance Payload
**Owner:** Platform Sovereign Control
**Applies to:** `control-panel/runtime/app/platform/page.tsx`, `dsh/frontend/control-panel/platform/`, future platform runtime/control APIs.
**Phase:** UI/UX flow now; runtime activation later.

## Purpose

`Platform` is the sovereign, sensitive, top-administration control plane for BThwani platform runtime control.

It is not a read-only file view, not a developer debug console, and not a daily operations screen.

It exists to eventually let authorized top administrators control platform-wide behavior without requiring a developer for every change.

## Access level

Platform is restricted to the highest administrative authority.

It must not be available to normal control-panel employees by default.

Access must later be controlled by `Administration`, but Platform itself remains a sovereign control surface.

## What Platform owns

Platform owns high-level sovereign controls:

- Service visibility and enablement.
- Service-level runtime variables and scoped policy values.
- Platform-wide provider setup and activation.
- Provider priority, fallback, testing, rollback, and health.
- Platform-wide appearance and color identity for all apps.
- Runtime flags, rollouts, maintenance mode, and emergency stop.
- Platform health, impact preview, audit, and rollback.

## What Platform does not own

Platform does not own:

- Catalog categories, subcategories, products, store catalog details.
- Marketing campaigns, offers, banners, promotions.
- Daily order operations and case handling.
- Daily finance processing and ledger operations.
- User permission management details.
- Developer-only implementation details.

Ownership map:

```text
Catalog data                → Catalogs
Campaigns/offers/banners    → Marketing
User/role permissions       → Administration
Daily order operations      → Operations
Daily finance operations    → Finance
Sovereign runtime control   → Platform
```

## Human-first UI rule

Platform UI must be understandable by a non-developer top administrator.

Primary labels must be human-readable:

Allowed examples:

```text
مزود الخرائط
مزود الرسائل SMS
تشغيل خدمة دليفري
إخفاء الخدمة عن العملاء
تغيير حد أهلية الكابتن
تغيير لون الهيدر الرئيسي
اختبار الاتصال
تفعيل المزود
تراجع عن آخر تغيير
```

Forbidden as primary UI labels:

```text
provider.awnak.v2
provider.dispatch.router
wlt.refunds.autoApprovalCap
VAR_SVC_DSH_ENABLED
RuntimeVarValueEntity
OpenAPI schema
database entity
endpoint path
```

Technical identifiers may appear only in collapsed advanced details or muted captions when needed for evidence.

## Services control

Service controls must support:

- Live / Paused / Internal only / Pilot / Maintenance.
- Client visibility: visible / hidden.
- Scope: Global / Region / City / Zone / Service.
- Impact preview.
- Owner and reason.
- Audit.
- Rollback.

No service can be made visible to clients without a rollback plan.

## Vars control

Any mutable business/runtime value that changes by service, store, city, zone, category, provider, rollout, or operational mode is governed by `VAR_*` law.

Every var change must include:

- owner
- reason
- before/after
- scope
- impact preview/simulation
- audit
- rollback
- evidence

Financial variables remain WLT-owned even when displayed in Platform.

## Providers control

Provider setup is platform-wide by default.

Provider types include:

- SMS
- Payments
- Maps/Geo
- Push notifications
- Email
- Hosting/server
- Storage
- Analytics
- Search
- AI
- Risk/Fraud

Provider policy must include:

- provider category
- selected provider
- masked credential state
- environment: test/sandbox/production
- priority
- fallback
- test result
- activation state
- rollback target
- owner
- last changed by
- evidence

## Secrets and API keys

API keys and secrets must never be stored in frontend code, committed files, screen constants, env-only scattered logic, or UI preview records.

Platform UI may show masked placeholders only:

```text
••••••••••••
```

Later runtime implementation must use a secure secret/config control plane.

## Appearance control

Appearance is platform identity for all apps and surfaces.

It is not Marketing, Campaigns, Seasonal themes, Offers, or Banners.

Appearance controls:

- app-client
- app-partner
- app-captain
- app-field
- control-panel
- webapp/website
- primary header
- secondary header
- primary buttons
- background/surface
- semantic states

All appearance changes must stay within the central color system and design-system tokens.

No local color system is allowed.

## UI-kit authority

Screen / Surface / App → `@bthwani/ui-kit` public exports → Tamagui internally inside ui-kit only.

Platform must not create a local design system.

Platform must not create new ui-kit files unless human-approved and non-negotiable.

## UI/UX phase restrictions

During UI/UX flow:

- no real API
- no backend
- no database
- no mutation
- no real provider activation
- no real secret entry
- no runtime binding
- all live action buttons disabled
- all apply/activate/save/rollback flows are preview-only

## Runtime phase requirements

Before runtime activation, Platform must have:

- permissions
- approval policy
- audit log
- rollback
- secrets storage
- provider test sandbox
- runtime resolver
- contracts
- health checks
- emergency lockout
- evidence pack

## Forbidden

- Platform as developer/debug page.
- Platform exposing code details as primary UI.
- Platform showing secrets.
- Platform storing provider keys in code.
- Platform mixing with Catalogs.
- Platform mixing with Marketing campaigns.
- Platform mixing with Administration permissions UI.
- Platform changing ui-kit files directly.
- Platform using hardcoded random colors.
- Platform enabling live actions during UI/UX phase.
- Platform using deprecated `dsh/frontend/control-panel/control/`.

## Required guardrails

Platform changes must be checked for:

- no deprecated control path
- no campaign/marketing terms inside Appearance
- no real secrets/API keys
- no enabled live action buttons during UI/UX
- no hardcoded color drift
- no ui-kit file changes
- no developer-only identifiers as primary labels
