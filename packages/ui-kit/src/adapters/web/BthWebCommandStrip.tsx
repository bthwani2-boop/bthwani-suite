"use client";

import React from 'react';
import styles from './BthWebCommandStrip.module.css';

export type BthWebCommandStripFilter = {
  id: string;
  label: string;
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
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export function BthWebCommandStrip({
  brandLabel,
  searchPlaceholder = 'ابحث عن مهمة أو أمر سريع',
  languageLabel = 'AR',
  alertCountLabel = '1',
  refreshLabel = 'تحديث',
  filters = [],
  onFilterSelect,
  onBrandClick,
  onSearchClick,
  onRefreshClick,
  onLanguageClick,
  onAlertClick,
}: BthWebCommandStripProps) {
  return (
    <header className={styles.topBar}>
      <div className={styles.topRowPrimary}>
        <div className={styles.identityCluster}>
          <button type="button" className={styles.brandPill} onClick={onBrandClick}>
            {brandLabel}
          </button>
          <button type="button" className={styles.alertPill} onClick={onAlertClick}>
            {alertCountLabel}
          </button>
          <button type="button" className={styles.languagePill} onClick={onLanguageClick}>
            {languageLabel}
          </button>
        </div>

        <button type="button" className={styles.searchCluster} onClick={onSearchClick}>
          <span className={styles.searchIcon}>⌕</span>
          <span className={styles.searchPlaceholder}>{searchPlaceholder}</span>
        </button>
      </div>

      <div className={styles.topRowSecondary}>
        <button type="button" className={styles.refreshButton} onClick={onRefreshClick}>
          {refreshLabel}
        </button>
        {filters.length > 0 ? renderFilters(filters, onFilterSelect) : null}
      </div>
    </header>
  );
}

export default BthWebCommandStrip;