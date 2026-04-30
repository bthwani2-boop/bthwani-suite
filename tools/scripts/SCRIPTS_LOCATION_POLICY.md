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
