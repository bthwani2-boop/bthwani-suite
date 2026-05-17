import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebControlActionCard, WebControlDisclosureItem, WebControlPanelKpiStrip, WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard } from './ControlPanelDshDecisionBoard';
import type { DshUnifiedRecommendation } from './recommendation.preview-data';
import styles from '../shared/control-panel-surface.module.css';

type WorkspaceSignal = {
  id: string;
  title: string;
  value: string;
  description: string;
  tone?: React.ComponentProps<typeof WebSignalCard>['tone'];
};

type WorkspaceAction = {
  id: string;
  label: string;
  description: string;
  href?: string;
  badge?: string;
  tone?: 'primary' | 'secondary';
  onAction?: () => void;
};

type WorkspaceDisclosure = {
  id: string;
  label: string;
  description: string;
  href?: string;
  badge?: string;
  onAction?: () => void;
};

export type ControlPanelDshWorkspaceFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  badges?: readonly string[];
  metaItems?: readonly string[];
  primaryAction?: { label: string; href?: string; onAction?: () => void };
  secondaryAction?: { label: string; href?: string; onAction?: () => void };
  signals?: readonly WorkspaceSignal[];
  actions?: readonly WorkspaceAction[];
  disclosures?: readonly WorkspaceDisclosure[];
  decisionBoard?: {
    title: string;
    purpose: string;
    primaryDecision: string;
    nextAction: string;
    blockers: string;
    ownerSurface: string;
    evidenceHint: string;
    routeHint: string;
    decisionTone?: React.ComponentProps<typeof WebSignalCard>['tone'];
    recommendation?: DshUnifiedRecommendation;
  };
  footerNote?: string;
};

export function ControlPanelDshWorkspaceFrame({
  eyebrow,
  title,
  description,
  badges = ['DSH'],
  metaItems = [],
  primaryAction,
  secondaryAction,
  signals = [],
  actions = [],
  disclosures = [],
  decisionBoard,
  footerNote,
}: ControlPanelDshWorkspaceFrameProps) {
  return (
    <div className={styles.surfaceCockpit}>
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <span className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>{title}</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <Text role="caption" style={{ color: theme.brand, fontSize: 9, fontWeight: '800' }}>{badges[0] ?? 'DSH'}</Text>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>{description}</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المجال</span>
              <span className={styles.commandKpiValue} style={{ fontSize: '12px' }}>{eyebrow}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>الوسوم</span>
              <span className={styles.commandKpiValue}>{badges.length}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المعطيات</span>
              <span className={styles.commandKpiValue}>{metaItems.length}</span>
            </div>
          </div>
        </div>
      </header>

      <WebControlPanelKpiStrip
        items={[
          { id: 'eyebrow', label: 'المساحة', value: eyebrow, tone: 'neutral' },
          { id: 'badges', label: 'الوسوم', value: String(badges.length), tone: 'success' },
          { id: 'meta', label: 'البيانات', value: String(metaItems.length), tone: 'warning' },
        ]}
      />

      {metaItems.length ? (
        <div className={styles.filterDock}>
          {metaItems.map((item) => (
            <span key={item} className={styles.surfaceMetaChip}>
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box gap={3}>
            {signals.length ? (
              <Box gap={2}>
                {signals.map((signal) => (
                  <WebSignalCard key={signal.id} title={signal.title} value={signal.value} description={signal.description} tone={signal.tone} />
                ))}
              </Box>
            ) : null}

            {decisionBoard ? (
              <ControlPanelDshDecisionBoard
                title={decisionBoard.title}
                purpose={decisionBoard.purpose}
                primaryDecision={decisionBoard.primaryDecision}
                nextAction={decisionBoard.nextAction}
                blockers={decisionBoard.blockers}
                ownerSurface={decisionBoard.ownerSurface}
                evidenceHint={decisionBoard.evidenceHint}
                routeHint={decisionBoard.routeHint}
                decisionTone={decisionBoard.decisionTone}
                recommendation={decisionBoard.recommendation}
              />
            ) : null}

            {actions.length ? (
              <WebSectionCard title="الخطوات السريعة" description="حافظ على الواجهة قصيرة وقرارها واضحًا.">
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  {actions.map((action) => (
                    <Box key={action.id} style={{ flexGrow: 1, flexBasis: 240 }}>
                      <WebControlActionCard
                        id={action.id}
                        title={action.label}
                        description={action.description}
                        footerLabel={action.badge ?? 'فتح'}
                        href={action.href}
                        tone={action.tone}
                        onAction={action.onAction}
                      />
                    </Box>
                  ))}
                </Box>
              </WebSectionCard>
            ) : null}

            {disclosures.length ? (
              <WebSectionCard title="التفاصيل المتدرجة" description="افتح ما تحتاجه فقط، واترك باقي السطح مطويًا.">
                <Box gap={2}>
                  {disclosures.map((item) => (
                    <WebControlDisclosureItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      description={item.description}
                      href={item.href}
                      badge={item.badge}
                      onAction={item.onAction}
                    />
                  ))}
                </Box>
              </WebSectionCard>
            ) : null}

            {footerNote ? <Text role="bodySm" tone="muted">{footerNote}</Text> : null}
          </Box>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshWorkspaceFrame;
