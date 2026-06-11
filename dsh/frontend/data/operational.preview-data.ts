import type {
  DshControlPanelOperationalWorkspace,
  DshOperationalDataClassification,
  DshOperationalEntityId,
  DshOperationalEntityKind,
  DshOperationalWltImpact,
} from '../shared/dsh-operational.contract';
import type { DshSurfaceId } from '../shared/dsh-flow-registry';
import { canonicalProductId, canonicalStoreId } from './canonical.preview-data';

export const dshOperationalPreviewDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  ownership: 'dsh/frontend/data',
  detailLoading: 'detail-on-open',
  evidenceLoading: 'evidence-on-open',
} as const;

export type DshOperationalPreviewStatus =
  | 'ready-for-preview'
  | 'pending-proof'
  | 'needs-review'
  | 'blocked-by-exception'
  | 'blocked-by-wlt'
  | 'runtime-later';

export type DshOperationalPreviewRecord = {
  readonly recordId: string;
  readonly registryEntryId: DshOperationalEntityId;
  readonly entityKind: DshOperationalEntityKind;
  readonly label: string;
  readonly summary: string;
  readonly ownerSurface: DshSurfaceId;
  readonly visibleSurfaces: readonly DshSurfaceId[];
  readonly controlPanelWorkspace: DshControlPanelOperationalWorkspace;
  readonly status: DshOperationalPreviewStatus;
  readonly dataClassification: DshOperationalDataClassification;
  readonly runtimeTruth: false;
  readonly backendSource: false;
  readonly bindingSource: false;
  readonly detailRef: string;
  readonly evidenceRef?: string;
  readonly mediaKey?: string;
  readonly orderId?: string;
  readonly tripId?: string;
  readonly storeId?: string;
  readonly productId?: string;
  readonly ticketId?: string;
  readonly wltReference?: string;
  readonly wltImpact: DshOperationalWltImpact;
};

function previewRecord(record: Omit<DshOperationalPreviewRecord, 'dataClassification' | 'runtimeTruth' | 'backendSource' | 'bindingSource'>): DshOperationalPreviewRecord {
  return {
    ...record,
    dataClassification: 'SCAFFOLD',
    runtimeTruth: false,
    backendSource: false,
    bindingSource: false,
  };
}

export const dshOperationalPreviewRecords: readonly DshOperationalPreviewRecord[] = [
  previewRecord({
    recordId: 'op-preview-partner-store-onboarding-001',
    registryEntryId: 'partner-store-onboarding',
    entityKind: 'partner-store-operational-record',
    label: 'تمور النخبة - onboarding',
    summary: 'زيارة ميدانية مكتملة، الوثائق والصور تحتاج مراجعة اعتماد قبل الظهور للعميل.',
    ownerSurface: 'app-field',
    visibleSurfaces: ['app-field', 'app-partner', 'control-panel'],
    controlPanelWorkspace: 'audit-rollback',
    status: 'needs-review',
    detailRef: 'detail:partner-store-onboarding:lead-5',
    evidenceRef: 'evidence:field-visit:lead-5',
    mediaKey: 'dsh.store.lead-5.cover.v1',
    storeId: canonicalStoreId,
    wltImpact: 'none',
  }),
  previewRecord({
    recordId: 'op-preview-catalog-readiness-001',
    registryEntryId: 'catalog-readiness',
    entityKind: 'catalog-operational-item',
    label: 'علبة تمر فاخر - catalog readiness',
    summary: 'منتج مركزي بوسائط من المصدر المركزي وجاهزية نشر تحتاج مراجعة كتالوج.',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-client', 'app-partner', 'app-field', 'control-panel'],
    controlPanelWorkspace: 'store-preparation-sla',
    status: 'ready-for-preview',
    detailRef: 'detail:catalog-readiness:canonical-product-field-lead-5-featured',
    evidenceRef: 'evidence:catalog-media:canonical-product-field-lead-5-featured',
    mediaKey: 'dsh.product.lead-5.dates-box.v1',
    storeId: canonicalStoreId,
    productId: canonicalProductId,
    wltImpact: 'none',
  }),
  previewRecord({
    recordId: 'op-preview-order-operational-truth-001',
    registryEntryId: 'order-operational-truth',
    entityKind: 'order-operational-record',
    label: 'طلب DSH-ORD-1001',
    summary: 'طلب في مسار تجهيز المتجر مع رؤية عميل محدودة وحالة دفع WLT للقراءة فقط.',
    ownerSurface: 'app-client',
    visibleSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel'],
    controlPanelWorkspace: 'orders-queue',
    status: 'ready-for-preview',
    detailRef: 'detail:order-operational-truth:DSH-ORD-1001',
    evidenceRef: 'evidence:order-audit:DSH-ORD-1001',
    orderId: 'DSH-ORD-1001',
    storeId: canonicalStoreId,
    wltReference: 'WLT-REF-PAYMENT-1001',
    wltImpact: 'payment-status-read-only',
  }),
  previewRecord({
    recordId: 'op-preview-delivery-trip-001',
    registryEntryId: 'delivery-trip',
    entityKind: 'delivery-trip',
    label: 'رحلة DSH-TRIP-1001',
    summary: 'رحلة توصيل بثواني مرتبطة بطلب واحد، جاهزة لمعاينة milestones فقط.',
    ownerSurface: 'app-captain',
    visibleSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel'],
    controlPanelWorkspace: 'trips-board',
    status: 'pending-proof',
    detailRef: 'detail:delivery-trip:DSH-TRIP-1001',
    evidenceRef: 'evidence:trip-milestones:DSH-TRIP-1001',
    orderId: 'DSH-ORD-1001',
    tripId: 'DSH-TRIP-1001',
    storeId: canonicalStoreId,
    wltImpact: 'settlement-input-candidate',
  }),
  previewRecord({
    recordId: 'op-preview-captain-assignment-001',
    registryEntryId: 'captain-assignment',
    entityKind: 'captain-assignment',
    label: 'إسناد كابتن DSH-ASG-1001',
    summary: 'مرشحون بانتظار قرار preview، مع أهلية WLT قراءة فقط.',
    ownerSurface: 'control-panel',
    visibleSurfaces: ['app-captain', 'control-panel', 'wlt-finance'],
    controlPanelWorkspace: 'captain-assignment-board',
    status: 'runtime-later',
    detailRef: 'detail:captain-assignment:DSH-ASG-1001',
    evidenceRef: 'evidence:wlt-eligibility:DSH-ASG-1001',
    orderId: 'DSH-ORD-1001',
    tripId: 'DSH-TRIP-1001',
    wltReference: 'WLT-ELIGIBILITY-1001',
    wltImpact: 'eligibility-read-only',
  }),
  previewRecord({
    recordId: 'op-preview-store-preparation-001',
    registryEntryId: 'store-preparation',
    entityKind: 'store-preparation-record',
    label: 'تحضير المتجر DSH-PREP-1001',
    summary: 'المتجر قبل الطلب ويحضره، مع بديل محتمل لعنصر واحد.',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'app-captain', 'control-panel'],
    controlPanelWorkspace: 'store-preparation-sla',
    status: 'needs-review',
    detailRef: 'detail:store-preparation:DSH-PREP-1001',
    evidenceRef: 'evidence:preparation:DSH-PREP-1001',
    orderId: 'DSH-ORD-1001',
    storeId: canonicalStoreId,
    wltImpact: 'settlement-input-candidate',
  }),
  previewRecord({
    recordId: 'op-preview-pickup-handoff-001',
    registryEntryId: 'pickup-handoff',
    entityKind: 'pickup-handoff-proof',
    label: 'إثبات استلام DSH-HANDOFF-1001',
    summary: 'إثبات استلام بكود وصورة مؤجل للفتح عند الحاجة.',
    ownerSurface: 'app-partner',
    visibleSurfaces: ['app-partner', 'app-captain', 'control-panel'],
    controlPanelWorkspace: 'pickup-handoff-monitor',
    status: 'pending-proof',
    detailRef: 'detail:pickup-handoff:DSH-HANDOFF-1001',
    evidenceRef: 'evidence:pickup-handoff:DSH-HANDOFF-1001',
    orderId: 'DSH-ORD-1001',
    tripId: 'DSH-TRIP-1001',
    storeId: canonicalStoreId,
    wltImpact: 'settlement-input-candidate',
  }),
  previewRecord({
    recordId: 'op-preview-proof-of-delivery-001',
    registryEntryId: 'proof-of-delivery',
    entityKind: 'delivery-proof',
    label: 'PoD DSH-POD-1001',
    summary: 'إثبات التسليم قيد المراجعة، ولا يفتح تفاصيل الصور إلا عند الطلب.',
    ownerSurface: 'app-captain',
    visibleSurfaces: ['app-client', 'app-captain', 'control-panel'],
    controlPanelWorkspace: 'pod-review-queue',
    status: 'pending-proof',
    detailRef: 'detail:proof-of-delivery:DSH-POD-1001',
    evidenceRef: 'evidence:proof-of-delivery:DSH-POD-1001',
    orderId: 'DSH-ORD-1001',
    tripId: 'DSH-TRIP-1001',
    wltImpact: 'settlement-input-candidate',
  }),
  previewRecord({
    recordId: 'op-preview-cod-collection-001',
    registryEntryId: 'cod-collection',
    entityKind: 'cod-collection-event',
    label: 'COD DSH-COD-1001',
    summary: 'تحصيل نقدي مع فرق محتمل، جاهز كمدخل مسؤولية لـ WLT فقط.',
    ownerSurface: 'app-captain',
    visibleSurfaces: ['app-captain', 'app-partner', 'control-panel', 'wlt-finance'],
    controlPanelWorkspace: 'cod-discrepancy-queue',
    status: 'blocked-by-wlt',
    detailRef: 'detail:cod-collection:DSH-COD-1001',
    evidenceRef: 'evidence:cod-collection:DSH-COD-1001',
    orderId: 'DSH-ORD-1001',
    tripId: 'DSH-TRIP-1001',
    wltReference: 'WLT-COD-LIABILITY-1001',
    wltImpact: 'cod-liability-candidate',
  }),
  previewRecord({
    recordId: 'op-preview-operational-exception-001',
    registryEntryId: 'operational-exception',
    entityKind: 'operational-exception',
    label: 'استثناء DSH-EXC-1001',
    summary: 'استثناء handoff mismatch مرتبط بالطلب والرحلة، يحتاج owner واضح قبل الإغلاق.',
    ownerSurface: 'control-panel',
    visibleSurfaces: ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel', 'wlt-finance'],
    controlPanelWorkspace: 'exception-queue',
    status: 'blocked-by-exception',
    detailRef: 'detail:operational-exception:DSH-EXC-1001',
    evidenceRef: 'evidence:operational-exception:DSH-EXC-1001',
    orderId: 'DSH-ORD-1001',
    tripId: 'DSH-TRIP-1001',
    ticketId: 'DSH-TICKET-1001',
    wltImpact: 'audit-candidate',
  }),
  previewRecord({
    recordId: 'op-preview-support-escalation-001',
    registryEntryId: 'support-escalation',
    entityKind: 'support-escalation-link',
    label: 'تصعيد دعم DSH-TICKET-1001',
    summary: 'تذكرة مرتبطة بالطلب والرحلة والاستثناء مع مرجع WLT للقراءة فقط.',
    ownerSurface: 'control-panel',
    visibleSurfaces: ['app-client', 'app-partner', 'app-captain', 'control-panel', 'wlt-finance'],
    controlPanelWorkspace: 'support-escalation-queue',
    status: 'needs-review',
    detailRef: 'detail:support-escalation:DSH-TICKET-1001',
    evidenceRef: 'evidence:support-escalation:DSH-TICKET-1001',
    orderId: 'DSH-ORD-1001',
    tripId: 'DSH-TRIP-1001',
    ticketId: 'DSH-TICKET-1001',
    wltReference: 'WLT-REFUND-REVIEW-1001',
    wltImpact: 'refund-review-candidate',
  }),
  previewRecord({
    recordId: 'op-preview-settlement-input-001',
    registryEntryId: 'settlement-input-bridge',
    entityKind: 'settlement-input-event',
    label: 'Settlement input DSH-SETTLE-IN-1001',
    summary: 'مدخل تسوية تشغيلي فقط؛ WLT يقرر القبول والرفض والمحاسبة.',
    ownerSurface: 'control-panel',
    visibleSurfaces: ['control-panel', 'wlt-finance'],
    controlPanelWorkspace: 'settlement-inputs-preview',
    status: 'blocked-by-wlt',
    detailRef: 'detail:settlement-input:DSH-SETTLE-IN-1001',
    evidenceRef: 'evidence:settlement-input:DSH-SETTLE-IN-1001',
    orderId: 'DSH-ORD-1001',
    tripId: 'DSH-TRIP-1001',
    storeId: canonicalStoreId,
    wltReference: 'WLT-SETTLEMENT-CANDIDATE-1001',
    wltImpact: 'settlement-input-candidate',
  }),
  previewRecord({
    recordId: 'op-preview-control-panel-operation-001',
    registryEntryId: 'control-panel-operation',
    entityKind: 'control-panel-operation-record',
    label: 'Operation DSH-OP-1001',
    summary: 'سجل عملية لوحة تحكم يثبت permission/input/validation/audit/rollback بدون تنفيذ runtime.',
    ownerSurface: 'control-panel',
    visibleSurfaces: ['control-panel'],
    controlPanelWorkspace: 'audit-rollback',
    status: 'runtime-later',
    detailRef: 'detail:control-panel-operation:DSH-OP-1001',
    evidenceRef: 'evidence:control-panel-operation:DSH-OP-1001',
    wltImpact: 'none',
  }),
] as const;

export function getDshOperationalPreviewRecords(): readonly DshOperationalPreviewRecord[] {
  return dshOperationalPreviewRecords;
}

export function getDshOperationalPreviewRecordById(id: string): DshOperationalPreviewRecord | undefined {
  return dshOperationalPreviewRecords.find((record) => record.recordId === id);
}

export function getDshOperationalPreviewRecordsByRegistryEntry(
  registryEntryId: DshOperationalEntityId,
): readonly DshOperationalPreviewRecord[] {
  return dshOperationalPreviewRecords.filter((record) => record.registryEntryId === registryEntryId);
}
