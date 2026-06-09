# BTHWANI UI IDENTITY CLOSURE — PHASED EXECUTION COMMAND V3

> **Purpose:** Execute BThwani UI identity unification safely, gradually, and with evidence.
> **Target repo:** `C:\bthwani-suite`
> **Canonical GitHub repo:** `bthwani2-boop/bthwani-suite`
> **Mode:** phased execution, closed loops, no broad redesign, human approval after every phase.
> **Decision rule:** no `PASS`, `READY`, `CLOSED`, or `100%` claim without verifiable evidence.
> **Purpose:** close BThwani visual identity with premium, practical, attractive, fast, RTL-correct, low-noise, maintainable, and evidence-based implementation.

---

## 0. Mandatory operating rule

اعمل داخل الريبو الحالي فقط: `C:\bthwani-suite`.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

هذه ليست مهمة تجميل عشوائي. هذه مهمة حوكمة وهوية وتشطيب تدريجي على الكود الحي، مع منع الاستعجال، منع التضخيم، منع التكرار، ومنع النجاح الوهمي.

Adopt one central design contract only:

```text
Contract file count = 1
Canonical contract file = governance/08_UI_KIT_AND_BRAND.md
```

Do **not** create separate contract files such as:

```text
UI_COLORS_CONTRACT.md
UI_ICONS_CONTRACT.md
UI_BUTTONS_CONTRACT.md
UI_RTL_CONTRACT.md
UI_FONTS_CONTRACT.md
UI_PERFORMANCE_CONTRACT.md
UI_MOTION_CONTRACT.md
```

أي تفاصيل جديدة تضاف كأقسام داخل الملف المركزي الواحد، والحراس تشير إليه.

Those would create fragmentation, duplicated authority, and future drift. Guards are not contract files. Guards are enforcement tools for the single contract.

Expected files in the first governance stage:

```text
1. governance/08_UI_KIT_AND_BRAND.md
2. tools/guards/guard-ui-kit-central-design-ownership.mjs
3. tools/guards/guard-ui-kit-central-design-ownership.config.json
4. tools/guards/guard-platform-vars-control.mjs or config when relevant
5. tools/guards/guard-manifest.json only if needed
6. package.json only if a missing guard script must be exposed
```

Expected new files inside `ui-kit`: **0 by default**.

Every phase runs as a closed loop:

```text
Scope → Evidence → Classification → Minimal Apply or Audit → Verify → Evidence Pack → Human Approval
```

لا تنتقل إلى المرحلة التالية بدون موافقة إنسان صريحة بعد عرض الأدلة.

**STOP FOR HUMAN APPROVAL — Contract ownership confirmed**

---

## 1. Core architecture contract

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports only
→ Tamagui internally inside ui-kit only
```

### ui-kit owns

```text
tokens / semantic colors / typography / font profiles / spacing / radius / elevation / motion
icons / icon buttons / directional icons
buttons / cards / surfaces / badges / chips / headers / state views / navigation chrome
forms / inputs / selectors / switches / tables / lists / data rows
banners / hero recipes / marketing modules / trust blocks / CTA patterns
media wrappers / image policy / skeletons / loading states
RTL helpers / appearance modes / density profiles / accessibility primitives
```

### surfaces own

```text
screen composition / journey flow / business logic / API binding / runtime state
DSH/WLT behavior / permissions / service-specific decisions / screen-specific copy
```

### Allowed

```text
- Screens consume @bthwani/ui-kit public exports.
- ui-kit may use Tamagui internally when useful.
- Existing ui-kit files may receive carefully bounded variants/types/props.
- Surface-specific composition remains in the surface.
```

### Forbidden

```text
- Direct import from tamagui outside ui-kit.
- Direct import from @tamagui/* outside ui-kit.
- Deep import from @bthwani/ui-kit/src or ui-kit/src outside ui-kit.
- Local design systems in apps/surfaces.
- Local tokens/theme/palette/style recipes when reusable.
- Hardcoded random colors/fonts/shadows/radius/spacing.
- Free-form design editing from Platform Vars.
- Moving business logic/API/runtime state/DSH-WLT behavior into ui-kit.
- Creating many new ui-kit files without evidence and human approval.
- Broad cleanup/deletion without consumer evidence.
```

---

## 2. Identity scope to unify

Every reusable visual pattern must have exactly one central owner.

```text
Colors / semantic roles            → ui-kit/foundation
Typography / text roles / fonts    → ui-kit/foundation + Text roles
Spacing / radius / elevation       → ui-kit/foundation
Motion / opacity / z-index         → ui-kit/foundation
Icons / icon buttons               → Icon / IconButton / DirectionalIcon
Buttons / actions                  → Button / StickyActionBar / action variants
Cards / surfaces / sheets          → Card / Surface / SheetFrame / Dialog / Modal
Badges / chips / status tags       → Badge / Chip / WebControlPanelStatusTag
Headers / top bars                 → ScreenHeader / MobileWorkspaceHeader / WebControlPanel*
Navigation chrome                  → BottomNavBar / Web rail / tabs
States                             → StateView / LoadingState / EmptyState / ErrorState / SuccessState
Forms                              → TextField / SelectField / Checkbox / Radio / Switch
Lists / rows / dense tables        → ListItem / OptionRow / DataTable / WebControlPanelQueue
Banners / hero / marketing         → Banner / BannerCarousel / StoreHero / WebMissionHeroCard
Media/image display                → Image/media components + central DSH fixture policy
RTL/direction/language             → ui-kit direction helpers and providers only
Accessibility/touch/focus          → ui-kit component contracts
Performance                        → lean payloads, no duplicated heavy visual data, no eager UI inflation
```

---

## 3. Full visual identity dimensions

لا تعتبر الخطة مكتملة إلا إذا غطت كل المحاور التالية:

### 3.1 Brand DNA and marketing identity

- premium trust: هادئ، قوي، موثوق، غير صاخب.
- delivery speed: يوضح السرعة بدون animation ثقيل.
- local Arabic-first identity: RTL حقيقي، نصوص عربية طبيعية، لا محاذاة عشوائية.
- conversion clarity: كل شاشة لها action واضح.
- emotional but practical: الفخامة تخدم الطلب والقرار، لا تسرق الانتباه.

### 3.2 Color system

- استخدام central semantic roles فقط.
- لا ألوان عشوائية ولا أسماء محلية مثل `orange`, `blue`, `dark`, `muted` خارج ui-kit إذا كانت reusable.
- **Core Brand Identity:** Trust via `deepBlue` (`#0A2F5C`), primary action emphasis via `orange` (`#FF500D`), and clean surfaces via `white` (`#FFFFFF`).
- **Visual depth:** Enhance premium quality and depth using semantic roles and secondary colors from `lightPremium` and `darkGlass` (e.g. `deepBlueElevated` or `offWhite`).
- **High Contrast:** Ensure strong readability and high contrast (e.g., white text on `deepBlue` backgrounds, or `deepBlue`/`ink` text on light surfaces).
- status colors لا تتغير من شاشة لأخرى.
- danger/warning/success/info لها معاني ثابتة.
- darkGlass لا يحتوي cards بيضاء صلبة أو text غامق على خلفية غامقة.
- **No local colors:** Hardcoded, raw color hexes are forbidden outside `@bthwani/ui-kit`.

### 3.3 Typography and fonts

- font ownership داخل ui-kit/foundation فقط.
- ممنوع `fontFamily` محلي خارج allowlist.
- **Standardized Roles:** Text roles إلزامية: `display / hero / title / body / caption / label / metric`. Use typography scale and text roles defined in `foundation.ts` (e.g. `hero`, `titleXl`, `bodyMd`). No custom font families, inline `fontFamily` strings, or manual font size overrides.
- **Hierarchical Balance:** Maintain visual balance between headlines (using bold display weights) and readable body copy (using regular weights). Ensure proper matching of corresponding text styles and weights in both Arabic and Latin (e.g. using `hero` or `titleXl` for luxury promotional titles, and `bodyMd` for long body copy).
- Arabic and Latin fallback واضح.
- لا تحميل خطوط كثيرة أو أوزان غير مستخدمة.
- Platform Vars تختار `fontProfile` من presets فقط، لا font حر.
- density differences between mobile/control-panel/website/webapp must be expressed through roles/profiles, not local CSS/StyleSheet recipes.
- Do not download, embed, or add font files without explicit human approval.

### 3.4 Spacing, grid, rhythm, density

- كل spacing من scale مركزي (`rawSpacingScale`).
- لا padding/margin عشوائي متكرر داخل الشاشات.
- density profiles: compact / comfortable / spacious.
- Employ the "double space" rule around main headings and primary content cards to let layouts breathe.
- control-panel كثيف عمليًا؛ mobile touch-first؛ website/webapp مؤجل redesign.
- لا scroll inflation بسبب فراغات تسويقية زائدة.

### 3.5 Radius, elevation, shadows, surface depth

- radius من scale مركزي (`rawRadiusScale`): `radius md` or `lg`.
- **Cohesive depth:** Use central `shadowPresets` (raised, overlay, floating) to build depth without creating visual clutter or battery/perf drain.
- لا blur/glass/shadow ثقيل داخل lists أو repeated cards.
- depth يخدم hierarchy، لا يكون decoration.

### 3.6 Icons and visual symbols

- **Unified Icons:** Icon/IconButton/DirectionalIcon فقط من ui-kit. All icons and icon buttons must reside within the central design system and be exported via `@bthwani/ui-kit/Icon` or `IconButton`.
- **Standard sizing:** Sizing must align to the scale specified in `rawSizingScale` (16, 20, 24 pixels). Specify the centralized `tone` and `size` properties; no manual override.
- icon tones: default / brand / muted / success / warning / danger / info / inverse.
- chevron/back/forward يجب أن يلتزم RTL.
- لا circle/background محلي حول الأيقونات إذا pattern متكرر.

### 3.7 Components and reusable patterns

- Button / Card / Header / TopBar / Tabs / FilterBar / SearchBar / Sheet / Modal / ListRow / Badge / Chip / Pill / Avatar / StateView / Banner / Ticker / Form controls كلها مركزية عندما تكون reusable.
- one-off screen layout يبقى داخل surface.
- لا نسخ محلية لنفس الكرت أو الزر أو الشارة في عدة أسطح.
- **Header Law:** Orange headers for top-level pages, white headers for sub-pages, and dense admin top bars for control panels.

### 3.8 Navigation and shell identity

- bottom nav للموبايل مركزي.
- control-panel navigation dense/workbench لا يشبه mobile.
- website/webapp readiness فقط الآن، لا redesign.
- navigation states: selected / disabled / loading / empty / offline واضحة.

### 3.9 Forms and inputs

- fields, validation, helper text, error text, selectors, toggles, checkbox/radio من ui-kit عند التكرار.
- لا validation visuals محلية مختلفة لكل سطح.
- touch targets للموبايل لا تقل عن الحد العملي.
- لوحة التحكم تدعم density أعلى بدون تصغير مضر.

### 3.10 Data display and operational clarity

- tables / rows / KPI cards / metric cards / order cards / settlement cards / status rows تحتاج owner واضح.
- WLT visual states لا تغير منطق WLT؛ WLT يملك المال، ui-kit يملك العرض فقط.
- status chips موحدة بين partner/captain/field/control-panel مع اختلاف copy حسب السطح.

### 3.11 Media and images

- لا صور كبيرة eager-loaded.
- image dimensions ثابتة.
- lazy/on-demand loading افتراضي.
- DSH demo media من `dsh/frontend/media-fixtures` فقط عند التجريبي.
- الإنتاج لاحقًا عبر storage/provider، لا خرائط صور ثابتة دائمة.

### 3.12 Motion and micro-interactions

- motion profiles: reduced / standard / expressive.
- **Lean Motion:** Utilize motion values from `rawMotionScale` (120ms to 320ms) for transitions.
- no continuous animations in lists.
- no heavy animated backgrounds.
- Avoid heavy CSS filter shadows or computationally expensive visual animations.
- loading/skeleton خفيف لا يستهلك المعالج.

### 3.13 Accessibility and usability

- contrast واضح.
- focus states للويب ولوحة التحكم.
- disabled states لا تبدو active.
- hit targets واضحة.
- labels ليست color-only.
- reduced motion محترم.
- error/success feedback مفهوم.

### 3.14 RTL and bilingual behavior

- Arabic text right aligned unless hero/headline intentional.
- icon + label same right cluster.
- chevron/action opposite side.
- Avoid `space-between` layouts that separate icons from their associated text. Ensure zero text-clipping.
- numbers/currency/status mixed content لا يكسر الاتجاه.
- filters/carousels/tickers لها direction صريح.

### 3.15 Copy and content tone

- copy قصير وعملي.
- لا blocks طويلة بدل UI ذكي.
- marketing copy في app-client/website مختلف عن operational copy في partner/captain/field/control-panel.
- كل empty/error/loading state له نص واضح.

### 3.16 States coverage

كل screen أو reusable component يجب أن يغطي:

```text
loading / empty / error / success / offline / disabled / permission-denied / partial-data / stale-data
```

### 3.17 Performance and speed

التصميم ممنوع يسبب بطء.

- لا duplicated assets.
- لا heavy shadows/blur in lists.
- لا inline heavy objects داخل repeated components.
- لا broad eager loading.
- no full content pushed to all surfaces.
- IDs/references/lean summaries/pagination/lazy fetching.
- **Asset Optimization:** Use SVG icons or icon fonts instead of heavy images. Minimize the number of external resources and use a single font format to avoid multiple font-file downloads.
- **Eager vs Lazy rendering:** Implement lazy loading for images and list views. Adopt lightweight, performance-aware components like virtualized lists for large datasets, and minimize repaints, CPU consumption, and unnecessary layout interactions.
- measure before/after if visible UI is changed.

### 3.18 Visual QA and evidence

أي تغيير visible يحتاج:

```text
before screenshot when available
after screenshot
device/viewport
RTL note
clipping/overflow check
spacing/alignment check
primary CTA visibility
scroll smoothness note
no unrelated visual drift statement
git diff evidence
```

---

## 4. Surface-first contracts

Identity must be central, but each surface keeps its own product purpose.

### Control Panel-first

```text
Dense, operational, KPI, queue, inspector, map, policy, vars, audit, rollback.
Platform > Vars: preview/simulation/audit first.
No mobile-like oversized cards.
```

### Mobile-first

```text
Touch-first, safe-area, bottom nav, one-primary-action, state clarity, speed.
Fast lists. Offline/poor-network states.
```

### Client-first

```text
Marketing discovery, banners, store/product cards, checkout, tracking.
Attractive marketing without heavy decorative cost. Conversion clarity.
```

### Partner-first

```text
Inventory, order handling, product media, availability, rejection, operational clarity.
Fast decisions, clear operational states.
```

### Captain-first

```text
Fast field execution, pickup/dropoff, status transitions, POD, COD, fail/return.
Field speed and low distraction.
```

### Field-first

```text
Visits, readiness, inspection, checklists, field onboarding.
```

### Webapp-first

```text
Authenticated web experience, account/order/wallet/service flows.
Design redesign is deferred for now; only contract/guard/inventory now.
```

### Website-first

```text
Public marketing, hero, trust, conversion, storytelling, SEO.
Design redesign is deferred for now; only contract/guard/inventory now.
```

---

## 5. Typography and fonts contract

Typography is part of the same single contract file. Do not create a separate fonts contract.

### Required rules

```text
- All surfaces must consume typography through ui-kit Text roles or approved primitives.
- fontFamily outside ui-kit is forbidden unless explicitly allowlisted for technical bridge code.
- repeated fontSize/fontWeight/lineHeight outside ui-kit must be replaced by Text roles or tokenized variants.
- Arabic, Latin, display, and mono font families are owned centrally.
- density differences between mobile/control-panel/website/webapp must be expressed through roles/profiles, not local CSS/StyleSheet recipes.
```

### Human approval required before choosing actual brand fonts

Do not download, embed, or add font files without explicit human approval. Font files must not be shared back to the user.

---

## 6. Platform Vars design policy

Platform Vars لا تملك التصميم. هي تختار approved profiles فقط.

### Allowed VAR_UI_*

```text
VAR_UI_APPEARANCE_MODE         = lightPremium | darkGlass
VAR_UI_FONT_PROFILE            = arabic-system | arabic-readable | arabic-premium
VAR_UI_DENSITY_PROFILE         = compact | comfortable | spacious
VAR_UI_RADIUS_PROFILE          = balanced | soft | sharp
VAR_UI_ELEVATION_PROFILE       = flat | raised | floating-light
VAR_UI_MOTION_PROFILE          = reduced | standard | expressive
VAR_UI_MARKETING_EMPHASIS      = calm | premium | campaign
VAR_UI_CONTROL_PANEL_DENSITY   = compact | balanced
VAR_UI_MEDIA_LOADING_POLICY    = eager-critical-only | lazy-default | on-demand
VAR_UI_DATA_DENSITY_POLICY     = summary-first | balanced | detail-on-demand
```

### Forbidden Design Vars

```text
- free HEX input
- free font family text input
- free token-by-token editing
- direct mutation of ui-kit source from control panel
- financial/WLT logic inside design vars
- bypassing audit/rollback
- applying runtime mutations without backend/API/DB contract and human approval
- runtime mutation without audit/rollback
- bypass ui-kit
- surface-local design overrides
```

### Correct flow

```text
Platform Vars → approved profile resolver → ui-kit tokens/theme/variants → public exports → surfaces
```

### Current stage

```text
Platform Vars stage = preview/control-room policy only
No backend mutation
No database write
No runtime binding
No provider switching
No financial var mutation
```

- **Appearance Modes:** Every screen and surface is considered incomplete unless it supports both `lightPremium` and `darkGlass` appearance modes from day one.
- **Customization Restrictions:** Under no circumstances may arbitrary customization of colors or font families be allowed via the control panel. Control room configuration must strictly pass through pre-defined profiles (e.g. customized Arabic font profile or spacing density) to preserve basic token integrity resolved centrally via `ui-kit`.
- **Precedence:** Binding Platform Vars to real runtime design behavior is a later phase and requires separate human approval.

---

## 7. Closed-loop execution law

Every phase must run as a closed loop:

```text
1. Scope declaration
2. Evidence snapshot
3. Classification
4. Minimal implementation or audit
5. Verification commands
6. Evidence pack
7. Human-readable decision: DONE / BLOCKED / NEEDS_REVIEW
8. Stop and request human approval before the next phase
```

No phase may proceed automatically to the next phase.

---

## 8. Noise cleanup law

The execution must clean noise without unsafe deletion.

```text
Required:
- identify duplicate local design recipes
- identify dead visual styles
- identify unused local design objects
- identify local token aliases
- identify scattered repeated components
- classify before deletion: reusable / screen-specific / dead / legacy / risky
- delete only after replacement and verification
- preserve business logic and runtime behavior
```

Forbidden:

```text
- broad deletion without evidence
- deleting files because they look old
- deleting docs/evidence needed for traceability
- moving DSH/WLT behavior into ui-kit
- fixing design by changing backend/API/finance logic
```

---

## 9. Experimental / demo / design / media isolation policy

نفذ نفس توجه عزل الصور التجريبية على كل شيء تجريبي مرتبط بالهوية والتصميم.

### Scope

```text
demo data / mock data / seed data / preview data / fixture media
sample banners / temporary visuals / prototype style recipes
local image maps / local demo offers / local demo product cards
experimental copy / placeholder illustrations / ad/campaign mock modules
unused theme variants / unused icon aliases
```

### Isolation stages

1. **Inventory:** احصر كل التجريبي ومكانه وconsumers.
2. **Classify:** production / demo / mock / fixture / preview / temporary / dead / retire-candidate.
3. **Centralize or quarantine:** لا تترك نسخ محلية متفرقة.
4. **Replace consumers:** استهلاك عبر adapters/references/IDs/lean summaries.
5. **Prove no runtime dependency:** import scan + build/typecheck + runtime/screenshot if visible.
6. **Mark retire candidates:** سبب الحذف + risk + rollback.
7. **Delete gradually:** batches صغيرة 1-3 أهداف فقط.
8. **Verify again:** git diff + guard + typecheck/build + screenshots عند الحاجة.

### DSH canonical rule

```text
dsh/frontend/data
dsh/frontend/media-fixtures
```

كل related surface يستهلك من central source عبر imports/adapters/references، ولا يملك نسخ demo مستقلة.

### Final delete gate

```text
consumer scan = clean
import scan = clean
build/typecheck = pass
visual/runtime evidence where affected
rollback path exists
human approval recorded
```

---

## 10. Guard strengthening plan

عزز الموجود بدل إنشاء حراس كثيرة.

### Existing guards to enhance

```text
tools/guards/guard-ui-kit-central-design-ownership.mjs
tools/guards/guard-ui-kit-central-design-ownership.config.json
tools/guards/guard-ui-architecture-boundary.mjs
tools/guards/guard-service-frontend-fixture-media-identity.config.json
```

### Required check coverage

```text
- local fontFamily outside ui-kit
- fontSize/fontWeight/letterSpacing repeated outside Text roles
- local palettes/tokens/themes/style recipes
- local color palettes/tokens/themes outside ui-kit
- local typography/fontFamily/fontSize/fontWeight repeated outside ui-kit
- local StyleSheet design recipes that look reusable
- hardcoded visual values outside allowlist
- direct icon color/size/container drift outside ui-kit
- duplicated Button/Card/Header/TopBar/Tabs/Badge/Chip/State/Banner/Form/ListRow
- lane misuse: control-panel vs webapp vs website vs mobile
- local heavy blur/shadow/animation in lists
- inline heavy arrays/objects in repeated components
- large media eager-loaded
- webapp/website guard coverage without redesign
- Platform VAR_UI_* outside allowlist
- experimental/demo/media copies outside canonical/quarantine policy
- design vars free HEX/free font/token editor bypass
- ui-kit new file inflation without allowlist
```

### Mode

```text
advisory-first → fix high-confidence issues → strict for closed categories only
```

---

## 11. Premium Visual Identity & Performance Standards

To ensure a visual identity that combines luxury, practicality, and high performance across all surfaces, the following standards must be strictly enforced:

### A. Central Brand Colors & Visual Contrast (الألوان والتباين البصري)

* **Core Brand Identity:** Trust via `deepBlue` (`#0A2F5C`), primary action emphasis via `orange` (`#FF500D`), and clean surfaces via `white` (`#FFFFFF`).
* **Visual depth:** Enhance premium quality and depth using semantic roles and secondary colors from `lightPremium` and `darkGlass` (e.g. `deepBlueElevated` or `offWhite`).
* **High Contrast:** Ensure strong readability and high contrast (e.g., white text on `deepBlue` backgrounds, or `deepBlue`/`ink` text on light surfaces).
* **No local colors:** Hardcoded, raw color hexes are forbidden outside `@bthwani/ui-kit`.

### B. Typography & Text Relationships (الخطوط وتنسيق النصوص)

* **Standardized Roles:** Use typography scale and text roles defined in `foundation.ts` (e.g. `hero`, `titleXl`, `bodyMd`). No custom font families, inline `fontFamily` strings, or manual font size overrides.
* **Hierarchical Balance:** Maintain visual balance between headlines (using bold display weights) and readable body copy (using regular weights). Ensure proper matching of corresponding text styles and weights in both Arabic and Latin (e.g. using `hero` or `titleXl` for luxury promotional titles, and `bodyMd` for long body copy).

### C. Iconography & Graphical Integrity (العناصر الرسومية والأيقونات)

* **Unified Icons:** All icons and icon buttons must reside within the central design system and be exported via `@bthwani/ui-kit/Icon` or `IconButton`.
* **Standard sizing:** Sizing must align to the scale specified in `rawSizingScale` (16, 20, 24 pixels).
* **No raw styling:** Developers must not override size or color values manually; instead, specify the centralized `tone` and `size` properties.

### D. Spacing, Radius, & Depth (الفراغات والأركان والظلال)

* **Generous spacing:** Follow raw spacing scale (`rawSpacingScale`). Maintain adequate margins and paddings around components (employing the "double space" rule around main headings and primary content cards to let layouts breathe).
* **Consistent corners:** Utilize standard radius sizes (`radius md` or `lg` from `rawRadiusScale`).
* **Cohesive depth:** Use central `shadowPresets` (raised, overlay, floating) to build depth without creating visual clutter or battery/perf drain.

### E. Component Architecture & Header Law (مكونات وهندسة الواجهات)

* **Reusable Primitives:** Elements such as buttons, cards, headers, status tags, sheets, and banners must be centralized in `@bthwani/ui-kit`.
* **Header Law Compliance:** Orange headers for top-level pages, white headers for sub-pages, and dense admin top bars for control panels.
* **Appearance & Customization:** Every screen and surface is considered incomplete if it does not support both `lightPremium` and `darkGlass` appearance modes from day one. Control room configuration must strictly pass through pre-defined profiles (no free HEX or font-family inputs allowed) to preserve basic token integrity.

### F. RTL Alignment & Logical Flow (محاذاة الاتجاهات واللغة العربية)

* **RTL correctness:** Align text to the right for Arabic content. Keep icon + label clustered as a single unit on the right side in rows, with action/chevron buttons on the left.
* **Layout integrity:** Avoid `space-between` layouts that separate icons from their associated text. Ensure zero text-clipping.

### G. Performance, Loading, & Lazy-first Policy (الأداء والتحميل الفائق)

* **Asset Optimization:** Use SVG icons or icon fonts instead of heavy images. Minimize the number of external resources and use a single font format to avoid multiple font-file downloads.
* **Eager vs Lazy rendering:** Implement lazy loading for images and list views. Adopt lightweight, performance-aware components like virtualized lists for large datasets, and minimize repaints, CPU consumption, and unnecessary layout interactions. Ensure screen loading, empty, and error states consume central `StateView` primitives.
* **Lean Motion:** Utilize motion values from `rawMotionScale` (120ms to 320ms) for transitions. Avoid heavy CSS filter shadows or computationally expensive visual animations.

### H. Verification & Visual Evidence Gate (بوابة التحقق البصري)

* **Evidence contract:** Every UI change must document before/after screenshots, viewport size, RTL alignment validation, CTA visibility check, and zero-clipping verification.

---

## 12. معايير الهوية البصرية الفاخرة والعملية

لتصميم هوية بصرية فخمة وعملية وجذابة مع الحفاظ على سرعة الأداء والانسجام عبر جميع الأسطح، تستند المعايير إلى ثلاثة محاور: استخدام الموارد البراندية المعتمدة، الالتزام بعقود التصميم المركزية، والعمل وفق منهجيات تمنح سرعة استجابة عالية.

### 12.1 الألوان والعناصر البصرية

- اعتمد لوحة الألوان المركزية المعرَّفة في ملفات الحوكمة: `deepBlue` للثقة والعناوين الرئيسية، والبرتقالي للأفعال الأساسية والتأكيد، والأبيض للأسطح النظيفة.
- لضمان الفخامة، عزِّز العمق باستخدام ألوان ثانوية من لوحات `lightPremium` و`darkGlass` (مثل `deepBlueElevated` أو `offWhite`) واستعمال contrast عالٍ (نص أبيض على خلفية `deepBlue`، أو نص `deepBlue` على surface فاتح).
- ابتعد عن استخدام درجات عشوائية أو تدرجات ثقيلة — العناصر المصرح بها فقط تُستخدم للحفاظ على وحدة الهوية ولقطع الحاجة إلى تحميل صور وخلفيات ثقيلة.
- التزم بأدوار الألوان الدلالية في `foundation.ts` للاستخدام الثانوي: النجاح والتحذير والخطر والمعلومات — لها معاني ثابتة لا تتغير بين الشاشات.
- `darkGlass` لا يحتوي cards بيضاء صلبة أو text غامق على خلفية غامقة.

### 12.2 الخطوط والتنضيد

- استخدم أنظمة النصوص المعرّفة في `ui-kit`: تعريف موحَّد لعائلات الخطوط، أوزانها، وتباعد الحروف.
- أدوار نصية إلزامية: `display / hero / title / body / caption / label / metric` — استخدمها ولا تضف أحجامًا أو خطوطًا محلية.
- الاعتماد على النصوص المقابلة في العربية واللاتينية مع الوزن المناسب: `hero` أو `titleXl` للعناوين الترويجية، `bodyMd` للنصوص الطويلة.
- وظيفة اختيار الخطوط تُدار عبر سياسات مسبقة ضمن الحوكمة لضبط القراءة بالعربية واللاتينية ومنع تحميل خطوط إضافية غير ضرورية.
- لا تضف خطوطًا أو أحجامًا محلية — هذا يزيد من حجم الموارد ويضعف الأداء.

### 12.3 الأيقونات والعناصر الرسومية

- استخدم `Icon` و`IconButton` و`DirectionalIcon` فقط من `@bthwani/ui-kit` — الأيقونات خارج المكتبة ممنوعة.
- أحجام الأيقونات من `rawSizingScale` فقط (16، 20، 24 نقطة).
- لا تختر لون الأيقونة أو حجمها يدويًا — استخدم متغيرات `tone` و`size` المتاحة في `Icon` و`IconButton`.
- icon tones: `default / brand / muted / success / warning / danger / info / inverse`.
- chevron/back/forward يلتزم RTL — لا circle/background محلي حول الأيقونات إذا كان pattern متكررًا.

### 12.4 المكوّنات والأنماط

- كل عنصر متكرر — الزر والبطاقة والهيدر والشارة والحالات وشريط التنقل والبنرات — له مالك مركزي في `@bthwani/ui-kit`.
- هذا يمنع التكرار ويتيح إعادة استخدام الشيفرة وتحميل الأنماط مرة واحدة بدلاً من تكرارها في كل تطبيق.
- عند بناء الصفحات: استخدم الأنماط الجاهزة مثل `ScreenHeader`، `BottomNavBar`، `Card`، `StateView` بدل إنشاء عناصر محلية جديدة.
- **قانون الهيدر:** الهيدر البرتقالي للشاشات العليا، الأبيض للشاشات الفرعية، الكثيف للويب الإداري.
- one-off screen layout يبقى داخل surface — لا نسخ محلية لنفس الكرت أو الزر أو الشارة في عدة أسطح.

### 12.5 المسافات والأركان والظلال والعمق

- الفخامة تأتي من فراغات سخية حول العناصر وإتاحة هواء للمحتوى (قاعدة "ضاعف مساحة الفراغ" حول العناوين الرئيسية والبطاقات الأساسية).
- استخدم مقاييس المسافات (`rawSpacingScale`) والأنصاف أقطار (`rawRadiusScale`: `radius md` أو `lg`) والظلال (`shadowPresets`: raised، overlay، floating).
- الظلال الدقيقة تضفي عمقًا دون استنزاف المعالج أو استهلاك البطارية.
- لا blur/glass/shadow ثقيل داخل lists أو repeated cards — depth يخدم hierarchy لا يكون decoration.

### 12.6 الترتيب وتوافق RTL

- نص عربي محاذٍ لليمين، وأيقونة + عنوان كتلة واحدة في الجانب الأيمن للقوائم، والسهم أو الفعل في الجهة المقابلة.
- تجنب `space-between` بطرق تفصل الأيقونة عن النص.
- اختبر الأسطح في وضع RTL للتأكد من خلوها من القطع أو التداخل.
- numbers/currency/status mixed content لا يكسر الاتجاه.

### 12.7 سياسات المظهر والتخصيص

- كل شاشة أو سطح يعتبر غير مكتمل إذا لم يدعم حالتي `lightPremium` و`darkGlass` منذ اليوم الأول.
- عند التخصيص من لوحة التحكم: لا يُسمح بتغيير الألوان أو الخطوط عشوائيًا — يُختار واحد من ملفات تعريف محددة مسبقًا (نمط خط عربي مميز أو كثافة تحكم في الفراغات) بحيث تبقى التوكنات الأساسية محفوظة عبر محوّل في `ui-kit`.

### 12.8 السرعة والأداء

الفخامة لا تعني البطء — التصميم ممنوع يسبب بطءًا:

- قلل عدد الخطوط والموارد الخارجية، استخدم صيغة واحدة للخط لتجنب تعدد التحميلات.
- استخدم الأيقونات SVG أو خطوط أيقونات بدلاً من الصور النقطية الكبيرة.
- طبق lazy loading للصور وقوائم البيانات غير المرئية فورًا.
- تجنب المؤثرات البصرية المكلفة: ظلال غامقة متعددة، حركات ثقيلة، blur مستمر في القوائم.
- استخدم قيم الحركة في `rawMotionScale` (120–320 مللي ثانية) للانتقالات.
- اعتمد مكوّنات خفيفة ومراعية للأداء: قوائم افتراضية (virtualized lists) لكميات بيانات كبيرة.
- قلل إعادة الرسم والتفاعلات غير الضرورية.
- لا تكرار للأصول ولا كائنات inline ثقيلة داخل المكوّنات المتكررة.
- قس الأداء قبل/بعد أي تغيير visible في UI.

### 12.9 التحقق والإثبات

طبّق بوابة الدليل البصري المنصوص عليها في الحوكمة — أي تعديل في الواجهة يرفق بـ:

```text
لقطة قبل (when available) + لقطة بعد
الجهاز أو المتصفح أو viewport
تحليل القص والفراغات والمحاذاة
تأكيد رؤية الـ CTA الرئيسية
تأكيد RTL صحيح
تأكيد عدم وجود انحرافات بصرية غير مقصودة
git diff evidence
```

هذا لا يحسن المظهر فقط، بل يكشف أي تدهور في الأداء مبكرًا.

---

> **خلاصة:** الفخامة العملية تستند إلى لوحة ألوان مركزية + تدرج نصي منظم + أيقونات ومكوّنات موحدة + استخدام محسّن للمسافات والظلال + تقليل الأصول الثقيلة + دورة التحقق عبر الدليل البصري. باتباع هذه المعايير تظل الهوية البصرية جذابة وموحدة مع الحفاظ على سرعة الأداء وقابلية الصيانة.

---

# PHASED EXECUTION COMMAND FOR AGENT / COPILOT

Use the following command exactly. Execute one phase only at a time and stop for human approval.

```text
اعمل داخل الريبو الحالي فقط: C:\bthwani-suite.

المطلوب: تنفيذ برنامج BTHWANI_UI_IDENTITY_CLOSURE على مراحل مغلقة، صارمة، ومتسلسلة، مع طلب موافقة الإنسان بعد كل مرحلة قبل الانتقال لما بعدها.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

الهدف النهائي:
توحيد هوية BThwani التصميمية والتسويقية والعملية عبر جميع الأسطح من خلال @bthwani/ui-kit كمالك مركزي وحيد لكل تصميم قابل لإعادة الاستخدام، مع الحفاظ على اختلاف كل سطح حسب مبدأ first الخاص به، ومنع التضخم والتكرار والضجيج والفشل والانحراف البصري.

القواعد غير القابلة للكسر:
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only.
- Tamagui مسموح داخل @bthwani/ui-kit فقط وممنوع خارجه.
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.
- عدد ملفات الكونتراكت = 1 فقط: governance/08_UI_KIT_AND_BRAND.md.
- لا تنشئ ملفات contract جديدة.
- لا تضخم ui-kit.
- لا تنشئ ملفات جديدة داخل ui-kit إلا بعد إثبات الضرورة وطلب موافقة الإنسان.
- لا تنقل business logic أو API أو runtime state أو DSH/WLT-specific behavior إلى ui-kit.
- لا تنقل one-off screen layout إلى ui-kit.
- webapp وwebsite: جهّز contract/guards/inventory فقط الآن، وأجّل redesign البصري لمرحلة لاحقة.
- Platform Vars للتصميم تكون presets/profiles فقط، لا free HEX ولا free font ولا token editor مفتوح.
- WLT يبقى المالك الوحيد لأي منطق مالي.
- لا تدّعِ PASS أو CLOSED أو 100% بدون evidence قابل للتحقق.

نفّذ بنظام الدوائر المغلقة:
Scope → Evidence → Apply/Audit → Verify → Evidence Pack → Decision → STOP FOR HUMAN APPROVAL.

ابدأ من Phase 0 فقط، ولا تنتقل إلى Phase 1 إلا بعد موافقة الإنسان.
```

---

## Phase 0 — Remote/local reality gate

### Goal
Verify the real current local state before any design work. Verify whether this plan file is tracked or local only. Backup local plan before any replacement.

### Scope
No source edits. No UI changes.

### Required checks

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git rev-parse HEAD
git status --short
git --no-pager diff --stat
git --no-pager diff --check
git ls-files --others --exclude-standard
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel
```

### Required output

```text
- current branch
- current commit
- local modified/staged/untracked inventory
- guard results
- CI/GitHub state if available
- decision: DONE / BLOCKED / NEEDS_REVIEW
- STOP: request human approval
```

### Human approval gate

```text
Do not continue to Phase 1 until the human approves Phase 0 evidence.
```

---

## Phase 1 — Contract hardening only

### Goal
Update only `governance/08_UI_KIT_AND_BRAND.md`. Add missing sections from this V3. Do not touch ui-kit components.

### Allowed file

```text
governance/08_UI_KIT_AND_BRAND.md
```

### Add or strengthen sections

```text
- BTHWANI_UI_IDENTITY_CONTRACT_V1
- Ownership Contract
- Boundary Contract
- Reusable Pattern Contract
- Typography & Font Ownership Contract
- Platform Design Vars Policy Contract
- Lane-first Contract
- Noise Cleanup Contract
- Closed-loop Execution Contract
- Human Approval Gate Contract
- Evidence Gate Contract
```

### Forbidden

```text
- no ui-kit source edits
- no package.json edits
- no lockfile edits
- no new contract files
- no redesign
```

### Verify

```powershell
git --no-pager diff -- governance/08_UI_KIT_AND_BRAND.md
git --no-pager diff --check
```

### Human approval gate

Stop and ask human to approve the contract text before Phase 2.

---

## Phase 2 — Guard hardening advisory-only

### Goal
Make the contract enforceable with minimal guard changes. Enhance existing guards/configs. Add coverage for fonts, performance-heavy UI, vars, experimental design/media. No broad failure mode yet if current debt is high.

### Preferred files

```text
tools/guards/guard-ui-kit-central-design-ownership.mjs
tools/guards/guard-ui-kit-central-design-ownership.config.json
tools/guards/guard-ui-architecture-boundary.mjs
tools/guards/guard-service-frontend-fixture-media-identity.config.json
tools/guards/guard-platform-vars-control.mjs or config if design vars rules already belong there
tools/guards/guard-manifest.json only if required
package.json only if a missing script is required
```

### Guard coverage to add or strengthen

```text
- local color palettes/tokens/themes outside ui-kit
- local typography/fontFamily/fontSize/fontWeight repeated outside ui-kit
- local StyleSheet design recipes that look reusable
- duplicated Button/Card/Header/State/Nav/Form/Badge/Chip patterns
- direct icon color/size/container drift outside ui-kit
- lane misuse: control-panel vs webapp vs website vs mobile
- design vars free HEX/free font/token editor bypass
- ui-kit new file inflation without allowlist
- local heavy blur/shadow/animation in lists
- large media eager-loaded
- Platform VAR_UI_* outside allowlist
- experimental/demo/media copies outside canonical/quarantine policy
```

### Forbidden

```text
- no redesign
- no moving components
- no ui-kit component refactor unless separately approved
```

### Verify

```powershell
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel
# run the strengthened/new guard script
# run targeted node syntax check for changed guard files
git --no-pager diff --check
```

### Human approval gate

Stop and ask human to approve guard behavior before Phase 3.

---

## Phase 3 — Numeric UI identity audit only

### Goal
Produce a full inventory of design drift without applying fixes. Produce CSV/JSON/MD inventory. Classify reusable vs one-off, experimental vs production, heavy design risks. No UI edits.

### Audit targets

```text
ui-kit
dsh/frontend
wlt/frontend
app-client
app-partner
app-captain
app-field
control-panel
webapp
website
```

### Classify every finding

```text
- file
- surface
- pattern type
- owner expected
- reusable or screen-specific
- experimental or production
- severity: BLOCKER / HIGH / MEDIUM / LOW
- suggested phase
- safe action
- evidence line
```

### Required categories

```text
- Tamagui/deep import boundary
- local tokens/themes/palettes
- local typography/font drift
- icon drift
- button/card/header/state/nav drift
- RTL/layout drift
- control-panel/webapp/website/mobile lane drift
- Platform Vars design policy gaps
- ui-kit internal hardcoded visual values
- dead/noisy/duplicate design code
- heavy design risks (blur/shadow/animation in lists)
- experimental/demo assets outside canonical sources
```

### Human approval gate

Stop and ask human to approve the prioritized fix order before Phase 4.

---

## Phase 4 — Minimal ui-kit contract hardening

### Goal
Only strengthen existing ui-kit components/types/variants where audit proves necessary. Modify existing files only if required. Add variants/types/resolvers, not new files. Keep public API stable.

### Allowed approach

```text
- use existing ui-kit files first
- add props/variants/types inside existing files
- use Tamagui only internally inside ui-kit if helpful
- preserve public compatibility
- no new ui-kit files unless human-approved
```

### Candidate areas

```text
- Icon / IconButton / DirectionalIcon
- Text roles / typography resolver
- Button / StickyActionBar variants
- Card / Surface / SheetFrame / Dialog / Modal variants
- Badge / Chip / WebControlPanelStatusTag tones
- StateView / LoadingState / EmptyState / ErrorState / SuccessState families
- ScreenHeader / MobileWorkspaceHeader / TopBar / SearchTopBar / ModernPremiumHeader (navigation/header variants)
- BottomNavBar / Web rail / tabs (navigation chrome)
- NewsTickerBar
- Banner / BannerCarousel / OrbitCarousel / StoreHero / WebMissionHeroCard (banners/marketing)
- TextField / SelectField / Checkbox / Radio / Switch (forms/inputs)
```

### Forbidden

```text
- no mass migration
- no redesign of all screens
- no business logic movement
```

### Human approval gate

Stop after evidence and ask approval before consumer migrations.

---

## Phase 5 — App-client marketing identity

### Goal
Unify repeated marketing/client patterns in app-client only. Most marketing-sensitive surface.

### Scope examples

```text
home
store
product cards
banner/hero/offer patterns
cart/checkout visible states
tracking visible states
bottom navigation
icons/buttons/chips/cards used repeatedly
CTA/store/product/tracking states
```

### Rules

```text
- no API/runtime/flow rewrite
- no WLT finance mutation
- no broad redesign
- replace local reusable recipes with ui-kit public exports
- keep screen composition local
- no business logic changes
```

### Evidence

```text
- typecheck/build targeted
- guards
- screenshots for affected client screens (mandatory)
```

### Human approval gate

Stop before partner/captain/field.

---

## Phase 6 — Partner / Captain / Field operational identity

### Goal
Unify inventory/order/media/status/form patterns in partner app. Unify operational mobile patterns shared by captain and field.
Do not make all apps visually identical; make them same identity, different journey.

### Partner focus

```text
inventory, product media, availability, order acceptance/rejection
fast decisions, clear operational states
```

### Captain / Field focus

```text
status rows / action clusters / POD/failure/return states
visit/readiness/checklists / operational cards / icons/chips/buttons
```

### Evidence

Screenshot/runtime evidence mandatory.

### Human approval gate

Stop before control-panel.

---

## Phase 7 — Control Panel operational identity and Vars preview

### Goal
Unify control panel sections through WebControlPanel* lane. Platform > Vars design policy preview/simulation/audit only. No deep runtime mutation unless separate approval.

### Focus

```text
KPI strips
queues
inspectors
workspace tabs
dense headers
platform/vars screens
operations/order views
```

### Human approval gate

Stop before webapp/website inventory.

---

## Phase 8 — Webapp / Website readiness only

### Goal
Prepare webapp/website for future redesign without redesign now. Inventory + guards + ownership map only.

### Allowed

```text
- boundary checks
- inventory
- guard coverage
- no direct Tamagui/deep imports
- no local design system
- no visual redesign
- no marketing hero changes
- no public website refactor
```

### Human approval gate

Stop before any future webapp/website design phase.

---

## Phase 9 — Experimental retirement batches

### Goal
Gradual delete only after isolation evidence. Each batch max 1-3 goals. No global deletion.

### Allowed

```text
- delete only after consumer scan clean
- delete only after import scan clean
- delete only after build/typecheck pass
- delete only after visual/runtime evidence where affected
- delete only after rollback path confirmed
- max 1-3 retire targets per batch
```

### Human approval gate

**STOP FOR HUMAN APPROVAL AFTER EACH BATCH**

---

## Phase 10 — Strict guard promotion

### Goal
Promote categories from advisory to strict only after evidence. Do not strict-fail broad known debt before remediation.

### Human approval gate

**STOP FOR HUMAN APPROVAL**

---

## Phase 11 — Visual evidence and performance gate

### Required screenshots if affected

```text
app-client: home/store/cart/checkout/tracking
app-partner: hub/orders/inventory/product media
app-captain: jobs/status/POD/failure
app-field: stores/visit/readiness
control-panel: dashboard/platform/vars/orders/operations
webapp/website: only if touched
```

### Required checks

```text
- RTL correctness
- clipping/overflow
- spacing/alignment
- primary CTA visibility
- icon/text/chevron placement
- loading/empty/error states
- performance risk: no heavy eager visual payloads
```

### Human approval gate

Stop before final closure claim.

---

## Phase 12 — Final closure decision

### Required before closure

```text
- all changed files listed
- all guards pass
- diff-check passes
- targeted typecheck/build passes
- screenshots supplied for affected UI
- no untracked files ignored
- no local design drift remains in accepted scope
- human approval after every previous phase is documented
- scope matched actual changes
- no unapproved files touched
- no ui-kit inflation
- no local design system drift
- no direct Tamagui outside ui-kit
- no forbidden hardcoded design values
- no font drift
- no RTL violation on affected screens
- no performance regression evidence
- no broad eager media loading
- experimental assets classified and isolated before deletion
- webapp/website not redesigned prematurely
- visual evidence exists for visible changes
- evidence registry folder exists
- human approval recorded
```

### Allowed decisions

```text
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
NEEDS_VISUAL_EVIDENCE
READY_FOR_PR
```

Do not use `CLOSED` or `100%` unless every gate has verifiable evidence.

---

## Phase evidence pack naming

Every phase must generate evidence under:

```text
tools\registry\runs\{SESSION_ID}\
```

---

## Minimal local evidence command template

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"

$IssueCode = "UI_IDENTITY_PHASE_EVIDENCE"
$SessionId = "$IssueCode-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$RunRoot = Join-Path -Path (Get-Location) -ChildPath "tools\registry\runs\$SessionId"
New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

git branch --show-current > (Join-Path $RunRoot "git-branch.txt") 2>&1
git rev-parse HEAD > (Join-Path $RunRoot "git-head.txt") 2>&1
git status --short > (Join-Path $RunRoot "git-status.txt") 2>&1
git --no-pager diff --stat > (Join-Path $RunRoot "git-diff-stat.txt") 2>&1
git --no-pager diff --name-status > (Join-Path $RunRoot "git-diff-name-status.txt") 2>&1
git --no-pager diff --check > (Join-Path $RunRoot "git-diff-check.txt") 2>&1
git ls-files --others --exclude-standard > (Join-Path $RunRoot "git-untracked.txt") 2>&1
pnpm run guard:tamagui-import-boundary > (Join-Path $RunRoot "guard-tamagui-import-boundary.txt") 2>&1
pnpm run guard:i18n-direction:mobile-control-panel > (Join-Path $RunRoot "guard-i18n-direction-mobile-control-panel.txt") 2>&1
pnpm run guard:ui-kit-central-design-ownership > (Join-Path $RunRoot "guard-ui-kit-central-design-ownership.txt") 2>&1

[pscustomobject]@{
  decision = "NEEDS_REVIEW"
  sessionId = $SessionId
  evidenceRoot = $RunRoot
  note = "Phase evidence only. Review logs before claiming pass."
} | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 (Join-Path $RunRoot "evidence.json")

Write-Host "SESSION_ID=$SessionId"
Write-Host "EVIDENCE_ROOT=$RunRoot"
```
