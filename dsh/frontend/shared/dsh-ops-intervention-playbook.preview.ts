import type { DshControlPanelSectionId } from './dsh-governance.map';
import type { DshOnDemandPolicy } from './dsh-flow-registry';

export type DshOpsInterventionPlaybook = {
  readonly playbookId: string;
  readonly title: string;
  readonly severity: 'warning' | 'danger';
  readonly supportedWorkspaces: readonly ('command-center' | 'exceptions-escalations' | 'assisted-order-desk' | 'order-rescue')[];
  readonly triggerFlowIds: readonly string[];
  readonly ownerSection: DshControlPanelSectionId;
  readonly checkpoints: readonly string[];
  readonly allowedActions: readonly string[];
  readonly forbiddenActions: readonly string[];
  readonly nextDecision: string;
  readonly onDemandPolicy: DshOnDemandPolicy;
};

export const DSH_OPS_INTERVENTION_PLAYBOOKS: readonly DshOpsInterventionPlaybook[] = [
  {
    playbookId: 'playbook-assisted-order',
    title: 'Playbook: Assisted Order من مكالمة يدوية',
    severity: 'warning',
    supportedWorkspaces: ['command-center', 'assisted-order-desk'],
    triggerFlowIds: ['manual-call-intake', 'customer-360', 'assisted-order-desk'],
    ownerSection: 'operations',
    checkpoints: ['تحقق الهوية', 'إعادة بناء السلة', 'تثبيت البديل', 'WLT visibility فقط عند الحاجة'],
    allowedActions: ['فتح Assisted Order', 'التحويل إلى Support أو WLT visibility', 'تسجيل audit note'],
    forbiddenActions: ['تجاوز التحقق', 'إنشاء refund محلي', 'إرسال الطلب بدون handoff واضح'],
    nextDecision: 'إذا بقيت الهوية أو البدائل معلقة فحوّل الحالة إلى Order Rescue بدل تكرار نفس التدخل.',
    onDemandPolicy: 'detail-on-open',
  },
  {
    playbookId: 'playbook-order-rescue',
    title: 'Playbook: Order Rescue متعدد الأسطح',
    severity: 'danger',
    supportedWorkspaces: ['command-center', 'exceptions-escalations', 'order-rescue'],
    triggerFlowIds: ['order-rescue', 'client-order-issue', 'delivery-failed', 'partner-finance-bridge'],
    ownerSection: 'operations',
    checkpoints: ['حدد السطح المالك', 'ثبّت blocker الرئيسي', 'افتح التذكرة أو الشريك أو WLT المرجعي', 'أغلق التشتت'],
    allowedActions: ['تحديد next-best-action', 'تثبيت handoff للمالك الصحيح', 'ربط ticket أو WLT reference'],
    forbiddenActions: ['فتح أكثر من owner decision متضارب', 'إغلاق rescue قبل blocker واضح', 'mutation مالي'],
    nextDecision: 'أرسل الحالة إلى المالك النهائي مع audit trail مختصر بدل تدويرها بين الأقسام.',
    onDemandPolicy: 'detail-on-open',
  },
  {
    playbookId: 'playbook-partner-capacity',
    title: 'Playbook: تراجع السعة أو pause مؤقت للشريك',
    severity: 'warning',
    supportedWorkspaces: ['command-center', 'exceptions-escalations'],
    triggerFlowIds: ['partner_capacity_degraded', 'order-ready', 'item-unavailable'],
    ownerSection: 'partners',
    checkpoints: ['حدد أثر السعة', 'راجع pause/closure window', 'حدّد ما إذا كانت المشكلة عملياتية أم شريكًا'],
    allowedActions: ['فتح قسم الشركاء', 'إحالة catalog conflict', 'تفعيل safe fallback'],
    forbiddenActions: ['معالجة dispute في العمليات', 'نشر catalog workaround بدون owner catalogs'],
    nextDecision: 'إذا كان العائق catalog أو dispute فانقل الحالة مباشرة إلى القسم المالك بدل إبقائها داخل العمليات.',
    onDemandPolicy: 'summary-only',
  },
] as const;

export function getDshOpsInterventionPlaybook(playbookId: string): DshOpsInterventionPlaybook | undefined {
  return DSH_OPS_INTERVENTION_PLAYBOOKS.find((entry) => entry.playbookId === playbookId);
}
