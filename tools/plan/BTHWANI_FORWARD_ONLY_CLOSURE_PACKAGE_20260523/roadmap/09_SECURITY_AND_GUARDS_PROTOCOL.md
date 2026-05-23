# 09 — Security and Guards Protocol

## القرار

الأمان ليس خطوة لاحقة. هو Gate داخل كل شريحة.

## Security baseline

استخدم OWASP ASVS كمرجع acceptance لاحقًا، وOWASP API Security Top 10 كمرجع API risk. هذا لا يعني تنفيذ checklist ضخم الآن؛ بل يعني أن كل شريحة runtime يجب أن تحترم:
- authentication
- authorization
- object-level authorization
- input validation
- output minimization
- secrets hygiene
- logging without secrets
- secure error handling

## حراس الريبو الحالية

الحزمة تثبت وجود scripts وحراس مثل:
- `guard:tamagui-import-boundary`
- `guard:service-blueprint`
- `guard:binding-proof`
- `guard:secret-scan`
- `guard:protected-tokens`
- `guard:governance`
- `guard:agent`
- `guard:i18n-direction`

راجع:
- `evidence/GUARD_SCRIPT_INVENTORY.csv`

## قواعد منع الاختراق المنطقي

```text
لا endpoint بدون auth إذا كان محميًا.
لا userId من العميل يصدق مباشرة.
لا Partner يرى متجر غيره.
لا Captain يرى طلبًا غير مخصص له.
لا Control Panel action بدون permission/audit.
لا WLT mutation خارج WLT.
لا secrets في frontend.
لا provider secrets في repo.
```

## Backend authorization rule

Frontend يخفي أو يظهر الأزرار فقط. القرار الأمني الحقيقي يجب أن يكون في backend.

## Evidence

أي شريحة Runtime تحتاج:
- permission matrix
- denied state
- audit requirement
- secret scan output
- no sensitive logs proof
