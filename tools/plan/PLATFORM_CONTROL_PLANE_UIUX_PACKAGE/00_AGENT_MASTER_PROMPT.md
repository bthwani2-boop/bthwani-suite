# 00 — MASTER AGENT PROMPT

نفّذ هذه المهمة في `C:\bthwani-suite` فقط، على الفرع الحالي للمشروع، وبمنهجية تشخيص ثم تنفيذ ثم تحقق.

## الهدف النهائي لهذه المرحلة

إعادة توجيه وتصميم قسم:

```text
control-panel/runtime/app/platform/page.tsx
dsh/frontend/control-panel/platform/
```

ليصبح **Platform Control Plane UI/UX** واضحًا ومفهومًا للمتحكم البشري الأعلى في الإدارة، وليس شاشة قراءة تقنية أو debug records.

المطلوب ليس إغلاق runtime الحقيقي الآن، بل إغلاق تجربة UI/UX كاملة وقابلة للتوسع تدريجيًا.

## تعريف Platform المعتمد

قسم Platform هو Control Plane سيادي وحساس لإدارة المنصة وقت التشغيل من أعلى جهة إدارية فقط. ليس شاشة قراءة أو عرض ملفات أو تفاصيل مطورين. وظيفته تمكين التحكم المركزي بالخدمات، المتغيرات، المزودين، الهوية البصرية، الصحة، الاعتماد، والتراجع، بدون استدعاء مطور لكل تغيير، مع صلاحيات صارمة وAudit وRollback.

## نطاق التنفيذ الحالي

نفّذ UI/UX فقط، بدون API/backend/runtime/secret activation.

يجب أن تظهر الواجهة كأنها ستتحكم لاحقًا فعليًا في المنصة، لكن كل أزرار التطبيق الحي يجب أن تكون disabled أو preview-only الآن.

## تشخيص إلزامي قبل التنفيذ

قبل أي تعديل، افحص وأثبت في مخرجاتك:

1. ملفات Platform الحالية:
   - `control-panel/runtime/app/platform/page.tsx`
   - `control-panel/shell/ControlPanelSurfaceHost.tsx`
   - `dsh/frontend/control-panel/index.ts`
   - `dsh/frontend/control-panel/platform/`
   - `dsh/frontend/control-panel/platform/Vars/`
   - `dsh/frontend/control-panel/platform/Appearance/`

2. هل يوجد أي اعتماد على:
   - `dsh/frontend/control-panel/control/`
   - `./control`
   - `ControlPanelDshControlHubScreen`
   - `ControlPanelDshGovernanceEvidenceScreen`
   - `ControlPanelDshGuardStatusScreen`

3. هل واجهة `/platform` الحالية تعرض مفاتيح تقنية مزعجة مثل:
   - `provider.*`
   - `wlt.*`
   - `VAR_*`
   - `scope & precedence`
   - `rollback target`
   - `test result`

4. هل توجد ألوان hardcoded داخل Platform/Appearance.

5. هل توجد كلمات أو منطق Marketing/Campaign داخل Appearance.

6. هل توجد secrets أو API keys حقيقية أو نصوص توحي بحفظ المفاتيح في الكود.

## المطلوب تنفيذه

### 1. إعادة صياغة Platform كقسم تحكم سيادي

غيّر لغة الصفحة الرئيسية من preview map/technical IA إلى Control Plane واضح:

- "قسم التحكم السيادي بالمنصة"
- "متاح لأعلى جهة إدارية فقط"
- "إدارة الخدمات والمتغيرات والمزودين والهوية بدون استدعاء المطور لكل تغيير"
- "كل تطبيق حي لاحقًا يحتاج معاينة أثر وتدقيق وتراجع"

يجب أن تكون الواجهة للمستخدم الإداري غير المطور.
لا تعرض مصطلحات تقنية كواجهة أساسية.

### 2. البنية المستهدفة للـ workspaces

نفّذ/فعّل في هذه المرحلة:

```text
Overview
Services
Vars
Providers
Appearance
```

واجعل هذه كـ teaser/disabled فقط:

```text
Rollouts
Health
Audit & Rollback
Contracts
Release Gates
```

لا تنشئ ملفات مستقلة لكل teaser إلا إذا كان ضروريًا. الأفضل إبقاؤها داخل `ControlPanelDshPlatformScreen.tsx` كـ cards.

### 3. Services Workspace

أنشئ:

```text
dsh/frontend/control-panel/platform/Services/
  index.ts
  DshPlatformServicesWorkspace.tsx
  services.preview.ts
  services.types.ts
```

تجربة Services يجب أن تكون بشرية:

- خدمة دليفري DSH
- خدمة عونك
- خدمة شي إن
- الاستلام من المتجر
- الطلبات المجدولة

كل card يجب أن يعرض:

- اسم الخدمة بالعربية.
- الحالة: نشطة / متوقفة / صيانة / تجريبية / داخلية فقط.
- الظهور للعملاء: ظاهر / مخفي.
- النطاق: كل المنصة / صنعاء / مدينة / منطقة.
- الأثر: ماذا يحدث إذا تغيرت الحالة.
- آخر تغيير حساس.
- أزرار disabled:
  - تشغيل
  - إيقاف
  - إظهار للعملاء
  - إخفاء عن العملاء
  - وضع الصيانة
  - تراجع

لا تعرض في الواجهة الأساسية `VAR_SVC_*` أو keys تقنية. يمكن وضعها فقط في caption ثانوي بعنوان "معرّف داخلي للمراجعة".

### 4. Vars Workspace

عدّل الموجود فقط إذا كان يظهر كسجلات تقنية طويلة.

يجب أن يتحول إلى تدفق بشري:

- اختر الخدمة: DSH / WLT / AMN / ARB / KNZ ...
- اختر المجال: التوفر، المدن، الأهلية، الحدود، التسويات، الإسناد، التصعيد.
- اختر المتغير بلغة مفهومة:
  - حد أهلية الكابتن لاستلام الطلبات.
  - ظهور DSH في محافظة صنعاء فقط.
  - موعد تسويات الشركاء.
  - نصف قطر الإسناد.
  - زمن قبول الشريك.
- عرض قبل/بعد.
- محاكاة أثر.
- طلب اعتماد.
- تطبيق لاحقًا.
- rollback لاحقًا.

الأسماء الداخلية مثل `wlt.*` و`provider.*` و`VAR_*` يجب أن تكون ثانوية، لا هي العنوان الأساسي.

### 5. Providers Workspace

أنشئ:

```text
dsh/frontend/control-panel/platform/Providers/
  index.ts
  DshPlatformProvidersWorkspace.tsx
  providers.preview.ts
  providers.types.ts
```

التجربة المطلوبة: مزود مركزي للمنصة كلها، وليس مزودًا لكل شاشة أو كل جزء.

Categories:

- مزود الخرائط
- مزود الرسائل SMS
- مزود الدفع
- مزود الاستضافة والسيرفر
- مزود التخزين
- مزود البريد
- مزود الإشعارات
- مزود التحليلات
- مزود البحث
- مزود الذكاء الاصطناعي

كل provider slot يعرض:

- اسم الفئة بالعربية.
- الحالة: غير مضاف / مفتاح مضاف / يحتاج اختبار / نشط / فشل / متوقف.
- حقل مفتاح masked فقط:
  ```text
  ••••••••••••
  ```
- البيئة: test / sandbox / production.
- المزود الافتراضي.
- fallback provider.
- آخر اختبار.
- الأثر: ماذا سيصبح فعالًا في المنصة.
- أزرار disabled:
  - إضافة مفتاح API
  - اختبار الاتصال
  - تفعيل كمزود افتراضي
  - إيقاف
  - تغيير الأولوية
  - rollback

نص إلزامي داخل Providers:

```text
لا يتم إدخال مفاتيح المزودين في الكود. هذا القسم سيكون مصدر التحكم التشغيلي لاحقًا عبر secret/config control plane آمن.
```

لا تضف مفاتيح حقيقية أو placeholders تشبه مفاتيح حقيقية.

### 6. Appearance Workspace

Appearance ليس Marketing وليس Campaign.

يجب أن يعرض:

- ألوان وهوية المنصة.
- تطبيق العميل.
- تطبيق الشريك.
- تطبيق الكابتن.
- تطبيق الميداني.
- لوحة التحكم.
- الموقع/الويب.

تدفق المثال:

```text
ألوان المنصة → تطبيق العميل → الهيدر الرئيسي → اختيار لون جديد → معاينة → طلب اعتماد → تطبيق لاحقًا
```

لا تعرض token names أو تفاصيل تصميم تقنية كواجهة أساسية.
التقنية يمكن أن تكون caption ثانوي فقط.

لا يسمح بإدخال hex حر كتنفيذ حقيقي الآن. يمكن عرض "حقل لون تجريبي disabled" مع رسالة أن التفعيل لاحقًا عبر النظام المركزي.

توجب الالتزام بنظام الألوان المركزي.

### 7. Overview

أضف Overview أعلى الصفحة أو كـ workspace فعلي في نفس الشاشة.

يعرض:

- حالة المنصة.
- الخدمات النشطة.
- الخدمات المخفية عن العملاء.
- المزودون غير المفعّلين.
- مفاتيح تحتاج اختبار.
- آخر تغييرات حساسة.
- آخر rollback.
- تحذيرات خطرة.

### 8. Governance

أضف ملف governance واحد فقط:

```text
governance/30_PLATFORM_CONTROL_PLANE.md
```

لا تضف ملفات كثيرة. محتوى الملف يجب أن يثبت الحدود والقواعد.

استخدم النص الموجود في:

```text
07_GOVERNANCE_TO_ADD/30_PLATFORM_CONTROL_PLANE.md
```

### 9. Guard

أضف guard واحد:

```text
tools/guards/platform-control-plane-uiux.guard.mjs
```

أو إذا كان نمط repo مختلفًا، ضعه في أقرب مكان مناسب تحت tools مع توثيق السبب.

الguard يجب أن يمنع:

- استخدام `dsh/frontend/control-panel/control/` داخل Platform.
- Campaign/Marketing/Seasonal داخل Platform/Appearance.
- secrets/API keys حقيقية داخل Platform.
- مفاتيح تقنية كثيرة كعناوين أساسية في UI.
- أزرار Apply/Activate/Save/Rollback enabled في UI/UX.
- hardcoded random colors داخل Platform.
- تعديل ui-kit من مهمة Platform.

يمكن استخدام guard الموجود في:

```text
08_GUARDS/platform-control-plane-uiux.guard.mjs
```

### 10. قواعد حاسمة

- لا API.
- لا backend.
- لا database.
- لا mutation.
- لا real provider activation.
- لا secrets حقيقية.
- لا تعديل `@bthwani/ui-kit`.
- لا تعديل `package.json` أو lockfile.
- لا استيراد Tamagui مباشرة.
- لا local design system.
- لا استخدام مسار `dsh/frontend/control-panel/control/`.
- لا تنفيذ داخل Catalogs/Marketing/Finance/Operations إلا إذا كان هناك import مباشر مكسور.
- لا تعرض أسماء الفئات أو الكتالوج داخل Platform؛ ذلك مكانه Catalogs.
- لا تعرض الحملات والعروض داخل Platform؛ ذلك مكانه Marketing.
- لا تعرض صلاحيات المستخدمين اليومية داخل Platform؛ ذلك مكانه Administration.

## معايير القبول

لا تعتبر المهمة DONE إلا إذا تحقق الآتي:

- `/platform` يظهر كقسم تحكم سيادي، لا شاشة قراءة تقنية.
- المستخدم الإداري يفهم ماذا يستطيع التحكم به لاحقًا.
- Services موجودة وواضحة.
- Providers موجودة وواضحة.
- Vars أصبحت بشرية أكثر ولا تضع keys كواجهة أساسية.
- Appearance تشرح التحكم بألوان كل التطبيقات ولا تذكر marketing/campaign.
- كل أزرار التنفيذ الحي disabled في هذه المرحلة.
- لا secrets حقيقية.
- لا runtime mutations.
- لا ui-kit changes.
- لا `./control`.
- لا TypeScript errors.
- لا diff whitespace errors.
- screenshot evidence مطلوب.

## أوامر التحقق

بعد التنفيذ شغّل:

```powershell
git --no-pager status --short
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
node tools/guards/platform-control-plane-uiux.guard.mjs
```

ثم جهّز evidence:

```powershell
$SESSION_ID = "PLATFORM_CONTROL_PLANE_UIUX-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RUN_DIR = Join-Path "tools\registry\runs" $SESSION_ID
New-Item -ItemType Directory -Force -Path $RUN_DIR | Out-Null
git --no-pager status --short | Out-File "$RUN_DIR\git-status.txt" -Encoding utf8
git --no-pager diff --name-status | Out-File "$RUN_DIR\git-diff-name-status.txt" -Encoding utf8
git --no-pager diff --check | Out-File "$RUN_DIR\git-diff-check.txt" -Encoding utf8
pnpm -w exec tsc --noEmit 2>&1 | Out-File "$RUN_DIR\tsc-noemit.txt" -Encoding utf8
node tools/guards/platform-control-plane-uiux.guard.mjs 2>&1 | Out-File "$RUN_DIR\platform-guard.txt" -Encoding utf8
git --no-pager diff -- . > "$RUN_DIR\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > "$RUN_DIR\LOCAL_CHANGE_UNTRACKED_FILES.txt"
Compress-Archive -Path "$RUN_DIR\*" -DestinationPath "$RUN_DIR\$SESSION_ID.zip" -Force
```

## الرد النهائي من الوكيل

يجب أن يحتوي فقط:

- Decision: DONE أو BLOCKED
- changed files
- ملخص قصير جدًا
- نتائج الأوامر
- مسار evidence zip
- ما الذي بقي BLOCKED إن وجد
- طلب screenshot من `/platform` إذا لم يرفقها
