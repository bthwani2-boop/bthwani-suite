// Web root body wrapper for baseline styles
import type { ReactNode } from 'react';
import type { ThemeMode } from '../../foundation/themes';
import styles from './BthWebRootBody.module.css';

export function BthWebRootBody({
  children,
  appName,
  themeMode = 'light',
}: {
  children: ReactNode;
  appName?: string;
  themeMode?: ThemeMode;
}) {
  return (
    <body
      className={styles.body}
      data-bth-app={appName}
      data-bth-root="true"
      data-bth-theme={themeMode}
    >
      {children}
    </body>
  );
}
