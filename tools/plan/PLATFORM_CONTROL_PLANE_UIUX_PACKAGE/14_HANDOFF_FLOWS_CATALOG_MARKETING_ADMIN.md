# 14 - Handoff Flows: Catalogs, Marketing, Administration

## Purpose

This document describes the operational handoff flows between Platform and adjacent sections. These flows are **not implemented** in the current UI/UX phase — they define the intended integration contracts for runtime.

---

## A) Platform → Catalogs

**Trigger:** Platform enables or disables a service, or changes its visibility scope.

**Flow:**
1. Platform administrator changes service state (e.g., `DSH Delivery` → `live / Global`).
2. Platform records: owner, reason, before/after, scope, evidence, rollback target.
3. Catalogs section reads service state as a governance signal.
4. Catalogs can now expose categories and products for that service to clients.
5. If Platform later sets service to `hidden` or `paused`, Catalogs content for that service is suppressed regardless of Catalogs configuration.

**Boundary:**
- Platform decides **whether** the service runs and is visible.
- Catalogs decides **what** appears inside it (categories, products, listings).
- Platform does not name categories or manage products.
- Catalogs does not toggle sovereign service state.

**Handoff Indicator in Platform Overview:**
```
Catalogs controls categories and content for enabled services.
If a service is hidden from Platform, its Catalogs content is not exposed.
```

---

## B) Catalogs → Platform

**Trigger:** Catalogs needs to add a category that depends on a new sovereign service, provider, or runtime variable not yet configured in Platform.

**Flow:**
1. Catalogs identifies that a new category (e.g., "Express Pharmacy") requires a new provider integration or sovereign variable.
2. Catalogs raises a **platform change request** (non-UI mechanism in this phase) to Platform.
3. Platform evaluates and configures the required provider, variable, or service visibility.
4. Platform does not grant Catalogs direct access to provider settings or runtime vars.
5. Once Platform approves and activates, Catalogs proceeds with category setup.

**Boundary:**
- Catalogs requests; Platform decides.
- Catalogs never touches provider API keys.
- Catalogs never modifies sovereign service state.

---

## C) Platform → Marketing

**Trigger:** Platform enables a service or changes its rollout/visibility scope.

**Flow:**
1. Platform activates a service (e.g., `DSH Scheduling` → `pilot / City`).
2. Marketing section reads service availability as a governance constraint.
3. Marketing builds campaigns and offers only on services that are live or available to clients.
4. If Platform restricts a service to `internal-only`, Marketing campaigns referencing that service cannot be exposed.

**Boundary:**
- Platform decides **which services are available and to whom**.
- Marketing decides **how to promote** available services.
- Marketing does not change the central platform identity or color tokens.
- Marketing campaigns do not override Platform kill switches or service availability.

**Handoff Indicator in Platform Overview:**
```
Marketing manages campaigns and offers on top of Platform-enabled services.
Campaign exposure is constrained by Platform service availability.
```

---

## D) Marketing → Platform

**Trigger:** A Marketing campaign requires Platform-level changes (e.g., opening a service to a new city, activating a rollout, creating a kill switch, enabling a new geographic zone).

**Flow:**
1. Marketing identifies that a planned campaign requires service to be available in a new region.
2. Marketing raises a **platform change request** to Platform (non-UI in this phase).
3. Platform evaluates and configures the rollout, geographic scope, or visibility change.
4. Platform records: owner, reason, before/after, scope, evidence, rollback target.
5. Once Platform activates, Marketing proceeds with campaign setup.

**Boundary:**
- Marketing requests; Platform decides and acts.
- Marketing cannot directly trigger a rollout, kill switch, or service scope change.
- Marketing does not write sovereign variables or provider configs.

---

## E) Administration → Platform

**Trigger:** An administrator needs to grant a user access to Platform, or configure who can approve Platform changes.

**Flow:**
1. Administration configures the roles and permissions governing Platform access.
2. Administration defines:
   - Who can **view** Platform (read-only observers).
   - Who can **request** changes in Platform (requestors).
   - Who can **approve** Platform changes (approvers).
   - Who can **activate** approved Platform changes (executors).
3. When a user attempts to access Platform, the system checks Administration-granted roles.
4. If the role is insufficient: the system returns `Access Denied / Requires elevated role`.
5. Administration does not execute Platform variable changes, provider configurations, or service state changes directly — it grants the authority to the right people who then act inside Platform.

**Boundary:**
- Administration is a **gate and authority granter**, not a Platform actor.
- Administration does not bypass Platform governance.
- An Administration user can act inside Platform only if they hold the correct Platform-scoped role.

**Handoff Indicator in Platform Overview:**
```
Administration controls who can access and approve changes in Platform.
Access Denied is enforced when the user lacks the required role.
```

---

## F) Platform → Administration

**Trigger:** Platform needs to read access permissions to determine if a user may view or act on Platform controls.

**Flow:**
1. Platform reads the user's role from Administration-managed permission store.
2. Platform does not write to Administration's user or role data.
3. If the user lacks the required role:
   - Platform displays: `Access Denied — Requires elevated Platform role`.
   - No controls are shown.
4. If the user holds a read-only observer role:
   - Platform is visible but all controls are locked.
5. If the user holds a requestor role:
   - Platform controls are interactive but all changes go to an approval queue.
6. If the user holds an executor role:
   - Platform changes can be activated after approval (in runtime phase).

**Boundary:**
- Platform reads Administration permissions; it does not write them.
- Platform does not manage user accounts, roles, or permissions.
- Role resolution happens at the gate — before any Platform control is rendered.

**Handoff Indicator in Platform Overview:**
```
Administration manages access to this control plane.
Your current access level: [read-only / requestor / approver / executor].
```

---

## Summary Table

| Flow | From | To | What crosses | What does NOT cross |
|---|---|---|---|---|
| A | Platform | Catalogs | Service state signal | Category/product management |
| B | Catalogs | Platform | Change request | Provider keys / sovereign vars |
| C | Platform | Marketing | Service availability signal | Color identity / rollout control |
| D | Marketing | Platform | Change request | Campaign logic / platform activation |
| E | Administration | Platform | Role/permission grants | Platform variable values |
| F | Platform | Administration | Role read | User/role writes |
