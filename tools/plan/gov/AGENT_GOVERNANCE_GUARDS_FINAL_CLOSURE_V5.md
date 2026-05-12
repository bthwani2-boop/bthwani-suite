# أمر تنفيذ نهائي — إغلاق الوكلاء والحوكمة والحراس V5

> الهدف من هذا الملف: أمر واحد دقيق ومنظم للنسخ إلى VS Code Chat / Codex / Copilot / Gemini / Claude، لتنفيذ إغلاق نهائي منظم لملفات الوكلاء والحوكمة والحراس داخل `C:\bthwani-suite`، مع الاستفادة من الهيكل الحالي وعدم إعادة بنائه جذريًا.

---

## الأمر التنفيذي

انسخ النص التالي كاملًا إلى الوكيل داخل VS Code:

```text
نفّذ هذا الطلب داخل الريبو المحلي فقط:

C:\bthwani-suite

المهمة:
إغلاق نهائي منهجي وخفيف لكل ما يتعلق بملفات الوكلاء والحوكمة والحراس والـ Skills، بحيث يصبح المشروع بلا تكرار، بلا تضارب، بلا ضجيج، بلا ملفات تافهة، بلا legacy narrative في الملفات اليومية، وبلا مصادر قرار متوازية.

هذا تنفيذ محلي فقط:
- لا تعمل commit.
- لا تعمل push.
- لا تفتح PR.
- لا تعمل GitHub write.
- لا تغيّر dependencies.
- لا تغيّر lockfile.
- لا تغيّر كود التطبيقات أو UI أو backend.
- لا تدّعي PASS / CLOSED / FINAL / 100%.
- في النهاية اكتب فقط DONE أو BLOCKED مع الأدلة.

================================================================================
0) القرار المعماري النهائي
================================================================================

اعتمد هذا الفصل النهائي:

governance/
  = سلطة القرار فقط.
  = قرارات BThwani الحاكمة والمتخصصة بطبيعة المشروع.
  = ما هو الصحيح والممنوع ومصدر الحقيقة.
  = لا يحتوي prompts طويلة.
  = لا يحتوي adapters.
  = لا يكرر skills.
  = لا يشرح legacy طويلًا بعد تصحيحه.
  = بعد التصحيح يذكر الوضع الصحيح الحالي فقط.

.agents/
  = التشغيل العالمي العملي لكل الوكلاء فقط.
  = Codex + Copilot + Gemini + Claude + OpenCode + Cursor.
  = skills / adapters / update policy / authority boundary.
  = لا ينشئ قرارات حوكمة جديدة.
  = يشير إلى governance/ عند القرارات.
  = لا يكرر governance بالكامل.
  = لا يحتوي skill مستقل لقاعدة صغيرة أو تافهة.

tool adapters
  = ملفات قصيرة جدًا لتوصيل كل أداة بالمصدر العالمي.
  = لا تحتوي governance كاملة.
  = لا تحتوي skills كاملة.
  = لا تجعل أي أداة مركز القرار.

tools/guards/
  = تحقق رقمي فقط.
  = لا يحتوي قرارات جديدة.
  = لا يصبح governance موازيًا.
  = لا تعيد هيكلته جذريًا إلى مجلدات فرعية إلا إذا كان الهيكل موجودًا أصلًا ومثبتًا.
  = استعمل الهيكل الحالي قدر الإمكان.
  = guard-manifest.json هو الفهرس التنفيذي الرسمي للحراس.

evidence / ledger
  = مكان تاريخ legacy والانتقالات والأدلة.
  = لا تضع legacy story داخل ملفات التشغيل اليومية.

================================================================================
1) القواعد الحاكمة للتنفيذ
================================================================================

ممنوع:
- لا تستخدم أي repo/path قديم باسم bth كهدف نشط.
- لا تلمس app-client/** أو app-partner/** أو app-captain/** أو app-field/**.
- لا تلمس control-panel/** أو webapp/** أو website/**.
- لا تلمس ui-kit/** إلا إذا كان الملف حوكمي/وكيل مثبت داخل النطاق.
- لا تلمس dsh/wlt/knz/arb/amn/esf/mrf/snd/kwd implementation code.
- لا تلمس package.json.
- لا تلمس pnpm-lock.yaml.
- لا تلمس pnpm-workspace.yaml إلا للقراءة.
- لا تغيّر tsconfig أو CI أو dependencies.
- لا تستخدم npx.
- لا تستخدم _HANDOFF.zip كقاعدة جديدة.
- لا تجعل NestJS canonical backend إذا كان Go هو target backend.
- لا تترك broken references.
- لا تنشئ skill تافه.
- لا تنشئ guard تافه.
- لا تترك legacy narrative في الملفات اليومية.
- لا تعيد هيكلة governance/ جذريًا.
- لا تعيد هيكلة tools/guards/ جذريًا.
- لا تنقل الحوكمة إلى .agents/.
- لا تنقل الحراس إلى governance/.
- لا تجعل .github/skills أو .opencode/skills مصدرًا موازيًا.

مسموح:
- حذف الملفات المكررة أو التافهة أو القديمة بعد reference scan.
- دمج القواعد الصغيرة داخل ملف أقوى.
- تحويل ملفات tool-specific إلى adapters قصيرة.
- تحويل .github/skills أو .opencode/skills إلى bridge خفيف عند الحاجة.
- إضافة الملفات الناقصة داخل .agents/.
- إضافة/تحديث GUARDS_CATALOG.md إذا لم يكن موجودًا.
- إضافة/تحديث RUN_AGENT_GUARDS.ps1 إذا كان ضروريًا.
- إضافة/تحديث guard واحد أو guard محدود يمنع عودة الضجيج، بدون تضخيم.

================================================================================
2) الهيكل النهائي المعتمد — لا تغيّره إلا بدليل
================================================================================

لا تعيد بناء المشروع من الصفر. استفد من الهيكل الحالي قدر الإمكان.

الهيكل المعتمد:

governance/
  00_README.md
  01_GOVERNANCE_INDEX.md أو أقرب فهرس موجود
  02_PLATFORM_SSOT.md
  03_REPO_BOUNDARIES.md
  04_ARCHITECTURE_RULES.md
  05_PACKAGE_BOUNDARIES.md
  06_APPS_AND_SHELLS.md
  07_SURFACES_AND_SERVICES.md
  08_UI_KIT_AND_BRAND.md
  09_API_BINDING_RUNTIME.md
  10_SERVICE_CLOSURE.md
  11_EVIDENCE_AND_TRACEABILITY.md
  12_TESTING_AND_PRODUCTION_READINESS.md
  13_CI_AND_GATES.md
  14_GUARDS_CATALOG.md
  15_AGENT_AND_AI_EXECUTION.md
  16_SECURITY_AND_SECRETS.md
  17_CLEANUP_AND_DEPRECATION.md
  18_BRANCH_AND_CHECKPOINTS.md
  19_CONTROL_PANEL_AND_OPERATING_MODEL.md
  20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md
  22_DSH_GOLDEN_SLICE.md
  23_WARNINGS_AND_FALSE_POSITIVES.md
  24_TRACEABILITY_AND_ROADMAP.md
  99_LEGACY_MERGE_LEDGER.md

  PLATFORM_BLUEPRINT.md
  TECH_STACK_LOCK.md
  TAMAGUI_INTEGRATION_LAW.md
  BTHWANI_FINAL_MERGED_ENGINEERING_BASELINE_V1.md
  BTHWANI_DSH_BASELINE_READINESS_GUARDS_ADDENDUM.md
  AGENT_CHANGE_LEDGER.md
  AGENT_UPDATE_VALIDATION_CHECKLIST.md

.agents/
  README.md
  INDEX.md
  AUTHORITY_BOUNDARY.md
  UPDATE_POLICY.md
  skills/
    bthwani-current-workspace-authority/SKILL.md
    bthwani-agent-governance-execution/SKILL.md
    bthwani-local-evidence-pack/SKILL.md
    bthwani-ui-kit-surface-contract/SKILL.md
    bthwani-screen-flow-binding-contract/SKILL.md
    bthwani-go-backend-target-boundary/SKILL.md
    bthwani-dsh-ui-kit-golden-slice/SKILL.md
    plus any existing strong non-trivial skill that proves independent value
  adapters/
    copilot.md
    codex.md
    gemini.md
    claude.md
    opencode.md
    cursor.md

root/tool adapters:
  AGENTS.md
  CLAUDE.md
  GEMINI.md
  opencode.json
  .codex/*
  .github/copilot-instructions.md
  .cursor/* only if used and non-duplicative

tools/guards/
  README.md
  GUARDS_CATALOG.md
  RUN_GOVERNANCE_GUARDS.ps1
  RUN_AGENT_GUARDS.ps1
  guard-manifest.json
  _guard-common.mjs
  lib/
  guard-*.mjs
  guard-*.config.json

مهم:
- لا تنقل tools/guards إلى subfolders جديدة الآن.
- لا تنقل governance إلى subfolders جديدة الآن.
- إذا وجدت subfolders موجودة أصلًا، لا تحذفها عشوائيًا؛ صنفها أولًا.
- إذا اضطررت للانحراف عن هذا الهيكل، وثّق السبب في unresolved-review.md.

================================================================================
3) الملفات الحوكمية التي يجب أخذها في الاعتبار
================================================================================

قبل أي حذف أو دمج داخل governance/، اقرأ هذه الملفات إن وجدت:

- governance/00_README.md
- governance/PLATFORM_BLUEPRINT.md
- governance/TAMAGUI_INTEGRATION_LAW.md
- governance/TECH_STACK_LOCK.md
- governance/BTHWANI_FINAL_MERGED_ENGINEERING_BASELINE_V1.md
- governance/BTHWANI_DSH_BASELINE_READINESS_GUARDS_ADDENDUM.md
- governance/AGENT_UPDATE_VALIDATION_CHECKLIST.md
- governance/15_AGENT_AND_AI_EXECUTION.md
- governance/14_GUARDS_CATALOG.md
- governance/99_LEGACY_MERGE_LEDGER.md

لكل ملف حوكمي:
- لا تحذف ملفًا يحتوي قرارًا غير موجود في ملف أقوى.
- لا تنقل قراراته إلى .agents/.
- إذا كان يحتوي legacy narrative بعد تصحيحها، اختصره إلى الصحيح الحالي.
- إذا كان تاريخيًا فقط، انقل أثره إلى 99_LEGACY_MERGE_LEDGER.md أو evidence.
- إذا كان يكرر قرارًا موجودًا في PLATFORM_BLUEPRINT.md أو TECH_STACK_LOCK.md أو TAMAGUI_INTEGRATION_LAW.md، حوّله إلى reference مختصر أو ادمجه.
- إذا كان Support Checklist مثل AGENT_UPDATE_VALIDATION_CHECKLIST.md، أبقه دعمًا ولا تجعله authority موازيًا.

================================================================================
4) File Worthiness Test — اختبار استحقاق الملف
================================================================================

قبل الإبقاء على أي ملف أو إنشاء أي ملف جديد، طبق هذا الاختبار:

يبقى الملف فقط إذا:
1. له وظيفة مستقلة واضحة.
2. سيقرأه وكيل أو guard فعليًا.
3. يحتوي معلومة لا توجد في ملف أقوى.
4. لا يمكن دمجه في ملف قائم بدون فقدان وضوح.
5. حذفه سيكسر reference أو workflow حقيقي.
6. ليس مجرد legacy explanation.
7. ليس مجرد قاعدة صغيرة.
8. لا يكرر governance أو skill أو guard آخر.
9. لا يسبب تشتيتًا أكثر مما يضيف قيمة.

إذا فشل:
- احذفه إذا لم توجد references مهمة.
- أو ادمجه في ملف أقوى.
- أو حوّله إلى reference قصير.
- أو صنفه NEEDS_MANUAL_REVIEW إذا كان الحذف خطرًا.

================================================================================
5) Triviality Gate — منع الملفات التافهة
================================================================================

لا تنشئ skill مستقل لأي قاعدة صغيرة مثل:
- لا تستخدم npx.
- لا تستخدم _HANDOFF.zip.
- لا تذكر legacy paths.
- لا تجعل NestJS canonical.
- لا تكرر governance.

هذه القواعد مكانها:
- .agents/UPDATE_POLICY.md
- .agents/AUTHORITY_BOUNDARY.md
- tools/guards/guard-agent-global-authority.mjs أو ps1
- guard-manifest.json / GUARDS_CATALOG.md

لا تنشئ guard مستقل لكل قاعدة صغيرة.
ادمج القواعد الصغيرة داخل guard أقوى.

================================================================================
6) Legacy Narrative Purge — دفن سرد legacy
================================================================================

إذا تم تصحيح legacy:
- لا تذكر قصته في AGENTS.md.
- لا تذكر قصته في .agents/skills.
- لا تذكر قصته في adapters.
- لا تكرر قصته داخل governance اليومية.
- اذكر الصحيح الحالي فقط.
- إن احتجت أثرًا تاريخيًا، ضعه في evidence أو 99_LEGACY_MERGE_LEDGER.md فقط.

أمثلة صحيحة:
- Current UI kit root: ui-kit/
- Registry ZIP name: {SESSION_ID}.zip
- Backend target: Go unless current repo evidence explicitly says otherwise.
- Current workspace roots are from pnpm-workspace.yaml.

أمثلة ممنوعة:
- كان المسار القديم كذا...
- سابقًا كان يستخدم كذا...
- القديم كان...
- legacy path كان...

================================================================================
7) Phase 0 — Scope Lock
================================================================================

أنشئ SESSION_ID:

AGENT_GOVERNANCE_GUARDS_FINAL_CLOSURE_V5-<timestamp>

داخل:

tools/registry/runs/{SESSION_ID}/

واكتب scope-lock.md يحتوي:
- النطاق المسموح.
- النطاق الممنوع.
- القرار الهيكلي.
- لا إعادة هيكلة جذرية للحوكمة أو الحراس.
- .agents فقط تحتاج إكمال بنيوي إذا الملفات ناقصة.

================================================================================
8) Phase 1 — Baseline Evidence
================================================================================

شغّل:

Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager log --oneline -n 5
git ls-files --others --exclude-standard

اكتب النتائج في:
- git-status-before.txt
- git-log-before.txt
- untracked-before.txt

اقرأ:
- pnpm-workspace.yaml
- AGENTS.md
- governance/**
- .agents/**
- .github/copilot-instructions.md
- .github/skills/**
- .github/agents/**
- .codex/**
- .cursor/**
- .opencode/**
- opencode.json
- CLAUDE.md
- GEMINI.md
- tools/guards/**
- tools/scripts/** المرتبطة بالوكلاء/الحوكمة فقط

================================================================================
9) Phase 2 — Inventory and Classification
================================================================================

أنشئ:

agent-governance-guards-inventory.md

صنّف كل ملف داخل النطاق إلى:

- GOVERNANCE_CANONICAL_KEEP
- GOVERNANCE_SUPPORT_KEEP
- GLOBAL_AGENT_KEEP
- TOOL_ADAPTER_KEEP
- GUARD_KEEP
- MANIFEST_KEEP
- BRIDGE_KEEP
- MIGRATE_TO_GLOBAL_AGENT
- CONVERT_TO_ADAPTER
- CONVERT_TO_BRIDGE
- MERGE_INTO_EXISTING_FILE
- DUPLICATE_DELETE
- TRIVIAL_DELETE
- LEGACY_DELETE
- LEGACY_NARRATIVE_PURGE
- CONFLICT_FIX
- NEEDS_MANUAL_REVIEW

لكل ملف:
- path
- current role
- final role
- owner layer: governance / .agents / adapter / guard / manifest / delete / review
- references found
- is_trivial: yes/no
- can_merge_into_existing: yes/no
- contains_legacy_narrative: yes/no
- duplicate_of
- proposed action
- reason

================================================================================
10) Phase 3 — Governance Cleanup
================================================================================

داخل governance/:
- حافظ على الهيكل flat.
- لا تحذف canonical governance files.
- لا تنقل decisions إلى .agents/.
- لا تترك legacy narrative.
- لا تترك duplicate decision.
- لا تضع تعليمات تشغيل طويلة لكل وكيل.
- لا تجعل governance prompt repository.

صحح:
- branch hardcoding -> runtime-detected from Git.
- _HANDOFF.zip -> {SESSION_ID}.zip.
- NestJS canonical backend -> Go target backend unless current repo evidence explicitly requires otherwise.
- legacy apps/packages paths -> current flat workspace roots from pnpm-workspace.yaml.
- Copilot-only wording -> multi-agent wording.

اكتب:
- governance-cleanup.md
- legacy-narrative-purge.md

================================================================================
11) Phase 4 — .agents Global Setup
================================================================================

داخل .agents/:
أنشئ أو حدّث:

- README.md
- INDEX.md
- AUTHORITY_BOUNDARY.md
- UPDATE_POLICY.md

محتوى AUTHORITY_BOUNDARY.md يجب أن يثبت:
- governance decides.
- .agents executes.
- adapters connect.
- guards verify.
- evidence/ledger records history.

محتوى UPDATE_POLICY.md يجب أن يثبت:
- تحديث عام لأكثر من وكيل -> .agents/.
- تحديث خاص بأداة واحدة -> adapter الأداة.
- قرار مشروع/معمارية -> governance/.
- فحص رقمي -> tools/guards/.
- تاريخ legacy -> evidence/ledger فقط.
- ممنوع duplicate copy.
- ممنوع skill تافه.
- ممنوع guard تافه.
- أي ملف جديد يجب تصنيفه قبل إضافته.

skills:
- أبقِ المهارات العملية القوية فقط.
- احذف/ادمج أي skill تافه أو مكرر.
- أي skill يجب أن يكون مختصرًا وعمليًا وله workflow واضح.
- أي skill يجب أن يشير إلى governance عند القرارات بدل تكرارها.

اكتب:
- agent-cleanup.md
- trivial-files-consolidation.md

================================================================================
12) Phase 5 — Tool Adapters
================================================================================

حدّث/أنشئ:

.agents/adapters/copilot.md
.agents/adapters/codex.md
.agents/adapters/gemini.md
.agents/adapters/claude.md
.agents/adapters/opencode.md
.agents/adapters/cursor.md

كل adapter يجب أن يحتوي فقط:
- Purpose
- Read first:
  - .agents/INDEX.md
  - .agents/AUTHORITY_BOUNDARY.md
  - governance/00_README.md عند القرارات
- tool-specific notes
- forbidden actions
- required evidence
- لا governance كاملة
- لا skills كاملة
- لا legacy narrative

حدّث root adapters:
- AGENTS.md
- .github/copilot-instructions.md
- CLAUDE.md
- GEMINI.md
- .codex/*
- .cursor/*
- opencode.json

AGENTS.md:
- أبقِ كتلة Nx التلقائية كما هي إذا كانت موجودة.
- اجعله root entry مختصر.
- وجّهه إلى .agents/INDEX.md وAUTHORITY_BOUNDARY.md وgovernance/.
- لا تكرر skill contents.
- لا تجعله Copilot-only.
- لا تشرح legacy.

.github/copilot-instructions.md:
- حافظ على ghb/gp shortcuts إن وجدت.
- اجعله adapter خفيفًا لـ Copilot.
- لا تكرر governance أو skills.

opencode.json:
- config فقط.
- استخدم pnpm exec وليس npx.

اكتب:
- adapters-decision.md

================================================================================
13) Phase 6 — .github / .opencode / .cursor Decisions
================================================================================

.github/skills:
- إذا كانت تكرر .agents/skills ولا تحتاجها أداة، احذفها بعد reference scan.
- إذا كانت GitHub/Copilot تحتاجها، اجعلها bridge خفيفًا فقط.
- لا تترك نسخة كاملة ثانية.
- لا تترك legacy narrative.
- اكتب github-skills-decision.md.

.github/agents:
- احتفظ فقط بما له routing/base/overlay حقيقي وغير مكرر.
- إذا أصبح .agents/routing أو INDEX كافيًا، لا تترك duplicate routing.
- bridge خفيف فقط عند الحاجة.
- اكتب github-agents-decision.md.

.opencode/skills و .cursor:
- لا تترك skills كاملة مكررة.
- bridge أو adapter فقط عند الحاجة.
- احذف noise غير المستخدم.
- اكتب tool-bridge-decision.md.

================================================================================
14) Phase 7 — Guards Finalization
================================================================================

حافظ على tools/guards/ كهيكل flat حالي.

لا تنقل الحراس إلى subfolders جديدة.

حدّث أو أنشئ فقط عند الحاجة:

- GUARDS_CATALOG.md
- RUN_AGENT_GUARDS.ps1
- guard-agent-global-authority.mjs أو guard-agent-global-authority.ps1
- تحديث guard-manifest.json

قواعد الحراس:
- كل guard يجب أن يشير إلى owner policy داخل governance أو .agents/UPDATE_POLICY.md.
- كل guard يجب أن يخرج evidence قابل للحفظ.
- كل guard يجب أن يكون مذكورًا في guard-manifest.json أو موثقًا لماذا لا يحتاج manifest.
- لا guard تافه مستقل.
- لا guard يكرر guard آخر.
- لا guard يخترع policy.

guard-agent-global-authority يجب أن يفحص:
- لا duplicate skills بين .agents و.github/.cursor/.codex/.opencode.
- adapters ليست طويلة ولا تكرر governance.
- لا npx.
- لا _HANDOFF.zip كقاعدة جديدة.
- لا NestJS canonical backend إذا كان Go target.
- لا legacy active paths.
- لا legacy narrative في الملفات اليومية.
- لا skills/guards تافهة مستقلة.
- لا broken references أساسية.
- أي ملف وكيل جديد مصنف في .agents/UPDATE_POLICY.md.

اكتب:
- guards-decision.md
- guard-manifest-update.md

================================================================================
15) Phase 8 — Deletion and Merge Rules
================================================================================

احذف مباشرة بعد reference scan كل ملف أو مجلد يثبت أنه:
- duplicate بلا سبب.
- trivial بلا قيمة مستقلة.
- legacy ولا يستخدم.
- يحتوي legacy narrative بعد التصحيح.
- يحتوي مسارات قديمة كمسارات تنفيذ نشطة.
- يحتوي npx لأوامر BThwani الحالية.
- يحكم بأن _HANDOFF.zip هو القاعدة الجديدة.
- يجعل NestJS canonical backend بدل Go target.
- ينشئ governance authority خارج governance/.
- يكرر skill موجود في .agents/skills.
- adapter طويل يكرر governance أو skills.
- Cursor/Codex/OpenCode noise بلا وظيفة.
- broken أو orphan ولا reference فعلي له.

لا تحذف:
- governance canonical files.
- AGENTS.md.
- .github/copilot-instructions.md.
- opencode.json إذا كان مستخدمًا وصحيحًا.
- tools/guards runner/common/manifest بدون بديل واضح.
- أي ملف له reference فعلي ولا يوجد بديل واضح.

اكتب:
- deleted-files.md
- merged-files.md
- kept-files.md
- fixed-files.md
- unresolved-review.md

================================================================================
16) Phase 9 — Reference Repair
================================================================================

بعد الحذف أو النقل:
- ابحث عن كل مسار حُذف أو نُقل داخل الريبو.
- أصلح references إلى:
  - governance/
  - .agents/INDEX.md
  - .agents/AUTHORITY_BOUNDARY.md
  - .agents/UPDATE_POLICY.md
  - .agents/skills
  - .agents/adapters
  - tools/guards/RUN_GOVERNANCE_GUARDS.ps1
  - tools/guards/RUN_AGENT_GUARDS.ps1
  - tools/guards/guard-manifest.json
- لا تترك broken links.
- لا تترك references إلى ملفات محذوفة.
- لا تترك references إلى legacy narrative.

اكتب:
- broken-reference-scan.txt

================================================================================
17) Phase 10 — Verification
================================================================================

شغّل:

Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

ثم شغّل:

Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\RUN_GOVERNANCE_GUARDS.ps1"

إذا تم إنشاء RUN_AGENT_GUARDS.ps1:

Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\guards\RUN_AGENT_GUARDS.ps1"

إذا فشل tsc بسبب مشاكل قديمة خارج نطاق الوكلاء/الحوكمة/الحراس، لا تصلحها هنا. وثّقها PRE_EXISTING_OR_OUT_OF_SCOPE مع الدليل.

احفظ النتائج:
- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- tsc-noemit.txt
- governance-guards.txt
- agent-guards.txt
- untracked-files.txt

================================================================================
18) Phase 11 — Evidence Pack
================================================================================

داخل:

tools/registry/runs/{SESSION_ID}/

أنشئ:

- SUMMARY.md
- scope-lock.md
- agent-governance-guards-inventory.md
- final-authority-boundary.md
- final-agent-architecture.md
- governance-cleanup.md
- legacy-narrative-purge.md
- trivial-files-consolidation.md
- agent-cleanup.md
- adapters-decision.md
- github-skills-decision.md
- github-agents-decision.md
- tool-bridge-decision.md
- guards-decision.md
- guard-manifest-update.md
- migrated-files.md
- merged-files.md
- deleted-files.md
- kept-files.md
- fixed-files.md
- unresolved-review.md
- broken-reference-scan.txt
- git-status-before.txt
- git-log-before.txt
- untracked-before.txt
- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- tsc-noemit.txt
- governance-guards.txt
- agent-guards.txt
- untracked-files.txt
- evidence.json
- commands.log

ثم أنشئ ZIP باسم نفس SESSION_ID:

tools/registry/runs/{SESSION_ID}/{SESSION_ID}.zip

لا تستخدم _HANDOFF.zip.

ثم أنشئ في root:

Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short > ".\LOCAL_CHANGE_STATUS.txt"
git --no-pager diff --stat > ".\LOCAL_CHANGE_DIFF_STAT.txt"
git --no-pager diff --name-status > ".\LOCAL_CHANGE_NAME_STATUS.txt"
git --no-pager diff --check > ".\LOCAL_CHANGE_DIFF_CHECK.txt"
git --no-pager diff --binary > ".\LOCAL_CHANGE_REVIEW.patch"
git ls-files --others --exclude-standard > ".\LOCAL_CHANGE_UNTRACKED_FILES.txt"

================================================================================
19) Phase 12 — Final Output
================================================================================

لا تقل PASS أو CLOSED أو FINAL أو 100%.

اكتب فقط:

DONE

أو:

BLOCKED

ثم اعرض:
- البنية النهائية المعتمدة.
- هل تم الحفاظ على governance/ flat أم لا.
- هل تم الحفاظ على tools/guards/ flat أم لا.
- ما الذي أصبح canonical.
- ما الذي أصبح global agent source.
- ما الذي بقي adapter فقط.
- قرار .github/skills.
- قرار .github/agents.
- قرار .opencode/.cursor/.codex.
- قرار tools/guards.
- ما legacy narrative الذي تم حذفه أو نقله.
- ما الملفات التافهة التي تم حذفها أو دمجها.
- الملفات المحذوفة.
- الملفات المدمجة.
- الملفات المنقولة.
- الملفات المصححة.
- الملفات التي بقيت NEEDS_MANUAL_REVIEW.
- نتيجة diff check.
- نتيجة tsc.
- نتيجة governance guards.
- نتيجة agent guards.
- هل توجد untracked files.
- مسار evidence ZIP.
- مسار LOCAL_CHANGE_REVIEW.patch.

معيار الإغلاق:
- governance/ = سلطة القرار فقط.
- .agents/ = المصدر العالمي العملي لكل الوكلاء فقط.
- AGENTS.md = root entry مختصر فقط.
- Copilot/Codex/Gemini/Claude/OpenCode/Cursor = adapters فقط.
- tools/guards = تحقق رقمي فقط.
- evidence/ledger = التاريخ والlegacy فقط.
- لا duplicate skills.
- لا skills تافهة.
- لا guards تافهة.
- لا parallel governance.
- لا broken references.
- لا legacy narrative في الملفات اليومية.
- لا npx.
- لا _HANDOFF.zip كقاعدة جديدة.
- لا NestJS كـ canonical backend إذا كان Go هو target.
- لا legacy active paths.
- سياسة update routing موجودة ومطبقة.
- guard يمنع الضجيج المستقبلي.
- لا commit ولا push.
```

---

## ملفات يجب رفعها بعد التنفيذ للمراجعة

بعد تنفيذ الأمر، ارفع هذه الملفات:

```text
LOCAL_CHANGE_REVIEW.patch
LOCAL_CHANGE_STATUS.txt
LOCAL_CHANGE_NAME_STATUS.txt
LOCAL_CHANGE_DIFF_CHECK.txt
LOCAL_CHANGE_UNTRACKED_FILES.txt
tools\registry\runs\AGENT_GOVERNANCE_GUARDS_FINAL_CLOSURE_V5-...\AGENT_GOVERNANCE_GUARDS_FINAL_CLOSURE_V5-....zip
```
