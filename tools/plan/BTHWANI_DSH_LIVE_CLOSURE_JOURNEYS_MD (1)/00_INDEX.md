---
project: BThwani / bthwani-suite
branch: feat/dsh-surface-refactor
repo: C:\bthwani-suite
generated: 2026-06-16
mode: live-full-stack-progressive-closure-with-shared-engine
language: ar
title: فهرس حزمة الرحلات الجديدة
---

# حزمة الإغلاق الحي الجديدة — BThwani DSH/WLT

هذه الحزمة تستبدل الحزمة القديمة بالكامل. احذف الحزمة القديمة وأضف هذه بدلًا عنها داخل مسار الخطة المحلي، مع الحفاظ على نفس الاسم:

```text
BTHWANI_DSH_LIVE_CLOSURE_JOURNEYS_MD.zip
```

## الغرض

هذه ليست حزمة تقارير. هذه حزمة تشغيل يومية لتنفيذ الرحلات والشرائح تدريجيًا على الكود الحي، مع منع الفوضى الحالية من التمدد. القاعدة الحاكمة:

```text
Separate UI Shells + Unified Topic-first Full-stack Shared Engine
```

المعنى العملي:

- `shared` هو العقل.
- التطبيقات واجهات UI-only.
- WLT shared هو العقل المالي.
- UI Kit هو سلطة التصميم.
- لا منطق تشغيل داخل جذور التطبيقات.
- لا بيانات preview/demo/mock كحقيقة runtime.
- لا انتقال إلى اختبار يدوي حي إلا بعد بوابة ما قبل اليدوي.
- لا انتظار حتى “كل المشروع 100%” قبل تنفيذ أول رحلة؛ التنفيذ تدريجي، لكن كل ملف يتم لمسه يجب أن يصحح وفق القواعد.

## فهرس الملفات

| الملف | الدور |
|---|---|
| `01_NON_NEGOTIABLE_DOCTRINE.md` | العقيدة الحاكمة |
| `02_PROGRESSIVE_EXECUTION_MODEL.md` | نموذج التنفيذ التدريجي دون حرق الرحلات |
| `03_BRANCH_RUNTIME_BASELINE_GATE.md` | بوابة الفرع والـ runtime قبل اليدوي |
| `04_FULL_STACK_SHARED_ENGINE_MAP.md` | خريطة العقل الموحد Full-stack Shared Engine |
| `05_UI_ONLY_SURFACE_ROOTS_RULES.md` | قواعد جذور التطبيقات UI-only |
| `06_DSH_SHARED_TOPIC_OWNERSHIP.md` | ملكية DSH shared حسب الموضوع |
| `07_WLT_SHARED_FINANCE_OWNERSHIP.md` | ملكية WLT shared المالية |
| `08_UI_KIT_DESIGN_AUTHORITY.md` | سلطة UI Kit ومنع design drift |
| `09_REAL_DATA_DOCKER_POSTGRES_MINIO_RULES.md` | بيانات حقيقية عبر Docker/Postgres/MinIO |
| `10_NO_PREVIEW_DEMO_MOCK_RUNTIME.md` | منع preview/demo/mock runtime |
| `11_FILE_DECISION_MATRIX.md` | مصفوفة قرار كل ملف |
| `12_GRAPH_PROOF_MOVE_MERGE_DELETE_PROTOCOL.md` | بروتوكول graph proof للنقل والدمج والحذف |
| `13_TOPIC_CENTRALIZATION_PLAYBOOK.md` | دليل مركزة الموضوعات |
| `14_MARKETING_BANNERS_CAROUSEL_CANONICALIZATION.md` | مركزة البنرات والكاروسيل |
| `15_PRE_MANUAL_LIVE_TEST_GATE.md` | بوابة ما قبل الاختبار اليدوي الحي |
| `16_JOURNEY_00_BASELINE_LIVE_STACK_AND_BRANCH.md` | رحلة 00: baseline والـ live stack |
| `17_JOURNEY_01_ACTORS_AUTH_RBAC_REAL_DATA.md` | رحلة 01: actors/auth/RBAC |
| `18_JOURNEY_02_FIELD_STORE_INTAKE.md` | رحلة 02: إدخال المتجر ميدانيًا |
| `19_JOURNEY_03_PARTNER_ACTIVATION.md` | رحلة 03: تفعيل الشريك |
| `20_JOURNEY_04_CATALOG_PRODUCTS_CATEGORIES_MEDIA.md` | رحلة 04: catalog/products/categories/media |
| `21_JOURNEY_05_MARKETING_BANNERS_CAMPAIGNS.md` | رحلة 05: marketing/banners/campaigns |
| `22_JOURNEY_06_CLIENT_DISCOVERY_STOREFRONT.md` | رحلة 06: client discovery/storefront |
| `23_JOURNEY_07_CART_CHECKOUT_WLT_PAYMENT.md` | رحلة 07: cart/checkout/WLT payment |
| `24_JOURNEY_08_ORDER_LIFECYCLE_MULTI_SURFACE.md` | رحلة 08: order lifecycle متعدد الأسطح |
| `25_JOURNEY_09_CAPTAIN_DELIVERY_EXECUTION.md` | رحلة 09: captain delivery execution |
| `26_JOURNEY_10_FAILURE_RETURN_SUPPORT_REFUND.md` | رحلة 10: failure/return/support/refund |
| `27_JOURNEY_11_FINANCE_SETTLEMENT_LEDGER.md` | رحلة 11: finance/settlement/ledger |
| `28_JOURNEY_12_NOTIFICATIONS_CHAT_RATING_AUDIT.md` | رحلة 12: notifications/chat/rating/audit |
| `29_JOURNEY_13_CONTROL_PANEL_FULL_SURFACE_SWEEP.md` | رحلة 13: control panel sweep |
| `30_JOURNEY_14_CODE_CLEANUP_ORGANIZATION.md` | رحلة 14: cleanup/organization |
| `31_JOURNEY_15_FINAL_GATES_PR_READINESS.md` | رحلة 15: final gates/PR readiness |
| `32_CLAUDE_CODE_MASTER_EXECUTION_COMMAND.md` | أمر Claude Code الرئيسي |
| `33_TERMINAL_VERIFICATION_SCRIPTS.md` | سكريبتات التحقق الطرفية |
| `34_HANDOFF_TEMPLATE.md` | قالب handoff |
| `35_APPENDIX_GUARD_COMMANDS.md` | ملحق أوامر guards |
| `36_CURRENT_KNOWN_BLOCKERS_TO_RECHECK.md` | الموانع الحالية التي يعاد التحقق منها |
| `37_CHANGELOG.md` | سجل النسخة |

## طريقة الاستخدام

1. ابدأ من `01_NON_NEGOTIABLE_DOCTRINE.md`.
2. نفّذ `15_PRE_MANUAL_LIVE_TEST_GATE.md` قبل الاختبار اليدوي الحي.
3. عند تنفيذ أي رحلة، افتح ملف الرحلة وملفات القواعد المرتبطة بها.
4. لا تعمل rename جماعي. لا تعمل docs-only closure. لا تفتح PR قبل final gates.
5. إذا ظهر blocker أثناء رحلة، أصلحه داخل نفس loop بدل تأجيله، بشرط عدم كسر الخطة أو خلط المسؤوليات.

## قاعدة منع الانحراف

الرحلات لا تعني تنفيذ تطبيق منفصل. كل رحلة يجب أن تتحقق من:

- هل يوجد منطق في app root يجب نقله إلى shared؟
- هل يوجد منطق مالي خارج WLT shared؟
- هل يوجد UI reusable يجب نقله إلى UI Kit؟
- هل توجد ملفات رفيعة لا تضيف إلا ضجيجًا؟
- هل توجد بيانات demo/preview/fallback runtime؟
- هل توجد duplications بين الأسطح؟

إذا كانت الإجابة نعم، يتم الإصلاح كجزء من تنفيذ الرحلة، لا كمرحلة مؤجلة بلا دليل.
