سياسة موقع السكربتات

القاعدة:
- جميع ملفات السكربت PowerShell (`.ps1`) يجب إنشاؤها ووضعها تحت المجلد: `tools/scripts`.

السبب:
- تنظيم أوضح، وإمكانية تطبيق فحوصات تلقائية على Pull Requests.

أدوات مساعدة:
- فحص محلي: `tools/scripts/check-scripts-location.ps1`
  - لفحص الملفات المعدلة في PR (تمرير ملف يحتوي على المسارات):
    ```powershell
    pwsh -NoProfile -ExecutionPolicy Bypass -File tools/scripts/check-scripts-location.ps1 -ChangedFilesPath changed-files.txt
    ```
  - لفحص كامل المستودع (تحذيري):
    ```powershell
    pwsh -NoProfile -ExecutionPolicy Bypass -File tools/scripts/check-scripts-location.ps1
    ```

إنفاذ على CI:
- يوجد ملف GitHub Action: `.github/workflows/validate-scripts-location.yml` يقوم بتشغيل الفحص على Pull Requests ويمنع قبول PR يحتوي على سكربتات جديدة/معدلة خارج `tools/scripts`.

ملاحظات تشغيلية:
- السكربت الجديد `tools/scripts/replace-BTH-with-bthwani.ps1` تم نسخُه إلى `tools/scripts`.
- إذا رغبت بترحيل سكربتات حالية من `tools/` إلى `tools/scripts/` يمكنني تنفيذ نقل منظّم وتحديث أية مراجع تلقائياً.


استثناء legacy محدود:
- يبقى 	ools/ghb.ps1 كـ wrapper صغير متوافق مع الاستخدام القديم، ويجب أن يستدعي التنفيذ الفعلي من 	ools/scripts/GHB_CHECKPOINT_VERIFY.ps1.


استثناء legacy محدود:
- يبقى 	ools/ghb.ps1 كـ wrapper صغير متوافق مع الاستخدام القديم، ويجب أن يستدعي التنفيذ الفعلي من 	ools/scripts/GHB_CHECKPOINT_VERIFY.ps1.

## Final-index PS1 validation

PowerShell scripts must live under 	ools/scripts/ or 	ools/guards/.

The validator must ignore deleted or renamed old paths that appear in name-only diffs but do not exist in the final index/worktree.

Legacy exact exceptions are limited to documented compatibility wrappers/tools only:
- nalyze_uikit.ps1
- 	ools/generate-dsh-fixture-images.ps1
- 	ools/GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1
- 	ools/ghb.ps1

No broad root-level PowerShell allowance is permitted.
