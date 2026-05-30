# BTHWANI TARGET ARCHETYPE GUIDE — V6

Use this file to make the target clear before execution.

## 1. Target archetypes

| Target kind | First files to discover | Required matrices | Usual first safe task |
|---|---|---|---|
| Control-panel section | section screen, registry, tabs, route host, shared folder | Gap, File Boundary, Topic, Runtime/API | fix shell ownership or structural hygiene |
| Control-panel tab/topic | topic folder/screen, section registry, drawer/states/adapters | Gap, File Boundary, Topic Boundary | action/state mapping or adapter cleanup |
| App screen | route/screen registry, screen file, navigation host, data source | Gap, File Boundary, Performance | loading/empty/error/action closure |
| Cross-surface journey | all linked app/control-panel touchpoints | Linked Surface, Runtime/API, Gap | classify boundaries and close safest UI flow |
| DSH data/media | central data/media files, adapters, consumers | Data/Media Matrix, File Boundary | centralize one canonical record/reference |
| Governance/guard/agent | relevant guard/script/agent/skill docs | Governance Fitness, Gap | update stale blocker or mark blocked |
| Shared module | import graph, consumers, owner | File Boundary, Structural Hygiene | demote fake shared or tighten exports |

## 2. Target sizing

| Size | Rule |
|---|---|
| Micro | one folder/file, no linked surfaces. Still output 28 sections compactly. |
| Standard | one surface/section with dependencies. Use normal matrices. |
| Deep | cross-surface, data/media, governance impact. Use full matrices. |

## 3. First safe task chooser

Choose Task 1 using this priority:

1. Package/governance/guard blocker that prevents correct execution.
2. Structural hygiene blocker in target.
3. Missing logic/state/action that blocks flow.
4. Data/media duplication that creates false truth.
5. Runtime/API boundary classification if UI is pretending runtime truth.
6. Performance blocker introduced by current UI/data shape.
7. Design closure only after logic/data/flow/technical gates.

## 4. Safe Closure Movement Map — Broad Surface Work

Use this map when the task spans multiple sections, surfaces, or control-panel areas. For single-target cycles, use the archetype table in section 1 instead.

**Transition gate** — do NOT move from phase N to N+1 unless all of the following are true for phase N:

```text
no fixable gaps remain
no unknown owners
no button/tab/flow without result
no duplicated data/media
no unclassified linked surface
no static UI claiming function
no unclassified API/backend dependency
no verification failure
```

**Phases:**

```text
0.  Control Panel Shell / IA / Navigation Contract
    ← Always start here. Shell owns sidebar, route map, section ownership,
      tab-vs-route decision, breadcrumbs, command bar, search/refresh/profile.
      Exit gate: no route sprawl, no section duplicate, no navigation mismatch.

1.  Control Panel Global UI Grammar
    Density, card sizing, hero policy, table toolbar, micro actions, drawers,
    split panes, status strip, empty/loading/error/blocked states, central color system.
    Exit gate: every later section uses the same grammar — no per-section divergence.

2.  DSH Shared Foundations: Data / Media / Adapters
    dsh/frontend/data as central preview data, dsh/frontend/media-fixtures as central media.
    mediaKey, IDs/references, adapters/view models, on-demand retrieval, no scattered demo data.
    Exit gate: same entity has one identity; no local demo copies that contradict the canonical record.

3.  Platform / Vars / Provider Policy
    Vars workspace, provider policy, feature flags, visibility rules, scope/precedence,
    rollout, disable/enable preview, rollback/audit preview. All UI-only now unless API approved.
    Exit gate: every policy has an owner; every configurable behavior is classified UI-preview or API-later.

4.  Catalogs / Product + Category + Media Ownership
    Product identity, SKU/GTIN/barcode, category main/sub, media governance, product approval,
    listing governance, publication/visibility, conflict resolution, partner override boundary.
    Exit gate: no product truth duplicated; no category without owner; no publish action without boundary.

5.  Partners / Partner Lifecycle + Overrides
    Partner approvals, activation, document review, readiness, store status, catalog overrides only,
    price/stock/availability/prep note, relation with field evidence and marketing eligibility.
    Exit gate: partner does not duplicate catalog truth; every override has owner/state/visible effect.

6.  Marketing / Campaigns + Visibility + Media Use
    Campaigns, banners, promotions, partner offers, videos, loyalty, growth/signals, image review,
    product/category/media references, partner eligibility, visibility preview.
    Exit gate: campaign does not own product truth; no duplicate media; every CTA changes state or opens flow.

7.  Operations / Order Lifecycle + Dispatch
    Order lifecycle, live orders, dispatch, handoff, exception management, capacity,
    status transitions, captain/field/client reflections, support escalation triggers.
    Exit gate: every order state has an owner; every transition has an action; every exception has an escalation path.

8.  Finance / WLT Bridge
    DSH finance read-only, settlements, refunds, payouts, COD reconciliation, risk audit,
    WLT ownership boundary. No DSH financial mutation unless explicitly scoped.
    Exit gate: every financial effect is classified — DSH visibility / WLT owner / API-backend later.

9.  Support / Disputes / Escalations
    Support queue, dispute resolution, order context, customer context, partner context,
    refund handoff, SLA, escalation, audit evidence, linked operational/financial signals.
    Exit gate: no ticket without owner; no escalation without target; no refund dispute without WLT boundary.

10. Administration / Governance / Roles
    Roles, permissions, approval chains, governance, audit ownership.
    Who can publish/approve/refund/escalate/override.
    Exit gate: every sensitive action in sections 0-9 has a permission/role/approval owner.

11. Dashboard / Closure Evidence / Executive Overview
    Closure status, blockers, pending approvals, health summary, evidence stream,
    cross-surface readiness. No fake KPIs. No vanity dashboard.
    Exit gate: every KPI has a source; every blocker has an owner; every evidence item links to a surface or journey.

12. app-client / Customer Experience
    Discovery, storefront, category/product display, marketing visibility, offer visibility,
    cart/checkout boundaries, tracking entry, support entry. No local catalog/campaign data.
    Exit gate: everything visible to the client has a closed owner; no local fixture that contradicts canonical record.

13. app-partner / Partner Operating Surface
    Inventory overrides, availability, stock, price/prep note, campaign participation,
    order readiness, partner support, documents/readiness reflection.
    Exit gate: no product truth duplicated; no override without effect; no action without control-panel boundary.

14. app-field / Verification + Evidence
    Field tasks, evidence capture, product/media/category checks, partner readiness checks.
    No publish ownership. Handoff to catalog/partners/support.
    Exit gate: every evidence item goes to a clear owner; no field action claims publish/approval.

15. app-captain / Delivery Execution
    Order assignment, accept/reject, pickup, drop-off, handoff, issue reporting,
    support escalation, operational state sync.
    Exit gate: every captain state is connected to Operations; no route or issue without owner.

16. Cross-Surface Consistency Sweep
    Same product has same identity across client/partner/catalog/marketing.
    Same mediaKey resolves to the same image. Same order status across ops/client/captain/support.
    No duplicated demo data. No local divergent fixtures. No owner contradiction.
    Exit gate: no surface-to-surface contradiction.

17. API Binding Readiness Map
    Classify every UI element: UI-preview only / needs API / needs backend / needs WLT /
    needs Auth / needs notification / needs DB/runtime. Order binding for later.
    Exit gate: no unknown API dependency; no UI claiming backend that does not exist.

18. Visual Evidence Sweep
    Screenshots for every major surface: normal/empty/error/loading/disabled/blocked states,
    direction/language correctness, overflow/clipping, density, hierarchy integrity.
    Exit gate: no NEEDS_VISUAL_EVIDENCE remaining for any modified surface.

19. Cross-Surface Slices
    Execute only after phases 0-18 are closed. Suggested order:
    Store/Product Discovery → Catalog Visibility → Partner Readiness →
    Campaign/Offer Visibility → Cart/Checkout Boundary → Order Lifecycle →
    Dispatch/Handoff → Field Evidence → Support/Dispute →
    Refund/Settlement/WLT → Closure Evidence.
```

## 5. Do not choose Task 1 as

```text
broad redesign
rewrite entire section
create all role files
move everything to shared
open PR
fix all surfaces at once
screenshots only
report only without allowed reason
```
