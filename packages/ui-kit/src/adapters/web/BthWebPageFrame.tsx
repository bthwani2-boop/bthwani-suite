import React, { type ReactNode } from 'react';
import styles from './BthWebPageFrame.module.css';

export type BthWebPageFrameProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  centered?: boolean;
  maxWidth?: number;
  embedded?: boolean;
  showHeader?: boolean;
  children?: ReactNode;
};

export function BthWebPageFrame({
  title,
  description,
  eyebrow,
  centered = false,
  maxWidth = 960,
  embedded = false,
  showHeader = true,
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
    <div className={[
      embedded ? styles.mainEmbedded : styles.main,
      centered ? styles.mainCentered : '',
    ].filter(Boolean).join(' ')}>
      <div className={contentClassName}>
        {showHeader && eyebrow ? (
          <p className={styles.eyebrow}>{eyebrow}</p>
        ) : null}
        {showHeader ? (
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{title}</h1>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}