import type { DshGlobalControlLink } from './dsh-assisted-order.preview';
import type { DshOnDemandPolicy } from './dsh-flow-registry';

export type DshCallIntakeVerificationStep = {
  readonly stepId: string;
  readonly label: string;
  readonly completed: boolean;
};

export type DshCallIntakePreview = {
  readonly intakeId: string;
  readonly source: 'external_phone_manual';
  readonly customerId: string;
  readonly customerName: string;
  readonly maskedPhone: string;
  readonly verificationSteps: readonly DshCallIntakeVerificationStep[];
  readonly sensitiveFieldsLocked: readonly string[];
  readonly orderContext?: string;
  readonly issueSummary: string;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly nextAction: string;
  readonly quickActions: readonly DshGlobalControlLink[];
};

export const DSH_CALL_INTAKE_PREVIEW: readonly DshCallIntakePreview[] = [
  {
    intakeId: 'call-9021',
    source: 'external_phone_manual',
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    maskedPhone: '05*******44',
    verificationSteps: [
      { stepId: 'otp-last-order', label: 'تأكيد آخر طلب أو OTP مختصر', completed: true },
      { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: true },
      { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: false },
    ],
    sensitiveFieldsLocked: ['العنوان الكامل', 'عرض WLT المالي', 'أوامر الاسترداد'],
    orderContext: 'ORD-1184',
    issueSummary: 'العميل يريد إعادة الطلب عبر الهاتف بعد تعثر التطبيق.',
    allowedActions: ['تسجيل المكالمة', 'تثبيت المصدر اليدوي', 'فتح Customer 360 أو Assisted Order بعد التحقق'],
    forbiddenActions: ['تغيير source', 'إظهار الحقول الحساسة قبل التحقق', 'بدء refund أو settlement'],
    onDemandPolicy: 'detail-on-open',
    nextAction: 'أكمل خطوة فتح الحقول الحساسة أو حوّل الحالة إلى Customer 360 للمراجعة.',
    quickActions: [
      {
        label: 'Customer 360',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&customerId=cus-4188',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'Assisted Order Desk',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-4188',
        onDemandPolicy: 'detail-on-open',
      },
    ],
  },
  {
    intakeId: 'call-4410',
    source: 'external_phone_manual',
    customerId: 'cus-9910',
    customerName: 'سارة الحربي',
    maskedPhone: '05*******92',
    verificationSteps: [
      { stepId: 'otp-last-order', label: 'تأكيد آخر طلب أو OTP مختصر', completed: false },
      { stepId: 'match-phone', label: 'مطابقة الهاتف المسجل', completed: false },
      { stepId: 'unlock-sensitive', label: 'فتح الحقول الحساسة بعد التحقق', completed: false },
    ],
    sensitiveFieldsLocked: ['العنوان الكامل', 'طريقة الدفع', 'رؤية WLT'],
    issueSummary: 'المتصل يريد معرفة حالة استرداد سابقة بدون تحقق مكتمل.',
    allowedActions: ['طلب تحقق إضافي', 'فتح Ticket support', 'تثبيت الحجب المؤقت للحقول الحساسة'],
    forbiddenActions: ['إظهار قرار الاسترداد', 'بدء assisted order', 'مشاركة بيانات الطلب السابقة بلا تحقق'],
    onDemandPolicy: 'detail-on-open',
    nextAction: 'ابقِ الحقول الحساسة محجوبة واطلب خطوة تحقق إضافية قبل أي كشف أو handoff.',
    quickActions: [
      {
        label: 'Support ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-4410',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&customerId=cus-9910',
        onDemandPolicy: 'finance-preview-only',
      },
    ],
  },
] as const;

export function getDshCallIntakePreview(intakeId: string): DshCallIntakePreview | undefined {
  return DSH_CALL_INTAKE_PREVIEW.find((entry) => entry.intakeId === intakeId);
}
