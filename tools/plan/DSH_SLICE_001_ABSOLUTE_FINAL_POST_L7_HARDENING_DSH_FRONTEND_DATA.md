يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

نفّذ داخل C:\bthwani-suite فقط.
الفرع الحالي: ghb/0166-20260525-000810-dsh-governance-knz.
لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

المهمة:
DSH-SLICE-001 — ABSOLUTE FINAL POST-L7 FRONTEND HARDENING + CENTRAL DSH PREVIEW DATA OWNERSHIP + ANTI-NOISE CLOSURE.

الهدف:
إغلاق كل ما تبقى من الشريحة الأولى 100% من ناحية:
- تنظيم ملفات الواجهة.
- منع التضخم.
- منع التبعثر والتشظي.
- منع التكرار والتسرب والتناقض والكود الميت.
- حسم مكان البيانات التجريبية لكل DSH.
- نقل كل ملفات وبيانات preview التجريبية الدومينية لكل أسطح DSH إلى المالك المركزي:
  dsh/frontend/data
- منع وجود preview/runtime truth داخل ملفات الشاشات.
- منع تكرار customers/products/categories/orders/branches/stores/offers/wallet/support بين الأسطح.
- تثبيت ملكية التصميم بدون تضخيم @bthwani/ui-kit.
- إثبات سرعة Home وStore بقياس واضح.
- إثبات أن كل الحراس المناسبة مفعّلة وتعمل.
- المحافظة على L7_CLOSED وعدم كسره.

السياق الحالي المثبت:
- DSH-SLICE-001 موثقة كـ L7_CLOSED.
- HomeScreenContent.tsx وStoreScreenContent.tsx تم حذفهما/استبدالهما، لذلك ممنوع إعادة إنشائهما أو التعامل معهما كأهداف تفكيك.
- المطلوب فقط التحقق من عدم وجود references قديمة لهما.
- HomeScreen.tsx صار Screen Orchestrator يستدعي hooks وHomeScreenShell.
- StoreScreen.tsx صار Screen Orchestrator يستدعي hooks وStoreScreenShell.
- التضخم المتبقي المحتمل في:
  dsh/frontend/app-client/parts/home/HomeScreenShell.tsx
  dsh/frontend/app-client/parts/store/StoreScreenShell.tsx
  وبعض sections/hooks/sheets المرتبطة.
- الأولوية الأعلى: StoreScreenShell لأنه يجمع preview + gesture + measurement + search + visibility + hero + menu wiring.
- الأولوية الثانية: HomeScreenShell لأنه يركب أقسام كثيرة ويمرر props واسعة.
- DSH is integrated by default: domain preview entities are central unless proven screen-only.
- Shared domain data lives in:
  dsh/frontend/data
- Surfaces may own only presentation adapters, view models, labels, layout state, and screen-only UI fixtures.
- Never duplicate contradictory customers/products/categories/orders across DSH surfaces.
- Never treat preview/fixtures as runtime/API truth.
- ممنوع خلط preview fallback مع runtime truth.

المالك المركزي المطلوب للبيانات التجريبية الدومينية:
dsh/frontend/data/
  customers.preview-data.ts
  stores.preview-data.ts
  branches.preview-data.ts
  products.preview-data.ts
  categories.preview-data.ts
  orders.preview-data.ts
  delivery-modes.preview-data.ts
  wallet.preview-data.ts
  offers.preview-data.ts
  subscriptions.preview-data.ts
  support.preview-data.ts
  operational-statuses.preview-data.ts
  index.ts

القواعد غير القابلة للكسر:
1. لا تغيّر UI بصريًا.
2. لا تغيّر routes.
3. لا تغيّر dsh.openapi.yaml.
4. لا تضف endpoint.
5. لا تفتح cart/checkout/WLT/payment.
6. لا تكسر L7_CLOSED.
7. لا تنشئ components/ عشوائي.
8. لا تنشئ common/misc/generic/utils كملفات dumping ground.
9. لا تضخم @bthwani/ui-kit.
10. لا تنشئ أي ملف جديد داخل @bthwani/ui-kit في هذه المهمة.
11. لا تنقل أي شيء إلى ui-kit الآن؛ فقط استخدم الموجود منه ووثّق المرشحات المستقبلية.
12. توجب الالتزام بنظام الألوان المركزي.
13. تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
14. ممنوع نقل التضخم من ملف إلى ملف آخر.
15. ممنوع ترك Shell أو Section يتحول إلى God Object جديد.
16. ممنوع PASS بدون evidence وأرقام وفحوصات.
17. ممنوع إعادة إنشاء HomeScreenContent.tsx أو StoreScreenContent.tsx.
18. ممنوع وضع preview/data fixtures داخل screens.
19. ممنوع وضع domain preview entities داخل app-client/data أو app-partner/data أو app-captain/data أو app-field/data أو control-panel/data.
20. ممنوع وجود runtime truth أو API response truth داخل data.
21. ممنوع وجود fetch مباشر داخل screens أو parts.
22. ممنوع وجود Tamagui import مباشر خارج ui-kit.
23. ممنوع إنشاء ملفات كثيرة بلا owner واضح.
24. ممنوع إخفاء النقص بتوثيق شكلي.
25. ممنوع إنشاء بيانات متناقضة لنفس العميل/المتجر/الفرع/المنتج/الفئة/الطلب/المحفظة/العرض/الدعم في أكثر من سطح.
26. ممنوع بقاء أي fixture دوميني داخل surfaces بعد اعتماد dsh/frontend/data إلا إذا ثبت أنه screen-only UI fixture وليس domain entity.

المرحلة 0 — Reality Sync كامل قبل أي تعديل:
افحص الواقع الحالي فعليًا وسجّله في:
dsh/docs/DSH_FILE_SIZE_RISK_MATRIX.md

تحت قسم جديد باسم:
ABSOLUTE_FINAL_POST_L7_REALITY_SYNC

يجب أن يحتوي:
1. تأكيد أن HomeScreenContent.tsx غير موجود وغير referenced في الكود.
2. تأكيد أن StoreScreenContent.tsx غير موجود وغير referenced في الكود.
3. عدد أسطر:
   - dsh/frontend/app-client/screens/HomeScreen.tsx
   - dsh/frontend/app-client/screens/StoreScreen.tsx
   - dsh/frontend/app-client/parts/home/HomeScreenShell.tsx
   - dsh/frontend/app-client/parts/store/StoreScreenShell.tsx
4. أكبر 20 ملفًا داخل:
   - dsh/frontend/app-client/parts/home
   - dsh/frontend/app-client/parts/store
   - dsh/frontend/app-client/hooks
   - dsh/frontend/app-client/shared
   - dsh/frontend/app-client/data
   - dsh/frontend/app-client/sheets
   - dsh/frontend/app-partner
   - dsh/frontend/app-captain
   - dsh/frontend/app-field
   - dsh/frontend/control-panel
   - dsh/frontend/shared
   - dsh/frontend/data إن وجد
5. جدول لكل ملف كبير:
   - المسؤولية الحالية.
   - هل المسؤولية صحيحة؟
   - هل يحتاج تفكيك؟
   - المالك الصحيح.
   - القرار: KEEP / SPLIT_NOW / DELETE_DEAD / MOVE_OWNER / DOC_ONLY.
6. فحص references القديمة:
   - HomeScreenContent
   - StoreScreenContent
   - BATCH_7 غير المعلمة Historical
   - pending / withheld / FIX_REQUIRED داخل سياق DSH-SLICE-001
7. فحص أن L7_CLOSED لا يتعارض مع أي نص قديم داخل ملفات الشريحة.
8. لا تنتقل للمرحلة 1 قبل اكتمال هذا الجرد.

المرحلة 1 — تنظيف التوثيق والتناقضات:
نظّف:
- dsh/docs/DSH_FILE_SIZE_RISK_MATRIX.md
- dsh/docs/slices/DSH-SLICE-001-STORE-DISCOVERY.md
- dsh/docs/RUNTIME_EVIDENCE_MATRIX.md إذا لزم

المطلوب:
1. فصل واضح بين:
   - Historical Batches
   - Current Truth
   - Absolute Final Post-L7 Frontend Hardening
   - Central DSH Preview Data Ownership
2. أي نص قديم يقول إن HomeScreen.tsx أو StoreScreen.tsx ما زالا God Objects يجب وسمه Historical/Superseded إذا لم يعد صحيحًا.
3. أي نص يطلب HomeScreenContent.tsx أو StoreScreenContent.tsx يجب تحديثه لأنه لم يعد هدفًا.
4. أي نص يقول إن البيانات الدومينية الخاصة بـ DSH توضع افتراضيًا داخل app-client/data يجب تحديثه إلى:
   dsh/frontend/data
5. لا تترك L7_CLOSED مع pending/withheld/FIX_REQUIRED داخل نفس سياق DSH-SLICE-001.
6. لا تغيّر قرارات الشرائح الأخرى.
7. القرار المؤقت بعد هذه المرحلة:
   POST_L7_FRONTEND_HARDENING_IN_PROGRESS
   أو
   FIX_REQUIRED_DOC_CONSISTENCY.

المرحلة 2 — إنشاء/اعتماد المالك المركزي dsh/frontend/data:
إذا لم يكن المجلد موجودًا، أنشئ:
dsh/frontend/data/

ويجب أن يحتوي هذا الهيكل فقط حسب الحاجة الفعلية، مع index.ts مركزي:

dsh/frontend/data/
  customers.preview-data.ts
  stores.preview-data.ts
  branches.preview-data.ts
  products.preview-data.ts
  categories.preview-data.ts
  orders.preview-data.ts
  delivery-modes.preview-data.ts
  wallet.preview-data.ts
  offers.preview-data.ts
  subscriptions.preview-data.ts
  support.preview-data.ts
  operational-statuses.preview-data.ts
  index.ts

القواعد:
1. هذا هو المالك المركزي الافتراضي لكل DSH domain preview entities.
2. لا تنشئ كل الملفات إذا لا توجد بيانات فعلية لها، إلا إذا كان وجود الملف مطلوبًا كعقد تصدير فارغ موثق.
3. index.ts يجب أن يصدّر الملفات الموجودة فقط.
4. لا تجعل index.ts dumping ground.
5. لا تضع UI JSX أو callbacks أو runtime truth داخل هذه الملفات.
6. لا تضع API response truth داخل هذه الملفات.
7. لا تضع secrets أو env أو fetch أو network code داخل هذه الملفات.
8. لا تخلط preview fallback مع runtime proof.

المرحلة 3 — حسم ملكية البيانات التجريبية لكل DSH:
افحص كل الملفات التالية:
- dsh/frontend/data/*
- dsh/frontend/app-client/data/*
- dsh/frontend/app-partner/**/*
- dsh/frontend/app-captain/**/*
- dsh/frontend/app-field/**/*
- dsh/frontend/control-panel/**/*
- dsh/frontend/shared/*preview*
- dsh/frontend/shared/*fixture*
- dsh/frontend/shared/**/*preview*
- dsh/frontend/shared/**/*fixture*
- dsh/frontend/app-client/screens/*
- dsh/frontend/app-client/parts/*
- dsh/frontend/app-client/hooks/*
- dsh/frontend/app-client/shared/*

أضف في DSH_FILE_SIZE_RISK_MATRIX.md قسمًا باسم:
CENTRAL_DSH_PREVIEW_DATA_OWNERSHIP_AUDIT

القواعد:
1. dsh/frontend/data = المالك المركزي لكل domain preview entities داخل DSH.
2. surfaces may own only:
   - presentation adapters
   - view models
   - labels
   - layout state
   - screen-only UI fixtures
3. ممنوع وجود fixture arrays أو mock datasets الدومينية داخل:
   - screens
   - parts
   - hooks
   - surface folders
   إلا إذا ثبت أنها screen-only UI fixture وليست domain entity.
4. domain preview data تشمل على الأقل:
   - customers
   - stores
   - branches
   - products
   - categories
   - orders
   - delivery modes
   - wallet
   - offers
   - subscriptions
   - support
   - operational statuses
5. أي fixture خاص بسطح واحد فقط لكنه domain entity ينتقل إلى dsh/frontend/data.
6. أي fixture خاص بسطح واحد فقط وليس domain entity، مثل UI-only layout demo، يجوز أن يبقى في سطحه مع توثيق السبب.
7. أي fixture مستخدم عبر أكثر من سطح يجب أن يكون في dsh/frontend/data.
8. أي fixture ميت أو غير مستخدم يحذف فقط بعد إثبات عدم الاستخدام.
9. أي تكرار بين أي surface وdsh/frontend/data يجب حسمه بمالك واحد فقط.
10. أي تكرار بين dsh/frontend/shared وdsh/frontend/data يجب حسمه:
    - domain preview entity → dsh/frontend/data
    - shared logic/model/helper → dsh/frontend/shared
11. لا توجد imports من app-client/data داخل سطح آخر غير app-client.
12. لا توجد imports من surface/data إلى surface آخر.
13. أي استيراد للبيانات الدومينية يكون من dsh/frontend/data فقط.

اكتب نتيجة لكل ملف data/preview/fixture:
- path
- current owner
- proposed owner
- usage
- domain entity? yes/no
- screen-only UI fixture? yes/no
- shared across surfaces? yes/no
- contains UI? yes/no
- contains runtime truth? yes/no
- contains API response truth? yes/no
- contains callback/navigation? yes/no
- contains WLT/payment/checkout semantics? yes/no
- decision: KEEP_CENTRAL / MOVE_TO_DSH_FRONTEND_DATA / KEEP_SCREEN_ONLY / SPLIT / DELETE_DEAD / FIX_REQUIRED

القرار النهائي لهذه المرحلة:
CENTRAL_DATA_OWNERSHIP_PASS
أو
FIX_REQUIRED_CENTRAL_DATA_OWNERSHIP.

المرحلة 4 — تنفيذ نقل البيانات التجريبية إلى dsh/frontend/data:
نفّذ النقل فقط بعد audit واضح.

المطلوب:
1. انقل domain preview entities من app-client/data أو أي surface أو shared preview location إلى dsh/frontend/data.
2. حدّث imports في الأسطح لتقرأ من dsh/frontend/data.
3. إذا كانت الأسطح تحتاج صياغة خاصة، أنشئ/استخدم presentation adapters داخل السطح، وليس duplicate data.
4. لا تغيّر القيم الدلالية للبيانات إلا لإزالة التناقض أو التكرار.
5. إذا وجدت customers/products/categories/orders متناقضة بين سطحين، لا تختر عشوائيًا:
   - وثّق التناقض.
   - وحّد المالك في dsh/frontend/data.
   - اجعل السطح يملك view model أو label فقط.
6. لا تحذف data surface files إلا إذا أصبحت فارغة أو ميتة.
7. إذا بقي surface/data لسبب screen-only UI fixture، وثّق السبب.
8. حدّث index.ts في dsh/frontend/data.
9. لا تغيّر runtime/API أو OpenAPI.

المرحلة 5 — ميزانية الملفات والملكية:
أضف جدولًا باسم:
FINAL_TARGET_FILE_BUDGET_AND_OWNERSHIP

الميزانية:
- screens/HomeScreen.tsx: 80–260 سطر، Screen Orchestrator فقط.
- screens/StoreScreen.tsx: 40–180 سطر، Screen Orchestrator فقط.
- parts/home/HomeScreenShell.tsx: أقل من 280 سطر.
- parts/store/StoreScreenShell.tsx: أقل من 280 سطر.
- كل Section file: 60–260 سطر.
- كل Hook file: 40–220 سطر.
- كل shared helper file: 40–220 سطر.
- كل data preview file: 40–260 سطر، domain data فقط بدون UI/runtime.
- كل sheet file: 80–280 سطر.
- style files مستثناة جزئيًا بشرط أن تكون style/token maps فقط بدون business logic أو runtime logic.

إذا تجاوز أي ملف الميزانية:
- إما تفكيكه.
- أو توثيق سبب مقنع.
- أو الخروج بـ FIX_REQUIRED_FILE_BUDGET.

المرحلة 6 — تفكيك StoreScreenShell أولًا:
ابدأ بـ:
dsh/frontend/app-client/parts/store/StoreScreenShell.tsx

المطلوب:
- لا تغيّر UI.
- لا تغيّر route.
- لا تغيّر API.
- لا تنشئ ملفات كثيرة.
- لا تنشئ StoreMisc / StoreUtils / StoreCommon.
- استخدم الملفات الحالية أولًا قبل إنشاء جديد.

افحص وانقل فقط عند وجود تضخم فعلي:
1. visibility / non-ready:
   - يبقى في StoreNonReadyState إذا كان موجودًا.
   - أو hook/part واضح إذا كان shell ما زال يمسك logic زائد.
2. preview / gesture:
   - إلى StoreImagePreviewSheet أو useStorePreviewState/useStoreGestureHandlers.
3. measurement:
   - إلى StoreMeasurementSheet أو useStoreMeasurementState.
4. hero/list header:
   - إلى StoreHeroSection أو hook واضح.
5. inline search:
   - إلى useStoreInlineSearch أو StoreInlineSearchSection إذا كان UI منفصلًا.
6. visible/menu/category derived data:
   - إلى useStoreDerivedItems فقط.
7. cart confirmation visual:
   - إلى StoreCartConfirmationSection إن كان موجودًا أو مطلوبًا بوضوح.

ممنوع:
- تكرار store-formatting.
- تكرار store-search-helpers.
- تكرار resolveDshStoreClientVisibility.
- تكرار measurement logic.
- نقل primitive محلي بدل استخدام ui-kit الموجود.
- إنشاء ملفات جديدة بدون مالك واضح.

قبول Store:
- StoreScreen.tsx يبقى Orchestrator صغيرًا.
- StoreScreenShell يصبح shell وتركيب فقط.
- StoreScreenShell لا يجمع gesture + measurement + hero + list + search + visibility في نفس الملف.
- لا يظهر God Object جديد.
- لا تغيير بصري.
- لا route/API change.

المرحلة 7 — مراجعة HomeScreenShell:
افحص:
- dsh/frontend/app-client/screens/HomeScreen.tsx
- dsh/frontend/app-client/parts/home/HomeScreenShell.tsx
- dsh/frontend/app-client/parts/home/*
- dsh/frontend/app-client/hooks/useHome*

المطلوب:
1. إزالة any غير الضرورية واستبدالها بأنواع واضحة إذا كانت متوفرة.
2. منع props blob غير مفهوم؛ كل prop group يجب أن يكون له معنى.
3. HomeScreenShell يجب أن يكون shell فقط:
   - يركّب header/promo/filter/feed/video/service dial.
   - لا يمسك search/filter/promo/video logic الثقيل.
4. أي logic زائد ينقل إلى hook موجود أو section واضح.
5. لا تنشئ ملفات إضافية إذا Home مقبول.
6. لا تكرر home-search-helpers أو home-promo-mappers.

قبول Home:
- HomeScreen.tsx Orchestrator واضح.
- HomeScreenShell shell فقط.
- sections تحمل UI.
- hooks تحمل derived state/handlers.
- لا تغيير بصري.
- لا route/API change.

المرحلة 8 — Anti-noise / Leakage / Dead Code Sweep:
افحص بدقة:
- unused imports.
- unused exports.
- orphan files.
- duplicate helpers.
- duplicate hooks.
- duplicate state.
- duplicate styles.
- old re-export layers.
- fallback paths غير قابلة للوصول.
- preview files غير مستخدمة.
- references إلى HomeScreenContent أو StoreScreenContent.
- local design primitive مكرر بدل ui-kit.
- hardcoded colors الجديدة.
- Tamagui imports خارج ui-kit.
- fetch مباشر داخل screens/parts.
- أي WLT/cart/checkout/payment leak داخل discovery.
- أي fixture داخل screens/parts/hooks.
- أي domain preview entity خارج dsh/frontend/data.
- أي imports من app-client/data خارج app-client.
- أي contradictory preview entities عبر أسطح DSH.

المطلوب:
- احذف فقط ما ثبت أنه ميت.
- لا تحذف preview fallback المطلوب.
- لا تحذف runtime fallback المطلوب.
- لا تحذف evidence.
- لا تغيّر L7_CLOSED إلا إذا فشل التحقق.
- وثّق كل حذف/دمج/نقل في DSH_FILE_SIZE_RISK_MATRIX.md.

المرحلة 9 — Design Ownership Audit:
افحص كل visual pattern داخل Home/Store.

القرار لكل نمط:
- existing ui-kit primitive: استخدمه ولا تكرره.
- DSH client composition: يبقى في parts/home أو parts/store.
- behavior/state: hooks.
- mapper/format/search: shared.
- overlay/sheet: sheets أو part واضح.
- domain preview/static data: dsh/frontend/data.
- screen-only UI fixture: surface owner مع توثيق السبب.
- reusable across surfaces but not urgent: وثقه فقط تحت Future UI-kit Candidate.

ممنوع:
- لا تضف ui-kit files.
- لا تعدّل ui-kit.
- لا تنقل DSH-specific logic إلى ui-kit.
- لا تترك design primitive مكررًا محليًا إذا يوجد بديل ui-kit قائم.

اكتب في DSH_FILE_SIZE_RISK_MATRIX.md:
DESIGN_OWNERSHIP_RESULT

ويحتوي:
- UI-kit reused list.
- app-client composition list.
- hooks/shared logic list.
- central data ownership list.
- screen-only fixture exceptions.
- future ui-kit candidates للتوثيق فقط.
- no ui-kit changes confirmation.

المرحلة 10 — Performance Verification حقيقي:
لا تقبل ملاحظات شكلية.

يجب قياس:
1. Home open time.
2. Store open time.
3. Home scroll.
4. Store scroll.
5. inline search typing latency.
6. Home → Store transition.
7. هل inline search يعيد render كامل الشاشة؟
8. هل Store preview/measurement/gesture يعيد render list كاملة؟
9. هل DshClientSurface state يسبب re-render غير مرتبط؟

أنشئ:
tools/registry/runs/DSH_SLICE_001_POST_L7_HARDENING-YYYYMMDD-HHMMSS/PERFORMANCE_NOTES.md

ويجب أن يحتوي:
- طريقة القياس.
- الجهاز/السطح.
- أرقام أو console timing أو recording note.
- سبب البطء الفعلي قبل الإصلاح.
- ما تم إصلاحه.
- هل بقي jank؟ نعم/لا.
- هل inline search ما زال سبب بطء؟ نعم/لا.
- القرار:
  PERF_PASS_POST_L7
  أو
  FIX_REQUIRED_PERFORMANCE_HARDENING

ممنوع PERF_PASS_POST_L7 بدون قياس أو مشاهدة فعلية موثقة.

المرحلة 11 — Evidence Package:
أنشئ evidence folder:
tools/registry/runs/DSH_SLICE_001_POST_L7_HARDENING-YYYYMMDD-HHMMSS/

يجب أن يحتوي:
- SUMMARY.md
- FILE_SIZE_BEFORE_AFTER.md
- CENTRAL_DATA_OWNERSHIP_AUDIT.md
- PERFORMANCE_NOTES.md
- git-status-short.txt
- git-diff-stat.txt
- guard-results.txt
- text-check-results.txt
- no-old-content-reference-results.txt
- data-fixture-location-results.txt
- central-data-import-results.txt
- contradiction-sweep-results.txt
- لقطة Home وStore بعد hardening إن حصل أي لمس UI، وحتى بدون تغيير بصري يفضل توثيق لقطة تحقق.
- zip بنفس اسم SESSION_ID داخل نفس المجلد:
  {SESSION_ID}.zip

المرحلة 12 — Verification Gates:
شغّل ولا تكمل إذا فشل أي أمر:

pnpm run openapi:lint:dsh
pnpm run openapi:types:dsh
pnpm run guard:service-runtime -- --service dsh --slice DSH-SLICE-001
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:tamagui-import-boundary
pnpm run guard:service-blueprint
pnpm run guard:binding-proof
pnpm run guard:secret-scan

ثم نفّذ فحص نصي وسجّل النتيجة:
- لا يوجد HomeScreenContent.tsx referenced في الكود.
- لا يوجد StoreScreenContent.tsx referenced في الكود.
- لا يوجد direct fetch داخل screens/parts.
- لا يوجد Tamagui import مباشر خارج ui-kit.
- لا يوجد hardcoded color جديد.
- لا يوجد ui-kit file جديد.
- لا يوجد route/API change.
- لا يوجد WLT/cart/checkout/payment touch داخل Slice 001.
- لا يوجد L7_CLOSED مع pending/withheld/FIX_REQUIRED داخل سياق DSH-SLICE-001.
- لا يوجد ملف جديد بلا مالك واضح.
- لا يوجد Shell/Section تجاوز الميزانية بدون سبب موثق.
- لا توجد data fixtures داخل screens.
- لا توجد preview data تُعامل كruntime truth.
- لا توجد domain preview entities خارج dsh/frontend/data إلا screen-only UI fixtures موثقة.
- لا توجد fixture مشتركة خارج dsh/frontend/data.
- لا توجد imports من app-client/data داخل أي سطح آخر.
- لا توجد imports من surface/data إلى surface/data آخر.
- لا توجد customers/products/categories/orders/stores/branches/wallet/offers/subscriptions/support/operational-statuses متناقضة عبر DSH surfaces.
- dsh/frontend/data/index.ts يصدّر كل ملفات preview المركزية الموجودة فقط.

المرحلة 13 — Documentation Final Sync:
حدّث فقط:
- dsh/docs/DSH_FILE_SIZE_RISK_MATRIX.md
- dsh/docs/slices/DSH-SLICE-001-STORE-DISCOVERY.md إذا احتاج سطر Post-L7 hardening مختصر.
- dsh/docs/RUNTIME_EVIDENCE_MATRIX.md فقط إذا تغيرت صياغة evidence.
ولا تغيّر L7_CLOSED إلا إذا فشل hardening.

القرار النهائي:
POST_L7_FRONTEND_HARDENING_PASS
أو
FIX_REQUIRED_POST_L7_FRONTEND_HARDENING

لا تخرج بـ POST_L7_FRONTEND_HARDENING_PASS إذا:
- بقي StoreScreenShell أو HomeScreenShell God Object.
- بقيت data fixtures متسربة داخل screens.
- بقيت domain preview entities خارج dsh/frontend/data بدون استثناء screen-only موثق.
- بقيت app-client preview data مستخدمة عبر أكثر من سطح بدون نقل إلى dsh/frontend/data.
- بقيت preview data تُعامل كruntime/API truth.
- بقي تكرار helpers/state.
- بقيت مراجع كود لملفات HomeScreenContent أو StoreScreenContent.
- بقي تصميم محلي مكرر بدل ui-kit primitive موجود.
- زاد التشظي أو ظهرت ملفات كثيرة بلا مالك.
- لم تثبت سرعة Home وStore بقياس.
- فشل أي guard.
- بقيت أي warning غير مفسّرة تؤثر على النشر.
