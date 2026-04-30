
# CI & Gates (Canonical)

هذا الملف يملك السلطة على:
- ما الذي يعتبر **Blocking gate** مقابل **Report-only**
- سياسة التدرج (gradual hardening)

## Gate modes
- **blocking**: فشلها يمنع الدمج.
- **report-only**: لا تمنع الدمج، لكنها تُسجّل `WARN/FAIL` وتتطلب خطة علاج عند استمرارها.

## Minimum pre-merge expectations (policy-level)
تختلف بالاستهداف، لكن “المحاور” الأساسية:
- lint/static checks
- build/typecheck
- unit tests
- contract verification عند تغييرات API/Schema
- security scan عند الإمكان

## Gradual hardening law
- أي فحص جديد يبدأ بـ `report-only` ثم يترقى إلى `blocking` بعد:
  - وضوح remediation
  - انخفاض false positives
  - ثبات الإشارة عبر وقت كافٍ

## Overrides / emergency
- أي override يجب أن يكون:
  - موثقًا داخل evidence pack
  - مبررًا ومؤقتًا
  - مع إجراء follow-up (post-mortem عند طوارئ)

## Evidence
- ربط artifacts ونتائج CI بالـ PR يتم توثيقه في evidence pack (`11_EVIDENCE_AND_TRACEABILITY.md`).

