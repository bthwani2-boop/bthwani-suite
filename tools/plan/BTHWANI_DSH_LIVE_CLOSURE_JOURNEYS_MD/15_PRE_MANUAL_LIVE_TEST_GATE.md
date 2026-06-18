---
project: BThwani / bthwani-suite
branch_policy: current checked-out branch only
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: بوابة ما قبل الاختبار اليدوي الحي
---

# 15 — بوابة ما قبل الاختبار اليدوي الحي

## الهدف

السماح بالاختبار اليدوي الحي دون انتظار إغلاق كل الشرائح، لكن مع منع الاختبار فوق build مكسور أو imports شاذة.

## قاعدة مصدر الحقيقة

كل PASS في هذه البوابة يجب أن يأتي من:
- terminal output حي + `tools/registry/runs` evidence
- `dsh/frontend/control-panel/shared/dshCrossSurfaceClosureMap.ts` (live closure map)
- live code وليس `dsh/docs` وحدها — هذه الأخيرة قد تكون DOCS_DRIFT_SYNC_REQUIRED ولا تكفي وحدها

## شرط الدخول

لا تدخل الاختبار اليدوي الحي إلا إذا مرّت:

```text
tsc PASS
control-panel build PASS
/ PASS
/administration PASS
blocking log regression = none
DSH/WLT guards PASS
git diff --check PASS
```

## لا يكفي

```text
next dev opens / with 200
/administration opens with 200
```

إذا كان `next build` يفشل، فهذا blocker قبل الاختبار اليدوي، حتى لو dev route يفتح.

## أمر تنفيذ داخلي للوكيل

استخدم `32_CLAUDE_CODE_MASTER_EXECUTION_COMMAND.md` لإغلاق blockers قبل اليدوي.

## سكربت تحقق

استخدم `33_TERMINAL_VERIFICATION_SCRIPTS.md` بعد تنفيذ الوكيل.

## حالات مقبولة وغير مقبولة

| الحالة | القرار |
|---|---|
| build fail بسبب missing export | ممنوع الاختبار اليدوي |
| dev 200 مع import warnings | ممنوع الاختبار اليدوي |
| webpack cache warning فقط بعد مسح cache مرة | غير مانع إذا كل شيء آخر ناجح |
| DSH/WLT guards pass وbuild pass | يمكن بدء اليدوي تدريجيًا |
| preview/demo data في flow المراد اختباره | ممنوع إغلاق flow |
