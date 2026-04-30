---
generatedFrom: governance/EVIDENCE_PACK_TEMPLATE.md
generatedAt: 2026-04-30T04:48:37.4181991+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# قالب Evidence Pack

هذا القالب يجب إرفاقه مع أي PR أو طلب إغلاق يُطالب بـ"100%" أو قرار نهائي.

1. ملخّص التغيير
   - العنوان:
   - الوصف المختصر:
   - هدف التغيير:

2. قائمة الملفات المعدلة
   - `changed_files.txt` (مرفق)

3. Git status & diff
   - `git_status.txt` — مخرجات `git --no-pager status --short`
   - `git_diff_check.txt` — مخرجات `git --no-pager diff --check`

4. Typecheck & Build
   - `typecheck.log` — نتائج `pnpm -w exec tsc --noEmit`
   - `build.log` — نتائج بناء السطح المتأثر إن وُجد

5. Tests
   - `tests.log` — نتائج الاختبارات المرتبطة (unit/contract/integration/smoke)

6. Runtime proof
   - مجلد `runtime_proof/` يحتوي على:
     - لقطات شاشة: `screenshots/before/*.png`, `screenshots/after/*.png`
     - سجلات التشغيل: `logs/*.log`
     - وصف خطوات التحقق اليدوي: `runtime_steps.md`

7. Visual evidence (لأي تغيير UI)
   - لقطات قبل/بعد لكل viewport رئيسي
   - RTL screenshot إن كان التطبيق يدعم RTL
   - حالات: loading / empty / error / success

8. Warnings & Exceptions
   - `warnings.txt` — أي تحذيرات مع مبرر المالك

9. Decision
   - قرار واحد من القائمة:
     `PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / READY_FOR_PR / REVERT_REQUIRED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE`
   - مبررات القرار:

10. Provenance & Approvals
   - مالك الحراسة: 
   - مالك المجال: 
   - مراجعون وموقّعون (handles أو روابط):

---

ضع جميع الملفات المرفقة في مجلد مضغوط واحد وأرفقه بالـPR كـ`evidence_pack_<ID>.zip`.

