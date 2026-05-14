# BThwani Appearance Visual Defects — Final Closure Command

انسخ هذا الأمر كاملًا إلى تشات الوكيل داخل VS Code / Codex.

```text
نفّذ داخل C:\bthwani-suite على الفرع الحالي:
ghb/0141-20260515-004035-app-captain-app-client-app-field

المهمة:
إغلاق بقايا نظام BThwani Appearance بعد التنفيذ الأخير، لكن هذه المرة الإغلاق يجب أن يكون بصريًا ووظيفيًا حقيقيًا، وليس مجرد مرور TypeScript. توجد عيوب واضحة في الوضع الداكن حسب لقطة الشاشة الحالية: ألوان غير متناسقة، نصوص شبه مخفية، حواف زجاجية/rim-light غير ظاهرة، أجزاء فاتحة داخل darkGlass، وخلط بين light/dark في نفس الشاشة.

لا تفتح redesign عام جديد.
لا تعيد بناء النظام من الصفر.
لا تنقل المهمة إلى تحسينات واسعة.
المطلوب هو إغلاق العيوب المتبقية جذريًا عبر root-cause fixes في ui-kit + surfaces المتأثرة فقط، مع أدلة.

السياق الملزم:
- ui-kit أصبح يحتوي Appearance System و lightThemeColors / darkThemeColors و component-state tokens.
- جذور app-client/app-partner/app-captain/app-field صارت تمرر themeMode ديناميكيًا من appearanceMode.
- control-panel/webapp/website لديها bridges.
- رغم ذلك، الصورة الحالية تثبت أن darkGlass لا يعمل بكفاءة بصرية في بعض الشاشات.
- لا يجوز إعلان CLOSED/100% بدون screenshots تقارن light/dark بعد الإصلاح.

العيوب المرئية المثبتة من لقطة app-client darkGlass:
1) الهيدر العلوي ما زال Orange كاملًا وصاخبًا جدًا داخل darkGlass، ويكسر فكرة dark premium.
2) خلفية الصفحة داكنة لكن بعض النصوص داخل بطاقات المتاجر/الخدمات تظهر باللون الأزرق الداكن أو منخفض التباين، فتختفي تقريبًا.
3) بطاقات المتاجر في القائمة مظلمة جدًا بدون طبقة readable foreground كافية.
4) ProductCard / StoreCard لا تعرض rim-light زجاجي فاخر واضح؛ الحدود تبدو مسطحة أو غائبة.
5) بعض badges/chips مثل "برو"، "مجاني"، "نقاط 2x"، التقييم والمتابعين ليست منسجمة بالكامل مع darkGlass.
6) bottom navigation بقي أبيض/فاتح جدًا داخل darkGlass، وهذا قد يكون مقبولًا فقط إذا كان قرارًا مقصودًا، لكنه حاليًا يكسر وحدة الوضع الداكن.
7) CTA البرتقالي في المنتصف يطغى بصريًا، ويحتاج ضبط جرعة اللون/ظل/rim-light.
8) النصوص والأيقونات في بطاقات المتجر ليست RTL/readability-perfect.
9) يبدو أن بعض المكونات لا تستهلك component-state tokens الجديدة بل ما تزال تعتمد colorPalette/useTheme/hardcoded colors.
10) الوضع الداكن ليس "Premium Dark Glass" شاملًا بصريًا؛ ما زالت هناك مناطق light أو hardcoded أو low-contrast.

الهدف النهائي:
- lightPremium يبقى فاتحًا افتراضيًا، نظيفًا، مريحًا، بلا glass عشوائي.
- darkGlass يصبح داكنًا مريحًا ومقروءًا فعليًا في كل الشاشة.
- rim-light يظهر كحافة زجاجية ناعمة وفاخرة في البطاقات/العناصر التجارية.
- النصوص تكون readable في كل البطاقات والشرائح.
- لا white-card drift داخل darkGlass إلا إذا كان قرارًا موثقًا ومبررًا.
- لا orange overuse.
- لا blue-on-dark منخفض التباين.
- لا black flat.
- لا hardcoded random colors.
- لا Direct Tamagui خارج ui-kit.

قاعدة المعمار:
Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only.

الممنوع:
- ممنوع تعديل backend/API/contracts/runtime.
- ممنوع إضافة dependencies.
- ممنوع تعديل lockfile إلا إذا كان موجودًا مسبقًا وسببه معروف من العمل السابق؛ لا تضف جديدًا.
- ممنوع global replace أعمى.
- ممنوع إعادة تصميم كامل للشاشات.
- ممنوع local design system أو local token maps داخل apps/surfaces.
- ممنوع direct Tamagui خارج ui-kit.
- ممنوع hardcoded hex جديد في screens/surfaces/apps.
- ممنوع ترك نص منخفض التباين داخل darkGlass.
- ممنوع ادعاء PASS/CLOSED/100% بدون visual evidence.

==================================================
PHASE 0 — Evidence-first inspection
==================================================

قبل أي تعديل، افحص ودوّن الملفات/المواضع التي تسبب العيوب:

أولًا افحص:
- ui-kit/src/appearance.ts
- ui-kit/src/foundation.ts
- ui-kit/src/components/card.tsx
- ui-kit/src/components/button.tsx
- ui-kit/src/components/appearance.tsx
- ui-kit/src/mobile/root.tsx
- ui-kit/src/web/root-layout.tsx
- app-client/runtime/App.tsx
- app-client/shell/appearance.tsx
- dsh/frontend/app-client/screens/StoreScreen.tsx
- dsh/frontend/app-client/screens/MySpaceScreen.tsx
- كل شاشة/مكون يعرض بطاقات المتاجر الظاهرة في الصورة الحالية، وابحث عن النص "أسواق العليا الطازجة" أو card/list component المرتبط بها.
- bottom navigation / tab bar source في app-client أو app-shell المرتبط.
- أي components مسؤولة عن header orange في app-client.

ابحث نصيًا عن:
- colorPalette
- useTheme()
- backgroundColor:
- color:
- borderColor:
- shadowColor:
- '#0A2F5C'
- '#FF500D'
- '#FFFFFF'
- '#fff'
- '#000'
- rgba(255
- rgba(0
- role="titleXs"
- themeMode="light"
- syncThemeMode={false}
- StoreCard
- ProductCard
- Partner
- favorite
- rating
- bottom tab
- navigation
- header

قبل التعديل اعرض:
- root cause لكل عيب مرئي.
- الملفات التي ستلمسها.
- هل الإصلاح داخل ui-kit أم داخل surface.
- سبب عدم كفاية التنفيذ السابق.
- هل تحتاج visual screenshot بعد التعديل.

إذا لم تجد مالك مكون محدد، لا تخمّن؛ اكتب BLOCKED لذلك المكون فقط مع مسار البحث الذي جربته.

==================================================
PHASE 1 — Fix invalid build blockers first
==================================================

تحقق أولًا من blocker السابق:
dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx

المطلوب:
- تأكد أن role="titleXs" غير موجود.
- إذا وجد، استبدله بأقرب role صالح موجود داخل @bthwani/ui-kit Text roles، بدون تغيير تصميم واسع.
- شغّل build control-panel لاحقًا لإثبات الإغلاق.

Acceptance:
- لا يوجد role غير صالح.
- control-panel build لا يفشل بسبب هذا الموضع.

==================================================
PHASE 2 — DarkGlass readability contract في ui-kit
==================================================

الهدف:
إصلاح التباين والقراءة من المصدر المركزي، لا بالترقيع في كل شاشة.

داخل ui-kit/src/appearance.ts راجع:
- darkThemeColors.textPrimary
- textSecondary
- textMuted
- surfacePrimary/Secondary/Raised/Inset
- glassSurface/Strong
- glassBorder
- rimLightSubtle/Strong
- commerce.productCard
- commerce.store/product/order/service card roles إن وجدت
- navigation tokens
- buttons glass/brand/primary/secondary tokens
- badges/chips/promo/premium tokens

المطلوب:
1. تأكد أن darkGlass لا ينتج blue/dark text فوق dark surfaces.
2. textPrimary في darkGlass يجب أن يكون near-white واضحًا.
3. textSecondary يجب أن يبقى readable، وليس أزرق داكن.
4. textMuted لا يجب أن ينخفض إلى مستوى غير مقروء.
5. brand/deepBlue لا يستخدم كنص على خلفية داكنة إلا إذا كان داخل surface فاتح/مقصود.
6. accentOrange يبقى accent محدود، لا header كامل صاخب إلا إذا الشاشة light.
7. cards/chips/badges تستخدم dark component tokens.
8. rim-light يجب أن يكون border/overlay visible enough في darkGlass.
9. لا تجعل dark theme مجرد black flat.
10. لا تفسد lightPremium.

Acceptance:
- dark tokens تنتج readable text.
- dark cards/badges/chips/buttons لها foreground واضح.
- rim-light roles واضحة.
- لا regression في lightPremium.

==================================================
PHASE 3 — Header and top chrome in darkGlass
==================================================

العيب:
الهيدر البرتقالي العلوي في الصورة يكسر darkGlass. المطلوب ليس حذف هوية البرتقالي، بل ضبطها.

المطلوب:
1. حدد مصدر الهيدر orange في app-client.
2. في lightPremium:
   - يسمح بالهيدر البرتقالي إذا كان مقصودًا كهوية/CTA.
3. في darkGlass:
   - اجعل الهيدر dark premium / glass / navy-ink surface.
   - استخدم orange فقط للـ accent: أيقونة نشطة، underline، badge، selected CTA.
   - لا تجعل مساحة كبيرة من الهيدر orange كاملًا.
4. أزرار البحث/السلة/الإشعارات تكون glass/dark readable.
5. النصوص داخل الهيدر near-white أو token مناسب.
6. لا تكسر safe area أو RTL.

Acceptance:
- darkGlass header لا يظهر orange block صاخب.
- lightPremium لا يتضرر.
- icons/text readable.
- لا تغيّر flow.

==================================================
PHASE 4 — StoreCard / Commerce card visual closure
==================================================

العيب:
بطاقات المتجر في الصورة منخفضة التباين: الاسم والموقع والتفاصيل تظهر أحيانًا أزرق/داكن فوق dark card.

المطلوب:
1. حدد مكون البطاقة المسؤول عن "أسواق العليا الطازجة" في الصورة الحالية.
2. استبدل الألوان hardcoded أو colorPalette القديمة بـ ui-kit component tokens:
   - commerce / card / list / badge / chip tokens.
3. في darkGlass:
   - card background = dark premium/glass surface.
   - title = near-white.
   - subtitle/meta = readable textSecondary.
   - inactive icons = readable muted.
   - active accents = orange/success حسب المعنى فقط.
   - border = rimLightSubtle أو glassBorder.
   - selected/premium badge = rim-light واضح.
4. في lightPremium:
   - card يبقى فاتحًا ومريحًا.
   - لا تضف glass إلا إذا كان محددًا مسبقًا.
5. عالج favorite/open lock/status icons:
   - لا تعتمد على ألوان عشوائية.
   - success للأمان/فتح/متاح فقط.
   - danger للحظر/مغلق فقط.
   - orange للعروض/CTA لا للأخطاء.
6. اضبط spacing/RTL إذا كان icon/text cluster مكسورًا.
7. لا تغيّر بيانات أو flow.

Acceptance:
- لا يوجد blue-on-dark غير مقروء.
- الاسم/الموقع/المسافة/الوقت/التوصيل/rating readable.
- rim-light مرئي وناعم.
- lightPremium سليم.

==================================================
PHASE 5 — ProductCard final hardcoded-color audit
==================================================

حتى لو تم تعديل ProductCard سابقًا، أعد فحصه بصريًا وكوديًا.

المطلوب:
- ui-kit/src/components/card.tsx
- أي ProductCard أو ProductTile أو StoreProduct card في surfaces.

تحقق من:
- لا hardcoded background/border/text في darkGlass.
- favorite button readable.
- cart/add button readable.
- discount badge readable.
- old price muted but visible.
- price clear.
- image frame ليس white-card drift في darkGlass.
- rim-light ظاهر كحد ناعم.
- no orange overuse.

Acceptance:
- ProductCard dark screenshot صالح بصريًا.
- لا تشوه في الخطوط.
- لا بطاقة مسطحة بلا border/rim-light.

==================================================
PHASE 6 — Bottom navigation / tab bar darkGlass
==================================================

العيب:
bottom navigation في الصورة أبيض جدًا داخل darkGlass، وقد يكسر وحدة الثيم.

المطلوب:
1. حدد مصدر bottom tab / nav bar.
2. في lightPremium:
   - nav يمكن أن يكون white/off-white.
3. في darkGlass:
   - nav surface يجب أن يكون dark premium أو glassSurfaceStrong.
   - active item يستخدم orange accent محدود.
   - inactive item readable muted.
   - المركز/الخدمات button لا يطغى بصريًا.
   - border/rim-light ناعم.
4. إذا كان قرارًا مقصودًا أن bottom nav يبقى light في darkGlass، وثّقه واطلب visual approval؛ لا تفترض.

Acceptance:
- darkGlass bottom nav منسجم مع الثيم.
- icons/text readable.
- no white slab unless explicitly approved.

==================================================
PHASE 7 — MySpace / Settings / Appearance screen visual closure
==================================================

المطلوب:
- تأكد أن تبويب "المظهر" نفسه لا يعاني من light/dark mix.
- النصوص العربية واضحة.
- الخيار المختار واضح.
- لا توجد بطاقة بيضاء صلبة في darkGlass.
- lightPremium فاتح بالكامل.
- الوصف الجديد لا يقول إن darkGlass للمتجر فقط.
- الحواف/rim-light تظهر بشكل راقٍ.

Acceptance:
- screenshots لحسابي/المظهر light/dark مقبولة بصريًا.

==================================================
PHASE 8 — Control panel build and dark readable check
==================================================

المطلوب:
1. شغّل:
   pnpm nx run control-panel:build
2. إذا فشل بسبب TypeScript drift مرتبط بملفات DSH control-panel، أصلح أضيق سبب مباشر فقط.
3. لا تفتح redesign.
4. راجع darkGlass في:
   - settings/appearance
   - table/form
   - dashboard/cards/charts
5. الجداول والنماذج:
   - ليست glass كثيف.
   - readable.
   - no white cards.
   - no dark text on dark.
   - dataViz tokens للرسوم.

Acceptance:
- control-panel build PASS.
- screenshots المطلوبة لاحقًا.

==================================================
PHASE 9 — Webapp / Website readiness
==================================================

المطلوب:
- تأكد من /settings في webapp و website.
- localStorage + cookie يعملان.
- SSR/client boundary لا ينكسر.
- darkGlass لا يترك body/page light.
- lightPremium default.
- لا toggle مزعج في landing.

Acceptance:
- webapp build PASS.
- website build PASS.
- screenshots light/dark.

==================================================
PHASE 10 — Services scope audit
==================================================

راجع:
- dsh
- wlt
- knz
- arb
- amn
- esf
- mrf
- snd
- kwd

المطلوب:
1. لكل service، حدد:
   - DONE if visible surfaces consume root/theme tokens and no visual drift found.
   - NO_VISIBLE_SURFACE if no user-visible screen exists.
   - BLOCKED if owner unclear.
2. لا تترك dsh وحده.
3. لا تعدل service بلا visible surface.
4. لا local theme.

Acceptance:
- جدول status لكل service.

==================================================
PHASE 11 — Hardcoded color final scan
==================================================

نفّذ scan للألوان المؤثرة فقط.

المطلوب:
- أي hardcoded hex داخل screens/surfaces/apps يجب أن يكون:
  أ) محول إلى ui-kit token، أو
  ب) موثق ومبرر إذا كان asset/color literal غير ثيمي.
- لا global replace.
- ركز على الألوان التي تكسر dark/light:
  #fff/#FFFFFF
  #000/#000000
  #0A2F5C
  #FF500D
  red/green/yellow/purple/cyan randoms
  rgba(255...)
  rgba(0...)

Acceptance:
- لا hardcoded colors مؤثرة تكسر darkGlass في الشاشات المعنية بالصورة.
- أي متبقٍ موثق.

==================================================
PHASE 12 — Verification commands
==================================================

شغّل في النهاية:

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check

pnpm -w exec tsc --noEmit
pnpm nx run app-client:build
pnpm nx run app-partner:build
pnpm nx run app-captain:build
pnpm nx run app-field:build
pnpm nx run control-panel:build
pnpm nx run webapp:build
pnpm nx run website:build
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel

لا تدّعِ نجاح أي أمر لم يتم تشغيله فعلًا.

==================================================
PHASE 13 — Required visual evidence
==================================================

بعد نجاح الأوامر، اطلب screenshots ولا تدّعِ CLOSED قبلها:

app-client:
1. الشاشة الحالية المرفقة نفسها بعد الإصلاح في darkGlass.
2. نفس الشاشة في lightPremium.
3. حسابي/المظهر light.
4. حسابي/المظهر dark.
5. StoreScreen light.
6. StoreScreen dark.
7. ProductCard dark.

app-partner:
8. المظهر light/dark.
9. شاشة وظيفية dark.

app-captain:
10. المظهر light/dark.
11. شاشة طلب/مهمة dark.

app-field:
12. المظهر light/dark.
13. شاشة زيارة/نموذج dark.

control-panel:
14. المظهر light/dark.
15. جدول أو نموذج dark.
16. dashboard/cards/charts dark.

webapp:
17. صفحة ظاهرة light/dark.

website:
18. صفحة ظاهرة light/dark.

services:
19. DSH visible dark.
20. أي service-owned visible screen من غير DSH إن وجد.

==================================================
ACCEPTANCE CRITERIA
==================================================

اكتب DONE فقط إذا:
- العيوب المرئية في الصورة الحالية أُصلحت.
- darkGlass header لم يعد orange block صاخبًا.
- commerce/store cards readable.
- النصوص لا تختفي.
- rim-light ظاهر وناعم.
- bottom navigation darkGlass منسجم أو موثق كقرار مقصود.
- ProductCard dark readable.
- MySpace/Appearance light/dark readable.
- control-panel build PASS.
- كل builds المطلوبة PASS.
- tsc PASS.
- diff check PASS.
- guards PASS.
- لا direct Tamagui خارج ui-kit.
- لا local design system.
- لا hardcoded colors مؤثرة.
- لا new dependencies.
- لا backend/API/contracts changes.
- screenshots مطلوبة تم طلبها.
- لا تدّعِ 100% قبل مراجعة screenshots.

اكتب BLOCKED إذا:
- مالك card/header/bottom nav غير واضح.
- control-panel build يفشل بسبب blocker خارج النطاق.
- لا يمكن إصلاح low contrast بدون تعديل ui-kit عميق غير آمن.
- فشل TypeScript.
- احتجت dependency جديدة.
- احتجت redesign/routing كبير.

المخرجات النهائية:
- DONE / BLOCKED / NEEDS_VISUAL_EVIDENCE.
- جدول: issue → root cause → files changed → proof.
- نتائج أوامر التحقق.
- قائمة screenshots المطلوبة.
- أي ألوان hardcoded بقيت ولماذا.
- أي surfaces بقيت BLOCKED/NO_VISIBLE_SURFACE.
```
