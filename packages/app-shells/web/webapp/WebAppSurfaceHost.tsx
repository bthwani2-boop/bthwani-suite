import React from 'react';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import styles from '../shared/shared-web-shell.module.css';

export type WebAppSurfaceHostProps = Record<string, never>;

const webAppOperatingPrinciples = [
  'Routes stay thin and delegate shared framing to ui-kit.',
  'Surface composition belongs here, but theme, spacing, and shell primitives do not.',
  'Future workflow screens can plug into this shell without rebuilding root behavior.',
] as const;

export function WebAppSurfaceHost(_props: WebAppSurfaceHostProps) {
  return (
    <WebPageFrame
      eyebrow="BThwani WebApp"
      title="Operational web surface with centralized UI authority"
      description="This shell is the sanctioned entrypoint for the application web surface. Shared styling decisions now stay inside ui-kit."
      centered
      maxWidth={900}
    >
      <WebSectionCard
        title="Operating model"
        description="Application-specific composition lives in surfaces while shared UI decisions stay upstream."
      >
        <div className={styles.stack}>
          {webAppOperatingPrinciples.map((item) => (
            <p key={item} className={styles.mutedParagraph}>
              {item}
            </p>
          ))}
        </div>
      </WebSectionCard>
    </WebPageFrame>
  );
}

export default WebAppSurfaceHost;