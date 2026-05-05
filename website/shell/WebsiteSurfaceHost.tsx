import React from 'react';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import styles from './shared-web-shell.module.css';

export type WebsiteSurfaceHostProps = Record<string, never>;

const websiteHighlights = [
  'واجهة عامة موحّدة تحت جذر ويب مركزي واحد.',
  'التوجيه والهوية البصرية والسطوح الأساسية مملوكة بالكامل لـ ui-kit.',
  'الموقع يبقى سطحًا رفيعًا يعلن الرسالة العامة ولا يعيد اختراع النظام البصري.',
] as const;

export function WebsiteSurfaceHost(_props: WebsiteSurfaceHostProps) {
  return (
    <WebPageFrame
      eyebrow="BThwani Website"
      title="Public web presence under one governed shell"
      description="The public website now consumes a centralized web root and shared shell language instead of carrying its own page-level styling system."
      centered
      maxWidth={860}
    >
      <WebSectionCard
        title="Shared baseline"
        description="Website routes remain thin while ui-kit owns the visual baseline and shared shell contract."
      >
        <div className={styles.stack}>
          {websiteHighlights.map((item) => (
            <p key={item} className={styles.mutedParagraph}>
              {item}
            </p>
          ))}
        </div>
      </WebSectionCard>
    </WebPageFrame>
  );
}

export default WebsiteSurfaceHost;
