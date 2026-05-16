'use client';

import React from 'react';
import { Box, Surface, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelWorkspaceTabs,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { DshPlatformVarsWorkspace } from './Vars';
import { DshPlatformAppearanceWorkspace } from './Appearance';
import styles from '../shared/control-panel-surface.module.css';

type PlatformWorkspaceId = 'vars' | 'appearance' | 'contracts' | 'release-gates' | 'provider-topology';

type PlatformWorkspaceCard = {
  id: PlatformWorkspaceId;
  label: string;
  badge: string;
  description: string;
  note: string;
  active: boolean;
};

const PLATFORM_WORKSPACES: readonly PlatformWorkspaceCard[] = [
  {
    id: 'vars',
    label: 'Vars',
    badge: 'نشط الآن',
    description: 'غرفة تحكم preview لملكية المتغيرات التشغيلية والمالية والجسور ومزودي الخدمة.',
    note: 'هذه هي الـ workspace الوحيدة المفعلة في هذه المرحلة.',
    active: true,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    badge: 'نشط الآن',
    description: 'غرفة تحكم preview للمظهر والهوية البصرية والنظام المركزي للألوان.',
    note: 'مساحة لإدارة appearance overrides بشكل محكوم بدون drift.',
    active: true,
  },
  {
    id: 'contracts',
    label: 'Contracts',
    badge: 'لاحقًا',
    description: 'عقود الربط والاعتماد بين DSH وWLT وProvider عندما نغادر UI/UX flow.',
    note: 'غير مفعلة الآن لأن هذه المرحلة لا تشمل binding أو runtime truth.',
    active: false,
  },
  {
    id: 'release-gates',
    label: 'Release Gates',
    badge: 'لاحقًا',
    description: 'حواجز اعتماد وتشغيل وإطلاق لاحق مرتبطة بأدلة وقيود تنفيذية.',
    note: 'تُعرض كاتجاه توسع فقط بدون أي إجراءات حية.',
    active: false,
  },
  {
    id: 'provider-topology',
    label: 'Provider Topology',
    badge: 'لاحقًا',
    description: 'خرائط علاقات وقدرات المزودين وأوضاع fallback عندما يُفتح نطاق provider binding.',
    note: 'حالياً يظهر هذا المعنى داخل Vars كـ preview cards فقط.',
    active: false,
  },
] as const;

const ACTIVE_WORKSPACE_ID: PlatformWorkspaceId = 'vars';

function WorkspaceTeaserCard({ label, badge, description, note, active }: PlatformWorkspaceCard) {
  return (
    <Surface
      tone="raised"
      border
      padding={3}
      radiusToken="xl"
      style={{ flexGrow: 1, flexBasis: 260, minWidth: 0 }}
    >
      <Box gap={2}>
        <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', rowGap: 8 }}>
          <Text role="titleMd">{label}</Text>
          <Surface
            tone={active ? 'brand' : 'default'}
            padding={1}
            radiusToken="pill"
            border={false}
          >
            <Text role="caption" tone={active ? 'inverse' : 'muted'}>{badge}</Text>
          </Surface>
        </Box>
        <Text role="bodySm">{description}</Text>
        <Text role="caption" tone="muted">{note}</Text>
      </Box>
    </Surface>
  );
}

export function ControlPanelDshPlatformScreen() {
  const [activeWorkspace, setActiveWorkspace] = React.useState<PlatformWorkspaceId>(ACTIVE_WORKSPACE_ID);

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
              <h1 className={styles.surfaceHeaderTitle}>منصة DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>UI/UX Preview</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>مساحة عامة قابلة للتوسع. المفعّل الآن: Vars و Appearance.</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المساحات</span>
              <span className={styles.commandKpiValue}>{String(PLATFORM_WORKSPACES.length)}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>النشطة</span>
              <span className={styles.commandKpiValue}>2</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>الحقيقة المالية</span>
              <span className={styles.commandKpiValue}>WLT</span>
            </div>
          </div>
        </div>
      </header>

      <WebControlPanelKpiStrip
        items={[
          { id: 'active-workspace', label: 'المجال الحالي', value: activeWorkspace === 'appearance' ? 'Appearance' : 'Vars', tone: 'success' },
          { id: 'platform-mode', label: 'نمط المرحلة', value: 'UI/UX flow', tone: 'neutral' },
          { id: 'financial-owner', label: 'المالي المالك', value: 'WLT only', tone: 'warning' },
          { id: 'mutations', label: 'الأزرار الحية', value: 'Disabled', tone: 'danger' },
        ]}
      />

      <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
        <WebControlPanelWorkspaceTabs
          ariaLabel="مساحات منصة DSH"
          items={PLATFORM_WORKSPACES.map((workspace) => ({
            id: workspace.id,
            label: workspace.label,
            badge: workspace.active ? 'نشط' : 'لاحقًا',
            active: workspace.id === activeWorkspace,
          }))}
          onSelect={(workspaceId) => {
            if (workspaceId === 'vars' || workspaceId === 'appearance') {
              setActiveWorkspace(workspaceId as PlatformWorkspaceId);
            }
          }}
        />
      </div>

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box gap={3}>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
                <WebSignalCard
                  title="Workspace فعالة"
                  value="Vars & Appearance"
                  description="كل الشاشات التالية preview control room بدون binding أو runtime truth."
                  tone="best"
                />
              </Box>
              <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
                <WebSignalCard
                  title="الملكية المالية"
                  value="WLT bridge"
                  description="DSH يعرض المتغيرات المالية كجسر فقط ولا يملك الحقيقة المحاسبية."
                  tone="warning"
                />
              </Box>
              <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
                <WebSignalCard
                  title="سلوك التنفيذ"
                  value="Preview only"
                  description="أزرار Apply / Save / Activate / Rollback معطلة ومؤجلة لمرحلة لاحقة."
                  tone="brand"
                />
              </Box>
            </Box>

            <WebSectionCard
              title="خريطة مساحات Platform"
              description="Platform مساحة عامة للتوسع لاحقًا، والمساحات المفعّلة الآن هي Vars و Appearance."
            >
              <Box gap={2}>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  {PLATFORM_WORKSPACES.map((workspace) => (
                    <WorkspaceTeaserCard key={workspace.id} {...workspace} />
                  ))}
                </Box>
                <Text role="caption" tone="muted">
                  أي مساحة غير Vars تظهر هنا كاتجاه IA فقط، ولا تفتح تدفقًا أو تنفيذًا في هذه المرحلة.
                </Text>
              </Box>
            </WebSectionCard>

            {activeWorkspace === 'vars' ? <DshPlatformVarsWorkspace /> : null}
            {activeWorkspace === 'appearance' ? <DshPlatformAppearanceWorkspace /> : null}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshPlatformScreen;
