"use client";

import React from 'react';
import styles from './BthWebRailServiceList.module.css';

export type BthWebRailServiceItem = {
  id: string;
  label: string;
  status?: string;
};

export type BthWebRailServiceListProps = {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  selectedServiceId?: string;
  onServiceSelect?: (serviceId: string) => void;
  items: ReadonlyArray<BthWebRailServiceItem>;
};

export function BthWebRailServiceList({
  title,
  searchPlaceholder = 'بحث سريع...',
  searchValue = '',
  onSearchChange,
  selectedServiceId,
  onServiceSelect,
  items,
}: BthWebRailServiceListProps) {
  const visibleItems = React.useMemo(() => {
    const value = searchValue.trim().toLowerCase();

    if (!value) return items;

    return items.filter((item) => item.label.toLowerCase().includes(value));
  }, [items, searchValue]);

  return (
    <section className={styles.root}>
      <h3 className={styles.title}>{title}</h3>
      <input
        className={styles.search}
        type="search"
        value={searchValue}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder={searchPlaceholder}
      />
      <div className={styles.list}>
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onServiceSelect?.(item.id)}
            className={[styles.item, selectedServiceId === item.id ? styles.itemActive : ''].filter(Boolean).join(' ')}
          >
            <span className={styles.itemLabel}>{item.label}</span>
            {item.status ? <span className={styles.itemStatus}>{item.status}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}

export default BthWebRailServiceList;