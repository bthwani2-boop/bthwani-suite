# DSH_FORENSIC_INVENTORY

## 1. Scope & Audit Method

هذا الجرد هو جرد جنائي للخدمة DSH داخل هذا الريبو فقط، وعلى الفرع الحالي فقط، ومن دون أي اعتماد على أي ريبو خارجي أو أي فرضيات تشغيلية غير مثبتة بالملفات الموجودة فعليًا داخل الشجرة الحالية.

نطاق القراءة اعتمد على الطبقات التالية فقط:

- `dsh/SERVICE_BLUEPRINT.md`
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md`
- `dsh/docs/SCREEN_API_MATRIX.md`
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md`
- `dsh/frontend/**`
- `app-client/composition/**`, `app-client/shell/**`
- `app-partner/composition/**`, `app-partner/shell/**`
- `app-captain/composition/**`, `app-captain/shell/**`
- `app-field/shell/**`
- `control-panel/composition/**`, `control-panel/shell/**`, `control-panel/runtime/app/**`
- `dsh/media-fixtures/**`
- `wlt/frontend/app-client/dsh/hooks/useWlt.ts`

قواعد الإثبات المستخدمة هنا:

- وجود الملف ليس دليلًا على أنه active.
- الاستيراد داخل `index.ts` وحده ليس دليلًا على أنه active.
- fixture, seed, preview, localStorage, media-fixtures, globalThis ليست runtime truth.
- أي claim خاص بالإغلاق النهائي أو الجاهزية التشغيلية الكاملة مرفوض هنا ما لم يوجد runtime/API/backend/domain proof داخل نفس الريبو.
- أي شاشة wrapper أو alias أو nested-only جرى فصلها عن active root screens.
- أي شاشة بلا host/shell/route proof مباشر أو غير مباشر وُسمت orphan candidate أو referenced-only بحسب قوة الأثر.

مفاتيح التصنيف:

- `ACTIVE_CONSUMED`: شاشة لها استهلاك حي داخل host/shell/root screen مثبت.
- `ACTIVE_ENTRY_CANDIDATE`: شاشة جذرية يثبت وجود route/section/entry لها، لكن الإغلاق التشغيلي ما يزال غير مثبت.
- `REFERENCED_ONLY`: شاشة أو ملف screen يُستهلك فقط من شاشة أخرى أو يعمل alias/wrapper.
- `PREVIEW_ONLY`: شاشة shared/pattern تُستخدم كقالب حالة بصري وليس كمدخل capability مستقل.
- `ORPHAN_CANDIDATE`: ملف screen موجود بلا host proof حي داخل الأسطح المفحوصة.

## 2. Executive Summary

| Metric | Value | Notes |
| --- | ---: | --- |
| Proven DSH surfaces | 5 | `app-client`, `app-partner`, `app-captain`, `app-field`, `control-panel` |
| Proven DSH webapp surface | 0 | لم يظهر أثر حي داخل `dsh/frontend` يبرر عدّه كسطح DSH فعلي |
| Total DSH screen files | 56 | مطابق لعدّ الملفات الفعلي تحت `dsh/frontend/**/**/*Screen.tsx` |
| app-client screens | 19 | مثبت عدًّا وقراءةً |
| app-partner screens | 5 | مثبت عدًّا وقراءةً |
| app-captain screens | 5 | مثبت عدًّا وقراءةً |
| app-field screens | 7 | مثبت عدًّا وقراءةً |
| control-panel screens | 20 | مثبت عدًّا وقراءةً |
| Active screen files total | 49 | `42 ACTIVE_CONSUMED` + `7 ACTIVE_ENTRY_CANDIDATE` |
| Referenced-only screen files | 3 | wrappers أو nested-only screens |
| Preview-only shared screens | 1 | `DshOperationScreen.tsx` |
| Orphan candidates | 3 | Gas refill wrapper, partner operations directory, captain operations |
| Giant screen candidates | 5 | `DshHomeGetScreen`, `DshStoreGetScreen`, `DshCartUnifiedScreen`, `DshPartnerConsoleScreen`, `DshCaptainOrdersScreen` |
| Important blocks inventoried | 19 | عدّ Component / Block Inventory أدناه |
| Cross-surface capabilities mapped | 19 | capability-first map أدناه |
| Fixture/media sources | 33 | `12` source files باسم fixture/preview/seed + `21` files داخل `dsh/media-fixtures` منها `20` seed assets |
| Backend + domain files | 7 | `backend=6`, `domain=1` |
| API / contract status | NOT_CLOSED | matrix الحالية تسجّل gaps واضحة قبل أي claim إغلاق |
| Backend / domain status | SCAFFOLD_OR_TBD | backend scaffold, domain minimal, لا يوجد إغلاق سلوكي مثبت |
| Runtime truth status | MOSTLY_UNPROVEN | معظم الشاشات مبنية على fixture/preview/seed/local data مع استثناء dependency paths مثل WLT |

أهم الاستنتاجات:

- DSH يملك حضورًا حيًا واضحًا عبر خمسة أسطح، لكن الحقيقة التشغيلية ليست موزعة بالتساوي بينها.
- `app-client` و `control-panel` يحملان أكبر كثافة سلوكية، لكن كليهما مليء بمصادر preview وfixture.
- `app-field` هو أوضح سطح من جهة route ownership لأن `FieldSurfaceHost` يستهلك كل شاشاته السبع مباشرة.
- `app-partner` و `app-captain` يملكان شاشات orphan واضحة يجب عدم حذفها الآن، بل عزلها داخل حزم capability لاحقة.
- checkout/payment/settlement يظل محكومًا بـ WLT/auth ولا يصلح كبداية closure package أولى.

## 3. Route / Host Linkage Inventory

| Surface / section | Proven route or composition chain | Owning file | What it proves | Notes |
| --- | --- | --- | --- | --- |
| app-client | `app-client/composition/index.ts -> app-client/shell/ClientSurfaceHost.tsx -> dsh/frontend/app-client/DshSurfaceHost.tsx` | `dsh/frontend/app-client/DshSurfaceHost.tsx` | client DSH routes owned inside one host surface | أعلى كثافة route evidence داخل الخدمة |
| app-partner | `app-partner/composition/compat.tsx -> app-partner/shell/PartnerSurfaceHost.tsx` | `app-partner/shell/PartnerSurfaceHost.tsx` + `app-partner/composition/compat.tsx` | partner DSH routes split بين shell وcompat bridge | بعض الأسماء الحية تمر عبر compat لا عبر screen file مباشر |
| app-captain | `app-captain/composition/index.ts -> app-captain/shell/CaptainSurfaceHost.tsx` | `app-captain/shell/CaptainSurfaceHost.tsx` | captain route ownership مثبت من shell | شاشة operations المستقلة لا يظهر استهلاكها الحي |
| app-field | `app-field/shell/FieldSurfaceHost.tsx -> dsh/frontend/app-field/FieldSurfaceHost.tsx` | `dsh/frontend/app-field/FieldSurfaceHost.tsx` | field consumes all seven screen files مباشرة | أوضح سطح من ناحية direct render evidence |
| control-panel dashboard | `control-panel/runtime/app/page.tsx -> control-panel/shell/web-entry.tsx -> control-panel/shell/ControlPanelSurfaceHost.tsx` | `control-panel/runtime/app/page.tsx` | default dashboard/control-panel entry حي | يثبت section-level entry وليس runtime closure |
| control-panel operations | `control-panel/runtime/app/operations/page.tsx -> dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx -> OperationsHubScreen` | `dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx` | operations root حي ومطبع group routing | hub يوزع العمل إلى 10 workspaces رئيسية |
| control-panel marketing | `control-panel/runtime/app/marketing/page.tsx -> control-panel/shell/web-entry.tsx -> section=marketing` | `dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx` | marketing section root حي | داخله 4 decks مثبتة بالاستهلاك المباشر |
| control-panel partners | `control-panel/runtime/app/partners/page.tsx -> control-panel/shell/web-entry.tsx -> section=partners` | `dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx` | partner approvals section root حي | يربط catalog وmarketing handoff |
| control-panel catalogs | `control-panel/shell/ControlPanelSurfaceHost.tsx` section map + `ControlPanelDshCatalogScreen` render chain | `dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx` | catalogs section موجود في surface map ويستهلك categories screen مباشرة | catalog route حاضر على الأقل كسطح section/control-panel mapping |

## 4. Screen Inventory

### app-client

| Surface | File | Bytes | Consumed / Referenced | Proven host or reference | Candidate flow | Data source type | State / signal markers | Risk | Decision / next action |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| app-client | `dsh/frontend/app-client/awnak/screens/DshAwnakOrderCreateScreen.tsx` | 7846 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` imports and renders it | Awnak order create | props + local UI state | ready plus action handlers | runtime unproven | keep; package later under order-intake |
| app-client | `dsh/frontend/app-client/bell/screens/DshClientBellScreen.tsx` | 8110 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Bell / quick alerts | local UI state | ready/loading/empty/error/offline/disabled | no backend proof | keep; package with notifications |
| app-client | `dsh/frontend/app-client/cart/screens/DshCartUnifiedScreen.tsx` | 52041 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Cart + pre-checkout | mixed UI state + WLT-adjacent props | rich ready states | GIANT_SCREEN_CANDIDATE, WLT-adjacent | keep; split by capability later, not now |
| app-client | `dsh/frontend/app-client/discovery/screens/DshSearchScreen.tsx` | 3476 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Discovery search | props-driven | ready/loading/empty/error | no search API proof | keep; package with discovery |
| app-client | `dsh/frontend/app-client/entry/screens/DshEntryScreen.tsx` | 4803 | ACTIVE_ENTRY_CANDIDATE | imported into client host chain | DSH entry gate | UI-only | entry CTA states | entry exists, not closure proof | keep as entry root |
| app-client | `dsh/frontend/app-client/favorites/screens/DshFavoritesListScreen.tsx` | 2027 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Favorites list | props-driven | ready/empty/error | persistence truth unproven | keep; package with favorites |
| app-client | `dsh/frontend/app-client/favorites/screens/DshFavoriteToggleScreen.tsx` | 3560 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Favorite toggle | props-driven | ready/loading/error | UI action only | keep; package with favorites |
| app-client | `dsh/frontend/app-client/gas/screens/DshGasRefillOrderCreateScreen.tsx` | 390 | ORPHAN_CANDIDATE | only export/index proof found | Gas refill intake alias | wrapper over intake hub | inherits upstream | no host proof | keep but do not count active; map or retire later |
| app-client | `dsh/frontend/app-client/home/screens/DshHomeGetScreen.tsx` | 65289 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` owns home route | Home / discovery / promos / categories | fixture + seeded marketing overlays | multi-state home sections | GIANT_SCREEN_CANDIDATE, runtime unproven | keep; strongest candidate for first closure package |
| app-client | `dsh/frontend/app-client/loyalty/screens/DshBenefitsHubScreen.tsx` | 170 | REFERENCED_ONLY | wrapper re-export to subscriptions hub | Benefits alias | alias only | inherits target screen | duplicate alias drift | keep alias, exclude from active count |
| app-client | `dsh/frontend/app-client/my_space/screens/DshMySpaceCommercialScreen.tsx` | 13133 | REFERENCED_ONLY | rendered from `DshMySpaceScreen.tsx` | My Space commercial | fixture/props | embedded tabs and cards | nested-only, not root route | keep nested; package under My Space |
| app-client | `dsh/frontend/app-client/my_space/screens/DshMySpaceOrdersScreen.tsx` | 12770 | REFERENCED_ONLY | rendered from `DshMySpaceScreen.tsx` | My Space orders | fixture/props | embedded order summaries | nested-only, not root route | keep nested; package under My Space |
| app-client | `dsh/frontend/app-client/my_space/screens/DshMySpaceScreen.tsx` | 7035 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | My Space root | mixed fixtures + child screens | ready/loading/error | runtime/account truth unproven | keep; package with account area |
| app-client | `dsh/frontend/app-client/notifications/screens/DshNotificationsScreen.tsx` | 7181 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Notifications inbox | fixtures + props | ready/loading/empty/error | no notification backend proof | keep; package with bell |
| app-client | `dsh/frontend/app-client/patterns/screens/DshOperationScreen.tsx` | 2822 | PREVIEW_ONLY | reused by many client screens as state shell | Shared non-ready pattern | props-driven preview/state shell | loading/empty/error/offline/disabled | filename can mislead as route | keep; never count as closure screen |
| app-client | `dsh/frontend/app-client/shein/screens/DshSheinOrderCreateScreen.tsx` | 5069 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Shein order create | props + local UI | ready/action states | proxy flow unproven | keep; package with intake/order creation |
| app-client | `dsh/frontend/app-client/stores/screens/DshStoreGetScreen.tsx` | 98346 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Storefront root | fixture + seeded promos + local state | rich store states | GIANT_SCREEN_CANDIDATE | keep; package with storefront |
| app-client | `dsh/frontend/app-client/stores/screens/DshStoreItemsScreen.tsx` | 5440 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` direct render proof | Store items / product browsing | props-driven | ready/filter states | product runtime truth unproven | keep; package with storefront |
| app-client | `dsh/frontend/app-client/subscriptions/screens/SubscriptionsHubScreen.tsx` | 1303 | ACTIVE_CONSUMED | `DshSurfaceHost.tsx` renders `DshBenefitsHubScreen` exported from this file | Benefits / loyalty / subscriptions | props-driven | ready/loading/error | actual implementation hidden behind alias | keep; treat this as real active implementation |

### app-partner

| Surface | File | Bytes | Consumed / Referenced | Proven host or reference | Candidate flow | Data source type | State / signal markers | Risk | Decision / next action |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| app-partner | `dsh/frontend/app-partner/console/screens/DshPartnerConsoleScreen.tsx` | 43908 | ACTIVE_CONSUMED | partner shell/compat bridge consumes partner console | Partner console root | local UI models + seeded cards | queue/workspace states | GIANT_SCREEN_CANDIDATE, no backend proof | keep; package with partner preparation |
| app-partner | `dsh/frontend/app-partner/entry/screens/DshPartnerEntryScreen.tsx` | 4761 | ACTIVE_ENTRY_CANDIDATE | partner composition/shell bridge imports entry screen | Partner entry | UI-only | entry CTA states | entry exists, no closure proof | keep as root entry |
| app-partner | `dsh/frontend/app-partner/inventory/screens/DshPartnerInventoryScreen.tsx` | 3344 | ACTIVE_CONSUMED | partner shell/compat bridge imports inventory | Partner inventory | props-driven | ready/empty/error | no inventory backend proof | keep; package with partner console |
| app-partner | `dsh/frontend/app-partner/operations/screens/DshPartnerOperationsDirectoryScreen.tsx` | 4535 | ORPHAN_CANDIDATE | only export proof found; no live shell consumer found | Partner operations directory | UI-only | route list state | no host proof | keep orphan candidate; map before any cleanup |
| app-partner | `dsh/frontend/app-partner/orders/screens/DshPartnerOrdersScreen.tsx` | 27969 | ACTIVE_CONSUMED | partner composition/compat bridge imports partner orders | Partner orders / inbox | local UI models | inbox/detail/workspace states | large surface, no API closure | keep; package with partner preparation |

### app-captain

| Surface | File | Bytes | Consumed / Referenced | Proven host or reference | Candidate flow | Data source type | State / signal markers | Risk | Decision / next action |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| app-captain | `dsh/frontend/app-captain/entry/DshCaptainEntryScreen.tsx` | 4511 | ACTIVE_ENTRY_CANDIDATE | captain composition/shell chain imports entry | Captain entry | UI-only | entry CTA states | entry exists, no closure proof | keep as entry root |
| app-captain | `dsh/frontend/app-captain/finance/DshCaptainFinanceScreen.tsx` | 4654 | ACTIVE_CONSUMED | captain shell imports finance/profile pieces | Captain finance / COD | local UI state | balance/readiness states | WLT-adjacent finance meaning, no backend closure | keep; package later |
| app-captain | `dsh/frontend/app-captain/operations/DshCaptainOperationsScreen.tsx` | 12705 | ORPHAN_CANDIDATE | only operations index export proof found | Captain operations standalone | local model snapshot | ready/loading/empty/error | no shell proof | keep orphan candidate; do not delete |
| app-captain | `dsh/frontend/app-captain/orders/DshCaptainOrdersScreen.tsx` | 42131 | ACTIVE_CONSUMED | captain shell imports orders flow surfaces | Captain orders / delivery | local UI model + props | route/workspace/order states | GIANT_SCREEN_CANDIDATE | keep; package with captain delivery |
| app-captain | `dsh/frontend/app-captain/profile/DshCaptainProfileScreen.tsx` | 4800 | ACTIVE_CONSUMED | captain shell imports profile pieces | Captain profile | props-driven | ready/form states | no account backend proof | keep; package with captain surface |

### app-field

| Surface | File | Bytes | Consumed / Referenced | Proven host or reference | Candidate flow | Data source type | State / signal markers | Risk | Decision / next action |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| app-field | `dsh/frontend/app-field/finance/DshFieldFinanceScreen.tsx` | 1981 | ACTIVE_CONSUMED | `FieldSurfaceHost.tsx` direct render proof | Field finance | local/props | ready summary state | no financial backend proof | keep; package with field profile |
| app-field | `dsh/frontend/app-field/onboarding/DshFieldStoreOnboardingScreen.tsx` | 16387 | ACTIVE_CONSUMED | `FieldSurfaceHost.tsx` direct render proof | Field store onboarding | localStorage + seed fallback | draft/stepper states | local persistence is not runtime truth | keep; package with field onboarding |
| app-field | `dsh/frontend/app-field/profile/DshFieldProfileHomeScreen.tsx` | 3126 | ACTIVE_CONSUMED | `FieldSurfaceHost.tsx` direct render proof | Field profile home | props-driven | ready navigation state | UI-only summary | keep |
| app-field | `dsh/frontend/app-field/profile/DshFieldProfileScreen.tsx` | 1472 | ACTIVE_CONSUMED | `FieldSurfaceHost.tsx` direct render proof | Field profile detail | props-driven | ready detail state | no backend sync proof | keep |
| app-field | `dsh/frontend/app-field/stores/DshFieldStoresHistoryScreen.tsx` | 1544 | ACTIVE_CONSUMED | `FieldSurfaceHost.tsx` direct render proof | Field visit history | props-driven | history list state | history truth unproven | keep |
| app-field | `dsh/frontend/app-field/stores/DshFieldStoresScreen.tsx` | 5465 | ACTIVE_CONSUMED | `FieldSurfaceHost.tsx` direct render proof | Field stores list | local/props | ready/list states | no backend sync proof | keep |
| app-field | `dsh/frontend/app-field/visits/DshFieldStoreVisitScreen.tsx` | 6295 | ACTIVE_CONSUMED | `FieldSurfaceHost.tsx` direct render proof | Field store visit | local form state | form/submit states | visit sync unproven | keep |

### control-panel

| Surface | File | Bytes | Consumed / Referenced | Proven host or reference | Candidate flow | Data source type | State / signal markers | Risk | Decision / next action |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| control-panel | `dsh/frontend/control-panel/catalogs/categories/ControlPanelDshCatalogCategoriesScreen.tsx` | 3870 | ACTIVE_CONSUMED | `ControlPanelDshCatalogScreen.tsx` directly renders it | Catalog categories governance | local catalog config | decision board + category list | preview governance only | keep nested active |
| control-panel | `dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx` | 6581 | ACTIVE_ENTRY_CANDIDATE | catalogs section exists in control-panel section map and consumes categories screen | Catalog governance root | local catalog data | governance/readiness cards | runtime/catalog backend unproven | keep as section root |
| control-panel | `dsh/frontend/control-panel/dashboard/ControlPanelDshClosureDashboardScreen.tsx` | 3253 | ACTIVE_ENTRY_CANDIDATE | control-panel default/dashboard entry chain proves dashboard root | Closure dashboard | derived cross-surface map | read-only dashboard states | evidence dashboard, not runtime closure | keep read-only root |
| control-panel | `dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx` | 17473 | ACTIVE_CONSUMED | `ControlPanelDshMarketingScreen.tsx` direct render proof | Banner command deck | seeded banner store + published preview mapping | draft/publish/quality states | preview/store-backed, not API-backed | keep; top closure candidate |
| control-panel | `dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx` | 4515 | ACTIVE_ENTRY_CANDIDATE | `runtime/app/marketing/page.tsx` + control-panel shell section | Marketing root | local state + nested decks | segmented tabs | route root exists, runtime truth unproven | keep as section root |
| control-panel | `dsh/frontend/control-panel/marketing/GrowthCommandDeckScreen.tsx` | 22187 | ACTIVE_CONSUMED | `ControlPanelDshMarketingScreen.tsx` direct render proof | Growth / shorts / subscriptions | seeded growth store | draft/release states | preview-backed | keep; same package as banners |
| control-panel | `dsh/frontend/control-panel/marketing/loyalty/LoyaltyCommandDeckScreen.tsx` | 18486 | ACTIVE_CONSUMED | `ControlPanelDshMarketingScreen.tsx` direct render proof | Loyalty commerce deck | local commerce data | plan/benefit states | no backend subscription truth | keep |
| control-panel | `dsh/frontend/control-panel/marketing/SmartSignalLayer/SmartSignalLayerScreen.tsx` | 35416 | ACTIVE_CONSUMED | `ControlPanelDshMarketingScreen.tsx` direct render proof | Smart signal layer | ticker fixtures + preview store | signal/ticker states | preview-backed | keep |
| control-panel | `dsh/frontend/control-panel/operations/area-capacity/AreaCapacityScreen.tsx` | 4932 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Area capacity | preview operations data | KPI/workspace states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/audit-support-sla/AuditSupportSlaScreen.tsx` | 5381 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Audit / support / SLA | preview operations data | queue/status states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/awnak/AwnakScreen.tsx` | 5303 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Awnak proxy | preview operations data | order/proxy states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/captain-operations/CaptainOperationsScreen.tsx` | 7569 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Captain ops board | preview operations data | KPI/workspace states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/command-center/CommandCenterScreen.tsx` | 5957 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Command center | preview operations data | KPI/decision states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/dispatch-assignment/DispatchAssignmentScreen.tsx` | 4950 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Dispatch assignment | preview operations data | lane states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/exceptions-escalations/ExceptionsEscalationsScreen.tsx` | 5075 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Exceptions / escalations | preview operations data | queue states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/live-orders/LiveOrdersScreen.tsx` | 4942 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Live orders | preview operations data | live lane states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/OperationsHubScreen.tsx` | 5062 | ACTIVE_CONSUMED | `DshControlPanelSurfaceHost.tsx` direct render proof | Operations hub root | normalized registry + preview data | workspace switching | ops hub active but not runtime-closed | keep; high-value closure package |
| control-panel | `dsh/frontend/control-panel/operations/partner-stores/PartnerStoresScreen.tsx` | 6759 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Partner stores | preview operations data | queue/governance states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/operations/sheinproxy/ControlPanelDshSheinProxyScreen.tsx` | 5354 | ACTIVE_CONSUMED | `OperationsHubScreen.tsx` canonical workspace render | Shein proxy | preview operations data | proxy/order states | preview-only ops truth | keep |
| control-panel | `dsh/frontend/control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx` | 11437 | ACTIVE_ENTRY_CANDIDATE | `runtime/app/partners/page.tsx` direct section proof | Partner approvals root | local queue/workflow data | queue/tabs/decision states | no partner backend closure | keep as section root |

## 5. Surface Inventory

| Surface | Screen files | Active total | Referenced-only | Preview-only | Orphan candidates | Important blocks counted | Proven host owner | Runtime truth status | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| app-client | 19 | 14 | 3 | 1 | 1 | 6 | `dsh/frontend/app-client/DshSurfaceHost.tsx` | mostly fixture/seed-driven | أعلى كثافة features وأعلى خطر اختلاط active مع preview |
| app-partner | 5 | 4 | 0 | 0 | 1 | 3 | `app-partner/shell/PartnerSurfaceHost.tsx` + compat bridge | UI-heavy, backend unproven | console/orders حية، operations directory يتيم حتى الآن |
| app-captain | 5 | 4 | 0 | 0 | 1 | 3 | `app-captain/shell/CaptainSurfaceHost.tsx` | UI-heavy, lifecycle unproven | orders/profile/finance حية، operations المستقلة يتيمة |
| app-field | 7 | 7 | 0 | 0 | 0 | 4 | `dsh/frontend/app-field/FieldSurfaceHost.tsx` | local persistence, not runtime truth | أوضح direct ownership بين كل الأسطح |
| control-panel | 20 | 20 | 0 | 0 | 0 | 3 | `control-panel/shell/ControlPanelSurfaceHost.tsx` + section routes | mostly preview/control data | route ownership واضح لكن الحقيقة التشغيلية غير مغلقة |

## 6. Component / Block Inventory

| # | Surface | Block / component cluster | Primary owner file(s) | Why important | Current truth level |
| ---: | --- | --- | --- | --- | --- |
| 1 | app-client | Home discovery shell | `DshHomeGetScreen.tsx` | المدخل الأعلى كثافة للاكتشاف والعروض والفئات | fixture + seed |
| 2 | app-client | Banner and promo rail | `DshHomeGetScreen.tsx`, `shared/marketing/banner-store.ts` | يربط marketing surface بالعميل | seed / preview |
| 3 | app-client | Storefront shell | `DshStoreGetScreen.tsx` | متجر واحد كامل مع rails وتفاصيل | fixture + local state |
| 4 | app-client | Product browsing block | `DshStoreItemsScreen.tsx` | قائمة المنتجات قبل السلة | props / fixture |
| 5 | app-client | Cart and pre-checkout block | `DshCartUnifiedScreen.tsx` | أقرب نقطة إلى WLT/payment | local UI + WLT adjacency |
| 6 | app-client | My Space / notifications / bell / favorites cluster | `DshMySpaceScreen.tsx`, `DshNotificationsScreen.tsx`, `DshClientBellScreen.tsx`, favorites screens | retention, account area, saved items, alerts | props + fixtures |
| 7 | app-partner | Partner console board | `DshPartnerConsoleScreen.tsx` | السطح الرئيسي للشريك | local models |
| 8 | app-partner | Partner orders workspace | `DshPartnerOrdersScreen.tsx` | إدارة الطلبات والتحضير | local models |
| 9 | app-partner | Partner inventory block | `DshPartnerInventoryScreen.tsx` | readiness/catalog handoff | props |
| 10 | app-captain | Captain delivery workspace | `DshCaptainOrdersScreen.tsx` | التنفيذ الميداني للطلب | local models |
| 11 | app-captain | Captain finance block | `DshCaptainFinanceScreen.tsx` | COD/balance style surfaces | local state |
| 12 | app-captain | Captain profile block | `DshCaptainProfileScreen.tsx` | هوية الكابتن وبياناته | props |
| 13 | app-field | Field stores list block | `DshFieldStoresScreen.tsx` | نقطة البداية للرحلات الميدانية | props / local |
| 14 | app-field | Field onboarding block | `DshFieldStoreOnboardingScreen.tsx`, `FieldOnboardingStorage.ts` | onboarding draft capture | localStorage + seed |
| 15 | app-field | Field visit block | `DshFieldStoreVisitScreen.tsx` | capture visit and notes | local form state |
| 16 | app-field | Field profile / history / finance cluster | profile, history, finance screens | round-trip continuity للمندوب | props / local |
| 17 | control-panel | Operations hub and canonical workspaces | `OperationsHubScreen.tsx`, `operations.registry.ts` | غرفة التشغيل المركزية | preview operations data |
| 18 | control-panel | Marketing command decks | `ControlPanelDshMarketingScreen.tsx`, banner/growth/loyalty/signal screens | تحكم تسويقي cross-surface | seed / preview |
| 19 | control-panel | Catalog and partner governance cluster | `ControlPanelDshCatalogScreen.tsx`, categories screen, partner approvals screen | final governance lane قبل أي claim publish | local governance data |

## 7. Cross-Surface Capability Map

| # | Capability | Surfaces with proof | Primary files | Current status | Why active / why blocked |
| ---: | --- | --- | --- | --- | --- |
| 1 | Home / Store Discovery | app-client | `DshHomeGetScreen.tsx` | ACTIVE_NOT_CLOSED | حي بصريًا، لكنه fixture-driven |
| 2 | Banner Carousel / Promos / Marketing handoff | app-client + control-panel | `DshHomeGetScreen.tsx`, `BannersCommandDeckScreen.tsx`, `banner-store.ts` | ACTIVE_NOT_CLOSED | الربط موجود، لكن publish truth ما يزال store/preview-based |
| 3 | Categories / Orbit / Discovery filters | app-client + control-panel catalogs | `DshHomeGetScreen.tsx`, `ControlPanelDshCatalogCategoriesScreen.tsx` | ACTIVE_NOT_CLOSED | categories واضحة بصريًا لكن contract/backend غير مغلقين |
| 4 | Storefront | app-client | `DshStoreGetScreen.tsx` | ACTIVE_NOT_CLOSED | storefront حي جدًا لكنه محمّل ببيانات fixture |
| 5 | Product Browsing | app-client | `DshStoreItemsScreen.tsx` | ACTIVE_NOT_CLOSED | browsing موجود، truth غير مثبت contract-wise |
| 6 | Cart | app-client | `DshCartUnifiedScreen.tsx` | ACTIVE_BLOCKED_DOWNSTREAM | السلة حية، لكن downstream checkout/payment غير مغلق |
| 7 | Checkout | app-client + WLT dependency | `DshCartUnifiedScreen.tsx`, `useWlt.ts` | BLOCKED_BY_WLT_AUTH | blueprint وmatrix يثبتان أن checkout ليس أول حزمة إغلاق |
| 8 | Orders | app-client + app-partner + app-captain + control-panel ops | `DshCartUnifiedScreen.tsx`, `DshPartnerOrdersScreen.tsx`, `DshCaptainOrdersScreen.tsx`, `LiveOrdersScreen.tsx` | ACTIVE_NOT_CLOSED | flows موجودة لكن backend/API lifecycle غير مكتمل |
| 9 | Tracking | app-client + control-panel ops | checkout tracking files + live orders workspace | ACTIVE_NOT_CLOSED | tracking UI حاضر، لا يوجد contract runtime مغلق |
| 10 | Favorites | app-client | favorites screens | ACTIVE_NOT_CLOSED | active route proof موجود، persistence truth غير مثبت |
| 11 | Notifications / Bell | app-client | `DshNotificationsScreen.tsx`, `DshClientBellScreen.tsx` | ACTIVE_NOT_CLOSED | active UI واضح بلا notification backend proof |
| 12 | My Space / Account Area | app-client | `DshMySpaceScreen.tsx` + nested screens | ACTIVE_NOT_CLOSED | structure حي، account truth غير مثبت |
| 13 | Benefits / Loyalty / Subscriptions | app-client + control-panel marketing | `SubscriptionsHubScreen.tsx`, `LoyaltyCommandDeckScreen.tsx` | ACTIVE_NOT_CLOSED | alias client screen + control-panel deck موجودان، لا يوجد subscription backend proof |
| 14 | Partner Console / Preparation | app-partner + control-panel partners/catalogs | `DshPartnerConsoleScreen.tsx`, `DshPartnerOrdersScreen.tsx`, `ControlPanelDshPartnerApprovalsScreen.tsx` | ACTIVE_NOT_CLOSED | surface links واضحة، لكن partner intake backend غير مغلق |
| 15 | Captain Orders / Delivery | app-captain + control-panel ops | `DshCaptainOrdersScreen.tsx`, `CaptainOperationsScreen.tsx` | ACTIVE_NOT_CLOSED | captain execution واضح UI-wise، dispatch/runtime غير مغلق |
| 16 | Field Onboarding / Visits / Profile / Finance | app-field | field host and seven screens | ACTIVE_NOT_CLOSED | direct host ownership قوي، لكن storage local-only |
| 17 | Control-panel Operations | control-panel | `OperationsHubScreen.tsx` + 10 workspaces | ACTIVE_NOT_CLOSED | route حي، لكن كل البيانات تقريبًا preview |
| 18 | Control-panel Marketing / Growth / Banners | control-panel + app-client | marketing root + 4 decks + client home/banner usage | ACTIVE_NOT_CLOSED | أفضل cross-surface candidate، لكن ما يزال store-backed |
| 19 | Support / Rating | weak scattered evidence only | order/support references and closure maps | EVIDENCE_THIN | لا يوجد screen root مستقل مغلق يبرر حزمة أولى مستقلة |

## 8. Data / Fixture / Runtime Inventory

| Area | Source | Source type | Consumed by | Runtime truth allowed? | Notes |
| --- | --- | --- | --- | --- | --- |
| Runtime classification baseline | `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | documentation evidence | this inventory and DSH docs | YES for classification only | المرجع الأول لمنع claims التشغيل الكاذبة |
| Home discovery data | `dsh/frontend/app-client/home/fixtures/dshHomeGetFixtures.ts` | fixture | `DshHomeGetScreen.tsx` | NO | home content fixture-driven |
| Banner store | `dsh/frontend/shared/marketing/banner-store.ts` | seed + preview store | client home and control-panel banners | NO | publish state محلي لا يساوي runtime API truth |
| Growth store | `dsh/frontend/shared/marketing/growth-store.ts` | seed + preview store | growth deck and client promo surfaces | NO | live/pending هنا store semantics فقط |
| Smart signal fixtures | `dsh/frontend/control-panel/marketing/SmartSignalLayer/news-ticker-fixtures.ts` | fixture | signal layer | NO | ticker/signal demo evidence فقط |
| Operations workspace data | `dsh/frontend/control-panel/operations/operations.preview-data.ts` | preview data | operations hub and its workspaces | NO | control-room visualization فقط |
| Field onboarding storage | `dsh/frontend/app-field/onboarding/FieldOnboardingStorage.ts` | localStorage + seed fallback | field onboarding flow | NO | local persistence لا يساوي backend sync |
| Seed media assets | `dsh/media-fixtures/assets/seed/dsh/*` | seed media | client home/store visuals | NO | 20 asset files + README within media-fixtures tree |
| WLT dependency | `wlt/frontend/app-client/dsh/hooks/useWlt.ts` | runtime dependency path | checkout/payment-adjacent client flow | PARTIAL | يثبت dependency path لا اكتمال checkout |
| OpenAPI contract file | `dsh/dsh.openapi.yaml` | contract source | future API binding | NO for runtime | وجود العقد لا يثبت implementation |
| Backend tree | `dsh/backend/**` | scaffold/backend source | none proven end-to-end | NO | scaffold presence only |
| Domain tree | `dsh/domain/**` | domain source | none proven end-to-end | NO | minimal domain footprint |

## 9. API / Contract Gap Inventory

| Capability slice | Current UI proof | Contract / API status | Gap level | Note |
| --- | --- | --- | --- | --- |
| Home discovery | client home screen exists | screen/API matrix says not ready | HIGH | no live discovery endpoint proven |
| Banners / promos | client + control-panel proof exists | no publish API closure proven | HIGH | store-backed only |
| Categories | client + catalogs governance proof exists | no live category contract closure proven | HIGH | category governance remains UI-level |
| Storefront / products | store screens exist | no live product/store contract closure proven | HIGH | fixture catalog |
| Cart summary | cart screen exists | downstream order/checkout contract not closed | HIGH | local/cart UI only |
| Checkout / payment | UI adjacency exists | explicitly WLT/auth blocked | CRITICAL | not suitable as first package |
| Orders / tracking | screens exist across four surfaces | matrix says not ready | HIGH | lifecycle API not closed |
| Partner preparation | partner screens + partner approvals exist | matrix says not ready | HIGH | intake/approval pipeline not closed |
| Captain delivery | captain screens + ops workspace exist | matrix says not ready | HIGH | delivery runtime missing |
| Field onboarding / visit | field flows exist | no sync API proven | HIGH | local-only persistence |
| Control-panel operations | section alive | preview-only data, no operational API closure | HIGH | governance view not runtime proof |
| Control-panel marketing / catalogs / partners | sections alive | no end-to-end publish/approval APIs closed | HIGH | governance shells only |
| Support / rating | scattered evidence only | no explicit closed contract slice found | MEDIUM | defer until stronger route/API proof |

## 10. Backend / Domain Gap Inventory

| Area | Existing evidence | Status | Missing from closure perspective | Note |
| --- | --- | --- | --- | --- |
| Discovery and storefront orchestration | frontend-heavy only | NOT_CLOSED | live read models, store/product services, bound endpoints | client screens outpace backend proof |
| Cart / checkout orchestration | WLT dependency path only | BLOCKED | order pricing, checkout orchestration, payment settlement flows | WLT does not equal local completion |
| Partner intake and approval | partner UI + control-panel partner approvals | NOT_CLOSED | partner state machine, approval backend, audit trail | governance UI exists ahead of backend proof |
| Captain dispatch lifecycle | captain UI + control-panel ops | NOT_CLOSED | assignment, trip state, proof-of-delivery backend | ops view is preview-driven |
| Field onboarding and visit sync | field host + local storage | NOT_CLOSED | sync backend, persistence API, reconciliation | current truth is local |
| Marketing publish and growth governance | control-panel decks + shared stores | NOT_CLOSED | campaign publish API, scheduling, analytics truth | current source is seed/preview store |
| Catalog governance | catalogs + partner handoff screens | NOT_CLOSED | authoritative catalog/domain services and publish rules | governance lane is visible but not closed |

## 11. Auth / WLT / Payment Dependency Notes

| Area | Dependency / rule | Effect on closure order | Evidence |
| --- | --- | --- | --- |
| Home / discovery / banners / categories | no WLT block proven | can start early | blueprint + runtime evidence matrix |
| Storefront / browsing | no payment block at browse stage | can start early | client store screens + matrices |
| Cart | adjacent to payment but not identical to payment | can start after discovery/storefront | cart screen + WLT path |
| Checkout | WLT + auth dependency | do not start first | `useWlt.ts`, blueprint, screen/API matrix |
| Payment / settlement | WLT-controlled | blocked until WLT/auth package exists | blueprint notes |
| Order history / tracking | likely auth-sensitive | start only after discovery/storefront packages | screen/API matrix + client/captain/partner flows |
| Partner / captain / field surfaces | role-bound surfaces | require role/auth truth before closure claims | surface shells and blueprint actor model |
| Control-panel sections | operational governance surface | route proof exists, runtime closure does not | runtime pages + section hosts |

## 12. Orphan / Dead / Duplicate Candidate List

### A) Active / Consumed Evidence

| Evidence anchor | What it proves | Decision |
| --- | --- | --- |
| `dsh/frontend/app-client/DshSurfaceHost.tsx` direct renders notifications, benefits, favorites, bell, search, cart, store, entry, home, awnak, shein, my-space | app-client active surface is real, not documentation-only | client surface stays in active count |
| `dsh/frontend/app-field/FieldSurfaceHost.tsx` directly renders all seven field screens | app-field has full direct ownership proof | field surface stays fully active |
| `dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx` directly renders banners, growth, signals, loyalty decks | control-panel marketing child decks are consumed, not orphaned | keep all four marketing decks active |
| `dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx` directly renders `ControlPanelDshCatalogCategoriesScreen` | categories screen is nested active, not dead | keep categories screen in active count |
| `dsh/frontend/control-panel/operations/OperationsHubScreen.tsx` owns canonical operation workspace switching | operations sub-screens are consumed by hub | keep 10 workspace screens active |
| `app-partner/composition/compat.tsx` plus partner shell imports entry, orders, inventory, console | partner root screens are active even though some flow names are compat aliases | keep 4 partner roots active |
| `app-captain/shell/CaptainSurfaceHost.tsx` plus captain composition imports entry, orders, finance, profile | captain root screens are active | keep 4 captain roots active |

### B) Unused / Orphan Candidates

| File | Classification | Why it is not counted active | Guardrail |
| --- | --- | --- | --- |
| `dsh/frontend/app-client/gas/screens/DshGasRefillOrderCreateScreen.tsx` | ORPHAN_CANDIDATE | لم يظهر أي host/shell render مباشر؛ الموجود فقط export wrapper | لا يُحذف؛ يُربط أو يُعزل داخل package لاحقة |
| `dsh/frontend/app-partner/operations/screens/DshPartnerOperationsDirectoryScreen.tsx` | ORPHAN_CANDIDATE | لم يظهر live shell consumer داخل partner host chain | لا يُحذف قبل route proof أو retirement package |
| `dsh/frontend/app-captain/operations/DshCaptainOperationsScreen.tsx` | ORPHAN_CANDIDATE | لم يظهر استهلاك حي داخل captain shell | لا يُحذف قبل قرار capability واضح |
| `dsh/frontend/app-client/loyalty/screens/DshBenefitsHubScreen.tsx` | DUPLICATE_ALIAS_CANDIDATE | wrapper alias فقط لـ `SubscriptionsHubScreen.tsx` | يُبقى حاليًا لتجنب كسر الاستيراد |
| `dsh/frontend/app-client/my_space/screens/DshMySpaceCommercialScreen.tsx` | NESTED_ONLY | يستهلك داخل `DshMySpaceScreen.tsx` فقط | لا يُحسب route root مستقل |
| `dsh/frontend/app-client/my_space/screens/DshMySpaceOrdersScreen.tsx` | NESTED_ONLY | يستهلك داخل `DshMySpaceScreen.tsx` فقط | لا يُحسب route root مستقل |

## 13. Recommended Closure Order (Top 5)

| Rank | Capability-first package | Why first | Surfaces touched | Why not blocked first |
| ---: | --- | --- | --- | --- |
| 1 | Banner Carousel / Promos / Marketing | أوضح capability cross-surface بين control-panel والعميل، مع route ownership واضح وبدون WLT block مباشر | control-panel + app-client | data store preview-based لكنه غير مربوط payment/auth مباشرة |
| 2 | Home / Store Discovery | أعلى surface impact وأوضح مساحة يمكن تحويلها من fixture إلى runtime in slices | app-client | لا يتطلب payment path في البداية |
| 3 | Storefront / Product Browsing | يكمل الاكتشاف بعد home ويمنع القفز المبكر إلى checkout | app-client + catalogs governance references | ما يزال قبل WLT والمالية |
| 4 | Control-panel Operations | يقدّم غرفة تشغيل مركزية يمكن ربطها later بالحقائق التشغيلية | control-panel | route/workspace ownership واضح جدًا حتى لو البيانات preview-only |
| 5 | Partner Console / Preparation | يربط partner surface مع partners/catalogs governance ويخلق مسار handoff عملي | app-partner + control-panel partners/catalogs | أسهل من captain/checkout لأن WLT ليس blocker مباشرًا هنا |

ما يجب عدم البدء به أولًا:

- checkout/payment/settlement بسبب dependency الصريح على WLT/auth.
- orphan candidates قبل وجود قرار capability package يثبت الحاجة إليها أو يلغيها.
- أي slice يستند فقط إلى dashboard/read-only evidence من دون route owner واضح.

## 14. Final Status & Guardrails

**Final Status:** `PASS_WITH_WARNINGS`

هذا الجرد يحقق هدفه كمرجع مركزي واحد لفهم DSH عبر الأسطح، لكنه لا يعلن أي capability أو surface على أنه closed أو production-ready.

التحذيرات الحاكمة:

- runtime truth ما يزال غير مثبت لمعظم السلوكيات المهمة.
- API/backend/domain لم تُغلق بعد، وبعضها scaffold أو TBD فقط.
- orphan candidates معزولة لكن غير محسوم مصيرها بعد.
- control-panel operations وmarketing وcatalogs تعطي evidence بصري/حوكمي قوي، لكنها ليست دليلًا وحدها على truth تشغيلي كامل.
- أي انتقال لاحق من هذا الملف إلى closure package يجب أن يكون capability-first لا file-first.

قواعد متابعة إلزامية بعد هذا الملف:

- لا حذف لأي orphan candidate قبل إثبات route replacement أو retirement package مستقل.
- لا claim تشغيل حي لأي fixture/seed/localStorage/media source.
- لا البدء بـ checkout/payment قبل حزمة WLT/auth صريحة.
- الحزم التالية يجب أن تُبنى من `Top 5` أعلاه، وبالترتيب ما لم يظهر evidence أقوى يبرر خلاف ذلك.
