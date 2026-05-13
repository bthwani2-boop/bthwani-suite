# VS Code Copilot Prompt — MySpaceScreen Consolidation

نفّذ هذا الطلب تنفيذًا كاملًا داخل `C:\bthwani-suite` وبنطاق ضيق جدًا.

## الهدف
انقل محتوى الملفين التاليين إلى ملف الشاشة الرئيسي:
- `dsh/frontend/app-client/parts/MySpaceCommercialScreen.tsx`
- `dsh/frontend/app-client/parts/MySpaceOrdersScreen.tsx`

إلى:
- `dsh/frontend/app-client/screens/MySpaceScreen.tsx`

ثم احذف الملفين من `parts` فقط إذا ثبت أنه لا توجد أي references خارج `MySpaceScreen.tsx`.

## قبل التعديل
- افحص الملفات الثلاثة فقط.
- افحص أي imports/exports/barrels تشير إلى:
  - `DshMySpaceCommercialScreen`
  - `DshMySpaceOrdersScreen`
  - `MySpaceCommercialScreen`
  - `MySpaceOrdersScreen`
- لا تبدأ الحذف قبل إثبات عدم وجود مستهلكين خارجيين.

## التنفيذ
- اجعل `MySpaceScreen.tsx` يملك محتوى العروض/الاشتراكات ومحتوى الطلبات داخله كمكوّنات private داخل نفس الملف.
- احذف imports من:
  - `../parts/MySpaceCommercialScreen`
  - `../parts/MySpaceOrdersScreen`
- انقل imports اللازمة من `@bthwani/ui-kit` و`../data/*` إلى `MySpaceScreen.tsx`.
- حافظ على `DshOperationScreen` كما هو من `../parts/OperationScreen`.
- لا تستخدم Tamagui مباشرة خارج `@bthwani/ui-kit`.
- لا تنشئ design system محلي.
- لا تغيّر runtime/API/backend/dependencies/lockfiles/config.
- لا تعيد تصميم الشاشة بالكامل؛ فقط حافظ على المحتوى الموجود ورتّبه داخل الشاشة الرئيسية.
- صحّح RTL إذا ظهر خطأ واضح داخل الصفوف: الأيقونة والنص في كتلة يمين صحيحة، والسهم/الإجراء في الطرف المقابل، والنص العربي بمحاذاة صحيحة.
- حافظ على هوية BThwani: deepBlue `#0A2F5C`، orange `#FF500D`، white `#FFFFFF` عبر ui-kit/tokens فقط، بدون ألوان عشوائية.

## الحذف
- احذف:
  - `dsh/frontend/app-client/parts/MySpaceCommercialScreen.tsx`
  - `dsh/frontend/app-client/parts/MySpaceOrdersScreen.tsx`
- فقط إذا لم توجد references خارج `MySpaceScreen.tsx`.
- إذا وجدت references في barrel/index أو ملفات أخرى، حدّثها بشكل محدود أو توقف واذكر BLOCKED.

## التحقق
شغّل أو اطلب تشغيل:
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

## التقرير المختصر
أعد فقط:
- changed files
- هل تم حذف الملفين أم لا ولماذا
- نتيجة diff check
- نتيجة tsc
- هل يلزم screenshot بعد التنفيذ
