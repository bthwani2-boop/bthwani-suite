'use client';

import React, { createContext, useContext, useId, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

type PortalFactory = (children: ReactNode, container: unknown) => ReactNode;

type BthPortalContextValue = {
  hostElement: unknown | null;
  isWeb: boolean;
};

const BthPortalContext = createContext<BthPortalContextValue>({
  hostElement: null,
  isWeb: Platform.OS === 'web'
});

let cachedPortalFactory: PortalFactory | null | undefined;

function resolvePortalFactory() {
  if (cachedPortalFactory !== undefined) {
    return cachedPortalFactory;
  }

  try {
    const reactDomModule = (new Function('return import("react-dom")')() as Promise<{ createPortal?: PortalFactory }>);
    cachedPortalFactory = null;
    void reactDomModule.then((module) => {
      cachedPortalFactory = module.createPortal ?? null;
    });
  } catch {
    cachedPortalFactory = null;
  }

  return cachedPortalFactory;
}

export function BthPortalHost({ children }: { children?: ReactNode }) {
  const [hostElement, setHostElement] = useState<unknown | null>(null);
  const hostId = useId().replace(/:/g, '-');
  const isWeb = Platform.OS === 'web';

  const contextValue = useMemo<BthPortalContextValue>(() => ({ hostElement, isWeb }), [hostElement, isWeb]);

  return (
    <BthPortalContext.Provider value={contextValue}>
      {children}
      {isWeb
        ? React.createElement('div', {
            id: `bth-portal-host-${hostId}`,
            ref: (node: unknown) => setHostElement(node),
            'data-bth-portal-host': 'true',
            style: {
              position: 'fixed',
              inset: 0,
              zIndex: 2147483000,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column'
            }
          })
        : null}
    </BthPortalContext.Provider>
  );
}

export type BthPortalLayerProps = {
  active?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
};

export function BthPortalLayer({ active = true, children, fallback = null }: BthPortalLayerProps) {
  const { hostElement, isWeb } = useContext(BthPortalContext);

  if (!active) {
    return null;
  }

  if (!isWeb) {
    return <>{fallback}</>;
  }

  const portalFactory = resolvePortalFactory();

  if (portalFactory && hostElement) {
    return <>{portalFactory(children, hostElement)}</>;
  }

  return <>{children}</>;
}