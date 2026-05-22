import type { DshControlPanelSectionId } from './dsh-governance.map';
import type { DshOnDemandPolicy, DshSurfaceId } from './dsh-flow-registry';

export type DshGlobalControlLink = {
  readonly label: string;
  readonly surfaceId: DshSurfaceId;
  readonly sectionId: DshControlPanelSectionId;
  readonly routeHint: string;
  readonly onDemandPolicy: DshOnDemandPolicy;
};

export type DshAssistedOrderIdentityStatus = 'verified' | 'pending' | 'blocked';

export type DshAssistedOrderStage =
  | 'identity-check'
  | 'basket-rebuild'
  | 'partner-confirmation'
  | 'wlt-visibility'
  | 'ready-to-submit';

export type DshAssistedOrderPreview = {
  readonly deskId: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly maskedPhone: string;
  readonly source: 'manual_call_intake' | 'customer_360_followup';
  readonly orderId?: string;
  readonly identityStatus: DshAssistedOrderIdentityStatus;
  readonly activeStage: DshAssistedOrderStage;
  readonly basketSummary: string;
  readonly auditFlags: readonly string[];
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly wltBoundary: string;
  readonly nextAction: string;
  readonly crossSurfaceLinks: readonly DshGlobalControlLink[];
};

export const DSH_ASSISTED_ORDER_PREVIEW: readonly DshAssistedOrderPreview[] = [
  {
    deskId: 'assist-ord-1102',
    customerId: 'cus-9021',
    customerName: 'لمى ناصر',
    maskedPhone: '05*******18',
    source: 'manual_call_intake',
    orderId: 'ORD-1102',
    identityStatus: 'verified',
    activeStage: 'partner-confirmation',
    basketSummary: '3 عناصر مع بديل واحد مثبت قبل الإرسال.',
    auditFlags: ['identity-verified', 'call-recorded', 'replacement-confirmed'],
    allowedActions: ['تحديث السلة', 'فتح رؤية WLT', 'تحويل إلى الإنقاذ عند تعثر التنفيذ'],
    forbiddenActions: ['تجاوز التحقق من الهوية', 'بدء استرداد محلي', 'تعديل ledger أو settlement'],
    wltBoundary: 'WLT يظهر للقراءة فقط: الدفع والاسترداد والتسوية خارج Assisted Order.',
    nextAction: 'ثبّت موافقة البديل ثم سلّم الحالة إلى partner confirmation قبل الإرسال النهائي.',
    crossSurfaceLinks: [
      {
        label: 'Customer 360',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&customerId=cus-9021',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1102',
        onDemandPolicy: 'finance-preview-only',
      },
      {
        label: 'Order rescue',
        surfaceId: 'control-panel',
        sectionId: 'operations',
        routeHint: '/operations?workspace=order-rescue&orderId=ORD-1102',
        onDemandPolicy: 'detail-on-open',
      },
    ],
  },
  {
    deskId: 'assist-ord-1184',
    customerId: 'cus-4188',
    customerName: 'محمد العبدلي',
    maskedPhone: '05*******44',
    source: 'customer_360_followup',
    orderId: 'ORD-1184',
    identityStatus: 'pending',
    activeStage: 'identity-check',
    basketSummary: 'إعادة بناء طلب سريع بعد مكالمة متابعة من الدعم.',
    auditFlags: ['identity-check-required', 'sensitive-fields-locked'],
    allowedActions: ['بدء التحقق', 'فتح سجل العميل', 'تجهيز مسودة الطلب فقط'],
    forbiddenActions: ['عرض بيانات حساسة قبل التحقق', 'إرسال الطلب مباشرة', 'تمرير أثر مالي خارج WLT'],
    wltBoundary: 'أي رؤية للمدفوعات أو الاستردادات تبقى من WLT كمرجع فقط.',
    nextAction: 'أكمل التحقق من الهوية أولاً ثم افتح Customer 360 أو Call Intake حسب مصدر الحالة.',
    crossSurfaceLinks: [
      {
        label: 'Manual Call Intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&customerId=cus-4188',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'Customer 360',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=customer-360&customerId=cus-4188',
        onDemandPolicy: 'detail-on-open',
      },
    ],
  },
] as const;

export function getDshAssistedOrderById(deskId: string): DshAssistedOrderPreview | undefined {
  return DSH_ASSISTED_ORDER_PREVIEW.find((entry) => entry.deskId === deskId);
}
