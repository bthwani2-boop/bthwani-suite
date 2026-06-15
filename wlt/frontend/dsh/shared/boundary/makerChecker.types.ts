/**
 * WLT DSH Maker-Checker — types + workflow + RBAC.
 * Maker prepares. Checker independently approves. WLT executes. DSH views only.
 * PREVIEW_ONLY — CONTRACT_SCAFFOLD_PREVIEW_ONLY
 */

export type WltMakerCheckerState =
  | 'draft' | 'prepared_by_maker' | 'under_review' | 'checked_by_checker'
  | 'approved_for_wlt' | 'rejected_by_checker' | 'blocked_by_variance'
  | 'blocked_by_missing_evidence' | 'blocked_by_wlt';

export type WltMakerCheckerRole = 'maker' | 'checker' | 'wlt_processor';

export type WltMakerCheckerPermission =
  | 'finance:prepare' | 'finance:review' | 'finance:approve'
  | 'finance:reject' | 'finance:close-day' | 'wlt:execute';

export type WltMakerCheckerRecord = {
  readonly entryId: string;
  readonly state: WltMakerCheckerState;
  readonly stateLabel: string;
  readonly preparedBy?: string;
  readonly preparedAt?: string;
  readonly reviewedBy?: string;
  readonly reviewedAt?: string;
  readonly checkedBy?: string;
  readonly checkedAt?: string;
  readonly approvedBy?: string;
  readonly approvedAt?: string;
  readonly rejectedBy?: string;
  readonly rejectedAt?: string;
  readonly rejectionReason?: string;
  readonly permissionRequired: WltMakerCheckerPermission;
  readonly nextAllowedRole: WltMakerCheckerRole | 'none';
  readonly isPreviewOnly: true;
  readonly contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY';
};

export const WLT_MAKER_CHECKER_STATE_LABELS: Readonly<Record<WltMakerCheckerState, string>> = {
  draft: 'مسودة',
  prepared_by_maker: 'جاهز للمراجعة (Maker)',
  under_review: 'قيد المراجعة',
  checked_by_checker: 'تم التدقيق (Checker)',
  approved_for_wlt: 'معتمد لـ WLT',
  rejected_by_checker: 'مرفوض من Checker',
  blocked_by_variance: 'محجوب — فارق غير مُسوَّى',
  blocked_by_missing_evidence: 'محجوب — أدلة ناقصة',
  blocked_by_wlt: 'محجوب من WLT',
};

type TransitionDef = {
  allowedRole: WltMakerCheckerRole;
  nextState: WltMakerCheckerState;
  permissionRequired: WltMakerCheckerPermission;
};

export const WLT_MAKER_CHECKER_TRANSITIONS: Readonly<Record<WltMakerCheckerState, readonly TransitionDef[]>> = {
  draft: [{ allowedRole: 'maker', nextState: 'prepared_by_maker', permissionRequired: 'finance:prepare' }],
  prepared_by_maker: [{ allowedRole: 'checker', nextState: 'under_review', permissionRequired: 'finance:review' }],
  under_review: [
    { allowedRole: 'checker', nextState: 'checked_by_checker', permissionRequired: 'finance:approve' },
    { allowedRole: 'checker', nextState: 'rejected_by_checker', permissionRequired: 'finance:reject' },
  ],
  checked_by_checker: [{ allowedRole: 'wlt_processor', nextState: 'approved_for_wlt', permissionRequired: 'wlt:execute' }],
  approved_for_wlt: [],
  rejected_by_checker: [{ allowedRole: 'maker', nextState: 'draft', permissionRequired: 'finance:prepare' }],
  blocked_by_variance: [{ allowedRole: 'maker', nextState: 'draft', permissionRequired: 'finance:prepare' }],
  blocked_by_missing_evidence: [{ allowedRole: 'maker', nextState: 'draft', permissionRequired: 'finance:prepare' }],
  blocked_by_wlt: [],
} as const;

export function getWltMakerCheckerStateLabel(state: WltMakerCheckerState): string {
  return WLT_MAKER_CHECKER_STATE_LABELS[state];
}

export function getWltNextTransitions(state: WltMakerCheckerState): readonly TransitionDef[] {
  return WLT_MAKER_CHECKER_TRANSITIONS[state];
}

export function isWltTerminalState(state: WltMakerCheckerState): boolean {
  return state === 'approved_for_wlt' || state === 'blocked_by_wlt';
}

export type WltRbacPreviewRole = {
  readonly roleId: string;
  readonly label: string;
  readonly permissions: ReadonlyArray<WltMakerCheckerPermission>;
  readonly description: string;
  readonly isPreview: true;
};

export const WLT_RBAC_PREVIEW_ROLES: readonly WltRbacPreviewRole[] = [
  { roleId: 'finance-maker', label: 'مُعِدّ مالي (Maker)', permissions: ['finance:prepare'], description: 'يُسجّل القيود ويجهّز الأدلة. لا صلاحية اعتماد.', isPreview: true },
  { roleId: 'finance-checker', label: 'مُدقق مالي (Checker)', permissions: ['finance:review', 'finance:approve', 'finance:reject'], description: 'يراجع القيود باستقلالية تامة. يملك صلاحية الاعتماد أو الرفض.', isPreview: true },
  { roleId: 'finance-day-closer', label: 'مُغلق اليوم المالي', permissions: ['finance:prepare', 'finance:review', 'finance:close-day'], description: 'يُحضّر حزمة الإغلاق بعد اكتمال كل الشروط.', isPreview: true },
  { roleId: 'wlt-processor', label: 'محرك WLT (آلي)', permissions: ['wlt:execute'], description: 'WLT runtime فقط. يُنفّذ الترحيل بعد اكتمال سلسلة الاعتمادات.', isPreview: true },
] as const;

export function getWltRbacRoleById(roleId: string): WltRbacPreviewRole | undefined {
  return WLT_RBAC_PREVIEW_ROLES.find((r) => r.roleId === roleId);
}

export function buildWltMakerCheckerRecord(params: { entryId: string; workflowState: WltMakerCheckerState }): WltMakerCheckerRecord {
  const transitions = getWltNextTransitions(params.workflowState);
  return {
    entryId: params.entryId,
    state: params.workflowState,
    stateLabel: getWltMakerCheckerStateLabel(params.workflowState),
    permissionRequired: transitions[0]?.permissionRequired ?? 'finance:prepare',
    nextAllowedRole: transitions[0]?.allowedRole ?? 'none',
    isPreviewOnly: true,
    contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  };
}

export const WLT_MAKER_CHECKER_CONTRACT = {
  contractState: 'CONTRACT_SCAFFOLD_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  owner: 'wlt',
  principle: 'Maker prepares. Checker independently approves. WLT executes. DSH views only.',
  isPreview: true,
} as const;
