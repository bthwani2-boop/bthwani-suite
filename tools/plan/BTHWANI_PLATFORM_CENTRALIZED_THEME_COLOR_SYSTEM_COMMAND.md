# BThwani Platform-Wide Centralized Theme + Color System — Execution Command

**Target repo:** `C:\bthwani-suite`
**Target branch:** `ghb/0144-20260516-033533-local-change-review-patch`
**Delivery type:** VS Code Copilot Chat / local AI execution command
**Scope:** Platform-wide color/theme contract with safe first adoption
**Risk:** High, because it touches UI Kit theme contracts and may affect web/mobile consumers
**Mode:** Inspect → prove root cause → apply token-only safe changes → verify

---

## أمر التنفيذ

```text
أنت تعمل داخل C:\bthwani-suite على الفرع الحالي ghb/0144-20260516-033533-local-change-review-patch.

المطلوب: تنفيذ عقد Centralized BThwani Theme + Centralized BThwani Color System لكل منصة BThwani، وليس للوحة التحكم فقط. الهدف هو بناء منصة واحدة متكاملة ومتناسقة ومتناغمة بهوية واحدة عبر كل تطبيقات الويب والموبايل: app-client, app-partner, app-captain, app-field, control-panel, webapp, website، وكل surfaces/packages التي تستهلك UI.

هذا ليس مشروع إعادة تصميم.
هذا ليس اختيار ألوان عشوائي.
هذا ليس تلوين يدوي لكل شاشة.
هذا ليس replace أعمى.
هذا ليس هدم أو إعادة بناء للشاشات.
هذا ترحيل آمن إلى نظام ألوان وثيم مركزي مملوك من @bthwani/ui-kit فقط.

نفّذ بحذر شديد، ولا تنتقل لأي مهمة أخرى قبل إغلاق هذا النطاق بالأدلة. لا تقل PASS/CLOSED/100%.

الهدف المعماري:
User changes theme once
→ app/root provider updates mode
→ root/native/web shell gets theme state
→ @bthwani/ui-kit foundation generates canonical semantic theme/color tokens
→ app-shells + surfaces + screens consume tokens/components only
→ كل تطبيقات الويب والموبايل تتغير تلقائيًا وبنفس هوية BThwani

قاعدة العمارة غير القابلة للكسر:
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only

ممنوع:
- لا تستورد Tamagui مباشرة داخل screens/surfaces/apps.
- لا تنشئ design system محلي في أي تطبيق أو surface.
- لا تضف ألوان HEX/RGB/HSL جديدة خارج ui-kit/src/foundation.ts.
- لا تستخدم .dark محلية داخل الشاشات.
- لا تلوّن كل شاشة يدويًا.
- لا تستخدم hardcoded colors جديدة داخل apps أو surfaces.
- لا تحذف --bth-* أو --ui-* الآن.
- لا تغيّر layout أو spacing أو grid أو hierarchy إلا إذا كان مرتبطًا مباشرة بإزالة تشوه لون واضح.
- لا تغيّر flow أو navigation أو business logic.
- لا تعدّل backend/API/runtime/dependencies/package.json/lockfile.
- لا تعمل broad/global replace أعمى.
- لا تحذف أو تنقل ملفات.
- لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

قاعدة حماية الشاشات:
- ممنوع هدم أو إعادة بناء أي شاشة.
- أي تعديل يجب أن يكون token-only أو theme/color ownership فقط.
- إذا كان ملف عالي المخاطر أو يحتاج فهم أعمق: لا تعدله؛ اكتبه في Findings كـ UNPROVEN/NEEDS_PHASE_2.
- لا تطبق أي تعديل قبل إثبات owner/import/export وسبب الحاجة له.
- المطلوب الحفاظ على كل الشاشات كما هي وظيفيًا وبصريًا قدر الإمكان، مع جعل ألوانها تقرأ من النظام المركزي.

افحص أولًا بدون تعديل:
1) ui-kit/src/foundation.ts
2) ui-kit/src/providers.tsx
3) ui-kit/src/index.ts
4) ui-kit/src/mobile.ts
5) ui-kit/src/web.ts
6) ui-kit/src/web/command-center.tsx
7) ui-kit/src/web/control-surface.tsx
8) packages/app-shells إن وجدت
9) packages/surfaces ذات العلاقة
10) app-client shell/root/theme/provider files
11) app-partner shell/root/theme/provider files
12) app-captain shell/root/theme/provider files
13) app-field shell/root/theme/provider files
14) control-panel shell/root/theme/provider files
15) webapp shell/root/theme/provider files
16) website shell/root/theme/provider files
17) أي CSS/TSX واضح أنه يستهلك ألوانًا مباشرة داخل apps أو dsh/frontend/control-panel

Root Cause المطلوب إثباته قبل APPLY:
- أين يتم توليد theme variables الحالي؟
- أين توجد rawColorPalettes / semanticColorRoles / lightTheme / darkTheme؟
- هل foundation.ts هو مالك الألوان الخام؟
- هل prefix الحالي هو --bth-*؟
- هل توجد aliases باسم --ui-*؟
- أين يجب إضافة --bthwani-* بدون كسر القديم؟
- كيف يستهلك تطبيق العميل الثيم حاليًا؟
- ما الفرق بين web consumption وmobile/native consumption؟
- هل توجد ألوان ثابتة داخل WebCommandCenter / WebControlPanel primitives؟
- هل توجد ألوان ثابتة داخل شاشات أو CSS التطبيقات؟
- هل تغيير الثيم يتم من provider/root مرة واحدة أم يوجد منطق محلي مكرر؟
- هل كل surfaces/apps تستهلك @bthwani/ui-kit public exports فقط؟

نطاق التعديل المسموح في هذه المرحلة:
- ui-kit/src/foundation.ts
- ui-kit/src/providers.tsx فقط إذا كان لازمًا لتوحيد provider أو theme exposure
- ui-kit/src/index.ts / mobile.ts / web.ts فقط إذا كان لازمًا لتصدير public contract واضح
- ui-kit/src/web/command-center.tsx
- ui-kit/src/web/control-surface.tsx
- packages/app-shells/root shell files فقط إذا كانت تستهلك theme مباشرة
- root/shell/provider files لكل تطبيق فقط عند الحاجة
- control-panel shell/css files المرتبطة بالثيم
- ملفات CSS/TSX ذات ألوان ثابتة واضحة فقط إذا كان تعديلها token-only وآمنًا

إذا احتجت تعديل ملف خارج هذا النطاق:
- توقف.
- اكتب BLOCKED/NEEDS_SCOPE_APPROVAL.
- لا توسع التنفيذ بنفسك.

قواعد نظام الألوان المركزي:
- ui-kit/src/foundation.ts هو المالك الوحيد للألوان الخام Raw Colors.
- كل raw palettes والـ semantic roles تبقى داخل foundation.ts فقط.
- التطبيقات لا تختار ألوانًا.
- الشاشات لا تعرف Light/Dark.
- الشاشات تقرأ semantic tokens أو components من UI Kit فقط.
- ألوان الهوية BThwani يجب أن تأتي من النظام المركزي، لا من HEX محلي.
- success/warning/danger/info يجب أن تكون tokens مركزية.
- أي لون جديد يحتاج سببًا واضحًا ويضاف فقط في foundation.ts، وليس داخل CSS أو شاشة.
- لا يوجد نظام ألوان للويب وآخر للموبايل؛ المصدر واحد، وطريقة الإخراج فقط تختلف.

المطلوب في foundation.ts:
1) اجعل --bthwani-* هو prefix canonical الجديد للـ theme/color CSS variables.
2) أضف/ثبّت توليد --bthwani-* لكل theme key أساسي:
   --bthwani-background
   --bthwani-background-alt
   --bthwani-surface
   --bthwani-surface-raised
   --bthwani-surface-inset
   --bthwani-surface-secondary
   --bthwani-line
   --bthwani-line-strong
   --bthwani-text
   --bthwani-text-muted
   --bthwani-text-soft
   --bthwani-text-inverse
   --bthwani-brand
   --bthwani-brand-contrast
   --bthwani-brand-surface
   --bthwani-brand-header-background
   --bthwani-brand-header-surface
   --bthwani-brand-header-surface-strong
   --bthwani-brand-header-stroke
   --bthwani-success
   --bthwani-success-surface
   --bthwani-success-text
   --bthwani-warning
   --bthwani-warning-surface
   --bthwani-warning-text
   --bthwani-danger
   --bthwani-danger-surface
   --bthwani-danger-text
   --bthwani-info
   --bthwani-info-surface
   --bthwani-info-text
   --bthwani-field-background
   --bthwani-field-border
   --bthwani-field-border-active
   --bthwani-field-placeholder
3) أبقِ --bth-* و --ui-* كـ compatibility aliases مؤقتًا حتى لا ينكسر المشروع.
4) اجعل aliases القديمة تشير للقيم الجديدة أو اجعل الجديدة تشير للأصل الحالي بطريقة واضحة وآمنة.
5) أضف platform-wide semantic aliases مشتقة فقط من --bthwani-*:
   --bthwani-app-background
   --bthwani-app-surface
   --bthwani-app-surface-raised
   --bthwani-app-surface-inset
   --bthwani-app-border
   --bthwani-app-border-strong
   --bthwani-app-text
   --bthwani-app-text-muted
   --bthwani-app-text-soft
   --bthwani-app-brand
   --bthwani-app-brand-surface
   --bthwani-app-field
   --bthwani-app-field-border
   --bthwani-app-focus-ring
6) أضف control-panel aliases كطبقة متخصصة مشتقة من platform aliases، لا كألوان مستقلة:
   --bthwani-control-panel-background
   --bthwani-control-panel-stage
   --bthwani-control-panel-surface
   --bthwani-control-panel-surface-raised
   --bthwani-control-panel-surface-inset
   --bthwani-control-panel-border
   --bthwani-control-panel-border-strong
   --bthwani-control-panel-text
   --bthwani-control-panel-text-muted
   --bthwani-control-panel-text-soft
   --bthwani-control-panel-brand
   --bthwani-control-panel-brand-surface
   --bthwani-control-panel-field
   --bthwani-control-panel-field-border
   --bthwani-control-panel-focus-ring
7) لا تجعل أي alias قيمته HEX مباشرة إلا إذا كان raw theme value داخل lightTheme/darkTheme/highContrastTheme.

المطلوب في UI Kit web/mobile primitives:
- Web primitives يجب أن تستخدم --bthwani-* أو aliases المشتقة منها.
- Mobile/native primitives يجب أن تستهلك نفس semantic theme object من foundation، وليس ألوان محلية.
- لا تجعل web له ألوان مستقلة والموبايل له ألوان مستقلة.
- اختلاف المنصة مسموح في طريقة الإخراج فقط، لا في مصدر اللون:
  web → CSS variables
  mobile → theme object/tokens
- لا تكسر public API.
- لا تضف exports عشوائية أو export *.

المطلوب في apps/shells:
- تحقق أن كل app root/shell يأخذ theme من provider مركزي.
- لا تجعل كل تطبيق يعرّف palette خاصة به.
- إذا وجدت theme محلي داخل app، لا تعدله مباشرة إذا كان عالي المخاطر؛ سجله في Findings كـ NEEDS_PHASE_2.
- أي تطبيق يمكن توحيده آمنًا عبر provider/root بدون كسر، نفّذه.

المطلوب في control-panel/web:
- استبدل hardcoded light colors داخل command-center/control-surface/control-panel CSS بمتغيرات مركزية.
- لا تغيّر layout أو rail direction أو collapse behavior.
- لا تغيّر copy أو navigation.
- لا تجعل Marketing CSS يقرر ألوانه بنفسه؛ يجب أن يقرأ من النظام المركزي فقط.

متطلبات Profile/Theme ownership:
- تغيير الثيم لا يكون صفحة مستقلة داخل قسم platform.
- مدخل تغيير الثيم يكون من Profile/Avatar في shell.
- إذا كان تنفيذ profile الكامل عالي المخاطر في هذه المرحلة، نفّذ safe trigger/settings panel محدود أو اتركه NEEDS_PHASE_2 مع سبب واضح.
- لا تكسر الشل.

متطلبات التناسق العام:
- كل تطبيقات الويب والموبايل يجب أن تنتمي لنفس الهوية.
- لا توجد palettes متبعثرة لكل تطبيق.
- لا توجد ألوان محلية داخل الشاشات.
- لا توجد أسماء tokens متعددة بلا سبب.
- لا يوجد ضجيج أو duplicate theme systems.
- foundation.ts هو مصدر الحقيقة للألوان والثيم.
- UI Kit هو مصدر الحقيقة للمكونات والتوكنات.
- التطبيقات تستهلك فقط ولا تقرر الهوية.

قبل APPLY:
اعرض باختصار:
- الملفات التي ستعدلها.
- سبب تعديل كل ملف.
- هل التغيير platform-wide token contract أو web adoption أو mobile/root adoption أو control-panel adoption.
ثم نفّذ فقط ضمن النطاق.

بعد APPLY شغّل:
- git --no-pager status --short
- git --no-pager diff --stat
- git --no-pager diff --name-status
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit

Acceptance Criteria:
1) --bthwani-* هو عقد الألوان والثيم canonical الجديد لكل المنصة.
2) --bth-* و --ui-* ما زالت تعمل كـ compatibility aliases.
3) foundation.ts هو مصدر الألوان الخام الوحيد.
4) لا توجد ألوان HEX جديدة خارج foundation.ts.
5) web وmobile يستهلكان نفس semantic color system.
6) لا توجد palettes محلية جديدة داخل apps أو screens أو surfaces.
7) تغيير الثيم من provider/root يغير الواجهة من مصدر مركزي.
8) لا توجد .dark محلية داخل الشاشات.
9) لا يوجد تغيير layout أو routing أو flow غير مطلوب.
10) لا توجد شاشة مهدومة أو مكوّن محذوف.
11) لا توجد تغييرات خارج النطاق.
12) git diff --check يمر.
13) pnpm -w exec tsc --noEmit يمر أو يظهر الخطأ الحقيقي بدون إخفاء.
14) اطلب مني screenshots للعينات التالية بعد التنفيذ:
   - app-client في light/dark
   - control-panel/marketing في light/dark
   - أي شاشة mobile أخرى تم لمسها

بعد التنفيذ:
- اذكر الملفات المعدلة فقط.
- اذكر سبب كل تعديل بسطر واحد.
- اذكر أي شيء تركته UNPROVEN أو NEEDS_PHASE_2.
- لا تقل PASS/CLOSED/100%.
```

---

## أوامر التحقق بعد التنفيذ

```powershell
Set-Location -LiteralPath "C:thwani-suite"

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check

pnpm -w exec tsc --noEmit
```

---

## أدلة بصرية مطلوبة بعد التنفيذ

بعد التنفيذ، التقط screenshots لهذه العينات:

1. `app-client` في light mode.
2. `app-client` في dark mode.
3. `control-panel/marketing` في light mode.
4. `control-panel/marketing` في dark mode.
5. أي شاشة mobile أخرى تم لمسها أثناء التنفيذ.

لا يتم اعتبار التغيير مقبولًا بصريًا بدون screenshots بعدية.
