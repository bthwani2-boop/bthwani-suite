import React, { type ReactNode } from 'react';
import styles from './BthWebPageFrame.module.css';

export type BthWebPageFrameProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  centered?: boolean;
  maxWidth?: number;
  children?: ReactNode;
};

export function BthWebPageFrame({
  title,
  description,
  eyebrow,
  centered = false,
  maxWidth = 960,
  children,
}: BthWebPageFrameProps) {
  const contentClassName = [
    styles.content,
    centered ? styles.contentCentered : '',
    maxWidth <= 880 ? styles.widthNarrow : '',
    maxWidth > 880 && maxWidth <= 920 ? styles.widthCompact : '',
    maxWidth > 920 && maxWidth < 1000 ? styles.widthRegular : '',
    maxWidth >= 1000 ? styles.widthWide : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className={[styles.main, centered ? styles.mainCentered : ''].filter(Boolean).join(' ')}>
      <div className={contentClassName}>
        {eyebrow ? (
          <p className={styles.eyebrow}>{eyebrow}</p>
        ) : null}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </main>
  );
}