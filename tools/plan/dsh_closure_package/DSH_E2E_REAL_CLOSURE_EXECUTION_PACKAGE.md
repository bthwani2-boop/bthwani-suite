# DSH End-to-End Real Closure Execution Package

## الهدف
إغلاق كل المتبقي في DSH بمنهجية جنائية/منطقية/تقنية/تشغيلية، مع منع التبعثر، منع الضجيج، منع تضخيم ملفات الشاشات، وتطبيق المظلة كنظام واحد عبر `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel`, و WLT bridge.

## قرار البداية غير القابل للتجاوز
لا يُسمح بإعلان `CLOSED / PASS / READY / 100%` قبل وجود:
- Git evidence.
- TypeScript/build/guard evidence.
- Visual evidence لكل الأسطح الخمسة.
- Route/state/CTA proof.
- WLT boundary proof.
- No duplicate/dead/noise proof.
- Runtime/API evidence عندما تدخل مرحلة runtime/API.

## أمر الفحص الجنائي الأولي في PowerShell
انسخ هذا أولًا داخل PowerShell:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
$Script = @'
<PASTE RUN_DSH_FORENSIC_SCAN.ps1 CONTENT HERE>
'@
$Path = "tools\registry\runs\RUN_DSH_FORENSIC_SCAN.ps1"
New-Item -ItemType Directory -Force -Path (Split-Path $Path) | Out-Null
$Script | Out-File -FilePath $Path -Encoding UTF8
pwsh -NoProfile -ExecutionPolicy Bypass -File $Path
```

يفضل استخدام الملف الجاهز `RUN_DSH_FORENSIC_SCAN.ps1` بدل لصق المحتوى يدويًا.

---

# أمر التنفيذ الرئيسي لـ VS Code Copilot Chat

```text
أنت تعمل داخل الريبو الحالي فقط: C:\bthwani-suite.
نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء، ولا تتوقف إلا بعد إغلاقه 100% بالأدلة، بصفر فجوات، صفر نقص، صفر تكرار، صفر أخطاء، وبدون الانتقال لأي مهمة أخرى.
لكن لا تعلن CLOSED/PASS/100% إلا إذا كانت الأدلة الفعلية موجودة. إذا كان شيء يحتاج API/WLT/runtime/visual evidence غير متوفر، صنّفه BLOCKED/NEEDS_EVIDENCE بوضوح ولا تخترع إغلاقًا.

المهمة: DSH end-to-end real closure لكل ما يتعلق بـ UI/UX/Flow ثم Runtime/API/Binding/Data/Security/Tests، عبر جميع الأسطح كمنظومة واحدة للمظلة:
- app-client
- app-partner
- app-captain
- app-field
- control-panel
- WLT bridge فقط للماليات

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.
اقرأ أولًا وبالترتيب:
1. AGENTS.md
2. .agents/INDEX.md
3. .agents/AUTHORITY_BOUNDARY.md
4. .agents/adapters/copilot.md
5. governance/PLATFORM_BLUEPRINT.md
6. dsh/SERVICE_BLUEPRINT.md
7. dsh/docs/closure/DSH_CLOSURE_RULES.md
8. dsh/docs/closure/DSH_SERVICE_FLOW_MODEL.md
9. dsh/docs/closure/DSH_ACTOR_JOURNEY_MATRIX.md
10. dsh/docs/closure/DSH_MISSING_LOGIC_AND_UI_GAPS.csv
11. dsh/docs/closure/DSH_CONTRACT_GAP_MAP.csv
12. dsh/docs/closure/DSH_ORDER_LIFECYCLE_COVERAGE_MATRIX.csv
13. dsh/docs/closure/DSH_ROUTE_STATE_CTA_MATRIX.csv
14. dsh/docs/closure/DSH_SCREEN_INVENTORY.csv
15. dsh/docs/closure/DSH_SKELETON_WIRING_MATRIX.csv
16. dsh/docs/closure/DSH_CONTROL_PANEL_SECTION_MAP.csv
17. dsh/docs/closure/DSH_FINAL_REMAINING_BLOCKERS.md
18. dsh/docs/DSH_VISUAL_REVIEW/*
19. wlt/SERVICE_BLUEPRINT.md
20. skills ذات العلاقة فقط: integrated-system umbrella, on-demand retrieval, ui-kit surface, screen-flow binding, operations dispatch, commerce catalog, platform vars, finance ledger, security/privacy, test quality gates, local evidence pack.

قواعد غير قابلة للكسر:
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- لا تعمل بمنهجية تطبيق واحد. كل قرار يجب أن يُفحص عبر جميع الأسطح ذات العلاقة.
- لا تغيّر backend/API/runtime/provider/database/auth/dependencies/lockfiles/native config إلا في المرحلة المخصصة وبعد إثبات الحاجة.
- لا تنفخ ملفات الشاشات الكبيرة. لا تضف مئات الأسطر داخل StoreScreen/CartScreen/OrdersTracking/Home/DshCaptainSurface/OrdersInbox/InventoryCatalog/PartnerHub إلا إذا كان التعديل موضعيًا جدًا ومثبتًا بالأدلة.
- تجنب التبعثر: لا تنشئ ملفات جديدة إلا إذا كان وجودها ضروريًا ومثبتًا؛ إن كان النمط reusable يجب أن يكون في المالك المركزي الصحيح أو يتم استخدام الموجود أولًا.
- لا تنشئ ملفات جديدة في @bthwani/ui-kit إلا إذا أثبتت أن الموجود لا يكفي وطلبت موافقة بشرية صريحة. استخدم public exports الحالية أولًا.
- Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui داخليًا داخل ui-kit فقط.
- ممنوع raw Tamagui imports خارج ui-kit.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- طبّق خيار الاستدعاء: لا تضخّم البيانات والمحتوى في كل الأسطح. استخدم IDs/references/summaries/pagination/lazy details/cache scoped payloads.
- أي ماليات: WLT فقط هو مصدر الحقيقة. DSH يعرض فقط ولا يحسب ولا يقرر wallet/payment/refund/settlement/payout/commission/ledger.
- RTL إلزامي: icon+text كتلة واحدة في اليمين، النص يمين، chevron/action في الجهة المقابلة، لا space-between خاطئ يفصل الأيقونة عن النص، لا centered Arabic داخل rows إلا بقرار بصري مقصود.
- الاستجابة يجب أن تصبح سريعة: قلل heavy imports, eager rendering, duplicated fixtures, broad list loading, render side-effects, unbounded arrays, unnecessary recomputation. لا تضف memo عشوائيًا؛ عالج سبب البطء الحقيقي.

طريقة التنفيذ الإلزامية:

PHASE 0 — Freeze / Forensic baseline
- لا تعدل أي ملف حتى تنهي الجرد.
- استخرج git status, branch, HEAD, diff, untracked.
- افحص كل dsh/ ملفًا ملفًا وصفًا/سطرًا بحسب الحاجة العملية: ownership, imports, exports, screenId, route, state, CTA, states, visual risk, RTL risk, token risk, performance risk, WLT risk, API gap, duplicate/dead/noise risk.
- اكتب evidence في tools/registry/runs/{SESSION_ID}/.
- صنّف الملفات إلى:
  1. SSoT/governance docs
  2. frontend screens
  3. frontend sections/parts/sheets
  4. shared contracts/fixtures/registries
  5. control-panel domain workspaces
  6. backend/openapi/contracts
  7. docs/closure/evidence
  8. archive/noise candidates
- ممنوع حذف أو نقل أو إعادة تسمية في هذه المرحلة.

PHASE 1 — DSH Boundary / SSoT / Surface Ownership
هدفها تثبيت ما يملكه DSH وما لا يملكه.
- دقّق dsh/SERVICE_BLUEPRINT.md مقابل كل سطح.
- دقّق أن DSH يملك: store/cart/checkout intent/order/delivery/tracking/support/preferences/business meaning/domain models/OpenAPI placeholder/closure status.
- دقّق أن DSH لا يملك: app shells, WLT money semantics, ui-kit primitives, services الأخرى.
- لكل screen/route/sheet/state، سجّل ownerKind: app/service/integration/control-panel.
- أي WLT integration يجب أن يكون ownerKind integration أو WLT bridge/read-only.
- لا تجعل DSH يحسب ماليات أو يقرر refunds/payouts/settlements.
- الناتج: تحديث أو إنشاء evidence فقط إذا لم تكن docs الحالية كافية؛ لا تكرر docs بلا حاجة.

PHASE 2 — Partner Onboarding / Activation / Client Visibility
هدفها إغلاق loop: field visit → documents → readiness → CP approval → client visibility.
افحص وطبّق بأصغر تغييرات آمنة:
- app-field:
  - DshFieldStoresScreen
  - DshFieldStoreOnboardingScreen
  - DshFieldStoreVisitScreen
  - DshFieldReadinessEscalationScreen
  - field sections and preview data
- control-panel/partners:
  - ControlPanelDshPartnerApprovalsScreen
  - Partner intake/topology/deactivation/performance workspaces
- app-partner:
  - onboarding action panel, store profile, readiness, visibility state.
- app-client:
  - discovery/store visibility must reflect active/closed/busy/out-of-zone/unavailable.
إغلاق هذه المرحلة يعني:
- لا يظهر المتجر للعميل إلا إذا activation + approval + visibility + serviceability تسمح.
- الشريك يرى سبب عدم الظهور بوضوح.
- field يرى نتيجة التفعيل/الرفض/التصعيد.
- CP يرى approval queue/action/audit.
- كل حالة لها CTA واحد واضح.
- visual evidence مطلوب لاحقًا.

PHASE 3 — Catalog / Product Identity / Barcode / Publishing
هدفها إغلاق هوية المنتج والكتالوج بدون تضخيم.
- افحص app-partner InventoryCatalogScreen, partner inventory panels, catalog shared models.
- افحص control-panel/catalogs: hub/categories/adoption/publishing/approval.
- افحص app-client store/items/search/home/cart connections.
- مطلوب:
  - master catalog identity: productId, barcode, category, variant, source, version/status.
  - partner inventory maps to master product identity without copying huge product blobs.
  - barcode scan entry points في partner/field/client حيث تخدم الإدخال أو التحقق، مع fallback manual input.
  - duplicate detection preview: same barcode/name/category conflict.
  - item approval workflow and publishing gate in CP.
  - on-demand retrieval: lists use summaries; detail loads only when opened.
- ممنوع إنشاء ماسح barcode runtime/native إذا لم يكن package/permission جاهزًا؛ إن كان غير جاهز أضف UI flow skeleton واضح + BLOCKED_BY_NATIVE/CONTRACT evidence فقط.

PHASE 4 — Client Discovery / Storefront / Cart / Checkout Intent
هدفها تقليل friction وزيادة سرعة الاستجابة.
- افحص HomeScreen, SearchScreen, StoreScreen, StoreItemsScreen, CartScreen, DshCheckoutIntentScreen.
- لا تزيد تضخم الملفات الكبيرة؛ استخرج فقط sections محلية داخل dsh إن كانت ضرورية، أو استخدم existing sections/shared.
- يجب أن تغطي:
  - loading/empty/error/offline/blocked/out-of-zone/closed/busy.
  - clear store cards and product cards.
  - cart item unavailable/substitution/quantity/remove/edit.
  - checkout review before commitment: items, address, delivery mode, ETA, fee display, discount, WLT payment handoff note.
  - WCAG: financial confirmation before submission.
  - RTL and central tokens.
  - fast UI: no broad eager loading; no giant fixture copying; no expensive render-side work.

PHASE 5 — WLT Payment Handoff / Order Creation
هدفها فصل DSH intent عن WLT payment truth.
- DSH creates checkout intent/order draft only.
- WLT owns payment decision/result/refund money truth.
- بعد WLT result، DSH يعرض order_created_preview/order confirmation state.
- failure states: payment pending/failed/cancelled/expired/needs retry.
- لا تضع أي wallet/payment math داخل DSH.
- إذا contract غير جاهز: skeleton state + explicit BLOCKED_BY_WLT_CONTRACT.

PHASE 6 — Order Lifecycle / State Machine
هدفها توحيد state machine عبر الأسطح.
اعتمد lifecycle:
order_created → partner_intake → partner_accept/reject → partner_prepare → partner_ready → captain_assignment → captain_accept/decline → captain_arrive_pickup → captain_pickup → out_for_delivery → arrive_dropoff → proof_of_delivery → delivered → rating → control_panel_audit.
أضف/ثبت حالات:
- cancellation_requested/cancelled/cancellation_rejected
- refund_pending/refund_in_progress/refunded/refund_failed as WLT read-only
- support_exception
- delivery_failed/retry/returned_to_store where relevant
- unavailable_item/partner_delay/no_captain_available
لكل حالة:
- actor owner
- visible label Arabic
- primary CTA
- secondary CTA if needed
- next state
- notification signal
- CP audit visibility
- WLT boundary if financial
- screenshot target.
ممنوع وجود أسماء حالات متناقضة بين العميل والشريك والكابتن والعمليات.

PHASE 7 — Delivery Modes / Serviceability / Dispatch / Handoff
هدفها إغلاق توصيل بثواني/توصيل المتجر/استلام ذاتي.
- app-client: اختيار/عرض delivery mode قبل وبعد الطلب.
- app-partner: يعرف هل يسلم لكابتن بثواني أم مندوب متجر أم العميل.
- app-captain: لا تظهر له إلا مهام بثواني/الموكلة إليه.
- control-panel: manual/auto assignment/reassignment/exceptions/SLA/heatmap.
- serviceability: zone/store coverage/captain availability/store capacity.
- handoff proof: partner ready → captain pickup أو customer pickup أو store courier handoff.
- لا تخلط CP heatmap مع captain map. CP heatmap للعمليات؛ captain map scoped للمهمة فقط.

PHASE 8 — Support / Escalation / Chat / Tickets
هذه P0 لأن ops-side messaging/support gaps موجودة.
- app-client: support within order context.
- app-partner: partner↔ops support/order issue.
- app-captain: captain↔ops support.
- app-field: readiness escalation.
- control-panel/support:
  - ticket list
  - ticket detail/response
  - SLA dashboard
  - escalation queue
  - ops↔client messaging
  - ops↔partner messaging
  - ops↔captain messaging
إغلاق UI/UX يعني skeletons mounted/visible إن كانت العقود تسمح، أو visible blocked placeholders إن لم تسمح، مع عدم ادعاء runtime.
كل ticket مرتبط بـ actor/order/surface/status/SLA/next action.

PHASE 9 — Finance / WLT Bridge / Refunds / Settlements / Payouts
- DSH لا يملك الماليات.
- control-panel/finance يجب أن يكون WLT bridge visibility فقط.
- مطلوب views/read-only skeletons:
  - partner settlement
  - captain payout
  - refund queue
  - commission breakdown
  - platform fee audit
  - field commission
- لا تكتب logic للرسوم/العمولات/ledger داخل DSH.
- إذا WLT contract غير موجود: BLOCKED_BY_WLT مع UI placeholder واضح للعمليات.

PHASE 10 — Marketing / Offers / Loyalty / Content
- افحص marketing command decks, banners, videos, partner offers, promos, loyalty, growth, smart signal.
- اربطها منطقيًا بالكتالوج والـ discovery بدون خلط ownership.
- لا تجعل coupon/promo يربك checkout أو يسرق الانتباه.
- العروض يجب أن تظهر كvisibility/discovery layer، لا كمنطق مالي داخل DSH.
- hardcoded colors في banner preview يجب مراجعتها مقابل نظام الألوان المركزي؛ لا تستخدم raw random colors إن كانت تخالف tokens.

PHASE 11 — Platform / Vars / Policies / Provider Control
- المسار الصحيح: control-panel/runtime/app/platform/page.tsx → dsh/frontend/control-panel/platform/ → Vars.
- لا تستخدم old control path.
- Vars UI/UX only في هذه المرحلة إلا إذا طلب runtime صراحة.
- يجب أن تعرض:
  - owner: DSH/WLT/Provider
  - status: preview-only/contract-needed/ready-for-binding
  - scope: global/service/region/city/zone/category/store
  - precedence
  - simulation impact
  - audit/rollback preview
  - provider control preview دون live switching.
- طبّق on-demand retrieval: لا ترسل كل vars لكل surface.

PHASE 12 — Notifications / Inbox / Signal Layer
- عرّف signal لكل actor:
  - client: order updates, delivery updates, refund visibility, ticket updates, rating.
  - partner: new order, acceptance timer, item issue, ready handoff, support, visibility approval/rejection.
  - captain: offer, assignment, pickup/dropoff, support, payout notice as WLT read-only.
  - field: store assignment, visit result, escalation result.
  - ops: exceptions, SLA breaches, support tickets, partner approvals, dispatch failures.
- كل notification له action أو destination واضح؛ لا إشعار بلا CTA إذا يحتاج فعل.
- لا تنسجم signals محليًا فقط؛ يجب توحيد vocabulary.

PHASE 13 — Administration / Roles / Permissions / Audit
- roles/access control for CP actions:
  - partner approval/rejection/deactivation
  - dispatch override/reassignment
  - support response/escalation
  - finance WLT view access
  - vars simulation/rollback preview
- كل action حساس له audit: actor/time/reason/before/after/evidence/source surface.
- إذا auth/permissions runtime غير جاهز: UI displays permission states + BLOCKED_BY_AUTH_CONTRACT.

PHASE 14 — Command Center / Monitoring / Observability
- control-panel only:
  - live orders
  - dispatch board
  - exceptions
  - SLA
  - geo heatmap
  - area capacity
  - service health
  - audit/closure dashboard
- لا تخلق monitoring مزيف. استخدم preview data مع labels واضحة.
- مطلوب fast response: pagination, scoped views, no full dataset eager loading.

PHASE 15 — Runtime / API / Binding / Data / Security / Tests
هذه مرحلة مستقلة بعد UI/UX/Flow.
- لا تبدأها قبل توثيق UI/UX closure evidence.
- OpenAPI: لا تملأ paths عشوائيًا. استخدم DSH_CONTRACT_GAP_MAP كقائمة CG-001..CG-036.
- لكل endpoint:
  - operationId
  - auth/permissions
  - request/response schemas
  - error schemas
  - pagination where lists
  - idempotency for write actions where needed
  - WLT bridge boundaries
  - audit/event emission
- typed clients must be generated/handwritten from contract owner only.
- runtime proof must include smoke tests and no preview-as-truth leakage.
- security: no secrets, no PII leakage in logs/evidence, permission states checked.
- tests: user-visible behavior first, isolated tests, resilient locators, no implementation-detail-only tests.

PHASE 16 — Final DSH Closure Sweep
هذه gate نهائية فقط، ليست مكان تنفيذ features جديدة.
افحص:
- no missing gaps
- no partial gaps without owner decision
- no duplicate screens/routes/states
- no dead code/noise/unmounted skeletons without documented blocker
- no giant screen bloat introduced
- no local reusable design outside UI-kit ownership
- no raw random colors/token drift
- no direct Tamagui imports outside ui-kit
- no WLT money ownership leakage
- no state vocabulary contradictions
- all surfaces visually evidenced
- all route/state/CTA evidenced
- all contracts either proven or explicitly BLOCKED with owner
- all runtime/API/binding gates proven only where in scope
- evidence zip created as tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip

مخرجات كل Phase:
- DONE/BLOCKED لكل item.
- files changed.
- why safe.
- evidence path.
- verification commands run.
- remaining blockers with owner.
- لا تقرير طويل؛ ملخص إثبات قصير وواضح.

أوامر التحقق بعد أي Apply:
Set-Location -LiteralPath "C:\bthwani-suite"
git status --short --branch
git --no-pager diff --stat
git --no-pager diff --name-status
git diff --check
pnpm run guard:service-blueprint
pnpm run guard:protected-tokens
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel
pnpm run guard:secret-scan
pnpm -w exec tsc --noEmit
pnpm run build:mobile-control-panel

إذا أي أمر فشل: لا تكمل إلى المرحلة التالية. أصلح السبب ضمن نفس نطاق المرحلة فقط أو صنّفه BLOCKED.
```

---

## أمر التحقق النهائي في PowerShell بعد التنفيذ

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pwsh -NoProfile -ExecutionPolicy Bypass -File .\RUN_DSH_VERIFY_AFTER_APPLY.ps1
```

> ضع `RUN_DSH_VERIFY_AFTER_APPLY.ps1` في جذر الريبو أو نفّذه من مساره الذي حملته منه.
