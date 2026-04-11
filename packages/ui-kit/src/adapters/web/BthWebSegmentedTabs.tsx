import React from 'react';
import styles from './BthWebSegmentedTabs.module.css';

export type BthWebSegmentedTabItem = {
  id: string;
  label: string;
  metaLabel?: string;
  active?: boolean;
};

export type BthWebSegmentedTabsProps = {
  items: ReadonlyArray<BthWebSegmentedTabItem>;
  ariaLabel: string;
  onSelect?: (itemId: string) => void;
};

export function BthWebSegmentedTabs({ items, ariaLabel, onSelect }: BthWebSegmentedTabsProps) {
  return (
    <div className={styles.root} aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={[styles.tab, item.active ? styles.tabActive : ''].filter(Boolean).join(' ')}
          onClick={() => onSelect?.(item.id)}
        >
          <span className={styles.label}>{item.label}</span>
          {item.metaLabel ? <span className={styles.meta}>{item.metaLabel}</span> : null}
        </button>
      ))}
    </div>
  );
}

export default BthWebSegmentedTabs;