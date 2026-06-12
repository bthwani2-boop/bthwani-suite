# BThwani DSH/WLT Journeys — Master Protocol & Execution Contract
# دليل العمل الشامل والاتفاقيات الحاكمة لتشطيب وإغلاق الشرائح والرحلات

> **مسار الملف الحاكم (Canonical Path):** `dsh/docs/JOURNIES/JOURNIES_MASTER_PROTOCOL_AND_CONTRACT.md`
> **حالة الملف:** نشط (ACTIVE) - وثيقة القواعد والبروتوكول العام.

---

## 1. Introduction & Execution Model / المنهجية العامة ونظام العمل

المشروع يتبع منهجية **المنظومة الشجرية الحلقية المغلقة بالدليل (Evidence-Gated Closed-Loop Tree Execution Model)**.

### المبدأ الأعلى للعمل:
لا تعتبر أي شريحة أو رحلة جاهزة أو مغلقة بمجرد وضع خطة عمل أو كتابة كود شاشة تعمل بصرياً. الإغلاق الحقيقي والكامل يعني أن الشريحة تعمل على **بيئة تشغيل حية (Runtime)** مثبتة بالأدلة العملية:
1. **Git status / diff**: التأكد من خلو بيئة العمل من التشتت أو التعارضات.
2. **Typecheck & Tests**: نجاح التجميع (`tsc --noEmit`) واختبارات Go/TypeScript.
3. **Logs**: سجلات الخادم وقواعد البيانات وMinIO.
4. **WLT Boundary**: الالتزام بعدم حدوث أي عمليات مالية أو تعديلات على الأرصدة خارج نظام WLT.
5. **Screenshots & Records**: التقاط أدلة مرئية عند حدوث أي تعديل واجهة.

---

## 2. Start Here & Sequence / دليل البدء والخطوات المتسلسلة لتنفيذ الرحلات

التنظيم العام يعتمد على **15 رحلة تفصيلية** تحتوي على **84 شريحة**.

### تسلسل التشغيل والبدء:
1. المجلد الرئيسي للعمل: `dsh/docs/JOURNIES/`
2. مجلدات الرحلات الفرعية تتبع التسمية: `journies-###-slug/` (تُستخدم للقراءة والتحليل فقط).
3. خطوات البدء بالرحلة:
   - افتح وقرأ دليل الرحلة المالي والتقني: `00-journey-overview.md`.
   - راجع قائمة المحتويات في الرحلة: `01-journey-inventory.md`.
   - نفّذ ملفات الشرائح `*.sliceN.md` بالترتيب التسلسلي من شريحة 1 حتى النهاية.
   - لا تنتقل من رحلة إلى الرحلة التي تليها قبل أن تكون حالة الرحلة الحالية إما `PASS` بأدلة حقيقية أو `BLOCKED_WITH_REASON` موثقة.

---

## 3. Evidence & Runtime Protocol / بروتوكول جمع الأدلة وتجهيز البيئة المحلية

### مسار حفظ الأدلة (Evidence Root):
```text
C:\bthwani-suite\tools\registry\runs\{SESSION_ID}
```

### بنية مجلد الأدلة المطلوبة لكل شريحة أو جلسة:
```text
01-context.txt
02-implementation.txt
03-verification.txt
04-final-decision.txt
screenshots/
runtime/
{SESSION_ID}.zip
```
*يمنع استخدام اللاحقة `_HANDOFF.zip` ويجب ضغط المجلد بالكامل في جذر الأدلة بالاسم المطابق لـ `SESSION_ID`.*

### إرشادات تشغيل البيئة المحلية:
1. **قاعدة البيانات والـ API لـ DSH**:
   ```powershell
   Set-Location -LiteralPath "C:\bthwani-suite\dsh\backend"
   docker compose -f .\docker-compose.local.yml up -d
   $env:PORT = "8080"
   $env:DATABASE_URL = "postgres://dsh_local:dsh_local_password@localhost:55432/dsh_local?sslmode=disable"
   go run ./cmd/dsh-api
   ```
2. **المنافذ المعتمدة للتطبيقات**:
   - تطبيق العميل (`app-client`): `8081`
   - تطبيق الشريك (`app-partner`): `8082`
   - تطبيق الكابتن (`app-captain`): `8083`
   - تطبيق العمل الميداني (`app-field`): `8084`
3. **لوحة التحكم (`control-panel`)**:
   ```powershell
   Set-Location -LiteralPath "C:\bthwani-suite"
   $env:NEXT_PUBLIC_DSH_API_BASE_URL = "http://localhost:8080"
   pnpm --dir control-panel/runtime dev --port 3000
   ```

### الحد الأدنى من أدوات التحقق بعد تعديل الكود:
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```
وإذا تم لمس Go Backend:
```powershell
Set-Location -LiteralPath "C:\bthwani-suite\dsh\backend"
go test ./...
```

---

## 4. Local Agent Execution Contract / عقد واتفاقية تشغيل وكلاء الذكاء الاصطناعي

يجب التزام أي وكيل (Agent) بالقواعد التالية أثناء العمل على الريبو `C:\bthwani-suite`:

### 1) الإجراءات المسموحة (Allowed):
- تعديل فقط الملفات المطلوبة مباشرة لإغلاق الشريحة الحالية.
- إضافة الكود المفقود، حالات الواجهات (UI States)، اختبارات OpenAPI/API، أو تعاريف الـ Database/Next/Expo middleware عند الحاجة في نطاق الشريحة.
- تنظيف التكرارات والكود الميت فقط بعد التأكد من عدم وجود استهلاك حي لها.

### 2) الإجراءات الممنوعة (Forbidden):
- يمنع منعاً باتاً كتابة أو تعديل أي شيء على GitHub (عمليات PR, Merge, Push, Commit).
- يمنع تعديل ملفات التبعيات والـ package managers (`package.json`, lockfiles) بدون سبب قاطع وموافقة بشرية صريحة.
- يمنع كتابة أي منطق مالي أو Mutation للأرصدة والمحافظ داخل DSH (نظام WLT هو المالك المالي الوحيد).
- يمنع وضع ألوان أو تصميم محلي عشوائي داخل التطبيقات (يجب الالتزام بـ `@bthwani/ui-kit` فقط).
- يمنع كتابة قرارات `PASS` أو `CLOSED` أو `100%` وهمية بدون وجود أدلة مسجلة في مجلد الأدلة.

---

## 5. Human Slice Template / القالب العام لبناء الشرائح الجديدة

في حال رغبة المطور البشري أو الوكلاء بإدراج شريحة جديدة للعمل، يتم صياغتها بالهيكل التالي:

```markdown
# DSH-SLICE-XXX — [عنوان الشريحة]

## 1) Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-XXX` |
| Parent Journey | `J-XXX` |
| Business Outcome | [المخرج التشغيلي القابل للقياس] |
| Primary Actor | [client/partner/captain/field/operator/WLT/developer] |
| Control Panel Owner | [none/operations/finance/platform/catalog] |
| WLT Boundary | [none/read-only/full owner/needs contract] |
| Auth Boundary | [public/client/partner/captain/field/operator] |
| API/Runtime Boundary | [endpoint paths or none] |

## 2) Scenario & Steps
1. [البداية من واجهة العميل / الشريك ...]
2. [الأثر المتوقع والتحققات ...]
3. [التسجيل في الـ Audit/Logs ...]

## 3) Coverage Matrix
| Surface | Classification | Screen/Endpoint | Required States | Evidence |
|---|---|---|---|---|
| [اسم السطح] | primary/supporting/dependency | [مسار الملف/الرابط] | loading/success/error/offline | [نوع الإثبات] |

## 4) CTA Matrix
| CTA | Surface | Target | Precondition | Proof |
|---|---|---|---|---|

## 5) Gap Log / مخرجات التحليل والبحث
| ID | Item | Classification | Required Action | Decision |
|---|---|---|---|---|

## 6) Final Closure Decision
| Field | Value |
|---|---|
| Slice Decision | PASS / NEEDS_VISUAL_EVIDENCE / NEEDS_RUNTIME_EVIDENCE |
| Date | YYYY-MM-DD |
| Session ID | [SESSION_ID] |
```

---

## 6. Remote Reference Review / بوابة مراجعة الفرع البعيد

- **الفرع المطلوب للمطابقة وقراءة البيانات:** `fix/docker-local-runtime-standardization`
- **التزام القراءة:** يتم التعامل مع الفرع البعيد كمرجع قراءة وتحليل فقط لمقارنة الفجوات.
- **التنبيه للوكيل:** يرجى الانتباه أن أي تعديلات محلية غير مرفوعة أو uncommitted لن يراها ملف المراجعة ما لم يتم التحقق منها عبر تشغيل فحص Git المحلي قبل تنفيذ الكود.
