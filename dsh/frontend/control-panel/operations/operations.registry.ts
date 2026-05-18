import type {
  AnyOperationsWorkspaceId,
  CanonicalOperationsGroupId,
  LegacyOperationsWorkspaceId,
  LegacySectionRedirectId,
  NonOperationsSectionRootId,
  OperationsGroupMeta,
  OperationsNormalizationResult,
  OperationsPanelId,
} from './operations.types';

export type { AnyOperationsWorkspaceId } from './operations.types';

export const OPERATIONS_CANONICAL_GROUPS: readonly OperationsGroupMeta[] = [
  {
    id: 'command-center',
    label: 'غرفة القيادة',
    description: 'نبض العمليات، المعوقات، وأفضل إجراء تالي.',
    badge: 'قيادة',
    subGroups: [
      { id: 'overview', label: 'نظرة عامة' },
      { id: 'anomalies', label: 'شواذ النظام' },
      { id: 'recommendations', label: 'توصيات ذكية' },
    ]
  },
  {
    id: 'live-orders',
    label: 'الطلبات الحية',
    description: 'قائمة الطلبات، التفاصيل، الدردشة، وتدخلات التنفيذ — مصنّفة حسب وضع التنفيذ.',
    badge: 'أساس',
    subGroups: [
      { id: 'all', label: 'الكل' },
      { id: 'bthwani_delivery', label: 'توصيل بثواني' },
      { id: 'partner_delivery', label: 'توصيل المتجر' },
      { id: 'pickup', label: 'استلام بنفسي' },
      { id: 'unassigned', label: 'غير مسندة' },
      { id: 'delayed', label: 'متأخرة' },
      { id: 'pickup-proof', label: 'إثبات الاستلام' },
      { id: 'delivery-proof', label: 'إثبات التسليم' },
      { id: 'exceptions', label: 'الاستثناءات' },
      { id: 'audit', label: 'التدقيق' },
    ]
  },
  {
    id: 'dispatch-assignment',
    label: 'الإسناد والتوزيع',
    description: 'لوحة الإسناد، تغطية الكباتن، وإعادة الإسناد اليدوي.',
    badge: 'مباشر',
    subGroups: [
      { id: 'pending', label: 'غير مسندة' },
      { id: 'captains', label: 'توافر الكباتن' },
      { id: 'partner-readiness', label: 'جاهزية الشريك' },
      { id: 'surge', label: 'الذروة' },
    ]
  },
  {
    id: 'geo-heatmap',
    label: 'خريطة الإسناد الحي',
    description: 'الطلبات الحية وتمركز الكباتن وضغط المتاجر ومخاطر الالتزام في مشهد واحد.',
    badge: 'حي',
    subGroups: [
      { id: 'orders', label: 'الطلبات' },
      { id: 'captains', label: 'الكباتن' },
      { id: 'stores', label: 'المتاجر' },
      { id: 'sla', label: 'الالتزام' },
      { id: 'peak', label: 'الذروة' },
    ],
    tertiaryFilters: ['الآن', '١٥ دقيقة', '٣٠ دقيقة', 'خطر عالٍ', 'نقص كباتن', 'ضغط متاجر'],
  },
  {
    id: 'sheinproxy',
    label: 'شي إن',
    description: 'مسار الإسناد اليدوي لطلبات شي إن والدفعات المرتبطة بها.',
    badge: 'يدوي',
    subGroups: [
      { id: 'batches', label: 'الدفعات' },
      { id: 'orders', label: 'الطلبات' },
      { id: 'errors', label: 'أخطاء الربط' },
    ]
  },
  {
    id: 'awnak-operations',
    label: 'عونك',
    description: 'مسار عونك التشغيلي: استلام الطلبات، المراجعة، الإسناد، التنفيذ، ومراجعة الإثبات.',
    badge: 'يدوي',
    subGroups: [
      { id: 'intake', label: 'الاستلام' },
      { id: 'quote-review', label: 'مراجعة السعر' },
      { id: 'dispatch-pending', label: 'قيد الإسناد' },
      { id: 'assigned', label: 'تم الإسناد' },
      { id: 'in-progress', label: 'قيد التنفيذ' },
      { id: 'proof-review', label: 'مراجعة الإثبات' },
      { id: 'completed', label: 'مكتمل' },
      { id: 'cancelled', label: 'ملغى' },
      { id: 'escalated', label: 'مصعّد' },
    ]
  },
  {
    id: 'captain-operations',
    label: 'تشغيل الكباتن',
    description: 'توافر الكباتن، الجاهزية، وضغط التغطية.',
    badge: 'كباتن',
    subGroups: [
      { id: 'availability', label: 'التوافر' },
      { id: 'readiness', label: 'الجاهزية' },
      { id: 'performance', label: 'الأداء' },
    ]
  },
  {
    id: 'partner-stores',
    label: 'المتاجر والشركاء',
    description: 'جاهزية المتاجر، التحضير، وضغط الاستلام.',
    badge: 'متاجر',
    subGroups: [
      { id: 'preparation', label: 'تحت التحضير' },
      { id: 'ready', label: 'جاهز للاستلام' },
      { id: 'delays', label: 'تأخيرات' },
      { id: 'readiness', label: 'الجاهزية' },
      { id: 'pressure', label: 'الضغط' },
    ]
  },
  {
    id: 'area-capacity',
    label: 'المناطق والسعة',
    description: 'ضغط السعة، النوافذ المحجوزة، والتحكم في الطفرات.',
    badge: 'سعة',
    subGroups: [
      { id: 'density', label: 'كثافة المناطق' },
      { id: 'surge', label: 'إدارة الطفرات' },
      { id: 'windows', label: 'نوافذ الخدمة' },
      { id: 'captains', label: 'الكباتن' },
      { id: 'stores', label: 'المتاجر' },
    ]
  },
  {
    id: 'exceptions-escalations',
    label: 'الاستثناءات والتصعيد',
    description: 'قائمة الاستثناءات، إجراءات التعافي، وتوجيه المالك.',
    badge: 'مخاطر',
    subGroups: [
      { id: 'level-1', label: 'مستوى ١' },
      { id: 'level-2', label: 'مستوى ٢' },
      { id: 'critical', label: 'حرج جداً' },
    ]
  },
  {
    id: 'audit-support-sla',
    label: 'التدقيق والدعم والالتزام',
    description: 'تدقيق الإجراءات اليدوية، جسر الدعم، وانضباط الالتزام.',
    badge: 'التزام',
    subGroups: [
      { id: 'procedures', label: 'إجراءات' },
      { id: 'proofs', label: 'إثباتات' },
      { id: 'sla', label: 'مقاييس الالتزام' },
    ]
  },
] as const;

export const OPERATIONS_CANONICAL_GROUP_IDS = OPERATIONS_CANONICAL_GROUPS.map((group) => group.id) as readonly CanonicalOperationsGroupId[];

export const NON_OPERATIONS_SECTION_SHORTCUTS: ReadonlyArray<{
  id: NonOperationsSectionRootId;
  label: string;
  description: string;
  href: `/${NonOperationsSectionRootId}`;
}> = [
  { id: 'finance', label: 'المالية', description: 'الحقائق المالية تبقى في قسم المالية.', href: '/finance' },
  { id: 'catalogs', label: 'الكتالوجات', description: 'حوكمة الكتالوج تبقى في قسم الكتالوجات.', href: '/catalogs' },
  { id: 'marketing', label: 'التسويق', description: 'التسويق والنمو يبقيان في قسم التسويق.', href: '/marketing' },
  { id: 'partners', label: 'الشركاء', description: 'إدارة الشركاء تبقى في قسم الشركاء.', href: '/partners' },
] as const;

const LEGACY_OPERATIONAL_TO_CANONICAL_GROUP: Record<Exclude<LegacyOperationsWorkspaceId, LegacySectionRedirectId> | 'orders' | 'overview', CanonicalOperationsGroupId> = {
  overview: 'command-center',
  orders: 'live-orders',
  dashboard: 'command-center',
  'dispatch-fleet': 'dispatch-assignment',
  'tracking-handoff': 'live-orders',
  'exceptions-sla': 'exceptions-escalations',
  'partner-readiness': 'partner-stores',
  'audit-evidence': 'audit-support-sla',
  'captain-ops': 'captain-operations',
  'field-ops': 'partner-stores',
  issues: 'exceptions-escalations',
  serviceability: 'area-capacity',
  'guard-status': 'audit-support-sla',
  evidence: 'audit-support-sla',
  'order-detail': 'live-orders',
  orderchat: 'live-orders',
  dispatch: 'dispatch-assignment',
  'live-tracking': 'live-orders',
  exceptions: 'exceptions-escalations',
  sla: 'exceptions-escalations',
  audit: 'audit-support-sla',
  'partner-prep': 'partner-stores',
  handoff: 'live-orders',
  'proof-review': 'live-orders',
  capacity: 'area-capacity',
  sheinproxy: 'dispatch-assignment',
  reassign: 'dispatch-assignment',
  'peak-mode': 'dispatch-assignment',
  bell: 'live-orders',
  'arrival-bell': 'live-orders',
  'zone-set': 'area-capacity',
  'live-map-capacity': 'geo-heatmap',
  'geo-heatmap': 'geo-heatmap',
  'proxy-shein-awnak': 'awnak-operations', // legacy alias → canonical awnak-operations
};

const LEGACY_SECTION_REDIRECTS: Record<LegacySectionRedirectId, NonOperationsSectionRootId> = {
  finance: 'finance',
  settlements: 'finance',
  cod: 'finance',
  refunds: 'finance',
  catalogs: 'catalogs',
  'catalog-categories': 'catalogs',
  marketing: 'marketing',
  banners: 'marketing',
  growth: 'marketing',
  loyalty: 'marketing',
  'smart-signal': 'marketing',
  partners: 'partners',
};

type LegacyOperationalWorkspaceId = Exclude<LegacyOperationsWorkspaceId, LegacySectionRedirectId>;

export function coerceOperationsPanel(panel?: string): OperationsPanelId | undefined {
  if (panel === 'detail' || panel === 'chat') {
    return panel;
  }

  return undefined;
}

export function normalizeOperationsLocation(
  workspace?: string,
  panel?: string,
): OperationsNormalizationResult {
  const resolvedPanel = coerceOperationsPanel(panel);

  if (!workspace || workspace === 'overview') {
    return {
      kind: 'group',
      group: 'command-center',
      sourceWorkspace: workspace as AnyOperationsWorkspaceId | undefined,
      panel: resolvedPanel,
    };
  }

  const directCanonical = OPERATIONS_CANONICAL_GROUP_IDS.find((groupId) => groupId === workspace);
  if (directCanonical) {
    return {
      kind: 'group',
      group: directCanonical,
      sourceWorkspace: directCanonical,
      panel: resolvedPanel,
    };
  }

  if (Object.prototype.hasOwnProperty.call(LEGACY_SECTION_REDIRECTS, workspace)) {
    const section = LEGACY_SECTION_REDIRECTS[workspace as LegacySectionRedirectId];
    return {
      kind: 'redirect',
      sourceWorkspace: workspace as AnyOperationsWorkspaceId,
      section,
      href: `/${section}`,
    };
  }

  const mapped = LEGACY_OPERATIONAL_TO_CANONICAL_GROUP[workspace as LegacyOperationalWorkspaceId | 'orders' | 'overview'];
  if (!mapped) {
    return {
      kind: 'group',
      group: 'command-center',
      sourceWorkspace: workspace as AnyOperationsWorkspaceId,
      panel: resolvedPanel,
    };
  }

  const derivedPanel = workspace === 'order-detail'
    ? 'detail'
    : workspace === 'orderchat'
      ? 'chat'
      : resolvedPanel;

  return {
    kind: 'group',
    group: mapped,
    sourceWorkspace: workspace as AnyOperationsWorkspaceId,
    panel: derivedPanel,
  };
}

export function buildOperationsHref(
  group: AnyOperationsWorkspaceId = 'command-center',
  options?: {
    orderId?: string;
    panel?: OperationsPanelId;
  },
) {
  const normalizedLocation = normalizeOperationsLocation(group, options?.panel);
  const searchParams = new URLSearchParams();

  if (normalizedLocation.kind === 'group' && normalizedLocation.group !== 'command-center') {
    searchParams.set('workspace', normalizedLocation.group);
  }

  if (options?.orderId) {
    searchParams.set('orderId', options.orderId);
  }

  if (options?.panel) {
    searchParams.set('panel', options.panel);
  }

  const query = searchParams.toString();
  return query ? `/operations?${query}` : '/operations';
}

export function getOperationsGroupMeta(groupId: CanonicalOperationsGroupId) {
  return OPERATIONS_CANONICAL_GROUPS.find((group) => group.id === groupId) ?? OPERATIONS_CANONICAL_GROUPS[0];
}

const STATE_COPY: Record<Exclude<import('./operations.types').OperationsViewState, 'ready'>, import('./operations.types').StateViewCopy> = {
  loading: {
    stateId: 'loading',
    title: 'جارٍ تحميل معاينة العمليات',
    description: 'تجهّز مساحة المعاينة الحالة التشغيلية التالية.',
    actionLabel: 'فتح العمليات',
  },
  empty: {
    stateId: 'empty',
    title: 'لا يوجد محتوى بعد',
    description: 'لا توجد عينة تشغيلية متاحة لمساحة العمل الحالية.',
    actionLabel: 'فتح العمليات',
  },
  error: {
    stateId: 'recoverableError',
    title: 'بيانات المعاينة غير متاحة',
    description: 'يمكن أن تتعافى مساحة العمل بعد التحديث التالي.',
    actionLabel: 'فتح العمليات',
  },
  offline: {
    stateId: 'offline',
    title: 'معاينة العمليات غير متصلة',
    description: 'أعد الاتصال أو حدّث مساحة العمل للمتابعة.',
    actionLabel: 'فتح العمليات',
  },
  disabled: {
    kind: 'warning',
    title: 'تم تعطيل وضع المعاينة',
    description: 'تظل المعاينة التشغيلية مخفية حتى تصبح مساحة العمل جاهزة مرة أخرى.',
    actionLabel: 'فتح العمليات',
  },
};

export function resolveOperationsStateCopy(state: Exclude<import('./operations.types').OperationsViewState, 'ready'>): import('./operations.types').StateViewCopy {
  return STATE_COPY[state];
}
