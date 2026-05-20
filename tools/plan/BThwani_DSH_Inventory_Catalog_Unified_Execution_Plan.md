# أمر تنفيذ وخطة إغلاق كتالوج المخزون DSH — توحيد الفئات والمنتجات والصور بين العميل والشريك والكتالوج

> **الهدف:** تنفيذ إغلاق دقيق وعميق لمنطق كتالوج المخزون في تطبيق الشريك DSH، مع توحيد مصدر الفئات والمنتجات والصور مع تطبيق العميل والكتالوج المركزي، وإصلاح الأخطاء الحالية، وبناء فلترة هرمية عملية تصلح لآلاف المنتجات.
> **المسار المعتمد:** `C:\bthwani-suite`
> **نمط التنفيذ:** مظلة / منظومة متكاملة / Cross-surface consistency
> **النتيجة المطلوبة:** تنفيذ موثّق بالأدلة، بدون ادعاء إغلاق نهائي إلا بعد التحقق واللقطات.

---

## 0) أمر التنفيذ الجاهز لـ VS Code Copilot Chat

انسخ الأمر التالي كاملًا إلى VS Code Copilot Chat:

```text
يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء، ولا تتوقف إلا بعد إغلاقه بالأدلة، بصفر فجوات، صفر نقص، صفر تكرار، صفر أخطاء، صفر تناقض، صفر ضجيج، صفر ضعف في المنطق والتشغيل، صفر تشتت، صفر فشل، وصفر عيوب. لا تنتقل لأي مهمة أخرى قبل إنهاء هذه المهمة أو تسجيل BLOCKED بدليل واضح.

المسار المعتمد:
C:\bthwani-suite

المهمة:
إصلاح جذري لمنطق صفحة كتالوج المخزون في تطبيق الشريك DSH، لأن التنفيذ الحالي ما زال غير مغلق:
- الفئات الحالية في صفحة المخزون غير صحيحة لأنها تُصنع أو تُخلط محليًا داخل شاشة الشريك بدل الاعتماد على نفس مصدر الحقيقة المستخدم في تطبيق العميل والكتالوج المركزي.
- الفلترة الحالية لا تصلح لشريك لديه 5000+ منتج.
- يجب استخدام وتعميم منطق الفئات والمنتجات والصور الموجود في تطبيق العميل، لكن ليس نسخه حرفيًا؛ بل تحويله إلى مصدر shared ثم بناء فلترة أقوى للشريك.
- يجب عرض صور المنتجات وصورة المتجر وشعاره من media fixtures المشتركة.
- يجب إصلاح أي Render Error مثل expandedEditId بالكامل.
- يجب منع تكرار البيانات التجريبية بين app-client و app-partner.
- يجب ربط منطق المنتجات الخاصة بالمطاعم والمتاجر الاستثنائية بمسار الشركاء → التسويق → الكتالوج → ظاهر للعميل.

قاعدة المظلة:
BThwani منظومة واحدة متعددة الأسطح وليست تطبيقات منفصلة. لا يوجد منع أعمى لأي سطح. يجوز تعديل أي ملف إذا ثبت قبل APPLY أنه مرتبط مباشرة بإغلاق منطق:
- Inventory
- Catalog
- Shared taxonomy
- Shared media fixtures
- Partner local overrides
- Client product visibility
- Product approval workflow
- Store/private product intake
- Marketing review
- Catalog adoption
- Price/stock/availability impact
- Client surface consistency

لكن يمنع التعديل العشوائي أو غير المثبت بخريطة أثر.

النطاق الأساسي:
- dsh/frontend/shared/catalog.ts
- dsh/frontend/shared/dshStoreProductCardModel.ts
- dsh/frontend/shared/workflow.ts
- dsh/frontend/app-client/shared/resolve-image-source.ts
- dsh/frontend/app-client/screens/StoreScreen.tsx
- dsh/frontend/app-client/screens/StoreItemsScreen.tsx
- dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx

يجوز إضافة ملف shared واحد فقط إذا ثبتت الحاجة:
- dsh/frontend/shared/resolve-dsh-image-source.ts

ويجب فحص هذه المسارات عند الحاجة:
- dsh/media-fixtures/assets/seed/dsh/products
- dsh/media-fixtures/assets/seed/dsh/stores
- dsh/media-fixtures/assets/seed/dsh/logos
- dsh/frontend/app-field/
- wlt/frontend/shared/finance/

الممنوع:
- لا hardcoded colors.
- لا design system محلي.
- لا استيراد Tamagui مباشرة داخل screens/surfaces/apps.
- لا تضخيم ui-kit.
- لا إنشاء ملفات ui-kit جديدة.
- لا فئات مخترعة داخل InventoryCatalogScreen.
- لا بيانات demo منفصلة بين app-client و app-partner بلا سبب مثبت.
- لا raw workflow stages في UI.
- لا ظهور منتجات غير client-visible في تطبيق العميل.
- لا تعديل الاسم/الصورة/الفئة المركزية من تطبيق الشريك إذا المنتج catalog-owned.
- لا backend/API/database.
- لا استخدام أي مسار أو ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- لا تدّعِ PASS أو CLOSED أو 100% بدون أدلة تشغيل ولقطات.

التزام التصميم:
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- RTL صحيح: النص يمين، الأيقونة والنص في نفس الكتلة، action/chevron على الطرف المقابل، لا space-between يفصل العناصر.
- التصميم يجب أن يصلح لشريك لديه 5000+ منتج.
- الفلترة يجب أن تكون هرمية عملية، لا chips عشوائية.
- العرض الافتراضي يجب أن يكون dense list مناسب للسرعة، وليس بطاقات ضخمة لكل منتج.
- التفاصيل والتعديل تكون داخل المنتج نفسه أو داخل inspector منطقي لا يسبب تشتتًا.
- BottomNav يجب أن يبقى ظاهرًا بدون clipping.

==================================================
PHASE 0 — تشخيص إلزامي قبل APPLY
==================================================

شغّل أولًا:
git --no-pager status --short

ثم افحص الملفات التالية:
dsh/frontend/shared/catalog.ts
dsh/frontend/shared/dshStoreProductCardModel.ts
dsh/frontend/shared/workflow.ts
dsh/frontend/app-client/shared/resolve-image-source.ts
dsh/frontend/app-client/screens/StoreScreen.tsx
dsh/frontend/app-client/screens/StoreItemsScreen.tsx
dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx

وافحص أيضًا عند الحاجة:
dsh/media-fixtures/assets/seed/dsh/products
dsh/media-fixtures/assets/seed/dsh/stores
dsh/media-fixtures/assets/seed/dsh/logos
dsh/frontend/app-field/
wlt/frontend/shared/finance/

ابحث عن:
expandedEditId
DenseListRow
resolveDshImageSource
resolve-dsh-image-source
dshCatalogNodes
dshCatalogPipeline
dshCategoryMeasurementPolicies
categoryTabs
selectedCategory
CATEGORY_ICON
CATEGORY_EMOJI
canonicalPreviewProducts
canonicalPreviewStores
DshStoreFixtureItem
DshCanonicalProductCard
imageUri
mediaKey
logoImageUri
storeImageUri
storeLogoUri
categoryId
categoryLabel
mainCategoryId
subcategoryId
facetIds
domainId
sku
gtin
barcode
FILTER_ITEMS
applyFilter
facet
domain
mainCategory
subcategory
client-visible
canRenderInClientSurface
buildInitialItems
buildInitialProducts
InventoryCatalogItem
PartnerLocalOverride
ProductCard
InlineLocalEdit

قبل APPLY اكتب Findings مختصرة ودقيقة:
1. ما الفرع الحالي؟
2. أين تُصنع الفئات الحالية داخل InventoryCatalogScreen؟
3. لماذا الفئات الحالية مختلفة أو أضعف من تطبيق العميل؟
4. ما مصدر الفئات الحالي في StoreScreen/StoreItemsScreen؟
5. أين resolver الصور الحالي؟
6. هل app-partner يستخدم نفس resolver الصور المستخدم في app-client؟
7. هل مفاتيح imageUri/logoImageUri/mediaKey في dshStoreProductCardModel موجودة في resolver؟
8. هل توجد بيانات demo مكررة بين العميل والشريك؟
9. أين سبب expandedEditId Render Error إن بقي؟
10. هل صور المنتجات والمتاجر والشعارات موجودة فعليًا في media-fixtures؟
11. هل منتجات app-client و app-partner تأتي من نفس canonical source؟
12. هل canRenderInClientSurface يمنع ظهور غير المعتمد للعميل؟
13. ما الملفات التي ستعدلها ولماذا؟
14. ما الأسطح التي فُحصت ولماذا لم تُعدل إن لم تُعدل؟

لا تطبق أي تعديل قبل كتابة الأدلة.

==================================================
PHASE 1 — إصلاح Render Error وأخطاء الاستقرار أولًا
==================================================

الهدف:
لا يبدأ أي تحسين بصري أو منطقي قبل إصلاح الانهيار.

في:
dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx

أصلح:
Property 'expandedEditId' doesn't exist

القواعد:
- لا تجعل DenseListRow أو أي child component يقرأ متغيرًا غير موجود في نطاقه.
- مرر props صريحة مثل:
  isEditExpanded
  isDetailsExpanded
  onToggleEdit
  onToggleDetails
أو:
  expandedEditId
  expandedDetailsId
حسب البنية الحالية.
- افحص كل references المشابهة:
  expandedDetailsId
  expandedProductId
  activeEditId
  activeDetailsId
  selectedItemId
- لا تترك undefined reference.
- لا تضف workaround يخفي الخطأ فقط.

قبول المرحلة:
- صفحة المخزون تفتح بدون Render Error.
- الضغط على "تعديل محلي" لا ينهار.
- الضغط على "عرض التفاصيل" لا ينهار.
- لا توجد undefined references متعلقة بحالة التوسيع.

==================================================
PHASE 2 — تعميم Resolver الصور إلى shared
==================================================

الهدف:
صور المنتجات والمتجر والشعار يجب أن تعمل في تطبيق العميل وتطبيق الشريك من نفس resolver.

المشكلة الحالية:
resolveDshImageSource موجود داخل app-client، بينما app-partner والكتالوج يحتاجان نفس media fixtures.

نفّذ:
1. افحص:
   dsh/frontend/app-client/shared/resolve-image-source.ts

2. إذا لا يوجد resolver مشترك، أنشئ:
   dsh/frontend/shared/resolve-dsh-image-source.ts

3. انقل أو استخرج mapping الصور من app-client إلى shared resolver.

4. اجعل ملف app-client الحالي إما:
   - يعيد التصدير من shared resolver
   أو
   - يستخدم shared resolver داخليًا بدون تكرار mapping.

5. حدّث StoreScreen وStoreItemsScreen لاستخدام shared resolver إذا لزم.

6. حدّث InventoryCatalogScreen لاستخدام shared resolver.

7. resolver يجب أن يغطي فقط المفاتيح التي لها ملفات موجودة فعليًا داخل:
   - dsh/media-fixtures/assets/seed/dsh/products
   - dsh/media-fixtures/assets/seed/dsh/stores
   - dsh/media-fixtures/assets/seed/dsh/logos

8. أضف mapping مفقود فقط إذا الملف موجود فعليًا:
   - product media keys المستخدمة في dshStoreProductCardModel
   - store cover keys المستخدمة في dshStoreProductCardModel
   - store logo keys المستخدمة في dshStoreProductCardModel

9. إذا media key غير موجود:
   - اعرض fallback مفهوم باسم المنتج أو أيقونة واضحة.
   - لا تعرض مربعًا فارغًا.
   - اكتب Finding بالمفتاح الناقص.

قبول المرحلة:
- صور المنتجات تظهر في app-client و app-partner.
- صورة المتجر تظهر.
- شعار المتجر يظهر.
- لا يوجد mapping مكرر في ملفين.
- لا توجد مربعات فارغة إذا media موجود.
- media missing يظهر كـ fallback واضح مع Finding.

==================================================
PHASE 3 — توحيد Taxonomy من shared/catalog.ts
==================================================

الهدف:
لا تكون الفئات/الفلاتر محلية داخل InventoryCatalogScreen. يجب أن تأتي من shared catalog.

في:
dsh/frontend/shared/catalog.ts

ثبّت نموذج taxonomy واضح ومنفصل:

1. DshCatalogDomain:
- restaurants
- grocery
- bakery
- drinks
- pharmacy
- household
- other

2. DshCatalogMainCategory:
حسب domain.
مثال restaurants:
- meals
- drinks
- sides
- desserts
- offers

مثال grocery:
- fresh
- dairy
- bakery
- frozen
- pantry

3. DshCatalogSubcategory:
مثال:
- burgers
- chicken
- salads
- juices
- sauces
- bread
- dairy
- dates
- fruits
- vegetables

4. DshProductFacet:
- popular
- halal
- fresh
- vegetarian
- gluten_free
- featured
- new
- low_stock
- unavailable
- not_linked
- client_visible
- needs_review
- private_store_product
- canonical_product
- rejected
- pending_marketing
- pending_catalog

القواعد:
- لا تضع هذه القوائم داخل InventoryCatalogScreen.
- لا تخلط domain مع facet.
- لا تخلط category مع marketing tag.
- labels عربية واضحة.

صدّر helpers:
- getDshCatalogDomains()
- getDshMainCategories(domainId)
- getDshSubcategories(domainId, mainCategoryId)
- getDshProductFacets()
- resolveDshProductTaxonomy(product)
- getDshTaxonomyLabel(id)
- getDshActiveFilterSummary(filters)

قبول المرحلة:
- الفئات تأتي من shared/catalog.ts.
- لا يوجد taxonomy محلي منفصل في app-partner.
- app-client و app-partner يستطيعان استخدام نفس taxonomy.
- الفرق فقط أن app-partner يعرض طبقات وfacets أكثر تشغيلية.

==================================================
PHASE 4 — توحيد بيانات المنتجات التجريبية
==================================================

الهدف:
لا تكون بيانات المنتجات التجريبية مختلفة بين تطبيق العميل وتطبيق الشريك.

في:
dsh/frontend/shared/dshStoreProductCardModel.ts

تأكد أن canonical preview/store fixture products تحمل، أو يمكن اشتقاق، الحقول التالية:
- domainId
- mainCategoryId
- subcategoryId
- facetIds
- imageUri أو mediaKey
- logoImageUri إن كان مرتبطًا بمتجر
- canonicalStoreId
- canonicalProductId
- publishStage
- categoryId
- categoryLabel
- sku
- gtin
- barcode
- store/branch context عند الحاجة

في:
dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx

نفّذ:
- لا تستخدم buildInitialItems أو buildInitialProducts كمصدر حقيقة مستقل إذا كان يكرر منتجات العميل.
- ابنِ inventory items من shared canonical/store fixture products.
- أبقِ فقط partner local overrides داخل inventory:
  price
  stock
  available
  preparationTime
  branch
  internalNote
  localStatus
- افصل منطقيًا:
  Canonical product
  Partner assortment
  Partner local override
  Approval workflow
  Client visibility
- المنتجات الخاصة بالمطاعم تكون:
  isPrivateStoreProduct: true
  requiresMarketingReview: true
  publishStage: partner-submitted / marketing-review / needs-fix / rejected
  وليست client-visible مباشرة.

قبول المرحلة:
- app-client و app-partner يعرضان نفس المنتجات الأساسية.
- الاختلاف فقط في الصلاحيات والتعديل المحلي.
- لا توجد demo products متفرقة بلا سبب.
- كل منتج له canonical id أو سبب واضح لكونه private draft.

==================================================
PHASE 5 — بناء فلترة هرمية قوية للشريك
==================================================

الهدف:
استفادة من فلتر العميل كقاعدة، ثم توسيعه للشريك لإدارة آلاف المنتجات.

من:
dsh/frontend/app-client/screens/StoreItemsScreen.tsx

استفد من:
- categoryTabs derived from item.categoryId/categoryLabel
- activeCategory
- query filtering

لكن لا تنسخ التصميم حرفيًا. وسّعه للشريك:

1. Search دائم:
placeholder:
"اسم المنتج، SKU، GTIN، الباركود"

2. Domain rail:
من shared taxonomy:
مطاعم / مقاضي / مخابز / مشروبات / صيدليات / منزلية / أخرى

3. Main category rail:
حسب domain المختار فقط.

4. Subcategory rail:
حسب main category فقط.

5. Facets:
حالة المخزون، الظهور، الاعتماد، الخصائص، نوع المنتج.

6. Active filter summary:
يعرض الفلاتر النشطة + زر مسح الكل.

7. زر "كل الفلاتر":
يفتح فلترة كاملة عند زيادة الخيارات، بدون إغراق الشاشة.

قواعد:
- لا chips عشوائية.
- لا تظهر كل الطبقات دفعة واحدة إذا لا يوجد اختيار.
- استخدم horizontal scroll.
- لا تكسر الكلمات.
- لا تأخذ الفلاتر نصف الشاشة.
- الفلاتر يجب أن تعمل مع 5000+ منتج.
- تحديث نتيجة المنتجات يجب أن يكون deterministic وواضح.
- count يظهر بعد الفلترة.

قبول المرحلة:
- الفلتر في الشريك مبني على نفس منطق العميل لكنه أقوى.
- الفئات متوافقة بين العميل والشريك.
- لا توجد فئات خاطئة مثل خلط domain مع facet.
- يمكن الوصول إلى منتج عبر:
  بحث سريع
  أو domain → mainCategory → subcategory → facets.

==================================================
PHASE 6 — عرض صور المنتج والمتجر والشعار
==================================================

في:
InventoryCatalogScreen.tsx

نفّذ:
- كل dense row يعرض صورة المنتج إن وجدت.
- header أو context يعرض صورة/شعار المتجر إن كان المنتج مرتبطًا بمتجر.
- استخدم shared resolver فقط.
- لا تعرض مربعات فارغة.
- إذا media غير معتمد للعميل، لا تعرضه في app-client، لكن يمكن للشريك رؤيته كـ preview مع badge "قيد المراجعة" إذا workflow يسمح.
- إذا image missing:
  fallback واضح + Finding.

قبول المرحلة:
- صور المنتجات ظاهرة.
- صورة المتجر ظاهرة.
- شعار المتجر ظاهر.
- نفس media keys تعمل في العميل والشريك.
- لا placeholder صامت.

==================================================
PHASE 7 — Dense list افتراضي يصلح لآلاف المنتجات
==================================================

الهدف:
الشريك قد يملك 5000+ منتج. لا تجعل البطاقة الكبيرة هي الافتراضي.

في:
InventoryCatalogScreen.tsx

اجعل العرض الافتراضي:
Dense Row

كل صف يعرض:
- صورة مصغرة.
- اسم المنتج.
- الفئة المختصرة.
- SKU مختصر.
- السعر.
- المخزون.
- التوفر.
- حالة الاعتماد/الظهور.
- تعديل سريع.
- تفاصيل.

عند التوسيع:
- GTIN.
- barcode.
- category/subcategory/facets.
- source/canonical IDs.
- image/media status.
- workflow history.
- local override edit.
- actions.

أضف modes إذا كانت مناسبة:
- قائمة كثيفة
- بطاقات
لكن الافتراضي للشريك = قائمة كثيفة.

قبول المرحلة:
- لا بطاقات ضخمة افتراضيًا لكل منتج.
- الوصول للمنتج سريع.
- الواجهة تصلح لآلاف المنتجات.
- التفاصيل تظهر عند الحاجة فقط.

==================================================
PHASE 8 — منطق المنتج المركزي مقابل منتج خاص بالمطعم/المتجر
==================================================

ثبّت مسارين واضحين:

1. Canonical product:
- يستدعى من الكتالوج.
- الشريك يعدل السعر/المخزون/التوفر فقط.
- الاسم/الصورة/الفئة مقفلة.
- يظهر للعميل فقط حسب client visibility.

2. Private restaurant/store product:
- الشريك يضيفه كمسودة.
- يمر عبر:
  partner-submitted
  partner-review
  marketing-review
  catalog-adopted
  client-visible
- لا يظهر للعميل قبل client-visible.

في UI:
- badge: منتج مركزي / منتج خاص بالمتجر.
- next owner: الشركاء / التسويق / الكتالوج.
- reason إذا needs-fix/rejected.
- CTA:
  إرسال للمراجعة
  إصلاح السبب
  انتظار التسويق
  انتظار اعتماد الكتالوج

قبول المرحلة:
- المطاعم تستطيع إضافة منتجات خاصة بدون تجاوز المنظومة.
- العميل لا يرى غير المعتمد.
- الشريك يعرف المرحلة التالية.
- المنتج المركزي لا يسمح بتعديل حقول الكتالوج السيادية.

==================================================
PHASE 9 — العمليات الجماعية مع preview
==================================================

الهدف:
صاحب متجر لديه آلاف المنتجات يحتاج عمليات سريعة وآمنة.

أضف أو أصلح bulk mode:
- اختيار منتجات.
- اختيار كل المنتجات ضمن الفلتر الحالي.
- تعديل سعر جماعي:
  نسبة زيادة/نقصان
  مبلغ ثابت
  rounding rule إن لزم
- تغيير التوفر.
- إرسال للمراجعة.
- مطابقة بالكتالوج.
- إصلاح تكرارات.
- مراجعة المنتجات غير المطابقة.

قبل التطبيق:
اعرض preview واضح:
- عدد المنتجات المتأثرة.
- ما سيتغير.
- هل يتطلب مراجعة أم لا.
- المنتجات المستثناة ولماذا.
- ماذا سيبقى بدون تغيير.

لا تضف backend.
إذا التغيير local preview فقط، اكتب ذلك بوضوح.

قبول المرحلة:
- يستطيع الشريك تعديل فئة كاملة بسرعة.
- لا عمليات جماعية عمياء.
- لا كسر للمنتجات catalog-owned.
- كل bulk action لها preview.

==================================================
PHASE 10 — ربط تطبيق العميل والظهور
==================================================

في:
dsh/frontend/app-client/screens/StoreScreen.tsx
dsh/frontend/app-client/screens/StoreItemsScreen.tsx

نفّذ:
- استخدم نفس taxonomy/shared media resolver.
- لا تظهر drafts/rejected/needs-fix للعميل.
- لا يظهر stock=0 أو available=false كمتاح.
- السعر/التوفر يأخذان partner local override إذا كان ذلك مدعومًا في preview.
- إذا غير مدعوم، اكتب Finding واضح.
- لا تغيّر تصميم العميل إلا للربط الضروري مع shared taxonomy/media.

قبول المرحلة:
- العميل والشريك متوافقان.
- لا تعارض بين المخزون وما يراه العميل.
- الصور والفئات موحدة.
- لا ظهور لمنتجات غير معتمدة.

==================================================
PHASE 11 — فحص تطبيق الميداني والمالية عند الحاجة
==================================================

افحص:
dsh/frontend/app-field/
wlt/frontend/shared/finance/

المطلوب:
- إذا app-field يدخل منتجات أو متاجر، يجب أن يدخل نفس workflow ولا يتجاوز الشركاء/التسويق/الكتالوج.
- إذا تغيّر السعر المحلي يؤثر على السلة/الطلب/المالية، اكتب أثره.
- لا تغيّر WLT/finance إلا إذا هناك تناقض مباشر.
- إذا لا يوجد أثر مباشر، اكتب Finding: لا تعديل مطلوب في هذه المرحلة.

قبول المرحلة:
- لا سطح تم تجاهله.
- لا إدخال ميداني يخلق كتالوجًا منفصلًا.
- لا سعر يظهر للعميل مختلف عن المخزون بدون Finding.

==================================================
PHASE 12 — تنظيف UI والنصوص والمنطق
==================================================

نفّذ cleanup داخل نطاق المهمة:
- لا raw labels:
  partner-review
  marketing-review
  catalog-adopted
  client-visible
  needs-fix
  rejected
- لا مربع صورة فارغ.
- لا chips عشوائية.
- لا فئات محلية داخل الشاشة.
- لا timeline غير مقروء.
- لا source/canonical IDs في dense row الرئيسي.
- لا "تطبيق محلي" بدون توضيح ماذا سيطبق.
- لا تكرار badges.
- لا بطاقات ضخمة افتراضية لكل المنتجات.
- لا تكرار بيانات demo بلا سبب.
- لا imports غير مستخدمة.
- لا state ميت.
- لا helper مكرر.

قبول المرحلة:
- النصوص عربية واضحة.
- كل إجراء مفهوم.
- الفلترة منطقية.
- التصميم عملي لمتجر كبير.
- لا ضجيج ولا تشتت.

==================================================
PHASE 13 — التحقق النهائي
==================================================

بعد APPLY شغّل:

git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

ثم اطلب لقطات/أدلة:
1. صفحة المخزون تفتح بدون Render Error.
2. صورة منتج ظاهرة في تطبيق الشريك.
3. صورة/شعار متجر ظاهر.
4. app-client يعرض نفس المنتج وصورته.
5. domain rail ظاهر.
6. main category rail ظاهر.
7. subcategory rail ظاهر.
8. facets ظاهرة.
9. active filters summary ظاهر.
10. dense list افتراضي.
11. expanded details.
12. local edit.
13. bulk edit preview.
14. private restaurant/store product pending review.
15. client-visible product.
16. منتج rejected/needs-fix لا يظهر للعميل.
17. BottomNav بدون clipping.
18. نتيجة git diff --check.
19. نتيجة pnpm -w exec tsc --noEmit.

لا تدّعِ PASS/CLOSED/100%/READY.
اكتب فقط DONE أو BLOCKED لكل Phase مع:
- الملفات المعدلة.
- سبب كل تعديل.
- خريطة الأثر.
- الأسطح المفحوصة.
- الأسطح المعدلة.
- الأسطح غير المعدلة ولماذا.
- Findings المتبقية.
- نتائج التحقق.
- اللقطات المطلوبة.
```

---

## 1) خريطة الملفات المتوقعة

| الملف | نوع الإجراء | السبب |
|---|---|---|
| `dsh/frontend/shared/catalog.ts` | تعديل | مصدر الحقيقة للفئات والطبقات والـ facets |
| `dsh/frontend/shared/dshStoreProductCardModel.ts` | تعديل | توحيد المنتجات التجريبية والميديا والـ taxonomy |
| `dsh/frontend/shared/workflow.ts` | تعديل محدود | ضمان ترجمة المراحل والمالك التالي |
| `dsh/frontend/shared/resolve-dsh-image-source.ts` | إضافة مشروطة | Resolver مشترك للصور إذا لا يوجد بديل |
| `dsh/frontend/app-client/shared/resolve-image-source.ts` | تعديل | re-export أو استخدام resolver مشترك |
| `dsh/frontend/app-client/screens/StoreScreen.tsx` | تعديل محدود | ربط الصور/الفئات المشتركة بدون تغيير تجربة العميل |
| `dsh/frontend/app-client/screens/StoreItemsScreen.tsx` | تعديل محدود | الحفاظ على categoryTabs مع shared taxonomy/media |
| `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx` | تعديل أساسي | إصلاح الصفحة والفلترة والصور والـ dense list |

---

## 2) معايير القبول النهائية

لا يعتبر التنفيذ ناجحًا إلا إذا تحقق كل ما يلي:

```text
1. لا Render Error.
2. لا فئات محلية مخترعة داخل InventoryCatalogScreen.
3. app-client و app-partner يستخدمان نفس مصدر الفئات والمنتجات والصور قدر الإمكان.
4. صور المنتجات ظاهرة.
5. صورة المتجر وشعاره ظاهران.
6. فلترة هرمية تعمل: domain → main category → subcategory → facets → products.
7. العرض الافتراضي Dense List مناسب لآلاف المنتجات.
8. المنتج المركزي لا يسمح بتعديل الاسم/الصورة/الفئة من الشريك.
9. المنتجات الخاصة بالمطاعم تمر بمسار مراجعة واضح.
10. العميل لا يرى drafts/rejected/needs-fix.
11. العمليات الجماعية لها preview.
12. لا raw workflow labels في UI.
13. لا hardcoded colors.
14. لا Tamagui imports داخل screens/surfaces/apps.
15. لا تضخيم ui-kit.
16. git diff --check يمر.
17. pnpm -w exec tsc --noEmit يمر.
18. لقطات الإثبات موجودة.
```

---

## 3) تسلسل التنفيذ الآمن

لا تنفذ كل المراحل دفعة واحدة مع وكيل ضعيف. استخدم هذا الترتيب:

```text
Run 1:
PHASE 0 + PHASE 1

Run 2:
PHASE 2 + PHASE 3

Run 3:
PHASE 4 + PHASE 5

Run 4:
PHASE 6 + PHASE 7 + PHASE 8

Run 5:
PHASE 9 + PHASE 10 + PHASE 11

Run 6:
PHASE 12 + PHASE 13
```

كل Run يجب أن ينتهي بـ:
```text
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

ولا تنتقل للـ Run التالي إذا كان هناك Render Error أو TypeScript error أو clipping واضح أو صور مكسورة.
