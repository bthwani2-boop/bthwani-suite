'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelWorkspaceTabs,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { ADMIN_ROLES, PLATFORM_PERMISSIONS, MOCK_USERS } from './administration.mock';
import type { AdminRole, MockAdminUser, AdminUserStatus } from './administration.types';
import styles from '../shared/control-panel-surface.module.css';

type AdminWorkspaceId = 'overview' | 'roles' | 'users' | 'approval-chain';

const WORKSPACE_TABS = [
  { id: 'overview' as AdminWorkspaceId, label: 'نظرة عامة', badge: '' },
  { id: 'roles' as AdminWorkspaceId, label: 'الأدوار والصلاحيات', badge: '' },
  { id: 'users' as AdminWorkspaceId, label: 'المستخدمون', badge: '' },
  { id: 'approval-chain' as AdminWorkspaceId, label: 'سلسلة الاعتماد', badge: '' },
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
          <Button variant="secondary" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'إخفاء الصلاحيات' : 'عرض الصلاحيات (تجريبي)'}
          </Button>
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
              <Box key={role.id} style={{ flexGrow: 1, minWidth: 72, textAlign: 'center' }}>
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
                  <Box key={role.id} style={{ flexGrow: 1, minWidth: 72, textAlign: 'center' }}>
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
              <Surface tone={role.tone} padding={1} radiusToken="pill" border={false} style={{ display: 'inline-flex', width: 'fit-content' }}>
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
                <Button variant="primary" onClick={() => handleConfirm(showConfirm)}>تأكيد المحاكاة</Button>
                <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
              </Box>
            </Box>
          </Surface>
        ) : (
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => setShowConfirm('تعيين دور (تجريبي)')}>تعيين دور (تجريبي)</Button>
            {currentStatus === 'pending' && (
              <Button variant="primary" onClick={() => setShowConfirm('تفعيل الوصول (تجريبي)')}>تفعيل الوصول (تجريبي)</Button>
            )}
            {currentStatus === 'active' && (
              <Button variant="danger" onClick={() => setShowConfirm('تعليق الوصول (تجريبي)')}>تعليق الوصول (تجريبي)</Button>
            )}
            {currentStatus === 'suspended' && (
              <Button variant="primary" onClick={() => setShowConfirm('إعادة تفعيل (تجريبي)')}>إعادة تفعيل (تجريبي)</Button>
            )}
          </Box>
        )}
      </Box>
    </Surface>
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

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ControlPanelDshAdministrationScreen() {
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

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box gap={3}>
            {activeWorkspace === 'overview' && <OverviewPanel />}
            {activeWorkspace === 'roles' && <RolesPanel />}
            {activeWorkspace === 'users' && <UsersPanel />}
            {activeWorkspace === 'approval-chain' && <ApprovalChainPanel />}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshAdministrationScreen;
