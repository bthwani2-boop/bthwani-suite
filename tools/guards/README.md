# BThwani Executable Guards

`tools/guards/` يحتوي تحققًا تنفيذيًا فقط.

## authority split

- `governance/` هو owner policy.
- `.agents/` هو owner تشغيل الوكلاء والتعليمات التشغيلية.
- `tools/guards/` يتحقق فقط. لا يكتب policy جديدًا.
- `guard-manifest.json` هو الفهرس التنفيذي الرسمي لكل guard فعّال.

## active runners

تشغيل حراس governance:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\RUN_GOVERNANCE_GUARDS.ps1"
```

تشغيل حراس agent authority:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\RUN_AGENT_GUARDS.ps1"
```

## active index

- `guard-manifest.json` يسجل guard file وowner policy وrunner scope ودرجة الحظر.
- `GUARDS_CATALOG.md` دليل قراءة فقط مشتق من الحراس الفعلية.
- `RUN_GOVERNANCE_GUARDS.ps1` و`RUN_AGENT_GUARDS.ps1` لا يستنتجان guard جديدة خارج الـ manifest.

## guard rules

- لا `npx`.
- لا `_HANDOFF.zip`.
- لا مسارات active قديمة مثل `apps/` أو `packages/` داخل الحراس الفعالة.
- لا references فعالة إلى `.github/skills` أو `.github/agents` أو `.opencode/skills`.
- لا guard بلا manifest entry.
- لا config orphan إذا كان guard يحتاج config.

## outputs

كل runner يكتب evidence تحت:

```text
tools/registry/runs/{SESSION_ID}/
```

ZIP باسم `{SESSION_ID}.zip` يُنتَج **فقط** عند تمرير الخيار `-CreateZip` للـ runner صراحةً.
بدون هذا الخيار لا يُنشأ ZIP تلقائيًا. راجع GUARD_13 في `governance/14_GUARDS_CATALOG.md` وقاعدة ZIP في `governance/11_EVIDENCE_AND_TRACEABILITY.md`.
