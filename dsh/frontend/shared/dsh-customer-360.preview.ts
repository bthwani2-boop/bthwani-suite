import type { DshControlPanelSectionId } from './dsh-governance.map';
import type { DshOnDemandPolicy } from './dsh-flow-registry';
import type { DshGlobalControlLink } from './dsh-assisted-order.preview';

export type DshCustomer360VerificationStatus = 'verified' | 'required' | 'blocked';

export type DshCustomer360Record = {
  readonly customerId: string;
  readonly customerName: string;
  readonly maskedPhone: string;
  readonly cityLabel: string;
  readonly verificationStatus: DshCustomer360VerificationStatus;
  readonly activeOrderId?: string;
  readonly openTicketId?: string;
  readonly latestIssueSummary: string;
  readonly wltVisibilitySummary: string;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly quickActions: readonly DshGlobalControlLink[];
};

export const DSH_CUSTOMER_360_PREVIEW: readonly DshCustomer360Record[] = [
  {
    customerId: 'cus-9021',
    customerName: 'لمى ناصر',
    maskedPhone: '05*******18',
    cityLabel: 'الرياض',
    verificationStatus: 'verified',
    activeOrderId: 'ORD-1102',
    openTicketId: 'TKT-1102',
    latestIssueSummary: 'بديل منتج بانتظار تثبيت نهائي قبل إرسال الطلب.',
    wltVisibilitySummary: 'المدفوعات والاستردادات تظهر هنا كمرجع WLT للقراءة فقط.',
    allowedActions: ['فتح Assisted Order', 'فتح Order Rescue', 'فتح التذكرة أو الطلب أو WLT reference'],
    forbiddenActions: ['بدء refund من Customer 360', 'إظهار PII غير المتحقق منها', 'إغلاق ticket خارج owner support'],
    onDemandPolicy: 'detail-on-open',
    quickActions: [
      {
        label: 'Assisted Order Desk',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=assisted-order-desk&customerId=cus-9021',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'Order Rescue',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=order-rescue&orderId=ORD-1102',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
        onDemandPolicy: 'finance-preview-only',
      },
    ],
  },
  {
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    maskedPhone: '05*******44',
    cityLabel: 'جدة',
    verificationStatus: 'required',
    activeOrderId: 'ORD-1184',
    latestIssueSummary: 'مكالمة خارجية لإنشاء طلب مساعد مع حساسية بيانات مرتفعة.',
    wltVisibilitySummary: 'لا تظهر أي تفاصيل مالية حساسة قبل التحقق. WLT يبقى مرجعًا منفصلًا.',
    allowedActions: ['بدء Call Intake', 'فتح ticket support', 'ربط العميل بطلبه النشط'],
    forbiddenActions: ['إظهار العنوان الكامل قبل التحقق', 'تجاوز source = external_phone_manual', 'بدء money mutation'],
    onDemandPolicy: 'detail-on-open',
    quickActions: [
      {
        label: 'Manual Call Intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&customerId=cus-4188',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'Active order',
        surfaceId: 'app-client',
        sectionId: 'support',
        routeHint: '/app-client/orders?orderId=ORD-1184',
        onDemandPolicy: 'summary-only',
      },
    ],
  },
] as const;

export function getDshCustomer360Record(customerId: string): DshCustomer360Record | undefined {
  return DSH_CUSTOMER_360_PREVIEW.find((entry) => entry.customerId === customerId);
}

export function getDshCustomer360SectionOwnerLabel(sectionId: DshControlPanelSectionId): string {
  if (sectionId === 'operations') {
    return 'Operations';
  }

  if (sectionId === 'finance') {
    return 'WLT visibility';
  }

  return 'Support';
}
