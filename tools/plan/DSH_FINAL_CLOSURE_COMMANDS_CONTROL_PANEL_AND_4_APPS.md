# DSH Final Closure Commands — Control Panel + Four Apps

**Target repo:** `C:\bthwani-suite`
**GitHub repo:** `bthwani2-boop/bthwani-suite`
**Mode:** UI / UX / Flow closure only. No backend/API/runtime/binding claim.

---

## Current-Branch Analysis Summary

The current branch `ghb/0126-20260509-210858-dsh-ui-kit` exists and is a large UI/UX branch. GitHub comparison shows it is ahead of `main` by 97 commits and behind by 0. The diff touches the DSH frontend roots, control-panel shell, app-client, app-partner, app-captain, app-field, and DSH docs.

The DSH frontend root currently declares these active implementation roots:

```text
frontend/app-client
frontend/app-partner
frontend/app-captain
frontend/app-field
frontend/control-panel
```

DSH service blueprint defines these actor/surface responsibilities:

- `app-client`: customer discovery, products, cart, checkout, tracking, support, rating.
- `app-partner`: store/partner orders, accept/reject, preparation, readiness, catalog/issues.
- `app-captain`: order offer/accept, pickup, delivery, support/proof.
- `app-field`: store activation, field visit, evidence, escalation.
- `control-panel`: admin/operations monitoring, intervention, support, catalog, reports.

Important correction from the user:

- The heatmap/live map is allowed in **App Captain** and **Control Panel Operations only**.
- It must **not** be added to app-client, app-partner, or app-field.
- Control Panel Operations map focuses on live orders + captain presence/distribution.
- App Captain map must be captain-scoped only, not an admin/fleet heatmap.

---

## Global Execution Rules

- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو `C:\bthwani-suite`.
- Architecture: Screen / Surface / App → `@bthwani/ui-kit` public exports → Tamagui internally inside `ui-kit` only.
- No Tamagui outside `ui-kit`.
- No local design system outside `ui-kit`.
- No `export *`.
- No new `any` / `as any`.
- No backend/API/runtime/binding/integration work.
- No false runtime claims.
- No route semantics changes unless explicitly limited to existing query/filter state.
- No unnecessary new folders.
- No broad file explosion.
- No duplicated content between tabs/sections.
- No large empty workbench space.
- No desktop internal scroll in Control Panel sections.
- No English user-facing terms in Arabic DSH UI.
- No random colors, purple, glass, glow, decorative hero blocks.
- BThwani identity: deepBlue `#0A2F5C`, orange `#FF500D`, white `#FFFFFF`, neutral slate, and semantic state tones only.
- Every execution command must run:

```powershell
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

---

# Command 00 — Branch + Surface Forensic Audit Only

```text
Inspect only. Do not edit files.

Repo: C:\bthwani-suite

Task:
اعمل تحليلًا دقيقًا للفرع الحالي محليًا من منظور منظومة DSH كاملة: لوحة التحكم + تطبيق العميل + تطبيق الشريك + تطبيق الكابتن + التطبيق الميداني.

Important correction:
- الخريطة الحية/الحرارية مسموحة فقط في:
  1) تطبيق الكابتن، لكن بنطاق الكابتن فقط.
  2) عمليات لوحة التحكم، بنطاق تشغيلي إداري.
- لا تضف أو تبحث عن خريطة حرارية في تطبيق العميل/الشريك/الميداني.

Required inspect scope:
- dsh/SERVICE_BLUEPRINT.md
- dsh/frontend/README.md
- dsh/frontend/app-client
- dsh/frontend/app-partner
- dsh/frontend/app-captain
- dsh/frontend/app-field
- dsh/frontend/control-panel
- dsh/frontend/shared
- ui-kit/src/web.ts
- ui-kit/src/web/index.ts
- ui-kit/src/web/command-center.tsx
- ui-kit/src/web/control-surface.tsx
- control-panel/shell

Required report:
1) Git state: current branch, upstream, ahead/behind, git status.
2) Surface inventory for app-client/app-partner/app-captain/app-field/control-panel.
3) Heatmap/live map inventory:
   - exact captain map/heatmap path if present.
   - exact control-panel operations map path if present.
   - any mistaken map intelligence in app-client/app-partner/app-field.
   - any mistaken admin-only data exposed in app-captain.
4) Control-panel issues:
   - internal scroll sources.
   - large whitespace sources.
   - duplicated content.
   - non-functional tabs/subtabs/filters.
   - English visible terms.
   - old visual noise.
   - local CSS/design-system competing with ui-kit.
5) App-specific issues:
   app-client: discovery/store/cart/checkout/order tracking/support/rating.
   app-partner: accept/reject/preparation/ready/item issue/store readiness/catalog.
   app-captain: offers/accept/to-store/arrived/pickup/to-customer/deliver/proof/support/map if present.
   app-field: store activation/field visit/field evidence/escalation.
6) Boundary issues:
   - Tamagui outside ui-kit.
   - export *.
   - any/as any.
   - deep imports between actor apps and control-panel.
   - false runtime claims.
7) Output a phase map: phase | exact files | issue | risk | proposed next command.

Forbidden:
- No edits.
- No file creation.
- No deletion.
- No route changes.
- No backend/API/runtime.
- No binding/integration.
- No PASS/CLOSED claim.
```

---

# Command 01 — Correct DSH Surface Ownership Matrix

```text
Execute DSH surface ownership matrix correction only.

Repo: C:\bthwani-suite

Task:
صحّح توثيق/نموذج ملكية DSH حتى يغطي لوحة التحكم والتطبيقات الأربعة بدقة، مع تثبيت قاعدة الخريطة الصحيحة.

Allowed files:
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md
- dsh/docs/SCREEN_API_MATRIX.md
- dsh/docs/RUNTIME_EVIDENCE_MATRIX.md
- dsh/frontend/control-panel/shared/*.ts
- dsh/frontend/control-panel/shared/*.tsx

Required:
1) Matrix واضح:
   app-client = العميل: اكتشاف / متجر / منتجات / سلة / checkout / طلب / تتبع / دعم / تقييم.
   app-partner = الشريك: قبول أو رفض / تحضير / جاهز للاستلام / مشكلة عنصر / جاهزية متجر / كتالوج.
   app-captain = الكابتن: عروض / قبول / الطريق للمتجر / وصول / استلام / الطريق للعميل / تسليم / إثبات / دعم / خريطة كابتن إن كانت موجودة.
   app-field = الميداني: تفعيل متجر / زيارة / إثبات ميداني / بلاغ / تصعيد.
   control-panel = المشغل: مراقبة / تدخل / توصية / إسناد / خريطة عمليات حية / دعم / مالية / كتالوج / شركاء / تسويق / تحكم.
2) Heatmap rule:
   - control-panel operations: full live dispatch map allowed.
   - app-captain: captain-scoped map allowed only.
   - app-client/app-partner/app-field: no heatmap.
3) Status labels: UI_PREVIEW_ONLY / NEEDS_BINDING_LATER / NEEDS_RUNTIME_EVIDENCE.
4) No API endpoints.
5) No runtime claim.
6) No app code changes.
7) No duplicate platform governance.

Acceptance:
- surface ownership is explicit.
- heatmap placement is explicit.
- no false runtime claim.
- tsc succeeds if TS files changed.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- surface matrix summary
- heatmap placement confirmation
- verification output
```

---

# Command 02 — Cross-Surface Preview Contract, No Runtime Binding

```text
Execute cross-surface preview contract only.

Repo: C:\bthwani-suite

Task:
أضف model typed موحد داخل control-panel/shared يربط لوحة التحكم بالتطبيقات الأربعة كـ UI_PREVIEW_ONLY، بدون deep imports وبدون runtime binding.

Allowed files:
- dsh/frontend/control-panel/shared/*.ts
- dsh/frontend/control-panel/shared/*.tsx
- dsh/frontend/control-panel/operations/*.ts
- dsh/frontend/control-panel/operations/*.tsx
- ui-kit/src/web/control-surface.tsx

Required:
1) Define:
   - DshSurfaceId = app-client | app-partner | app-captain | app-field | control-panel
   - DshActor = client | partner | captain | field | operator
   - DshLifecycleStep
   - DshCrossSurfaceSignal
   - DshCounterpartLink
   - DshRuntimeBindingStatus = UI_PREVIEW_ONLY | NEEDS_BINDING_LATER | BLOCKED
2) Every signal includes:
   - id
   - sourceSurface
   - affectedSurface
   - actor
   - lifecycleStep
   - entityId
   - entityLabel
   - status
   - risk
   - owner
   - evidence
   - nextAction
   - expectedImpact
   - primaryActionLabel
   - secondaryActionLabel
   - counterpartRouteHint
   - runtimeBindingStatus
3) Do not put DSH domain data inside ui-kit.
4) Do not deep import from app-client/app-partner/app-captain/app-field.
5) No API.
6) No runtime claim.
7) Make model usable by operations/support/finance/partners/catalogs/dashboard.
8) No any.

Acceptance:
- unified cross-surface preview model exists.
- no deep imports.
- no false runtime claim.
- every control-panel row/recommendation can display source/affected surface.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- model fields
- surfaces covered
- verification output
```

---

# Command 03 — ui-kit Control Panel Primitives, Generic Only

```text
Execute ui-kit control-panel primitive hardening only.

Repo: C:\bthwani-suite

Task:
أغلق primitives العامة اللازمة للوحة التحكم داخل @bthwani/ui-kit بدون DSH data وبدون تضخيم.

Allowed files:
- ui-kit/src/web/control-surface.tsx
- ui-kit/src/web/command-center.tsx
- ui-kit/src/web/index.ts
- ui-kit/src/web.ts

Required:
1) Add or improve generic primitives only:
   - WebControlPanelViewport
   - WebControlPanelWorkbench
   - WebControlPanelDenseHeader
   - WebControlPanelSplitPane
   - WebControlPanelMapCanvas
   - WebControlPanelMiniMapZone
   - WebControlPanelMapPin
   - WebControlPanelRouteLine
   - WebControlPanelLaneTabs
   - WebControlPanelTertiaryFilters
   - WebControlPanelQueue
   - WebControlPanelCompactPager
   - WebControlPanelInspectorShell
2) No DSH data in ui-kit.
3) No export *.
4) No any.
5) No Tamagui outside ui-kit.
6) Primitives must support RTL, no internal x/y scroll, min-width:0, fixed viewport workbench desktop, compact pager instead of scroll.
7) Do not break existing exports.

Acceptance:
- ui-kit owns generic control-panel grammar.
- DSH owns domain data.
- no scroll in primitives.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- exports added/kept
- no-scroll contract
- verification output
```

---

# Command 04 — Control Panel Shell + Viewport Closure

```text
Execute control-panel shell viewport closure only.

Repo: C:\bthwani-suite

Task:
اجعل لوحة التحكم desktop viewport-bound بلا scroll داخلي أفقي أو رأسي داخل الأقسام.

Allowed files:
- control-panel/shell/ControlPanelSurfaceHost.tsx
- control-panel/shell/control-panel-shell.module.css
- ui-kit/src/web/command-center.tsx
- ui-kit/src/web/control-surface.tsx
- dsh/frontend/control-panel/**/*.css
- dsh/frontend/control-panel/**/*.tsx

Required:
1) desktop:
   - stage fills available space.
   - no internal horizontal scroll.
   - no internal vertical scroll inside section body.
2) Replace scroll with max 5 rows per queue, compact pager, inspector/detail panel, tabs/chips, split pane.
3) Remove overflow-x:auto/scroll, overflow-y:auto/scroll, minHeight 400px, hero/landing blocks, oversized wrappers.
4) Do not change routes or section ids.
5) Mobile may keep natural scroll only if already necessary; desktop control panel must be viewport-bound.
6) RTL: rail right, content left of rail, no stage compression, no horizontal overflow.

Acceptance:
- no internal scroll desktop.
- no giant whitespace.
- no stage compression.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- removed scroll sources
- removed whitespace causes
- verification output
```

---

# Command 05 — Control Panel Operations Live Dispatch Map

```text
Execute control-panel operations live dispatch map only.

Repo: C:\bthwani-suite

Task:
حوّل geo-heatmap في لوحة التحكم إلى Live Dispatch Map Canvas مخصص للطلبات وتواجد الكباتن وضغط المناطق. لا تعدّل تطبيق الكابتن في هذا الأمر.

Allowed files:
- dsh/frontend/control-panel/operations/GeoHeatmapScreen.tsx
- dsh/frontend/control-panel/operations/geo-heatmap.preview-data.ts
- dsh/frontend/control-panel/operations/operations.registry.ts
- dsh/frontend/control-panel/operations/operations.types.ts
- dsh/frontend/control-panel/operations/operations.preview-data.ts
- dsh/frontend/control-panel/operations/dsh-surface.module.css
- dsh/frontend/control-panel/shared/*.ts
- dsh/frontend/control-panel/shared/*.tsx
- ui-kit/src/web/control-surface.tsx
- ui-kit/src/web/command-center.tsx

Required:
1) Do not edit app-client/app-partner/app-captain/app-field.
2) Map canvas must show order pins, captain pins, store pins only for pickup pressure, route line store → captain → customer, zone load, supply-demand gap, captain availability/presence, delayed pickup risk, commitment risk.
3) Use no map SDK and no dependency.
4) Use ui-kit map primitives only.
5) No inline styles.
6) No scroll.
7) Click behavior: zone/order/captain/store click updates inspector.
8) Sub-tabs: الطلبات / الكباتن / المتاجر / الالتزام / الذروة.
9) Tertiary filters: الآن / ١٥ دقيقة / ٣٠ دقيقة / خطر عالٍ / نقص كباتن / ضغط متاجر.
10) Every sub-tab/filter must change visible pins/zones.
11) Arabic only visible UI.
12) Replace visible SLA with الالتزام / زمن الالتزام / مخاطر الالتزام.
13) Inspector shows selected entity, type, status, risk, next action, evidence, expected impact, runtimeBindingStatus.

Acceptance:
- control-panel operations map exists and is functional.
- map is focused on orders and captain presence.
- no actor app edited.
- no decorative layer.
- filters functional.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- confirmation no actor app map edits
- map layers implemented
- filter behavior summary
- verification output
```

---

# Command 06 — App Captain Map + Delivery Flow Closure

```text
Execute app-captain map and delivery flow closure only.

Repo: C:\bthwani-suite

Task:
أغلق تطبيق الكابتن كتجربة كابتن فقط، مع خريطة/حرارة كابتن محدودة إن كانت موجودة أو مطلوبة. ممنوع تحويله إلى لوحة تحكم إدارية.

Allowed files:
- dsh/frontend/app-captain/**/*.tsx
- dsh/frontend/app-captain/**/*.ts
- dsh/frontend/shared/*.ts
- dsh/frontend/shared/*.tsx

Required:
1) First inspect whether captain map/heatmap already exists.
2) If it exists, improve it without changing ownership.
3) If it does not exist but the app flow requires map, add only captain-scoped route/map view; do not add fleet/admin heatmap.
4) App-captain map may show current captain position/status, assigned order pickup/dropoff, route to store, route to customer, nearby eligible offers/demand hints if already part of product flow, proof context.
5) App-captain map must not show all captains, admin zone load, full fleet distribution, operator recommendations, or store pressure analytics beyond captain task context.
6) Close flows:
   - offers list
   - accept/reject offer
   - order details
   - route to store
   - arrived at store
   - pickup confirmation
   - route to customer
   - delivery confirmation
   - proof upload
   - chat/support
   - COD balance if already present
7) Each screen has one clear primary action, limited secondary action, empty/loading/error states, RTL, no duplicated content.
8) No backend/API/runtime.
9) No deep imports from control-panel.
10) No Tamagui outside ui-kit.

Acceptance:
- captain app is closed as captain journey.
- captain map is scoped to captain only.
- no admin heatmap in app-captain.
- no control-panel deep imports.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- whether captain map existed or was added
- captain map scope confirmation
- captain flows covered
- verification output
```

---

# Command 07 — App Client Flow Closure, No Heatmap

```text
Execute app-client DSH UI/UX/Flow closure only.

Repo: C:\bthwani-suite

Task:
أغلق تطبيق العميل كرحلة عميل فقط. ممنوع إضافة خريطة حرارية إدارية. المسموح فقط tracking view للطلب.

Allowed files:
- dsh/frontend/app-client/**/*.tsx
- dsh/frontend/app-client/**/*.ts
- dsh/frontend/shared/*.ts
- dsh/frontend/shared/*.tsx

Required:
1) Do not add heatmap.
2) Cover discovery, store details, products/catalog, cart, checkout, order creation, order tracking, order support, rating.
3) Tracking view must show order status, partner preparing/ready, captain assigned, captain en route, picked up, en route to customer, delivered, customer ETA, support action.
4) No admin controls.
5) No all-captains presence.
6) No zone pressure.
7) Each screen: one clear primary action, limited secondary action, empty/loading/error states, RTL, no duplicate content.
8) No backend/API/runtime.
9) No deep imports from control-panel.
10) No Tamagui outside ui-kit.

Acceptance:
- app-client closed as customer journey.
- no heatmap.
- no admin controls.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- client flows covered
- no-heatmap confirmation
- verification output
```

---

# Command 08 — App Partner Flow Closure, No Heatmap

```text
Execute app-partner DSH UI/UX/Flow closure only.

Repo: C:\bthwani-suite

Task:
أغلق تطبيق الشريك كرحلة متجر/شريك فقط. ممنوع إضافة خريطة حرارية.

Allowed files:
- dsh/frontend/app-partner/**/*.tsx
- dsh/frontend/app-partner/**/*.ts
- dsh/frontend/shared/*.ts
- dsh/frontend/shared/*.tsx

Required:
1) Do not add heatmap.
2) Cover orders queue, accept/reject order, preparation, ready for pickup, handoff to captain, item issue/missing item, store readiness, catalog/inventory, partner support.
3) Partner view may show own store queue, prep timers, handoff delay, pickup readiness, issue action.
4) Partner view must not show all captains, admin zone pressure, fleet heatmap, operator-only controls.
5) Each screen: one clear primary action, limited secondary action, empty/loading/error states, RTL, no duplicate content.
6) No backend/API/runtime.
7) No deep imports from control-panel.
8) No Tamagui outside ui-kit.

Acceptance:
- app-partner closed as partner/store journey.
- no heatmap.
- no admin controls.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- partner flows covered
- no-heatmap confirmation
- verification output
```

---

# Command 09 — App Field Flow Closure, No Heatmap

```text
Execute app-field DSH UI/UX/Flow closure only.

Repo: C:\bthwani-suite

Task:
أغلق التطبيق الميداني كرحلة ميدانية فقط. ممنوع إضافة خريطة حرارية إدارية.

Allowed files:
- dsh/frontend/app-field/**/*.tsx
- dsh/frontend/app-field/**/*.ts
- dsh/frontend/shared/*.ts
- dsh/frontend/shared/*.tsx

Required:
1) Do not add heatmap.
2) Cover store activation, field visit, store evidence, issue report, escalation, field profile/status, field finance preview only if already present.
3) Field view may show assigned visit, store location/context, evidence capture, checklist, escalation action.
4) Field view must not show full fleet map, all captains, admin dispatch controls, full zone heatmap.
5) Each screen: one clear primary action, limited secondary action, empty/loading/error states, RTL, no duplicate content.
6) No backend/API/runtime.
7) No deep imports from control-panel.
8) No Tamagui outside ui-kit.

Acceptance:
- app-field closed as field journey.
- no heatmap.
- no admin controls.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- field flows covered
- no-heatmap confirmation
- verification output
```

---

# Command 10 — Control Panel DSH Operations Flow Closure

```text
Execute control-panel DSH operations flow closure only.

Repo: C:\bthwani-suite

Task:
أغلق فجوات منطق عمليات DSH داخل لوحة التحكم باستخدام preview typed data فقط.

Allowed files:
- dsh/frontend/control-panel/operations/*.tsx
- dsh/frontend/control-panel/operations/*.ts
- dsh/frontend/control-panel/operations/dsh-surface.module.css
- dsh/frontend/control-panel/shared/*.tsx
- dsh/frontend/control-panel/shared/*.ts
- ui-kit/src/web/control-surface.tsx

Required:
1) Order lifecycle: طلب جديد، مقبول، الشريك يجهّز، جاهز للاستلام، غير مسند، كابتن مسند، الكابتن في الطريق للمتجر، وصل للمتجر، تم الاستلام، في الطريق للعميل، تم التسليم، إثبات معلق، نزاع، استرداد/تسوية، تدقيق.
2) Dispatch decision: أفضل كابتن، بدائل كباتن، سبب الرفض، ETA للمتجر، ETA للعميل، المسافة، العبء الحالي، الاعتمادية، خطر الدفع عند الاستلام، ضغط المنطقة.
3) Store readiness: وقت التحضير، طول الصف، تأخير التسليم للكابتن، خطر نقص عنصر.
4) Captain state: متاح، خامل، مشغول، خارج الخدمة، قريب من المتجر، قريب من العميل.
5) Each row: entity id, source surface, affected surface, status, risk, next action, reason/evidence, owner, one primary action, max one secondary action.
6) No backend/API.
7) No route changes.
8) No duplicate content between tabs.

Acceptance:
- every operations tab shows a real flow/queue.
- no decorative tab.
- no duplicate rows without filtering.
- no huge placeholder.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- flow states added
- tabs made functional
- duplicated content removed
- verification output
```

---

# Command 11 — Control Panel Tabs and Filters Functional Closure

```text
Execute control-panel tabs/subtabs/filters functional closure only.

Repo: C:\bthwani-suite

Task:
أغلق كل التبويبات الرئيسية والفرعية والفرعية جدًا داخل DSH Control Panel بحيث لا يبقى أي tab شكلي أو مكرر.

Allowed files:
- dsh/frontend/control-panel/dashboard/*.tsx
- dsh/frontend/control-panel/operations/*.tsx
- dsh/frontend/control-panel/finance/*.tsx
- dsh/frontend/control-panel/support/*.tsx
- dsh/frontend/control-panel/catalogs/*.tsx
- dsh/frontend/control-panel/partners/*.tsx
- dsh/frontend/control-panel/marketing/*.tsx
- dsh/frontend/control-panel/control/*.tsx
- dsh/frontend/control-panel/shared/*.tsx
- ui-kit/src/web/control-surface.tsx
- ui-kit/src/web/command-center.tsx

Required:
1) Inspect sections: Dashboard, Operations, Operations live map, Finance, Support, Catalogs, Partners, Marketing, Control.
2) Every primary tab changes content or view.
3) Every secondary tab changes filter, visible rows, or inspector context.
4) Every tertiary filter changes results.
5) Forbidden: decorative tab, same content without filtering, placeholder "قريباً", visible English, hero/landing block.
6) If no backend data, use preview typed compact rows.
7) max 5 visible rows per queue.
8) Use compact pager or chips instead of scroll.
9) No route semantics changes.
10) No new route pages.

Acceptance:
- all tabs/subtabs/filters functional.
- no duplicate content.
- no huge placeholder.
- no internal scroll.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- coverage table: section | primary tabs | secondary tabs | tertiary filters | functional yes/no
- changed files
- duplicate content removed
- verification output
```

---

# Command 12 — Support Command Queue Closure

```text
Execute support command queue closure only.

Repo: C:\bthwani-suite

Task:
أغلق قسم الدعم بالكامل كـ Support Command Queue عملي واحذف بقايا التصميم السابق.

Allowed files:
- dsh/frontend/control-panel/support/closure-workspaces.tsx
- dsh/frontend/control-panel/support/*.tsx
- dsh/frontend/control-panel/shared/*.tsx
- dsh/frontend/control-panel/operations/dsh-surface.module.css
- ui-kit/src/web/control-surface.tsx

Required:
1) Remove hero, landing/gradient block, inline styles, minHeight 400px, old visual pattern, visible English.
2) Support tabs: دعم العميل، دعم الشريك، دعم الكابتن، دعم الميدان، النزاعات، الملاحظات، التصعيد، مخاطر الالتزام.
3) Each row: ticket/entity id, surface label Arabic, severity, زمن الالتزام, owner, blocker, evidence, next action, recommendation, one primary action, max one secondary action.
4) No scroll.
5) max 5 rows + compact pager.
6) inspector changes by selected row.
7) No backend/API/runtime.

Acceptance:
- support is not landing page.
- no giant whitespace.
- no duplicate content.
- tabs functional.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- removed old support patterns
- queue coverage
- verification output
```

---

# Command 13 — Finance Command Room Closure

```text
Execute finance command room closure only.

Repo: C:\bthwani-suite

Task:
أغلق قسم المالية كغرفة قيادة مالية عملية ضمن حدود WLT preview فقط.

Allowed files:
- dsh/frontend/control-panel/finance/*.tsx
- dsh/frontend/control-panel/finance/*.ts
- dsh/frontend/control-panel/finance/*.css
- dsh/frontend/control-panel/shared/*.tsx
- ui-kit/src/web/control-surface.tsx

Required:
1) Remove inline styles, emoji icons, premiumGlass/glass/glow, as any, unjustified reliance on operations CSS.
2) Cover: النظرة العامة، التسويات، تحصيل الدفع عند الاستلام، الاستردادات، مدفوعات الشركاء، مدفوعات الكباتن، السجل المالي، المخاطر والتدقيق.
3) Every row: transaction/settlement id, amount, owner, status, risk, evidence, next action, action cluster.
4) No scroll.
5) max 5 rows + compact pager.
6) inspector/detail panel uses space.
7) tabs/subtabs/filters functional.
8) No backend/API/runtime.
9) No financial truth outside WLT preview.

Acceptance:
- finance is command room.
- no whitespace.
- no visible English.
- no any.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- finance flows covered
- weak patterns removed
- verification output
```

---

# Command 14 — Marketing Workspace Closure

```text
Execute marketing workspace closure only.

Repo: C:\bthwani-suite

Task:
أغلق قسم التسويق كـ Marketing Operations Workspace وأصلح زر الإجراء الجماعي الضخم.

Allowed files:
- dsh/frontend/control-panel/marketing/*.tsx
- dsh/frontend/control-panel/marketing/*.ts
- dsh/frontend/control-panel/marketing/*.css
- dsh/frontend/control-panel/shared/*.tsx
- ui-kit/src/web/control-surface.tsx
- ui-kit/src/web/command-center.tsx

Required:
1) Find the oversized bulk action button.
2) Convert it to compact toolbar/action cluster: one primary action, small secondary actions, optional overflow in same toolbar.
3) No large action banner.
4) No duplicate CTA inside rows.
5) Cover: الحملات، الوسائط، الاعتمادات، النمو، التنبيهات، الجودة.
6) Every row: campaign/media id, status, risk, owner, evidence, next action, recommendation.
7) No scroll.
8) max 5 rows + compact pager.
9) tabs/filters functional.
10) No backend/API/runtime.

Acceptance:
- no huge button.
- no whitespace.
- no duplicate CTAs.
- no visible English.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- bulk action fixed
- duplicated actions removed
- verification output
```

---

# Command 15 — Dashboard / Catalogs / Partners / Control Closure

```text
Execute remaining control-panel sections closure only.

Repo: C:\bthwani-suite

Task:
أغلق Dashboard / Catalogs / Partners / Control كـ workbenches عملية لا صفحات عرض.

Allowed files:
- dsh/frontend/control-panel/dashboard/*.tsx
- dsh/frontend/control-panel/catalogs/*.tsx
- dsh/frontend/control-panel/partners/*.tsx
- dsh/frontend/control-panel/control/*.tsx
- dsh/frontend/control-panel/shared/*.tsx
- ui-kit/src/web/control-surface.tsx
- ui-kit/src/web/command-center.tsx

Required:
1) Dashboard: command overview, قرارات اليوم, أخطر 5 signals, at least one leadership recommendation.
2) Catalogs: quality/adoption queue, category readiness, approval risks, duplicate/missing data detection.
3) Partners: approvals, readiness, store pressure, commitment risk.
4) Control: governance/admin/HR/platform workspace, no duplicated support/operations content.
5) Every section: compact header, KPI/signal strip, queue/workbench, inspector/detail, recommendation, no scroll, max 5 rows + compact pager.
6) No hero.
7) No placeholders.
8) No visible English.
9) No route changes.
10) No backend/API/runtime.

Acceptance:
- every section is a practical workbench.
- no whitespace.
- no duplicate content.
- no decorative tabs.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files grouped by section
- section coverage table
- duplicate content removed
- verification output
```

---

# Command 16 — Arabic / RTL / Visual Noise Closure

```text
Execute Arabic/RTL/noise closure only.

Repo: C:\bthwani-suite

Task:
أغلق اللغة العربية وRTL والضجيج البصري في DSH Control Panel والتطبيقات الأربعة.

Allowed files:
- ui-kit/src/web.ts
- ui-kit/src/web/index.ts
- ui-kit/src/web/command-center.tsx
- ui-kit/src/web/control-surface.tsx
- control-panel/shell
- dsh/frontend/app-client/**/*.tsx
- dsh/frontend/app-partner/**/*.tsx
- dsh/frontend/app-captain/**/*.tsx
- dsh/frontend/app-field/**/*.tsx
- dsh/frontend/control-panel/**/*.tsx
- dsh/frontend/**/*.ts
- dsh/frontend/**/*.css

Required:
1) Arabic visible UI: remove/translate Geo, Hub, Core, Live, Manual, Crew, Stores, Capacity, Risk, Proof, Open operations, delayed pickups, pressure, owner surface, Support queue, Dashboard/Finance/Marketing/Catalogs/Partners when user-facing.
2) Replace visible SLA with الالتزام / زمن الالتزام / مخاطر الالتزام.
3) Remove emoji icons from control panel.
4) Remove premiumGlass, glass, glow, purple, #8b5cf6.
5) RTL contract: rail right, text right, icon+label same cluster, action opposite, no centered Arabic inside rows except KPI, no horizontal overflow.
6) No business logic changes.
7) No route changes.
8) No backend/API/runtime.

Acceptance:
- no visible English in Arabic DSH UI.
- no visual noise.
- RTL correct.
- no drift from BThwani identity.
- tsc succeeds.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- terms replaced
- visual noise removed
- verification output
```

---

# Command 17 — Anti-Bloat / Duplication / Boundary Gate

```text
Inspect and fix only duplication/bloat/boundary regressions.

Repo: C:\bthwani-suite

Scope:
- ui-kit/src/web.ts
- ui-kit/src/web/index.ts
- ui-kit/src/web/command-center.tsx
- ui-kit/src/web/control-surface.tsx
- control-panel/shell
- dsh/frontend/app-client
- dsh/frontend/app-partner
- dsh/frontend/app-captain
- dsh/frontend/app-field
- dsh/frontend/control-panel
- dsh/frontend/shared

Required checks:
1) No local design system outside ui-kit.
2) No duplicate components that should use ui-kit.
3) No duplicate recommendation model.
4) No duplicate action queue pattern.
5) No duplicate tabs pattern.
6) No copied CSS between sections without reason.
7) ui-kit is not domain-specific.
8) DSH data is not in ui-kit.
9) No unnecessary file explosion.
10) No unused imports.
11) No dead code.
12) No new as any.
13) No deep imports between actor apps and control-panel.
14) No false runtime claim.
15) Heatmap placement:
    - allowed in app-captain only as captain-scoped.
    - allowed in control-panel operations only as admin operations map.
    - forbidden in app-client/app-partner/app-field.
16) No duplicated content between tabs.

Allowed fix:
- small fixes only.
- remove unused code/classes only if proven.
- no redesign.
- no route changes.
- no backend/API/runtime.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- PASS/BLOCKED for each check
- changed files
- removed duplication
- heatmap placement result
- verification output
```

---

# Command 18 — Final Numeric Evidence Gate + ZIP

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"
$RunId = "DSH_FINAL_UI_UX_FLOW_GATE-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Out = Join-Path "tools\registry\runs" $RunId
New-Item -ItemType Directory -Force -Path $Out | Out-Null

git --no-pager status --short | Tee-Object -FilePath (Join-Path $Out "01_git_status_short.txt")
git --no-pager diff --stat | Tee-Object -FilePath (Join-Path $Out "02_git_diff_stat.txt")
git --no-pager diff --name-status | Tee-Object -FilePath (Join-Path $Out "03_git_name_status.txt")
git --no-pager diff --check | Tee-Object -FilePath (Join-Path $Out "04_git_diff_check.txt")
pnpm -w exec tsc --noEmit *> (Join-Path $Out "05_tsc_noemit.txt")

$Roots = @(
  "ui-kit\src\web",
  "control-panel\shell",
  "dsh\frontend\app-client",
  "dsh\frontend\app-partner",
  "dsh\frontend\app-captain",
  "dsh\frontend\app-field",
  "dsh\frontend\control-panel",
  "dsh\frontend\shared"
)

$Files = Get-ChildItem -Path $Roots -Recurse -Include *.ts,*.tsx,*.css -File -ErrorAction SilentlyContinue

$Patterns = @{
  "scroll_x_forbidden_control_panel" = "overflow-x\s*:\s*auto|overflow-x\s*:\s*scroll"
  "scroll_y_forbidden_control_panel" = "overflow-y\s*:\s*auto|overflow-y\s*:\s*scroll"
  "large_empty_space_sources" = "minHeight:\s*['\""]?400px|min-height:\s*400px|hero|Hero|قريباً"
  "english_ui_terms" = "Open operations|Loading operations preview|Nothing to show yet|delayed pickups|pressure|owner surface|Support queue|Dashboard|Finance|Marketing|Catalogs|Partners|Geo|Hub|Core|Live|Manual|Crew|Stores|Capacity|Risk|Proof"
  "old_visual_noise" = "premiumGlass|glass|glow|purple|#8b5cf6|🎧|💰|⚙️"
  "any_usage" = "\bas\s+any\b|:\s*any\b"
  "export_star" = "export\s+\*"
  "tamagui_outside_uikit" = "from ['\""]tamagui['\""]|from ['\""]@tamagui"
  "false_runtime_claims" = "runtime truth|production-like truth|CONNECTED_RUNTIME|LIVE_BINDING"
  "deep_imports_between_surfaces" = "from ['\""][.]{2,}\/app-client|from ['\""][.]{2,}\/app-partner|from ['\""][.]{2,}\/app-captain|from ['\""][.]{2,}\/app-field|from ['\""][.]{2,}\/control-panel"
  "preview_status_required" = "UI_PREVIEW_ONLY|NEEDS_BINDING_LATER|PREVIEW_ONLY"
}

$Audit = foreach ($key in $Patterns.Keys) {
  $regex = $Patterns[$key]
  $matches = $Files | Select-String -Pattern $regex -ErrorAction SilentlyContinue
  $isPositiveRequired = $key -eq "preview_status_required"
  [pscustomobject]@{
    check = $key
    count = @($matches).Count
    status = if ($isPositiveRequired) {
      if (@($matches).Count -gt 0) { "PASS" } else { "FIX_REQUIRED" }
    } else {
      if (@($matches).Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
    }
    sample = (@($matches) | Select-Object -First 20 | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
  }
}

$Audit | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $Out "06_static_audit.json")
$Audit | Format-Table -AutoSize | Tee-Object -FilePath (Join-Path $Out "06_static_audit_table.txt")

$HeatmapRegex = "heatmap|Heatmap|خريطة حرارية|خريطة حية|MapCanvas|MiniMapZone|RouteLine"
$HeatmapLocations = $Files | Select-String -Pattern $HeatmapRegex -ErrorAction SilentlyContinue

$ForbiddenHeatmapMatches = $HeatmapLocations | Where-Object {
  $_.Path -match "\\dsh\\frontend\\app-client\\" -or
  $_.Path -match "\\dsh\\frontend\\app-partner\\" -or
  $_.Path -match "\\dsh\\frontend\\app-field\\"
}

$CaptainHeatmapMatches = $HeatmapLocations | Where-Object { $_.Path -match "\\dsh\\frontend\\app-captain\\" }
$ControlPanelOperationsHeatmapMatches = $HeatmapLocations | Where-Object { $_.Path -match "\\dsh\\frontend\\control-panel\\operations\\" }

$HeatmapAudit = @(
  [pscustomobject]@{
    check = "forbidden_heatmap_in_client_partner_field"
    count = @($ForbiddenHeatmapMatches).Count
    status = if (@($ForbiddenHeatmapMatches).Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
    sample = (@($ForbiddenHeatmapMatches) | Select-Object -First 20 | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
  },
  [pscustomobject]@{
    check = "captain_scoped_map_presence"
    count = @($CaptainHeatmapMatches).Count
    status = if (@($CaptainHeatmapMatches).Count -gt 0) { "NEEDS_VISUAL_REVIEW" } else { "NEEDS_VISUAL_REVIEW_OR_NOT_APPLICABLE" }
    sample = (@($CaptainHeatmapMatches) | Select-Object -First 20 | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
  },
  [pscustomobject]@{
    check = "control_panel_operations_live_map_presence"
    count = @($ControlPanelOperationsHeatmapMatches).Count
    status = if (@($ControlPanelOperationsHeatmapMatches).Count -gt 0) { "PASS" } else { "FIX_REQUIRED" }
    sample = (@($ControlPanelOperationsHeatmapMatches) | Select-Object -First 20 | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
  }
)

$HeatmapAudit | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $Out "07_heatmap_placement_audit.json")
$HeatmapAudit | Format-Table -AutoSize | Tee-Object -FilePath (Join-Path $Out "07_heatmap_placement_audit_table.txt")

$RequiredScreens = @(
  "app-client-discovery",
  "app-client-checkout",
  "app-client-tracking",
  "app-client-support-rating",
  "app-partner-orders",
  "app-partner-preparation",
  "app-partner-readiness",
  "app-captain-offers",
  "app-captain-route-map",
  "app-captain-pickup-delivery-proof",
  "app-field-onboarding",
  "app-field-visit-evidence",
  "control-panel-dashboard",
  "control-panel-operations-command-center",
  "control-panel-operations-live-orders",
  "control-panel-operations-dispatch",
  "control-panel-operations-live-map",
  "control-panel-finance",
  "control-panel-support",
  "control-panel-catalogs",
  "control-panel-partners",
  "control-panel-marketing",
  "control-panel-control"
)

$VisualMatrix = foreach ($s in $RequiredScreens) {
  [pscustomobject]@{
    screen = $s
    screenshot_required = "YES"
    rtl_required = "YES"
    functional_tabs_required = "YES"
    no_duplicate_content_required = "YES"
    no_visible_english_required = "YES"
    no_wrong_heatmap_scope_required = "YES"
  }
}

$VisualMatrix | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $Out "08_visual_matrix.json")
$VisualMatrix | Format-Table -AutoSize | Tee-Object -FilePath (Join-Path $Out "08_visual_matrix.txt")

git --no-pager diff -- . > (Join-Path $Out "LOCAL_CHANGE_REVIEW.patch")
git ls-files --others --exclude-standard > (Join-Path $Out "UNTRACKED_FILES.txt")

Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$RunId.zip") -Force

Write-Host ""
Write-Host "AUDIT_FOLDER=$Out"
Write-Host "AUDIT_ZIP=$(Join-Path $Out "$RunId.zip")"
```

---

## Final Acceptance Matrix

Do not mark closed unless all are proven:

| Gate | Required |
|---|---:|
| `git diff --check` | 0 errors |
| `pnpm -w exec tsc --noEmit` | 0 errors |
| Tamagui outside ui-kit | 0 |
| export star | 0 |
| new `any/as any` | 0 |
| false runtime claim | 0 |
| deep imports between actor apps/control-panel | 0 |
| visible English user-facing DSH UI | 0 |
| old visual noise | 0 |
| large whitespace sources | 0 |
| desktop control-panel internal horizontal scroll | 0 |
| desktop control-panel internal vertical scroll | 0 |
| heatmap in app-client | 0 |
| heatmap in app-partner | 0 |
| heatmap in app-field | 0 |
| control-panel operations live map | present + visual proof |
| app-captain scoped map | present if product flow requires it + visual proof |
| app-captain admin/fleet heatmap leakage | 0 |
| app-client journey coverage | PASS |
| app-partner journey coverage | PASS |
| app-captain journey coverage | PASS |
| app-field journey coverage | PASS |
| control-panel journey coverage | PASS |
| non-functional tabs | 0 |
| duplicated tab content | 0 |
| screenshot evidence | all required screens |

---

## Required Visual Screenshots

Capture screenshots after execution for:

1. app-client discovery/store
2. app-client checkout
3. app-client tracking
4. app-client support/rating
5. app-partner orders
6. app-partner preparation/ready
7. app-partner item issue/readiness
8. app-captain offers
9. app-captain route/map if present
10. app-captain pickup/delivery/proof
11. app-field onboarding
12. app-field visit/evidence
13. control-panel dashboard
14. control-panel operations command center
15. control-panel operations live orders
16. control-panel operations dispatch
17. control-panel operations live map
18. control-panel finance
19. control-panel support
20. control-panel catalogs
21. control-panel partners
22. control-panel marketing
23. control-panel control

Final decision values only:
- PASS
- PASS_WITH_WARNINGS
- FIX_REQUIRED
- BLOCKED
- NEEDS_VISUAL_EVIDENCE
- NEEDS_EVIDENCE
