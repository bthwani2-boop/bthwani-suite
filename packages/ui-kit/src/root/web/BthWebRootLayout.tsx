// Web root layout: wraps app with all root providers and html/body logic
import { ReactNode } from 'react';
import { BthRootProviders, BthRootProvidersProps } from '../core/BthRootProviders';
import { BthWebDocumentShell } from './BthWebDocumentShell';
import { BthWebRootBody } from './BthWebRootBody';
import { buildWebRootMetadata } from './buildWebRootMetadata';

export interface BthWebRootLayoutProps extends BthRootProvidersProps {
  children: ReactNode;
  appName?: string;
}

export function BthWebRootLayout({ children, appName, ...rootProps }: BthWebRootLayoutProps) {
  const webRootMetadata = buildWebRootMetadata({
    appName,
    lang: rootProps.language,
    dir: rootProps.direction,
  });

  return (
    <BthWebDocumentShell lang={webRootMetadata.lang} dir={webRootMetadata.dir}>
      <BthWebRootBody appName={webRootMetadata.appName} themeMode={rootProps.themeMode}>
        <BthRootProviders {...rootProps}>{children}</BthRootProviders>
      </BthWebRootBody>
    </BthWebDocumentShell>
  );
}
