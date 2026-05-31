# إعادة تجهيز ملف `متدرج.txt` — المسار المتدرج المختصر فقط

**Version:** 2026.05.31-focused-final
**Scope:** إعادة بناء قسم `## المسار المتدرج المختصر` فقط
**Purpose:** سد النقص الموجود في المسار المرفق دون تحويله إلى SOP واسع أو مستند حوكمة خارج موضوع المسار.

---

## 1) تحليل الملف المرفق الحالي

الملف الحالي يقدّم مسارًا جيدًا لمرحلة **إغلاق المنطق التقني والتشغيلي الناقص**، لكنه يبدأ من منتصف العملية تقريبًا، ويركز على المنطق الداخلي أكثر من كونه مسار إغلاق كامل يمكن الاعتماد عليه قبل `Design Closure`.

### ما يغطيه الملف الحالي جيدًا

1. اكتشاف المنطق الناقص.
2. إغلاق الأزرار والإجراءات.
3. إغلاق State Machine.
4. إغلاق Flow Logic.
5. إغلاق ViewModel / Adapter.
6. إغلاق Domain Logic.
7. إغلاق الصلاحيات والظهور.
8. إغلاق Validation.
9. إغلاق Conflict Resolution.
10. إغلاق KPIs/calculations.
11. إغلاق Navigation/Routing.
12. إغلاق Data Loading.
13. تصنيف Mutations كحدود لا Backend.
14. إغلاق Audit/History/Rollback Preview.
15. إغلاق Error Handling.
16. إغلاق Empty/Loading/Blocked/Disabled.
17. إغلاق Cross-Surface Consistency.
18. إغلاق Security/Privacy/Secrets.
19. إغلاق Observability/Telemetry لاحقًا.
20. إغلاق Tests/Guards Readiness.
21. إغلاق Technical Debt.
22. إنتاج Technical / Logic Gap Matrix.
23. اختيار Task 1.
24. Technical / Logic Closure Gate.

### الحكم على الملف الحالي

```text
Decision: FIX_REQUIRED
Reason: المسار صحيح كهيكل أولي، لكنه ناقص كنقطة اعتماد نهائية قبل Design Closure لأنه لا يغطي عدة بوابات لازمة داخل نفس المسار.
```

---

## 2) نقاط النقص والضعف داخل المسار الحالي

1. لا يبدأ بتثبيت نطاق المستهدف وسياقه قبل فحص المنطق.
2. لا يفرض إثبات owner / source of truth لكل منطق ظاهر.
3. لا يفصل بين owner file وsupporting files وdependency files.
4. لا يغلق registry / route / requiredStates قبل تقييم الأزرار والتبويبات.
5. لا يضع خطوة صريحة لتصنيف linked surfaces قبل Cross-Surface Consistency.
6. لا يربط المنطق ببنية الملفات وموضوعات `topic` بعد Structural Hygiene.
7. لا يحتوي خطوة صريحة لإغلاق Data / Media Ownership قبل Domain Logic.
8. لا يصحح مسار DSH media القديم إلى المسار الأحدث.
9. لا يفرض on-demand retrieval كخطوة مستقلة قبل Data Loading.
10. لا يغطي search/filter/sort/pagination كمنطق مستقل قبل اعتباره جزءًا من actions فقط.
11. لا يغطي حالات RTL/LTR واللغة والتنسيقات المختلطة داخل المنطق المرئي.
12. لا يغطي visibility rules / feature flags / vars / provider policy كمرحلة مستقلة.
13. لا يغطي notifications / handoff / downstream effects عند وجود action يغيّر حالة تشغيلية.
14. لا يغطي performance logic قبل Design Closure بشكل كافٍ.
15. لا يغطي bundle/heavy import/list rendering كجزء من إغلاق الأداء داخل المسار.
16. لا يغطي UI-kit/design-system boundary كشرط قبل Design Closure.
17. لا يفرض Design Preservation Baseline كقيد انتقالي.
18. لا يربط كل closure بمخرجات تحقق واضحة.
19. لا يفرض Evidence readiness قبل Task 1.
20. لا يذكر Patch / untracked / rollback readiness عند التنفيذ.
21. لا يحتوي Gate واضح للانتقال من هذه المرحلة إلى `Design Closure`.
22. لا يحتوي Re-diagnosis بعد Task 1 كخطوة داخل المسار نفسه.
23. لا يحتوي قرار نهائي موحد لهذه المرحلة.
24. لا يميز بما يكفي بين ما يغلق الآن وما يصنف `BLOCKED_WITH_REASON`.

---

# النسخة المعاد تجهيزها

هذه الصياغة النهائية المتدرجة لمرحلة **إغلاق المنطق التقني والتشغيلي الناقص** التي يجب إضافتها داخل الحزمة، بعد `Structural Hygiene` وقبل `Design Closure`.

## المسار المتدرج المختصر

1. **تثبيت نطاق المستهدف وسياقه**

   * حدد `TARGET_NAME / TARGET_SCOPE` كنقطة بداية فقط، وليس كملف واحد.
   * ثبّت: السطح، القسم، الشاشة، التبويب، الرحلة، أو الملف المالك.
   * صنّف كل ملف مرتبط: `primary / supporting / dependency / evidence-only / deferred / blocked`.

2. **إغلاق ملكية المستهدف وSource of Truth**

   * حدد owner الحقيقي لكل منطق ظاهر في الواجهة.
   * اربط كل شيء بـ route / registry / ownerPath / source data / adapter / surface.
   * ممنوع منطق بلا owner أو مصدر حقيقة واضح.

3. **إغلاق تصنيف نوع المستهدف**

   * صنّف المستهدف: `app screen / app journey / control-panel section / control-panel topic / data-media owner / platform-vars / catalog / marketing / finance / operations / cross-surface journey`.
   * لا تبدأ إغلاق المنطق قبل معرفة نوع المستهدف.
   * إذا ظهر أكثر من نوع، صنّف الأساسي والداعم والمؤجل.

4. **إغلاق تصنيف الأسطح المرتبطة**

   * افحص الارتباط عبر:

     ```text
     client / partner / captain / field / control-panel / catalogs / marketing / platform-vars / finance-WLT / operations / support / shared-data-media
     ```

   * لكل سطح حدد: ماذا يرى؟ ماذا يغيّر؟ ماذا يستهلك؟ ماذا ينتظر لاحقًا؟
   * ممنوع تحليل سطح واحد إذا كان المنطق مشتركًا بين أكثر من سطح.

5. **إغلاق Registry / Route / Required States**

   * افحص: route، page، host، screen registry، section registry، ownerPath، requiredStates.
   * كل requiredState يجب أن يظهر فعليًا أو يصنف `BLOCKED_WITH_REASON`.
   * ممنوع tab أو route أو drawer أو sheet بلا registry/owner واضح عند الحاجة.

6. **اكتشاف المنطق الناقص**

   * افحص كل ما يظهر في الواجهة ولا يعمل فعليًا.
   * ابحث عن: زر بلا handler، تبويب بلا state/result، flow بلا نهاية، KPI بلا مصدر، status بلا mapping، CTA بلا target.
   * صنّف كل شيء: `UI-only now` أو `API/runtime later` أو `BLOCKED_WITH_REASON`.

7. **إغلاق منطق الأزرار والإجراءات**

   * افحص: `button / CTA / chip / tab / row action / bulk action / filter / search / sort / pagination`.
   * لكل إجراء حدد: handler، target، disabled reason، loading، success/error، owner، API-later.
   * ممنوع زر شكلي أو إجراء approve/publish/delete/hide/rollback بلا boundary.

8. **إغلاق Search / Filter / Sort / Pagination Logic**

   * حدد source، state، query، result، empty result، reset، debounce، pagination/cursor.
   * صنّف: client-side مؤقت، server-side لاحق، أو blocked.
   * ممنوع search/filter/sort يغيّر الشكل فقط بلا نتيجة فعلية.

9. **إغلاق State Machine**

   * لكل شاشة أو flow حدد الحالات:

     ```text
     idle / loading / empty / ready / dirty / invalid / submitting / success / error / blocked / disabled / offline / stale / partial
     ```

   * حدد: من يبدأ الحالة، من يغيرها، ما النتيجة المرئية، وما الحالة التالية.
   * ممنوع حالة ضمنية غير مرئية أو غير قابلة للتحقق.

10. **إغلاق Flow Logic**

    * لكل رحلة حدد:

      ```text
      start → entry → action → intermediate state → result → end / failure / cancel
      ```

    * اربط كل flow بزر أو route أو tab أو drawer أو sheet واضح.
    * ممنوع flow يبدأ بزر وينتهي بلا نتيجة واضحة.

11. **إغلاق ViewModel / Adapter Logic**

    * افصل البيانات الخام عن الشاشة.
    * حدد: source data، adapter، view model، status mapping، badges، labels، mediaKey resolver، fallback values.
    * ممنوع mapping أو formatting أو حسابات domain داخل JSX.

12. **إغلاق Data Ownership**

    * حدد هل البيانات: مركزية، محلية مؤقتة، mock/demo، runtime لاحق، أو blocked.
    * لا تقبل أي data owner غامض.
    * كل list/card/table/detail يجب أن يستخدم summary مناسبًا لا full object بلا حاجة.

13. **إغلاق Media Ownership**

    * حدد مصدر كل صورة أو ميديا أو fixture أو mediaKey.
    * لمسارات DSH التجريبية استخدم فقط:

      ```text
      dsh/frontend/data
      dsh/frontend/media-fixtures
      ```

   * أي ذكر لـ `dsh/media-fixtures` يصنف `LEGACY_PATH_REFERENCE`.
   * ممنوع media path محلي داخل screen/topic إذا كان يمثل DSH demo/preview truth.

14. **إغلاق On-Demand Retrieval**

    * طبّق: summary-first، detail-on-open، IDs/references، mediaKey، pagination، lazy sections.
    * ممنوع eager loading أو full payload داخل list.
    * أي تضخيم payload يصنف `PAYLOAD_INFLATION_RISK`.

15. **إغلاق Domain Logic**

    * لكل Target حدد منطق المجال الخاص به.
    * مثال الكتالوج:

      ```text
      product identity / SKU / GTIN / barcode / category / media ownership / approval / listing / visibility / conflict / partner override / field evidence / marketing handoff / client summary
      ```

    * مثال التسويق:

      ```text
      campaign lifecycle / banners / promotions / visibility gates / media review / publish / rollback / audit preview
      ```

    * مثال Platform/Vars:

      ```text
      scope / precedence / provider policy / feature flags / rollout / audit preview / rollback preview / UI-only vs API-later
      ```

16. **إغلاق الصلاحيات والظهور**

    * حدد: من يرى؟ من يعدل؟ من يوافق؟ من ينشر؟ من يعطل؟
    * صنّف: permission، role، visibility، scope، surface boundary.
    * ممنوع إجراء سيادي بلا permission boundary أو disabled reason واضح.

17. **إغلاق Vars / Feature Flags / Policy Logic**

    * حدد كل policy أو flag أو configurable behavior مؤثر في الواجهة.
    * صنّف: UI preview فقط، API/runtime لاحق، أو blocked.
    * ممنوع hardcoded policy إذا يجب أن يكون مركزيًا أو قابلًا للتكوين لاحقًا.

18. **إغلاق Validation Rules**

    * لكل form/action حدد:

      ```text
      required fields / format rules / range / duplicate / conflict / disabled reason / error / success
      ```

    * أمثلة: SKU required، GTIN format، barcode uniqueness، campaign date range، discount range، media type validation.
    * ممنوع submit أو approve أو publish بلا validation واضحة.

19. **إغلاق Conflict Resolution**

    * افحص التعارضات:

      ```text
      duplicate product / category conflict / media conflict / partner override / vars precedence / publish vs hidden / approval vs rejection
      ```

    * لكل تعارض حدد: detect، display، owner، resolution action، audit/API-later.
    * ممنوع تعارض ظاهر بلا مسار حل أو تصنيف blocked.

20. **إغلاق Calculations / KPIs**

    * أي رقم ظاهر يجب أن يملك:

      ```text
      source / calculation / adapter / format / fallback / staleness / API-later
      ```

    * صنّف KPI المؤقت بوضوح إذا كان preview فقط.
    * ممنوع KPI أو percentage أو badge بلا source/formula.

21. **إغلاق Status / Badge / Label Mapping**

    * حدد كل status ظاهر ومصدره ومعناه.
    * اربط badge/label/color/priority بadapter أو model واضح.
    * ممنوع status نصي أو لوني بلا mapping أو fallback.

22. **إغلاق Navigation / Routing**

    * افحص: route، registry، tab active state، breadcrumb، back behavior، selected item، query params، drawer/sheet open-close.
    * حدد نتيجة كل انتقال: route، tab state، drawer detail، split pane، أو blocked.
    * ممنوع tab يغير الشكل فقط أو drawer بلا selected item.

23. **إغلاق Drawers / Sheets / Details**

    * لكل drawer/sheet/detail حدد: trigger، selected item، open، close، save/cancel، result، empty/error.
    * لا يحمل drawer/source truth مستقلًا عن owner.
    * ممنوع تحميل detail الثقيل قبل فتحه إذا يمكن detail-on-open.

24. **إغلاق Mutations كحدود لا Backend**

    * صنّف كل mutation:

      ```text
      create / update / approve / reject / publish / hide / disable / rollback / assign / refund / merge / delete
      ```

    * لا backend/API/DB بدون موافقة.
    * لكل mutation حدد: safe UI-only action، future API action، forbidden now، owner.

25. **إغلاق Runtime / API Boundary**

    * صنّف كل اعتماد خارجي: `UI_ONLY / API_LATER / RUNTIME_LATER / FORBIDDEN_NOW / BLOCKED_WITH_REASON`.
    * ممنوع DB أو OpenAPI أو backend mutation أو provider switching أو env binding داخل UI/UX Flow بلا طلب صريح.
    * لا تدّعِ runtime readiness إذا كان الرابط مستقبليًا.

26. **إغلاق Audit / History / Rollback Preview**

    * لكل action مهم حدد:

      ```text
      audit؟ history؟ rollback؟ reason/comment؟ before/after preview؟ UI-only؟ API-later؟
      ```

    * مهم خصوصًا في: publish، approval، visibility، vars، finance، refund، provider policy.
    * ممنوع action سيادي بلا أثر audit أو تصنيف لاحق واضح.

27. **إغلاق Handoff / Downstream Effects**

    * حدد ما ينتقل إلى أسطح أو أقسام أخرى بعد كل action.
    * أمثلة: catalog → marketing، partner → operations، vars → visibility، finance → WLT، support → escalation.
    * ممنوع action يغيّر حالة مشتركة بلا تحديد المستهلكين.

28. **إغلاق Notifications / Communication Boundary**

    * صنّف أي تنبيه أو رسالة أو إشعار مطلوب: UI-only، notification later، email/SMS later، أو blocked.
    * لا تضف إرسالًا حقيقيًا بلا runtime/API موافق عليه.
    * ممنوع success message يدّعي إرسالًا فعليًا إذا كان preview فقط.

29. **إغلاق Error Handling**

    * غطِّ:

      ```text
      network / validation / permission / not found / conflict / stale data / blocked action / partial failure / retry / timeout / offline
      ```

    * حدد الرسالة، recovery، retry، fallback، ومتى يبقى المستخدم في نفس flow.
    * ممنوع catch صامت أو success بلا نتيجة.

30. **إغلاق Empty / Loading / Error / Blocked / Disabled / Success**

    * لكل شاشة/جدول/قائمة/drawer حدد:

      ```text
      loading / empty / error / blocked / disabled / success / retry / guidance
      ```

    * اربط الحالات بـ requiredStates إن وجدت.
    * ممنوع جدول فارغ بلا empty state أو button disabled بلا سبب.

31. **إغلاق RTL / LTR / Language Logic**

    * العربية RTL، والأرقام وSKU وGTIN وbarcode والأكواد التقنية LTR عند الحاجة.
    * افحص: icon/text cluster، chevron/action position، alignment، table cells، forms، mixed direction.
    * ممنوع تخطيط عربي مكسور أو اتجاه مفروض بشكل أعمى.

32. **إغلاق Performance Logic**

    * افحص: lists/tables، renderItem، search/filter/sort، pagination، images/media، drawers/modals، charts/maps/editors، heavy imports.
    * صنّف: measured، risk mitigated، numbers unproven، أو blocked.
    * ممنوع list كبيرة بلا virtualization/pagination أو صور full-size داخل rows.

33. **إغلاق Bundle / Heavy Import Boundary**

    * حدد أي import ثقيل أو dependency أو chart/map/editor/modal يجب أن يكون lazy/on-demand.
    * لا تضف dependency أو lockfile change بلا blocker مثبت.
    * ممنوع تحميل heavy component داخل shell الأولي بلا سبب.

34. **إغلاق UI-kit / Design-System Boundary**

    * طبّق:

      ```text
      Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only
      ```

    * توجب الالتزام بنظام الألوان المركزي.
    * تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
    * ممنوع local design system أو direct Tamagui import خارج ui-kit.

35. **إغلاق Design Preservation Baseline**

    * قبل Design Closure، حدد ما يجب الحفاظ عليه: layout، hierarchy، spacing، className/style wiring، RTL/LTR، visible text.
    * لا تغيّر التصميم أثناء إغلاق المنطق إلا لعلاج عيب مثبت.
    * أي visual change يحتاج screenshot evidence أو يصنف `NEEDS_VISUAL_EVIDENCE`.

36. **إغلاق Security / Privacy / Secrets**

    * افحص: secrets، tokens، env leakage، unsafe logs، private IDs، admin actions، sensitive mock data.
    * شغّل أو صنّف:

      ```text
      guard:secret-scan
      ```

    * ممنوع log أو fixture يسرّب بيانات حساسة.

37. **إغلاق Observability / Telemetry لاحقًا**

    * صنّف actions التي تحتاج لاحقًا:

      ```text
      analytics / audit log / event / trace / metric / alert
      ```

    * خصوصًا: approval، publish، rollback، finance، support escalation، vars change.
    * لا تضف telemetry runtime بلا طلب صريح؛ صنّفها فقط إذا كانت خارج النطاق.

38. **إغلاق Tests / Guards Readiness**

    * حدد ما يلزم:

      ```text
      typecheck / lint / guard / unit test / component test / registry check / data-media consistency / visual check / performance check
      ```

    * اربط كل تحقق بالملفات أو المنطق الذي يغلقه.
    * لا يكفي قول “تم”.

39. **إغلاق Evidence / Rollback Readiness**

    * حدد evidence المطلوب: git status، diff check، typecheck، screenshots، performance notes، guard output.
    * إذا يوجد تطبيق تغييرات، حدد rollback أو patch handoff.
    * انتبه إلى untracked files لأنها لا تظهر داخل `git diff` العادي.

40. **إغلاق Technical Debt داخل النطاق**

    * افحص:

      ```text
      TODO / FIXME / dead branch / unused code / orphan file / stale adapter / duplicated helper / fake abstraction / temp file
      ```

    * القرار: fix now، retire، block with reason، defer with owner.
    * ممنوع ترك technical debt مؤثر بلا تصنيف.

41. **إنتاج Technical / Logic Gap Matrix**

    * أضف Matrix مستقلة بأعمدة:

      ```text
      ID
      technical/logic area
      file/path
      visible symptom
      missing logic
      current behavior
      required behavior
      owner
      UI-only now?
      API/runtime later?
      safe to implement now?
      linked surfaces
      state impact
      data impact
      verification
      priority
      decision
      ```

    * أي gap بلا قرار يبقى `BLOCKED_WITH_REASON`.
    * ممنوع دمج هذه المصفوفة داخل تقرير عام غير قابل للتنفيذ.

42. **اختيار Task 1 بعد هذه المرحلة**

    * الأولوية:

      ```text
      governance/guard/agent blocker
      → structural hygiene blocker
      → missing technical logic blocker
      → missing action/state/flow blocker
      → data/media truth blocker
      → runtime/API boundary blocker
      → performance blocker
      → design closure
      ```

    * Task 1 يجب أن يغلق أكبر نقص آمن قابل للتنفيذ الآن.
    * ممنوع أن تكون Task 1 مجرد تشخيص أو تقرير.

43. **إنتاج Task Execution Package**

    * لكل Task حدد: goal، files to edit، exact changes، forbidden changes، acceptance criteria، verification، rollback.
    * إذا لا توجد صلاحية تعديل، قدم patch أو PowerShell apply script أو Copilot command دقيق.
    * ممنوع تنفيذ task خارج النطاق أو الانتقال إلى Task 2 تلقائيًا.

44. **Technical / Logic Closure Gate**

    * لا READY إذا بقي:

      ```text
      زر بلا handler
      action بلا result
      tab بلا state
      flow بلا end
      KPI بلا source
      status بلا mapping
      adapter ناقص
      data/media owner ناقص
      validation ناقصة
      permission boundary ناقص
      conflict resolution ناقص
      runtime/API dependency غير مصنف
      static UI يدعي وظيفة
      performance risk غير مصنف
      visual change بلا evidence
      ```

45. **Re-Diagnosis بعد Task 1**

    * أعد فحص المستهدف بعد Task 1.
    * تأكد أن gap أُغلق ولم يظهر gap جديد.
    * لا تنتقل إلى التصميم أو Task 2 قبل إعادة التشخيص.

46. **بوابة الانتقال إلى Design Closure**

    * لا تنتقل إلى Design Closure إلا إذا أُغلق أو صُنّف كل منطق ووظيفة وتدفق وبيانات وميديا وأداء وحدود runtime.
    * إذا بقي عنصر غير مثبت، القرار `BLOCKED_WITH_REASON` أو `NEEDS_EVIDENCE`.
    * التصميم يأتي بعد المنطق، وليس بديلًا عنه.

## موضعها داخل الحزمة

```text
Structural Hygiene
→ Target Scope / Ownership Confirmation
→ Registry / Route / Required States
→ Technical / Logic Gap Discovery
→ Technical / Logic Gap Matrix
→ Technical / Logic Gap Closure
→ UX / Flow Gap Closure
→ Data / Media Ownership Closure
→ On-Demand Retrieval Closure
→ Runtime / API Boundary
→ Performance Closure
→ UI-kit / Design-System Boundary
→ Design Preservation Baseline
→ Verification / Evidence Readiness
→ Task 1
→ Re-Diagnosis
→ Human Approval
→ Design Closure
```

## الخلاصة المختصرة

```text
لا تنتقل للتصميم قبل إغلاق المنطق.
لا تقبل واجهة جميلة بلا handlers/states/results/sources/boundaries.
لا تقبل Target بلا owner/source/registry/linked surfaces.
لا تقبل data/media محلية متضاربة أو payload متضخم.
لا تقبل action بلا permission/validation/audit/error/result.
لا تقبل performance risk أو visual change بلا evidence.
كل زر، تبويب، KPI، flow، status، mutation، permission، validation، conflict، adapter، data load، media source، route، drawer، performance risk يجب أن يكون مصنفًا ومغلقًا أو BLOCKED_WITH_REASON.
```
