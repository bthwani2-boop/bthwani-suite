"use client";

import React, { type ReactNode } from 'react';
import styles from './BthWebCommandCenterFrame.module.css';
import { BthWebCommandStrip } from './BthWebCommandStrip';

export type BthWebCommandCenterFilter = {
  id: string;
  label: string;
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
  railStatusLabel?: string;
  railItems: ReadonlyArray<BthWebCommandCenterNavItem>;
  railSupplementary?: ReactNode;
  children?: ReactNode;
};

function renderRailItems(
  items: ReadonlyArray<BthWebCommandCenterNavItem>,
  onRailItemSelect?: (itemId: string) => void,
) {
  return (
    <nav className={styles.railNav} aria-label="Control panel sections">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onRailItemSelect?.(item.id)}
          className={[styles.railLink, item.active ? styles.railLinkActive : ''].filter(Boolean).join(' ')}
        >
          <span className={styles.railLinkTitle}>{item.label}</span>
          {item.description ? <span className={styles.railLinkDescription}>{item.description}</span> : null}
          {item.badge ? <span className={styles.railBadge}>{item.badge}</span> : null}
        </button>
      ))}
    </nav>
  );
}

export function BthWebCommandCenterFrame({
  brandLabel,
  surfaceTitle,
  surfaceSubtitle,
  searchPlaceholder = 'ابحث عن مهمة أو أمر سريع',
  languageLabel = 'AR',
  alertCountLabel = '1',
  refreshLabel = 'تحديث',
  topFilters = [],
  onTopFilterSelect,
  onBrandClick,
  onSearchClick,
  onRefreshClick,
  onLanguageClick,
  onAlertClick,
  onRailItemSelect,
  railTitle,
  railStatusLabel,
  railItems,
  railSupplementary,
  children,
}: BthWebCommandCenterFrameProps) {
  return (
    <main className={styles.root}>
      <BthWebCommandStrip
        brandLabel={brandLabel}
        searchPlaceholder={searchPlaceholder}
        languageLabel={languageLabel}
        alertCountLabel={alertCountLabel}
        refreshLabel={refreshLabel}
        filters={topFilters}
        onFilterSelect={onTopFilterSelect}
        onBrandClick={onBrandClick}
        onSearchClick={onSearchClick}
        onRefreshClick={onRefreshClick}
        onLanguageClick={onLanguageClick}
        onAlertClick={onAlertClick}
      />

      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>{brandLabel}</p>
        <h1 className={styles.heroTitle}>{surfaceTitle}</h1>
        {surfaceSubtitle ? <p className={styles.heroSubtitle}>{surfaceSubtitle}</p> : null}
      </section>

      <div className={styles.workspace}>
        <section className={styles.stage}>{children}</section>

        <aside className={styles.rail}>
          <div className={styles.railHeader}>
            <h2 className={styles.railTitle}>{railTitle}</h2>
            {railStatusLabel ? <span className={styles.railStatus}>{railStatusLabel}</span> : null}
          </div>
          {renderRailItems(railItems, onRailItemSelect)}
          {railSupplementary ? <div className={styles.railSupplementary}>{railSupplementary}</div> : null}
        </aside>
      </div>
    </main>
  );
}

export default BthWebCommandCenterFrame;