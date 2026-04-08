import React from 'react';
import { BthWebPageFrame, BthWebSectionCard } from '@bthwani/ui-kit';
import styles from '../shared-web-shell.module.css';

const primarySections = [
  { href: '/dashboard', label: 'Dashboard', description: 'System-wide operating overview and decision visibility.' },
  { href: '/operations', label: 'Operations', description: 'Execution flow, operational throughput, and incident routing.' },
  { href: '/finance', label: 'Finance', description: 'Financial monitoring, controls, and reconciliation surfaces.' },
  { href: '/catalogs', label: 'Catalogs', description: 'Service, product, and structural catalog governance.' },
  { href: '/support', label: 'Support', description: 'Support queues, issue handling, and customer recovery paths.' },
  { href: '/partners', label: 'Partners', description: 'Partner-facing coordination, health, and operating readiness.' },
  { href: '/marketing', label: 'Marketing', description: 'Campaign and growth operations under the shared shell system.' },
  { href: '/control', label: 'Control', description: 'Platform control functions and internal governance surfaces.' },
] as const;

const controlSubSections = [
  { href: '/control/platform', label: 'Platform', description: 'Platform controls, tooling, and technical operating baselines.' },
  { href: '/control/administration', label: 'Administration', description: 'Administrative controls and internal operating workflows.' },
  { href: '/control/governance', label: 'Governance', description: 'Governance evidence, policy surfaces, and execution discipline.' },
  { href: '/control/hr', label: 'HR', description: 'People operations, staffing context, and workforce controls.' },
] as const;

type ControlPanelSectionId = 'dashboard' | 'operations' | 'finance' | 'catalogs' | 'support' | 'partners' | 'marketing' | 'control';
type ControlPanelSubSectionId = 'platform' | 'administration' | 'governance' | 'hr';

export type ControlPanelWebShellProps = {
  section?: ControlPanelSectionId;
  subsection?: ControlPanelSubSectionId;
};

function renderLinks(
  items: ReadonlyArray<{ href: string; label: string; description: string }>,
  activeHref?: string,
) {
  return (
    <div className={styles.linkGrid}>
      {items.map((item) => {
        const isActive = item.href === activeHref;

        return (
          <a
            key={item.href}
            href={item.href}
            className={[styles.navLink, isActive ? styles.navLinkActive : ''].filter(Boolean).join(' ')}
          >
            <strong className={styles.navLabel}>{item.label}</strong>
            <span className={styles.navDescription}>{item.description}</span>
          </a>
        );
      })}
    </div>
  );
}

function resolveShellCopy(section?: ControlPanelSectionId, subsection?: ControlPanelSubSectionId) {
  if (!section) {
    return {
      title: 'BThwani Control Panel',
      description: 'A governed control surface with centralized web framing, shared baseline styling, and route-level composition only.',
      activeHref: undefined,
    };
  }

  if (section !== 'control') {
    const activeSection = primarySections.find((item) => item.href === `/${section}`);

    return {
      title: activeSection?.label ?? 'BThwani Control Panel',
      description: activeSection?.description ?? 'Control-panel section shell.',
      activeHref: activeSection?.href,
    };
  }

  if (!subsection) {
    return {
      title: 'Control',
      description: 'Internal control domain for platform-level oversight, administration, governance, and people operations.',
      activeHref: '/control',
    };
  }

  const activeSubSection = controlSubSections.find((item) => item.href === `/control/${subsection}`);

  return {
    title: `Control / ${activeSubSection?.label ?? subsection}`,
    description: activeSubSection?.description ?? 'Control subsection shell.',
    activeHref: activeSubSection?.href,
  };
}

export function ControlPanelWebShell({ section, subsection }: ControlPanelWebShellProps) {
  const shellCopy = resolveShellCopy(section, subsection);

  return (
    <BthWebPageFrame
      eyebrow="BThwani Control Panel"
      title={shellCopy.title}
      description={shellCopy.description}
      maxWidth={1040}
    >
      <BthWebSectionCard
        title="Primary sections"
        description="Control-panel navigation now flows through a centralized web shell instead of local page-specific DOM scaffolding."
      >
        {renderLinks(primarySections, shellCopy.activeHref)}
      </BthWebSectionCard>

      <BthWebSectionCard
        title="Control subsections"
        description="Nested control routes stay thin while subsection framing remains consistent across the control domain."
      >
        {renderLinks(controlSubSections, shellCopy.activeHref)}
      </BthWebSectionCard>
    </BthWebPageFrame>
  );
}

export default ControlPanelWebShell;