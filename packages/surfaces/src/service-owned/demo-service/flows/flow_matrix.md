# Flow Matrix — demo-service

مثال قالب Flow Matrix لكل flow متعلق بالخدمة.

- Flow ID: `demo.list`
- Title: سرد العناصر (Demo list)
- Role: user
- Start: user opens demo list route `/demo`
- Steps:
  1. طلب بيانات من `GET /demo`
  2. عرض حالة تحميل
  3. عرض النتائج أو حالة فارغة
  4. التعامل مع خطأ الشبكة (retry)
  5. انتهاء
- States:
  - loading
  - empty
  - success
  - error
  - offline
- Actions:
  - retry
  - refresh
  - navigate to detail

Notes:
- ارفق حالات visual لكل state داخل `screens/` مع لقطات شاشة.
