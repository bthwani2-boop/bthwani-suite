---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-closure-by-journeys-and-slices
language: ar
---

# فهرس حزمة الإغلاق الحي النهائي — DSH/WLT

هذه الحزمة تقسم الإغلاق النهائي إلى رحلات وشرائح تنفيذية. كل رحلة لها ملف مستقل. الهدف ليس كتابة تقرير، بل قيادة العمل الحي: تجربة، تشخيص، إصلاح، تنظيف، إضافة ناقص، مراجعة تصميم، ثم إغلاق بالأدلة.

## الملفات

| الملف | الرحلة |
|---|---|
| `01_BRANCH_DIAGNOSIS_AND_CLOSURE_RULES.md` | تشخيص الفرع وقواعد الإغلاق والتنظيف |
| `02_JOURNEY_00_ABSOLUTE_ZERO_BASELINE.md` | الصفر المطلق قبل الشريك: branch/runtime/auth/provider/evidence |
| `03_JOURNEY_01_ACTORS_AUTH_ROLES_AND_TEST_DATA.md` | تجهيز الممثلين الحقيقيين: client/partner/captain/field/operator |
| `04_JOURNEY_02_FIELD_STORE_INTAKE_BEFORE_PARTNER.md` | إدخال المتجر من الميدان قبل الشريك |
| `05_JOURNEY_03_PARTNER_CREATION_AND_CONTROL_PANEL_ACTIVATION.md` | إنشاء الشريك وتفعيله في لوحة التحكم |
| `06_JOURNEY_04_CATALOG_PRODUCTS_CATEGORIES_MEDIA.md` | الكتالوج: تصنيفات، منتجات، ميديا، اعتماد |
| `07_JOURNEY_05_CLIENT_DISCOVERY_STOREFRONT_VISIBILITY.md` | ظهور المتجر في تطبيق العميل والبحث والتفاصيل |
| `08_JOURNEY_06_CART_CHECKOUT_WLT_PAYMENT.md` | السلة، الخدمة، checkout، WLT payment |
| `09_JOURNEY_07_ORDER_PARTNER_AND_CONTROL_PANEL_LIFECYCLE.md` | الطلب عبر العميل والشريك ولوحة التحكم |
| `10_JOURNEY_08_CAPTAIN_DELIVERY_EXECUTION.md` | الكابتن: قبول، استلام، خريطة، تسليم |
| `11_JOURNEY_09_FAILURE_RETURN_SUPPORT_REFUND.md` | فشل التوصيل، الإرجاع، الدعم، الاسترداد |
| `12_JOURNEY_10_FINANCE_SETTLEMENT_WALLET_LEDGER.md` | التسوية، المحافظ، ledger، Finance hub |
| `13_JOURNEY_11_NOTIFICATIONS_CHAT_RATING_AUDIT.md` | الإشعارات، المحادثة، التقييم، audit |
| `14_JOURNEY_12_CONTROL_PANEL_FULL_SURFACE_SWEEP.md` | مسح لوحة التحكم بالكامل |
| `15_JOURNEY_13_CODE_CLEANUP_ORGANIZATION_FINALIZATION.md` | تنظيف شامل: مكرر، ميت، preview، تشظي، تصميم |
| `16_JOURNEY_14_FINAL_GATES_AND_PR_READINESS.md` | بوابات الإغلاق النهائي والاستعداد للـ PR |

## طريقة الاستخدام

ابدأ بالملف 01 ثم نفذ الملفات بالترتيب. لا تنتقل من رحلة إلى التالية إذا بقيت أي شريحة فيها:

- `FIX_REQUIRED`
- `BLOCKED_NEEDS_EVIDENCE`
- `NEEDS_VISUAL_EVIDENCE`
- `RUNTIME_UNPROVEN`
- `PREVIEW_RUNTIME_LEAK`
- `DUPLICATION_UNRESOLVED`
- `DEAD_CODE_UNCLASSIFIED`

## قاعدة القرار

كل شريحة تنتهي بقرار واحد فقط:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
REVERT_REQUIRED
READY_FOR_NEXT_SLICE
```

لا يوجد إغلاق نهائي بدون أدلة. لا يوجد انتقال منطقي إلى رحلة لاحقة إذا كانت رحلة سابقة تتحكم في truth لاحق.

## القاعدة الحاكمة لكل شريحة

كل شريحة هنا ليست اختبارًا فقط. الشريحة تغلق فقط إذا أغلقت خمس طبقات معًا:

1. **التجريب الحي:** تشغيل الفيتشر من الواجهة أو API حسب مكانها الطبيعي.
2. **إضافة الناقص:** أي زر بلا API، API بلا UI، شاشة بلا state، أو مسار بلا audit يعالج فورًا داخل نفس الشريحة.
3. **التنظيف والتنظيم:** حذف/دمج/نقل/تسمية/تفكيك أي كود مكرر أو ميت أو متسرب أو خارج الملكية.
4. **مراجعة التصميم:** RTL، وضوح، CTA واحد، spacing، states، عدم drift عن `@bthwani/ui-kit`.
5. **Evidence:** screenshots + request/response + DB/logs + git/tsc/guards.

لا تستخدم `PASS / CLOSED / READY / 100%` إلا بعد Evidence Pack داخل:

```text
tools/registry/runs/<SESSION_ID>/
```

الحد الأدنى داخل كل Evidence Pack:

```text
SUMMARY.md
evidence.json
commands.log
status.txt
git-status.txt
git-diff-check.txt
tsc-noemit.txt
screenshots/
api/
db/
runtime-logs/
code-hygiene/
_HANDOFF.zip
```
