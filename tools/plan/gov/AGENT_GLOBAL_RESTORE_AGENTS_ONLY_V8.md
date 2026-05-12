# أمر تنفيذ نهائي V8 — بناء مجلد الوكلاء العالمي بعد حذف الوكلاء محليًا وريموت

> النطاق: **الوكلاء فقط**.  
> الحوكمة والحراس في هذا الأمر: **قراءة فقط** لاستخراج الحدود والسياسات، ولا يتم تعديلهما إلا بأمر منفصل لاحقًا من المستخدم.  
> المصدر المرجعي الأساسي: الفرع `ghb/0131-20260512-191431-agents-codex-github`.  
> الفرع الحالي للتنفيذ: `ghb/0132-20260512-230649-agents-codex-github`.

---

## انسخ الأمر التالي كاملًا إلى VS Code Agent / Codex / Copilot / Gemini / Claude

```text
نفّذ هذا الطلب داخل الريبو المحلي فقط:

C:\bthwani-suite

الفرع الحالي:
ghb/0132-20260512-230649-agents-codex-github

فرع donor للتحليل والاستعادة الانتقائية:
ghb/0131-20260512-191431-agents-codex-github

المهمة:
بما أن ملفات الوكلاء حُذفت محليًا وريموت، نفّذ بناءًا جديدًا منظمًا لمجلد الوكلاء العالمي `.agents/` فقط، بالاعتماد على تحليل عميق للفرعين:
1) الفرع الحالي ghb/0132-20260512-230649-agents-codex-github
2) فرع donor ghb/0131-20260512-191431-agents-codex-github

ثم:
- استخرج فقط المحتوى المهم والعملي والمنظم من ملفات الوكلاء القديمة.
- لا تسترجع الضجيج.
- لا تسترجع التشعب.
- لا تسترجع mirrors.
- لا تنشئ bridges.
- لا تسترجع `.github/skills` كهيكل.
- لا تسترجع `.github/agents` كهيكل.
- لا تسترجع `.opencode/skills` أو `.cursor/rules` كنسخ مهارات.
- ابنِ مجلدًا عالميًا واحدًا للوكلاء تحت `.agents/`.
- أنشئ entry adapters قصيرة جدًا فقط للأدوات التي تحتاج ملفات دخول.
- اجعل كل شيء عمليًا وقابلًا للاستخدام مع Codex + Copilot + Gemini + Claude + OpenCode + Cursor.
- لا تعدل الحوكمة أو الحراس في هذا الطلب؛ فقط اقرأهما للاستدلال.

هذا الطلب خاص بالوكلاء فقط.
بعد الانتهاء من الوكلاء، سيتم طلب أمر منفصل للحراس والحوكمة.

لا تعمل:
- commit
- push
- PR
- merge
- GitHub write
- dependency change
- lockfile change
- app/ui/backend implementation change

لا تدّعِ PASS / CLOSED / FINAL / 100%.
في النهاية اكتب فقط DONE أو BLOCKED مع الأدلة.

================================================================================
0) قواعد صارمة قبل التنفيذ
================================================================================

ممنوع:
- لا تستخدم أي repo/path قديم باسم bth كهدف نشط.
- لا تعمل git restore مباشر لمسارات الوكلاء من donor branch.
- لا تعمل checkout لمسارات كاملة مثل .github أو .agents من donor branch.
- لا تستعيد .github/skills.
- لا تستعيد .github/agents كهيكل.
- لا تستعيد .opencode/skills.
- لا تستعيد .cursor/rules كمهارات أو governance.
- لا تنشئ bridge files.
- لا تنشئ mirror folders.
- لا تنشئ skill تافه.
- لا تنشئ adapter طويل.
- لا تكرر governance داخل .agents.
- لا تضع legacy narrative داخل ملفات الوكلاء اليومية.
- لا تستخدم npx.
- لا تستخدم _HANDOFF.zip.
- لا تغير governance/**.
- لا تغير tools/guards/**.
- لا تغير package.json.
- لا تغير pnpm-lock.yaml.
- لا تغير pnpm-workspace.yaml إلا قراءة فقط.
- لا تغير app-client/** أو app-partner/** أو app-captain/** أو app-field/**.
- لا تغير control-panel/** أو webapp/** أو website/** أو ui-kit/**.
- لا تغير dsh/wlt/knz/arb/amn/esf/mrf/snd/kwd implementation code.

مسموح:
- إنشاء/تحديث `.agents/**`.
- إنشاء/تحديث AGENTS.md كـ root entry adapter مختصر.
- إنشاء/تحديث .github/copilot-instructions.md كـ Copilot entry adapter مختصر فقط.
- إنشاء/تحديث CLAUDE.md و GEMINI.md كـ entry adapters قصيرة فقط إذا كانت مفيدة فعليًا.
- إنشاء/تحديث .codex/* كـ Codex adapter/config قصير فقط إذا كانت الأداة تحتاجه.
- إنشاء/تحديث .cursor/* فقط إذا ثبت أن Cursor يحتاج ملف دخول قصير.
- إنشاء/تحديث opencode.json كـ config قصير فقط عند الحاجة.
- إنشاء evidence pack.
- تصحيح references الناتجة عن بناء .agents فقط.

================================================================================
1) مصدر الحقيقة وترتيب السلطة
================================================================================

اعتمد هذا الترتيب:

1. Safety + user explicit instruction.
2. Current branch evidence: ghb/0132-20260512-230649-agents-codex-github.
3. Donor branch evidence: ghb/0131-20260512-191431-agents-codex-github.
4. governance/ files as read-only policy source.
5. tools/guards/ as read-only enforcement reference.
6. external open-source GitHub research as optional structure inspiration only, not authority.

مهم:
- external open-source GitHub sources لا تُنسخ منها تعليمات كاملة.
- استخدمها فقط لمقارنة أنماط التنظيم: agent instructions, skills layout, tool entry files, docs minimalism.
- إذا تعارضت مع BThwani governance أو user instructions، تجاهلها.
- إذا لم يكن GitHub search/open-source access متاحًا، وثّق ذلك ولا توقف المهمة.

================================================================================
2) الهيكل النهائي المطلوب
================================================================================

أنشئ/حدّث هذا الهيكل فقط:

.agents/
  README.md
  INDEX.md
  AUTHORITY_BOUNDARY.md
  UPDATE_POLICY.md
  RESTORE_DECISION.md
  SKILL_CATALOG.md
  adapters/
    copilot.md
    codex.md
    gemini.md
    claude.md
    opencode.md
    cursor.md
  skills/
    bthwani-current-workspace-authority/SKILL.md
    bthwani-agent-governance-execution/SKILL.md
    bthwani-local-evidence-pack/SKILL.md
    bthwani-ui-kit-surface-contract/SKILL.md
    bthwani-screen-flow-binding-contract/SKILL.md
    bthwani-go-backend-target-boundary/SKILL.md
    bthwani-dsh-ui-kit-golden-slice/SKILL.md
    bthwani-patch-review-and-evidence/SKILL.md
    bthwani-agent-restoration-forensics/SKILL.md

root/tool entry adapters allowed:
  AGENTS.md
  .github/copilot-instructions.md
  CLAUDE.md
  GEMINI.md
  .codex/config.toml أو أقرب config مطلوب
  .cursor/rules/agent-entry.md فقط إذا ثبت أن Cursor يحتاجه
  opencode.json فقط إذا كان مستخدمًا فعليًا

ممنوع في النتيجة النهائية:
  .github/skills/**
  .github/agents/**
  .opencode/skills/**
  .agents/skills/*/references/** unless proven essential and compact
  bridge-only files
  mirror folders
  duplicate skills
  long copied external docs
  legacy narratives

إذا أداة تتطلب مسارًا غير مسموح:
- لا تنشئه تلقائيًا.
- صنفه TOOL_REQUIRES_PATH_NEEDS_USER_DECISION.
- وثّق الدليل في unresolved-review.md.

================================================================================
3) المرحلة 0 — Evidence session
================================================================================

أنشئ SESSION_ID:

AGENT_GLOBAL_RESTORE_V8-<timestamp>

داخل:

tools/registry/runs/{SESSION_ID}/

أنشئ مباشرة:
- commands.log
- scope-lock.md

scope-lock.md يجب أن يحتوي:
- current branch
- donor branch
- scope = agents only
- governance/tools/guards read-only
- no direct restore
- no bridges
- no mirrors
- .github is donor extraction only
- .agents is final global source

================================================================================
4) المرحلة 1 — Local baseline
================================================================================

شغّل واحفظ المخرجات:

Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager branch --show-current
git --no-pager log --oneline -n 5
git ls-files --others --exclude-standard

احفظ:
- git-status-before.txt
- current-branch.txt
- git-log-before.txt
- untracked-before.txt

إذا الفرع الحالي ليس:
ghb/0132-20260512-230649-agents-codex-github

اكتب BLOCKED ولا تعدل شيئًا.

================================================================================
5) المرحلة 2 — تحليل الفرق بين الفرعين
================================================================================

شغّل:

Set-Location -LiteralPath "C:\bthwani-suite"
git fetch origin ghb/0131-20260512-191431-agents-codex-github
git fetch origin ghb/0132-20260512-230649-agents-codex-github
git --no-pager diff --name-status origin/ghb/0131-20260512-191431-agents-codex-github..origin/ghb/0132-20260512-230649-agents-codex-github > "tools\registry\runs\{SESSION_ID}\branch-diff-name-status.txt"
git --no-pager diff --stat origin/ghb/0131-20260512-191431-agents-codex-github..origin/ghb/0132-20260512-230649-agents-codex-github > "tools\registry\runs\{SESSION_ID}\branch-diff-stat.txt"

حلل:
- ما الذي حُذف من .agents.
- ما الذي حُذف من .github.
- ما الذي بقي مثل AGENTS.md.
- أي references مكسورة بسبب الحذف.
- هل AGENTS.md ما زال يشير إلى .github/skills.
- هل .github/copilot-instructions.md غير موجود في current branch لكنه موجود في donor.

اكتب:
- branch-comparison-analysis.md

================================================================================
6) المرحلة 3 — إنشاء donor snapshot بدون تطبيقه
================================================================================

أنشئ:

tools/registry/runs/{SESSION_ID}/donor-snapshot/

استخرج من donor branch فقط إلى snapshot، وليس إلى working tree:

- AGENTS.md
- .agents/**
- .github/**
- .codex/**
- .cursor/**
- .opencode/**
- opencode.json
- CLAUDE.md
- GEMINI.md
- tools/guards/** للقراءة فقط
- governance/** للقراءة فقط

استخدم طريقة لا تطبق الملفات على الريبو:
- git archive إلى donor-snapshot
أو
- git show لحفظ ملفات محددة داخل donor-snapshot

ممنوع:
- git checkout donor -- path
- git restore --source donor path
- copy مباشر من donor-snapshot إلى working tree بدون تحليل

اكتب:
- donor-snapshot-created.md
- donor-missing-paths.md

================================================================================
7) المرحلة 4 — Open-source GitHub research
================================================================================

نفّذ بحثًا read-only في GitHub عن أنماط تنظيم ملفات الوكلاء والمهارات، مثل:
- AGENTS.md minimal agent instructions
- CLAUDE.md project instructions
- GEMINI.md project instructions
- codex config agent instructions
- copilot-instructions.md
- repository agent skills layout
- agent instruction linting / context linting

القواعد:
- لا تعتمد على مصدر خارجي كسلطة.
- لا تنسخ نصوص طويلة من أي repo خارجي.
- استخرج فقط principles:
  - minimal entry adapter
  - single global source
  - avoid duplicated instructions
  - keep tool-specific files thin
  - evidence-first agent workflow
- أي شيء لا يناسب BThwani يُرفض.

إذا البحث غير متاح:
- اكتب external-github-research.md وفيه: NOT_AVAILABLE أو BLOCKED_WITHOUT_IMPACT.
- أكمل بناء .agents من donor + governance.

اكتب:
- external-github-research.md
- external-patterns-accepted.md
- external-patterns-rejected.md

================================================================================
8) المرحلة 5 — Donor inventory
================================================================================

افحص donor-snapshot وصنف كل ملف مرتبط بالوكلاء إلى:

- RESTORE_AS_GLOBAL_AGENT_CORE
- MERGE_INTO_GLOBAL_SKILL
- MERGE_INTO_UPDATE_POLICY
- MERGE_INTO_AUTHORITY_BOUNDARY
- MERGE_INTO_TOOL_ADAPTER
- MERGE_INTO_ROOT_ENTRY_ADAPTER
- READ_ONLY_GOVERNANCE_REFERENCE
- READ_ONLY_GUARD_REFERENCE
- REJECT_DUPLICATE
- REJECT_TRIVIAL
- REJECT_LEGACY_NARRATIVE
- REJECT_NOISE
- REJECT_MIRROR
- TOOL_REQUIRES_PATH_NEEDS_USER_DECISION
- NEEDS_MANUAL_REVIEW

لكل ملف:
- donor path
- file role
- content summary
- useful unique content
- final destination
- why accepted/rejected
- duplicate source if any
- references to repair

اكتب:
- donor-agent-inventory.md
- donor-accepted-map.md
- donor-rejected-map.md

================================================================================
9) المرحلة 6 — .github deep extraction
================================================================================

تعامل مع `.github` كـ donor فقط.

افحص:
- .github/copilot-instructions.md
- .github/skills/**
- .github/agents/**
- .github/agents/platform-agent-os-2026-v3-additive/**
- أي policy/checklist/routing مفيد

القواعد:
- لا تستعيد .github/skills.
- لا تستعيد .github/agents.
- لا تستعيد platform-agent-os كهيكل.
- استخرج فقط الجمل/القواعد/الـ workflows المهمة.
- أي محتوى عام يدمج في .agents/skills أو UPDATE_POLICY.
- أي محتوى Copilot-specific يدمج في .agents/adapters/copilot.md أو .github/copilot-instructions.md.
- أي محتوى checklists ضخم لا يستعاد، بل تلخص منه قواعد عامة إن كانت غير موجودة.
- أي محتوى benchmark/evolution/examples/negative/golden لا يستعاد كملفات؛ يمكن استخلاص مبدأ واحد فقط إذا كان مفيدًا.

اكتب:
- github-deep-extraction.md
- github-useful-content-merged.md
- github-noise-rejected.md

================================================================================
10) المرحلة 7 — Build `.agents` global source
================================================================================

أنشئ/حدّث:

.agents/README.md
.agents/INDEX.md
.agents/AUTHORITY_BOUNDARY.md
.agents/UPDATE_POLICY.md
.agents/RESTORE_DECISION.md
.agents/SKILL_CATALOG.md

متطلبات README.md:
- تعريف المجلد.
- أنه المصدر العالمي للوكلاء.
- لا يحتوي governance decisions.
- أين يبدأ الوكيل.

متطلبات INDEX.md:
- ترتيب القراءة.
- قائمة skills.
- قائمة adapters.
- متى يستخدم كل skill.
- أين توجد الحوكمة.
- أين توجد الأدلة.

متطلبات AUTHORITY_BOUNDARY.md:
- governance decides.
- .agents executes.
- entry adapters connect.
- guards verify.
- evidence records history.
- no bridges.
- no mirrors.
- donor files are extraction sources only.

متطلبات UPDATE_POLICY.md:
- أي تحديث عام -> .agents.
- أي تحديث خاص بأداة -> adapter.
- أي قرار مشروع -> governance.
- أي فحص رقمي -> tools/guards.
- legacy history -> evidence/ledger.
- ممنوع duplicate.
- ممنوع bridge.
- ممنوع mirror.
- ممنوع trivial skill.
- ممنوع long copied docs.

متطلبات RESTORE_DECISION.md:
- current branch.
- donor branch.
- لماذا لم يتم restore مباشر.
- ما تم استعادته.
- ما تم رفضه.
- ما بقي needs review.

متطلبات SKILL_CATALOG.md:
- جدول بكل skill.
- الغرض.
- متى يستخدم.
- المدخلات.
- المخرجات.
- الأدلة المطلوبة.
- governance references.

================================================================================
11) المرحلة 8 — Core skills
================================================================================

أنشئ/حدّث هذه المهارات فقط كبداية إلزامية:

1. .agents/skills/bthwani-current-workspace-authority/SKILL.md
2. .agents/skills/bthwani-agent-governance-execution/SKILL.md
3. .agents/skills/bthwani-local-evidence-pack/SKILL.md
4. .agents/skills/bthwani-ui-kit-surface-contract/SKILL.md
5. .agents/skills/bthwani-screen-flow-binding-contract/SKILL.md
6. .agents/skills/bthwani-go-backend-target-boundary/SKILL.md
7. .agents/skills/bthwani-dsh-ui-kit-golden-slice/SKILL.md
8. .agents/skills/bthwani-patch-review-and-evidence/SKILL.md
9. .agents/skills/bthwani-agent-restoration-forensics/SKILL.md

كل SKILL.md يجب أن يحتوي:
- Purpose
- When to use
- Inputs
- Steps
- Forbidden actions
- Required evidence
- Output contract
- Governance references
- No PASS/CLOSED without evidence

ممنوع داخل skill:
- legacy story
- long copied external docs
- duplicated governance text
- npx
- _HANDOFF.zip
- old active paths
- tool-specific config

أي donor skill إضافي:
- أضفه فقط إذا له workflow مستقل.
- وإلا ادمج مضمونه في skill موجود أو UPDATE_POLICY.
- لا تضف skills عامة ضخمة مثل entire Next/Expo/Vercel references إلا إذا تم تلخيصها إلى skill عملي قصير ومثبت الحاجة.

اكتب:
- skills-built.md
- skills-rejected.md
- skills-merged.md

================================================================================
12) المرحلة 9 — Tool adapters
================================================================================

أنشئ/حدّث:

.agents/adapters/copilot.md
.agents/adapters/codex.md
.agents/adapters/gemini.md
.agents/adapters/claude.md
.agents/adapters/opencode.md
.agents/adapters/cursor.md

كل adapter يجب أن يكون قصيرًا ويحتوي:
- tool purpose
- read first:
  - .agents/INDEX.md
  - .agents/AUTHORITY_BOUNDARY.md
  - relevant skill
- tool-specific notes
- forbidden actions
- evidence expectations
- no duplicated skills
- no duplicated governance

Root entry adapters:
- AGENTS.md:
  - أبقِ Nx auto block إن وجد.
  - أصلح أي references إلى .github/skills لتصبح .agents/skills.
  - اجعله مختصرًا.
- .github/copilot-instructions.md:
  - أنشئه أو حدثه فقط كـ Copilot entry adapter.
  - حافظ على ghb/gp shortcuts إن كانت موجودة ومفيدة.
  - لا يحتوي skills كاملة.
- CLAUDE.md:
  - entry adapter مختصر إلى .agents/adapters/claude.md.
- GEMINI.md:
  - entry adapter مختصر إلى .agents/adapters/gemini.md.
- .codex/config.toml:
  - config مختصر إذا كان مطلوبًا.
- .cursor/rules/agent-entry.md:
  - فقط إذا ثبت أن Cursor يحتاجه.
- opencode.json:
  - config فقط إذا كان مستخدمًا.

اكتب:
- adapters-built.md
- root-entry-adapters-built.md
- adapters-rejected.md

================================================================================
13) المرحلة 10 — References repair
================================================================================

ابحث في كامل الريبو عن:
- .github/skills
- .github/agents
- .opencode/skills
- .cursor/rules
- donor-snapshot
- _HANDOFF.zip
- npx
- legacy active paths
- old skill paths

أصلح فقط references المرتبطة بالوكلاء.

لا تلمس references داخل ملفات تاريخية/evidence قديمة إلا إذا كانت active instructions.

اكتب:
- reference-repair.md
- broken-reference-scan.txt

================================================================================
14) المرحلة 11 — Final no-noise gate
================================================================================

تحقق نهائيًا أن النتيجة لا تحتوي:
- .github/skills/**
- .github/agents/**
- .opencode/skills/**
- duplicate skill names
- bridge-only files
- mirror folders
- huge copied reference folders
- legacy narrative in active agent files
- old active paths
- npx in agent configs
- _HANDOFF.zip as new rule
- AGENTS.md pointing to .github/skills

إذا ظهر أي بند:
- أصلحه.
- إن لم يمكن، BLOCKED مع السبب.

اكتب:
- no-noise-final-gate.md

================================================================================
15) المرحلة 12 — Verification
================================================================================

شغّل:

Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

إذا tsc يفشل بسبب مشاكل قديمة خارج نطاق الوكلاء:
- لا تصلحها.
- وثق PRE_EXISTING_OR_OUT_OF_SCOPE.

احفظ:
- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- tsc-noemit.txt
- untracked-files.txt

================================================================================
16) المرحلة 13 — Evidence pack
================================================================================

داخل:

tools/registry/runs/{SESSION_ID}/

أنشئ:
- SUMMARY.md
- scope-lock.md
- branch-comparison-analysis.md
- donor-snapshot-created.md
- donor-missing-paths.md
- external-github-research.md
- external-patterns-accepted.md
- external-patterns-rejected.md
- donor-agent-inventory.md
- donor-accepted-map.md
- donor-rejected-map.md
- github-deep-extraction.md
- github-useful-content-merged.md
- github-noise-rejected.md
- final-agent-architecture.md
- restore-decision.md
- skills-built.md
- skills-rejected.md
- skills-merged.md
- adapters-built.md
- root-entry-adapters-built.md
- adapters-rejected.md
- reference-repair.md
- broken-reference-scan.txt
- no-noise-final-gate.md
- unresolved-review.md
- git-status-before.txt
- current-branch.txt
- git-log-before.txt
- untracked-before.txt
- git-status.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- tsc-noemit.txt
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
17) المرحلة 14 — Final output
================================================================================

لا تقل PASS أو CLOSED أو FINAL أو 100%.

اكتب فقط:

DONE

أو:

BLOCKED

ثم اعرض:
- current branch.
- donor branch.
- هل تم استخدام donor snapshot بدون restore مباشر؟
- هل تم بحث مصادر GitHub open-source؟ وإذا لم يتم، لماذا؟
- البنية النهائية لـ .agents.
- قائمة skills النهائية.
- قائمة adapters النهائية.
- ما الذي استُخرج من .github.
- ما الذي رُفض من .github.
- هل .github/skills غير موجودة؟
- هل .github/agents غير موجودة؟
- هل لا توجد bridges؟
- هل لا توجد mirrors؟
- هل AGENTS.md يشير إلى .agents لا .github/skills؟
- نتيجة diff check.
- نتيجة tsc.
- هل توجد untracked files.
- مسار evidence ZIP.
- مسار LOCAL_CHANGE_REVIEW.patch.
```

---

## الملفات المطلوبة بعد التنفيذ

ارفع بعد التنفيذ:

```text
LOCAL_CHANGE_REVIEW.patch
LOCAL_CHANGE_STATUS.txt
LOCAL_CHANGE_NAME_STATUS.txt
LOCAL_CHANGE_DIFF_CHECK.txt
LOCAL_CHANGE_UNTRACKED_FILES.txt
tools\registry\runs\AGENT_GLOBAL_RESTORE_V8-...\AGENT_GLOBAL_RESTORE_V8-....zip
```
```
