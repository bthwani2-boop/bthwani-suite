
# Evidence & Traceability (Canonical)

هذا الملف هو **السلطة الوحيدة** لتعريف:

- ما هو “evidence” المقبول لإغلاق تغيير
- الشكل الأدنى لـ evidence pack
- مفردات القرارات (PASS/WARN/FAIL/…)

## Core law

- **لا إغلاق بدون evidence**: أي claim من نوع “READY / PASS / CLOSED / FINAL / 100%” يجب أن يكون قابلًا للتدقيق عبر evidence pack.
- **evidence لا يعني نصًا**: policy text لا يحل محل artifacts (نتائج اختبارات/CI/تقارير/روابط تشغيل).

## Canonical evidence root (project-specific)

كل الأدلة التنفيذية يجب أن تعيش تحت:

```text
tools/registry/runs/{SESSION_ID}/
```

قاعدة: هذه output artifacts وليست مصدر سياسة/كود.

## Evidence pack (minimum standard)

Evidence pack هو “حزمة إثبات” مرتبطة بالـ PR أو run id وتحتوي على **ملفات حد أدنى ثابتة**.

### Required core files (must exist)

```text
SUMMARY.md
status.txt
evidence.json
commands.log
git-branch-current.txt
git-status-before.txt
git-status-after.txt
git-diff-check-before.txt
git-diff-check-after.txt
untracked-before.txt
untracked-after.txt
_HANDOFF.zip
{SESSION_ID}_HANDOFF.zip
```

عند تغييرات يمكن أن تؤثر على TypeScript/scripts/guards/config أضف:

```text
tsc-noemit-before.txt
tsc-noemit-after.txt
```

### Required metadata (`evidence.json`)

يجب أن يلتزم `evidence.json` (كحد أدنى) بهذه الحقول:

```json
{
  "issueCode": "...",
  "sessionId": "...",
  "evidenceRoot": "tools/registry/runs/{SESSION_ID}/",
  "mode": "READ_ONLY | CHECK | FORENSICS | PLAN | APPLY | VERIFY | REVIEW | RUNTIME_VERIFY",
  "allowedFiles": [],
  "forbiddenRoots": [],
  "finalDecision": "PASS | PASS_WITH_WARNINGS | FIX_REQUIRED | BLOCKED | READY_FOR_PR | REVERT_REQUIRED | NEEDS_EVIDENCE | NEEDS_VISUAL_EVIDENCE",
  "phaseState": "...",
  "diffCheckPass": true,
  "tscPass": true,
  "scopeViolationCount": 0,
  "warningSummary": [],
  "outputFiles": []
}
```

### Decision vocabulary

#### Final decisions (canonical)

- `PASS`
- `PASS_WITH_WARNINGS`
- `FIX_REQUIRED`
- `BLOCKED`
- `READY_FOR_PR`
- `REVERT_REQUIRED`
- `NEEDS_EVIDENCE`
- `NEEDS_VISUAL_EVIDENCE`

#### Traceability row status (canonical)

- `PASS` | `WARN` | `FAIL` | `NOT_APPLICABLE` | `INFO`

> ملاحظة: أي مصطلحات قديمة مثل `NO_ACTION_REQUIRED` تُعامل كـ `NOT_APPLICABLE`.

## Traceability matrix (canonical columns)

`requirement_id | governance_source | code_paths | tests | artifacts | status`

### status vocabulary (canonical)

- `PASS`: تحقق الشرط بأدلة واضحة.
- `WARN`: الشرط لم يتحقق بالكامل لكن لا يمنع الدمج في وضع report-only (يجب خطة علاج).
- `FAIL`: الشرط لم يتحقق ويمنع الدمج عندما يكون gate blocking.
- `NOT_APPLICABLE`: غير منطبق على هذا التغيير (مع سبب واحد سطر).
- `INFO`: معلومة/إشارة بدون قرار.

## Minimum verification expectations (by change type)

- **Cross-boundary** (exports/boundaries/contracts/security): evidence pack يجب أن يحتوي على traceability + نتائج CI ذات صلة + impact note.
- **API/contract**: يجب إرفاق contract artifact + اختبار تطابق (راجع `09_API_BINDING_RUNTIME.md`).
- **UI system / ui-kit**: يجب إرفاق دليل بصري/اختبار ملائم + تحقق RTL عند التغيير المؤثر (راجع `08_UI_KIT_AND_BRAND.md`).

## Storage & retention (policy-level)

- يمكن أن تكون artifacts داخل CI، أو مرفقات PR، أو registry داخلي—المهم أن تكون **روابط ثابتة قابلة للتدقيق**.
- الاحتفاظ: نافذة تدقيق افتراضية سنة واحدة ما لم تتطلب السياسة الأمنية/الامتثال أكثر (راجع `16_SECURITY_AND_SECRETS.md`).

## CI integration (reference)

- `13_CI_AND_GATES.md` يحدد ما الذي يعتبر gate blocking مقابل report-only.
- `14_GUARDS_CATALOG.md` يحدد guards وكيف تنتج evidence/قراراتها.
