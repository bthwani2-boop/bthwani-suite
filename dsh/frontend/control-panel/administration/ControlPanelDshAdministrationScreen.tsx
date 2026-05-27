'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelWorkspaceTabs,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { ADMIN_ROLES, PLATFORM_PERMISSIONS, MOCK_USERS } from '../../data/platform.preview-data';
import type { AdminRole, MockAdminUser, AdminUserStatus } from './administration.types';
import { getDshControlPanelGovernanceEntry } from '../shared';
import {
  DSH_ROLE_PERMISSIONS,
  DSH_MAKER_CHECKER_MATRIX,
  DSH_REASON_EVIDENCE_POLICY,
  getDshRoleCanPerform,
  getDshRoleArabicName,
} from '../../shared/dsh-role-permission.model';
import type { DshRoleId } from '../../shared/dsh-role-permission.model';
import styles from '../shared/control-panel-surface.module.css';

type AdminWorkspaceId = 'overview' | 'roles' | 'users' | 'approval-chain' | 'maker-checker' | 'sensitive-decisions';

const WORKSPACE_TABS = [
  { id: 'overview' as AdminWorkspaceId, label: 'نظرة عامة', badge: '' },
  { id: 'roles' as AdminWorkspaceId, label: 'الأدوار والصلاحيات', badge: '' },
  { id: 'users' as AdminWorkspaceId, label: 'المستخدمون', badge: '' },
  { id: 'approval-chain' as AdminWorkspaceId, label: 'سلسلة الاعتماد', badge: '' },
  { id: 'maker-checker' as AdminWorkspaceId, label: 'Maker / Checker', badge: '' },
  { id: 'sensitive-decisions' as AdminWorkspaceId, label: 'القرارات الحساسة', badge: '10' },
] as const;

function hasPermission(role: AdminRole, permId: string): boolean {
  return (role.permissions as readonly string[]).includes(permId);
}

// ─── Role card ───────────────────────────────────────────────────────────────

function RoleCard({ role }: { role: AdminRole }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Surface tone="raised" border padding={4} radiusToken="xl">
      <Box gap={3}>
        <Box
          layoutDirection="row"
          justify="space-between"
          align="center"
          style={{ flexWrap: 'wrap', rowGap: 8 }}
        >
          <Box gap={1}>
            <Box layoutDirection="row" gap={2} align="center">
              <Surface tone={role.tone} padding={1} radiusToken="pill" border={false}>
                <Text role="caption" tone={role.tone === 'default' ? 'muted' : 'inverse'} weight="bold">
                  {role.arabicName}
                </Text>
              </Surface>
              <Text role="caption" tone="muted">{role.name}</Text>
            </Box>
            <Text role="bodySm">{role.description}</Text>
          </Box>
          <Button
            tone="secondary"
            fullWidth={false}
            label={expanded ? 'إخفاء الصلاحيات' : 'عرض الصلاحيات (تجريبي)'}
            onPress={() => setExpanded(!expanded)}
          />
        </Box>

        {expanded && (
          <Surface tone="default" border padding={3} radiusToken="md">
            <Box gap={2}>
              <Text role="caption" tone="muted">الصلاحيات الممنوحة ({role.permissions.length} من {PLATFORM_PERMISSIONS.length}):</Text>
              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                {PLATFORM_PERMISSIONS.map((perm) => {
                  const granted = hasPermission(role, perm.id);
                  return (
                    <Surface
                      key={perm.id}
                      tone={granted ? 'success' : 'default'}
                      padding={1}
                      radiusToken="pill"
                      border
                    >
                      <Text role="caption" tone={granted ? 'success' : 'muted'}>
                        {granted ? '✓ ' : '✗ '}{perm.name}
                      </Text>
                    </Surface>
                  );
                })}
              </Box>
            </Box>
          </Surface>
        )}
      </Box>
    </Surface>
  );
}

// ─── Permission matrix ───────────────────────────────────────────────────────

function PermissionMatrix() {
  return (
    <WebSectionCard
      title="مصفوفة الصلاحيات"
      description="ملخص من يملك أي صلاحية في Platform. ✓ مسموح، ✗ غير مسموح."
    >
      <Box gap={2}>
        <Surface tone="default" border padding={3} radiusToken="md">
          <Box layoutDirection="row" gap={1}>
            <Box style={{ minWidth: 160, flexShrink: 0 }}>
              <Text role="caption" tone="muted" weight="bold">الصلاحية</Text>
            </Box>
            {ADMIN_ROLES.map((role) => (
              <Box key={role.id} style={{ flexGrow: 1, minWidth: 72, alignItems: 'center' }}>
                <Surface tone={role.tone} padding={1} radiusToken="pill" border={false}>
                  <Text role="caption" tone={role.tone === 'default' ? 'muted' : 'inverse'} weight="bold">
                    {role.arabicName}
                  </Text>
                </Surface>
              </Box>
            ))}
          </Box>
        </Surface>

        {PLATFORM_PERMISSIONS.map((perm, i) => (
          <Surface key={perm.id} tone={i % 2 === 0 ? 'raised' : 'default'} border={false} padding={2} radiusToken="md">
            <Box layoutDirection="row" gap={1} align="center">
              <Box style={{ minWidth: 160, flexShrink: 0 }}>
                <Text role="bodySm">{perm.name}</Text>
                <Text role="caption" tone="muted">{perm.scope}</Text>
              </Box>
              {ADMIN_ROLES.map((role) => {
                const granted = hasPermission(role, perm.id);
                return (
                  <Box key={role.id} style={{ flexGrow: 1, minWidth: 72, alignItems: 'center' }}>
                    <Text role="bodyLg" tone={granted ? 'success' : 'danger'} weight="bold">
                      {granted ? '✓' : '✗'}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          </Surface>
        ))}
      </Box>
    </WebSectionCard>
  );
}

// ─── User card ───────────────────────────────────────────────────────────────

function UserCard({ user }: { user: MockAdminUser }) {
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = React.useState<AdminUserStatus>(user.status);
  const role = ADMIN_ROLES.find((r) => r.id === user.roleId);

  const statusTone: Record<AdminUserStatus, 'success' | 'warning' | 'danger'> = {
    active: 'success',
    pending: 'warning',
    suspended: 'danger',
  };

  const statusLabel: Record<AdminUserStatus, string> = {
    active: 'نشط',
    pending: 'في انتظار الاعتماد',
    suspended: 'معلق',
  };

  const handleConfirm = (action: string) => {
    if (action === 'تفعيل الوصول (تجريبي)' || action === 'إعادة تفعيل (تجريبي)') {
      setCurrentStatus('active');
    } else if (action === 'تعليق الوصول (تجريبي)') {
      setCurrentStatus('suspended');
    }
    setShowConfirm(null);
  };

  return (
    <Surface tone="raised" border padding={3} radiusToken="xl">
      <Box gap={2}>
        <Box layoutDirection="row" justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', rowGap: 8 }}>
          <Box gap={1}>
            <Text role="titleMd">{user.name}</Text>
            <Text role="caption" tone="muted">{user.email}</Text>
            {role && (
              <Surface tone={role.tone} padding={1} radiusToken="pill" border={false} style={{ alignSelf: 'flex-start' }}>
                <Text role="caption" tone={role.tone === 'default' ? 'muted' : 'inverse'}>{role.arabicName}</Text>
              </Surface>
            )}
          </Box>
          <Box gap={1} align="flex-end">
            <Surface tone={statusTone[currentStatus]} padding={1} radiusToken="pill" border={false}>
              <Text role="caption" tone="inverse">{statusLabel[currentStatus]}</Text>
            </Surface>
            <Text role="caption" tone="muted">آخر دخول: {user.lastAccess}</Text>
          </Box>
        </Box>

        {showConfirm ? (
          <Surface tone="warning" border padding={3} radiusToken="md">
            <Box gap={2}>
              <Text role="titleSm">تأكيد الإجراء التجريبي: {showConfirm}</Text>
              <Text role="bodySm">لن يتم تغيير صلاحيات حقيقية. هذا Demo Mode فقط.</Text>
              <Box layoutDirection="row" gap={2}>
                <Button tone="primary" label="تأكيد المحاكاة" onPress={() => handleConfirm(showConfirm)} />
                <Button tone="secondary" label="إلغاء" onPress={() => setShowConfirm(null)} />
              </Box>
            </Box>
          </Surface>
        ) : (
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button tone="secondary" label="تعيين دور (تجريبي)" onPress={() => setShowConfirm('تعيين دور (تجريبي)')} />
            {currentStatus === 'pending' && (
              <Button tone="primary" label="تفعيل الوصول (تجريبي)" onPress={() => setShowConfirm('تفعيل الوصول (تجريبي)')} />
            )}
            {currentStatus === 'active' && (
              <Button tone="danger" label="تعليق الوصول (تجريبي)" onPress={() => setShowConfirm('تعليق الوصول (تجريبي)')} />
            )}
            {currentStatus === 'suspended' && (
              <Button tone="primary" label="إعادة تفعيل (تجريبي)" onPress={() => setShowConfirm('إعادة تفعيل (تجريبي)')} />
            )}
          </Box>
        )}
      </Box>
    </Surface>
  );
}

// ─── Sensitive decisions panel ───────────────────────────────────────────────

const ALL_DSH_ROLES: ReadonlyArray<DshRoleId> = [
  'super-admin',
  'platform-governor',
  'platform-approver',
  'platform-operator',
  'finance-approver',
  'viewer',
];

function SensitiveDecisionsPanel() {
  return (
    <Box gap={4}>
      <WebSectionCard
        title="القرارات الحساسة — سياسة الوصول (10 قرارات)"
        description="كل قرار حساس يتطلب دوراً محدداً. القرارات المالية عرض فقط — WLT يملك السلطة. جميعها محاكاة UI فقط."
      >
        <Box gap={3}>
          {DSH_ROLE_PERMISSIONS.map((entry) => (
            <Surface key={entry.section} tone="raised" border padding={3} radiusToken="xl">
              <Box gap={3}>
                {/* Header: label + policy flags */}
                <Box
                  layoutDirection="row"
                  justify="space-between"
                  align="flex-start"
                  style={{ flexWrap: 'wrap', rowGap: 8 }}
                >
                  <Box gap={1} style={{ flexGrow: 1, flexShrink: 1, minWidth: 200 }}>
                    <Text role="bodyStrong">{entry.arabicLabel}</Text>
                    <Text role="bodySm" tone="muted">{entry.arabicDescription}</Text>
                  </Box>
                  <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {entry.auditRequired && (
                      <Surface tone="warning" padding={1} radiusToken="pill" border={false}>
                        <Text role="caption" tone="muted">تدقيق</Text>
                      </Surface>
                    )}
                    {entry.reasonRequired && (
                      <Surface tone="raised" padding={1} radiusToken="pill" border>
                        <Text role="caption" tone="muted">سبب</Text>
                      </Surface>
                    )}
                    {entry.evidenceRequired && (
                      <Surface tone="raised" padding={1} radiusToken="pill" border>
                        <Text role="caption" tone="muted">إثبات</Text>
                      </Surface>
                    )}
                    {entry.wltMutationForbidden && (
                      <Surface tone="danger" padding={1} radiusToken="pill" border={false}>
                        <Text role="caption" tone="inverse">WLT عرض فقط</Text>
                      </Surface>
                    )}
                  </Box>
                </Box>

                {/* Role access row */}
                <Box gap={1}>
                  <Text role="caption" tone="muted">الوصول حسب الدور:</Text>
                  <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
                    {ALL_DSH_ROLES.map((roleId) => {
                      const canDo = getDshRoleCanPerform(roleId, entry.section);
                      return (
                        <Surface
                          key={roleId}
                          tone={canDo ? 'success' : 'default'}
                          padding={1}
                          radiusToken="pill"
                          border
                        >
                          <Text role="caption" tone={canDo ? 'success' : 'muted'}>
                            {canDo ? '✓ ' : '✗ '}{getDshRoleArabicName(roleId)}
                          </Text>
                        </Surface>
                      );
                    })}
                  </Box>
                </Box>

                {/* Affected surfaces */}
                <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
                  {entry.affectedSurfaces.map((s) => (
                    <Surface key={s} tone="inset" padding={1} radiusToken="pill" border={false}>
                      <Text role="caption" tone="muted">{s}</Text>
                    </Surface>
                  ))}
                </Box>
              </Box>
            </Surface>
          ))}
        </Box>
      </WebSectionCard>

      {/* Finance mutation boundary notice */}
      <Surface tone="danger" border padding={3} radiusToken="xl">
        <Box gap={2}>
          <Text role="titleSm" tone="danger">حدود WLT المالي — ممنوع داخل DSH</Text>
          <Box gap={1}>
            <Text role="bodySm">✗ لا approve/pay/settle داخل DSH — WLT فقط</Text>
            <Text role="bodySm">✗ لا refund mutation — يُعرض فقط من WLT bridge</Text>
            <Text role="bodySm">✗ لا commission/payout حساب — عرض فقط من WLT</Text>
            <Text role="bodySm">✓ finance-approver + super-admin + governor يشاهدون فقط</Text>
          </Box>
        </Box>
      </Surface>
    </Box>
  );
}

// ─── Panels ──────────────────────────────────────────────────────────────────

function OverviewPanel() {
  return (
    <Box gap={4}>
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="الأدوار المعرّفة"
            value="6"
            description="Super Admin، Platform Governor، Platform Approver، Platform Operator، Finance Approver، Viewer."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="المستخدمون النشطون"
            value="4"
            description="4 مستخدمون نشطون. 1 في انتظار الاعتماد."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="طلبات الوصول المعلقة"
            value="1"
            description="طلب وصول واحد بانتظار الاعتماد من حاكم المنصة."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="آخر تغيير دور"
            value="قبل أسبوع"
            description="تعيين خالد النعماني كمشغّل Platform."
            tone="neutral"
          />
        </Box>
      </Box>

      <WebSectionCard
        title="دور Administration في المنصة"
        description="Administration لا تُنفّذ تغييرات في Platform — هي تحدد فقط من يملك صلاحية ذلك."
      >
        <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
          <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 280, minWidth: 0 }}>
            <Box gap={2}>
              <Text role="titleMd" tone="brand">ما تفعله Administration</Text>
              <Box gap={1}>
                <Text role="bodySm">✓ تحديد الأدوار والصلاحيات</Text>
                <Text role="bodySm">✓ تعيين المستخدمين لأدوار Platform</Text>
                <Text role="bodySm">✓ تحديد من يرى Platform</Text>
                <Text role="bodySm">✓ تحديد من يطلب / يعتمد / ينفذ تغييرات Platform</Text>
                <Text role="bodySm">✓ تحديد من يملك Rollback</Text>
                <Text role="bodySm">✓ مراجعة سلسلة الاعتماد</Text>
              </Box>
            </Box>
          </Surface>

          <Surface tone="warning" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 280, minWidth: 0 }}>
            <Box gap={2}>
              <Text role="titleMd">ما لا تفعله Administration</Text>
              <Box gap={1}>
                <Text role="bodySm">✗ لا تُوقف خدمات Platform</Text>
                <Text role="bodySm">✗ لا تُغيّر المتغيرات السيادية</Text>
                <Text role="bodySm">✗ لا تُفعّل أو تُوقف مزودين</Text>
                <Text role="bodySm">✗ لا تُغيّر مظهر التطبيقات</Text>
                <Text role="bodySm">✗ لا تُدير الكتالوجات أو التسويق</Text>
              </Box>
            </Box>
          </Surface>
        </Box>
      </WebSectionCard>
    </Box>
  );
}

function RolesPanel() {
  return (
    <Box gap={4}>
      <WebSectionCard
        title="الأدوار والصلاحيات"
        description="كل دور يمنح مجموعة محددة من الصلاحيات في Platform. الأدوار لا تتداخل تلقائياً."
      >
        <Box gap={3}>
          {ADMIN_ROLES.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </Box>
      </WebSectionCard>
      <PermissionMatrix />
    </Box>
  );
}

function UsersPanel() {
  return (
    <WebSectionCard
      title="المستخدمون — Mock"
      description="قائمة تجريبية بالمستخدمين وأدوارهم. Demo Mode فقط — لا يتم تعديل حسابات حقيقية."
    >
      <Box gap={3}>
        {MOCK_USERS.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </Box>
    </WebSectionCard>
  );
}

function ApprovalChainPanel() {
  return (
    <Box gap={4}>
      <WebSectionCard
        title="سلسلة الاعتماد"
        description="كل تغيير في Platform يمر عبر سلسلة اعتماد محددة. التغييرات المالية تتطلب توقيعاً مزدوجاً."
      >
        <Box gap={4}>
          <Box gap={2}>
            <Text role="titleMd">التغييرات العامة:</Text>
            <Box layoutDirection="row" gap={2} align="center" style={{ flexWrap: 'wrap' }}>
              <Surface tone="success" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="inverse" weight="bold">مشغّل Platform</Text>
                <Text role="caption" tone="inverse">يقدم الطلب</Text>
              </Surface>
              <Text role="bodyLg" tone="muted">→</Text>
              <Surface tone="warning" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="muted" weight="bold">معتمد Platform</Text>
                <Text role="caption" tone="muted">يراجع ويعتمد</Text>
              </Surface>
              <Text role="bodyLg" tone="muted">→</Text>
              <Surface tone="brand" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="inverse" weight="bold">تطبيق Demo</Text>
                <Text role="caption" tone="inverse">تنفيذ المحاكاة</Text>
              </Surface>
            </Box>
          </Box>

          <Box gap={2}>
            <Text role="titleMd">التغييرات المالية (توقيع مزدوج مطلوب):</Text>
            <Box layoutDirection="row" gap={2} align="center" style={{ flexWrap: 'wrap' }}>
              <Surface tone="success" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="inverse" weight="bold">مشغّل Platform</Text>
                <Text role="caption" tone="inverse">يقدم الطلب</Text>
              </Surface>
              <Text role="bodyLg" tone="muted">→</Text>
              <Surface tone="warning" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="muted" weight="bold">معتمد Platform</Text>
                <Text role="caption" tone="muted">يراجع</Text>
              </Surface>
              <Text role="bodyLg" tone="muted">+</Text>
              <Surface tone="danger" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="inverse" weight="bold">معتمد مالي</Text>
                <Text role="caption" tone="inverse">توقيع مالي مطلوب (WLT-owned)</Text>
              </Surface>
              <Text role="bodyLg" tone="muted">→</Text>
              <Surface tone="brand" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="inverse" weight="bold">تطبيق</Text>
                <Text role="caption" tone="inverse">بعد الاعتمادين</Text>
              </Surface>
            </Box>
          </Box>

          <Box gap={2}>
            <Text role="titleMd">طوارئ / Rollback (بدون انتظار اعتماد):</Text>
            <Box layoutDirection="row" gap={2} align="center" style={{ flexWrap: 'wrap' }}>
              <Surface tone="danger" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="inverse" weight="bold">حاكم Platform</Text>
                <Text role="caption" tone="inverse">أو Super Admin</Text>
              </Surface>
              <Text role="bodyLg" tone="muted">→</Text>
              <Surface tone="warning" border padding={3} radiusToken="md">
                <Text role="bodySm" tone="muted" weight="bold">Rollback فوري</Text>
                <Text role="caption" tone="muted">بدون انتظار اعتماد</Text>
              </Surface>
            </Box>
          </Box>

          <Surface tone="danger" border padding={3} radiusToken="xl">
            <Box gap={2}>
              <Text role="titleMd" tone="danger">نموذج: حالة رفض الوصول</Text>
              <Text role="bodySm">
                إذا حاول مستخدم بدور "مراقب (Viewer)" تنفيذ تغيير في Platform:
              </Text>
              <Surface tone="default" border padding={3} radiusToken="md">
                <Box gap={1}>
                  <Text role="titleMd" tone="danger">⛔ وصول مرفوض</Text>
                  <Text role="bodySm">
                    ليس لديك صلاحية لتنفيذ هذا الإجراء. تواصل مع حاكم Platform للحصول على الصلاحية المطلوبة.
                  </Text>
                  <Text role="caption" tone="muted">
                    الصلاحية المطلوبة: request-change | دورك الحالي: Viewer
                  </Text>
                </Box>
              </Surface>
            </Box>
          </Surface>
        </Box>
      </WebSectionCard>
    </Box>
  );
}

function MakerCheckerPanel() {
  return (
    <Box gap={4}>
      <WebSectionCard
        title="مصفوفة maker / checker"
        description="المشغل يهيئ أو يطلب، والمعتمد يراجع، ومعتمد المالية يبقى مرجعيًا فقط عندما تظهر رؤية WLT."
      >
        <Box gap={3}>
          {DSH_MAKER_CHECKER_MATRIX.map((entry) => (
            <Surface key={`${entry.section}-${entry.actionId}`} tone="raised" border padding={3} radiusToken="xl">
              <Box gap={2}>
                <Text role="bodyStrong">{entry.actionLabel}</Text>
                <Text role="bodySm" tone="muted">
                  {`${getDshRoleArabicName(entry.makerRoleId)} → ${getDshRoleArabicName(entry.checkerRoleId)} · ${entry.section}`}
                </Text>
                <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
                  <Surface tone="inset" padding={1} radiusToken="pill" border={false}>
                    <Text role="caption" tone="muted">{entry.auditRequired ? 'audit required' : 'audit optional'}</Text>
                  </Surface>
                  <Surface tone="inset" padding={1} radiusToken="pill" border={false}>
                    <Text role="caption" tone="muted">{entry.reasonRequired ? 'reason required' : 'reason optional'}</Text>
                  </Surface>
                  <Surface tone="inset" padding={1} radiusToken="pill" border={false}>
                    <Text role="caption" tone="muted">{entry.evidenceRequired ? 'evidence required' : 'evidence optional'}</Text>
                  </Surface>
                  {entry.wltReadOnly ? (
                    <Surface tone="danger" padding={1} radiusToken="pill" border={false}>
                      <Text role="caption" tone="inverse">WLT read-only</Text>
                    </Surface>
                  ) : null}
                </Box>
              </Box>
            </Surface>
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="سياسات السبب والإثبات وتصدير السجل"
        description="كل سياسة تحدد أين يجب أن يظهر السبب، متى يصبح الإثبات إلزاميًا، وما صيغة export preview المقصودة."
      >
        <Box gap={3}>
          {DSH_REASON_EVIDENCE_POLICY.map((policy) => (
            <Surface key={policy.policyId} tone="default" border padding={3} radiusToken="lg">
              <Box gap={1}>
                <Text role="bodyStrong">{policy.title}</Text>
                <Text role="bodySm" tone="muted">
                  {policy.appliesToSections.join(' · ')}
                </Text>
                <Text role="caption" tone="muted">
                  {`${policy.reasonRequired ? 'reason required' : 'reason optional'} · ${policy.evidenceRequired ? 'evidence required' : 'evidence optional'} · export: ${policy.exportPreviewLabel}`}
                </Text>
              </Box>
            </Surface>
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ControlPanelDshAdministrationScreen() {
  const administrationGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('administration'), []);
  const platformGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('platform'), []);
  const [activeWorkspace, setActiveWorkspace] = React.useState<AdminWorkspaceId>('overview');
  const activeTab = WORKSPACE_TABS.find((w) => w.id === activeWorkspace);

  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <div className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>الإدارة والصلاحيات</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>التحكم بالوصول إلى Platform</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              للمسؤولين المفوّضين فقط — تحديد من يرى Platform ومن يعتمد التغييرات ومن ينفذها.
            </p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>الأدوار</span>
              <span className={styles.commandKpiValue}>6</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المستخدمون</span>
              <span className={styles.commandKpiValue}>5</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>نمط المرحلة</span>
              <span className={styles.commandKpiValue}>وضع تجريبي (Demo)</span>
            </div>
          </div>
        </div>
      </header>

      <Box paddingX={4} paddingY={3}>
        <Surface tone="warning" border padding={3} radiusToken="md">
          <Text role="bodySm" tone="warning" align="center">
            وضع تجريبي: جميع الإجراءات محاكاة محلية فقط. لا يتم تعديل صلاحيات حقيقية أو حسابات مستخدمين.
          </Text>
        </Surface>
      </Box>

      <WebControlPanelKpiStrip
        items={[
          { id: 'workspace', label: 'المجال الحالي', value: activeTab?.label ?? '—', tone: 'success' },
          { id: 'scope', label: 'النطاق', value: 'صلاحيات Platform فقط', tone: 'neutral' },
          { id: 'mode', label: 'نمط المرحلة', value: 'محاكاة محلية (Demo)', tone: 'warning' },
          { id: 'real-auth', label: 'Auth حقيقي', value: 'لا يوجد — Mock فقط', tone: 'danger' },
        ]}
      />

      <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
        <WebControlPanelWorkspaceTabs
          ariaLabel="مساحات الإدارة والصلاحيات"
          items={WORKSPACE_TABS.map((w) => ({
            id: w.id,
            label: w.label,
            badge: w.badge,
            active: w.id === activeWorkspace,
          }))}
          onSelect={(id) => setActiveWorkspace(id as AdminWorkspaceId)}
        />
      </div>

      <Box paddingX={4} paddingY={2}>
        <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Surface tone="inset" padding={3} gap={1} style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">ملكية الإدارة</Text>
            <Text role="bodySm" tone="muted">
              {administrationGovernance?.notes ?? 'الإدارة تملك الأدوار والصلاحيات وسلسلة الاعتماد فقط، ولا تتحول إلى مخزن لمنطق DSH التشغيلي.'}
            </Text>
            <Text role="caption" tone="muted">
              {administrationGovernance?.onDemandPolicySummary ?? 'اعرض الملخص أولًا، مع تفاصيل دورية عند الفتح فقط.'}
            </Text>
          </Surface>
          <Surface tone="default" padding={3} gap={1} style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">صلة المنصة</Text>
            <Text role="bodySm" tone="muted">
              {`صلاحيات هذه الشاشة تضبط من يرى ${platformGovernance?.sectionLabel ?? 'Platform'} ومن يعتمد تغييراته، لكنها لا تنفذ تغييرات platform أو DSH اليومية.`}
            </Text>
            <Text role="caption" tone="muted">
              كل الإجراءات هنا محاكاة UI فقط، بلا auth أو provider mutation حقيقي.
            </Text>
          </Surface>
        </Box>
      </Box>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box gap={3}>
            {activeWorkspace === 'overview' && <OverviewPanel />}
            {activeWorkspace === 'roles' && <RolesPanel />}
            {activeWorkspace === 'users' && <UsersPanel />}
            {activeWorkspace === 'approval-chain' && <ApprovalChainPanel />}
            {activeWorkspace === 'maker-checker' && <MakerCheckerPanel />}
            {activeWorkspace === 'sensitive-decisions' && <SensitiveDecisionsPanel />}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshAdministrationScreen;
