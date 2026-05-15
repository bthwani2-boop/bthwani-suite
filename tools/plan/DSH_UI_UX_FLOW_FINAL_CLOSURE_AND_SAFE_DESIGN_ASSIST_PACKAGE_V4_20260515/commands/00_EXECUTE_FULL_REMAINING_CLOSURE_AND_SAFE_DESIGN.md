# EXECUTE FULL REMAINING DSH CLOSURE + SAFE DESIGN BASELINE V4

نفّذ هذا الطلب داخل `C:thwani-suite` على الفرع `ghb/0142-20260515-053913-verify-ui-kit-stability` تنفيذًا كاملًا حسب الدورات أدناه. لا تنتقل للدورة التالية إذا لم تحقق بوابة الدورة الحالية بالأدلة.

## الهدف النهائي الصحيح

الوصول إلى:

```text
READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_WITH_EVIDENCE
```

لا تكتب ولا تدّعي:

```text
PASS / CLOSED / FINAL / 100% / PRODUCTION READY
```

## اقرأ أولًا

اقرأ هذه الملفات من الحزمة:

- `prompts/00_MASTER_NON_NEGOTIABLES.md`
- `gates/ACCEPTANCE_MATRIX.md`
- `scripts/AUDIT_DSH_UI_UX_FLOW_CLOSURE_V4.ps1`

ثم اقرأ هذه الملفات من الريبو إن وجدت:

- `dsh/docs/closure/DSH_AGENT_CONTEXT.md`
- `dsh/docs/closure/DSH_CLOSURE_RULES.md`
- `dsh/docs/closure/DSH_DO_NOT_TOUCH.md`
- `dsh/docs/closure/DSH_MISSING_LOGIC_AND_UI_GAPS.csv`
- `dsh/docs/closure/DSH_SKELETON_WIRING_MATRIX.csv` إن وجدت
- `dsh/docs/closure/DSH_UI_REVIEW_QUEUE.md`
- `dsh/docs/closure/DSH_ROUTE_STATE_CTA_MATRIX.csv`
- `dsh/docs/closure/DSH_SCREEN_API_MATRIX.csv`
- `dsh/docs/closure/DSH_CONTRACT_GAP_MAP.csv`

## نفّذ بالترتيب

### V4-1 — Audit and recover previous loops

استخدم `prompts/10_AUDIT_AND_RECOVER_PREVIOUS_LOOPS.md`.

مطلوب:
- إصلاح فساد CSV مثل ML-039.
- توحيد status/priority.
- إنتاج audit evidence.
- لا تعدل source في هذه الدورة.

### V4-2 — Close wiring gaps and dead/noise map

استخدم `prompts/20_CLOSE_WIRING_GAPS_AND_DEAD_NOISE.md`.

مطلوب:
- كل skeleton إما wired أو blocked أو obsolete candidate.
- إزالة TODO/FIXME/XXX أو تحويلها إلى blockers موثقة في docs وليس source.
- ربط ملفات support/finance/sheets/control-panel التي أضيفت سابقًا أو تصنيفها صراحة.

### V4-3 — Frontend taxonomy organization

استخدم `prompts/30_FRONTEND_TAXONOMY_REORGANIZATION_PLAN_AND_APPLY.md`.

مطلوب:
- تنظيم DSH frontend folders بعد ثبوت coverage.
- تقليل التشعب والضجيج.
- لا حذف دائم. استخدم archive/staging أو classify only إذا غير آمن.
- لا تكسر imports.

### V4-4 — Safe preliminary design baseline

استخدم `prompts/40_SAFE_PRELIMINARY_DESIGN_BASELINE.md`.

مطلوب:
- تحسين مبدئي غير هدّام للشاشات المرشحة P0/P1.
- احترام ui-kit public exports/design tokens.
- لا ui-kit source edit.
- لا hardcoded random colors.
- لا تغيير flow أو business logic.
- لا screen-per-block ولا god-screen.
- تحسين RTL/spacing/hierarchy/CTA/states فقط.

### V4-5 — Final gate

استخدم `prompts/50_FINAL_READY_FOR_HUMAN_REVIEW_GATE.md`.

مطلوب:
- إنتاج final blockers.
- إنتاج final screen review queue.
- إنتاج evidence.
- إذا كل gate أخضر: اكتب فقط `READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_WITH_EVIDENCE`.
- إذا يوجد blocker: اكتب فقط `BLOCKED_NOT_READY_FOR_HUMAN_VISUAL_REVIEW`.

## التحقق النهائي

شغّل:

```powershell
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
git --no-pager diff -- . > ".\LOCAL_CHANGE_REVIEW.patch"
```

الرد النهائي يجب أن يحتوي:

- الحالة المسموحة فقط.
- قائمة ملفات evidence.
- قائمة source files changed.
- قائمة blockers إن وجدت.
- لا أي claim نهائي لفظي.
