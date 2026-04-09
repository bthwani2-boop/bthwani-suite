import type {
  DshFieldStoreVisitLogErrors,
  DshFieldStoreVisitLogValues,
  DshFieldVisitEvidenceItem,
} from '../../visit-log/screens/DshFieldStoreVisitLogScreen';

export const dshFieldStoreVisitLogFixtureValues: DshFieldStoreVisitLogValues = {
  visitSummary: 'تمت مراجعة الواجهة وشرح خطوات التفعيل الأولية لطاقم المتجر.',
  followUpAction: 'الانتقال إلى التحقق النهائي من الجاهزية بعد مزامنة التسعير.',
};

export const dshFieldStoreVisitLogFixtureErrors: DshFieldStoreVisitLogErrors = {};

export const dshFieldStoreVisitLogFixtureEvidence: DshFieldVisitEvidenceItem[] = [
  {
    id: 'storefront-photo',
    title: 'صورة الواجهة',
    subtitle: 'تم التقاط صورة للواجهة من نقطة دخول العملاء الرئيسية.',
    statusLabel: 'مرفق',
    capturedAtLabel: '10:14 ص',
  },
  {
    id: 'owner-brief-note',
    title: 'ملاحظة المالك',
    subtitle: 'تم توثيق جاهزية ساعات العمل والطاقم لأول تشغيل.',
    statusLabel: 'موثق',
    capturedAtLabel: '10:19 ص',
  },
];