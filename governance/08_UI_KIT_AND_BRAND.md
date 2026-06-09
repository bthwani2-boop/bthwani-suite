# UI Kit, Brand, Tamagui, RTL

**Status:** BTHWANI_UI_IDENTITY_CONTRACT_V1 (Canonical Governance Payload v3)
**Owner:** `Design System Governance`

---

## 1. BTHWANI_UI_IDENTITY_CONTRACT_V1

This document constitutes the single, central, and canonical source of truth for BThwani UI Identity, branding, layout direction, typography, and visual boundaries. No separate design contracts or files may be created. All derived tools, script guards, and developer workflows must align strictly to this contract.

---

## 2. Ownership Contract

`@bthwani/ui-kit` is the sole central owner and authority for all reusable visual patterns, design tokens, styling constants, and core UI components in the BThwani repository.
* Any design system elements, colors, icons, layout rows, and form components that are reused across multiple screens or surfaces must reside in and be exported by `@bthwani/ui-kit`.
* Reusable components include but are not limited to:
  ```text
  Button / StickyActionBar / IconButton / DirectionalIcon
  Card / Surface / SheetFrame / Dialog / Modal
  Badge / Chip / WebControlPanelStatusTag
  ScreenHeader / MobileWorkspaceHeader / WebControlPanel*
  BottomNavBar / Web rail / tabs
  StateView / LoadingState / EmptyState / ErrorState / SuccessState
  TextField / SelectField / Checkbox / Radio / Switch
  ListItem / OptionRow / DataTable / WebControlPanelQueue
  Banner / BannerCarousel / StoreHero / WebMissionHeroCard
  Image/media components
  NewsTickerBar / OrbitCarousel
  ```

---

## 3. Boundary Contract

To maintain structural integrity and prevent design system drift:
1. **The Architecture Law:**
   ```text
   Screen / Surface / App
   → @bthwani/ui-kit public exports only
   → Tamagui internally inside ui-kit only
   ```
2. **Forbidden Imports:**
   * Direct imports from `tamagui` or `@tamagui/*` are strictly forbidden outside `@bthwani/ui-kit` (with the exception of root-level build adapters such as `tamagui.build.ts` when strictly required).
   * Deep imports from `@bthwani/ui-kit/src` or `ui-kit/src` are forbidden. Consumers must use the public exports defined by `@bthwani/ui-kit`.
3. **No Local Design Systems:** Apps, surfaces, and individual packages must not define their own local design system libraries, local typography packages, or custom appearance themes.
4. **Logical Boundaries:** Business logic, API calls, runtime state, and checkout/wallet (DSH/WLT) specific operational behaviors must never be moved into `@bthwani/ui-kit`. The ui-kit remains a pure design and presentation layer.
5. **One-off Screen Layout:** Screen-specific composition belongs in the surface, not in ui-kit. Only patterns reused across two or more surfaces qualify for centralization.

---

## 4. Reusable Pattern Contract & Brand DNA

Every visual pattern category must have a single central definition to prevent visual fragmentation:
* **Brand DNA Tokens:**
  | Token | Value | Use |
  |---|---|---|
  | `deepBlue` | `#0A2F5C` | Trust, headers, primary app structure |
  | `orange` | `#FF500D` | Primary actions, brand emphasis |
  | `white` | `#FFFFFF` | Clean surfaces, secondary headers |
* **Visual Depth & Contrast:** Premium surfaces must utilize the semantic roles and elevations defined in `lightPremium` and `darkGlass` (e.g. `deepBlueElevated` or `offWhite`) to create structural hierarchy. A high contrast ratio must be strictly enforced for readability (e.g. white text on a `deepBlue` background, or `deepBlue`/`ink` text on light surfaces).
* **Central Color System:** Random grays, blues, gradients, or one-off color hexes are forbidden unless tokenized centrally. All components must consume colors through approved semantic roles.
* **Status Colors:** `danger`, `warning`, `success`, and `info` semantic roles carry fixed, immutable meanings that must not vary between screens or surfaces.
* **Header Law:** Orange (`deepBlue`-emphasized) headers for top-level pages, white headers for sub-pages, and dense admin top bars for control panels.
* **darkGlass Law:** `darkGlass` mode must not contain solid white cards or dark text rendered on dark backgrounds.

---

## 5. Typography & Font Ownership Contract

1. **Text Consumption:** All surfaces must consume typography through central `ui-kit` Text roles or approved primitives.
2. **Standardized Text Roles:**
   * Display/Hero titles: `displayXl` (40px/46px), `displayLg` (34px/40px), `hero` (30px/36px) with heavy display weights (bold/black) for promotional screens.
   * Titles: `titleXl` (28px/34px), `titleLg` (24px/30px), `titleMd` (20px/27px), `titleSm` (18px/24px).
   * Body copy: `bodyLg` (17px/26px), `bodyMd` (15px/23px), `bodySm` (14px/20px).
   * Additional roles: `caption`, `label`, `metric` — mandatory for data, status, and operational surfaces.
3. **Forbidden Custom Fonts:** The property `fontFamily` must not be used outside `@bthwani/ui-kit` unless explicitly allowlisted for technical bridge code.
4. **Typography Standardization:** Repeated `fontSize`, `fontWeight`, and `lineHeight` declarations outside `ui-kit` must be replaced by Text roles or tokenized variants.
5. **Brand Font Files:** No font files may be downloaded, embedded, or added to the repository without explicit human approval. Font files must not be shared back to the user or checked into source control without verification of licensing.
6. **Arabic & Latin Alignment:** Corresponding and fitting text styles and weights must be used for both Arabic and Latin (e.g. `hero` or `titleXl` for luxury promotional titles, and `bodyMd` for long body copy).
7. **Density Differences:** Density variations between mobile, control-panel, website, and webapp must be expressed through roles and profiles, not local CSS or StyleSheet recipes.

---

## 6. Spacing, Radius, & Depth (Paddings, Corners, and Shadows)

1. **Breathing Room:** Designers and developers must employ generous spacing (utilizing values from `rawSpacingScale`) around screen headings and primary content cards (the "double space" rule to let layouts breathe).
2. **Corners:** Corners must use the unified `rawRadiusScale` presets (`xs` 6px, `sm` 10px, `md` 14px, `lg` 18px, `xl` 24px, `pill` 999px). Reusable widgets should default to `md` or `lg` radii.
3. **Shadows:** Depth must be achieved using `shadowPresets` (flat, raised, overlay, floating) to avoid visual noise. Custom, heavy inline box shadows or complex drop-shadow CSS filter styling are forbidden.
4. **No Heavy Blur/Shadow in Lists:** Blur, glass effects, and heavy shadow values are forbidden inside repeated list items or cards — depth serves hierarchy, not decoration.

---

## 7. Iconography & Graphical Guidelines

1. **Centralized Icons:** All icons must be loaded through the central `Icon` component. Direct imports of third-party icon libraries (e.g. lucide, font-awesome, expo-vector-icons) outside `ui-kit` are prohibited.
2. **Sizing:** Sizing must strictly map to `rawSizingScale` standards:
   * Small (`iconSm`): 16px
   * Medium (`iconMd`): 20px
   * Large (`iconLg`): 24px
3. **Color & Tone:** Raw color code overrides for icons are forbidden. Developers must consume approved semantic presets via the `tone` property.
4. **Icon Tones:** `default / brand / muted / success / warning / danger / info / inverse` — these are the only accepted tones.
5. **RTL Icons:** Chevron, back, and forward icons must respect RTL direction. Local circular or background containers around icons are forbidden when the pattern is reusable.

---

## 8. Platform Design Vars Policy Contract

Platform Variables (Platform Vars) may control approved design policies, profiles, and presets, but they must never expose raw design internals or direct CSS configuration to the runtime.
1. **Approved Flow:**
   ```text
   Platform > Vars
   → approved design policy/profile only
   → ui-kit resolver/theme output
   → surfaces consume @bthwani/ui-kit public exports
   ```
2. **Allowed Design Presets:**
   * `VAR_UI_APPEARANCE_MODE = lightPremium | darkGlass`
   * `VAR_UI_FONT_PROFILE = arabic-system | arabic-premium | arabic-readable`
   * `VAR_UI_DENSITY_PROFILE = compact | comfortable | spacious`
   * `VAR_UI_RADIUS_PROFILE = soft | balanced | sharp`
   * `VAR_UI_ELEVATION_PROFILE = flat | raised | floating-light`
   * `VAR_UI_MOTION_PROFILE = reduced | standard | expressive`
   * `VAR_UI_MARKETING_EMPHASIS = calm | premium | campaign`
   * `VAR_UI_CONTROL_PANEL_DENSITY = compact | balanced`
   * `VAR_UI_MEDIA_LOADING_POLICY = eager-critical-only | lazy-default | on-demand`
   * `VAR_UI_DATA_DENSITY_POLICY = summary-first | balanced | detail-on-demand`
3. **Forbidden Platform Vars Inputs:**
   * Free-form hex code (`#HEX`) colors.
   * Free font family names.
   * Direct token-by-token style editing.
   * Direct mutation of `ui-kit` source files from the control panel.
   * Mutating configuration or runtime rules without backend/API/DB schema contracts.
   * Financial or WLT logic inside design vars.
   * Applying runtime mutations without audit/rollback path.
4. **Current Policy Scope:**
   * Design Vars are limited to preview and control-room simulation. No backend database writes, runtime bindings, provider switching, or financial ledger mutations are allowed during this stage.
5. **Appearance Modes Requirement:** Every screen and surface is considered incomplete unless it supports both `lightPremium` and `darkGlass` appearance modes from day one.
6. **No Arbitrary Customization:** Under no circumstances may arbitrary customization of colors or font families be allowed via the control panel. Control room configuration must strictly pass through pre-defined profiles (e.g. customized Arabic font profile or spacing density) to preserve basic token integrity resolved centrally via `ui-kit`.

---

## 9. Lane-First Contract

While design tokens are central, each surface maintains design specifications matching its target lane:
* **Control Panel-first:** Dense, operational, KPI-focused, queue/inspector layouts, maps, policy management, audit, and rollback views. No mobile-like oversized cards.
* **Website-first:** Public marketing, SEO, landing heroes, trust indicators, and conversion optimization. (Visual redesign is deferred; only contract/guard inventory applies now.)
* **Webapp-first:** Authenticated web experiences, account, order tracking, and wallet flows. (Visual redesign is deferred; only contract/guard inventory applies now.)
* **Mobile-first:** Touch-friendly targets, safe-area compliance, bottom navigation, primary actions, and immediate speed. Fast lists. Offline/poor-network states visible.
* **Client-first:** Marketing discovery, banner carousels, store cards, checkout, and order tracking. Conversion clarity required.
* **Partner-first:** Inventory management, order fulfillment queues, product media uploads, and availability settings. Fast decisions, clear operational states.
* **Captain-first:** Field execution, pickups, drop-offs, proof of delivery (POD), cash on delivery (COD), and return processing. Field speed and low distraction.
* **Field-first:** Store visits, inspections, audit checklists, and agent onboarding.

---

## 10. RTL Contract

All Arabic user interfaces must be directionally and structurally correct:
1. **Text Alignment:** Text aligns to the right unless intentionally centered for headlines or marketing hero blocks.
2. **Component Directionality:**
   * Icon + text labels must cluster on the right in rows.
   * Actions, controls, and navigation chevrons must appear on the opposite (left) side.
   * Avoid `space-between` layouts that separate an icon from its associated label.
3. **Language Consistency:** Mixed Arabic/English alignment must be avoided unless content strictly requires it.
4. **Horizontal Flows:** Filtering bars, tabs, and carousels must begin sliding or rendering from the right edge.
5. **Clipping & Margins:** Ensure proper RTL spacing and margins to prevent text clipping and layout overlaps.
6. **Numbers & Mixed Content:** Numbers, currency values, and status strings inside Arabic text must not break the layout direction.

---

## 11. Performance, Asset Optimization, & Motion

1. **Asset Selection:** Use lightweight SVG vectors or icon-font bundles instead of raster PNG/JPG assets for UI decorations. Minimize the number of external resources and utilize a single font format to prevent multiple font-file downloads.
2. **Lazy Rendering:** Eager loading of heavy screen visual trees is forbidden. Apply lazy loading to off-screen elements, heavy lists, and drawer panels. Adopt lightweight, performance-aware virtualized lists for large datasets, minimizing repaints, CPU consumption, and layout interactions.
3. **Performance States:** All screens must map empty, loading, error, and offline states utilizing the lightweight `StateView` components to prevent rendering layout shifts.
4. **Motion Durations:** Transitions and micro-animations must utilize transitions from `rawMotionScale` constrained between 120ms (quick) and 320ms (emphasized) to maintain responsiveness without visual lag. Avoid heavy CSS filter shadows or computationally expensive visual animations.
5. **No Inline Heavy Objects:** Inline arrays, large style objects, or computationally expensive operations are forbidden inside repeated components or list items.
6. **No Continuous Animations in Lists:** Continuous or looping animations inside list rows are forbidden — they cause scroll jank and battery drain.
7. **Measure Before/After:** Any visible UI change must include a performance risk note. If the change affects lists, layout, or heavy render paths, before/after evidence is required.

---

## 12. Noise Cleanup Contract

Visual cleanup must proceed systematically without breaking existing logic:
1. **Identify and Classify:** Identify local color recipes, duplicate typography styles, legacy styles, and scattered components. Classify them before action as: `reusable`, `screen-specific`, `dead`, `legacy`, or `risky`.
2. **Safe Replacement:** Replace local styling with official `@bthwani/ui-kit` equivalents, verify layout compatibility, and delete the stale local recipes only after verification.
3. **No Business Logic Alteration:** Do not modify business rules, state machines, API boundaries, or financial logic under the guise of design cleanup.
4. **Final Delete Gate:** A local design artifact may only be deleted after all of the following are confirmed:
   ```text
   consumer scan = clean
   import scan = clean
   build/typecheck = pass
   visual/runtime evidence where affected
   rollback path exists
   human approval recorded
   ```
5. **Batch Size:** Delete targets must be batched at 1–3 items maximum per cycle. No global sweeps.

---

## 13. Closed-Loop Execution Contract

Every phase of the UI Identity program must execute in a closed-loop pattern:
```text
1. Scope declaration
2. Evidence snapshot (git status, diff checks, guard outputs)
3. Minimal implementation / audit
4. Verification commands (build, lint, test, dry-run guards)
5. Evidence pack generation
6. Human-readable decision (DONE / BLOCKED / NEEDS_REVIEW)
7. Stop and request human approval
```
No phase may proceed automatically to the next phase. Human approval is mandatory after every phase.

---

## 14. Human Approval & Evidence Gate Contract

1. **Mandatory Stopping Points:** The agent must halt and request human approval after the completion of each phase before commencing the next.
2. **Evidence Pack Generation:** Every phase must compile its outputs into a verified zip file under `tools\registry\runs\{SESSION_ID}\` named exactly `{SESSION_ID}.zip`.
3. **Zero Claims Policy:** No phase may claim `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` without:
   * A clean `git diff --check` output.
   * Verification of relevant guards (`guard:tamagui-import-boundary`, `guard:i18n-direction`).
   * Visual evidence (screenshots/recordings) for affected UI surfaces.
   * Proof of build and typecheck passing for modified files.
4. **Allowed Phase Decisions:**
   ```text
   PASS_WITH_WARNINGS
   FIX_REQUIRED
   BLOCKED
   NEEDS_VISUAL_EVIDENCE
   READY_FOR_PR
   ```

---

## 15. Data Display & Operational Clarity Contract

Ownership of data display components must be explicitly assigned to prevent fragmentation:
1. **Owned by `@bthwani/ui-kit`:** Tables (`DataTable`), list rows (`ListItem`, `OptionRow`), KPI cards, metric cards, status chips (`Badge`, `Chip`, `WebControlPanelStatusTag`), settlement rows, and order cards — when reused across two or more surfaces.
2. **WLT Ownership Boundary:** WLT (Wallet & Ledger) owns all financial logic, balance state, and ledger calculations. `@bthwani/ui-kit` owns the visual presentation layer only. Business logic must never migrate into ui-kit display components.
3. **Status Chip Unification:** Status chips must carry unified tones across partner, captain, field, and control-panel surfaces. Surface-specific copy (label text) is permitted; color and shape must remain central.
4. **No Duplicated Display Components:** A table, metric card, or status row may not have separate local implementations in multiple surfaces.

---

## 16. States Coverage Contract

Every screen and every reusable component must implement all applicable states:
```text
loading          — skeleton or spinner, never blank
empty            — instructive message, never hidden
error            — actionable message, never silent
success          — confirmation, then transition
offline          — graceful degradation, not crash
disabled         — visually distinct, not merely grayed
permission-denied — clear message, not a broken screen
partial-data     — labeled as such, not shown as complete
stale-data       — labeled with age indicator or refresh action
```
1. **No Happy-Path-Only Components:** A component that only handles the success state is incomplete and must not be merged.
2. **StateView Primitive:** Empty, loading, error, offline, and permission-denied states must consume the central `StateView` primitive from `@bthwani/ui-kit`. Local state UI implementations are forbidden for reusable patterns.
3. **Interaction States:** Interactive elements must visually support: `default`, `pressed`, `focused`, `disabled`, `selected`, `expanded`, `collapsed`.

---

## 17. Media & Images Contract

1. **No Eager-Loaded Large Images:** Heavy raster images must not be eagerly loaded. Lazy loading is the default policy.
2. **Fixed Dimensions:** Image containers must have fixed dimensions defined at render time to prevent layout shift.
3. **DSH Demo Media Policy:** Experimental, demo, and fixture media files belong exclusively in `dsh/frontend/media-fixtures`. Related surfaces must import from this central source via adapters or references — no independent local demo copies are permitted.
4. **Production Media:** Production images must be served via the approved storage provider and referenced by ID or URL. Static hardcoded image maps are forbidden in production.
5. **Format Preference:** SVG for icons and decorative graphics; WebP or AVIF for photos. PNG and JPEG raster imports inside code are advisory warnings.

---

## 18. Experimental / Demo / Media Isolation Policy

All non-production design artifacts must be explicitly classified and isolated:
1. **Classification Labels:**
   ```text
   production     — live, real, verified
   demo           — controlled demo, not production
   mock           — test-only, never ships to production
   fixture        — test/preview data, canonical location only
   preview        — staged, human-approved before promotion
   temporary      — time-bounded, must have an owner and expiry
   dead           — no consumers, eligible for deletion
   retire-candidate — scheduled for removal, documented
   ```
2. **Isolation Rule:** Demo data, mock banners, seed images, prototype style recipes, and experimental copy must never live inside surface-specific screen files. They must reside in their canonical location (`dsh/frontend/data`, `dsh/frontend/media-fixtures`) and be consumed via imports or adapters.
3. **Retire Process:** A retire-candidate may be deleted only after:
   * Consumer scan confirms zero active imports.
   * Build and typecheck pass without it.
   * Visual or runtime evidence exists where UI is affected.
   * Human approval is recorded with rollback path.
4. **No Silent Accumulation:** Experimental files without a classification label are treated as design noise and are subject to removal without further notice.

---

## 19. Copy & Content Tone Contract

1. **Operational Copy:** Short, direct, and task-oriented. Used in partner, captain, field, and control-panel surfaces.
2. **Marketing Copy:** Persuasive and brand-aligned. Used in app-client, website, and marketing sections of webapp.
3. **No Long Blocks:** Text blocks of more than 3 lines in operational screens indicate a design failure — replace with structured UI (chips, status rows, action buttons).
4. **State Copy:** Every empty, error, loading, and offline state must have purposeful text. Placeholder copy such as "No data" or "Error occurred" alone is not acceptable — provide context and a recovery action.
5. **Arabic Copy:** Arabic text must be written by a native speaker or reviewed for natural phrasing. Translated-from-English Arabic copy that sounds unnatural is a design defect.

---

## 20. Visual QA & Evidence Contract

Every visible UI change — regardless of scope — requires the following evidence before closure:
```text
1. before screenshot (when available)
2. after screenshot
3. device / viewport specification
4. RTL alignment note
5. clipping and overflow check result
6. spacing and alignment check result
7. primary CTA visibility confirmation
8. scroll smoothness note (for list or scroll changes)
9. no-unrelated-visual-drift statement
10. git diff evidence
```
1. **No Visual PASS Without Screenshots:** A visible change that lacks screenshots must be classified as `NEEDS_VISUAL_EVIDENCE`, not `PASS`.
2. **RTL Evidence Mandatory:** Any screen or component touching Arabic layout must include an RTL screenshot or equivalent RTL verification note.
3. **Accessibility Check:** Contrast ratio, touch target size, and focus visibility must be verified for any new or modified interactive component.

---

## 21. Guard Enforcement Reference

The following guards enforce this contract. They must be run on every relevant change:

| Guard Script | Enforces | Mode |
|---|---|---|
| `guard-ui-architecture-boundary.mjs` | Tamagui import boundary | strict |
| `guard-ui-kit-central-design-ownership.mjs` | Local design drift, icon drift, font drift, lane misuse, free design vars | advisory → strict per category |
| `guard-design-token-drift.mjs` | Local token/color/palette drift outside ui-kit | advisory |
| `guard-platform-vars-control.mjs` | Platform Vars allowlist enforcement | advisory |
| `guard-service-frontend-fixture-media-identity.mjs` | Demo/fixture media isolation | advisory |
| `guard-central-i18n-direction.mjs` | RTL direction imports | strict |

**Promotion Rule:** A guard category moves from advisory to strict only after the corresponding debt has been remediated and human approval is recorded. No broad strict-fail before remediation.

---

## 22. Premium Visual Identity & Performance Standards

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

## 23. معايير الهوية البصرية الفاخرة والعملية

لتصميم هوية بصرية فخمة وعملية وجذابة مع الحفاظ على سرعة الأداء والانسجام عبر جميع الأسطح، تستند المعايير إلى ثلاثة محاور: استخدام الموارد البراندية المعتمدة، الالتزام بعقود التصميم المركزية، والعمل وفق منهجيات تمنح سرعة استجابة عالية.

### 23.1 الألوان والعناصر البصرية
- اعتمد لوحة الألوان المركزية المعرَّفة في ملفات الحوكمة: `deepBlue` للثقة والعناوين الرئيسية، والبرتقالي للأفعال الأساسية والتأكيد، والأبيض للأسطح النظيفة.
- لضمان الفخامة، عزِّز العمق باستخدام ألوان ثانوية من لوحات `lightPremium` و`darkGlass` (مثل `deepBlueElevated` أو `offWhite`) واستعمال contrast عالٍ (نص أبيض على خلفية `deepBlue`، أو نص `deepBlue` على surface فاتح).
- ابتعد عن استخدام درجات عشوائية أو تدرجات ثقيلة — العناصر المصرح بها فقط تُسخدم للحفاظ على وحدة الهوية ولقطع الحاجة إلى تحميل صور وخلفيات ثقيلة.
- التزم بأدوار الألوان الدلالية في `foundation.ts` للاستخدام الثانوي: النجاح والتحذير والخطر والمعلومات — لها معاني ثابتة لا تتغير بين الشاشات.
- `darkGlass` لا يحتوي cards بيضاء صلبة أو text غامق على خلفية غامقة.

### 23.2 الخطوط والتنضيد
- استخدم أنظمة النصوص المعرّفة في `ui-kit`: تعريف موحَّد لعائلات الخطوط، أوزانها، وتباعد الحروف.
- أدوار نصية إلزامية: `display / hero / title / body / caption / label / metric` — استخدمها ولا تضف أحجامًا أو خطوطًا محلية.
- الاعتماد على النصوص المقابلة في العربية واللاتينية مع الوزن المناسب: `hero` أو `titleXl` للعناوين الترويجية، `bodyMd` للنصوص الطويلة.
- وظيفة اختيار الخطوط تُدار عبر سياسات مسبقة ضمن الحوكمة لضبط القراءة بالعربية واللاتينية ومنع تحميل خطوط إضافية غير ضرورية.
- لا تضف خطوطًا أو أحجامًا محلية — هذا يزيد من حجم الموارد ويضعف الأداء.

### 23.3 الأيقونات والعناصر الرسومية
- استخدم `Icon` و`IconButton` و`DirectionalIcon` فقط من `@bthwani/ui-kit` — الأيقونات خارج المكتبة ممنوعة.
- أحجام الأيقونات من `rawSizingScale` فقط (16، 20، 24 نقطة).
- لا تختر لون الأيقونة أو حجمها يدويًا — استخدم متغيرات `tone` و`size` المتاحة في `Icon` و`IconButton`.
- icon tones: `default / brand / muted / success / warning / danger / info / inverse`.
- chevron/back/forward يلتزم RTL — لا circle/background محلي حول الأيقونات إذا كان pattern متكررًا.

### 23.4 المكوّنات والأنماط
- كل عنصر متكرر — الزر والبطاقة والهيدر والشارة والحالات وشريط التنقل والبنرات — له مالك مركزي في `@bthwani/ui-kit`.
- هذا يمنع التكرار ويتيح إعادة استخدام الشيفرة وتحميل الأنماط مرة واحدة بدلاً من تكرارها في كل تطبيق.
- عند بناء الصفحات: استخدم الأنماط الجاهزة مثل `ScreenHeader`، `BottomNavBar`، `Card`، `StateView` بدل إنشاء عناصر محلية جديدة.
- **قانون الهيدر:** الهيدر البرتقالي للشاشات العليا، الأبيض للشاشات الفرعية، الكثيف للويب الإداري.
- one-off screen layout يبقى داخل surface — لا نسخ محلية لنفس الكرت أو الزر أو الشارة في عدة أسطح.

### 23.5 المسافات والأركان والظلال والعمق
- الفخامة تأتي من فراغات سخية حول العناصر وإتاحة هواء للمحتوى (قاعدة "ضاعف مساحة الفراغ" حول العناوين الرئيسية والبطاقات الأساسية).
- استخدم مقاييس المسافات (`rawSpacingScale`) والأنصاف أقطار (`rawRadiusScale`: `radius md` أو `lg`) والظلال (`shadowPresets`: raised، overlay، floating).
- الظلال الدقيقة تضفي عمقًا دون استنزاف المعالج أو استهلاك البطارية.
- لا blur/glass/shadow ثقيل داخل lists أو repeated cards — depth يخدم hierarchy لا يكون decoration.

### 23.6 الترتيب وتوافق RTL
- نص عربي محاذٍ لليمين، وأيقونة + عنوان كتلة واحدة في الجانب الأيمن للقوائم، والسهم أو الفعل في الجهة المقابلة.
- تجنب `space-between` بطرق تفصل الأيقونة عن النص.
- اختبر الأسطح في وضع RTL للتأكد من خلوها من القطع أو التداخل.
- numbers/currency/status mixed content لا يكسر الاتجاه.

### 23.7 سياسات المظهر والتخصيص
- كل شاشة أو سطح يعتبر غير مكتمل إذا لم يدعم حالتي `lightPremium` و`darkGlass` منذ اليوم الأول.
- عند التخصيص من لوحة التحكم: لا يُسمح بتغيير الألوان أو الخطوط عشوائيًا — يُختار واحد من ملفات تعريف محددة مسبقًا (نمط خط عربي مميز أو كثافة تحكم في الفراغات) بحيث تبقى التوكنات الأساسية محفوظة عبر محوّل في `ui-kit`.

### 23.8 السرعة والأداء
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

### 23.9 التحقق والإثبات
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
