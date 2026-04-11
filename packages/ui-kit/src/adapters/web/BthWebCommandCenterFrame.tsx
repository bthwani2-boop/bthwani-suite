"use client";

import React, { type ReactNode } from 'react';
import { useUiText } from '../../hooks';
import styles from './BthWebCommandCenterFrame.module.css';
import { BthWebCommandStrip } from './BthWebCommandStrip';

export type BthWebCommandCenterFilter = {
  id: string;
  label: string;
  icon?: string;
  metaLabel?: string;
  active?: boolean;
};

export type BthWebCommandCenterNavItem = {
  id: string;
  label: string;
  href?: string;
  description?: string;
  badge?: string;
  active?: boolean;
};

export type BthWebCommandCenterFrameProps = {
  brandLabel: string;
  surfaceTitle: string;
  surfaceSubtitle?: string;
  showHero?: boolean;
  searchPlaceholder?: string;
  languageLabel?: string;
  alertCountLabel?: string;
  refreshLabel?: string;
  topFilters?: ReadonlyArray<BthWebCommandCenterFilter>;
  onTopFilterSelect?: (filterId: string) => void;
  onBrandClick?: () => void;
  onSearchClick?: () => void;
  onRefreshClick?: () => void;
  onLanguageClick?: () => void;
  onAlertClick?: () => void;
  onRailItemSelect?: (itemId: string) => void;
  railTitle: string;
  railNavigationLabel?: string;
  railStatusLabel?: string;
  railItems: ReadonlyArray<BthWebCommandCenterNavItem>;
  railSupplementary?: ReactNode;
  children?: ReactNode;
};

function renderRailItems(
  items: ReadonlyArray<BthWebCommandCenterNavItem>,
  railNavigationLabel: string,
  onRailItemSelect?: (itemId: string) => void,
) {
  return (
    <nav className={styles.railNav} aria-label={railNavigationLabel}>
      {items.map((item) => {
        const className = [styles.railLink, item.active ? styles.railLinkActive : ''].filter(Boolean).join(' ');

        if (item.href) {
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => {
                if (onRailItemSelect) {
                  event.preventDefault();
                }

                onRailItemSelect?.(item.id);
              }}
              className={className}
            >
              <span className={styles.railLinkTitle}>{item.label}</span>
              {item.description ? <span className={styles.railLinkDescription}>{item.description}</span> : null}
              {item.badge ? <span className={styles.railBadge}>{item.badge}</span> : null}
            </a>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onRailItemSelect?.(item.id)}
            className={className}
          >
            <span className={styles.railLinkTitle}>{item.label}</span>
            {item.description ? <span className={styles.railLinkDescription}>{item.description}</span> : null}
            {item.badge ? <span className={styles.railBadge}>{item.badge}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}

export function BthWebCommandCenterFrame({
  brandLabel,
  surfaceTitle,
  surfaceSubtitle,
  showHero = true,
  searchPlaceholder,
  languageLabel,
  alertCountLabel = '1',
  refreshLabel,
  topFilters = [],
  onTopFilterSelect,
  onBrandClick,
  onSearchClick,
  onRefreshClick,
  onLanguageClick,
  onAlertClick,
  onRailItemSelect,
  railTitle,
  railNavigationLabel,
  railStatusLabel,
  railItems,
  railSupplementary,
  children,
}: BthWebCommandCenterFrameProps) {
  const uiText = useUiText();
  const panelText = uiText.controlPanel;
  const resolvedSearchPlaceholder = searchPlaceholder ?? panelText.ui.searchPlaceholder;
  const resolvedLanguageLabel = languageLabel ?? panelText.ui.languageLabel;
  const resolvedRefreshLabel = refreshLabel ?? panelText.ui.refreshLabel;
  const resolvedRailNavigationLabel = railNavigationLabel ?? panelText.ui.railNavigationLabel;

  return (
    <main className={styles.root}>
      <BthWebCommandStrip
        brandLabel={brandLabel}
        searchPlaceholder={resolvedSearchPlaceholder}
        languageLabel={resolvedLanguageLabel}
        alertCountLabel={alertCountLabel}
        refreshLabel={resolvedRefreshLabel}
        filters={topFilters}
        onFilterSelect={onTopFilterSelect}
        onBrandClick={onBrandClick}
        onSearchClick={onSearchClick}
        onRefreshClick={onRefreshClick}
        onLanguageClick={onLanguageClick}
        onAlertClick={onAlertClick}
      />

      {showHero ? (
        <section className={styles.hero}>
          <p className={styles.heroEyebrow}>{brandLabel}</p>
          <h1 className={styles.heroTitle}>{surfaceTitle}</h1>
          {surfaceSubtitle ? <p className={styles.heroSubtitle}>{surfaceSubtitle}</p> : null}
        </section>
      ) : null}

      <div className={styles.workspace}>
        <section className={styles.stage}>{children}</section>

        <aside className={styles.rail}>
          <div className={styles.railHeader}>
            <h2 className={styles.railTitle}>{railTitle}</h2>
            {railStatusLabel ? <span className={styles.railStatus}>{railStatusLabel}</span> : null}
          </div>
          {renderRailItems(railItems, resolvedRailNavigationLabel, onRailItemSelect)}
          {railSupplementary ? <div className={styles.railSupplementary}>{railSupplementary}</div> : null}
        </aside>
      </div>
    </main>
  );
}

export default BthWebCommandCenterFrame;