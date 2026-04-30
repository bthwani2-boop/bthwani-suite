
# Branch & Checkpoints (Canonical)

هذا الملف يملك السلطة على:

- قواعد الفروع
- ما الذي يجعل تغييرًا “Checkpoint-required”

## Canonical facts (project-specific)

- evidence root: `tools/registry/runs/{SESSION_ID}/` (الشكل في `11_EVIDENCE_AND_TRACEABILITY.md`)
- لا “branch truth” بدون evidence pack يثبت الحالة الفعلية

## Branch naming (baseline)

- `main` محمي.
- `release/*`
- `feature/*`
- `fix/*`
- `chore/*`

## Branch reality capture (minimum)

قبل أي APPLY/VERIFY/REVIEW أو ادعاء “جاهزية/إغلاق”، التقط كحد أدنى (وأرفق المخرجات كأدلة):

```powershell
git branch --show-current
git --no-pager status --short
git --no-pager log --oneline -n 20
git --no-pager diff --check
pnpm -w exec tsc --noEmit
git ls-files --others --exclude-standard
```

## PR requirements (policy-level)

- PR إلى `main` يجب أن يرفق:
  - مرجع (issue أو قرار)
  - evidence pack عند التغييرات ذات الأثر (`11_EVIDENCE_AND_TRACEABILITY.md`)
  - نتائج CI gates (`13_CI_AND_GATES.md`)

## Checkpoint law

Checkpoint مطلوب عندما يمس التغيير:

- contracts / API / schema
- package public exports
- boundary/ownership rules
- security posture

Minimum checkpoint artifacts:

- traceability + rollback plan + consumer impact note (كلها داخل evidence pack)

## Protected branch rule

- لا دمج إلى `main` بدون مرور gates + موافقة مالك النطاق.

## Emergency

- الطوارئ تُوثّق بـ post-mortem داخل evidence pack بعد الاستقرار.
