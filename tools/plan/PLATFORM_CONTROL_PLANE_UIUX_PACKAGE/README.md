# BThwani Platform Control Plane UI/UX Execution Package

**Package purpose:** تجهيز حزمة تنفيذ قابلة للوضع داخل:

```text
C:\bthwani-suite\tools\plan\PLATFORM_CONTROL_PLANE_UIUX_PACKAGE\
```

ثم إعطاء الوكيل أمرًا واحدًا يبدأ بالتشخيص العميق، ثم تنفيذ UI/UX لقسم `control-panel/platform` كـ **Sovereign Platform Control Plane**، وليس شاشة قراءة تقنية.

## القرار المعتمد

قسم `Platform` في لوحة التحكم هو **قسم تحكم سيادي مركزي** لأعلى جهة إدارية فقط.
ليس `Catalogs`، وليس `Marketing`، وليس `Administration`، وليس صفحة مطورين.

يجب أن يمكّن لاحقًا من التحكم وقت التشغيل في:

- إظهار/إخفاء وتشغيل/إيقاف الخدمات.
- تعديل متغيرات الخدمة السيادية حسب الخدمة والنطاق.
- إدارة المزودين المركزيين مثل SMS / Maps / Payments / Hosting / Storage / Email / Push / Analytics / AI.
- إدخال مفاتيح المزودين لاحقًا عبر secret/config control plane، لا داخل الكود.
- التحكم بألوان وهوية المنصة في كل التطبيقات.
- تنفيذ preview/impact/approval/audit/rollback لكل تغيير حساس.
- عرض صحة المنصة والتحذيرات بلغة بشرية غير تقنية.

## المرحلة الحالية

**UI/UX flow فقط.**

ممنوع في هذه المرحلة:

- API حقيقي.
- backend.
- database.
- mutation.
- secret storage حقيقي.
- provider activation حقيقي.
- تغيير runtime فعلي.
- إدخال API keys حقيقية.
- تعديل `@bthwani/ui-kit`.
- تعديل `package.json` أو lockfile.
- بناء شاشة تقنية تعرض keys كواجهة أساسية للمستخدم العادي.

## الملفات المهمة في هذه الحزمة

```text
00_AGENT_MASTER_PROMPT.md
01_CURRENT_CONTEXT_AND_VERDICT.md
02_TARGET_INFORMATION_ARCHITECTURE.md
03_EXECUTION_PLAN.md
04_ACCEPTANCE_CRITERIA.md
05_VERIFICATION_COMMANDS.md
06_VISUAL_QA_CHECKLIST.md
07_GOVERNANCE_TO_ADD/30_PLATFORM_CONTROL_PLANE.md
08_GUARDS/platform-control-plane-uiux.guard.mjs
09_SCRIPTS/Invoke-PlatformControlPlaneDiagnostics.ps1
09_SCRIPTS/Invoke-PlatformControlPlaneVerify.ps1
10_AGENT_REPORT_TEMPLATE.md
11_REFERENCES_AND_RESEARCH_NOTES.md
12_COPY_TOOLS_PLAN_COMMANDS.md
MANIFEST.json
```

## طريقة الاستخدام المقترحة

1. فك ضغط الحزمة داخل:
   ```powershell
   C:\bthwani-suite\tools\plan\PLATFORM_CONTROL_PLANE_UIUX_PACKAGE\
   ```

2. اطلب من الوكيل قراءة:
   ```text
   00_AGENT_MASTER_PROMPT.md
   ```

3. يجب على الوكيل تنفيذ التشخيص أولًا، ثم يبدأ تنفيذ UI/UX فقط.

4. لا يعتبر العمل مغلقًا بدون:
   - `git diff --check` PASS
   - `pnpm -w exec tsc --noEmit` PASS
   - guard PASS
   - screenshot evidence من `/platform`
   - قائمة changed files واضحة
   - عدم وجود secrets/API keys حقيقية
   - عدم وجود واجهة تقنية مزعجة للمستخدم العادي
