import type { DshGlobalControlLink } from './dsh-assisted-order.preview';
import type { DshOnDemandPolicy } from './dsh-flow-registry';

export type DshOrderRescueSeverity = 'warning' | 'danger';

export type DshOrderRescueCase = {
  readonly rescueId: string;
  readonly orderId: string;
  readonly customerName: string;
  readonly issueKind: 'payment_failure' | 'partner_stall' | 'captain_drop' | 'wlt_visibility';
  readonly severity: DshOrderRescueSeverity;
  readonly blocker: string;
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly nextBestAction: string;
  readonly onDemandPolicy: DshOnDemandPolicy;
  readonly wltBoundary: string;
  readonly crossSurfaceLinks: readonly DshGlobalControlLink[];
};

export const DSH_ORDER_RESCUE_PREVIEW: readonly DshOrderRescueCase[] = [
  {
    rescueId: 'rescue-1102',
    orderId: 'ORD-1102',
    customerName: 'لمى ناصر',
    issueKind: 'partner_stall',
    severity: 'danger',
    blocker: 'الشريك أكد الجاهزية جزئيًا لكن البديل لم يثبت بعد، ما يهدد SLA والرضا.',
    allowedActions: ['فتح Assisted Order', 'فتح التذكرة', 'تحويل الحالة إلى دعم أو شريك حسب القرار'],
    forbiddenActions: ['إغلاق الحالة قبل تثبيت البديل', 'فتح refund محلي', 'مضاعفة نفس التدخل على أكثر من سطح'],
    nextBestAction: 'ثبّت البديل أو أوقف التنفيذ ثم سلّم الحالة للمالك المناسب خلال نفس المسار.',
    onDemandPolicy: 'detail-on-open',
    wltBoundary: 'إذا انتهت الحالة إلى استرداد فالرؤية فقط داخل DSH والتنفيذ في WLT.',
    crossSurfaceLinks: [
      {
        label: 'Support ticket',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=queue&ticketId=TKT-1102',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'Partner controls',
        surfaceId: 'control-panel',
        sectionId: 'partners',
        routeHint: '/partners?tab=performance&orderId=ORD-1102',
        onDemandPolicy: 'detail-on-open',
      },
    ],
  },
  {
    rescueId: 'rescue-1184',
    orderId: 'ORD-1184',
    customerName: 'محمد العبدلي',
    issueKind: 'payment_failure',
    severity: 'warning',
    blocker: 'فشل الدفع ظهر للعميل بينما المكالمة اليدوية تحاول إنقاذ الطلب دون تجاوز WLT.',
    allowedActions: ['فتح Call Intake', 'فتح Customer 360', 'عرض WLT visibility فقط'],
    forbiddenActions: ['إعادة تحصيل محلية', 'تعديل قرار الدفع', 'إظهار ledger من داخل Rescue'],
    nextBestAction: 'أكمل التحقق ثم افتح الرؤية المالية كمرجع فقط قبل إعادة المحاولة من القناة الصحيحة.',
    onDemandPolicy: 'detail-on-open',
    wltBoundary: 'WLT يملك قرار الدفع والاسترداد بالكامل؛ Rescue يكتفي بتجميع السياق وتوجيه القرار.',
    crossSurfaceLinks: [
      {
        label: 'Manual Call Intake',
        surfaceId: 'control-panel',
        sectionId: 'support',
        routeHint: '/support?workspace=call-intake&orderId=ORD-1184',
        onDemandPolicy: 'detail-on-open',
      },
      {
        label: 'WLT visibility',
        surfaceId: 'wlt-finance',
        sectionId: 'finance',
        routeHint: '/finance?workspace=refunds&orderId=ORD-1184',
        onDemandPolicy: 'finance-preview-only',
      },
    ],
  },
] as const;

export function getDshOrderRescueCase(rescueId: string): DshOrderRescueCase | undefined {
  return DSH_ORDER_RESCUE_PREVIEW.find((entry) => entry.rescueId === rescueId);
}
