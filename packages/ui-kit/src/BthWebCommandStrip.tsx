"use client";

import React from 'react';
import { useDirection, useUiLanguage, useUiText } from './hooks';
import styles from './BthWebCommandStrip.module.css';

export type BthWebCommandStripFilter = {
  id: string;
  label: string;
  icon?: string;
  metaLabel?: string;
  active?: boolean;
};

export type BthWebCommandStripProps = {
  brandLabel: string;
  searchPlaceholder?: string;
  languageLabel?: string;
  alertCountLabel?: string;
  refreshLabel?: string;
  filters?: ReadonlyArray<BthWebCommandStripFilter>;
  onFilterSelect?: (filterId: string) => void;
  onBrandClick?: () => void;
  onSearchClick?: () => void;
  onRefreshClick?: () => void;
  onLanguageClick?: () => void;
  onAlertClick?: () => void;
};

function renderFilters(
  filters: ReadonlyArray<BthWebCommandStripFilter>,
  onFilterSelect?: (filterId: string) => void,
) {
  return (
    <div className={styles.filterRow}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onFilterSelect?.(filter.id)}
          className={[styles.filterChip, filter.active ? styles.filterChipActive : '']
            .filter(Boolean)
            .join(' ')}
        >
          {filter.icon ? <span className={styles.filterChipIcon}>{filter.icon}</span> : null}
          <span className={styles.filterChipLabel}>{filter.label}</span>
          {filter.metaLabel ? <span className={styles.filterChipMeta}>{filter.metaLabel}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function BthWebCommandStrip({
  brandLabel,
  searchPlaceholder,
  languageLabel,
  alertCountLabel = '1',
  refreshLabel,
  filters = [],
  onFilterSelect,
  onBrandClick,
  onSearchClick,
  onRefreshClick,
  onLanguageClick,
  onAlertClick,
}: BthWebCommandStripProps) {
  const { direction } = useDirection();
  const { toggleLanguage } = useUiLanguage();
  const uiText = useUiText();
  const panelText = uiText.controlPanel;
  const resolvedSearchPlaceholder = searchPlaceholder ?? panelText.ui.searchPlaceholder;
  const resolvedLanguageLabel = languageLabel ?? panelText.ui.languageLabel;
  const resolvedRefreshLabel = refreshLabel ?? panelText.ui.refreshLabel;
  const resolvedLanguageClick = onLanguageClick ?? toggleLanguage;

  return (
    <header className={styles.topBar} dir={direction}>
      <div className={styles.topRowPrimary}>
        <div className={styles.identityCluster}>
          <button type="button" className={styles.brandPill} onClick={onBrandClick}>
            {brandLabel}
          </button>
          <button type="button" className={styles.alertPill} onClick={onAlertClick}>
            {alertCountLabel}
          </button>
          <button type="button" className={styles.languagePill} onClick={resolvedLanguageClick}>
            {resolvedLanguageLabel}
          </button>
        </div>

        <button type="button" className={styles.searchCluster} onClick={onSearchClick}>
          <span className={styles.searchIcon}>⌕</span>
          <span className={styles.searchPlaceholder}>{resolvedSearchPlaceholder}</span>
        </button>
      </div>

      <div className={styles.topRowSecondary}>
        <button type="button" className={styles.refreshButton} onClick={onRefreshClick}>
          {resolvedRefreshLabel}
        </button>
        {filters.length > 0 ? renderFilters(filters, onFilterSelect) : null}
      </div>
    </header>
  );
}

export default BthWebCommandStrip;