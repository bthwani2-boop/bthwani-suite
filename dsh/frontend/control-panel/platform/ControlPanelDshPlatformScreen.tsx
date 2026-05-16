'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelWorkspaceTabs,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { DshPlatformVarsWorkspace } from './Vars';
import { DshPlatformAppearanceWorkspace } from './Appearance';
import { DshPlatformServicesWorkspace } from './Services';
import { DshPlatformProvidersWorkspace } from './Providers';
import styles from '../shared/control-panel-surface.module.css';

type ActiveWorkspaceId = 'overview' | 'services' | 'vars' | 'providers' | 'appearance';
type TeaserWorkspaceId = 'rollouts' | 'health' | 'audit';
type PlatformWorkspaceId = ActiveWorkspaceId | TeaserWorkspaceId;

type WorkspaceTab = {
  id: PlatformWorkspaceId;
  label: string;
  badge: string;
  active: boolean;
};

const WORKSPACE_TABS: readonly WorkspaceTab[] = [
  { id: 'overview', label: 'نظرة عامة', badge: 'نشط', active: true },
  { id: 'services', label: 'الخدمات', badge: 'نشط', active: true },
  { id: 'vars', label: 'المتغيرات', badge: 'نشط', active: true },
  { id: 'providers', label: 'المزودون', badge: 'نشط', active: true },
  { id: 'appearance', label: 'المظهر', badge: 'نشط', active: true },
  { id: 'rollouts', label: 'الإطلاق التدريجي', badge: 'لاحقًا', active: false },
  { id: 'health', label: 'الصحة والأداء', badge: 'لاحقًا', active: false },
  { id: 'audit', label: 'السجل والتراجع', badge: 'لاحقًا', active: false },
] as const;

const ACTIVE_WORKSPACE_IDS: readonly ActiveWorkspaceId[] = [
  'overview',
  'services',
  'vars',
  'providers',
  'appearance',
];

function isActiveWorkspace(id: PlatformWorkspaceId): id is ActiveWorkspaceId {
  return (ACTIVE_WORKSPACE_IDS as readonly string[]).includes(id);
}

// ─── Overview panel ─────────────────────────────────────────────────────────

function OverviewPanel() {
  return (
    <Box gap={4}>
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="حالة المنصة"
            value="تشغيل طبيعي"
            description="المنصة تعمل بشكل طبيعي. لا تنبيهات حرجة."
            tone="best"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="الخدمات المفعّلة"
            value="4 من 4"
            description="جميع خدمات المنصة في وضع التشغيل أو التجريب."
            tone="success"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="المتغيرات الحساسة"
            value="بانتظار contract"
            description="المتغيرات المالية تبقى مملوكة لـ WLT وتحتاج عقد ربط قبل التفعيل."
            tone="warning"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="المزودون النشطون"
            value="5 مزودين"
            description="المزودون الافتراضيون على مستوى المنصة معرّفون. بيانات الاعتماد مُخفاة."
            tone="brand"
          />
        </Box>
      </Box>

      <WebSectionCard
        title="مساحات التحكم المتاحة"
        description="هذه لوحة التحكم السيادية للمنصة — مخصصة للمسؤولين المفوّضين فقط."
      >
        <Box gap={3}>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {WORKSPACE_TABS.filter((w) => w.active).map((w) => (
              <Surface
                key={w.id}
                tone="raised"
                border
                padding={3}
                radiusToken="xl"
                style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}
              >
                <Box gap={1}>
                  <Text role="titleMd">{w.label}</Text>
                  <Surface tone="brand" padding={1} radiusToken="pill" border={false}>
                    <Text role="caption" tone="inverse">
                      {w.badge}
                    </Text>
                  </Surface>
                </Box>
              </Surface>
            ))}
            {WORKSPACE_TABS.filter((w) => !w.active).map((w) => (
              <Surface
                key={w.id}
                tone="default"
                border
                padding={3}
                radiusToken="xl"
                style={{ flexGrow: 1, flexBasis: 200, minWidth: 0, opacity: 0.6 }}
              >
                <Box gap={1}>
                  <Text role="titleMd" tone="muted">
                    {w.label}
                  </Text>
                  <Surface tone="default" border padding={1} radiusToken="pill">
                    <Text role="caption" tone="muted">
                      {w.badge}
                    </Text>
                  </Surface>
                </Box>
              </Surface>
            ))}
          </Box>
          <Text role="caption" tone="muted">
            مرحلة UI/UX flow فقط — جميع أزرار التنفيذ الحي معطّلة. لا API ولا runtime ولا قاعدة
            بيانات في هذه المرحلة.
          </Text>
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="التكامل مع الأقسام المتخصصة"
        description="توضيح لصلاحيات الأقسام المجاورة. هذه الأقسام تُدار من مساحاتها الخاصة، ولا توجد شاشات تحكم لها داخل المنصة السيادية."
      >
        <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
          <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0, opacity: 0.8 }}>
            <Box gap={1}>
              <Text role="titleMd" tone="brand">الكتالوجات (Catalogs)</Text>
              <Text role="bodySm" tone="muted">
                يدير الفئات، المنتجات، والأقسام. يوفر البيانات المعروضة في الخدمات المفعلة.
              </Text>
            </Box>
          </Surface>
          <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0, opacity: 0.8 }}>
            <Box gap={1}>
              <Text role="titleMd" tone="brand">التسويق (Marketing)</Text>
              <Text role="bodySm" tone="muted">
                يدير الحملات، العروض، البنرات، برامج الولاء، والاشتراكات.
              </Text>
            </Box>
          </Surface>
          <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0, opacity: 0.8 }}>
            <Box gap={1}>
              <Text role="titleMd" tone="brand">الإدارة (Administration)</Text>
              <Text role="bodySm" tone="muted">
                يدير المستخدمين، الأدوار، وصلاحيات الوصول للوحة التحكم والمنصة.
              </Text>
            </Box>
          </Surface>
        </Box>
      </WebSectionCard>
    </Box>
  );
}

// ─── Teaser panel ────────────────────────────────────────────────────────────

function TeaserPanel({ label }: { label: string }) {
  return (
    <Surface tone="default" border padding={4} radiusToken="xl">
      <Box gap={2} align="center">
        <Text role="titleMd" tone="muted">
          {label}
        </Text>
        <Text role="bodySm" tone="muted">
          هذه المساحة ستُفتح في مرحلة runtime لاحقًا بعد اكتمال البنية التحتية والعقود.
        </Text>
        <Button variant="secondary" disabled>
          قريبًا
        </Button>
      </Box>
    </Surface>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function ControlPanelDshPlatformScreen() {
  const [activeWorkspace, setActiveWorkspace] =
    React.useState<PlatformWorkspaceId>('overview');

  const activeTab = WORKSPACE_TABS.find((w) => w.id === activeWorkspace);

  return (
    <div className={styles.surfaceCockpit}>
      {/* Top bar */}
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
                <span className={styles.surfaceHeaderBadgeText}>لوحة التحكم السيادية</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              للمسؤولين المفوّضين فقط — تحكم مركزي بالخدمات والمتغيرات والمزودين والمظهر.
            </p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المساحات</span>
              <span className={styles.commandKpiValue}>{String(WORKSPACE_TABS.length)}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>النشطة</span>
              <span className={styles.commandKpiValue}>
                {String(WORKSPACE_TABS.filter((w) => w.active).length)}
              </span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المالك المالي</span>
              <span className={styles.commandKpiValue}>WLT</span>
            </div>
          </div>
        </div>
      </header>

      {/* KPI strip */}
      <WebControlPanelKpiStrip
        items={[
          {
            id: 'active-workspace',
            label: 'المجال الحالي',
            value: activeTab?.label ?? '—',
            tone: 'success',
          },
          { id: 'platform-mode', label: 'نمط المرحلة', value: 'UI/UX flow', tone: 'neutral' },
          { id: 'financial-owner', label: 'المالك المالي', value: 'WLT bridge', tone: 'warning' },
          { id: 'mutations', label: 'أزرار التنفيذ', value: 'معطّلة', tone: 'danger' },
        ]}
      />

      {/* Workspace tabs */}
      <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
        <WebControlPanelWorkspaceTabs
          ariaLabel="مساحات منصة DSH"
          items={WORKSPACE_TABS.map((w) => ({
            id: w.id,
            label: w.label,
            badge: w.badge,
            active: w.id === activeWorkspace,
          }))}
          onSelect={(id) => {
            if (isActiveWorkspace(id as PlatformWorkspaceId)) {
              setActiveWorkspace(id as ActiveWorkspaceId);
            }
          }}
        />
      </div>

      {/* Main content */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box gap={3}>
            {activeWorkspace === 'overview' && <OverviewPanel />}
            {activeWorkspace === 'services' && <DshPlatformServicesWorkspace />}
            {activeWorkspace === 'vars' && <DshPlatformVarsWorkspace />}
            {activeWorkspace === 'providers' && <DshPlatformProvidersWorkspace />}
            {activeWorkspace === 'appearance' && <DshPlatformAppearanceWorkspace />}
            {activeWorkspace === 'rollouts' && <TeaserPanel label="الإطلاق التدريجي" />}
            {activeWorkspace === 'health' && <TeaserPanel label="الصحة والأداء" />}
            {activeWorkspace === 'audit' && <TeaserPanel label="السجل والتراجع" />}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshPlatformScreen;
